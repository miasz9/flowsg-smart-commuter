require('dotenv').config()

const express = require('express')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.json({
    message: 'FlowSG backend is running'
  })
})

app.get('/api/test-onemap', async (req, res) => {
  try {
    const response = await fetch(
      'https://www.onemap.gov.sg/api/auth/post/getToken',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: process.env.ONEMAP_API_EMAIL,
          password: process.env.ONEMAP_API_PASSWORD
        })
      }
    )

    const data = await response.json()

    if (!response.ok) {
      return res.status(response.status).json({
        message: 'OneMap authentication failed',
        details: data
      })
    }

    res.json({
      message: 'OneMap authentication successful',
      expiry_timestamp: data.expiry_timestamp
    })

  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Server error while connecting to OneMap'
    })
  }
})

const PORT = 3000

app.get('/api/lta-alerts', async (req, res) => {
  try {
    console.log(
        'LTA key loaded:',
        Boolean(process.env.LTA_ACCOUNT_KEY)
    )

    const response = await fetch(
        'https://datamall2.mytransport.sg/ltaodataservice/TrainServiceAlerts',
        {
            headers: {
            AccountKey: process.env.LTA_ACCOUNT_KEY.trim(),
            accept: 'application/json'
            }
        }
        )

        const responseText = await response.text()

        console.log('LTA status:', response.status)
        console.log('LTA response:', responseText)

        let data

        try {
        data = JSON.parse(responseText)
        } catch {
        data = {
            message: responseText
        }
    }

    if (!response.ok) {
      return res.status(response.status).json(data)
    }

    res.json(data)
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Could not fetch LTA train service alerts'
    })
  }
})

app.get('/api/lta-crowding', async (req, res) => {
  try {
    const { trainLine } = req.query

    if (!trainLine) {
      return res.status(400).json({
        message: 'Please provide a train line'
      })
    }

    const response = await fetch(
      `https://datamall2.mytransport.sg/ltaodataservice/PCDRealTime?TrainLine=${encodeURIComponent(trainLine)}`,
      {
        headers: {
          AccountKey: process.env.LTA_ACCOUNT_KEY.trim(),
          accept: 'application/json'
        }
      }
    )

    const responseText = await response.text()

    console.log('LTA crowding status:', response.status)

    if (!response.ok) {
      return res.status(response.status).json({
        message: responseText
      })
    }

    const data = JSON.parse(responseText)

    res.json(data)
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Could not fetch LTA crowding data'
    })
  }
})

function subtractMinutes(timeString, minutes) {
  const [hours, mins] = timeString.split(':').map(Number)

  const date = new Date()
  date.setHours(hours, mins, 0, 0)

  date.setMinutes(date.getMinutes() - minutes)

  return date.toTimeString().slice(0, 8)
}

function getMinutesFromSeconds(seconds) {
  return Math.ceil(seconds / 60)
}

function getTodayForOneMap() {
  const now = new Date()

  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const year = now.getFullYear()

  return `${month}-${day}-${year}`
}

async function searchOneMap(query, token) {
  const searchResponse = await fetch(
    `https://www.onemap.gov.sg/api/common/elastic/search?searchVal=${encodeURIComponent(query)}&returnGeom=Y&getAddrDetails=Y`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )

  const searchData = await searchResponse.json()

  if (!searchResponse.ok) {
    throw new Error('OneMap search failed')
  }

  if (!searchData.results || searchData.results.length === 0) {
    throw new Error(`No location found for "${query}"`)
  }

  const result = searchData.results[0]

  return {
    name: result.SEARCHVAL,
    latitude: Number(result.LATITUDE),
    longitude: Number(result.LONGITUDE),
    address: result.ADDRESS
  }
}

