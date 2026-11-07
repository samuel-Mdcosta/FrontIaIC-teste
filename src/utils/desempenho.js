import { TEMAS_QUIZ } from "../data/temasQuiz";

// Faixas definidas no backend (DesempenhoService): >= 70% bom, >= 50% atenção, abaixo disso crítico.
export const NIVEIS = {
  critico: { rotulo: "Precisa de reforço", selo: "bg-error/10 text-error", barra: "bg-error" },
  atencao: { rotulo: "Em desenvolvimento", selo: "bg-amber-500/15 text-amber-800", barra: "bg-amber-500" },
  bom: { rotulo: "Bom domínio", selo: "bg-tertiary/10 text-tertiary", barra: "bg-tertiary" },
};

export const TENDENCIAS = {
  melhorando: { icone: "trending_up", rotulo: "Melhorando", cor: "text-tertiary" },
  piorando: { icone: "trending_down", rotulo: "Piorando", cor: "text-error" },
  estavel: { icone: "trending_flat", rotulo: "Estável", cor: "text-on-surface-variant" },
};

export function nivelInfo(nivel) {
  return NIVEIS[nivel] ?? { rotulo: "—", selo: "bg-surface-container-high text-outline", barra: "bg-outline" };
}

export function formatarTaxa(taxa) {
  return taxa == null ? "—" : `${Math.round(taxa)}%`;
}

// Só os temas da lista oficial podem gerar um novo quiz (validação do backend).
export function temaPraticavel(tema) {
  return TEMAS_QUIZ.some((t) => t.titulo === tema);
}
