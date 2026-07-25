import "./HeroSection.css";

interface HeroSectionProps {
  onExplore: () => void;
  onPublish: () => void;
}

export function HeroSection({ onExplore, onPublish }: HeroSectionProps) {
  return (
    <section className="hero-section">
      <div className="hero-copy">
        <p className="eyebrow">
          ECONOMIA CIRCULAR NO CAMPUS <span>●</span>
        </p>
        <h1>
          O que você não usa mais pode <em>mudar</em> o dia de alguém.
        </h1>
        <p className="hero-lead">
          Um marketplace feito por estudantes, para estudantes. Encontre materiais, dê novos destinos e faça a vida
          acadêmica circular.
        </p>
        <div className="hero-actions">
          <button className="button" onClick={onExplore}>
            Explorar itens ↗
          </button>
          <button className="link-button" onClick={onPublish}>
            Quero anunciar ↗
          </button>
        </div>
      </div>
      <div className="hero-visual">
        <div className="orbit orbit-one" />
        <div className="orbit orbit-two" />
        <div className="hero-card card-lime">
          <span>01</span>
          <strong>Reutilizar</strong>
          <small>é transformar</small>
        </div>
        <div className="hero-card card-white">
          <span>02</span>
          <strong>Compartilhar</strong>
          <small>é conectar</small>
        </div>
        <div className="hero-sticker">
          feito no
          <br />
          <b>campus</b>
        </div>
      </div>
    </section>
  );
}
