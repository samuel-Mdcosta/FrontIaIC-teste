import { useAdmin } from "../hooks/useAdmin";

function iniciais(nome) {
  const partes = nome.trim().split(' ');
  if (partes.length === 1) return partes[0].substring(0, 2).toUpperCase();
  return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
}

function formatarUltimoAcesso(dateString) {
  if (!dateString) return '—';
  const date = new Date(dateString);
  const now = new Date();
  const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Hoje';
  if (diffDays === 1) return 'Ontem';
  if (diffDays < 7) return `${diffDays} dias atrás`;
  return date.toLocaleDateString('pt-BR');
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
  const { alunos, carregando, erro, recarregar } = useAdmin();

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
                <th className="px-6 py-5 text-[11px] font-bold uppercase tracking-[0.1em] text-outline text-center">Sessões Chat</th>
                <th className="px-6 py-5 text-[11px] font-bold uppercase tracking-[0.1em] text-outline text-center">Último Acesso</th>
                <th className="px-6 py-5 text-[11px] font-bold uppercase tracking-[0.1em] text-outline">Taxa de Acerto</th>
                <th className="px-8 py-5 text-[11px] font-bold uppercase tracking-[0.1em] text-outline text-right">Ações</th>
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

                  return (
                    <tr key={aluno.id} className="hover:bg-surface-container-low transition-colors group">
                      <td className="px-8 py-4">
                        <div className="flex items-center gap-3">
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
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-on-surface-variant">{aluno.email}</td>
                      <td className="px-6 py-4 text-sm text-on-surface-variant text-center">
                        {aluno.sessoes_chat ?? '—'}
                      </td>
                      <td className="px-6 py-4 text-xs text-on-surface-variant text-center">
                        {formatarUltimoAcesso(aluno.ultimo_acesso)}
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
                      <td className="px-8 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            className="p-2 hover:bg-surface-container-highest rounded-lg transition-all text-on-surface-variant"
                            title="Visualizar Detalhes"
                          >
                            <span className="material-symbols-outlined text-[20px]">visibility</span>
                          </button>
                        </div>
                      </td>
                    </tr>
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
