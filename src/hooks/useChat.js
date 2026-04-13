import { useState, useEffect, useRef } from "react";
import { BASE_URL, getAuthHeaders } from "../services/api";

// POST /api/users/login/chat/mensagem
// Request:  { "pergunta": "string" }
// Response: { "resposta": "string" }

// POST /api/users/login/chat/salvarUso
// Request:  { "tempoUsoChat": number }  (segundos)

export function useChat() {
  const [mensagem, setMensagem] = useState("");
  const [mensagens, setMensagens] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);

  const inicioSessao = useRef(null);

  // Salva o tempo de uso ao desmontar o componente
  useEffect(() => {
    return () => {
      if (!inicioSessao.current) return;
      const segundos = Math.round((Date.now() - inicioSessao.current) / 1000);
      fetch(`${BASE_URL}/api/users/login/chat/salvarUso`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ tempoUsoChat: segundos }),
        keepalive: true,
      });
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
      setMensagens((prev) => [...prev, { tipo: "ia", texto: data.resposta }]);
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
