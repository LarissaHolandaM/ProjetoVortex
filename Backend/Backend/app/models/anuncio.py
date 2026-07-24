from sqlalchemy import Column, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from app.core.database import Base


class Anuncio(Base):
    __tablename__ = "anuncios"

    id = Column(Integer, primary_key=True, index=True)
    titulo = Column(String(150), nullable=False)
    descricao = Column(Text, nullable=False)
    preco = Column(Float, nullable=False)
    categoria = Column(String(50), nullable=False, default="Geral")
    tipo_negociacao = Column(String(20), nullable=False, default="venda")
    condicao = Column(String(30), nullable=False, default="novo")
    localizacao = Column(String(100), nullable=False, default="Campus")
    imagem_url = Column(String(500), nullable=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False)

    usuario = relationship("Usuario", back_populates="anuncios")
