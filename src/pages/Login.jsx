import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL, getPublicHeaders, saveToken } from "../services/api";

export default function Login() {
  const navigate = useNavigate();

  // --- Login ---
  const [loginEmail, setLoginEmail] = useState("");
  const [loginSenha, setLoginSenha] = useState("");
  const [loginCarregando, setLoginCarregando] = useState(false);
  const [loginErro, setLoginErro] = useState(null);

  async function handleLogin(e) {
    e.preventDefault();
    setLoginCarregando(true);
    setLoginErro(null);

    try {
      const response = await fetch(`${BASE_URL}/api/users/login`, {
        method: "POST",
        headers: getPublicHeaders(),
        body: JSON.stringify({ email: loginEmail, senha: loginSenha }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Erro ${response.status}`);
      }

      saveToken(data.token);
      navigate("/inicio");
    } catch (e) {
      setLoginErro(e.message);
    } finally {
      setLoginCarregando(false);
    }
  }

  // --- Cadastro ---
  const [cadNome, setCadNome] = useState("");
  const [cadEmail, setCadEmail] = useState("");
  const [cadSenha, setCadSenha] = useState("");
  const [cadConfirmacao, setCadConfirmacao] = useState("");
  const [cadCarregando, setCadCarregando] = useState(false);
  const [cadErro, setCadErro] = useState(null);
  const [cadSucesso, setCadSucesso] = useState(false);

  async function handleCadastro(e) {
    e.preventDefault();
    setCadErro(null);
    setCadSucesso(false);

    if (cadSenha !== cadConfirmacao) {
      setCadErro("As senhas não coincidem.");
      return;
    }

    setCadCarregando(true);

    try {
      const response = await fetch(`${BASE_URL}/api/users/cadastro`, {
        method: "POST",
        headers: getPublicHeaders(),
        body: JSON.stringify({ nome: cadNome, email: cadEmail, senha: cadSenha }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Erro ${response.status}`);
      }

      setCadSucesso(true);
      setCadNome("");
      setCadEmail("");
      setCadSenha("");
      setCadConfirmacao("");
    } catch (e) {
      setCadErro(e.message);
    } finally {
      setCadCarregando(false);
    }
  }

  const [abaAtiva, setAbaAtiva] = useState("login");

  return (
    <main className="flex-grow flex items-center justify-center p-6 md:p-12">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-0 overflow-hidden rounded-xl shadow-[0px_20px_40px_rgba(25,28,29,0.06)] bg-surface-container-lowest">
        <section className="p-8 md:p-16 flex flex-col justify-center">
          <div className="mb-8">
            <h1 className="font-headline text-2xl font-bold tracking-tighter text-primary mb-2">
              Synapse Academic
            </h1>
            <p className="text-on-surface-variant font-body text-sm">
              Acesse sua plataforma de pesquisa neuromedicina.
            </p>
          </div>

          {/* Abas visíveis apenas no mobile */}
          <div className="flex lg:hidden mb-6 rounded-lg overflow-hidden border border-outline-variant/30">
            <button
              className={`flex-1 py-2.5 font-headline font-bold text-sm transition-colors ${abaAtiva === "login" ? "bg-primary text-white" : "text-on-surface-variant hover:bg-surface-container-high"}`}
              onClick={() => setAbaAtiva("login")}
              type="button"
            >
              Entrar
            </button>
            <button
              className={`flex-1 py-2.5 font-headline font-bold text-sm transition-colors ${abaAtiva === "cadastro" ? "bg-primary text-white" : "text-on-surface-variant hover:bg-surface-container-high"}`}
              onClick={() => setAbaAtiva("cadastro")}
              type="button"
            >
              Criar Conta
            </button>
          </div>

          {/* Formulário de Login — visível no desktop sempre; no mobile só na aba "login" */}
          <div className={`${abaAtiva === "login" ? "block" : "hidden"} lg:block space-y-10`}>
            <div>
              <h2 className="font-headline text-3xl font-bold tracking-tight text-on-surface mb-8">
                Entrar
              </h2>
              <form className="space-y-6" onSubmit={handleLogin}>
                <div className="space-y-1">
                  <label className="block font-label text-[10px] uppercase tracking-widest font-semibold text-outline">
                    Endereço de Email
                  </label>
                  <input
                    className="w-full bg-surface-container-highest border-none rounded-lg px-4 py-3 text-on-surface placeholder:text-outline/50 focus:ring-2 focus:ring-primary/20 transition-all"
                    placeholder="pesquisador@synapse.edu"
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="block font-label text-[10px] uppercase tracking-widest font-semibold text-outline">
                      Senha
                    </label>
                    <Link
                      className="font-label text-[10px] uppercase tracking-widest font-semibold text-primary hover:underline"
                      to="/login/redefinirSenha"
                    >
                      Esqueci minha senha
                    </Link>
                  </div>
                  <input
                    className="w-full bg-surface-container-highest border-none rounded-lg px-4 py-3 text-on-surface placeholder:text-outline/50 focus:ring-2 focus:ring-primary/20 transition-all"
                    placeholder="••••••••"
                    type="password"
                    value={loginSenha}
                    onChange={(e) => setLoginSenha(e.target.value)}
                    required
                  />
                </div>
                {loginErro && (
                  <p className="text-error text-xs font-medium">{loginErro}</p>
                )}
                <button
                  className="w-full primary-gradient text-white font-headline font-bold py-4 rounded-lg shadow-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                  type="submit"
                  disabled={loginCarregando}
                >
                  {loginCarregando ? "Entrando..." : "Iniciar Sessão"}
                </button>
              </form>
            </div>
          </div>

          {/* Formulário de Cadastro — visível no mobile só na aba "cadastro" */}
          <div className={`${abaAtiva === "cadastro" ? "block" : "hidden"} lg:hidden`}>
            <h2 className="font-headline text-3xl font-bold tracking-tight text-on-surface mb-8">
              Criar Conta
            </h2>
            <form className="space-y-4" onSubmit={handleCadastro}>
              <div className="space-y-1">
                <label className="block font-label text-[10px] uppercase tracking-widest font-semibold text-outline">
                  Nome Completo
                </label>
                <input
                  className="w-full bg-surface-container-highest border-none rounded-lg px-4 py-3 text-on-surface placeholder:text-outline/50 focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="Dr. Alan Turing"
                  type="text"
                  value={cadNome}
                  onChange={(e) => setCadNome(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="block font-label text-[10px] uppercase tracking-widest font-semibold text-outline">
                  Email Acadêmico
                </label>
                <input
                  className="w-full bg-surface-container-highest border-none rounded-lg px-4 py-3 text-on-surface placeholder:text-outline/50 focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="research@institution.org"
                  type="email"
                  value={cadEmail}
                  onChange={(e) => setCadEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="block font-label text-[10px] uppercase tracking-widest font-semibold text-outline">
                  Senha
                </label>
                <input
                  className="w-full bg-surface-container-highest border-none rounded-lg px-4 py-3 text-on-surface placeholder:text-outline/50 focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="••••••••"
                  type="password"
                  value={cadSenha}
                  onChange={(e) => setCadSenha(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="block font-label text-[10px] uppercase tracking-widest font-semibold text-outline">
                  Confirmar Senha
                </label>
                <input
                  className="w-full bg-surface-container-highest border-none rounded-lg px-4 py-3 text-on-surface placeholder:text-outline/50 focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="••••••••"
                  type="password"
                  value={cadConfirmacao}
                  onChange={(e) => setCadConfirmacao(e.target.value)}
                  required
                />
              </div>
              <div className="flex items-start gap-3 py-2">
                <input
                  className="mt-1 rounded border-outline-variant text-primary focus:ring-primary/20 h-4 w-4"
                  type="checkbox"
                  required
                />
                <label className="text-[11px] font-body text-on-surface-variant leading-relaxed">
                  Concordo com os{" "}
                  <a className="text-primary underline" href="#">
                    Termos de Ética
                  </a>{" "}
                  e as{" "}
                  <a className="text-primary underline" href="#">
                    Diretrizes de Pesquisa
                  </a>{" "}
                  da Synapse Academic.
                </label>
              </div>
              {cadErro && (
                <p className="text-error text-xs font-medium">{cadErro}</p>
              )}
              {cadSucesso && (
                <p className="text-tertiary text-xs font-medium">
                  Conta criada com sucesso! Faça login.
                </p>
              )}
              <button
                className="w-full border-2 border-primary text-primary font-headline font-bold py-4 rounded-lg hover:bg-primary hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                type="submit"
                disabled={cadCarregando}
              >
                {cadCarregando ? "Registrando..." : "Solicitar Registro"}
              </button>
            </form>
          </div>
        </section>
        <section className="hidden lg:flex flex-col p-12 md:p-16 bg-surface-container-low relative">
          <div className="absolute top-0 right-0 p-8">
            <div className="flex items-center gap-2">
              <span className="text-xs font-label uppercase tracking-widest text-outline">
                Novo por aqui?
              </span>
              <button className="bg-primary-container/10 text-primary px-4 py-2 rounded-full font-label text-[10px] uppercase tracking-widest font-bold hover:bg-primary-container/20 transition-colors">
                Cadastre-se
              </button>
            </div>
          </div>
          <div className="mt-auto">
            <div className="mb-12">
              <h2 className="font-headline text-4xl font-bold tracking-tight text-on-surface mb-6 leading-tight">
                Criar Conta Acadêmica
              </h2>
              <form className="space-y-4" onSubmit={handleCadastro}>
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-1">
                    <label className="block font-label text-[10px] uppercase tracking-widest font-semibold text-outline">
                      Nome Completo
                    </label>
                    <input
                      className="w-full bg-surface-container-lowest border-none rounded-lg px-4 py-3 text-on-surface placeholder:text-outline/50 focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
                      placeholder="Dr. Alan Turing"
                      type="text"
                      value={cadNome}
                      onChange={(e) => setCadNome(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block font-label text-[10px] uppercase tracking-widest font-semibold text-outline">
                      Email Acadêmico
                    </label>
                    <input
                      className="w-full bg-surface-container-lowest border-none rounded-lg px-4 py-3 text-on-surface placeholder:text-outline/50 focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
                      placeholder="research@institution.org"
                      type="email"
                      value={cadEmail}
                      onChange={(e) => setCadEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block font-label text-[10px] uppercase tracking-widest font-semibold text-outline">
                        Senha
                      </label>
                      <input
                        className="w-full bg-surface-container-lowest border-none rounded-lg px-4 py-3 text-on-surface placeholder:text-outline/50 focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
                        placeholder="••••••••"
                        type="password"
                        value={cadSenha}
                        onChange={(e) => setCadSenha(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block font-label text-[10px] uppercase tracking-widest font-semibold text-outline">
                        Confirmar
                      </label>
                      <input
                        className="w-full bg-surface-container-lowest border-none rounded-lg px-4 py-3 text-on-surface placeholder:text-outline/50 focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
                        placeholder="••••••••"
                        type="password"
                        value={cadConfirmacao}
                        onChange={(e) => setCadConfirmacao(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3 py-2">
                  <input
                    className="mt-1 rounded border-outline-variant text-primary focus:ring-primary/20 h-4 w-4"
                    type="checkbox"
                    required
                  />
                  <label className="text-[11px] font-body text-on-surface-variant leading-relaxed">
                    Concordo com os{" "}
                    <a className="text-primary underline" href="#">
                      Termos de Ética
                    </a>{" "}
                    e as{" "}
                    <a className="text-primary underline" href="#">
                      Diretrizes de Pesquisa
                    </a>{" "}
                    da Synapse Academic.
                  </label>
                </div>
                {cadErro && (
                  <p className="text-error text-xs font-medium">{cadErro}</p>
                )}
                {cadSucesso && (
                  <p className="text-tertiary text-xs font-medium">
                    Conta criada com sucesso! Faça login ao lado.
                  </p>
                )}
                <button
                  className="w-full border-2 border-primary text-primary font-headline font-bold py-4 rounded-lg hover:bg-primary hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  type="submit"
                  disabled={cadCarregando}
                >
                  {cadCarregando ? "Registrando..." : "Solicitar Registro"}
                </button>
              </form>
            </div>
          </div>
          <div className="absolute bottom-0 right-0 w-64 h-64 -mb-32 -mr-32 bg-secondary/5 rounded-full blur-3xl"></div>
          <div className="absolute top-0 left-0 w-32 h-32 -mt-16 -ml-16 bg-primary/5 rounded-full blur-2xl"></div>
        </section>
      </div>
    </main>
  );
}
