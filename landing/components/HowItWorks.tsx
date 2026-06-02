"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { SlidersHorizontal, BarChart2, TrendingUp } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: SlidersHorizontal,
    title: "Configure o catálogo",
    description:
      "Cadastre operadoras, planos, faixas etárias e tabelas de preços. Mantenha tudo atualizado com rapidez.",
  },
  {
    number: "02",
    icon: BarChart2,
    title: "Gere a cotação",
    description:
      "Informe os dados da empresa — quantidade de vidas, faixas etárias e abrangência — e compare as melhores opções lado a lado.",
  },
  {
    number: "03",
    icon: TrendingUp,
    title: "Feche o negócio",
    description:
      "Use a apresentação executiva gerada automaticamente para convencer o cliente com dados, comparativos e profissionalismo.",
  },
];

export default function HowItWorks() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="como-funciona"
      className="relative py-28 px-6 overflow-hidden"
      ref={ref}
    >
      {/* Dark background panel */}
      <div className="absolute inset-0 bg-[#0a0a0a]" />
      <div className="divider-gradient absolute top-0 inset-x-0" />
      <div className="divider-gradient absolute bottom-0 inset-x-0" />

      <div className="relative max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-white/35 font-medium mb-4">
            Como funciona
          </p>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-5 leading-tight">
            Simples. Rápido. Profissional.
          </h2>
          <p className="text-white/45 text-lg max-w-md mx-auto"
            style={{ color: "rgba(255,255,255,0.45)" }}>
            Do primeiro cadastro à apresentação finalizada em 3 passos.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connecting line (desktop only) */}
          <div className="hidden md:block absolute top-[52px] left-[calc(16.66%+24px)] right-[calc(16.66%+24px)] h-px bg-gradient-to-r from-white/[0.06] via-white/[0.12] to-white/[0.06]" />

          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 32 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.14 }}
              className="relative flex flex-col items-center text-center"
            >
              {/* Icon container */}
              <div className="relative mb-7">
                <div className="w-[104px] h-[104px] rounded-2xl glass-sm flex items-center justify-center">
                  <step.icon size={30} className="text-white/65" strokeWidth={1.5} />
                </div>
                {/* Step number badge */}
                <span className="absolute -top-2.5 -right-2.5 w-7 h-7 rounded-full bg-[#0a0a0a] border border-white/15 flex items-center justify-center text-[10px] font-bold text-white/45">
                  {step.number}
                </span>
              </div>

              <h3 className="text-base font-semibold text-white mb-3">{step.title}</h3>
              <p className="text-sm text-white/42 leading-relaxed max-w-[240px]"
                style={{ color: "rgba(255,255,255,0.42)" }}>
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
