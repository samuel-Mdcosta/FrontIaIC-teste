import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { TEMAS_QUIZ, SIMULADO_MISTO } from "../data/temasQuiz";

export function usePerguntas() {
  // Vindo do feedback de desempenho ("Praticar este tema"), o tema já chega selecionado.
  const { state } = useLocation();
  const temaSugerido = TEMAS_QUIZ.some((t) => t.titulo === state?.tema) ? [state.tema] : [];
  const [temas, setTemas] = useState(temaSugerido);
  const [modo, setModo] = useState("com_feedback");
  const navigate = useNavigate();

  // Um tema = quiz daquele tema; dois ou mais = simulado só com os temas escolhidos.
  const simulado = temas.length > 1;
  const todos = temas.length === TEMAS_QUIZ.length;

  function alternarTema(titulo) {
    setTemas((atuais) => (atuais.includes(titulo) ? atuais.filter((t) => t !== titulo) : [...atuais, titulo]));
  }

  function alternarTodos() {
    setTemas(todos ? [] : TEMAS_QUIZ.map((t) => t.titulo));
  }

  function iniciar() {
    if (temas.length === 0) return;
    if (!simulado) {
      navigate(`/perguntas/quizz/${encodeURIComponent(temas[0])}`, { state: { modo } });
      return;
    }
    // Na ordem da lista (e não na ordem dos cliques), com todos marcados vale o simulado completo.
    const escolhidos = TEMAS_QUIZ.map((t) => t.titulo).filter((t) => temas.includes(t));
    navigate(`/perguntas/quizz/${encodeURIComponent(SIMULADO_MISTO.titulo)}`, {
      state: { modo, temas: todos ? null : escolhidos },
    });
  }

  return { temas, simulado, todos, alternarTema, alternarTodos, modo, setModo, iniciar };
}
