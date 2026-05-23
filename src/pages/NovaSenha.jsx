import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { redefinirSenha } from "../services/api";

export default function NovaSenha() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const email = state?.email ?? "";

  const [senha, setSenha] = useState("");
  const [senhaConfirm, setSenhaConfirm] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");

    if (senha !== senhaConfirm) {
      setErro("As senhas não coincidem.");
      return;
    }

    setCarregando(true);
    try {
      await redefinirSenha(email, senha, senhaConfirm);
      navigate("/", { replace: true });
    } catch (err) {
      setErro(err.message);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className="relative z-10 w-full max-w-[480px] px-6 mx-auto pt-32">
      <div className="flex flex-col items-center mb-10">
        <div className="mb-6">
          <span
            className="material-symbols-outlined text-primary text-5xl"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            psychology
          </span>
        </div>
        <h2 className="font-headline text-2xl font-extrabold tracking-tighter text-primary">
          Synapse Academic
        </h2>
      </div>
      <div className="bg-surface-container-lowest rounded-xl p-10 shadow-[0px_20px_40px_rgba(25,28,29,0.06)] ring-1 ring-outline-variant/15">
        <header className="mb-8">
          <h1 className="font-headline text-[1.75rem] font-medium leading-tight text-on-surface mb-3 text-center">
            Nova Senha
          </h1>
          <p className="text-on-surface-variant text-center leading-relaxed font-body">
            Digite e confirme sua nova senha.
          </p>
        </header>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label
              className="font-label text-xs font-medium uppercase tracking-[0.05em] text-on-surface-variant ml-1"
              htmlFor="password"
            >
              Nova Senha
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant text-lg">
                lock
              </span>
              <input
                className="w-full h-14 pl-12 pr-4 bg-surface-container-highest text-on-surface rounded-lg border-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-on-surface-variant/50 placeholder:font-label placeholder:text-xs"
                id="password"
                name="password"
                placeholder="Nova senha"
                required
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label
              className="font-label text-xs font-medium uppercase tracking-[0.05em] text-on-surface-variant ml-1"
              htmlFor="passwordConfirm"
            >
              Confirmar Senha
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant text-lg">
                lock_reset
              </span>
              <input
                className="w-full h-14 pl-12 pr-4 bg-surface-container-highest text-on-surface rounded-lg border-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-on-surface-variant/50 placeholder:font-label placeholder:text-xs"
                id="passwordConfirm"
                name="passwordConfirm"
                placeholder="Confirmar nova senha"
                required
                type="password"
                value={senhaConfirm}
                onChange={(e) => setSenhaConfirm(e.target.value)}
              />
            </div>
          </div>
          {erro && (
            <p className="text-error text-sm font-label text-center">{erro}</p>
          )}
          <button
            className="w-full h-14 bg-gradient-to-r from-primary to-primary-container text-on-primary font-label font-semibold rounded-lg shadow-sm hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-60"
            type="submit"
            disabled={carregando}
          >
            {carregando ? "Salvando..." : "Salvar Nova Senha"}
            {!carregando && (
              <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            )}
          </button>
        </form>
        <div className="mt-8 pt-8 border-t border-outline-variant/15 flex flex-col items-center">
          <Link
            className="inline-flex items-center gap-2 text-primary hover:text-primary-container font-label font-medium text-sm transition-colors group"
            to="/login/redefinirSenha"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Voltar
          </Link>
        </div>
      </div>
    </main>
  );
}
