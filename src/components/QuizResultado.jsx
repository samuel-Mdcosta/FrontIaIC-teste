import { useNavigate } from "react-router-dom";
import FeedbackDesempenho from "./FeedbackDesempenho";
import { useFeedbackDesempenho } from "../hooks/useFeedbackDesempenho";

// Props:
//   questoes     — array de questões respondidas
//   respostas    — array de índices escolhidos pelo usuário (mesma ordem de questoes)
//   gabarito     — gabarito liberado pelo backend ao final, ou null enquanto carrega
//   erroGabarito — true se o gabarito não pôde ser carregado
//   registro     — "pendente" | "ok" | "erro": situação do salvamento da tentativa no backend

export default function QuizResultado({ questoes, respostas, gabarito, erroGabarito, registro }) {
  const navigate = useNavigate();
  // O feedback considera todo o histórico do aluno, então só é pedido depois que esta tentativa foi salva.
  const feedback = useFeedbackDesempenho({ habilitado: registro === "ok" });

  // O gabarito vem do backend, só depois de todas as respostas estarem registradas.
  const pronto = Array.isArray(gabarito);
  const gabaritoPorId = Object.fromEntries((gabarito ?? []).map((g) => [g.id, g]));
  const acertos = pronto ? gabarito.filter((g) => g.acertou).length : 0;
  const percentual = Math.round((acertos / questoes.length) * 100);

  return (
    <main className="pt-32 pb-20 px-6 max-w-3xl mx-auto">
      {/* Cabeçalho de resultado */}
      <div className="text-center space-y-6 py-12">
        <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
          <span className="material-symbols-outlined text-primary text-5xl">
            {percentual >= 70 ? "emoji_events" : "school"}
          </span>
        </div>
        <h1 className="font-headline text-4xl font-bold text-primary">Sessão Concluída</h1>
        <p className="text-on-surface-variant text-lg">
          {pronto ? (
            <>
              Você acertou <span className="text-primary font-bold">{acertos}</span> de{" "}
              <span className="font-bold">{questoes.length}</span> questões
            </>
          ) : erroGabarito ? (
            "Não foi possível carregar o gabarito."
          ) : (
            "Carregando o gabarito..."
          )}
        </p>
        <div className="relative h-3 bg-surface-container-high rounded-full overflow-hidden max-w-sm mx-auto">
          <div
            className="absolute inset-y-0 left-0 bg-primary rounded-full transition-all duration-700"
            style={{ width: `${percentual}%` }}
          />
        </div>
        <span className="text-primary font-headline font-bold text-3xl">{pronto ? `${percentual}%` : ""}</span>
      </div>

      {/* Feedback de desempenho (rendimento do aluno, não das questões) */}
      <section className="mb-12 space-y-4">
        <h2 className="font-headline text-sm font-bold uppercase tracking-widest text-on-surface-variant">
          Feedback de desempenho
        </h2>
        {registro === "erro" ? (
          <div role="alert" className="flex gap-4 items-center p-6 bg-error/5 rounded-2xl border border-error/20">
            <span className="material-symbols-outlined text-error">error</span>
            <p className="text-sm text-on-surface">
              Não foi possível salvar esta tentativa, então seu feedback de desempenho não foi atualizado.
            </p>
          </div>
        ) : (
          <FeedbackDesempenho
            dados={feedback.dados}
            carregando={registro === "pendente" || feedback.carregando}
            erro={feedback.erro}
            onTentarNovamente={feedback.recarregar}
          />
        )}
      </section>

      {/* Revisão por questão */}
      <section className="mb-10 space-y-4">
        <h2 className="font-headline text-sm font-bold uppercase tracking-widest text-on-surface-variant">
          Revisão das questões
        </h2>
        {!pronto && (
          <p className="text-sm text-on-surface-variant">
            {erroGabarito ? "O gabarito não pôde ser carregado. Tente novamente mais tarde." : "Carregando o gabarito com as justificativas..."}
          </p>
        )}
        {pronto && questoes.map((q, i) => {
          const g = gabaritoPorId[q.id];
          if (!g) return null;
          const acertou = g.acertou;
          const justificativaEscolhida = g.explicacoes_alternativas?.[respostas[i]]?.explicacao;
          return (
            <div key={q.id ?? i} className="p-5 bg-surface-container-lowest rounded-2xl border border-outline-variant/10 space-y-3">
              <div className="flex items-start gap-3">
                <span
                  className={`material-symbols-outlined text-lg mt-0.5 ${acertou ? "text-tertiary" : "text-error"}`}
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  {acertou ? "check_circle" : "cancel"}
                </span>
                <p className="text-sm font-medium text-on-surface whitespace-pre-line">{q.pergunta}</p>
              </div>
              <p className="text-xs text-on-surface-variant pl-8">
                Resposta correta:{" "}
                <span className="text-primary font-semibold">{q.opcoes[g.correta]}</span>
              </p>
              {!acertou && (
                <p className="text-xs text-on-surface-variant pl-8">
                  Sua resposta: <span className="text-error font-semibold">{q.opcoes[respostas[i]]}</span>
                  {justificativaEscolhida && <span> — {justificativaEscolhida}</span>}
                </p>
              )}
              <p className="text-sm text-on-surface-variant leading-relaxed pl-8">{g.explicacao}</p>
              {g.fontes?.length > 0 && (
                <p className="text-xs text-on-surface-variant/80 pl-8">
                  <span className="font-semibold">Referências Bibliográficas:</span> {g.fontes.join(" · ")}
                </p>
              )}
            </div>
          );
        })}
      </section>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => navigate("/desempenho")}
          className="flex-1 border-2 border-primary text-primary py-5 rounded-xl font-headline font-bold text-lg hover:bg-primary hover:text-white transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-3"
        >
          <span className="material-symbols-outlined">insights</span>
          Meu Desempenho
        </button>
        <button
          onClick={() => navigate("/perguntas")}
          className="flex-1 primary-gradient text-white py-5 rounded-xl font-headline font-bold text-lg hover:shadow-xl transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-3"
        >
          <span className="material-symbols-outlined">refresh</span>
          Nova Sessão
        </button>
      </div>
    </main>
  );
}
