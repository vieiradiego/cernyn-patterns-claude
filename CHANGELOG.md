# Changelog

Histórico de versões deste scaffold. Seguimos [Semantic Versioning](https://semver.org/lang/pt-BR/) com pequenas adaptações para projetos de documentação/template.

## Convenções
- **Adicionado** — funcionalidade nova
- **Alterado** — funcionalidade existente mudou de comportamento
- **Removido** — funcionalidade removida
- **Corrigido** — bug ou inconsistência corrigida
- **Segurança** — correção com impacto de segurança

---

## [0.1.0] — 2026-05-23

Versão inicial pública do scaffold.

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
