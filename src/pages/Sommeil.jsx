import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Moon as MoonIcon, Wind } from 'lucide-react';
import { useCycle } from '../contexts/CycleContext';
import { PHASES } from '../data/phases';
import { MORNING_RITUALS } from '../data/affirmations';
import BackButton from '../components/ui/BackButton';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const PHASE_SLEEP_TITLES = {
  menstrual: { main: 'Le sanctuaire', italic: 'du sommeil' },
  follicular: { main: 'Repos &', italic: 'Régénération' },
  ovulatory: { main: 'Récupération', italic: 'Stratégique' },
  luteal: { main: 'Douceur &', italic: 'Cocooning' },
};

const routineSteps = {
  menstrual: [
    { icon: '🍵', title: 'Tisane & Repos', desc: 'Tisane camomille ou gingembre. Le magnésium en complément aide à dormir et soulage les crampes.' },
    { icon: '♨️', title: 'Bouillotte', desc: 'Chaleur sur le ventre pour détendre les muscles utérins. Soulagement immédiat.' },
    { icon: '🛏️', title: 'Position fœtale', desc: 'Position qui réduit la pression abdominale et soulage les douleurs.' },
  ],
  follicular: [
    { icon: '☀️', title: 'Lumière naturelle', desc: 'Expose-toi à la lumière dès le réveil pour recaler ton rythme circadien.' },
    { icon: '⏰', title: 'Rythme régulier', desc: 'Coucher à heure fixe — l\'énergie est là, profites-en pour créer de bonnes habitudes.' },
    { icon: '🧘', title: 'Étirements doux', desc: '5 min d\'étirements avant le coucher pour relâcher les tensions de la journée.' },
  ],
  ovulatory: [
    { icon: '🧘', title: 'Méditation', desc: 'Méditation courte pour canaliser l\'énergie avant le sommeil. Tu as naturellement plus d\'énergie.' },
    { icon: '💧', title: 'Hydratation', desc: 'Eau détox concombre-menthe. Garde un verre d\'eau près du lit.' },
    { icon: '📵', title: 'Déconnexion', desc: 'Pas d\'écran 1h avant. Ton énergie est haute — protège ton sommeil.' },
  ],
  luteal: [
    { icon: '🍵', title: 'Tisane & Magnésium', desc: 'Tisane camomille 45 min avant. Si tu as du magnésium en complément, prends-le au coucher.' },
    { icon: '📵', title: 'Pas d\'écran après 21h', desc: 'La progestérone fragmente le sommeil. Évite la lumière bleue qui aggrave ça.' },
    { icon: '🌡️', title: 'Chambre à 18-19°C', desc: 'Ta température corporelle est plus élevée en phase lutéale. Compense avec une chambre fraîche.' },
  ],
};

