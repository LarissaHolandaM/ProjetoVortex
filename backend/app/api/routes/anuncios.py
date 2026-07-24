from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_user
from app.core.database import get_db
from app.models.usuario import Usuario
from app.schemas.anuncio import AnuncioCreate, AnuncioResponse, AnuncioUpdate
from app.schemas.pagination import PaginatedResponse
from app.schemas.response import MessageResponse
from app.services.anuncio_service import AnuncioService

router = APIRouter(prefix="/anuncios", tags=["anuncios"])


@router.post("/", response_model=AnuncioResponse, status_code=status.HTTP_201_CREATED)
def create_anuncio(
    anuncio_data: AnuncioCreate,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    service = AnuncioService(db)
    anuncio = service.create(anuncio_data, current_user.id)
    return anuncio


@router.get("/", response_model=PaginatedResponse[AnuncioResponse])
def list_anuncios(
    titulo: str | None = Query(default=None),
    categoria: str | None = Query(default=None),
    tipo_negociacao: str | None = Query(default=None),
    condicao: str | None = Query(default=None),
    localizacao: str | None = Query(default=None),
    preco_min: float | None = Query(default=None),
    preco_max: float | None = Query(default=None),
    order_by: str = Query(default="created_at"),
    order_desc: bool = Query(default=True),
    skip: int = Query(default=0),
    limit: int = Query(default=10),
    db: Session = Depends(get_db),
):
    service = AnuncioService(db)
    items, total = service.list(
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
    return {"items": items, "total": total, "page": skip // limit if limit else 0, "size": limit}


@router.get("/meus", response_model=PaginatedResponse[AnuncioResponse])
def list_meus_anuncios(
    skip: int = Query(default=0),
    limit: int = Query(default=10),
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    service = AnuncioService(db)
    items, total = service.list_by_user(current_user.id, skip=skip, limit=limit)
    return {"items": items, "total": total, "page": skip // limit if limit else 0, "size": limit}


@router.get("/{anuncio_id}", response_model=AnuncioResponse)
def get_anuncio(anuncio_id: int, db: Session = Depends(get_db)):
    service = AnuncioService(db)
    return service.get_by_id(anuncio_id)


@router.put("/{anuncio_id}", response_model=AnuncioResponse)
def update_anuncio(
    anuncio_id: int,
    anuncio_data: AnuncioUpdate,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    service = AnuncioService(db)
    return service.update(anuncio_id, anuncio_data, current_user.id)


@router.delete("/{anuncio_id}", response_model=MessageResponse)
def delete_anuncio(
    anuncio_id: int,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    service = AnuncioService(db)
    service.delete(anuncio_id, current_user.id)
    return {"message": "Anúncio removido com sucesso"}
