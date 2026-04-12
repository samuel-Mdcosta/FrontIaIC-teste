import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// Estrutura esperada do JSON da IA:
// {
//   "questoes": [
//     {
//       "pergunta": "texto",
//       "opcoes": ["A", "B", "C", "D"],
//       "correta": 1,
//       "explicacao": "texto"
//     }
//   ]
// }

const mockQuestoes = [
  {
    pergunta:
      "Qual estrutura cerebral é primariamente responsável pela consolidação da memória de longo prazo?",
    opcoes: ["Amígdala", "Hipocampo", "Cerebelo", "Córtex pré-frontal"],
    correta: 1,
    explicacao:
      "O hipocampo é fundamental para a consolidação da memória declarativa de longo prazo. Lesões nessa região causam amnésia anterógrada, como documentado no famoso caso do paciente H.M.",
  },
  {
    pergunta:
      "O fenômeno de potenciação de longa duração (LTP) está diretamente associado a qual receptor?",
    opcoes: [
      "Receptor GABA-A",
      "Receptor muscarínico M1",
      "Receptor NMDA",
      "Receptor dopaminérgico D2",
    ],
    correta: 2,
    explicacao:
      "O receptor NMDA é o principal mediador do LTP. Sua ativação requer despolarização simultânea da membrana pós-sináptica e ligação do glutamato.",
  },
  {
    pergunta:
      "Qual neurotransmissor está predominantemente reduzido na Doença de Parkinson?",
    opcoes: ["Serotonina", "Acetilcolina", "Dopamina", "Noradrenalina"],
    correta: 2,
    explicacao:
      "A Doença de Parkinson é caracterizada pela degeneração dos neurônios dopaminérgicos da substância negra pars compacta, levando à redução de dopamina no estriado.",
  },
];

