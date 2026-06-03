"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Mail } from "lucide-react";

export default function FinalCTA() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="contato" className="section px-6" ref={ref}>
      <div className="container-lg">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-3xl overflow-hidden text-center"
          style={{
            background:
              "linear-gradient(135deg, #111 0%, #0f0f0f 50%, #131008 100%)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          {/* Gold top accent line */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-3/4"
            style={{
              background:
                "linear-gradient(to right, transparent, rgba(201,162,39,0.5), transparent)",
            }}
          />

          {/* Radial glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(201,162,39,0.06) 0%, transparent 70%)",
            }}
          />

          <div className="relative px-8 py-20 lg:py-28">
            <p className="text-xs uppercase tracking-[0.22em] text-muted font-medium mb-5">
              Pronto para começar?
            </p>

            <h2 className="text-section text-white mb-4">
              Transforme sua corretora
              <br />
              com o sistema certo
            </h2>

            <p className="text-secondary-ui text-base max-w-md mx-auto leading-relaxed mb-10">
              Solicite uma demonstração gratuita e descubra como o Saúde Prime
              pode acelerar suas vendas de planos corporativos.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <motion.a
                href="mailto:contato@saudeprimeseguros.com"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="btn-primary group px-8 py-3.5"
              >
                <Mail size={16} />
                Solicitar demonstração
                <ArrowRight
                  size={14}
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </motion.a>
            </div>

            <p className="mt-8 text-xs text-muted">
              Demonstração gratuita · Sem compromisso · Brasília / DF
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
