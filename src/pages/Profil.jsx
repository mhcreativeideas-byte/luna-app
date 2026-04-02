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
        <h1 className="font-display text-2xl text-luna-text">Profil</h1>
        <Link
          to="/parametres"
          className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-luna-text-muted hover:text-luna-text transition-colors"
          style={{ boxShadow: '0 2px 8px rgba(45, 34, 38, 0.06)' }}
        >
          <Settings size={18} />
        </Link>
      </motion.div>

      {/* Avatar & name */}
      <motion.div variants={item} className="text-center py-4">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-3"
          style={{
            background: 'linear-gradient(135deg, #F5D0D5, #F2C0A8)',
          }}
        >
          <span className="text-2xl font-display text-white">{name?.[0]?.toUpperCase()}</span>
        </div>
        <h2 className="font-display text-xl text-luna-text">{name}</h2>
        {cycleInfo && (
          <p className="text-xs font-body text-luna-text-hint mt-1">
            {cycleInfo.phaseData.icon} {cycleInfo.phaseData.name} — Jour {cycleInfo.currentDay}
          </p>
        )}
      </motion.div>

      {/* Cycle stats */}
      <motion.div variants={item} className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-[20px] p-5 text-center" style={{ boxShadow: '0 2px 12px rgba(45, 34, 38, 0.04)' }}>
          <p className="text-3xl font-display font-bold text-luna-text">{cycleLength}</p>
          <p className="text-xs text-luna-text-hint font-body mt-1">jours de cycle</p>
        </div>
        <div className="bg-white rounded-[20px] p-5 text-center" style={{ boxShadow: '0 2px 12px rgba(45, 34, 38, 0.04)' }}>
          <p className="text-3xl font-display font-bold text-luna-text">{periodLength}</p>
          <p className="text-xs text-luna-text-hint font-body mt-1">jours de règles</p>
        </div>
      </motion.div>

      {/* Calendar link */}
      <motion.div variants={item}>
        <Link
          to="/calendrier"
          className="flex items-center gap-4 bg-white rounded-[20px] p-4 hover:shadow-md transition-all"
          style={{ boxShadow: '0 2px 12px rgba(45, 34, 38, 0.04)' }}
        >
          <div
            className="w-11 h-11 rounded-[14px] flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #FDE8EB, #F5D0D5)' }}
          >
            <Calendar size={20} style={{ color: '#C4727F' }} />
          </div>
          <div>
            <p className="text-sm font-body font-semibold text-luna-text">Mon calendrier</p>
            <p className="text-xs text-luna-text-hint font-body">Visualise ton cycle mois par mois</p>
          </div>
        </Link>
      </motion.div>

      {/* Together card */}
      <motion.div variants={item}>
        <div
          className="bg-white rounded-[20px] p-5"
          style={{ boxShadow: '0 2px 12px rgba(45, 34, 38, 0.04)' }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Share2 size={16} style={{ color: '#D4846A' }} />
            <h3 className="font-display text-base text-luna-text">Ensemble</h3>
          </div>
          <p className="text-sm text-luna-text-muted font-body mb-3 leading-relaxed">
            Partage tes phases avec ton partenaire. Quand il comprend ton cycle, tout est plus simple à deux.
          </p>
          <button className="btn-luna-outline text-sm py-2 px-5">
            L'inviter
          </button>
        </div>
      </motion.div>

      {/* Insights card */}
      <motion.div variants={item}>
        <div
          className="rounded-[20px] p-5 text-white relative overflow-hidden"
          style={{
            background: 'linear-gradient(145deg, #C4727F 0%, #D4846A 50%, #E8A87C 100%)',
          }}
        >
          <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/10" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={18} />
              <h3 className="font-display text-base">Insights</h3>
            </div>
            {totalCheckIns >= 15 ? (
              <div>
                <p className="text-sm font-body mb-3 opacity-90">
                  Tes patterns bases sur {totalCheckIns} check-ins :
                </p>
                {topSymptoms.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {topSymptoms.map(([symptom, count]) => (
                      <span key={symptom} className="text-xs px-2.5 py-1 rounded-pill bg-white/20 font-body">
                        {symptom} ({count}x)
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div>
                <p className="text-sm font-body mb-2 opacity-90 leading-relaxed">
                  Plus tu enregistres, plus LUNA détecte tes patterns. Après 3 cycles complets, tu auras une vue précise de tes tendances.
                </p>
                <p className="text-xs font-body opacity-70">
                  {totalCheckIns}/15 check-ins
                </p>
                <div className="h-2 bg-white/20 rounded-full mt-3 overflow-hidden">
                  <div
                    className="h-full bg-white/60 rounded-full transition-all"
                    style={{ width: `${Math.min(100, (totalCheckIns / 15) * 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Goals */}
      <motion.div variants={item}>
        <h3 className="text-[10px] font-body font-bold text-luna-text-hint uppercase tracking-widest mb-2">Mes objectifs</h3>
        <div className="flex flex-wrap gap-2">
          {(goals || []).map((g) => (
            <span
              key={g}
              className="text-xs font-body px-3.5 py-2 rounded-pill bg-white text-luna-text-body"
              style={{ boxShadow: '0 1px 4px rgba(45,34,38,0.06)' }}
            >
              {g}
            </span>
          ))}
          {(!goals || goals.length === 0) && (
            <p className="text-xs text-luna-text-hint font-body">Aucun objectif defini</p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
