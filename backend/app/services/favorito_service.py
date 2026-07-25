from typing import List, Tuple

from sqlalchemy.orm import Session

from app.core.exceptions import NotFoundError, ValidationError
from app.models.anuncio import Anuncio
from app.models.favorito import Favorito
from app.repositories.anuncio_repository import AnuncioRepository
from app.repositories.favorito_repository import FavoritoRepository


class FavoritoService:
    def __init__(self, db: Session):
        self.repository = FavoritoRepository(db)
        self.anuncio_repository = AnuncioRepository(db)

    def add(self, anuncio_id: int, usuario_id: int) -> Favorito:
        anuncio = self.anuncio_repository.get_by_id(anuncio_id)
        if not anuncio:
            raise NotFoundError("Anúncio não encontrado")

        existing = self.repository.get(usuario_id, anuncio_id)
        if existing:
            return existing

        favorito = Favorito(usuario_id=usuario_id, anuncio_id=anuncio_id)
        return self.repository.create(favorito)

    def remove(self, anuncio_id: int, usuario_id: int) -> None:
        favorito = self.repository.get(usuario_id, anuncio_id)
        if not favorito:
            raise NotFoundError("Este anúncio não está nos seus favoritos")
        self.repository.delete(favorito)

    def list(self, usuario_id: int, skip: int = 0, limit: int = 10) -> Tuple[List[Anuncio], int]:
        if skip < 0:
            raise ValidationError("skip não pode ser negativo")
        if limit <= 0:
            raise ValidationError("limit deve ser maior que zero")
        return self.repository.list_anuncios_by_user(usuario_id, skip=skip, limit=limit)

    def list_ids(self, usuario_id: int) -> List[int]:
        return self.repository.list_anuncio_ids_by_user(usuario_id)
