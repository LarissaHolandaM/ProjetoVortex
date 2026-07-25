export type TipoNegociacao = "venda" | "doacao";

export type Condicao = "novo" | "usado" | "bom_estado" | "defeito";

export interface Item {
  id: number | string;
  titulo: string;
  descricao: string;
  preco: number;
  categoria: string;
  tipo_negociacao: TipoNegociacao;
  condicao?: Condicao;
  localizacao?: string;
  imagem_url?: string;
  imagem_nome?: string;
  contato: string;
  usuario_id: number | string;
}

export interface Usuario {
  id: number | string;
  nome: string;
  email: string;
}

export interface AdFormState {
  titulo: string;
  descricao: string;
  categoria: string;
  preco: string;
  tipo_negociacao: TipoNegociacao;
  localizacao: string;
  imagem_url: string;
  contato: string;
}

export type ModalType = "auth" | "publish" | null;

export type ViewType = "home" | "mine";

export type AuthMode = "login" | "register";

export type StudentTab = "meus" | "favoritos";

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
