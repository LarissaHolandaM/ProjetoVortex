import type { Usuario } from "../../types";
import "./Header.css";

interface HeaderProps {
  user: Usuario | null;
  onNavigateHome: () => void;
  onScrollToHowItWorks: () => void;
  onOpenProfile: () => void;
  onOpenPublish: () => void;
}

export function Header({
  user,
  onNavigateHome,
  onScrollToHowItWorks,
  onOpenProfile,
  onOpenPublish,
}: HeaderProps) {
  return (
    <header className="topbar">
      <button className="brand" onClick={onNavigateHome} aria-label="Ir para o início">
        <span className="brand-mark">↻</span>
        <span>
          vortex<span className="brand-dot">.</span>
        </span>
      </button>
      <nav className="desktop-nav" aria-label="Navegação principal">
        <button onClick={onNavigateHome}>Explorar</button>
        <button onClick={onScrollToHowItWorks}>Como funciona</button>
        <button onClick={onOpenProfile}>Meus anúncios</button>
      </nav>
      <div className="top-actions">
        <button className="text-button" onClick={onOpenProfile}>
          {user ? user.nome.split(" ")[0] : "Entrar"}
        </button>
        <button className="button button-small" onClick={onOpenPublish}>
          + Anunciar
        </button>
      </div>
    </header>
  );
}
