import json
import os
import re
import secrets
from datetime import date, datetime, timedelta, timezone
from typing import Optional

from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
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
    # Sessão única: verifica se o session_token ainda é o ativo no banco
    session_tok = payload.get("session_token")
    if session_tok:
        conn = get_connection()
        row = conn.execute(
            "SELECT session_token FROM users WHERE username = ?", (payload["sub"],)
        ).fetchone()
        conn.close()
        if not row or row["session_token"] != session_tok:
            raise HTTPException(401, "Sessão encerrada. Outro dispositivo fez login com esta conta.")
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
    seed_catalogo()


def seed_catalogo():
    conn = get_connection()
    cnt = conn.execute("SELECT COUNT(*) as cnt FROM operadoras").fetchone()
    if cnt["cnt"] > 0:
        conn.close()
        return

    _OPS = [
        ("unity",        "Unity Saúde",       "var(--unity)",        "on-u",  "Adm. Esplendor · Mai/2026 · Taxa assoc. R$ 5,00 · Assoc: UEB, UVA, UNIPRO, ANC, UNSP · Telemedicina gratuita", 1),
        ("evo",          "Evo Saúde",          "var(--evo)",          "on-e",  "Adm. Easyplan · Reajuste set/2026 · Odonto ODONTOGROUP incluso · Telemedicina 24h · Taxa assoc. R$ 5,00", 2),
        ("plenum",       "Plenum Saúde",       "var(--plenum)",       "on-p",  "Adm. Easyplan · Reajuste mar/2027 · Seguro Viagem AIG + UTI Móvel 24h · Sírio-Libanês (Sigma) · Taxa assoc. R$ 5,00", 3),
        ("amil",         "Amil",               "var(--amil)",         "on-a",  "Vigência mai/2026 · Amil Dental incluso 12 meses grátis (R$ 14,99/mês após) · Rede nacional · Reembolso disponível nos planos Platinum", 4),
        ("medsenior",    "MedSênior",          "var(--medsenior)",    "on-ms", "Vigência mai/2026 · Pessoa Física · Sem coparticipação · Rede Brasília · Coleta domiciliar Lab. MedSênior · Oficinas do Bem inclusas", 5),
        ("segurosunimed","Seguros Unimed",      "var(--seguros-unimed)","on-su","PME · Compulsório e Facultativo · 2–99 vidas · Rede DF + UE nacional · Essencial I/II/III/IV disponíveis", 6),
        ("portosaude",   "Porto Saúde",        "var(--portosaude)",   "on-ps", "PME · Planos Bronze / Prata / Ouro · Com e sem coparticipação parcial · Rede credenciada DF · Porto Seguro Saúde", 7),
        ("bradesco",     "Bradesco Saúde",     "var(--bradesco)",     "on-b",  "PME · Planos Nacionais · Tabela jan/2026 · Rede credenciada DF · Bradesco Seguros", 8),
        ("bestsenior",   "Best Sênior",        "var(--bestsenior)",   "on-bs", "PF e PME · Exclusivo 44+ · Tabela Mar-Abr/2026 · Rede credenciada DF · Best Sênior Saúde", 9),
        ("sulamerica",   "SulAmérica Saúde",   "var(--sulamerica)",   "on-sa", "PME Compulsório · Vigência 12m ou 24m · 3–99 vidas · Com e sem copart 30% · Rede credenciada DF · SulAmérica Seguro Saúde", 10),
    ]
    for chave, nome, cor, cls, info, ordem in _OPS:
        conn.execute(
            "INSERT INTO operadoras (chave, nome, cor, cls, info, ordem) VALUES (?, ?, ?, ?, ?, ?)",
            (chave, nome, cor, cls, info, ordem),
        )
    conn.commit()

    ops_map = {r["chave"]: r["id"] for r in conn.execute("SELECT id, chave FROM operadoras").fetchall()}

    # (codigo, op_chave, nome, aco, tipo, fvidas, mod, vig, precos, ordem)
    _PLANOS = [
        # UNITY (u3-u6 batem com dados.js; u1/u2 removidos pois não existem mais)
        ("u3","unity","Sem copart — Unity Vida","enf",None,None,None,None,[348.34,369.25,424.63,475.59,570.69,656.31,826.94,1017.15,1322.28,1917.30],1),
        ("u4","unity","Com copart — Unity Vida","enf",None,None,None,None,[248.94,263.88,303.46,339.87,407.85,469.02,590.97,726.90,944.97,1370.20],2),
        ("u5","unity","Sem copart — Unity Star","apt",None,None,None,None,[433.42,459.42,528.34,591.74,710.08,816.60,1028.91,1265.56,1645.23,2385.58],3),
        ("u6","unity","Com copart — Unity Star","apt",None,None,None,None,[371.26,393.54,452.57,506.88,608.25,699.46,881.36,1084.07,1409.30,2043.48],4),
        # EVO
        ("e1","evo","Sem copart — NOW Enfermaria","enf",None,None,None,None,[329.69,352.17,383.37,450.31,541.95,612.67,747.64,917.58,1233.41,1637.60],1),
        ("e2","evo","Com copart — ONE Enfermaria","enf",None,None,None,None,[249.30,266.30,289.90,340.52,409.81,463.29,565.35,693.86,932.68,1238.32],2),
        ("e3","evo","Com copart — NOW Enfermaria","enf",None,None,None,None,[286.68,306.24,333.37,391.58,471.26,532.76,650.13,797.90,1072.54,1424.01],3),
        ("e4","evo","Sem copart — NOW Apartamento","apt",None,None,None,None,[394.15,421.03,458.33,538.36,647.91,732.47,893.83,1097.00,1474.58,1957.80],4),
        ("e5","evo","Com copart — ONE Apartamento","apt",None,None,None,None,[292.74,312.71,340.41,399.85,481.22,544.02,663.86,814.76,1095.20,1454.10],5),
        ("e6","evo","Com copart — NOW Apartamento","apt",None,None,None,None,[348.80,372.59,405.60,476.42,573.37,648.20,790.99,970.79,1304.93,1732.56],6),
        # PLENUM
        ("p1","plenum","Copart parcial — Delta (Enf)","enf",None,None,None,None,[349.90,437.38,507.36,577.34,629.82,664.81,804.77,874.75,1084.69,1679.52],1),
        ("p2","plenum","Copart parcial — Ômega (Enf)","enf",None,None,None,None,[389.90,487.38,565.36,643.34,701.82,740.81,896.77,974.75,1208.69,1871.52],2),
        ("p3","plenum","Copart total — Delta (Enf)","enf",None,None,None,None,[269.90,337.38,391.36,445.34,485.82,512.81,620.77,674.75,836.69,1295.52],3),
        ("p4","plenum","Copart total — Ômega (Enf)","enf",None,None,None,None,[299.90,374.88,434.86,494.84,539.82,569.81,689.77,749.75,929.69,1439.52],4),
        ("p5","plenum","Copart parcial — Beta (Apt)","apt",None,None,None,None,[399.90,499.88,579.86,659.84,719.82,759.81,919.77,999.75,1239.69,1919.52],5),
        ("p6","plenum","Copart parcial — Sigma (Apt)","apt",None,None,None,None,[499.90,624.88,724.86,824.84,899.82,949.81,1149.77,1249.75,1549.69,2399.52],6),
        ("p7","plenum","Copart total — Beta (Apt)","apt",None,None,None,None,[309.90,387.38,449.36,511.34,557.82,588.81,712.77,774.75,960.69,1487.52],7),
        ("p8","plenum","Copart total — Sigma (Apt)","apt",None,None,None,None,[389.90,487.38,565.36,643.34,701.82,740.81,896.77,974.75,1208.69,1871.52],8),
        # AMIL — Adesão Copart. Completa (IDs batem com dados.js am_ad_ct_*)
        ("am_ad_ct_1", "amil","Copart. Completa — Bronze DF (Enf)","enf","adesao",None,None,None,[ 320.90, 435.79, 511.57, 511.57, 511.57,  571.43,  789.14,  942.24, 1354.94, 1921.31], 1),
        ("am_ad_ct_2", "amil","Copart. Completa — Bronze DF (Apt)","apt","adesao",None,None,None,[ 356.22, 483.74, 567.86, 567.86, 567.86,  634.31,  875.98, 1045.92, 1504.03, 2132.71], 2),
        ("am_ad_ct_3", "amil","Copart. Completa — Prata DF (Enf)", "enf","adesao",None,None,None,[ 448.22, 524.41, 639.79, 767.74, 806.12,  886.74, 1108.44, 1219.28, 1524.11, 2667.19], 3),
        ("am_ad_ct_4", "amil","Copart. Completa — Prata DF (Apt)", "apt","adesao",None,None,None,[ 497.52, 582.10, 710.15, 852.18, 894.80,  984.28, 1230.36, 1353.40, 1691.75, 2960.58], 4),
        ("am_ad_ct_5", "amil","Copart. Completa — Ouro (Enf)",     "enf","adesao",None,None,None,[ 500.09, 585.11, 713.83, 856.60, 899.42,  989.38, 1236.72, 1360.39, 1700.48, 2975.86], 5),
        ("am_ad_ct_6", "amil","Copart. Completa — Ouro (Apt)",     "apt","adesao",None,None,None,[ 555.10, 649.48, 792.35, 950.82, 998.36, 1098.19, 1372.74, 1510.02, 1887.53, 3303.18], 6),
        ("am_ad_ct_7", "amil","Copart. Completa — Platinum Mais R1 (Apt)","apt","adesao",None,None,None,[ 732.24, 856.72,1045.19,1254.24,1316.95, 1448.65, 1810.81, 1991.90, 2489.88, 4357.28], 7),
        ("am_ad_ct_8", "amil","Copart. Completa — Platinum Mais R2 (Apt)","apt","adesao",None,None,None,[ 739.48, 865.19,1055.54,1266.65,1330.00, 1462.99, 1828.75, 2011.62, 2514.52, 4400.42], 8),
        ("am_ad_ct_9", "amil","Copart. Completa — Platinum R1 (Apt)",     "apt","adesao",None,None,None,[ 589.22, 689.38, 841.04,1009.26,1059.73, 1165.70, 1457.12, 1602.84, 2003.56, 3506.22], 9),
        ("am_ad_ct_10","amil","Copart. Completa — Platinum R2 (Apt)",     "apt","adesao",None,None,None,[ 595.08, 696.24, 849.42,1019.30,1070.26, 1177.28, 1471.61, 1618.78, 2023.46, 3541.07],10),
        # AMIL — Adesão Copart. Parcial (IDs batem com dados.js am_ad_cp_*)
        ("am_ad_cp_1", "amil","Copart. Parcial — Bronze DF (Enf)","enf","adesao",None,None,None,[ 427.87, 581.05, 682.09, 682.09, 682.09,  761.89, 1052.17, 1256.29, 1806.55, 2561.69],11),
        ("am_ad_cp_2", "amil","Copart. Parcial — Bronze DF (Apt)","apt","adesao",None,None,None,[ 474.95, 644.98, 757.14, 757.14, 757.14,  845.72, 1167.95, 1394.53, 2005.33, 2843.56],12),
        ("am_ad_cp_3", "amil","Copart. Parcial — Prata DF (Enf)", "enf","adesao",None,None,None,[ 597.62, 699.22, 853.04,1023.65,1074.84, 1182.31, 1477.91, 1625.71, 2032.14, 3556.26],13),
        ("am_ad_cp_4", "amil","Copart. Parcial — Prata DF (Apt)", "apt","adesao",None,None,None,[ 663.36, 776.14, 946.87,1136.26,1193.06, 1312.38, 1640.48, 1804.54, 2255.68, 3947.45],14),
        ("am_ad_cp_5", "amil","Copart. Parcial — Ouro (Enf)",     "enf","adesao",None,None,None,[ 666.78, 780.12, 951.76,1142.10,1199.21, 1319.12, 1648.91, 1813.80, 2267.26, 3967.69],15),
        ("am_ad_cp_6", "amil","Copart. Parcial — Ouro (Apt)",     "apt","adesao",None,None,None,[ 740.11, 865.93,1056.43,1267.72,1331.10, 1464.20, 1830.26, 2013.29, 2516.62, 4404.08],16),
        ("am_ad_cp_7", "amil","Copart. Parcial — Platinum Mais R1 (Apt)","apt","adesao",None,None,None,[ 976.32,1142.28,1393.60,1672.32,1755.95, 1931.53, 2414.44, 2655.86, 3319.84, 5809.72],17),
        ("am_ad_cp_8", "amil","Copart. Parcial — Platinum Mais R2 (Apt)","apt","adesao",None,None,None,[ 985.99,1153.60,1407.40,1688.87,1773.34, 1950.66, 2438.34, 2682.17, 3352.69, 5867.23],18),
        ("am_ad_cp_9", "amil","Copart. Parcial — Platinum R1 (Apt)",     "apt","adesao",None,None,None,[ 785.62, 919.16,1121.39,1345.67,1412.94, 1554.24, 1942.81, 2137.09, 2671.37, 4674.90],19),
        ("am_ad_cp_10","amil","Copart. Parcial — Platinum R2 (Apt)",     "apt","adesao",None,None,None,[ 793.43, 928.31,1132.54,1359.04,1426.99, 1569.70, 1962.12, 2158.33, 2697.91, 4721.35],20),
    ]
    for i, (codigo, op_chave, nome, aco, tipo, fvidas, mod, vig, precos, ordem) in enumerate(_PLANOS):
        op_id = ops_map.get(op_chave)
        if not op_id:
            continue
        conn.execute(
            "INSERT INTO planos (codigo, operadora_id, nome, aco, tipo, fvidas, mod, vig, precos, ordem) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            (codigo, op_id, nome, aco, tipo, fvidas, mod, vig, json.dumps(precos), ordem),
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

class OperadoraRequest(BaseModel):
    chave: str
    nome: str
    cor: Optional[str] = None
    cls: Optional[str] = None
    info: Optional[str] = None
    ativo: Optional[int] = 1
    ordem: Optional[int] = 0

class UpdateOperadoraRequest(BaseModel):
    nome: Optional[str] = None
    cor: Optional[str] = None
    cls: Optional[str] = None
    info: Optional[str] = None
    ativo: Optional[int] = None
    ordem: Optional[int] = None

class PlanoRequest(BaseModel):
    codigo: str
    operadora_id: int
    nome: str
    aco: str
    tipo: Optional[str] = None
    fvidas: Optional[str] = None
    mod: Optional[str] = None
    vig: Optional[int] = None
    precos: list
    ativo: Optional[int] = 1
    ordem: Optional[int] = 0

class UpdatePlanoRequest(BaseModel):
    nome: Optional[str] = None
    aco: Optional[str] = None
    tipo: Optional[str] = None
    fvidas: Optional[str] = None
    mod: Optional[str] = None
    vig: Optional[int] = None
    precos: Optional[list] = None
    ativo: Optional[int] = None
    ordem: Optional[int] = None


class RedeItemRequest(BaseModel):
    operadora_id: int
    grupo: str = ""
    grupo_ordem: int = 0
    nome: str
    local: Optional[str] = None
    tags: Optional[list] = None
    obs: Optional[str] = None
    tag_extra: Optional[dict] = None
    ordem: int = 0
    ativo: int = 1


class UpdateRedeItemRequest(BaseModel):
    grupo: Optional[str] = None
    grupo_ordem: Optional[int] = None
    nome: Optional[str] = None
    local: Optional[str] = None
    tags: Optional[list] = None
    obs: Optional[str] = None
    tag_extra: Optional[dict] = None
    ordem: Optional[int] = None
    ativo: Optional[int] = None


class RedeMetaRequest(BaseModel):
    rede_adm: Optional[str] = None
    rede_rodape: Optional[str] = None


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

    # Reseta tentativas e grava novo session_token (invalida sessões anteriores)
    session_tok = secrets.token_hex(32)
    conn.execute(
        "UPDATE users SET tentativas_login = 0, bloqueado_ate = NULL, session_token = ? WHERE username = ?",
        (session_tok, req.username.strip()),
    )
    conn.commit()
    conn.close()

    log_action(req.username, "login", "Login bem-sucedido", ip)

    token = create_access_token({
        "sub": req.username.strip(),
        "nome": row["nome"],
        "role": row["role"],
        "corretora_id": row["corretora_id"],
        "session_token": session_tok,
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


@app.post("/api/logout")
def logout(user=Depends(get_current_user)):
    conn = get_connection()
    conn.execute("UPDATE users SET session_token = NULL WHERE username = ?", (user["sub"],))
    conn.commit()
    conn.close()
    log_action(user["sub"], "logout", "Sessão encerrada")
    return {"ok": True}


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


# ── Catálogo público (usado pelo cotador) ─────────────────────────────────────

FAIXAS = ['0 a 18','19 a 23','24 a 28','29 a 33','34 a 38','39 a 43','44 a 48','49 a 53','54 a 58','59 ou mais']

@app.get("/api/catalogo")
def catalogo_publico():
    conn = get_connection()
    ops_rows = conn.execute(
        "SELECT id, chave, nome, cor, cls, info, rede_adm, rede_rodape FROM operadoras WHERE ativo = 1 ORDER BY ordem, id"
    ).fetchall()
    planos_rows = conn.execute(
        """SELECT p.codigo, o.chave as op, p.nome, p.aco, p.tipo, p.fvidas, p.mod, p.vig, p.precos
           FROM planos p JOIN operadoras o ON p.operadora_id = o.id
           WHERE p.ativo = 1 AND o.ativo = 1
           ORDER BY o.ordem, p.ordem, p.id"""
    ).fetchall()
    rede_rows = conn.execute(
        """SELECT rc.grupo, rc.grupo_ordem, rc.nome, rc.local, rc.tags, rc.obs, rc.tag_extra, rc.ordem, o.chave as op_chave
           FROM rede_credenciada rc JOIN operadoras o ON rc.operadora_id = o.id
           WHERE rc.ativo = 1 AND o.ativo = 1
           ORDER BY o.ordem, rc.grupo_ordem, rc.ordem, rc.id"""
    ).fetchall()
    conn.close()
    operadoras = {r["chave"]: {"nome": r["nome"], "cor": r["cor"] or "", "cls": r["cls"] or "", "info": r["info"] or ""} for r in ops_rows}
    planos = []
    for r in planos_rows:
        p = {
            "id":     r["codigo"],
            "op":     r["op"],
            "nome":   r["nome"],
            "aco":    r["aco"],
            "tipo":   r["tipo"] or "adesao",
            "precos": json.loads(r["precos"]),
        }
        if r["fvidas"]: p["fvidas"] = r["fvidas"]
        if r["mod"]:    p["mod"] = r["mod"]
        if r["vig"]:    p["vig"] = r["vig"]
        planos.append(p)
    # Build rede dict only when there are rows in the DB
    rede = {}
    if rede_rows:
        op_meta_map = {r["chave"]: r for r in ops_rows}
        for r in rede_rows:
            op = r["op_chave"]
            if op not in rede:
                meta = op_meta_map.get(op, {})
                rede[op] = {
                    "adm": (meta["rede_adm"] or "") if meta else "",
                    "grupos": [],
                    "rodape": (meta["rede_rodape"] or "") if meta else "",
                }
            grupo_titulo = r["grupo"] or ""
            grupos = rede[op]["grupos"]
            existing = next((g for g in grupos if g["titulo"] == grupo_titulo), None)
            if not existing:
                existing = {"titulo": grupo_titulo, "itens": []}
                grupos.append(existing)
            item = {"nome": r["nome"]}
            if r["local"]:     item["local"] = r["local"]
            if r["tags"]:      item["tags"] = json.loads(r["tags"])
            if r["obs"]:       item["obs"] = r["obs"]
            if r["tag_extra"]: item["tagExtra"] = json.loads(r["tag_extra"])
            existing["itens"].append(item)
    return {"faixas": FAIXAS, "operadoras": operadoras, "planos": planos, "rede": rede}


# ── Superadmin: Catálogo — Operadoras ─────────────────────────────────────────

@app.get("/api/superadmin/catalogo/operadoras")
def listar_operadoras(admin=Depends(require_superadmin)):
    conn = get_connection()
    rows = conn.execute("SELECT * FROM operadoras ORDER BY ordem, id").fetchall()
    result = []
    for r in rows:
        d = dict(r)
        cnt = conn.execute("SELECT COUNT(*) as cnt FROM planos WHERE operadora_id = ?", (d["id"],)).fetchone()
        d["total_planos"] = cnt["cnt"]
        result.append(d)
    conn.close()
    return result

@app.post("/api/superadmin/catalogo/operadoras")
def criar_operadora(body: OperadoraRequest, admin=Depends(require_superadmin)):
    conn = get_connection()
    if conn.execute("SELECT id FROM operadoras WHERE chave = ?", (body.chave.strip(),)).fetchone():
        conn.close()
        raise HTTPException(409, "Chave de operadora já existe.")
    conn.execute(
        "INSERT INTO operadoras (chave, nome, cor, cls, info, ativo, ordem) VALUES (?, ?, ?, ?, ?, ?, ?)",
        (body.chave.strip(), body.nome.strip(), body.cor, body.cls, body.info, body.ativo, body.ordem),
    )
    conn.commit()
    row = conn.execute("SELECT * FROM operadoras WHERE chave = ?", (body.chave.strip(),)).fetchone()
    conn.close()
    log_action(admin["sub"], "criar_operadora", f"Operadora: {body.nome}")
    return dict(row)

@app.patch("/api/superadmin/catalogo/operadoras/{op_id}")
def atualizar_operadora(op_id: int, body: UpdateOperadoraRequest, admin=Depends(require_superadmin)):
    conn = get_connection()
    if not conn.execute("SELECT id FROM operadoras WHERE id = ?", (op_id,)).fetchone():
        conn.close()
        raise HTTPException(404, "Operadora não encontrada")
    updates, params = [], []
    for field in ("nome", "cor", "cls", "info", "ativo", "ordem"):
        val = getattr(body, field)
        if val is not None:
            updates.append(f"{field} = ?"); params.append(val.strip() if isinstance(val, str) else val)
    if updates:
        params.append(op_id)
        conn.execute(f"UPDATE operadoras SET {', '.join(updates)} WHERE id = ?", params)
        conn.commit()
    conn.close()
    return {"ok": True}

@app.delete("/api/superadmin/catalogo/operadoras/{op_id}")
def deletar_operadora(op_id: int, admin=Depends(require_superadmin)):
    conn = get_connection()
    row = conn.execute("SELECT nome FROM operadoras WHERE id = ?", (op_id,)).fetchone()
    if not row:
        conn.close()
        raise HTTPException(404, "Operadora não encontrada")
    conn.execute("DELETE FROM planos WHERE operadora_id = ?", (op_id,))
    conn.execute("DELETE FROM operadoras WHERE id = ?", (op_id,))
    conn.commit()
    conn.close()
    log_action(admin["sub"], "deletar_operadora", f"Operadora {row['nome']} removida")
    return {"ok": True}


# ── Superadmin: Catálogo — Planos ─────────────────────────────────────────────

@app.get("/api/superadmin/catalogo/planos")
def listar_planos(admin=Depends(require_superadmin)):
    conn = get_connection()
    rows = conn.execute(
        """SELECT p.*, o.nome as op_nome, o.chave as op_chave
           FROM planos p JOIN operadoras o ON p.operadora_id = o.id
           ORDER BY o.ordem, p.ordem, p.id"""
    ).fetchall()
    conn.close()
    result = []
    for r in rows:
        d = dict(r)
        d["precos"] = json.loads(d["precos"])
        result.append(d)
    return result

@app.post("/api/superadmin/catalogo/planos")
def criar_plano(body: PlanoRequest, admin=Depends(require_superadmin)):
    if len(body.precos) != 10:
        raise HTTPException(400, "precos deve ter exatamente 10 valores (um por faixa etária)")
    conn = get_connection()
    if conn.execute("SELECT id FROM planos WHERE codigo = ?", (body.codigo.strip(),)).fetchone():
        conn.close()
        raise HTTPException(409, "Código de plano já existe.")
    conn.execute(
        "INSERT INTO planos (codigo, operadora_id, nome, aco, tipo, fvidas, mod, vig, precos, ativo, ordem) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        (body.codigo.strip(), body.operadora_id, body.nome.strip(), body.aco, body.tipo, body.fvidas, body.mod, body.vig, json.dumps(body.precos), body.ativo, body.ordem),
    )
    conn.commit()
    conn.close()
    log_action(admin["sub"], "criar_plano", f"Plano {body.codigo} — {body.nome}")
    return {"ok": True}

@app.patch("/api/superadmin/catalogo/planos/{plano_id}")
def atualizar_plano(plano_id: int, body: UpdatePlanoRequest, admin=Depends(require_superadmin)):
    conn = get_connection()
    if not conn.execute("SELECT id FROM planos WHERE id = ?", (plano_id,)).fetchone():
        conn.close()
        raise HTTPException(404, "Plano não encontrado")
    if body.precos is not None and len(body.precos) != 10:
        conn.close()
        raise HTTPException(400, "precos deve ter exatamente 10 valores")
    updates, params = [], []
    for field in ("nome", "aco", "tipo", "fvidas", "mod", "vig", "ativo", "ordem"):
        val = getattr(body, field)
        if val is not None:
            updates.append(f"{field} = ?"); params.append(val.strip() if isinstance(val, str) else val)
    if body.precos is not None:
        updates.append("precos = ?"); params.append(json.dumps(body.precos))
    if updates:
        params.append(plano_id)
        conn.execute(f"UPDATE planos SET {', '.join(updates)} WHERE id = ?", params)
        conn.commit()
    conn.close()
    return {"ok": True}

@app.delete("/api/superadmin/catalogo/planos/{plano_id}")
def deletar_plano(plano_id: int, admin=Depends(require_superadmin)):
    conn = get_connection()
    row = conn.execute("SELECT codigo, nome FROM planos WHERE id = ?", (plano_id,)).fetchone()
    if not row:
        conn.close()
        raise HTTPException(404, "Plano não encontrado")
    conn.execute("DELETE FROM planos WHERE id = ?", (plano_id,))
    conn.commit()
    conn.close()
    log_action(admin["sub"], "deletar_plano", f"Plano {row['codigo']} removido")
    return {"ok": True}


@app.patch("/api/superadmin/catalogo/operadoras/{op_id}/toggle")
def toggle_operadora(op_id: int, admin=Depends(require_superadmin)):
    conn = get_connection()
    row = conn.execute("SELECT ativo FROM operadoras WHERE id = ?", (op_id,)).fetchone()
    if not row:
        conn.close()
        raise HTTPException(404, "Operadora não encontrada")
    new_status = 0 if row["ativo"] else 1
    conn.execute("UPDATE operadoras SET ativo = ? WHERE id = ?", (new_status, op_id))
    conn.commit()
    conn.close()
    return {"ativo": new_status}


@app.patch("/api/superadmin/catalogo/planos/{plano_id}/toggle")
def toggle_plano(plano_id: int, admin=Depends(require_superadmin)):
    conn = get_connection()
    row = conn.execute("SELECT ativo FROM planos WHERE id = ?", (plano_id,)).fetchone()
    if not row:
        conn.close()
        raise HTTPException(404, "Plano não encontrado")
    new_status = 0 if row["ativo"] else 1
    conn.execute("UPDATE planos SET ativo = ? WHERE id = ?", (new_status, plano_id))
    conn.commit()
    conn.close()
    return {"ativo": new_status}


# ── Superadmin: Catálogo — Rede Credenciada ───────────────────────────────────

@app.get("/api/superadmin/catalogo/rede")
def listar_rede(operadora_id: Optional[int] = None, admin=Depends(require_superadmin)):
    conn = get_connection()
    if operadora_id:
        rows = conn.execute(
            "SELECT * FROM rede_credenciada WHERE operadora_id = ? ORDER BY grupo_ordem, ordem, id",
            (operadora_id,)
        ).fetchall()
    else:
        rows = conn.execute(
            "SELECT * FROM rede_credenciada ORDER BY operadora_id, grupo_ordem, ordem, id"
        ).fetchall()
    conn.close()
    result = []
    for r in rows:
        d = dict(r)
        if d.get("tags"):      d["tags"]      = json.loads(d["tags"])
        if d.get("tag_extra"): d["tag_extra"]  = json.loads(d["tag_extra"])
        result.append(d)
    return result

@app.post("/api/superadmin/catalogo/rede")
def criar_rede_item(body: RedeItemRequest, admin=Depends(require_superadmin)):
    conn = get_connection()
    if not conn.execute("SELECT id FROM operadoras WHERE id = ?", (body.operadora_id,)).fetchone():
        conn.close()
        raise HTTPException(404, "Operadora não encontrada")
    conn.execute(
        """INSERT INTO rede_credenciada
           (operadora_id, grupo, grupo_ordem, nome, local, tags, obs, tag_extra, ordem, ativo)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
        (
            body.operadora_id, body.grupo, body.grupo_ordem, body.nome.strip(),
            body.local, json.dumps(body.tags) if body.tags is not None else None,
            body.obs,  json.dumps(body.tag_extra) if body.tag_extra is not None else None,
            body.ordem, body.ativo,
        ),
    )
    conn.commit()
    conn.close()
    log_action(admin["sub"], "criar_rede_item", f"Rede op={body.operadora_id} item={body.nome}")
    return {"ok": True}

@app.patch("/api/superadmin/catalogo/rede/{item_id}")
def atualizar_rede_item(item_id: int, body: UpdateRedeItemRequest, admin=Depends(require_superadmin)):
    conn = get_connection()
    if not conn.execute("SELECT id FROM rede_credenciada WHERE id = ?", (item_id,)).fetchone():
        conn.close()
        raise HTTPException(404, "Item de rede não encontrado")
    updates, params = [], []
    for field in ("grupo", "grupo_ordem", "nome", "local", "obs", "ordem", "ativo"):
        val = getattr(body, field)
        if val is not None:
            updates.append(f"{field} = ?"); params.append(val.strip() if isinstance(val, str) else val)
    if body.tags is not None:
        updates.append("tags = ?"); params.append(json.dumps(body.tags))
    if body.tag_extra is not None:
        updates.append("tag_extra = ?"); params.append(json.dumps(body.tag_extra))
    if updates:
        params.append(item_id)
        conn.execute(f"UPDATE rede_credenciada SET {', '.join(updates)} WHERE id = ?", params)
        conn.commit()
    conn.close()
    return {"ok": True}

@app.delete("/api/superadmin/catalogo/rede/{item_id}")
def deletar_rede_item(item_id: int, admin=Depends(require_superadmin)):
    conn = get_connection()
    row = conn.execute("SELECT nome FROM rede_credenciada WHERE id = ?", (item_id,)).fetchone()
    if not row:
        conn.close()
        raise HTTPException(404, "Item de rede não encontrado")
    conn.execute("DELETE FROM rede_credenciada WHERE id = ?", (item_id,))
    conn.commit()
    conn.close()
    log_action(admin["sub"], "deletar_rede_item", f"Rede item={row['nome']} removido")
    return {"ok": True}

@app.patch("/api/superadmin/catalogo/operadoras/{op_id}/rede-meta")
def atualizar_rede_meta(op_id: int, body: RedeMetaRequest, admin=Depends(require_superadmin)):
    conn = get_connection()
    if not conn.execute("SELECT id FROM operadoras WHERE id = ?", (op_id,)).fetchone():
        conn.close()
        raise HTTPException(404, "Operadora não encontrada")
    updates, params = [], []
    if body.rede_adm is not None:
        updates.append("rede_adm = ?"); params.append(body.rede_adm)
    if body.rede_rodape is not None:
        updates.append("rede_rodape = ?"); params.append(body.rede_rodape)
    if updates:
        params.append(op_id)
        conn.execute(f"UPDATE operadoras SET {', '.join(updates)} WHERE id = ?", params)
        conn.commit()
    conn.close()
    return {"ok": True}


# ── Superadmin: Importar catálogo em lote (dados.js → DB) ─────────────────────

@app.post("/api/superadmin/catalogo/importar")
async def importar_catalogo(request: Request, admin=Depends(require_superadmin)):
    try:
        body = await request.json()
    except Exception:
        raise HTTPException(400, "JSON inválido no corpo da requisição")
    operadoras = body.get("operadoras") or []
    planos     = body.get("planos")     or []
    if not isinstance(operadoras, list) or not isinstance(planos, list):
        raise HTTPException(400, "Campos 'operadoras' e 'planos' devem ser listas")
    conn = get_connection()
    ops_novas = 0
    planos_novos = 0
    for i, op in enumerate(operadoras):
        if not isinstance(op, dict):
            continue
        chave = str(op.get("chave") or "").strip()
        if not chave:
            continue
        if not conn.execute("SELECT id FROM operadoras WHERE chave = ?", (chave,)).fetchone():
            conn.execute(
                "INSERT INTO operadoras (chave, nome, cor, cls, info, ordem) VALUES (?, ?, ?, ?, ?, ?)",
                (chave, str(op.get("nome","") or ""), str(op.get("cor","") or ""),
                 str(op.get("cls","") or ""), str(op.get("info","") or ""), int(op.get("ordem", i+1) or 0)),
            )
            ops_novas += 1
    conn.commit()
    ops_map = {r["chave"]: r["id"] for r in conn.execute("SELECT id, chave FROM operadoras").fetchall()}
    for i, pl in enumerate(planos):
        if not isinstance(pl, dict):
            continue
        codigo   = str(pl.get("codigo")   or "").strip()
        op_chave = str(pl.get("op_chave") or "").strip()
        if not codigo or not op_chave:
            continue
        op_id = ops_map.get(op_chave)
        if not op_id:
            continue
        if not conn.execute("SELECT id FROM planos WHERE codigo = ?", (codigo,)).fetchone():
            precos = pl.get("precos") or []
            vig_val = pl.get("vig")
            try:
                vig_int = int(vig_val) if vig_val is not None else None
            except (ValueError, TypeError):
                vig_int = None
            conn.execute(
                "INSERT INTO planos (codigo, operadora_id, nome, aco, tipo, fvidas, mod, vig, precos, ordem) "
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                (codigo, op_id, str(pl.get("nome","") or ""), str(pl.get("aco","enf") or "enf"),
                 pl.get("tipo") or None, pl.get("fvidas") or None,
                 pl.get("mod") or None, vig_int,
                 json.dumps(precos), int(pl.get("ordem", i+1) or 0)),
            )
            planos_novos += 1
    conn.commit()
    conn.close()
    log_action(admin["sub"], "importar_catalogo", f"{ops_novas} operadoras e {planos_novos} planos importados")
    return {"ok": True, "ops_novas": ops_novas, "planos_novos": planos_novos}


# ── Redirects para caminhos antigos (raiz → app/) ─────────────────────────────

@app.get("/cotador-planos-saude.html")
async def _r_cotador():
    return RedirectResponse("/app/cotador-planos-saude.html", status_code=301)

@app.get("/sistema-saude-prime.html")
async def _r_sistema():
    return RedirectResponse("/app/sistema-saude-prime.html", status_code=301)

@app.get("/apresentacao-executiva.html")
async def _r_apresentacao():
    return RedirectResponse("/app/apresentacao-executiva.html", status_code=301)

@app.get("/dados.js")
async def _r_dados():
    return RedirectResponse("/app/dados.js", status_code=301)


# ── Static (deve ficar DEPOIS de todas as rotas /api) ─────────────────────────
app.mount("/", StaticFiles(directory=PROJECT_DIR, html=True), name="static")
