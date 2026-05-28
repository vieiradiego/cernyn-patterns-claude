# Docker + LocalStack — simulando AWS na sua máquina

A maioria dos experimentos do scaffold roda **localmente**, sem precisar de conta AWS. Este documento explica como usar Docker e LocalStack para simular os serviços AWS mais comuns.

> 🧩 Esta página é a **referência completa** (com exemplos de código em Node, Python e .NET). O Claude também tem a skill `aws-local-docker`, que carrega o essencial automaticamente quando você pede para rodar AWS local — você não precisa abrir este doc para ele agir.

## Por que rodar local?

- Você (diretor/superintendente) **provavelmente não tem conta AWS pessoal/sandbox**
- Experimentação fica mais rápida (sem latência de rede)
- Não gera custo
- Quando o experimento amadurece, o time de dev migra para AWS real

## Pré-requisitos

1. **Docker** instalado — Docker Desktop (Windows, macOS, Linux) ou Docker Engine (Linux). Veja [docs/pre-requisitos.md](pre-requisitos.md#docker-desktop).
2. No Windows: **WSL 2** habilitado (Docker Desktop pede no instalador)
3. Pelo menos 8GB de RAM livre para containers

Os comandos abaixo funcionam em qualquer terminal — **PowerShell** (Windows), **Terminal do macOS** ou **bash/zsh** (Linux). Quando houver diferença, mostraremos as variantes lado a lado.

Verificar:
```bash
docker --version
docker compose version
```

## Serviços disponíveis

O `docker/docker-compose.example.yml` deste scaffold já vem com:

| Serviço AWS | Container local | Porta |
|---|---|---|
| Lambda, API Gateway, S3, SNS, SQS, EventBridge, Kinesis, etc. | **LocalStack** | 4566 |
| DynamoDB | **DynamoDB Local** (Amazon) | 8000 |
| RDS PostgreSQL | **PostgreSQL** | 5432 |
| ElastiCache Redis | **Redis** | 6379 |
| Bedrock (para POC) | **Ollama** | 11434 |
| S3 / MinIO (alternativa) | **MinIO** | 9000 / 9001 (console) |

## Como usar

### Subir tudo

```bash
docker compose -f docker/docker-compose.example.yml up -d
```

### Ver o que está rodando

```bash
docker compose -f docker/docker-compose.example.yml ps
```

### Logs

```bash
docker compose -f docker/docker-compose.example.yml logs -f localstack
```

### Parar tudo

```bash
docker compose -f docker/docker-compose.example.yml down
```

### Limpar volumes (CUIDADO: apaga dados)

```bash
docker compose -f docker/docker-compose.example.yml down -v
```

---

## DynamoDB Local

### Criar tabela

**Linha única (funciona em qualquer shell):**
```bash
aws dynamodb create-table --endpoint-url http://localhost:8000 --table-name Deals --attribute-definitions AttributeName=deal_id,AttributeType=S --key-schema AttributeName=deal_id,KeyType=HASH --billing-mode PAY_PER_REQUEST
```

**Quebrado em várias linhas (bash/zsh — macOS/Linux):**
```bash
aws dynamodb create-table \
  --endpoint-url http://localhost:8000 \
  --table-name Deals \
  --attribute-definitions AttributeName=deal_id,AttributeType=S \
  --key-schema AttributeName=deal_id,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST
```

**Quebrado em várias linhas (PowerShell — Windows):**
```powershell
aws dynamodb create-table `
  --endpoint-url http://localhost:8000 `
  --table-name Deals `
  --attribute-definitions AttributeName=deal_id,AttributeType=S `
  --key-schema AttributeName=deal_id,KeyType=HASH `
  --billing-mode PAY_PER_REQUEST
```

### Listar tabelas
```bash
aws dynamodb list-tables --endpoint-url http://localhost:8000
```

### Em código (.NET)
```csharp
var config = new AmazonDynamoDBConfig
{
    ServiceURL = "http://localhost:8000"
};
var client = new AmazonDynamoDBClient("fake", "fake", config);
```

### Em código (Node)
```typescript
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({
  endpoint: "http://localhost:8000",
  region: "us-east-1",
  credentials: { accessKeyId: "fake", secretAccessKey: "fake" }
});
```

### Em código (Python)
```python
import boto3

client = boto3.client(
    "dynamodb",
    endpoint_url="http://localhost:8000",
    region_name="us-east-1",
    aws_access_key_id="fake",
    aws_secret_access_key="fake",
)
```

---

## LocalStack — S3, Lambda, etc.

### Criar bucket S3
```bash
aws --endpoint-url=http://localhost:4566 s3 mb s3://meu-bucket
aws --endpoint-url=http://localhost:4566 s3 ls
```

### Upload de arquivo
```bash
aws --endpoint-url=http://localhost:4566 s3 cp arquivo.txt s3://meu-bucket/
```

### Em código (Node)
```typescript
import { S3Client } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  endpoint: "http://localhost:4566",
  region: "us-east-1",
  credentials: { accessKeyId: "fake", secretAccessKey: "fake" },
  forcePathStyle: true,  // importante para LocalStack
});
```

---

## Redis local

### Conectar e testar
O `container_name` no compose é `cernyn-redis` — podemos usar direto, sem subshell:

```bash
docker exec -it cernyn-redis redis-cli
> PING
PONG
> SET teste "ola"
OK
> GET teste
"ola"
```

### Em código (.NET)
```csharp
var redis = ConnectionMultiplexer.Connect("localhost:6379");
var db = redis.GetDatabase();
await db.StringSetAsync("chave", "valor");
```

---

## Postgres local

### Conectar via psql (ou DBeaver)
- Host: `localhost`
- Porta: `5432`
- Database: `cernyn_dev` (definido no compose)
- User: `cernyn`
- Senha: `cernyn_dev` (definida no compose)

### Connection string
```
Host=localhost;Port=5432;Database=cernyn_dev;Username=cernyn;Password=cernyn_dev
```

---

## Bedrock — alternativa local com Ollama

Bedrock **não tem simulador oficial**. Para experimentar IA generativa local antes de pedir acesso ao Bedrock:

### Subir Ollama (já no compose)
```bash
# Baixar um modelo (executar uma vez)
docker exec -it cernyn-ollama ollama pull llama3.1
```

### Em código (Python)
```python
import requests

response = requests.post(
    "http://localhost:11434/api/generate",
    json={"model": "llama3.1", "prompt": "Resuma...", "stream": False}
)
print(response.json()["response"])
```

**Importante:** Ollama é apenas para experimentação. Quando o experimento amadurece, **troque para Bedrock antes do handoff**. O comando `/bedrock-poc` te ajuda a fazer essa migração.

---

## Quando ir para AWS real?

Sinais de que é hora de sair do local:

- O experimento tem >5 usuários reais consumindo
- Você precisa de integração com outros sistemas da sua empresa (que estão em AWS)
- Precisa de SLA / disponibilidade
- Você quer rodar o `/preparar-handoff` — o time de dev provavelmente vai querer uma versão em sandbox AWS antes de produção

Nesse momento, peça à equipe de Engenharia de Plataforma da sua empresa para te criar acesso a uma conta sandbox.

---

## Solução de problemas

### LocalStack não inicia
- Confira RAM: precisa de pelo menos 2GB livres
- Confira se a porta 4566 está livre — conforme seu SO:
  - **Windows (PowerShell):** `Get-NetTCPConnection -LocalPort 4566`
  - **macOS:** `lsof -nP -iTCP:4566 -sTCP:LISTEN`
  - **Linux:** `ss -tlnp | grep 4566` (ou `lsof -i :4566`)

### Erro "credentials not configured"
- LocalStack/DynamoDB Local aceitam credenciais fake — mas você precisa **passá-las** mesmo que sejam falsas
- Configure: `aws configure set aws_access_key_id fake`

### Performance ruim no Windows
- Docker Desktop com WSL2 backend é mais rápido que Hyper-V backend
- Considere mover o projeto para dentro do WSL (`\\wsl$\Ubuntu\home\...`)

### Como apagar dados e começar do zero?
```bash
docker compose -f docker/docker-compose.example.yml down -v
```
