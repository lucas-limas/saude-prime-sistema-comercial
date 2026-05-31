import json
import os
import re
from datetime import date, datetime, timedelta, timezone
from typing import Optional

from fastapi import FastAPI, Depends, HTTPException, Request
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

MAX_TENTATIVAS = 5
BLOQUEIO_MINUTOS = 15


# ── Helpers ───────────────────────────────────────────────────────────────────

def validate_password(password: str):
    if len(password) < 8:
        raise HTTPException(400, "Senha deve ter ao menos 8 caracteres")
    if not re.search(r"[A-Z]", password):
        raise HTTPException(400, "Senha deve ter ao menos uma letra maiúscula")
    if not re.search(r"[0-9]", password):
        raise HTTPException(400, "Senha deve ter ao menos um número")


def log_action(usuario: str, acao: str, detalhes: str, ip: str = ""):
    try:
        conn = get_connection()
        conn.execute(
            "INSERT INTO audit_log (usuario, acao, detalhes, ip) VALUES (?, ?, ?, ?)",
            (usuario, acao, detalhes, ip),
        )
        conn.commit()
        conn.close()
    except Exception:
        pass


def check_corretora_ativa(corretora_id):
    if not corretora_id:
        return
    conn = get_connection()
    row = conn.execute(
        "SELECT ativo, data_expiracao FROM corretoras WHERE id = ?", (corretora_id,)
    ).fetchone()
    conn.close()
    if not row:
        raise HTTPException(403, "Corretora não encontrada")
    if not row["ativo"]:
        raise HTTPException(403, "Assinatura inativa. Entre em contato com o suporte.")
    if str(row["data_expiracao"]) < date.today().isoformat():
        raise HTTPException(403, "Assinatura expirada. Entre em contato com o suporte para renovar.")


# ── Dependências de autenticação ──────────────────────────────────────────────

def get_current_user(creds: HTTPAuthorizationCredentials = Depends(security)):
    payload = decode_token(creds.credentials)
    if not payload:
        raise HTTPException(401, "Token inválido ou expirado")
    return payload


def require_superadmin(user=Depends(get_current_user)):
    if user.get("role") != "superadmin":
        raise HTTPException(403, "Acesso restrito ao super administrador")
    return user


def require_admin(user=Depends(get_current_user)):
    if user.get("role") not in ("admin", "superadmin"):
        raise HTTPException(403, "Acesso restrito ao administrador")
    if user.get("role") == "admin":
        check_corretora_ativa(user.get("corretora_id"))
    return user


def require_corretor(user=Depends(get_current_user)):
    check_corretora_ativa(user.get("corretora_id"))
    conn = get_connection()
    row = conn.execute(
        "SELECT ativo FROM users WHERE username = ?", (user["sub"],)
    ).fetchone()
    conn.close()
    if not row or not row["ativo"]:
        raise HTTPException(403, "Usuário inativo")
    return user


# ── Startup ───────────────────────────────────────────────────────────────────

@app.on_event("startup")
def startup():
    init_db()
    conn = get_connection()
    row = conn.execute(
        "SELECT COUNT(*) as cnt FROM users WHERE role = 'superadmin'"
    ).fetchone()
    if row["cnt"] == 0:
        old = conn.execute(
            "SELECT id FROM users WHERE username = 'admin'"
        ).fetchone()
        if old:
            conn.execute("UPDATE users SET role='superadmin' WHERE username='admin'")
        else:
            conn.execute(
                "INSERT INTO users (username, hashed_password, nome, role) VALUES (?, ?, ?, ?)",
                ("admin", hash_password("saude@2026"), "Administrador", "superadmin"),
            )
        conn.commit()
    conn.close()


# ── Modelos ───────────────────────────────────────────────────────────────────

class LoginRequest(BaseModel):
    username: str
    password: str

class CorretoraRequest(BaseModel):
    nome: str
    limite_usuarios: int = 5
    data_expiracao: str

class UpdateCorretoraRequest(BaseModel):
    nome: Optional[str] = None
    limite_usuarios: Optional[int] = None
    data_expiracao: Optional[str] = None
    ativo: Optional[int] = None

