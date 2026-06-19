import { Fragment, useState } from "react";
import { useAdmin } from "../hooks/useAdmin";
import { TEMAS_QUIZ } from "../data/temasQuiz";

function iniciais(nome) {
  const partes = nome.trim().split(' ');
  if (partes.length === 1) return partes[0].substring(0, 2).toUpperCase();
  return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
}

function ordenarTemas(temas) {
  const ordem = new Map(TEMAS_QUIZ.map((t, i) => [t.titulo, i]));
  return [...temas].sort(
    (a, b) => (ordem.get(a.tema) ?? 999) - (ordem.get(b.tema) ?? 999)
  );
}

function taxaTema(t) {
  if (t.taxa_acerto != null) return t.taxa_acerto;
  const total = (t.acertos ?? 0) + (t.erros ?? 0);
  return total > 0 ? (t.acertos / total) * 100 : null;
}

function formatarTempo(segundos) {
  if (!segundos) return '—';
  const h = Math.floor(segundos / 3600);
  const m = Math.floor((segundos % 3600) / 60);
  if (h > 0) return `${h}h ${m}min`;
  return `${m}min`;
}

function corTaxa(taxa) {
  if (taxa >= 70) return { bar: 'bg-primary', text: 'text-primary' };
  if (taxa >= 50) return { bar: 'bg-tertiary', text: 'text-tertiary' };
  return { bar: 'bg-error', text: 'text-error' };
}

const AVATAR_CORES = [
  'bg-secondary-container/20 text-on-secondary-container',
  'bg-tertiary-container/20 text-on-tertiary-container',
  'bg-primary-container/20 text-on-primary-container',
];

