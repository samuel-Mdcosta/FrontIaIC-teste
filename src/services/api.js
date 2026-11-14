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

// --- Quiz (banco de questões) ---
// POST /api/users/login/tentativas/perguntas   Body: { tema, modo }
// O backend sorteia as questões e NÃO envia o gabarito.
// Response: { quiz_id, tema, modo, aviso, questoes: [{ id, dificuldade, pergunta, opcoes, subtema, referencias }] }

export async function iniciarQuiz(tema, modo) {
  const res = await fetch(`${BASE_URL}/api/users/login/tentativas/perguntas`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ tema, modo }),
  })
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.message || `Erro ao buscar as questões: ${res.status}`)
  }
  return res.json()
}

// POST /api/users/login/quiz/:quizId/responder   Body: { questao_id, indice }
// Registra a resposta INICIAL (a primeira é a que vale) e só depois devolve o feedback, se o quiz for "com_feedback".
// Ao registrar a última, o backend conclui o quiz e salva a tentativa (quiz_finalizado: true).
// Response: { registrada, ja_respondida, resposta_inicial, quiz_finalizado,
//             feedback?: { correta, escolhida, acertou, explicacao, explicacoes_alternativas: [{ indice, letra, explicacao }], fontes } }

export async function responderQuestao(quizId, questaoId, indice) {
  const res = await fetch(`${BASE_URL}/api/users/login/quiz/${quizId}/responder`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ questao_id: questaoId, indice }),
  })
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.message || `Erro ao registrar a resposta: ${res.status}`)
  }
  return res.json()
}

// GET /api/users/login/quiz/:quizId/gabarito
// Gabarito com as justificativas, só das questões que o aluno já respondeu.
// Response: { quiz_id, tema, modo, finalizado, pendentes,
//             questoes: [{ ordem, id, correta, escolhida, acertou, explicacao, explicacoes_alternativas, fontes }] }

export async function buscarGabarito(quizId) {
  const res = await fetch(`${BASE_URL}/api/users/login/quiz/${quizId}/gabarito`, {
    headers: getAuthHeaders(),
  })
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.message || `Erro ao buscar o gabarito: ${res.status}`)
  }
  return res.json()
}

// --- Avaliação de satisfação do quiz ---
// Obrigatória ao concluir o quiz: o resultado e a análise do tutor só são liberados depois dela.
// GET /api/users/login/avaliacao/questionario
// Response: { versao, escala: { min, max, rotulo_min, rotulo_max }, perguntas: [{ chave, texto }], comentario: { texto, max } }

export async function buscarQuestionarioAvaliacao() {
  const res = await fetch(`${BASE_URL}/api/users/login/avaliacao/questionario`, {
    headers: getAuthHeaders(),
  })
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.message || `Erro ao carregar a avaliação: ${res.status}`)
  }
  return res.json()
}

// POST /api/users/login/quiz/:quizId/avaliacao   Body: { notas: { [chave]: 0 a 5 }, comentario? }
// A primeira avaliação é a que vale. Response: { registrada, ja_avaliado }

export async function enviarAvaliacaoQuiz(quizId, notas, comentario) {
  const res = await fetch(`${BASE_URL}/api/users/login/quiz/${quizId}/avaliacao`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ notas, comentario: comentario?.trim() || null }),
  })
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.message || `Erro ao enviar a avaliação: ${res.status}`)
  }
  return res.json()
}

export { BASE_URL }
