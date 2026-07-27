
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
- Claude
- GitHub Copilot

## Engenharia de Prompts

### Prompt 1 – Arquitetura

> Estou fazendo um marketplace acadêmico com React no frontend e FastAPI no backend. Minha estrutura já está funcionando, mas está começando a ficar bagunçada. Você pode analisar o projeto e sugerir uma organização melhor, separando rotas, serviços, modelos, schemas e autenticação? Gostaria de entender o motivo de cada mudança antes de sair alterando o código.

### Prompt 2 – CORS

> Publiquei o frontend na Vercel e o backend no Render, mas todas as requisições estão sendo bloqueadas por CORS. Vou te mandar a configuração atual da API. Analise o que pode estar errado, explique por que isso acontece e me mostre a forma correta de configurar o CORSMiddleware sem simplesmente liberar qualquer origem.

### Prompt 3 – Deploy

> Vou colocar esse projeto em produção e queria uma revisão geral. Analise a estrutura do frontend e do backend, procure possíveis problemas de configuração, segurança ou organização e me diga o que você melhoraria antes de fazer o deploy definitivo. Se possível, explique o porquê de cada sugestão para eu conseguir aprender com as alterações.

### Prompt 4 – Responsividade da Interface

> Claude, o card da Central de Ajuda está desalinhado. Quando a tela fica menor ou é acessada pelo celular, ele se alinha corretamente, porém quando é aberto no navegador em tela cheia ele fica torto. Preciso que esse componente seja completamente responsivo, adaptando-se corretamente a qualquer resolução e tamanho de janela, sem comprometer o layout das demais seções da página. Além de corrigir o CSS, explique por que o problema acontece para que eu entenda a solução.

## Chats compartilhados

1. https://chatgpt.com/share/6a63dfb3-03c0-83e9-8f93-77836ae856f9

2. https://chatgpt.com/share/6a63dfee-6040-83e9-a174-52a77c4df110

## Reflexão crítica

Durante o desenvolvimento do Vortex Marketplace, a Inteligência Artificial foi utilizada como uma ferramenta de apoio para acelerar tarefas como organização da arquitetura, resolução de bugs, revisão de código, documentação e refinamento da interface. Entretanto, em diversos momentos foi necessário exercer senso crítico sobre as respostas produzidas.

Um dos principais exemplos ocorreu durante a implementação da tela de cadastro de usuários. Foi solicitado ao GitHub Copilot que auxiliasse na criação da interface e da lógica de cadastro. Em vez de implementar apenas a funcionalidade solicitada, a ferramenta sugeriu um fluxo em que um usuário inexistente seria automaticamente cadastrado ao tentar realizar login. Apesar de funcional do ponto de vista técnico, esse comportamento não fazia parte dos requisitos do sistema e ainda introduzia um problema de segurança e de experiência do usuário. A solução foi rejeitar essa abordagem e implementar um fluxo tradicional, separando claramente autenticação e cadastro.

Outro desafio importante aconteceu durante o deploy da aplicação. Após publicar o frontend na Vercel e o backend no Render, todas as requisições passaram a ser bloqueadas pela política de CORS do navegador. As primeiras respostas da IA sugeriam liberar qualquer origem utilizando "*", solução que resolveria rapidamente o erro, porém comprometeria completamente a segurança da API. A partir da análise dos logs, da inspeção das requisições preflight (OPTIONS) e de um entendimento mais profundo da arquitetura da aplicação, foi possível fornecer mais contexto para a IA, que então auxiliou na configuração correta do CORSMiddleware permitindo apenas as origens autorizadas.

Também utilizei o Claude para solucionar um problema de responsividade na interface. Um dos cartões da Central de Ajuda apresentava um comportamento curioso: em dispositivos móveis e em janelas menores o alinhamento era correto, porém em resoluções maiores o componente ficava deslocado, prejudicando a aparência da página. Inicialmente a IA apresentou ajustes pontuais de CSS que não eliminavam completamente o problema. Após reformular o prompt, explicando exatamente em quais resoluções o erro ocorria e solicitando não apenas a correção, mas também a explicação da causa, foi possível identificar que o problema estava relacionado ao comportamento do layout responsivo e à distribuição dos elementos no container. Com esse contexto adicional, a solução passou a ser definitiva e o componente tornou-se adaptável a diferentes tamanhos de tela.

Essas experiências reforçaram que a Inteligência Artificial funciona melhor como uma ferramenta de apoio do que como um substituto do desenvolvedor. Em praticamente todos os casos foi necessário validar manualmente o código sugerido, testar diferentes cenários, compreender as alterações realizadas e, muitas vezes, reformular os prompts para fornecer contexto suficiente até que a solução estivesse alinhada aos requisitos do projeto. Esse processo tornou o desenvolvimento mais produtivo sem abrir mão da compreensão técnica e da qualidade da implementação.

# Estrutura

```text
ProjetoVortex/
├── backend/
├── frontend/
├── README.md
└── .gitignore
```

