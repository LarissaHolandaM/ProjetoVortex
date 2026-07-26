import { useEffect, useMemo, useState } from "react";
import { createAnuncio, deleteAnuncio, fetchAnuncios, updateAnuncio } from "../api/client";
import { buildAdPayload, FALLBACK_IMAGE } from "../utils/marketplace";
import type { AdFormState, AnuncioFiltros, Item, Ordenacao, Usuario } from "../types";

export function useItems() {
  const [items, setItems] = useState<Item[]>([]);
  const [total, setTotal] = useState(0);
  const [category, setCategory] = useState("Todos");
  const [query, setQuery] = useState("");
  const [tipoNegociacao, setTipoNegociacao] = useState("todos");
  const [localizacao, setLocalizacao] = useState("");
  const [ordenacao, setOrdenacao] = useState<Ordenacao>("recentes");
  const [sellerId, setSellerId] = useState<Item["usuario_id"] | null>(null);
  const [sellerName, setSellerName] = useState<string>("");

  const filtros: AnuncioFiltros = useMemo(
    () => ({
      categoria: category,
      query,
      tipoNegociacao,
      localizacao,
      ordenacao,
      usuarioId: sellerId ?? undefined,
    }),
    [category, query, tipoNegociacao, localizacao, ordenacao, sellerId],
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchAnuncios(filtros, 40)
        .then((data) => {
          setItems(data.items);
          setTotal(data.total);
        })
        .catch(() => {});
    }, 250);
    return () => clearTimeout(timeout);
  }, [filtros]);

  function clearFilters() {
    setCategory("Todos");
    setQuery("");
    setTipoNegociacao("todos");
    setLocalizacao("");
    setOrdenacao("recentes");
    setSellerId(null);
    setSellerName("");
  }

  function viewSellerItems(item: Item) {
    setSellerId(item.usuario_id);
    setSellerName(item.usuario_nome || "");
    setCategory("Todos");
  }

  function clearSellerFilter() {
    setSellerId(null);
    setSellerName("");
  }

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

  return {
    items,
    filtered: items,
    total,
    category,
    setCategory,
    query,
    setQuery,
    tipoNegociacao,
    setTipoNegociacao,
    localizacao,
    setLocalizacao,
    ordenacao,
    setOrdenacao,
    sellerId,
    sellerName,
    viewSellerItems,
    clearSellerFilter,
    clearFilters,
    publish,
    edit,
    remove,
  };
}
