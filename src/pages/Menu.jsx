import { motion } from 'framer-motion';
import { useCycle } from '../contexts/CycleContext';
import { PHASES } from '../data/phases';
import BackButton from '../components/ui/BackButton';
import DailyMenu from '../components/food/DailyMenu';
import PhaseIcon from '../components/ui/PhaseIcon';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const PHASE_MENU_INTROS = {
  menstrual: 'Un menu doux et nourrissant, riche en fer et anti-inflammatoires pour ta phase menstruelle.',
  follicular: 'Un menu qui soutient ton énergie qui remonte : protéines, zinc et fraîcheur.',
  ovulatory: 'Un menu léger et coloré, riche en fibres et antioxydants pour ton pic hormonal.',
  luteal: 'Un menu réconfortant et équilibré : glucides complexes et magnésium contre les fringales.',
};

// Page « Menu du jour » (route /menu) : CACHÉE mais gardée (accessible par
// URL seulement, comme /journal ou /sport). Remplacée par « Ma semaine »
// (/menu-semaine), que « Tout voir » ouvre depuis l'accueil Aujourd'hui.
// Réutilise le même composant DailyMenu.
export default function Menu() {
  const { cycleInfo } = useCycle();
  const phase = cycleInfo?.phase || 'follicular';
  const phaseData = PHASES[phase];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 pb-6">
      <BackButton />

      {/* Header */}
      <motion.div variants={item}>
        <div
          className="w-12 h-12 rounded-[16px] flex items-center justify-center mb-4"
          style={{ backgroundColor: phaseData.bgColor, boxShadow: '0 4px 14px rgba(45,34,38,0.06)' }}
        >
          <PhaseIcon phase={phase} size={22} />
        </div>
        <p className="text-[11px] font-body text-luna-text-hint uppercase tracking-widest mb-2">
          {phaseData.shortName} · Menu
        </p>
        <h1 className="font-display text-[28px] md:text-4xl text-luna-text leading-tight">
          Ton menu <em className="not-italic" style={{ fontStyle: 'italic', color: phaseData.colorDark }}>du jour</em>
        </h1>
        <p className="text-sm font-body text-luna-text-muted mt-2 leading-relaxed">
          {PHASE_MENU_INTROS[phase]}
        </p>
      </motion.div>

      <DailyMenu />
    </motion.div>
  );
}
