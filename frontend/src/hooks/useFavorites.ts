import { useEffect, useState } from "react";
import { addFavorito, fetchFavoritoIds, removeFavorito } from "../api/client";
import type { Item, Usuario } from "../types";

function toId(id: Item["id"]): number {
  return typeof id === "string" ? Number(id) : id;
}

export function useFavorites(user: Usuario | null) {
  const [favoriteIds, setFavoriteIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (!user) {
      setFavoriteIds(new Set());
      return;
    }
    fetchFavoritoIds()
      .then((ids) => setFavoriteIds(new Set(ids)))
      .catch(() => {});
  }, [user]);

  function isFavorite(item: Item): boolean {
    return favoriteIds.has(toId(item.id));
  }

  async function toggleFavorite(item: Item): Promise<void> {
    const id = toId(item.id);
    const wasFavorite = favoriteIds.has(id);

    setFavoriteIds((prev) => {
      const next = new Set(prev);
      if (wasFavorite) next.delete(id);
      else next.add(id);
      return next;
    });

    try {
      if (wasFavorite) await removeFavorito(item.id);
      else await addFavorito(item.id);
    } catch (error) {
      setFavoriteIds((prev) => {
        const next = new Set(prev);
        if (wasFavorite) next.add(id);
        else next.delete(id);
        return next;
      });
      throw error;
    }
  }

  return { favoriteIds, isFavorite, toggleFavorite };
}
