"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  Users,
  ToggleRight,
  TableProperties,
  Sparkles,
  ChevronRight,
} from "lucide-react";

const steps = [
  {
    id: "vidas",
    label: "1. Defina as vidas",
    description:
      "Informe a quantidade de beneficiários por faixa etária. O sistema calcula o custo real de cada operadora com base na composição exata da empresa.",
    screenshot: "/screenshots/vidas.webp",
    alt: "Seletor de vidas por faixa etária",
    highlight: "Faixas de 0 a 59+ anos",
  },
  {
    id: "planos",
    label: "2. Escolha operadoras",
    description:
      "Ative ou desative cada operadora com um clique. Filtre por coparticipação, modalidade PME ou Adesão, e vigência de 12 ou 24 meses.",
    screenshot: "/screenshots/planos.webp",
    alt: "Seleção de operadoras e planos",
    highlight: "10+ operadoras disponíveis",
  },
  {
    id: "resultado",
    label: "3. Compare e feche",
    description:
      "Tabela comparativa completa com preços por faixa. O sistema identifica automaticamente a opção mais econômica e gera a apresentação executiva com 1 clique.",
    screenshot: "/screenshots/resultado.webp",
    alt: "Tabela de resultado comparativo",
    highlight: "Recomendação automática",
  },
];

const differentials = [
  {
    icon: Users,
    title: "10+ operadoras",
    description: "Amil, Porto Saúde, Bradesco, SulAmérica, Unity, Evo, Plenum e mais",
  },
  {
    icon: TableProperties,
    title: "Comparativo por faixa etária",
    description: "Preços calculados faixa a faixa, com total real por número de vidas",
  },
  {
    icon: ToggleRight,
    title: "Filtros avançados",
    description: "Coparticipação, modalidade PME/Adesão, vigência 12 ou 24 meses",
  },
  {
    icon: Sparkles,
    title: "Apresentação com 1 clique",
    description: "Exporta proposta executiva completa direto do resultado",
  },
];

export default function ProductShowcase() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section id="produto" className="py-28 px-6 relative overflow-hidden" ref={ref}>
      {/* Subtle top border */}
      <div className="divider-gradient absolute top-0 inset-x-0" />

      <div className="max-w-6xl mx-auto">

        {/* ── Section header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-white/35 font-medium mb-4">
            O Sistema
          </p>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <h2 className="text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
                Uma plataforma construída
                <br />
                para <span className="text-gold">corretoras de saúde</span>
              </h2>
              <p
                className="text-lg max-w-xl leading-relaxed"
                style={{ color: "rgba(255,255,255,0.45)" }}
              >
                Esqueça planilhas e cálculos manuais. O Saúde Prime compara até{" "}
                <strong className="text-white/70">10 operadoras simultaneamente</strong>,
                calcula preços por faixa etária e gera apresentações profissionais
                para seus clientes empresariais — tudo em minutos.
              </p>
            </div>
          </div>
        </motion.div>

        {/* ── Step tabs + screenshot ── */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, delay: 0.1 }}
          className="mb-16"
        >
          {/* Tab buttons */}
          <div className="flex flex-col sm:flex-row gap-2 mb-6">
            {steps.map((step, i) => (
              <button
                key={step.id}
                onClick={() => setActiveStep(i)}
                className={`flex-1 flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-left text-sm font-medium transition-all duration-200 cursor-pointer ${
                  activeStep === i
                    ? "bg-white/[0.09] border border-white/[0.16] text-white"
                    : "bg-white/[0.03] border border-white/[0.06] text-white/45 hover:text-white/70 hover:bg-white/[0.05]"
                }`}
              >
                <span>{step.label}</span>
                {activeStep === i && (
                  <ChevronRight size={14} className="text-white/50 flex-shrink-0" />
                )}
              </button>
            ))}
          </div>

          {/* Screenshot + description */}
          <div className="grid lg:grid-cols-[1fr_320px] gap-6 items-start">
            {/* Screenshot */}
            <div className="relative rounded-2xl overflow-hidden glow-ring bg-[#0f0f0f] aspect-[16/9]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep}
                  initial={{ opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="absolute inset-0"
                >
                  <Image
                    src={steps[activeStep].screenshot}
                    alt={steps[activeStep].alt}
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 1024px) 100vw, 800px"
                    onError={(e) => {
                      // Fallback: esconde a imagem se o arquivo não existir ainda
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                  {/* Gradient bottom fade */}
                  <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-[#0f0f0f] to-transparent" />
                </motion.div>
              </AnimatePresence>

              {/* Placeholder quando screenshot não existe */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <p className="text-white/20 text-sm">
                  Adicione {steps[activeStep].screenshot.split("/").pop()} em{" "}
                  <code className="text-white/30">landing/public/screenshots/</code>
                </p>
              </div>
            </div>

            {/* Description card */}
            <div className="glass rounded-2xl p-6 h-full flex flex-col justify-between">
              <div>
                <span className="inline-block text-[11px] font-semibold px-2.5 py-1 rounded-full bg-white/[0.07] text-white/60 border border-white/[0.1] mb-4">
                  {steps[activeStep].highlight}
                </span>
                <h3 className="text-lg font-semibold text-white mb-3">
                  {steps[activeStep].label}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
                  {steps[activeStep].description}
                </p>
              </div>

              {/* Step dots */}
              <div className="flex gap-2 mt-8">
                {steps.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveStep(i)}
                    className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                      i === activeStep
                        ? "w-6 bg-white/60"
                        : "w-1.5 bg-white/20 hover:bg-white/35"
                    }`}
                    aria-label={`Ir para passo ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Differentials grid ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {differentials.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, delay: 0.2 + i * 0.08 }}
              className="glass-card rounded-xl p-4"
            >
              <div className="w-8 h-8 rounded-lg bg-white/[0.06] border border-white/[0.09] flex items-center justify-center mb-3">
                <item.icon size={15} className="text-white/60" strokeWidth={1.75} />
              </div>
              <p className="text-sm font-semibold text-white mb-1">{item.title}</p>
              <p className="text-[12px] leading-relaxed" style={{ color: "rgba(255,255,255,0.38)" }}>
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
