import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function usePerguntas() {
  const [tema, setTema] = useState("");
  const [modo, setModo] = useState("com_feedback");
  const navigate = useNavigate();

  function iniciar() {
    if (!tema.trim()) return;
    navigate(`/perguntas/quizz/${encodeURIComponent(tema)}`, { state: { modo } });
  }

  return { tema, setTema, modo, setModo, iniciar };
}
