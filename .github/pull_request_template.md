<!--
Template de PR do scaffold Cernyn — preencha as seções abaixo.
Título do PR: use prefixo Conventional Commit (feat:, fix:, docs:, chore:, refactor:, test:).
Exemplo: "feat: classificador de leads com Bedrock"
Isto é direcionamento (soft), não bloqueio — mas ajuda muito o time de dev no handoff.
-->

## O quê
<!-- Em 1-2 frases: o que este PR faz. -->

## Por quê
<!-- A motivação ou o problema de negócio que isto resolve. -->

## Como testar
<!-- Passo a passo para alguém validar localmente. -->

## Checklist
- [ ] Título com prefixo Conventional Commit (`feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `test:`)
- [ ] PR pequeno e focado (idealmente < 400 linhas alteradas)
- [ ] Sem segredos, `.env` ou dados reais de cliente no diff
- [ ] Sem APIs de LLM externas (governança: sempre Bedrock)
- [ ] Rodei o revisor da linguagem (`revisor-node` / `revisor-python` / etc.) — e o `revisor-seguranca` se toquei credenciais ou dados
- [ ] Atualizei `docs/decisoes.md` / `.learnings/` se houve decisão técnica relevante

<!-- O subagent revisor-github confere estas convenções antes do handoff. -->
