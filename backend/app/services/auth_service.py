from sqlalchemy.orm import Session

from app.core.exceptions import UnauthorizedError, ValidationError
from app.core.security import create_access_token, hash_password, verify_password
from app.models.usuario import Usuario
from app.repositories.usuario_repository import UsuarioRepository
from app.schemas.auth import LoginRequest
from app.schemas.usuario import UsuarioCreate, UsuarioUpdate


class AuthService:
    def __init__(self, db: Session):
        self.repository = UsuarioRepository(db)

    def register(self, usuario_data: UsuarioCreate) -> tuple[Usuario, str]:
        if self.repository.get_by_email(usuario_data.email):
            raise ValidationError("E-mail já cadastrado")

        usuario = Usuario(
            nome=usuario_data.nome,
            email=str(usuario_data.email),
            senha_hash=hash_password(usuario_data.senha),
        )
        created = self.repository.create(usuario)
        token = create_access_token(created.id)
        return created, token

    def login(self, login_data: LoginRequest) -> tuple[Usuario, str]:
        usuario = self.repository.get_by_email(str(login_data.email))
        if not usuario or not verify_password(login_data.senha, usuario.senha_hash):
            raise UnauthorizedError("Credenciais inválidas")

        token = create_access_token(usuario.id)
        return usuario, token

    def update_profile(self, usuario: Usuario, dados: UsuarioUpdate) -> Usuario:
        if dados.email and dados.email != usuario.email:
            existente = self.repository.get_by_email(str(dados.email))
            if existente and existente.id != usuario.id:
                raise ValidationError("E-mail já cadastrado")
            usuario.email = str(dados.email)

        if dados.nome:
            usuario.nome = dados.nome

        if dados.nova_senha:
            if not dados.senha_atual or not verify_password(dados.senha_atual, usuario.senha_hash):
                raise ValidationError("Senha atual incorreta")
            usuario.senha_hash = hash_password(dados.nova_senha)

        return self.repository.update(usuario)
