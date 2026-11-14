// Fonte única dos temas do quiz no front: os temas do banco de questões.
// O `titulo` é o texto exato enviado ao backend e DEVE ser idêntico, byte a byte,
// à lista canônica em ragiaic/config/temas.php (e ao `tema` das questões importadas).
export const TEMAS_QUIZ = [
  { id: 1, titulo: "Vias visuais" },
  { id: 2, titulo: "Organização cerebral" },
  { id: 3, titulo: "Hipocampo e memória espacial" },
  { id: 4, titulo: "Sistemas e processos da memória" },
  { id: 5, titulo: "Percepção visual: vias dorsal e ventral" },
  { id: 6, titulo: "Hemisférios cerebrais e linguagem" },
  { id: 7, titulo: "Redes neurais da leitura e da escrita" },
  { id: 8, titulo: "Neuroplasticidade e desenvolvimento infantil" },
];

// Só para o resumo da tela: quem define o tamanho do quiz é o backend (config/quiz.php).
export const QUESTOES_POR_TEMA = 10;
