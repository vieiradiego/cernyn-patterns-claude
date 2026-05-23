# Pré-requisitos — o que você precisa antes de começar

Este documento lista o que você precisa instalado na sua máquina para usar o scaffold, separado por **obrigatório**, **fortemente recomendado** e **opcional**.

O scaffold roda nos três sistemas operacionais: **Windows**, **macOS** e **Linux**. Para cada ferramenta abaixo damos instruções nos três caminhos.

> 💡 **Dica:** depois de instalar Claude Code, rode `/setup-inicial` que ele verifica tudo isso automaticamente para você. Esta página existe para o caso de você querer instalar manualmente antes.

---

## 🔴 Obrigatório

Sem isso, o scaffold simplesmente não funciona.

### Claude Code
A interface principal — você conversa com o Claude por aqui.

- **Como instalar (qualquer SO):** https://docs.claude.com/claude-code/quickstart
- **Como verificar:** abra um terminal e digite `claude --version`
- **Atenção:** você pode rodar o Claude Code **diretamente no terminal** (PowerShell, Terminal do macOS, bash/zsh do Linux) — **não precisa de VS Code**. Veja a próxima seção.

### Git
Sistema de versionamento. Necessário porque o scaffold é versionado.

| SO | Como instalar |
|---|---|
| **Windows** | https://git-scm.com/download/win (aceite as opções default) — ou `winget install Git.Git` |
| **macOS** | Vem pré-instalado com Xcode Command Line Tools: `xcode-select --install` — ou `brew install git` |
| **Linux (Ubuntu/Debian)** | `sudo apt update && sudo apt install -y git` |
| **Linux (Fedora/RHEL)** | `sudo dnf install -y git` |

- **Como verificar:** `git --version`

### Node.js (versão 20 ou superior)
A direção corporativa recomendada pela Cernyn é Node. Mesmo experimentos em Python precisam de Node para algumas ferramentas (Claude Code CLI, formatadores).

