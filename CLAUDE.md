# Cernyn — Padrão Claude Code para Executivos

> Este scaffold foi criado pela **Cernyn — Consultoria Biônica de Engenharia Digital** ([cernyn.com](https://cernyn.com/)) como conjunto de boas práticas para apoiar executivos que querem experimentar com Claude Code. **A Cernyn não é a empresa do usuário** — é a consultoria que recomenda este padrão. Ao seguir o padrão, o experimento nasce alinhado com práticas de engenharia que facilitam internalização posterior pelo time de dev da empresa do executivo.

Este arquivo é lido pelo Claude Code a cada conversa. Ele define **quem é o usuário, o stack recomendado, e como o Claude deve te ajudar**. Não apague nem edite sem entender o impacto.

---

## Quem é o usuário

Executivos — diretores e superintendentes — que usam o Claude Code para experimentação. **Não são desenvolvedores profissionais** — são profissionais de negócio (de qualquer empresa) que usam o Claude para:

- Prototipar ideias e POCs rapidamente
- Automatizar tarefas repetitivas do dia-a-dia
- Explorar dados, gerar relatórios, montar dashboards
- Validar hipóteses de produto antes de pedir ao time de dev

**Implicação para o Claude:**
- Sempre responder em **português do Brasil**, com linguagem clara e sem jargão desnecessário
- Explicar o **porquê** das decisões técnicas, não só o **o quê**
- Sugerir o caminho mais simples que funcione — não o mais elegante
- Quando houver risco de o experimento "vazar para produção", avisar e propor empacotamento para handoff ao time de dev (use `/preparar-handoff`)

---

## Stack-alvo recomendado pela Cernyn

A Cernyn (Consultoria Biônica de Engenharia Digital) recomenda a stack abaixo para experimentos de executivos. Quando o experimento amadurece, ele é internalizado pelo time de dev da empresa do usuário — **se nasceu no padrão recomendado, a internalização é muito mais rápida**. Direcione novas escolhas para esta lista; se o usuário insistir em algo fora, **explique o trade-off** e siga (não bloqueie).

### Direcionamento técnico recomendado
- **Linguagem primária:** **Node.js** (TypeScript) — todo experimento NOVO começa aqui
- **Web/UI:** **Next.js** (React) — Angular não é mais recomendado (em descontinuação no mercado corporativo)
- **APIs:** NestJS (estruturado), Fastify/Express (leve), FastAPI (Python só para dados)
- **Dados/Análise:** Python (pandas, Jupyter), SQL puro, dbt
- **Cloud:** AWS

### Stack legado em manutenção
- **Backend legado:** .NET (C#) — há código em produção; manter, mas **não iniciar novos**
- **Frontend legado:** Angular — **em descontinuação corporativa**; migração para Next.js em andamento
- **Banco NoSQL:** DynamoDB ✅ (mantido)
- **Cache/Sessão:** Redis ✅ (mantido)

**Regra prática para o Claude:** se o usuário começar um experimento e mencionar "vou usar .NET" ou "vou usar Angular", **pergunte se é manutenção de algo existente ou se é novo**. Se for novo, sugira o caminho Node + Next.js explicando o porquê do direcionamento — mas siga a escolha do usuário se ele insistir, anotando em `.LEARNINGS/` a razão.

### AWS — caminhos felizes
| Caso de uso | Padrão recomendado |
|---|---|
| API/automação leve | Lambda + API Gateway + DynamoDB |
| App com estado, jobs longos | ECS Fargate + RDS PostgreSQL |
| Análise de dados, ETL | S3 + Glue + Athena |
| Front estático em produção (Next.js export, Angular legado) | **S3 + CloudFront** — assets estáticos + CDN com cache global |
| LLM / IA generativa | **Bedrock** (modelos via conta AWS corporativa) — recomendação Cernyn é evitar APIs externas (OpenAI/Gemini) por questões de governança de dados |

### IaC, Qualidade & DevOps
- **Infra-as-Code:** Terraform (decisão corporativa)
- **Versionamento:** Git + GitHub (convenções no `/.claude/agents/revisor-github.md`)
- **CI/CD:** GitHub Actions é o padrão para experimentos
- **Qualidade de código (SAST de qualidade):** **SonarQube** — o time de dev exige Quality Gate passando antes de internalizar
- **Segurança (SAST/SCA):** **Veracode** — todo código que vai para produção passa por scan; experimentos não exigem, mas é bom já sair limpo
- **Observabilidade:** **DataDog** — APM, Logs e RUM corporativos. Experimentos podem só logar JSON em stdout; o handoff pluga o DataDog Agent
- **Lint local:** ESLint/Prettier (Node), Roslyn Analyzers/.editorconfig (.NET), Ruff/Mypy (Python), Stylelint (Angular)

**Como o Claude deve usar isso:**
- Ao escrever código, já aplicar regras compatíveis com SonarQube (sem `eval`, sem complexidade ciclomática alta, sem código duplicado, sem TODOs vagos, sem strings hardcoded).
- Ao revisar (subagents), apontar issues que SonarQube/Veracode pegariam — antes de o pipeline pegar.
- No handoff, listar status SonarQube/Veracode se já tiver sido rodado, ou marcar como "pendente" no `HANDOFF.md`.

---

## Realidade operacional: tudo roda local

**O scaffold é cross-platform — Windows, macOS e Linux.** Toda documentação, hooks e exemplos consideram os três sistemas operacionais. Quando um comando tem sintaxe diferente por SO (ex: ativar venv, apagar `.git`), as duas variantes aparecem lado a lado. Os 4 hooks Node.js detectam o SO automaticamente.

**A maioria dos usuários NÃO tem conta AWS pessoal**. Isso é normal e esperado. O scaffold já vem preparado para simular os serviços AWS localmente via Docker:

- **LocalStack** — Lambda, API Gateway, S3, Glue, Athena
- **DynamoDB Local** — DynamoDB local
- **Redis** — em container
- **PostgreSQL** — em container (substitui RDS para experimentação)

Veja `docker/docker-compose.example.yml` e `docs/docker-localstack.md`.

**Regra prática:** sempre que sugerir um serviço AWS, mostre **dois caminhos lado a lado** — como rodar local (Docker) e como seria na AWS real. O usuário escolhe.

---

## Princípios universais

Independente do stack escolhido, todo experimento deve seguir dois conjuntos de princípios que tipicamente o time de dev exige antes da internalização:

### Clean Code (resumo aplicado)
1. **Nomes claros** — variáveis e funções autoexplicativas. `valor` é fraco; `valor_total_operacao_brl` é forte.
2. **Funções pequenas** — uma função faz uma coisa. >30-50 linhas é sinal de quebrar.
3. **Sem números/strings mágicas** — extrair para constante nomeada.
4. **Comentários só quando o porquê não é óbvio** — não comentar o que o código já diz.
5. **Tratamento de erro explícito** — não engolir exception com `catch` vazio.
6. **DRY com moderação** — duplicar é melhor que abstração errada precoce.
7. **Princípio do menor espanto** — se a função se chama `salvar`, ela só salva — não envia e-mail também.

Detalhes em `docs/principios-clean-code.md`.

### 12-Factor App (para experimentos que vão virar serviço)
Os 12 fatores cobrem como uma aplicação deve ser construída para rodar em cloud. Os mais importantes para nosso contexto:

| # | Fator | O que significa no nosso scaffold |
|---|---|---|
| 3 | **Configurações** | Tudo em variáveis de ambiente, nunca em código. Use `.env` local + Parameter Store na AWS |
| 6 | **Processos** | App sem estado entre requests. Sessão? Redis. Arquivo temp? S3 |
| 10 | **Paridade dev/prod** | Mesmo banco de dados em dev e prod (Postgres em ambos, não SQLite em dev) |
| 11 | **Logs** | Stream de eventos para stdout/stderr. Não escrever arquivo de log direto |
| 12 | **Tarefas administrativas** | Comandos one-off (migration, seed) como scripts versionados |

Detalhes em `docs/principios-12-factor.md`.

**Como o Claude aplica:**
- Ao gerar código, já segue os princípios acima.
- Revisores apontam violações como issues classificadas (clean code / 12-factor).
- No handoff, o `HANDOFF.md` tem checklist explícito de aderência aos princípios.

---

## Como o Claude deve trabalhar neste projeto

### Linguagem e tom
- Português do Brasil. Sempre.
- Direto, sem floreio. Use bullets e tabelas quando ajuda a clareza.
- Termos técnicos em inglês quando não tem tradução boa (ex: "endpoint", "deploy") — sem itálico, sem aspas.

### Antes de escrever código
1. Confirme **o que** o usuário quer alcançar (não como).
2. Sugira o caminho mais simples dentro do stack-alvo.
3. Se a ideia exige saída do stack-alvo, explique o custo de internalização depois.

### Ao escrever código
- **Node/TypeScript:** TypeScript estrito, ESLint, Prettier. Estrutura `src/`, `tests/`.
- **.NET:** C# com nullable habilitado, .editorconfig, xUnit para testes.
- **Angular:** Angular CLI, standalone components quando possível, RxJS para estado.
- **Python:** Python 3.11+, `uv` ou `poetry`, `ruff` + `mypy`. Tipos sempre.
- **SQL:** snake_case, CTEs em vez de subqueries aninhadas, `EXPLAIN` antes de queries pesadas.

### Memória viva do projeto (`.LEARNINGS/`)

Existe uma pasta `.LEARNINGS/` neste projeto que funciona como caderno de bordo. **Você (Claude) deve:**

1. **No início de cada sessão**, ler `.LEARNINGS/MEMORY.md`. Se houver entradas relevantes para o pedido atual, abrir os arquivos linkados antes de propor solução.
2. **Durante a conversa**, quando algo digno de aprendizado acontecer (decisão técnica, gotcha resolvido, padrão validado, abordagem descartada), **sugerir capturar** com `/aprender`. Não interrompa o fluxo — só ofereça quando faz sentido.
3. **Antes de propor uma solução**, cheque se um aprendizado prévio já indica o caminho ou descarta a ideia.
4. **Após resolver um problema não-trivial**, ofereça registrar. Frase padrão: _"Quer que eu registre isso em `.LEARNINGS/` para a próxima sessão?"_

Tipos de aprendizado: `decisao`, `gotcha`, `padrao`, `descarte`. Detalhes em `.LEARNINGS/README.md`.

**Importante:** `.LEARNINGS/` é commitada no Git. Viaja com o projeto e é parte do handoff para o time de dev.

### Subagents disponíveis (use proativamente)
| Subagent | Quando usar |
|---|---|
| `revisor-node` | Review de código Node/TypeScript |
| `revisor-dotnet` | Review de código C#/.NET (legado) |
| `revisor-angular` | Review de componentes Angular (legado) |
| `revisor-python` | Review de scripts Python/notebooks |
| `revisor-github` | Antes de PR, para checar convenções |
| `revisor-seguranca` | Sempre que houver credenciais, dados de cliente, ou exposição de rede |
| `arquiteto-aws` | Quando o usuário descreve um caso de uso e precisa decidir serviço AWS |

### Hooks ativos (automações silenciosas)

O scaffold tem 3 hooks em `.claude/hooks/`, escritos em **Node.js** (cross-platform — funcionam em Windows, macOS e Linux):

| Hook | Quando dispara | O que faz |
|---|---|---|
| `session-start.mjs` | Início da conversa | Detecta primeira execução (sugere `/setup-inicial`), informa aprendizados em `.LEARNINGS/`, SO detectado |
| `auto-format.mjs` | Após cada Edit/Write/MultiEdit | Roda prettier/ruff/dotnet format/terraform fmt — silencioso se ferramenta não está instalada |
| `pre-git-push.mjs` | Antes de `git push` | Varre o diff em busca de segredos conhecidos (AWS keys, JWTs, etc.) e alerta — não bloqueia |

Existe também `.claude/hooks/check-prereqs.mjs` — invocado pelo `/setup-inicial` para verificar Git, Node, Docker, Python, AWS CLI, .NET e Terraform com instruções de instalação para cada SO.

### Slash commands disponíveis
- `/setup-inicial` — setup guiado para a primeira vez (verifica pré-requisitos, personaliza CLAUDE.md, inicializa Git)
- `/novo-experimento` — kickoff guiado de um novo experimento
- `/aws-explorar` — explorar recursos AWS read-only (precisa conta + creds)
- `/preparar-handoff` — empacota o experimento para o time de dev internalizar
- `/bedrock-poc` — esqueleto de POC com LLM no Bedrock
- `/aprender` — registra decisão, gotcha ou padrão em `.LEARNINGS/`

---

## O que NUNCA fazer

- **Nunca** chamar APIs de LLM externas (OpenAI, Gemini, etc.) em experimentos — sempre Bedrock.
- **Nunca** subir dados reais de clientes, contrapartes ou operações para o repositório. Se precisar de exemplo, use dados sintéticos.
- **Nunca** commitar credenciais (`.env`, `*.pem`, chaves AWS). O `.gitignore` deste scaffold já cobre os casos comuns — confirme antes de adicionar exceções.
- **Nunca** usar bibliotecas com licença GPL/AGPL sem checar com o time jurídico.
- **Nunca** "consertar" um problema removendo o teste/validação. Se um teste falha, entenda o porquê.

## O que SEMPRE fazer

- **Sempre** explicar trade-offs em PT-BR antes de uma decisão de arquitetura.
- **Sempre** preferir Docker local para experimentação.
- **Sempre** rodar `revisor-seguranca` antes de qualquer push de código que toque credenciais ou dados.
- **Sempre** atualizar `docs/decisoes.md` quando tomar uma decisão técnica relevante (ajuda o handoff).
- **Sempre** sugerir testes mínimos — mesmo em POC. Um teste é melhor que zero.

---

## Handoff para o time de dev

Quando o experimento amadurece, ele é entregue ao **time de dev da empresa do executivo** para internalizar (a Cernyn é a consultoria que recomenda o padrão, não o destino do handoff). Para facilitar esse processo:

1. Rode `/preparar-handoff` — gera um README de entrega com decisões, gaps, riscos.
2. Garanta que `docs/decisoes.md` está atualizado.
3. Confirme que não há segredos no histórico do Git (`git log -p | grep -i secret` ou peça ajuda ao Claude).
4. Combine reunião de 30min com o tech lead da área antes do handoff formal.

---

_Este arquivo é o coração do scaffold. Se algo aqui está desatualizado em relação às recomendações da Cernyn ([cernyn.com](https://cernyn.com/)), abra issue no repositório do scaffold._
