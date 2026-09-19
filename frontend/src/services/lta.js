export async function getLtaAlerts() {
  const response = await fetch(
    'http://localhost:3000/api/lta-alerts'
  )

  if (!response.ok) {
    throw new Error('Failed to get LTA alerts')
  }

  return response.json()
}

export async function getLtaCrowding(trainLine) {
  const response = await fetch(
    `http://localhost:3000/api/lta-crowding?trainLine=${encodeURIComponent(trainLine)}`
  )

  if (!response.ok) {
    throw new Error('Failed to get LTA crowding')
  }

  return response.json()
}