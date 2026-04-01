import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';
import { useCycle } from '../contexts/CycleContext';
import { PHASES } from '../data/phases';
import { getCycleInfo } from '../contexts/CycleContext';
import { supabase } from '../lib/supabase';

const goalOptions = [
  { id: 'sport', label: 'Adapter mon sport', icon: '🏃‍♀️' },
  { id: 'food', label: 'Mieux manger', icon: '🥗' },
  { id: 'sleep', label: 'Améliorer mon sommeil', icon: '😴' },
  { id: 'emotions', label: 'Comprendre mes émotions', icon: '🧠' },
  { id: 'learn', label: 'Apprendre sur mon corps', icon: '📖' },
  { id: 'strength', label: 'Me sentir plus forte', icon: '💪' },
];

const fitnessLevels = [
  { id: 'beginner', label: 'Débutante', desc: 'Je commence tout juste', icon: '🌱' },
  { id: 'intermediate', label: 'Intermédiaire', desc: 'Je bouge régulièrement', icon: '🌿' },
  { id: 'advanced', label: 'Sportive confirmée', desc: 'Le sport, c\'est ma vie', icon: '🌳' },
];

const dietOptions = [
  'Omnivore', 'Végétarienne', 'Végane', 'Sans gluten', 'Autre',
];

const healthOptions = [
  'SPM sévère', 'Endométriose', 'SOPK', 'Cycles irréguliers',
];

