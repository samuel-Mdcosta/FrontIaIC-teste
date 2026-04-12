import { useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import mockQuestoes from "../data/mockQuestoes";

export function useQuiz() {
  const { tema: temaParam } = useParams();
  const { state } = useLocation();
  const tema = decodeURIComponent(temaParam ?? "Geral");
  const modo = state?.modo ?? "com_feedback";

  // TODO: substituir mockQuestoes pela chamada real à API
  // useEffect(() => {
  //   fetch("/quizz", { method: "POST", body: JSON.stringify({ texto: tema }) })
  //     .then((r) => r.json())
  //     .then((data) => setQuestoes(data.questoes));
  // }, [tema]);
  const questoes = mockQuestoes;

  const [questaoAtual, setQuestaoAtual] = useState(0);
  const [respostaSelecionada, setRespostaSelecionada] = useState(null);
  const [respostaConfirmada, setRespostaConfirmada] = useState(false);
  const [respostas, setRespostas] = useState([]);
  const [fim, setFim] = useState(false);

  function confirmar() {
    if (respostaSelecionada === null) return;
    setRespostaConfirmada(true);
    setRespostas((prev) => [...prev, respostaSelecionada]);
  }

  function avancar() {
    if (questaoAtual + 1 >= questoes.length) {
      setFim(true);
      return;
    }
    setQuestaoAtual((i) => i + 1);
    setRespostaSelecionada(null);
    setRespostaConfirmada(false);
  }

  const q = questoes[questaoAtual];
  const progresso = (questaoAtual / questoes.length) * 100;

  return {
    tema,
    modo,
    questoes,
    questaoAtual,
    respostaSelecionada,
    setRespostaSelecionada,
    respostaConfirmada,
    respostas,
    fim,
    confirmar,
    avancar,
    q,
    progresso,
  };
}