class CreateUserRequest(BaseModel):
    nome: str
    username: str
    email: Optional[str] = None
    password: str
    role: str = "corretor"
    corretora_id: Optional[int] = None

class CotacaoRequest(BaseModel):
    cliente: str
    dados: dict


# ── Auth ──────────────────────────────────────────────────────────────────────

@app.post("/api/login")
def login(req: LoginRequest, request: Request):
    ip = request.client.host if request.client else ""
    conn = get_connection()

    row = conn.execute(
        """SELECT id, hashed_password, nome, ativo, role, corretora_id,
                  tentativas_login, bloqueado_ate
           FROM users WHERE username = ?""",
        (req.username.strip(),),
    ).fetchone()

    if not row:
        conn.close()
        raise HTTPException(401, "Usuário ou senha incorretos")

    # Verifica bloqueio temporário
    if row["bloqueado_ate"]:
        try:
            bloqueado_dt = datetime.fromisoformat(str(row["bloqueado_ate"]))
            if bloqueado_dt.tzinfo is None:
                bloqueado_dt = bloqueado_dt.replace(tzinfo=timezone.utc)
            agora = datetime.now(timezone.utc)
            if agora < bloqueado_dt:
                conn.close()
                minutos = max(1, int((bloqueado_dt - agora).total_seconds() / 60) + 1)
                raise HTTPException(429, f"Conta bloqueada. Tente novamente em {minutos} minuto(s).")
        except HTTPException:
            raise
        except Exception:
            pass

    # Verifica senha
    if not verify_password(req.password, row["hashed_password"]):
        tentativas = (row["tentativas_login"] or 0) + 1
        bloqueado_ate = None
        if tentativas >= MAX_TENTATIVAS:
            bloqueado_ate = (
                datetime.now(timezone.utc) + timedelta(minutes=BLOQUEIO_MINUTOS)
            ).isoformat()
            tentativas = 0
        conn.execute(
            "UPDATE users SET tentativas_login = ?, bloqueado_ate = ? WHERE username = ?",
            (tentativas, bloqueado_ate, req.username.strip()),
        )
        conn.commit()
        conn.close()
        if bloqueado_ate:
            raise HTTPException(
                429, f"Conta bloqueada por {BLOQUEIO_MINUTOS} minutos após tentativas excessivas."
            )
        restantes = MAX_TENTATIVAS - tentativas
        raise HTTPException(401, f"Senha incorreta. {restantes} tentativa(s) restante(s).")

    if not row["ativo"]:
        conn.close()
        raise HTTPException(401, "Usuário inativo. Contate o administrador.")

    # Verifica assinatura da corretora (não aplica ao superadmin)
    if row["role"] != "superadmin" and row["corretora_id"]:
        corretora = conn.execute(
            "SELECT ativo, data_expiracao FROM corretoras WHERE id = ?",
            (row["corretora_id"],),
        ).fetchone()
        if corretora:
            if not corretora["ativo"]:
                conn.close()
                raise HTTPException(403, "Assinatura da corretora inativa. Contate o suporte.")
            if str(corretora["data_expiracao"]) < date.today().isoformat():
                conn.close()
                raise HTTPException(403, "Assinatura expirada. Contate o suporte para renovar.")

    # Reseta tentativas
    conn.execute(
        "UPDATE users SET tentativas_login = 0, bloqueado_ate = NULL WHERE username = ?",
        (req.username.strip(),),
    )
    conn.commit()
    conn.close()

    log_action(req.username, "login", "Login bem-sucedido", ip)

    token = create_access_token({
        "sub": req.username.strip(),
        "nome": row["nome"],
        "role": row["role"],
        "corretora_id": row["corretora_id"],
    })
    return {
        "access_token": token,
        "token_type": "bearer",
        "nome": row["nome"],
        "role": row["role"],
        "corretora_id": row["corretora_id"],
    }


