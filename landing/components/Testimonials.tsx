"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const testimonials = [
  {
    quote:
      "Antes eu passava horas montando cotações no Excel. Hoje envio um comparativo completo em menos de 10 minutos. Os clientes ficam impressionados com o profissionalismo da apresentação.",
    name: "Ana Paula M.",
    role: "Corretora · Brasília / DF",
    initials: "AP",
  },
  {
    quote:
      "O catálogo digital mudou minha rotina. Consigo tirar dúvidas dos clientes na hora, mesmo sem internet, durante reuniões presenciais. Informação sempre atualizada na palma da mão.",
    name: "Ricardo T.",
    role: "Corretor · Taguatinga / DF",
    initials: "RT",
  },
  {
    quote:
      "A apresentação executiva é o diferencial. Chego na empresa com slides prontos, comparativo visual e argumentos estruturados. Minha taxa de fechamento aumentou visivelmente.",
    name: "Fernanda L.",
    role: "Corretora · Águas Claras / DF",
    initials: "FL",
  },
];

export default function Testimonials() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="section px-6" ref={ref}>
      <div className="container-lg">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55 }}
          className="text-center mb-14"
        >
          <p className="text-xs uppercase tracking-[0.22em] text-muted font-medium mb-4">
            Depoimentos
          </p>
          <h2 className="text-section text-white">
            O que dizem os<br />corretores
          </h2>
        </motion.div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="card p-7 flex flex-col gap-6"
            >
              {/* Quote mark */}
              <span className="text-4xl font-serif leading-none text-white/10 select-none">&ldquo;</span>

              <p className="text-sm text-secondary-ui leading-relaxed flex-1 -mt-4">
                {t.quote}
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-2 border-t border-white/[0.07]">
                <div className="w-8 h-8 rounded-full bg-white/[0.07] border border-white/[0.12] flex items-center justify-center flex-shrink-0">
                  <span className="text-[10px] font-semibold text-white/60">{t.initials}</span>
                </div>
                <div>
                  <p className="text-xs font-semibold text-white/80">{t.name}</p>
                  <p className="text-[11px] text-muted">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
