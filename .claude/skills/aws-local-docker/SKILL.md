---
name: aws-local-docker
description: Como simular serviços AWS localmente com Docker (LocalStack, DynamoDB Local, Redis, PostgreSQL, Ollama) sem precisar de conta AWS. Use quando o usuário quiser rodar/testar AWS na própria máquina, montar docker-compose para o experimento, ou perguntar como usar DynamoDB/S3/Lambda/Redis/Postgres local.
---

# Simular AWS local com Docker

O público é **executivo não-dev que normalmente NÃO tem conta AWS**. Antes de sugerir qualquer serviço AWS real, ofereça o caminho **local com Docker** — é grátis, rápido e não exige conta. Esta é a aplicação da regra do CLAUDE.md: *sempre mostre os dois caminhos (local × AWS real) lado a lado*.

> Referência completa, com exemplos de código em Node, Python e .NET e solução de problemas: [docs/docker-localstack.md](../../../docs/docker-localstack.md). Esta skill traz só o essencial operacional.

## Pré-requisito
Docker Desktop (Windows/macOS) ou Docker Engine (Linux). No Windows, WSL 2 habilitado. O scaffold já traz `docker/docker-compose.example.yml`.

## Serviço AWS → container local

| Serviço AWS | Container local | Porta |
|---|---|---|
| Lambda, API Gateway, S3, SNS, SQS, EventBridge, Kinesis | **LocalStack** | 4566 |
| DynamoDB | **DynamoDB Local** | 8000 |
| RDS PostgreSQL | **PostgreSQL** | 5432 |
| ElastiCache Redis | **Redis** | 6379 |
| Bedrock (só para POC) | **Ollama** | 11434 |
| S3 (alternativa) | **MinIO** | 9000 / 9001 |

## Comandos essenciais (qualquer shell)

```bash
# subir tudo
docker compose -f docker/docker-compose.example.yml up -d
# ver status
docker compose -f docker/docker-compose.example.yml ps
# parar
docker compose -f docker/docker-compose.example.yml down
```

## Gotchas que sempre valem
- **Credenciais fake são obrigatórias:** LocalStack/DynamoDB Local aceitam qualquer credencial, mas você precisa **passá-las** (`accessKeyId: "fake"`, `secretAccessKey: "fake"`). Sem isso, dá erro "credentials not configured".
- **No código, só muda o `endpoint`:** apontar o SDK para `http://localhost:PORTA` (ex: DynamoDB → `8000`, LocalStack → `4566`). O mesmo código roda contra AWS real depois — é só remover o endpoint (princípio 12-Factor: backing services plugáveis).
- **S3 no LocalStack:** use `forcePathStyle: true` no cliente.
- **Bedrock não tem simulador oficial:** Ollama é só para POC. **Troque para Bedrock antes do handoff** (`/bedrock-poc` ajuda). Nunca OpenAI/Gemini.

## Quando ir para AWS real
Mais de ~5 usuários reais, integração com sistemas da empresa (que estão em AWS), necessidade de SLA, ou preparação para `/preparar-handoff`. Aí o usuário pede uma conta sandbox à Engenharia de Plataforma. Para desenhar a arquitetura AWS do caso, acione o subagent `arquiteto-aws`.

---

_Skill do scaffold [Cernyn](https://cernyn.com/) — Consultoria Biônica de Engenharia Digital._
