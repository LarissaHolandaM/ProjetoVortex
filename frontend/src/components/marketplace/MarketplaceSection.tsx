import type { Item } from "../../types";
import { ItemCard } from "./ItemCard";
import "./MarketplaceSection.css";

interface MarketplaceSectionProps {
  categories: string[];
  category: string;
  onCategoryChange: (category: string) => void;
  query: string;
  onQueryChange: (query: string) => void;
  items: Item[];
  onViewItem: (item: Item) => void;
  onToggleFavorite: (item: Item) => void;
  isFavorite: (item: Item) => boolean;
}

export function MarketplaceSection({
  categories,
  category,
  onCategoryChange,
  query,
  onQueryChange,
  items,
  onViewItem,
  onToggleFavorite,
  isFavorite,
}: MarketplaceSectionProps) {
  return (
    <section className="marketplace-section" id="marketplace">
      <div className="section-heading">
        <div>
          <p className="eyebrow">A VITRINE DO CAMPUS</p>
          <h2>
            Encontre o próximo
            <br />
            <em>capítulo</em> do seu item.
          </h2>
        </div>
        <div className="search-box">
          <span>⌕</span>
          <input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="O que você está procurando?"
          />
        </div>
      </div>
      <div className="category-row">
        {categories.map((item) => (
          <button
            className={category === item ? "category active" : "category"}
            key={item}
            onClick={() => onCategoryChange(item)}
          >
            {item}
          </button>
        ))}
      </div>
      <div className="item-grid">
        {items.map((item) => (
          <ItemCard
            item={item}
            key={item.id}
            onView={onViewItem}
            onToggleFavorite={onToggleFavorite}
            isFavorite={isFavorite(item)}
          />
        ))}
      </div>
      {!items.length && <div className="empty-state">Nenhum item encontrado. Tente outro termo.</div>}
    </section>
  );
}
