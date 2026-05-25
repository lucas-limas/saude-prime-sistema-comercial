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
    info: 'Adm. Easyplan · Reajuste mar/2027 · Adesão e PME · Seguro Viagem AIG + UTI Móvel 24h · Sírio-Libanês (Sigma) · Taxa assoc. R$ 5,00',
    produtos: [
      { id:'p1', nome:'Copart parcial — Delta (Enf)',  aco:'enf', valores:[349.90, 437.38, 507.36, 577.34, 629.82, 664.81,  804.77,  874.75, 1084.69, 1679.52] },
      { id:'p2', nome:'Copart parcial — Ômega (Enf)',  aco:'enf', valores:[389.90, 487.38, 565.36, 643.34, 701.82, 740.81,  896.77,  974.75, 1208.69, 1871.52] },
      { id:'p3', nome:'Copart total — Delta (Enf)',    aco:'enf', valores:[269.90, 337.38, 391.36, 445.34, 485.82, 512.81,  620.77,  674.75,  836.69, 1295.52] },
      { id:'p4', nome:'Copart total — Ômega (Enf)',    aco:'enf', valores:[299.90, 374.88, 434.86, 494.84, 539.82, 569.81,  689.77,  749.75,  929.69, 1439.52] },
      { id:'p5', nome:'Copart parcial — Beta (Apt)',   aco:'apt', valores:[399.90, 499.88, 579.86, 659.84, 719.82, 759.81,  919.77,  999.75, 1239.69, 1919.52] },
      { id:'p6', nome:'Copart parcial — Sigma (Apt)',  aco:'apt', valores:[499.90, 624.88, 724.86, 824.84, 899.82, 949.81, 1149.77, 1249.75, 1549.69, 2399.52] },
      { id:'p7', nome:'Copart total — Beta (Apt)',     aco:'apt', valores:[309.90, 387.38, 449.36, 511.34, 557.82, 588.81,  712.77,  774.75,  960.69, 1487.52] },
      { id:'p8', nome:'Copart total — Sigma (Apt)',    aco:'apt', valores:[389.90, 487.38, 565.36, 643.34, 701.82, 740.81,  896.77,  974.75, 1208.69, 1871.52] },
      // ── PME Sem copart — 02-29 vidas ──
      { id:'pp_sc29_1', nome:'Sem copart — Delta',  aco:'enf', tipo:'pme', fvidas:'02-29', valores:[289.95,362.44,420.43,478.42,521.91,550.91, 666.89, 724.88, 898.85,1391.76] },
      { id:'pp_sc29_2', nome:'Sem copart — Ômega',  aco:'enf', tipo:'pme', fvidas:'02-29', valores:[329.95,412.44,478.43,544.42,593.91,626.91, 758.89, 824.88,1022.85,1583.76] },
      { id:'pp_sc29_3', nome:'Sem copart — Beta',   aco:'apt', tipo:'pme', fvidas:'02-29', valores:[349.95,437.44,507.43,577.42,629.91,664.91, 804.89, 874.88,1084.85,1679.76] },
      { id:'pp_sc29_4', nome:'Sem copart — Sigma',  aco:'apt', tipo:'pme', fvidas:'02-29', valores:[439.90,536.68,644.02,727.74,800.51,904.58,1099.75,1209.73,1572.65,2639.40] },
      // ── PME Com copart — 02-29 vidas ──
      { id:'pp_cc29_1', nome:'Com copart — Delta',  aco:'enf', tipo:'pme', fvidas:'02-29', valores:[209.95,262.44,304.43,346.42,377.91,398.91, 482.89, 524.88, 650.85,1007.76] },
      { id:'pp_cc29_2', nome:'Com copart — Ômega',  aco:'enf', tipo:'pme', fvidas:'02-29', valores:[239.95,299.94,347.93,395.92,431.91,455.91, 551.89, 599.88, 743.85,1151.76] },
      { id:'pp_cc29_3', nome:'Com copart — Beta',   aco:'apt', tipo:'pme', fvidas:'02-29', valores:[244.95,306.19,355.18,404.17,440.91,465.41, 563.39, 612.38, 759.35,1175.76] },
      { id:'pp_cc29_4', nome:'Com copart — Sigma',  aco:'apt', tipo:'pme', fvidas:'02-29', valores:[299.90,365.88,439.06,496.14,545.75,616.70, 749.75, 824.73,1072.15,1799.40] },
      // ── PME Sem copart — 30-99 vidas ──
      { id:'pp_sc99_1', nome:'Sem copart — Delta',  aco:'enf', tipo:'pme', fvidas:'30-99', valores:[279.95,349.94,405.93,461.92,503.91,531.91, 643.89, 699.88, 867.85,1343.76] },
      { id:'pp_sc99_2', nome:'Sem copart — Ômega',  aco:'enf', tipo:'pme', fvidas:'30-99', valores:[319.95,399.94,463.93,527.92,575.91,607.91, 735.89, 799.88, 991.85,1535.76] },
      { id:'pp_sc99_3', nome:'Sem copart — Beta',   aco:'apt', tipo:'pme', fvidas:'30-99', valores:[339.95,424.94,492.93,560.92,611.91,645.91, 781.89, 849.88,1053.85,1631.76] },
      { id:'pp_sc99_4', nome:'Sem copart — Sigma',  aco:'apt', tipo:'pme', fvidas:'30-99', valores:[429.90,524.48,629.38,711.20,782.32,884.02,1074.75,1182.23,1536.90,2579.40] },
      // ── PME Com copart — 30-99 vidas ──
      { id:'pp_cc99_1', nome:'Com copart — Delta',  aco:'enf', tipo:'pme', fvidas:'30-99', valores:[199.95,249.94,289.93,329.92,359.91,379.91, 459.89, 499.88, 619.85, 959.76] },
      { id:'pp_cc99_2', nome:'Com copart — Ômega',  aco:'enf', tipo:'pme', fvidas:'30-99', valores:[229.95,287.44,333.43,379.42,413.91,436.91, 528.89, 574.88, 712.85,1103.76] },
      { id:'pp_cc99_3', nome:'Com copart — Beta',   aco:'apt', tipo:'pme', fvidas:'30-99', valores:[234.95,293.69,340.68,387.67,422.91,446.41, 540.39, 587.38, 728.35,1127.76] },
      { id:'pp_cc99_4', nome:'Com copart — Sigma',  aco:'apt', tipo:'pme', fvidas:'30-99', valores:[289.90,353.68,424.42,479.59,527.55,596.13, 724.75, 797.23,1036.40,1739.40] },
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

  // ── SEGUROS UNIMED PME ────────────────────────────────────────────────
  {
    key: 'segurosunimed', nome: 'Seguros Unimed',
    cor: 'var(--seguros-unimed)', cls: 'on-su',
    reajuste: 'Jul/2025',
    info: 'PME · Planos Nacionais · Compulsório e Facultativo · Tabela jul/2025 · Rede Unimed nacional',
    produtos: [
      // ── Compulsório 02–04 vidas ──
      { id:'su_c04_1',  nome:'Sem copart — Compacto',      aco:'enf', tipo:'pme', mod:'comp', fvidas:'02-04', valores:[516.84,632.61,792.11,875.32, 932.33,1081.49,1292.82,1550.52,1840.83,3101.03] },
      { id:'su_c04_2',  nome:'Com copart — Compacto',      aco:'enf', tipo:'pme', mod:'comp', fvidas:'02-04', valores:[382.84,468.60,586.75,648.38, 690.61, 801.10, 957.65,1148.53,1363.57,2297.06] },
      { id:'su_c04_3',  nome:'Sem copart — Efetivo',       aco:'apt', tipo:'pme', mod:'comp', fvidas:'02-04', valores:[580.25,710.22,889.29,982.71,1046.71,1214.17,1451.43,1740.74,2066.67,3481.49] },
      { id:'su_c04_4',  nome:'Com copart — Efetivo',       aco:'apt', tipo:'pme', mod:'comp', fvidas:'02-04', valores:[429.81,526.09,658.73,727.93, 775.34, 899.38,1075.13,1289.44,1530.86,2578.88] },
      { id:'su_c04_5',  nome:'Sem copart — Completo',      aco:'apt', tipo:'pme', mod:'comp', fvidas:'02-04', valores:[686.94,840.82,1052.81,1163.41,1239.18,1437.43,1718.32,2060.83,2446.69,4121.67] },
      { id:'su_c04_6',  nome:'Com copart — Completo',      aco:'apt', tipo:'pme', mod:'comp', fvidas:'02-04', valores:[508.85,622.83, 779.86, 861.78, 917.91,1064.76,1272.83,1526.54,1812.36,3053.09] },
      { id:'su_c04_7',  nome:'Sem copart — Superior',      aco:'apt', tipo:'pme', mod:'comp', fvidas:'02-04', valores:[760.09,930.35,1164.91,1287.29,1371.12,1590.49,1901.29,2280.27,2707.21,4560.53] },
      { id:'su_c04_8',  nome:'Com copart — Superior',      aco:'apt', tipo:'pme', mod:'comp', fvidas:'02-04', valores:[608.07,744.28, 931.93,1029.83,1096.90,1272.39,1521.03,1824.21,2165.77,3648.42] },
      { id:'su_c04_9',  nome:'Sem copart — Superior Plus', aco:'apt', tipo:'pme', mod:'comp', fvidas:'02-04', valores:[843.75,1032.74,1293.12,1428.97,1522.03,1765.54,2110.55,2531.24,3005.17,5062.47] },
      { id:'su_c04_10', nome:'Com copart — Superior Plus', aco:'apt', tipo:'pme', mod:'comp', fvidas:'02-04', valores:[675.00, 826.20,1034.50,1143.17,1217.63,1412.43,1688.44,2024.99,2404.14,4049.98] },
      { id:'su_c04_11', nome:'Sem copart — Sênior',        aco:'apt', tipo:'pme', mod:'comp', fvidas:'02-04', valores:[1615.57,1977.45,2476.02,2736.13,2914.32,3380.58,4041.18,4846.70,5754.17,9693.41] },
      { id:'su_c04_12', nome:'Com copart — Sênior',        aco:'apt', tipo:'pme', mod:'comp', fvidas:'02-04', valores:[1404.84,1719.53,2153.06,2379.24,2534.19,2939.63,3514.07,4214.52,5003.62,8429.05] },
      // ── Compulsório 05–29 vidas ──
      { id:'su_c29_1',  nome:'Sem copart — Compacto',      aco:'enf', tipo:'pme', mod:'comp', fvidas:'05-29', valores:[458.88,561.66,703.27,777.15, 827.77, 960.20,1147.83,1376.63,1634.38,2753.25] },
      { id:'su_c29_2',  nome:'Com copart — Compacto',      aco:'enf', tipo:'pme', mod:'comp', fvidas:'05-29', valores:[339.91,416.05,520.94,575.67, 613.16, 711.26, 850.25,1019.72,1210.65,2039.45] },
      { id:'su_c29_3',  nome:'Sem copart — Efetivo',       aco:'apt', tipo:'pme', mod:'comp', fvidas:'05-29', valores:[515.17,630.57,789.55,872.50, 929.32,1078.00,1288.65,1545.52,1834.89,3091.04] },
      { id:'su_c29_4',  nome:'Com copart — Efetivo',       aco:'apt', tipo:'pme', mod:'comp', fvidas:'05-29', valores:[381.61,467.09,584.85,646.29, 688.39, 798.52, 954.56,1144.83,1359.18,2289.66] },
      { id:'su_c29_5',  nome:'Sem copart — Completo',      aco:'apt', tipo:'pme', mod:'comp', fvidas:'05-29', valores:[609.90,746.52,934.74,1032.93,1100.21,1276.22,1525.61,1829.71,2172.29,3659.42] },
      { id:'su_c29_6',  nome:'Com copart — Completo',      aco:'apt', tipo:'pme', mod:'comp', fvidas:'05-29', valores:[451.78,552.98,692.40,765.14, 814.97, 945.35,1130.08,1355.34,1609.11,2710.68] },
      { id:'su_c29_7',  nome:'Sem copart — Superior',      aco:'apt', tipo:'pme', mod:'comp', fvidas:'05-29', valores:[674.84,826.01,1034.27,1142.92,1217.35,1412.11,1688.06,2024.53,2403.60,4049.07] },
      { id:'su_c29_8',  nome:'Com copart — Superior',      aco:'apt', tipo:'pme', mod:'comp', fvidas:'05-29', valores:[539.88,660.81,827.41,914.33, 973.88,1129.69,1350.45,1619.63,1922.88,3239.26] },
      { id:'su_c29_9',  nome:'Sem copart — Superior Plus', aco:'apt', tipo:'pme', mod:'comp', fvidas:'05-29', valores:[749.12, 916.92,1148.10,1268.71,1351.34,1567.53,1873.85,2247.36,2668.14,4494.72] },
      { id:'su_c29_10', nome:'Com copart — Superior Plus', aco:'apt', tipo:'pme', mod:'comp', fvidas:'05-29', valores:[599.30, 733.54, 918.48,1014.97,1081.07,1254.03,1499.08,1797.89,2134.51,3595.78] },
      { id:'su_c29_11', nome:'Sem copart — Sênior',        aco:'apt', tipo:'pme', mod:'comp', fvidas:'05-29', valores:[1434.38,1755.68,2198.33,2429.27,2587.48,3001.45,3587.96,4303.15,5108.84,8606.29] },
      { id:'su_c29_12', nome:'Com copart — Sênior',        aco:'apt', tipo:'pme', mod:'comp', fvidas:'05-29', valores:[1247.29,1526.68,1911.60,2112.41,2249.98,2609.95,3119.97,3741.87,4442.47,7483.73] },
      // ── Compulsório 30–99 vidas ──
      { id:'su_c99_1',  nome:'Sem copart — Compacto',      aco:'enf', tipo:'pme', mod:'comp', fvidas:'30-99', valores:[420.23,514.37,644.05,711.71, 758.06, 879.34,1051.17,1260.70,1496.75,2521.40] },
      { id:'su_c99_2',  nome:'Com copart — Compacto',      aco:'enf', tipo:'pme', mod:'comp', fvidas:'30-99', valores:[311.28,381.01,477.07,527.19, 561.53, 651.36, 778.65, 933.85,1108.70,1867.71] },
      { id:'su_c99_3',  nome:'Sem copart — Efetivo',       aco:'apt', tipo:'pme', mod:'comp', fvidas:'30-99', valores:[471.79,577.47,723.07,799.02, 851.06, 987.22,1180.14,1415.37,1680.37,2830.74] },
      { id:'su_c99_4',  nome:'Com copart — Efetivo',       aco:'apt', tipo:'pme', mod:'comp', fvidas:'30-99', valores:[349.47,427.76,535.60,591.87, 630.42, 731.27, 874.17,1048.42,1244.72,2096.84] },
      { id:'su_c99_5',  nome:'Sem copart — Completo',      aco:'apt', tipo:'pme', mod:'comp', fvidas:'30-99', valores:[558.54,683.66,856.02,945.95,1007.56,1168.75,1397.14,1675.63,1989.36,3351.26] },
      { id:'su_c99_6',  nome:'Com copart — Completo',      aco:'apt', tipo:'pme', mod:'comp', fvidas:'30-99', valores:[413.74,506.41,634.09,700.70, 746.34, 865.74,1034.92,1241.21,1473.60,2482.42] },
      { id:'su_c99_7',  nome:'Sem copart — Superior',      aco:'apt', tipo:'pme', mod:'comp', fvidas:'30-99', valores:[618.02,756.45,947.17,1046.67,1114.84,1293.20,1545.90,1854.05,2201.19,3708.10] },
      { id:'su_c99_8',  nome:'Com copart — Superior',      aco:'apt', tipo:'pme', mod:'comp', fvidas:'30-99', valores:[494.41,605.16,757.74,837.34, 891.87,1034.56,1236.72,1483.24,1760.95,2966.48] },
      { id:'su_c99_9',  nome:'Sem copart — Superior Plus', aco:'apt', tipo:'pme', mod:'comp', fvidas:'30-99', valores:[686.04, 839.71,1051.42,1161.87,1237.54,1435.53,1716.05,2058.11,2443.46,4116.22] },
      { id:'su_c99_10', nome:'Com copart — Superior Plus', aco:'apt', tipo:'pme', mod:'comp', fvidas:'30-99', valores:[548.83, 671.77, 841.14, 929.50, 990.03,1148.42,1372.84,1646.49,1954.76,3292.97] },
      { id:'su_c99_11', nome:'Sem copart — Sênior',        aco:'apt', tipo:'pme', mod:'comp', fvidas:'30-99', valores:[1313.59,1607.84,2013.21,2224.70,2369.59,2748.69,3285.82,3940.78,4678.62,7881.55] },
      { id:'su_c99_12', nome:'Com copart — Sênior',        aco:'apt', tipo:'pme', mod:'comp', fvidas:'30-99', valores:[1142.25,1398.12,1750.62,1934.52,2060.51,2390.17,2857.23,3426.76,4068.37,6853.53] },
      // ── Facultativo 02–04 vidas ──
      { id:'su_f04_1',  nome:'Sem copart — Compacto',      aco:'enf', tipo:'pme', mod:'fac', fvidas:'02-04', valores:[568.52,695.87, 871.32, 962.85,1025.56,1189.63,1422.10,1705.57,2024.91, 3411.14] },
      { id:'su_f04_2',  nome:'Com copart — Compacto',      aco:'enf', tipo:'pme', mod:'fac', fvidas:'02-04', valores:[421.13,515.46, 645.42, 713.22, 759.67, 881.21,1053.41,1263.38,1499.93, 2526.77] },
      { id:'su_f04_3',  nome:'Sem copart — Efetivo',       aco:'apt', tipo:'pme', mod:'fac', fvidas:'02-04', valores:[638.27,781.25, 978.22,1080.98,1151.38,1335.58,1596.57,1914.82,2273.33, 3829.63] },
      { id:'su_f04_4',  nome:'Com copart — Efetivo',       aco:'apt', tipo:'pme', mod:'fac', fvidas:'02-04', valores:[472.79,578.70, 724.60, 800.72, 852.87, 989.32,1182.65,1418.38,1683.95, 2836.77] },
      { id:'su_f04_5',  nome:'Sem copart — Completo',      aco:'apt', tipo:'pme', mod:'fac', fvidas:'02-04', valores:[755.64,924.90,1158.09,1279.75,1363.10,1581.17,1890.15,2266.92,2691.36, 4533.83] },
      { id:'su_f04_6',  nome:'Com copart — Completo',      aco:'apt', tipo:'pme', mod:'fac', fvidas:'02-04', valores:[559.73,685.11, 857.85, 947.96,1009.70,1171.24,1400.11,1679.20,1993.60, 3358.39] },
      { id:'su_f04_7',  nome:'Sem copart — Superior',      aco:'apt', tipo:'pme', mod:'fac', fvidas:'02-04', valores:[836.10,1023.38,1281.40,1416.01,1508.24,1749.53,2091.41,2508.29,2977.93, 5016.58] },
      { id:'su_f04_8',  nome:'Com copart — Superior',      aco:'apt', tipo:'pme', mod:'fac', fvidas:'02-04', valores:[668.88,818.71,1025.12,1132.81,1206.59,1399.63,1673.13,2006.63,2382.34, 4013.27] },
      { id:'su_f04_9',  nome:'Sem copart — Superior Plus', aco:'apt', tipo:'pme', mod:'fac', fvidas:'02-04', valores:[928.12,1136.02,1422.44,1571.86,1674.24,1942.09,2321.60,2784.36,3305.69, 5568.72] },
      { id:'su_f04_10', nome:'Com copart — Superior Plus', aco:'apt', tipo:'pme', mod:'fac', fvidas:'02-04', valores:[742.50, 908.82,1137.95,1257.49,1339.39,1553.67,1857.28,2227.49,2644.55, 4454.98] },
      { id:'su_f04_11', nome:'Sem copart — Sênior',        aco:'apt', tipo:'pme', mod:'fac', fvidas:'02-04', valores:[1777.12,2175.20,2723.62,3009.74,3205.75,3718.63,4445.30,5331.37,6329.58,10662.75] },
      { id:'su_f04_12', nome:'Com copart — Sênior',        aco:'apt', tipo:'pme', mod:'fac', fvidas:'02-04', valores:[1545.33,1891.48,2368.37,2617.16,2787.61,3233.59,3865.48,4635.98,5503.99, 9271.95] },
      // ── Facultativo 05–29 vidas ──
      { id:'su_f29_1',  nome:'Sem copart — Compacto',      aco:'enf', tipo:'pme', mod:'fac', fvidas:'05-29', valores:[504.76,617.83, 773.60, 854.87, 910.54,1056.22,1262.62,1514.29,1797.82,3028.58] },
      { id:'su_f29_2',  nome:'Com copart — Compacto',      aco:'enf', tipo:'pme', mod:'fac', fvidas:'05-29', valores:[373.90,457.65, 573.04, 633.24, 674.48, 782.38, 935.27,1121.70,1331.72,2243.39] },
      { id:'su_f29_3',  nome:'Sem copart — Efetivo',       aco:'apt', tipo:'pme', mod:'fac', fvidas:'05-29', valores:[566.69,693.63, 868.51, 959.75,1022.25,1185.80,1417.52,1700.07,2018.38,3400.14] },
      { id:'su_f29_4',  nome:'Com copart — Efetivo',       aco:'apt', tipo:'pme', mod:'fac', fvidas:'05-29', valores:[419.77,513.80, 643.34, 710.92, 757.22, 878.37,1050.01,1259.31,1495.10,2518.62] },
      { id:'su_f29_5',  nome:'Sem copart — Completo',      aco:'apt', tipo:'pme', mod:'fac', fvidas:'05-29', valores:[670.89,821.17,1028.21,1136.23,1210.23,1403.85,1678.17,2012.68,2389.52,4025.37] },
      { id:'su_f29_6',  nome:'Com copart — Completo',      aco:'apt', tipo:'pme', mod:'fac', fvidas:'05-29', valores:[496.96,608.28, 761.64, 841.65, 896.46,1039.89,1243.09,1490.88,1770.02,2981.75] },
      { id:'su_f29_7',  nome:'Sem copart — Superior',      aco:'apt', tipo:'pme', mod:'fac', fvidas:'05-29', valores:[742.33,908.61,1137.69,1257.21,1339.09,1553.32,1856.86,2226.99,2643.95,4453.98] },
      { id:'su_f29_8',  nome:'Com copart — Superior',      aco:'apt', tipo:'pme', mod:'fac', fvidas:'05-29', valores:[593.86,726.89, 910.16,1005.77,1071.27,1242.66,1485.49,1781.59,2115.16,3563.18] },
      { id:'su_f29_9',  nome:'Sem copart — Superior Plus', aco:'apt', tipo:'pme', mod:'fac', fvidas:'05-29', valores:[824.03,1008.62,1262.91,1395.58,1486.47,1724.29,2061.23,2472.10,2934.96,4944.19] },
      { id:'su_f29_10', nome:'Com copart — Superior Plus', aco:'apt', tipo:'pme', mod:'fac', fvidas:'05-29', valores:[659.23, 806.89,1010.33,1116.46,1189.18,1379.43,1648.99,1977.68,2347.96,3955.35] },
      { id:'su_f29_11', nome:'Sem copart — Sênior',        aco:'apt', tipo:'pme', mod:'fac', fvidas:'05-29', valores:[1577.82,1931.25,2418.17,2672.20,2846.23,3301.59,3946.76,4733.46,5619.72,9466.92] },
      { id:'su_f29_12', nome:'Com copart — Sênior',        aco:'apt', tipo:'pme', mod:'fac', fvidas:'05-29', valores:[1372.02,1679.35,2102.75,2323.65,2474.98,2870.95,3431.97,4116.05,4886.72,8232.11] },
      // ── Facultativo 30–99 vidas ──
      { id:'su_f99_1',  nome:'Sem copart — Compacto',      aco:'enf', tipo:'pme', mod:'fac', fvidas:'30-99', valores:[462.26,565.80, 708.46, 782.88, 833.87, 967.27,1156.29,1386.77,1646.42,2773.54] },
      { id:'su_f99_2',  nome:'Com copart — Compacto',      aco:'enf', tipo:'pme', mod:'fac', fvidas:'30-99', valores:[342.41,419.11, 524.78, 579.91, 617.68, 716.50, 856.51,1027.24,1219.57,2054.48] },
      { id:'su_f99_3',  nome:'Sem copart — Efetivo',       aco:'apt', tipo:'pme', mod:'fac', fvidas:'30-99', valores:[518.97,635.22, 795.37, 878.93, 936.17,1085.94,1298.15,1556.91,1848.41,3113.81] },
      { id:'su_f99_4',  nome:'Com copart — Efetivo',       aco:'apt', tipo:'pme', mod:'fac', fvidas:'30-99', valores:[384.42,470.53, 589.16, 651.06, 693.46, 804.40, 961.59,1153.26,1369.19,2306.53] },
      { id:'su_f99_5',  nome:'Sem copart — Completo',      aco:'apt', tipo:'pme', mod:'fac', fvidas:'30-99', valores:[614.40,752.02, 941.63,1040.54,1108.31,1285.63,1536.85,1843.19,2188.30,3686.39] },
      { id:'su_f99_6',  nome:'Com copart — Completo',      aco:'apt', tipo:'pme', mod:'fac', fvidas:'30-99', valores:[455.11,557.05, 697.50, 770.77, 820.97, 952.32,1138.41,1365.33,1620.96,2730.66] },
      { id:'su_f99_7',  nome:'Sem copart — Superior',      aco:'apt', tipo:'pme', mod:'fac', fvidas:'30-99', valores:[679.82,832.10,1041.89,1151.34,1226.32,1422.52,1700.50,2039.45,2421.31,4078.90] },
      { id:'su_f99_8',  nome:'Com copart — Superior',      aco:'apt', tipo:'pme', mod:'fac', fvidas:'30-99', valores:[543.85,665.68, 833.51, 921.07, 981.06,1138.01,1360.40,1631.56,1937.04,3263.12] },
      { id:'su_f99_9',  nome:'Sem copart — Superior Plus', aco:'apt', tipo:'pme', mod:'fac', fvidas:'30-99', valores:[754.64, 923.68,1156.56,1278.06,1361.29,1579.08,1887.66,2263.92,2687.80,4527.84] },
      { id:'su_f99_10', nome:'Com copart — Superior Plus', aco:'apt', tipo:'pme', mod:'fac', fvidas:'30-99', valores:[603.71, 738.94, 925.25,1022.45,1089.04,1263.27,1510.13,1811.14,2150.24,3622.27] },
      { id:'su_f99_11', nome:'Sem copart — Sênior',        aco:'apt', tipo:'pme', mod:'fac', fvidas:'30-99', valores:[1444.95,1768.62,2214.53,2447.17,2606.55,3023.56,3614.40,4334.85,5146.48,8669.71] },
      { id:'su_f99_12', nome:'Com copart — Sênior',        aco:'apt', tipo:'pme', mod:'fac', fvidas:'30-99', valores:[1256.48,1537.93,1925.68,2127.97,2266.56,2629.18,3142.96,3769.44,4475.20,7538.88] },
      // ── Essencial Compulsório 02–04 vidas ──
      { id:'su_ec04_1', nome:'Sem copart — Essencial I',   aco:'enf', tipo:'pme', mod:'comp', fvidas:'02-04', valores:[341.65,418.18,523.61,578.61,616.30,714.90,854.60,1024.94,1216.85,2049.89] },
      { id:'su_ec04_2', nome:'Sem copart — Essencial II',  aco:'apt', tipo:'pme', mod:'comp', fvidas:'02-04', valores:[382.30,467.94,585.92,647.47,689.64,799.97,956.29,1146.91,1361.65,2293.82] },
      { id:'su_ec04_3', nome:'Com copart — Essencial III', aco:'enf', tipo:'pme', mod:'comp', fvidas:'02-04', valores:[253.07,309.76,387.86,428.60,456.52,529.55,633.03,759.22,901.37,1518.43] },
      { id:'su_ec04_4', nome:'Com copart — Essencial IV',  aco:'apt', tipo:'pme', mod:'comp', fvidas:'02-04', valores:[283.19,346.62,434.01,479.61,510.84,592.57,708.37,849.56,1008.63,1699.13] },
      // ── Essencial Compulsório 05–29 vidas ──
      { id:'su_ec29_1', nome:'Sem copart — Essencial I',   aco:'enf', tipo:'pme', mod:'comp', fvidas:'05-29', valores:[303.33,371.28,464.89,513.72,547.18,634.72,758.75,910.00,1080.38,1819.99] },
      { id:'su_ec29_2', nome:'Sem copart — Essencial II',  aco:'apt', tipo:'pme', mod:'comp', fvidas:'05-29', valores:[339.43,415.46,520.21,574.86,612.29,710.25,849.05,1018.29,1208.94,2036.57] },
      { id:'su_ec29_3', nome:'Com copart — Essencial III', aco:'enf', tipo:'pme', mod:'comp', fvidas:'05-29', valores:[224.69,275.02,344.36,380.54,405.32,470.16,562.04,674.07,800.28,1348.14] },
      { id:'su_ec29_4', nome:'Com copart — Essencial IV',  aco:'apt', tipo:'pme', mod:'comp', fvidas:'05-29', valores:[251.43,307.75,385.34,425.82,453.55,526.11,628.92,754.29,895.51,1508.57] },
      // ── Essencial Compulsório 30–99 vidas ──
      { id:'su_ec99_1', nome:'Sem copart — Essencial I',   aco:'enf', tipo:'pme', mod:'comp', fvidas:'30-99', valores:[277.79,340.01,425.74,470.46,501.10,581.27,694.86,833.36,989.40,1666.73] },
      { id:'su_ec99_2', nome:'Sem copart — Essencial II',  aco:'apt', tipo:'pme', mod:'comp', fvidas:'30-99', valores:[310.84,380.47,476.40,526.45,560.73,650.44,777.55,932.53,1107.14,1865.07] },
      { id:'su_ec99_3', nome:'Com copart — Essencial III', aco:'enf', tipo:'pme', mod:'comp', fvidas:'30-99', valores:[205.77,251.86,315.36,348.49,371.19,430.57,514.71,617.31,732.89,1234.61] },
      { id:'su_ec99_4', nome:'Com copart — Essencial IV',  aco:'apt', tipo:'pme', mod:'comp', fvidas:'30-99', valores:[230.26,281.83,352.89,389.96,415.36,481.81,575.96,690.77,820.10,1381.53] },
      // ── Essencial Facultativo 02–04 vidas ──
      { id:'su_ef04_1', nome:'Sem copart — Essencial I',   aco:'enf', tipo:'pme', mod:'fac', fvidas:'02-04', valores:[375.81,459.99,575.97,636.48,677.93,786.39,940.06,1127.44,1338.53,2254.87] },
      { id:'su_ef04_2', nome:'Sem copart — Essencial II',  aco:'apt', tipo:'pme', mod:'fac', fvidas:'02-04', valores:[420.53,514.73,644.51,712.22,758.60,879.97,1051.92,1261.60,1497.82,2523.20] },
      { id:'su_ef04_3', nome:'Com copart — Essencial III', aco:'enf', tipo:'pme', mod:'fac', fvidas:'02-04', valores:[278.38,340.74,426.64,471.46,502.17,582.51,696.34,835.14,991.50,1670.28] },
      { id:'su_ef04_4', nome:'Com copart — Essencial IV',  aco:'apt', tipo:'pme', mod:'fac', fvidas:'02-04', valores:[311.51,381.28,477.42,527.57,561.93,651.83,779.20,934.52,1109.49,1869.04] },
      // ── Essencial Facultativo 05–29 vidas ──
      { id:'su_ef29_1', nome:'Sem copart — Essencial I',   aco:'enf', tipo:'pme', mod:'fac', fvidas:'05-29', valores:[333.67,408.41,511.38,565.10,601.90,698.19,834.63,1001.00,1188.42,2001.99] },
      { id:'su_ef29_2', nome:'Sem copart — Essencial II',  aco:'apt', tipo:'pme', mod:'fac', fvidas:'05-29', valores:[373.37,457.01,572.23,632.34,673.52,781.28,933.95,1120.11,1329.84,2240.23] },
      { id:'su_ef29_3', nome:'Com copart — Essencial III', aco:'enf', tipo:'pme', mod:'fac', fvidas:'05-29', valores:[247.16,302.52,378.80,418.59,445.85,517.18,618.24,741.48,880.31,1482.96] },
      { id:'su_ef29_4', nome:'Com copart — Essencial IV',  aco:'apt', tipo:'pme', mod:'fac', fvidas:'05-29', valores:[276.57,338.52,423.87,468.40,498.91,578.73,691.82,829.71,985.06,1659.43] },
      // ── Essencial Facultativo 30–99 vidas ──
      { id:'su_ef99_1', nome:'Sem copart — Essencial I',   aco:'enf', tipo:'pme', mod:'fac', fvidas:'30-99', valores:[305.57,374.01,468.31,517.51,551.21,639.40,764.35,916.70,1088.34,1833.40] },
      { id:'su_ef99_2', nome:'Sem copart — Essencial II',  aco:'apt', tipo:'pme', mod:'fac', fvidas:'30-99', valores:[341.93,418.52,524.04,579.09,616.81,715.49,855.30,1025.79,1217.85,2051.58] },
      { id:'su_ef99_3', nome:'Com copart — Essencial III', aco:'enf', tipo:'pme', mod:'fac', fvidas:'30-99', valores:[226.35,277.05,346.90,383.34,408.31,473.63,566.18,679.04,806.18,1358.08] },
      { id:'su_ef99_4', nome:'Com copart — Essencial IV',  aco:'apt', tipo:'pme', mod:'fac', fvidas:'30-99', valores:[253.28,310.02,388.18,428.96,456.89,529.99,633.56,759.84,902.11,1519.69] },
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
  },

  // ── PORTO SAÚDE ────────────────────────────────────────────────────────
  {
    key: 'portosaude', nome: 'Porto Saúde',
    cor: 'var(--portosaude)', cls: 'on-ps',
    reajuste: 'A definir',
    info: 'PME · Planos Bronze / Prata / Ouro · Com e sem coparticipação · Rede credenciada DF · Porto Seguro Saúde',
    produtos: [
      { id:'ps_1', nome:'Sem copart — Bronze Brasília Pro',  aco:'enf', tipo:'pme', valores:[243.53,295.33,356.27,407.87,441.93,456.40,545.18,586.91,725.17,1218.96] },
      { id:'ps_2', nome:'Com copart — Bronze Brasília Pro',  aco:'enf', tipo:'pme', valores:[187.52,227.41,274.33,314.06,340.29,351.43,419.79,451.92,558.38, 938.60] },
      { id:'ps_3', nome:'Sem copart — Prata Brasília Pro',   aco:'enf', tipo:'pme', valores:[287.92,349.16,421.20,482.21,522.48,539.58,644.54,693.88,857.34,1441.12] },
      { id:'ps_4', nome:'Com copart — Prata Brasília Pro',   aco:'enf', tipo:'pme', valores:[221.70,268.85,324.33,371.30,402.31,415.48,496.30,534.29,660.15,1109.66] },
      { id:'ps_5', nome:'Sem copart — P420',                 aco:'apt', tipo:'pme', valores:[414.59,502.78,606.52,694.36,752.35,776.98,928.12,999.16,1234.54,2075.16] },
      { id:'ps_6', nome:'Com copart — P420',                 aco:'apt', tipo:'pme', valores:[339.96,412.28,497.35,569.38,616.92,637.12,761.06,819.31,1012.32,1701.53] },
      { id:'ps_7', nome:'Sem copart — Ouro Brasília Pro',    aco:'apt', tipo:'pme', valores:[381.88,463.11,558.66,639.57,692.98,715.67,854.89,920.32,1137.13,1911.42] },
      { id:'ps_8', nome:'Com copart — Ouro Brasília Pro',    aco:'apt', tipo:'pme', valores:[313.14,379.75,458.10,524.45,568.25,586.85,701.01,754.66,932.44,1567.36] },
    ]
  },

  // ── BEST SÊNIOR ───────────────────────────────────────────────────────
  {
    key: 'bestsenior', nome: 'Best Sênior',
    cor: 'var(--bestsenior)', cls: 'on-bs',
    reajuste: 'Mar/2026',
    info: 'PF e PME · Planos exclusivos para 44+ · Tabela Mar-Abr/2026 · Rede credenciada DF · Best Sênior Saúde',
    produtos: [
      { id:'bse_pf1', nome:'Sem copart — Classic (Enf)',    aco:'enf', tipo:'pf',  valores:[0,0,0,0,0,0, 795.40, 1002.21, 1282.83, 1770.29] },
      { id:'bse_pf2', nome:'Sem copart — Classic (Apt)',    aco:'apt', tipo:'pf',  valores:[0,0,0,0,0,0, 976.06, 1229.85, 1574.20, 2172.40] },
      { id:'bse_pf3', nome:'Sem copart — Prime (Apt)',      aco:'apt', tipo:'pf',  valores:[0,0,0,0,0,0,1155.86, 1456.40, 1864.19, 2572.58] },
      { id:'bse_pf4', nome:'Sem copart — Platinum (Apt)',   aco:'apt', tipo:'pf',  valores:[0,0,0,0,0,0,1399.88, 1763.86, 2257.74, 3115.68] },
      { id:'bse_pme1', nome:'Sem copart — Classic PJ (Enf)',aco:'enf', tipo:'pme', valores:[0,0,0,0,0,0, 715.86,  901.99, 1154.54, 1592.51] },
      { id:'bse_pme2', nome:'Sem copart — Classic PJ (Apt)',aco:'apt', tipo:'pme', valores:[0,0,0,0,0,0, 878.46, 1106.86, 1416.78, 1955.16] },
      { id:'bse_pme3', nome:'Sem copart — Prime PJ (Apt)',  aco:'apt', tipo:'pme', valores:[0,0,0,0,0,0,1040.28, 1310.76, 1677.77, 2315.32] },
      { id:'bse_pme4', nome:'Sem copart — Platinum PJ (Apt)',aco:'apt',tipo:'pme', valores:[0,0,0,0,0,0,1259.89, 1587.48, 2031.96, 2804.11] },
    ]
  },

  // ── BRADESCO SAÚDE ────────────────────────────────────────────────────
  {
    key: 'bradesco', nome: 'Bradesco Saúde',
    cor: 'var(--bradesco)', cls: 'on-b',
    reajuste: 'A definir',
    info: 'PME · Planos Nacionais · Tabela jan/2026 · Rede credenciada DF · Bradesco Seguros',
    produtos: [
      { id:'bd_1', nome:'Sem copart — Nacional Plus 4 (Apt)', aco:'apt', tipo:'pme', valores:[1111.89,1312.03,1587.55,1905.08,2171.76,2236.91,2723.58,3203.48,3812.14,6670.86] },
      { id:'bd_2', nome:'Sem copart — Premium 6 (Apt)',       aco:'apt', tipo:'pme', valores:[1535.55,1811.95,2192.44,2630.95,2999.26,3089.24,3761.34,4424.09,5264.67,9212.65] },
      { id:'bd_3', nome:'Copart total — Nacional Plus 4 (Apt)',aco:'apt', tipo:'pme', valores:[ 889.51,1049.62,1270.03,1524.05,1737.40,1789.52,2178.85,2562.76,3049.68,5336.64] },
      { id:'bd_4', nome:'Sem copart — Efetivo (Enf)',         aco:'enf', tipo:'pme', valores:[ 400.01, 472.01, 571.13, 685.36, 781.30, 804.74, 979.81,1152.46,1371.43,2399.87] },
      { id:'bd_5', nome:'Sem copart — Nacional Flex (Enf)',   aco:'enf', tipo:'pme', valores:[ 466.28, 550.22, 665.76, 798.91, 910.76, 938.08,1142.16,1343.41,1598.66,2797.50] },
      { id:'bd_6', nome:'Copart total — Efetivo (Enf)',       aco:'enf', tipo:'pme', valores:[ 308.01, 363.45, 439.77, 527.73, 601.60, 619.65, 754.46, 887.39,1056.00,1847.90] },
      { id:'bd_7', nome:'Copart total — Nacional Flex (Enf)', aco:'enf', tipo:'pme', valores:[ 359.04, 423.67, 512.63, 615.16, 701.28, 722.32, 879.47,1034.43,1230.97,2154.07] },
    ]
  },

  // ── SULAMERICA SAÚDE ──────────────────────────────────────────────────
  {
    key: 'sulamerica', nome: 'SulAmérica Saúde',
    cor: 'var(--sulamerica)', cls: 'on-sa',
    reajuste: 'A definir',
    info: 'PME Compulsório · Vigência 12m ou 24m · 3–99 vidas · Com e sem copart 30% · Rede credenciada DF · SulAmérica Seguro Saúde',
    produtos: [
      // ── PME 12m | 03–04v | Sem copart ──────────────────────────────
      { id:'sa_04_12_sc_1', nome:'Sem copart — Direto Enf',      aco:'enf', tipo:'pme', fvidas:'03-04', vig:12, valores:[ 388.10,  485.12,  601.55,  667.72,  714.46,  828.78,  990.72, 1161.13, 1382.33,  2328.55] },
      { id:'sa_04_12_sc_2', nome:'Sem copart — Direto Qto',      aco:'apt', tipo:'pme', fvidas:'03-04', vig:12, valores:[ 429.21,  536.51,  665.27,  738.45,  790.15,  916.58, 1095.68, 1284.14, 1528.78,  2575.22] },
      { id:'sa_04_12_sc_3', nome:'Sem copart — Especial RC',     aco:'apt', tipo:'pme', fvidas:'03-04', vig:12, valores:[ 703.93,  879.90, 1091.07, 1211.10, 1295.87, 1503.21, 1796.94, 2106.00, 2507.19,  4223.36] },
      { id:'sa_04_12_sc_4', nome:'Sem copart — Especial 100 R1', aco:'apt', tipo:'pme', fvidas:'03-04', vig:12, valores:[ 740.97,  926.20, 1148.50, 1274.83, 1364.07, 1582.32, 1891.52, 2216.85, 2639.15,  4445.64] },
      { id:'sa_04_12_sc_5', nome:'Sem copart — Executivo R1',    aco:'apt', tipo:'pme', fvidas:'03-04', vig:12, valores:[1409.78, 1762.21, 2185.14, 2425.50, 2595.27, 3010.52, 3598.77, 4217.76, 5021.24,  8458.27] },
      { id:'sa_04_12_sc_6', nome:'Sem copart — Executivo R2',    aco:'apt', tipo:'pme', fvidas:'03-04', vig:12, valores:[1685.85, 2107.33, 2613.09, 2900.52, 3103.54, 3600.11, 4303.58, 5043.78, 6004.62, 10114.80] },
      { id:'sa_04_12_sc_7', nome:'Sem copart — Executivo R3',    aco:'apt', tipo:'pme', fvidas:'03-04', vig:12, valores:[1883.16, 2353.96, 2918.91, 3239.99, 3466.79, 4021.47, 4807.28, 5634.13, 6707.43, 11298.65] },
      { id:'sa_04_12_sc_8', nome:'Sem copart — Prestige',        aco:'apt', tipo:'pme', fvidas:'03-04', vig:12, valores:[2469.80, 3087.27, 3828.22, 4249.33, 4546.77, 5274.25, 6304.84, 7389.25, 8796.92, 14818.41] },
      // ── PME 12m | 03–04v | Com copart 30% ──────────────────────────
      { id:'sa_04_12_cc_1', nome:'Com copart — Direto Enf',      aco:'enf', tipo:'pme', fvidas:'03-04', vig:12, valores:[ 271.67,  339.58,  421.08,  467.41,  500.13,  580.14,  693.51,  812.79,  967.64,  1629.99] },
      { id:'sa_04_12_cc_2', nome:'Com copart — Direto Qto',      aco:'apt', tipo:'pme', fvidas:'03-04', vig:12, valores:[ 300.45,  375.56,  465.69,  516.92,  553.11,  641.61,  766.98,  898.91, 1070.14,  1802.65] },
      { id:'sa_04_12_cc_3', nome:'Com copart — Especial RC',     aco:'apt', tipo:'pme', fvidas:'03-04', vig:12, valores:[ 527.94,  659.92,  818.31,  908.32,  971.90, 1127.41, 1347.71, 1579.50, 1880.40,  3167.51] },
      { id:'sa_04_12_cc_4', nome:'Com copart — Especial 100 R1', aco:'apt', tipo:'pme', fvidas:'03-04', vig:12, valores:[ 555.73,  694.65,  861.37,  956.14, 1023.06, 1186.74, 1418.64, 1662.63, 1979.37,  3334.24] },
      { id:'sa_04_12_cc_5', nome:'Com copart — Executivo R1',    aco:'apt', tipo:'pme', fvidas:'03-04', vig:12, valores:[1198.30, 1497.88, 1857.37, 2061.66, 2205.99, 2558.94, 3058.96, 3585.10, 4268.06,  7189.54] },
      { id:'sa_04_12_cc_6', nome:'Com copart — Executivo R2',    aco:'apt', tipo:'pme', fvidas:'03-04', vig:12, valores:[1432.98, 1791.23, 2221.11, 2465.44, 2638.01, 3060.09, 3658.03, 4287.23, 5103.93,  8597.57] },
      { id:'sa_04_12_cc_7', nome:'Com copart — Executivo R3',    aco:'apt', tipo:'pme', fvidas:'03-04', vig:12, valores:[1600.69, 2000.88, 2481.07, 2754.00, 2946.78, 3418.26, 4086.18, 4789.01, 5701.31,  9603.86] },
      { id:'sa_04_12_cc_8', nome:'Com copart — Prestige',        aco:'apt', tipo:'pme', fvidas:'03-04', vig:12, valores:[2099.34, 2624.17, 3253.99, 3611.93, 3864.76, 4483.11, 5359.10, 6280.87, 7477.38, 12595.65] },
      // ── PME 24m | 03–04v | Sem copart ──────────────────────────────
      { id:'sa_04_24_sc_1', nome:'Sem copart — Direto Enf',      aco:'enf', tipo:'pme', fvidas:'03-04', vig:24, valores:[ 352.81,  441.01,  546.85,  607.02,  649.51,  753.43,  900.66, 1055.57, 1256.67,  2116.86] },
      { id:'sa_04_24_sc_2', nome:'Sem copart — Direto Qto',      aco:'apt', tipo:'pme', fvidas:'03-04', vig:24, valores:[ 390.19,  487.74,  604.80,  671.32,  718.32,  833.26,  996.07, 1167.41, 1389.79,  2341.11] },
      { id:'sa_04_24_sc_3', nome:'Sem copart — Especial RC',     aco:'apt', tipo:'pme', fvidas:'03-04', vig:24, valores:[ 639.92,  799.91,  991.88, 1100.99, 1178.06, 1366.55, 1633.58, 1914.55, 2279.27,  3839.41] },
      { id:'sa_04_24_sc_4', nome:'Sem copart — Especial 100 R1', aco:'apt', tipo:'pme', fvidas:'03-04', vig:24, valores:[ 673.61,  842.01, 1044.09, 1158.94, 1240.07, 1438.48, 1719.55, 2015.31, 2399.23,  4041.49] },
      { id:'sa_04_24_sc_5', nome:'Sem copart — Executivo R1',    aco:'apt', tipo:'pme', fvidas:'03-04', vig:24, valores:[1281.60, 1602.01, 1986.49, 2205.00, 2359.34, 2736.83, 3271.61, 3834.33, 4564.76,  7689.35] },
      { id:'sa_04_24_sc_6', nome:'Sem copart — Executivo R2',    aco:'apt', tipo:'pme', fvidas:'03-04', vig:24, valores:[1532.60, 1915.74, 2375.53, 2636.83, 2821.40, 3272.83, 3912.34, 4585.27, 5458.74,  9195.27] },
      { id:'sa_04_24_sc_7', nome:'Sem copart — Executivo R3',    aco:'apt', tipo:'pme', fvidas:'03-04', vig:24, valores:[1711.96, 2139.97, 2653.56, 2945.45, 3151.63, 3655.89, 4370.25, 5121.94, 6097.67, 10271.51] },
      { id:'sa_04_24_sc_8', nome:'Sem copart — Prestige',        aco:'apt', tipo:'pme', fvidas:'03-04', vig:24, valores:[2245.28, 2806.61, 3480.20, 3863.02, 4133.42, 4794.77, 5731.66, 6717.51, 7997.19, 13471.29] },
      // ── PME 24m | 03–04v | Com copart 30% ──────────────────────────
      { id:'sa_04_24_cc_1', nome:'Com copart — Direto Enf',      aco:'enf', tipo:'pme', fvidas:'03-04', vig:24, valores:[ 246.97,  308.71,  382.80,  424.91,  454.66,  527.40,  630.46,  738.91,  879.67,  1481.81] },
      { id:'sa_04_24_cc_2', nome:'Com copart — Direto Qto',      aco:'apt', tipo:'pme', fvidas:'03-04', vig:24, valores:[ 273.14,  341.42,  423.36,  469.92,  502.82,  583.28,  697.25,  817.18,  972.86,  1638.78] },
      { id:'sa_04_24_cc_3', nome:'Com copart — Especial RC',     aco:'apt', tipo:'pme', fvidas:'03-04', vig:24, valores:[ 479.94,  599.92,  743.91,  825.75,  883.55, 1024.92, 1225.18, 1435.91, 1709.45,  2879.56] },
      { id:'sa_04_24_cc_4', nome:'Com copart — Especial 100 R1', aco:'apt', tipo:'pme', fvidas:'03-04', vig:24, valores:[ 505.21,  631.51,  783.07,  869.22,  930.06, 1078.87, 1289.67, 1511.49, 1799.42,  3031.12] },
      { id:'sa_04_24_cc_5', nome:'Com copart — Executivo R1',    aco:'apt', tipo:'pme', fvidas:'03-04', vig:24, valores:[1089.36, 1361.71, 1688.51, 1874.24, 2005.44, 2326.31, 2780.87, 3259.18, 3880.05,  6535.95] },
      { id:'sa_04_24_cc_6', nome:'Com copart — Executivo R2',    aco:'apt', tipo:'pme', fvidas:'03-04', vig:24, valores:[1302.71, 1628.38, 2019.19, 2241.31, 2398.20, 2781.90, 3325.49, 3897.48, 4639.93,  7815.97] },
      { id:'sa_04_24_cc_7', nome:'Com copart — Executivo R3',    aco:'apt', tipo:'pme', fvidas:'03-04', vig:24, valores:[1455.17, 1818.98, 2255.52, 2503.63, 2678.89, 3107.51, 3714.71, 4353.64, 5183.01,  8730.78] },
      { id:'sa_04_24_cc_8', nome:'Com copart — Prestige',        aco:'apt', tipo:'pme', fvidas:'03-04', vig:24, valores:[1908.49, 2385.62, 2958.17, 3283.58, 3513.41, 4075.56, 4871.92, 5709.88, 6797.62, 11450.59] },
      // ── PME 12m | 05–29v | Sem copart ──────────────────────────────
      { id:'sa_29_12_sc_1', nome:'Sem copart — Direto Enf',      aco:'enf', tipo:'pme', fvidas:'05-29', vig:12, valores:[ 329.88,  412.34,  511.32,  567.56,  607.29,  704.46,  842.12,  986.97, 1174.99,  1979.27] },
      { id:'sa_29_12_sc_2', nome:'Sem copart — Direto Qto',      aco:'apt', tipo:'pme', fvidas:'05-29', vig:12, valores:[ 364.83,  456.04,  565.48,  627.69,  671.63,  779.09,  931.33, 1091.53, 1299.45,  2188.94] },
      { id:'sa_29_12_sc_3', nome:'Sem copart — Especial RC',     aco:'apt', tipo:'pme', fvidas:'05-29', vig:12, valores:[ 598.33,  747.92,  927.40, 1029.43, 1101.48, 1277.74, 1527.39, 1790.10, 2131.12,  3589.86] },
      { id:'sa_29_12_sc_4', nome:'Sem copart — Especial 100 R1', aco:'apt', tipo:'pme', fvidas:'05-29', vig:12, valores:[ 629.82,  787.28,  976.21, 1083.62, 1159.47, 1344.98, 1607.79, 1884.32, 2243.29,  3778.79] },
      { id:'sa_29_12_sc_5', nome:'Sem copart — Executivo R1',    aco:'apt', tipo:'pme', fvidas:'05-29', vig:12, valores:[1198.30, 1497.88, 1857.37, 2061.66, 2205.99, 2558.94, 3058.96, 3585.10, 4268.06,  7189.54] },
      { id:'sa_29_12_sc_6', nome:'Sem copart — Executivo R2',    aco:'apt', tipo:'pme', fvidas:'05-29', vig:12, valores:[1432.98, 1791.23, 2221.11, 2465.44, 2638.01, 3060.09, 3658.03, 4287.23, 5103.93,  8597.57] },
      { id:'sa_29_12_sc_7', nome:'Sem copart — Executivo R3',    aco:'apt', tipo:'pme', fvidas:'05-29', vig:12, valores:[1600.69, 2000.88, 2481.07, 2754.00, 2946.78, 3418.26, 4086.18, 4789.01, 5701.31,  9603.86] },
      { id:'sa_29_12_sc_8', nome:'Sem copart — Prestige',        aco:'apt', tipo:'pme', fvidas:'05-29', vig:12, valores:[2099.34, 2624.17, 3253.99, 3611.93, 3864.76, 4483.11, 5359.10, 6280.87, 7477.38, 12595.65] },
      // ── PME 12m | 05–29v | Com copart 30% ──────────────────────────
      { id:'sa_29_12_cc_1', nome:'Com copart — Direto Enf',      aco:'enf', tipo:'pme', fvidas:'05-29', vig:12, valores:[ 230.91,  288.64,  357.92,  397.29,  425.10,  493.13,  589.48,  690.88,  822.49,  1385.46] },
      { id:'sa_29_12_cc_2', nome:'Com copart — Direto Qto',      aco:'apt', tipo:'pme', fvidas:'05-29', vig:12, valores:[ 255.38,  319.23,  395.84,  439.38,  470.14,  545.36,  651.93,  764.07,  909.62,  1532.25] },
      { id:'sa_29_12_cc_3', nome:'Com copart — Especial RC',     aco:'apt', tipo:'pme', fvidas:'05-29', vig:12, valores:[ 448.74,  560.93,  695.56,  772.07,  826.12,  958.30, 1145.54, 1342.58, 1598.34,  2692.39] },
      { id:'sa_29_12_cc_4', nome:'Com copart — Especial 100 R1', aco:'apt', tipo:'pme', fvidas:'05-29', vig:12, valores:[ 472.37,  590.46,  732.17,  812.72,  869.60, 1008.73, 1205.84, 1413.25, 1682.46,  2834.10] },
      { id:'sa_29_12_cc_5', nome:'Com copart — Executivo R1',    aco:'apt', tipo:'pme', fvidas:'05-29', vig:12, valores:[1018.56, 1273.20, 1578.77, 1752.42, 1875.09, 2175.09, 2600.11, 3047.34, 3627.85,  6111.11] },
      { id:'sa_29_12_cc_6', nome:'Com copart — Executivo R2',    aco:'apt', tipo:'pme', fvidas:'05-29', vig:12, valores:[1218.03, 1522.54, 1887.95, 2095.61, 2242.31, 2601.09, 3109.33, 3644.14, 4338.35,  7307.94] },
      { id:'sa_29_12_cc_7', nome:'Com copart — Executivo R3',    aco:'apt', tipo:'pme', fvidas:'05-29', vig:12, valores:[1360.58, 1700.74, 2108.92, 2340.90, 2504.76, 2905.52, 3473.25, 4070.65, 4846.11,  8163.29] },
      { id:'sa_29_12_cc_8', nome:'Com copart — Prestige',        aco:'apt', tipo:'pme', fvidas:'05-29', vig:12, valores:[1784.43, 2230.54, 2765.90, 3070.15, 3285.04, 3810.64, 4555.25, 5338.74, 6355.78, 10706.30] },
      // ── PME 24m | 05–29v | Sem copart ──────────────────────────────
      { id:'sa_29_24_sc_1', nome:'Sem copart — Direto Enf',      aco:'enf', tipo:'pme', fvidas:'05-29', vig:24, valores:[ 299.89,  374.86,  464.83,  515.97,  552.08,  640.42,  765.56,  897.24, 1068.17,  1799.34] },
      { id:'sa_29_24_sc_2', nome:'Sem copart — Direto Qto',      aco:'apt', tipo:'pme', fvidas:'05-29', vig:24, valores:[ 331.67,  414.58,  514.07,  570.62,  610.57,  708.27,  846.66,  992.30, 1181.32,  1989.95] },
      { id:'sa_29_24_sc_3', nome:'Sem copart — Especial RC',     aco:'apt', tipo:'pme', fvidas:'05-29', vig:24, valores:[ 543.95,  679.91,  843.10,  935.85, 1001.36, 1161.58, 1388.54, 1627.36, 1937.38,  3263.51] },
      { id:'sa_29_24_sc_4', nome:'Sem copart — Especial 100 R1', aco:'apt', tipo:'pme', fvidas:'05-29', vig:24, valores:[ 572.56,  715.71,  887.47,  985.10, 1054.06, 1222.71, 1461.62, 1713.01, 2039.35,  3435.27] },
      { id:'sa_29_24_sc_5', nome:'Sem copart — Executivo R1',    aco:'apt', tipo:'pme', fvidas:'05-29', vig:24, valores:[1089.36, 1361.71, 1688.51, 1874.24, 2005.44, 2326.31, 2780.87, 3259.18, 3880.05,  6535.95] },
      { id:'sa_29_24_sc_6', nome:'Sem copart — Executivo R2',    aco:'apt', tipo:'pme', fvidas:'05-29', vig:24, valores:[1302.71, 1628.38, 2019.19, 2241.31, 2398.20, 2781.90, 3325.49, 3897.48, 4639.93,  7815.97] },
      { id:'sa_29_24_sc_7', nome:'Sem copart — Executivo R3',    aco:'apt', tipo:'pme', fvidas:'05-29', vig:24, valores:[1455.17, 1818.98, 2255.52, 2503.63, 2678.89, 3107.51, 3714.71, 4353.64, 5183.01,  8730.78] },
      { id:'sa_29_24_sc_8', nome:'Sem copart — Prestige',        aco:'apt', tipo:'pme', fvidas:'05-29', vig:24, valores:[1908.49, 2385.62, 2958.17, 3283.58, 3513.41, 4075.56, 4871.92, 5709.88, 6797.62, 11450.59] },
      // ── PME 24m | 05–29v | Com copart 30% ──────────────────────────
      { id:'sa_29_24_cc_1', nome:'Com copart — Direto Enf',      aco:'enf', tipo:'pme', fvidas:'05-29', vig:24, valores:[ 209.92,  262.40,  325.38,  361.18,  386.46,  448.29,  535.89,  628.07,  747.72,  1259.52] },
      { id:'sa_29_24_cc_2', nome:'Com copart — Direto Qto',      aco:'apt', tipo:'pme', fvidas:'05-29', vig:24, valores:[ 232.17,  290.21,  359.86,  399.44,  427.40,  495.79,  592.67,  694.60,  826.93,  1392.96] },
      { id:'sa_29_24_cc_3', nome:'Com copart — Especial RC',     aco:'apt', tipo:'pme', fvidas:'05-29', vig:24, valores:[ 407.95,  509.94,  632.32,  701.88,  751.01,  871.18, 1041.40, 1220.53, 1453.03,  2447.63] },
      { id:'sa_29_24_cc_4', nome:'Com copart — Especial 100 R1', aco:'apt', tipo:'pme', fvidas:'05-29', vig:24, valores:[ 429.43,  536.78,  665.60,  738.83,  790.54,  917.03, 1096.21, 1284.77, 1529.51,  2576.45] },
      { id:'sa_29_24_cc_5', nome:'Com copart — Executivo R1',    aco:'apt', tipo:'pme', fvidas:'05-29', vig:24, valores:[ 925.96, 1157.46, 1435.23, 1593.11, 1704.62, 1977.36, 2363.73, 2770.31, 3298.05,  5555.55] },
      { id:'sa_29_24_cc_6', nome:'Com copart — Executivo R2',    aco:'apt', tipo:'pme', fvidas:'05-29', vig:24, valores:[1107.29, 1384.13, 1716.32, 1905.10, 2038.46, 2364.62, 2826.67, 3312.86, 3943.95,  6643.58] },
      { id:'sa_29_24_cc_7', nome:'Com copart — Executivo R3',    aco:'apt', tipo:'pme', fvidas:'05-29', vig:24, valores:[1236.90, 1546.13, 1917.20, 2128.09, 2277.06, 2641.38, 3157.51, 3700.60, 4405.57,  7421.17] },
      { id:'sa_29_24_cc_8', nome:'Com copart — Prestige',        aco:'apt', tipo:'pme', fvidas:'05-29', vig:24, valores:[1622.22, 2027.78, 2514.45, 2791.04, 2986.41, 3464.22, 4141.12, 4853.39, 5777.97,  9733.01] },
      // ── PME 12m | 30–99v | Sem copart (DF Mais) ────────────────────
      { id:'sa_99_12_sc_1', nome:'Sem copart — Direto Enf',      aco:'enf', tipo:'pme', fvidas:'30-99', vig:12, valores:[ 302.29,  377.86,  468.55,  520.09,  556.49,  645.53,  771.67,  904.40, 1076.68,  1813.67] },
      { id:'sa_99_12_sc_2', nome:'Sem copart — Direto Qto',      aco:'apt', tipo:'pme', fvidas:'30-99', vig:12, valores:[ 334.32,  417.90,  518.20,  575.20,  615.46,  713.94,  853.44, 1000.23, 1190.77,  2005.86] },
      { id:'sa_99_12_sc_3', nome:'Sem copart — Especial RC',     aco:'apt', tipo:'pme', fvidas:'30-99', vig:12, valores:[ 549.38,  686.72,  851.53,  945.20, 1011.37, 1173.19, 1402.43, 1643.64, 1956.75,  3296.15] },
      { id:'sa_99_12_sc_4', nome:'Sem copart — Especial 100 R1', aco:'apt', tipo:'pme', fvidas:'30-99', vig:12, valores:[ 578.29,  722.86,  896.35,  994.94, 1064.59, 1234.93, 1476.23, 1730.14, 2059.73,  3469.62] },
      { id:'sa_99_12_sc_5', nome:'Sem copart — Executivo R1',    aco:'apt', tipo:'pme', fvidas:'30-99', vig:12, valores:[1106.79, 1383.49, 1715.53, 1904.24, 2037.53, 2363.54, 2825.38, 3311.34, 3942.14,  6640.54] },
      { id:'sa_99_12_sc_6', nome:'Sem copart — Executivo R2',    aco:'apt', tipo:'pme', fvidas:'30-99', vig:12, valores:[1323.54, 1654.43, 2051.49, 2277.16, 2436.56, 2826.41, 3378.69, 3959.83, 4714.17,  7941.02] },
      { id:'sa_99_12_sc_7', nome:'Sem copart — Executivo R3',    aco:'apt', tipo:'pme', fvidas:'30-99', vig:12, valores:[1478.46, 1848.08, 2291.62, 2543.70, 2721.76, 3157.24, 3774.17, 4423.32, 5265.96,  8870.51] },
      { id:'sa_99_12_sc_8', nome:'Sem copart — Prestige',        aco:'apt', tipo:'pme', fvidas:'30-99', vig:12, valores:[1939.03, 2423.79, 3005.50, 3336.10, 3569.64, 4140.78, 4949.89, 5801.27, 6906.40, 11633.83] },
      // ── PME 12m | 30–99v | Com copart 30% (DF Mais) ────────────────
      { id:'sa_99_12_cc_1', nome:'Com copart — Direto Enf',      aco:'enf', tipo:'pme', fvidas:'30-99', vig:12, valores:[ 211.60,  264.50,  327.98,  364.06,  389.54,  451.87,  540.16,  633.07,  753.67,  1269.56] },
      { id:'sa_99_12_cc_2', nome:'Com copart — Direto Qto',      aco:'apt', tipo:'pme', fvidas:'30-99', vig:12, valores:[ 234.02,  292.53,  362.74,  402.64,  430.82,  499.76,  597.41,  700.16,  833.54,  1404.10] },
      { id:'sa_99_12_cc_3', nome:'Com copart — Especial RC',     aco:'apt', tipo:'pme', fvidas:'30-99', vig:12, valores:[ 412.03,  515.04,  638.65,  708.90,  758.53,  879.89, 1051.82, 1232.73, 1467.57,  2472.11] },
      { id:'sa_99_12_cc_4', nome:'Com copart — Especial 100 R1', aco:'apt', tipo:'pme', fvidas:'30-99', vig:12, valores:[ 433.71,  542.14,  672.25,  746.20,  798.44,  926.19, 1107.16, 1297.60, 1544.78,  2602.19] },
      { id:'sa_99_12_cc_5', nome:'Com copart — Executivo R1',    aco:'apt', tipo:'pme', fvidas:'30-99', vig:12, valores:[ 940.78, 1175.97, 1458.20, 1618.61, 1731.91, 2009.02, 2401.58, 2814.65, 3350.83,  5644.48] },
      { id:'sa_99_12_cc_6', nome:'Com copart — Executivo R2',    aco:'apt', tipo:'pme', fvidas:'30-99', vig:12, valores:[1125.02, 1406.27, 1743.77, 1935.59, 2071.08, 2402.46, 2871.90, 3365.87, 4007.05,  6749.89] },
      { id:'sa_99_12_cc_7', nome:'Com copart — Executivo R3',    aco:'apt', tipo:'pme', fvidas:'30-99', vig:12, valores:[1256.70, 1570.87, 1947.88, 2162.15, 2313.50, 2683.66, 3208.05, 3759.83, 4476.07,  7539.94] },
      { id:'sa_99_12_cc_8', nome:'Com copart — Prestige',        aco:'apt', tipo:'pme', fvidas:'30-99', vig:12, valores:[1648.18, 2060.22, 2554.67, 2835.69, 3034.19, 3519.66, 4207.40, 4931.07, 5870.43,  9888.75] },
      // ── PME 24m | 30–99v | Sem copart (DF Mais) ────────────────────
      { id:'sa_99_24_sc_1', nome:'Sem copart — Direto Enf',      aco:'enf', tipo:'pme', fvidas:'30-99', vig:24, valores:[ 299.89,  374.86,  464.83,  515.96,  552.08,  640.41,  765.54,  897.22, 1068.13,  1799.27] },
      { id:'sa_99_24_sc_2', nome:'Sem copart — Direto Qto',      aco:'apt', tipo:'pme', fvidas:'30-99', vig:24, valores:[ 331.66,  414.58,  514.08,  570.63,  610.57,  708.26,  846.66,  992.28, 1181.31,  1989.92] },
      { id:'sa_99_24_sc_3', nome:'Sem copart — Especial RC',     aco:'apt', tipo:'pme', fvidas:'30-99', vig:24, valores:[ 543.94,  679.93,  843.11,  935.86, 1001.37, 1161.59, 1388.56, 1627.39, 1937.41,  3263.56] },
      { id:'sa_99_24_sc_4', nome:'Sem copart — Especial 100 R1', aco:'apt', tipo:'pme', fvidas:'30-99', vig:24, valores:[ 572.57,  715.71,  887.48,  985.10, 1054.06, 1222.71, 1461.63, 1713.03, 2039.36,  3435.30] },
      { id:'sa_99_24_sc_5', nome:'Sem copart — Executivo R1',    aco:'apt', tipo:'pme', fvidas:'30-99', vig:24, valores:[1089.36, 1361.70, 1688.51, 1874.24, 2005.44, 2326.31, 2780.88, 3259.19, 3880.06,  6535.96] },
      { id:'sa_99_24_sc_6', nome:'Sem copart — Executivo R2',    aco:'apt', tipo:'pme', fvidas:'30-99', vig:24, valores:[1302.70, 1628.38, 2019.19, 2241.30, 2398.20, 2781.91, 3325.49, 3897.48, 4639.94,  7815.98] },
      { id:'sa_99_24_sc_7', nome:'Sem copart — Executivo R3',    aco:'apt', tipo:'pme', fvidas:'30-99', vig:24, valores:[1455.18, 1818.97, 2255.52, 2503.63, 2678.89, 3107.51, 3714.72, 4353.65, 5183.01,  8730.78] },
      { id:'sa_99_24_sc_8', nome:'Sem copart — Prestige',        aco:'apt', tipo:'pme', fvidas:'30-99', vig:24, valores:[1908.50, 2385.62, 2958.17, 3283.57, 3513.42, 4075.57, 4871.94, 5709.91, 6797.63, 11450.62] },
      // ── PME 24m | 30–99v | Com copart 30% (DF Mais) ────────────────
      { id:'sa_99_24_cc_1', nome:'Com copart — Direto Enf',      aco:'enf', tipo:'pme', fvidas:'30-99', vig:24, valores:[ 209.93,  262.41,  325.39,  361.18,  386.46,  448.30,  535.90,  628.07,  747.72,  1259.53] },
      { id:'sa_99_24_cc_2', nome:'Com copart — Direto Qto',      aco:'apt', tipo:'pme', fvidas:'30-99', vig:24, valores:[ 232.17,  290.21,  359.86,  399.45,  427.41,  495.79,  592.67,  694.61,  826.93,  1392.96] },
      { id:'sa_99_24_cc_3', nome:'Com copart — Especial RC',     aco:'apt', tipo:'pme', fvidas:'30-99', vig:24, valores:[ 407.96,  509.95,  632.34,  701.90,  751.03,  871.19, 1041.42, 1220.55, 1453.06,  2447.68] },
      { id:'sa_99_24_cc_4', nome:'Com copart — Especial 100 R1', aco:'apt', tipo:'pme', fvidas:'30-99', vig:24, valores:[ 429.43,  536.79,  665.62,  738.84,  790.56,  917.05, 1096.24, 1284.79, 1529.54,  2576.51] },
      { id:'sa_99_24_cc_5', nome:'Com copart — Executivo R1',    aco:'apt', tipo:'pme', fvidas:'30-99', vig:24, valores:[ 925.96, 1157.45, 1435.24, 1593.11, 1704.63, 1977.38, 2363.76, 2770.32, 3298.06,  5555.59] },
      { id:'sa_99_24_cc_6', nome:'Com copart — Executivo R2',    aco:'apt', tipo:'pme', fvidas:'30-99', vig:24, valores:[1107.30, 1384.12, 1716.31, 1905.10, 2038.46, 2364.62, 2826.66, 3312.85, 3943.94,  6643.57] },
      { id:'sa_99_24_cc_7', nome:'Com copart — Executivo R3',    aco:'apt', tipo:'pme', fvidas:'30-99', vig:24, valores:[1236.90, 1546.13, 1917.20, 2128.09, 2277.06, 2641.39, 3157.52, 3700.62, 4405.57,  7421.19] },
      { id:'sa_99_24_cc_8', nome:'Com copart — Prestige',        aco:'apt', tipo:'pme', fvidas:'30-99', vig:24, valores:[1622.22, 2027.77, 2514.43, 2791.02, 2986.40, 3464.22, 4141.13, 4853.41, 5777.97,  9732.99] },
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
    tipo:   p.tipo   || 'adesao',
    mod:    p.mod    || null,
    fvidas: p.fvidas || null,
    vig:    p.vig    || null,
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
