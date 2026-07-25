from typing import List, Tuple

from sqlalchemy.orm import Session

from app.core.exceptions import NotFoundError, ValidationError
from app.models.anuncio import Anuncio
from app.repositories.anuncio_repository import AnuncioRepository
from app.repositories.favorito_repository import FavoritoRepository
from app.schemas.anuncio import AnuncioCreate, AnuncioUpdate


class AnuncioService:
    def __init__(self, db: Session):
        self.repository = AnuncioRepository(db)
        self.favorito_repository = FavoritoRepository(db)

    def create(self, anuncio_data: AnuncioCreate, usuario_id: int) -> Anuncio:
        if not anuncio_data.titulo or len(anuncio_data.titulo.strip()) < 3:
            raise ValidationError("Título inválido")
        imagem_url = anuncio_data.imagem_url
        if anuncio_data.imagem_nome and not imagem_url:
            imagem_url = f"/uploads/{anuncio_data.imagem_nome}"

        anuncio = Anuncio(
            titulo=anuncio_data.titulo,
            descricao=anuncio_data.descricao,
            preco=anuncio_data.preco,
            categoria=anuncio_data.categoria,
            tipo_negociacao=anuncio_data.tipo_negociacao,
            condicao=anuncio_data.condicao,
            localizacao=anuncio_data.localizacao,
            imagem_url=imagem_url,
            contato=anuncio_data.contato,
            usuario_id=usuario_id,
        )
        return self.repository.create(anuncio)

    def list(
        self,
        titulo: str | None = None,
        categoria: str | None = None,
        tipo_negociacao: str | None = None,
        condicao: str | None = None,
        localizacao: str | None = None,
        preco_min: float | None = None,
        preco_max: float | None = None,
        order_by: str = "created_at",
        order_desc: bool = True,
        skip: int = 0,
        limit: int = 10,
    ) -> Tuple[List[Anuncio], int]:
        if skip < 0:
            raise ValidationError("skip não pode ser negativo")
        if limit <= 0:
            raise ValidationError("limit deve ser maior que zero")
        if preco_min is not None and preco_min < 0:
            raise ValidationError("preco_min não pode ser negativo")
        if preco_max is not None and preco_max < 0:
            raise ValidationError("preco_max não pode ser negativo")
        if preco_min is not None and preco_max is not None and preco_min > preco_max:
            raise ValidationError("preco_min não pode ser maior que preco_max")
        return self.repository.list(
            titulo=titulo,
            categoria=categoria,
            tipo_negociacao=tipo_negociacao,
            condicao=condicao,
            localizacao=localizacao,
            preco_min=preco_min,
            preco_max=preco_max,
            order_by=order_by,
            order_desc=order_desc,
            skip=skip,
            limit=limit,
        )

    def list_by_user(self, usuario_id: int, skip: int = 0, limit: int = 10) -> Tuple[List[Anuncio], int]:
        if skip < 0:
            raise ValidationError("skip não pode ser negativo")
        if limit <= 0:
            raise ValidationError("limit deve ser maior que zero")
        return self.repository.list_by_user(usuario_id=usuario_id, skip=skip, limit=limit)

    def get_by_id(self, anuncio_id: int) -> Anuncio:
        anuncio = self.repository.get_by_id(anuncio_id)
        if not anuncio:
            raise NotFoundError("Anúncio não encontrado")
        return anuncio

    def update(self, anuncio_id: int, anuncio_data: AnuncioUpdate, usuario_id: int) -> Anuncio:
        anuncio = self.get_by_id(anuncio_id)
        if anuncio.usuario_id != usuario_id:
            raise ValidationError("Você não pode editar este anúncio")

        if anuncio_data.titulo is not None:
            anuncio.titulo = anuncio_data.titulo
        if anuncio_data.descricao is not None:
            anuncio.descricao = anuncio_data.descricao
        if anuncio_data.preco is not None:
            anuncio.preco = anuncio_data.preco
        if anuncio_data.categoria is not None:
            anuncio.categoria = anuncio_data.categoria
        if anuncio_data.tipo_negociacao is not None:
            anuncio.tipo_negociacao = anuncio_data.tipo_negociacao
        if anuncio_data.condicao is not None:
            anuncio.condicao = anuncio_data.condicao
        if anuncio_data.localizacao is not None:
            anuncio.localizacao = anuncio_data.localizacao
        if anuncio_data.imagem_url is not None:
            anuncio.imagem_url = anuncio_data.imagem_url
        if anuncio_data.contato is not None:
            anuncio.contato = anuncio_data.contato

        return self.repository.update(anuncio)

    def delete(self, anuncio_id: int, usuario_id: int) -> None:
        anuncio = self.get_by_id(anuncio_id)
        if anuncio.usuario_id != usuario_id:
            raise ValidationError("Você não pode remover este anúncio")
        self.favorito_repository.delete_by_anuncio(anuncio_id)
        self.repository.delete(anuncio)
