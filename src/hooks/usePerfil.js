import { useState, useEffect } from "react";
import { BASE_URL, getAuthHeaders, clearToken } from "../services/api";
import { useNavigate } from "react-router-dom";

// GET /api/user
// Response: { id, nome, email, ... }

// GET /api/users/login/chat/quantidade
// Response: { quantidade: number }

// GET /api/users/login/tentativas/quantidade
// Response: { quantidade: number }

// POST /api/users/logout
// Response: { message: "..." }

export function usePerfil() {
  const [perfil, setPerfil] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function buscarPerfil() {
      try {
        const headers = getAuthHeaders();

        const [resUsuario, resSessoesChat, resTentativas] = await Promise.all([
          fetch(`${BASE_URL}/api/user`, { headers }),
          fetch(`${BASE_URL}/api/users/login/chat/quantidade`, { headers }),
          fetch(`${BASE_URL}/api/users/login/tentativas/quantidade`, { headers }),
        ]);

        if (!resUsuario.ok) throw new Error(`Erro ao buscar usuário: ${resUsuario.status}`);

        const usuario = await resUsuario.json();
        const dadosChat = resSessoesChat.ok ? await resSessoesChat.json() : { quantidade: 0 };
        const dadosTentativas = resTentativas.ok ? await resTentativas.json() : { quantidade: 0 };

        setPerfil({
          nome: usuario.nome,
          email: usuario.email,
          instituicao: usuario.instituicao ?? null,
          foto: usuario.foto ?? null,
          stats: {
            sessoesRealizadas: dadosChat.quantidade ?? 0,
            questoesRespondidas: dadosTentativas.quantidade ?? 0,
            // taxaAcerto não disponível via API — requer endpoint dedicado no backend
            taxaAcerto: null,
          },
        });
      } catch (e) {
        setErro(e.message);
      } finally {
        setCarregando(false);
      }
    }

    buscarPerfil();
  }, []);

  async function logout() {
    try {
      await fetch(`${BASE_URL}/api/users/logout`, {
        method: "POST",
        headers: getAuthHeaders(),
      });
    } finally {
      clearToken();
      navigate("/");
    }
  }

  return { perfil, carregando, erro, logout };
}
