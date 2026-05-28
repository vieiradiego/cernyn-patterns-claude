# Changelog

Histórico de versões deste scaffold. Seguimos [Semantic Versioning](https://semver.org/lang/pt-BR/) com pequenas adaptações para projetos de documentação/template.

## Convenções
- **Adicionado** — funcionalidade nova
- **Alterado** — funcionalidade existente mudou de comportamento
- **Removido** — funcionalidade removida
- **Corrigido** — bug ou inconsistência corrigida
- **Segurança** — correção com impacto de segurança

---

## [1.3.0] — 2026-05-27

Servidores MCP prontos para uso + consolidação da arquitetura dos mecanismos do Claude Code e remoção de redundâncias.

### Adicionado
- **MCP (Model Context Protocol)** configurado para iniciar direto do clone:
  - [.mcp.json](.mcp.json) na raiz com dois servidores que rodam só com Node e **sem credencial**: **context7** (documentação atualizada de bibliotecas ao escrever código) e **playwright** (abrir e testar apps web).
  - [docs/mcp-servers.md](docs/mcp-servers.md) — guia executivo: o que vem pronto, como aprovar/confirmar com `/mcp`, governança (local × remoto) e **receitas opt-in** (AWS Documentation via `uvx`; GitHub via token em variável de ambiente).
  - Permissão `mcp__context7` (read-only) no [.claude/settings.json](.claude/settings.json); ações do Playwright seguem o fluxo normal de aprovação.
  - Entrada **MCP** no [glossário](docs/glossario.md).
- **[docs/arquitetura-claude-code.md](docs/arquitetura-claude-code.md)** — referência de consistência: os mecanismos do Claude Code (CLAUDE.md, skill, subagent, command, hook, permissions, MCP), o papel de cada um, a explicação de que "rules" não é um primitivo separado (mapeia para CLAUDE.md + hooks/permissions) e um guia de decisão de "onde colocar uma coisa nova".
- **Skill `aws-local-docker`** — simula serviços AWS localmente com Docker (LocalStack, DynamoDB Local, Redis, Postgres, Ollama); carrega automaticamente quando o usuário monta AWS local. A referência completa com exemplos de código segue em [docs/docker-localstack.md](docs/docker-localstack.md).
- **Template de PR** ([.github/pull_request_template.md](.github/pull_request_template.md)) — seções *o quê / por quê / como testar* + checklist (Conventional Commit, sem segredos, sem LLM externa, revisores). Preenche o gap que o `revisor-github` já cobrava.

### Alterado
- **Eliminada a redundância skill ↔ revisores:** os 7 subagents agora referenciam a skill `padroes-engenharia-cernyn` como **fonte única** dos critérios gerais (Clean Code, 12-Factor, SonarQube, Veracode). Removidos os bullets genéricos duplicados nos revisores de Node/Python/.NET/Angular, mantendo só o específico de cada linguagem; `revisor-seguranca` segue como fonte profunda de segurança.
- **Eliminada a triplicação de stack:** [docs/padroes-cernyn.md](docs/padroes-cernyn.md) não repete mais a tabela de stack — aponta para [stack-cernyn.md](docs/stack-cernyn.md) como fonte única. As seções SonarQube e Veracode desse mesmo doc também deixaram de duplicar critérios — agora apontam para a skill `padroes-engenharia-cernyn`.
- **Dosagem do upsell suavizada:** os 6 slash commands deixam de incluir a sugestão ativa de venda ("sugira sutilmente…") no rodapé; a atribuição à Cernyn permanece.
- **CLAUDE.md** ganhou subseções "MCP" e "Convenções de Git" (soft — Conventional Commits, branches `feat/`/`fix/`, PR via template) e ponteiro para a doc de arquitetura. As convenções de Git passam a ficar **aplicadas no processo**, não só documentadas.
- **README.md** — árvore de estrutura com `.mcp.json`, `docs/arquitetura-claude-code.md` e `docs/mcp-servers.md`; badge de versão 1.3.0. Índice [docs/README.md](docs/README.md) atualizado.
- **Regras de permissão reforçadas** ([.claude/settings.json](.claude/settings.json)): novas confirmações (`ask`) para `git push --force`, `git reset --hard`, `gh repo delete` e `npm publish`; novos `deny` de leitura para `*.key`, `*.pfx`, `id_rsa*` e `.ssh/**` (além de `.env`/`*.pem` que já existiam).

### Segurança
- **O hook `pre-git-push` agora BLOQUEIA o push** (antes apenas alertava) quando detecta segredo no diff (AWS key, chave PEM, JWT, PAT, token Slack, etc.). É a **única regra de bloqueio** do scaffold — vazar credencial é irreversível. O FAQ do README foi ajustado para refletir isso. Falso positivo de dado de teste: o humano pode dar o push manualmente ou desabilitar o hook.

---

## [1.2.0] — 2026-05-27

Introdução de **Skills** (carregamento automático de conhecimento) + padronização do diretório de memória viva para caixa baixa.

### Adicionado
- **Skill `padroes-engenharia-cernyn`** ([.claude/skills/padroes-engenharia-cernyn/SKILL.md](.claude/skills/padroes-engenharia-cernyn/SKILL.md)) — primeira skill do scaffold. Consolida os padrões de engenharia (Clean Code, 12-Factor, Quality Gate SonarQube, CWEs Veracode e governança de dados) como **fonte única**, carregada automaticamente pelo Claude ao escrever, editar ou revisar código. Os 7 revisores passam a usar estes mesmos critérios; o `CLAUDE.md` deixa de duplicar o detalhe.
- **`docs/README.md`** — índice de navegação da documentação, com tabela "por onde começar" e explicação de como CLAUDE.md, docs, skills e commands se complementam.
- Entrada **Skill** no [glossário](docs/glossario.md), distinguindo skill (Claude carrega sozinho) de slash command (usuário dispara).

### Alterado
- **Diretório de memória viva renomeado** de `.LEARNINGS/` para `.learnings/` e índice de `MEMORY.md` para `memory.md`. Atualizadas ~30 referências em 21 arquivos (CLAUDE.md, README, hooks, commands, agents, docs e exemplos) — corrige quebra em sistemas case-sensitive (macOS/Linux), incluindo o caminho lido pelo hook `session-start.mjs`.
- **`CLAUDE.md`** ganhou a seção "Skills disponíveis" e referencia a skill como fonte dos padrões.
- **`README.md`** — árvore de estrutura atualizada com `.claude/skills/` e `docs/README.md`.

---

## [1.1.0] — 2026-05-23

Identidade visual oficial + reposicionamento da Cernyn como Consultoria Biônica.

### Adicionado
- **Social preview oficial** ([.github/social-preview.png](.github/social-preview.png), 1280×640) com a identidade visual completa da Cernyn — Nexus Mark com glow violeta+ciano, wordmark **CERNYN** em Sora 700, pill "Consultoria Biônica · Engenharia Digital", título principal com gradient violeta→ciano 135° (assinatura visual do site), tipografia Sora/Inter/JetBrains Mono. Aparece quando o link do repo é compartilhado em LinkedIn, Slack, Twitter etc.

### Alterado
- **Reposicionamento da Cernyn como Consultoria Biônica de Engenharia Digital** em todos os arquivos públicos — antes "consultoria de IA" (atributo redutor), agora "Consultoria Biônica" (combinação humano + IA, foco em modernização de legado, arquitetura de valor, ROI e Speed-to-Market). Aplicado em:
  - [ABOUT-CERNYN.md](ABOUT-CERNYN.md) — reescrito para refletir o posicionamento Biônico, com tagline oficial "Arquitetura para Evoluir Negócios" e seção explicando o conceito Biônico
  - [README.md](README.md) — 5 ocorrências em diferentes contextos (subtítulo, FAQ, "Sobre a Cernyn", footer)
  - [CLAUDE.md](CLAUDE.md) — header e seção de direcionamento técnico
  - [CHANGELOG.md](CHANGELOG.md) — footer
  - 6 slash commands em [.claude/commands/](.claude/commands/) — todos os rodapés
- **Versão badge** atualizada no README de `0.1.0` para `1.1.0`

---

## [1.0.0] — 2026-05-23

Lançamento estável inicial do scaffold (promovido de v0.1.0).

### Estrutura raiz
- `CLAUDE.md` com perfil de usuário (executivos), stack-alvo (Node + Next.js), princípios universais (Clean Code + 12-Factor) e regras de uso
- `README.md` com **Quick Start em 3 caminhos** para diferentes contextos do usuário (claude.ai aberto / Claude Code já instalado / nunca instalou nada) — incluindo prompt pronto para colar no claude.ai
- `LICENSE` MIT (Copyright Cernyn)
- `.gitattributes` para normalização cross-platform de line endings
- `.github/ISSUE_TEMPLATE/` com templates de bug, sugestão de melhoria e links de contato (cernyn.com, pinus@cernyn.com)
- `ABOUT-CERNYN.md` apresentando a consultoria

### Configuração do Claude Code
- `.claude/settings.json` com permissões amigáveis (allowlist read-only AWS, ferramentas comuns) e configuração de hooks
- **6 slash commands:** `/setup-inicial` (detecta automaticamente template GitHub, clone direto do scaffold ou repo próprio), `/novo-experimento`, `/aws-explorar`, `/preparar-handoff`, `/bedrock-poc`, `/aprender`
- **7 subagents revisores:** `revisor-node`, `revisor-dotnet` (legado), `revisor-angular` (legado/descontinuação), `revisor-python`, `revisor-github`, `revisor-seguranca`, `arquiteto-aws`
- **4 hooks Node.js cross-platform** (Windows/macOS/Linux):
  - `session-start.mjs` — detecta primeira execução, sugere `/setup-inicial`, conta aprendizados ignorando exemplos em comentários HTML
  - `auto-format.mjs` — formata automaticamente arquivos editados
  - `pre-git-push.mjs` — varredura de segredos antes de push
  - `check-prereqs.mjs` — verifica Git, Node, Docker, editores, Python, AWS CLI, .NET, Terraform

### Memória do projeto
- Sistema `.learnings/` — caderno de bordo (decisões, gotchas, padrões, descartes), commitado no Git e lido pelo Claude no início de cada sessão

### Documentação (PT-BR, cross-platform)
Todas as instruções cobrem Windows, macOS e Linux explicitamente quando há diferença de sintaxe:
- `pre-requisitos.md` — matriz de instalação por SO (winget / brew / apt / dnf) para Git, Node, Docker, Python, AWS CLI, .NET, Terraform
- `docker-localstack.md` — simulação de AWS local com variantes de shell
- `padroes-cernyn.md`, `stack-cernyn.md`, `handoff-para-dev.md`
- `principios-clean-code.md`, `principios-12-factor.md`
- `glossario.md`, `decisoes.md`

### Infra local
- `docker/docker-compose.example.yml` — LocalStack + DynamoDB Local + Redis + PostgreSQL + (MinIO e Ollama opcionais)
- `.gitignore` cobrindo Node, .NET, Python, Angular, Terraform, Docker, IDE, OS, dados sensíveis

### Exemplos prontos
- `exemplos/automatiza-relatorio-mensal/` (Node — automação de planilhas → relatório)
- `exemplos/classificador-de-leads/` (Node + Bedrock — classificação com IA)
- `exemplos/extrai-dados-de-pdf/` (Python + Bedrock multimodal — extração estruturada)

### Padrões corporativos integrados
**Terraform** (IaC), **SonarQube** (qualidade), **Veracode** (segurança), **DataDog** (observabilidade), **AWS Bedrock** (LLM corporativo — nunca OpenAI/Gemini)

---

_Mantido por [Cernyn](https://cernyn.com/) — Consultoria Biônica de Engenharia Digital._
