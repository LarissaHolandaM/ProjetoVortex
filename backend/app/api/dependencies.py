from fastapi import Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.exceptions import UnauthorizedError
from app.core.security import decode_access_token
from app.models.usuario import Usuario

bearer_scheme = HTTPBearer(auto_error=False)


def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> Usuario:
    if not credentials or not credentials.credentials:
        raise UnauthorizedError("Não autorizado")

    try:
        payload = decode_access_token(credentials.credentials)
        user_id = payload.get("sub")
        if not user_id:
            raise UnauthorizedError("Não autorizado")
    except Exception as exc:
        raise UnauthorizedError("Não autorizado") from exc

    user = db.query(Usuario).filter(Usuario.id == int(user_id)).first()
    if not user:
        raise UnauthorizedError("Não autorizado")

    return user
