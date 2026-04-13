const BASE_URL = import.meta.env.VITE_API_URL

// --- Token ---

export function saveToken(token) {
  localStorage.setItem('token', token)
}

export function getToken() {
  return localStorage.getItem('token')
}

export function clearToken() {
  localStorage.removeItem('token')
}

export function isAuthenticated() {
  return !!getToken()
}

// --- Headers ---

export function getAuthHeaders() {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getToken()}`,
  }
}

export function getPublicHeaders() {
  return {
    'Content-Type': 'application/json',
  }
}

// --- BASE URL ---

export { BASE_URL }
