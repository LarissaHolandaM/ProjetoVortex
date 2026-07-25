import type { AdFormState, Item, PaginatedResponse, TokenResponse } from "../types";

export const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export const AUTH_TOKEN_KEY = "vortex-token";
export const AUTH_USER_KEY = "vortex-user";

function getToken(): string {
  return localStorage.getItem(AUTH_TOKEN_KEY) || "demo";
}

function authHeaders(): HeadersInit {
  return { Authorization: `Bearer ${getToken()}` };
}

export async function fetchAnuncios(limit = 20): Promise<Item[]> {
  const response = await fetch(`${API_URL}/anuncios/?limit=${limit}`);
  if (!response.ok) return Promise.reject(new Error("Falha ao carregar anúncios"));
  const data: PaginatedResponse<Item> = await response.json();
  return data.items || [];
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

export async function createAnuncio(payload: Partial<AdFormState> & { preco: number }): Promise<Item> {
  const response = await fetch(`${API_URL}/anuncios/`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error("Não foi possível publicar o anúncio");
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
  if (!response.ok) throw new Error("Não foi possível salvar as alterações");
  return response.json();
}

export async function deleteAnuncio(id: Item["id"]): Promise<void> {
  const response = await fetch(`${API_URL}/anuncios/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!response.ok) throw new Error("Não foi possível remover o anúncio");
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
