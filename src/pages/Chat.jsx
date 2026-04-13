import { useEffect, useRef } from "react";
import { useChat } from "../hooks/useChat";

export default function Chat() {
  const { mensagem, setMensagem, mensagens, enviar, handleKeyDown, carregando, erro } = useChat();
  const fimDaLista = useRef(null);

  // Scroll automático para a última mensagem
  useEffect(() => {
    fimDaLista.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensagens]);

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
          {mensagens.map((msg, i) =>
            msg.tipo === "ia" ? (
              <div key={i} className="flex gap-6 max-w-3xl">
                <div className="w-10 h-10 rounded-full bg-secondary-fixed flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-secondary">psychology</span>
                </div>
                <div className="space-y-2">
                  <p className="font-medium text-sm text-on-surface-variant">Synapse Core AI</p>
                  <div className="prose prose-slate max-w-none text-on-surface leading-relaxed">
                    <p>{msg.texto}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div key={i} className="flex gap-6 max-w-3xl ml-auto flex-row-reverse">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-primary">person</span>
                </div>
                <div className="bg-surface-container-low p-4 rounded-2xl rounded-tr-none">
                  <p className="text-on-surface text-sm">{msg.texto}</p>
                </div>
              </div>
            )
          )}

          {carregando && (
            <div className="flex gap-6 max-w-3xl">
              <div className="w-10 h-10 rounded-full bg-secondary-fixed flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-secondary">psychology</span>
              </div>
              <div className="flex items-center gap-2 text-on-surface-variant text-sm">
                <span className="material-symbols-outlined animate-spin text-base">progress_activity</span>
                Analisando literatura...
              </div>
            </div>
          )}

          <div ref={fimDaLista} />
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
              value={mensagem}
              onChange={(e) => setMensagem(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={carregando}
            />
            <div className="flex items-center gap-1">
              <button
                onClick={enviar}
                disabled={!mensagem.trim() || carregando}
                className="bg-gradient-to-br from-primary to-primary-container text-white h-12 w-12 flex items-center justify-center rounded-full transition-transform active:scale-90 hover:shadow-lg shadow-primary/20 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined">
                  {carregando ? "progress_activity" : "send"}
                </span>
              </button>
            </div>
          </div>
          {erro && (
            <p className="text-center text-[10px] text-error mt-2 font-medium">
              Erro ao enviar: {erro}
            </p>
          )}
          <p className="text-center text-[10px] text-slate-400 mt-4 font-medium tracking-wide">
            O Synapse Academic pode cometer erros em diagnósticos complexos.
            Verifique as fontes em sua biblioteca.
          </p>
        </div>
      </footer>
    </main>
  );
}
