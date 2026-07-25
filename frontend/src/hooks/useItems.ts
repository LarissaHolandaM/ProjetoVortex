import { useEffect, useMemo, useState } from "react";
import { createAnuncio, deleteAnuncio, fetchAnuncios, updateAnuncio } from "../api/client";
import { buildAdPayload, FALLBACK_IMAGE } from "../utils/marketplace";
import type { AdFormState, Item, Usuario } from "../types";

export function useItems() {
  const [items, setItems] = useState<Item[]>([]);
  const [category, setCategory] = useState("Todos");
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetchAnuncios(20)
      .then(setItems)
      .catch(() => {});
  }, []);

  const filtered = useMemo(
    () =>
      items.filter(
        (item) =>
          (category === "Todos" || item.categoria?.toLowerCase() === category.toLowerCase()) &&
          (!query ||
            `${item.titulo} ${item.descricao} ${item.categoria}`.toLowerCase().includes(query.toLowerCase())),
      ),
    [items, category, query],
  );

  async function publish(form: AdFormState, user: Usuario): Promise<Item> {
    const payload = buildAdPayload(form) as Partial<AdFormState> & { preco: number };
    try {
      const created = await createAnuncio(payload);
      setItems((prev) => [created, ...prev]);
      return created;
    } catch {
      const fallback: Item = {
        ...(payload as unknown as Item),
        id: `local-${Date.now()}`,
        usuario_id: user.id,
        imagem_url: payload.imagem_url || FALLBACK_IMAGE,
      };
      setItems((prev) => [fallback, ...prev]);
      return fallback;
    }
  }

  async function edit(id: Item["id"], form: AdFormState): Promise<Item> {
    const payload = buildAdPayload(form) as Partial<AdFormState> & { preco: number };
    const updated = await updateAnuncio(id, payload);
    setItems((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
    return updated;
  }

  async function remove(id: Item["id"]): Promise<void> {
    await deleteAnuncio(id);
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  return { items, filtered, category, setCategory, query, setQuery, publish, edit, remove };
}
