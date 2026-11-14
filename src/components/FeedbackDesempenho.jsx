import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AvaliacaoQuiz from "./AvaliacaoQuiz";
import { formatarTaxa, nivelInfo, temaPraticavel, textoDoLimiteDoDia, TENDENCIAS } from "../utils/desempenho";

// Feedback de desempenho do aluno gerado pela IA: não comenta questões isoladas,
// e sim em quais áreas ele tem mais dificuldade, o que estudar, por que e onde.
//
// Props:
//   dados             — resposta de GET /api/users/login/desempenho/feedback
//   carregando        — true enquanto o feedback é gerado/buscado
//   erro              — mensagem de erro ou null
//   onTentarNovamente — refaz a consulta
//   onGerar           — botão "Gerar feedback": pede uma análise atualizada (até 10 por dia, só com bateria nova)
//   gerando           — true enquanto o pedido é enviado
//   erroGerar         — mensagem se o pedido foi recusado (ex.: os pedidos do dia acabaram) ou null
//
// Se o aluno ainda não avaliou o último quiz que concluiu, o backend responde `status: "avaliacao_pendente"`
// e o feedback só é liberado depois da avaliação, feita aqui mesmo.

export default function FeedbackDesempenho({ dados, carregando, erro, onTentarNovamente, onGerar, gerando, erroGerar }) {
  if (carregando) return <Carregando />;
  if (erro) return <Erro mensagem={erro} onTentarNovamente={onTentarNovamente} />;
  if (dados?.status === "avaliacao_pendente") {
    return <AvaliacaoPendente avaliacao={dados.avaliacao} onAvaliado={onTentarNovamente} />;
  }
  if (dados?.status === "preparando") return <Preparando espera={dados.nova_tentativa_em_s} />;
  if (dados?.status === "sem_analise") {
    return <SemAnalise dados={dados} onGerar={onGerar} gerando={gerando} erroGerar={erroGerar} />;
  }
  if (!dados?.feedback) return <SemDados />;

  const {
    resumo_geral: resumo,
    areas_prioritarias: areas = [],
    pontos_fortes: pontosFortes = [],
    proximos_passos: proximosPassos = [],
  } = dados.feedback;

  return (
    <div className="space-y-8">
      {dados.pendente && (
        <div role="status" aria-live="polite" className="flex gap-3 items-center p-4 bg-surface-container-low rounded-2xl">
          <span className="material-symbols-outlined text-secondary animate-pulse">psychology</span>
          <div>
            <p className="text-sm text-on-surface-variant">
              Estamos preparando um novo feedback. Ele aparece aqui assim que ficar pronto.
            </p>
            <Contagem segundos={dados.nova_tentativa_em_s} />
          </div>
        </div>
      )}

      {resumo && (
        <div className="flex gap-4 p-6 bg-surface-container-lowest rounded-2xl border border-outline-variant/10 shadow-sm">
          <div className="w-10 h-10 rounded-full bg-secondary-fixed flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-secondary">psychology</span>
          </div>
          <div className="space-y-1">
            <p className="font-medium text-sm text-on-surface-variant">Resumo do seu desempenho</p>
            <p className="text-on-surface leading-relaxed">{resumo}</p>
          </div>
        </div>
      )}

      {areas.length > 0 && (
        <section className="space-y-4">
          <TituloSecao icone="flag">Onde você precisa focar</TituloSecao>
          {areas.map((area, i) => (
            <CartaoArea key={area.tema} area={area} ordem={i + 1} />
          ))}
        </section>
      )}

      {(pontosFortes.length > 0 || proximosPassos.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pontosFortes.length > 0 && (
            <section className="p-6 bg-surface-container-low rounded-2xl space-y-4">
              <TituloSecao icone="workspace_premium">Seus pontos fortes</TituloSecao>
              <ul className="space-y-2">
                {pontosFortes.map((ponto) => (
                  <li key={ponto} className="flex gap-2 text-sm text-on-surface leading-relaxed">
                    <span className="material-symbols-outlined text-tertiary text-lg shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>
                      check_circle
                    </span>
                    {ponto}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {proximosPassos.length > 0 && (
            <section className="p-6 bg-surface-container-low rounded-2xl space-y-4">
              <TituloSecao icone="route">Próximos passos</TituloSecao>
              <ol className="space-y-3">
                {proximosPassos.map((passo, i) => (
                  <li key={passo} className="flex gap-3 text-sm text-on-surface leading-relaxed">
                    <span className="w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    {passo}
                  </li>
                ))}
              </ol>
            </section>
          )}
        </div>
      )}

      {dados.gerado_em && (
        <div className="space-y-3 text-center">
          <p className="text-[10px] text-on-surface-variant uppercase tracking-widest">
            Feedback de {formatarData(dados.gerado_em)}
          </p>
          {onGerar && <BotaoGerar dados={dados} onGerar={onGerar} gerando={gerando} erroGerar={erroGerar} />}
        </div>
      )}
    </div>
  );
}

function CartaoArea({ area, ordem }) {
  const navigate = useNavigate();
  const nivel = nivelInfo(area.nivel);
  const tendencia = TENDENCIAS[area.tendencia];

  return (
    <article className="p-6 bg-surface-container-lowest rounded-2xl border border-outline-variant/15 shadow-sm space-y-5">
      <header className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <span className="font-headline text-sm font-semibold text-primary">{String(ordem).padStart(2, "0")}</span>
        <h4 className="font-headline text-lg font-bold text-on-surface flex-1 min-w-[12rem]">{area.tema}</h4>
        {area.nivel && (
          <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg ${nivel.selo}`}>
            {nivel.rotulo} · {formatarTaxa(area.taxa_recente)}
          </span>
        )}
        {tendencia && (
          <span className={`flex items-center gap-1 text-xs font-medium ${tendencia.cor}`}>
            <span className="material-symbols-outlined text-base">{tendencia.icone}</span>
            {tendencia.rotulo}
          </span>
        )}
      </header>

      {area.diagnostico && (
        <Bloco icone="troubleshoot" titulo="Diagnóstico">
          <p>{area.diagnostico}</p>
        </Bloco>
      )}

      {area.o_que_estudar?.length > 0 && (
        <Bloco icone="checklist" titulo="O que estudar">
          <ul className="list-disc pl-5 space-y-1">
            {area.o_que_estudar.map((conceito) => (
              <li key={conceito}>{conceito}</li>
            ))}
          </ul>
        </Bloco>
      )}

      {area.por_que_estudar && (
        <Bloco icone="lightbulb" titulo="Por que estudar">
          <p>{area.por_que_estudar}</p>
        </Bloco>
      )}

      {area.onde_estudar?.length > 0 && (
        <Bloco icone="menu_book" titulo="Onde estudar">
          <div className="flex flex-wrap gap-2">
            {area.onde_estudar.map((material) => (
              <span
                key={material}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/[0.06] text-primary text-xs font-semibold rounded-lg"
              >
                <span className="material-symbols-outlined text-sm">description</span>
                {material}
              </span>
            ))}
          </div>
        </Bloco>
      )}

      {temaPraticavel(area.tema) && (
        <button
          type="button"
          onClick={() => navigate("/perguntas", { state: { tema: area.tema } })}
          className="inline-flex items-center gap-2 text-sm font-headline font-bold text-primary border-2 border-primary/20 px-4 py-2 rounded-xl hover:bg-primary hover:text-white hover:border-primary transition-all"
        >
          <span className="material-symbols-outlined text-base">quiz</span>
          Praticar este tema
        </button>
      )}
    </article>
  );
}

function Bloco({ icone, titulo, children }) {
  return (
    <div className="flex gap-3">
      <span className="material-symbols-outlined text-secondary shrink-0">{icone}</span>
      <div className="space-y-1 min-w-0">
        <p className="text-[10px] uppercase tracking-widest font-label font-semibold text-on-surface-variant">{titulo}</p>
        <div className="text-sm text-on-surface leading-relaxed">{children}</div>
      </div>
    </div>
  );
}

function TituloSecao({ icone, children }) {
  return (
    <h3 className="flex items-center gap-2 font-headline text-sm font-bold uppercase tracking-widest text-on-surface-variant">
      <span className="material-symbols-outlined text-primary text-lg">{icone}</span>
      {children}
    </h3>
  );
}

function Carregando() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex gap-4 items-center p-6 bg-surface-container-lowest rounded-2xl border border-outline-variant/10 shadow-sm"
    >
      <div className="w-10 h-10 rounded-full bg-secondary-fixed flex items-center justify-center shrink-0">
        <span className="material-symbols-outlined text-secondary animate-pulse">psychology</span>
      </div>
      <div>
        <p className="text-sm font-medium text-on-surface">Analisando seu desempenho...</p>
        <p className="text-xs text-on-surface-variant">
          O tutor está identificando as áreas em que você tem mais dificuldade.
        </p>
      </div>
    </div>
  );
}

function Erro({ mensagem, onTentarNovamente }) {
  return (
    <div role="alert" className="flex flex-wrap items-center gap-4 p-6 bg-error/5 rounded-2xl border border-error/20">
      <span className="material-symbols-outlined text-error">error</span>
      <p className="flex-1 text-sm text-on-surface">{mensagem}</p>
      {onTentarNovamente && (
        <button type="button" onClick={onTentarNovamente} className="text-sm font-semibold text-primary hover:underline">
          Tentar novamente
        </button>
      )}
    </div>
  );
}

// Botão "Gerar feedback": pede uma análise atualizada. Fica desligado enquanto uma está a caminho, se os pedidos do
// dia acabaram ou se o aluno ainda não concluiu uma bateria de questões nova (o feedback anterior continua valendo).
function BotaoGerar({ dados, onGerar, gerando, erroGerar }) {
  const ocupado = gerando || dados.pendente;
  const semNovidade = !dados.pendente && !dados.ha_novidade && dados.restantes_hoje > 0;
  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={onGerar}
        disabled={ocupado || !dados.pode_gerar}
        className="inline-flex items-center gap-2 text-sm font-headline font-bold text-primary border-2 border-primary/20 px-5 py-2.5 rounded-xl hover:bg-primary hover:text-white hover:border-primary transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-primary disabled:hover:border-primary/20"
      >
        <span className="material-symbols-outlined text-base">autorenew</span>
        {ocupado ? "Gerando..." : "Gerar feedback"}
      </button>
      {semNovidade && (
        <p className="text-xs text-on-surface-variant">
          Faça novas questões para gerar um feedback atualizado. Até lá, este feedback continua valendo.
        </p>
      )}
      <p className="text-xs text-on-surface-variant">{textoDoLimiteDoDia(dados.restantes_hoje, dados.limite_dia)}</p>
      {erroGerar && (
        <p role="alert" className="text-xs text-error">
          {erroGerar}
        </p>
      )}
    </div>
  );
}

// Contagem regressiva até a próxima tentativa, quando o feedback não pôde ser gerado agora (o servidor tenta de
// novo a cada 60 s). Cada consulta traz o valor atualizado; a troca de `segundos` reinicia a contagem local.
function Contagem({ segundos }) {
  if (segundos == null) return null;
  return <ContagemAtiva key={segundos} inicio={segundos} />;
}

function ContagemAtiva({ inicio }) {
  const [restante, setRestante] = useState(inicio);
  useEffect(() => {
    const id = setInterval(() => setRestante((r) => Math.max(r - 1, 0)), 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <p className="text-xs text-on-surface-variant mt-1">
      {restante > 0 ? `Não conseguimos gerar agora. Nova tentativa em ${restante} s.` : "Tentando novamente..."}
    </p>
  );
}

// O primeiro pedido do aluno já foi feito e está sendo preparado; a tela consulta de novo sozinha.
function Preparando({ espera }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex gap-4 items-center p-6 bg-surface-container-lowest rounded-2xl border border-outline-variant/10 shadow-sm"
    >
      <div className="w-10 h-10 rounded-full bg-secondary-fixed flex items-center justify-center shrink-0">
        <span className="material-symbols-outlined text-secondary animate-pulse">psychology</span>
      </div>
      <div>
        <p className="text-sm font-medium text-on-surface">Preparando o seu feedback...</p>
        <p className="text-xs text-on-surface-variant">
          Ele aparece aqui assim que ficar pronto. Você pode continuar navegando.
        </p>
        <Contagem segundos={espera} />
      </div>
    </div>
  );
}

// O aluno já praticou, mas ainda não pediu nenhum feedback.
function SemAnalise({ dados, onGerar, gerando, erroGerar }) {
  return (
    <div className="flex flex-col gap-4 p-6 bg-surface-container-low rounded-2xl">
      <div className="flex gap-4 items-center">
        <span className="material-symbols-outlined text-secondary">insights</span>
        <p className="text-sm text-on-surface-variant">
          Peça ao tutor um feedback sobre o seu desempenho: onde você precisa focar e o que, por que e onde estudar.
        </p>
      </div>
      {onGerar && <BotaoGerar dados={dados} onGerar={onGerar} gerando={gerando} erroGerar={erroGerar} />}
    </div>
  );
}

function AvaliacaoPendente({ avaliacao, onAvaliado }) {
  const quando = avaliacao?.finalizado_em ? formatarData(avaliacao.finalizado_em) : "";
  return (
    <div className="p-6 bg-surface-container-low rounded-2xl space-y-5">
      <div className="flex gap-4 items-start">
        <span className="material-symbols-outlined text-secondary">rate_review</span>
        <p className="text-sm text-on-surface leading-relaxed">
          Para ver a análise do tutor, avalie antes o quiz de{" "}
          <span className="font-semibold text-primary">{avaliacao?.tema}</span> que você concluiu
          {quando && ` em ${quando}`}.
        </p>
      </div>
      <AvaliacaoQuiz quizId={avaliacao?.quiz_id} onConcluida={onAvaliado} textoBotao="Enviar e ver a análise" />
    </div>
  );
}

function SemDados() {
  return (
    <div className="flex gap-4 items-center p-6 bg-surface-container-low rounded-2xl">
      <span className="material-symbols-outlined text-secondary">insights</span>
      <p className="text-sm text-on-surface-variant">
        Conclua uma lista de exercícios para receber um feedback sobre o seu desempenho.
      </p>
    </div>
  );
}

function formatarData(iso) {
  const data = new Date(iso);
  if (Number.isNaN(data.getTime())) return "";
  return data.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
}
