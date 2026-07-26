import type { Item } from "../../types";
import { formatPrice, getItemCategorias, getItemImage } from "../../utils/marketplace";
import "./ItemCard.css";

interface ItemCardProps {
  item: Item;
  onView: (item: Item) => void;
  onToggleFavorite: (item: Item) => void;
  isFavorite?: boolean;
  showOwnerActions?: boolean;
  onEdit?: (item: Item) => void;
  onDelete?: (item: Item) => void;
}

export function ItemCard({
  item,
  onView,
  onToggleFavorite,
  isFavorite = false,
  showOwnerActions = false,
  onEdit,
  onDelete,
}: ItemCardProps) {
  return (
    <article className="item-card">
      <div className="item-image">
        <img src={getItemImage(item)} alt={item.titulo} />
        <span className={item.tipo_negociacao === "doacao" ? "tag donation" : "tag"}>
          {item.tipo_negociacao === "doacao" ? "Doação" : "À venda"}
        </span>
        <button
          className={isFavorite ? "heart is-active" : "heart"}
          aria-label={isFavorite ? "Remover dos favoritos" : "Salvar item"}
          aria-pressed={isFavorite}
          onClick={() => onToggleFavorite(item)}
        >
          {isFavorite ? "♥" : "♡"}
        </button>
      </div>
      <div className="item-content">
        <p className="item-category">
          {getItemCategorias(item).join(" · ")} · {item.localizacao || "Campus"}
        </p>
        <h3>{item.titulo}</h3>
        <p className="item-description">{item.descricao}</p>
        <div className="item-footer">
          <strong>{formatPrice(item)}</strong>
          <button onClick={() => onView(item)}>Ver item ↗</button>
        </div>
        {showOwnerActions && (
          <div className="item-owner-actions">
            <button className="text-button" onClick={() => onEdit?.(item)}>
              Editar
            </button>
            <button className="text-button danger" onClick={() => onDelete?.(item)}>
              Remover
            </button>
          </div>
        )}
      </div>
    </article>
  );
}
