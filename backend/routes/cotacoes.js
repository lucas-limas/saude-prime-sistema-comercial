const express = require('express');
const db      = require('../db');
const { autenticar } = require('./auth');

const router = express.Router();

// Todas as rotas exigem autenticação
router.use(autenticar);

// ── POST /api/cotacoes ────────────────────────────────────────────────────────
// Salva uma cotação no banco vinculada ao corretor logado
router.post('/', async (req, res) => {
  const {
    cliente_nome, cliente_obs,
    filtro_tipo, filtro_copart,
    qtds, sel_planos, active_ops, ops_info, winner, total_winner,
  } = req.body;

  if (!Array.isArray(qtds) || qtds.length !== 10)
    return res.status(400).json({ erro: 'qtds inválido.' });

  if (!sel_planos || !active_ops || !ops_info)
    return res.status(400).json({ erro: 'sel_planos, active_ops e ops_info são obrigatórios.' });

  try {
    const { rows } = await db.query(
      `INSERT INTO cotacoes
         (corretor_id, cliente_nome, cliente_obs, filtro_tipo, filtro_copart,
          qtds, sel_planos, active_ops, ops_info, winner, total_winner)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
       RETURNING id, criado_em`,
      [
        req.corretor.id,
        cliente_nome || null,
        cliente_obs  || null,
        filtro_tipo  || null,
        filtro_copart || null,
        JSON.stringify(qtds),
        JSON.stringify(sel_planos),
        JSON.stringify(active_ops),
        JSON.stringify(ops_info),
        winner       || null,
        total_winner || null,
      ]
    );

    res.status(201).json({
      mensagem: 'Cotação salva com sucesso.',
      id: rows[0].id,
      criado_em: rows[0].criado_em,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao salvar cotação.' });
  }
});

// ── GET /api/cotacoes ─────────────────────────────────────────────────────────
// Lista cotações do corretor logado, mais recentes primeiro
router.get('/', async (req, res) => {
  const limite = Math.min(parseInt(req.query.limite) || 20, 100);
  const pagina = Math.max(parseInt(req.query.pagina) || 1, 1);
  const offset = (pagina - 1) * limite;
  const busca  = req.query.busca || '';

  try {
    const { rows } = await db.query(
      `SELECT id, cliente_nome, winner, total_winner, filtro_tipo, criado_em
       FROM cotacoes
       WHERE corretor_id = $1
         AND ($2 = '' OR cliente_nome ILIKE '%' || $2 || '%')
       ORDER BY criado_em DESC
       LIMIT $3 OFFSET $4`,
      [req.corretor.id, busca, limite, offset]
    );

    const { rows: total } = await db.query(
      `SELECT COUNT(*) FROM cotacoes
       WHERE corretor_id = $1
         AND ($2 = '' OR cliente_nome ILIKE '%' || $2 || '%')`,
      [req.corretor.id, busca]
    );

    res.json({
      cotacoes: rows,
      total: parseInt(total[0].count),
      pagina,
      limite,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao buscar cotações.' });
  }
});

// ── GET /api/cotacoes/:id ─────────────────────────────────────────────────────
// Busca uma cotação específica (apenas do corretor logado)
router.get('/:id', async (req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT * FROM cotacoes WHERE id = $1 AND corretor_id = $2`,
      [req.params.id, req.corretor.id]
    );

    if (rows.length === 0)
      return res.status(404).json({ erro: 'Cotação não encontrada.' });

    res.json({ cotacao: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao buscar cotação.' });
  }
});

module.exports = router;
