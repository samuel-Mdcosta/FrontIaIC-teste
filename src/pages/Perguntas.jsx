import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Perguntas() {
  const [tema, setTema] = useState("");
  const [modo, setModo] = useState("com_feedback");
  const navigate = useNavigate();

  function iniciar() {
    if (!tema.trim()) return;
    navigate("/quiz", { state: { tema, modo } });
  }

  return (
    <main className="pt-32 pb-20 px-6 max-w-6xl mx-auto">
      <section className="mb-16 grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
        <div className="md:col-span-8">
          <span className="inline-block px-3 py-1 bg-surface-container-high text-primary font-label text-[10px] tracking-[0.2em] uppercase mb-4 rounded-sm">
            Configuração de Estudo
          </span>
          <h1 className="font-headline text-5xl md:text-6xl font-bold tracking-tight text-primary leading-tight">
            Prepare seu ambiente de pesquisa.
          </h1>
        </div>
        <div className="md:col-span-4 text-right">
          <p className="text-on-surface-variant text-lg max-w-xs ml-auto border-l-2 border-outline-variant/30 pl-6 py-2">
            Defina o tema e a modalidade para gerar suas questões com IA.
          </p>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7 space-y-12">

          {/* 01 — Tema */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <span className="text-primary font-headline text-2xl font-semibold">01</span>
              <h2 className="font-headline text-2xl font-medium text-on-surface">Qual será o tema do seu estudo?</h2>
            </div>
            <div className="relative group">
              <div className="absolute inset-0 bg-primary/5 rounded-[2rem] blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
              <div className="relative flex items-center gap-2 bg-surface-container-low rounded-[2rem] p-3 shadow-sm transition-all focus-within:bg-white focus-within:shadow-lg">
                <input
                  type="text"
                  value={tema}
                  onChange={(e) => setTema(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && iniciar()}
                  className="w-full bg-transparent border-none focus:ring-0 px-3 py-3 text-on-surface placeholder:text-slate-400 font-medium leading-relaxed"
                  placeholder="Ex: Plasticidade sináptica, Sistema límbico..."
                />
                <button
                  onClick={iniciar}
                  disabled={!tema.trim()}
                  className="bg-gradient-to-br from-primary to-primary-container text-white h-12 w-12 flex items-center justify-center rounded-full transition-transform active:scale-90 hover:shadow-lg shadow-primary/20 shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined">send</span>
                </button>
              </div>
            </div>
          </div>

          {/* 02 — Modalidade */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <span className="text-primary font-headline text-2xl font-semibold">02</span>
              <h2 className="font-headline text-2xl font-medium text-on-surface">Modalidade de Feedback</h2>
            </div>
            <div className="space-y-4">
              <label className="flex group cursor-pointer">
                <input checked={modo === "com_feedback"} onChange={() => setModo("com_feedback")} className="peer sr-only" name="mode" type="radio" value="com_feedback" />
                <div className="w-full flex items-center p-6 bg-surface-container-lowest rounded-xl border-l-4 border-transparent peer-checked:border-primary peer-checked:bg-primary/[0.02] shadow-sm transition-all group-hover:bg-surface-container-low">
                  <div className="p-3 bg-secondary/10 rounded-lg mr-6">
                    <span className="material-symbols-outlined text-secondary">lightbulb</span>
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-headline font-bold text-on-surface">Com Feedback</h3>
                    <p className="text-sm text-on-surface-variant">Explicação científica exibida após cada resposta.</p>
                  </div>
                  <div className="peer-checked:flex hidden ml-4">
                    <span className="material-symbols-outlined text-primary">radio_button_checked</span>
                  </div>
                </div>
              </label>

              <label className="flex group cursor-pointer">
                <input checked={modo === "sem_feedback"} onChange={() => setModo("sem_feedback")} className="peer sr-only" name="mode" type="radio" value="sem_feedback" />
                <div className="w-full flex items-center p-6 bg-surface-container-lowest rounded-xl border-l-4 border-transparent peer-checked:border-primary peer-checked:bg-primary/[0.02] shadow-sm transition-all group-hover:bg-surface-container-low">
                  <div className="p-3 bg-tertiary/10 rounded-lg mr-6">
                    <span className="material-symbols-outlined text-tertiary">timer</span>
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-headline font-bold text-on-surface">Sem Feedback</h3>
                    <p className="text-sm text-on-surface-variant">Simulação de exame. Revisão completa apenas no final.</p>
                  </div>
                  <div className="peer-checked:flex hidden ml-4">
                    <span className="material-symbols-outlined text-primary">radio_button_checked</span>
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
                    <span className="text-sm text-on-surface-variant">Tema</span>
                    <span className="font-semibold text-primary truncate max-w-[160px] text-right">{tema || "—"}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-outline-variant/10">
                    <span className="text-sm text-on-surface-variant">Modalidade</span>
                    <span className="font-semibold text-primary">{modo === "com_feedback" ? "Com Feedback" : "Sem Feedback"}</span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="text-sm text-on-surface-variant">Geração</span>
                    <span className="font-semibold text-primary">IA — RAG</span>
                  </div>
                </div>
              </div>

              <button
                onClick={iniciar}
                disabled={!tema.trim()}
                className="w-full primary-gradient text-white py-5 rounded-xl font-headline font-bold text-lg hover:shadow-xl transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Gerar Questões
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>

              <p className="text-[10px] text-center text-on-surface-variant uppercase tracking-widest">
                As questões são geradas com base na{" "}
                <span className="text-primary font-bold">literatura acadêmica</span>.
              </p>
            </div>

            <div className="p-6 bg-surface-container-highest/50 rounded-2xl flex gap-4 items-start">
              <span className="material-symbols-outlined text-secondary">info</span>
              <p className="text-xs leading-relaxed text-on-surface-variant">
                O motor RAG recupera trechos dos PDFs acadêmicos para fundamentar cada questão gerada.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
