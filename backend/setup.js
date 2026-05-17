require('dotenv').config();
const { Client } = require('pg');

async function setup() {
  const usingUrl = !!process.env.DATABASE_URL;

  // Quando DATABASE_URL está definida (Supabase), o banco já existe — conecta direto.
  // Localmente, conecta no banco "postgres" para criar o "saude_prime" se necessário.
  const adminClient = usingUrl
    ? new Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } })
    : new Client({
        host:     process.env.DB_HOST,
        port:     process.env.DB_PORT,
        database: 'postgres',
        user:     process.env.DB_USER,
        password: process.env.DB_PASSWORD,
      });

  try {
    await adminClient.connect();
    console.log('✅ Conectado ao PostgreSQL.');

    if (!usingUrl) {
      const { rows } = await adminClient.query(
        `SELECT 1 FROM pg_database WHERE datname = $1`, ['saude_prime']
      );
      if (rows.length === 0) {
        await adminClient.query('CREATE DATABASE saude_prime');
        console.log('✅ Banco de dados "saude_prime" criado.');
      } else {
        console.log('ℹ️  Banco de dados "saude_prime" já existe.');
      }
      await adminClient.end();

      // Reconecta no banco correto
      const client = new Client({
        host:     process.env.DB_HOST,
        port:     process.env.DB_PORT,
        database: 'saude_prime',
        user:     process.env.DB_USER,
        password: process.env.DB_PASSWORD,
      });
      await client.connect();
      await criarTabelas(client);
      await client.end();
    } else {
      await criarTabelas(adminClient);
      await adminClient.end();
    }

    console.log('\n🎉 Setup concluído! Banco de dados pronto para uso.\n');
  } catch (err) {
    console.error('\n❌ Erro no setup:', err.message, '\n');
    process.exit(1);
  }
}

async function criarTabelas(client) {
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
}

setup();
