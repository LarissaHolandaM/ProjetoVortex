import { useState, type FormEvent } from "react";
import type { ProfileFormState, Usuario } from "../../types";
import "./ProfileTab.css";

interface ProfileTabProps {
  user: Usuario | null;
  onUpdateProfile: (dados: Partial<ProfileFormState>) => Promise<void>;
  onLogout: () => void;
}

export function ProfileTab({ user, onUpdateProfile, onLogout }: ProfileTabProps) {
  const [nome, setNome] = useState(user?.nome || "");
  const [email, setEmail] = useState(user?.email || "");
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ tipo: "ok" | "erro"; texto: string } | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setFeedback(null);
    try {
      const dados: Partial<ProfileFormState> = { nome, email };
      if (novaSenha) {
        dados.senha_atual = senhaAtual;
        dados.nova_senha = novaSenha;
      }
      await onUpdateProfile(dados);
      setSenhaAtual("");
      setNovaSenha("");
      setFeedback({ tipo: "ok", texto: "Perfil atualizado com sucesso." });
    } catch (error) {
      setFeedback({
        tipo: "erro",
        texto: error instanceof Error ? error.message : "Não foi possível atualizar seu perfil.",
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="profile-tab">
      <div className="profile-summary">
        <div className="profile-avatar" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="8" r="4" fill="currentColor" />
            <path d="M4 20c0-4.4 3.6-7 8-7s8 2.6 8 7" stroke="currentColor" strokeWidth="1.6" fill="none" />
          </svg>
        </div>
        <div>
          <strong>{user?.nome}</strong>
          <span>{user?.email}</span>
        </div>
      </div>

      <form className="profile-form" onSubmit={handleSubmit}>
        <label>
          Nome
          <input value={nome} onChange={(event) => setNome(event.target.value)} required minLength={2} />
        </label>
        <label>
          E-mail
          <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
        </label>
        <div className="form-row">
          <label>
            Senha atual
            <input
              type="password"
              value={senhaAtual}
              onChange={(event) => setSenhaAtual(event.target.value)}
              placeholder="Necessária só para trocar a senha"
            />
          </label>
          <label>
            Nova senha
            <input
              type="password"
              value={novaSenha}
              onChange={(event) => setNovaSenha(event.target.value)}
              placeholder="Deixe em branco para manter a atual"
              minLength={6}
            />
          </label>
        </div>
        {feedback && <p className={`profile-feedback ${feedback.tipo}`}>{feedback.texto}</p>}
        <button className="button button-small" type="submit" disabled={saving}>
          {saving ? "Salvando…" : "Salvar alterações"}
        </button>
      </form>

      <div className="profile-logout">
        <button type="button" className="text-button danger" onClick={onLogout}>
          Sair da conta ↗
        </button>
      </div>
    </div>
  );
}
