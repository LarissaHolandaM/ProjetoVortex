import "./Hero.css";

function Hero() {
  return (
    <section className="hero">

      <h1>Marketplace de Economia Circular</h1>

      <p>
        Doe, venda e encontre materiais universitários de forma simples.
      </p>

      <div className="buttons">

        <button>Anunciar Item</button>

        <button className="secondary">
          Buscar Itens
        </button>

      </div>

    </section>
  );
}

export default Hero;