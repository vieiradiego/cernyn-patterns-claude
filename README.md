# Padrão Claude Code — por Cernyn

[![Versão](https://img.shields.io/badge/versão-0.1.0-blue.svg)](./CHANGELOG.md)
[![Claude Code](https://img.shields.io/badge/Claude%20Code-compatível-7C3AED.svg)](https://docs.claude.com/claude-code)
[![Node.js](https://img.shields.io/badge/Node.js-≥20-43853d.svg)](https://nodejs.org/)
[![Plataforma](https://img.shields.io/badge/plataforma-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey.svg)](./docs/pre-requisitos.md)
[![PT-BR](https://img.shields.io/badge/idioma-PT--BR-009C3B.svg)](#)
[![Cernyn](https://img.shields.io/badge/by-Cernyn-FF6B35.svg)](https://cernyn.com/)

> Scaffold de boas práticas para iniciar experimentos com Claude Code, criado e mantido pela **Cernyn — consultoria de IA** ([cernyn.com](https://cernyn.com/)).

## Para quem é isto?

Executivos (diretores, superintendentes, líderes de área) que querem **prototipar ideias, automatizar tarefas e validar hipóteses** com Claude Code, sem precisar virar desenvolvedor — e sem cair em armadilhas de tecnologia ruim que vão atrasar a internalização do projeto pelo time de dev da sua empresa.

A Cernyn é uma consultoria de IA. Este scaffold é o que recomendamos aos executivos que apoiamos para que seus experimentos:

1. Nasçam alinhados com as práticas de engenharia que o mercado corporativo adota
2. Sejam revisados continuamente por especialistas (revisores IA embutidos)
3. Sejam facilmente internalizáveis pelo time de dev da empresa quando amadurecerem

---

## Por que usar este scaffold?

Quando você começa um experimento com Claude Code do zero, sem padrão, três coisas costumam dar errado:

1. **Tecnologia fora do padrão corporativo** — você escolhe uma stack que o time de dev da sua empresa não usa, e na hora de internalizar o projeto vira reescrita.
2. **Sem caminho claro para AWS** — você prototipa local, e quando precisa subir, ninguém sabe por onde começar.
3. **Sem revisão técnica** — o código funciona mas tem riscos (segurança, performance) que só aparecem em produção.

Este scaffold resolve isso vindo **pré-configurado** com:

- ✅ `CLAUDE.md` ensinando o Claude o **direcionamento Node + Next.js** (recomendação Cernyn) com suporte a legado .NET/Angular
- ✅ **7 revisores especializados** (subagents) que revisam seu código didaticamente em PT-BR
- ✅ **6 comandos prontos** (setup inicial, novo experimento, explorar AWS, preparar handoff, POC com Bedrock, registrar aprendizados)
- ✅ **Docker Compose** para simular AWS local — você nem precisa de conta AWS
- ✅ Aderência aos padrões corporativos do mercado: **Terraform** (IaC), **SonarQube** (qualidade), **Veracode** (segurança), **DataDog** (observabilidade)
- ✅ Conversão direta para internalização pelo time de dev da sua empresa quando o experimento amadurecer

---

## Como usar

### 1. Clone este repositório

Comandos universais (funcionam em qualquer terminal — PowerShell, Terminal do macOS, bash/zsh do Linux):

```bash
git clone <url-deste-repositorio> meu-experimento
cd meu-experimento
```

Para começar com histórico Git limpo (escolha conforme seu sistema):

**Windows (PowerShell):**
```powershell
Remove-Item -Recurse -Force .git
git init
```

**macOS / Linux (bash/zsh):**
```bash
rm -rf .git
git init
```

### 2. Abra com Claude Code e rode o setup guiado

```powershell
claude
```

Dentro do Claude, rode:

```
/setup-inicial
```

Ele vai:
- Verificar pré-requisitos (Git, Node, Docker, etc.)
- Personalizar o `CLAUDE.md` com seu nome e área
- Inicializar o Git
- (Opcional) Subir os serviços Docker locais

### 3. Comece pelo comando guiado

```
/novo-experimento
```

Ele vai fazer perguntas e montar a estrutura do seu primeiro experimento.

---

## Estrutura do scaffold

```
.
├── CLAUDE.md                          # 🧠 Cérebro: ensina o Claude o padrão Cernyn
├── README.md                          # 📖 Este arquivo
├── ABOUT-CERNYN.md                    # 🏢 Apresentação da Cernyn
├── CHANGELOG.md                       # 📋 Histórico de versões do scaffold
├── .gitignore                         # 🚫 Arquivos não versionados
├── .claude/
│   ├── settings.json                  # ⚙️ Permissões, modelo, hooks
│   ├── commands/                      # ⚡ 6 comandos prontos (/setup-inicial, etc.)
│   ├── agents/                        # 🤖 7 revisores especializados
│   └── hooks/                         # 🪝 4 hooks Node.js cross-platform
├── .LEARNINGS/                        # 📒 Memória viva: decisões, gotchas, padrões
│   ├── MEMORY.md                      #    Índice dos aprendizados
│   └── README.md                      #    Como usar
├── docs/
│   ├── pre-requisitos.md              # ✅ O que instalar antes de começar
│   ├── padroes-cernyn.md              # 📐 Convenções recomendadas pela Cernyn
│   ├── stack-cernyn.md                # 🏢 Node + Next.js (direção) e legado .NET/Angular
│   ├── docker-localstack.md           # 🐳 Como simular AWS local
│   ├── handoff-para-dev.md            # 🤝 Como entregar para o time de dev da sua empresa
│   ├── decisoes.md                    # 📝 Registre aqui suas decisões técnicas
│   ├── principios-clean-code.md       # ✨ Clean Code aplicado
│   ├── principios-12-factor.md        # 🏗️ 12-Factor App aplicado
│   └── glossario.md                   # 📚 Termos do ambiente
├── docker/
│   └── docker-compose.example.yml     # 🐳 LocalStack + DynamoDB + Redis + Postgres
└── exemplos/                          # 💡 Pontos de partida prontos
    ├── README.md
    ├── automatiza-relatorio-mensal/   # Excel → Markdown/PDF (Node)
    ├── classificador-de-leads/        # IA classifica leads (Node + Bedrock)
    └── extrai-dados-de-pdf/           # IA extrai campos de PDFs (Python + Bedrock)
```

---

## Comandos disponíveis

| Comando | O que faz |
|---|---|
| `/setup-inicial` | Setup guiado para a primeira vez — verifica pré-requisitos, personaliza CLAUDE.md, inicializa Git |
| `/novo-experimento` | Inicia um experimento do zero — faz perguntas e monta a estrutura |
| `/aws-explorar` | Explora recursos AWS read-only (precisa de conta e credenciais) |
| `/preparar-handoff` | Empacota seu experimento para o time de dev da sua empresa internalizar |
| `/bedrock-poc` | Esqueleto de POC usando LLM via Amazon Bedrock |
| `/aprender` | Registra uma decisão, gotcha ou padrão em `.LEARNINGS/` |

---

## Revisores (subagents)

Peça ao Claude para usar um revisor sempre que escrever ou alterar código. Exemplo:

> "Use o revisor-node para revisar o handler que acabamos de criar"

| Revisor | Especialidade |
|---|---|
| `revisor-node` | Node.js / TypeScript (direção recomendada) |
| `revisor-dotnet` | C# / .NET (legado) |
| `revisor-angular` | Angular (legado, em descontinuação) |
| `revisor-python` | Python (dados, automação, notebooks) |
| `revisor-github` | Convenções Git, PRs, GitHub Actions |
| `revisor-seguranca` | Credenciais, dados sensíveis, exposição |
| `arquiteto-aws` | Escolha de serviços AWS para um caso de uso |

Todos respondem em **português**, explicam o porquê, e mostram o código corrigido.

---

## Dúvidas frequentes

**P: Eu preciso ser da Cernyn para usar isto?**
R: Não. Cernyn é uma consultoria de IA e este scaffold é um conjunto público de boas práticas. Qualquer executivo, de qualquer empresa, pode clonar e usar.

**P: Preciso de conta AWS para usar isto?**
R: Não. O scaffold vem com Docker Compose que simula AWS localmente. Conta AWS só é sugerida quando o experimento amadurece.

**P: Posso usar OpenAI ou ChatGPT dentro do código?**
R: A recomendação Cernyn é **Amazon Bedrock** — por questões de governança de dados (dados não saem do perímetro AWS da sua empresa). O comando `/bedrock-poc` te ajuda a começar.

**P: Devo usar Node ou .NET? E Angular ou Next.js?**
R: Para **experimentos novos**, a recomendação Cernyn é **Node (TypeScript) + Next.js**. .NET é mantido para legado, Angular está em descontinuação no mercado corporativo. Se você herdou algo em .NET/Angular para manter, sem problema — os revisores `revisor-dotnet` e `revisor-angular` continuam ajudando.

**P: O Claude vai bloquear comandos perigosos?**
R: Não. Este scaffold **não tem guardrails de bloqueio**. Ele te direciona, mas você decide. Confiamos no seu julgamento — e contamos com o `revisor-seguranca` para flag de risco.

**P: Como entrego o experimento para o time de dev da minha empresa?**
R: Rode `/preparar-handoff` — ele gera um README de entrega completo. Veja também `docs/handoff-para-dev.md`.

**P: Preciso rodar SonarQube e Veracode no experimento?**
R: Não obrigatório durante a experimentação. Mas o scaffold já está configurado para passar nesses gates — se você seguir as sugestões dos revisores, vai entrar limpo quando o time de dev rodar antes de produção.

---

## Sobre a Cernyn

A **Cernyn** é uma consultoria de IA. Nosso trabalho é apoiar executivos a transformar ideias em produtos com IA de forma estruturada e responsável.

Saiba mais em [ABOUT-CERNYN.md](./ABOUT-CERNYN.md) ou no [site oficial](https://cernyn.com/).

---

## 💼 Quer apoio especializado?

Se o seu experimento amadureceu e você quer:

- ✅ Acelerar o handoff para produção com qualidade
- ✅ Validar a estratégia de IA antes de investir
- ✅ Capacitar seu time interno para autonomia em IA
- ✅ Implementar governança (custos, segurança, compliance) desde o dia 1

**[Fale com a Cernyn →](https://cernyn.com/)**

Atendemos executivos e empresas que querem resultados práticos com IA — não vitrine de tecnologia.

---

## Links úteis

- 🌐 Site Cernyn: https://cernyn.com/
- 📧 Contato: [pinus@cernyn.com](mailto:pinus@cernyn.com)
- 📖 Documentação Claude Code: https://docs.claude.com/claude-code
- 📋 Histórico de versões: [CHANGELOG.md](./CHANGELOG.md)
- 🏢 Sobre a Cernyn: [ABOUT-CERNYN.md](./ABOUT-CERNYN.md)
- 🐛 Reportar bug ou sugestão neste scaffold: abrir issue no repositório

---

<sub>_Made with care by [Cernyn](https://cernyn.com/) — consultoria de IA. Este scaffold é gratuito e aberto para a comunidade._</sub>
