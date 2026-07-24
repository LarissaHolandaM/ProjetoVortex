# Frontend Vortex

Aplicação React executada com Vite.

## Executar localmente

Na pasta `frontend`:

```powershell
npm install
Copy-Item .env.example .env
npm run dev
```

No macOS/Linux, use `cp .env.example .env` no lugar do `Copy-Item`.

O frontend usa `http://127.0.0.1:8000` como endereço padrão da API. Ajuste `VITE_API_URL` em `.env` se o backend estiver em outro endereço.

## Scripts

- `npm run dev`: inicia o servidor de desenvolvimento
- `npm run lint`: executa o ESLint
- `npm run build`: gera a versão de produção
- `npm run preview`: visualiza a versão de produção localmente

Consulte o [README da raiz](../README.md) para o setup completo do frontend e backend.
