# Exemplo: Classificador de leads com IA

> **Arquétipo:** E — POC com IA generativa (Bedrock)  
> **Stack:** Node.js (TypeScript) + Amazon Bedrock (Claude)  
> **Tempo estimado:** 1-2 sprints para POC validada  
> **Status:** Esqueleto de exemplo — adapte ao seu caso

## Cenário

Sua área de Comercial/Marketing recebe 200+ leads por semana via formulário web. Hoje alguém (analista) lê um por um e classifica em:
- 🔥 Quente (vendedor ligar nas próximas 24h)
- 🟡 Médio (sequência de e-mails automatizada)
- 🧊 Frio (newsletter mensal)

Você quer que IA faça isso, com explicação do porquê.

## O que este exemplo faz

Script que:

1. Lê leads de um CSV (ou via API REST)
2. Para cada lead, chama Claude no Bedrock com prompt estruturado
3. Recebe classificação + justificativa estruturada (JSON)
4. Salva resultado em CSV de saída
5. Gera relatório com métricas (% por classificação, custo total)

## Estrutura

```
classificador-de-leads/
├── README.md
├── package.json
├── tsconfig.json
├── .env.example                    # AWS_REGION, BEDROCK_MODEL_ID
├── src/
│   ├── index.ts
│   ├── bedrock-client.ts           # Wrapper de @aws-sdk/client-bedrock-runtime
│   ├── classificador.ts            # Lógica + prompt
│   ├── prompts/
│   │   └── classificar-lead.md     # Prompt versionado em arquivo
│   └── tipos.ts                    # Schemas Zod
├── dados/                          # gitignored — CSVs de entrada/saída
└── prompts-historico/              # Versões do prompt (aprendizado)
```

## Pontos-chave deste exemplo

### Prompt em arquivo separado
O prompt vive em `prompts/classificar-lead.md`, não hardcoded no código. Vantagens:
- Você (executivo) consegue editar sem mexer no código
- Versões antigas ficam em `prompts-historico/`
- Fica registrado no Git — todo ajuste tem rastreabilidade

### Saída estruturada (JSON)
Pedimos ao Claude para retornar JSON com schema fixo (validamos com Zod):
```json
{
  "classificacao": "quente | medio | frio",
  "confianca": 0.85,
  "justificativa": "Cliente mencionou orçamento e prazo definido...",
  "proximaAcao": "Ligar nas próximas 24h"
}
```

### Métricas de custo
A cada execução, calculamos:
- Tokens consumidos
- Custo estimado (USD)
- Custo médio por lead

Isto importa porque IA generativa não é grátis — em produção, você precisa monitorar.

### Sem dados reais no repo
A pasta `dados/` está no `.gitignore`. Inclua apenas dados **sintéticos** se quiser commitar exemplo de entrada.

## Como começar

1. Copie a pasta:
   ```bash
   cp -r exemplos/classificador-de-leads/ ../meu-classificador
   cd ../meu-classificador
   ```

2. Configure:
   ```bash
   cp .env.example .env
   # Configure AWS_REGION e habilite o modelo no Bedrock
   ```

3. Habilite o modelo no Bedrock (uma vez por conta AWS):
   ```bash
   # Console AWS → Bedrock → Model access → Request access
   # Modelo recomendado: anthropic.claude-sonnet-4-6
   ```

4. Instale e rode:
   ```bash
   npm install
   npm run dev -- --entrada dados/leads-exemplo.csv
   ```

## Próximos passos sugeridos

- [ ] Substituir os critérios de classificação no prompt pelos da sua área
- [ ] Validar com 20-50 leads reais sanitizados (compare a IA com o analista humano)
- [ ] Ajustar o prompt até atingir > 85% de concordância com o humano
- [ ] Calcular ROI: custo da IA vs. tempo do analista economizado
- [ ] Se validar, rodar `/preparar-handoff` para industrializar

## Por que esse exemplo é Cernyn-style

- ✅ **Amazon Bedrock**, não OpenAI/Gemini (governança de dados)
- ✅ Node.js + TypeScript (direção corporativa)
- ✅ Prompt versionado em arquivo (não hardcoded)
- ✅ Saída estruturada com validação (Zod)
- ✅ Métricas de custo desde o dia 1
- ✅ Dados sensíveis fora do repo

---

_Exemplo do scaffold [Cernyn](https://cernyn.com/). Quer ajuda para calibrar um classificador para o seu caso específico? Fale com a gente: pinus@cernyn.com_
