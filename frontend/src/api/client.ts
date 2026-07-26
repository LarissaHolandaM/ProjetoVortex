import type { AdFormState, AnuncioFiltros, Item, PaginatedResponse, TokenResponse } from "../types";

export const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export const AUTH_TOKEN_KEY = "vortex-token";
export const AUTH_USER_KEY = "vortex-user";

function getToken(): string {
  return localStorage.getItem(AUTH_TOKEN_KEY) || "demo";
}

function authHeaders(): HeadersInit {
  return { Authorization: `Bearer ${getToken()}` };
}

function buildOrderParams(ordenacao?: AnuncioFiltros["ordenacao"]): { order_by: string; order_desc: string } {
  if (ordenacao === "menor_preco") return { order_by: "preco", order_desc: "false" };
  if (ordenacao === "maior_preco") return { order_by: "preco", order_desc: "true" };
  return { order_by: "created_at", order_desc: "true" };
}

export function buildAnuncioQuery(filtros: AnuncioFiltros, limit: number): string {
  const params = new URLSearchParams();
  params.set("limit", String(limit));

  if (filtros.query) params.set("titulo", filtros.query);
  (filtros.categorias || [])
    .filter((categoria) => categoria.toLowerCase() !== "todos")
    .forEach((categoria) => params.append("categoria", categoria));
  if (filtros.tipoNegociacao && filtros.tipoNegociacao !== "todos") params.set("tipo_negociacao", filtros.tipoNegociacao);
  if (filtros.condicao && filtros.condicao !== "todos") params.set("condicao", filtros.condicao);
  if (filtros.localizacao) params.set("localizacao", filtros.localizacao);
  if (filtros.precoMin !== undefined && !Number.isNaN(filtros.precoMin)) params.set("preco_min", String(filtros.precoMin));
  if (filtros.precoMax !== undefined && !Number.isNaN(filtros.precoMax)) params.set("preco_max", String(filtros.precoMax));
  if (filtros.usuarioId !== undefined && filtros.usuarioId !== null) params.set("usuario_id", String(filtros.usuarioId));

  const { order_by, order_desc } = buildOrderParams(filtros.ordenacao);
  params.set("order_by", order_by);
  params.set("order_desc", order_desc);

  return params.toString();
}

export async function fetchAnuncios(filtros: AnuncioFiltros = {}, limit = 20): Promise<PaginatedResponse<Item>> {
  const query = buildAnuncioQuery(filtros, limit);
  const response = await fetch(`${API_URL}/anuncios/?${query}`);
  if (!response.ok) return Promise.reject(new Error("Falha ao carregar anúncios"));
  const data: PaginatedResponse<Item> = await response.json();
  return { items: data.items || [], total: data.total || 0, page: data.page || 0, size: data.size || limit };
}

async function readErrorMessage(response: Response, fallback: string): Promise<string> {
  try {
    const data = await response.json();
    if (typeof data?.detail === "string") return data.detail;
  } catch {
    // resposta sem corpo JSON legível, usa a mensagem padrão
  }
  return fallback;
}

export async function login(email: string, senha: string): Promise<TokenResponse> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, senha }),
  });
  if (!response.ok) throw new Error(await readErrorMessage(response, "Credenciais inválidas"));
  return response.json();
}

export async function register(nome: string, email: string, senha: string): Promise<TokenResponse> {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome, email, senha }),
  });
  if (!response.ok) throw new Error(await readErrorMessage(response, "Não foi possível criar sua conta"));
  return response.json();
}

export async function updateProfile(payload: {
  nome?: string;
  email?: string;
  senha_atual?: string;
  nova_senha?: string;
}): Promise<{ id: number | string; nome: string; email: string }> {
  const response = await fetch(`${API_URL}/auth/me`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error(await readErrorMessage(response, "Não foi possível atualizar seu perfil"));
  return response.json();
}

export async function createAnuncio(payload: Partial<AdFormState> & { preco: number }): Promise<Item> {
  const response = await fetch(`${API_URL}/anuncios/`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error(await readErrorMessage(response, "Não foi possível publicar o anúncio"));
  return response.json();
}

export async function updateAnuncio(
  id: Item["id"],
  payload: Partial<AdFormState> & { preco?: number },
): Promise<Item> {
  const response = await fetch(`${API_URL}/anuncios/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error(await readErrorMessage(response, "Não foi possível salvar as alterações"));
  return response.json();
}

export async function deleteAnuncio(id: Item["id"]): Promise<void> {
  const response = await fetch(`${API_URL}/anuncios/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!response.ok) throw new Error("Não foi possível remover o anúncio");
}

export async function fetchMeusAnuncios(limit = 50): Promise<Item[]> {
  const response = await fetch(`${API_URL}/anuncios/meus?limit=${limit}`, {
    headers: authHeaders(),
  });
  if (!response.ok) return Promise.reject(new Error("Falha ao carregar seus anúncios"));
  const data: PaginatedResponse<Item> = await response.json();
  return data.items || [];
}

export async function fetchFavoritoIds(): Promise<number[]> {
  const response = await fetch(`${API_URL}/favoritos/ids`, {
    headers: authHeaders(),
  });
  if (!response.ok) return Promise.reject(new Error("Falha ao carregar favoritos"));
  return response.json();
}

export async function fetchFavoritos(limit = 50): Promise<Item[]> {
  const response = await fetch(`${API_URL}/favoritos/?limit=${limit}`, {
    headers: authHeaders(),
  });
  if (!response.ok) return Promise.reject(new Error("Falha ao carregar favoritos"));
  const data: PaginatedResponse<Item> = await response.json();
  return data.items || [];
}

export async function addFavorito(anuncioId: Item["id"]): Promise<void> {
  const response = await fetch(`${API_URL}/favoritos/${anuncioId}`, {
    method: "POST",
    headers: authHeaders(),
  });
  if (!response.ok) throw new Error("Não foi possível favoritar este item");
}

export async function removeFavorito(anuncioId: Item["id"]): Promise<void> {
  const response = await fetch(`${API_URL}/favoritos/${anuncioId}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!response.ok) throw new Error("Não foi possível remover este favorito");
}
