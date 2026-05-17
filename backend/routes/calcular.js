const express = require('express');
const PRECOS  = require('../precos');
const { autenticar } = require('./auth');

const router = express.Router();

// Todas as rotas de cálculo exigem autenticação
router.use(autenticar);

// ── POST /api/calcular ────────────────────────────────────────────────────────
// Recebe operadoras + planos selecionados + qtds, devolve totais calculados.
// O browser nunca vê os preços unitários — apenas os totais.
router.post('/', (req, res) => {
  const { ops } = req.body;
  // ops = [{ op: 'unity', plano_id: 'u3' }, { op: 'evo', plano_id: 'e1' }, ...]

  // ── Validação de entrada ──────────────────────────────────────────────────
  const { qtds } = req.body;

  if (!Array.isArray(qtds) || qtds.length !== 10)
    return res.status(400).json({ erro: 'qtds deve ser um array com 10 posições.' });

  if (qtds.some(q => !Number.isInteger(q) || q < 0 || q > 999))
    return res.status(400).json({ erro: 'Cada faixa etária deve ser um inteiro entre 0 e 999.' });

  if (!Array.isArray(ops) || ops.length === 0)
    return res.status(400).json({ erro: 'ops deve ser um array com ao menos uma operadora.' });

  // ── Cálculo ───────────────────────────────────────────────────────────────
  const resultados = [];

  for (const { op, plano_id } of ops) {
    if (!PRECOS[op])
      return res.status(400).json({ erro: `Operadora inválida: ${op}` });

    if (!PRECOS[op][plano_id])
      return res.status(400).json({ erro: `Plano inválido: ${plano_id} para operadora ${op}` });

    const precos = PRECOS[op][plano_id];

    const breakdown = qtds.map((q, i) => ({
      faixa: i,
      qtd:   q,
      sub:   +(q * precos[i]).toFixed(2),
    })).filter(r => r.qtd > 0);

    const total = +breakdown.reduce((acc, r) => acc + r.sub, 0).toFixed(2);

    resultados.push({ op, plano_id, total, breakdown });
  }

  // Ordena por total crescente (mais barato primeiro)
  resultados.sort((a, b) => a.total - b.total);

  res.json({ ok: true, qtds, resultados });
});

module.exports = router;
