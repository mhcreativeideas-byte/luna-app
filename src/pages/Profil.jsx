import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Settings, Share2, TrendingUp } from 'lucide-react';
import { useCycle } from '../contexts/CycleContext';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export default function Profil() {
  const { name, cycleLength, periodLength, cycleInfo, checkIns, goals } = useCycle();

  const totalCheckIns = checkIns?.length || 0;
  const cyclesLogged = Math.floor(totalCheckIns / 5);

  // Most frequent symptoms
  const symptomCounts = {};
  (checkIns || []).forEach((c) => {
    Object.values(c.symptoms || {}).flat().forEach((s) => {
      symptomCounts[s] = (symptomCounts[s] || 0) + 1;
    });
  });
  const topSymptoms = Object.entries(symptomCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-5 pb-4">
      {/* Header */}
      <motion.div variants={item} className="flex justify-between items-start">
        <h1 className="section-title text-2xl">PROFIL</h1>
        <Link to="/parametres" className="p-2 text-luna-text-muted hover:text-luna-text transition-colors">
          <Settings size={22} />
        </Link>
      </motion.div>

      {/* Name & stats */}
      <motion.div variants={item} className="text-center py-3">
        <div className="w-16 h-16 rounded-full bg-luna-orange/10 flex items-center justify-center mx-auto mb-3">
          <span className="text-2xl font-display text-luna-orange">{name?.[0]?.toUpperCase()}</span>
        </div>
        <h2 className="font-display text-xl text-luna-text">{name}</h2>
      </motion.div>

      {/* Cycle stats */}
      <motion.div variants={item} className="grid grid-cols-2 gap-3">
        <div className="bg-luna-cream-light rounded-luna p-4 text-center">
          <p className="text-2xl font-accent font-bold text-luna-text">{cycleLength}</p>
          <p className="text-xs text-luna-text-muted font-body">jours de cycle</p>
        </div>
        <div className="bg-luna-cream-light rounded-luna p-4 text-center">
          <p className="text-2xl font-accent font-bold text-luna-text">{periodLength}</p>
          <p className="text-xs text-luna-text-muted font-body">jours de règles</p>
        </div>
      </motion.div>

      {/* Calendar link */}
      <motion.div variants={item}>
        <Link
          to="/calendrier"
          className="flex items-center gap-3 bg-luna-cream-light rounded-luna p-4 hover:bg-luna-cream-card transition-colors"
        >
          <Calendar size={22} className="text-luna-orange" />
          <div>
            <p className="text-sm font-body font-semibold text-luna-text">Mon calendrier</p>
            <p className="text-xs text-luna-text-muted font-body">Visualise ton cycle mois par mois</p>
          </div>
        </Link>
      </motion.div>

      {/* Together card */}
      <motion.div variants={item}>
        <div className="bg-luna-cream-card rounded-luna p-5">
          <div className="flex items-center gap-2 mb-2">
            <Share2 size={18} className="text-luna-orange" />
            <h3 className="font-display text-base text-luna-text">ENSEMBLE</h3>
          </div>
          <p className="text-sm text-luna-text-body font-body mb-3">
            Invite ton partenaire à mieux comprendre ton cycle. Faites-en un effort d'équipe.
          </p>
          <button className="btn-luna-outline text-sm py-2 px-4">
            Configurer
          </button>
        </div>
      </motion.div>

      {/* Insights card */}
      <motion.div variants={item}>
        <div className="bg-luna-orange rounded-luna p-5 text-white">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={18} />
            <h3 className="font-display text-base">INSIGHTS</h3>
          </div>
          {totalCheckIns >= 15 ? (
            <div>
              <p className="text-sm font-body mb-3 opacity-90">
                Voici tes patterns basés sur {totalCheckIns} check-ins :
              </p>
              {topSymptoms.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {topSymptoms.map(([symptom, count]) => (
                    <span key={symptom} className="text-xs px-2 py-1 rounded-pill bg-white/20 font-body">
                      {symptom} ({count}x)
                    </span>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div>
              <p className="text-sm font-body mb-2 opacity-90">
                Enregistre au moins 3 cycles pour débloquer tes insights personnalisés.
              </p>
              <p className="text-xs font-body opacity-70">
                Plus tu logges tes symptômes, plus LUNA te connaît. ({totalCheckIns}/15 check-ins)
              </p>
              <div className="h-1.5 bg-white/20 rounded-full mt-3 overflow-hidden">
                <div
                  className="h-full bg-white/60 rounded-full transition-all"
                  style={{ width: `${Math.min(100, (totalCheckIns / 15) * 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Goals */}
      <motion.div variants={item}>
        <h3 className="section-title text-sm mb-2">MES OBJECTIFS</h3>
        <div className="flex flex-wrap gap-2">
          {(goals || []).map((g) => (
            <span key={g} className="text-xs font-body px-3 py-1.5 rounded-pill bg-luna-cream-card text-luna-text-body">
              {g}
            </span>
          ))}
          {(!goals || goals.length === 0) && (
            <p className="text-xs text-luna-text-hint font-body">Aucun objectif défini</p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
