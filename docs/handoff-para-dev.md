# Handoff para o time de dev

Quando seu experimento amadurece, ele precisa ser **entregue** ao time de dev da sua empresa para internalizar (passar por hardening, segurança, observabilidade, IaC, e ir para produção).

Este documento explica o processo. O comando `/preparar-handoff` automatiza a maior parte.

## Quando começar o handoff?

Sinais claros de que está na hora:

- ✅ O experimento provou valor — pelo menos 1 stakeholder validou
- ✅ Você ou alguém da sua área já está usando regularmente
- ✅ Existe demanda para outros usuários
- ✅ Há decisão sobre continuar investindo

Sinais de que **ainda não** é hora:

- ❌ Você ainda está mudando a ideia toda semana
- ❌ Ninguém validou o resultado
- ❌ Foi feito 100% local sem nenhum dado real
- ❌ Você ainda não sabe responder "para que serve em uma frase"

## O que o time de dev precisa receber

Um pacote de handoff completo tem:

### 1. Código limpo
- Sem segredos no histórico Git
- Sem dados reais de cliente
- Estrutura coerente com o padrão Cernyn
- Passa nos 7 revisores do scaffold

### 2. Documentação
- `README.md` explicando o que é e como rodar
- `HANDOFF.md` gerado por `/preparar-handoff`
- `docs/decisoes.md` com decisões técnicas e suas justificativas
- `.learnings/` completo

### 3. Setup reproduzível
- `docker-compose.yml` que sobe tudo localmente
- `.env.example` listando todas as variáveis necessárias
- Comando único para rodar (`make start`, `npm run dev`, etc.)

### 4. Gaps identificados
Lista honesta do que **falta** para produção:
- Autenticação real (em vez de mock/hardcoded)
- Logging estruturado
- Tratamento de erro
- Testes
- IaC Terraform
- CI/CD
- Observabilidade
- LGPD

### 5. Estimativa de esforço
Faixa em sprints/semanas para chegar em produção. Sem otimismo.

## Processo recomendado

### Passo 1 — Rodar o comando guiado

```
/preparar-handoff
```

Ele:
- Analisa o estado atual do experimento
- Roda os 7 revisores em paralelo
- Gera o `HANDOFF.md`

### Passo 2 — Revisar o `HANDOFF.md`

Abra o arquivo gerado e:
- Confirme que o resumo executivo está correto
- Ajuste a estimativa de esforço (você tem mais contexto que o Claude)
- Preencha "Stakeholders" e "Tech lead destino"
- Liste riscos de negócio (não só técnicos)

### Passo 3 — Reunião de 30min com o tech lead

Antes de "passar a chave", agende 30 minutos com o tech lead da área:

- **15 min** — você apresenta o experimento (problema, solução, valor)
- **10 min** — tech lead faz perguntas
- **5 min** — combinam próximos passos

Pauta sugerida:
1. O que o experimento faz e por que importa
2. Quem usa hoje
3. Decisões técnicas críticas (mostrar `.learnings/`)
4. Gaps conhecidos
5. Roadmap esperado pelo negócio
6. Quem é o **owner de negócio** após o handoff

### Passo 4 — Transferir o repositório

Em geral, o handoff envolve:
1. Mover o repositório para a organização Git do time de dev
2. Conceder acesso ao tech lead
3. Manter você (negócio) como reviewer técnico opcional
4. Você passa a abrir **issues / RFCs** em vez de commitar direto

### Passo 5 — Acompanhamento

Você não some — você vira **product owner** do que era seu experimento.

Combine cadência (semanal, quinzenal) com o tech lead para acompanhar:
- Issues abertas
- Métricas de uso
- Próximos passos

## Anti-patterns no handoff

**Não faça:**

- 🚫 **Entregar e sumir** — o time de dev não conhece o problema de negócio como você
- 🚫 **Esconder problemas conhecidos** — eles vão aparecer no review e perde-se confiança
- 🚫 **Mudar tudo no último minuto** — passe o que está, não tente "melhorar uma última vez"
- 🚫 **Não documentar decisões** — `.learnings/` existe para isso, use
- 🚫 **Achar que o time vai usar sua stack se ela não é padrão** — eles vão reescrever; mais vale você ter usado o padrão desde o início

**Faça:**

- ✅ **Seja honesto sobre o que ficou ruim** — economiza tempo de descoberta
- ✅ **Documente o porquê de cada decisão crítica**
- ✅ **Use o stack recomendado pela Cernyn desde o experimento** (reduz retrabalho em 80%)
- ✅ **Mantenha contato com o time** após o handoff
- ✅ **Celebre o handoff** — é o sinal de que algo deu certo

## Comunicação com o time de dev

Times de dev recebem dezenas de handoffs. Para o seu se destacar e ser priorizado:

### Mensagem padrão para abertura

```
Olá [tech lead],

Estou preparando o handoff do experimento [nome].

📋 Resumo: [1 frase do que faz]
👥 Quem usa hoje: [stakeholders]
📈 Valor entregue: [métrica ou caso concreto]
🎯 O que precisamos do time: [hardening / produção / só code review]

Documentação completa: [link do repo]
HANDOFF.md gerado: [link]

Posso agendar 30min para alinharmos?

Abs,
[seu nome]
```

### Não fazer:

- "Tem um problema urgente, preciso disso em produção amanhã"
- "Olha esse código que fiz, dá uma olhada?" (sem contexto)
- "Já está pronto, só precisa publicar"

## Suporte

- Dúvidas sobre o processo: time de Engenharia de Plataforma da sua empresa
- Dúvidas técnicas sobre o scaffold: este repositório
- Caso especial (handoff complexo, urgência real): converse com seu superintendente
