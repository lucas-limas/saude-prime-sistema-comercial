"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";

const stats = [
  {
    value: 10,
    suffix: "+",
    label: "Operadoras no catálogo",
    sub: "Amil, Porto, Bradesco, SulAmérica…",
  },
  {
    value: 100,
    suffix: "+",
    label: "Planos disponíveis",
    sub: "PME, Adesão, PF e Sênior",
  },
  {
    value: 3,
    suffix: "×",
    label: "Mais rápido",
    sub: "Vs. cotação manual em planilha",
  },
  {
    value: 100,
    suffix: "%",
    label: "Funciona offline",
    sub: "Sem dependência de internet",
  },
];

function Counter({ to, suffix }: { to: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const duration = 1400;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * to));
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [inView, to]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

export default function Stats() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-20 px-6" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.09 }}
              className="glass rounded-2xl p-6 text-center glow-ring"
            >
              <div className="text-4xl lg:text-5xl font-bold text-white mb-1.5 tracking-tight">
                {isInView ? (
                  <Counter to={stat.value} suffix={stat.suffix} />
                ) : (
                  <span>0{stat.suffix}</span>
                )}
              </div>
              <p className="text-sm font-medium text-white/65 mb-1">{stat.label}</p>
              <p className="text-xs text-white/28" style={{ color: "rgba(255,255,255,0.28)" }}>
                {stat.sub}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
