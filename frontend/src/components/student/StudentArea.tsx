import { useEffect, useState } from "react";
import { fetchFavoritos, fetchMeusAnuncios } from "../../api/client";
import type { Item, ProfileFormState, StudentTab, Usuario } from "../../types";
import { ItemCard } from "../marketplace/ItemCard";
import { ProfileTab } from "./ProfileTab";
import "./StudentArea.css";

interface StudentAreaProps {
  user: Usuario | null;
  onBack: () => void;
  onOpenPublish: () => void;
  onViewItem: (item: Item) => void;
  onToggleFavorite: (item: Item) => Promise<void>;
  isFavorite: (item: Item) => boolean;
  onEdit: (item: Item) => void;
  onDelete: (item: Item) => void;
  refreshKey: number;
  onUpdateProfile: (dados: Partial<ProfileFormState>) => Promise<void>;
}

export function StudentArea({
  user,
  onBack,
  onOpenPublish,
  onViewItem,
  onToggleFavorite,
  isFavorite,
  onEdit,
  onDelete,
  refreshKey,
  onUpdateProfile,
}: StudentAreaProps) {
  const [tab, setTab] = useState<StudentTab>("meus");
  const [meusAnuncios, setMeusAnuncios] = useState<Item[]>([]);
  const [loadingMeus, setLoadingMeus] = useState(false);
  const [favoritos, setFavoritos] = useState<Item[]>([]);
  const [loadingFavoritos, setLoadingFavoritos] = useState(false);

  useEffect(() => {
    if (tab !== "meus") return;
    setLoadingMeus(true);
    fetchMeusAnuncios()
      .then(setMeusAnuncios)
      .catch(() => setMeusAnuncios([]))
      .finally(() => setLoadingMeus(false));
  }, [tab, refreshKey]);

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

  async function handleDelete(item: Item) {
    await onDelete(item);
    fetchMeusAnuncios()
      .then(setMeusAnuncios)
      .catch(() => {});
  }

  const list = tab === "meus" ? meusAnuncios : favoritos;

  const titulos: Record<StudentTab, string> = {
    meus: "Meus anúncios",
    favoritos: "Meus favoritos",
    perfil: "Meu perfil",
  };

  return (
    <div className="overlay-page">
      <div className="mine-header">
        <button className="back-button" onClick={onBack}>
          ← Voltar
        </button>
        <p className="eyebrow">ÁREA DO ESTUDANTE</p>
        <h2>{titulos[tab]}</h2>
        {tab !== "perfil" && (
          <button className="button button-small" onClick={onOpenPublish}>
            + Novo anúncio
          </button>
        )}
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
        <button className={tab === "perfil" ? "student-tab active" : "student-tab"} onClick={() => setTab("perfil")}>
          Perfil
        </button>
      </div>

      {tab === "perfil" ? (
        <ProfileTab user={user} onUpdateProfile={onUpdateProfile} />
      ) : (
        <>
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
                onDelete={handleDelete}
              />
            ))}
          </div>

          {tab === "meus" && !loadingMeus && !meusAnuncios.length && (
            <div className="empty-state">Você ainda não publicou nenhum item.</div>
          )}
          {tab === "meus" && loadingMeus && <div className="empty-state">Carregando seus anúncios…</div>}
          {tab === "favoritos" && !loadingFavoritos && !favoritos.length && (
            <div className="empty-state">Você ainda não favoritou nenhum item.</div>
          )}
          {tab === "favoritos" && loadingFavoritos && <div className="empty-state">Carregando favoritos…</div>}
        </>
      )}
    </div>
  );
}
