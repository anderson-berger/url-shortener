# 🤝 Guia de Contribuição

Obrigado por considerar contribuir com o ShortyURL! Este documento fornece diretrizes para contribuir com o projeto.

## 📋 Índice

- [Código de Conduta](#código-de-conduta)
- [Como Posso Contribuir?](#como-posso-contribuir)
- [Configuração do Ambiente](#configuração-do-ambiente)
- [Processo de Desenvolvimento](#processo-de-desenvolvimento)
- [Padrões de Código](#padrões-de-código)
- [Mensagens de Commit](#mensagens-de-commit)
- [Pull Requests](#pull-requests)
- [Reportar Bugs](#reportar-bugs)
- [Sugerir Melhorias](#sugerir-melhorias)

## 📜 Código de Conduta

Este projeto adere a um código de conduta. Ao participar, você concorda em manter um ambiente respeitoso e inclusivo.

## 🛠️ Como Posso Contribuir?

### Tipos de Contribuições

- 🐛 **Correção de Bugs**: Encontrou um bug? Abra uma issue ou envie um PR!
- ✨ **Novas Features**: Tem uma ideia? Discuta primeiro em uma issue
- 📝 **Documentação**: Melhorias na documentação são sempre bem-vindas
- 🧪 **Testes**: Adicione ou melhore a cobertura de testes
- 🎨 **UI/UX**: Melhorias na interface e experiência do usuário

## ⚙️ Configuração do Ambiente

### 1. Fork e Clone

```bash
# Fork o repositório no GitHub
# Clone seu fork
git clone https://github.com/SEU-USUARIO/url-shortener.git
cd url-shortener

# Adicione o repositório original como upstream
git remote add upstream https://github.com/ORIGINAL/url-shortener.git
```

### 2. Instale Dependências

```bash
npm install
```

### 3. Configure Variáveis de Ambiente

```bash
# Backend
cp packages/backend/.env.example packages/backend/.env
# Edite o .env e adicione JWT_SECRET

# Gere um secret forte:
openssl rand -base64 32
```

### 4. Inicie o Ambiente de Desenvolvimento

```bash
# Com Docker (recomendado)
docker compose -f .devcontainer/docker-compose.yml up -d

# Inicialize o DynamoDB
npm run init:dynamodb

# Em terminais separados:
npm run start:backend   # Backend
npm run start:frontend  # Frontend
```

## 🔄 Processo de Desenvolvimento

### 1. Crie uma Branch

Sempre crie uma branch para suas mudanças:

```bash
git checkout -b tipo/descricao-curta
```

Tipos de branch:
- `feat/` - Nova funcionalidade
- `fix/` - Correção de bug
- `docs/` - Apenas documentação
- `style/` - Formatação, ponto e vírgula, etc.
- `refactor/` - Refatoração de código
- `test/` - Adição ou correção de testes
- `chore/` - Manutenção, configuração, etc.

Exemplos:
```bash
git checkout -b feat/add-link-expiration
git checkout -b fix/cors-issue
git checkout -b docs/update-readme
```

### 2. Faça Suas Mudanças

- Escreva código limpo e legível
- Siga os padrões do projeto (veja abaixo)
- Adicione testes para novas funcionalidades
- Atualize a documentação se necessário
- Teste localmente antes de commitar

### 3. Teste Suas Mudanças

```bash
# Backend
cd packages/backend
npm test

# Frontend
cd packages/frontend
npm test

# Lint
npm run lint
```

### 4. Commit

Faça commits atômicos com mensagens claras (veja padrões abaixo).

### 5. Push e Pull Request

```bash
git push origin sua-branch
```

Abra um Pull Request no GitHub seguindo o template.

## 📏 Padrões de Código

### TypeScript

- Use TypeScript em todo o código
- Evite `any` - prefira tipos específicos ou `unknown`
- Use interfaces para objetos complexos
- Documente tipos complexos com JSDoc

### Estilo de Código

**Backend:**
```typescript
// ✅ BOM
export class ShortLinkService {
  async create(data: NewShortLink): Promise<ShortLink> {
    // Implementação
  }
}

// ❌ RUIM
export class ShortLinkService {
  async create(data: any): Promise<any> {
    // Implementação
  }
}
```

**Frontend:**
```typescript
// ✅ BOM - Composition API com TypeScript
export default defineComponent({
  name: 'MyComponent',
  props: {
    items: {
      type: Array as PropType<Item[]>,
      required: true,
    },
  },
});

// ❌ RUIM - Sem tipagem
export default {
  props: ['items'],
};
```

### Nomenclatura

- **Arquivos**: PascalCase para classes (`ShortLink.Service.ts`), camelCase para utils (`crypto.util.ts`)
- **Classes**: PascalCase (`ShortLinkService`)
- **Funções/Métodos**: camelCase (`generateShortCode()`)
- **Constantes**: UPPER_SNAKE_CASE (`JWT_SECRET`)
- **Variáveis**: camelCase (`shortCode`)

### Estrutura de Arquivos

**Backend:**
```
src/
  feature-name/
    handler.ts           # Lambda handler
    Feature.Service.ts   # Business logic
    Feature.Repository.ts # Data access
    Feature.Schemas.ts   # Zod schemas
```

**Frontend:**
```
src/
  pages/
    feature-page/
      FeaturePage.vue
      FeatureComponent.vue
  services/
    feature.service.ts
```

### Error Handling

Use as classes de erro customizadas:

```typescript
// ✅ BOM
throw new NotFoundError('Link not found');
throw new UnauthorizedError('Invalid token');
throw new ConflictError('Version mismatch');

// ❌ RUIM
throw new Error('Link not found');
```

### Async/Await

Sempre use async/await, não promises com `.then()`:

```typescript
// ✅ BOM
const link = await repository.getById(id);

// ❌ RUIM
repository.getById(id).then(link => {
  // ...
});
```

## 💬 Mensagens de Commit

Seguimos o padrão [Conventional Commits](https://www.conventionalcommits.org/).

### Formato

```
tipo(escopo): descrição curta

[corpo opcional]

[rodapé opcional]
```

### Tipos

- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Documentação
- `style`: Formatação (não afeta lógica)
- `refactor`: Refatoração
- `test`: Testes
- `chore`: Manutenção
- `perf`: Performance
- `ci`: CI/CD
- `build`: Build system

### Exemplos

```bash
# Feature
git commit -m "feat(links): add link expiration feature"

# Bug fix
git commit -m "fix(auth): resolve JWT token validation issue"

# Documentação
git commit -m "docs(readme): update installation instructions"

# Múltiplas linhas
git commit -m "feat(analytics): add click tracking

- Add click counter to links
- Create analytics dashboard
- Add date range filter

Closes #123"
```

### Regras

- Use o imperativo: "add" não "added" ou "adds"
- Primeira letra minúscula
- Sem ponto final
- Máximo 72 caracteres na primeira linha
- Corpo opcional para explicar o "porquê" e não o "o quê"
- Referencie issues relacionadas no rodapé

## 🔀 Pull Requests

### Checklist Antes de Abrir PR

- [ ] Código segue os padrões do projeto
- [ ] Testes passam localmente
- [ ] Testes adicionados para novas funcionalidades
- [ ] Documentação atualizada (README, comentários)
- [ ] Commits seguem o padrão Conventional Commits
- [ ] Branch está atualizada com `main`
- [ ] Sem conflitos de merge
- [ ] Sem console.logs de debug

### Template de PR

```markdown
## Descrição
Breve descrição do que foi alterado e por quê.

## Tipo de Mudança
- [ ] Bug fix (mudança que corrige um issue)
- [ ] Nova feature (mudança que adiciona funcionalidade)
- [ ] Breaking change (correção ou feature que quebra compatibilidade)
- [ ] Documentação

## Como Testar
1. Passo 1
2. Passo 2
3. Resultado esperado

## Screenshots (se aplicável)
[Adicione screenshots para mudanças visuais]

## Checklist
- [ ] Código segue os padrões do projeto
- [ ] Testes passam
- [ ] Documentação atualizada
- [ ] Sem console.logs de debug

## Issues Relacionadas
Closes #123
Refs #456
```

### Processo de Review

1. **Autor** abre o PR
2. **Reviewers** revisam o código
3. **Autor** implementa feedbacks
4. **Maintainer** aprova e faz merge

### Tempo de Review

- PRs pequenos (< 200 linhas): 1-2 dias
- PRs médios (200-500 linhas): 2-4 dias
- PRs grandes (> 500 linhas): Considere quebrar em PRs menores

## 🐛 Reportar Bugs

### Antes de Reportar

1. Verifique se o bug já foi reportado nas [Issues](https://github.com/seu-repo/issues)
2. Verifique se você está usando a versão mais recente
3. Tente reproduzir o bug em ambiente limpo

### Template de Bug Report

```markdown
**Descrição do Bug**
Descrição clara e concisa do bug.

**Como Reproduzir**
1. Vá para '...'
2. Clique em '...'
3. Veja o erro

**Comportamento Esperado**
O que você esperava que acontecesse.

**Screenshots**
Se aplicável, adicione screenshots.

**Ambiente:**
- OS: [ex: macOS 13.0]
- Browser: [ex: Chrome 120]
- Node: [ex: 20.10.0]
- Versão do projeto: [ex: 0.1.0]

**Logs**
```
Cole logs relevantes aqui
```

**Contexto Adicional**
Qualquer informação adicional.
```

## 💡 Sugerir Melhorias

### Template de Feature Request

```markdown
**Sua sugestão está relacionada a um problema?**
Descrição clara do problema. Ex: "Sempre fico frustrado quando..."

**Descreva a solução que você gostaria**
Descrição clara e concisa da solução proposta.

**Alternativas consideradas**
Outras soluções ou features que você considerou.

**Contexto Adicional**
Contexto, screenshots, exemplos de outros projetos, etc.

**Impacto**
Quantos usuários seriam beneficiados? Qual a prioridade?
```

## 🧪 Testes

### Estrutura de Testes

```typescript
// exemplo.test.ts
describe('ShortLinkService', () => {
  describe('create', () => {
    it('should create a short link with generated code', async () => {
      // Arrange
      const service = new ShortLinkService();
      const input = { originalUrl: 'https://example.com' };

      // Act
      const result = await service.create(input, 'user-id');

      // Assert
      expect(result.shortCode).toHaveLength(6);
      expect(result.originalUrl).toBe(input.originalUrl);
    });
  });
});
```

### Cobertura de Testes

Buscamos pelo menos 80% de cobertura. Priorize:
1. Business logic (Services)
2. Utilities críticos (JWT, crypto)
3. API handlers
4. Componentes complexos do frontend

## 📞 Precisa de Ajuda?

- 📧 Email: andersonwspace@gmail.com
- 💬 Abra uma [Discussion](https://github.com/seu-repo/discussions)
- 🐛 Reporte bugs em [Issues](https://github.com/seu-repo/issues)

## 🎉 Obrigado!

Toda contribuição, grande ou pequena, é valiosa. Obrigado por ajudar a tornar o ShortyURL melhor!

---

**Happy Coding! 🚀**
