"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const features = [
  {
    num: "01",
    title: "Cotador Comparativo",
    description:
      "Compare planos de múltiplas operadoras lado a lado em tempo real. Filtre por faixa etária, cobertura e valor. O sistema calcula automaticamente o custo por vida e destaca a melhor proposta para cada perfil de empresa.",
    tags: ["Unity Saúde", "Evo Saúde", "Plenum", "Amil", "Porto Saúde"],
  },
  {
    num: "02",
    title: "Catálogo Digital",
    description:
      "Gestão completa de operadoras, planos, coberturas, tabelas de preços e rede credenciada. Sempre atualizado, sempre acessível — mesmo sem internet. Nunca mais perca uma venda por informação desatualizada.",
    tags: ["Tabela de preços", "Rede credenciada", "Carências", "ARC", "Offline"],
  },
  {
    num: "03",
    title: "Apresentação Executiva",
    description:
      "Gere apresentações profissionais personalizadas em um clique. Metodologia GPCT e SPIN Selling embutidas nos slides — impressione decisores corporativos e aumente sua taxa de fechamento.",
    tags: ["GPCT + SPIN", "Comparativo visual", "12 slides", "Personalizado", "PDF"],
  },
];

export default function Features() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="recursos" className="section px-6" ref={ref}>
      <div className="container-lg">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55 }}
          className="mb-16"
        >
          <p className="text-xs uppercase tracking-[0.22em] text-muted font-medium mb-4">
            Recursos
          </p>
          <h2 className="text-section text-white">
            Tudo que sua<br />corretora precisa
          </h2>
        </motion.div>

        {/* Feature list */}
        <div className="divide-y divide-white/[0.06]">
          {features.map((feature, i) => (
            <motion.div
              key={feature.num}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group grid md:grid-cols-[80px_1fr_1fr] gap-6 py-10 hover:bg-white/[0.015] transition-colors duration-300 px-4 -mx-4 rounded-xl cursor-default"
            >
              {/* Number */}
              <div className="text-xs font-mono text-muted group-hover:text-white/50 transition-colors pt-1">
                {feature.num}
              </div>

              {/* Title */}
              <div>
                <h3 className="text-xl font-semibold text-white leading-tight mb-3">
                  {feature.title}
                </h3>
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {feature.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] px-2.5 py-1 rounded-full bg-white/[0.05] text-muted border border-white/[0.07]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Description */}
              <p className="text-secondary-ui text-sm leading-relaxed md:pt-1">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
