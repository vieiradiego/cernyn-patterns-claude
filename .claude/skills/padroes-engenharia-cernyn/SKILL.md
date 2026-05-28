---
name: padroes-engenharia-cernyn
description: Padrões de engenharia Cernyn (Clean Code, 12-Factor, Quality Gate SonarQube, CWEs Veracode e governança de dados) a aplicar ao ESCREVER, EDITAR ou REVISAR código de qualquer linguagem (Node/TS, Python, .NET) em experimentos. Use sempre que for gerar ou alterar código, montar estrutura de projeto, ou checar qualidade antes de commit/handoff.
---

# Padrões de engenharia Cernyn

Este é o **checklist operacional** que o Claude aplica ao escrever ou revisar código no padrão Cernyn. É a fonte única de regras — o detalhe didático com exemplos está em `docs/` (linkados abaixo), e os revisores especializados (`revisor-node`, `revisor-python`, etc.) usam exatamente estes critérios.

> Público: **executivo, não-dev**. Ao apontar um problema, explique o **porquê** em PT-BR e mostre o código corrigido — não só "está errado".

## Quando aplicar
- Ao **gerar** qualquer código novo (já sai aderente, não conserte depois).
- Ao **editar** código existente.
- Ao **montar a estrutura** de um experimento.
- Antes de **commit ou handoff** (use junto com o revisor da linguagem).

Não se aplica a notebooks de análise exploratória descartáveis nem a scripts ad-hoc que não vão virar serviço — nesses casos, foque só em "Governança" abaixo.

---

## 1. Clean Code (aplicar ao escrever)
→ Detalhe e exemplos: [docs/principios-clean-code.md](../../../docs/principios-clean-code.md)

- **Nomes claros** — `valor_total_operacao_brl`, não `v`. Se você não entenderia em 3 meses, o nome é ruim.
- **Funções pequenas** — uma função faz uma coisa. >50 linhas ou >3 níveis de indentação = quebrar.
- **Sem mágicas** — todo número/string literal sem contexto vira constante nomeada.
- **Comentário só para o *porquê*** não óbvio — renomeie em vez de comentar o *o quê*.
- **Erro explícito** — nada de `catch` vazio. Trate ou propague, sempre logando o contexto.
- **DRY com moderação** — duplique 2x sem culpa; na 3ª, extraia (se for a mesma ideia, não só código parecido).
- **Menor espanto** — a função faz exatamente o que o nome diz. `getUserById` não envia e-mail.

## 2. 12-Factor (aplicar ao construir serviço)
→ Detalhe: [docs/principios-12-factor.md](../../../docs/principios-12-factor.md). Os 🔥 são os críticos.

- 🔥 **Config no ambiente** — tudo em env vars (`.env` local + `.env.example` versionado; Parameter Store na AWS). Zero secret hardcoded.
- 🔥 **Logs em stdout** — JSON estruturado (`level`, `msg`, `service`, `trace_id`). Nunca escrever arquivo de log.
- 🔥 **Paridade dev/prod** — mesmo banco em dev e prod (Postgres em ambos, não SQLite por preguiça). Use `docker/docker-compose.example.yml`.
- **Stateless** — estado vive em Redis/DynamoDB/Postgres/S3, nunca na memória do processo.
- **Dependências declaradas** — `package.json` / `pyproject.toml` / `*.csproj` com versões.
- **Build separado de run** — não compile em produção.

## 3. Quality Gate SonarQube (evitar antes que o pipeline pegue)
→ Detalhe: [docs/padroes-cernyn.md](../../../docs/padroes-cernyn.md#5-qualidade--sonarqube)

- Complexidade ciclomática **> 10–15** → extrair função.
- Função **> 60 linhas** ou **duplicação** (3+ blocos iguais).
- **Bugs**: null pointer, divisão por zero, recurso (conexão/arquivo) não fechado.
- Cobertura mínima **70%** para código novo — sugerir ao menos 1 teste mesmo em POC.
- Sem `TODO` órfão (sempre `// TODO: motivo + dono`).

## 4. Segurança Veracode (CWEs a nunca introduzir)
→ Detalhe: [docs/padroes-cernyn.md](../../../docs/padroes-cernyn.md#6-segurança--veracode). Acione `revisor-seguranca` quando houver credenciais, dados de cliente ou exposição de rede.

| CWE | Risco | Como evitar |
|---|---|---|
| CWE-89 | SQL injection | Queries parametrizadas / prepared statements — nunca template string com input |
| CWE-79 | XSS | Escapar/sanitizar saída no front; nunca `dangerouslySetInnerHTML` com input |
| CWE-798 | Credencial hardcoded | Sempre env var; nunca string no código |
| CWE-22 | Path traversal | Validar/normalizar caminhos de arquivo vindos de input |
| CWE-502 | Deserialização insegura | Não desserializar input não confiável; validar com `zod`/schema |
| CWE-327 | Cripto fraca | Nada de MD5/SHA1 para segurança — use SHA-256+ / bcrypt/argon2 |

Nunca usar `eval` / `new Function` com input. Nunca dependência com licença **GPL/AGPL** sem checar jurídico.

## 5. Governança de dados (inegociável)
- **LLM**: sempre **Amazon Bedrock**. **Nunca** OpenAI/Gemini/APIs externas — dados não saem do perímetro AWS da empresa.
- **Dados de cliente**: nunca commitar dados reais. Use sintéticos (Faker/Bogus). Logs não imprimem CPF/CNPJ/nome.
- **Segredos**: nunca commitar `.env`, `*.pem`, chaves AWS. O hook `pre-git-push.mjs` varre, mas não confie só nele.

---

## Como usar com o resto do scaffold
- Esta skill define **o que** aplicar; os **revisores** (`revisor-node`, `revisor-python`, `revisor-dotnet`, `revisor-angular`, `revisor-seguranca`) fazem a revisão profunda por linguagem usando estes mesmos critérios.
- Decisões técnicas relevantes que surgirem → ofereça registrar em `.learnings/` via `/aprender`.
- Antes do handoff, os checklists de [docs/principios-clean-code.md](../../../docs/principios-clean-code.md) e [docs/principios-12-factor.md](../../../docs/principios-12-factor.md) consolidam o que o time de dev vai cobrar.

---

_Skill do scaffold [Cernyn](https://cernyn.com/) — Consultoria Biônica de Engenharia Digital._
