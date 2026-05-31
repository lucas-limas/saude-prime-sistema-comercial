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
            def close(self):
                self._pg.close()

        return _Conn()

    conn = sqlite3.connect(os.path.join(os.path.dirname(__file__), "saude_prime.db"))
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_connection()

    if DATABASE_URL:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username TEXT UNIQUE NOT NULL,
                hashed_password TEXT NOT NULL,
                nome TEXT,
                role TEXT DEFAULT 'corretor',
                ativo INTEGER DEFAULT 1,
                criado_em TEXT DEFAULT TO_CHAR(NOW(), 'YYYY-MM-DD HH24:MI:SS')
            )
        """)
        conn.execute("""
            CREATE TABLE IF NOT EXISTS cotacoes (
                id SERIAL PRIMARY KEY,
                usuario TEXT NOT NULL,
                cliente TEXT,
                dados TEXT,
                criado_em TEXT DEFAULT TO_CHAR(NOW(), 'YYYY-MM-DD HH24:MI:SS')
            )
        """)
    else:
        c = conn.cursor()
        c.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                hashed_password TEXT NOT NULL,
                nome TEXT,
                role TEXT DEFAULT 'corretor',
                ativo INTEGER DEFAULT 1,
                criado_em TEXT DEFAULT CURRENT_TIMESTAMP
            )
        """)
        try:
            c.execute("ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'corretor'")
        except Exception:
            pass
        c.execute("""
            CREATE TABLE IF NOT EXISTS cotacoes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                usuario TEXT NOT NULL,
                cliente TEXT,
                dados TEXT,
                criado_em TEXT DEFAULT CURRENT_TIMESTAMP
            )
        """)

    conn.commit()
    conn.close()
