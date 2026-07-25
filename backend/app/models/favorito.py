from sqlalchemy import Column, ForeignKey, Integer, UniqueConstraint
from sqlalchemy.orm import relationship

from app.core.database import Base


class Favorito(Base):
    __tablename__ = "favoritos"
    __table_args__ = (
        UniqueConstraint("usuario_id", "anuncio_id", name="uq_favorito_usuario_anuncio"),
    )

    id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False, index=True)
    anuncio_id = Column(Integer, ForeignKey("anuncios.id"), nullable=False, index=True)

    usuario = relationship("Usuario")
    anuncio = relationship("Anuncio")
