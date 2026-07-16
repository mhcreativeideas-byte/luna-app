import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ChevronRight, Apple, Check } from 'lucide-react';
import TopMenu from '../components/ui/TopMenu';
import PhaseIcon from '../components/ui/PhaseIcon';
import AuroraHeader from '../components/ui/AuroraHeader';
import DailyMenu from '../components/food/DailyMenu';
import BottomSheet from '../components/ui/BottomSheet';
import { DashboardSkeleton } from '../components/ui/SkeletonLoader';
import { useCycle } from '../contexts/CycleContext';
import { toast } from '../lib/toast';
import { findSymptomFood } from '../data/symptomFoods';
import { WELLNESS_TAG_LABELS } from '../data/recipeFilters';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

// Compte doucement de 1 jusqu'au jour du cycle à l'ouverture de l'écran.
// Le setTimeout final garantit la bonne valeur même si requestAnimationFrame
// est suspendu (onglet en arrière-plan, navigateur d'aperçu).
function useCountUp(target, duration = 700) {
  const [value, setValue] = useState(target > 0 ? 1 : 0);
  useEffect(() => {
    if (!target || target <= 1) return undefined;
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.max(1, Math.round(eased * target)));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const fallback = setTimeout(() => setValue(target), duration + 200);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(fallback);
    };
  }, [target, duration]);
  return target > 1 ? value : target;
}

// Écran d'accueil « Aujourd'hui » : où j'en suis dans mon cycle + que manger
// aujourd'hui. Volontairement court (4 blocs) — le détail vit dans les onglets
// Manger et Mon cycle.
const dateKey = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

