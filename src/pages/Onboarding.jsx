import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { useCycle } from '../contexts/CycleContext';
import { PHASES } from '../data/phases';
import { getCycleInfo } from '../contexts/CycleContext';
import { supabase } from '../lib/supabase';

const goalOptions = [
  { id: 'sport', label: 'Adapter mon sport à mon cycle', icon: '🏃‍♀️' },
  { id: 'food', label: 'Mieux nourrir mon corps', icon: '🥗' },
  { id: 'sleep', label: 'Améliorer mon sommeil', icon: '😴' },
  { id: 'emotions', label: 'Comprendre mes émotions', icon: '🧠' },
  { id: 'discomfort', label: 'Réduire l\'inconfort menstruel', icon: '🌸' },
  { id: 'energy', label: 'Augmenter mon énergie', icon: '⚡' },
  { id: 'skin', label: 'Prendre soin de ma peau', icon: '✨' },
  { id: 'strength', label: 'Me sentir plus forte', icon: '💪' },
];

const fitnessLevels = [
  { id: 'beginner', label: 'Débutante', desc: 'Je commence tout juste', icon: '🌱' },
  { id: 'intermediate', label: 'Intermédiaire', desc: 'Je bouge régulièrement', icon: '🌿' },
  { id: 'advanced', label: 'Confirmée', desc: 'Le sport, c\'est ma vie', icon: '🌳' },
];

const dietOptions = ['Omnivore', 'Végétarienne', 'Végane', 'Sans gluten', 'Sans lactose'];
const healthOptions = ['SPM sévère', 'Endométriose', 'SOPK', 'Cycles irréguliers'];

