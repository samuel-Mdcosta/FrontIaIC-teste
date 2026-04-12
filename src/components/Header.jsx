export default function Header() {
  return (
    <header className="fixed top-0 w-full z-50 bg-slate-50/70 backdrop-blur-xl flex justify-between items-center px-8 h-20 mx-auto">
      <div className="flex items-center gap-8">
        <span className="text-2xl font-bold tracking-tighter text-blue-900 font-headline">
          Synapse Academic
        </span>
        <nav className="hidden md:flex items-center gap-6">
          <a
            className="text-slate-500 font-medium hover:text-blue-800 transition-colors"
            href="/inicio"
          >
            Home
          </a>
          <a
            className="text-slate-500 font-medium hover:text-blue-800 transition-colors"
            href="/chat"
          >
            Chat
          </a>
          <a
            className="text-slate-500 font-medium hover:text-blue-800 transition-colors"
            href="/perguntas"
          >
            Perguntas
          </a>
          <a
            className="text-slate-500 font-medium hover:text-blue-800 transition-colors"
            href="#"
          >
            Perfil
          </a>
        </nav>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative hidden lg:block">
          <input
            className="bg-slate-100 border-none rounded-lg px-4 py-2 text-sm w-64 focus:ring-2 focus:ring-primary/20"
            placeholder="Search..."
            type="text"
          />
        </div>
        <button className="p-2 hover:bg-slate-200/50 rounded-lg transition-all">
          <span className="material-symbols-outlined text-blue-900">
            dark_mode
          </span>
        </button>
      </div>
    </header>
  );
}
