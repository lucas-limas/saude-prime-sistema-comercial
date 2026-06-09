# Documentação Técnica do Backend — Saúde Prime

> Gerado em 2026-06-09. Reflete o estado atual do código.

---

## 1. Visão Geral do Sistema

O backend é uma **API REST construída com FastAPI (Python)** que serve como núcleo de dados e regras de negócio do sistema comercial Saúde Prime. Ele é responsável por:

- Autenticação e autorização de usuários por níveis de acesso
- Gerenciamento de corretoras (empresas clientes do sistema)
- Cadastro e controle de colaboradores (corretores)
- Armazenamento de cotações de planos de saúde
- Catálogo de operadoras, planos e rede credenciada
- Log de auditoria de ações sensíveis

O sistema suporta dois bancos de dados:
- **SQLite** (desenvolvimento local)
- **PostgreSQL** (produção no Railway)

A troca é automática: se a variável de ambiente `DATABASE_URL` estiver definida, usa PostgreSQL; caso contrário, usa SQLite.

---

## 2. Estrutura de Arquivos do Backend

```
backend/
├── main.py           # Ponto de entrada — define todos os endpoints da API
├── auth.py           # Funções de JWT e hashing de senha
├── database.py       # Conexão, criação de tabelas e migrações
├── requirements.txt  # Dependências Python
├── .env              # Variáveis de ambiente (segredos — NÃO commitar)
├── .gitignore        # Exclui saude_prime.db e .env do git
├── start.bat         # Script de inicialização local (Windows)
└── saude_prime.db    # Banco SQLite local (gerado automaticamente)
```

---

## 3. Dependências (`requirements.txt`)

| Pacote | Versão | Para que serve |
|--------|--------|----------------|
| `fastapi` | 0.136.3 | Framework web — define rotas, validação de entrada, injeção de dependência |
| `uvicorn[standard]` | 0.48.0 | Servidor ASGI que executa o FastAPI |
| `python-jose[cryptography]` | 3.5.0 | Criação e verificação de tokens JWT |
| `passlib[bcrypt]` | 1.7.4 | Interface para hashing de senhas |
| `bcrypt` | 4.0.1 | Algoritmo de hash real usado pelo passlib |
| `python-dotenv` | 1.2.2 | Carrega variáveis do arquivo `.env` |
| `psycopg2-binary` | 2.9.10 | Driver de conexão PostgreSQL |

Versões fixadas (pinned) para garantir builds reproduzíveis — boa prática.

---

## 4. `auth.py` — Autenticação e Hashing

**Arquivo:** [backend/auth.py](../backend/auth.py)

### O que faz

Concentra as três operações criptográficas do sistema:

1. **Hash de senha** com bcrypt
2. **Verificação de senha** contra o hash armazenado
3. **Criação e decodificação de tokens JWT**

### Como está implementado

```python
# Lê configurações do .env (nunca hardcoded)
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM  = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "480"))

# Context bcrypt para hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
```

**`hash_password(plain)`** — recebe a senha em texto puro e retorna o hash bcrypt (nunca salva a senha original).

**`verify_password(plain, hashed)`** — compara a senha digitada com o hash no banco. O bcrypt faz isso de forma segura (timing-safe).

**`create_access_token(data)`** — recebe um dict com dados do usuário, adiciona o campo `exp` (expiração) e retorna um JWT assinado com a `SECRET_KEY`.

**`decode_token(token)`** — verifica a assinatura do token e retorna o payload. Retorna `None` silenciosamente em caso de token inválido ou expirado (evita vazar detalhes do erro para o cliente).

### Por que foi feito assim

- **bcrypt** é o padrão da indústria para senhas — lento por design (dificulta força bruta), com salt embutido.
- **JWT com HS256** é adequado para sistemas single-backend como este. A chave secreta é lida do ambiente, não do código.
- Retorno `None` em `decode_token` mantém o log de erro interno sem expô-lo ao cliente.

---

## 5. `database.py` — Conexão e Esquema do Banco

**Arquivo:** [backend/database.py](../backend/database.py)

### O que faz

- Gerencia a conexão com o banco (SQLite ou PostgreSQL)
- Cria todas as tabelas na primeira execução
- Executa migrações incrementais seguras

### `get_connection()` — Fábrica de Conexão

```python
DATABASE_URL = os.environ.get("DATABASE_URL")

def get_connection():
    if DATABASE_URL:
        # PostgreSQL via psycopg2
        ...
    else:
        # SQLite local
        conn = sqlite3.connect("saude_prime.db")
        conn.row_factory = sqlite3.Row  # permite acessar colunas por nome
        return conn
```

O wrapper `_Conn` para PostgreSQL replica a interface do SQLite (`.execute()`, `.commit()`, `.close()`), permitindo que `main.py` use o mesmo código independente do banco.

