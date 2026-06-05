import Logo from "./Logo";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/[0.06] py-14 px-6">
      <div className="container-lg">
        <div className="grid md:grid-cols-[1fr_auto_auto_auto] gap-10 mb-12">
          {/* Brand */}
          <div>
            <div className="mb-4">
              <Logo className="h-7 w-auto opacity-80" />
            </div>
            <p className="text-xs text-muted leading-relaxed max-w-[200px]">
              Sistema comercial para corretoras de planos de saúde corporativos.
            </p>
            <p className="text-xs text-muted mt-3">Brasília / DF · Brasil</p>
          </div>

          {/* Sistema */}
          <div>
            <p className="text-xs font-semibold text-white/50 uppercase tracking-[0.16em] mb-4">
              Sistema
            </p>
            <ul className="space-y-2.5">
              {[
                { label: "O produto", href: "#produto" },
                { label: "Recursos", href: "#recursos" },
                { label: "Como funciona", href: "#como-funciona" },
              ].map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="text-xs text-muted hover:text-white/70 transition-colors duration-200"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Empresa */}
          <div>
            <p className="text-xs font-semibold text-white/50 uppercase tracking-[0.16em] mb-4">
              Empresa
            </p>
            <ul className="space-y-2.5">
              {[
                { label: "Depoimentos", href: "#depoimentos" },
                { label: "FAQ", href: "#faq" },
                { label: "Contato", href: "#contato" },
              ].map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="text-xs text-muted hover:text-white/70 transition-colors duration-200"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contato */}
          <div>
            <p className="text-xs font-semibold text-white/50 uppercase tracking-[0.16em] mb-4">
              Contato
            </p>
            <ul className="space-y-2.5">
              <li>
                <a
                  href="mailto:contato@saudeprimeseguros.com"
                  className="text-xs text-muted hover:text-white/70 transition-colors duration-200"
                >
                  contato@saudeprimeseguros.com
                </a>
              </li>
              <li>
                <a
                  href="https://saudeprimeseguros.com"
                  className="text-xs text-muted hover:text-white/70 transition-colors duration-200"
                >
                  saudeprimeseguros.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="divider mb-6" />

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted">
          <p>© {year} Saúde Prime Seguros e Saúde. Todos os direitos reservados.</p>
          <p>Desenvolvido em Brasília / DF</p>
        </div>
      </div>
    </footer>
  );
}
