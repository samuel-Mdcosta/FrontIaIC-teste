import { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { BASE_URL, getAuthHeaders } from "../services/api";

// Limites iguais aos da validação do backend (tentativasController).
function textoLimitado(valor, max) {
  if (Array.isArray(valor)) valor = valor.join(", ");
  if (valor === null || valor === undefined) return null;
  const texto = String(valor).trim();
  return texto ? texto.slice(0, max) : null;
}

// Detalhe de cada questão respondida: é o que permite ao feedback de desempenho
// identificar em quais subtemas o aluno mais erra.
function detalharQuestoes(questoes, respostas) {
  return questoes
    .map((q, i) => ({
      pergunta: textoLimitado(q.pergunta, 2000),
      subtema: textoLimitado(q.subtema, 255),
      resposta_escolhida: textoLimitado(q.opcoes?.[respostas[i]], 1000),
      resposta_correta: textoLimitado(q.opcoes?.[q.correta], 1000),
      acertou: respostas[i] === q.correta,
      referencias: textoLimitado(q.referencias, 500),
    }))
    .filter((q) => q.pergunta);
}

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
  // Situação do registro da tentativa: "pendente" | "ok" | "erro".
  // O feedback de desempenho só é pedido depois que a tentativa foi salva.
  const [registro, setRegistro] = useState("pendente");

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

  useEffect(() => {
    if (!fim || questoes.length === 0) return;

    const acertos = respostas.filter((r, i) => r === questoes[i]?.correta).length;
    const erros = respostas.length - acertos;

    async function registrarTentativa() {
      try {
        const response = await fetch(`${BASE_URL}/api/users/login/tentativas`, {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify({
            conteudoAcessado: tema,
            acertos,
            erros,
            questoes: detalharQuestoes(questoes, respostas),
          }),
        });
        setRegistro(response.ok ? "ok" : "erro");
      } catch {
        setRegistro("erro");
      }
    }

    registrarTentativa();
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
    registro,
    confirmar,
    avancar,
    q,
    progresso,
  };
}
