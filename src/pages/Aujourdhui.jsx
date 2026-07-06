import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ChevronRight, Apple, Check } from 'lucide-react';
import TopMenu from '../components/ui/TopMenu';
import DailyMenu from '../components/food/DailyMenu';
import { DashboardSkeleton } from '../components/ui/SkeletonLoader';
import { useCycle } from '../contexts/CycleContext';
import { findSymptomFood } from '../data/symptomFoods';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

// Écran d'accueil « Aujourd'hui » : où j'en suis dans mon cycle + que manger
// aujourd'hui. Volontairement court (4 blocs) — le détail vit dans les onglets
// Manger et Mon cycle.
export default function Aujourdhui() {
  const { cycleInfo, name, cycleLength, todayCheckIn } = useCycle();
  const navigate = useNavigate();

  if (!cycleInfo) return <DashboardSkeleton />;

  const { phaseData, currentDay, energyLevel, daysUntilPeriod } = cycleInfo;

  const hour = new Date().getHours();
  const timeGreeting = hour < 12 ? 'Bonjour' : hour < 18 ? 'Bon après-midi' : 'Bonsoir';
  const rawDate = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
  const dateLabel = rawDate.charAt(0).toUpperCase() + rawDate.slice(1);
  const energyLabel = energyLevel >= 70 ? 'haute' : energyLevel >= 45 ? 'modérée' : 'douce';
  const periodLabel = daysUntilPeriod <= 0
    ? 'règles prévues aujourd\'hui'
    : daysUntilPeriod === 1
      ? 'règles demain'
      : `règles dans ${daysUntilPeriod} j`;

  // Conseil symptôme → aliment, d'après le check-in du jour
  const symptoms = todayCheckIn?.symptoms ? Object.values(todayCheckIn.symptoms).flat() : [];
  const advice = findSymptomFood(symptoms);

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-5 pb-6">
      <motion.div variants={item}>
        <TopMenu />
      </motion.div>

      {/* Salutation */}
      <motion.div variants={item}>
        <h1 className="font-display text-[28px] md:text-4xl text-luna-text leading-tight">
          {timeGreeting}, <em className="not-italic" style={{ fontStyle: 'italic', color: phaseData.colorDark }}>{name || ''}.</em>
        </h1>
        <p className="text-sm font-body text-luna-text-muted mt-1">{dateLabel}</p>
      </motion.div>

      {/* Carte de phase compacte — ouvre l'onglet Mon cycle */}
      <motion.div variants={item}>
        <button
          onClick={() => navigate('/dashboard')}
          className="w-full text-left rounded-[28px] p-6 active:scale-[0.99] transition-transform"
          style={{ backgroundColor: phaseData.bgColor, boxShadow: `0 10px 30px ${phaseData.color}22` }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-body font-bold uppercase tracking-widest" style={{ color: phaseData.colorDark }}>
              {phaseData.shortName}
            </span>
            <span className="text-lg leading-none">{phaseData.icon}</span>
          </div>
          <p className="font-display font-bold leading-none mb-1.5" style={{ color: phaseData.colorDark, fontSize: '2.1rem' }}>
            Jour {currentDay}
          </p>
          <p className="text-xs font-body text-luna-text-muted mb-4">
            sur {cycleLength} · {periodLabel}
          </p>
          <div className="h-1.5 rounded-full bg-white overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${energyLevel}%`, backgroundColor: phaseData.color }}
            />
          </div>
          <p className="text-[11px] font-body text-luna-text-muted mt-2">
            Énergie {energyLabel} · {energyLevel} %
          </p>
        </button>
      </motion.div>

      {/* Check-in du jour — l'action n°1 */}
      <motion.div variants={item}>
        <button
          onClick={() => navigate('/checkin')}
          className="w-full flex items-center justify-center gap-2.5 py-4 rounded-full text-[15px] font-body font-bold text-white active:scale-[0.99] transition-transform"
          style={{ backgroundColor: phaseData.color, boxShadow: `0 10px 26px ${phaseData.color}40` }}
        >
          {todayCheckIn ? <Check size={18} /> : <Heart size={18} />}
          {todayCheckIn ? 'Check-in fait, le modifier' : 'Comment te sens-tu ?'}
        </button>
      </motion.div>

      {/* Conseil symptôme → aliment (apparaît après le check-in) */}
      {advice && (
        <motion.div variants={item}>
          <div
            className="rounded-[26px] p-5"
            style={{ background: `linear-gradient(135deg, ${phaseData.bgColor}, ${phaseData.color}14)`, boxShadow: '0 8px 26px rgba(45,34,38,0.06)' }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Apple size={15} style={{ color: phaseData.colorDark }} />
              <p className="text-[10px] font-body font-bold uppercase tracking-widest" style={{ color: phaseData.color }}>
                {advice.title}
              </p>
            </div>
            <p className="text-sm font-body text-luna-text-body leading-relaxed">
              {advice.why} Pense à : <span className="font-semibold">{advice.foods.join(', ')}</span>.
            </p>
            <button
              onClick={() => navigate(`/recettes-liste?nutrient=${encodeURIComponent(advice.nutrient)}`)}
              className="mt-3 w-full flex items-center justify-center gap-2 py-3 rounded-[14px] text-[13px] font-body font-bold text-white transition-all active:scale-[0.99]"
              style={{ backgroundColor: phaseData.color, boxShadow: `0 4px 14px ${phaseData.color}40` }}
            >
              Voir les recettes riches en {advice.nutrient.toLowerCase()}
              <ChevronRight size={15} />
            </button>
          </div>
        </motion.div>
      )}

      {/* Menu du jour — aperçu en carrousel */}
      <motion.div variants={item}>
        <div className="flex items-baseline justify-between mb-3 px-1">
          <h2 className="font-display text-lg text-luna-text">Ton menu du jour</h2>
          <Link
            to="/menu-semaine"
            className="text-xs font-body font-bold"
            style={{ color: phaseData.colorDark }}
          >
            Voir ma semaine
          </Link>
        </div>
        <DailyMenu variant="carousel" />
      </motion.div>
    </motion.div>
  );
}
