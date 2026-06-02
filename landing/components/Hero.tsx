"use client";

import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, TrendingUp } from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.11 } },
};

const operators = [
  { name: "Unity Saúde", plan: "Premium Nacional", price: "R$ 487,20", tag: "Mais Completo" },
  { name: "Evo Saúde", plan: "Empresarial Plus", price: "R$ 412,80", tag: "Melhor Preço", highlight: true },
  { name: "Amil S450", plan: "Nacional Flex", price: "R$ 534,60", tag: null },
];

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="orb w-[700px] h-[700px] -top-60 -left-60"
          style={{ background: "rgba(255,255,255,0.012)" }}
        />
        <div
          className="orb w-[500px] h-[500px] -bottom-40 -right-40"
          style={{ background: "rgba(201,162,39,0.055)" }}
        />
        <div
          className="orb w-[300px] h-[300px] top-1/2 left-1/3 -translate-y-1/2"
          style={{ background: "rgba(255,255,255,0.008)" }}
        />
      </div>

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)
          `,
          backgroundSize: "72px 72px",
        }}
      />

      <div className="relative max-w-6xl mx-auto px-6 pt-28 pb-16 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* ── Left: text ── */}
          <motion.div
            variants={stagger}
            initial="initial"
            animate="animate"
            className="flex flex-col"
          >
            {/* Badge */}
            <motion.div variants={fadeUp} className="mb-7">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-sm text-xs font-medium text-white/65">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-slow flex-shrink-0" />
                Exclusivo para corretoras de saúde
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={fadeUp}
              className="text-5xl lg:text-6xl xl:text-[68px] font-bold leading-[1.04] tracking-tight mb-5"
            >
              Cote.{" "}
              <span className="text-gradient">Compare.</span>
              <br />
              Conquiste.
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={fadeUp}
              className="text-[17px] text-white/48 leading-relaxed mb-8 max-w-[420px]"
              style={{ color: "rgba(255,255,255,0.48)" }}
            >
              Sistema completo para corretoras de planos de saúde.
              Cotador comparativo, catálogo digital e apresentações
              executivas — tudo pronto para fechar mais contratos.
            </motion.p>

            {/* Buttons */}
            <motion.div variants={fadeUp} className="flex flex-wrap gap-3 mb-9">
              <motion.a
                href="#contato"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="btn-primary group"
              >
                Solicitar demonstração
                <ArrowRight
                  size={15}
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </motion.a>

              <motion.a
                href="#como-funciona"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="btn-secondary"
              >
                Ver como funciona
              </motion.a>
            </motion.div>

            {/* Trust signals */}
            <motion.div
              variants={fadeUp}
              className="flex flex-wrap items-center gap-5 text-xs"
              style={{ color: "rgba(255,255,255,0.38)" }}
            >
              {[
                "4+ operadoras",
                "100+ planos",
                "Funciona offline",
                "Brasília · DF",
              ].map((item) => (
                <span key={item} className="flex items-center gap-1.5">
                  <CheckCircle size={11} className="text-emerald-500/60" />
                  {item}
                </span>
              ))}
            </motion.div>
          </motion.div>

          {/* ── Right: product mockup ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            {/* Glow behind card */}
            <div className="absolute inset-4 bg-white/[0.03] rounded-3xl blur-3xl" />

            {/* Main card */}
            <div className="relative glass rounded-2xl p-6 glow-ring">
              {/* Card header */}
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-[11px] text-white/35 mb-0.5 font-medium tracking-wide uppercase">
                    Cotação #2024-089
                  </p>
                  <p className="text-sm font-semibold text-white">
                    Empresa ABC Ltda • 12 vidas
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-medium">
                  Ativa
                </span>
              </div>

              {/* Operator comparison */}
              <div className="space-y-2.5 mb-5">
                {operators.map((op) => (
                  <div
                    key={op.name}
                    className={`flex items-center justify-between p-3.5 rounded-xl transition-colors ${
                      op.highlight
                        ? "bg-white/[0.08] border border-white/[0.14]"
                        : "bg-white/[0.03] border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-2 h-2 rounded-full flex-shrink-0 ${
                          op.highlight ? "bg-emerald-400" : "bg-white/20"
                        }`}
                      />
                      <div>
                        <p className="text-xs font-semibold text-white/90">{op.name}</p>
                        <p className="text-[11px] text-white/40 mt-0.5">{op.plan}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-white">{op.price}</p>
                      <p className="text-[10px] text-white/35">por vida/mês</p>
                      {op.tag && (
                        <span
                          className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full mt-1 inline-block ${
                            op.highlight
                              ? "bg-emerald-500/15 text-emerald-400"
                              : "bg-white/10 text-white/50"
                          }`}
                        >
                          {op.tag}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom stats row */}
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { label: "Melhor preço", value: "R$ 412" },
                  { label: "Economia", value: "22,8%" },
                  { label: "Cobertura", value: "Nível A" },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="text-center p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.05]"
                  >
                    <p className="text-sm font-bold text-white/90">{s.value}</p>
                    <p className="text-[10px] text-white/35 mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating badge: presentation */}
            <motion.div
              animate={{ y: [0, -7, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -right-5 -bottom-5 glass-sm rounded-xl px-4 py-3 min-w-[150px]"
            >
              <p className="text-[10px] text-white/45 mb-1.5">Apresentação gerada</p>
              <p className="text-xs font-semibold text-white">12 slides prontos</p>
              <div className="flex gap-1 mt-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-1 rounded-full flex-1"
                    style={{
                      background: i < 3 ? "rgba(201,162,39,0.5)" : "rgba(255,255,255,0.12)",
                    }}
                  />
                ))}
              </div>
            </motion.div>

            {/* Floating badge: stats */}
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
              className="absolute -left-5 top-16 glass-sm rounded-xl px-4 py-3"
            >
              <div className="flex items-center gap-2">
                <TrendingUp size={14} className="text-emerald-400" />
                <div>
                  <p className="text-[10px] text-white/45">Operadoras</p>
                  <p className="text-sm font-bold text-white">4+ ativas</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-[#080808] to-transparent pointer-events-none" />
    </section>
  );
}
