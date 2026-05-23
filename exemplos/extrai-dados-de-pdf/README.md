# Exemplo: Extração de dados de PDFs

> **Arquétipo:** E — POC com IA generativa (Bedrock multimodal)  
> **Stack:** Python + Amazon Bedrock (Claude multimodal)  
> **Tempo estimado:** 1 sprint para POC funcional  
> **Status:** Esqueleto de exemplo — adapte ao seu caso

## Cenário

Você recebe dezenas de PDFs por semana (contratos, notas fiscais, propostas, formulários) e precisa extrair campos específicos para uma planilha ou banco de dados. Hoje alguém faz isso manualmente.

## O que este exemplo faz

Script Python que:

1. Lê PDFs de uma pasta
2. Para cada PDF, converte páginas em imagens
3. Envia ao Claude multimodal (via Bedrock) com schema do que extrair
4. Recebe JSON estruturado
5. Consolida em CSV/Excel ou grava em banco

## Quando usar Python em vez de Node?

Cernyn recomenda Node como direção corporativa, mas para este caso Python tem vantagens claras:
- Bibliotecas maduras de manipulação de PDF (`pypdf`, `pdf2image`)
- Pandas para o tratamento dos dados extraídos
- Ecossistema de visualização (matplotlib, seaborn)

É uma exceção justificada — registre em `.LEARNINGS/` como `decisao`.

## Estrutura

```
extrai-dados-de-pdf/
├── README.md
├── pyproject.toml                  # uv ou poetry
├── .env.example
├── src/
│   ├── __init__.py
│   ├── extrator.py                 # Lógica principal
│   ├── bedrock_client.py           # Wrapper boto3
│   ├── pdf_para_imagem.py          # PDF → PNG
│   └── schemas.py                  # Pydantic models do output
├── prompts/
│   └── extracao-contrato.md        # Prompt por tipo de doc
├── notebooks/
│   └── exploracao.ipynb            # Para iterar interativamente
├── pdfs-entrada/                   # gitignored
└── saida/                          # gitignored
```

## Pontos-chave

### Multimodal: imagem + instrução
Claude multimodal aceita imagens. Para PDFs:
1. Convertemos cada página em PNG
2. Enviamos a imagem + prompt: "extraia estes campos: data, partes, valor, prazo..."
3. Recebemos JSON

Funciona melhor que OCR + LLM em texto para layouts complexos.

### Schema com Pydantic
Define o que esperar e valida automaticamente:
```python
class DadosContrato(BaseModel):
    data_assinatura: date
    partes: list[str]
    valor_total_brl: Decimal
    prazo_meses: int
```

### Notebook para iterar
`notebooks/exploracao.ipynb` é onde você testa prompts antes de levar pro script. Mantenha o "código de produção" em `src/`, o notebook só pra explorar.

## Como começar

1. Copie:
   ```bash
   cp -r exemplos/extrai-dados-de-pdf/ ../meu-extrator
   cd ../meu-extrator
   ```

2. Instale (com `uv` — funciona igual em qualquer SO):
   ```bash
   uv sync
   ```

   Ou com `pip` + venv — neste caso a forma de ativar muda por SO:

   ```bash
   python -m venv .venv
   ```

   **Windows (PowerShell):**
   ```powershell
   .venv\Scripts\Activate.ps1
   pip install -e .
   ```

   **macOS / Linux (bash/zsh):**
   ```bash
   source .venv/bin/activate
   pip install -e .
   ```

3. Coloque PDFs de teste em `pdfs-entrada/` (use PDFs públicos ou sintéticos — não dados reais)

4. Rode:
   ```bash
   python -m src.extrator --tipo contrato --entrada pdfs-entrada/
   ```

## Próximos passos sugeridos

- [ ] Adaptar `schemas.py` para os campos que você precisa extrair
- [ ] Ajustar `prompts/extracao-*.md` para o seu tipo de documento
- [ ] Testar com 10-20 PDFs reais (sanitizados de dados sensíveis)
- [ ] Validar precisão: a IA acerta? Em quais casos erra?
- [ ] Estimar custo: tokens por PDF × volume mensal
- [ ] Se validar, rodar `/preparar-handoff` para o time de dev industrializar

## Por que esse exemplo é Cernyn-style

- ✅ **Amazon Bedrock** (Claude multimodal) — não OpenAI Vision
- ✅ Python pela razão certa (manipulação de PDF), registrado como decisão
- ✅ Schema validado com Pydantic
- ✅ Prompts versionados em arquivo
- ✅ Notebook só para exploração, código de produção em `src/`
- ✅ Dados sensíveis fora do repo

---

_Exemplo do scaffold [Cernyn](https://cernyn.com/). Tem um caso de extração específico em mente? Podemos te ajudar a calibrar: pinus@cernyn.com_
