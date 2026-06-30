import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UtensilsCrossed, Heart, ArrowRight } from 'lucide-react';

// Carrousel d'intro affiché dans l'app native (avant connexion).
// Le web garde la longue page marketing (voir Landing.jsx).
const SLIDES = [
  { key: 'phases', title: 'Ton cycle, en 4 phases', subtitle: 'Chaque jour, ton corps a des besoins différents.' },
  { key: 'eat', title: 'Mange selon ta phase', subtitle: 'Des recettes et des conseils adaptés à là où tu en es.' },
  { key: 'gentle', title: 'Zéro culpabilité', subtitle: 'Un accompagnement doux, bienveillant, à ton rythme.' },
];

function Illustration({ which }) {
  if (which === 'phases') {
    return (
      <svg viewBox="0 0 140 140" width="150" height="150" role="img" aria-label="Anneau du cycle en 4 phases">
        <circle cx="70" cy="70" r="56" fill="none" stroke="#D4727F" strokeWidth="11" strokeLinecap="round" strokeDasharray="60 300" transform="rotate(-90 70 70)" />
        <circle cx="70" cy="70" r="56" fill="none" stroke="#7BAE7F" strokeWidth="11" strokeLinecap="round" strokeDasharray="105 300" strokeDashoffset="-68" transform="rotate(-90 70 70)" />
        <circle cx="70" cy="70" r="56" fill="none" stroke="#E8A87C" strokeWidth="11" strokeLinecap="round" strokeDasharray="32 300" strokeDashoffset="-178" transform="rotate(-90 70 70)" />
        <circle cx="70" cy="70" r="56" fill="none" stroke="#B09ACB" strokeWidth="11" strokeLinecap="round" strokeDasharray="118 300" strokeDashoffset="-215" transform="rotate(-90 70 70)" />
      </svg>
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
        paddingTop: 'calc(env(safe-area-inset-top) + 1.5rem)',
        paddingBottom: 'calc(env(safe-area-inset-bottom) + 1.5rem)',
      }}
    >
      {/* Passer */}
      <div className="flex justify-end items-center h-8">
        {!isLast && (
          <button
            onClick={() => navigate('/auth?mode=signup')}
            className="text-sm font-body text-luna-text-hint hover:text-luna-text-muted transition-colors"
          >
            Passer
          </button>
        )}
      </div>

      {/* Slide (balayable) */}
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
          <h1 className="font-display text-[26px] md:text-3xl text-luna-text leading-tight mt-9">
            {slide.title}
          </h1>
          <p className="text-base font-body text-luna-text-muted mt-3 max-w-xs leading-relaxed">
            {slide.subtitle}
          </p>
        </motion.div>
      </motion.div>

      {/* Points de pagination */}
      <div className="flex justify-center gap-2 mb-6">
        {SLIDES.map((s, i) => (
          <button
            key={s.key}
            onClick={() => go(i)}
            aria-label={`Aller à l'écran ${i + 1}`}
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
          J'ai déjà un compte
        </button>
      </div>
    </div>
  );
}
