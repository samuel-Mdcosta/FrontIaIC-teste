import { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { iniciarQuiz, responderQuestao, buscarGabarito } from "../services/api";

// Fluxo do quiz com o banco de questões:
//   1. o backend sorteia as questões e NÃO envia o gabarito;
//   2. cada resposta é registrada no backend antes de qualquer feedback (a primeira é a que vale);
//   3. ao registrar a última, o backend conclui o quiz e salva a tentativa (acertos e erros calculados lá);
//   4. o aluno responde a avaliação de satisfação do quiz (obrigatória);
//   5. só então o gabarito completo com as justificativas e o feedback vêm do backend.
export function useQuiz() {
  const { tema: temaParam } = useParams();
  const { state } = useLocation();
  const tema = decodeURIComponent(temaParam ?? "Geral");
  const modo = state?.modo ?? "com_feedback";

  const [quizId, setQuizId] = useState(null);
  const [questoes, setQuestoes] = useState([]);
  const [aviso, setAviso] = useState(null);
  const [carregandoQuestoes, setCarregandoQuestoes] = useState(true);
  const [erroQuestoes, setErroQuestoes] = useState(null);

  const [questaoAtual, setQuestaoAtual] = useState(0);
  const [respostaSelecionada, setRespostaSelecionada] = useState(null);
  const [respostaConfirmada, setRespostaConfirmada] = useState(false);
  const [respostas, setRespostas] = useState([]);
  // Feedback por questão (índice -> { correta, acertou, explicacao, explicacoes_alternativas, fontes }).
  // Só existe depois que a resposta foi registrada, e só no modo com feedback.
  const [feedbacks, setFeedbacks] = useState({});
  const [enviando, setEnviando] = useState(false);
  const [erroResposta, setErroResposta] = useState(null);
  const [quizFinalizado, setQuizFinalizado] = useState(false);
  const [avaliacaoEnviada, setAvaliacaoEnviada] = useState(false);
  const [fim, setFim] = useState(false);
  // Gabarito completo (liberado ao final): array na ordem das questões, ou null enquanto carrega.
  const [gabarito, setGabarito] = useState(null);
  const [erroGabarito, setErroGabarito] = useState(false);

  // Cria o quiz: o backend sorteia as questões.
  useEffect(() => {
    let ativo = true; // ignora a resposta de uma execução antiga do efeito (ex.: StrictMode em dev)

    iniciarQuiz(tema, modo)
      .then((data) => {
        if (!ativo) return;
        setQuizId(data.quiz_id ?? null);
        setQuestoes(data.questoes ?? []);
        setAviso(data.aviso ?? null);
      })
      .catch((e) => {
        if (ativo) setErroQuestoes(e.message);
      })
      .finally(() => {
        if (ativo) setCarregandoQuestoes(false);
      });

    return () => {
      ativo = false;
    };
  }, [tema, modo]);

  // Quiz concluído: o resultado (gabarito e feedback) só é liberado depois da avaliação de satisfação.
  const precisaAvaliar = fim && quizFinalizado && !avaliacaoEnviada;

  // Ao terminar (e avaliar): o gabarito com as justificativas.
  useEffect(() => {
    if (!fim || !quizId || precisaAvaliar) return;
    let ativo = true;

    buscarGabarito(quizId)
      .then((data) => {
        if (ativo) setGabarito(data.questoes ?? []);
      })
      .catch(() => {
        if (ativo) setErroGabarito(true);
      });

    return () => {
      ativo = false;
    };
  }, [fim, quizId, precisaAvaliar]);

  // Registra a resposta no backend. Só depois disso a tela mostra o feedback.
  async function confirmar() {
    if (respostaSelecionada === null || enviando || respostaConfirmada) return;
    setEnviando(true);
    setErroResposta(null);
    try {
      const r = await responderQuestao(quizId, questoes[questaoAtual].id, respostaSelecionada);
      // Se a questão já tinha resposta registrada (ex.: outra aba), vale a registrada.
      const inicial = r.resposta_inicial ?? respostaSelecionada;
      setRespostaSelecionada(inicial);
      setRespostas((prev) => [...prev, inicial]);
      if (r.feedback) setFeedbacks((prev) => ({ ...prev, [questaoAtual]: r.feedback }));
      if (r.quiz_finalizado) setQuizFinalizado(true);
      setRespostaConfirmada(true);
    } catch (e) {
      setErroResposta(e.message);
    } finally {
      setEnviando(false);
    }
  }

  function avancar() {
    if (questaoAtual + 1 >= questoes.length) {
      setFim(true);
      return;
    }
    setQuestaoAtual((i) => i + 1);
    setRespostaSelecionada(null);
    setRespostaConfirmada(false);
    setErroResposta(null);
  }

  const feedback = feedbacks[questaoAtual];
  const base = questoes[questaoAtual];
  // `correta` e `explicacao` só existem quando o backend os enviou (depois do registro).
  const q = base ? { ...base, correta: feedback?.correta, explicacao: feedback?.explicacao } : undefined;
  const progresso = questoes.length > 0 ? (questaoAtual / questoes.length) * 100 : 0;
  // Situação do registro da tentativa: o feedback de desempenho só é pedido depois que ela foi salva.
  const registro = !fim ? "pendente" : quizFinalizado ? "ok" : "erro";

  return {
    tema,
    modo,
    quizId,
    questoes,
    aviso,
    carregandoQuestoes,
    erroQuestoes,
    questaoAtual,
    respostaSelecionada,
    setRespostaSelecionada,
    respostaConfirmada,
    respostas,
    enviando,
    erroResposta,
    feedback,
    fim,
    precisaAvaliar,
    concluirAvaliacao: () => setAvaliacaoEnviada(true),
    gabarito,
    erroGabarito,
    registro,
    confirmar,
    avancar,
    q,
    progresso,
  };
}
