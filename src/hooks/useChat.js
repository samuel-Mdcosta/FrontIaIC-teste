import { useState } from "react";

// Estrutura esperada da API:
// POST /chat
// Request:  { "pergunta": "string" }
// Response: { "resposta": "string" }

export function useChat() {
  const [mensagem, setMensagem] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);

  async function enviar() {
    const texto = mensagem.trim();
    if (!texto || carregando) return;

    setCarregando(true);
    setErro(null);

    try {
      // TODO: substituir pela URL real do backend
      const response = await fetch("/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pergunta: texto }),
      });

      if (!response.ok) throw new Error(`Erro ${response.status}`);

      // const data = await response.json();
      // usar data.resposta para exibir a resposta da IA

      setMensagem("");
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      enviar();
    }
  }

  return { mensagem, setMensagem, enviar, handleKeyDown, carregando, erro };
}
