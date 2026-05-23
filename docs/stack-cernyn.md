# Stack Cernyn

> ⚠️ **Atenção — direção tecnológica em transição.**
> A Cernyn recomenda **Node.js** como direcionamento corporativo. **Angular será descontinuado**. Este documento descreve **a realidade atual** (legado .NET + Angular) e **a direção** (Node + Next.js) — use a direção para experimentos novos.

## Stack atual (legado em manutenção)

| Camada | Tecnologia | Status |
|---|---|---|
| Backend | .NET 8 (C#) | 🟡 Legado em manutenção |
| Frontend | Angular | 🔴 **Em descontinuação corporativa** |
| Banco NoSQL | DynamoDB | ✅ Mantido |
| Cache / Sessão | Redis (ElastiCache) | ✅ Mantido |
| Banco SQL | RDS PostgreSQL | ✅ Mantido |
| Cloud | AWS | ✅ Mantido |
| IaC | Terraform | ✅ Mantido |

## Stack-alvo (para experimentos NOVOS)

| Camada | Tecnologia |
|---|---|
| Backend | **Node.js (TypeScript)** — NestJS para APIs estruturadas, Fastify/Express para serviços leves |
| Frontend | **Next.js** (React) para web; Node CLI para scripts |
| Banco NoSQL | DynamoDB |
| Cache / Sessão | Redis (ElastiCache) |
| Banco SQL | PostgreSQL |
| Cloud | AWS (Lambda, ECS Fargate) |
| IaC | Terraform |
| Observabilidade | DataDog |

## Por que Node?

- **Direcionamento corporativo:** alinhamento com o resto da Cernyn
- Ecossistema vasto (npm), comunidade ativa
- TypeScript dá tipagem forte sem o peso do .NET
- Lambda/Fargate rodam Node com perfeição
- AWS SDK v3 para Node é primeiro-cidadão
- LLM/Bedrock: SDK Node maduro (`@aws-sdk/client-bedrock-runtime`)

## E o .NET existente?

Continue mantendo o que já existe em .NET — não há reescrita massiva. Mas:

- **Não inicie experimentos novos em .NET** sem boa justificativa
- Se mantiver código .NET, use `revisor-dotnet` (continua disponível)
- Para integrações entre Node novo e .NET legado, use API REST com contratos OpenAPI

## E o Angular?

- **Não inicie front em Angular.** Direcionamento é descontinuar
- Para front novo: **Next.js** (React-based, padrão corporativo)
- Apps Angular existentes serão migrados para Next.js gradualmente (cronograma definido pela área de Engenharia de Plataforma)
- `revisor-angular` ainda existe para te ajudar a manter o que já está em produção

## Padrão de deploy em produção (Node + Next.js)

Quando o experimento amadurece e vai para produção, o padrão Cernyn é:

```
[Usuário]
    |
    v
[CloudFront]  <-- CDN, cache global, HTTPS, WAF
    |
    +---> [S3: Next.js static export]  <-- assets, HTML, JS, CSS
    |
    +---> [API Gateway]
              |
              v
          [Lambda Node.js]  <-- ou ECS Fargate p/ casos complexos
              |
              +---> [DynamoDB]
              +---> [Redis (ElastiCache)]
              +---> [Bedrock]
```

### Por que S3 + CloudFront?

- **S3** guarda os arquivos estáticos (build do Next.js, imagens, fontes) com altíssima durabilidade e custo baixo
- **CloudFront** é a CDN da AWS — entrega os arquivos com latência baixa em qualquer região do Brasil
- **WAF** acoplado ao CloudFront protege contra ataques comuns (OWASP top 10)
- **HTTPS gratuito** via ACM
- **Cache invalidation** controlada — você define o que fica em cache e por quanto tempo

### Como configurar (via Terraform — o time de dev faz no handoff)

- `aws_s3_bucket` privado (apenas CloudFront acessa via OAC — Origin Access Control)
- `aws_cloudfront_distribution` com 2 origens: S3 (assets) e API Gateway (API)
- `aws_acm_certificate` na região `us-east-1` (CloudFront só aceita certs lá)
- `aws_wafv2_web_acl` com regras OWASP Managed Rules

### Em experimentação local

Não precisa simular CloudFront — Next.js dev server serve direto. Apenas mantenha o build pronto para gerar estáticos:

```json
// next.config.js
{
  "output": "export"  // gera HTML/CSS/JS estáticos para S3
}
```

---

## Estrutura típica de um projeto novo (Node + Next.js)

```
projeto-mc/
├── apps/
│   ├── api/                        # NestJS ou Fastify
│   │   ├── src/
│   │   ├── tests/
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── web/                        # Next.js
│       ├── app/
│       ├── package.json
│       └── tsconfig.json
├── packages/                       # Código compartilhado
│   └── shared-types/
├── terraform/                      # IaC
├── docker-compose.yml
├── package.json                    # workspace root (pnpm workspaces ou turborepo)
└── README.md
```

## Como rodar local — stack nova

```yaml
# docker-compose.yml
services:
  dynamodb:
    image: amazon/dynamodb-local
    ports: ["8000:8000"]

  redis:
    image: redis:7-alpine
    ports: ["6379:6379"]

  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_PASSWORD: dev
      POSTGRES_DB: projeto_mc
    ports: ["5432:5432"]
```

Funciona em qualquer terminal (PowerShell, Terminal do macOS, bash/zsh do Linux):

```bash
docker compose up -d

# Terminal 1:
cd apps/api
npm run dev

# Terminal 2:
cd apps/web
npm run dev
```

## Bibliotecas comuns (Node)

### Backend (NestJS/Fastify/Express)
- **`@aws-sdk/client-dynamodb`** — DynamoDB
- **`@aws-sdk/client-bedrock-runtime`** — LLM
- **`ioredis`** — cliente Redis maduro
- **`pino`** — logging estruturado (com transport DataDog)
- **`zod`** — validação de schema (substitui FluentValidation)
- **`vitest`** ou **`jest`** — testes

### Frontend (Next.js)
- **`@aws-sdk/*`** quando server-side
- **`zustand`** ou **`@tanstack/react-query`** — estado
- **`tailwindcss`** — estilos
- **`shadcn/ui`** ou **`@radix-ui/*`** — componentes acessíveis
- **`recharts`** ou **`visx`** — gráficos
- **`@datadog/browser-rum`** + **`@datadog/browser-logs`** — observabilidade

## Migração Angular → Next.js

Se você tem um app Angular hoje e quer migrar:

1. **Não migre tudo de uma vez.** Componente a componente, feature a feature
2. Crie uma nova app Next.js ao lado da Angular
3. Use um proxy reverso (Nginx, ALB) para rotear cada URL para a app correta
4. Migre as rotas mais críticas primeiro
5. Quando terminar, desligue a Angular

O time de Engenharia de Plataforma da sua empresa tem um guia detalhado de migração — peça antes de começar.

## Anti-patterns conhecidos

- Iniciar experimento novo em .NET por "costume" — alinhe com o direcionamento Node
- Iniciar front em Angular — não comece nada novo em Angular
- Lógica de negócio no controller/route handler — extrair para service
- Salvar JWT em `localStorage` — usar httpOnly cookie + Redis backend
- `console.log` em produção — sempre `pino`/`winston` estruturado para DataDog

Os revisores `revisor-node` (preferido) e `revisor-dotnet` (legado) já cobrem isto.
