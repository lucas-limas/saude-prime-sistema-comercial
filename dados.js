// ═══════════════════════════════════════════════════════════════════════
//  dados.js — Saúde Prime · FONTE ÚNICA DE VERDADE
//
//  Para atualizar preços: edite os arrays "valores" de cada produto.
//  Ordem obrigatória das faixas etárias:
//  [0-18, 19-23, 24-28, 29-33, 34-38, 39-43, 44-48, 49-53, 54-58, 59+]
//
//  Para adicionar nova operadora: copie um bloco {key,nome,...} e preencha.
//  Campos de produto:
//    id, nome, aco ('enf'|'apt'|'amb'), tipo ('adesao'|'pme'|'pf'),
//    valores (array de 10 preços)
//  Se "tipo" não informado, o produto é tratado como 'adesao' (padrão).
//  NÃO edite a seção "Transformadores" abaixo da linha divisória.
// ═══════════════════════════════════════════════════════════════════════

window.SP_DATA = [

  // ── UNITY SAÚDE ───────────────────────────────────────────────────────
  {
    key: 'unity', nome: 'Unity Saúde',
    cor: 'var(--unity)', cls: 'on-u',
    reajuste: 'Mai/2026',
    info: 'Adm. Esplendor · Mai/2026 · Taxa assoc. R$ 5,00 · Assoc: UEB, UVA, UNIPRO, ANC, UNSP · Telemedicina gratuita',
    produtos: [
      { id:'u3', nome:'Sem copart — Unity Vida',  aco:'enf', valores:[348.34, 369.25, 424.63, 475.59, 570.69, 656.31, 826.94,1017.15, 1322.28, 1917.30] },
      { id:'u4', nome:'Com copart — Unity Vida',  aco:'enf', valores:[248.94, 263.88, 303.46, 339.87, 407.85, 469.02, 590.97, 726.90,  944.97, 1370.20] },
      { id:'u5', nome:'Sem copart — Unity Star',  aco:'apt', valores:[433.42, 459.42, 528.34, 591.74, 710.08, 816.60,1028.91,1265.56, 1645.23, 2385.58] },
      { id:'u6', nome:'Com copart — Unity Star',  aco:'apt', valores:[371.26, 393.54, 452.57, 506.88, 608.25, 699.46, 881.36,1084.07, 1409.30, 2043.48] },
    ]
  },

  // ── EVO SAÚDE ─────────────────────────────────────────────────────────
  {
    key: 'evo', nome: 'Evo Saúde',
    cor: 'var(--evo)', cls: 'on-e',
    reajuste: 'Set/2026',
    info: 'Adm. Easyplan · Reajuste set/2026 · Odonto ODONTOGROUP incluso · Telemedicina 24h · Taxa assoc. R$ 5,00',
    produtos: [
      { id:'e1', nome:'Sem copart — NOW Enfermaria',   aco:'enf', valores:[329.69, 352.17, 383.37, 450.31, 541.95, 612.67, 747.64,  917.58, 1233.41, 1637.60] },
      { id:'e2', nome:'Com copart — ONE Enfermaria',   aco:'enf', valores:[249.30, 266.30, 289.90, 340.52, 409.81, 463.29, 565.35,  693.86,  932.68, 1238.32] },
      { id:'e3', nome:'Com copart — NOW Enfermaria',   aco:'enf', valores:[286.68, 306.24, 333.37, 391.58, 471.26, 532.76, 650.13,  797.90, 1072.54, 1424.01] },
      { id:'e4', nome:'Sem copart — NOW Apartamento',  aco:'apt', valores:[394.15, 421.03, 458.33, 538.36, 647.91, 732.47, 893.83, 1097.00, 1474.58, 1957.80] },
      { id:'e5', nome:'Com copart — ONE Apartamento',  aco:'apt', valores:[292.74, 312.71, 340.41, 399.85, 481.22, 544.02, 663.86,  814.76, 1095.20, 1454.10] },
      { id:'e6', nome:'Com copart — NOW Apartamento',  aco:'apt', valores:[348.80, 372.59, 405.60, 476.42, 573.37, 648.20, 790.99,  970.79, 1304.93, 1732.56] },
    ]
  },

  // ── PLENUM SAÚDE ──────────────────────────────────────────────────────
  {
    key: 'plenum', nome: 'Plenum Saúde',
    cor: 'var(--plenum)', cls: 'on-p',
    reajuste: 'Mar/2027',
    info: 'Adm. Easyplan · Reajuste mar/2027 · Seguro Viagem AIG + UTI Móvel 24h · Sírio-Libanês (Sigma) · Taxa assoc. R$ 5,00',
    produtos: [
      { id:'p1', nome:'Copart parcial — Delta (Enf)',  aco:'enf', valores:[349.90, 437.38, 507.36, 577.34, 629.82, 664.81,  804.77,  874.75, 1084.69, 1679.52] },
      { id:'p2', nome:'Copart parcial — Ômega (Enf)',  aco:'enf', valores:[389.90, 487.38, 565.36, 643.34, 701.82, 740.81,  896.77,  974.75, 1208.69, 1871.52] },
      { id:'p3', nome:'Copart total — Delta (Enf)',    aco:'enf', valores:[269.90, 337.38, 391.36, 445.34, 485.82, 512.81,  620.77,  674.75,  836.69, 1295.52] },
      { id:'p4', nome:'Copart total — Ômega (Enf)',    aco:'enf', valores:[299.90, 374.88, 434.86, 494.84, 539.82, 569.81,  689.77,  749.75,  929.69, 1439.52] },
      { id:'p5', nome:'Copart parcial — Beta (Apt)',   aco:'apt', valores:[399.90, 499.88, 579.86, 659.84, 719.82, 759.81,  919.77,  999.75, 1239.69, 1919.52] },
      { id:'p6', nome:'Copart parcial — Sigma (Apt)',  aco:'apt', valores:[499.90, 624.88, 724.86, 824.84, 899.82, 949.81, 1149.77, 1249.75, 1549.69, 2399.52] },
      { id:'p7', nome:'Copart total — Beta (Apt)',     aco:'apt', valores:[309.90, 387.38, 449.36, 511.34, 557.82, 588.81,  712.77,  774.75,  960.69, 1487.52] },
      { id:'p8', nome:'Copart total — Sigma (Apt)',    aco:'apt', valores:[389.90, 487.38, 565.36, 643.34, 701.82, 740.81,  896.77,  974.75, 1208.69, 1871.52] },
    ]
  },

  // ── AMIL ──────────────────────────────────────────────────────────────
  {
    key: 'amil', nome: 'Amil',
    cor: 'var(--amil)', cls: 'on-a',
    reajuste: 'Mai/2026',
    info: 'Vigência mai/2026 · Amil Dental incluso 12 meses grátis (R$ 14,99/mês após) · Rede nacional · Reembolso disponível nos planos Platinum',
    produtos: [
      { id:'a1',  nome:'Bronze DF QC (Enf) — Copart Total',          aco:'enf', valores:[ 320.90, 435.79, 511.57, 511.57, 511.57,  571.43,  789.14,  942.24, 1354.94, 1921.31] },
      { id:'a2',  nome:'Bronze DF QP (Apt) — Copart Total',          aco:'apt', valores:[ 356.22, 483.74, 567.86, 567.86, 567.86,  634.31,  875.98, 1045.92, 1504.03, 2132.71] },
      { id:'a3',  nome:'Prata DF QC (Enf) — Copart Total',           aco:'enf', valores:[ 448.22, 524.41, 639.79, 767.74, 806.12,  886.74, 1108.44, 1219.28, 1524.11, 2667.19] },
      { id:'a4',  nome:'Prata DF QP (Apt) — Copart Total',           aco:'apt', valores:[ 497.52, 582.10, 710.15, 852.18, 894.80,  984.28, 1230.36, 1353.40, 1691.75, 2960.58] },
      { id:'a5',  nome:'Ouro QC (Enf) — Copart Total',               aco:'enf', valores:[ 500.09, 585.11, 713.83, 856.60, 899.42,  989.38, 1236.72, 1360.39, 1700.48, 2975.86] },
      { id:'a6',  nome:'Ouro QP (Apt) — Copart Total',               aco:'apt', valores:[ 555.10, 649.48, 792.35, 950.82, 998.36, 1098.19, 1372.74, 1510.02, 1887.53, 3303.18] },
      { id:'a7',  nome:'Platinum R1 QP (Apt) — Copart Total',        aco:'apt', valores:[ 589.22, 689.38, 841.04,1009.26,1059.73, 1165.70, 1457.12, 1602.84, 2003.56, 3506.22] },
      { id:'a8',  nome:'Platinum R2 QP (Apt) — Copart Total',        aco:'apt', valores:[ 595.08, 696.24, 849.42,1019.30,1070.26, 1177.28, 1471.61, 1618.78, 2023.46, 3541.07] },
      { id:'a9',  nome:'Platinum Mais R1 QP (Apt) — Copart Total',   aco:'apt', valores:[ 732.24, 856.72,1045.19,1254.24,1316.95, 1448.65, 1810.81, 1991.90, 2489.88, 4357.28] },
      { id:'a10', nome:'Platinum Mais R2 QP (Apt) — Copart Total',   aco:'apt', valores:[ 739.48, 865.19,1055.54,1266.65,1330.00, 1462.99, 1828.75, 2011.62, 2514.52, 4400.42] },
      { id:'a11', nome:'Bronze DF QC (Enf) — Copart Parcial',        aco:'enf', valores:[ 427.87, 581.05, 682.09, 682.09, 682.09,  761.89, 1052.17, 1256.29, 1806.55, 2561.69] },
      { id:'a12', nome:'Bronze DF QP (Apt) — Copart Parcial',        aco:'apt', valores:[ 474.95, 644.98, 757.14, 757.14, 757.14,  845.72, 1167.95, 1394.53, 2005.33, 2843.56] },
      { id:'a13', nome:'Prata DF QC (Enf) — Copart Parcial',         aco:'enf', valores:[ 597.62, 699.22, 853.04,1023.65,1074.84, 1182.31, 1477.91, 1625.71, 2032.14, 3556.26] },
      { id:'a14', nome:'Prata DF QP (Apt) — Copart Parcial',         aco:'apt', valores:[ 663.36, 776.14, 946.87,1136.26,1193.06, 1312.38, 1640.48, 1804.54, 2255.68, 3947.45] },
      { id:'a15', nome:'Ouro QC (Enf) — Copart Parcial',             aco:'enf', valores:[ 666.78, 780.12, 951.76,1142.10,1199.21, 1319.12, 1648.91, 1813.80, 2267.26, 3967.69] },
      { id:'a16', nome:'Ouro QP (Apt) — Copart Parcial',             aco:'apt', valores:[ 740.11, 865.93,1056.43,1267.72,1331.10, 1464.20, 1830.26, 2013.29, 2516.62, 4404.08] },
      { id:'a17', nome:'Platinum R1 QP (Apt) — Copart Parcial',      aco:'apt', valores:[ 785.62, 919.16,1121.39,1345.67,1412.94, 1554.24, 1942.81, 2137.09, 2671.37, 4674.90] },
      { id:'a18', nome:'Platinum R2 QP (Apt) — Copart Parcial',      aco:'apt', valores:[ 793.43, 928.31,1132.54,1359.04,1426.99, 1569.70, 1962.12, 2158.33, 2697.91, 4721.35] },
      { id:'a19', nome:'Platinum Mais R1 QP (Apt) — Copart Parcial', aco:'apt', valores:[ 976.32,1142.28,1393.60,1672.32,1755.95, 1931.53, 2414.44, 2655.86, 3319.84, 5809.72] },
      { id:'a20', nome:'Platinum Mais R2 QP (Apt) — Copart Parcial', aco:'apt', valores:[ 985.99,1153.60,1407.40,1688.87,1773.34, 1950.66, 2438.34, 2682.17, 3352.69, 5867.23] },
    ]
  },

  // ── MEDSENIOR ─────────────────────────────────────────────────────────
  {
    key: 'medsenior', nome: 'MedSênior',
    cor: 'var(--medsenior)', cls: 'on-ms',
    reajuste: 'A definir',
    info: 'PF e PME · Sem coparticipação · Rede Brasília · Coleta domiciliar Lab. MedSênior · Oficinas do Bem inclusas',
    produtos: [
      // Preços disponíveis somente a partir dos 49 anos (índices 0–6 = 0)
      // ── Pessoa Física ──
      { id:'ms1', nome:'Sem copart — DF3 Enfermaria',       aco:'enf', tipo:'pf',  valores:[0,0,0,0,0,0,0,  803.50,  964.20, 1263.10] },
      { id:'ms2', nome:'Sem copart — DF4 Apartamento',      aco:'apt', tipo:'pf',  valores:[0,0,0,0,0,0,0,  964.19, 1157.03, 1515.71] },
      { id:'ms3', nome:'Sem copart — Black Apartamento',    aco:'apt', tipo:'pf',  valores:[0,0,0,0,0,0,0, 1205.92, 1447.10, 1895.70] },
      { id:'ms4', nome:'Sem copart — Infinite Apartamento', aco:'apt', tipo:'pf',  valores:[0,0,0,0,0,0,0, 1818.30, 2181.96, 2858.37] },
      // ── PME (2–29 vidas) · Tabela DF jan/2026 ──
      { id:'ms5', nome:'PME — DF Enfermaria',                aco:'enf', tipo:'pme', valores:[0,0,0,0,0,0,0,  723.14,  867.77, 1136.78] },
      { id:'ms6', nome:'PME — DF Apartamento',               aco:'apt', tipo:'pme', valores:[0,0,0,0,0,0,0,  867.78, 1041.34, 1364.16] },
      { id:'ms7', nome:'PME — Black Apartamento',            aco:'apt', tipo:'pme', valores:[0,0,0,0,0,0,0, 1085.34, 1302.41, 1706.16] },
      { id:'ms8', nome:'PME — Infinite Apartamento',         aco:'apt', tipo:'pme', valores:[0,0,0,0,0,0,0, 1487.70, 1785.24, 2338.66] },
    ]
  }

];

