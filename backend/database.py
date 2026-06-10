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
        # fvidas deve ser TEXT (ex: '02-29', '05-29', '30-99'), não INTEGER
        "ALTER TABLE planos ALTER COLUMN fvidas TYPE TEXT USING fvidas::TEXT",
        # Renomeia códigos Amil para bater com IDs de dados.js (mapeamento por preço)
        "UPDATE planos SET codigo = 'am_ad_ct_1'  WHERE codigo = 'a1'",
        "UPDATE planos SET codigo = 'am_ad_ct_2'  WHERE codigo = 'a2'",
        "UPDATE planos SET codigo = 'am_ad_ct_3'  WHERE codigo = 'a3'",
        "UPDATE planos SET codigo = 'am_ad_ct_4'  WHERE codigo = 'a4'",
        "UPDATE planos SET codigo = 'am_ad_ct_5'  WHERE codigo = 'a5'",
        "UPDATE planos SET codigo = 'am_ad_ct_6'  WHERE codigo = 'a6'",
        "UPDATE planos SET codigo = 'am_ad_ct_9'  WHERE codigo = 'a7'",
        "UPDATE planos SET codigo = 'am_ad_ct_10' WHERE codigo = 'a8'",
        "UPDATE planos SET codigo = 'am_ad_ct_7'  WHERE codigo = 'a9'",
        "UPDATE planos SET codigo = 'am_ad_ct_8'  WHERE codigo = 'a10'",
        "UPDATE planos SET codigo = 'am_ad_cp_1'  WHERE codigo = 'a11'",
        "UPDATE planos SET codigo = 'am_ad_cp_2'  WHERE codigo = 'a12'",
        "UPDATE planos SET codigo = 'am_ad_cp_3'  WHERE codigo = 'a13'",
        "UPDATE planos SET codigo = 'am_ad_cp_4'  WHERE codigo = 'a14'",
        "UPDATE planos SET codigo = 'am_ad_cp_5'  WHERE codigo = 'a15'",
        "UPDATE planos SET codigo = 'am_ad_cp_6'  WHERE codigo = 'a16'",
        "UPDATE planos SET codigo = 'am_ad_cp_9'  WHERE codigo = 'a17'",
        "UPDATE planos SET codigo = 'am_ad_cp_10' WHERE codigo = 'a18'",
        "UPDATE planos SET codigo = 'am_ad_cp_7'  WHERE codigo = 'a19'",
        "UPDATE planos SET codigo = 'am_ad_cp_8'  WHERE codigo = 'a20'",
        # Desativa planos Unity Life Vital (u1/u2) removidos do dados.js
        "UPDATE planos SET ativo = 0 WHERE codigo IN ('u1', 'u2')",
        # Rede credenciada: metadados na tabela operadoras
        "ALTER TABLE operadoras ADD COLUMN rede_adm TEXT",
        "ALTER TABLE operadoras ADD COLUMN rede_rodape TEXT",
        # Etapa 2: atualizado_em em todas as tabelas existentes
        "ALTER TABLE corretoras ADD COLUMN atualizado_em TEXT",
        "ALTER TABLE users ADD COLUMN atualizado_em TEXT",
        "ALTER TABLE cotacoes ADD COLUMN atualizado_em TEXT",
        "ALTER TABLE audit_log ADD COLUMN atualizado_em TEXT",
        "ALTER TABLE operadoras ADD COLUMN atualizado_em TEXT",
        "ALTER TABLE planos ADD COLUMN atualizado_em TEXT",
        "ALTER TABLE rede_credenciada ADD COLUMN atualizado_em TEXT",
        # Etapa 2: FKs novas em cotacoes (usuario TEXT coexiste com usuario_id)
        "ALTER TABLE cotacoes ADD COLUMN cliente_id INTEGER REFERENCES clientes(id)",
        "ALTER TABLE cotacoes ADD COLUMN usuario_id INTEGER REFERENCES users(id)",
        # Etapa 2: FK nova em audit_log
        "ALTER TABLE audit_log ADD COLUMN usuario_id INTEGER REFERENCES users(id)",
        # Etapa 2: índices de performance
        "CREATE INDEX IF NOT EXISTS idx_users_username ON users(username)",
        "CREATE INDEX IF NOT EXISTS idx_users_corretora_id ON users(corretora_id)",
        "CREATE INDEX IF NOT EXISTS idx_cotacoes_usuario ON cotacoes(usuario)",
        "CREATE INDEX IF NOT EXISTS idx_planos_operadora_id ON planos(operadora_id)",
        "CREATE INDEX IF NOT EXISTS idx_rede_operadora_id ON rede_credenciada(operadora_id)",
        "CREATE INDEX IF NOT EXISTS idx_audit_usuario ON audit_log(usuario)",
        # Etapa 2: remover ON DELETE CASCADE de users → corretoras (soft delete via ativo=0)
        "ALTER TABLE users DROP CONSTRAINT IF EXISTS users_corretora_id_fkey",
        "ALTER TABLE users ADD CONSTRAINT users_corretora_id_fkey FOREIGN KEY (corretora_id) REFERENCES corretoras(id)",
        # Etapa 3: renomear campos abreviados em planos
        "ALTER TABLE planos RENAME COLUMN aco TO acomodacao",
        "ALTER TABLE planos RENAME COLUMN fvidas TO faixa_vidas",
        "ALTER TABLE planos RENAME COLUMN mod TO moderador",
        "ALTER TABLE planos RENAME COLUMN vig TO mes_vigencia",
        # Etapa 3: Hapvida — inserir operadora se não existir
        "INSERT INTO operadoras (chave, nome, cor, cls, info, ordem) VALUES ('hapvida', 'Hapvida', 'var(--hapvida)', 'on-hap', 'PME 2–29 vidas \xb7 Tabela Bras\xedlia \xb7 Nosso M\xe9dico e Nosso Plano \xb7 Com coparticipa\xe7\xe3o parcial ou completa \xb7 Rede credenciada DF', 11) ON CONFLICT (chave) DO NOTHING",
        # Etapa 3: Hapvida — inserir planos (subquery garante operadora_id correto)
        "INSERT INTO planos (codigo, operadora_id, nome, acomodacao, tipo, faixa_vidas, precos, ordem) SELECT 'hap_nm_cp_enf', id, 'Copart Parcial — Nosso M\xe9dico (Enf)', 'enf', 'pme', '02-29', '[147.09,164.74,184.51,212.19,244.02,290.38,362.98,453.73,771.34,863.90]', 1 FROM operadoras WHERE chave='hapvida' ON CONFLICT (codigo) DO NOTHING",
        "INSERT INTO planos (codigo, operadora_id, nome, acomodacao, tipo, faixa_vidas, precos, ordem) SELECT 'hap_nm_cp_apt', id, 'Copart Parcial — Nosso M\xe9dico (Apt)', 'apt', 'pme', '02-29', '[220.58,247.05,276.70,318.21,365.94,435.47,544.34,680.43,1156.73,1295.54]', 2 FROM operadoras WHERE chave='hapvida' ON CONFLICT (codigo) DO NOTHING",
        "INSERT INTO planos (codigo, operadora_id, nome, acomodacao, tipo, faixa_vidas, precos, ordem) SELECT 'hap_nm_cc_enf', id, 'Copart Completa — Nosso M\xe9dico (Enf)', 'enf', 'pme', '02-29', '[129.46,145.00,162.40,186.76,214.77,255.58,319.48,399.35,678.90,760.37]', 3 FROM operadoras WHERE chave='hapvida' ON CONFLICT (codigo) DO NOTHING",
        "INSERT INTO planos (codigo, operadora_id, nome, acomodacao, tipo, faixa_vidas, precos, ordem) SELECT 'hap_nm_cc_apt', id, 'Copart Completa — Nosso M\xe9dico (Apt)', 'apt', 'pme', '02-29', '[194.12,217.41,243.50,280.03,322.03,383.22,479.03,598.79,1017.94,1140.09]', 4 FROM operadoras WHERE chave='hapvida' ON CONFLICT (codigo) DO NOTHING",
        "INSERT INTO planos (codigo, operadora_id, nome, acomodacao, tipo, faixa_vidas, precos, ordem) SELECT 'hap_np_cp_amb', id, 'Copart Parcial — Nosso Plano (Amb)', 'amb', 'pme', '02-29', '[148.42,166.23,186.18,214.11,246.23,293.01,366.26,457.83,778.31,871.71]', 5 FROM operadoras WHERE chave='hapvida' ON CONFLICT (codigo) DO NOTHING",
        "INSERT INTO planos (codigo, operadora_id, nome, acomodacao, tipo, faixa_vidas, precos, ordem) SELECT 'hap_np_cp_enf', id, 'Copart Parcial — Nosso Plano (Enf)', 'enf', 'pme', '02-29', '[163.26,182.85,204.79,235.51,270.84,322.30,402.88,503.60,856.12,958.85]', 6 FROM operadoras WHERE chave='hapvida' ON CONFLICT (codigo) DO NOTHING",
        "INSERT INTO planos (codigo, operadora_id, nome, acomodacao, tipo, faixa_vidas, precos, ordem) SELECT 'hap_np_cp_apt', id, 'Copart Parcial — Nosso Plano (Apt)', 'apt', 'pme', '02-29', '[244.93,274.32,307.24,353.33,406.33,483.53,604.41,755.51,1284.37,1438.40]', 7 FROM operadoras WHERE chave='hapvida' ON CONFLICT (codigo) DO NOTHING",
        "INSERT INTO planos (codigo, operadora_id, nome, acomodacao, tipo, faixa_vidas, precos, ordem) SELECT 'hap_np_cc_amb', id, 'Copart Completa — Nosso Plano (Amb)', 'amb', 'pme', '02-29', '[120.72,135.21,151.44,174.16,200.28,238.33,297.91,372.39,633.06,709.03]', 8 FROM operadoras WHERE chave='hapvida' ON CONFLICT (codigo) DO NOTHING",
        "INSERT INTO planos (codigo, operadora_id, nome, acomodacao, tipo, faixa_vidas, precos, ordem) SELECT 'hap_np_cc_enf', id, 'Copart Completa — Nosso Plano (Enf)', 'enf', 'pme', '02-29', '[143.68,160.92,180.23,207.26,232.35,282.64,354.55,443.19,753.48,843.83]', 9 FROM operadoras WHERE chave='hapvida' ON CONFLICT (codigo) DO NOTHING",
        "INSERT INTO planos (codigo, operadora_id, nome, acomodacao, tipo, faixa_vidas, precos, ordem) SELECT 'hap_np_cc_apt', id, 'Copart Completa — Nosso Plano (Apt)', 'apt', 'pme', '02-29', '[215.54,241.40,270.37,310.93,357.57,425.51,531.89,664.86,1130.26,1265.89]', 10 FROM operadoras WHERE chave='hapvida' ON CONFLICT (codigo) DO NOTHING",
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
        # Renomeia códigos Amil para bater com IDs de dados.js (mapeamento por preço)
        "UPDATE planos SET codigo = 'am_ad_ct_1'  WHERE codigo = 'a1'",
        "UPDATE planos SET codigo = 'am_ad_ct_2'  WHERE codigo = 'a2'",
        "UPDATE planos SET codigo = 'am_ad_ct_3'  WHERE codigo = 'a3'",
        "UPDATE planos SET codigo = 'am_ad_ct_4'  WHERE codigo = 'a4'",
        "UPDATE planos SET codigo = 'am_ad_ct_5'  WHERE codigo = 'a5'",
        "UPDATE planos SET codigo = 'am_ad_ct_6'  WHERE codigo = 'a6'",
        "UPDATE planos SET codigo = 'am_ad_ct_9'  WHERE codigo = 'a7'",
        "UPDATE planos SET codigo = 'am_ad_ct_10' WHERE codigo = 'a8'",
        "UPDATE planos SET codigo = 'am_ad_ct_7'  WHERE codigo = 'a9'",
        "UPDATE planos SET codigo = 'am_ad_ct_8'  WHERE codigo = 'a10'",
        "UPDATE planos SET codigo = 'am_ad_cp_1'  WHERE codigo = 'a11'",
        "UPDATE planos SET codigo = 'am_ad_cp_2'  WHERE codigo = 'a12'",
        "UPDATE planos SET codigo = 'am_ad_cp_3'  WHERE codigo = 'a13'",
        "UPDATE planos SET codigo = 'am_ad_cp_4'  WHERE codigo = 'a14'",
        "UPDATE planos SET codigo = 'am_ad_cp_5'  WHERE codigo = 'a15'",
        "UPDATE planos SET codigo = 'am_ad_cp_6'  WHERE codigo = 'a16'",
        "UPDATE planos SET codigo = 'am_ad_cp_9'  WHERE codigo = 'a17'",
        "UPDATE planos SET codigo = 'am_ad_cp_10' WHERE codigo = 'a18'",
        "UPDATE planos SET codigo = 'am_ad_cp_7'  WHERE codigo = 'a19'",
        "UPDATE planos SET codigo = 'am_ad_cp_8'  WHERE codigo = 'a20'",
        # Desativa planos Unity Life Vital (u1/u2) removidos do dados.js
        "UPDATE planos SET ativo = 0 WHERE codigo IN ('u1', 'u2')",
        # Rede credenciada: metadados na tabela operadoras
        "ALTER TABLE operadoras ADD COLUMN rede_adm TEXT",
        "ALTER TABLE operadoras ADD COLUMN rede_rodape TEXT",
        # Etapa 2: atualizado_em em todas as tabelas existentes
        "ALTER TABLE corretoras ADD COLUMN atualizado_em TEXT",
        "ALTER TABLE users ADD COLUMN atualizado_em TEXT",
        "ALTER TABLE cotacoes ADD COLUMN atualizado_em TEXT",
        "ALTER TABLE audit_log ADD COLUMN atualizado_em TEXT",
        "ALTER TABLE operadoras ADD COLUMN atualizado_em TEXT",
        "ALTER TABLE planos ADD COLUMN atualizado_em TEXT",
        "ALTER TABLE rede_credenciada ADD COLUMN atualizado_em TEXT",
        # Etapa 2: FKs novas em cotacoes (SQLite: sem cláusula REFERENCES no ALTER)
        "ALTER TABLE cotacoes ADD COLUMN cliente_id INTEGER",
        "ALTER TABLE cotacoes ADD COLUMN usuario_id INTEGER",
        # Etapa 2: FK nova em audit_log
        "ALTER TABLE audit_log ADD COLUMN usuario_id INTEGER",
        # Etapa 2: índices de performance
        "CREATE INDEX IF NOT EXISTS idx_users_username ON users(username)",
        "CREATE INDEX IF NOT EXISTS idx_users_corretora_id ON users(corretora_id)",
        "CREATE INDEX IF NOT EXISTS idx_cotacoes_usuario ON cotacoes(usuario)",
        "CREATE INDEX IF NOT EXISTS idx_planos_operadora_id ON planos(operadora_id)",
        "CREATE INDEX IF NOT EXISTS idx_rede_operadora_id ON rede_credenciada(operadora_id)",
        "CREATE INDEX IF NOT EXISTS idx_audit_usuario ON audit_log(usuario)",
        # SQLite não suporta ALTER CONSTRAINT — CASCADE removido do CREATE TABLE para novas instalações
        # Etapa 3: renomear campos abreviados em planos (SQLite 3.25+ suporta RENAME COLUMN)
        "ALTER TABLE planos RENAME COLUMN aco TO acomodacao",
        "ALTER TABLE planos RENAME COLUMN fvidas TO faixa_vidas",
        "ALTER TABLE planos RENAME COLUMN mod TO moderador",
        "ALTER TABLE planos RENAME COLUMN vig TO mes_vigencia",
        # Etapa 3: Hapvida — inserir operadora se não existir
        "INSERT OR IGNORE INTO operadoras (chave, nome, cor, cls, info, ordem) VALUES ('hapvida', 'Hapvida', 'var(--hapvida)', 'on-hap', 'PME 2–29 vidas \xb7 Tabela Bras\xedlia \xb7 Nosso M\xe9dico e Nosso Plano \xb7 Com coparticipa\xe7\xe3o parcial ou completa \xb7 Rede credenciada DF', 11)",
        # Etapa 3: Hapvida — inserir planos (subquery garante operadora_id correto)
        "INSERT OR IGNORE INTO planos (codigo, operadora_id, nome, acomodacao, tipo, faixa_vidas, precos, ordem) SELECT 'hap_nm_cp_enf', id, 'Copart Parcial — Nosso M\xe9dico (Enf)', 'enf', 'pme', '02-29', '[147.09,164.74,184.51,212.19,244.02,290.38,362.98,453.73,771.34,863.90]', 1 FROM operadoras WHERE chave='hapvida'",
        "INSERT OR IGNORE INTO planos (codigo, operadora_id, nome, acomodacao, tipo, faixa_vidas, precos, ordem) SELECT 'hap_nm_cp_apt', id, 'Copart Parcial — Nosso M\xe9dico (Apt)', 'apt', 'pme', '02-29', '[220.58,247.05,276.70,318.21,365.94,435.47,544.34,680.43,1156.73,1295.54]', 2 FROM operadoras WHERE chave='hapvida'",
        "INSERT OR IGNORE INTO planos (codigo, operadora_id, nome, acomodacao, tipo, faixa_vidas, precos, ordem) SELECT 'hap_nm_cc_enf', id, 'Copart Completa — Nosso M\xe9dico (Enf)', 'enf', 'pme', '02-29', '[129.46,145.00,162.40,186.76,214.77,255.58,319.48,399.35,678.90,760.37]', 3 FROM operadoras WHERE chave='hapvida'",
        "INSERT OR IGNORE INTO planos (codigo, operadora_id, nome, acomodacao, tipo, faixa_vidas, precos, ordem) SELECT 'hap_nm_cc_apt', id, 'Copart Completa — Nosso M\xe9dico (Apt)', 'apt', 'pme', '02-29', '[194.12,217.41,243.50,280.03,322.03,383.22,479.03,598.79,1017.94,1140.09]', 4 FROM operadoras WHERE chave='hapvida'",
        "INSERT OR IGNORE INTO planos (codigo, operadora_id, nome, acomodacao, tipo, faixa_vidas, precos, ordem) SELECT 'hap_np_cp_amb', id, 'Copart Parcial — Nosso Plano (Amb)', 'amb', 'pme', '02-29', '[148.42,166.23,186.18,214.11,246.23,293.01,366.26,457.83,778.31,871.71]', 5 FROM operadoras WHERE chave='hapvida'",
        "INSERT OR IGNORE INTO planos (codigo, operadora_id, nome, acomodacao, tipo, faixa_vidas, precos, ordem) SELECT 'hap_np_cp_enf', id, 'Copart Parcial — Nosso Plano (Enf)', 'enf', 'pme', '02-29', '[163.26,182.85,204.79,235.51,270.84,322.30,402.88,503.60,856.12,958.85]', 6 FROM operadoras WHERE chave='hapvida'",
        "INSERT OR IGNORE INTO planos (codigo, operadora_id, nome, acomodacao, tipo, faixa_vidas, precos, ordem) SELECT 'hap_np_cp_apt', id, 'Copart Parcial — Nosso Plano (Apt)', 'apt', 'pme', '02-29', '[244.93,274.32,307.24,353.33,406.33,483.53,604.41,755.51,1284.37,1438.40]', 7 FROM operadoras WHERE chave='hapvida'",
        "INSERT OR IGNORE INTO planos (codigo, operadora_id, nome, acomodacao, tipo, faixa_vidas, precos, ordem) SELECT 'hap_np_cc_amb', id, 'Copart Completa — Nosso Plano (Amb)', 'amb', 'pme', '02-29', '[120.72,135.21,151.44,174.16,200.28,238.33,297.91,372.39,633.06,709.03]', 8 FROM operadoras WHERE chave='hapvida'",
        "INSERT OR IGNORE INTO planos (codigo, operadora_id, nome, acomodacao, tipo, faixa_vidas, precos, ordem) SELECT 'hap_np_cc_enf', id, 'Copart Completa — Nosso Plano (Enf)', 'enf', 'pme', '02-29', '[143.68,160.92,180.23,207.26,232.35,282.64,354.55,443.19,753.48,843.83]', 9 FROM operadoras WHERE chave='hapvida'",
        "INSERT OR IGNORE INTO planos (codigo, operadora_id, nome, acomodacao, tipo, faixa_vidas, precos, ordem) SELECT 'hap_np_cc_apt', id, 'Copart Completa — Nosso Plano (Apt)', 'apt', 'pme', '02-29', '[215.54,241.40,270.37,310.93,357.57,425.51,531.89,664.86,1130.26,1265.89]', 10 FROM operadoras WHERE chave='hapvida'",
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
                corretora_id INTEGER REFERENCES corretoras(id),
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
                acomodacao TEXT NOT NULL,
                tipo TEXT,
                faixa_vidas TEXT,
                moderador TEXT,
                mes_vigencia INTEGER,
                precos TEXT NOT NULL,
                ativo INTEGER DEFAULT 1,
                ordem INTEGER DEFAULT 0,
                criado_em TEXT DEFAULT TO_CHAR(NOW(), 'YYYY-MM-DD HH24:MI:SS')
            )
        """)
        conn.execute("""
            CREATE TABLE IF NOT EXISTS rede_credenciada (
                id SERIAL PRIMARY KEY,
                operadora_id INTEGER REFERENCES operadoras(id) ON DELETE CASCADE,
                grupo TEXT NOT NULL DEFAULT '',
                grupo_ordem INTEGER DEFAULT 0,
                nome TEXT NOT NULL,
                local TEXT,
                tags TEXT,
                obs TEXT,
                tag_extra TEXT,
                ordem INTEGER DEFAULT 0,
                ativo INTEGER DEFAULT 1,
                criado_em TEXT DEFAULT TO_CHAR(NOW(), 'YYYY-MM-DD HH24:MI:SS')
            )
        """)
        conn.execute("""
            CREATE TABLE IF NOT EXISTS clientes (
                id SERIAL PRIMARY KEY,
                nome TEXT NOT NULL,
                empresa TEXT,
                cnpj TEXT,
                telefone TEXT,
                email TEXT,
                n_vidas_estimado INTEGER,
                segmento TEXT,
                origem TEXT,
                corretor_id INTEGER REFERENCES users(id),
                corretora_id INTEGER REFERENCES corretoras(id),
                ativo INTEGER DEFAULT 1,
                criado_em TEXT DEFAULT TO_CHAR(NOW(), 'YYYY-MM-DD HH24:MI:SS'),
                atualizado_em TEXT DEFAULT TO_CHAR(NOW(), 'YYYY-MM-DD HH24:MI:SS')
            )
        """)
        conn.execute("""
            CREATE TABLE IF NOT EXISTS oportunidades (
                id SERIAL PRIMARY KEY,
                cliente_id INTEGER NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
                estagio TEXT DEFAULT 'lead',
                valor_estimado REAL,
                data_prevista_fechamento TEXT,
                motivo_perda TEXT,
                obs TEXT,
                criado_em TEXT DEFAULT TO_CHAR(NOW(), 'YYYY-MM-DD HH24:MI:SS'),
                atualizado_em TEXT DEFAULT TO_CHAR(NOW(), 'YYYY-MM-DD HH24:MI:SS')
            )
        """)
        conn.execute("""
            CREATE TABLE IF NOT EXISTS interacoes (
                id SERIAL PRIMARY KEY,
                cliente_id INTEGER NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
                tipo TEXT NOT NULL,
                descricao TEXT,
                usuario TEXT REFERENCES users(username),
                criado_em TEXT DEFAULT TO_CHAR(NOW(), 'YYYY-MM-DD HH24:MI:SS'),
                atualizado_em TEXT DEFAULT TO_CHAR(NOW(), 'YYYY-MM-DD HH24:MI:SS')
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
                acomodacao TEXT NOT NULL,
                tipo TEXT,
                faixa_vidas TEXT,
                moderador TEXT,
                mes_vigencia INTEGER,
                precos TEXT NOT NULL,
                ativo INTEGER DEFAULT 1,
                ordem INTEGER DEFAULT 0,
                criado_em TEXT DEFAULT CURRENT_TIMESTAMP
            )
        """)
        c.execute("""
            CREATE TABLE IF NOT EXISTS rede_credenciada (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                operadora_id INTEGER REFERENCES operadoras(id) ON DELETE CASCADE,
                grupo TEXT NOT NULL DEFAULT '',
                grupo_ordem INTEGER DEFAULT 0,
                nome TEXT NOT NULL,
                local TEXT,
                tags TEXT,
                obs TEXT,
                tag_extra TEXT,
                ordem INTEGER DEFAULT 0,
                ativo INTEGER DEFAULT 1,
                criado_em TEXT DEFAULT CURRENT_TIMESTAMP
            )
        """)
        c.execute("""
            CREATE TABLE IF NOT EXISTS clientes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome TEXT NOT NULL,
                empresa TEXT,
                cnpj TEXT,
                telefone TEXT,
                email TEXT,
                n_vidas_estimado INTEGER,
                segmento TEXT,
                origem TEXT,
                corretor_id INTEGER REFERENCES users(id),
                corretora_id INTEGER REFERENCES corretoras(id),
                ativo INTEGER DEFAULT 1,
                criado_em TEXT DEFAULT CURRENT_TIMESTAMP,
                atualizado_em TEXT DEFAULT CURRENT_TIMESTAMP
            )
        """)
        c.execute("""
            CREATE TABLE IF NOT EXISTS oportunidades (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                cliente_id INTEGER NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
                estagio TEXT DEFAULT 'lead',
                valor_estimado REAL,
                data_prevista_fechamento TEXT,
                motivo_perda TEXT,
                obs TEXT,
                criado_em TEXT DEFAULT CURRENT_TIMESTAMP,
                atualizado_em TEXT DEFAULT CURRENT_TIMESTAMP
            )
        """)
        c.execute("""
            CREATE TABLE IF NOT EXISTS interacoes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                cliente_id INTEGER NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
                tipo TEXT NOT NULL,
                descricao TEXT,
                usuario TEXT REFERENCES users(username),
                criado_em TEXT DEFAULT CURRENT_TIMESTAMP,
                atualizado_em TEXT DEFAULT CURRENT_TIMESTAMP
            )
        """)
        _migrations_sqlite(c)
        conn.commit()

    conn.close()