export default function Admin() {
  const { alunos, carregando, erro, recarregar, temasPorAluno, carregarTemasAluno } = useAdmin();
  const [expandidoId, setExpandidoId] = useState(null);

  function alternarAluno(id) {
    if (expandidoId === id) {
      setExpandidoId(null);
    } else {
      setExpandidoId(id);
      carregarTemasAluno(id);
    }
  }

  if (carregando) {
    return (
      <main className="flex-1 flex items-center justify-center pt-24">
        <div className="text-center space-y-3">
          <span className="material-symbols-outlined text-primary text-4xl animate-spin">progress_activity</span>
          <p className="text-sm text-on-surface-variant">Carregando alunos...</p>
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
          <button
            onClick={recarregar}
            className="text-xs text-primary underline"
          >
            Tentar novamente
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 overflow-y-auto pt-24 pb-16 px-6 md:px-12 lg:px-20 bg-surface">
      <div className="max-w-7xl mx-auto space-y-8">

        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-headline text-3xl font-bold text-on-surface">Painel do Professor</h1>
            <p className="text-sm text-on-surface-variant mt-1">Acompanhe o progresso dos alunos</p>
          </div>
          <span className="text-xs text-on-surface-variant bg-surface-container-low px-3 py-1.5 rounded-lg">
            {alunos.length} aluno{alunos.length !== 1 ? 's' : ''}
          </span>
        </div>

        <div className="overflow-x-auto bg-surface-container-lowest rounded-3xl shadow-sm shadow-black/5">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low/50">
                <th className="px-8 py-5 text-[11px] font-bold uppercase tracking-[0.1em] text-outline">Nome do Aluno</th>
                <th className="px-6 py-5 text-[11px] font-bold uppercase tracking-[0.1em] text-outline">E-mail</th>
                <th className="px-6 py-5 text-[11px] font-bold uppercase tracking-[0.1em] text-outline text-center">Tempo no Chat</th>
                <th className="px-6 py-5 text-[11px] font-bold uppercase tracking-[0.1em] text-outline text-center">Quantidade de Exercicios</th>
                <th className="px-6 py-5 text-[11px] font-bold uppercase tracking-[0.1em] text-outline">Taxa de Acerto</th>
                <th className="px-8 py-5 text-[11px] font-bold uppercase tracking-[0.1em] text-outline text-right">Quantidade de Erros</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {alunos.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-8 py-12 text-center text-sm text-on-surface-variant">
                    Nenhum aluno cadastrado.
                  </td>
                </tr>
              ) : (
                alunos.map((aluno, idx) => {
                  const taxa = aluno.taxa_acerto ?? null;
                  const cor = taxa != null ? corTaxa(taxa) : { bar: 'bg-outline', text: 'text-outline' };
                  const avatarCor = AVATAR_CORES[idx % AVATAR_CORES.length];
                  const aberto = expandidoId === aluno.id;
                  const temasInfo = temasPorAluno[aluno.id];

                  return (
                    <Fragment key={aluno.id}>
                    <tr className={`hover:bg-surface-container-low transition-colors group ${aberto ? 'bg-surface-container-low' : ''}`}>
                      <td className="px-8 py-4">
                        <button
                          type="button"
                          onClick={() => alternarAluno(aluno.id)}
                          aria-expanded={aberto}
                          className="flex items-center gap-3 w-full text-left rounded-lg -mx-1 px-1 hover:opacity-90"
                        >
                          {aluno.foto ? (
                            <img
                              src={aluno.foto}
                              alt={aluno.nome}
                              className="w-10 h-10 rounded-full object-cover shrink-0"
                            />
                          ) : (
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${avatarCor}`}>
                              {iniciais(aluno.nome)}
                            </div>
                          )}
                          <span className="font-medium text-sm">{aluno.nome}</span>
                          <span className={`material-symbols-outlined text-base text-outline transition-transform ${aberto ? 'rotate-180' : ''}`}>
                            expand_more
                          </span>
                        </button>
                      </td>
                      <td className="px-6 py-4 text-sm text-on-surface-variant">{aluno.email}</td>
                      <td className="px-6 py-4 text-sm text-on-surface-variant text-center">
                        {formatarTempo(aluno.tempo_total_chat)}
                      </td>
                      <td className="px-6 py-4 text-sm text-on-surface-variant text-center">
                        {aluno.tentativas_quiz ?? '—'}
                      </td>
                      <td className="px-6 py-4">
                        {taxa != null ? (
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 bg-surface-variant rounded-full overflow-hidden">
                              <div
                                className={`${cor.bar} h-full rounded-full`}
                                style={{ width: `${Math.min(taxa, 100)}%` }}
                              />
                            </div>
                            <span className={`text-xs font-semibold ${cor.text}`}>
                              {taxa.toFixed(0)}%
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 bg-surface-variant rounded-full overflow-hidden" />
                            <span className="text-xs font-semibold text-outline">—</span>
                          </div>
                        )}
                      </td>
                      <td className="px-8 py-4 text-sm text-on-surface-variant text-right">
                        {aluno.erros_quiz ?? '—'}
                      </td>
                    </tr>

                    {aberto && (
                      <tr className="bg-surface-container-low/40">
                        <td colSpan={6} className="px-8 pb-6 pt-1">
                          <div className="rounded-2xl bg-surface-container-lowest border border-outline-variant/15 p-5">
                            <h3 className="text-[11px] font-bold uppercase tracking-[0.1em] text-outline mb-4">
                              Desempenho por tema — {aluno.nome}
                            </h3>

                            {temasInfo?.carregando ? (
                              <div className="flex items-center gap-2 text-sm text-on-surface-variant">
                                <span className="material-symbols-outlined text-primary text-xl animate-spin">progress_activity</span>
                                Carregando temas...
                              </div>
                            ) : temasInfo?.erro ? (
                              <div className="flex items-center justify-between">
                                <p className="text-sm text-error">{temasInfo.erro}</p>
                                <button
                                  onClick={() => carregarTemasAluno(aluno.id)}
                                  className="text-xs text-primary underline"
                                >
                                  Tentar novamente
                                </button>
                              </div>
                            ) : !temasInfo?.temas || temasInfo.temas.length === 0 ? (
                              <p className="text-sm text-on-surface-variant">
                                Nenhuma tentativa por tema registrada.
                              </p>
                            ) : (
                              <div className="space-y-2">
                                {ordenarTemas(temasInfo.temas).map((t) => {
                                  const taxaT = taxaTema(t);
                                  const corT = taxaT != null ? corTaxa(taxaT) : { bar: 'bg-outline', text: 'text-outline' };
                                  return (
                                    <div
                                      key={t.tema}
                                      className="flex items-center gap-4 px-4 py-3 rounded-xl bg-surface-container-low/40"
                                    >
                                      <span className="flex-1 text-sm font-medium text-on-surface">{t.tema}</span>
                                      <span className="text-xs text-on-surface-variant w-28 text-center">
                                        {t.tentativas ?? 0} tentativa{(t.tentativas ?? 0) !== 1 ? 's' : ''}
                                      </span>
                                      <span className="text-xs text-primary w-20 text-center">{t.acertos ?? 0} acertos</span>
                                      <span className="text-xs text-error w-16 text-center">{t.erros ?? 0} erros</span>
                                      <div className="flex items-center gap-2 w-28">
                                        <div className="flex-1 h-1.5 bg-surface-variant rounded-full overflow-hidden">
                                          <div
                                            className={`${corT.bar} h-full rounded-full`}
                                            style={{ width: `${Math.min(taxaT ?? 0, 100)}%` }}
                                          />
                                        </div>
                                        <span className={`text-xs font-semibold ${corT.text}`}>
                                          {taxaT != null ? `${taxaT.toFixed(0)}%` : '—'}
                                        </span>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                    </Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

      </div>
    </main>
  );
}
