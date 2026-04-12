import QuizResultado from "../components/QuizResultado";
import { useQuiz } from "../hooks/useQuiz";

export default function Quiz() {
  const {
    tema,
    modo,
    questoes,
    questaoAtual,
    respostaSelecionada,
    setRespostaSelecionada,
    respostaConfirmada,
    respostas,
    fim,
    confirmar,
    avancar,
    q,
    progresso,
  } = useQuiz();

  if (fim) {
    return <QuizResultado questoes={questoes} respostas={respostas} />;
  }

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
              <span className="material-symbols-outlined text-secondary">psychology</span>
            </div>
            <div>
              <p className="font-medium text-sm text-on-surface-variant mb-3">Synapse Core AI</p>
              <p className="text-on-surface text-lg font-medium leading-relaxed">{q.pergunta}</p>
            </div>
          </div>

          {/* Opções */}
          <div className="space-y-3">
            {q.opcoes.map((opcao, i) => {
              let estilo = "bg-surface-container-lowest border-outline-variant/20 hover:border-primary/30 hover:bg-surface-container-low";
              if (respostaConfirmada) {
                if (i === q.correta) estilo = "bg-tertiary/5 border-tertiary/30 text-tertiary";
                else if (i === respostaSelecionada) estilo = "bg-error/5 border-error/30 text-error";
                else estilo = "bg-surface-container-lowest border-outline-variant/10 opacity-50";
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
                  <span className={`w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0 text-xs font-bold transition-all
                    ${respostaSelecionada === i && !respostaConfirmada ? "border-primary bg-primary text-white" : "border-outline-variant/40 text-on-surface-variant"}
                    ${respostaConfirmada && i === q.correta ? "border-tertiary bg-tertiary text-white" : ""}
                    ${respostaConfirmada && i === respostaSelecionada && i !== q.correta ? "border-error bg-error text-white" : ""}
                  `}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="text-sm font-medium">{opcao}</span>
                  {respostaConfirmada && i === q.correta && (
                    <span className="material-symbols-outlined text-tertiary ml-auto text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  )}
                  {respostaConfirmada && i === respostaSelecionada && i !== q.correta && (
                    <span className="material-symbols-outlined text-error ml-auto text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>cancel</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Explicação (só no modo com_feedback) */}
          {respostaConfirmada && modo === "com_feedback" && (
            <div className="flex gap-4 p-5 bg-surface-container rounded-2xl border border-outline-variant/10">
              <span className="material-symbols-outlined text-secondary shrink-0">info</span>
              <p className="text-sm text-on-surface-variant leading-relaxed">{q.explicacao}</p>
            </div>
          )}
        </div>
      </section>

      {/* Botões */}
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
              {questaoAtual + 1 >= questoes.length ? "Ver Resultado" : "Próxima Questão"}
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          )}
        </div>
      </footer>
    </main>
  );
}
