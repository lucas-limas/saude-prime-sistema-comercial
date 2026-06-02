"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Calculator, BookOpen, FileBarChart } from "lucide-react";

const features = [
  {
    icon: Calculator,
    title: "Cotador Comparativo",
    description:
      "Compare planos de múltiplas operadoras lado a lado em tempo real. Filtre por faixa etária, cobertura e valor para encontrar a melhor proposta.",
    tags: ["Unity Saúde", "Evo Saúde", "Plenum", "Amil"],
    accent: "rgba(255,255,255,0.08)",
  },
  {
    icon: BookOpen,
    title: "Catálogo Digital",
    description:
      "Gestão completa de operadoras, planos, coberturas, tabelas de preços e rede credenciada. Sempre atualizado, sempre acessível — mesmo offline.",
    tags: ["Tabela de preços", "Rede credenciada", "Carências", "ARC"],
    accent: "rgba(201,162,39,0.07)",
  },
  {
    icon: FileBarChart,
    title: "Apresentação Executiva",
    description:
      "Gere apresentações profissionais personalizadas com metodologia GPCT e técnicas de SPIN Selling para impactar seus clientes empresariais.",
    tags: ["GPCT + SPIN", "Comparativo visual", "12 slides", "Personalizado"],
    accent: "rgba(255,255,255,0.04)",
  },
];

export default function Features() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="recursos" className="py-28 px-6" ref={ref}>
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-white/35 font-medium mb-4">
            Recursos
          </p>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-5 leading-tight">
            Tudo que uma corretora precisa
          </h2>
          <p className="text-white/45 text-lg max-w-lg mx-auto leading-relaxed"
            style={{ color: "rgba(255,255,255,0.45)" }}>
            Ferramentas pensadas para o cotidiano de quem vende planos de saúde corporativos.
          </p>
        </motion.div>

        {/* Cards grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 32 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.13 }}
              whileHover={{ y: -5, transition: { duration: 0.22, ease: "easeOut" } }}
              className="glass-card rounded-2xl p-7 flex flex-col cursor-default"
            >
              {/* Icon */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 border border-white/[0.1]"
                style={{ background: feature.accent }}
              >
                <feature.icon size={22} className="text-white/75" strokeWidth={1.75} />
              </div>

              <h3 className="text-lg font-semibold text-white mb-3">{feature.title}</h3>
              <p className="text-sm text-white/45 leading-relaxed mb-6 flex-1"
                style={{ color: "rgba(255,255,255,0.45)" }}>
                {feature.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {feature.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-white/[0.05] text-white/50 border border-white/[0.07]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
