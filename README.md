
# Vortex Marketplace

## 📚 Sobre o Projeto

O **Vortex Marketplace** é um marketplace acadêmico desenvolvido para facilitar a compra, venda e doação de itens entre estudantes, promovendo a economia circular dentro do ambiente universitário.

A aplicação foi desenvolvida utilizando **React + Vite** no frontend e **FastAPI** no backend, oferecendo autenticação JWT, gerenciamento de anúncios e uma API REST documentada.

---

# 🌐 Deploy

| Serviço | Link |
|---------|------|
| Frontend | https://projeto-vortex-seven.vercel.app/ |
| Backend | https://projetovortex.onrender.com |
| Repositório | https://github.com/LarissaHolandaM/ProjetoVortex |

---

# 🛠 Tecnologias

## Frontend
- React
- TypeScript
- Vite
- Axios
- React Router

## Backend
- FastAPI
- SQLAlchemy
- SQLite
- JWT
- Pydantic
- Uvicorn
- Pytest

---

# Pré-requisitos

- Git
- Node.js 20+
- npm
- Python 3.11 ou 3.12

# Clonando

```bash
git clone https://github.com/LarissaHolandaM/ProjetoVortex.git
cd ProjetoVortex
```

# Backend

## Windows

```powershell
cd backend
python -m venv .venv
.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
Copy-Item .env.example .env
python -m pytest -q
python -m uvicorn app.main:app --reload
```

## Linux/macOS

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
cp .env.example .env
python -m pytest -q
python -m uvicorn app.main:app --reload
```

API:
http://127.0.0.1:8000

Swagger:
http://127.0.0.1:8000/docs

# Frontend

```bash
cd frontend
npm install
npm run dev
```

# Variáveis de ambiente

Backend:

Copie `.env.example` para `.env`.

Frontend:

Copie `frontend/.env.example` para `frontend/.env` e ajuste:

```env
VITE_API_URL=http://127.0.0.1:8000
```

# Testes

Backend

```bash
python -m pytest -q
```

Frontend

```bash
npm run lint
npm run build
```

# Endpoints

- GET /health
- POST /auth/register
- POST /auth/login
- GET /anuncios
- POST /anuncios
- GET /anuncios/{id}
- PUT /anuncios/{id}
- DELETE /anuncios/{id}

# Diário de Bordo da IA

## Ferramentas utilizadas

- ChatGPT
- GitHub Copilot

## Engenharia de Prompts

### Prompt 1 – Arquitetura

> Estou fazendo um marketplace acadêmico com React no frontend e FastAPI no backend. Minha estrutura já está funcionando, mas está começando a ficar bagunçada. Você pode analisar o projeto e sugerir uma organização melhor, separando rotas, serviços, modelos, schemas e autenticação? Gostaria de entender o motivo de cada mudança antes de sair alterando o código.

### Prompt 2 – CORS

> Publiquei o frontend na Vercel e o backend no Render, mas todas as requisições estão sendo bloqueadas por CORS. Vou te mandar a configuração atual da API. Analise o que pode estar errado, explique por que isso acontece e me mostre a forma correta de configurar o CORSMiddleware sem simplesmente liberar qualquer origem.

### Prompt 3 – Deploy

> Vou colocar esse projeto em produção e queria uma revisão geral. Analise a estrutura do frontend e do backend, procure possíveis problemas de configuração, segurança ou organização e me diga o que você melhoraria antes de fazer o deploy definitivo. Se possível, explique o porquê de cada sugestão para eu conseguir aprender com as alterações.

## Chats compartilhados

1. https://chatgpt.com/share/6a63dfb3-03c0-83e9-8f93-77836ae856f9

2. https://chatgpt.com/share/6a63dfee-6040-83e9-a174-52a77c4df110

## Reflexão crítica

Durante o desenvolvimento do Vortex Marketplace, a Inteligência Artificial foi utilizada como uma ferramenta de apoio para acelerar tarefas como organização da arquitetura, resolução de bugs, documentação e revisão de código. Apesar de ter contribuído significativamente para a produtividade, nem todas as sugestões fornecidas estavam corretas ou atendiam ao que havia sido solicitado.

Um dos principais exemplos ocorreu durante a implementação da tela de cadastro de usuários. Foi solicitado ao GitHub Copilot que auxiliasse na criação da interface e da lógica de cadastro. Entretanto, em vez de implementar apenas a funcionalidade requisitada, o Copilot sugeriu um fluxo completamente diferente: caso um usuário tentasse realizar login com um e-mail inexistente, o sistema realizaria automaticamente o cadastro desse usuário. Essa funcionalidade nunca havia sido especificada e, além de fugir dos requisitos do projeto, representava um comportamento inadequado para um sistema de autenticação, podendo causar problemas de segurança e inconsistências na experiência do usuário.

Outro desafio importante surgiu durante o deploy da aplicação. Após publicar o frontend na Vercel e o backend no Render, as requisições passaram a ser bloqueadas pela política de CORS do navegador. As primeiras sugestões fornecidas pela IA consistiam em liberar todas as origens (*) para resolver rapidamente o problema. Embora essa abordagem eliminasse o erro, ela comprometia a segurança da API e não representava uma solução adequada para um ambiente de produção.

A solução foi encontrada por meio da análise dos logs da aplicação, da inspeção das requisições no navegador e do entendimento do funcionamento das requisições preflight (OPTIONS). Com essas informações, foi possível orientar a IA com mais contexto sobre a arquitetura do projeto e configurar corretamente o CORSMiddleware, permitindo apenas as origens autorizadas.

Essas experiências reforçaram que a Inteligência Artificial é uma excelente ferramenta para aumentar a produtividade e auxiliar na resolução de problemas, mas não substitui o conhecimento técnico do desenvolvedor. Todas as sugestões incorporadas ao projeto foram analisadas, adaptadas e validadas manualmente, garantindo que a implementação final estivesse de acordo com os requisitos e com as boas práticas de desenvolvimento.

# Estrutura

```text
ProjetoVortex/
├── backend/
├── frontend/
├── README.md
└── .gitignore
```