@app.get("/api/me")
def me(user=Depends(get_current_user)):
    return {
        "username": user["sub"],
        "nome": user.get("nome"),
        "role": user.get("role"),
        "corretora_id": user.get("corretora_id"),
    }


# ── Superadmin: Corretoras ────────────────────────────────────────────────────

@app.get("/api/superadmin/corretoras")
def listar_corretoras(admin=Depends(require_superadmin)):
    conn = get_connection()
    rows = conn.execute(
        "SELECT id, nome, limite_usuarios, data_expiracao, ativo, criado_em FROM corretoras ORDER BY criado_em DESC"
    ).fetchall()
    result = []
    for r in rows:
        d = dict(r)
        cnt = conn.execute(
            "SELECT COUNT(*) as cnt FROM users WHERE corretora_id = ? AND role = 'corretor'",
            (d["id"],),
        ).fetchone()
        d["total_usuarios"] = cnt["cnt"]
        result.append(d)
    conn.close()
    return result


@app.post("/api/superadmin/corretoras")
def criar_corretora(body: CorretoraRequest, admin=Depends(require_superadmin)):
    conn = get_connection()
    conn.execute(
        "INSERT INTO corretoras (nome, limite_usuarios, data_expiracao) VALUES (?, ?, ?)",
        (body.nome.strip(), body.limite_usuarios, body.data_expiracao),
    )
    conn.commit()
    row = conn.execute(
        "SELECT id, nome, limite_usuarios, data_expiracao, ativo, criado_em FROM corretoras ORDER BY id DESC LIMIT 1"
    ).fetchone()
    conn.close()
    log_action(admin["sub"], "criar_corretora", f"Corretora: {body.nome}")
    return dict(row)


@app.patch("/api/superadmin/corretoras/{corretora_id}")
def atualizar_corretora(corretora_id: int, body: UpdateCorretoraRequest, admin=Depends(require_superadmin)):
    conn = get_connection()
    if not conn.execute("SELECT id FROM corretoras WHERE id = ?", (corretora_id,)).fetchone():
        conn.close()
        raise HTTPException(404, "Corretora não encontrada")
    updates, params = [], []
    if body.nome is not None:
        updates.append("nome = ?"); params.append(body.nome.strip())
    if body.limite_usuarios is not None:
        updates.append("limite_usuarios = ?"); params.append(body.limite_usuarios)
    if body.data_expiracao is not None:
        updates.append("data_expiracao = ?"); params.append(body.data_expiracao)
    if body.ativo is not None:
        updates.append("ativo = ?"); params.append(body.ativo)
    if updates:
        params.append(corretora_id)
        conn.execute(f"UPDATE corretoras SET {', '.join(updates)} WHERE id = ?", params)
        conn.commit()
    conn.close()
    log_action(admin["sub"], "atualizar_corretora", f"Corretora {corretora_id} atualizada")
    return {"ok": True}


@app.delete("/api/superadmin/corretoras/{corretora_id}")
def deletar_corretora(corretora_id: int, admin=Depends(require_superadmin)):
    conn = get_connection()
    if not conn.execute("SELECT id FROM corretoras WHERE id = ?", (corretora_id,)).fetchone():
        conn.close()
        raise HTTPException(404, "Corretora não encontrada")
    conn.execute("DELETE FROM users WHERE corretora_id = ?", (corretora_id,))
    conn.execute("DELETE FROM corretoras WHERE id = ?", (corretora_id,))
    conn.commit()
    conn.close()
    log_action(admin["sub"], "deletar_corretora", f"Corretora {corretora_id} removida")
    return {"ok": True}


# ── Superadmin: Usuários ──────────────────────────────────────────────────────

@app.get("/api/superadmin/users")
def listar_todos_usuarios(admin=Depends(require_superadmin)):
    conn = get_connection()
    rows = conn.execute(
        """SELECT u.id, u.username, u.nome, u.email, u.role, u.ativo,
                  u.corretora_id, u.criado_em, c.nome as corretora_nome
           FROM users u
           LEFT JOIN corretoras c ON u.corretora_id = c.id
           WHERE u.role != 'superadmin'
           ORDER BY u.criado_em DESC"""
    ).fetchall()
    conn.close()
    return [dict(r) for r in rows]


