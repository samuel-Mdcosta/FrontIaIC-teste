import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { TEMAS_QUIZ, SIMULADO_MISTO } from "../data/temasQuiz";

export function usePerguntas() {
  // Vindo do feedback de desempenho ("Praticar este tema"), o tema já chega selecionado (quiz de um tema).
  const { state } = useLocation();
  const temaSugerido = TEMAS_QUIZ.some((t) => t.titulo === state?.tema) ? [state.tema] : [];
  const [temas, setTemas] = useState(temaSugerido);
  // "quiz": exatamente um tema por vez. "simulado": um ou mais temas.
  const [tipo, setTipo] = useState("quiz");
  const [modo, setModo] = useState("com_feedback");
  const navigate = useNavigate();

  const simulado = tipo === "simulado";
  const todos = temas.length === TEMAS_QUIZ.length;

  function escolherTipo(novo) {
    setTipo(novo);
    // Ao voltar para o quiz por tema, só pode ficar um tema marcado.
    if (novo === "quiz") setTemas((atuais) => atuais.slice(0, 1));
  }

  function selecionarTema(titulo) {
    if (!simulado) {
      setTemas([titulo]);
      return;
    }
    setTemas((atuais) => (atuais.includes(titulo) ? atuais.filter((t) => t !== titulo) : [...atuais, titulo]));
  }

  // Só no simulado: marca todos os temas ou limpa a seleção.
  function alternarTodos() {
    setTemas(todos ? [] : TEMAS_QUIZ.map((t) => t.titulo));
  }

  function iniciar() {
    if (temas.length === 0) return;
    if (!simulado) {
      navigate(`/perguntas/quizz/${encodeURIComponent(temas[0])}`, { state: { modo } });
      return;
    }
    // Na ordem da lista (e não na ordem dos cliques); com todos marcados vale o simulado completo.
    const escolhidos = TEMAS_QUIZ.map((t) => t.titulo).filter((t) => temas.includes(t));
    navigate(`/perguntas/quizz/${encodeURIComponent(SIMULADO_MISTO.titulo)}`, {
      state: { modo, temas: todos ? null : escolhidos },
    });
  }

  return { temas, tipo, simulado, todos, escolherTipo, selecionarTema, alternarTodos, modo, setModo, iniciar };
}
