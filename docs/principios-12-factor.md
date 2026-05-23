# 12-Factor App — aplicado à Cernyn

Os 12 fatores são princípios para construir aplicações que rodam bem em cloud (https://12factor.net). Este documento traduz cada fator para o que **você** precisa fazer no seu experimento, com exemplos do nosso stack.

Os fatores marcados com 🔥 são os **mais críticos** para experimentos seguindo o padrão Cernyn — comece por eles.

## 1. Base de código (Codebase)
**Princípio:** uma base de código rastreada em controle de versão (Git), com múltiplos deploys.

**Na prática:**
- Cada experimento tem **seu próprio repo Git**
- Não compartilhar código entre projetos via copy-paste — extrair como pacote interno
- Branch `main` é a fonte da verdade

## 2. Dependências
**Princípio:** declare explicitamente todas as dependências.

**Na prática:**
- Node: `package.json` com `dependencies` e versões fixadas (ou ranges sensatos)
- .NET: `*.csproj` com `PackageReference`
- Python: `pyproject.toml` (preferido) ou `requirements.txt`
- **Nunca** assuma "está instalado no sistema" — declare tudo

## 3. 🔥 Configurações
**Princípio:** configuração vive no **ambiente**, não no código.

**Na prática:**
- Local: arquivo `.env` (no `.gitignore`) com `.env.example` versionado
- AWS: AWS Systems Manager Parameter Store ou Secrets Manager
- **Nunca** commitar `.env` com valores reais
- **Nunca** ler config de arquivo dentro do código (`config.json` versionado é antipattern)

**Exemplo:**
```typescript
// Ruim
const DB_URL = "postgres://user:senha123@prod-db.Cernyn:5432/deals";

// Bom
const DB_URL = process.env.DATABASE_URL ?? throwMissing("DATABASE_URL");
```

## 4. Serviços de apoio (Backing Services)
**Princípio:** trate serviços externos (banco, cache, fila) como recursos plugáveis.

**Na prática:**
- Conexão de banco vem de variável de ambiente — você pode apontar para Postgres local ou RDS sem mudar código
- Cache pode ser Redis local em dev ou ElastiCache em prod — código é o mesmo
- DynamoDB Local em dev, DynamoDB AWS em prod — só muda o endpoint

## 5. Build, Release, Run
**Princípio:** separe as fases de **construir** (build), **configurar** (release) e **executar** (run).

**Na prática:**
- Build: `npm run build`, `dotnet publish`, `python -m build` — produz artefato imutável
- Release: combina artefato + config do ambiente — cada release tem um ID/versão
- Run: executa. **Não compile em produção**.

## 6. Processos
**Princípio:** processos **sem estado** (stateless) e shared-nothing.

**Na prática:**
- Não guarde sessão em memória — use Redis
- Não escreva arquivo no disco da máquina e espere ele estar lá depois — use S3
- Várias instâncias devem poder rodar em paralelo sem se atrapalhar

**Exemplo de antipattern:**
```python
# Antipattern: estado em memória
usuarios_logados = {}  # vai sumir no próximo deploy

# Correto
async def get_session(token: str) -> Session:
    return await redis.get(f"session:{token}")
```

## 7. Mapeamento de portas (Port Binding)
**Princípio:** sua app expõe serviço via porta — não depende de servidor externo (Apache/IIS na frente).

**Na prática:**
- App escuta em porta configurável via env (`PORT=3000`)
- Nginx/ALB é separado e fica na frente
- Em dev, você roda `npm start` e acessa `localhost:3000`

## 8. Concorrência
**Princípio:** escale horizontalmente adicionando processos.

**Na prática:**
- Sua app deve poder rodar com 1 instância ou 10 sem mudar nada
- Workers para jobs pesados (Lambda, ECS tasks)
- Não use thread/process pools internos quando o orquestrador (ECS, Lambda) faz isso melhor

## 9. Descartabilidade (Disposability)
**Princípio:** processos sobem rápido e desligam graciosamente.

**Na prática:**
- Startup deve ser de segundos, não minutos
- Trate sinais SIGTERM/SIGINT para finalizar requests em curso antes de morrer
- Filas e jobs devem ser idempotentes — se cair no meio, reprocessar não corrompe nada

## 10. 🔥 Paridade entre dev/prod
**Princípio:** mantenha dev, staging e prod o mais parecidos possível.

**Na prática:**
- Se prod usa Postgres 15, dev usa Postgres 15 (não SQLite por preguiça)
- Se prod usa DynamoDB, dev usa DynamoDB Local
- Se prod usa Redis, dev usa Redis em container
- Docker Compose é seu amigo — veja `docker/docker-compose.example.yml`

## 11. 🔥 Logs
**Princípio:** trate logs como **stream de eventos**.

**Na prática:**
- App escreve logs em `stdout`/`stderr`
- **Não** escreva em arquivo (`/var/log/app.log`) — quem coleta é o orquestrador
- Formato preferido: JSON estruturado (`{"level":"info","msg":"...","trace_id":"..."}`)
- Em AWS: CloudWatch Logs coleta automaticamente o stdout do Lambda/Fargate

**Exemplo:**
```typescript
// Ruim
fs.appendFileSync('app.log', `[${new Date()}] erro: ${err}\n`);

// Bom
logger.error({ err, trace_id }, "falha ao processar operação");
```

## 12. Tarefas administrativas
**Princípio:** tarefas one-off (migration, seed, limpeza) são processos versionados no repo.

**Na prática:**
- Scripts em `scripts/` ou `commands/` no repo
- Rodam no mesmo ambiente da app (mesmo container, mesma config)
- Versionados — você consegue ver quem rodou o que

---

## Checklist rápido (12-Factor)

Use isto antes de qualquer handoff:

- [ ] **Config:** zero valores hardcoded — tudo em env vars
- [ ] **Dependências:** `package.json` / `pyproject.toml` / `*.csproj` com versões
- [ ] **Logs:** stdout estruturado, não arquivo
- [ ] **Stateless:** estado vive em DynamoDB, Postgres, Redis ou S3 — nunca em memória da app
- [ ] **Paridade:** docker-compose para dev parecer prod
- [ ] **Migrations/seeds:** scripts versionados no repo
- [ ] **Build separado de run:** existe um passo claro de build (artefato) e outro de run
- [ ] **Backing services plugáveis:** trocar Postgres local por RDS é só mudar env var

---

## Quando isso não se aplica?

12-Factor é para **aplicações que rodam em cloud**. Não é dogma para:

- **Notebooks de análise** — outro contexto (foco é reprodutibilidade, não escalabilidade)
- **Scripts ad-hoc de automação local** — não vai virar serviço
- **POCs descartáveis** — não internalize esforço se vai jogar fora

Mas se a sua POC pode virar serviço, comece já no 12-Factor — economiza retrabalho.

Os revisores do scaffold apontam violações de 12-Factor classificadas — você não precisa decorar tudo.
