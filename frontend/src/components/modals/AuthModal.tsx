import { type FormEvent, useState } from "react";
import type { AuthMode } from "../../types";
import "./Modal.css";

interface AuthModalProps {
  onClose: () => void;
  onSubmit: (mode: AuthMode, nome: string, email: string, senha: string) => void;
}

export function AuthModal({ onClose, onSubmit }: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>("login");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const nome = mode === "register" ? (form.elements.namedItem("nome") as HTMLInputElement).value : "";
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const senha = (form.elements.namedItem("senha") as HTMLInputElement).value;
    onSubmit(mode, nome, email, senha);
  }

  return (
    <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="modal">
        <button className="modal-close" onClick={onClose}>
          ×
        </button>
        <p className="eyebrow">BEM-VINDO AO VORTEX</p>
        <h2>
          {mode === "login" ? (
            <>
              Entre para fazer
              <br />
              <em>circular.</em>
            </>
          ) : (
            <>
              Crie sua conta e
              <br />
              <em>comece a circular.</em>
            </>
          )}
        </h2>
        <form onSubmit={handleSubmit} key={mode}>
          {mode === "register" && (
            <label>
              Seu nome
              <input name="nome" placeholder="Como podemos te chamar?" required />
            </label>
          )}
          <label>
            E-mail acadêmico
            <input name="email" type="email" placeholder="voce@universidade.edu" required />
          </label>
          <label>
            Senha
            <input name="senha" type="password" placeholder="Mínimo 6 caracteres" minLength={6} required />
          </label>
          <button className="button" type="submit">
            {mode === "login" ? "Entrar ↗" : "Criar conta ↗"}
          </button>
        </form>
        <small>
          {mode === "login" ? (
            <>
              Ainda não tem conta?{" "}
              <button className="link-button" type="button" onClick={() => setMode("register")}>
                Cadastre-se
              </button>
            </>
          ) : (
            <>
              Já tem conta?{" "}
              <button className="link-button" type="button" onClick={() => setMode("login")}>
                Entrar
              </button>
            </>
          )}
        </small>
      </div>
    </div>
  );
}
