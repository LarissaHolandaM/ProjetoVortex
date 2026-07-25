import { useState } from "react";
import { AUTH_TOKEN_KEY, AUTH_USER_KEY, login, register } from "../api/client";
import type { Usuario } from "../types";

function readStoredUser(): Usuario | null {
  try {
    return JSON.parse(localStorage.getItem(AUTH_USER_KEY) || "null");
  } catch {
    return null;
  }
}

export function useAuth() {
  const [user, setUser] = useState<Usuario | null>(readStoredUser);

  function persist(nextUser: Usuario, token: string) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(nextUser));
    setUser(nextUser);
  }

  async function loginUser(email: string, senha: string): Promise<Usuario> {
    const data = await login(email, senha);
    persist(data.usuario, data.access_token);
    return data.usuario;
  }

  async function registerUser(nome: string, email: string, senha: string): Promise<Usuario> {
    const data = await register(nome, email, senha);
    persist(data.usuario, data.access_token);
    return data.usuario;
  }

  function logout() {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
    setUser(null);
  }

  return { user, loginUser, registerUser, logout };
}