**Por que conexão por request (sem pool):** Para SQLite é o modelo correto (SQLite não tem pool real). Para PostgreSQL em produção, o Railway oferece pooling via PgBouncer externamente. O modelo atual pode ser um gargalo em alta concorrência (ver seção de segurança).

### `init_db()` — Criação das Tabelas

Chamada uma vez no startup do servidor. Cria 7 tabelas com `CREATE TABLE IF NOT EXISTS` (idempotente — não destrói dados existentes).

#### Esquema das Tabelas

**`corretoras`** — Empresas clientes do sistema (B2B)
```sql
id, nome, limite_usuarios, data_expiracao, ativo, criado_em
```

**`users`** — Todos os usuários do sistema
```sql
id, username (UNIQUE), email (UNIQUE), hashed_password,
nome, role (corretor|admin|superadmin),
corretora_id (FK → corretoras),
ativo, tentativas_login, bloqueado_ate, session_token, criado_em
```

**`cotacoes`** — Cotações salvas pelos corretores
```sql
id, usuario, corretora_id, cliente, dados (JSON), criado_em
```

**`audit_log`** — Registro de ações sensíveis
```sql
id, usuario, acao, detalhes, ip, criado_em
```

**`operadoras`** — Planos de saúde disponíveis (Amil, Unimed, etc.)
```sql
id, chave (UNIQUE), nome, cor, cls, info, ativo, ordem,
rede_adm, rede_rodape, criado_em
```

**`planos`** — Planos individuais de cada operadora
```sql
id, codigo (UNIQUE), operadora_id (FK), nome, aco (apt|enf),
tipo, fvidas, mod, vig,
precos (JSON — array de 10 preços por faixa etária),
ativo, ordem, criado_em
```

**`rede_credenciada`** — Hospitais, clínicas e labs por operadora
```sql
id, operadora_id (FK), grupo, grupo_ordem, nome, local,
tags (JSON), obs, tag_extra (JSON), ordem, ativo, criado_em
```

### Migrações (`_migrations_sqlite` e `_migrations_pg`)

Executam `ALTER TABLE` e `UPDATE` incrementais de forma segura: cada instrução é tentada individualmente e erros são ignorados (a tabela/coluna já existe). Para PostgreSQL, um `rollback()` é chamado antes da próxima migração para liberar a transação abortada.

---

## 6. `main.py` — API Principal

**Arquivo:** [backend/main.py](../backend/main.py) (~1.200 linhas)

### Configuração Inicial

```python
app = FastAPI(title="Saúde Prime API", docs_url=None, redoc_url=None)
```

`docs_url=None` e `redoc_url=None` desabilitam o Swagger UI e ReDoc em produção — boa prática de segurança (não expõe a documentação interativa da API ao público).

```python
app.add_middleware(CORSMiddleware, allow_origins=["*"], ...)
```

CORS com wildcard — permite qualquer origem. Funcional, mas cria risco (ver auditoria de segurança).

### Constantes de Segurança

```python
MAX_TENTATIVAS  = 5   # tentativas de login antes do bloqueio
BLOQUEIO_MINUTOS = 15  # duração do bloqueio em minutos
```

---

### 6.1 Helpers Globais

#### `validate_password(password)`
Valida força da senha antes de cadastrar ou alterar. Exige mínimo 8 caracteres, 1 maiúscula e 1 número.

#### `log_action(usuario, acao, detalhes, ip)`
Insere um registro na tabela `audit_log`. O `try/except` sem re-raise garante que falha no log não quebre a operação principal — trade-off conscientemente aceito.

#### `check_corretora_ativa(corretora_id)`
Consultada antes de qualquer operação de corretor ou admin. Lança `403` se a corretora estiver inativa ou com assinatura expirada.

---

### 6.2 Dependências de Autenticação (Injeção de Dependência FastAPI)

#### `get_current_user(creds)`
Base de toda autenticação. Extrai e valida o Bearer token do header `Authorization`. Além da verificação criptográfica do JWT, faz uma consulta extra no banco para checar se o `session_token` ainda é o ativo — isso invalida sessões antigas quando o usuário faz login em outro dispositivo.

#### `require_superadmin(user)`
Permite acesso somente a usuários com `role == "superadmin"`. Sem restrição de corretora (o superadmin gerencia tudo).

#### `require_admin(user)`
Permite `admin` ou `superadmin`. Para admins de corretora, valida adicionalmente se a corretora está ativa/não expirada.

#### `require_corretor(user)`
Permite qualquer role autenticado, mas verifica se o usuário está ativo no banco E se a corretora está ativa.

---

### 6.3 Startup (`@app.on_event("startup")`)

