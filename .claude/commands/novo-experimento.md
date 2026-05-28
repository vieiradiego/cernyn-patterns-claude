---
description: Inicia um novo experimento no padrão Cernyn — pergunta o caso de uso e monta a estrutura inicial
argument-hint: [descrição opcional do experimento]
---

Você está iniciando um novo experimento no padrão Claude Code da Cernyn. O usuário é um **executivo (diretor/superintendente), não-dev**.

## Sua missão

Conduzir uma conversa **curta e estruturada** para entender o experimento e criar a estrutura inicial. Não pergunte tudo de uma vez — **uma ou duas perguntas por turno**.

## Passo 1 — Entender o que o usuário quer

Se o usuário forneceu uma descrição em `$ARGUMENTS`, use como ponto de partida. Senão, pergunte:

> "Conta em uma frase o que você quer experimentar. Pode ser bem informal — ex: 'quero um dashboard que mostra deals abertos por bookrunner' ou 'quero automatizar a geração de teasers'."

## Passo 2 — Categorizar o caso de uso

Com base na resposta, identifique qual dos arquétipos abaixo melhor encaixa, e **confirme com o usuário** antes de prosseguir:

| Arquétipo | Stack sugerido (direção corporativa) | Quando |
|---|---|---|
| **A. Análise de dados / relatório** | Python + Jupyter + DuckDB/Pandas | Quer entender dados, gerar relatório, validar hipótese quantitativa |
| **B. Automação de processo** | **Node (TypeScript)** + script local | Quer automatizar tarefa repetitiva (planilha, e-mail, gerar doc) |
| **C. API/serviço backend** | **NestJS** (Node/TS) — direção da Cernyn | Vai virar um serviço para outras áreas consumirem |
| **D. App web interno** | **Next.js** (React) — direção da Cernyn | Tem interface, vários usuários, formulário ou dashboard |
| **E. POC com IA generativa** | **Bedrock + Node ou Python** | Usa LLM (resumo, classificação, extração) |

**Atenção:** se o usuário pedir .NET ou Angular, **pergunte se é manutenção de algo existente**. Se for novo, explique que o direcionamento Cernyn é Node + Next.js (.NET legado, Angular em descontinuação) — mas siga a escolha do usuário se ele insistir, registrando a justificativa em `.learnings/`.

## Passo 3 — Ajustar para a realidade

Pergunte (em uma única mensagem):

1. Você tem **conta AWS** pessoal/sandbox para este experimento? (sim/não — se não, vamos rodar tudo em Docker local)
2. O experimento manipula **dados reais** de clientes/operações? (sim/não — se sim, precisamos cuidar de sanitização)
3. Você tem prazo? (deixa claro o que conseguimos entregar)

## Passo 4 — Criar a estrutura

Com base nas respostas, crie:

1. Pasta do experimento dentro de `exemplos/` (ou na raiz se preferir um repositório separado), com nome em kebab-case.
2. Estrutura mínima conforme o arquétipo escolhido:
   - **A. Dados:** `notebooks/`, `dados/.gitkeep`, `requirements.txt` ou `pyproject.toml`
   - **B. Automação:** `src/`, `package.json`, `tsconfig.json`
   - **C. API:** estrutura do framework escolhido (`dotnet new webapi` ou template NestJS)
   - **D. Web app:** estrutura do framework escolhido
   - **E. POC IA:** `src/`, exemplo de chamada Bedrock com `boto3` ou `@aws-sdk/client-bedrock-runtime`
3. `README.md` específico do experimento, com:
   - Objetivo (1 frase)
   - Como rodar local
   - Decisões iniciais
4. Se há serviço AWS envolvido e o usuário não tem conta, adicionar/atualizar `docker-compose.yml` com o serviço local correspondente.

## Passo 5 — Registrar a decisão inicial

Use `/aprender` (ou crie diretamente em `.learnings/`) para registrar:
- Tipo: `decisao`
- Título: "Arquétipo escolhido para este experimento"
- Conteúdo: arquétipo, stack, razão da escolha, alternativas consideradas

## Passo 6 — Próximos passos

Liste 3 a 5 próximos passos concretos, em ordem, em uma seção `## Próximos passos` no README do experimento. Pergunte ao usuário se quer começar pelo primeiro agora.

---

**Regras de ouro:**
- Tudo em português do Brasil.
- Não criar boilerplate que o usuário não vai usar — minimo viável.
- Sempre que escolher serviço AWS, mostrar **caminho local com Docker** lado a lado.
- Se o usuário pedir algo fora do stack-alvo (ex: Ruby, Go, MongoDB), explicar o trade-off do handoff antes de seguir.

---

_Comando do scaffold [Cernyn](https://cernyn.com/) — Consultoria Biônica de Engenharia Digital._