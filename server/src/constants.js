export const CATEGORIES = ['Nature', 'Religious', 'Dining', 'Heritage', 'Recreation', 'Eco-Tourism']

// Ganemulla town centre (FR-008)
export const ORIGIN = { latitude: 7.0682842, longitude: 79.9613944 }
export const MAX_RADIUS_KM = 25

export function haversineKm(a, b) {
  const R = 6371
  const rad = (d) => (d * Math.PI) / 180
  const dLat = rad(b.latitude - a.latitude)
  const dLon = rad(b.longitude - a.longitude)
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(a.latitude)) * Math.cos(rad(b.latitude)) * Math.sin(dLon / 2) ** 2
  return Math.round(2 * R * Math.asin(Math.sqrt(h)) * 10) / 10
}
