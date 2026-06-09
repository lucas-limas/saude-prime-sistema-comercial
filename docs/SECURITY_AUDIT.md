# Auditoria de Segurança — Saúde Prime Backend

> Gerado em 2026-06-09 | Nível: Senior Dev + Security Engineer  
> Base de código: commit `a02c45e` (branch main)

---

## Sumário Executivo

O backend é bem estruturado para um sistema comercial de corretora. As fundações são sólidas: bcrypt para senhas, JWT com invalidação server-side, rate limiting no login, queries parametrizadas (sem SQL injection), RBAC com 3 níveis de acesso e log de auditoria.

Existem **2 vulnerabilidades críticas** que precisam de correção antes de qualquer exposição a usuários reais, **2 issues de alta severidade** e vários pontos de melhoria. Nenhum deles é complexo de corrigir.

**Postura geral:** Médio-Alto Risco. Bom desenvolvimento, hardening insuficiente.

---

## Índice de Vulnerabilidades

| # | Severidade | Título | Arquivo | Linha |
|---|-----------|--------|---------|-------|
| V1 | 🔴 CRÍTICO | Senha padrão hardcoded no código-fonte | main.py | 138 |
| V2 | 🔴 CRÍTICO | CORS com wildcard (`allow_origins=["*"]`) | main.py | 24 |
| V3 | 🟠 ALTO | Política de senha fraca (sem caractere especial) | main.py | 37–43 |
| V4 | 🟠 ALTO | Sem rate limiting global na API | main.py | global |
| V5 | 🟡 MÉDIO | Audit log com falha silenciosa | main.py | 46–56 |
| V6 | 🟡 MÉDIO | SECRET_KEY sem validação de presença | auth.py | 9 |
| V7 | 🟡 MÉDIO | Conexão por request sem pooling (PostgreSQL) | database.py | 22 |
| V8 | 🟢 BAIXO | Campo `dados` da cotação aceita JSON irrestrito | main.py | 256–258 |
| V9 | 🟢 BAIXO | Endpoint de auditoria sem paginação real | main.py | 606 |

---

## Vulnerabilidades Detalhadas

### V1 — 🔴 CRÍTICO: Senha Padrão Hardcoded

**Arquivo:** [backend/main.py](../backend/main.py#L136-L139)  
**Linhas:** 136–139

```python
conn.execute(
    "INSERT INTO users (username, hashed_password, nome, role) VALUES (?, ?, ?, ?)",
    ("admin", hash_password("saude@2026"), "Administrador", "superadmin"),
)
```

**Risco:** Qualquer pessoa com acesso ao código-fonte (GitHub, OneDrive, desenvolvedor terceiro) conhece a senha inicial do superadmin. Em um sistema recém-deployado que nunca teve a senha alterada, um atacante obtém acesso total imediato.

**Impacto:** Comprometimento completo do sistema — acesso a todos os dados de todas as corretoras, possibilidade de deletar catálogo, criar usuários, extrair cotações.

**Correção:**

```python
# main.py — startup()
# Substituir o bloco de criação do admin por:

import secrets, string

@app.on_event("startup")
def startup():
    init_db()
    conn = get_connection()
    row = conn.execute("SELECT COUNT(*) as cnt FROM users WHERE role = 'superadmin'").fetchone()
    if row["cnt"] == 0:
        # Gera senha aleatória segura de 16 caracteres
        alphabet = string.ascii_letters + string.digits + "!@#$%"
        senha_temp = "".join(secrets.choice(alphabet) for _ in range(16))
        conn.execute(
            "INSERT INTO users (username, hashed_password, nome, role) VALUES (?, ?, ?, ?)",
            ("admin", hash_password(senha_temp), "Administrador", "superadmin"),
        )
        conn.commit()
        # Imprime apenas nos logs do servidor (nunca retorna pela API)
        print(f"\n{'='*60}")
        print(f"  SUPERADMIN CRIADO — TROQUE A SENHA IMEDIATAMENTE")
        print(f"  Usuário: admin")
        print(f"  Senha temporária: {senha_temp}")
        print(f"{'='*60}\n")
    conn.close()
    seed_catalogo()
```

**Ação imediata (hoje):** Alterar a senha do usuário `admin` no painel antes de compartilhar o sistema com qualquer usuário.

---

### V2 — 🔴 CRÍTICO: CORS com Wildcard

**Arquivo:** [backend/main.py](../backend/main.py#L22-L27)  
**Linhas:** 22–27

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # ← PROBLEMA
    allow_methods=["GET", "POST", "PATCH", "DELETE"],
    allow_headers=["Authorization", "Content-Type"],
)
```

**Risco:** O browser aceita requisições AJAX de qualquer domínio para a API. Se um usuário logado visitar um site malicioso, esse site pode fazer chamadas autenticadas à API em nome do usuário (CSRF via CORS).

**Nota sobre `credentials`:** Como o sistema usa `Authorization: Bearer` no header (não cookies), o CORS wildcard com credentials é menos perigoso do que com cookies — o token não é enviado automaticamente pelo browser. Ainda assim, a prática é ruim e facilita explorações via XSS.

**Correção:**

```python
# Determina as origens permitidas baseado no ambiente
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "").split(",")
if not ALLOWED_ORIGINS or ALLOWED_ORIGINS == [""]:
    # Fallback seguro para desenvolvimento local
    ALLOWED_ORIGINS = ["http://localhost:3000", "http://127.0.0.1:8000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_methods=["GET", "POST", "PATCH", "DELETE"],
    allow_headers=["Authorization", "Content-Type"],
)
```

No Railway, defina a variável `ALLOWED_ORIGINS` com os domínios reais separados por vírgula:  
`ALLOWED_ORIGINS=https://seu-dominio.railway.app,https://www.saudeprime.com.br`

