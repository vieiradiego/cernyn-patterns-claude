# Decisões técnicas

Registre aqui as decisões técnicas relevantes do seu experimento. Este arquivo viaja com o projeto e é uma das primeiras coisas que o time de dev lê no handoff.

> Dica: cada decisão importante também merece um arquivo em `.LEARNINGS/` com mais detalhe (capturado via `/aprender`). Aqui no `decisoes.md` deixe o resumo executivo.

## Formato sugerido

Para cada decisão, registre:

- **Data:** quando foi tomada
- **Decisão:** o que decidimos
- **Por quê:** motivação principal
- **Alternativas consideradas:** o que ficou de fora e por quê
- **Consequências:** o que isso trava ou habilita no futuro

---

## Exemplo (apague quando começar a preencher)

### 2026-05-23 — Stack escolhida: Node (NestJS) + Next.js

- **Decisão:** API em NestJS (Node 20+/TypeScript), front em Next.js 14
- **Por quê:** direcionamento corporativo da Cernyn é Node + Next.js. Como o experimento provavelmente vai virar produção, começar no direcionamento elimina retrabalho no handoff
- **Alternativas:**
  - .NET 8 → descartado: é legado em manutenção; não iniciar novo
  - Angular → descartado: em descontinuação corporativa
  - Python + FastAPI → descartado para API; mantido para análise de dados ad-hoc
- **Consequências:**
  - Internalização pelo time de dev será mais rápida (mesma stack)
  - Bedrock SDK Node maduro
  - Build/deploy mais ágil (Lambda/Fargate aceitam Node nativo)

---

## Decisões do projeto

<!-- Adicione daqui para baixo as decisões do seu experimento -->
