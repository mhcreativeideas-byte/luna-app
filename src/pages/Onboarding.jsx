import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Check, ArrowRight } from 'lucide-react';
import { useCycle } from '../contexts/CycleContext';
import { PHASES } from '../data/phases';
import { getCycleInfo } from '../contexts/CycleContext';

const TOTAL_STEPS = 6;

const goalOptions = [
  { id: 'sport', label: 'Adapter mon sport', icon: '🏃‍♀️' },
  { id: 'food', label: 'Mieux manger', icon: '🥗' },
  { id: 'sleep', label: 'Mieux dormir', icon: '😴' },
  { id: 'emotions', label: 'Gérer mes émotions', icon: '🧠' },
  { id: 'discomfort', label: 'Moins de douleurs', icon: '🌸' },
  { id: 'energy', label: 'Plus d\'énergie', icon: '⚡' },
  { id: 'skin', label: 'Soigner ma peau', icon: '✨' },
  { id: 'strength', label: 'Me sentir forte', icon: '💪' },
];

const fitnessLevels = [
  { id: 'beginner', label: 'Je débute', desc: 'Et c\'est très bien comme ça', icon: '🌱' },
  { id: 'intermediate', label: 'Je bouge régulièrement', desc: 'Quelques séances par semaine', icon: '🌿' },
  { id: 'advanced', label: 'Je suis une athlète', desc: 'Le sport fait partie de ma vie', icon: '🌳' },
];

const dietOptions = [
  { id: 'Omnivore', icon: '🍽️' },
  { id: 'Végétarienne', icon: '🥬' },
  { id: 'Végane', icon: '🌱' },
  { id: 'Sans gluten', icon: '🌾' },
  { id: 'Sans lactose', icon: '🥛' },
];

const healthOptions = [
  { id: 'SPM sévère', icon: '😣', desc: 'Douleurs, fatigue, irritabilité avant les règles' },
  { id: 'Endométriose', icon: '🩺', desc: 'Diagnostiquée ou suspectée' },
  { id: 'SOPK', icon: '🔬', desc: 'Syndrome des ovaires polykystiques' },
  { id: 'Cycles irréguliers', icon: '📅', desc: 'Cycles de durée variable' },
  { id: 'Anti-inflammatoire', icon: '🍃', desc: 'Privilégier une alimentation anti-inflammatoire' },
];

const allergyOptions = [
  { id: 'Fruits à coque', icon: '🥜' },
  { id: 'Arachides', icon: '🫘' },
  { id: 'Soja', icon: '🫛' },
  { id: 'Œufs', icon: '🥚' },
  { id: 'Poisson', icon: '🐟' },
  { id: 'Crustacés', icon: '🦐' },
  { id: 'Lait', icon: '🥛' },
  { id: 'Blé', icon: '🌾' },
  { id: 'Sésame', icon: '🌿' },
  { id: 'Céleri', icon: '🥬' },
  { id: 'Moutarde', icon: '🟡' },
  { id: 'Sulfites', icon: '🍷' },
];

const cookingLevelOptions = [
  { id: 'debutant', label: 'Débutant(e)', desc: 'Recettes simples et rapides', icon: '🌱' },
  { id: 'intermediaire', label: 'Intermédiaire', desc: 'À l\'aise en cuisine', icon: '🌿' },
  { id: 'avance', label: 'Avancé(e)', desc: 'J\'adore cuisiner !', icon: '👩‍🍳' },
];

const cookingTimeOptions = [
  { id: '15min', label: '15 min', desc: 'Express', icon: '⚡' },
  { id: '30min', label: '30 min', desc: 'Rapide', icon: '🕐' },
  { id: '45min', label: '45 min', desc: 'Tranquille', icon: '🍳' },
  { id: '60min+', label: '1h+', desc: 'J\'ai le temps', icon: '👩‍🍳' },
];

