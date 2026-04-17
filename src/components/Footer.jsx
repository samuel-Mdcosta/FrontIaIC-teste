export default function Footer() {
  return (
    <footer className="w-full border-t-0 py-12 bg-slate-50">
      <div className="flex flex-col md:flex-row justify-between items-center px-12 gap-6 w-full max-w-7xl mx-auto">
        <span className="text-[10px] uppercase tracking-widest text-slate-400">
          © 2026 Synapse Academic. All Rights Reserved.
        </span>
        <div className="flex gap-8">
          <a
            className="text-[10px] uppercase tracking-widest text-slate-400 hover:text-blue-700 transition-opacity opacity-70 hover:opacity-100 underline underline-offset-4 decoration-1"
            href="#"
          >
            Ethics Committee
          </a>
          <a
            className="text-[10px] uppercase tracking-widest text-slate-400 hover:text-blue-700 transition-opacity opacity-70 hover:opacity-100 underline underline-offset-4 decoration-1"
            href="#"
          >
            Research Guidelines
          </a>
          <a
            className="text-[10px] uppercase tracking-widest text-slate-400 hover:text-blue-700 transition-opacity opacity-70 hover:opacity-100 underline underline-offset-4 decoration-1"
            href="#"
          >
            Support
          </a>
        </div>
      </div>
    </footer>
  );
}
