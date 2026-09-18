import {
  MapContainer,
  TileLayer,
  Marker,
  Popup
} from 'react-leaflet'

function Map() {
  const tampines = [1.3547, 103.9437]
  const rafflesPlace = [1.2834, 103.8515]

  return (
    <MapContainer
      center={[1.32, 103.90]}
      zoom={12}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
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
    </MapContainer>
  )
}

export default Map