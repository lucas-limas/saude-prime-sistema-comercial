import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "saude_prime.db")

def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_connection()
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
    # migração segura: adiciona coluna role se não existir
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
