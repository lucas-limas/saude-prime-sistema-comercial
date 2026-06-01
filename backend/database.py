import os
import sqlite3

DATABASE_URL = os.environ.get("DATABASE_URL")


def get_connection():
    if DATABASE_URL:
        import psycopg2
        from psycopg2.extras import RealDictCursor

        class _Result:
            def __init__(self, c):
                self._c = c
            def fetchone(self):
                return self._c.fetchone()
            def fetchall(self):
                return self._c.fetchall()

        class _Conn:
            def __init__(self):
                self._pg = psycopg2.connect(DATABASE_URL, cursor_factory=RealDictCursor)
            def execute(self, sql, params=()):
                c = self._pg.cursor()
                c.execute(sql.replace("?", "%s"), params or ())
                return _Result(c)
            def commit(self):
                self._pg.commit()
            def rollback(self):
                self._pg.rollback()
            def close(self):
                self._pg.close()

        return _Conn()

    conn = sqlite3.connect(os.path.join(os.path.dirname(__file__), "saude_prime.db"))
    conn.row_factory = sqlite3.Row
    return conn


def _migrations_pg(conn):
    safe = [
        "ALTER TABLE users ADD COLUMN email TEXT",
        "ALTER TABLE users ADD COLUMN corretora_id INTEGER",
        "ALTER TABLE users ADD COLUMN tentativas_login INTEGER DEFAULT 0",
        "ALTER TABLE users ADD COLUMN bloqueado_ate TEXT",
        "ALTER TABLE users ADD COLUMN session_token TEXT",
        "ALTER TABLE cotacoes ADD COLUMN corretora_id INTEGER",
    ]
    for sql in safe:
        try:
            conn.execute(sql)
            conn.commit()
        except Exception:
            # psycopg2 coloca a conexão em estado "aborted" ao falhar;
            # é preciso fazer rollback para liberar a próxima migração.
            try:
                conn.rollback()
            except Exception:
                pass


def _migrations_sqlite(c):
    safe = [
        "ALTER TABLE users ADD COLUMN email TEXT",
        "ALTER TABLE users ADD COLUMN corretora_id INTEGER",
        "ALTER TABLE users ADD COLUMN tentativas_login INTEGER DEFAULT 0",
        "ALTER TABLE users ADD COLUMN bloqueado_ate TEXT",
        "ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'corretor'",
        "ALTER TABLE users ADD COLUMN session_token TEXT",
        "ALTER TABLE cotacoes ADD COLUMN corretora_id INTEGER",
    ]
    for sql in safe:
        try:
            c.execute(sql)
        except Exception:
            pass