Executado uma vez quando o servidor sobe:
1. Chama `init_db()` para garantir que as tabelas existem
2. Verifica se existe algum `superadmin` — se não existir, cria o usuário `admin` com senha padrão
3. Chama `seed_catalogo()` para popular operadoras e planos iniciais se o banco estiver vazio

`seed_catalogo()` insere 10 operadoras e ~40+ planos com preços reais. Só executa se a tabela `operadoras` estiver vazia.

---

### 6.4 Modelos Pydantic (Validação de Entrada)

Todos os endpoints que recebem dados usam modelos Pydantic para validação automática de tipos:

| Modelo | Usado em | Campos principais |
|--------|----------|-------------------|
| `LoginRequest` | POST /api/login | username, password |
| `CorretoraRequest` | POST /api/superadmin/corretoras | nome, limite_usuarios, data_expiracao |
| `UpdateCorretoraRequest` | PATCH corretoras | todos opcionais |
| `CreateUserRequest` | POST users | nome, username, email, password, role, corretora_id |
| `CotacaoRequest` | POST /api/cotacoes | cliente, dados (dict livre) |
| `OperadoraRequest` | POST operadoras | chave, nome, cor, cls, info, ativo, ordem |
| `PlanoRequest` | POST planos | codigo, operadora_id, nome, aco, precos (lista de 10) |
| `RedeItemRequest` | POST rede | operadora_id, grupo, nome, local, tags, obs, tag_extra |
| `RedeMetaRequest` | PATCH rede-meta | rede_adm, rede_rodape |

---

### 6.5 Endpoints da API

#### Autenticação (público)

| Método | Rota | Função | Descrição |
|--------|------|--------|-----------|
| POST | `/api/login` | `login()` | Autentica o usuário e retorna JWT |
| GET | `/api/me` | `me()` | Retorna dados do usuário logado |
| POST | `/api/logout` | `logout()` | Invalida a sessão (anula session_token no banco) |

**Fluxo do login:**
1. Busca usuário pelo `username`
2. Checa se está bloqueado (`bloqueado_ate`)
3. Verifica a senha com bcrypt
4. Se errada, incrementa `tentativas_login`; ao atingir 5, define `bloqueado_ate` por 15 min
5. Verifica se usuário está ativo e se a corretora está válida
6. Gera novo `session_token` (invalida sessões anteriores)
7. Retorna JWT com payload: `sub`, `nome`, `role`, `corretora_id`, `session_token`

#### Catálogo Público (sem autenticação)

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/catalogo` | Retorna operadoras, planos e rede credenciada ativos |

Usado pelo cotador frontend. Não requer login pois os dados são comerciais (não sensíveis). Retorna a estrutura completa com faixas etárias, preços por faixa e rede credenciada agrupada por operadora.

#### Cotações (role: corretor)

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/cotacoes` | Salva uma cotação associada ao corretor logado |
| GET | `/api/cotacoes` | Lista as últimas 100 cotações do corretor logado |

Cada cotação é isolada por usuário — um corretor não vê cotações de outro.

#### Gerenciamento da Corretora (role: admin)

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/admin/users` | Lista corretores da sua corretora |
| POST | `/api/admin/users` | Cria novo corretor (respeita limite de usuários) |
| PATCH | `/api/admin/users/{id}/toggle` | Ativa/desativa corretor |
| DELETE | `/api/admin/users/{id}` | Remove corretor |

O admin só consegue gerenciar usuários da sua própria corretora (validação por `corretora_id`).

#### Superadmin: Corretoras

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/superadmin/corretoras` | Lista todas as corretoras com contagem de usuários |
| POST | `/api/superadmin/corretoras` | Cria nova corretora |
| PATCH | `/api/superadmin/corretoras/{id}` | Atualiza dados/status/expiração |
| DELETE | `/api/superadmin/corretoras/{id}` | Remove corretora e todos seus usuários (CASCADE) |

#### Superadmin: Usuários

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/superadmin/users` | Lista todos os usuários (exceto superadmin) |
| POST | `/api/superadmin/users` | Cria admin ou corretor em qualquer corretora |
| PATCH | `/api/superadmin/users/{id}/toggle` | Ativa/desativa (protege superadmin) |
| DELETE | `/api/superadmin/users/{id}` | Remove usuário (protege superadmin) |

#### Superadmin: Auditoria

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/superadmin/audit` | Últimas 500 entradas do log de auditoria |

#### Superadmin: Catálogo

