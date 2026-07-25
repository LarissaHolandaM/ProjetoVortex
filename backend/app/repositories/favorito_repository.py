from typing import List, Tuple

from sqlalchemy.orm import Session

from app.models.anuncio import Anuncio
from app.models.favorito import Favorito


class FavoritoRepository:
    def __init__(self, db: Session):
        self.db = db

    def get(self, usuario_id: int, anuncio_id: int) -> Favorito | None:
        return (
            self.db.query(Favorito)
            .filter(Favorito.usuario_id == usuario_id, Favorito.anuncio_id == anuncio_id)
            .first()
        )

    def create(self, favorito: Favorito) -> Favorito:
        self.db.add(favorito)
        self.db.commit()
        self.db.refresh(favorito)
        return favorito

    def delete(self, favorito: Favorito) -> None:
        self.db.delete(favorito)
        self.db.commit()

    def delete_by_anuncio(self, anuncio_id: int) -> None:
        self.db.query(Favorito).filter(Favorito.anuncio_id == anuncio_id).delete()
        self.db.commit()

    def list_anuncios_by_user(self, usuario_id: int, skip: int = 0, limit: int = 10) -> Tuple[List[Anuncio], int]:
        base_query = (
            self.db.query(Anuncio)
            .join(Favorito, Favorito.anuncio_id == Anuncio.id)
            .filter(Favorito.usuario_id == usuario_id)
        )
        total = base_query.count()
        items = base_query.order_by(Favorito.id.desc()).offset(skip).limit(limit).all()
        return items, total

    def list_anuncio_ids_by_user(self, usuario_id: int) -> List[int]:
        rows = self.db.query(Favorito.anuncio_id).filter(Favorito.usuario_id == usuario_id).all()
        return [row[0] for row in rows]
