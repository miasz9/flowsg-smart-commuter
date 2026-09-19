export async function getRoute(start, end, arrivalTime) {
  const response = await fetch(
    `http://localhost:3000/api/route?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}&arrivalTime=${encodeURIComponent(arrivalTime)}`
  )

  if (!response.ok) {
    throw new Error('Failed to get route')
  }

  return response.json()
}