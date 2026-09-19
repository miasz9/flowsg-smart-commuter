import { useState } from 'react'

import Map from '../components/Map'

import { getRoute } from '../services/routing'

import { getLtaAlerts, getLtaCrowding } from '../services/lta'

function Directions({
  routePreference = 'least-crowded',
  initialDestination = ''
}) {
  const [from, setFrom] = useState('')
  const [to, setTo] = useState(initialDestination)

  const [showRoutes, setShowRoutes] = useState(false)
  const [selectedRoute, setSelectedRoute] = useState(null)
  const [routes, setRoutes] = useState([])

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [arrivalTime, setArrivalTime] = useState('08:45')

  const [ltaAlerts, setLtaAlerts] = useState([])
  const [ltaCrowding, setLtaCrowding] = useState({})

  function swapLocations() {
    const oldFrom = from
    setFrom(to)
    setTo(oldFrom)
  }

  const lineMapping = {
    DT: 'DTL',
    NS: 'NSL',
    EW: 'EWL',
    CC: 'CCL',
    NE: 'NEL',
    TE: 'TEL'
  }

  async function findRoutes() {
    if (!from || !to) {
      setError('Please enter both starting point and destination.')
      return
    }

    setLoading(true)
    setError('')
    setShowRoutes(false)
    setSelectedRoute(null)

    try {
      const result = await getRoute(from, to, arrivalTime)

      const ltaResult = await getLtaAlerts()

      setLtaAlerts(ltaResult.value?.Message || [])

      const trainLines = [
        ...new Set(
          result.routes
            .flatMap((route) =>
              route.legs
                .filter((leg) => leg.mode === 'SUBWAY')
                .map((leg) => lineMapping[leg.routeShortName])
                .filter(Boolean)
            )
        )
      ]

      const crowdingResults = await Promise.all(
        trainLines.map(async (trainLine) => {
          const data = await getLtaCrowding(trainLine)

          return [trainLine, data.value || []]
        })
      )

      setLtaCrowding(Object.fromEntries(crowdingResults))

      setRoutes(result.routes)

      setSelectedRoute(result.routes[0]?.id || null)

      setShowRoutes(true)
    } catch (error) {
      console.error(error)

      setError('Could not find a route. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  function getRouteCrowding(route) {
    const crowdingLevels = route.legs
      .filter((leg) => leg.mode === 'SUBWAY')
      .map((leg) => lineMapping[leg.routeShortName])
      .filter(Boolean)
      .flatMap((line) => ltaCrowding[line] || [])
      .map((station) => station.CrowdLevel)
      .filter((level) => level && level !== 'NA')

    if (crowdingLevels.includes('h')) {
      return 'high'
    }

    if (crowdingLevels.includes('m')) {
      return 'moderate'
    }

    if (crowdingLevels.includes('l')) {
      return 'low'
    }

    return 'unknown'
  }

  function getRouteDisruption(route) {
    const routeServices = route.legs
      .filter((leg) => leg.mode !== 'WALK')
      .map((leg) => leg.routeShortName || leg.route)
      .filter(Boolean)

    return ltaAlerts.some((alert) =>
      routeServices.some((service) => {
        const escapedService = service.replace(
          /[.*+?^${}()|[\]\\]/g,
          '\\$&'
        )

        const pattern = new RegExp(
          `\\b${escapedService}\\b`,
          'i'
        )

        return pattern.test(alert.Content)
      })
    )
  }

  const routeCrowding = routes.map((route) =>
    getRouteCrowding(route)
  )

  const routeDisruptions = routes.map((route) =>
    getRouteDisruption(route)
  )

  const crowdingRank = {
    low: 1,
    moderate: 2,
    high: 3,
    unknown: 4
  }

  const routeScores = routes.map((route, index) => {
    if (routePreference === 'fastest') {
      return route.durationMinutes ?? route.duration ?? Infinity
    }

    if (routePreference === 'accessible') {
      return (
        (route.walkingDistance ?? route.walkDistance ?? Infinity) +
        (route.transfers || 0) * 500
      )
    }

    if (routePreference === 'sheltered') {
      return route.walkingDistance ?? route.walkDistance ?? Infinity
    }

    return crowdingRank[routeCrowding[index]]
  })

  const recommendedRouteIndex = routes.reduce(
    (bestIndex, route, index) => {
      const bestHasDisruption =
        routeDisruptions[bestIndex]

      const currentHasDisruption =
        routeDisruptions[index]

      if (
        bestHasDisruption !== currentHasDisruption
      ) {
        return currentHasDisruption
          ? bestIndex
          : index
      }

      return routeScores[index] <
        routeScores[bestIndex]
        ? index
        : bestIndex
    },
    0
  )

  function getPreferenceLabel() {
    if (routePreference === 'fastest') {
      return 'Fastest route'
    }

    if (routePreference === 'accessible') {
      return 'Most accessible route'
    }

    if (routePreference === 'sheltered') {
      return 'Most sheltered route'
    }

    return 'Lowest detected line crowding'
  }

  return (
    <div className="directions-page page-content">
      <header className="simple-header">
        <div className="brand-title">FlowSG</div>
      </header>

      <section className="directions-content">
        <h2>Plan your journey</h2>

        <p>
          Find a route that fits your time and travel
          preferences.
        </p>

        <div className="location-input">
          <label>From</label>

          <input
            type="text"
            value={from}
            onChange={(event) =>
              setFrom(event.target.value)
            }
            placeholder="e.g. Tampines"
          />
        </div>

        <button
          className="swap-button"
          onClick={swapLocations}
        >
          ↕ Swap locations
        </button>

        <div className="location-input">
          <label>To</label>

          <input
            type="text"
            value={to}
            onChange={(event) =>
              setTo(event.target.value)
            }
            placeholder="e.g. Raffles Place"
          />
        </div>

        <div className="arrival-option">
          <label>Arrival time</label>

          <select
            value={arrivalTime}
            onChange={(event) =>
              setArrivalTime(event.target.value)
            }
          >
            <option value="08:45">
              Arrive by 8:45 AM
            </option>

            <option value="09:00">
              Arrive by 9:00 AM
            </option>

            <option value="09:15">
              Arrive by 9:15 AM
            </option>
          </select>
        </div>

        <button
          className="find-route-button"
          onClick={findRoutes}
          disabled={loading}
        >
          {loading
            ? 'Finding routes...'
            : 'Find Routes'}
        </button>

        {error && (
          <p className="route-error">
            {error}
          </p>
        )}

        {showRoutes && (
          <>
            <section className="route-results">
              <h2>Route options</h2>

              <div className="demo-label">
                Live LTA service alerts and crowd data
              </div>

              <div className="preference-display">
                🧭 Preference:{' '}
                <strong>
                  {getPreferenceLabel()}
                </strong>
              </div>

              {routes.map((route, index) => {
                const crowding =
                  routeCrowding[index]

                const disruption =
                  ltaAlerts.find((alert) => {
                    const routeServices =
                      route.legs
                        .filter(
                          (leg) =>
                            leg.mode !== 'WALK'
                        )
                        .map(
                          (leg) =>
                            leg.routeShortName ||
                            leg.route
                        )
                        .filter(Boolean)

                    return routeServices.some(
                      (service) => {
                        const escapedService =
                          service.replace(
                            /[.*+?^${}()|[\]\\]/g,
                            '\\$&'
                          )

                        const pattern =
                          new RegExp(
                            `\\b${escapedService}\\b`,
                            'i'
                          )

                        return pattern.test(
                          alert.Content
                        )
                      }
                    )
                  })

                const disruptionText =
                  disruption?.Content || null

                const isRecommended =
                  index ===
                  recommendedRouteIndex

                const rewardPoints =
                  isRecommended
                    ? crowding === 'low'
                      ? 20
                      : crowding === 'moderate'
                        ? 10
                        : 5
                    : 0

                return (
                  <div
                    key={route.id}
                    className={`route-card ${
                      selectedRoute === route.id
                        ? 'selected'
                        : ''
                    }`}
                    onClick={() =>
                      setSelectedRoute(route.id)
                    }
                  >
                    <div className="route-status">
                      {crowding === 'high' ? (
                        <span className="status-warning">
                          🔴 High line crowding
                        </span>
                      ) : crowding ===
                        'moderate' ? (
                        <span className="status-warning">
                          ⚠️ Moderate line crowding
                        </span>
                      ) : crowding === 'low' ? (
                        <span className="status-good">
                          🟢 Low line crowding
                        </span>
                      ) : (
                        <span>
                          ⚪ Crowd data unavailable
                        </span>
                      )}
                    </div>

                    {disruptionText && (
                      <div className="route-disruption">
                        ⚠️ {disruptionText}
                      </div>
                    )}

                    <div className="route-header">
                      <strong>
                        {index === 0
                          ? 'Route 1'
                          : `Alternative ${index}`}
                      </strong>

                      {isRecommended ? (
                        <span className="recommended-badge">
                          Recommended
                        </span>
                      ) : (
                        <span>
                          {route.transfers === 0
                            ? 'No transfers'
                            : `${route.transfers} transfer${
                                route.transfers > 1
                                  ? 's'
                                  : ''
                              }`}
                        </span>
                      )}
                    </div>

                    {isRecommended && (
                      <p className="route-reason">
                        ✓ {getPreferenceLabel()}
                        {!disruptionText &&
                          ' • No detected service alert'}
                      </p>
                    )}

                    {rewardPoints > 0 && (
                      <div className="route-reward">
                        🪙 +{rewardPoints} FlowSG points
                      </div>
                    )}

                    <p>
                      🚇{' '}
                      {route.legs
                        .filter(
                          (leg) =>
                            leg.mode !== 'WALK'
                        )
                        .map(
                          (leg) =>
                            leg.routeShortName ||
                            leg.route
                        )
                        .filter(Boolean)
                        .join(' + ') ||
                        'Public transport'}
                    </p>

                    <p className="route-time">
                      🕐{' '}
                      {new Date(
                        route.startTime
                      ).toLocaleTimeString([], {
                        hour: 'numeric',
                        minute: '2-digit'
                      })}
                      {' → '}
                      {new Date(
                        route.endTime
                      ).toLocaleTimeString([], {
                        hour: 'numeric',
                        minute: '2-digit'
                      })}
                    </p>

                    <div className="route-info">
                      <div>
                        <strong>
                          {route.durationMinutes} min
                        </strong>

                        <small>
                          Travel time
                        </small>
                      </div>

                      <div>
                        <strong>
                          {route.walkingDistance} m
                        </strong>

                        <small>
                          Walking
                        </small>
                      </div>

                      <div>
                        <strong>
                          ${route.fare}
                        </strong>

                        <small>
                          Fare
                        </small>
                      </div>
                    </div>

                    <p className="route-benefit">
                      ✓{' '}
                      {route.transfers === 0
                        ? 'Direct journey'
                        : `${route.transfers} transfer${
                            route.transfers > 1
                              ? 's'
                              : ''
                          }`}
                    </p>
                  </div>
                )
              })}

              {selectedRoute && (
                <div className="selected-route">
                  <strong>
                    ✓ Route {selectedRoute} selected
                  </strong>

                  {(() => {
                    const route =
                      routes.find(
                        (route) =>
                          route.id ===
                          selectedRoute
                      )

                    if (!route) return null

                    return (
                      <div className="journey-breakdown">
                        <p>
                          🚶 Walking:{' '}
                          {route.walkingMinutes}{' '}
                          min
                        </p>

                        <p>
                          🚇 Public transport:{' '}
                          {route.transitMinutes}{' '}
                          min
                        </p>

                        <p>
                          ⏳ Waiting:{' '}
                          {route.waitingMinutes}{' '}
                          min
                        </p>

                        <p>
                          🔄 Transfers:{' '}
                          {route.transfers}
                        </p>

                        <p>
                          💰 Fare: ${route.fare}
                        </p>
                      </div>
                    )
                  })()}
                </div>
              )}
            </section>

            <section className="directions-map">
              <h2>Route map</h2>

              <div
                style={{
                  height: '350px',
                  width: '100%'
                }}
              >
                <Map
                  mapId="directions-map"
                  selectedRoute={selectedRoute}
                  routeData={routes.find(
                    (route) =>
                      route.id === selectedRoute
                  )}
                />
              </div>
            </section>
          </>
        )}
      </section>
    </div>
  )
}

export default Directions