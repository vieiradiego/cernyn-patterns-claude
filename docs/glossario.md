# Glossário — termos do scaffold

Termos técnicos e jargões corporativos que aparecem no scaffold, explicados em linguagem simples.

## Termos técnicos do Claude Code

| Termo | O que é |
|---|---|
| **CLAUDE.md** | Arquivo na raiz do projeto que ensina ao Claude o contexto: quem você é, qual o stack, regras do projeto. É carregado em toda conversa. |
| **Slash command** | Comando que você digita começando com `/`, ex: `/novo-experimento`. Executa um fluxo pré-programado. **Você** dispara. |
| **Skill** | Pacote de conhecimento/procedimento em `.claude/skills/`. O **Claude carrega sozinho** quando a tarefa casa com a descrição da skill (ex: padrões de código ao escrever código). Diferente do slash command, que você dispara digitando `/`. |
| **Subagent** | Um "Claude especializado" para uma tarefa (ex: revisor de código). Você invoca pelo nome (ex: "use o revisor-node"). |
| **Hook** | Script que roda automaticamente em eventos do Claude (ex: depois de cada edição, antes de cada push). |
| **.learnings/** | Pasta de "memória viva" do projeto — registra decisões, gotchas e padrões aprendidos. Viaja no Git com o projeto. |
| **Tool** | Capacidade do Claude para interagir com seu ambiente (Read, Write, Edit, Bash, etc.). |
| **MCP / `.mcp.json`** | "Tomada" que conecta o Claude a ferramentas e dados externos (documentação atualizada, navegador, GitHub). Configurado em `.mcp.json` na raiz. Não troca o modelo de IA — continua Bedrock/Claude. Veja [mcp-servers.md](mcp-servers.md). |

## Termos de stack/desenvolvimento

| Termo | O que é |
|---|---|
| **Stack** | Conjunto de tecnologias usadas em um projeto (linguagem, framework, banco, cloud). |
| **Boilerplate** | Código repetitivo que precisa estar lá mesmo quando não faz nada interessante (ex: `package.json`, `tsconfig.json`). |
| **POC / Prova de conceito** | Versão mínima que prova que uma ideia funciona — não é para produção. |
| **MVP / Produto mínimo viável** | Versão um nível acima da POC — já dá para usar de verdade, mas falta polimento. |
| **Hardening** | Trabalho de tornar um sistema robusto para produção (segurança, performance, observabilidade). |
| **Handoff** | Entrega formal de um projeto ao próximo time (do experimento para o time de dev). |
| **Quality Gate** | Conjunto de critérios automatizados que o código precisa passar antes de ir para produção. |
| **PR / Pull Request** | Pedido para mesclar suas mudanças no código principal — passa por review antes. |
| **CI/CD** | Pipeline automatizado que constrói, testa e publica seu código a cada mudança. |

## Termos AWS

| Termo | O que é |
|---|---|
| **Lambda** | Função serverless. Você só paga quando ela roda. Limite: 15min por execução. |
| **API Gateway** | Porta de entrada para suas APIs — recebe requisições e roteia para Lambda/ECS. |
| **DynamoDB** | Banco NoSQL gerenciado pela AWS. Rápido, escala automaticamente, não faz JOIN. |
| **S3** | Armazenamento de arquivos da AWS. Bucket = pasta, object = arquivo. |
| **CloudFront** | CDN da AWS — distribui seus arquivos pelo mundo com cache. Coloque na frente de S3 e API Gateway. |
| **ECS Fargate** | Containers gerenciados — você roda Docker sem se preocupar com servidor. |
| **RDS** | Banco SQL gerenciado (PostgreSQL, MySQL). |
| **Bedrock** | Serviço de LLM gerenciado pela AWS. Hospeda Claude, Titan, Cohere, etc. |
| **IAM** | Sistema de permissões da AWS — define quem pode fazer o quê. |
| **Cognito** | Serviço de autenticação gerenciado. |
| **CloudWatch** | Serviço de logs e métricas da AWS — coleta automaticamente o output dos serviços. |
| **VPC** | "Rede privada" virtual dentro da AWS — isola recursos. |
| **OAC / Origin Access Control** | Mecanismo que permite só o CloudFront acessar um bucket S3 privado. |
| **WAF** | Firewall de aplicação web — bloqueia ataques comuns (SQL injection, XSS). |
| **ACM** | AWS Certificate Manager — gera certificados HTTPS gratuitos. |

## Termos de qualidade & segurança

| Termo | O que é |
|---|---|
| **SonarQube** | Ferramenta que analisa código e aponta bugs, vulnerabilidades e code smells. |
| **Veracode** | Ferramenta de análise de segurança (SAST/SCA). Procura vulnerabilidades conhecidas no código. |
| **SAST** | Static Application Security Testing — análise de segurança no código (não em execução). |
| **DAST** | Dynamic Application Security Testing — análise de segurança em runtime. |
| **SCA** | Software Composition Analysis — análise das dependências (bibliotecas) que você usa. |
| **CWE** | Common Weakness Enumeration — catálogo padrão de vulnerabilidades (CWE-89 = SQL injection, etc.). |
| **CVE** | Common Vulnerabilities and Exposures — vulnerabilidade específica conhecida. |
| **Code smell** | Cheiro de código ruim — não é bug, mas indica problema de design. |
| **Complexidade ciclomática** | Métrica que mede quantos caminhos a função tem (ifs, loops). Alto = complexo demais. |
| **Coverage** | Percentual do código que tem testes cobrindo. 70%+ é o mínimo. |

## Termos de DevOps & infra

| Termo | O que é |
|---|---|
| **IaC / Infra as Code** | Infraestrutura definida em código (Terraform), versionada no Git. |
| **Terraform** | Ferramenta de IaC usada pela Cernyn. Você descreve o que quer; ele provisiona. |
| **Docker** | Containerização — empacota app + dependências em uma imagem que roda igual em qualquer lugar. |
| **docker-compose** | Orquestrador local de múltiplos containers (ex: app + banco + Redis). |
| **LocalStack** | Container que simula serviços AWS localmente. |
| **GitHub Actions** | CI/CD nativo do GitHub. Você descreve workflows em YAML. |
| **DataDog** | Plataforma de observabilidade (logs, métricas, traces) usada pela Cernyn. |
| **APM** | Application Performance Monitoring — monitoramento de performance da aplicação. |
| **RUM** | Real User Monitoring — monitoramento da experiência do usuário no browser. |
| **Trace** | Registro de uma requisição percorrendo vários serviços — diagnóstica latência ponta a ponta. |

## Termos de arquitetura & metodologia

| Termo | O que é |
|---|---|
| **12-Factor App** | Conjunto de 12 princípios para construir apps que rodam bem em cloud. Detalhes em `principios-12-factor.md`. |
| **Clean Code** | Conjunto de práticas para código legível e manutenível. Detalhes em `principios-clean-code.md`. |
| **SOLID** | Princípios de design orientado a objetos (S=single responsibility, etc.). |
| **DRY** | Don't Repeat Yourself — não duplique código. (Mas com moderação!) |
| **YAGNI** | You Aren't Gonna Need It — não construa o que ainda não precisa. |
| **DDD** | Domain-Driven Design — modelar software espelhando o negócio. |
| **CQRS** | Command Query Responsibility Segregation — separar leitura de escrita. |
| **Conventional Commits** | Padrão de mensagens de commit: `feat:`, `fix:`, `chore:`, etc. |

## Termos de dados & PII

| Termo | O que é |
|---|---|
| **PII** | Personal Identifiable Information — qualquer dado que identifica uma pessoa (CPF, nome, e-mail). |
| **LGPD** | Lei Geral de Proteção de Dados (Brasil) — regula como dados pessoais podem ser tratados. |
| **GDPR** | General Data Protection Regulation (Europa) — equivalente europeu da LGPD. |
| **Sanitização** | Remover ou mascarar dados sensíveis de uma amostra (ex: trocar CPFs reais por fictícios). |
| **Dados sintéticos** | Dados gerados artificialmente para teste — não vieram de pessoa real. |

---

Faltou algum termo? Sugira ao Claude registrar em `.learnings/` para a próxima versão deste glossário.
