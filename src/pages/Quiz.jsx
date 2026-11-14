import { useNavigate } from "react-router-dom";
import AvaliacaoQuiz from "../components/AvaliacaoQuiz";
import QuizResultado from "../components/QuizResultado";
import { useQuiz } from "../hooks/useQuiz";

// Nível da questão mostrado ao estudante (o backend envia facil | intermediaria | dificil).
const NIVEIS = {
  facil: { rotulo: "Fácil", estilo: "bg-tertiary/10 text-tertiary" },
  intermediaria: { rotulo: "Média", estilo: "bg-secondary/10 text-secondary" },
  dificil: { rotulo: "Difícil", estilo: "bg-error/10 text-error" },
};

export default function Quiz() {
  const navigate = useNavigate();
  const {
    tema,
    modo,
    quizId,
    questoes,
    aviso,
    carregandoQuestoes,
    erroQuestoes,
    questaoAtual,
    respostaSelecionada,
    setRespostaSelecionada,
    respostaConfirmada,
    respostas,
    enviando,
    erroResposta,
    feedback,
    fim,
    precisaAvaliar,
    concluirAvaliacao,
    gabarito,
    erroGabarito,
    registro,
    confirmar,
    avancar,
    q,
    progresso,
  } = useQuiz();

  if (carregandoQuestoes) {
    return (
      <main className="flex-1 flex items-center justify-center pt-24">
        <div className="text-center space-y-4">
          <span className="material-symbols-outlined text-primary text-4xl animate-spin">progress_activity</span>
          <p className="text-sm text-on-surface-variant">Preparando questões sobre <span className="font-semibold text-primary">{tema}</span>...</p>
        </div>
      </main>
    );
  }

  if (erroQuestoes) {
    return (
      <main className="flex-1 flex items-center justify-center pt-24">
        <div className="text-center space-y-4">
          <span className="material-symbols-outlined text-error text-4xl">error</span>
          <p className="text-sm text-error">{erroQuestoes}</p>
        </div>
      </main>
    );
  }

  // Sem questões disponíveis para o tema: explica e volta.
  if (questoes.length === 0) {
    return (
      <main className="flex-1 flex items-center justify-center pt-24 px-6">
        <div className="text-center space-y-6 max-w-md">
          <span className="material-symbols-outlined text-primary text-4xl">hourglass_empty</span>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            {aviso ?? "Não há questões disponíveis para este tema agora."}
          </p>
          <button
            onClick={() => navigate("/perguntas")}
            className="primary-gradient text-white px-8 py-3 rounded-xl font-headline font-bold"
          >
            Escolher outro tema
          </button>
        </div>
      </main>
    );
  }

  // Quiz concluído: a avaliação de satisfação é obrigatória antes do resultado e do feedback.
  if (fim && precisaAvaliar) {
    return (
      <main className="pt-32 pb-20 px-6 max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined text-primary text-4xl">rate_review</span>
          </div>
          <h1 className="font-headline text-4xl font-bold text-primary">Quiz concluído!</h1>
          <p className="text-on-surface-variant text-lg max-w-xl mx-auto">
            Antes de ver seu resultado e o feedback, conte como foi este quiz de{" "}
            <span className="font-semibold text-primary">{tema}</span>.
          </p>
        </div>
        <AvaliacaoQuiz quizId={quizId} onConcluida={concluirAvaliacao} textoBotao="Enviar e ver meu resultado" />
      </main>
    );
  }

  if (fim) {
    return (
      <QuizResultado
        questoes={questoes}
        respostas={respostas}
        gabarito={gabarito}
        erroGabarito={erroGabarito}
        registro={registro}
      />
    );
  }

  // O backend só envia o gabarito depois de registrar a resposta (e só no modo com feedback).
  const temGabarito = respostaConfirmada && q.correta !== undefined;
  const alternativaEscolhida = feedback?.explicacoes_alternativas?.[respostaSelecionada];

  return (
    <main className="flex-1 flex flex-col relative overflow-hidden bg-surface">
      <section className="flex-1 overflow-y-auto pt-24 pb-32 px-6 md:px-12 lg:px-24 xl:px-48">

        {aviso && questaoAtual === 0 && (
          <div role="status" className="max-w-3xl mx-auto mb-6 p-4 bg-surface-container rounded-2xl border border-outline-variant/10 text-sm text-on-surface-variant">
            {aviso}
          </div>
        )}

        {/* Progresso */}
        <div className="max-w-3xl mx-auto mb-10 space-y-2">
          <div className="flex justify-between items-center text-xs text-on-surface-variant">
            <span className="flex items-center gap-3">
              <span className="font-label uppercase tracking-widest">
                Questão {questaoAtual + 1} de {questoes.length}
              </span>
              {NIVEIS[q.dificuldade] && (
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${NIVEIS[q.dificuldade].estilo}`}
                  aria-label={`Nível da questão: ${NIVEIS[q.dificuldade].rotulo}`}
                >
                  {NIVEIS[q.dificuldade].rotulo}
                </span>
              )}
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
              <p className="font-medium text-sm text-on-surface-variant mb-3">Questão</p>
              <p className="text-on-surface text-lg font-medium leading-relaxed whitespace-pre-line">{q.pergunta}</p>
            </div>
          </div>

          {/* Opções */}
          <div className="space-y-3">
            {q.opcoes.map((opcao, i) => {
              let estilo = "bg-surface-container-lowest border-outline-variant/20 hover:border-primary/30 hover:bg-surface-container-low";
              if (temGabarito) {
                if (i === q.correta) estilo = "bg-tertiary/5 border-tertiary/30 text-tertiary";
                else if (i === respostaSelecionada) estilo = "bg-error/5 border-error/30 text-error";
                else estilo = "bg-surface-container-lowest border-outline-variant/10 opacity-50";
              } else if (respostaConfirmada) {
                // Sem feedback: a resposta fica registrada, sem indicar certo ou errado.
                estilo = i === respostaSelecionada
                  ? "bg-primary/[0.04] border-primary/30"
                  : "bg-surface-container-lowest border-outline-variant/10 opacity-50";
              } else if (respostaSelecionada === i) {
                estilo = "bg-primary/[0.04] border-primary/30";
              }

              return (
                <button
                  key={i}
                  disabled={respostaConfirmada || enviando}
                  onClick={() => setRespostaSelecionada(i)}
                  className={`w-full flex items-center gap-4 p-5 rounded-2xl border transition-all duration-200 text-left ${estilo}`}
                >
                  <span className={`w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0 text-xs font-bold transition-all
                    ${respostaSelecionada === i && !respostaConfirmada ? "border-primary bg-primary text-white" : "border-outline-variant/40 text-on-surface-variant"}
                    ${respostaConfirmada && !temGabarito && i === respostaSelecionada ? "border-primary bg-primary text-white" : ""}
                    ${temGabarito && i === q.correta ? "border-tertiary bg-tertiary text-white" : ""}
                    ${temGabarito && i === respostaSelecionada && i !== q.correta ? "border-error bg-error text-white" : ""}
                  `}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="text-sm font-medium">{opcao}</span>
                  {temGabarito && i === q.correta && (
                    <span className="material-symbols-outlined text-tertiary ml-auto text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  )}
                  {temGabarito && i === respostaSelecionada && i !== q.correta && (
                    <span className="material-symbols-outlined text-error ml-auto text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>cancel</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Explicação: só depois de registrada a resposta, e só no modo com_feedback */}
          {temGabarito && (
            <div className="space-y-3">
              <div className="flex gap-4 p-5 bg-surface-container rounded-2xl border border-outline-variant/10">
                <span className="material-symbols-outlined text-secondary shrink-0">info</span>
                <div className="space-y-2">
                  <p className="text-sm text-on-surface-variant leading-relaxed">{q.explicacao}</p>
                  {feedback?.fontes?.length > 0 && (
                    <p className="text-xs text-on-surface-variant/80">
                      <span className="font-semibold">Referências Bibliográficas:</span>{" "}
                      {feedback.fontes.join(" · ")}
                    </p>
                  )}
                </div>
              </div>
              {respostaSelecionada !== q.correta && alternativaEscolhida?.explicacao && (
                <div className="flex gap-4 p-5 bg-error/5 rounded-2xl border border-error/10">
                  <span className="material-symbols-outlined text-error shrink-0">cancel</span>
                  <p className="text-sm text-on-surface-variant leading-relaxed">
                    <span className="font-semibold">Por que a alternativa {String.fromCharCode(65 + respostaSelecionada)} está incorreta: </span>
                    {alternativaEscolhida.explicacao}
                  </p>
                </div>
              )}
            </div>
          )}
          {respostaConfirmada && !temGabarito && modo === "sem_feedback" && (
            <p className="text-sm text-on-surface-variant text-center">
              Resposta registrada. O gabarito com as justificativas aparece ao final.
            </p>
          )}
          {erroResposta && (
            <p role="alert" className="text-sm text-error text-center">
              Não foi possível registrar sua resposta: {erroResposta}. Tente confirmar novamente.
            </p>
          )}
        </div>
      </section>

      {/* Botões */}
      <footer className="absolute bottom-0 left-0 w-full px-6 md:px-12 lg:px-24 xl:px-48 pb-8 pt-4 bg-gradient-to-t from-surface via-surface to-transparent">
        <div className="max-w-3xl mx-auto">
          {!respostaConfirmada ? (
            <button
              onClick={confirmar}
              disabled={respostaSelecionada === null || enviando}
              className="w-full primary-gradient text-white py-4 rounded-2xl font-headline font-bold text-base hover:shadow-lg transition-all duration-300 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {enviando ? "Registrando..." : "Confirmar Resposta"}
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