---

### V3 — 🟠 ALTO: Política de Senha Insuficiente

**Arquivo:** [backend/main.py](../backend/main.py#L37-L43)  
**Linhas:** 37–43

```python
def validate_password(password: str):
    if len(password) < 8:
        raise HTTPException(400, "Senha deve ter ao menos 8 caracteres")
    if not re.search(r"[A-Z]", password):
        raise HTTPException(400, "Senha deve ter ao menos uma letra maiúscula")
    if not re.search(r"[0-9]", password):
        raise HTTPException(400, "Senha deve ter ao menos um número")
    # Falta: caractere especial, comprimento mínimo maior, senhas comuns
```

**Risco:** Senhas como `Saude123` ou `Admin2026` passam na validação. São fracas e comuns em dicionários de ataque.

**Correção:**

```python
# Senhas comuns/óbvias para bloquear
_SENHAS_PROIBIDAS = {"saude@2026", "admin@2026", "Saude123", "Admin123", "123456789", "senha@123"}

def validate_password(password: str):
    if len(password) < 10:
        raise HTTPException(400, "Senha deve ter ao menos 10 caracteres")
    if not re.search(r"[A-Z]", password):
        raise HTTPException(400, "Senha deve conter ao menos uma letra maiúscula")
    if not re.search(r"[a-z]", password):
        raise HTTPException(400, "Senha deve conter ao menos uma letra minúscula")
    if not re.search(r"[0-9]", password):
        raise HTTPException(400, "Senha deve conter ao menos um número")
    if not re.search(r"[!@#$%^&*()\-_=+\[\]{};:',.<>?/\\|`~]", password):
        raise HTTPException(400, "Senha deve conter ao menos um caractere especial (!@#$%...)")
    if password.lower() in _SENHAS_PROIBIDAS:
        raise HTTPException(400, "Senha muito comum ou previsível. Escolha outra.")
```

---

### V4 — 🟠 ALTO: Sem Rate Limiting Global

**Arquivo:** [backend/main.py](../backend/main.py) — global

O rate limiting atual protege **apenas o endpoint de login** (5 tentativas por usuário). Todos os outros endpoints são sem limite.

**Risco:** Um atacante pode:
- Enumerar corretoras via `GET /api/superadmin/corretoras` em loop (se obtiver token)
- Testar tokens JWT em lote
- Fazer scraping do catálogo público sem restrição

**Correção com `slowapi`:**

```bash
pip install slowapi
```

```python
# main.py
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Aplica globalmente (10 req/segundo por IP)
@app.middleware("http")
async def rate_limit_middleware(request: Request, call_next):
    # slowapi cuida disso automaticamente ao usar @limiter.limit nos endpoints
    response = await call_next(request)
    return response

# Nos endpoints críticos:
@app.post("/api/login")
@limiter.limit("10/minute")
def login(req: LoginRequest, request: Request):
    ...

@app.get("/api/catalogo")
@limiter.limit("30/minute")
def catalogo_publico(request: Request):
    ...
```

Adicionar ao `requirements.txt`: `slowapi==0.1.9`

---

### V5 — 🟡 MÉDIO: Falha Silenciosa no Audit Log

**Arquivo:** [backend/main.py](../backend/main.py#L46-L56)  
**Linhas:** 46–56

```python
def log_action(usuario: str, acao: str, detalhes: str, ip: str = ""):
    try:
        ...
    except Exception:
        pass  # ← falha silenciosa
