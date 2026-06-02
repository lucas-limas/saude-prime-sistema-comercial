export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/[0.06] py-8 px-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center">
            <span className="text-[10px] font-bold text-white">SP</span>
          </div>
          <span className="text-sm font-medium text-white/50">
            Saúde Prime Seguros e Saúde
          </span>
        </div>

        {/* Links */}
        <nav className="flex items-center gap-6 text-xs text-white/30">
          <a href="#recursos" className="hover:text-white/60 transition-colors">
            Recursos
          </a>
          <a href="#como-funciona" className="hover:text-white/60 transition-colors">
            Como funciona
          </a>
          <a href="#contato" className="hover:text-white/60 transition-colors">
            Contato
          </a>
        </nav>

        {/* Copyright */}
        <p className="text-xs text-white/25">© {year} Saúde Prime · Brasília / DF</p>
      </div>
    </footer>
  );
}
