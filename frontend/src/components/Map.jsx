import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline
} from 'react-leaflet'

function Map({ mapId = 'default-map', selectedRoute = null }) {
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

      {selectedRoute && (
        <>
          <Polyline
            positions={usualRoute}
            pathOptions={{
              color: selectedRoute === 'usual' ? 'blue' : 'gray',
              weight: selectedRoute === 'usual' ? 6 : 3
            }}
          />

          <Polyline
            positions={alternativeRoute}
            pathOptions={{
              color: selectedRoute === 'alternative' ? 'green' : 'gray',
              weight: selectedRoute === 'alternative' ? 6 : 3,
              dashArray: '8 8'
            }}
          />
        </>
      )}

    </MapContainer>
  )
}

export default Map