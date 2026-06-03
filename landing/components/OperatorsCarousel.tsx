"use client";

const operators = [
  "Amil",
  "Porto Saúde",
  "Bradesco Saúde",
  "SulAmérica",
  "Unity Saúde",
  "Evo Saúde",
  "Plenum Saúde",
  "MedSênior",
  "NotreDame Intermédica",
  "Hapvida",
];

export default function OperatorsCarousel() {
  const doubled = [...operators, ...operators];

  return (
    <div className="py-16 overflow-hidden border-y border-white/[0.05]">
      <p className="text-center text-xs uppercase tracking-[0.22em] text-muted mb-10 font-medium">
        Operadoras no sistema
      </p>

      <div className="relative">
        {/* Fade masks */}
        <div className="absolute left-0 top-0 bottom-0 w-32 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to right, #080808, transparent)" }} />
        <div className="absolute right-0 top-0 bottom-0 w-32 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to left, #080808, transparent)" }} />

        <div className="marquee-track">
          {doubled.map((name, i) => (
            <div
              key={i}
              className="flex items-center justify-center mx-10 flex-shrink-0"
            >
              <span className="text-sm font-medium text-white/40 tracking-tight whitespace-nowrap hover:text-white/70 transition-colors duration-300 cursor-default">
                {name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
