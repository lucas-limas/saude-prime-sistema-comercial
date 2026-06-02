"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Mail } from "lucide-react";

export default function FinalCTA() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="contato" className="py-24 px-6" ref={ref}>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative glass rounded-3xl p-12 lg:p-16 text-center overflow-hidden glow-ring"
        >
          {/* Decorative orbs inside card */}
          <div
            className="absolute -top-24 -left-24 w-72 h-72 rounded-full blur-3xl pointer-events-none"
            style={{ background: "rgba(201,162,39,0.06)" }}
          />
          <div
            className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full blur-3xl pointer-events-none"
            style={{ background: "rgba(255,255,255,0.025)" }}
          />

          {/* Top border accent */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

          <div className="relative">
            <p className="text-xs uppercase tracking-[0.2em] text-white/35 font-medium mb-5">
              Pronto para começar?
            </p>

            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
              Transforme sua{" "}
              <span className="text-gold">corretora</span>
              <br />
              com o sistema certo
            </h2>

            <p
              className="text-lg mb-10 max-w-md mx-auto leading-relaxed"
              style={{ color: "rgba(255,255,255,0.45)" }}
            >
              Solicite uma demonstração gratuita e descubra como o sistema
              pode acelerar suas vendas de planos de saúde corporativos.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <motion.a
                href="mailto:contato@saudeprimeseguros.com"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="btn-primary group text-base px-8 py-4"
              >
                <Mail size={17} />
                Solicitar demonstração
                <ArrowRight
                  size={15}
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </motion.a>
            </div>

            <p className="mt-7 text-xs" style={{ color: "rgba(255,255,255,0.28)" }}>
              Demonstração gratuita · Sem compromisso · Brasília / DF
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