// ═══════════════════════════════════════════════════════════════════════
//  TRANSFORMADORES — não editar abaixo desta linha
// ═══════════════════════════════════════════════════════════════════════

// PLANOS — formato usado pelo cotador-planos-saude.html
window.PLANOS = window.SP_DATA.flatMap(op =>
  op.produtos.map(p => ({
    id:     p.id,
    op:     op.key,
    nome:   p.nome,
    aco:    p.aco,
    tipo:   p.tipo || 'adesao',
    precos: p.valores
  }))
);

// OP_META — formato unificado (usado por cotador e apresentação)
window.OP_META = Object.fromEntries(
  window.SP_DATA.map(op => [op.key, {
    nome: op.nome,
    cor:  op.cor,
    cls:  op.cls,
    info: op.info
  }])
);

// PLANOS_DB — formato usado por apresentacao-executiva.html
const _acoLabel = { enf:'Enfermaria', apt:'Apartamento', amb:'Ambulatorial' };
window.PLANOS_DB = Object.fromEntries(
  window.SP_DATA.map(op => [
    op.key,
    op.produtos.map(p => ({
      id:       p.id,
      nome:     p.nome,
      aco:      _acoLabel[p.aco] || p.aco,
      reajuste: op.reajuste
    }))
  ])
);
