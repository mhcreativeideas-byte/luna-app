import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UtensilsCrossed, Heart, ArrowRight } from 'lucide-react';

const SLIDES = [
  {
    key: 'phases',
    title: "Chaque mois, tu passes \u00e0 c\u00f4t\u00e9 de ce dont ton corps a besoin.",
    subtitle: "Fringales, fatigue, ballonnements\u2026 et si tout \u00e7a avait une explication\u202f? Ton cycle est la cl\u00e9.",
  },
  {
    key: 'eat',
    title: "Imagine savoir exactement quoi manger, chaque jour, sans y penser.",
    subtitle: "luna synchronise ton assiette avec ton cycle. Recettes, menu du jour, conseils\u202f: tout est l\u00e0, pr\u00eat pour toi.",
  },
  {
    key: 'gentle',
    title: "Tu m\u00e9rites de te sentir bien, chaque semaine du mois.",
    subtitle: "Pas de restriction, pas de prise de t\u00eate. Juste une alimentation douce qui respecte ton corps et ton cycle.",
  },
];

function Illustration({ which }) {
  if (which === 'phases') {
    const cx = 100, cy = 100, R = 80;
    const C = 2 * Math.PI * R;
    const phases = [
      { start: 0, end: 0.18, color: '#D4727F' },
      { start: 0.18, end: 0.46, color: '#7BAE7F' },
      { start: 0.46, end: 0.57, color: '#E8A87C' },
      { start: 0.57, end: 1, color: '#B09ACB' },
    ];
    const gap = 0.012;
    return (
      <div className="relative w-[190px] h-[190px]">
        <img src="/luna-moon.png" alt="" className="absolute inset-0 w-full h-full object-contain" style={{ opacity: 0.1 }} />
        <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full" role="img" aria-label="Anneau du cycle en 4 phases">
          <defs>
            <filter id="introGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2.5" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          <circle cx={cx} cy={cy} r={R} fill="none" stroke="#E8D5D8" strokeWidth="14" opacity="0.2" />
          {phases.map((p, i) => {
            const s = p.start + (i === 0 ? 0 : gap / 2);
            const e = p.end - (i === phases.length - 1 ? 0 : gap / 2);
            const len = (e - s) * C;
            const off = -(s * C);
            return (
              <motion.circle
                key={i}
                cx={cx} cy={cy} r={R}
                fill="none"
                stroke={p.color}
                strokeWidth="14"
                strokeLinecap="round"
                strokeDasharray={`${len} ${C - len}`}
                transform={`rotate(-90 ${cx} ${cy})`}
                filter="url(#introGlow)"
                initial={{ strokeDashoffset: off + len }}
                animate={{ strokeDashoffset: off }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 + i * 0.12 }}
              />
            );
          })}
        </svg>
      </div>
    );
  }
  if (which === 'eat') {
    return (
      <div className="w-[150px] h-[150px] rounded-full flex items-center justify-center" style={{ backgroundColor: '#EDF5ED' }}>
        <UtensilsCrossed size={62} style={{ color: '#4E7A52' }} strokeWidth={1.5} />
      </div>
    );
  }
  return (
    <div className="w-[150px] h-[150px] rounded-full flex items-center justify-center" style={{ backgroundColor: '#FDE8EB' }}>
      <Heart size={60} style={{ color: '#C4727F' }} strokeWidth={1.5} />
    </div>
  );
}

export default function IntroCarousel() {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const isLast = index === SLIDES.length - 1;
  const go = (i) => setIndex(Math.max(0, Math.min(SLIDES.length - 1, i)));
  const slide = SLIDES[index];

  return (
    <div
      className="h-[100dvh] bg-luna-bg flex flex-col px-6"
      style={{
        paddingTop: 'calc(env(safe-area-inset-top) + 1rem)',
        paddingBottom: 'calc(env(safe-area-inset-bottom) + 1.5rem)',
      }}
    >
      {/* Header : logo + Passer */}
      <div className="flex justify-between items-center h-10">
        <img src="/logo-luna.svg" alt="luna" className="h-[22px] w-auto" />
        {!isLast && (
          <button
            onClick={() => navigate('/auth?mode=signup')}
            className="text-sm font-body text-luna-text-hint hover:text-luna-text-muted transition-colors"
          >
            Passer
          </button>
        )}
      </div>

      {/* Slide */}
      <motion.div
        className="flex-1 flex items-center"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={(_, info) => {
          if (info.offset.x < -60) go(index + 1);
          else if (info.offset.x > 60) go(index - 1);
        }}
      >
        <motion.div
          key={slide.key}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full flex flex-col items-center text-center"
        >
          <Illustration which={slide.key} />
          <h1 className="font-display text-[26px] md:text-3xl text-luna-text leading-tight mt-9 max-w-[300px]">
            {slide.title}
          </h1>
          <p className="text-[15px] font-body text-luna-text-muted mt-3 max-w-[300px] leading-relaxed whitespace-pre-line">
            {slide.subtitle}
          </p>
        </motion.div>
      </motion.div>

      {/* Pagination */}
      <div className="flex justify-center gap-2 mb-6">
        {SLIDES.map((s, i) => (
          <button
            key={s.key}
            onClick={() => go(i)}
            aria-label={`Slide ${i + 1}`}
            className="h-[7px] rounded-full transition-all duration-300"
            style={{ width: i === index ? 22 : 7, backgroundColor: i === index ? '#C4727F' : '#E0D6D2' }}
          />
        ))}
      </div>

      {/* Actions */}
      <div className="space-y-2">
        <button
          onClick={() => (isLast ? navigate('/auth?mode=signup') : go(index + 1))}
          className="btn-luna w-full justify-center text-base py-3.5"
        >
          {isLast ? 'Commencer' : 'Suivant'}
          <ArrowRight size={16} />
        </button>
        <button
          onClick={() => navigate('/auth?mode=login')}
          className="w-full text-center text-sm font-body font-semibold text-luna-text-muted hover:text-luna-text py-2 transition-colors"
        >
          {"J'ai déjà un compte"}
        </button>
      </div>
    </div>
  );
}
