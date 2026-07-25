from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_user
from app.core.database import get_db
from app.models.usuario import Usuario
from app.schemas.anuncio import AnuncioResponse
from app.schemas.pagination import PaginatedResponse
from app.schemas.response import MessageResponse
from app.services.favorito_service import FavoritoService

router = APIRouter(prefix="/favoritos", tags=["favoritos"])


@router.get("/", response_model=PaginatedResponse[AnuncioResponse])
def list_favoritos(
    skip: int = Query(default=0),
    limit: int = Query(default=10),
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    service = FavoritoService(db)
    items, total = service.list(current_user.id, skip=skip, limit=limit)
    return {"items": items, "total": total, "page": skip // limit if limit else 0, "size": limit}


@router.get("/ids", response_model=list[int])
def list_favorito_ids(
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    service = FavoritoService(db)
    return service.list_ids(current_user.id)


@router.post("/{anuncio_id}", response_model=MessageResponse, status_code=status.HTTP_201_CREATED)
def add_favorito(
    anuncio_id: int,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    service = FavoritoService(db)
    service.add(anuncio_id, current_user.id)
    return {"message": "Anúncio adicionado aos favoritos"}


@router.delete("/{anuncio_id}", response_model=MessageResponse)
def remove_favorito(
    anuncio_id: int,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    service = FavoritoService(db)
    service.remove(anuncio_id, current_user.id)
    return {"message": "Anúncio removido dos favoritos"}
