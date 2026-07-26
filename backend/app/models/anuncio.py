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
    # Armazena todas as categorias do anúncio em CSV (ex.: "Livros,Tecnologia").
    # Coluna adicionada via migração leve (ver app/core/migrations.py) para não
    # exigir alterações destrutivas na tabela já existente em produção.
    categorias_raw = Column("categorias", Text, nullable=True)
    tipo_negociacao = Column(String(20), nullable=False, default="venda")
    condicao = Column(String(30), nullable=False, default="novo")
    localizacao = Column(String(100), nullable=False, default="Campus")
    imagem_url = Column(String(500), nullable=True)
    contato = Column(String(150), nullable=False)
    usuario_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False)

    usuario = relationship("Usuario", back_populates="anuncios")

    @property
    def categorias(self) -> list[str]:
        """Lista de categorias do anúncio, com fallback para a categoria única
        (compatibilidade com anúncios antigos, criados antes desta coluna)."""
        if self.categorias_raw:
            valores = [c.strip() for c in self.categorias_raw.split(",") if c.strip()]
            if valores:
                return valores
        return [self.categoria] if self.categoria else []

    @categorias.setter
    def categorias(self, valores: list[str]) -> None:
        limpos = [v.strip() for v in valores if v and v.strip()]
        self.categorias_raw = ",".join(limpos) if limpos else None
        if limpos:
            self.categoria = limpos[0]

    @property
    def usuario_nome(self) -> str | None:
        return self.usuario.nome if self.usuario else None
