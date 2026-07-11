import { motion } from 'framer-motion';
import { useCycle } from '../../contexts/CycleContext';
import { PHASES } from '../../data/phases';

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

// En-tête « Aurore » commun à tous les écrans (design validé 2026-07-11) :
// pas de carte, la couleur de la phase se fond dans le haut de l'écran comme
// une lumière, avec deux halos flous. Structure : petite ligne repère
// (« FOLLICULAIRE · JOUR 9 »), titre Playfair, phrase italique colorée,
// puis une intro discrète.
//
// Le fond dégradé est positionné en absolu par rapport au <main> de
// AppLayout (qui est `relative isolate`) : il couvre ainsi toute la largeur
// de l'écran, jusque derrière la barre d'état iPhone, et passe sous le
// contenu grâce au z négatif.
export default function AuroraHeader({ title, accent, intro, kicker, action }) {
  const { cycleInfo } = useCycle();
  const phaseData = cycleInfo?.phaseData || PHASES.follicular;
  const kickerText = kicker
    || `${phaseData.shortName}${cycleInfo?.currentDay ? ` · Jour ${cycleInfo.currentDay}` : ''}`;

  return (
    <>
      {/* Fond aurore : dégradé + halos, fondu vers le crème via le masque */}
      <div
        aria-hidden
        className="absolute top-0 left-0 right-0 h-[250px] -z-10 overflow-hidden pointer-events-none"
        style={{
          WebkitMaskImage: 'linear-gradient(to bottom, black 55%, transparent 100%)',
          maskImage: 'linear-gradient(to bottom, black 55%, transparent 100%)',
        }}
      >
        <div
          className="absolute inset-0"
          style={{ background: `linear-gradient(to bottom, ${phaseData.bgColor} 0%, ${phaseData.bgColor}8C 60%, transparent 100%)` }}
        />
        <div
          className="absolute -top-[70px] -right-[60px] w-[190px] h-[190px] rounded-full"
          style={{ backgroundColor: phaseData.color, opacity: 0.16, filter: 'blur(34px)' }}
        />
        <div
          className="absolute top-[60px] -left-[70px] w-[150px] h-[150px] rounded-full"
          style={{ backgroundColor: phaseData.color, opacity: 0.1, filter: 'blur(38px)' }}
        />
      </div>

      <motion.header variants={item} className="relative">
        <div className="flex items-center gap-2 mb-2">
          <span
            className="w-[7px] h-[7px] rounded-full flex-shrink-0"
            style={{ backgroundColor: phaseData.color, boxShadow: `0 0 0 3px ${phaseData.color}38` }}
          />
          <p className="text-[10px] font-body font-bold uppercase tracking-[0.2em]" style={{ color: phaseData.colorDark }}>
            {kickerText}
          </p>
        </div>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="font-display text-[28px] text-luna-text leading-tight">{title}</h1>
            {accent && (
              <p className="font-display italic text-[19px] leading-snug mt-0.5" style={{ color: phaseData.colorDark }}>
                {accent}
              </p>
            )}
          </div>
          {action && <div className="flex-shrink-0 mt-1">{action}</div>}
        </div>
        {intro && (
          <p className="text-[13px] font-body text-luna-text-muted mt-2 leading-relaxed">{intro}</p>
        )}
      </motion.header>
    </>
  );
}
