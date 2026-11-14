import { useNavigate } from "react-router-dom";
import { RECURSOS } from "../config/recursos";

// Tela inicial: só apresenta o que o aluno usa (questões e desempenho).
// O chat só aparece se RECURSOS.chat for true (ver config/recursos.js).
const PASSOS = [
  {
    icone: "category",
    fundo: "bg-primary/10",
    corIcone: "text-primary",
    titulo: "Escolha o que estudar",
    texto:
      "Selecione um tema ou faça um simulado misto com questões de todos os temas, em níveis fácil, médio e difícil.",
  },
  {
    icone: "task_alt",
    fundo: "bg-secondary/10",
    corIcone: "text-secondary",
    titulo: "Responda e aprenda",
    texto:
      "Cada questão é um caso clínico curto. Você vê a explicação e as referências bibliográficas a cada resposta, ou só ao final.",
  },
  {
    icone: "insights",
    fundo: "bg-tertiary/10",
    corIcone: "text-tertiary",
    titulo: "Acompanhe sua evolução",
    texto:
      "Veja sua taxa de acerto por tema e descubra onde focar nos próximos estudos.",
  },
];

export default function Inicio() {
  const navigate = useNavigate();

  return (
    <main className="pt-28 pb-20 px-6 max-w-6xl mx-auto">
      {/* Hero Section */}
      <section className="text-center py-16 space-y-6">
        <h1 className="font-headline text-5xl md:text-6xl font-bold tracking-tight text-primary leading-tight max-w-4xl mx-auto">
          Tutor Virtual de Neurociências
        </h1>
        <p className="text-on-surface-variant text-lg max-w-2xl mx-auto leading-relaxed">
          Pratique com questões de múltipla escolha baseadas em livros
          didáticos, o modelo das questões segue o ENAMED e elas são geradas
          por Inteligência Artificial. Veja o gabarito com justificativas e
          acompanhe o seu desempenho.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
          <button
            onClick={() => navigate("/perguntas")}
            className="primary-gradient text-white px-10 py-5 rounded-xl font-headline font-bold text-lg hover:shadow-xl transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-3"
          >
            <span className="material-symbols-outlined">quiz</span>
            Fazer Questões
          </button>
          <button
            onClick={() => navigate("/desempenho")}
            className="bg-surface-container-low border border-outline-variant text-primary px-10 py-5 rounded-xl font-headline font-bold text-lg hover:bg-surface-container hover:shadow-md transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-3"
          >
            <span className="material-symbols-outlined">insights</span>
            Meu Desempenho
          </button>
          {RECURSOS.chat && (
            <button
              onClick={() => navigate("/chat")}
              className="bg-surface-container-low border border-outline-variant text-primary px-10 py-5 rounded-xl font-headline font-bold text-lg hover:bg-surface-container hover:shadow-md transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-3"
            >
              <span className="material-symbols-outlined">chat</span>
              Chat
            </button>
          )}
        </div>
      </section>

      {/* Como funciona */}
      <section className="py-16 space-y-10">
        <div className="text-center space-y-2">
          <span className="text-primary font-headline text-2xl font-semibold">
            Como funciona
          </span>
          <p className="text-on-surface-variant text-sm max-w-xl mx-auto">
            Em três passos, do tema escolhido à sua evolução.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PASSOS.map(({ icone, fundo, corIcone, titulo, texto }, i) => (
            <div
              key={titulo}
              className="p-8 bg-surface-container-lowest rounded-2xl shadow-sm space-y-4 border border-outline-variant/10"
            >
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl ${fundo} flex items-center justify-center`}>
                  <span className={`material-symbols-outlined ${corIcone}`}>{icone}</span>
                </div>
                <span className="font-headline text-sm font-semibold text-on-surface-variant">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="font-headline font-bold text-lg text-on-surface">{titulo}</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">{texto}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Recursos */}
      <section className="py-10 space-y-8">
        <div className={`grid grid-cols-1 gap-6 ${RECURSOS.chat ? "lg:grid-cols-3" : "lg:grid-cols-2"}`}>
          <div className="p-8 bg-primary rounded-2xl text-white space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="material-symbols-outlined text-white/70">quiz</span>
              <h3 className="font-headline text-2xl font-bold">Questões & Quiz</h3>
              <p className="text-white/80 text-sm leading-relaxed">
                Estude por tema ou faça um simulado misto. Escolha entre ver a
                explicação a cada resposta ou só ao final, com as referências
                bibliográficas de cada questão.
              </p>
            </div>
            <button
              onClick={() => navigate("/perguntas")}
              className="mt-4 bg-white text-primary font-headline font-bold py-4 rounded-xl hover:bg-white/90 transition-all flex items-center justify-center gap-2"
            >
              Configurar Sessão
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>

          <div className="p-8 bg-surface-container-low rounded-2xl space-y-4 flex flex-col justify-between border border-outline-variant/10">
            <div className="space-y-3">
              <span className="material-symbols-outlined text-secondary">insights</span>
              <h3 className="font-headline text-2xl font-bold text-on-surface">Meu Desempenho</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">
                Acompanhe sua taxa de acerto por tema, veja a tendência e
                descubra em quais áreas vale a pena focar.
              </p>
            </div>
            <button
              onClick={() => navigate("/desempenho")}
              className="mt-4 border-2 border-primary text-primary font-headline font-bold py-4 rounded-xl hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2"
            >
              Ver Desempenho
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>

          {RECURSOS.chat && (
            <div className="p-8 bg-surface-container-low rounded-2xl space-y-4 flex flex-col justify-between border border-outline-variant/10">
              <div className="space-y-3">
                <span className="material-symbols-outlined text-secondary">chat</span>
                <h3 className="font-headline text-2xl font-bold text-on-surface">Chat com o Tutor</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed">
                  Faça perguntas livres sobre neurociência.
                </p>
              </div>
              <button
                onClick={() => navigate("/chat")}
                className="mt-4 border-2 border-primary text-primary font-headline font-bold py-4 rounded-xl hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2"
              >
                Acessar Chat
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
