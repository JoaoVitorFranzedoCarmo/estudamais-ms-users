# estudamais-ms-users

Microsservico de usuarios e autenticacao do Estuda+.

## Stack

- Node.js + TypeScript + Express
- PostgreSQL (`pg`)
- JWT (`jsonwebtoken`) + bcrypt
- Zod (validacao)
- Swagger UI (`/docs`)

## Arquitetura

Vertical Slice + Clean Architecture:

```
src/
├── server.ts
├── shared/
│   ├── types/result.ts
│   ├── middleware/errorHandler.ts
│   ├── middleware/auth.ts          requireAuth (JWT Bearer)
│   ├── infra/database.ts           Pool pg + criacao da tabela users
│   └── config/swagger.ts
└── features/
    ├── users/
    │   ├── users.types.ts
    │   ├── users.domain.ts         normalizeEmail, isValidEmail
    │   ├── users.schema.ts         validacao Zod
    │   ├── users.repository.ts     IUserRepository + PgUserRepository
    │   ├── users.service.ts        use cases
    │   └── users.routes.ts         controllers HTTP
    └── auth/
        ├── auth.types.ts
        ├── auth.schema.ts
        ├── auth.service.ts         register/login + JWT
        └── auth.routes.ts
```

## Variaveis de Ambiente

```
PORT=4002
DATABASE_URL=postgres://postgres:postgres@localhost:5432/estudamais_users
JWT_SECRET=changeme
JWT_EXPIRES_IN=7d
FRONTEND_ORIGIN=http://localhost:5173
```

## Rodando

```bash
npm install
npm run dev
```

## Endpoints

| Metodo | Path | Auth | Descricao |
|--------|------|------|-----------|
| POST | `/api/auth/register` | nao | Cria usuario e retorna token |
| POST | `/api/auth/login` | nao | Autentica e retorna token |
| GET | `/api/users/me` | sim | Dados do usuario autenticado |
| PATCH | `/api/users/me` | sim | Atualiza usuario autenticado |
| DELETE | `/api/users/me` | sim | Remove usuario autenticado |
| GET | `/api/users/:id` | sim | Busca usuario por id |
| GET | `/health` | nao | Health check |
| GET | `/docs` | nao | Swagger UI |

## Docker

```bash
docker build -t estudamais-ms-users .
docker run -p 4002:4002 --env-file .env estudamais-ms-users
```

## Equipe

Fernando Chociai  
Gabriel Coltre  
João Marcelo  
João Vitor Franzedo Carmo  
Leander Hallu  

PUCPR — Projeto PJBL 2026
