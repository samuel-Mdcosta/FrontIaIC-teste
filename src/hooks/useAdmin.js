import { useState, useEffect, useCallback } from "react";
import { listarAlunos } from "../services/api";

// GET /api/admin/alunos  (rota ainda não implementada no backend)
// Response: { message, dado: [{
//   id, nome, email, foto,
//   sessoes_chat, tempo_total_chat,
//   tentativas_quiz, acertos_quiz, erros_quiz, taxa_acerto,
//   ultimo_acesso
// }] }

export function useAdmin() {
  const [alunos, setAlunos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  const buscarAlunos = useCallback(async () => {
    try {
      setCarregando(true);
      setErro(null);
      const dados = await listarAlunos();
      setAlunos(dados);
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    buscarAlunos();
  }, [buscarAlunos]);

  return { alunos, carregando, erro, recarregar: buscarAlunos };
}
