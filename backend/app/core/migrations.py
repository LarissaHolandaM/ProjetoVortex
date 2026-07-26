"""Migrações leves para evoluir o schema do banco em produção sem Alembic.

O projeto usa `Base.metadata.create_all()` na inicialização, que só cria
tabelas novas — não adiciona colunas em tabelas já existentes. Para poder
adicionar campos novos (como múltiplas categorias) sem precisar recriar o
banco em produção, rodamos aqui alguns `ALTER TABLE ... ADD COLUMN IF NOT
EXISTS`, sintaxe suportada tanto pelo Postgres (produção) quanto pelo SQLite
(desenvolvimento/testes). Cada instrução é isolada e best-effort: se falhar,
não derruba a aplicação.
"""

from sqlalchemy import text
from sqlalchemy.engine import Engine


_MIGRATIONS = [
    "ALTER TABLE anuncios ADD COLUMN IF NOT EXISTS categorias TEXT",
]


def run_lightweight_migrations(engine: Engine) -> None:
    with engine.connect() as connection:
        for statement in _MIGRATIONS:
            try:
                connection.execute(text(statement))
                connection.commit()
            except Exception:
                connection.rollback()
