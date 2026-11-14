import { useState, useEffect, useCallback } from "react";
import { buscarFeedbackDesempenho, gerarFeedbackDesempenho } from "../services/api";

// A análise é gerada pelo servidor em segundo plano, quando o aluno clica em "Gerar feedback" (até 10 por dia), e
// fica guardada: ao recarregar a página, a mais recente volta sem nova geração. Enquanto há uma a caminho
// (`pendente`), a tela consulta de novo a cada 10 s até ela chegar.
const INTERVALO_MS = 10_000;

// Feedback de desempenho gerado pela IA (áreas com mais dificuldade, o que, onde e por que estudar).
// `habilitado` permite esperar algo antes de pedir — ex.: a tentativa do quiz ser salva.
export function useFeedbackDesempenho({ habilitado = true } = {}) {
  const [dados, setDados] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);
  const [gerando, setGerando] = useState(false);
  const [erroGerar, setErroGerar] = useState(null);

  // `silencioso`: consulta de acompanhamento; não pisca a tela nem troca o que ela mostra por um erro passageiro.
  const carregar = useCallback(async (silencioso = false) => {
    if (!silencioso) {
      setCarregando(true);
      setErro(null);
    }
    try {
      setDados(await buscarFeedbackDesempenho());
    } catch (e) {
      if (!silencioso) setErro(e.message);
    } finally {
      if (!silencioso) setCarregando(false);
    }
  }, []);

  // Botão "Gerar feedback": registra o pedido e passa a acompanhar (o POST já devolve `pendente: true`).
  const gerar = useCallback(async () => {
    setGerando(true);
    setErroGerar(null);
    try {
      setDados(await gerarFeedbackDesempenho());
    } catch (e) {
      setErroGerar(e.message);
    } finally {
      setGerando(false);
    }
  }, []);

  useEffect(() => {
    if (habilitado) carregar();
  }, [habilitado, carregar]);

  const aCaminho = dados?.pendente === true;
  useEffect(() => {
    if (!habilitado || !aCaminho) return undefined;
    const id = setInterval(() => carregar(true), INTERVALO_MS);
    return () => clearInterval(id);
  }, [habilitado, aCaminho, carregar]);

  return {
    dados,
    // Enquanto não há resposta nem erro, a tela trata como carregando.
    carregando: carregando || (habilitado && !dados && !erro),
    erro,
    recarregar: () => carregar(),
    gerar,
    gerando,
    erroGerar,
  };
}
