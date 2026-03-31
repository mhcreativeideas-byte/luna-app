import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Moon as MoonIcon, Clock, Wind, Activity } from 'lucide-react';
import { useCycle } from '../contexts/CycleContext';
import { PHASES } from '../data/phases';
import PageHeader from '../components/layout/PageHeader';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const routineSteps = [
  { time: '2h avant', icon: '⏰', text: 'Dernier repas léger, évite les écrans stimulants' },
  { time: '1h30 avant', icon: '🛁', text: 'Bain chaud ou douche tiède (baisse la température corporelle ensuite)' },
  { time: '1h avant', icon: '📵', text: 'Mode avion, lumière tamisée, pas d\'écrans' },
  { time: '45 min avant', icon: '🍵', text: 'Tisane relaxante (camomille, valériane, passiflore)' },
  { time: '30 min avant', icon: '📖', text: 'Lecture, journal de gratitude ou méditation guidée' },
  { time: 'Coucher', icon: '💤', text: 'Chambre fraîche (18-19°C), obscurité totale' },
];

function BreathingExercise({ phaseData }) {
  const [active, setActive] = useState(false);
  const [phase, setPhase] = useState('inspire');
  const [count, setCount] = useState(4);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!active) return;

    const phases = [
      { name: 'inspire', duration: 4 },
      { name: 'retiens', duration: 7 },
      { name: 'expire', duration: 8 },
    ];
    let phaseIdx = 0;
    let remaining = phases[0].duration;

    setPhase(phases[0].name);
    setCount(phases[0].duration);

    intervalRef.current = setInterval(() => {
      remaining--;
      if (remaining <= 0) {
        phaseIdx = (phaseIdx + 1) % phases.length;
        remaining = phases[phaseIdx].duration;
        setPhase(phases[phaseIdx].name);
      }
      setCount(remaining);
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [active]);

  const stop = () => {
    setActive(false);
    clearInterval(intervalRef.current);
  };

  const scale = phase === 'inspire' ? 1.3 : phase === 'expire' ? 0.8 : 1.1;

  return (
    <div className="text-center">
      {!active ? (
        <button
          onClick={() => setActive(true)}
          className="px-5 py-2.5 rounded-luna-sm text-white text-sm font-body font-bold transition-all hover:opacity-90"
          style={{ backgroundColor: phaseData.color }}
        >
          <Wind size={16} className="inline mr-2" />
          Commencer la respiration 4-7-8
        </button>
      ) : (
        <div className="space-y-4">
          <motion.div
            animate={{ scale }}
            transition={{ duration: 1, ease: 'easeInOut' }}
            className="w-28 h-28 rounded-full mx-auto flex items-center justify-center"
            style={{ backgroundColor: phaseData.bgColor }}
          >
            <div className="text-center">
              <p className="text-2xl font-accent font-bold" style={{ color: phaseData.colorDark }}>
                {count}
              </p>
              <p className="text-xs font-body capitalize" style={{ color: phaseData.colorDark }}>
                {phase === 'inspire' ? 'Inspire' : phase === 'retiens' ? 'Retiens' : 'Expire'}
              </p>
            </div>
          </motion.div>
          <button
            onClick={stop}
            className="text-sm text-luna-text-secondary font-body hover:text-luna-text transition-colors"
          >
            Arrêter
          </button>
        </div>
      )}
    </div>
  );
}

const energyByDay = [
  30, 28, 30, 32, 35,
  45, 55, 65, 70, 75, 78, 80, 82,
  90, 95, 92,
  75, 70, 65, 60, 55, 50, 45, 40, 38, 35, 33, 30,
];