// Step backgrounds
const STEP_COLORS = [
  { bg: 'linear-gradient(180deg, #FDE8EB 0%, #FAF7F5 100%)', accent: '#C4727F' },
  { bg: 'linear-gradient(180deg, #F3EEF8 0%, #FAF7F5 100%)', accent: '#9B7FB8' },
  { bg: 'linear-gradient(180deg, #E8F5E9 0%, #FAF7F5 100%)', accent: '#6B9E76' },
  { bg: 'linear-gradient(180deg, #FFF3EB 0%, #FAF7F5 100%)', accent: '#D4846A' },
  { bg: 'linear-gradient(180deg, #FDE8D8 0%, #FAF7F5 100%)', accent: '#E8946A' },
  null, // dynamic based on phase
];

// Personalized message based on health/diet
function getPersonalizedTip(form, phase) {
  const tips = [];
  if (form.healthIssues.includes('SOPK')) {
    tips.push('Tes recommandations sont adaptées au SOPK : index glycémique bas, anti-inflammatoires naturels.');
  }
  if (form.healthIssues.includes('Endométriose')) {
    tips.push('On privilégie les aliments anti-inflammatoires et riches en oméga-3 pour toi.');
  }
  if (form.healthIssues.includes('SPM sévère')) {
    tips.push('Magnésium, B6 et calcium seront tes alliés. On les met en avant pour toi.');
  }
  if (form.healthIssues.includes('Anti-inflammatoire')) {
    tips.push('On met en avant les recettes riches en oméga-3, curcuma et antioxydants pour toi.');
  }
  if (form.dietPreferences.includes('Végane') || form.dietPreferences.includes('Végétarienne')) {
    tips.push('Toutes les recettes et aliments sont adaptés à ton régime alimentaire.');
  }
  if (!tips.length) {
    const phaseMsg = {
      menstrual: 'C\'est le moment de prendre soin de toi. On te guide pas à pas.',
      follicular: 'Ton énergie remonte ! On va en profiter ensemble.',
      ovulatory: 'Tu es au sommet de ton cycle. Profite de cette énergie.',
      luteal: 'Ton corps se prépare. On adapte tout pour toi.',
    };
    tips.push(phaseMsg[phase] || 'On est là pour t\'accompagner chaque jour.');
  }
  return tips[0];
}

