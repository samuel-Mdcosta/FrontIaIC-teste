import { useNavigate } from "react-router-dom";

export default function Inicio() {
  const navigate = useNavigate();

  return (
    <main className="pt-28 pb-20 px-6 max-w-6xl mx-auto">

      {/* Hero Section */}
      <section className="text-center py-16 space-y-6">
        <span className="inline-block px-3 py-1 bg-surface-container-high text-primary font-label text-[10px] tracking-[0.2em] uppercase rounded-sm">
          Iniciação Científica — Uniderp
        </span>
        <h1 className="font-headline text-5xl md:text-6xl font-bold tracking-tight text-primary leading-tight max-w-4xl mx-auto">
          Tutor Virtual de Neuromedicina com IA
        </h1>
        <p className="text-on-surface-variant text-lg max-w-2xl mx-auto leading-relaxed">
          Um sistema de tutoria baseado em <span className="text-primary font-semibold">RAG</span> (Retrieval-Augmented Generation) que responde perguntas e gera questões fundamentadas exclusivamente em literatura acadêmica verificada — sem alucinações.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
          <button
            onClick={() => navigate("/chat")}
            className="primary-gradient text-white px-10 py-5 rounded-xl font-headline font-bold text-lg hover:shadow-xl transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-3"
          >
            <span className="material-symbols-outlined">psychology</span>
            Conversar com a IA
          </button>
          <button
            onClick={() => navigate("/configuracao")}
            className="bg-surface-container-low border border-outline-variant text-primary px-10 py-5 rounded-xl font-headline font-bold text-lg hover:bg-surface-container hover:shadow-md transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-3"
          >
            <span className="material-symbols-outlined">quiz</span>
            Fazer Questões
          </button>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 space-y-10">
        <div className="text-center space-y-2">
          <span className="text-primary font-headline text-2xl font-semibold">Como funciona</span>
          <p className="text-on-surface-variant text-sm max-w-xl mx-auto">
            O sistema recupera trechos relevantes de PDFs acadêmicos e passa esse contexto para o modelo de linguagem — garantindo respostas embasadas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 bg-surface-container-lowest rounded-2xl shadow-sm space-y-4 border border-outline-variant/10">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary">description</span>
            </div>
            <h3 className="font-headline font-bold text-lg text-on-surface">Base de Conhecimento</h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              PDFs de artigos e livros de neurociência são processados, fragmentados semanticamente e armazenados como vetores no MongoDB Atlas.
            </p>
          </div>

          <div className="p-8 bg-surface-container-lowest rounded-2xl shadow-sm space-y-4 border border-outline-variant/10">
            <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-secondary">manage_search</span>
            </div>
            <h3 className="font-headline font-bold text-lg text-on-surface">Recuperação Semântica</h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Cada pergunta é convertida em embedding pelo modelo Nomic v1.5. Os 8 trechos mais relevantes da literatura são recuperados por similaridade vetorial.
            </p>
          </div>

          <div className="p-8 bg-surface-container-lowest rounded-2xl shadow-sm space-y-4 border border-outline-variant/10">
            <div className="w-12 h-12 rounded-xl bg-tertiary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-tertiary">neurology</span>
            </div>
            <h3 className="font-headline font-bold text-lg text-on-surface">Resposta Fundamentada</h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              O modelo Gemma 3 27B sintetiza a resposta usando apenas o contexto recuperado, eliminando alucinações comuns em LLMs de propósito geral.
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-10 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-8 bg-primary rounded-2xl text-white space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="material-symbols-outlined text-white/70">chat</span>
              <h3 className="font-headline text-2xl font-bold">Chat com o Tutor</h3>
              <p className="text-white/80 text-sm leading-relaxed">
                Faça perguntas livres sobre neurociência. O tutor busca nas referências acadêmicas e responde com embasamento científico real.
              </p>
            </div>
            <button
              onClick={() => navigate("/chat")}
              className="mt-4 bg-white text-primary font-headline font-bold py-4 rounded-xl hover:bg-white/90 transition-all flex items-center justify-center gap-2"
            >
              Acessar Chat
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>

          <div className="p-8 bg-surface-container-low rounded-2xl space-y-4 flex flex-col justify-between border border-outline-variant/10">
            <div className="space-y-3">
              <span className="material-symbols-outlined text-secondary">quiz</span>
              <h3 className="font-headline text-2xl font-bold text-on-surface">Questões & Quiz</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">
                Gere questões de múltipla escolha fundamentadas na literatura. Configure o nível de dificuldade e a modalidade de feedback antes de começar.
              </p>
            </div>
            <button
              onClick={() => navigate("/configuracao")}
              className="mt-4 border-2 border-primary text-primary font-headline font-bold py-4 rounded-xl hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2"
            >
              Configurar Sessão
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
        </div>
      </section>

      {/* Stack Badge */}
      <section className="py-10 text-center space-y-4">
        <p className="text-[10px] uppercase tracking-widest text-on-surface-variant">Stack tecnológica</p>
        <div className="flex flex-wrap justify-center gap-3">
          {["Gemma 3 27B", "Nomic Embeddings", "MongoDB Atlas", "FastAPI", "RAG Pipeline"].map((tech) => (
            <span
              key={tech}
              className="px-4 py-2 bg-surface-container-high text-on-surface-variant text-xs font-label font-semibold rounded-full"
            >
              {tech}
            </span>
          ))}
        </div>
      </section>

    </main>
  );
}
