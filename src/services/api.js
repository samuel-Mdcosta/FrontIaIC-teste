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
  localStorage.removeItem('role')
}

export function saveRole(role) {
  if (role) localStorage.setItem('role', role)
}

export function getRole() {
  return localStorage.getItem('role')
}

export function isAdmin() {
  return getRole() === 'admin'
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

// --- Admin ---
// Rotas ainda não implementadas no backend. Esperado quando prontas:
//
// GET  /api/admin/alunos
// Response: { message, dado: [{ id, nome, email, foto,
//              sessoes_chat, tempo_total_chat,
//              tentativas_quiz, acertos_quiz, erros_quiz, taxa_acerto,
//              ultimo_acesso }] }
//
// Backend precisará ter campo `role` em usuarios para controle de acesso.

export async function listarAlunos() {
  const res = await fetch(`${BASE_URL}/api/admin/alunos`, {
    headers: getAuthHeaders(),
  })
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.message || `Erro ao buscar alunos: ${res.status}`)
  }
  const data = await res.json()
  return Array.isArray(data.dado) ? data.dado : data
}

// --- BASE URL ---

export { BASE_URL }