| Método | Rota | Descrição |
|--------|------|-----------|
| GET/POST/PATCH/DELETE | `/api/superadmin/catalogo/operadoras` | CRUD de operadoras |
| PATCH | `/api/superadmin/catalogo/operadoras/{id}/toggle` | Ativa/desativa operadora |
| PATCH | `/api/superadmin/catalogo/operadoras/{id}/rede-meta` | Atualiza metadados de rede (adm, rodapé) |
| GET/POST/PATCH/DELETE | `/api/superadmin/catalogo/planos` | CRUD de planos |
| PATCH | `/api/superadmin/catalogo/planos/{id}/toggle` | Ativa/desativa plano |
| GET/POST/PATCH/DELETE | `/api/superadmin/catalogo/rede` | CRUD de rede credenciada |
| POST | `/api/superadmin/catalogo/importar` | Importação em lote (operadoras + planos via JSON) |
| POST | `/api/superadmin/catalogo/importar-rede` | Importação em lote de rede credenciada |

---

### 6.6 Padrão de Query SQL (Anti-Injection)

Todos os parâmetros de query usam `?` (SQLite) / `%s` (PostgreSQL, feito via substituição automática no wrapper `_Conn`):

```python
# CORRETO — parâmetro ligado pelo driver
conn.execute("SELECT * FROM users WHERE username = ?", (username,))

# NUNCA feito no código — seria vulnerável a injection
# conn.execute(f"SELECT * FROM users WHERE username = '{username}'")
```

---

### 6.7 Hierarquia de Permissões

```
superadmin
    └── Gerencia tudo: corretoras, usuários, catálogo, auditoria

admin (vinculado a uma corretora)
    └── Gerencia corretores da sua corretora
    └── Limitado pela validade da assinatura da corretora

corretor (vinculado a uma corretora)
    └── Cria e consulta suas próprias cotações
    └── Limitado pela validade da assinatura E pelo status ativo do próprio usuário
```

---

## 7. Fluxo de Dados Completo

```
[Browser/App]
     │
     ├─ GET /api/catalogo ──────────────────────────────→ [DB] operadoras + planos + rede
     │
     ├─ POST /api/login (username + password)
     │       │
     │       ├─ bcrypt.verify() ←──── [DB] hashed_password
     │       ├─ gera session_token (secrets.token_hex)
     │       └─ retorna JWT (8h)
     │
     ├─ POST /api/cotacoes (Bearer JWT)
     │       │
     │       ├─ decode JWT → payload
     │       ├─ valida session_token ←── [DB] users.session_token
     │       ├─ valida corretora ativa ←── [DB] corretoras
     │       ├─ valida user ativo ←── [DB] users.ativo
     │       └─ INSERT cotacoes [DB]
     │
     └─ PATCH /api/superadmin/... (Bearer JWT — superadmin only)
             │
             ├─ decode JWT → role == "superadmin"
             └─ operações no catálogo [DB]
```

---

## 8. Deploy (Railway)

**Arquivo:** [railway.json](../railway.json)

```json
{
  "build": { "builder": "NIXPACKS" },
  "deploy": {
    "startCommand": "cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 3
  }
}
```

- **NIXPACKS** detecta automaticamente o Python e instala as dependências do `requirements.txt`
- A porta é injetada pelo Railway via `$PORT`
- Em caso de falha, reinicia até 3 vezes
- HTTPS é gerenciado automaticamente pelo Railway (sem configuração necessária no código)

### Variáveis de Ambiente em Produção (Railway)

| Variável | Descrição |
|----------|-----------|
| `SECRET_KEY` | Chave para assinar JWT (deve ser gerada aleatoriamente) |
| `ALGORITHM` | Algoritmo JWT (padrão: HS256) |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Validade do token (padrão: 480 = 8h) |
| `DATABASE_URL` | URL de conexão PostgreSQL (Railway injeta automaticamente) |

---

## 9. Arquivos Estáticos

O backend serve os arquivos HTML/JS/CSS diretamente via `StaticFiles` do FastAPI. Toda a pasta `app/` e `landing/` são montadas como diretórios estáticos, e a rota raiz (`/`) redireciona para o sistema principal.

```python
PROJECT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# Serve ../app/* como estático
```

---

## 10. Resumo de Decisões Arquiteturais

| Decisão | Motivo |
|---------|--------|
| FastAPI em vez de Flask/Django | Validação automática com Pydantic, async nativo, mais rápido |
| JWT stateless + session_token no banco | JWT permite validação sem DB; session_token permite logout real e sessão única |
| SQLite em dev / PostgreSQL em prod | Desenvolvimento sem dependência externa; prod com banco escalável |
| bcrypt para senhas | Padrão da indústria, resistente a brute force |
| `docs_url=None` | Não expõe Swagger em produção |
| Log de auditoria sem re-raise | Falha no log não quebra a operação de negócio |
| Catálogo público sem auth | Dados não sensíveis; simplifica o cotador (funciona offline via dados.js) |
