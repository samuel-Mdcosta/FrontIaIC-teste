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
    'Accept': 'application/json',
    'Authorization': `Bearer ${getToken()}`,
  }
}

export function getPublicHeaders() {
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
}

// --- Redefinição de Senha ---

export async function verificarEmailRedef(email) {
  const res = await fetch(`${BASE_URL}/api/users/verificarEmail`, {
    method: 'POST',
    headers: getPublicHeaders(),
    body: JSON.stringify({ email }),
  })
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.message || 'E-mail não encontrado.')
  }
  return res.json()
}

export async function redefinirSenha(email, senha, senha_confirmation) {
  const res = await fetch(`${BASE_URL}/api/users/redefinirSenha`, {
    method: 'POST',
    headers: getPublicHeaders(),
    body: JSON.stringify({ email, senha, senha_confirmation }),
  })
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.message || 'Erro ao redefinir senha.')
  }
  return res.json()
}

// --- BASE URL ---

export { BASE_URL }