export default function Aujourdhui() {
  const { cycleInfo, name, cycleLength, todayCheckIn, dispatch } = useCycle();
  const navigate = useNavigate();
  const displayedDay = useCountUp(cycleInfo?.currentDay ?? 0);
  const todayKey = dateKey(new Date());
  // « Pas encore » : on range la question jusqu'au lendemain (local à
  // l'appareil, volontairement pas synchronisé — simple confort d'affichage).
  const [periodSnoozed, setPeriodSnoozed] = useState(() => {
    try { return localStorage.getItem('luna-regles-plus-tard') === todayKey; } catch { return false; }
  });
  const [otherDayOpen, setOtherDayOpen] = useState(false);

  if (!cycleInfo) return <DashboardSkeleton />;

  const { phaseData, energyLevel, daysUntilPeriod, isLate, lateDays } = cycleInfo;

  // Séquence règles validée sur maquettes (2026-07-16) : ligne discrète de
  // J-2 au jour J, carte transformée une fois la date passée.
  const showPeriodQuickAction = !isLate && daysUntilPeriod <= 2;
  const startPeriod = (dayStr) => {
    dispatch({ type: 'SET_PERIOD_START', payload: { date: dayStr } });
    toast('Début des règles enregistré 🌙');
    setOtherDayOpen(false);
  };
  const snoozePeriodQuestion = () => {
    try { localStorage.setItem('luna-regles-plus-tard', todayKey); } catch { /* stockage privé indisponible : la question restera visible */ }
    setPeriodSnoozed(true);
  };

  const hour = new Date().getHours();
  const timeGreeting = hour < 12 ? 'Bonjour' : hour < 18 ? 'Bon après-midi' : 'Bonsoir';
  const rawDate = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
  const dateLabel = rawDate.charAt(0).toUpperCase() + rawDate.slice(1);
  // Après un check-in, la carte affiche l'énergie NOTÉE par l'utilisatrice
  // (se sentir écoutée) ; sinon l'énergie typique de la phase.
  const ownEnergy = todayCheckIn?.energy;
  const displayedEnergy = ownEnergy != null ? ownEnergy : energyLevel;
  const energyLabel = displayedEnergy >= 70 ? 'haute' : displayedEnergy >= 45 ? 'modérée' : 'douce';
  const periodLabel = daysUntilPeriod <= 0
    ? 'règles prévues aujourd\'hui'
    : daysUntilPeriod === 1
      ? 'règles demain'
      : `règles dans ${daysUntilPeriod} j`;

  // Conseil symptôme → aliment, d'après le check-in du jour
  const symptoms = todayCheckIn?.symptoms ? Object.values(todayCheckIn.symptoms).flat() : [];
  const advice = findSymptomFood(symptoms);
  // Le conseil pointe vers les recettes taguées (anti-crampes, anti-fatigue)
  // quand la phase du jour en contient ; sinon, lien nutriment classique.
  const adviceUsesTag = Boolean(
    advice?.tag && (!advice.tagPhases || advice.tagPhases.includes(cycleInfo.phase))
  );

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-5 pb-6">
      <motion.div variants={item}>
        <TopMenu />
      </motion.div>

      {/* Salutation — en-tête aurore, la date en ligne repère
          (la phase et le jour du cycle sont déjà sur la carte juste dessous) */}
      <AuroraHeader
        kicker={dateLabel}
        title={(
          <>
            {timeGreeting}, <em className="not-italic" style={{ fontStyle: 'italic', color: phaseData.colorDark }}>{name || ''}.</em>
          </>
        )}
      />

      {/* Carte de phase compacte — ouvre l'onglet Mon cycle. Verre dépoli :
          translucide + flou, elle laisse affleurer le dégradé aurore de la
          phase derrière elle (validé maquettes 2026-07-12). */}
      <motion.div variants={item}>
        {/* La carte contient désormais de vrais boutons (règles) : l'enveloppe
            est un div cliquable, plus un <button> (pas de boutons imbriqués). */}
        <div
          onClick={() => navigate('/dashboard')}
          className="w-full text-left rounded-[28px] p-6 active:scale-[0.99] transition-transform backdrop-blur-[18px] cursor-pointer"
          style={isLate ? {
            background: 'linear-gradient(180deg, rgba(253,232,235,0.9), rgba(255,255,255,0.55))',
            border: '1px solid #F8D8DD',
            boxShadow: '0 10px 30px rgba(45,34,38,0.05)',
          } : {
            backgroundColor: 'rgba(255,255,255,0.5)',
            border: '1px solid rgba(255,255,255,0.75)',
            boxShadow: '0 10px 30px rgba(45,34,38,0.05)',
          }}
        >
          {isLate ? (
            <>
              {/* État « règles attendues » (option C validée) : la carte dit la
                  vérité au lieu d'un faux nouveau cycle, ton rassurant. */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-body font-bold uppercase tracking-widest" style={{ color: '#C4727F' }}>
                  Fin de cycle
                </span>
                <PhaseIcon phase="menstrual" size={18} />
              </div>
              <p className="font-display font-bold leading-none mb-1.5" style={{ color: '#A85A66', fontSize: '1.9rem' }}>
                Règles attendues
              </p>
              <p className="text-xs font-body mb-4" style={{ color: '#8A5A64' }}>
                depuis {lateDays} jour{lateDays > 1 ? 's' : ''} · ton corps prend son temps
              </p>
              {periodSnoozed ? (
                <button
                  onClick={(e) => { e.stopPropagation(); startPeriod(todayKey); }}
                  className="w-full rounded-pill py-3 text-[13px] font-body font-bold active:scale-[0.98] transition-transform"
                  style={{ backgroundColor: '#FDE8EB', color: '#A85A66' }}
                >
                  🌙 Mes règles ont commencé
                </button>
              ) : (
                <>
                  <button
                    onClick={(e) => { e.stopPropagation(); startPeriod(todayKey); }}
                    className="w-full rounded-pill py-3.5 text-sm font-body font-bold text-white active:scale-[0.98] transition-transform"
                    style={{ backgroundColor: '#D4727F' }}
                  >
                    🌙 Elles ont commencé
                  </button>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); setOtherDayOpen(true); }}
                      className="flex-1 rounded-pill py-2.5 text-[13px] font-body font-semibold bg-white active:scale-[0.98] transition-transform"
                      style={{ color: '#A85A66', border: '1px solid #F0D5DA' }}
                    >
                      Un autre jour
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); snoozePeriodQuestion(); }}
                      className="flex-1 rounded-pill py-2.5 text-[13px] font-body font-semibold active:scale-[0.98] transition-transform"
                      style={{ color: '#A85A66' }}
                    >
                      Pas encore
                    </button>
                  </div>
                </>
              )}
            </>
          ) : (
            <>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-body font-bold uppercase tracking-widest" style={{ color: phaseData.colorDark }}>
              {phaseData.shortName}
            </span>
            <PhaseIcon phase={cycleInfo.phase} size={18} />
          </div>
          <p className="font-display font-bold leading-none mb-1.5" style={{ color: phaseData.colorDark, fontSize: '2.1rem' }}>
            Jour {displayedDay}
          </p>
          <p className="text-xs font-body text-luna-text-muted mb-4">
            sur {cycleLength} · {periodLabel}
          </p>
          {/* Jauge d'énergie : 7 px, dégradé de la phase, point lumineux au
              bout (option A affinée, validée 2026-07-12). */}
          <div className="rounded-full relative" style={{ height: 7, backgroundColor: `${phaseData.color}29` }}>
            <div
              className="h-full rounded-full transition-all duration-700 relative"
              style={{ width: `${displayedEnergy}%`, background: `linear-gradient(90deg, ${phaseData.color}66, ${phaseData.color})` }}
            >
              <span
                className="absolute top-1/2 -translate-y-1/2 rounded-full"
                style={{
                  right: -5,
                  width: 13,
                  height: 13,
                  backgroundColor: phaseData.color,
                  border: '3px solid #FFFFFF',
                  boxShadow: `0 0 10px 2px ${phaseData.color}8C`,
                }}
              />
            </div>
          </div>
          <p className="text-[11px] font-body text-luna-text-muted mt-2">
            {ownEnergy != null ? 'Ton énergie' : `Énergie ${energyLabel}`} · {displayedEnergy} %
          </p>
          {showPeriodQuickAction && (
            /* Ligne discrète (option A validée) : visible de J-2 au jour J. */
            <div className="mt-4 pt-4" style={{ borderTop: '1px solid rgba(212,114,127,0.16)' }}>
              <button
                onClick={(e) => { e.stopPropagation(); startPeriod(todayKey); }}
                className="w-full rounded-pill py-3 text-[13px] font-body font-bold active:scale-[0.98] transition-transform"
                style={{ backgroundColor: '#FDE8EB', color: '#A85A66' }}
              >
                🌙 Mes règles ont commencé
              </button>
            </div>
          )}
            </>
          )}
        </div>
      </motion.div>

      {/* « Un autre jour » : choisir le vrai premier jour des règles */}
      <BottomSheet open={otherDayOpen} onClose={() => setOtherDayOpen(false)} title="Quel jour ont-elles commencé ?">
        <div className="space-y-2 pb-2">
          {[1, 2, 3, 4, 5, 6, 7].map((offset) => {
            const d = new Date();
            d.setDate(d.getDate() - offset);
            const raw = offset === 1 ? 'hier' : offset === 2 ? 'avant-hier'
              : d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
            const label = raw.charAt(0).toUpperCase() + raw.slice(1);
            return (
              <button
                key={offset}
                onClick={() => startPeriod(dateKey(d))}
                className="w-full text-left rounded-[16px] px-4 py-3.5 text-sm font-body font-semibold active:scale-[0.98] transition-transform"
                style={{ backgroundColor: '#FDE8EB', color: '#A85A66' }}
              >
                {label}
              </button>
            );
          })}
        </div>
      </BottomSheet>

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
              onClick={() => navigate(adviceUsesTag
                ? `/recettes-liste?tag=${advice.tag}`
                : `/recettes-liste?nutrient=${encodeURIComponent(advice.nutrient)}`)}
              className="mt-3 w-full flex items-center justify-center gap-2 py-3 rounded-[14px] text-[13px] font-body font-bold text-white transition-all active:scale-[0.99]"
              style={{ backgroundColor: phaseData.color, boxShadow: `0 4px 14px ${phaseData.color}40` }}
            >
              {adviceUsesTag
                ? `Voir les recettes ${WELLNESS_TAG_LABELS[advice.tag]}`
                : `Voir les recettes riches en ${advice.nutrient.toLowerCase()}`}
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
