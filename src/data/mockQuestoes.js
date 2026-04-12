// Estrutura esperada do JSON retornado pela API:
// {
//   "questoes": [
//     {
//       "pergunta": "texto da pergunta",
//       "opcoes": ["A", "B", "C", "D"],
//       "correta": 1,         // índice da opção correta (number)
//       "explicacao": "texto" // exibido no modo com_feedback
//     }
//   ]
// }

const mockQuestoes = [
  {
    pergunta: "Qual estrutura cerebral é primariamente responsável pela consolidação da memória de longo prazo?",
    opcoes: ["Amígdala", "Hipocampo", "Cerebelo", "Córtex pré-frontal"],
    correta: 1,
    explicacao: "O hipocampo é fundamental para a consolidação da memória declarativa de longo prazo. Lesões nessa região causam amnésia anterógrada, como documentado no famoso caso do paciente H.M.",
  },
  {
    pergunta: "O fenômeno de potenciação de longa duração (LTP) está diretamente associado a qual receptor?",
    opcoes: ["Receptor GABA-A", "Receptor muscarínico M1", "Receptor NMDA", "Receptor dopaminérgico D2"],
    correta: 2,
    explicacao: "O receptor NMDA é o principal mediador do LTP. Sua ativação requer despolarização simultânea da membrana pós-sináptica e ligação do glutamato.",
  },
  {
    pergunta: "Qual neurotransmissor está predominantemente reduzido na Doença de Parkinson?",
    opcoes: ["Serotonina", "Acetilcolina", "Dopamina", "Noradrenalina"],
    correta: 2,
    explicacao: "A Doença de Parkinson é caracterizada pela degeneração dos neurônios dopaminérgicos da substância negra pars compacta, levando à redução de dopamina no estriado.",
  },
];

export default mockQuestoes;
