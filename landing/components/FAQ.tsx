"use client";

import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    question: "O sistema funciona sem internet?",
    answer:
      "Sim. O Saúde Prime foi desenvolvido para funcionar 100% offline. Todos os dados de operadoras, planos e tabelas de preço ficam armazenados localmente no seu dispositivo. Você pode fazer cotações e apresentações em qualquer lugar, mesmo sem conexão.",
  },
  {
    question: "Quantas operadoras estão disponíveis?",
    answer:
      "Atualmente o sistema conta com 10+ operadoras cadastradas: Amil, Porto Saúde, Bradesco Saúde, SulAmérica, Unity Saúde, Evo Saúde, Plenum Saúde, MedSênior e outras. Novas operadoras são adicionadas continuamente conforme demanda.",
  },
  {
    question: "Posso personalizar as apresentações com a minha marca?",
    answer:
      "Sim. As apresentações geradas pelo sistema incluem o nome da empresa cliente, logo da corretora e podem ser totalmente personalizadas. O formato PDF é compatível com qualquer dispositivo e ideal para envio por WhatsApp ou e-mail.",
  },
  {
    question: "O sistema é voltado para quais tipos de venda?",
    answer:
      "O foco principal é planos PME (Pequenas e Médias Empresas) e corporativos. O sistema oferece filtros por faixa etária, número de vidas, cobertura e modalidade (nacional, regional, local), atendendo diferentes perfis de empresa.",
  },
  {
    question: "Como funciona a demonstração gratuita?",
    answer:
      "Você solicita a demonstração pelo botão de contato, agendamos uma apresentação ao vivo do sistema, e você vê na prática como o cotador, catálogo e gerador de apresentação funcionam. Sem compromisso e sem custo.",
  },
  {
    question: "O sistema é exclusivo para Brasília?",
    answer:
      "Por ora atendemos principalmente corretoras da região de Brasília / DF, mas estamos expandindo. Entre em contato para verificar disponibilidade na sua região.",
  },
];

function FAQItem({ question, answer, index }: { question: string; answer: string; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-white/[0.07]">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 py-6 text-left group"
      >
        <div className="flex items-start gap-4">
          <span className="text-[11px] font-mono text-muted pt-0.5 flex-shrink-0">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="text-sm md:text-base font-medium text-white/80 group-hover:text-white transition-colors duration-200">
            {question}
          </span>
        </div>
        <div className="flex-shrink-0 w-5 h-5 rounded-full border border-white/[0.15] flex items-center justify-center">
          {open ? (
            <Minus size={10} className="text-white/60" />
          ) : (
            <Plus size={10} className="text-white/60" />
          )}
        </div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <p className="pb-6 pl-9 text-sm text-secondary-ui leading-relaxed">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="section px-6" ref={ref}>
      <div className="container-lg">
        <div className="grid lg:grid-cols-[320px_1fr] gap-16">
          {/* Left: heading */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55 }}
          >
            <p className="text-xs uppercase tracking-[0.22em] text-muted font-medium mb-4">
              FAQ
            </p>
            <h2 className="text-section text-white">
              Perguntas
              <br />frequentes
            </h2>
            <p className="text-secondary-ui text-sm mt-5 leading-relaxed">
              Não encontrou sua dúvida?{" "}
              <a href="#contato" className="text-white/60 hover:text-white underline underline-offset-4 transition-colors">
                Entre em contato.
              </a>
            </p>
          </motion.div>

          {/* Right: accordion */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.1 }}
          >
            {faqs.map((faq, i) => (
              <FAQItem key={i} {...faq} index={i} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