export default function Onboarding() {
  const navigate = useNavigate();
  const { dispatch } = useCycle();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [form, setForm] = useState({
    name: '',
    email: '',
    lastPeriodDate: '',
    cycleLength: 28,
    periodLength: 5,
    goals: [],
    fitnessLevel: 'intermediate',
    dietPreferences: [],
    healthIssues: [],
  });

  const updateForm = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));
  const toggleArray = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter((v) => v !== value)
        : [...prev[key], value],
    }));
  };

  const canNext = () => {
    if (step === 0) return form.name.trim().length > 0;
    if (step === 1) return form.lastPeriodDate.length > 0;
    return true;
  };

  const finish = async () => {
    setLoading(true);

    // Simulate loading steps
    for (let i = 1; i <= 3; i++) {
      await new Promise((r) => setTimeout(r, 800));
      setLoadingStep(i);
    }

    await new Promise((r) => setTimeout(r, 500));

    dispatch({ type: 'SET_PROFILE', payload: form });
    dispatch({ type: 'COMPLETE_ONBOARDING' });

    // Save to Supabase
    const info = getCycleInfo(form.lastPeriodDate, form.cycleLength, form.periodLength);
    try {
      await supabase.from('users').insert({
        name: form.name,
        email: form.email,
        last_period_date: form.lastPeriodDate,
        cycle_length: form.cycleLength,
        period_length: form.periodLength,
        goals: form.goals,
        fitness_level: form.fitnessLevel,
        diet_preferences: form.dietPreferences,
        health_issues: form.healthIssues,
        current_phase: info?.phase || 'unknown',
      });
    } catch (e) {
      console.log('Supabase save error:', e);
    }

    setLoading(false);
  };

  const info = form.lastPeriodDate
    ? getCycleInfo(form.lastPeriodDate, form.cycleLength, form.periodLength)
    : null;

  const slideVariants = {
    enter: { x: 80, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: -80, opacity: 0 },
  };

  // Loading screen
  if (loading) {
    const loadingSteps = [
      'Analyse de ton cycle',
      'Création de ton profil',
      'Préparation de tes recommandations',
    ];

    return (
      <div className="min-h-screen bg-luna-bg flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-sm text-center"
        >
          <img src="/logo-luna.png" alt="LUNA" className="w-24 mx-auto mb-8" />
          <div className="space-y-4">
            {loadingSteps.map((label, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.3 }}
                className="flex items-center gap-3"
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-500 ${
                  loadingStep > i
                    ? 'bg-luna-orange text-white'
                    : loadingStep === i
                      ? 'bg-luna-orange/20 border-2 border-luna-orange'
                      : 'bg-luna-cream-card'
                }`}>
                  {loadingStep > i && <Check size={14} />}
                </div>
                <span className={`text-sm font-body transition-colors ${
                  loadingStep > i ? 'text-luna-text font-semibold' : 'text-luna-text-muted'
                }`}>
                  {label}
                </span>
                {loadingStep > i && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-luna-orange ml-auto"
                  >
                    ✓
                  </motion.span>
                )}
              </motion.div>
            ))}
          </div>
          {loadingStep >= 3 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-8"
            >
              <div className="h-1 bg-luna-cream-card rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 0.5 }}
                  className="h-full bg-luna-orange rounded-full"
                />
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-luna-bg flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Progress bar */}
        <div className="h-1 bg-luna-cream-card rounded-full mb-8 overflow-hidden">
          <motion.div
            className="h-full bg-luna-orange rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((step + 1) / 5) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>

        <AnimatePresence mode="wait">
          {/* Step 0: Welcome */}
          {step === 0 && (
            <motion.div
              key="step0"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="bg-luna-cream-light rounded-luna p-8 shadow-sm"
            >
              <h2 className="font-display text-3xl text-luna-text text-center mb-2">
                Bienvenue 🌿
              </h2>
              <p className="text-luna-text-muted text-center mb-8 font-body text-sm">
                On va apprendre à se connaître. Quelques questions pour personnaliser ton expérience.
              </p>
              <label className="block text-sm font-semibold text-luna-text mb-2 font-body">
                Comment veux-tu qu'on t'appelle ?
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => updateForm('name', e.target.value)}
                placeholder="Écris ton prénom ici"
                className="w-full px-4 py-3 rounded-pill bg-white border border-luna-sage/30 text-luna-text font-body focus:outline-none focus:ring-2 focus:ring-luna-orange/30 transition-all mb-5"
                autoFocus
              />
              <label className="block text-sm font-semibold text-luna-text mb-2 font-body">
                Ton email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => updateForm('email', e.target.value)}
                placeholder="ton.email@exemple.com"
                className="w-full px-4 py-3 rounded-pill bg-white border border-luna-sage/30 text-luna-text font-body focus:outline-none focus:ring-2 focus:ring-luna-orange/30 transition-all"
              />
            </motion.div>
          )}

          {/* Step 1: Cycle */}
          {step === 1 && (
            <motion.div
              key="step1"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="bg-luna-cream-light rounded-luna p-8 shadow-sm"
            >
              <h2 className="font-display text-2xl text-luna-text text-center mb-2">
                Ton cycle 🌙
              </h2>
              <p className="text-luna-text-muted text-center mb-6 text-sm font-body">
                Ces infos nous aident à calculer ta phase actuelle.
              </p>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-luna-text mb-2 font-body">
                    Début de tes dernières règles
                  </label>
                  <input
                    type="date"
                    value={form.lastPeriodDate}
                    onChange={(e) => updateForm('lastPeriodDate', e.target.value)}
                    className="w-full px-4 py-3 rounded-pill bg-white border border-luna-sage/30 text-luna-text font-body focus:outline-none focus:ring-2 focus:ring-luna-orange/30"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-luna-text mb-2 font-body">
                    Durée de ton cycle : <span className="text-luna-orange font-accent text-lg">{form.cycleLength} jours</span>
                  </label>
                  <input
                    type="range" min={21} max={35}
                    value={form.cycleLength}
                    onChange={(e) => updateForm('cycleLength', Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-luna-text-hint font-accent">
                    <span>21j</span><span>28j</span><span>35j</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-luna-text mb-2 font-body">
                    Durée de tes règles : <span className="text-luna-orange font-accent text-lg">{form.periodLength} jours</span>
                  </label>
                  <input
                    type="range" min={2} max={8}
                    value={form.periodLength}
                    onChange={(e) => updateForm('periodLength', Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-luna-text-hint font-accent">
                    <span>2j</span><span>5j</span><span>8j</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Goals */}
          {step === 2 && (
            <motion.div
              key="step2"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="bg-luna-cream-light rounded-luna p-8 shadow-sm"
            >
              <h2 className="font-display text-2xl text-luna-text text-center mb-2">
                Tes objectifs ✨
              </h2>
              <p className="text-luna-text-muted text-center mb-6 text-sm font-body">
                Qu'est-ce qui t'intéresse le plus ?
              </p>
              <div className="flex flex-wrap gap-2">
                {goalOptions.map(({ id, label, icon }) => (
                  <button
                    key={id}
                    onClick={() => toggleArray('goals', id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-pill text-sm font-body font-semibold transition-all border-2 ${
                      form.goals.includes(id)
                        ? 'border-luna-orange bg-luna-orange/10 text-luna-orange-deep'
                        : 'border-luna-sage/30 bg-white text-luna-text-muted hover:border-luna-orange/30'
                    }`}
                  >
                    <span>{icon}</span>
                    {label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 3: Profile */}
          {step === 3 && (
            <motion.div
              key="step3"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="bg-luna-cream-light rounded-luna p-8 shadow-sm"
            >
              <h2 className="font-display text-2xl text-luna-text text-center mb-2">
                Ton profil 💪
              </h2>
              <p className="text-luna-text-muted text-center mb-6 text-sm font-body">
                Pour affiner tes recommandations.
              </p>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-luna-text mb-2 font-body">Niveau sportif</label>
                  <div className="space-y-2">
                    {fitnessLevels.map(({ id, label, desc, icon }) => (
                      <button
                        key={id}
                        onClick={() => updateForm('fitnessLevel', id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-luna-sm text-left transition-all border-2 ${
                          form.fitnessLevel === id
                            ? 'border-luna-orange bg-luna-orange/10'
                            : 'border-luna-sage/20 bg-white hover:border-luna-orange/20'
                        }`}
                      >
                        <span className="text-xl">{icon}</span>
                        <div>
                          <p className="text-sm font-semibold text-luna-text font-body">{label}</p>
                          <p className="text-xs text-luna-text-muted font-body">{desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-luna-text mb-2 font-body">Alimentation</label>
                  <div className="flex flex-wrap gap-2">
                    {dietOptions.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => toggleArray('dietPreferences', opt)}
                        className={`px-3 py-1.5 rounded-pill text-xs font-body font-semibold transition-all border ${
                          form.dietPreferences.includes(opt)
                            ? 'border-luna-orange bg-luna-orange/10 text-luna-orange-deep'
                            : 'border-luna-sage/30 bg-white text-luna-text-muted'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-luna-text mb-2 font-body">
                    Problématiques <span className="font-normal text-luna-text-hint">(optionnel)</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {healthOptions.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => toggleArray('healthIssues', opt)}
                        className={`px-3 py-1.5 rounded-pill text-xs font-body font-semibold transition-all border ${
                          form.healthIssues.includes(opt)
                            ? 'border-luna-lavender bg-luna-lavender/20 text-luna-lavender-dark'
                            : 'border-luna-sage/30 bg-white text-luna-text-muted'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 4: Ready */}
          {step === 4 && info && (
            <motion.div
              key="step4"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="bg-luna-cream-light rounded-luna p-8 shadow-sm text-center"
            >
              <h2 className="font-display text-3xl text-luna-text mb-6">
                C'est prêt ✨
              </h2>

              {/* Profile recap card */}
              <div className="rounded-luna p-5 mb-6 text-left" style={{ backgroundColor: PHASES[info.phase].bgColor }}>
                <p className="text-xs font-accent font-semibold text-luna-text-muted uppercase tracking-wide mb-3">Ton profil</p>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-body text-luna-text-body">Phase actuelle</span>
                    <span className="text-sm font-semibold font-body flex items-center gap-1" style={{ color: PHASES[info.phase].colorDark }}>
                      {PHASES[info.phase].icon} {PHASES[info.phase].shortName} — Jour {info.currentDay}
                    </span>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-body text-luna-text-body">Niveau d'énergie estimé</span>
                      <span className="text-sm font-semibold font-accent">{info.energyLevel}%</span>
                    </div>
                    <div className="h-2 bg-white/50 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${info.energyLevel}%` }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: PHASES[info.phase].color }}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm font-body text-luna-text-body">Prochaines règles dans</span>
                    <span className="text-sm font-semibold font-accent text-luna-orange">{info.daysUntilPeriod} jours</span>
                  </div>
                </div>
              </div>

              <p className="text-sm text-luna-text-muted font-body italic">
                {PHASES[info.phase].bodyToday}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation buttons */}
        <div className="flex justify-between mt-6">
          {step > 0 ? (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="flex items-center gap-1 text-sm text-luna-text-muted hover:text-luna-text transition-colors font-body"
            >
              <ChevronLeft size={16} />
              Retour
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              disabled={!canNext()}
              className="btn-luna"
            >
              Continuer
              <ChevronRight size={16} />
            </button>
          ) : (
            <button
              onClick={() => {
                finish().then(() => navigate('/dashboard'));
              }}
              className="btn-luna"
            >
              Découvrir ma journée →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
