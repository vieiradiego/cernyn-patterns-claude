# Changelog

Histórico de versões deste scaffold. Seguimos [Semantic Versioning](https://semver.org/lang/pt-BR/) com pequenas adaptações para projetos de documentação/template.

## Convenções
- **Adicionado** — funcionalidade nova
- **Alterado** — funcionalidade existente mudou de comportamento
- **Removido** — funcionalidade removida
- **Corrigido** — bug ou inconsistência corrigida
- **Segurança** — correção com impacto de segurança

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
- Sistema `.LEARNINGS/` — caderno de bordo (decisões, gotchas, padrões, descartes), commitado no Git e lido pelo Claude no início de cada sessão

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
