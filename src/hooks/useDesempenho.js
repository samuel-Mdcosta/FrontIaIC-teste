import { useState, useEffect, useCallback } from "react";
import { buscarDesempenho } from "../services/api";
import { useFeedbackDesempenho } from "./useFeedbackDesempenho";

// Página "Meu Desempenho": números por tema (rápidos) + feedback da IA (carrega em seguida).
export function useDesempenho() {
  const [resumo, setResumo] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro(null);
    try {
      setResumo(await buscarDesempenho());
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  // Sem nenhuma tentativa não há o que analisar: nem chama a IA.
  const feedback = useFeedbackDesempenho({ habilitado: (resumo?.tentativas ?? 0) > 0 });

  return { resumo, carregando, erro, recarregar: carregar, feedback };
}
