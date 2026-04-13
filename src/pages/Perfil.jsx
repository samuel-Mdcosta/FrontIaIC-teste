import { usePerfil } from "../hooks/usePerfil";

export default function Perfil() {
  const { perfil, carregando, erro, logout } = usePerfil();

  if (carregando) {
    return (
      <main className="flex-1 flex items-center justify-center pt-24">
        <div className="text-center space-y-3">
          <span className="material-symbols-outlined text-primary text-4xl animate-spin">progress_activity</span>
          <p className="text-sm text-on-surface-variant">Carregando perfil...</p>
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
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 overflow-y-auto pt-24 pb-16 px-6 md:px-12 lg:px-24 xl:px-48 bg-surface">
      <div className="max-w-3xl mx-auto space-y-8">

        {/* Card principal */}
        <div className="bg-surface-container-lowest rounded-3xl shadow-sm overflow-hidden">
          <div className="h-28 primary-gradient" />
          <div className="px-8 pb-8">
            <div className="flex items-end gap-5 -mt-12 mb-6">
              <div className="w-24 h-24 rounded-2xl border-4 border-surface-container-lowest overflow-hidden shrink-0 shadow-md">
                {perfil.foto ? (
                  <img src={perfil.foto} alt={perfil.nome} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-4xl">person</span>
                  </div>
                )}
              </div>
              <div className="pb-1">
                <h1 className="font-headline text-2xl font-bold text-on-surface">{perfil.nome}</h1>
                {perfil.instituicao && (
                  <p className="text-sm text-on-surface-variant">{perfil.instituicao}</p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-surface-container-low rounded-xl">
                <span className="material-symbols-outlined text-on-surface-variant">mail</span>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-label">Email</p>
                  <p className="text-sm font-medium text-on-surface">{perfil.email}</p>
                </div>
              </div>
              {perfil.instituicao && (
                <div className="flex items-center gap-3 p-4 bg-surface-container-low rounded-xl">
                  <span className="material-symbols-outlined text-on-surface-variant">account_balance</span>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-label">Instituição</p>
                    <p className="text-sm font-medium text-on-surface">{perfil.instituicao}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div>
          <h2 className="font-headline text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-4">
            Atividade Acadêmica
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-6 bg-surface-container-lowest rounded-2xl border border-outline-variant/10 text-center space-y-1">
              <span className="font-headline text-3xl font-bold text-primary">{perfil.stats.sessoesRealizadas}</span>
              <p className="text-[10px] uppercase tracking-widest text-on-surface-variant">Sessões de Chat</p>
            </div>
            <div className="p-6 bg-surface-container-lowest rounded-2xl border border-outline-variant/10 text-center space-y-1">
              <span className="font-headline text-3xl font-bold text-primary">{perfil.stats.questoesRespondidas}</span>
              <p className="text-[10px] uppercase tracking-widest text-on-surface-variant">Tentativas de Quiz</p>
            </div>
          </div>
        </div>

        {/* Ações */}
        <div className="flex gap-3">
          <button className="flex-1 border-2 border-primary text-primary font-headline font-bold py-4 rounded-xl hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2">
            <span className="material-symbols-outlined">edit</span>
            Editar Perfil
          </button>
          <button
            onClick={logout}
            className="flex-1 border-2 border-error text-error font-headline font-bold py-4 rounded-xl hover:bg-error hover:text-white transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined">logout</span>
            Sair
          </button>
        </div>

      </div>
    </main>
  );
}
