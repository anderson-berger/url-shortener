# 🔗 ShortyURL - URL Shortener

Um encurtador de URLs serverless completo com autenticação de usuários, desenvolvido com AWS Lambda, DynamoDB e Vue.js.

![AWS](https://img.shields.io/badge/AWS-Lambda-orange)
![DynamoDB](https://img.shields.io/badge/Database-DynamoDB-blue)
![Vue](https://img.shields.io/badge/Frontend-Vue.js_3-green)
![TypeScript](https://img.shields.io/badge/Language-TypeScript-blue)

## 📋 Índice

- [Características](#-características)
- [Arquitetura](#-arquitetura)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação](#-instalação)
- [Configuração](#-configuração)
- [Desenvolvimento Local](#-desenvolvimento-local)
- [Deploy](#-deploy)
- [API Documentation](#-api-documentation)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Tecnologias](#-tecnologias)
- [Troubleshooting](#-troubleshooting)

## ✨ Características

### 🔐 Autenticação
- Registro e login de usuários
- JWT tokens com expiração de 7 dias
- Hashing seguro de senhas com bcryptjs
- Autorização em nível de Lambda (AWS API Gateway Authorizer)

### 🔗 Gestão de Links
- Criar links encurtados (6 caracteres alfanuméricos)
- Listar links do usuário com paginação
- Atualizar e deletar links
- Controle de versionamento (optimistic locking)
- Redirecionamento rápido via GSI do DynamoDB

### 🗄️ Banco de Dados
- Design single-table no DynamoDB
- 3 Global Secondary Indexes (GSI) para diferentes padrões de acesso:
  - **GSI1**: Lookup por código curto (redirecionamento)
  - **GSI2**: Todos os links ordenados por data
  - **GSI3**: Links filtrados por usuário

### 🚀 Infraestrutura
- 100% serverless (AWS Lambda)
- API Gateway HTTP API
- CloudFront CDN para frontend
- Ambientes isolados (local, dev, prod)
- Desenvolvimento local com LocalStack

## 🏗️ Arquitetura

```
┌─────────────┐
│   Cliente   │
│  (Browser)  │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│   CloudFront    │ ← S3 (Frontend SPA)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  API Gateway    │
│   (HTTP API)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Lambda         │
│  Authorizer     │ ← JWT Verification
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────┐
│   Lambda Functions              │
│  ┌──────────┐  ┌──────────┐    │
│  │ Register │  │  Login   │    │
│  └──────────┘  └──────────┘    │
│  ┌──────────┐  ┌──────────┐    │
│  │  Links   │  │ Redirect │    │
│  └──────────┘  └──────────┘    │
└──────────┬──────────────────────┘
           │
           ▼
    ┌─────────────┐
    │  DynamoDB   │
    │ Single Table│
    └─────────────┘
```

### Design do DynamoDB

**Tabela Principal**: `url-shortener-{stage}`

| Entity Type | pk | sk | gsi1pk | gsi1sk | gsi2pk | gsi2sk | gsi3pk | gsi3sk |
|-------------|----|----|--------|--------|--------|--------|--------|--------|
| USER | USER#{id} | METADATA | - | - | - | - | - | - |
| CREDENTIAL | USER#{id} | CREDENTIAL | - | - | - | - | - | - |
| LINK | LINK#{id} | METADATA | SHORTCODE#{code} | LINK | LINK | {createdAt} | USER#{userId} | {createdAt} |

**Padrões de Acesso**:
1. Buscar usuário por ID → Query na tabela principal
2. Redirecionar short code → Query em GSI1
3. Listar todos os links → Query em GSI2
4. Listar links de um usuário → Query em GSI3

## 📦 Pré-requisitos

- **Node.js**: >= 20.x
- **npm**: >= 6.13.4
- **Docker** e **Docker Compose** (para desenvolvimento local)
- **AWS CLI**: configurado com credenciais
- **Serverless Framework**: v4

```bash
npm install -g serverless@4
```

## 🔧 Instalação

### 1. Clone o repositório

```bash
git clone <repository-url>
cd url-shortener
```

### 2. Instale as dependências

```bash
npm install
```

Isso instalará as dependências de todos os workspaces (backend, frontend, scripts).

## ⚙️ Configuração

### Variáveis de Ambiente

#### Backend

Crie um arquivo `.env` em `/workspace/packages/backend/`:

```bash
# Obrigatório para JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Opcional - gerado automaticamente pelo Serverless
TABLE=url-shortener-local
STAGE=local
```

**⚠️ IMPORTANTE**:
- Gere um JWT_SECRET forte: `openssl rand -base64 32`
- **NUNCA** commite o arquivo `.env` no git
- Em produção, use AWS Secrets Manager ou Parameter Store

#### Frontend

O frontend detecta automaticamente a URL da API baseado no ambiente:

- **Local**: `http://localhost:3000`
- **Dev/Prod**: URLs configuradas no código

Para customizar, edite [api.ts:6](packages/frontend/src/services/api.ts#L6).

### CORS Configuration

Atualize as origens permitidas em [serverless.ts:21](packages/backend/serverless.ts#L21):

```typescript
allowedOrigins: [
  "http://localhost:9000",           // Local
  "https://your-dev-domain.com",     // Dev
  "https://your-prod-domain.com",    // Prod
]
```

## 💻 Desenvolvimento Local

### Usando Docker (Recomendado)

O projeto inclui um DevContainer completo com LocalStack para DynamoDB.

```bash
# 1. Abra no VS Code com DevContainers
# Ou suba os containers manualmente:
docker compose -f .devcontainer/docker-compose.yml up -d

# 2. Entre no container
docker exec -it url-shortener-devcontainer bash

# 3. Inicialize o DynamoDB local
npm run init:dynamodb

# 4. Em terminais separados:
npm run start:backend   # Backend na porta 3000
npm run start:frontend  # Frontend na porta 9000
```

**Serviços Disponíveis**:
- 🌐 Frontend: http://localhost:9000
- 🔌 API: http://localhost:3000
- 📊 DynamoDB Admin: http://localhost:8001

### Sem Docker

```bash
# 1. Instale LocalStack separadamente
pip install localstack

# 2. Inicie LocalStack
localstack start -d

# 3. Inicialize o DynamoDB
npm run init:dynamodb

# 4. Inicie os serviços
npm run start:backend
npm run start:frontend
```

## 🚀 Deploy

### Deploy para Dev

```bash
# Backend
npm run deploy:dev

# Frontend
cd packages/frontend
npm run deploy:dev
```

### Deploy para Produção

```bash
# Backend
npm run deploy:prod

# Frontend
cd packages/frontend
npm run deploy:prod
```

**Nota**: Certifique-se de:
1. Configurar `JWT_SECRET` nas variáveis de ambiente da Lambda
2. Atualizar CloudFront Distribution ID no `package.json` do frontend
3. Configurar CORS com URLs de produção

## 📚 API Documentation

### Endpoints Públicos

#### Registro de Usuário
```http
POST /api/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

#### Login
```http
POST /api/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "email": "user@example.com"
  }
}
```

#### Redirecionamento (público)
```http
GET /go/{shortCode}

Response: 302 Redirect para URL original
```

### Endpoints Autenticados

Todos os endpoints abaixo requerem header:
```http
Authorization: Bearer {token}
```

#### Criar Link Curto
```http
POST /api/links
Content-Type: application/json

{
  "originalUrl": "https://example.com/very/long/url",
  "title": "Meu Link"
}

Response:
{
  "id": "uuid",
  "shortCode": "abc123",
  "originalUrl": "https://example.com/very/long/url",
  "title": "Meu Link",
  "userId": "uuid",
  "version": 1,
  "createdAt": "2025-01-05T10:00:00Z",
  "updatedAt": "2025-01-05T10:00:00Z"
}
```

#### Listar Links
```http
GET /api/links?limit=20&nextToken={token}

Response:
{
  "items": [...],
  "nextToken": "base64Token",
  "count": 20
}
```

#### Buscar Link por ID
```http
GET /api/links/{id}

Response: {ShortLink}
```

#### Atualizar Link
```http
PUT /api/links
Content-Type: application/json

{
  "id": "uuid",
  "originalUrl": "https://new-url.com",
  "title": "Novo título",
  "version": 1
}
```

#### Deletar Link
```http
DELETE /api/links
Content-Type: application/json

{
  "id": "uuid",
  "version": 1
}
```

#### Health Check
```http
GET /api/health

Response:
{
  "status": "healthy",
  "timestamp": "2025-01-05T10:00:00Z"
}
```

## 📁 Estrutura do Projeto

```
url-shortener/
├── .devcontainer/           # Docker DevContainer config
│   ├── devcontainer.json
│   └── docker-compose.yml
├── packages/
│   ├── backend/             # Serverless API
│   │   ├── src/
│   │   │   ├── config/      # DynamoDB client
│   │   │   ├── credential/  # Password management
│   │   │   ├── health-check/
│   │   │   ├── login/       # Authentication
│   │   │   ├── redirect/    # URL redirection
│   │   │   ├── register/    # User registration
│   │   │   ├── short-link/  # Link CRUD
│   │   │   ├── user/        # User management
│   │   │   └── utils/       # Utilities (JWT, crypto, errors)
│   │   ├── serverless.ts    # Serverless config
│   │   └── package.json
│   ├── frontend/            # Vue.js SPA
│   │   ├── src/
│   │   │   ├── boot/        # Quasar boot files
│   │   │   ├── components/  # Vue components
│   │   │   ├── layouts/     # Page layouts
│   │   │   ├── pages/       # Route pages
│   │   │   ├── router/      # Vue Router
│   │   │   ├── services/    # API layer
│   │   │   └── schemas/     # TypeScript types
│   │   └── package.json
│   └── scripts/             # Utility scripts
│       └── init-dynamodb.js # DynamoDB table creation
├── package.json             # Root workspace
└── README.md
```

## 🛠️ Tecnologias

### Backend
- **Runtime**: Node.js 20.x
- **Framework**: Serverless Framework v4
- **Database**: AWS DynamoDB
- **Authentication**: JWT (jose library)
- **Password**: bcryptjs
- **Validation**: Zod v4
- **AWS SDK**: @aws-sdk/client-dynamodb, @aws-sdk/lib-dynamodb

### Frontend
- **Framework**: Vue 3 + TypeScript
- **UI**: Quasar Framework v2
- **Build**: Vite
- **HTTP**: Axios
- **Router**: Vue Router v4
- **Date**: dayjs

### DevOps
- **IaC**: Serverless Framework
- **Local Dev**: LocalStack, serverless-offline
- **Containers**: Docker + Docker Compose
- **CI/CD**: Manual (AWS CLI)

## 🐛 Troubleshooting

### Erro: "JWT_SECRET is not defined"

**Solução**: Configure a variável de ambiente:
```bash
export JWT_SECRET="your-secret-key"
# Ou adicione ao .env do backend
```

### DynamoDB Local não conecta

**Solução**: Verifique se LocalStack está rodando:
```bash
docker ps | grep localstack
# Reinicie se necessário
docker compose -f .devcontainer/docker-compose.yml restart localstack
```

### CORS Error no Frontend

**Solução**: Adicione a URL do frontend em [serverless.ts:21](packages/backend/serverless.ts#L21):
```typescript
allowedOrigins: ["http://localhost:9000", "https://seu-dominio.com"]
```

### Erro ao fazer Deploy: "Rate exceeded"

**Solução**: AWS CloudFormation tem limites de rate. Aguarde alguns minutos e tente novamente.

### Lambda Authorizer retorna 401

**Possíveis causas**:
1. Token expirado (validade de 7 dias)
2. JWT_SECRET diferente entre ambientes
3. Header Authorization mal formatado (deve ser `Bearer {token}`)

**Debug**:
```bash
# Verifique os logs da Lambda
serverless logs -f authorizer --stage dev --tail
```

### Frontend não consegue fazer requisições

1. Verifique se o backend está rodando
2. Confirme a URL base do axios em [api.ts:6](packages/frontend/src/services/api.ts#L6)
3. Verifique CORS no backend
4. Abra o console do browser (F12) para ver erros

## 📊 Status do Projeto

### ✅ Implementado
- ✅ Autenticação completa (registro, login, JWT)
- ✅ CRUD de links encurtados
- ✅ Redirecionamento público
- ✅ Paginação de listagem
- ✅ Controle de versionamento (optimistic locking)
- ✅ Frontend responsivo com Quasar
- ✅ Desenvolvimento local com Docker

### 🚧 Em Desenvolvimento
- 🚧 Testes automatizados
- 🚧 CI/CD pipeline
- 🚧 Documentação da API (Swagger)

### 📋 Roadmap
- [ ] Analytics de cliques
- [ ] Links com expiração
- [ ] Custom short codes
- [ ] Recuperação de senha
- [ ] Rate limiting
- [ ] Validação avançada de URLs
- [ ] Backup automatizado do DynamoDB
- [ ] Multi-região para alta disponibilidade
- [ ] Testes E2E

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👤 Autor

**anderson-berger**
- Email: andersonwspace@gmail.com

## 🙏 Agradecimentos

- AWS por prover a infraestrutura serverless
- Comunidade Serverless Framework
- Comunidade Vue.js e Quasar

---

**Desenvolvido com ❤️ usando AWS Serverless**
