import { useState, useEffect, useRef } from "react";
import { BASE_URL, getAuthHeaders } from "../services/api";

// POST /api/users/login/chat/mensagem
// Request:  { "pergunta": "string" }
// Response: { "pergunta": "...", "resposta_tutor": { "resposta": "...", "disponivel_no_contexto": bool }, "documentos_utilizados": {...} }

// POST /api/users/login/chat/salvarUso
// Request:  { "tempoUsoChat": number }  (segundos)

export function useChat() {
  const [mensagem, setMensagem] = useState("");
  const [mensagens, setMensagens] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);

  const inicioSessao = useRef(null);

  // Salva o tempo de uso ao fechar/atualizar a aba ou ao desmontar o componente.
  // O cleanup do useEffect sozinho não roda quando a aba/navegador é fechado,
  // então usamos também o evento "pagehide" (disparado em fechar/refresh/navegar).
  useEffect(() => {
    function salvarTempo() {
      if (!inicioSessao.current) return;
      const segundos = Math.round((Date.now() - inicioSessao.current) / 1000);
      inicioSessao.current = null; // evita envio duplicado (pagehide + unmount)
      if (segundos < 1) return;
      fetch(`${BASE_URL}/api/users/login/chat/salvarUso`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ tempoUsoChat: segundos }),
        keepalive: true,
      });
    }

    window.addEventListener("pagehide", salvarTempo);
    return () => {
      window.removeEventListener("pagehide", salvarTempo);
      salvarTempo();
    };
  }, []);

  async function enviar() {
    const texto = mensagem.trim();
    if (!texto || carregando) return;

    // Inicia o timer na primeira mensagem da sessão
    if (!inicioSessao.current) {
      inicioSessao.current = Date.now();
    }

    setMensagens((prev) => [...prev, { tipo: "usuario", texto }]);
    setMensagem("");
    setCarregando(true);
    setErro(null);

    try {
      const response = await fetch(`${BASE_URL}/api/users/login/chat/mensagem`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ pergunta: texto }),
      });

      if (!response.ok) throw new Error(`Erro ${response.status}`);

      const data = await response.json();
      const textoResposta = data.resposta_tutor?.resposta ?? "Sem resposta.";
      setMensagens((prev) => [
        ...prev,
        { tipo: "ia", texto: textoResposta, uso: data.uso_tokens ?? null },
      ]);
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

  return { mensagem, setMensagem, mensagens, enviar, handleKeyDown, carregando, erro };
}