def init_db():
    conn = get_connection()

    if DATABASE_URL:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS corretoras (
                id SERIAL PRIMARY KEY,
                nome TEXT NOT NULL,
                limite_usuarios INTEGER DEFAULT 5,
                data_expiracao TEXT NOT NULL,
                ativo INTEGER DEFAULT 1,
                criado_em TEXT DEFAULT TO_CHAR(NOW(), 'YYYY-MM-DD HH24:MI:SS')
            )
        """)
        conn.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username TEXT UNIQUE NOT NULL,
                email TEXT UNIQUE,
                hashed_password TEXT NOT NULL,
                nome TEXT,
                role TEXT DEFAULT 'corretor',
                corretora_id INTEGER REFERENCES corretoras(id) ON DELETE CASCADE,
                ativo INTEGER DEFAULT 1,
                tentativas_login INTEGER DEFAULT 0,
                bloqueado_ate TEXT,
                criado_em TEXT DEFAULT TO_CHAR(NOW(), 'YYYY-MM-DD HH24:MI:SS')
            )
        """)
        conn.execute("""
            CREATE TABLE IF NOT EXISTS cotacoes (
                id SERIAL PRIMARY KEY,
                usuario TEXT NOT NULL,
                corretora_id INTEGER,
                cliente TEXT,
                dados TEXT,
                criado_em TEXT DEFAULT TO_CHAR(NOW(), 'YYYY-MM-DD HH24:MI:SS')
            )
        """)
        conn.execute("""
            CREATE TABLE IF NOT EXISTS audit_log (
                id SERIAL PRIMARY KEY,
                usuario TEXT,
                acao TEXT NOT NULL,
                detalhes TEXT,
                ip TEXT,
                criado_em TEXT DEFAULT TO_CHAR(NOW(), 'YYYY-MM-DD HH24:MI:SS')
            )
        """)
        conn.execute("""
            CREATE TABLE IF NOT EXISTS operadoras (
                id SERIAL PRIMARY KEY,
                chave TEXT UNIQUE NOT NULL,
                nome TEXT NOT NULL,
                cor TEXT,
                cls TEXT,
                info TEXT,
                ativo INTEGER DEFAULT 1,
                ordem INTEGER DEFAULT 0,
                criado_em TEXT DEFAULT TO_CHAR(NOW(), 'YYYY-MM-DD HH24:MI:SS')
            )
        """)
        conn.execute("""
            CREATE TABLE IF NOT EXISTS planos (
                id SERIAL PRIMARY KEY,
                codigo TEXT UNIQUE NOT NULL,
                operadora_id INTEGER REFERENCES operadoras(id) ON DELETE CASCADE,
                nome TEXT NOT NULL,
                aco TEXT NOT NULL,
                tipo TEXT,
                fvidas INTEGER,
                mod TEXT,
                vig INTEGER,
                precos TEXT NOT NULL,
                ativo INTEGER DEFAULT 1,
                ordem INTEGER DEFAULT 0,
                criado_em TEXT DEFAULT TO_CHAR(NOW(), 'YYYY-MM-DD HH24:MI:SS')
            )
        """)
        conn.commit()
        _migrations_pg(conn)
    else:
        c = conn.cursor()
        c.execute("""
            CREATE TABLE IF NOT EXISTS corretoras (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome TEXT NOT NULL,
                limite_usuarios INTEGER DEFAULT 5,
                data_expiracao TEXT NOT NULL,
                ativo INTEGER DEFAULT 1,
                criado_em TEXT DEFAULT CURRENT_TIMESTAMP
            )
        """)
        c.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                email TEXT UNIQUE,
                hashed_password TEXT NOT NULL,
                nome TEXT,
                role TEXT DEFAULT 'corretor',
                corretora_id INTEGER,
                ativo INTEGER DEFAULT 1,
                tentativas_login INTEGER DEFAULT 0,
                bloqueado_ate TEXT,
                criado_em TEXT DEFAULT CURRENT_TIMESTAMP
            )
        """)
        c.execute("""
            CREATE TABLE IF NOT EXISTS cotacoes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                usuario TEXT NOT NULL,
                corretora_id INTEGER,
                cliente TEXT,
                dados TEXT,
                criado_em TEXT DEFAULT CURRENT_TIMESTAMP
            )
        """)
        c.execute("""
            CREATE TABLE IF NOT EXISTS audit_log (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                usuario TEXT,
                acao TEXT NOT NULL,
                detalhes TEXT,
                ip TEXT,
                criado_em TEXT DEFAULT CURRENT_TIMESTAMP
            )
        """)
        c.execute("""
            CREATE TABLE IF NOT EXISTS operadoras (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                chave TEXT UNIQUE NOT NULL,
                nome TEXT NOT NULL,
                cor TEXT,
                cls TEXT,
                info TEXT,
                ativo INTEGER DEFAULT 1,
                ordem INTEGER DEFAULT 0,
                criado_em TEXT DEFAULT CURRENT_TIMESTAMP
            )
        """)
        c.execute("""
            CREATE TABLE IF NOT EXISTS planos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                codigo TEXT UNIQUE NOT NULL,
                operadora_id INTEGER REFERENCES operadoras(id) ON DELETE CASCADE,
                nome TEXT NOT NULL,
                aco TEXT NOT NULL,
                tipo TEXT,
                fvidas INTEGER,
                mod TEXT,
                vig INTEGER,
                precos TEXT NOT NULL,
                ativo INTEGER DEFAULT 1,
                ordem INTEGER DEFAULT 0,
                criado_em TEXT DEFAULT CURRENT_TIMESTAMP
            )
        """)
        _migrations_sqlite(c)
        conn.commit()

    conn.close()