export default function Sleep() {
  const { cycleInfo } = useCycle();
  if (!cycleInfo) return null;

  const { phase, phaseData, currentDay, cycleLength } = cycleInfo;

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-5">
      <motion.div variants={item}>
        <PageHeader
          title="Sommeil & Énergie"
          subtitle={phaseData.sleepTips[0]}
        />
      </motion.div>

      {/* Sleep goal */}
      <motion.div
        variants={item}
        className="rounded-luna p-5 text-center"
        style={{ backgroundColor: phaseData.bgColor }}
      >
        <MoonIcon size={28} className="mx-auto mb-2" style={{ color: phaseData.colorDark }} />
        <h3 className="font-display text-lg" style={{ color: phaseData.colorDark }}>
          Objectif sommeil ce soir
        </h3>
        <p className="text-4xl font-accent font-bold mt-2" style={{ color: phaseData.colorDark }}>
          {phaseData.sleepHours}
        </p>
        <p className="text-sm font-body mt-2" style={{ color: phaseData.colorDark }}>
          {phaseData.sleepQuality}
        </p>
      </motion.div>

      {/* Routine */}
      <motion.div variants={item} className="bg-luna-cream-light rounded-luna p-4">
        <h3 className="font-display text-lg text-luna-text mb-4">Routine du soir</h3>
        <div className="space-y-4 relative">
          <div className="absolute left-[18px] top-2 bottom-2 w-0.5 bg-luna-rose/20" />
          {routineSteps.map((s, i) => (
            <div key={i} className="flex items-start gap-3 relative">
              <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-lg z-10 shadow-sm flex-shrink-0">
                {s.icon}
              </div>
              <div>
                <p className="text-xs font-accent font-bold text-luna-text-secondary">{s.time}</p>
                <p className="text-sm font-body text-luna-text">{s.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Phase-specific tips */}
        <div className="mt-4 pt-3 border-t border-luna-rose/10">
          <p className="text-xs font-semibold text-luna-text mb-2 font-body">
            Conseils spécifiques {phaseData.shortName} :
          </p>
          <ul className="space-y-1">
            {phaseData.sleepTips.map((tip, i) => (
              <li key={i} className="text-sm text-luna-text-secondary font-body flex items-start gap-2">
                <span style={{ color: phaseData.color }}>•</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </motion.div>

      {/* Breathing */}
      <motion.div variants={item} className="bg-luna-cream-light rounded-luna p-5">
        <div className="flex items-center gap-2 mb-4 justify-center">
          <Wind size={18} style={{ color: phaseData.color }} />
          <h3 className="font-display text-lg text-luna-text">Méditation & Respiration</h3>
        </div>
        <BreathingExercise phaseData={phaseData} />
      </motion.div>

      {/* Energy curve */}
      <motion.div variants={item} className="bg-luna-cream-light rounded-luna p-4">
        <div className="flex items-center gap-2 mb-3">
          <Activity size={18} style={{ color: phaseData.color }} />
          <h3 className="font-display text-base text-luna-text">Niveau d'énergie sur le cycle</h3>
        </div>
        <div className="relative h-24">
          <svg viewBox="0 0 280 80" className="w-full h-full">
            {/* Grid lines */}
            {[20, 40, 60].map((y) => (
              <line key={y} x1="0" y1={80 - y} x2="280" y2={80 - y} stroke="#f0e8e0" strokeWidth="0.5" />
            ))}
            {/* Curve */}
            <polyline
              fill="none"
              stroke={phaseData.color}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={energyByDay.slice(0, cycleLength).map((e, i) => `${(i / (cycleLength - 1)) * 280},${80 - (e / 100) * 75}`).join(' ')}
            />
            {/* Current position */}
            {(() => {
              const x = ((currentDay - 1) / (cycleLength - 1)) * 280;
              const dayIdx = Math.min(currentDay - 1, energyByDay.length - 1);
              const y = 80 - (energyByDay[dayIdx] / 100) * 75;
              return (
                <>
                  <circle cx={x} cy={y} r="5" fill={phaseData.color} stroke="white" strokeWidth="2" />
                  <text x={x} y={y - 10} textAnchor="middle" fill={phaseData.colorDark} fontSize="8" fontWeight="bold">
                    J{currentDay}
                  </text>
                </>
              );
            })()}
          </svg>
        </div>
        <div className="flex justify-between text-[10px] text-luna-text-secondary font-accent mt-1">
          <span>🌙 Menstruelle</span>
          <span>🌸 Folliculaire</span>
          <span>☀️ Ovulatoire</span>
          <span>🍂 Lutéale</span>
        </div>
        {cycleInfo.nextPeriodIn > 0 && (
          <p className="text-xs text-luna-text-secondary font-body mt-3 text-center">
            Dans <strong>{cycleInfo.nextPeriodIn} jours</strong>, tu retrouves la phase menstruelle.
          </p>
        )}
      </motion.div>
    </motion.div>
  );
}
