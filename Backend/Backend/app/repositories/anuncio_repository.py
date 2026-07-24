from typing import List, Tuple

from sqlalchemy.orm import Session

from app.models.anuncio import Anuncio


class AnuncioRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, anuncio: Anuncio) -> Anuncio:
        self.db.add(anuncio)
        self.db.commit()
        self.db.refresh(anuncio)
        return anuncio

    def get_by_id(self, anuncio_id: int) -> Anuncio | None:
        return self.db.query(Anuncio).filter(Anuncio.id == anuncio_id).first()

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
        base_query = self.db.query(Anuncio)
        total = base_query.count()

        query = base_query
        if titulo:
            query = query.filter(Anuncio.titulo.ilike(f"%{titulo}%"))
        if categoria:
            query = query.filter(Anuncio.categoria.ilike(f"%{categoria}%"))
        if tipo_negociacao:
            query = query.filter(Anuncio.tipo_negociacao.ilike(f"%{tipo_negociacao}%"))
        if condicao:
            query = query.filter(Anuncio.condicao.ilike(f"%{condicao}%"))
        if localizacao:
            query = query.filter(Anuncio.localizacao.ilike(f"%{localizacao}%"))
        if preco_min is not None:
            query = query.filter(Anuncio.preco >= preco_min)
        if preco_max is not None:
            query = query.filter(Anuncio.preco <= preco_max)

        if order_by == "preco":
            query = query.order_by(Anuncio.preco.desc() if order_desc else Anuncio.preco.asc())
        else:
            query = query.order_by(Anuncio.id.desc() if order_desc else Anuncio.id.asc())

        items = query.offset(skip).limit(limit).all()
        return items, total

    def list_by_user(self, usuario_id: int, skip: int = 0, limit: int = 10) -> Tuple[List[Anuncio], int]:
        base_query = self.db.query(Anuncio).filter(Anuncio.usuario_id == usuario_id)
        total = base_query.count()
        items = base_query.order_by(Anuncio.id.desc()).offset(skip).limit(limit).all()
        return items, total

    def update(self, anuncio: Anuncio) -> Anuncio:
        self.db.commit()
        self.db.refresh(anuncio)
        return anuncio

    def delete(self, anuncio: Anuncio) -> None:
        self.db.delete(anuncio)
        self.db.commit()