@app.post("/api/superadmin/users")
def criar_usuario_superadmin(body: CreateUserRequest, admin=Depends(require_superadmin)):
    validate_password(body.password)
    if body.role not in ("admin", "corretor"):
        raise HTTPException(400, "Role inválida. Use 'admin' ou 'corretor'.")
    if body.role == "admin" and not body.corretora_id:
        raise HTTPException(400, "Administrador deve pertencer a uma corretora.")
    conn = get_connection()
    if conn.execute("SELECT id FROM users WHERE username = ?", (body.username.strip(),)).fetchone():
        conn.close()
        raise HTTPException(409, "Nome de usuário já cadastrado.")
    conn.execute(
        "INSERT INTO users (username, email, hashed_password, nome, role, corretora_id) VALUES (?, ?, ?, ?, ?, ?)",
        (body.username.strip(), body.email, hash_password(body.password), body.nome.strip(), body.role, body.corretora_id),
    )
    conn.commit()
    conn.close()
    log_action(admin["sub"], "criar_usuario", f"Usuário {body.username} ({body.role})")
    return {"ok": True}


@app.patch("/api/superadmin/users/{user_id}/toggle")
def toggle_usuario_superadmin(user_id: int, admin=Depends(require_superadmin)):
    conn = get_connection()
    row = conn.execute("SELECT ativo, role FROM users WHERE id = ?", (user_id,)).fetchone()
    if not row:
        conn.close()
        raise HTTPException(404, "Usuário não encontrado")
    if row["role"] == "superadmin":
        conn.close()
        raise HTTPException(400, "Não é possível alterar o super administrador")
    new_status = 0 if row["ativo"] else 1
    conn.execute("UPDATE users SET ativo = ? WHERE id = ?", (new_status, user_id))
    conn.commit()
    conn.close()
    return {"ativo": new_status}


@app.delete("/api/superadmin/users/{user_id}")
def deletar_usuario_superadmin(user_id: int, admin=Depends(require_superadmin)):
    conn = get_connection()
    row = conn.execute("SELECT role, username FROM users WHERE id = ?", (user_id,)).fetchone()
    if not row:
        conn.close()
        raise HTTPException(404, "Usuário não encontrado")
    if row["role"] == "superadmin":
        conn.close()
        raise HTTPException(400, "Não é possível remover o super administrador")
    conn.execute("DELETE FROM users WHERE id = ?", (user_id,))
    conn.commit()
    conn.close()
    log_action(admin["sub"], "deletar_usuario", f"Usuário {row['username']} removido")
    return {"ok": True}


# ── Superadmin: Auditoria ─────────────────────────────────────────────────────

@app.get("/api/superadmin/audit")
def listar_audit(admin=Depends(require_superadmin)):
    conn = get_connection()
    rows = conn.execute(
        "SELECT id, usuario, acao, detalhes, ip, criado_em FROM audit_log ORDER BY criado_em DESC LIMIT 500"
    ).fetchall()
    conn.close()
    return [dict(r) for r in rows]


# ── Admin da corretora ────────────────────────────────────────────────────────

@app.get("/api/admin/users")
def listar_usuarios_corretora(admin=Depends(require_admin)):
    corretora_id = admin.get("corretora_id")
    conn = get_connection()
    corretora = conn.execute(
        "SELECT nome, limite_usuarios FROM corretoras WHERE id = ?", (corretora_id,)
    ).fetchone() if corretora_id else None
    rows = conn.execute(
        "SELECT id, username, nome, email, ativo, criado_em FROM users WHERE corretora_id = ? AND role = 'corretor' ORDER BY criado_em DESC",
        (corretora_id,),
    ).fetchall()
    conn.close()
    return {
        "corretora": dict(corretora) if corretora else None,
        "usuarios": [dict(r) for r in rows],
        "total": len(rows),
        "limite": corretora["limite_usuarios"] if corretora else None,
    }


