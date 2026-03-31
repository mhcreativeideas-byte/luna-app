import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Dumbbell, UtensilsCrossed, Moon, Brain, AlertCircle, Lightbulb } from 'lucide-react';
import { useCycle } from '../contexts/CycleContext';
import { EXERCISES } from '../data/exercises';
import { RECIPES } from '../data/recipes';
import { DAILY_FACTS } from '../data/affirmations';
import PhaseCard from '../components/cycle/PhaseCard';
import EnergyGauge from '../components/cycle/EnergyGauge';
import CycleTimeline from '../components/cycle/CycleTimeline';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function Dashboard() {
  const { greeting, cycleInfo } = useCycle();

  if (!cycleInfo) return null;

  const { phase, phaseData, currentDay } = cycleInfo;
  const exercise = EXERCISES[phase];
  const recipe = RECIPES[phase];
  const facts = DAILY_FACTS[phase];
  const factIndex = (currentDay - 1) % facts.length;

  const today = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  const recommendations = [
    {
      icon: Dumbbell,
      label: 'Sport du jour',
      desc: `${exercise.type} — ${exercise.duration}`,
      to: '/sport',
    },
    {
      icon: UtensilsCrossed,
      label: 'À manger aujourd\'hui',
      desc: `Favorise : ${phaseData.nutrients.slice(0, 2).join(' & ')}`,
      to: '/food',
    },
    {
      icon: Moon,
      label: 'Sommeil',
      desc: `Objectif : ${phaseData.sleepHours}`,
      to: '/sleep',
    },
    {
      icon: Brain,
      label: 'Mindset',
      desc: phaseData.mindset,
      to: '/journal',
    },
  ];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-5">
      {/* Greeting */}
      <motion.div variants={item}>
        <h1 className="font-display text-2xl md:text-3xl text-luna-text">{greeting}</h1>
        <p className="text-sm text-luna-text-secondary font-body capitalize">{today}</p>
      </motion.div>

      {/* Phase card */}
      <motion.div variants={item}>
        <PhaseCard />
      </motion.div>

      {/* Energy gauge */}
      <motion.div variants={item}>
        <EnergyGauge />
      </motion.div>

      {/* Recommendations */}
      <motion.div variants={item}>
        <h3 className="font-display text-lg text-luna-text mb-3">Tes recommandations du jour</h3>
        <div className="grid grid-cols-2 gap-3">
          {recommendations.map(({ icon: Icon, label, desc, to }) => (
            <Link
              key={to}
              to={to}
              className="bg-luna-cream-light rounded-luna p-4 hover:shadow-md transition-all duration-300 group"
            >
              <Icon
                size={22}
                className="mb-2 transition-colors"
                style={{ color: phaseData.color }}
              />
              <p className="text-sm font-semibold text-luna-text font-body">{label}</p>
              <p className="text-xs text-luna-text-secondary mt-1 font-body leading-relaxed">{desc}</p>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Avoid list */}
      <motion.div variants={item} className="bg-luna-cream-light rounded-luna p-4">
        <div className="flex items-center gap-2 mb-3">
          <AlertCircle size={18} className="text-luna-rose-dark" />
          <h3 className="font-display text-lg text-luna-text">Ce qu'il faut éviter aujourd'hui</h3>
        </div>
        <ul className="space-y-2">
          {phaseData.avoid.map((a, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-luna-text-secondary font-body">
              <span className="text-luna-rose-dark mt-0.5">✗</span>
              {a}
            </li>
          ))}
        </ul>
      </motion.div>

      {/* Daily fact */}
      <motion.div
        variants={item}
        className="rounded-luna p-4"
        style={{ backgroundColor: phaseData.bgColor }}
      >
        <div className="flex items-center gap-2 mb-2">
          <Lightbulb size={18} style={{ color: phaseData.colorDark }} />
          <h3 className="font-display text-base" style={{ color: phaseData.colorDark }}>
            Le savais-tu ?
          </h3>
        </div>
        <p className="text-sm leading-relaxed font-body" style={{ color: phaseData.colorDark }}>
          {facts[factIndex]}
        </p>
      </motion.div>

      {/* Cycle timeline */}
      <motion.div variants={item}>
        <CycleTimeline />
      </motion.div>
    </motion.div>
  );
}