function BreathingExercise({ phaseData, breathing }) {
  const [active, setActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState('inspire');
  const [count, setCount] = useState(0);
  const [cycleNum, setCycleNum] = useState(1);
  const intervalRef = useRef(null);

  // Parse durations from breathing description
  const pattern = breathing?.description || '';
  const nums = pattern.match(/(\d+)\s*secondes/g)?.map((m) => parseInt(m)) || [4, 7, 8];
  const inspireTime = nums[0] || 4;
  const pauseTime = nums.length >= 3 ? (nums[1] || 0) : 0;
  const expireTime = nums.length >= 3 ? (nums[2] || 8) : (nums[1] || 4);
  const totalCyclesMatch = pattern.match(/(\d+)\s*cycles/);
  const totalCycles = totalCyclesMatch ? parseInt(totalCyclesMatch[1]) : 4;
  const ratio = pauseTime > 0 ? `${inspireTime}:${pauseTime}:${expireTime}` : `${inspireTime}:${expireTime}`;

  useEffect(() => {
    if (!active) return;

    const phases = pauseTime > 0
      ? [
          { name: 'inspire', duration: inspireTime },
          { name: 'pause', duration: pauseTime },
          { name: 'expire', duration: expireTime },
        ]
      : [
          { name: 'inspire', duration: inspireTime },
          { name: 'expire', duration: expireTime },
        ];

    let phaseIdx = 0;
    let remaining = phases[0].duration;
    let currentCycle = 1;

    setBreathPhase(phases[0].name);
    setCount(phases[0].duration);
    setCycleNum(1);

    intervalRef.current = setInterval(() => {
      remaining--;
      if (remaining <= 0) {
        phaseIdx++;
        if (phaseIdx >= phases.length) {
          phaseIdx = 0;
          currentCycle++;
          if (currentCycle > totalCycles) {
            clearInterval(intervalRef.current);
            setActive(false);
            return;
          }
          setCycleNum(currentCycle);
        }
        remaining = phases[phaseIdx].duration;
        setBreathPhase(phases[phaseIdx].name);
      }
      setCount(remaining);
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [active, inspireTime, pauseTime, expireTime, totalCycles]);

  const stop = () => {
    setActive(false);
    clearInterval(intervalRef.current);
  };

  const scale = breathPhase === 'inspire' ? 1.3 : breathPhase === 'expire' ? 0.8 : 1.1;
  const phaseLabel = breathPhase === 'inspire' ? 'Inspire' : breathPhase === 'pause' ? 'Pause' : 'Expire';

  return (
    <div className="rounded-[24px] p-6 text-center" style={{ backgroundColor: phaseData.bgColor }}>
      <h3 className="font-display text-base text-luna-text mb-1">Respiration guidée</h3>
      <p className="text-xs font-body text-luna-text-hint mb-4">
        {breathing?.name || 'Technique 4-7-8'}
      </p>

      {!active ? (
        <div>
          <div
            className="w-24 h-24 rounded-full mx-auto flex items-center justify-center mb-4"
            style={{ backgroundColor: `${phaseData.color}15` }}
          >
            <p className="text-2xl font-display font-bold" style={{ color: phaseData.colorDark }}>{ratio}</p>
          </div>
          <button
            onClick={() => setActive(true)}
            className="px-6 py-3 rounded-[14px] text-white text-sm font-body font-bold uppercase tracking-wider transition-all hover:opacity-90"
            style={{ backgroundColor: phaseData.colorDark }}
          >
            Commencer la séance
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <motion.div
            animate={{ scale }}
            transition={{ duration: 1, ease: 'easeInOut' }}
            className="w-28 h-28 rounded-full mx-auto flex items-center justify-center"
            style={{ backgroundColor: `${phaseData.color}20` }}
          >
            <div className="text-center">
              <p className="text-3xl font-display font-bold" style={{ color: phaseData.colorDark }}>
                {count}
              </p>
              <p className="text-xs font-body font-semibold capitalize" style={{ color: phaseData.colorDark }}>
                {phaseLabel}
              </p>
            </div>
          </motion.div>
          <p className="text-[10px] font-body text-luna-text-hint">
            Cycle {cycleNum}/{totalCycles}
          </p>
          <button
            onClick={stop}
            className="text-sm text-luna-text-muted font-body hover:text-luna-text transition-colors"
          >
            Arrêter
          </button>
        </div>
      )}
    </div>
  );
}

export default function Sommeil() {
  const { cycleInfo } = useCycle();

  const phase = cycleInfo?.phase || 'follicular';
  const phaseData = PHASES[phase];
  const titles = PHASE_SLEEP_TITLES[phase];
  const ritual = MORNING_RITUALS[phase];
  const routine = routineSteps[phase] || routineSteps.follicular;

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 pb-6">
      <BackButton />
      {/* Hero */}
      <motion.div variants={item}>
        <div
          className="rounded-[24px] px-6 pt-6 pb-7 relative overflow-hidden"
          style={{
            background: phase === 'menstrual'
              ? 'linear-gradient(145deg, #1a1520 0%, #2d1f2e 50%, #3a2535 100%)'
              : phase === 'luteal'
              ? 'linear-gradient(145deg, #2a1f35 0%, #3d2d4a 50%, #4a3560 100%)'
              : 'linear-gradient(145deg, #1a2030 0%, #2a3040 50%, #354050 100%)',
          }}
        >
          <div
            className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-10 bg-white"
          />
          <div
            className="absolute bottom-4 -left-6 w-20 h-20 rounded-full opacity-5 bg-white"
          />

          <div className="relative">
            <p className="text-[10px] font-body font-bold uppercase tracking-[0.2em] mb-3 text-white/50">
              {phaseData.shortName} · Sommeil
            </p>
            <h1 className="font-display text-[30px] md:text-4xl leading-tight mb-3" style={{ color: '#EDE0F5' }}>
              {titles.main}{' '}
              <em style={{ color: '#D4B8E8' }}>{titles.italic}</em>
            </h1>
            <p className="text-sm font-body text-white/60 leading-relaxed">
              {phaseData.sleepQuality}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Sleep Goal */}
      <motion.div variants={item}>
        <div className="bg-white rounded-[24px] p-6 text-center" style={{ boxShadow: '0 2px 12px rgba(45,34,38,0.04)' }}>
          <div className="flex items-center justify-center gap-2 mb-2">
            <MoonIcon size={16} style={{ color: phaseData.color }} />
            <p className="text-[10px] font-body font-bold text-luna-text-hint uppercase tracking-widest">Sleep Goal</p>
          </div>
          <p className="text-[9px] font-body text-luna-text-hint">
            Recommandé pour ta phase {phaseData.shortName.toLowerCase()}
          </p>
          <p className="text-5xl font-display font-bold text-luna-text mt-2">
            {phaseData.sleepHours.split('-')[1] || phaseData.sleepHours.split('-')[0]}
          </p>
          <p className="text-[10px] font-body font-bold text-luna-text-hint uppercase tracking-widest mt-1">
            Heures de repos
          </p>
        </div>
      </motion.div>

      {/* Breathing Exercise */}
      <motion.div variants={item}>
        <BreathingExercise phaseData={phaseData} breathing={ritual?.breathing} />
      </motion.div>

      {/* Evening Routine */}
      <motion.div variants={item}>
        <div className="bg-white rounded-[24px] p-5" style={{ boxShadow: '0 2px 12px rgba(45,34,38,0.04)' }}>
          <h2 className="font-display text-lg text-luna-text mb-1">Routine du soir</h2>
          <p className="text-xs font-body text-luna-text-hint mb-4">Adaptée à ta phase {phaseData.shortName.toLowerCase()}.</p>

          <div className="space-y-4">
            {routine.map((step, i) => (
              <div key={i} className="flex items-start gap-3">
                <div
                  className="w-10 h-10 rounded-[12px] flex items-center justify-center text-lg flex-shrink-0"
                  style={{ backgroundColor: phaseData.bgColor }}
                >
                  {step.icon}
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-display text-luna-text">{step.title}</h4>
                  <p className="text-xs font-body text-luna-text-muted mt-0.5 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Phase-specific sleep tips */}
      <motion.div variants={item}>
        <div className="rounded-[20px] p-5" style={{ backgroundColor: phaseData.bgColor }}>
          <h3 className="font-display text-base text-luna-text mb-3">Conseils sommeil · {phaseData.shortName}</h3>
          <div className="space-y-2.5">
            {phaseData.sleepTips.map((tip, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <span
                  className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0"
                  style={{ backgroundColor: phaseData.color }}
                />
                <p className="text-sm font-body text-luna-text-body leading-relaxed">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Quote */}
      <motion.div variants={item} className="text-center py-4">
        <p className="text-sm font-body text-luna-text-hint italic px-8 leading-relaxed">
          "Le sommeil est le fil d'or qui relie santé et corps."
        </p>
      </motion.div>
    </motion.div>
  );
}
