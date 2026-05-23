# Exemplo: Automatiza relatório mensal

> **Arquétipo:** B — Automação de processo  
> **Stack:** Node.js (TypeScript)  
> **Tempo estimado:** 1 sprint para POC funcional  
> **Status:** Esqueleto de exemplo — adapte ao seu caso

## Cenário

Você é um executivo que gasta 4 horas todo final de mês compilando um relatório:
- Baixa planilhas Excel de várias fontes
- Cola dados em um template
- Gera gráficos
- Exporta como PDF e envia por e-mail

Quer automatizar isso para gastar 15 minutos em vez de 4 horas.

## O que este exemplo faz

Script Node.js que:

1. Lê arquivos `.xlsx` de uma pasta de entrada
2. Consolida em um único dataset
3. Aplica regras de negócio (configuráveis em JSON)
4. Gera relatório em Markdown e PDF
5. (Opcional) Envia por e-mail via SES

## Estrutura

```
automatiza-relatorio-mensal/
├── README.md                       # Este arquivo
├── package.json
├── tsconfig.json
├── .env.example
├── src/
│   ├── index.ts                    # Entry point
│   ├── leitor-excel.ts             # Lê .xlsx
│   ├── consolidador.ts             # Agrega os dados
│   ├── gerador-relatorio.ts        # Markdown + PDF
│   └── enviador-email.ts           # (opcional) SES/SMTP
├── templates/
│   └── relatorio.md.hbs            # Template Handlebars
├── entrada/                        # gitignored — coloque planilhas aqui
└── saida/                          # gitignored — relatórios gerados
```

## Como começar a partir deste exemplo

1. Copie esta pasta para um novo experimento:
   ```bash
   cp -r exemplos/automatiza-relatorio-mensal/ ../meu-relatorio
   cd ../meu-relatorio
   ```

2. Instale dependências:
   ```bash
   npm install
   ```

3. Configure variáveis:
   ```bash
   cp .env.example .env
   # edite .env com seus valores
   ```

4. Rode:
   ```bash
   npm run dev
   ```

## Próximos passos sugeridos

- [ ] Substituir as regras de negócio em `consolidador.ts` pelas suas
- [ ] Customizar o template em `templates/relatorio.md.hbs`
- [ ] Testar com 1-2 meses de dados reais
- [ ] Quando funcionar bem, agendar via Task Scheduler (Windows) ou cron (Linux/Mac)
- [ ] Rodar `/preparar-handoff` para entregar ao time de dev industrializar

## Por que esse exemplo é Cernyn-style

- ✅ Node.js + TypeScript (direção corporativa)
- ✅ Configuração por arquivo (12-Factor #3)
- ✅ Logs estruturados em JSON (DataDog-ready)
- ✅ Sem dados sensíveis no repo (pastas `entrada/` e `saida/` no `.gitignore`)
- ✅ Fácil de portar para Lambda + S3 quando amadurecer

---

_Exemplo do scaffold [Cernyn](https://cernyn.com/). Precisa ajuda para adaptar este caso à sua realidade? Fale com a gente: pinus@cernyn.com_
