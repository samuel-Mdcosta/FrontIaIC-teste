import { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { BASE_URL, getAuthHeaders } from "../services/api";

// POST /api/users/login/tentativas/perguntas
// Request:  { "texto": "string" }
// Response: { "questoes": [ { pergunta, opcoes, correta, explicacao } ] }

// POST /api/users/login/tentativas
// Request:  { "conteudoAcessado": "string", "acertos": number, "erros": number }

export function useQuiz() {
  const { tema: temaParam } = useParams();
  const { state } = useLocation();
  const tema = decodeURIComponent(temaParam ?? "Geral");
  const modo = state?.modo ?? "com_feedback";

  const [questoes, setQuestoes] = useState([]);
  const [carregandoQuestoes, setCarregandoQuestoes] = useState(true);
  const [erroQuestoes, setErroQuestoes] = useState(null);

  const [questaoAtual, setQuestaoAtual] = useState(0);
  const [respostaSelecionada, setRespostaSelecionada] = useState(null);
  const [respostaConfirmada, setRespostaConfirmada] = useState(false);
  const [respostas, setRespostas] = useState([]);
  const [fim, setFim] = useState(false);

  // Busca as questões ao montar
  useEffect(() => {
    async function buscarQuestoes() {
      try {
        const response = await fetch(`${BASE_URL}/api/users/login/tentativas/perguntas`, {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify({ tema }),
        });

        if (!response.ok) throw new Error(`Erro ${response.status}`);

        const data = await response.json();
        setQuestoes(data.quizz_gerado_llm?.questoes ?? []);
      } catch (e) {
        setErroQuestoes(e.message);
      } finally {
        setCarregandoQuestoes(false);
      }
    }

    buscarQuestoes();
  }, [tema]);

  // Salva o resultado quando o quiz termina
  useEffect(() => {
    if (!fim || questoes.length === 0) return;

    const acertos = respostas.filter((r, i) => r === questoes[i]?.correta).length;
    const erros = respostas.length - acertos;

    fetch(`${BASE_URL}/api/users/login/tentativas`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ conteudoAcessado: tema, acertos, erros }),
    });
  }, [fim]);

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
  const progresso = questoes.length > 0 ? (questaoAtual / questoes.length) * 100 : 0;

  return {
    tema,
    modo,
    questoes,
    carregandoQuestoes,
    erroQuestoes,
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
