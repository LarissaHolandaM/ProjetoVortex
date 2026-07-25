import "./MobileNav.css";

interface MobileNavProps {
  onNavigateHome: () => void;
  onOpenPublish: () => void;
  onOpenProfile: () => void;
}

export function MobileNav({ onNavigateHome, onOpenPublish, onOpenProfile }: MobileNavProps) {
  return (
    <div className="mobile-nav">
      <button onClick={onNavigateHome}>
        ⌂<span>Explorar</span>
      </button>
      <button onClick={onOpenPublish}>
        ＋<span>Anunciar</span>
      </button>
      <button onClick={onOpenProfile}>
        ◯<span>Perfil</span>
      </button>
    </div>
  );
}
