import { usePerguntas } from "../hooks/usePerguntas";
import { TEMAS_QUIZ, SIMULADO_MISTO, QUESTOES_POR_TEMA } from "../data/temasQuiz";

export default function Perguntas() {
  const { temas, simulado, todos, alternarTema, alternarTodos, modo, setModo, iniciar } = usePerguntas();

  return (
    <main className="pt-32 pb-20 px-6 max-w-6xl mx-auto">
      <section className="mb-16 grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
        <div className="md:col-span-8">
          <span className="inline-block px-3 py-1 bg-surface-container-high text-primary font-label text-[10px] tracking-[0.2em] uppercase mb-4 rounded-sm">
            Configuração de Estudo
          </span>
          <h1 className="font-headline text-5xl md:text-6xl font-bold tracking-tight text-primary leading-tight">
            Prepare sua sessão de estudo.
          </h1>
        </div>
        <div className="md:col-span-4 text-right">
          <p className="text-on-surface-variant text-lg max-w-xs ml-auto border-l-2 border-outline-variant/30 pl-6 py-2">
            Escolha os temas e a modalidade de feedback para começar.
          </p>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7 space-y-12">
          {/* 01 — Tema */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <span className="text-primary font-headline text-2xl font-semibold">
                01
              </span>
              <h2 className="font-headline text-2xl font-medium text-on-surface">
                Quais temas você quer estudar?
              </h2>
            </div>
            <p className="text-sm text-on-surface-variant -mt-2">
              Marque um tema para um quiz de {QUESTOES_POR_TEMA} questões, ou dois ou mais para um simulado de{" "}
              {SIMULADO_MISTO.questoes} questões só com os temas escolhidos.
            </p>
            {/* Seleciona (ou limpa) todos os temas: o simulado misto completo */}
            <button
              type="button"
              onClick={alternarTodos}
              aria-pressed={todos}
              className={`w-full flex items-center gap-4 text-left p-5 rounded-xl border-l-4 shadow-sm transition-all ${
                todos
                  ? "border-primary bg-primary/[0.04]"
                  : "border-transparent bg-surface-container-lowest hover:bg-surface-container-low"
              }`}
            >
              <span className="material-symbols-outlined text-primary shrink-0">shuffle</span>
              <span className="flex-grow">
                <span className="block font-headline font-bold text-on-surface">{SIMULADO_MISTO.titulo}</span>
                <span className="block text-sm text-on-surface-variant">
                  {SIMULADO_MISTO.questoes} questões de todos os temas, em níveis variados.
                </span>
              </span>
              <span className="material-symbols-outlined text-primary shrink-0">
                {todos ? "check_box" : "check_box_outline_blank"}
              </span>
            </button>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {TEMAS_QUIZ.map(({ id, titulo }) => {
                const selecionado = temas.includes(titulo);
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => alternarTema(titulo)}
                    aria-pressed={selecionado}
                    className={`flex items-center gap-4 text-left p-4 rounded-xl border-l-4 shadow-sm transition-all ${
                      selecionado
                        ? "border-primary bg-primary/[0.04]"
                        : "border-transparent bg-surface-container-lowest hover:bg-surface-container-low"
                    }`}
                  >
                    <span
                      className={`font-headline text-sm font-semibold shrink-0 w-6 ${
                        selecionado ? "text-primary" : "text-on-surface-variant"
                      }`}
                    >
                      {String(id).padStart(2, "0")}
                    </span>
                    <span className="text-sm font-medium leading-snug text-on-surface">
                      {titulo}
                    </span>
                    <span className="material-symbols-outlined text-primary ml-auto shrink-0">
                      {selecionado ? "check_box" : "check_box_outline_blank"}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 02 — Modalidade */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <span className="text-primary font-headline text-2xl font-semibold">
                02
              </span>
              <h2 className="font-headline text-2xl font-medium text-on-surface">
                Modalidade de Feedback
              </h2>
            </div>
            <div className="space-y-4">
              <label className="flex group cursor-pointer">
                <input
                  checked={modo === "com_feedback"}
                  onChange={() => setModo("com_feedback")}
                  className="peer sr-only"
                  name="mode"
                  type="radio"
                  value="com_feedback"
                />
                <div className="w-full flex items-center p-6 bg-surface-container-lowest rounded-xl border-l-4 border-transparent peer-checked:border-primary peer-checked:bg-primary/[0.02] shadow-sm transition-all group-hover:bg-surface-container-low">
                  <div className="p-3 bg-secondary/10 rounded-lg mr-6">
                    <span className="material-symbols-outlined text-secondary">
                      lightbulb
                    </span>
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-headline font-bold text-on-surface">
                      Com Feedback
                    </h3>
                    <p className="text-sm text-on-surface-variant">
                      Explicação científica exibida após cada resposta.
                    </p>
                  </div>
                  <div className="peer-checked:flex hidden ml-4">
                    <span className="material-symbols-outlined text-primary">
                      radio_button_checked
                    </span>
                  </div>
                </div>
              </label>

              <label className="flex group cursor-pointer">
                <input
                  checked={modo === "sem_feedback"}
                  onChange={() => setModo("sem_feedback")}
                  className="peer sr-only"
                  name="mode"
                  type="radio"
                  value="sem_feedback"
                />
                <div className="w-full flex items-center p-6 bg-surface-container-lowest rounded-xl border-l-4 border-transparent peer-checked:border-primary peer-checked:bg-primary/[0.02] shadow-sm transition-all group-hover:bg-surface-container-low">
                  <div className="p-3 bg-tertiary/10 rounded-lg mr-6">
                    <span className="material-symbols-outlined text-tertiary">
                      timer
                    </span>
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-headline font-bold text-on-surface">
                      Sem Feedback
                    </h3>
                    <p className="text-sm text-on-surface-variant">
                      Simulação de exame. Revisão completa apenas no final.
                    </p>
                  </div>
                  <div className="peer-checked:flex hidden ml-4">
                    <span className="material-symbols-outlined text-primary">
                      radio_button_checked
                    </span>
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Resumo */}
        <div className="lg:col-span-5">
          <div className="sticky top-32 space-y-6">
            <div className="bg-surface-container-low rounded-3xl p-8 space-y-8">
              <div>
                <h3 className="font-headline text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-6">
                  Resumo da Sessão
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-outline-variant/10">
                    <span className="text-sm text-on-surface-variant">
                      {temas.length > 1 ? "Temas" : "Tema"}
                    </span>
                    <span className="font-semibold text-primary truncate max-w-[160px] text-right">
                      {temas.length === 0 ? "—" : todos ? SIMULADO_MISTO.titulo : temas.length === 1 ? temas[0] : `${temas.length} temas`}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-outline-variant/10">
                    <span className="text-sm text-on-surface-variant">
                      Modalidade
                    </span>
                    <span className="font-semibold text-primary">
                      {modo === "com_feedback"
                        ? "Com Feedback"
                        : "Sem Feedback"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="text-sm text-on-surface-variant">
                      Quantidade
                    </span>
                    <span className="font-semibold text-primary">
                      {simulado ? SIMULADO_MISTO.questoes : QUESTOES_POR_TEMA} Questões
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={iniciar}
                disabled={temas.length === 0}
                className="w-full primary-gradient text-white py-5 rounded-xl font-headline font-bold text-lg hover:shadow-xl transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Começar
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>

              <p className="text-[10px] text-center text-on-surface-variant uppercase tracking-widest">
                Questões baseadas em{" "}
                <span className="text-primary font-bold">livros didáticos</span>
                , no modelo do ENAMED e geradas por Inteligência Artificial.
              </p>
            </div>

            <div className="p-6 bg-surface-container-highest/50 rounded-2xl flex gap-4 items-start">
              <span className="material-symbols-outlined text-secondary">
                info
              </span>
              <p className="text-xs leading-relaxed text-on-surface-variant">
                Cada questão traz a explicação do gabarito e as referências
                bibliográficas dos livros em que se baseia.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
