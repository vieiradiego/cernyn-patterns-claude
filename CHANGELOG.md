# Changelog

Histórico de versões deste scaffold. Seguimos [Semantic Versioning](https://semver.org/lang/pt-BR/) com pequenas adaptações para projetos de documentação/template.

## Convenções
- **Adicionado** — funcionalidade nova
- **Alterado** — funcionalidade existente mudou de comportamento
- **Removido** — funcionalidade removida
- **Corrigido** — bug ou inconsistência corrigida
- **Segurança** — correção com impacto de segurança

---

## [Não lançado]

### Adicionado
- **README com "Como começar" em 3 caminhos** — substitui o passo a passo único anterior, atendendo três contextos distintos de chegada do executivo:
  - **Caminho A** (claude.ai/Desktop aberto): prompt pronto para colar, com placeholder de SO, que faz o Claude guiar o setup do zero
  - **Caminho B** (Claude Code já instalado): 4 passos usando o botão "Use this template" do GitHub — sem necessidade de `git clone` + reset do `.git`
  - **Caminho C** (não tem nada instalado): matriz de instalação Windows / macOS / Linux com winget / brew / apt
- **`/setup-inicial` agora detecta automaticamente o cenário do usuário** ([.claude/commands/setup-inicial.md](.claude/commands/setup-inicial.md)) — distingue **template GitHub (sem `.git`)**, **clone direto do scaffold público** (oferece reset do `.git`) e **repo do próprio usuário** (não mexe). Resolve a fricção de "para que apagar o `.git`?" que confundia executivos não-devs

### Corrigido
- **Documentação cross-platform** — instruções e exemplos agora cobrem Windows, macOS e Linux explicitamente:
  - [docs/pre-requisitos.md](docs/pre-requisitos.md): instruções de instalação por SO (winget / brew / apt / dnf) para Git, Node, Docker, Python, AWS CLI, .NET, Terraform
  - [docs/docker-localstack.md](docs/docker-localstack.md): blocos `powershell` específicos substituídos por `bash` universal; comandos com continuação por backtick (PowerShell-only) recebem variante bash com `\`; `Get-NetTCPConnection` ganha equivalentes `lsof` (macOS) e `ss` (Linux); `docker exec` com subshell trocado por nome de container fixo
  - [docs/stack-cernyn.md](docs/stack-cernyn.md): bloco `powershell` para comandos universais (`docker compose`, `npm run dev`) trocado por `bash`
  - [README.md](README.md): comando de clone com etapa Windows + macOS/Linux explícitos
  - [exemplos/extrai-dados-de-pdf/README.md](exemplos/extrai-dados-de-pdf/README.md): ativação de venv com variantes Windows e macOS/Linux lado a lado
  - [CLAUDE.md](CLAUDE.md): afirmação explícita de suporte Windows/macOS/Linux na seção "Realidade operacional"

### Alterado
- E-mail de contato da Cernyn atualizado de `diego@cernyn.com` para `pinus@cernyn.com` em [README.md](README.md), [ABOUT-CERNYN.md](ABOUT-CERNYN.md) e nos três exemplos

---

## [0.1.0] — 2026-05-23

Versão inicial pública do scaffold.

### Adicionado
- `CLAUDE.md` raiz com perfil de usuário (executivos), stack-alvo (Node + Next.js), princípios universais (Clean Code + 12-Factor) e regras de uso
- `README.md` com instruções para usuários não-dev
- `.claude/settings.json` com permissões amigáveis (allowlist read-only AWS, ferramentas comuns) e configuração de hooks
- **6 slash commands**: `/setup-inicial`, `/novo-experimento`, `/aws-explorar`, `/preparar-handoff`, `/bedrock-poc`, `/aprender`
- **7 subagents revisores**: `revisor-node`, `revisor-dotnet` (legado), `revisor-angular` (legado/descontinuação), `revisor-python`, `revisor-github`, `revisor-seguranca`, `arquiteto-aws`
- **4 hooks Node.js cross-platform** (Windows/macOS/Linux):
  - `session-start.mjs` — detecta primeira execução, sugere `/setup-inicial`
  - `auto-format.mjs` — formata automaticamente arquivos editados
  - `pre-git-push.mjs` — varredura de segredos antes de push
  - `check-prereqs.mjs` — verifica Git, Node, Docker, editores, Python, AWS CLI, .NET, Terraform
- Sistema `.LEARNINGS/` — memória viva do projeto (decisões, gotchas, padrões, descartes)
- Documentação em `docs/`:
  - `padroes-cernyn.md` — convenções gerais
  - `stack-cernyn.md` — direção Node + Next.js e legado .NET/Angular
  - `docker-localstack.md` — simulação de AWS local
  - `handoff-para-dev.md` — entrega ao time de dev
  - `principios-clean-code.md` — Clean Code aplicado
  - `principios-12-factor.md` — 12-Factor App aplicado
  - `pre-requisitos.md` — o que instalar antes de começar
  - `glossario.md` — termos técnicos e jargão corporativo
  - `decisoes.md` — template para registrar decisões
- `docker/docker-compose.example.yml` — LocalStack + DynamoDB Local + Redis + Postgres + (Ollama comentado)
- `.gitignore` cobrindo Node, .NET, Python, Angular, Terraform, Docker, IDE, OS, dados sensíveis
- `exemplos/README.md` — guia de arquétipos de experimentos
- Padrões corporativos integrados: **Terraform** (IaC), **SonarQube** (qualidade), **Veracode** (segurança), **DataDog** (observabilidade), **AWS Bedrock** (LLM corporativo)

---

_Mantido por [Cernyn](https://cernyn.com/) — consultoria de IA._
