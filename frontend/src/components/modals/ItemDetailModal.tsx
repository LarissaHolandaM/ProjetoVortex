import type { Item } from "../../types";
import { formatPrice, getCondicaoLabel, getItemImage } from "../../utils/marketplace";
import "./Modal.css";
import "./ItemDetailModal.css";

interface ItemDetailModalProps {
  item: Item;
  isOwner: boolean;
  isFavorite: boolean;
  onClose: () => void;
  onToggleFavorite: (item: Item) => void;
  onEdit: (item: Item) => void;
  onDelete: (item: Item) => void;
}

export function ItemDetailModal({
  item,
  isOwner,
  isFavorite,
  onClose,
  onToggleFavorite,
  onEdit,
  onDelete,
}: ItemDetailModalProps) {
  return (
    <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="modal item-detail-modal">
        <button className="modal-close" onClick={onClose}>
          ×
        </button>
        <div className="item-detail-image">
          <img src={getItemImage(item)} alt={item.titulo} />
          <span className={item.tipo_negociacao === "doacao" ? "tag donation" : "tag"}>
            {item.tipo_negociacao === "doacao" ? "Doação" : "À venda"}
          </span>
        </div>
        <p className="eyebrow">
          {item.categoria} · {item.localizacao || "Campus"}
        </p>
        <h2>{item.titulo}</h2>
        <p className="item-detail-price">{formatPrice(item)}</p>
        <p className="item-detail-description">{item.descricao}</p>
        <div className="item-detail-meta">
          <span>
            <strong>Condição:</strong> {getCondicaoLabel(item.condicao)}
          </span>
        </div>
        <div className="item-detail-actions">
          <button className="button" onClick={() => onToggleFavorite(item)}>
            {isFavorite ? "♥ Remover dos favoritos" : "♡ Favoritar"}
          </button>
          {isOwner && (
            <>
              <button className="button button-outline" onClick={() => onEdit(item)}>
                Editar anúncio
              </button>
              <button className="button button-outline danger" onClick={() => onDelete(item)}>
                Remover anúncio
              </button>
            </>
          )}
        </div>
        {!isOwner && <small>Em breve você poderá conversar diretamente com o anunciante por aqui.</small>}
      </div>
    </div>
  );
}
