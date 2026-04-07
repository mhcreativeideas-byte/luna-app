import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, X, ChevronRight, Flame, Zap, Dumbbell, Check, Footprints, Plus, Trash2, Save } from 'lucide-react';
import { useCycle } from '../contexts/CycleContext';
import { EXERCISES } from '../data/exercises';
import { PHASES } from '../data/phases';
import BackButton from '../components/ui/BackButton';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const PHASE_SPORT_TITLES = {
  menstrual: { main: 'Douceur &', italic: 'Récupération' },
  follicular: { main: 'Énergie &', italic: 'Performance' },
  ovulatory: { main: 'Puissance &', italic: 'Dépassement' },
  luteal: { main: 'Transition &', italic: 'Adaptation' },
};

const QUICK_ACTIVITIES = [
  { name: 'Marche', icon: '🚶‍♀️' },
  { name: 'Course', icon: '🏃‍♀️' },
  { name: 'Vélo', icon: '🚴‍♀️' },
  { name: 'Natation', icon: '🏊‍♀️' },
  { name: 'Yoga', icon: '🧘‍♀️' },
  { name: 'Danse', icon: '💃' },
  { name: 'Musculation', icon: '🏋️' },
  { name: 'Stretching', icon: '🤸‍♀️' },
];

export default function Sport() {
  const { cycleInfo, sportSessions, sportLogs, dispatch } = useCycle();
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [activityName, setActivityName] = useState('');
  const [activityDuration, setActivityDuration] = useState('');
  const [durationUnit, setDurationUnit] = useState('min');
  const [activitySaved, setActivitySaved] = useState(false);
  const [stepsSaved, setStepsSaved] = useState(false);

  const phase = cycleInfo?.phase || 'follicular';
  const _now = new Date();
  const today = `${_now.getFullYear()}-${String(_now.getMonth() + 1).padStart(2, '0')}-${String(_now.getDate()).padStart(2, '0')}`;
  const sessionValidated = sportSessions?.some((s) => s.date === today) || false;
  const todayLog = (sportLogs || []).find((l) => l.date === today) || { date: today, steps: 0, activities: [] };

  const [stepsInput, setStepsInput] = useState(todayLog.steps || '');

  const toggleSession = () => {
    dispatch({
      type: 'TOGGLE_SPORT_SESSION',
      payload: { date: today, phase, type: exerciseData?.type || 'Sport' },
    });
  };

  const saveSteps = () => {
    const steps = parseInt(stepsInput) || 0;
    dispatch({ type: 'UPDATE_SPORT_LOG', payload: { date: today, steps, activities: todayLog.activities || [] } });
    setStepsSaved(true);
    setTimeout(() => setStepsSaved(false), 2000);
  };

  const addActivity = () => {
    if (!activityName.trim()) return;
    const rawDuration = parseInt(activityDuration) || 0;
    const duration = durationUnit === 'h' ? rawDuration * 60 : rawDuration;
    dispatch({ type: 'ADD_CUSTOM_ACTIVITY', payload: { date: today, activity: { name: activityName.trim(), duration } } });
    setActivityName('');
    setActivityDuration('');
    setActivitySaved(true);
    setTimeout(() => setActivitySaved(false), 2000);
  };

  const removeActivity = (index) => {
    dispatch({ type: 'REMOVE_CUSTOM_ACTIVITY', payload: { date: today, index } });
  };

  const phaseData = PHASES[phase];
  const exerciseData = EXERCISES[phase];

  if (!exerciseData) return null;

  const titles = PHASE_SPORT_TITLES[phase];
  const intensityDots = Array.from({ length: 4 }, (_, i) => i < exerciseData.intensity);

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 pb-6">
      <BackButton />
      {/* Hero */}
      <motion.div variants={item}>
        <div
          className="rounded-[24px] px-6 pt-6 pb-7 relative overflow-hidden"
          style={{
            background: `linear-gradient(145deg, ${phaseData.bgColor} 0%, ${phaseData.color}18 100%)`,
          }}
        >
          <div
            className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-20"
            style={{ backgroundColor: phaseData.color }}
          />
          <div
            className="absolute bottom-4 -left-6 w-20 h-20 rounded-full opacity-10"
            style={{ backgroundColor: phaseData.color }}
          />

          <div className="relative">
            <p className="text-[10px] font-body font-bold uppercase tracking-[0.2em] mb-3" style={{ color: phaseData.color }}>
              {phaseData.shortName} · Sport
            </p>
            <h1 className="font-display text-[30px] md:text-4xl text-luna-text leading-tight mb-3">
              {titles.main}{' '}
              <em style={{ color: phaseData.colorDark }}>{titles.italic}</em>
            </h1>
            <p className="text-sm font-body text-luna-text-body leading-relaxed">
              {exerciseData.intro}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Hero Card — recommandation du jour */}
      <motion.div variants={item}>
        <div className="rounded-[24px] overflow-hidden relative" style={{ boxShadow: '0 4px 24px rgba(45,34,38,0.08)' }}>
          {/* Hero avec icône */}
          <div
            className="relative px-5 pt-5 pb-4"
            style={{ background: `linear-gradient(145deg, ${phaseData.bgColor} 0%, ${phaseData.color}20 100%)` }}
          >
            <div className="flex items-center gap-4">
              <div
                className="w-16 h-16 rounded-[18px] flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${phaseData.color}18` }}
              >
                <span className="text-3xl">{exerciseData.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[9px] font-body font-bold uppercase tracking-widest px-2 py-0.5 rounded-pill mb-1.5 inline-block" style={{ backgroundColor: `${phaseData.color}15`, color: phaseData.colorDark }}>
                  ✦ Recommandation du jour
                </span>
                <h2 className="font-display text-lg text-luna-text leading-snug">{exerciseData.type}</h2>
                <p className="text-xs font-body text-luna-text-muted mt-0.5">Durée recommandée : {exerciseData.duration}</p>
              </div>
            </div>
          </div>

          {/* Stats bar */}
          <div className="bg-white p-4">
            <div className="flex items-center justify-between mb-4">
              {/* Intensity dots */}
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-body font-bold text-luna-text-hint uppercase tracking-widest">Intensité</span>
                <div className="flex gap-1">
                  {intensityDots.map((active, i) => (
                    <div
                      key={i}
                      className="w-2.5 h-2.5 rounded-full transition-colors"
                      style={{
                        backgroundColor: active ? phaseData.color : `${phaseData.color}25`,
                      }}
                    />
                  ))}
                </div>
              </div>
              <span className="text-xs font-body font-semibold px-3 py-1 rounded-pill" style={{ backgroundColor: phaseData.bgColor, color: phaseData.colorDark }}>
                {exerciseData.intensityLabel}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 rounded-[14px]" style={{ backgroundColor: phaseData.bgColor }}>
                <Flame size={16} className="mx-auto mb-1" style={{ color: phaseData.colorDark }} />
                <p className="text-lg font-display font-bold text-luna-text">{exerciseData.intensity * 25}%</p>
                <p className="text-[9px] font-body text-luna-text-hint uppercase">Effort</p>
              </div>
              <div className="text-center p-3 rounded-[14px]" style={{ backgroundColor: phaseData.bgColor }}>
                <Clock size={16} className="mx-auto mb-1" style={{ color: phaseData.colorDark }} />
                <p className="text-lg font-display font-bold text-luna-text">{exerciseData.duration.split('-')[0]}</p>
                <p className="text-[9px] font-body text-luna-text-hint uppercase">Min</p>
              </div>
              <div className="text-center p-3 rounded-[14px]" style={{ backgroundColor: phaseData.bgColor }}>
                <Dumbbell size={16} className="mx-auto mb-1" style={{ color: phaseData.colorDark }} />
                <p className="text-lg font-display font-bold text-luna-text">{exerciseData.exercises.length}</p>
                <p className="text-[9px] font-body text-luna-text-hint uppercase">Idées d'exercices</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Mon activité du jour — bloc unifié */}
      <motion.div variants={item}>
        <div className="bg-white rounded-[24px] overflow-hidden" style={{ boxShadow: '0 2px 12px rgba(45,34,38,0.04)' }}>

          {/* En-tête simple */}
          <div className="p-5 pb-3">
            <h3 className="font-display text-lg text-luna-text">Mon activité du jour</h3>
            <p className="text-xs font-body text-luna-text-muted mt-0.5">
              Enregistre tes pas et tes activités.
            </p>
          </div>

          <div className="px-5 pb-5">
            {/* Compteur de pas — compact */}
            <div
              className="rounded-[16px] p-4 mb-4"
              style={{ backgroundColor: phaseData.bgColor }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-[12px] flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${phaseData.color}18` }}
                >
                  <Footprints size={18} style={{ color: phaseData.colorDark }} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={stepsInput}
                      onChange={(e) => setStepsInput(e.target.value)}
                      placeholder="Nb de pas"
                      className="flex-1 px-3 py-2 rounded-[10px] bg-white border-0 text-sm font-body text-luna-text focus:outline-none focus:ring-2 transition-all"
                      style={{ '--tw-ring-color': `${phaseData.color}40` }}
                    />
                    <button
                      onClick={saveSteps}
                      className="px-3 h-9 rounded-[10px] text-white flex items-center justify-center gap-1.5 transition-all hover:opacity-90 flex-shrink-0 text-xs font-body font-semibold"
                      style={{ backgroundColor: stepsSaved ? '#7BAE7F' : phaseData.color }}
                    >
                      {stepsSaved ? <><Check size={14} /> Sauvé</> : <><Save size={14} /> Sauver</>}
                    </button>
                  </div>
                  {/* Barre de progression */}
                  {(parseInt(stepsInput) || todayLog.steps) > 0 && (
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full bg-white overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.min(((parseInt(stepsInput) || todayLog.steps) / 10000) * 100, 100)}%`,
                            backgroundColor: phaseData.color,
                          }}
                        />
                      </div>
                      <span className="text-[10px] font-body font-semibold flex-shrink-0" style={{ color: phaseData.colorDark }}>
                        {((parseInt(stepsInput) || todayLog.steps) / 1000).toFixed(1)}k / 10k
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Séparateur */}
            <div className="h-px bg-gray-100 mb-4" />

            {/* Activités rapides — grille d'icônes */}
            <p className="text-[10px] font-body font-bold text-luna-text-hint uppercase tracking-widest mb-3">
              Ajouter une activité
            </p>
            <div className="grid grid-cols-4 gap-2 mb-4">
              {QUICK_ACTIVITIES.map((a) => (
                <button
                  key={a.name}
                  onClick={() => setActivityName(a.name)}
                  className="flex flex-col items-center gap-1 py-2.5 rounded-[14px] transition-all"
                  style={activityName === a.name
                    ? { backgroundColor: phaseData.bgColor, border: `1.5px solid ${phaseData.color}` }
                    : { backgroundColor: '#F8F6F4', border: '1.5px solid transparent' }
                  }
                >
                  <span className="text-xl">{a.icon}</span>
                  <span
                    className="text-[10px] font-body leading-tight"
                    style={{ color: activityName === a.name ? phaseData.colorDark : '#8A7B7F', fontWeight: activityName === a.name ? 600 : 400 }}
                  >
                    {a.name}
                  </span>
                </button>
              ))}
            </div>

            {/* Champ personnalisé + durée + bouton Valider */}
            <div className="flex items-center gap-2 mb-3">
              <input
                type="text"
                value={activityName}
                onChange={(e) => setActivityName(e.target.value)}
                placeholder="Ou saisis une activité..."
                className="flex-1 px-3 py-2.5 rounded-[12px] bg-gray-50 border-0 text-xs font-body text-luna-text focus:outline-none focus:ring-2 transition-all"
                style={{ '--tw-ring-color': `${phaseData.color}40` }}
              />
              <div className="flex items-center gap-1 flex-shrink-0">
                <input
                  type="number"
                  value={activityDuration}
                  onChange={(e) => setActivityDuration(e.target.value)}
                  placeholder="Durée"
                  className="w-16 px-3 py-2.5 rounded-[12px] bg-gray-50 border-0 text-xs font-body text-luna-text focus:outline-none focus:ring-2 transition-all text-center"
                  style={{ '--tw-ring-color': `${phaseData.color}40` }}
                />
                <div className="flex rounded-[10px] overflow-hidden border" style={{ borderColor: `${phaseData.color}30` }}>
                  <button
                    onClick={() => setDurationUnit('min')}
                    className="px-2.5 py-2 text-[10px] font-body font-semibold transition-all"
                    style={{
                      backgroundColor: durationUnit === 'min' ? phaseData.color : 'white',
                      color: durationUnit === 'min' ? 'white' : phaseData.colorDark,
                    }}
                  >
                    min
                  </button>
                  <button
                    onClick={() => setDurationUnit('h')}
                    className="px-2.5 py-2 text-[10px] font-body font-semibold transition-all"
                    style={{
                      backgroundColor: durationUnit === 'h' ? phaseData.color : 'white',
                      color: durationUnit === 'h' ? 'white' : phaseData.colorDark,
                    }}
                  >
                    h
                  </button>
                </div>
              </div>
            </div>
            {/* Bouton Valider activité — visible et explicite */}
            <button
              onClick={addActivity}
              disabled={!activityName.trim() && !activitySaved}
              className="w-full py-2.5 rounded-[12px] text-sm font-body font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-30"
              style={{
                backgroundColor: activitySaved ? '#7BAE7F' : activityName.trim() ? phaseData.bgColor : '#F5F2F0',
                color: activitySaved ? 'white' : activityName.trim() ? phaseData.colorDark : '#B0A5AA',
                border: activitySaved ? '1.5px solid #7BAE7F' : activityName.trim() ? `1.5px solid ${phaseData.color}` : '1.5px solid transparent',
              }}
            >
              {activitySaved ? <><Check size={16} /> Activité ajoutée !</> : 'Valider cette activité'}
            </button>

            {/* Récap "Aujourd'hui" — pas + activités */}
            {((todayLog.activities && todayLog.activities.length > 0) || todayLog.steps > 0) && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-[9px] font-body font-bold text-luna-text-hint uppercase tracking-widest mb-2.5">
                  Aujourd'hui
                </p>
                <div className="space-y-2">
                  {/* Pas sauvegardés */}
                  {todayLog.steps > 0 && (
                    <div
                      className="flex items-center justify-between p-3 rounded-[14px]"
                      style={{ backgroundColor: phaseData.bgColor }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-[10px] flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: `${phaseData.color}18` }}
                        >
                          <Footprints size={16} style={{ color: phaseData.colorDark }} />
                        </div>
                        <div>
                          <p className="text-sm font-body font-semibold text-luna-text">Marche</p>
                          <p className="text-[11px] font-body text-luna-text-muted">
                            {todayLog.steps.toLocaleString('fr-FR')} pas
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Activités */}
                  {(todayLog.activities || []).map((act, i) => {
                    const matchedActivity = QUICK_ACTIVITIES.find((a) => a.name === act.name);
                    return (
                      <div
                        key={i}
                        className="flex items-center justify-between p-3 rounded-[14px]"
                        style={{ backgroundColor: phaseData.bgColor }}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-9 h-9 rounded-[10px] flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: `${phaseData.color}18` }}
                          >
                            <span className="text-base">{matchedActivity ? matchedActivity.icon : '🏃'}</span>
                          </div>
                          <div>
                            <p className="text-sm font-body font-semibold text-luna-text">{act.name}</p>
                            {act.duration > 0 && (
                              <p className="text-[11px] font-body text-luna-text-muted flex items-center gap-1">
                                <Clock size={10} /> {act.duration >= 60 ? `${Math.floor(act.duration / 60)}h${act.duration % 60 > 0 ? `${String(act.duration % 60).padStart(2, '0')}` : ''}` : `${act.duration} min`}
                              </p>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => removeActivity(i)}
                          className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-white/60 transition-colors"
                        >
                          <Trash2 size={13} className="text-luna-text-hint" />
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Total durée activités */}
                {todayLog.activities && todayLog.activities.some((a) => a.duration > 0) && (
                  <div className="mt-3 flex items-center justify-end gap-1.5">
                    <Clock size={12} style={{ color: phaseData.colorDark }} />
                    <span className="text-xs font-body font-semibold" style={{ color: phaseData.colorDark }}>
                      Total : {todayLog.activities.reduce((sum, a) => sum + (a.duration || 0), 0)} min
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Séparateur avant bouton séance */}
            <div className="h-px bg-gray-100 mt-4 mb-4" />

            {/* Bouton "J'ai bougé aujourd'hui" — en bas, large et explicite */}
            <button
              onClick={toggleSession}
              className="w-full py-3.5 rounded-[16px] flex items-center justify-center gap-2.5 transition-all"
              style={{
                backgroundColor: sessionValidated ? '#7BAE7F' : phaseData.bgColor,
                border: sessionValidated ? '1.5px solid #7BAE7F' : `2px solid ${phaseData.color}40`,
              }}
            >
              <Check size={18} style={{ color: sessionValidated ? 'white' : phaseData.colorDark }} />
              <span
                className="text-sm font-body font-bold"
                style={{ color: sessionValidated ? 'white' : phaseData.colorDark }}
              >
                {sessionValidated ? 'Séance validée' : 'J\'ai bougé aujourd\'hui !'}
              </span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Nos recommandations — avec photos */}
      <motion.div variants={item}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-display text-xl text-luna-text">Nos recommandations</h2>
            <p className="text-xs font-body text-luna-text-hint mt-0.5">
              Activités adaptées à ta phase {phaseData.shortName.toLowerCase()}.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {exerciseData.exercises.map((ex, i) => (
            <motion.button
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              onClick={() => setSelectedExercise(ex)}
              className="w-full text-left bg-white rounded-[20px] overflow-hidden transition-all hover:shadow-md group"
              style={{ boxShadow: '0 2px 12px rgba(45,34,38,0.04)' }}
            >
              <div className="flex items-center p-4 gap-4">
                {/* Icône */}
                <div
                  className="w-12 h-12 rounded-[14px] flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: phaseData.bgColor }}
                >
                  <span className="text-2xl">{ex.icon}</span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-display text-luna-text leading-snug">{ex.name}</h3>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-[10px] font-body text-luna-text-hint flex items-center gap-1">
                      <Clock size={10} /> {ex.duration}
                    </span>
                    <span className="text-[10px] font-body font-semibold px-2 py-0.5 rounded-pill" style={{ backgroundColor: phaseData.bgColor, color: phaseData.colorDark }}>
                      {ex.sets}
                    </span>
                  </div>
                </div>

                <div className="flex items-center">
                  <ChevronRight size={16} className="text-luna-text-hint group-hover:text-luna-text-muted transition-colors" />
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* À éviter */}
      <motion.div variants={item}>
        <div className="rounded-[20px] p-5 bg-white" style={{ boxShadow: '0 2px 12px rgba(45,34,38,0.04)' }}>
          <h3 className="font-display text-base text-luna-text mb-3">À éviter en ce moment</h3>
          <div className="space-y-3">
            {exerciseData.avoid.map((a, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-red-400 text-xs">✕</span>
                </span>
                <div>
                  <p className="text-sm font-body font-semibold text-luna-text">{a.name}</p>
                  <p className="text-xs font-body text-luna-text-muted mt-0.5 leading-relaxed">{a.reason}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Pourquoi */}
      <motion.div variants={item}>
        <div className="rounded-[24px] p-5" style={{ backgroundColor: phaseData.bgColor }}>
          <div className="flex items-center gap-2 mb-2">
            <Zap size={16} style={{ color: phaseData.colorDark }} />
            <h3 className="font-display text-base text-luna-text">Pourquoi ces recommandations ?</h3>
          </div>
          <p className="text-sm font-body text-luna-text-body leading-relaxed">
            {exerciseData.whyThisSport}
          </p>
        </div>
      </motion.div>

      {/* Quote */}
      <motion.div variants={item} className="text-center py-4">
        <p className="text-sm font-body text-luna-text-hint italic px-8 leading-relaxed">
          "{exerciseData.message}"
        </p>
      </motion.div>

      {/* Exercise Detail Modal */}
      <AnimatePresence>
        {selectedExercise && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-4"
            onClick={() => setSelectedExercise(null)}
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-t-[28px] md:rounded-[24px] w-full max-w-md max-h-[85vh] overflow-y-auto"
            >
              {/* Header avec icône */}
              <div
                className="relative px-5 pt-5 pb-5 rounded-t-[28px] md:rounded-t-[24px]"
                style={{ background: `linear-gradient(145deg, ${phaseData.bgColor} 0%, ${phaseData.color}20 100%)` }}
              >
                <div
                  className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-15"
                  style={{ backgroundColor: phaseData.color }}
                />
                <button
                  onClick={() => setSelectedExercise(null)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors"
                >
                  <X size={16} className="text-luna-text-muted" />
                </button>
                <div className="flex items-center gap-4">
                  <div
                    className="w-14 h-14 rounded-[16px] flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${phaseData.color}18` }}
                  >
                    <span className="text-3xl">{selectedExercise.icon}</span>
                  </div>
                  <h3 className="font-display text-xl text-luna-text pr-8">{selectedExercise.name}</h3>
                </div>
              </div>

              <div className="p-5 space-y-4">
                {/* Tags */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 text-xs font-body font-semibold px-3 py-1.5 rounded-pill text-white" style={{ backgroundColor: phaseData.color }}>
                    <Clock size={12} />
                    {selectedExercise.duration}
                  </span>
                  <span className="text-xs font-body font-semibold px-3 py-1.5 rounded-pill" style={{ backgroundColor: phaseData.bgColor, color: phaseData.colorDark }}>
                    {selectedExercise.sets}
                  </span>
                </div>

                {/* Description */}
                <p className="text-sm font-body text-luna-text-body leading-relaxed">
                  {selectedExercise.description}
                </p>

                {/* Info disclaimer */}
                <div className="rounded-[14px] p-3" style={{ backgroundColor: phaseData.bgColor }}>
                  <p className="text-xs font-body text-luna-text-muted leading-relaxed text-center">
                    💡 Adapte l'intensité à ton ressenti. L'important, c'est de bouger à ton rythme.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
