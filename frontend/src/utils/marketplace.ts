import type { AdFormState, Condicao, Item } from "../types";

export const CONDICAO_LABELS: Record<Condicao, string> = {
  novo: "Novo",
  usado: "Usado",
  bom_estado: "Bom estado",
  defeito: "Com defeito",
};

export function getCondicaoLabel(condicao?: Condicao): string {
  if (!condicao) return "Não informado";
  return CONDICAO_LABELS[condicao] ?? condicao;
}

export const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=900&q=80";

export function getItemCategorias(item: Pick<Item, "categoria" | "categorias">): string[] {
  if (item.categorias && item.categorias.length) return item.categorias;
  return item.categoria ? [item.categoria] : [];
}

export function buildAdPayload(form: AdFormState) {
  const categorias = form.categorias?.length ? form.categorias : ["Outros"];

  const normalized: Record<string, unknown> = {
    titulo: form.titulo?.trim(),
    descricao: form.descricao?.trim(),
    categorias,
    localizacao: form.localizacao?.trim() || "Campus",
    tipo_negociacao: form.tipo_negociacao,
    condicao: form.condicao || "novo",
    contato: form.contato?.trim(),
    preco: form.tipo_negociacao === "doacao" ? 0 : Number(form.preco || 0),
    imagem_url: form.imagem_url,
  };

  if (!normalized.imagem_url || !(normalized.imagem_url as string).trim()) {
    delete normalized.imagem_url;
  }

  return normalized;
}

export function getItemImage(item?: Pick<Item, "imagem_url">): string {
  return item?.imagem_url?.trim() || FALLBACK_IMAGE;
}

export function formatPrice(item: Pick<Item, "preco" | "tipo_negociacao">): string {
  if (item.tipo_negociacao === "doacao" || Number(item.preco) === 0) return "Grátis";
  return `R$ ${Number(item.preco).toFixed(2).replace(".", ",")}`;
}

const DESCRICAO_LIMITE = 200;

export function truncateDescricao(descricao: string, limite: number = DESCRICAO_LIMITE): string {
  const texto = descricao?.trim() ?? "";
  if (texto.length <= limite) return texto;
  return `${texto.slice(0, limite).trimEnd()}...`;
}
