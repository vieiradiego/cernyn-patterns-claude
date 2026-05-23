# Princípios de Clean Code — aplicados à Cernyn

Este documento resume os princípios de Clean Code (Robert Martin) **adaptados** para a realidade de experimentos não-dev na Cernyn. Não é um livro — é o **mínimo** que você precisa saber para que seu experimento seja internalizável pelo time de dev.

## 1. Nomes claros

Variáveis, funções, classes e arquivos devem **dizer o que são** sem precisar de comentário.

**Fraco:**
```typescript
const v = 100000;
const d = new Date();
function calc(x: number) { return x * 0.15; }
```

**Forte:**
```typescript
const valor_total_operacao_brl = 100_000;
const data_liquidacao = new Date();
function calcular_taxa_administracao(valor_aplicado_brl: number) {
  return valor_aplicado_brl * 0.15;
}
```

**Regra prática:** se você abrir o código daqui a 3 meses e não entender, o nome é ruim.

## 2. Funções pequenas

Uma função faz **uma coisa**. Se ela faz duas, separe.

**Sinais de função grande demais:**
- Mais de 30-50 linhas
- Mais de 3 níveis de indentação
- Faz "X **e** Y" no nome (`salvarEEnviar`)
- Você precisa rolar o editor para ler ela inteira

**Como quebrar:** identifique blocos lógicos, extraia em funções com nome próprio.

## 3. Sem números/strings mágicas

Qualquer literal sem contexto vira constante nomeada.

**Fraco:**
```python
if score > 750:
    aprovar()
elif score > 600:
    revisar_manual()
```

**Forte:**
```python
SCORE_MIN_APROVACAO_AUTOMATICA = 750
SCORE_MIN_REVISAO_MANUAL = 600

if score > SCORE_MIN_APROVACAO_AUTOMATICA:
    aprovar()
elif score > SCORE_MIN_REVISAO_MANUAL:
    revisar_manual()
```

## 4. Comentários só quando necessário

Comentário não substitui código ruim. Renomeie em vez de comentar.

**Ruim:**
```csharp
// Calcula a comissão considerando o desconto
var c = v * 0.10 - d;
```

**Bom:**
```csharp
var comissao = valorOperacao * TAXA_COMISSAO_PADRAO - desconto;
```

**Quando comentar:** explique o **porquê** quando não é óbvio. _"Usamos taxa fixa de 10% por exigência do contrato com a XPTO Ltda — ver doc/contrato-xpto.pdf"_

## 5. Tratamento de erro explícito

Erros não devem ser engolidos em silêncio.

**Ruim:**
```python
try:
    resultado = chamar_api()
except:
    pass  # vai dar tudo certo né
```

**Bom:**
```python
try:
    resultado = chamar_api()
except ApiTimeoutError as e:
    logger.warning("API timeout, usando cache local", exc_info=e)
    resultado = cache.get(chave)
except ApiAuthError:
    raise  # falha de auth precisa explodir
```

## 6. DRY com moderação

DRY = "Don't Repeat Yourself". Mas **abstração precoce é pior que duplicação**.

**Regra prática:** duplique 2x sem culpa. Na 3ª, considere extrair. Mas só extraia se as duplicações representam **a mesma ideia**, não só código parecido por acaso.

## 7. Princípio do menor espanto

Sua função deve fazer **exatamente** o que o nome sugere. Nem mais, nem menos.

**Surpresa ruim:**
```typescript
function getUserById(id: string) {
  const user = db.users.find(id);
  await sendEmail(user, 'Você foi consultado');  // SURPRESA!
  await logToAudit(user, 'queried');             // SURPRESA!
  return user;
}
```

Se a função se chama `getUserById`, ela só busca. Send email é outra função.

## 8. Princípio da responsabilidade única (SRP)

Uma classe/módulo tem **uma razão para mudar**.

- Classe `RelatorioPdfGenerator` muda quando o formato do PDF muda — OK
- Classe `RelatorioServico` que monta dados **e** gera PDF **e** envia por e-mail — muda por 3 razões — quebrar.

## 9. Princípio aberto/fechado (OCP)

Classes devem ser **abertas para extensão, fechadas para modificação**.

**Tradução prática:** quando você precisa adicionar um caso novo, prefira criar uma nova classe/função do que adicionar mais um `if/elif/elif` na função existente.

## 10. Não comprometa por preguiça

"Depois eu arrumo" é como o débito técnico nasce. Em experimento é OK, mas:
- Marque com `// TODO: motivo + dono` (não TODO órfão)
- Registre em `.LEARNINGS/` se a decisão tem implicação futura

---

## Checklist rápido (use antes de pedir review)

- [ ] Cada função/método tem um nome que descreve **exatamente** o que faz
- [ ] Nenhuma função passa de 50 linhas
- [ ] Nenhuma constante numérica/string mágica sem nome
- [ ] Erros tratados ou propagados explicitamente — nada de `catch` vazio
- [ ] Sem código duplicado óbvio (3+ ocorrências)
- [ ] Sem TODOs sem dono ou prazo
- [ ] Código se lê em ordem de leitura natural (importante → detalhe)

Os 7 revisores do scaffold já checam estes itens. Use-os antes do handoff.
