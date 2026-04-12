export default function Chat() {
  return (
    <main className="flex-1 flex flex-col relative overflow-hidden bg-surface">
      {/* Chat Area */}
      <section className="flex-1 overflow-y-auto pt-24 pb-40 px-6 md:px-12 lg:px-24 xl:px-48 space-y-12">
        {/* Welcome Header */}
        <div className="text-center space-y-4 py-12">
          <h2 className="text-4xl md:text-5xl font-extrabold font-headline text-primary tracking-tight">
            Olá, Pesquisador.
          </h2>
          <p className="text-lg text-secondary font-medium max-w-2xl mx-auto leading-relaxed">
            Bem-vindo ao seu ambiente de análise avançada. Como posso auxiliar
            nos seus estudos de neuromedicina hoje?
          </p>
        </div>

        {/* Chat Messages */}
        <div className="flex flex-col space-y-10">
          {/* AI Message */}
          <div className="flex gap-6 max-w-3xl">
            <div className="w-10 h-10 rounded-full bg-secondary-fixed flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-secondary">
                psychology
              </span>
            </div>
            <div className="space-y-4">
              <div className="prose prose-slate max-w-none text-on-surface leading-relaxed">
                <p className="font-medium mb-2">Synapse Core AI</p>
                <p>
                  Eu analisei os dados da última sessão sobre o sistema límbico.
                  O estudante de neuromedicina pode se beneficiar ao explorar a
                  intersecção entre a amígdala e as respostas de medo
                  condicionado.
                </p>
                <p>
                  Deseja que eu prepare uma revisão detalhada sobre a
                  potenciação de longa duração (LTP) ou prefere focar em
                  anatomia clínica?
                </p>
              </div>
            </div>
          </div>

          {/* User Message */}
          <div className="flex gap-6 max-w-3xl ml-auto flex-row-reverse">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-primary">
                person
              </span>
            </div>
            <div className="bg-surface-container-low p-4 rounded-2xl rounded-tr-none">
              <p className="text-on-surface-variant text-sm italic">
                Digitando análise técnica...
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Input Area */}
      <footer className="absolute bottom-0 left-0 w-full px-6 md:px-12 lg:px-24 xl:px-48 pb-8 pt-4 bg-gradient-to-t from-surface via-surface to-transparent">
        <div className="relative max-w-4xl mx-auto group">
          <div className="absolute inset-0 bg-primary/5 rounded-[2rem] blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
          <div className="relative flex items-end gap-2 bg-surface-container-low rounded-[2rem] p-3 shadow-sm transition-all focus-within:bg-white focus-within:shadow-lg">
            <textarea
              className="w-full bg-transparent border-none focus:ring-0 py-3 text-on-surface placeholder:text-slate-400 resize-none max-h-48 min-h-[56px] font-medium leading-relaxed"
              placeholder="Faça uma pergunta sobre neurociência..."
              rows="1"
            />
            <div className="flex items-center gap-1">
              <button className="bg-gradient-to-br from-primary to-primary-container text-white h-12 w-12 flex items-center justify-center rounded-full transition-transform active:scale-90 hover:shadow-lg shadow-primary/20">
                <span className="material-symbols-outlined">send</span>
              </button>
            </div>
          </div>
          <p className="text-center text-[10px] text-slate-400 mt-4 font-medium tracking-wide">
            O Synapse Academic pode cometer erros em diagnósticos complexos.
            Verifique as fontes em sua biblioteca.
          </p>
        </div>
      </footer>
    </main>
  );
}
