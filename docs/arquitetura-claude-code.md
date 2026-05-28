# Arquitetura do scaffold — os primitivos do Claude Code

Este documento é a **referência de consistência** do scaffold. Ele explica os mecanismos que o Claude Code oferece, qual o papel de cada um aqui, e — principalmente — **como decidir onde colocar uma coisa nova** para não criar redundância.

> Por que isso importa: o Claude Code tem vários mecanismos que parecem se sobrepor. Sem uma divisão clara de papéis, o scaffold acumula a mesma informação em três lugares e fica caro de manter. Esta página é o "mapa" que mantém tudo no lugar.

---

## O modelo mental: quem dispara? e onde roda?

Toda a diferença entre os mecanismos cabe em duas perguntas.

| Mecanismo | Quem dispara | Onde roda | Serve para | Quantos temos |
|---|---|---|---|---|
| **CLAUDE.md** | — (sempre no contexto) | conversa principal | "constituição": regras e contexto sempre ativos | 1 |
| **Skill** (`.claude/skills/`) | **o Claude**, automático, quando a descrição casa | conversa principal (injeta conhecimento) | *como fazer* algo / conhecimento sob demanda | 2 |
| **Subagent** (`.claude/agents/`) | o Claude ou você, pelo nome | **contexto separado e isolado** | **delegar** uma tarefa a um "trabalhador" com ferramentas restritas | 7 |
| **Slash command** (`.claude/commands/`) | **você**, digitando `/nome` | conversa principal | **iniciar** um fluxo guiado | 6 |
| **Hook** (`.claude/hooks/`) | a ferramenta (em eventos) | script externo (Node.js) | regra **automática e determinística** | 4 |
| **Permissions** (`settings.json`) | a ferramenta | — | regra **dura**: allow / ask / deny | 1 config |
| **MCP** (`.mcp.json`) | o Claude (usa as ferramentas) | servidor externo (local ou remoto) | **conectar** a ferramentas e dados externos | ver [mcp-servers.md](mcp-servers.md) |

A distinção mais importante e mais confundida:

- **Skill ≠ Subagent.** A skill injeta conhecimento na conversa **atual** — o Claude "aprende a fazer" e segue ali. O subagent é uma instância **separada** do Claude, com janela de contexto própria e ferramentas restritas, que faz um trabalho isolado e **devolve um resultado**.
- **Skill ≠ Command.** A skill o Claude usa sozinho e de forma invisível. O command **você** dispara digitando `/` — é um "botão" descobrível.

---

## Divisão de responsabilidade (a regra anti-redundância)

Para o conhecimento de **engenharia** (Clean Code, 12-Factor, SonarQube, Veracode, governança), a fonte única é a **skill `padroes-engenharia-cernyn`**. Os outros mecanismos a referenciam em vez de repetir:

| Quero... | Use | Não use |
|---|---|---|
| Que o Claude **já escreva** código no padrão | a skill (auto-carrega) | repetir regras no CLAUDE.md |
| **Revisar a fundo** antes de commit/handoff | o subagent revisor da linguagem | recolocar os critérios no subagent — ele aponta para a skill |
| Um **fluxo que você inicia** (novo experimento, handoff) | um slash command | uma skill (não aparece em menu) |
| Uma regra que **não pode ser ignorada** (não commitar `.env`) | hook + permissions | só texto no CLAUDE.md |
| **Ferramentas/dados externos** (docs, browser, GitHub) | um servidor MCP | um hook |

### Skill × Revisores, em concreto

- A **skill** define **o que** aplicar (os critérios). Carrega enquanto o código é escrito.
- Os **7 revisores** (subagents) são a **passada profunda e isolada** antes de commit/handoff. Cada um foca no **específico da sua linguagem** (ex: `revisor-python` cuida de pandas/notebooks; `revisor-node` de AWS SDK v3) e **referencia a skill** para os critérios gerais — sem reescrevê-los.
- `revisor-seguranca` é a exceção proposital: ele é a **fonte profunda** de segurança (CWEs detalhados, LGPD). A skill só carrega os CWEs-título e manda acioná-lo.

---

## Sobre "rules": não é um primitivo separado

Diferente de outras ferramentas (ex: `.cursor/rules`), o Claude Code **não tem** uma pasta `rules/`. O que chamamos de "regra" se divide em duas naturezas — e o scaffold usa as duas:

| Natureza | Mecanismo | Força |
|---|---|---|
| **Soft** — o Claude *deveria* seguir | CLAUDE.md (seção "O que NUNCA/SEMPRE fazer") | depende do modelo obedecer |
| **Hard** — a máquina *garante* | Hooks + Permissions (`settings.json`) | determinística, não dá para ignorar |

Exemplos de regra hard já ativos: o `deny` em `settings.json` que bloqueia `curl` para `api.openai.com`/Gemini (governança anti-LLM-externo) e a leitura de arquivos de segredo (`.env`, `*.pem`, `*.key`, `.ssh/**`); o `ask` que pede confirmação em ações destrutivas (push, merge, `rm`, `terraform apply`, `git reset --hard`); e o hook `pre-git-push.mjs`, que **bloqueia** o push se detectar segredo no diff — a única regra de bloqueio do scaffold (vazar credencial é irreversível). **Quando uma regra realmente não pode ser violada, ela deve virar hook/permission — não ficar só como texto.**

---

## Guia de decisão: onde coloco uma coisa nova?

```
É conhecimento que o Claude deve aplicar ao trabalhar?
   → SKILL (auto-carrega pela descrição)

É um fluxo que a PESSOA inicia explicitamente?
   → SLASH COMMAND (/nome, descobrível)

Precisa de contexto isolado ou ferramentas restritas (ex: revisão read-only)?
   → SUBAGENT

Precisa acontecer SEMPRE, de forma automática e garantida?
   → HOOK (ou PERMISSION, se for allow/deny de ferramenta)

É uma conexão a uma ferramenta/fonte de dados externa?
   → SERVIDOR MCP (.mcp.json)

É contexto/regra que vale para TODA conversa e é curto?
   → CLAUDE.md (mantenha enxuto — detalhe vai para docs/ ou skill)
```

---

## Inventário atual

- **Skills (2):** `padroes-engenharia-cernyn` (padrões de código), `aws-local-docker` (simular AWS local)
- **Subagents (7):** `revisor-node`, `revisor-python`, `revisor-dotnet`, `revisor-angular`, `revisor-github`, `revisor-seguranca`, `arquiteto-aws`
- **Slash commands (6):** `/setup-inicial`, `/novo-experimento`, `/aws-explorar`, `/preparar-handoff`, `/bedrock-poc`, `/aprender`
- **Hooks (4):** `session-start`, `auto-format`, `pre-git-push`, `check-prereqs`
- **MCP:** ver [mcp-servers.md](mcp-servers.md)

---

_Mantido por [Cernyn](https://cernyn.com/) — Consultoria Biônica de Engenharia Digital._
