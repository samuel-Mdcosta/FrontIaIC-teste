import { useState } from "react";
import { usePerfil } from "../hooks/usePerfil";

export default function Perfil() {
  const { perfil, carregando, erro, logout, salvarPerfil } = usePerfil();
  const [editando, setEditando] = useState(false);

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
          <button
            onClick={() => setEditando(true)}
            className="flex-1 border-2 border-primary text-primary font-headline font-bold py-4 rounded-xl hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2"
          >
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

      {editando && (
        <ModalEditarPerfil
          perfil={perfil}
          onFechar={() => setEditando(false)}
          onSalvar={salvarPerfil}
        />
      )}
    </main>
  );
}

const TAMANHO_MAX_FOTO = 2 * 1024 * 1024; // 2 MB

function lerArquivoComoDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Não foi possível ler a imagem."));
    reader.readAsDataURL(file);
  });
}

function ModalEditarPerfil({ perfil, onFechar, onSalvar }) {
  const [nome, setNome] = useState(perfil.nome ?? "");
  const [foto, setFoto] = useState(perfil.foto ?? null);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState(null);

  async function handleArquivo(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setErro(null);

    if (!file.type.startsWith("image/")) {
      setErro("Selecione um arquivo de imagem.");
      return;
    }
    if (file.size > TAMANHO_MAX_FOTO) {
      setErro("A imagem deve ter no máximo 2 MB.");
      return;
    }

    try {
      const dataUrl = await lerArquivoComoDataURL(file);
      setFoto(dataUrl);
    } catch (err) {
      setErro(err.message);
    }
  }

  async function handleSalvar(e) {
    e.preventDefault();
    setErro(null);

    const nomeLimpo = nome.trim();
    if (nomeLimpo.length < 3) {
      setErro("O nome deve ter ao menos 3 caracteres.");
      return;
    }

    setSalvando(true);
    try {
      // Envia apenas o que mudou.
      const alteracoes = {};
      if (nomeLimpo !== perfil.nome) alteracoes.nome = nomeLimpo;
      if (foto !== (perfil.foto ?? null)) alteracoes.foto = foto;

      if (Object.keys(alteracoes).length > 0) {
        await onSalvar(alteracoes);
      }
      onFechar();
    } catch (err) {
      setErro(err.message);
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
      onClick={onFechar}
    >
      <div
        className="bg-surface-container-lowest rounded-3xl shadow-xl w-full max-w-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSalvar} className="p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-headline text-xl font-bold text-on-surface">Editar Perfil</h2>
            <button
              type="button"
              onClick={onFechar}
              className="text-on-surface-variant hover:text-on-surface"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          {/* Foto */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 shadow-md border-4 border-surface-container-lowest">
              {foto ? (
                <img src={foto} alt="Pré-visualização" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-4xl">person</span>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <label className="cursor-pointer text-sm font-medium text-primary hover:underline">
                Trocar foto
                <input type="file" accept="image/*" className="hidden" onChange={handleArquivo} />
              </label>
              {foto && (
                <button
                  type="button"
                  onClick={() => setFoto(null)}
                  className="text-sm font-medium text-error hover:underline"
                >
                  Remover
                </button>
              )}
            </div>
          </div>

          {/* Nome */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-label">
              Nome
            </label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 text-on-surface focus:outline-none focus:border-primary"
              placeholder="Seu nome"
            />
          </div>

          {erro && <p className="text-sm text-error">{erro}</p>}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onFechar}
              disabled={salvando}
              className="flex-1 border-2 border-outline-variant/30 text-on-surface-variant font-headline font-bold py-3 rounded-xl hover:bg-surface-container-low transition-all disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={salvando}
              className="flex-1 bg-primary text-white font-headline font-bold py-3 rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {salvando ? (
                <span className="material-symbols-outlined animate-spin">progress_activity</span>
              ) : (
                "Salvar"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