```

**Risco:** Se o banco estiver temporariamente indisponível ou a tabela corrompida, ações críticas (login, deleção de usuários, alterações de catálogo) ocorrem sem registro. Isso viola requisitos de auditoria e pode ocultar incidentes de segurança.

**Correção:**

```python
import logging

logger = logging.getLogger("audit")

def log_action(usuario: str, acao: str, detalhes: str, ip: str = ""):
    try:
        conn = get_connection()
        conn.execute(
            "INSERT INTO audit_log (usuario, acao, detalhes, ip) VALUES (?, ?, ?, ?)",
            (usuario, acao, detalhes, ip),
        )
        conn.commit()
        conn.close()
    except Exception as e:
        # Log no stdout/stderr do servidor (Railway captura)
        logger.error(f"AUDIT LOG FALHOU — usuario={usuario} acao={acao} erro={e}")
```

---

### V6 — 🟡 MÉDIO: SECRET_KEY sem Validação

**Arquivo:** [backend/auth.py](../backend/auth.py#L9)  
**Linha:** 9

```python
SECRET_KEY = os.getenv("SECRET_KEY")
# Se SECRET_KEY for None, jwt.encode() em algumas versões usa None como chave
```

**Risco:** Se a variável `SECRET_KEY` não estiver definida, o sistema sobe sem erro e os tokens são assinados com `None` — extremamente inseguro.

**Correção:**

```python
SECRET_KEY = os.getenv("SECRET_KEY")
if not SECRET_KEY:
    raise RuntimeError(
        "SECRET_KEY não definida. Configure a variável de ambiente antes de iniciar o servidor."
    )
if len(SECRET_KEY) < 32:
    raise RuntimeError(
        "SECRET_KEY muito curta. Use ao menos 32 caracteres aleatórios."
    )
```

---

### V7 — 🟡 MÉDIO: Conexão por Request sem Pool (PostgreSQL)

**Arquivo:** [backend/database.py](../backend/database.py#L22)  
**Linha:** 22

```python
class _Conn:
    def __init__(self):
        self._pg = psycopg2.connect(DATABASE_URL, cursor_factory=RealDictCursor)
```

**Risco:** Cada request abre e fecha uma conexão PostgreSQL. Isso é lento (TCP handshake + autenticação por request) e pode esgotar o pool de conexões do servidor de banco em momentos de pico.

**Correção com `psycopg2-pool`:**

```python
# database.py
from psycopg2 import pool as pg_pool

_pg_pool = None

def get_pg_pool():
    global _pg_pool
    if _pg_pool is None:
        _pg_pool = pg_pool.ThreadedConnectionPool(
            minconn=1, maxconn=10, dsn=DATABASE_URL, cursor_factory=RealDictCursor
        )
    return _pg_pool

def get_connection():
    if DATABASE_URL:
        pool = get_pg_pool()
        conn_raw = pool.getconn()
        # ... wrap em _Conn com pool.putconn() no close()
```

Para o volume atual do sistema (corretora pequena), o impacto é baixo, mas é uma melhoria importante antes de escalar.

---

### V8 — 🟢 BAIXO: Campo `dados` da Cotação Irrestrito

**Arquivo:** [backend/main.py](../backend/main.py#L256-L258)  
**Linhas:** 256–258

```python
class CotacaoRequest(BaseModel):
    cliente: str
    dados: dict  # ← aceita qualquer JSON
```

**Risco:** Um corretor pode salvar qualquer estrutura JSON no campo `dados`. Não há risco de injeção (o campo é serializado para string antes do INSERT), mas pode-se armazenar dados inesperados ou payloads muito grandes.

**Melhoria sugerida:**

```python
from pydantic import BaseModel, Field

class CotacaoRequest(BaseModel):
    cliente: str = Field(..., min_length=1, max_length=200)
    dados: dict = Field(..., max_length=50_000)  # limita tamanho do JSON
```

E no endpoint, validar o tamanho do JSON serializado:

```python
dados_str = json.dumps(body.dados, ensure_ascii=False)
if len(dados_str) > 100_000:  # 100KB
    raise HTTPException(400, "Dados da cotação excedem o tamanho máximo permitido")
