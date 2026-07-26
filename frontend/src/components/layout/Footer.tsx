import "./Footer.css";

interface FooterProps {
  onOpenHelp: () => void;
}

export function Footer({ onOpenHelp }: FooterProps) {
  return (
    <footer>
      <div className="footer-main">
        <div className="brand">
          <span className="brand-mark">↻</span>
          <span>
            vortex<span className="brand-dot">.</span>
          </span>
        </div>
        <p>Um novo ciclo começa com você.</p>
      </div>

      <div className="footer-help">
        <p className="footer-help-title">Contato &amp; ajuda</p>
        <a href="mailto:contato@vortex.com.br">contato@vortex.com.br</a>
        <a href="https://wa.me/5585999999999" target="_blank" rel="noreferrer">
          WhatsApp: (85) 99999-9999
        </a>
        <button type="button" className="footer-help-link" onClick={onOpenHelp}>
          Central de ajuda
        </button>
      </div>

      <span className="footer-copy">© 2026 Vortex Marketplace</span>
    </footer>
  );
}
