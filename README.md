# Vortex Marketplace

Marketplace acadêmico para circulação de itens entre estudantes. O projeto é dividido em um frontend React/Vite e uma API backend FastAPI.

## Pré-requisitos

- Git
- Node.js 20 ou superior e npm
- Python 3.11 ou 3.12

## Clone e configuração

```bash
git clone <URL_DO_REPOSITORIO>
cd ProjetoVortex
```

### Backend

No Windows PowerShell:

```powershell
cd Backend
python -m venv .venv
.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
Copy-Item .env.example .env
python -m pytest -q
python -m uvicorn app.main:app --reload
```

No macOS/Linux:

```bash
cd Backend
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
cp .env.example .env
python -m pytest -q
python -m uvicorn app.main:app --reload
```

A API ficará disponível em `http://127.0.0.1:8000`. A documentação interativa está em `http://127.0.0.1:8000/docs`.

O backend usa SQLite local por padrão e cria `app.db` automaticamente. O arquivo `.env` é opcional para desenvolvimento, mas deve ser criado a partir de `.env.example` para personalizar a configuração.

### Frontend

Abra outro terminal na raiz do projeto:

```bash
cd frontend
npm install
npm run dev
```

No Windows PowerShell, o comando é igual. O frontend ficará disponível no endereço mostrado pelo Vite, normalmente `http://localhost:5173`.

O frontend usa `http://127.0.0.1:8000` como API padrão. Para alterar esse endereço, copie `frontend/.env.example` para `frontend/.env` e ajuste `VITE_API_URL`.

## Validação

Frontend:

```bash
cd frontend
npm run lint
npm run build
```

Backend:

```bash
cd Backend
.venv/Scripts/python -m pytest -q  # Windows: .venv\Scripts\python.exe -m pytest -q
```

## Integração

O frontend consome a API nos endpoints de autenticação e anúncios. O backend permite as origens padrão do Vite via `CORS_ORIGINS`, configurada em `Backend/.env.example`.

Rotas principais:

- `GET /health`
- `POST /auth/register`
- `POST /auth/login`
- `GET /anuncios/`
- `POST /anuncios/`
- `GET /anuncios/{id}`
- `PUT /anuncios/{id}`
- `DELETE /anuncios/{id}`

## Estrutura

- `frontend/`: aplicação React com Vite
- `Backend/`: API FastAPI, autenticação JWT e persistência SQLite
- `.gitignore`: ignora dependências, ambientes virtuais, builds, caches, banco local e arquivos `.env`
