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

// --- Perfil ---
// POST /api/users/atualizarPerfil
// Body: { nome?, foto? }  (foto = data URL base64 ou null para remover)
// Response: { message, usuario: { id, nome, email, foto, role } }

export async function atualizarPerfil({ nome, foto } = {}) {
  const body = {}
  if (nome !== undefined) body.nome = nome
  if (foto !== undefined) body.foto = foto

  const res = await fetch(`${BASE_URL}/api/users/atualizarPerfil`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.message || `Erro ao atualizar perfil: ${res.status}`)
  }
  const data = await res.json()
  return data.usuario ?? data
}

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

export async function listarTemasAluno(alunoId) {
  const res = await fetch(`${BASE_URL}/api/admin/alunos/${alunoId}/temas`, {
    headers: getAuthHeaders(),
  })
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.message || `Erro ao buscar temas do aluno: ${res.status}`)
  }
  const data = await res.json()
  return Array.isArray(data.dado) ? data.dado : data
}

// --- Desempenho do aluno ---
// GET /api/users/login/desempenho
// Response: { questoes_respondidas, taxa_acerto, tentativas, desempenho_por_tema: [...], temas_nao_praticados: [...] }

export async function buscarDesempenho() {
  const res = await fetch(`${BASE_URL}/api/users/login/desempenho`, {
    headers: getAuthHeaders(),
  })
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.message || `Erro ao buscar desempenho: ${res.status}`)
  }
  return res.json()
}

// GET /api/users/login/desempenho/feedback
// Response: { status: "ok" | "sem_dados", feedback: { resumo_geral, areas_prioritarias, pontos_fortes, proximos_passos } | null,
//             total_tentativas, gerado_em, em_cache }

export async function buscarFeedbackDesempenho() {
  const res = await fetch(`${BASE_URL}/api/users/login/desempenho/feedback`, {
    headers: getAuthHeaders(),
  })
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.message || `Erro ao gerar feedback de desempenho: ${res.status}`)
  }
  return res.json()
}

export { BASE_URL }
