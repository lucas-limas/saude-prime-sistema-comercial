import json
import os
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from auth import verify_password, hash_password, create_access_token, decode_token
from database import get_connection, init_db

PROJECT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

app = FastAPI(title="Saúde Prime API", docs_url=None, redoc_url=None)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["GET", "POST", "PATCH", "DELETE"],
    allow_headers=["Authorization", "Content-Type"],
)

security = HTTPBearer()


@app.on_event("startup")
def startup():
    init_db()
    conn = get_connection()
    row = conn.execute("SELECT COUNT(*) as cnt FROM users").fetchone()
    if row["cnt"] == 0:
        conn.execute(
            "INSERT INTO users (username, hashed_password, nome, role) VALUES (?, ?, ?, ?)",
            ("admin", hash_password("saude@2026"), "Administrador", "admin"),
        )
        conn.commit()
    else:
        conn.execute("UPDATE users SET role='admin' WHERE username='admin'")
        conn.commit()
    conn.close()


def get_current_user(creds: HTTPAuthorizationCredentials = Depends(security)):
    payload = decode_token(creds.credentials)
    if not payload:
        raise HTTPException(status_code=401, detail="Token inválido ou expirado")
    return payload


def require_admin(user=Depends(get_current_user)):
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Acesso restrito ao administrador")
    return user


# ── Modelos ──────────────────────────────────────────────────────────────────

class LoginRequest(BaseModel):
    username: str
    password: str

class RegisterRequest(BaseModel):
    nome: str
    username: str
    password: str

class CotacaoRequest(BaseModel):
    cliente: str
    dados: dict


# ── Auth ─────────────────────────────────────────────────────────────────────

@app.post("/api/login")
def login(req: LoginRequest):
    conn = get_connection()
    row = conn.execute(
        "SELECT hashed_password, nome, ativo, role FROM users WHERE username = ?",
        (req.username,),
    ).fetchone()
    conn.close()

    if not row or not verify_password(req.password, row["hashed_password"]) or not row["ativo"]:
        raise HTTPException(status_code=401, detail="Usuário ou senha incorretos")

    token = create_access_token({"sub": req.username, "nome": row["nome"], "role": row["role"]})
    return {"access_token": token, "token_type": "bearer", "nome": row["nome"], "role": row["role"]}


@app.post("/api/register")
def register(req: RegisterRequest):
    if len(req.username.strip()) < 3:
        raise HTTPException(status_code=400, detail="Usuário deve ter ao menos 3 caracteres")
    if len(req.password) < 6:
        raise HTTPException(status_code=400, detail="Senha deve ter ao menos 6 caracteres")
    if not req.nome.strip():
        raise HTTPException(status_code=400, detail="Nome é obrigatório")

    conn = get_connection()
    existing = conn.execute("SELECT id FROM users WHERE username = ?", (req.username.strip(),)).fetchone()
    if existing:
        conn.close()
        raise HTTPException(status_code=409, detail="Usuário já cadastrado")

    conn.execute(
        "INSERT INTO users (username, hashed_password, nome, role) VALUES (?, ?, ?, ?)",
        (req.username.strip(), hash_password(req.password), req.nome.strip(), "corretor"),
    )
    conn.commit()
    conn.close()

    token = create_access_token({"sub": req.username.strip(), "nome": req.nome.strip(), "role": "corretor"})
    return {"access_token": token, "token_type": "bearer", "nome": req.nome.strip(), "role": "corretor"}


@app.get("/api/me")
def me(user=Depends(get_current_user)):
    return {"username": user["sub"], "nome": user.get("nome"), "role": user.get("role")}


# ── Admin: gestão de usuários ─────────────────────────────────────────────────

@app.get("/api/admin/users")
def list_users(admin=Depends(require_admin)):
    conn = get_connection()
    rows = conn.execute(
        "SELECT id, username, nome, role, ativo, criado_em FROM users ORDER BY criado_em DESC"
    ).fetchall()
    conn.close()
    return [dict(r) for r in rows]


@app.patch("/api/admin/users/{user_id}/toggle")
def toggle_user(user_id: int, admin=Depends(require_admin)):
    conn = get_connection()
    row = conn.execute("SELECT ativo, role FROM users WHERE id = ?", (user_id,)).fetchone()
    if not row:
        conn.close()
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    if row["role"] == "admin":
        conn.close()
        raise HTTPException(status_code=400, detail="Não é possível desativar o administrador")
    new_status = 0 if row["ativo"] else 1
    conn.execute("UPDATE users SET ativo = ? WHERE id = ?", (new_status, user_id))
    conn.commit()
    conn.close()
    return {"ativo": new_status}


@app.delete("/api/admin/users/{user_id}")
def delete_user(user_id: int, admin=Depends(require_admin)):
    conn = get_connection()
    row = conn.execute("SELECT role FROM users WHERE id = ?", (user_id,)).fetchone()
    if not row:
        conn.close()
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    if row["role"] == "admin":
        conn.close()
        raise HTTPException(status_code=400, detail="Não é possível remover o administrador")
    conn.execute("DELETE FROM users WHERE id = ?", (user_id,))
    conn.commit()
    conn.close()
    return {"ok": True}


# ── Cotações ──────────────────────────────────────────────────────────────────

@app.post("/api/cotacoes")
def salvar_cotacao(body: CotacaoRequest, user=Depends(get_current_user)):
    conn = get_connection()
    conn.execute(
        "INSERT INTO cotacoes (usuario, cliente, dados) VALUES (?, ?, ?)",
        (user["sub"], body.cliente, json.dumps(body.dados, ensure_ascii=False)),
    )
    conn.commit()
    conn.close()
    return {"ok": True}


@app.get("/api/cotacoes")
def listar_cotacoes(user=Depends(get_current_user)):
    conn = get_connection()
    rows = conn.execute(
        "SELECT id, cliente, dados, criado_em FROM cotacoes WHERE usuario = ? ORDER BY criado_em DESC LIMIT 100",
        (user["sub"],),
    ).fetchall()
    conn.close()
    return [
        {"id": r["id"], "cliente": r["cliente"], "dados": json.loads(r["dados"]), "criado_em": r["criado_em"]}
        for r in rows
    ]


# ── Arquivos estáticos (deve ficar DEPOIS de todas as rotas /api) ─────────────
app.mount("/", StaticFiles(directory=PROJECT_DIR, html=True), name="static")
