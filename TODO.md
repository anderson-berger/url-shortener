# TODO - URL Shortener

## 🔴 Prioridade Alta (Essencial para Portfólio)

### Documentação

- [ ] Criar README.md completo com:
  - [ ] Descrição do projeto
  - [ ] Screenshots/GIFs da aplicação
  - [ ] Diagrama de arquitetura
  - [ ] Stack tecnológica utilizada
  - [ ] Instruções de instalação e execução local
  - [ ] Variáveis de ambiente necessárias
  - [ ] Link para demo online

### Testes

- [ ] **Backend - Testes Unitários**
  - [ ] UserService (create, getById, getByEmail)
  - [ ] CredentialService (create, verify password)
  - [ ] ShortLinkService (create, list, update, delete, redirect)
  - [ ] LoginService (autenticação)
  - [ ] RegisterService (registro completo)
  - [ ] JWT utils (generate, verify)
  - [ ] Hash utils (hash, compare)

- [ ] **Backend - Testes de Integração**
  - [ ] POST /api/register
  - [ ] POST /api/login
  - [ ] CRUD /api/links
  - [ ] GET /api/{shortCode} (redirect)

- [ ] **Frontend - Testes de Componentes**
  - [ ] ShortlinkForm (validações, submit)
  - [ ] ShortlinksList (renderização, ações)
  - [ ] LoginForm / RegisterForm

### CI/CD

- [ ] Criar GitHub Actions workflow:
  - [ ] Lint (ESLint)
  - [ ] Type check (TypeScript)
  - [ ] Testes unitários
  - [ ] Build frontend
  - [ ] Deploy automático

### Deploy

- [ ] Deploy backend na AWS (Lambda + API Gateway + DynamoDB)
- [ ] Deploy frontend (S3 + CloudFront ou Vercel)
- [ ] Configurar domínio personalizado
- [ ] Configurar HTTPS

---

## 🟡 Prioridade Média (Diferencial)

### Features Novas

- [ ] **Analytics básico**
  - [ ] Contador de cliques por link
  - [ ] Data/hora do último acesso
  - [ ] Gráfico simples de acessos

- [ ] **Melhorias de UX**
  - [ ] Botão de copiar link curto
  - [ ] QR Code para cada link
  - [ ] Preview do link antes de redirecionar
  - [ ] Feedback visual ao criar/editar/deletar

- [ ] **Gestão de Links**
  - [ ] Busca/filtro na lista de links
  - [ ] Ordenação (data, cliques, título)
  - [ ] Paginação na UI
  - [ ] Expiração de links (TTL opcional)

### Segurança

- [ ] Rate limiting no backend
- [ ] Validação de URLs maliciosas
- [ ] CAPTCHA no registro (opcional)
- [ ] Refresh token

### Código

- [ ] Migrar componentes Vue para Composition API + `<script setup>`
- [ ] Adicionar Pinia para state management
- [ ] Criar hooks customizados (useAuth, useShortlinks)

---

## 🟢 Prioridade Baixa (Nice to Have)

### Features Avançadas

- [ ] Links com senha
- [ ] Links privados (só dono pode ver)
- [ ] Bulk import/export de links (CSV)
- [ ] API pública com documentação Swagger
- [ ] Webhooks para notificações
- [ ] Múltiplos workspaces/times

### DevOps

- [ ] Docker Compose para desenvolvimento local
- [ ] Terraform/CDK para infraestrutura como código
- [ ] Monitoramento (CloudWatch, Sentry)
- [ ] Logs estruturados

### Performance

- [ ] Cache de redirects (Redis/ElastiCache)
- [ ] CDN para assets estáticos
- [ ] Lazy loading de componentes
- [ ] Service Worker para PWA

---

## ✅ Já Concluído

- [x] Estrutura monorepo (frontend + backend)
- [x] Autenticação JWT completa
- [x] CRUD de shortlinks
- [x] Redirect funcional
- [x] Validação com Zod
- [x] DynamoDB single-table design
- [x] TypeScript end-to-end
- [x] Optimistic locking (versioning)
- [x] Correção de bugs e typos
- [x] Remoção de código de debug

---

## 📋 Ordem Sugerida de Execução

1. **README.md** - 1-2 horas
2. **Testes unitários backend** - 4-6 horas
3. **GitHub Actions básico** - 1-2 horas
4. **Deploy** - 2-3 horas
5. **Analytics básico** - 3-4 horas
6. **Botão copiar + QR Code** - 2 horas

**Total estimado para portfólio pronto: ~15-20 horas**

---

## 🛠️ Comandos Úteis

```bash
# Desenvolvimento
npm run start:backend   # Inicia backend local
npm run start:frontend  # Inicia frontend local

# Testes (após configurar)
npm run test            # Roda todos os testes
npm run test:coverage   # Testes com cobertura

# Deploy
npm run deploy:dev      # Deploy para ambiente dev
npm run deploy:prod     # Deploy para produção

# Qualidade
npm run lint            # Verifica código
npm run typecheck       # Verifica tipos
```
