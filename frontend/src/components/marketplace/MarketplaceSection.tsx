import { useState } from "react";
import { CATEGORIAS } from "../../types";
import type { Condicao, Item, Ordenacao, TipoNegociacao } from "../../types";
import { CONDICAO_LABELS } from "../../utils/marketplace";
import { ItemCard } from "./ItemCard";
import "./MarketplaceSection.css";

const CATEGORIAS_FILTRO = ["Todos", ...CATEGORIAS];

interface MarketplaceSectionProps {
  categorias: string[];
  onToggleCategoria: (categoria: string) => void;
  query: string;
  onQueryChange: (query: string) => void;
  tipoNegociacao: TipoNegociacao | "todos";
  onTipoNegociacaoChange: (tipo: TipoNegociacao | "todos") => void;
  condicao: string;
  onCondicaoChange: (condicao: string) => void;
  localizacao: string;
  onLocalizacaoChange: (localizacao: string) => void;
  precoMin: string;
  onPrecoMinChange: (preco: string) => void;
  precoMax: string;
  onPrecoMaxChange: (preco: string) => void;
  ordenacao: Ordenacao;
  onOrdenacaoChange: (ordenacao: Ordenacao) => void;
  sellerName: string;
  onClearSellerFilter: () => void;
  onClearFilters: () => void;
  items: Item[];
  onViewItem: (item: Item) => void;
  onToggleFavorite: (item: Item) => void;
  isFavorite: (item: Item) => boolean;
}

export function MarketplaceSection({
  categorias,
  onToggleCategoria,
  query,
  onQueryChange,
  tipoNegociacao,
  onTipoNegociacaoChange,
  condicao,
  onCondicaoChange,
  localizacao,
  onLocalizacaoChange,
  precoMin,
  onPrecoMinChange,
  precoMax,
  onPrecoMaxChange,
  ordenacao,
  onOrdenacaoChange,
  sellerName,
  onClearSellerFilter,
  onClearFilters,
  items,
  onViewItem,
  onToggleFavorite,
  isFavorite,
}: MarketplaceSectionProps) {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <section className="marketplace-section" id="marketplace">
      <div className="section-heading">
        <div>
          <p className="eyebrow">A VITRINE DO CAMPUS</p>
          <h2>
            Encontre o próximo
            <br />
            <em>capítulo</em> do seu item.
          </h2>
        </div>
        <div className="search-controls">
          <div className="search-box">
            <span>⌕</span>
            <input
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              placeholder="O que você está procurando?"
            />
          </div>
          <button
            className={showFilters ? "filters-toggle active" : "filters-toggle"}
            onClick={() => setShowFilters((prev) => !prev)}
          >
            Filtros {showFilters ? "▲" : "▼"}
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="filters-panel">
          <label>
            Ordenar por
            <select value={ordenacao} onChange={(event) => onOrdenacaoChange(event.target.value as Ordenacao)}>
              <option value="recentes">Mais recentes</option>
              <option value="menor_preco">Menor preço</option>
              <option value="maior_preco">Maior preço</option>
            </select>
          </label>
          <label>
            Negociação
            <select
              value={tipoNegociacao}
              onChange={(event) => onTipoNegociacaoChange(event.target.value as TipoNegociacao | "todos")}
            >
              <option value="todos">Todos</option>
              <option value="venda">À venda</option>
              <option value="doacao">Doação</option>
            </select>
          </label>
          <label>
            Condição
            <select value={condicao} onChange={(event) => onCondicaoChange(event.target.value)}>
              <option value="todos">Todas</option>
              {(Object.keys(CONDICAO_LABELS) as Condicao[]).map((item) => (
                <option key={item} value={item}>
                  {CONDICAO_LABELS[item]}
                </option>
              ))}
            </select>
          </label>
          <label>
            Preço mínimo (R$)
            <input
              value={precoMin}
              onChange={(event) => onPrecoMinChange(event.target.value)}
              type="number"
              min="0"
              step="0.01"
              inputMode="decimal"
              placeholder="0,00"
            />
          </label>
          <label>
            Preço máximo (R$)
            <input
              value={precoMax}
              onChange={(event) => onPrecoMaxChange(event.target.value)}
              type="number"
              min="0"
              step="0.01"
              inputMode="decimal"
              placeholder="0,00"
            />
          </label>
          <label>
            Localização
            <input
              value={localizacao}
              onChange={(event) => onLocalizacaoChange(event.target.value)}
              placeholder="Ex.: Bloco B"
            />
          </label>
          <button className="link-button" onClick={onClearFilters}>
            Limpar filtros
          </button>
        </div>
      )}

      <div className="category-row">
        {CATEGORIAS_FILTRO.map((item) => {
          const active = item === "Todos" ? categorias.length === 0 : categorias.includes(item);
          return (
            <button
              className={active ? "category active" : "category"}
              key={item}
              aria-pressed={active}
              onClick={() => onToggleCategoria(item)}
            >
              {item}
            </button>
          );
        })}
      </div>

      {sellerName && (
        <div className="seller-banner">
          Mostrando anúncios de <strong>{sellerName}</strong>
          <button className="link-button" onClick={onClearSellerFilter}>
            limpar
          </button>
        </div>
      )}

      <div className="item-grid">
        {items.map((item) => (
          <ItemCard
            item={item}
            key={item.id}
            onView={onViewItem}
            onToggleFavorite={onToggleFavorite}
            isFavorite={isFavorite(item)}
          />
        ))}
      </div>
      {!items.length && <div className="empty-state">Nenhum item encontrado. Tente outro termo ou filtro.</div>}
    </section>
  );
}