export default function Onboarding() {
  const navigate = useNavigate();
  const { dispatch } = useCycle();
  const [step, setStep] = useState(0);
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
    if (step === 0) return form.name.trim().length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
    if (step === 1) return form.lastPeriodDate.length > 0;
    return true;
  };

  const finish = async () => {
    dispatch({ type: 'SET_PROFILE', payload: form });
    dispatch({ type: 'COMPLETE_ONBOARDING' });

    // Sauvegarde dans Supabase
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
  };

  const info = form.lastPeriodDate
    ? getCycleInfo(form.lastPeriodDate, form.cycleLength, form.periodLength)
    : null;

  const slideVariants = {
    enter: { x: 80, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: -80, opacity: 0 },
  };

  return (
    <div className="min-h-screen bg-luna-bg flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-8">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-500 ${
                i === step ? 'w-8 bg-luna-rose' : i < step ? 'w-2 bg-luna-rose/60' : 'w-2 bg-luna-rose/20'
              }`}
            />
          ))}
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
              <img src="/logo-luna.png" alt="LUNA" className="w-32 mx-auto mb-4" />
              <h2 className="font-display text-3xl text-luna-text text-center mb-2">
                Bienvenue 🌸
              </h2>
              <p className="text-luna-text-secondary text-center mb-8 font-body">
                On va apprendre à se connaître. Quelques questions pour personnaliser ton expérience.
              </p>
              <label className="block text-sm font-semibold text-luna-text mb-2 font-body">
                Comment tu t'appelles ?
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => updateForm('name', e.target.value)}
                placeholder="Ton prénom"
                className="w-full px-4 py-3 rounded-luna-sm bg-white border border-luna-rose/20 text-luna-text font-body focus:outline-none focus:ring-2 focus:ring-luna-rose/40 transition-all mb-5"
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
                className="w-full px-4 py-3 rounded-luna-sm bg-white border border-luna-rose/20 text-luna-text font-body focus:outline-none focus:ring-2 focus:ring-luna-rose/40 transition-all"
              />
              {form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) && (
                <p className="text-xs text-luna-rose-dark mt-1.5 font-body">Entre une adresse email valide</p>
              )}
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
              <p className="text-luna-text-secondary text-center mb-6 text-sm font-body">
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
                    className="w-full px-4 py-3 rounded-luna-sm bg-white border border-luna-rose/20 text-luna-text font-body focus:outline-none focus:ring-2 focus:ring-luna-rose/40"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-luna-text mb-2 font-body">
                    Durée de ton cycle : <span className="text-luna-rose-dark font-accent text-lg">{form.cycleLength} jours</span>
                  </label>
                  <input
                    type="range"
                    min={21}
                    max={35}
                    value={form.cycleLength}
                    onChange={(e) => updateForm('cycleLength', Number(e.target.value))}
                    className="w-full accent-luna-rose"
                  />
                  <div className="flex justify-between text-xs text-luna-text-secondary font-accent">
                    <span>21j</span><span>28j</span><span>35j</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-luna-text mb-2 font-body">
                    Durée de tes règles : <span className="text-luna-rose-dark font-accent text-lg">{form.periodLength} jours</span>
                  </label>
                  <input
                    type="range"
                    min={2}
                    max={8}
                    value={form.periodLength}
                    onChange={(e) => updateForm('periodLength', Number(e.target.value))}
                    className="w-full accent-luna-rose"
                  />
                  <div className="flex justify-between text-xs text-luna-text-secondary font-accent">
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
              <p className="text-luna-text-secondary text-center mb-6 text-sm font-body">
                Qu'est-ce qui t'intéresse le plus ?
              </p>
              <div className="grid grid-cols-2 gap-3">
                {goalOptions.map(({ id, label, icon }) => (
                  <button
                    key={id}
                    onClick={() => toggleArray('goals', id)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-luna-sm text-sm font-body font-semibold transition-all border-2 ${
                      form.goals.includes(id)
                        ? 'border-luna-rose bg-luna-rose/10 text-luna-rose-dark'
                        : 'border-transparent bg-white text-luna-text-secondary hover:border-luna-rose/30'
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
              <p className="text-luna-text-secondary text-center mb-6 text-sm font-body">
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
                            ? 'border-luna-rose bg-luna-rose/10'
                            : 'border-transparent bg-white hover:border-luna-rose/20'
                        }`}
                      >
                        <span className="text-xl">{icon}</span>
                        <div>
                          <p className="text-sm font-semibold text-luna-text font-body">{label}</p>
                          <p className="text-xs text-luna-text-secondary font-body">{desc}</p>
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
                        className={`px-3 py-1.5 rounded-full text-xs font-body font-semibold transition-all border ${
                          form.dietPreferences.includes(opt)
                            ? 'border-luna-mint bg-luna-mint/20 text-luna-mint-dark'
                            : 'border-luna-rose/20 bg-white text-luna-text-secondary'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-luna-text mb-2 font-body">
                    Problématiques <span className="font-normal text-luna-text-secondary">(optionnel)</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {healthOptions.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => toggleArray('healthIssues', opt)}
                        className={`px-3 py-1.5 rounded-full text-xs font-body font-semibold transition-all border ${
                          form.healthIssues.includes(opt)
                            ? 'border-luna-lavender bg-luna-lavender/20 text-luna-lavender-dark'
                            : 'border-luna-rose/20 bg-white text-luna-text-secondary'
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
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
              >
                <Sparkles className="mx-auto text-luna-rose mb-3" size={40} />
              </motion.div>
              <h2 className="font-display text-3xl text-luna-text mb-4">
                Tu es prête ! ✨
              </h2>
              <div
                className="rounded-luna p-5 mb-4"
                style={{ backgroundColor: PHASES[info.phase].bgColor }}
              >
                <span className="text-4xl block mb-2">{PHASES[info.phase].icon}</span>
                <p className="font-body text-luna-text">
                  Bonjour <strong>{form.name}</strong> ! Tu es actuellement en
                </p>
                <p className="font-display text-xl mt-1" style={{ color: PHASES[info.phase].colorDark }}>
                  {PHASES[info.phase].name}
                </p>
                <p className="text-sm text-luna-text-secondary mt-1 font-accent">
                  Jour {info.currentDay} de ton cycle
                </p>
              </div>
              <p className="text-sm text-luna-text-secondary font-body mb-4">
                {PHASES[info.phase].summary}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation buttons */}
        <div className="flex justify-between mt-6">
          {step > 0 ? (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="flex items-center gap-1 text-sm text-luna-text-secondary hover:text-luna-text transition-colors font-body"
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
              className="flex items-center gap-1 px-6 py-2.5 bg-luna-primary text-white rounded-luna-sm text-sm font-body font-bold hover:bg-luna-primary-dark transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              C'est parti
              <ChevronRight size={16} />
            </button>
          ) : (
            <button
              onClick={() => {
                finish();
                navigate('/dashboard');
              }}
              className="px-6 py-2.5 bg-luna-primary text-white rounded-luna-sm text-sm font-body font-bold hover:bg-luna-primary-dark transition-all"
            >
              Voir mon tableau de bord →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
