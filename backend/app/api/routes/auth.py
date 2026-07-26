from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_user
from app.core.database import get_db
from app.models.usuario import Usuario
from app.schemas.auth import LoginRequest, TokenResponse
from app.schemas.response import MessageResponse
from app.schemas.usuario import UsuarioCreate, UsuarioResponse, UsuarioUpdate
from app.services.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register(usuario_data: UsuarioCreate, db: Session = Depends(get_db)):
    service = AuthService(db)
    usuario, token = service.register(usuario_data)
    return {
        "access_token": token,
        "token_type": "bearer",
        "usuario": {"id": usuario.id, "nome": usuario.nome, "email": usuario.email},
    }


@router.post("/login", response_model=TokenResponse)
def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    service = AuthService(db)
    usuario, token = service.login(login_data)
    return {
        "access_token": token,
        "token_type": "bearer",
        "usuario": {"id": usuario.id, "nome": usuario.nome, "email": usuario.email},
    }


@router.get("/me", response_model=UsuarioResponse)
def me(current_user=Depends(get_current_user)):
    return current_user


@router.put("/me", response_model=UsuarioResponse)
def update_me(
    dados: UsuarioUpdate,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    service = AuthService(db)
    return service.update_profile(current_user, dados)
