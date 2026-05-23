# Exemplos — pontos de partida por caso de uso

Esta pasta contém exemplos prontos de experimentos comuns. Cada subpasta é um caso de uso completo com README, estrutura e instruções para você adaptar.

**Use estes exemplos como ponto de partida** quando seu caso se parecer com algum deles, ou rode `/novo-experimento` dentro do Claude Code para gerar uma estrutura customizada.

## Exemplos disponíveis

| Exemplo | Arquétipo | Stack | Caso de uso |
|---|---|---|---|
| [`automatiza-relatorio-mensal/`](./automatiza-relatorio-mensal/) | B. Automação | Node.js | Consolida planilhas Excel → relatório Markdown/PDF |
| [`classificador-de-leads/`](./classificador-de-leads/) | E. POC com IA | Node.js + Bedrock | Classifica leads em quente/médio/frio com justificativa |
| [`extrai-dados-de-pdf/`](./extrai-dados-de-pdf/) | E. POC com IA | Python + Bedrock | Extrai campos estruturados de PDFs (contratos, NFs) |

## Arquétipos esperados

Quando você rodar `/novo-experimento`, o Claude vai sugerir um destes arquétipos:

### A. Análise de dados / relatório
- **Stack:** Python + Jupyter + DuckDB ou Pandas
- **Quando:** você quer entender dados, gerar relatório, validar hipótese quantitativa
- **Estrutura típica:**
  ```
  analise-meu-tema/
  ├── notebooks/
  ├── dados/                   # gitignored — colocar amostras sintéticas
  ├── src/                     # código reutilizável extraído dos notebooks
  ├── pyproject.toml
  └── README.md
  ```

### B. Automação de processo
- **Stack:** Node.js (TypeScript) com script local
- **Quando:** você quer automatizar tarefa repetitiva (gerar relatório, enviar e-mail, processar planilha)
- **Estrutura típica:**
  ```
  automatiza-processo/
  ├── src/
  │   └── index.ts
  ├── package.json
  ├── tsconfig.json
  ├── .env.example
  └── README.md
  ```

### C. API / serviço backend
- **Stack:** NestJS (Node/TS) — direção corporativa
- **Quando:** vai virar serviço para outras áreas/sistemas consumirem
- **Estrutura típica:**
  ```
  minha-api/
  ├── src/
  │   ├── main.ts
  │   ├── app.module.ts
  │   └── modules/
  ├── test/
  ├── package.json
  ├── tsconfig.json
  ├── nest-cli.json
  ├── docker-compose.yml
  └── README.md
  ```

### D. App web interno
- **Stack:** Next.js (React) — direção corporativa
- **Quando:** tem interface visual, múltiplos usuários, formulário ou dashboard
- **Estrutura típica:**
  ```
  meu-app-web/
  ├── app/
  │   ├── page.tsx
  │   ├── layout.tsx
  │   └── api/
  ├── components/
  ├── lib/
  ├── public/
  ├── package.json
  └── README.md
  ```

### E. POC com IA generativa (Bedrock)
- **Stack:** Node.js ou Python + Amazon Bedrock
- **Quando:** quer usar LLM (resumir, classificar, extrair dados)
- **Veja:** comando `/bedrock-poc` para esqueleto guiado

## Boas práticas para cada experimento

1. **Cada experimento na sua subpasta** — não misturar código de diferentes ideias
2. **README.md curto e claro** — o que é, como rodar, status atual
3. **`.LEARNINGS/`** específica do experimento (opcional — pode usar a raiz)
4. **Não comitar dados reais** — use dados sintéticos
5. **Quando amadurecer** — mover para repositório próprio antes do `/preparar-handoff`

## Quando promover um experimento

Quando o experimento amadurece (alguém realmente usa, valor validado), considere:

1. Mover para um repositório Git próprio
2. Rodar `/preparar-handoff`
3. Apresentar ao tech lead da área

Detalhes em `docs/handoff-para-dev.md`.
