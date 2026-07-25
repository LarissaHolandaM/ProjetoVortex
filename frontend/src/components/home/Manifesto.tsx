import "./Manifesto.css";

interface ManifestoProps {
  onPublish: () => void;
}

export function Manifesto({ onPublish }: ManifestoProps) {
  return (
    <section className="manifesto" id="how-it-works">
      <div className="manifesto-number">/ 03</div>
      <div>
        <p className="eyebrow">POR QUE VORTEX?</p>
        <h2>
          O campus fica melhor quando as coisas <em>continuam</em> circulando.
        </h2>
      </div>
      <div className="manifesto-copy">
        <p>De livros a jalecos, cada item parado pode ser exatamente o que outra pessoa precisa agora.</p>
        <button className="link-button" onClick={onPublish}>
          Faça parte do movimento ↗
        </button>
      </div>
    </section>
  );
}
