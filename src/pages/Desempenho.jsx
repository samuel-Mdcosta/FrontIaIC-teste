import { useNavigate } from "react-router-dom";
import FeedbackDesempenho from "../components/FeedbackDesempenho";
import { useDesempenho } from "../hooks/useDesempenho";
import { TEMAS_QUIZ } from "../data/temasQuiz";
import { formatarTaxa, nivelInfo, temaPraticavel, TENDENCIAS } from "../utils/desempenho";

export default function Desempenho() {
  const navigate = useNavigate();
  const { resumo, carregando, erro, recarregar, feedback } = useDesempenho();

  if (carregando) {
    return (
      <main className="flex-1 flex items-center justify-center pt-24">
        <div className="text-center space-y-3">
          <span className="material-symbols-outlined text-primary text-4xl animate-spin">progress_activity</span>
          <p className="text-sm text-on-surface-variant">Carregando seu desempenho...</p>
        </div>
      </main>
    );
  }

  if (erro) {
    return (
      <main className="flex-1 flex items-center justify-center pt-24">
        <div className="text-center space-y-3">
          <span className="material-symbols-outlined text-error text-4xl">error</span>
          <p className="text-sm text-error">{erro}</p>
          <button onClick={recarregar} className="text-xs text-primary underline">
            Tentar novamente
          </button>
        </div>
      </main>
    );
  }

  const temas = resumo.desempenho_por_tema ?? [];
  const naoPraticados = resumo.temas_nao_praticados ?? [];
  const praticar = (tema) => navigate("/perguntas", { state: { tema } });

  return (
    <main className="flex-1 w-full pt-28 pb-20 px-6 max-w-5xl mx-auto space-y-12">
      <section className="space-y-4">
        <span className="inline-block px-3 py-1 bg-surface-container-high text-primary font-label text-[10px] tracking-[0.2em] uppercase rounded-sm">
          Feedback de Desempenho
        </span>
        <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight text-primary">Meu Desempenho</h1>
        <p className="text-on-surface-variant text-lg max-w-2xl">
          Veja em quais áreas você vai bem, onde precisa focar e o que estudar a seguir.
        </p>
      </section>

      {resumo.tentativas === 0 ? (
        <section className="p-10 bg-surface-container-low rounded-3xl text-center space-y-6">
          <span className="material-symbols-outlined text-secondary text-5xl">insights</span>
          <p className="text-on-surface-variant max-w-md mx-auto">
            Você ainda não concluiu nenhuma lista de exercícios. Faça a primeira para receber o feedback do tutor sobre o seu desempenho.
          </p>
          <button
            onClick={() => navigate("/perguntas")}
            className="primary-gradient text-white px-10 py-4 rounded-xl font-headline font-bold hover:shadow-xl transition-all inline-flex items-center gap-2"
          >
            <span className="material-symbols-outlined">quiz</span>
            Fazer Questões
          </button>
        </section>
      ) : (
        <>
          {/* Números gerais */}
          <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Indicador valor={resumo.questoes_respondidas} rotulo="Questões respondidas" />
            <Indicador valor={formatarTaxa(resumo.taxa_acerto)} rotulo="Taxa de acerto geral" />
            {/* Só os temas atuais: tentativas antigas podem ter temas que saíram da lista. */}
            <Indicador valor={`${temas.filter((t) => temaPraticavel(t.tema)).length}/${TEMAS_QUIZ.length}`} rotulo="Temas praticados" />
          </section>

          {/* Feedback da IA */}
          <section className="space-y-4">
            <h2 className="font-headline text-sm font-bold uppercase tracking-widest text-on-surface-variant">
              Análise do tutor
            </h2>
            <FeedbackDesempenho
              dados={feedback.dados}
              carregando={feedback.carregando}
              erro={feedback.erro}
              onTentarNovamente={feedback.recarregar}
            />
          </section>

          {/* Desempenho por tema */}
          <section className="space-y-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="font-headline text-sm font-bold uppercase tracking-widest text-on-surface-variant">
                Desempenho por tema
              </h2>
              <p className="text-xs text-on-surface-variant">Nível calculado com as suas 3 últimas tentativas de cada tema</p>
            </div>
            <div className="bg-surface-container-lowest rounded-3xl shadow-sm divide-y divide-outline-variant/10 overflow-hidden">
              {temas.map((tema) => (
                <LinhaTema key={tema.tema} tema={tema} />
              ))}
            </div>
          </section>

          {naoPraticados.length > 0 && (
            <section className="space-y-4">
              <h2 className="font-headline text-sm font-bold uppercase tracking-widest text-on-surface-variant">
                Temas ainda não praticados
              </h2>
              <div className="flex flex-wrap gap-2">
                {naoPraticados.map((tema) => (
                  <button
                    key={tema}
                    type="button"
                    onClick={() => praticar(tema)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-surface-container-low hover:bg-surface-container text-sm font-medium text-on-surface rounded-xl transition-colors"
                  >
                    <span className="material-symbols-outlined text-base text-primary">add_circle</span>
                    {tema}
                  </button>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </main>
  );
}

function Indicador({ valor, rotulo }) {
  return (
    <div className="p-6 bg-surface-container-lowest rounded-2xl border border-outline-variant/10 text-center space-y-1">
      <span className="font-headline text-3xl font-bold text-primary">{valor}</span>
      <p className="text-[10px] uppercase tracking-widest text-on-surface-variant">{rotulo}</p>
    </div>
  );
}

function LinhaTema({ tema }) {
  const nivel = nivelInfo(tema.nivel);
  const tendencia = TENDENCIAS[tema.tendencia];
  const mostrarGeral = Math.round(tema.taxa_acerto) !== Math.round(tema.taxa_recente);

  return (
    <div className="flex flex-col md:flex-row md:items-center gap-3 px-6 py-4">
      <div className="flex-1 min-w-0 space-y-0.5">
        <p className="text-sm font-medium text-on-surface">{tema.tema}</p>
        <p className="text-xs text-on-surface-variant flex flex-wrap items-center gap-x-1.5">
          <span>
            {tema.tentativas} tentativa{tema.tentativas !== 1 ? "s" : ""} · {tema.acertos} de {tema.questoes} acertos
            {mostrarGeral && ` · ${formatarTaxa(tema.taxa_acerto)} no geral`}
          </span>
          {tendencia && (
            <span className={`inline-flex items-center gap-0.5 font-medium ${tendencia.cor}`}>
              <span className="material-symbols-outlined text-sm">{tendencia.icone}</span>
              {tendencia.rotulo}
            </span>
          )}
        </p>
      </div>
      <div className="flex items-center gap-3 md:w-72">
        <div className="flex-1 h-2 bg-surface-variant rounded-full overflow-hidden">
          <div className={`${nivel.barra} h-full rounded-full`} style={{ width: `${Math.min(tema.taxa_recente, 100)}%` }} />
        </div>
        <span className="text-sm font-semibold text-on-surface w-10 text-right">{formatarTaxa(tema.taxa_recente)}</span>
        <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg w-36 text-center ${nivel.selo}`}>{nivel.rotulo}</span>
      </div>
    </div>
  );
}
