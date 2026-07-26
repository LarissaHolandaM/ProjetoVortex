import { useEffect, useMemo, useState } from "react";
import { createAnuncio, deleteAnuncio, fetchAnuncios, updateAnuncio } from "../api/client";
import { buildAdPayload, FALLBACK_IMAGE } from "../utils/marketplace";
import type { AdFormState, AnuncioFiltros, Item, Ordenacao, Usuario } from "../types";

export function useItems() {
  const [items, setItems] = useState<Item[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [categorias, setCategorias] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [tipoNegociacao, setTipoNegociacao] = useState("todos");
  const [condicaoFiltro, setCondicaoFiltro] = useState("todos");
  const [localizacao, setLocalizacao] = useState("");
  const [precoMin, setPrecoMin] = useState("");
  const [precoMax, setPrecoMax] = useState("");
  const [ordenacao, setOrdenacao] = useState<Ordenacao>("recentes");
  const [sellerId, setSellerId] = useState<Item["usuario_id"] | null>(null);
  const [sellerName, setSellerName] = useState<string>("");

  function toggleCategoria(categoria: string) {
    if (categoria === "Todos") {
      setCategorias([]);
      return;
    }
    setCategorias((prev) =>
      prev.includes(categoria) ? prev.filter((item) => item !== categoria) : [...prev, categoria],
    );
  }

  const filtros: AnuncioFiltros = useMemo(
    () => ({
      categorias,
      query,
      tipoNegociacao,
      condicao: condicaoFiltro !== "todos" ? condicaoFiltro : undefined,
      localizacao,
      precoMin: precoMin !== "" ? Number(precoMin) : undefined,
      precoMax: precoMax !== "" ? Number(precoMax) : undefined,
      ordenacao,
      usuarioId: sellerId ?? undefined,
    }),
    [categorias, query, tipoNegociacao, condicaoFiltro, localizacao, precoMin, precoMax, ordenacao, sellerId],
  );

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const timeout = setTimeout(() => {
      fetchAnuncios(filtros, 40)
        .then((data) => {
          if (cancelled) return;
          setItems(data.items);
          setTotal(data.total);
        })
        .catch(() => {})
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    }, 250);
    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [filtros]);

  function clearFilters() {
    setCategorias([]);
    setQuery("");
    setTipoNegociacao("todos");
    setCondicaoFiltro("todos");
    setLocalizacao("");
    setPrecoMin("");
    setPrecoMax("");
    setOrdenacao("recentes");
    setSellerId(null);
    setSellerName("");
  }

  function viewSellerItems(item: Item) {
    setSellerId(item.usuario_id);
    setSellerName(item.usuario_nome || "");
    setCategorias([]);
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
    loading,
    categorias,
    toggleCategoria,
    query,
    setQuery,
    tipoNegociacao,
    setTipoNegociacao,
    condicaoFiltro,
    setCondicaoFiltro,
    localizacao,
    setLocalizacao,
    precoMin,
    setPrecoMin,
    precoMax,
    setPrecoMax,
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
