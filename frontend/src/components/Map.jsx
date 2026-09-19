import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap
} from 'react-leaflet'

function decodePolyline(encoded) {
  let index = 0
  let lat = 0
  let lng = 0
  const coordinates = []

  while (index < encoded.length) {
    let shift = 0
    let result = 0
    let byte

    do {
      byte = encoded.charCodeAt(index++) - 63
      result |= (byte & 0x1f) << shift
      shift += 5
    } while (byte >= 0x20)

    const deltaLat =
      result & 1 ? ~(result >> 1) : result >> 1

    lat += deltaLat

    shift = 0
    result = 0

    do {
      byte = encoded.charCodeAt(index++) - 63
      result |= (byte & 0x1f) << shift
      shift += 5
    } while (byte >= 0x20)

    const deltaLng =
      result & 1 ? ~(result >> 1) : result >> 1

    lng += deltaLng

    coordinates.push([
      lat / 100000,
      lng / 100000
    ])
  }

  return coordinates
}

function FitRoute({ routeData }) {
  const map = useMap()

  if (routeData) {
    const coordinates = []

    routeData.legs.forEach((leg) => {
      if (leg.geometry) {
        const decoded = decodePolyline(leg.geometry)
        coordinates.push(...decoded)
      }
    })

    if (coordinates.length > 0) {
      map.fitBounds(coordinates, {
        padding: [30, 30]
      })
    }
  }

  return null
}

function Map({
  mapId = 'default-map',
  selectedRoute = null,
  routeData = null
}) {
  const tampines = [1.3547, 103.9437]
  const rafflesPlace = [1.2834, 103.8515]

  // Simulated route coordinates for demonstration only
  const usualRoute = [
    [1.3547, 103.9437],
    [1.335, 103.93],
    [1.31, 103.9],
    [1.2834, 103.8515]
  ]

  const alternativeRoute = [
    [1.3547, 103.9437],
    [1.34, 103.96],
    [1.30, 103.92],
    [1.2834, 103.8515]
  ]

  let realRoute = []

  if (routeData) {
    routeData.legs.forEach((leg) => {
      if (leg.geometry) {
        const decoded = decodePolyline(leg.geometry)
        realRoute = [...realRoute, ...decoded]
      }
    })
  }

  return (
    <MapContainer
      key={mapId}
      center={[1.32, 103.90]}
      zoom={12}
      style={{
        height: '350px',
        width: '100%'
      }}
    >

      <FitRoute routeData={routeData} />
      
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Marker position={tampines}>
        <Popup>
          Origin: Tampines
        </Popup>
      </Marker>

      <Marker position={rafflesPlace}>
        <Popup>
          Destination: Raffles Place
        </Popup>
      </Marker>

      {routeData && (
        <>
          {routeData.legs.map((leg, index) => {
            if (!leg.geometry) {
              return null
            }

            const legCoordinates = decodePolyline(leg.geometry)

            let lineColor = 'blue'
            let lineWeight = 5
            let dashArray = null

            if (leg.mode === 'WALK') {
              lineColor = 'gray'
              lineWeight = 4
              dashArray = '6 8'
            } else if (leg.mode === 'BUS') {
              lineColor = 'orange'
              lineWeight = 5
            } else if (leg.mode === 'SUBWAY') {
              lineColor = 'blue'
              lineWeight = 6
            }

            return (
              <Polyline
                key={index}
                positions={legCoordinates}
                pathOptions={{
                  color: lineColor,
                  weight: lineWeight,
                  dashArray
                }}
              />
            )
          })}
        </>
      )}

    </MapContainer>
  )
}

export default Map