export default function Quiz() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const tema = state?.tema ?? "Geral";
  const modo = state?.modo ?? "com_feedback";

  // TODO: substituir mockQuestoes pela chamada real à API
  // useEffect(() => { fetch('/quizz', ...).then(r => r.json()).then(d => setQuestoes(d.questoes)) }, [])
  const questoes = mockQuestoes;

  const [questaoAtual, setQuestaoAtual] = useState(0);
  const [respostaSelecionada, setRespostaSelecionada] = useState(null);
  const [respostaConfirmada, setRespostaConfirmada] = useState(false);
  const [respostas, setRespostas] = useState([]);
  const [fim, setFim] = useState(false);

  function confirmar() {
    if (respostaSelecionada === null) return;
    setRespostaConfirmada(true);
    setRespostas((prev) => [...prev, respostaSelecionada]);
  }

  function avancar() {
    if (questaoAtual + 1 >= questoes.length) {
      setFim(true);
      return;
    }
    setQuestaoAtual((i) => i + 1);
    setRespostaSelecionada(null);
    setRespostaConfirmada(false);
  }

  // ─── RESULTADO ───────────────────────────────────────────────────────────────
  if (fim) {
    const acertos = respostas.filter(
      (r, i) => r === questoes[i]?.correta,
    ).length;
    const percentual = Math.round((acertos / questoes.length) * 100);

    return (
      <main className="pt-32 pb-20 px-6 max-w-3xl mx-auto">
        <div className="text-center space-y-6 py-12">
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined text-primary text-5xl">
              {percentual >= 70 ? "emoji_events" : "school"}
            </span>
          </div>
          <h1 className="font-headline text-4xl font-bold text-primary">
            Sessão Concluída
          </h1>
          <p className="text-on-surface-variant text-lg">
            Você acertou{" "}
            <span className="text-primary font-bold">{acertos}</span> de{" "}
            <span className="font-bold">{questoes.length}</span> questões
          </p>
          <div className="relative h-3 bg-surface-container-high rounded-full overflow-hidden max-w-sm mx-auto">
            <div
              className="absolute inset-y-0 left-0 bg-primary rounded-full transition-all duration-700"
              style={{ width: `${percentual}%` }}
            />
          </div>
          <span className="text-primary font-headline font-bold text-3xl">
            {percentual}%
          </span>
        </div>

        <div className="space-y-4 mb-10">
          {questoes.map((q, i) => {
            const acertou = respostas[i] === q.correta;
            return (
              <div
                key={i}
                className="p-5 bg-surface-container-lowest rounded-2xl border border-outline-variant/10 space-y-3"
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`material-symbols-outlined text-lg mt-0.5 ${acertou ? "text-tertiary" : "text-error"}`}
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    {acertou ? "check_circle" : "cancel"}
                  </span>
                  <p className="text-sm font-medium text-on-surface">
                    {q.pergunta}
                  </p>
                </div>
                {!acertou && (
                  <p className="text-xs text-on-surface-variant pl-8">
                    Resposta correta:{" "}
                    <span className="text-primary font-semibold">
                      {q.opcoes[q.correta]}
                    </span>
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <button
          onClick={() => navigate("/quizz")}
          className="w-full primary-gradient text-white py-5 rounded-xl font-headline font-bold text-lg hover:shadow-xl transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-3"
        >
          <span className="material-symbols-outlined">refresh</span>
          Nova Sessão
        </button>
      </main>
    );
  }

  const q = questoes[questaoAtual];
  const progresso = (questaoAtual / questoes.length) * 100;

  return (
    <main className="flex-1 flex flex-col relative overflow-hidden bg-surface">
      <section className="flex-1 overflow-y-auto pt-24 pb-32 px-6 md:px-12 lg:px-24 xl:px-48">
        {/* Progresso */}
        <div className="max-w-3xl mx-auto mb-10 space-y-2">
          <div className="flex justify-between items-center text-xs text-on-surface-variant">
            <span className="font-label uppercase tracking-widest">
              Questão {questaoAtual + 1} de {questoes.length}
            </span>
            <span className="font-semibold text-primary">{tema}</span>
          </div>
          <div className="h-1.5 bg-surface-container-high rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${progresso}%` }}
            />
          </div>
        </div>

        {/* Pergunta */}
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="flex gap-5">
            <div className="w-10 h-10 rounded-full bg-secondary-fixed flex items-center justify-center shrink-0 mt-1">
              <span className="material-symbols-outlined text-secondary">
                psychology
              </span>
            </div>
            <div>
              <p className="font-medium text-sm text-on-surface-variant mb-3">
                Synapse Core AI
              </p>
              <p className="text-on-surface text-lg font-medium leading-relaxed">
                {q.pergunta}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {q.opcoes.map((opcao, i) => {
              let estilo =
                "bg-surface-container-lowest border-outline-variant/20 hover:border-primary/30 hover:bg-surface-container-low";
              if (respostaConfirmada) {
                if (i === q.correta)
                  estilo = "bg-tertiary/5 border-tertiary/30 text-tertiary";
                else if (i === respostaSelecionada)
                  estilo = "bg-error/5 border-error/30 text-error";
                else
                  estilo =
                    "bg-surface-container-lowest border-outline-variant/10 opacity-50";
              } else if (respostaSelecionada === i) {
                estilo = "bg-primary/[0.04] border-primary/30";
              }

              return (
                <button
                  key={i}
                  disabled={respostaConfirmada}
                  onClick={() => setRespostaSelecionada(i)}
                  className={`w-full flex items-center gap-4 p-5 rounded-2xl border transition-all duration-200 text-left ${estilo}`}
                >
                  <span
                    className={`w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0 text-xs font-bold transition-all
                    ${respostaSelecionada === i && !respostaConfirmada ? "border-primary bg-primary text-white" : "border-outline-variant/40 text-on-surface-variant"}
                    ${respostaConfirmada && i === q.correta ? "border-tertiary bg-tertiary text-white" : ""}
                    ${respostaConfirmada && i === respostaSelecionada && i !== q.correta ? "border-error bg-error text-white" : ""}
                  `}
                  >
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="text-sm font-medium">{opcao}</span>
                  {respostaConfirmada && i === q.correta && (
                    <span
                      className="material-symbols-outlined text-tertiary ml-auto text-lg"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      check_circle
                    </span>
                  )}
                  {respostaConfirmada &&
                    i === respostaSelecionada &&
                    i !== q.correta && (
                      <span
                        className="material-symbols-outlined text-error ml-auto text-lg"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        cancel
                      </span>
                    )}
                </button>
              );
            })}
          </div>

          {respostaConfirmada && modo === "com_feedback" && (
            <div className="flex gap-4 p-5 bg-surface-container rounded-2xl border border-outline-variant/10">
              <span className="material-symbols-outlined text-secondary shrink-0">
                info
              </span>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                {q.explicacao}
              </p>
            </div>
          )}
        </div>
      </section>

      <footer className="absolute bottom-0 left-0 w-full px-6 md:px-12 lg:px-24 xl:px-48 pb-8 pt-4 bg-gradient-to-t from-surface via-surface to-transparent">
        <div className="max-w-3xl mx-auto">
          {!respostaConfirmada ? (
            <button
              onClick={confirmar}
              disabled={respostaSelecionada === null}
              className="w-full primary-gradient text-white py-4 rounded-2xl font-headline font-bold text-base hover:shadow-lg transition-all duration-300 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              Confirmar Resposta
              <span className="material-symbols-outlined">check</span>
            </button>
          ) : (
            <button
              onClick={avancar}
              className="w-full primary-gradient text-white py-4 rounded-2xl font-headline font-bold text-base hover:shadow-lg transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {questaoAtual + 1 >= questoes.length
                ? "Ver Resultado"
                : "Próxima Questão"}
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          )}
        </div>
      </footer>
    </main>
  );
}