```

---

### V9 — 🟢 BAIXO: Audit Log sem Paginação Real

**Arquivo:** [backend/main.py](../backend/main.py#L602-L609)  
**Linha:** 606

```python
rows = conn.execute(
    "SELECT ... FROM audit_log ORDER BY criado_em DESC LIMIT 500"
).fetchall()
```

O limite fixo de 500 registros impede ver eventos mais antigos e retorna tudo de uma vez. Com o tempo, pode sobrecarregar a resposta.

**Melhoria:** Adicionar paginação com `offset` e `limit` como query params.

---

## O que está BEM implementado ✅

| Prática | Implementação | Arquivo |
|---------|---------------|---------|
| Hashing de senha | bcrypt (custo adaptativo, salt embutido) | auth.py |
| Rate limiting no login | 5 tentativas → bloqueio de 15 min por conta | main.py:367–386 |
| Session única | `session_token` no banco invalida sessões antigas | main.py:82–91 |
| SQL parametrizado | Todos os queries usam `?` / `%s` | main.py, database.py |
| RBAC com 3 níveis | superadmin > admin > corretor | main.py:94–117 |
| Isolamento por corretora | Admin só gerencia sua corretora | main.py:675 |
| Isolamento de cotações | Corretor só vê suas próprias cotações | main.py:722 |
| Docs desabilitadas | `docs_url=None, redoc_url=None` | main.py:20 |
| Logout real | Anula `session_token` no banco | main.py:446 |
| Logs de auditoria | Registra login, logout, CRUD sensível | main.py:46–56 |
| Proteção do superadmin | Toggle/delete bloqueado para superadmin | main.py:573, 591 |
| Validação de entrada | Pydantic em todos os endpoints com body | main.py:233–329 |

---

## Plano de Correção Priorizado

### Fase 1 — Hoje (crítico, < 1h de trabalho)

**1. Alterar a senha do admin imediatamente**
- Acessar o painel como admin
- Trocar a senha por uma senha forte (12+ chars, maiúscula, número, especial)
- Ou implementar a V1 antes do próximo deploy

**2. Corrigir CORS**
- Adicionar a variável `ALLOWED_ORIGINS` no Railway
- Atualizar `main.py` para ler a variável (código da V2 acima)

### Fase 2 — Esta semana (alta prioridade)

**3. Implementar V1** — senha gerada aleatoriamente no startup  
**4. Implementar V3** — adicionar caractere especial e senhas proibidas  
**5. Implementar V6** — validar presença e tamanho da SECRET_KEY  

### Fase 3 — Próximo sprint (melhoria)

**6. Implementar V4** — slowapi para rate limiting global  
**7. Implementar V5** — audit log com log de erro no servidor  
**8. Implementar V7** — connection pooling para PostgreSQL  
**9. Implementar V8** — validar tamanho do campo `dados`  

---

## Checklist de Segurança por Deploy

Antes de cada release, verificar:

- [ ] `SECRET_KEY` definida no Railway com 64+ caracteres aleatórios
- [ ] `ALLOWED_ORIGINS` definida com o domínio correto (sem `*`)
- [ ] `DATABASE_URL` apontando para PostgreSQL de produção
- [ ] Senha do admin foi trocada após o primeiro deploy
- [ ] `.env` não está commitado no git (verificar `.gitignore`)
- [ ] `saude_prime.db` não está commitado no git
- [ ] `docs_url=None` e `redoc_url=None` mantidos

---

## LGPD (Lei Geral de Proteção de Dados)

O sistema armazena dados de clientes (nome + cotações). Pontos de atenção:

| Requisito | Status | Observação |
|-----------|--------|-----------|
| Minimização de dados | ✅ | Não coleta CPF, cartão, dados médicos |
| Criptografia em trânsito | ✅ | HTTPS via Railway |
| Criptografia em repouso | ❌ | SQLite não criptografado; PostgreSQL depende da config do Railway |
| Log de acesso a dados | ✅ | audit_log implementado |
| Direito ao apagamento | ❌ | Sem endpoint para deletar cotações do cliente |
| Retenção definida | ❌ | Cotações ficam indefinidamente no banco |
| Consentimento | ⚠️ | Depende do fluxo de atendimento da corretora |

**Recomendação mínima:** Adicionar endpoint `DELETE /api/cotacoes/{id}` para permitir que o corretor apague cotações de um cliente específico mediante solicitação.

---

## Geração de SECRET_KEY Segura

Para gerar uma SECRET_KEY adequada (rode isso uma vez e salve no Railway):

```python
import secrets
print(secrets.token_hex(64))  # 128 caracteres hexadecimais
```

Ou via terminal:
```bash
python -c "import secrets; print(secrets.token_hex(64))"
```

**Nunca reutilizar a SECRET_KEY entre ambientes.** Dev e prod devem ter chaves diferentes.
