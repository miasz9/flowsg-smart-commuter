import { useState } from 'react'
import Map from '../components/Map'

function Directions() {
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [showRoutes, setShowRoutes] = useState(false)
  const [selectedRoute, setSelectedRoute] = useState(null)

  function swapLocations() {
    const oldFrom = from
    setFrom(to)
    setTo(oldFrom)
  }

  function findRoutes() {
    setShowRoutes(true)
  }

  return (
    <div className="directions-page">

      <header className="header">
        <div className="logo">FlowSG</div>
      </header>

      <section className="directions-content">

        <h2>Plan your journey</h2>
        <p>Find a route that fits your time and travel preferences.</p>

        <div className="location-input">
          <label>From</label>
          <input
            type="text"
            value={from}
            onChange={(event) => setFrom(event.target.value)}
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
            onChange={(event) => setTo(event.target.value)}
            placeholder="e.g. Raffles Place"
          />
        </div>

        <div className="arrival-option">
          <label>Arrival time</label>

          <select defaultValue="08:45">
            <option value="08:45">Arrive by 8:45 AM</option>
            <option value="09:00">Arrive by 9:00 AM</option>
            <option value="09:15">Arrive by 9:15 AM</option>
          </select>
        </div>

        <button
          className="find-route-button"
          onClick={findRoutes}
        >
          Find Routes
        </button>

        {showRoutes && (
          <>
            <section className="route-results">

              <h2>Route options</h2>

              <p className="demo-label">
                Demo data — transport conditions are simulated
              </p>

              <div
                className={`route-card ${selectedRoute === 'usual' ? 'selected' : ''}`}
                onClick={() => setSelectedRoute('usual')}
              >
                <div className="route-header">
                  <strong>Usual Route</strong>
                  <span>Recommended</span>
                </div>

                <p>🚇 MRT</p>

                <div className="route-info">
                  <div>
                    <strong>42 min</strong>
                    <small>Travel time</small>
                  </div>

                  <div>
                    <strong>High</strong>
                    <small>Crowding</small>
                  </div>
                </div>

                <p className="route-warning">
                  ⚠️ Possible disruption on route
                </p>
              </div>

              <div
                className={`route-card ${selectedRoute === 'alternative' ? 'selected' : ''}`}
                onClick={() => setSelectedRoute('alternative')}
              >
                <div className="route-header">
                  <strong>Alternative Route</strong>
                  <span>+20 points</span>
                </div>

                <p>🚇 MRT + 🚌 Bus</p>

                <div className="route-info">
                  <div>
                    <strong>47 min</strong>
                    <small>Travel time</small>
                  </div>

                  <div>
                    <strong>Moderate</strong>
                    <small>Crowding</small>
                  </div>
                </div>

                <p className="route-benefit">
                  ✓ Less crowded
                </p>
              </div>

              {selectedRoute && (
                <p className="selected-route">
                  ✓ {selectedRoute === 'usual'
                    ? 'Usual Route selected'
                    : 'Alternative Route selected'}
                </p>
              )}

            </section>

            {/* TEST MAP */}
            <section className="directions-map">
              <h2>Test map</h2>

              <div style={{ height: '350px', width: '100%' }}>
                <Map
                  mapId="directions-map"
                  selectedRoute={selectedRoute}
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