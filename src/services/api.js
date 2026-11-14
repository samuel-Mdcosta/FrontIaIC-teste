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

// Baixa um CSV do painel do professor (rota protegida: precisa do token, então não dá para ser um <a href> simples).
// nome: "telemetria" ou "feedback".
export async function baixarCsvAdmin(nome) {
  const res = await fetch(`${BASE_URL}/api/admin/exportar/${nome}.csv`, {
    headers: { ...getAuthHeaders(), Accept: 'text/csv' },
  })
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.message || `Erro ao baixar o CSV: ${res.status}`)
  }
  const blob = await res.blob()
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${nome}.csv`
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
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
// Devolve o feedback MAIS RECENTE do aluno (guardado: recarregar a página não gera outro) e o andamento de um pedido.
// Response: { status: "ok" | "preparando" | "sem_analise" | "sem_dados" | "avaliacao_pendente",
//             feedback: { resumo_geral, areas_prioritarias, pontos_fortes, proximos_passos } | null,
//             gerado_em, total_tentativas, em_cache,
//             pendente: boolean              (há um feedback a caminho: consultar de novo em alguns segundos),
//             nova_tentativa_em_s: number | null  (o pedido não pôde ser gerado agora e será tentado de novo),
//             pode_gerar: boolean            (o botão "Gerar feedback" vale agora),
//             ha_novidade: boolean           (o aluno concluiu baterias que o último feedback ainda não considerou),
//             limite_dia, restantes_hoje,
//             avaliacao?: { quiz_id, tema, finalizado_em }   (só em "avaliacao_pendente") }

export async function buscarFeedbackDesempenho() {
  const res = await fetch(`${BASE_URL}/api/users/login/desempenho/feedback`, {
    headers: getAuthHeaders(),
  })
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.message || `Erro ao buscar feedback de desempenho: ${res.status}`)
  }
  return res.json()
}

// POST /api/users/login/desempenho/feedback   (botão "Gerar feedback")
// Pede um feedback atualizado: até 10 por dia e só se o aluno concluiu outra bateria de questões desde o último.
// Responde na hora (202) com o mesmo formato do GET, já com `pendente: true`; o feedback é gerado em segundo plano.
// 403: avaliação do último quiz pendente; 409: ainda não praticou ou nada novo desde o último feedback;
// 429: os 10 do dia acabaram.

export async function gerarFeedbackDesempenho() {
  const res = await fetch(`${BASE_URL}/api/users/login/desempenho/feedback`, {
    method: 'POST',
    headers: getAuthHeaders(),
  })
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.message || `Erro ao pedir o feedback de desempenho: ${res.status}`)
  }
  return res.json()
}

// --- Quiz (banco de questões) ---
// POST /api/users/login/tentativas/perguntas   Body: { tema, modo }
// O backend sorteia as questões e NÃO envia o gabarito.
// Response: { quiz_id, tema, modo, aviso, questoes: [{ id, dificuldade, pergunta, opcoes, subtema, referencias }] }

// `temas` (opcional, só no simulado): os temas escolhidos pelo aluno. Sem ele, o simulado usa todos.
export async function iniciarQuiz(tema, modo, temas) {
  const res = await fetch(`${BASE_URL}/api/users/login/tentativas/perguntas`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(temas?.length ? { tema, modo, temas } : { tema, modo }),
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
