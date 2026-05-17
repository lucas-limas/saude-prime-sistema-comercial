require('dotenv').config();
const express  = require('express');
const cors     = require('cors');
const helmet   = require('helmet');
const rateLimit = require('express-rate-limit');

const app  = express();
const PORT = process.env.PORT || 3001;

// ── SEGURANÇA ────────────────────────────────────────────────────────────────
app.use(helmet());

const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',')
  : ['http://localhost:5500', 'http://127.0.0.1:5500', 'null'];

app.use(cors({
  origin: (origin, cb) => cb(null, !origin || allowedOrigins.includes(origin)),
  credentials: true,
}));

app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100,
  message: { erro: 'Muitas requisições. Tente novamente em 15 minutos.' },
}));

app.use(express.json());

// ── HEALTH CHECK ─────────────────────────────────────────────────────────────
app.get('/api/status', (req, res) => {
  res.json({
    ok: true,
    servico: 'Saúde Prime API',
    versao: '1.0.0',
    horario: new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }),
  });
});

// ── ROTAS ────────────────────────────────────────────────────────────────────
app.use('/api/auth',     require('./routes/auth'));
app.use('/api/calcular', require('./routes/calcular'));
app.use('/api/cotacoes', require('./routes/cotacoes'));

// ── 404 ──────────────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ erro: 'Rota não encontrada.' });
});

// ── ERRO GLOBAL ──────────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ erro: 'Erro interno do servidor.' });
});

// ── INICIAR (apenas localmente; no Vercel é exportado como serverless) ────────
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`\n✅ Saúde Prime API rodando em http://localhost:${PORT}`);
    console.log(`   Health check: http://localhost:${PORT}/api/status\n`);
  });
}

module.exports = app;
