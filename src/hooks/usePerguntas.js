import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { TEMAS_QUIZ } from "../data/temasQuiz";

export function usePerguntas() {
  // Vindo do feedback de desempenho ("Praticar este tema"), o tema já chega selecionado.
  const { state } = useLocation();
  const temaSugerido = TEMAS_QUIZ.some((t) => t.titulo === state?.tema) ? state.tema : "";
  const [tema, setTema] = useState(temaSugerido);
  const [modo, setModo] = useState("com_feedback");
  const navigate = useNavigate();

  function iniciar() {
    if (!tema.trim()) return;
    navigate(`/perguntas/quizz/${encodeURIComponent(tema)}`, { state: { modo } });
  }

  return { tema, setTema, modo, setModo, iniciar };
}
