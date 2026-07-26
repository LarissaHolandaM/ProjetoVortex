import "./StatStrip.css";

interface StatStripProps {
  totalItens: number;
  totalCategorias: number;
}

export function StatStrip({ totalItens, totalCategorias }: StatStripProps) {
  return (
    <section className="stat-strip">
      <div>
        <strong>{totalItens}</strong>
        <span>itens circulando</span>
      </div>
      <div>
        <strong>86%</strong>
        <span>encontram um novo lar</span>
      </div>
      <div>
        <strong>{totalCategorias}</strong>
        <span>categorias para explorar</span>
      </div>
      <p>
        Menos desperdício.
        <br />
        <b>Mais possibilidades.</b>
      </p>
    </section>
  );
}
