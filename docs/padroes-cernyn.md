# Padrões Cernyn — convenções para experimentos

Este documento resume os padrões técnicos da Cernyn que você deve seguir nos experimentos, na ordem em que eles aparecem na vida de um projeto.

## 1. Antes de começar — escolha de stack

Não escolha tecnologia por capricho. Direcionamento corporativo Cernyn: **Node-first** (Node/TS + Next.js para o novo; .NET e Angular são legado em manutenção).

> A **tabela completa** de "o que usar para cada caso" (direção × legado) é a fonte única em [stack-cernyn.md](stack-cernyn.md). Mantemos num só lugar para não divergir — este documento foca nas **convenções de processo** (estrutura, Git, qualidade, segurança, infra).

**Fora do padrão?** Pergunte por quê. Cada saída do padrão é uma promessa de retrabalho no handoff.

## 2. Estrutura mínima do repositório

```
meu-experimento/
├── CLAUDE.md              # Cérebro do Claude
├── README.md              # O que é, como rodar
├── .gitignore
├── .env.example           # Variáveis de ambiente (sem valores reais)
├── docker-compose.yml     # Serviços locais
├── src/                   # Código
├── tests/                 # Testes
├── docs/                  # Documentação adicional
├── .learnings/            # Caderno de bordo
└── HANDOFF.md             # Gerado por /preparar-handoff
```

## 3. Convenções por linguagem

### Node.js / TypeScript
- TypeScript com `strict: true`
- ESLint + Prettier configurados
- Estrutura `src/`, `tests/`
- Scripts no `package.json`: `dev`, `build`, `test`, `lint`, `format`
- Gerenciador: npm ou pnpm (corporativo prefere pnpm pela performance)

### .NET (C#) — legado
- .NET 8 LTS
- Nullable enabled (`<Nullable>enable</Nullable>`)
- `.editorconfig` na raiz
- Roslyn Analyzers ativos
- Estrutura: `src/`, `tests/`
- Testes: xUnit + Moq/NSubstitute

### Angular — legado em descontinuação
- Para apps existentes: Angular 17+ (standalone components)
- Estrutura `core/`, `shared/`, `features/`
- Signals para estado simples
- **Não iniciar app novo em Angular** — usar Next.js

### Python
- Python 3.11+
- `pyproject.toml` para dependências (não `setup.py` legado)
- `uv` (preferido) ou `poetry` como gerenciador
- `ruff` para lint+format
- `mypy` ou `pyright` para tipos
- Testes: pytest

## 4. Convenções de Git

### Branch
- `main` é a branch padrão
- Feature: `feat/nome-curto`
- Fix: `fix/nome-curto`

### Commits — Conventional Commits
```
feat: adiciona endpoint de listagem de pedidos
fix: corrige cálculo de taxa em operações intradia
docs: atualiza README do experimento
chore: bump dependencies
refactor: extrai service de notificação
test: adiciona testes para regra de aprovação
```

### Pull Request
- Use o template [`.github/pull_request_template.md`](../.github/pull_request_template.md) — já traz as seções e o checklist
- Título com prefixo Conventional Commit
- Descrição com **o quê / por quê / como testar**
- Pequeno (idealmente <400 linhas)
- Pelo menos 1 reviewer

## 5. Qualidade — SonarQube

Antes do handoff, o time de dev exige passar no Quality Gate do SonarQube: cobertura ≥ 70% para código novo, sem bugs críticos, sem code smells de complexidade ou duplicação.

> Os critérios concretos que evitam reprovação estão na skill `padroes-engenharia-cernyn` (fonte única) — o Claude já os aplica ao escrever código, e os 7 revisores apontam o que escapar.

## 6. Segurança — Veracode

Antes da produção, o time roda Veracode (SAST/SCA). As CWEs que mais reprovam — SQL injection, XSS, credencial hardcoded, path traversal, deserialização insegura, cripto fraca — estão catalogadas na skill `padroes-engenharia-cernyn` (seção Veracode).

O `revisor-seguranca` é a primeira linha **e** a fonte profunda — use-o sempre antes de qualquer push que toque credenciais, dados de cliente ou rede.

## 7. Infra como código — Terraform

Para experimentos, Terraform **não é obrigatório**. Mas se você for criar recursos AWS reais:

- Use Terraform (decisão corporativa Cernyn)
- Estado remoto em S3 + lock em DynamoDB
- Módulos reutilizáveis em vez de copy-paste
- `terraform fmt` + `terraform validate` antes de commit
- `terraform plan` antes de `terraform apply` — sempre

## 8. CI/CD — GitHub Actions

Workflow mínimo `.github/workflows/ci.yml`:

```yaml
name: CI
on:
  push:
    branches: [main]
  pull_request:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm run build
      - run: npm test
```

Acrescente:
- **SonarQube scan** quando o projeto for entrar no Quality Gate
- **Veracode scan** quando for promover para produção

## 9. Observabilidade — DataDog

A plataforma corporativa de observabilidade da Cernyn é **DataDog**. Tudo que vai para produção precisa estar instrumentado para DataDog.

**Em experimento (local):**
- Logs estruturados em JSON para stdout
- Inclua sempre: `level`, `msg`, `service`, `env`, `trace_id` (mesmo que dummy)

**Quando promover para AWS (sandbox em diante):**
- Instale o **DataDog Agent** no container/Lambda
- Bibliotecas a usar:
  - **.NET:** `Datadog.Trace` (APM) + `Serilog.Sinks.Datadog.Logs`
  - **Node:** `dd-trace` (APM) + `winston` ou `pino` com transport DataDog
  - **Python:** `ddtrace` (APM) + `python-json-logger`
  - **Angular:** `@datadog/browser-rum` (Real User Monitoring) + `@datadog/browser-logs`
- Tags obrigatórias: `env`, `service`, `version`, `team`
- Custo: o time de Engenharia de Plataforma controla licenças — não habilite features pagas sem combinar

**O que monitorar (checklist mínimo):**
- [ ] Logs centralizados (sem `console.log` perdido)
- [ ] APM tracing das chamadas HTTP/banco/AWS
- [ ] Health check `/health` ou `/healthz`
- [ ] Métricas de negócio (não só técnicas)
- [ ] Alerta básico: erro % > 5% por 5 min
- [ ] Dashboard com latência p50, p95, p99

**Em experimento local sem DataDog:**
- Logs em stdout JSON é suficiente
- O time de dev plugará o DataDog no handoff — basta seu código estar com logs estruturados

## 10. LGPD e dados sensíveis

Sua empresa provavelmente lida com dados regulados:

- **Nunca** commitar dados reais de clientes/operações
- **Sempre** sanitizar quando precisar de exemplo (use Faker/Bogus)
- **Logs** não devem imprimir CPF, CNPJ, nome de cliente
- **Quando publicar** para outros sistemas, documentar quais campos são PII

---

## Resumo executivo

| Aspecto | Padrão Cernyn |
|---|---|
| Stack (direção) | **Node/TS + Next.js + Python (dados)**; .NET e Angular são legado em manutenção |
| Cloud | AWS (Bedrock, Lambda, ECS, DynamoDB, S3, etc.) |
| IaC | Terraform |
| CI/CD | GitHub Actions |
| Qualidade | SonarQube (Quality Gate) |
| Segurança | Veracode + revisor-seguranca |
| Observabilidade | DataDog (APM + Logs + RUM) |
| Versionamento | Git + Conventional Commits + PRs |
| Princípios | Clean Code + 12-Factor |
| LLM | Bedrock (NUNCA OpenAI/Gemini) |

Em dúvida: pergunte ao Claude — ele tem este documento no contexto.
