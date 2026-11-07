import { useState, useEffect, useCallback } from "react";
import { buscarFeedbackDesempenho } from "../services/api";

// Feedback de desempenho gerado pela IA (áreas com mais dificuldade, o que, onde e por que estudar).
// `habilitado` permite esperar algo antes de pedir — ex.: a tentativa do quiz ser salva.
export function useFeedbackDesempenho({ habilitado = true } = {}) {
  const [dados, setDados] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro(null);
    try {
      setDados(await buscarFeedbackDesempenho());
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    if (habilitado) carregar();
  }, [habilitado, carregar]);

  return {
    dados,
    // Enquanto não há resposta nem erro, a tela trata como carregando.
    carregando: carregando || (habilitado && !dados && !erro),
    erro,
    recarregar: carregar,
  };
}
