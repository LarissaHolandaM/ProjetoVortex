# Vortex Backend

API FastAPI para o marketplace de economia circular do desafio Vortex, com autenticação JWT, CRUD de anúncios, validação de entradas e organização por camadas.

## O que já está implementado

- CRUD de anúncios
- Autenticação básica com JWT
- Validação de campos obrigatórios
- Filtros por título, categoria e tipo de negociação
- Estrutura MVC com separação em rotas, serviços, repositórios, schemas e modelos
- Persistência com SQLite local, sem necessidade de Docker

## Estrutura do projeto

- app/api/routes: rotas HTTP
- app/core: configurações, banco, segurança e exceções
- app/models: modelos ORM
- app/schemas: DTOs e validações Pydantic
- app/services: regras de negócio
- app/repositories: persistência
- app/middleware: tratamento global de erros

## Como executar

> Importante: use Python 3.12 (ou 3.11) para evitar incompatibilidades com FastAPI/Pydantic. O Python 3.14 pode causar falha na inicialização.

1. Crie e ative o ambiente virtual com Python 3.12:
   `python -m venv .venv`
   `.venv\Scripts\Activate.ps1`
2. Instale as dependências:
   `.venv\Scripts\python.exe -m pip install -r requirements.txt`
3. Crie o arquivo de ambiente:
   `Copy-Item .env.example .env`
4. Execute os testes:
   `.venv\Scripts\python.exe -m pytest -q`
5. Execute localmente:
   `.venv\Scripts\python.exe -m uvicorn app.main:app --reload`

No macOS/Linux, substitua `.venv\Scripts\python.exe` por `.venv/bin/python`,
`.venv\Scripts\Activate.ps1` por `source .venv/bin/activate` e
`Copy-Item .env.example .env` por `cp .env.example .env`.

### Variáveis de ambiente

Copie o arquivo `.env.example` para `.env` e ajuste os valores conforme o ambiente.
Para deploys, o mais importante é definir `DATABASE_URL` e `PORT`.

Exemplo para produção:
- `DATABASE_URL=postgresql://user:password@host:5432/dbname`
- `PORT=8000`

### Comando para deploy

Em plataformas como Render ou Railway, o comando de start pode ser:
`uvicorn app.main:app --host 0.0.0.0 --port $PORT`

## Endpoints principais

- POST /auth/register
- POST /auth/login
- GET /health
- GET /anuncios/
- POST /anuncios/
- GET /anuncios/{id}
- PUT /anuncios/{id}
- DELETE /anuncios/{id}

A documentação interativa fica disponível em `/docs` quando a API estiver em execução.

## Diário de Bordo da IA

- Ferramentas utilizadas: GitHub Copilot, ChatGPT e documentação oficial do FastAPI/Pydantic.
- Estratégia de prompts: uso de prompts para estruturar a API, corrigir erros de compatibilidade e organizar a arquitetura MVC.
- Reflexão crítica: sempre validei as respostas da IA com testes reais e checagem do comportamento da API.