export default function Onboarding() {
  const navigate = useNavigate();
  const { dispatch, user, saveProfileToSupabase } = useCycle();
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
    allergies: [],
    cookingLevel: '',
    cookingTime: '',
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

    for (let i = 1; i <= 3; i++) {
      await new Promise((r) => setTimeout(r, 800));
      setLoadingStep(i);
    }

    await new Promise((r) => setTimeout(r, 500));

    // Set email from auth if available
    const finalForm = {
      ...form,
      email: form.email || user?.email || '',
    };

    dispatch({ type: 'SET_PROFILE', payload: finalForm });
    dispatch({ type: 'COMPLETE_ONBOARDING' });

    // Save to Supabase (via context method, deferred)
    setTimeout(() => {
      saveProfileToSupabase?.();
    }, 500);

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
      'On analyse ton cycle...',
      'On prépare ton profil...',
      'On sélectionne tes recommandations...',
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
                    ? 'bg-luna-rose text-white'
                    : loadingStep === i
                      ? 'bg-luna-rose/20 border-2 border-luna-rose'
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
                    className="text-luna-rose ml-auto"
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
                  className="h-full bg-luna-rose rounded-full"
                />
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    );
  }

  const stepColor = STEP_COLORS[step];

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-8 transition-all duration-500"
      style={{ background: step < 5 ? stepColor?.bg : (info ? `linear-gradient(180deg, ${PHASES[info.phase].bgColor} 0%, #FAF7F5 100%)` : '#FAF7F5') }}
    >
      <div className="w-full max-w-md">
        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-8">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <motion.div
              key={i}
              animate={{
                width: i === step ? 24 : 8,
                backgroundColor: i <= step ? (step < 5 ? stepColor?.accent : (info ? PHASES[info.phase].color : '#C4727F')) : '#E0D5D8',
              }}
              className="h-2 rounded-full"
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* Step 0: Prenom */}
          {step === 0 && (
            <motion.div
              key="step0"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="bg-white rounded-[24px] p-8"
              style={{ boxShadow: '0 2px 20px rgba(45, 34, 38, 0.06)' }}
            >
              <div className="text-center mb-8">
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.2 }}
                  className="text-5xl block mb-4"
                >
                  👋
                </motion.span>
                <h2 className="font-display text-2xl text-luna-text mb-2">
                  Comment tu t'appelles ?
                </h2>
                <p className="text-luna-text-muted font-body text-sm">
                  Pour qu'on puisse te parler comme une amie.
                </p>
              </div>
              <input
                type="text"
                value={form.name}
                onChange={(e) => updateForm('name', e.target.value)}
                placeholder="Ton prénom"
                className="w-full px-5 py-4 rounded-[16px] bg-luna-cream border border-transparent text-luna-text font-body text-center text-lg focus:outline-none focus:ring-2 focus:ring-luna-rose/30 transition-all"
                autoFocus
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
              className="bg-white rounded-[24px] p-8"
              style={{ boxShadow: '0 2px 20px rgba(45, 34, 38, 0.06)' }}
            >
              <div className="text-center mb-6">
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.2 }}
                  className="text-5xl block mb-4"
                >
                  🌙
                </motion.span>
                <h2 className="font-display text-2xl text-luna-text mb-2">
                  Parlons de ton cycle
                </h2>
                <p className="text-luna-text-muted font-body text-sm">
                  Pour savoir où tu en es aujourd'hui.
                </p>
              </div>
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-luna-text-hint mb-2 font-body uppercase tracking-wider">
                    Dernières règles
                  </label>
                  <input
                    type="date"
                    value={form.lastPeriodDate}
                    onChange={(e) => updateForm('lastPeriodDate', e.target.value)}
                    className="w-full px-5 py-3.5 rounded-[16px] bg-luna-cream border border-transparent text-luna-text font-body focus:outline-none focus:ring-2 focus:ring-luna-rose/30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-luna-text-hint mb-2 font-body uppercase tracking-wider">
                    Durée du cycle <span className="text-luna-rose text-base font-display">{form.cycleLength}j</span>
                  </label>
                  <input
                    type="range" min={21} max={35}
                    value={form.cycleLength}
                    onChange={(e) => updateForm('cycleLength', Number(e.target.value))}
                    className="w-full"
                    style={{ accentColor: '#9B7FB8' }}
                  />
                  <div className="flex justify-between text-xs text-luna-text-hint font-body">
                    <span>21j</span><span>28j</span><span>35j</span>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-luna-text-hint mb-2 font-body uppercase tracking-wider">
                    Durée des règles <span className="text-luna-rose text-base font-display">{form.periodLength}j</span>
                  </label>
                  <input
                    type="range" min={2} max={8}
                    value={form.periodLength}
                    onChange={(e) => updateForm('periodLength', Number(e.target.value))}
                    className="w-full"
                    style={{ accentColor: '#9B7FB8' }}
                  />
                  <div className="flex justify-between text-xs text-luna-text-hint font-body">
                    <span>2j</span><span>5j</span><span>8j</span>
                  </div>
                </div>
                <p className="text-xs text-luna-text-hint font-body text-center italic">
                  Pas sûre ? On affinera ensemble.
                </p>
              </div>
            </motion.div>
          )}

          {/* Step 2: Alimentation + Sante */}
          {step === 2 && (
            <motion.div
              key="step2"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="bg-white rounded-[24px] p-8"
              style={{ boxShadow: '0 2px 20px rgba(45, 34, 38, 0.06)' }}
            >
              <div className="text-center mb-6">
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.2 }}
                  className="text-5xl block mb-4"
                >
                  🥑
                </motion.span>
                <h2 className="font-display text-2xl text-luna-text mb-2">
                  Ton alimentation & ta santé
                </h2>
                <p className="text-luna-text-muted font-body text-sm">
                  Pour adapter chaque conseil à toi.
                </p>
              </div>

              <div className="space-y-5">
                {/* Diet */}
                <div>
                  <label className="block text-xs font-semibold text-luna-text-hint mb-3 font-body uppercase tracking-wider">
                    Comment tu manges ?
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {dietOptions.map(({ id, icon }) => (
                      <motion.button
                        key={id}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => toggleArray('dietPreferences', id)}
                        className={`flex items-center gap-2 px-3.5 py-2.5 rounded-pill text-sm font-body font-semibold transition-all border-2 ${
                          form.dietPreferences.includes(id)
                            ? 'border-green-400 bg-green-50 text-green-700'
                            : 'border-gray-100 bg-white text-luna-text-muted hover:border-green-200'
                        }`}
                      >
                        <span className="text-base">{icon}</span>
                        {id}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Health */}
                <div>
                  <label className="block text-xs font-semibold text-luna-text-hint mb-2 font-body uppercase tracking-wider">
                    Une condition à connaître ? <span className="font-normal lowercase">(optionnel)</span>
                  </label>
                  <div className="space-y-2">
                    {healthOptions.map(({ id, icon, desc }) => (
                      <motion.button
                        key={id}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => toggleArray('healthIssues', id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-[16px] text-left transition-all border-2 ${
                          form.healthIssues.includes(id)
                            ? 'border-luna-lavender bg-luna-lavender/10'
                            : 'border-gray-100 bg-white hover:border-luna-lavender/30'
                        }`}
                      >
                        <span className="text-2xl flex-shrink-0">{icon}</span>
                        <div className="min-w-0">
                          <p className={`text-sm font-semibold font-body ${form.healthIssues.includes(id) ? 'text-luna-lavender-dark' : 'text-luna-text'}`}>{id}</p>
                          <p className="text-xs text-luna-text-muted font-body truncate">{desc}</p>
                        </div>
                        {form.healthIssues.includes(id) && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="ml-auto flex-shrink-0 w-5 h-5 rounded-full bg-luna-lavender flex items-center justify-center"
                          >
                            <Check size={12} className="text-white" />
                          </motion.div>
                        )}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Cuisine & Allergies */}
          {step === 3 && (
            <motion.div
              key="step3"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="bg-white rounded-[24px] p-8"
              style={{ boxShadow: '0 2px 20px rgba(45, 34, 38, 0.06)' }}
            >
              <div className="text-center mb-6">
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.2 }}
                  className="text-5xl block mb-4"
                >
                  👩‍🍳
                </motion.span>
                <h2 className="font-display text-2xl text-luna-text mb-2">
                  En cuisine
                </h2>
                <p className="text-luna-text-muted font-body text-sm">
                  Pour te proposer des recettes qui te correspondent.
                </p>
              </div>

              <div className="space-y-5">
                {/* Cooking level */}
                <div>
                  <label className="block text-xs font-semibold text-luna-text-hint mb-2 font-body uppercase tracking-wider">
                    Ton niveau en cuisine
                  </label>
                  <div className="space-y-2">
                    {cookingLevelOptions.map(({ id, label, desc, icon }) => (
                      <motion.button
                        key={id}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => updateForm('cookingLevel', id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-[16px] text-left transition-all border-2 ${
                          form.cookingLevel === id
                            ? 'border-orange-300 bg-orange-50'
                            : 'border-gray-100 bg-white hover:border-orange-200'
                        }`}
                      >
                        <span className="text-2xl">{icon}</span>
                        <div>
                          <p className="text-sm font-semibold text-luna-text font-body">{label}</p>
                          <p className="text-xs text-luna-text-muted font-body">{desc}</p>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Cooking time */}
                <div>
                  <label className="block text-xs font-semibold text-luna-text-hint mb-2 font-body uppercase tracking-wider">
                    Temps de cuisine idéal
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {cookingTimeOptions.map(({ id, label, desc, icon }) => (
                      <motion.button
                        key={id}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => updateForm('cookingTime', id)}
                        className={`flex flex-col items-center gap-1 px-3 py-3.5 rounded-[16px] text-center transition-all border-2 ${
                          form.cookingTime === id
                            ? 'border-orange-300 bg-orange-50'
                            : 'border-gray-100 bg-white hover:border-orange-200'
                        }`}
                      >
                        <span className="text-xl">{icon}</span>
                        <p className="text-sm font-semibold text-luna-text font-body">{label}</p>
                        <p className="text-[10px] text-luna-text-muted font-body">{desc}</p>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Allergies */}
                <div>
                  <label className="block text-xs font-semibold text-luna-text-hint mb-2 font-body uppercase tracking-wider">
                    Allergies alimentaires <span className="font-normal lowercase">(optionnel)</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {allergyOptions.map(({ id, icon }) => (
                      <motion.button
                        key={id}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => toggleArray('allergies', id)}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-pill text-xs font-body font-semibold transition-all border-2 ${
                          form.allergies.includes(id)
                            ? 'border-red-300 bg-red-50 text-red-700'
                            : 'border-gray-100 bg-white text-luna-text-muted hover:border-red-200'
                        }`}
                      >
                        <span className="text-sm">{icon}</span>
                        {id}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 4: Objectifs + Sport */}
          {step === 4 && (
            <motion.div
              key="step4"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="bg-white rounded-[24px] p-8"
              style={{ boxShadow: '0 2px 20px rgba(45, 34, 38, 0.06)' }}
            >
              <div className="text-center mb-6">
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.2 }}
                  className="text-5xl block mb-4"
                >
                  🎯
                </motion.span>
                <h2 className="font-display text-2xl text-luna-text mb-2">
                  Tes objectifs
                </h2>
                <p className="text-luna-text-muted font-body text-sm">
                  Qu'est-ce qui t'amène ici ?
                </p>
              </div>

              <div className="space-y-5">
                {/* Goals */}
                <div className="flex flex-wrap gap-2">
                  {goalOptions.map(({ id, label, icon }) => (
                    <motion.button
                      key={id}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleArray('goals', id)}
                      className={`flex items-center gap-2 px-3.5 py-2.5 rounded-pill text-sm font-body font-semibold transition-all border-2 ${
                        form.goals.includes(id)
                          ? 'border-orange-300 bg-orange-50 text-orange-700'
                          : 'border-gray-100 bg-white text-luna-text-muted hover:border-orange-200'
                      }`}
                    >
                      <span>{icon}</span>
                      {label}
                    </motion.button>
                  ))}
                </div>

                {/* Fitness level */}
                <div>
                  <label className="block text-xs font-semibold text-luna-text-hint mb-2 font-body uppercase tracking-wider">
                    Ton niveau sportif
                  </label>
                  <div className="space-y-2">
                    {fitnessLevels.map(({ id, label, desc, icon }) => (
                      <motion.button
                        key={id}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => updateForm('fitnessLevel', id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-[16px] text-left transition-all border-2 ${
                          form.fitnessLevel === id
                            ? 'border-orange-300 bg-orange-50'
                            : 'border-gray-100 bg-white hover:border-orange-200'
                        }`}
                      >
                        <span className="text-2xl">{icon}</span>
                        <div>
                          <p className="text-sm font-semibold text-luna-text font-body">{label}</p>
                          <p className="text-xs text-luna-text-muted font-body">{desc}</p>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 5: Recap personnalisé */}
          {step === 5 && (
            <motion.div
              key="step5"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="bg-white rounded-[24px] p-8 text-center"
              style={{ boxShadow: '0 2px 20px rgba(45, 34, 38, 0.06)' }}
            >
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2 }}
                className="text-5xl block mb-4"
              >
                ✨
              </motion.span>
              <h2 className="font-display text-2xl text-luna-text mb-2">
                {form.name}, tout est prêt
              </h2>
              <p className="text-luna-text-muted font-body text-sm mb-6">
                Voici ce que ton corps nous dit aujourd'hui.
              </p>

              {info ? (
                <>
                  {/* Phase card */}
                  <div className="rounded-[20px] p-5 mb-4 text-left" style={{ backgroundColor: PHASES[info.phase].bgColor }}>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-body text-luna-text-body">Phase actuelle</span>
                        <span className="text-sm font-semibold font-body flex items-center gap-1" style={{ color: PHASES[info.phase].colorDark }}>
                          {PHASES[info.phase].icon} {PHASES[info.phase].shortName} — Jour {info.currentDay}
                        </span>
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-body text-luna-text-body">Énergie estimée</span>
                          <span className="text-sm font-semibold font-body">{info.energyLevel}%</span>
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
                        <span className="text-sm font-body text-luna-text-body">Prochaines règles</span>
                        <span className="text-sm font-semibold font-body" style={{ color: PHASES[info.phase].colorDark }}>dans {info.daysUntilPeriod} jours</span>
                      </div>
                    </div>
                  </div>

                  {/* Personalized badges */}
                  <div className="flex flex-wrap justify-center gap-2 mb-4">
                    {form.dietPreferences.filter(d => d !== 'Omnivore').map((d) => (
                      <span key={d} className="text-xs font-body font-semibold px-3 py-1 rounded-pill bg-green-50 text-green-700 border border-green-200">
                        🌱 {d}
                      </span>
                    ))}
                    {form.healthIssues.map((h) => (
                      <span key={h} className="text-xs font-body font-semibold px-3 py-1 rounded-pill bg-purple-50 text-purple-700 border border-purple-200">
                        💜 {h}
                      </span>
                    ))}
                    {form.allergies.map((a) => (
                      <span key={a} className="text-xs font-body font-semibold px-3 py-1 rounded-pill bg-red-50 text-red-700 border border-red-200">
                        ⚠️ {a}
                      </span>
                    ))}
                    {form.cookingLevel && (
                      <span className="text-xs font-body font-semibold px-3 py-1 rounded-pill bg-orange-50 text-orange-700 border border-orange-200">
                        👩‍🍳 {cookingLevelOptions.find(o => o.id === form.cookingLevel)?.label || form.cookingLevel}
                      </span>
                    )}
                    {form.cookingTime && (
                      <span className="text-xs font-body font-semibold px-3 py-1 rounded-pill bg-orange-50 text-orange-700 border border-orange-200">
                        🕐 {cookingTimeOptions.find(o => o.id === form.cookingTime)?.label || form.cookingTime}
                      </span>
                    )}
                  </div>

                  {/* Personalized tip */}
                  <div
                    className="rounded-[16px] p-4 text-left"
                    style={{ backgroundColor: `${PHASES[info.phase].color}10` }}
                  >
                    <p className="text-sm font-body leading-relaxed" style={{ color: PHASES[info.phase].colorDark }}>
                      {getPersonalizedTip(form, info.phase)}
                    </p>
                  </div>
                </>
              ) : (
                <p className="text-sm text-luna-text-muted font-body italic">
                  Renseigne la date de tes dernières règles pour voir ton récap.
                </p>
              )}
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

          {step < 5 ? (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setStep((s) => s + 1)}
              disabled={!canNext()}
              className="btn-luna disabled:opacity-40"
            >
              {step === 0 ? `Enchantée ${form.name ? form.name : ''} !` : 'Continuer'}
              <ChevronRight size={16} />
            </motion.button>
          ) : (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                finish().then(() => navigate('/dashboard'));
              }}
              className="btn-luna"
            >
              Découvrir ma journée
              <ArrowRight size={16} />
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}
