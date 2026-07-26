export type TipoNegociacao = "venda" | "doacao";

export type Condicao = "novo" | "usado" | "bom_estado" | "defeito";

export const CATEGORIAS = [
  "Saúde",
  "Tecnologia",
  "Direito",
  "Gestão",
  "Casa",
  "Eletrônicos",
  "Materiais",
  "Outros",
] as const;

export type Categoria = (typeof CATEGORIAS)[number];

export type Ordenacao = "recentes" | "menor_preco" | "maior_preco";

export interface Item {
  id: number | string;
  titulo: string;
  descricao: string;
  preco: number;
  categoria: string;
  categorias?: string[];
  tipo_negociacao: TipoNegociacao;
  condicao?: Condicao;
  localizacao?: string;
  imagem_url?: string;
  imagem_nome?: string;
  contato: string;
  usuario_id: number | string;
  usuario_nome?: string;
}

export interface Usuario {
  id: number | string;
  nome: string;
  email: string;
}

export interface AdFormState {
  titulo: string;
  descricao: string;
  categorias: string[];
  preco: string;
  tipo_negociacao: TipoNegociacao;
  condicao: Condicao;
  localizacao: string;
  imagem_url: string;
  contato: string;
}

export interface ProfileFormState {
  nome: string;
  email: string;
  senha_atual: string;
  nova_senha: string;
}

export type ModalType = "auth" | "publish" | "help" | null;

export type ViewType = "home" | "mine";

export type AuthMode = "login" | "register";

export type StudentTab = "meus" | "favoritos" | "perfil";

export interface AnuncioFiltros {
  categorias?: string[];
  tipoNegociacao?: string;
  condicao?: string;
  localizacao?: string;
  precoMin?: number;
  precoMax?: number;
  ordenacao?: Ordenacao;
  usuarioId?: Item["usuario_id"];
  query?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  usuario: Usuario;
}
