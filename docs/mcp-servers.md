# MCP — conectando o Claude a ferramentas externas

**MCP (Model Context Protocol)** é o jeito de dar ao Claude Code "tomadas" para ferramentas e fontes de dados externas: documentação sempre atualizada, um navegador para testar seu app, o GitHub, a documentação da AWS, etc. Sem MCP, o Claude só enxerga seus arquivos e o terminal.

> 🧭 Onde MCP se encaixa entre os mecanismos do scaffold: veja [arquitetura-claude-code.md](arquitetura-claude-code.md).

> ⚠️ **MCP não troca o modelo de IA.** A regra de governança continua: a IA é sempre Claude/Bedrock, **nunca** OpenAI/Gemini. MCP é só para **ferramentas e dados**.

---

## O que já vem pronto (funciona direto do clone)

O arquivo `.mcp.json` na raiz já traz **dois servidores** que rodam só com **Node** (que você já instalou) e **sem credencial nenhuma**:

| Servidor | Para que serve | Dados |
|---|---|---|
| **context7** | Injeta documentação **atual** de Next.js, NestJS, React, AWS SDK e milhares de libs — para o Claude escrever código certo, não desatualizado. Funciona sozinho, em segundo plano. | Envia só o *nome da biblioteca/tópico* consultado (não seu código) |
| **playwright** | Deixa o Claude **abrir e testar** o app web que você criar: navegar, clicar, preencher formulário, tirar screenshot. | 100% **local** — só acessa as URLs que você apontar |

### Como ativar (uma vez) — e por que o Claude pergunta antes

Na **primeira vez** que você abrir este projeto com o Claude Code, vai aparecer uma pergunta parecida com:

> *"Este projeto contém servidores MCP definidos em `.mcp.json`. Deseja conectar a eles?"*

**O que está acontecendo, em linguagem simples:**

- Um servidor MCP é um pequeno programa que dá ferramentas novas ao Claude. Como ele vem definido num arquivo do projeto (que veio do GitHub), o Claude Code **não liga nada sozinho** — ele te mostra e **pede sua autorização**. Isso é uma proteção: você sempre sabe o que está sendo conectado.
- **Nada roda até você aprovar.** Se você responder "não", o projeto funciona normalmente, só sem essas duas ferramentas extras.
- Os dois servidores deste scaffold são **seguros para aceitar**: não pedem senha nem token, o `context7` só **lê documentação pública** de bibliotecas, e o `playwright` só abre um navegador **na sua própria máquina**. Nenhum dado seu é enviado para terceiros por eles.

**O que fazer:** escolha a opção de **aprovar** (geralmente algo como *"Sim, e não perguntar de novo neste projeto"*). É um clique, uma vez só.

> 🔄 **Mudou de ideia?** Para ser perguntado de novo (ou desconectar), rode `claude mcp reset-project-choices` no terminal.

### Confirme que ativou

Dentro do Claude, digite:

```
/mcp
```

Você verá `context7` e `playwright` como **conectados**, com a lista de ferramentas de cada um. Se aparecer algum como "pendente" ou "com erro", veja a seção *Solução de problemas* no fim desta página.

> 💡 **Primeira vez do Playwright:** ao pedir para ele abrir uma página, ele baixa os navegadores automaticamente (leva alguns minutos só na primeira vez — depois é instantâneo).

> 🔇 **Quer pular até esse único clique?** Dá para auto-aprovar adicionando `"enableAllProjectMcpServers": true` no `.claude/settings.json`. **Não** é o padrão deste scaffold de propósito: para um público que está aprendendo, preferimos que você veja uma vez o que está sendo conectado antes de liberar.

---

## Extras opcionais (você adiciona quando quiser)

Estes não vêm ativos porque pedem algo a mais (Python ou um token). Se um servidor que precisa de token entra no `.mcp.json` sem o token, ele fica com erro no `/mcp` — por isso ficam aqui como receita.

### AWS Documentation — consultar a doc oficial AWS/Bedrock sem sair do Claude

Read-only, sem credencial AWS. **Requer Python com `uv`** (instale em https://docs.astral.sh/uv/). Adicione ao `mcpServers` do `.mcp.json`:

```json
"aws-docs": {
  "type": "stdio",
  "command": "uvx",
  "args": ["awslabs.aws-documentation-mcp-server@latest"],
  "env": { "FASTMCP_LOG_LEVEL": "ERROR" }
}
```

### GitHub — gerenciar repos, issues e PRs no Claude

Remoto (servidor oficial do GitHub). **Dados do repo vão para o GitHub** (que você já usa). Precisa de um **token de acesso pessoal (PAT)** — crie em https://github.com/settings/tokens.

1. Guarde o token numa variável de ambiente (nunca no arquivo):

   | SO | Como definir |
   |---|---|
   | **Windows (PowerShell)** | `setx GITHUB_PAT "ghp_seu_token"` (reabra o terminal depois) |
   | **macOS / Linux** | adicione `export GITHUB_PAT="ghp_seu_token"` ao `~/.zshrc` ou `~/.bashrc` |

2. Adicione ao `.mcp.json` (o `${GITHUB_PAT}` é expandido pelo Claude Code — o token **não** fica no arquivo):

   ```json
   "github": {
     "type": "http",
     "url": "https://api.githubcopilot.com/mcp/",
     "headers": { "Authorization": "Bearer ${GITHUB_PAT}" }
   }
   ```

---

## Comandos úteis

| Ação | Comando |
|---|---|
| Ver servidores conectados (dentro do Claude) | `/mcp` |
| Listar servidores (terminal) | `claude mcp list` |
| Ver detalhes de um | `claude mcp get context7` |
| Adicionar um servidor | `claude mcp add ...` |
| Remover um servidor | `claude mcp remove nome` |
| Re-perguntar aprovações do projeto | `claude mcp reset-project-choices` |

---

## Regra de ouro para tokens

- **Nunca** escreva um token direto no `.mcp.json`. Use sempre `${NOME_DA_VARIAVEL}` e guarde o valor numa variável de ambiente (ou no `.env`, que já está no `.gitignore`).
- Assim o `.mcp.json` pode ser commitado e compartilhado sem vazar segredo — exatamente como os dois servidores padrão (que nem precisam de token).

---

## Solução de problemas

- **Um servidor aparece com erro no `/mcp`:** quase sempre é token faltando (ex: `${GITHUB_PAT}` não definido) ou ferramenta ausente (`uv` para o AWS docs). Confira o pré-requisito do servidor.
- **`npx` demora na primeira vez:** normal — ele baixa o pacote do servidor uma vez e guarda em cache.
- **Nada aparece no `/mcp`:** confirme que você aprovou os servidores do projeto na primeira execução. Rode `claude mcp reset-project-choices` para ser perguntado de novo.

---

_Mantido por [Cernyn](https://cernyn.com/) — Consultoria Biônica de Engenharia Digital._