app.get('/api/search', async (req, res) => {
  try {
    const { query } = req.query

    if (!query) {
      return res.status(400).json({
        message: 'Please provide a search query'
      })
    }

    // Get OneMap token
    const tokenResponse = await fetch(
      'https://www.onemap.gov.sg/api/auth/post/getToken',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: process.env.ONEMAP_API_EMAIL,
          password: process.env.ONEMAP_API_PASSWORD
        })
      }
    )

    const tokenData = await tokenResponse.json()

    if (!tokenResponse.ok) {
      return res.status(500).json({
        message: 'Could not authenticate with OneMap'
      })
    }

    // Search OneMap
    const searchResponse = await fetch(
      `https://www.onemap.gov.sg/api/common/elastic/search?searchVal=${encodeURIComponent(query)}&returnGeom=Y&getAddrDetails=Y`,
      {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`
        }
      }
    )

    const searchData = await searchResponse.json()

    if (!searchResponse.ok) {
      return res.status(searchResponse.status).json({
        message: 'OneMap search failed',
        details: searchData
      })
    }

    res.json(searchData)

  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Server error while searching OneMap'
    })
  }
})

app.get('/api/route', async (req, res) => {
  try {
    const { start, end, arrivalTime } = req.query

    if (!start || !end || !arrivalTime) {
      return res.status(400).json({
        message: 'Please provide start, end and arrival time'
      })
    }

    const estimatedDepartureTime =
      subtractMinutes(arrivalTime, 45)

    const routeDate = getTodayForOneMap()

    console.log('Arrival time:', arrivalTime)
    console.log(
      'Estimated departure time:',
      estimatedDepartureTime
    )

    // Get OneMap token
    const tokenResponse = await fetch(
      'https://www.onemap.gov.sg/api/auth/post/getToken',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: process.env.ONEMAP_API_EMAIL,
          password: process.env.ONEMAP_API_PASSWORD
        })
      }
    )

    const tokenData = await tokenResponse.json()

    if (!tokenResponse.ok) {
      return res.status(500).json({
        message: 'Could not authenticate with OneMap'
      })
    }

    // Search for starting point
    const startLocation = await searchOneMap(
      start,
      tokenData.access_token
    )

    // Search for destination
    const endLocation = await searchOneMap(
      end,
      tokenData.access_token
    )

    const startCoordinates =
      `${startLocation.latitude},${startLocation.longitude}`

    const endCoordinates =
      `${endLocation.latitude},${endLocation.longitude}`

    // Helper for OneMap routing URL
    const routeUrl = (departureTime) =>
      `https://www.onemap.gov.sg/api/public/routingsvc/route?start=${encodeURIComponent(startCoordinates)}&end=${encodeURIComponent(endCoordinates)}&routeType=pt&date=${routeDate}&time=${encodeURIComponent(departureTime)}&mode=transit&numItineraries=3`

    // --------------------------------------------------
    // FIRST REQUEST
    // --------------------------------------------------

    const firstRouteResponse = await fetch(
      routeUrl(estimatedDepartureTime),
      {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`
        }
      }
    )

    const firstRouteData =
      await firstRouteResponse.json()

    if (!firstRouteResponse.ok) {
      return res.status(firstRouteResponse.status).json({
        message: 'OneMap routing request failed',
        details: firstRouteData
      })
    }

    const firstItineraries =
      firstRouteData.plan?.itineraries || []

    const firstItinerary = firstItineraries[0]

    if (!firstItinerary) {
      return res.status(404).json({
        message: 'No route found'
      })
    }

    // Calculate actual duration
    const actualDurationMinutes =
      getMinutesFromSeconds(firstItinerary.duration)

    const improvedDepartureTime =
      subtractMinutes(
        arrivalTime,
        actualDurationMinutes
      )

    console.log(
      'Actual route duration:',
      actualDurationMinutes,
      'minutes'
    )

    console.log(
      'Improved departure time:',
      improvedDepartureTime
    )

    // --------------------------------------------------
    // SECOND REQUEST
    // --------------------------------------------------

    const routeResponse = await fetch(
      routeUrl(improvedDepartureTime),
      {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`
        }
      }
    )

    const routeData =
      await routeResponse.json()

    console.log(
        'Final route start time:',
        new Date(
            routeData.plan?.itineraries?.[0]?.startTime
        ).toLocaleTimeString()
        )

        console.log(
        'Final route end time:',
        new Date(
            routeData.plan?.itineraries?.[0]?.endTime
        ).toLocaleTimeString()
        )

    if (!routeResponse.ok) {
      return res.status(routeResponse.status).json({
        message: 'OneMap routing request failed',
        details: routeData
      })
    }

    // --------------------------------------------------
    // FORMAT ROUTES FOR FRONTEND
    // --------------------------------------------------

    const itineraries =
      routeData.plan?.itineraries || []

    const routes = itineraries.map(
      (itinerary, index) => {
        return {
          id: index + 1,
          durationMinutes:
            Math.round(itinerary.duration / 60),

          walkingMinutes:
            Math.round(itinerary.walkTime / 60),

          walkingDistance:
            Math.round(itinerary.walkDistance),

          transitMinutes:
            Math.round(itinerary.transitTime / 60),

          waitingMinutes:
            Math.round(itinerary.waitingTime / 60),

          transfers:
            itinerary.transfers,

          fare:
            itinerary.fare,

          startTime:
            itinerary.startTime,

          endTime:
            itinerary.endTime,

          legs: itinerary.legs.map((leg) => ({
            mode: leg.mode,
            route: leg.route,
            routeShortName:
              leg.routeShortName,

            routeLongName:
              leg.routeLongName,

            from:
              leg.from?.name,

            to:
              leg.to?.name,

            distance:
              Math.round(leg.distance),

            durationMinutes:
              Math.round(leg.duration / 60),

            geometry:
              leg.legGeometry?.points || null
          }))
        }
      }
    )

    res.json({
      from: routeData.plan?.from,
      to: routeData.plan?.to,
      routes
    })

  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Server error while getting route'
    })
  }
})

app.listen(PORT, () => {
  console.log(`FlowSG backend running on http://localhost:${PORT}`)
})