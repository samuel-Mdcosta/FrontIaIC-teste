import { useState, useEffect, useCallback, useRef } from "react";
import { listarAlunos, listarTemasAluno } from "../services/api";

export function useAdmin() {
  const [alunos, setAlunos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  const [temasPorAluno, setTemasPorAluno] = useState({});
  const temasRef = useRef({});

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

  const carregarTemasAluno = useCallback(async (id) => {
    if (temasRef.current[id]?.temas || temasRef.current[id]?.carregando) return;

    temasRef.current[id] = { carregando: true };
    setTemasPorAluno((prev) => ({
      ...prev,
      [id]: { carregando: true, erro: null, temas: null },
    }));

    try {
      const temas = await listarTemasAluno(id);
      temasRef.current[id] = { temas };
      setTemasPorAluno((prev) => ({
        ...prev,
        [id]: { carregando: false, erro: null, temas },
      }));
    } catch (e) {
      temasRef.current[id] = {};
      setTemasPorAluno((prev) => ({
        ...prev,
        [id]: { carregando: false, erro: e.message, temas: null },
      }));
    }
  }, []);

  return {
    alunos,
    carregando,
    erro,
    recarregar: buscarAlunos,
    temasPorAluno,
    carregarTemasAluno,
  };
}
