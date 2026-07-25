from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class AnuncioCreate(BaseModel):
    titulo: str = Field(..., min_length=3, max_length=150)
    descricao: str = Field(..., min_length=5, max_length=1000)
    preco: float = Field(..., ge=0)
    categoria: str = Field(default="Geral", min_length=2, max_length=50)
    tipo_negociacao: str = Field(default="venda", pattern="^(venda|doacao)$")
    condicao: str = Field(default="novo", pattern="^(novo|usado|bom_estado|defeito)$")
    localizacao: str = Field(default="Campus", min_length=2, max_length=100)
    imagem_url: Optional[str] = Field(default=None, max_length=500)
    imagem_nome: Optional[str] = Field(default=None, max_length=255)
    contato: str = Field(..., min_length=5, max_length=150)


class AnuncioUpdate(BaseModel):
    titulo: Optional[str] = Field(None, min_length=3, max_length=150)
    descricao: Optional[str] = Field(None, min_length=5, max_length=1000)
    preco: Optional[float] = Field(None, ge=0)
    categoria: Optional[str] = Field(None, min_length=2, max_length=50)
    tipo_negociacao: Optional[str] = Field(None, pattern="^(venda|doacao)$")
    condicao: Optional[str] = Field(None, pattern="^(novo|usado|bom_estado|defeito)$")
    localizacao: Optional[str] = Field(None, min_length=2, max_length=100)
    imagem_url: Optional[str] = Field(None, max_length=500)
    contato: Optional[str] = Field(None, min_length=5, max_length=150)


class AnuncioResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    titulo: str
    descricao: str
    preco: float
    categoria: str
    tipo_negociacao: str
    condicao: str
    localizacao: str
    imagem_url: Optional[str] = None
    imagem_nome: Optional[str] = None
    contato: str
    usuario_id: int
