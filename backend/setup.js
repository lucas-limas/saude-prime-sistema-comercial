require('dotenv').config();
const { Client } = require('pg');

async function setup() {
  // Conecta no banco padrão "postgres" para poder criar o "saude_prime"
  const clientAdmin = new Client({
    host:     process.env.DB_HOST,
    port:     process.env.DB_PORT,
    database: 'postgres',
    user:     process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });

  try {
    await clientAdmin.connect();
    console.log('✅ Conectado ao PostgreSQL.');

    // Cria o banco de dados se não existir
    const { rows } = await clientAdmin.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`, ['saude_prime']
    );
    if (rows.length === 0) {
      await clientAdmin.query('CREATE DATABASE saude_prime');
      console.log('✅ Banco de dados "saude_prime" criado.');
    } else {
      console.log('ℹ️  Banco de dados "saude_prime" já existe.');
    }
    await clientAdmin.end();

    // Conecta agora no banco saude_prime para criar as tabelas
    const client = new Client({
      host:     process.env.DB_HOST,
      port:     process.env.DB_PORT,
      database: 'saude_prime',
      user:     process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });
    await client.connect();

    // ── TABELA: corretores ────────────────────────────────────────────────
    await client.query(`
      CREATE TABLE IF NOT EXISTS corretores (
        id         SERIAL PRIMARY KEY,
        nome       VARCHAR(120) NOT NULL,
        email      VARCHAR(120) NOT NULL UNIQUE,
        senha_hash TEXT         NOT NULL,
        ativo      BOOLEAN      NOT NULL DEFAULT true,
        criado_em  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
      )
    `);
    console.log('✅ Tabela "corretores" pronta.');

    // ── TABELA: cotacoes ──────────────────────────────────────────────────
    await client.query(`
      CREATE TABLE IF NOT EXISTS cotacoes (
        id             SERIAL PRIMARY KEY,
        corretor_id    INTEGER     NOT NULL REFERENCES corretores(id),
        cliente_nome   VARCHAR(150),
        cliente_obs    TEXT,
        filtro_tipo    VARCHAR(20),
        filtro_copart  VARCHAR(20),
        qtds           JSONB       NOT NULL,
        sel_planos     JSONB       NOT NULL,
        active_ops     JSONB       NOT NULL,
        ops_info       JSONB       NOT NULL,
        winner         VARCHAR(50),
        total_winner   NUMERIC(10,2),
        criado_em      TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);
    console.log('✅ Tabela "cotacoes" pronta.');

    // ── TABELA: log_precos ────────────────────────────────────────────────
    await client.query(`
      CREATE TABLE IF NOT EXISTS log_precos (
        id           SERIAL PRIMARY KEY,
        corretor_id  INTEGER     REFERENCES corretores(id),
        operadora    VARCHAR(50) NOT NULL,
        plano_id     VARCHAR(20) NOT NULL,
        valores_ant  JSONB,
        valores_novo JSONB       NOT NULL,
        criado_em    TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);
    console.log('✅ Tabela "log_precos" pronta.');

    await client.end();
    console.log('\n🎉 Setup concluído! Banco de dados pronto para uso.\n');

  } catch (err) {
    console.error('\n❌ Erro no setup:', err.message, '\n');
    process.exit(1);
  }
}

setup();