| SO | Como instalar |
|---|---|
| **Windows** | https://nodejs.org (escolha **LTS**) — ou `winget install OpenJS.NodeJS.LTS` |
| **macOS** | `brew install node` — ou via [nvm](https://github.com/nvm-sh/nvm): `nvm install --lts` |
| **Linux (Ubuntu/Debian)** | https://github.com/nodesource/distributions (NodeSource) — ou via nvm |
| **Linux (Fedora/RHEL)** | `sudo dnf install -y nodejs` |

- **Como verificar:** `node --version` (deve mostrar v20.x.x ou superior)

---

## 🟡 Fortemente recomendado

A experiência é muito melhor com estes, mas dá para começar sem.

### Editor de código

**Você NÃO precisa de um editor visual para usar o Claude Code.** Claude Code funciona como CLI puro no terminal.

Mas se você quer ver os arquivos sendo editados em tempo real, ter syntax highlighting, e debug visual:

- **Visual Studio Code (gratuito, multiplataforma):** https://code.visualstudio.com/
  - Extensão Claude Code (opcional): "Claude for VS Code"
- **Cursor (gratuito, baseado em VS Code, multiplataforma):** https://cursor.sh/
- **Outros aceitáveis por SO:**
  - Windows: Notepad++, Sublime Text
  - macOS: BBEdit, Sublime Text, TextMate
  - Linux: gedit, Kate, nano, vim

**Sem editor algum**, você ainda consegue usar o Claude Code — basta pedir para ele criar/editar os arquivos e ele faz. Você só não vai conseguir ver/editar manualmente sem um editor.

### Docker Desktop

Docker permite simular AWS localmente (LocalStack, DynamoDB Local, Redis, Postgres) — útil porque a maioria dos executivos não tem conta AWS pessoal.

| SO | Como instalar |
|---|---|
| **Windows** | https://www.docker.com/products/docker-desktop (requer **WSL 2** habilitado — o instalador guia) |
| **macOS** | https://www.docker.com/products/docker-desktop (Apple Silicon ou Intel) — ou `brew install --cask docker` |
| **Linux** | [Docker Engine](https://docs.docker.com/engine/install/) (não precisa do Desktop) — ou Docker Desktop para Linux |

Recomendado em qualquer SO: pelo menos 8 GB de RAM disponíveis para containers.

- **Como verificar:** `docker --version` e `docker compose version`

**Sem Docker, o que muda?**
- Você não consegue rodar `docker-compose.example.yml`
- Experimentos que precisam de DynamoDB/Redis/Postgres locais não funcionam
- Você ainda pode:
  - Fazer experimentos de **análise de dados** (Python, notebooks) — Docker não é necessário
  - Fazer experimentos de **automação local** (Node script que mexe com planilhas, arquivos) — Docker não é necessário
  - Fazer experimentos de **conteúdo** (resumir docs, gerar relatórios) — Docker não é necessário
  - Usar bancos em arquivo (SQLite, JSON, CSV) em vez de Postgres/DynamoDB

**Recomendação:** instale Docker quando o experimento exigir um banco de dados de verdade. Para começar, **não é bloqueante**.

---

## 🟢 Opcional

Útil em casos específicos, não bloqueante.

### Python 3.11+
Se você for fazer análise de dados, notebooks, ou ETL.

| SO | Como instalar |
|---|---|
| **Windows** | https://www.python.org/downloads/ (marque "Add Python to PATH" no instalador) — ou `winget install Python.Python.3.12` |
| **macOS** | `brew install python@3.12` — ou via [pyenv](https://github.com/pyenv/pyenv) |
| **Linux (Ubuntu/Debian)** | `sudo apt install -y python3 python3-pip python3-venv` |
| **Linux (Fedora/RHEL)** | `sudo dnf install -y python3 python3-pip` |

- **Como verificar:** `python --version` (ou `python3 --version` em Mac/Linux)
- **Recomendação:** instale também `uv` (gerenciador moderno): https://docs.astral.sh/uv/

### AWS CLI
Se você tem conta AWS pessoal/corporativa e quer interagir com ela.

| SO | Como instalar |
|---|---|
| **Windows** | https://awscli.amazonaws.com/AWSCLIV2.msi — ou `winget install Amazon.AWSCLI` |
| **macOS** | `brew install awscli` — ou pacote oficial: https://awscli.amazonaws.com/AWSCLIV2.pkg |
| **Linux** | https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html (instruções por distribuição) |

- **Como verificar:** `aws --version`
- **Configurar:** `aws configure` (vai pedir Access Key e Secret)

### .NET SDK
Se você for mexer com código C# legado.

| SO | Como instalar |
|---|---|
| **Windows** | https://dotnet.microsoft.com/download — ou `winget install Microsoft.DotNet.SDK.8` |
| **macOS** | `brew install --cask dotnet-sdk` — ou pacote oficial |
| **Linux** | https://learn.microsoft.com/dotnet/core/install/linux (instruções por distribuição) |

- **Recomendado:** .NET 8 LTS
- **Como verificar:** `dotnet --version`

### Terraform
Só se for criar/modificar infraestrutura AWS via código.

| SO | Como instalar |
|---|---|
| **Windows** | https://developer.hashicorp.com/terraform/install — ou `winget install HashiCorp.Terraform` |
| **macOS** | `brew tap hashicorp/tap && brew install hashicorp/tap/terraform` |
| **Linux** | https://developer.hashicorp.com/terraform/install (repo apt/dnf oficial) |

- **Como verificar:** `terraform --version`

---

## Cenários comuns

### "Não tenho nada instalado, sou completamente novo"

Mínimo absoluto para começar:
1. ✅ Claude Code (CLI no terminal)
2. ✅ Git
3. ✅ Node.js LTS

Pronto — você já consegue clonar o scaffold, rodar `/setup-inicial`, e fazer experimentos de automação leve ou conteúdo.

### "Quero fazer análise de dados em Python"

Mínimo:
1. ✅ Tudo da seção anterior
2. ✅ Python 3.11+
3. ⚠️ Editor de código (VS Code recomendado para abrir notebooks `.ipynb`)

### "Quero fazer uma POC de IA com Bedrock"

Mínimo:
1. ✅ Claude Code, Git, Node
2. ⚠️ Conta AWS com acesso ao Bedrock (corporativa ou pessoal) — OU usar Ollama local (precisa Docker)
3. ✅ AWS CLI configurada (se for usar AWS real)

### "Quero criar uma API ou app web"

Mínimo:
1. ✅ Claude Code, Git, Node
2. ✅ Docker Desktop ou Docker Engine (para subir banco local)
3. ⚠️ Editor de código (recomendado, mas não obrigatório)

---

## Como o scaffold lida com pré-requisitos faltando

O comando `/setup-inicial` verifica todos eles e relata o status. Para os **obrigatórios**, ele para e orienta a instalação. Para os **recomendados/opcionais**, ele avisa mas segue — você só vai esbarrar quando tentar um experimento que precisa do que falta.

Os 7 revisores também sabem disso: se você for fazer algo que precisa de Docker e não tem, o Claude vai sugerir alternativas (rodar com SQLite em vez de Postgres, por exemplo).

---

## E se eu não conseguir instalar nada disso?

Se sua máquina tem restrições corporativas que bloqueiam instalações:

1. Peça acesso à TI da sua empresa para liberar ao menos: Git, Node, Claude Code
2. Use **Claude.ai web** (https://claude.ai) como alternativa para conversas sem código
3. Considere alternativas conforme seu SO:
   - **Windows:** ativar WSL2 (sub-sistema Linux) — costuma ser mais aceito que máquina virtual completa
   - **macOS:** Homebrew normalmente não exige privilégios de admin para instalar no diretório do usuário
   - **Linux:** se você não tem `sudo`, use [Nix](https://nixos.org/) ou Homebrew (sim, Linux também) para instalar em `~`
4. Em último caso: máquina virtual ou ambiente em nuvem (GitHub Codespaces, AWS Cloud9) — se sua TI permitir