@app.post("/api/admin/users")
def criar_usuario_corretora(body: CreateUserRequest, admin=Depends(require_admin)):
    corretora_id = admin.get("corretora_id")
    validate_password(body.password)
    conn = get_connection()
    corretora = conn.execute(
        "SELECT limite_usuarios FROM corretoras WHERE id = ?", (corretora_id,)
    ).fetchone()
    if not corretora:
        conn.close()
        raise HTTPException(404, "Corretora não encontrada")
    count = conn.execute(
        "SELECT COUNT(*) as cnt FROM users WHERE corretora_id = ? AND role = 'corretor'",
        (corretora_id,),
    ).fetchone()
    if count["cnt"] >= corretora["limite_usuarios"]:
        conn.close()
        raise HTTPException(400, f"Limite de {corretora['limite_usuarios']} colaborador(es) atingido. Contrate mais vagas.")
    if conn.execute("SELECT id FROM users WHERE username = ?", (body.username.strip(),)).fetchone():
        conn.close()
        raise HTTPException(409, "Nome de usuário já cadastrado.")
    conn.execute(
        "INSERT INTO users (username, email, hashed_password, nome, role, corretora_id) VALUES (?, ?, ?, ?, 'corretor', ?)",
        (body.username.strip(), body.email, hash_password(body.password), body.nome.strip(), corretora_id),
    )
    conn.commit()
    conn.close()
    log_action(admin["sub"], "criar_corretor", f"Corretor {body.username} adicionado")
    return {"ok": True}


@app.patch("/api/admin/users/{user_id}/toggle")
def toggle_usuario_corretora(user_id: int, admin=Depends(require_admin)):
    corretora_id = admin.get("corretora_id")
    conn = get_connection()
    row = conn.execute(
        "SELECT ativo, corretora_id FROM users WHERE id = ? AND role = 'corretor'", (user_id,)
    ).fetchone()
    if not row:
        conn.close()
        raise HTTPException(404, "Usuário não encontrado")
    if corretora_id and row["corretora_id"] != corretora_id:
        conn.close()
        raise HTTPException(403, "Sem permissão para gerenciar este usuário")
    new_status = 0 if row["ativo"] else 1
    conn.execute("UPDATE users SET ativo = ? WHERE id = ?", (new_status, user_id))
    conn.commit()
    conn.close()
    return {"ativo": new_status}


@app.delete("/api/admin/users/{user_id}")
def deletar_usuario_corretora(user_id: int, admin=Depends(require_admin)):
    corretora_id = admin.get("corretora_id")
    conn = get_connection()
    row = conn.execute(
        "SELECT username, corretora_id FROM users WHERE id = ? AND role = 'corretor'", (user_id,)
    ).fetchone()
    if not row:
        conn.close()
        raise HTTPException(404, "Usuário não encontrado")
    if corretora_id and row["corretora_id"] != corretora_id:
        conn.close()
        raise HTTPException(403, "Sem permissão para remover este usuário")
    conn.execute("DELETE FROM users WHERE id = ?", (user_id,))
    conn.commit()
    conn.close()
    log_action(admin["sub"], "deletar_corretor", f"Corretor {row['username']} removido")
    return {"ok": True}


# ── Cotações ──────────────────────────────────────────────────────────────────

@app.post("/api/cotacoes")
def salvar_cotacao(body: CotacaoRequest, user=Depends(require_corretor)):
    conn = get_connection()
    conn.execute(
        "INSERT INTO cotacoes (usuario, corretora_id, cliente, dados) VALUES (?, ?, ?, ?)",
        (user["sub"], user.get("corretora_id"), body.cliente, json.dumps(body.dados, ensure_ascii=False)),
    )
    conn.commit()
    conn.close()
    return {"ok": True}


@app.get("/api/cotacoes")
def listar_cotacoes(user=Depends(require_corretor)):
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


# ── Static (deve ficar DEPOIS de todas as rotas /api) ─────────────────────────
app.mount("/", StaticFiles(directory=PROJECT_DIR, html=True), name="static")
