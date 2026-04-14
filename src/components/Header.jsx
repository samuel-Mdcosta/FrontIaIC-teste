import { useState } from "react";

export default function Header() {
  const [menuAberto, setMenuAberto] = useState(false);

  return (
    <header className="fixed top-0 w-full z-50 bg-slate-50/70 backdrop-blur-xl px-8 h-20 mx-auto">
      <div className="flex justify-between items-center h-full">
        <div className="flex items-center gap-8">
          <span className="text-2xl font-bold tracking-tighter text-blue-900 font-headline">
            Synapse Academic
          </span>
          {/* Nav desktop */}
          <nav className="hidden md:flex items-center gap-6">
            <a className="text-slate-500 font-medium hover:text-blue-800 transition-colors" href="/inicio">Home</a>
            <a className="text-slate-500 font-medium hover:text-blue-800 transition-colors" href="/chat">Chat</a>
            <a className="text-slate-500 font-medium hover:text-blue-800 transition-colors" href="/perguntas">Perguntas</a>
            <a className="text-slate-500 font-medium hover:text-blue-800 transition-colors" href="/perfil">Perfil</a>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {/* Search — desktop */}
          <div className="relative hidden lg:block">
            <input
              className="bg-slate-100 border-none rounded-lg px-4 py-2 text-sm w-64 focus:ring-2 focus:ring-primary/20"
              placeholder="Search..."
              type="text"
            />
          </div>

          {/* Dark mode */}
          <button className="p-2 hover:bg-slate-200/50 rounded-lg transition-all">
            <span className="material-symbols-outlined text-blue-900">dark_mode</span>
          </button>

          {/* Hambúrguer — mobile */}
          <button
            className="md:hidden p-2 hover:bg-slate-200/50 rounded-lg transition-all"
            onClick={() => setMenuAberto(!menuAberto)}
            aria-label="Menu"
            type="button"
          >
            <span className="material-symbols-outlined text-blue-900">
              {menuAberto ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>

      {/* Menu mobile dropdown */}
      {menuAberto && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-slate-50/95 backdrop-blur-xl shadow-lg border-t border-slate-200/50">
          <nav className="flex flex-col px-8 py-4 gap-1">
            <a
              className="text-slate-600 font-medium hover:text-blue-800 hover:bg-slate-100 transition-colors py-3 px-4 rounded-lg"
              href="/inicio"
              onClick={() => setMenuAberto(false)}
            >
              Home
            </a>
            <a
              className="text-slate-600 font-medium hover:text-blue-800 hover:bg-slate-100 transition-colors py-3 px-4 rounded-lg"
              href="/chat"
              onClick={() => setMenuAberto(false)}
            >
              Chat
            </a>
            <a
              className="text-slate-600 font-medium hover:text-blue-800 hover:bg-slate-100 transition-colors py-3 px-4 rounded-lg"
              href="/perguntas"
              onClick={() => setMenuAberto(false)}
            >
              Perguntas
            </a>
            <a
              className="text-slate-600 font-medium hover:text-blue-800 hover:bg-slate-100 transition-colors py-3 px-4 rounded-lg"
              href="/perfil"
              onClick={() => setMenuAberto(false)}
            >
              Perfil
            </a>
            {/* Search no mobile */}
            <div className="pt-2 pb-1">
              <input
                className="w-full bg-slate-100 border-none rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20"
                placeholder="Search..."
                type="text"
              />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
