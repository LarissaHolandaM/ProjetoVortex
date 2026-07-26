from typing import Optional

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class UsuarioCreate(BaseModel):
    nome: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    senha: str = Field(..., min_length=6, max_length=100)


class UsuarioUpdate(BaseModel):
    nome: Optional[str] = Field(None, min_length=2, max_length=100)
    email: Optional[EmailStr] = None
    senha_atual: Optional[str] = Field(None, min_length=6, max_length=100)
    nova_senha: Optional[str] = Field(None, min_length=6, max_length=100)


class UsuarioResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    nome: str
    email: str
