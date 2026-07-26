import "./Footer.css";

export function Footer() {
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
        <a href="#how-it-works">Central de ajuda / Como funciona</a>
      </div>

      <span className="footer-copy">© 2026 Vortex Marketplace</span>
    </footer>
  );
}
