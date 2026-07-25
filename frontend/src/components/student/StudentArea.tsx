import { useEffect, useState } from "react";
import { fetchFavoritos } from "../../api/client";
import type { Item, StudentTab, Usuario } from "../../types";
import { ItemCard } from "../marketplace/ItemCard";
import "./StudentArea.css";

interface StudentAreaProps {
  user: Usuario | null;
  items: Item[];
  onBack: () => void;
  onOpenPublish: () => void;
  onViewItem: (item: Item) => void;
  onToggleFavorite: (item: Item) => Promise<void>;
  isFavorite: (item: Item) => boolean;
  onEdit: (item: Item) => void;
  onDelete: (item: Item) => void;
}

export function StudentArea({
  user,
  items,
  onBack,
  onOpenPublish,
  onViewItem,
  onToggleFavorite,
  isFavorite,
  onEdit,
  onDelete,
}: StudentAreaProps) {
  const [tab, setTab] = useState<StudentTab>("meus");
  const [favoritos, setFavoritos] = useState<Item[]>([]);
  const [loadingFavoritos, setLoadingFavoritos] = useState(false);

  const myItems = items.filter((item) => item.usuario_id === user?.id);

  useEffect(() => {
    if (tab !== "favoritos") return;
    setLoadingFavoritos(true);
    fetchFavoritos()
      .then(setFavoritos)
      .catch(() => setFavoritos([]))
      .finally(() => setLoadingFavoritos(false));
  }, [tab]);

  async function handleUnfavorite(item: Item) {
    await onToggleFavorite(item);
    setFavoritos((prev) => prev.filter((favorito) => favorito.id !== item.id));
  }

  const list = tab === "meus" ? myItems : favoritos;

  return (
    <div className="overlay-page">
      <div className="mine-header">
        <button className="back-button" onClick={onBack}>
          ← Voltar
        </button>
        <p className="eyebrow">ÁREA DO ESTUDANTE</p>
        <h2>{tab === "meus" ? "Meus anúncios" : "Meus favoritos"}</h2>
        <button className="button button-small" onClick={onOpenPublish}>
          + Novo anúncio
        </button>
      </div>

      <div className="student-tabs">
        <button className={tab === "meus" ? "student-tab active" : "student-tab"} onClick={() => setTab("meus")}>
          Meus anúncios
        </button>
        <button
          className={tab === "favoritos" ? "student-tab active" : "student-tab"}
          onClick={() => setTab("favoritos")}
        >
          Favoritos
        </button>
      </div>

      <div className="item-grid mine-grid">
        {list.map((item) => (
          <ItemCard
            item={item}
            key={item.id}
            onView={onViewItem}
            onToggleFavorite={tab === "favoritos" ? handleUnfavorite : onToggleFavorite}
            isFavorite={tab === "favoritos" ? true : isFavorite(item)}
            showOwnerActions={tab === "meus"}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>

      {tab === "meus" && !myItems.length && <div className="empty-state">Você ainda não publicou nenhum item.</div>}
      {tab === "favoritos" && !loadingFavoritos && !favoritos.length && (
        <div className="empty-state">Você ainda não favoritou nenhum item.</div>
      )}
      {tab === "favoritos" && loadingFavoritos && <div className="empty-state">Carregando favoritos…</div>}
    </div>
  );
}
