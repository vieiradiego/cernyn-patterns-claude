# docs/ — Documentação do scaffold

Esta pasta reúne a documentação de referência do padrão Cernyn. Você **não precisa ler tudo** — use a tabela abaixo para ir direto ao que importa para o seu momento.

> 💡 O Claude consulta estes documentos automaticamente quando o assunto aparece. Você raramente precisa apontá-los manualmente.

## Por onde começar

| Seu momento | Leia primeiro |
|---|---|
| 🆕 Nunca instalei nada | [pre-requisitos.md](pre-requisitos.md) |
| 🤔 Não sei qual tecnologia usar | [stack-cernyn.md](stack-cernyn.md) → [padroes-cernyn.md](padroes-cernyn.md) |
| 🐳 Quero rodar AWS na minha máquina | [docker-localstack.md](docker-localstack.md) |
| ✍️ Vou escrever ou revisar código | [principios-clean-code.md](principios-clean-code.md) + [principios-12-factor.md](principios-12-factor.md) |
| 🤝 Meu experimento amadureceu | [handoff-para-dev.md](handoff-para-dev.md) |
| ❓ Não entendi um termo | [glossario.md](glossario.md) |
| 🏗️ Quero entender o scaffold por dentro | [arquitetura-claude-code.md](arquitetura-claude-code.md) |
| 🔌 Quero conectar ferramentas externas | [mcp-servers.md](mcp-servers.md) |

## Índice completo

### Arquitetura & ferramentas
- **[arquitetura-claude-code.md](arquitetura-claude-code.md)** — os mecanismos do Claude Code (CLAUDE.md, skills, subagents, commands, hooks, MCP), o papel de cada um e quando usar. Leia para entender como o scaffold é montado.
- **[mcp-servers.md](mcp-servers.md)** — servidores MCP que conectam o Claude a ferramentas/dados externos (documentação, navegador, GitHub): o que já vem pronto e como adicionar extras.

### Antes de começar
- **[pre-requisitos.md](pre-requisitos.md)** — o que instalar (Git, Node, Docker, Python, AWS CLI, .NET, Terraform), com matriz de instalação por SO (Windows / macOS / Linux).

### Direção técnica
- **[stack-cernyn.md](stack-cernyn.md)** — a stack-alvo (Node + Next.js) e o legado em manutenção (.NET, Angular). Por que Node, padrão de deploy em produção, migração Angular→Next.js.
- **[padroes-cernyn.md](padroes-cernyn.md)** — convenções na ordem da vida de um projeto: escolha de stack, estrutura de repo, convenções por linguagem, Git, SonarQube, Veracode, Terraform, CI/CD, DataDog, LGPD.

### Princípios de engenharia
- **[principios-clean-code.md](principios-clean-code.md)** — Clean Code aplicado (nomes, funções pequenas, sem mágicas, tratamento de erro) com checklist de review.
- **[principios-12-factor.md](principios-12-factor.md)** — os 12 fatores traduzidos para o nosso stack, com checklist de handoff.

> Estes dois princípios também estão consolidados na skill `padroes-engenharia-cernyn` (em `.claude/skills/`), que o Claude carrega automaticamente ao escrever ou revisar código.

### Infraestrutura local
- **[docker-localstack.md](docker-localstack.md)** — simular AWS local (LocalStack, DynamoDB Local, Redis, Postgres, Ollama) sem precisar de conta AWS, com exemplos de código em Node, Python e .NET.

### Handoff
- **[handoff-para-dev.md](handoff-para-dev.md)** — quando e como entregar o experimento ao time de dev da sua empresa: pacote completo, processo passo a passo, anti-patterns, templates de comunicação.

### Apoio
- **[glossario.md](glossario.md)** — termos técnicos e jargões do scaffold explicados em linguagem simples.
- **[decisoes.md](decisoes.md)** — *documento vivo*: registre aqui as decisões técnicas do **seu** experimento (resumo executivo). O detalhe vai em `.learnings/` via `/aprender`.

---

## Como a documentação se relaciona com o resto do scaffold

O scaffold tem vários lugares onde mora conhecimento — cada um com um papel. Visão rápida abaixo; a versão completa (com subagents, hooks e MCP) está em [arquitetura-claude-code.md](arquitetura-claude-code.md):

| Onde | Papel | Quem ativa |
|---|---|---|
| **CLAUDE.md** (raiz) | "Constituição" — sempre no contexto do Claude | Automático, todo turno |
| **`docs/`** (aqui) | Referência detalhada para humano e Claude | Sob demanda |
| **`.claude/skills/`** | Conhecimento de engenharia que dispara na tarefa certa | Claude, automaticamente |
| **`.claude/commands/`** | Fluxos guiados que **você** dispara digitando `/` | Você (usuário) |
| **`.mcp.json`** | Ferramentas/dados externos (docs, navegador, GitHub) | Claude, via servidores MCP |

Em resumo: `docs/` é onde você (humano) lê o detalhe; o CLAUDE.md e as skills é como o Claude já chega sabendo o essencial.

---

_Mantido por [Cernyn](https://cernyn.com/) — Consultoria Biônica de Engenharia Digital._
