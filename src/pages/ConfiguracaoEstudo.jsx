export default function ConfiguracaoEstudo() {
  return (
    <main className="pt-32 pb-20 px-6 max-w-6xl mx-auto">
      {/* Editorial Header Section */}
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
            Ajuste os parâmetros cognitivos para otimizar sua retenção de dados neurocientíficos.
          </p>
        </div>
      </section>

      {/* Configuration Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Difficulty & Mode Selection */}
        <div className="lg:col-span-7 space-y-12">

          {/* Choose Difficulty */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <span className="text-primary font-headline text-2xl font-semibold">01</span>
              <h2 className="font-headline text-2xl font-medium text-on-surface">Nível de Complexidade</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

              {/* Difficulty Card: Iniciante */}
              <label className="group cursor-pointer relative">
                <input defaultChecked className="peer sr-only" name="difficulty" type="radio" value="iniciante" />
                <div className="h-full p-6 bg-surface-container-lowest border border-transparent peer-checked:border-primary/20 peer-checked:bg-primary/[0.02] rounded-xl transition-all duration-300 group-hover:bg-surface-container-low shadow-sm group-active:scale-[0.98]">
                  <div className="flex flex-col h-full justify-between">
                    <span className="material-symbols-outlined text-primary mb-4">clinical_notes</span>
                    <div>
                      <h3 className="font-headline font-bold text-lg mb-1">Iniciante</h3>
                      <p className="text-xs text-on-surface-variant leading-relaxed">Fundamentos e conceitos base da neurologia.</p>
                    </div>
                  </div>
                </div>
                <div className="absolute top-4 right-4 opacity-0 peer-checked:opacity-100 transition-opacity">
                  <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                </div>
              </label>

              {/* Difficulty Card: Intermediário */}
              <label className="group cursor-pointer relative">
                <input className="peer sr-only" name="difficulty" type="radio" value="intermediario" />
                <div className="h-full p-6 bg-surface-container-lowest border border-transparent peer-checked:border-primary/20 peer-checked:bg-primary/[0.02] rounded-xl transition-all duration-300 group-hover:bg-surface-container-low shadow-sm group-active:scale-[0.98]">
                  <div className="flex flex-col h-full justify-between">
                    <span className="material-symbols-outlined text-primary mb-4">neurology</span>
                    <div>
                      <h3 className="font-headline font-bold text-lg mb-1">Intermediário</h3>
                      <p className="text-xs text-on-surface-variant leading-relaxed">Casos clínicos e diagnósticos funcionais.</p>
                    </div>
                  </div>
                </div>
                <div className="absolute top-4 right-4 opacity-0 peer-checked:opacity-100 transition-opacity">
                  <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                </div>
              </label>

              {/* Difficulty Card: Avançado */}
              <label className="group cursor-pointer relative">
                <input className="peer sr-only" name="difficulty" type="radio" value="avancado" />
                <div className="h-full p-6 bg-surface-container-lowest border border-transparent peer-checked:border-primary/20 peer-checked:bg-primary/[0.02] rounded-xl transition-all duration-300 group-hover:bg-surface-container-low shadow-sm group-active:scale-[0.98]">
                  <div className="flex flex-col h-full justify-between">
                    <span className="material-symbols-outlined text-primary mb-4">psychology</span>
                    <div>
                      <h3 className="font-headline font-bold text-lg mb-1">Avançado</h3>
                      <p className="text-xs text-on-surface-variant leading-relaxed">Pesquisa acadêmica e neurofisiologia densa.</p>
                    </div>
                  </div>
                </div>
                <div className="absolute top-4 right-4 opacity-0 peer-checked:opacity-100 transition-opacity">
                  <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                </div>
              </label>

            </div>
          </div>

          {/* Choose Session Mode */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <span className="text-primary font-headline text-2xl font-semibold">02</span>
              <h2 className="font-headline text-2xl font-medium text-on-surface">Modalidade de Feedback</h2>
            </div>
            <div className="space-y-4">

              {/* Mode Option: Com Feedback */}
              <label className="flex group cursor-pointer">
                <input defaultChecked className="peer sr-only" name="mode" type="radio" value="com_feedback" />
                <div className="w-full flex items-center p-6 bg-surface-container-lowest rounded-xl border-l-4 border-transparent peer-checked:border-primary peer-checked:bg-primary/[0.02] shadow-sm transition-all group-hover:bg-surface-container-low">
                  <div className="p-3 bg-secondary/10 rounded-lg mr-6">
                    <span className="material-symbols-outlined text-secondary">lightbulb</span>
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-headline font-bold text-on-surface">Com Feedback</h3>
                    <p className="text-sm text-on-surface-variant">Resposta imediata e explicação científica após cada questão.</p>
                  </div>
                  <div className="peer-checked:flex hidden ml-4">
                    <span className="material-symbols-outlined text-primary">radio_button_checked</span>
                  </div>
                </div>
              </label>

              {/* Mode Option: Sem Feedback */}
              <label className="flex group cursor-pointer">
                <input className="peer sr-only" name="mode" type="radio" value="sem_feedback" />
                <div className="w-full flex items-center p-6 bg-surface-container-lowest rounded-xl border-l-4 border-transparent peer-checked:border-primary peer-checked:bg-primary/[0.02] shadow-sm transition-all group-hover:bg-surface-container-low">
                  <div className="p-3 bg-tertiary/10 rounded-lg mr-6">
                    <span className="material-symbols-outlined text-tertiary">timer</span>
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-headline font-bold text-on-surface">Sem Feedback</h3>
                    <p className="text-sm text-on-surface-variant">Simulação de exame real. Resultados e revisões ao final da sessão.</p>
                  </div>
                  <div className="peer-checked:flex hidden ml-4">
                    <span className="material-symbols-outlined text-primary">radio_button_checked</span>
                  </div>
                </div>
              </label>

            </div>
          </div>
        </div>

        {/* Right Column: Summary & CTA */}
        <div className="lg:col-span-5">
          <div className="sticky top-32 space-y-6">
            <div className="bg-surface-container-low rounded-3xl p-8 space-y-8">
              <div>
                <h3 className="font-headline text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-6">
                  Resumo da Sessão
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-outline-variant/10">
                    <span className="text-sm text-on-surface-variant">Duração Estimada</span>
                    <span className="font-semibold text-primary">45 minutos</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-outline-variant/10">
                    <span className="text-sm text-on-surface-variant">Volume de Dados</span>
                    <span className="font-semibold text-primary">24 Questões</span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="text-sm text-on-surface-variant">Metodologia</span>
                    <span className="font-semibold text-primary">Cognição Ativa</span>
                  </div>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-2xl bg-primary h-32 flex items-center px-8 text-white">
                <div className="z-10">
                  <p className="text-xs uppercase tracking-tighter opacity-80 mb-1">Próxima Etapa</p>
                  <h4 className="font-headline text-xl font-bold">Mapeamento Sináptico</h4>
                </div>
                <img
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBtiagTVWr6r32E1iN8ZvB_MeCH5I2C06O5NZPF9LwHafnDtUKJ-sceuJFy_oYMCg08JIFvUJQM7pJT-EC9XFsmc6aTzuBLFPbARdhSRIRVewajX40sIm133wVwtKXrWaS87gI00Y80w-Yt9kiNO6cbi_xJi9sCa0nggfdHSZjZP-ADFYOocJEQzR6E-dIqHIbm-pEOEV1D5mLx0XIAHag8r2VC0w_S_7DVMokarMNdTk8naZ5dp87t-SNzrpR432l3Rt8C9u97RBUb"
                />
              </div>

              <button className="w-full primary-gradient text-white py-5 rounded-xl font-headline font-bold text-lg hover:shadow-xl transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-3">
                Começar Sessão
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>

              <p className="text-[10px] text-center text-on-surface-variant uppercase tracking-widest">
                Ao iniciar, você concorda com as diretrizes do{" "}
                <span className="text-primary font-bold">Comitê de Ética</span>.
              </p>
            </div>

            {/* Informational Card */}
            <div className="p-6 bg-surface-container-highest/50 rounded-2xl flex gap-4 items-start">
              <span className="material-symbols-outlined text-secondary">info</span>
              <p className="text-xs leading-relaxed text-on-surface-variant">
                Seus resultados serão processados pelo motor de IA para personalizar seu próximo dashboard de estudos.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
