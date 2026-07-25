export const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=900&q=80";

export function buildAdPayload(form) {
  const normalized = {
    ...form,
    titulo: form.titulo?.trim(),
    descricao: form.descricao?.trim(),
    categoria: form.categoria?.trim() || "Geral",
    localizacao: form.localizacao?.trim() || "Campus",
    preco: form.tipo_negociacao === "doacao" ? 0 : Number(form.preco || 0),
  };

  if (!normalized.imagem_url || !normalized.imagem_url.trim()) {
    delete normalized.imagem_url;
  }

  if (!normalized.imagem_nome || !normalized.imagem_nome.trim()) {
    delete normalized.imagem_nome;
  }

  return normalized;
}

export function getItemImage(item) {
  return item?.imagem_url?.trim() || FALLBACK_IMAGE;
}
