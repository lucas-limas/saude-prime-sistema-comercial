const express  = require('express');
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const db       = require('../db');

const router = express.Router();

// ── POST /api/auth/cadastrar ──────────────────────────────────────────────────
// Cria um novo corretor. Em produção, proteger esta rota para admins apenas.
router.post('/cadastrar', async (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha)
    return res.status(400).json({ erro: 'nome, email e senha são obrigatórios.' });

  if (senha.length < 6)
    return res.status(400).json({ erro: 'A senha deve ter no mínimo 6 caracteres.' });

  try {
    const jaExiste = await db.query('SELECT id FROM corretores WHERE email = $1', [email]);
    if (jaExiste.rows.length > 0)
      return res.status(409).json({ erro: 'E-mail já cadastrado.' });

    const senha_hash = await bcrypt.hash(senha, 12);
    const { rows } = await db.query(
      'INSERT INTO corretores (nome, email, senha_hash) VALUES ($1, $2, $3) RETURNING id, nome, email, criado_em',
      [nome, email, senha_hash]
    );

    res.status(201).json({ mensagem: 'Corretor cadastrado com sucesso.', corretor: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao cadastrar corretor.' });
  }
});

// ── POST /api/auth/login ──────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha)
    return res.status(400).json({ erro: 'email e senha são obrigatórios.' });

  try {
    const { rows } = await db.query(
      'SELECT id, nome, email, senha_hash, ativo FROM corretores WHERE email = $1',
      [email]
    );

    if (rows.length === 0)
      return res.status(401).json({ erro: 'E-mail ou senha incorretos.' });

    const corretor = rows[0];

    if (!corretor.ativo)
      return res.status(403).json({ erro: 'Conta desativada. Fale com o administrador.' });

    const senhaOk = await bcrypt.compare(senha, corretor.senha_hash);
    if (!senhaOk)
      return res.status(401).json({ erro: 'E-mail ou senha incorretos.' });

    const token = jwt.sign(
      { id: corretor.id, nome: corretor.nome, email: corretor.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
    );

    res.json({
      mensagem: `Bem-vindo, ${corretor.nome}!`,
      token,
      corretor: { id: corretor.id, nome: corretor.nome, email: corretor.email },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao realizar login.' });
  }
});

// ── GET /api/auth/me ──────────────────────────────────────────────────────────
// Valida o token e retorna os dados do corretor logado
router.get('/me', autenticar, async (req, res) => {
  try {
    const { rows } = await db.query(
      'SELECT id, nome, email, criado_em FROM corretores WHERE id = $1',
      [req.corretor.id]
    );
    if (rows.length === 0)
      return res.status(404).json({ erro: 'Corretor não encontrado.' });

    res.json({ corretor: rows[0] });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar dados do corretor.' });
  }
});

// ── MIDDLEWARE de autenticação (exportado para uso nas outras rotas) ───────────
function autenticar(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token)
    return res.status(401).json({ erro: 'Token não fornecido.' });

  try {
    req.corretor = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ erro: 'Token inválido ou expirado.' });
  }
}

module.exports = router;
module.exports.autenticar = autenticar;
