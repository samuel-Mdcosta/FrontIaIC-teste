import { useState, useEffect } from "react";

// Estrutura esperada da API:
// GET /usuario/perfil
// {
//   "nome": "Dr. Alan Turing",
//   "email": "pesquisador@synapse.edu",
//   "instituicao": "Universidade Uniderp",
//   "foto": "https://...",
//   "stats": {
//     "sessoesRealizadas": 12,
//     "questoesRespondidas": 84,
//     "taxaAcerto": 76
//   }
// }

const mockPerfil = {
  nome: "Dr. Alan Turing",
  email: "pesquisador@synapse.edu",
  instituicao: "Universidade Uniderp",
  foto: "https://lh3.googleusercontent.com/aida-public/AB6AXuAc-_4Z8aSTUnQGz7of7XZbNYiZE98YtkHNQN36OFywzawA-cHW-H05-e2sNNzXNxv_eA1oc1sHDQVDenADduMGCMuryvPjqWdnBYQYPTLZiNIy-J0metAU0YFjrHNRkds82lCehGldOzlHkMLWDrZwp8xTdHfLzWYfRdcrpQpHQbgfuoyuOQ1hVqBbP3r8zKu9IaB7LdlO08ZAW2-67B2Hg65im7I87PAT8YWZ33wB0AKjk9ysS2r2Zsb3F6CSu8Z4rrtREwD1UtIg",
  stats: {
    sessoesRealizadas: 12,
    questoesRespondidas: 84,
    taxaAcerto: 76,
  },
};

export function usePerfil() {
  const [perfil, setPerfil] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    // TODO: substituir pelo fetch real
    // fetch("/usuario/perfil")
    //   .then((r) => r.json())
    //   .then((data) => setPerfil(data))
    //   .catch((e) => setErro(e.message))
    //   .finally(() => setCarregando(false));

    setTimeout(() => {
      setPerfil(mockPerfil);
      setCarregando(false);
    }, 500);
  }, []);

  return { perfil, carregando, erro };
}
