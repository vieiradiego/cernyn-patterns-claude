# .learnings — Memória viva do projeto

Esta pasta é o **caderno de bordo** do projeto. Tudo que o Claude e você descobrirem durante o experimento — decisões tomadas, gotchas, padrões que funcionaram, becos sem saída — é registrado aqui.

## Por que isso existe?

Em projetos de experimentação não-dev acontecem três problemas:

1. **A pessoa esquece** o porquê de uma decisão técnica feita há duas semanas.
2. **O Claude perde contexto** entre sessões e propõe a mesma solução que já foi descartada.
3. **O time de dev recebe o experimento** sem entender o raciocínio por trás das escolhas.

`.learnings/` resolve os três: viaja junto com o projeto (no Git), é lida pelo Claude no início de cada sessão, e vira documentação automática no handoff.

## Como funciona

- **`memory.md`** é o índice. Listagem curta de uma linha por aprendizado.
- Cada aprendizado é um arquivo `.md` separado nesta pasta, com frontmatter.
- O Claude lê `memory.md` no início de cada sessão e abre os arquivos relevantes conforme o tópico.

## Como adicionar um aprendizado

### Via slash command (recomendado)

Dentro do Claude Code, rode:

```
/aprender
```

O comando pergunta o tipo, título e contexto, e cria o arquivo + atualiza o índice automaticamente.

### Manualmente

1. Crie um arquivo `nome-curto-kebab-case.md` nesta pasta com o frontmatter abaixo.
2. Adicione uma linha em `memory.md` apontando para o arquivo.

### Formato do arquivo de aprendizado

```markdown
---
name: nome-curto-kebab-case
description: Uma frase curta dizendo do que se trata
metadata:
  type: decisao | gotcha | padrao | descarte
  data: 2026-05-23
---

## Contexto
O que estávamos tentando fazer.

## O que aprendemos
A descoberta, decisão ou erro evitado.

## Por que importa
Quando isto se aplica no futuro.

## Referências
- [arquivo:linha](caminho/arquivo.md#L42)
- Link externo, PR, etc.
```

## Tipos de aprendizado

| Tipo | Quando usar |
|---|---|
| `decisao` | Escolhemos X em vez de Y, e o porquê |
| `gotcha` | Algo deu errado de forma não-óbvia, e como contornamos |
| `padrao` | Uma abordagem que funcionou bem e queremos repetir |
| `descarte` | Tentamos X e não funcionou — para não tentar de novo |

## Regras de ouro

- **Curto é melhor que detalhado.** Se o aprendizado precisa de mais de uma tela, divida em vários.
- **Sempre o porquê.** "Usamos Redis" é fraco. "Usamos Redis porque DynamoDB TTL não atende para sessões < 1min" é forte.
- **Não duplique.** Se já existe um aprendizado parecido, atualize em vez de criar novo.
- **Não use para documentação geral.** Para isso existe a pasta `docs/`. `.learnings/` é insights pontuais.

---

_O Claude consulta esta pasta automaticamente. Você quase nunca precisa pedir._
