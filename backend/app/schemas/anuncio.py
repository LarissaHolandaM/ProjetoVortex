from typing import Optional

from pydantic import BaseModel, ConfigDict, Field, field_validator

CATEGORIAS_VALIDAS = [
    "Saúde",
    "Tecnologia",
    "Direito",
    "Gestão",
    "Casa",
    "Eletrônicos",
    "Materiais",
    "Outros",
]


def _validar_categorias(valores: list[str]) -> list[str]:
    if not valores:
        raise ValueError("Selecione ao menos uma categoria")

    invalidas = [v for v in valores if v not in CATEGORIAS_VALIDAS]
    if invalidas:
        raise ValueError(f"Categorias inválidas: {', '.join(invalidas)}")

    unicas: list[str] = []
    for valor in valores:
        if valor not in unicas:
            unicas.append(valor)
    return unicas[:5]


class AnuncioCreate(BaseModel):
    titulo: str = Field(..., min_length=3, max_length=150)
    descricao: str = Field(..., min_length=5, max_length=1000)
    preco: float = Field(..., ge=0)
    categorias: list[str] = Field(default_factory=lambda: ["Outros"])
    tipo_negociacao: str = Field(default="venda", pattern="^(venda|doacao)$")
    condicao: str = Field(default="novo", pattern="^(novo|usado|bom_estado|defeito)$")
    localizacao: str = Field(default="Campus", min_length=2, max_length=100)
    imagem_url: Optional[str] = Field(default=None, max_length=500)
    imagem_nome: Optional[str] = Field(default=None, max_length=255)
    contato: str = Field(..., min_length=5, max_length=150)

    @field_validator("categorias")
    @classmethod
    def validar_categorias(cls, valores: list[str]) -> list[str]:
        return _validar_categorias(valores)


class AnuncioUpdate(BaseModel):
    titulo: Optional[str] = Field(None, min_length=3, max_length=150)
    descricao: Optional[str] = Field(None, min_length=5, max_length=1000)
    preco: Optional[float] = Field(None, ge=0)
    categorias: Optional[list[str]] = None
    tipo_negociacao: Optional[str] = Field(None, pattern="^(venda|doacao)$")
    condicao: Optional[str] = Field(None, pattern="^(novo|usado|bom_estado|defeito)$")
    localizacao: Optional[str] = Field(None, min_length=2, max_length=100)
    imagem_url: Optional[str] = Field(None, max_length=500)
    contato: Optional[str] = Field(None, min_length=5, max_length=150)

    @field_validator("categorias")
    @classmethod
    def validar_categorias(cls, valores: Optional[list[str]]) -> Optional[list[str]]:
        if valores is None:
            return None
        return _validar_categorias(valores)


class AnuncioResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    titulo: str
    descricao: str
    preco: float
    categoria: str
    categorias: list[str]
    tipo_negociacao: str
    condicao: str
    localizacao: str
    imagem_url: Optional[str] = None
    imagem_nome: Optional[str] = None
    contato: str
    usuario_id: int
    usuario_nome: Optional[str] = None
