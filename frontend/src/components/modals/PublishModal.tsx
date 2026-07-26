import type { ChangeEvent, FormEvent } from "react";
import { CATEGORIAS } from "../../types";
import type { AdFormState, Condicao } from "../../types";
import { CONDICAO_LABELS } from "../../utils/marketplace";
import "./Modal.css";

interface PublishModalProps {
  form: AdFormState;
  isEditing: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onToggleCategoria: (categoria: string) => void;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export function PublishModal({
  form,
  isEditing,
  onChange,
  onToggleCategoria,
  onClose,
  onSubmit,
}: PublishModalProps) {
  return (
    <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="modal">
        <button className="modal-close" onClick={onClose}>
          ×
        </button>
        <p className="eyebrow">{isEditing ? "EDITAR ANÚNCIO" : "NOVO ANÚNCIO"}</p>
        <h2>
          {isEditing ? (
            <>
              Ajuste os <em>detalhes</em>
              <br /> do seu anúncio.
            </>
          ) : (
            <>
              Dê um novo <em>destino</em>
              <br /> ao seu item.
            </>
          )}
        </h2>
        <form onSubmit={onSubmit} className="publish-form">
          <label>
            Título
            <input
              name="titulo"
              value={form.titulo}
              onChange={onChange}
              placeholder="Ex.: Livro de Cálculo I"
              required
            />
          </label>
          <label>
            Descrição
            <textarea
              name="descricao"
              value={form.descricao}
              onChange={onChange}
              placeholder="Conte um pouco sobre o estado do item"
              required
            />
          </label>
          <label>
            Categorias
            <span className="categoria-picker">
              {CATEGORIAS.map((categoria) => (
                <button
                  type="button"
                  key={categoria}
                  className={form.categorias.includes(categoria) ? "categoria-pill active" : "categoria-pill"}
                  onClick={() => onToggleCategoria(categoria)}
                >
                  {categoria}
                </button>
              ))}
            </span>
          </label>
          <div className="form-row">
            <label>
              Negociação
              <select name="tipo_negociacao" value={form.tipo_negociacao} onChange={onChange}>
                <option value="venda">À venda</option>
                <option value="doacao">Doação</option>
              </select>
            </label>
            <label>
              Preço (R$)
              <input
                name="preco"
                value={form.preco}
                onChange={onChange}
                type="number"
                min="0"
                step="0.01"
                inputMode="decimal"
                disabled={form.tipo_negociacao === "doacao"}
                placeholder="0,00"
              />
            </label>
          </div>
          <label>
            Condição do item
            <select name="condicao" value={form.condicao} onChange={onChange}>
              {(Object.keys(CONDICAO_LABELS) as Condicao[]).map((condicao) => (
                <option key={condicao} value={condicao}>
                  {CONDICAO_LABELS[condicao]}
                </option>
              ))}
            </select>
          </label>
          <label>
            Localização
            <input
              name="localizacao"
              value={form.localizacao}
              onChange={onChange}
              placeholder="Ex.: Bloco B"
              required
            />
          </label>
          <label>
            URL da imagem
            <input
              name="imagem_url"
              value={form.imagem_url}
              onChange={onChange}
              type="url"
              placeholder="https://... (opcional)"
            />
          </label>
          <label>
            Contato para o comprador
            <input
              name="contato"
              value={form.contato}
              onChange={onChange}
              placeholder="WhatsApp, e-mail ou telefone"
              minLength={5}
              required
            />
          </label>
          <button className="button" type="submit">
            {isEditing ? "Salvar alterações ↗" : "Publicar anúncio ↗"}
          </button>
        </form>
      </div>
    </div>
  );
}
