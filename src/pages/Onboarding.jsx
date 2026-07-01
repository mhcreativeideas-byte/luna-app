import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Check, ArrowRight, Lock, Sparkles, ShieldCheck, UtensilsCrossed, Refrigerator, Feather, Sunrise, Sun, Moon, CalendarDays, Droplet } from 'lucide-react';
import { useCycle } from '../contexts/CycleContext';
import { PHASES, getPhaseForDay } from '../data/phases';
import { getCycleInfo } from '../contexts/CycleContext';

const PHASE_MOODS = {
  menstrual: 'Repos & douceur',
  follicular: 'Énergie qui remonte',
  ovulatory: 'Rayonnement',
  luteal: 'Cocooning',
};

// Écrans-miroir « problème → solution », semés entre les questions.
// fromStep = l'étape après laquelle le miroir apparaît (Continuer → miroir → étape suivante).
const MIRRORS = {
  hommefemme: {
    after: 0,
    bg: 'linear-gradient(180deg, #F3EEF8 0%, #FDE8EB 60%, #FAF7F5 100%)',
    accent: '#A85A66',
    visual: 'lines',
    titleMain: 'Ton cycle dure ~28 jours.\n',
    titleItalic: 'Pas 24 heures.',
    text: 'Les conseils nutrition classiques ignorent les hormones féminines. Ton métabolisme change chaque semaine, il mérite une approche pensée pour toi.',
  },
  volonte: {
    after: 8,
    bg: 'linear-gradient(180deg, #FDE8EB 0%, #FAF7F5 100%)',
    accent: '#A85A66',
    Icon: Feather,
    iconColor: '#C4727F',
    titleMain: 'Ce n\'est pas un manque de',
    titleItalic: 'volonté.',
    text: 'Tes envies de sucre avant les règles sont hormonales, la sérotonine chute. Pas un défaut. Les bons aliments les apaisent, sans te priver.',
  },
  cycle: {
    after: 1,
    bg: 'linear-gradient(180deg, #FDE8EB 0%, #FAF7F5 100%)',
    accent: '#A85A66',
    phaseImages: ['/phase-menstruelle.png', '/phase-folliculaire.png', '/phase-ovulatoire.png', '/phase-luteale.png'],
    titleMain: '4 phases,',
    titleItalic: '4 besoins.',
    text: 'Chaque phase a ses propres besoins. LUNA adapte ton alimentation, phase après phase.',
  },
  promise: {
    after: 3,
    bg: 'linear-gradient(180deg, #F3EEF8 0%, #FAF7F5 100%)',
    accent: '#7E6597',
    Icon: Sparkles,
    titleMain: 'Tes symptômes ont une',
    titleItalic: 'logique.',
    text: 'La plupart des femmes repèrent leur rythme dès le premier mois avec LUNA. On va te montrer le tien.',
  },
  menu: {
    after: 9,
    bg: 'linear-gradient(180deg, #FFF3EB 0%, #FAF7F5 100%)',
    accent: '#C2683F',
    icons: [UtensilsCrossed, Refrigerator],
    iconColor: '#D4846A',
    titleMain: 'Fini la',
    titleItalic: 'page blanche.',
    text: 'Ton menu du jour t\'attend chaque matin, adapté à ta phase. Et Mon Frigo cuisine avec ce que tu as déjà.',
  },
  filter: {
    after: 5,
    bg: 'linear-gradient(180deg, #EDF5ED 0%, #FAF7F5 100%)',
    accent: '#4E7A52',
    Icon: ShieldCheck,
    iconColor: '#4E7A52',
    titleMain: 'Zéro recette qui ne te\n',
    titleItalic: 'convient pas.',
    text: 'Végé, sans gluten, allergies… on filtre tout automatiquement. Tu ne vois que ce que tu peux manger.',
  },
};
import Paywall from '../components/Paywall';


const goalOptions = [
  { id: 'energy', label: 'Plus d\'énergie', icon: '⚡' },
  { id: 'emotions', label: 'Apaiser mes émotions', icon: '💛' },
  { id: 'discomfort', label: 'Moins de douleurs', icon: '🌸' },
  { id: 'skin', label: 'Belle peau', icon: '✨' },
  { id: 'digestion', label: 'Mieux digérer', icon: '🌿' },
  { id: 'cravings', label: 'Moins de fringales', icon: '🍫' },
  { id: 'balance', label: 'Rééquilibrer mon assiette', icon: '🥗' },
];

// Q « fringales/appétit selon le cycle » (nouveau — alimentaire + arme le miroir)
const cravingOptions = [
  { id: 'sucre', label: 'Envies de sucre', icon: '🍫' },
  { id: 'faim', label: 'Faim accrue', icon: '🍽️' },
  { id: 'ballonnements', label: 'Ballonnements', icon: '🎈' },
  { id: 'appetit', label: 'Perte d\'appétit', icon: '😶' },
  { id: 'grignotage', label: 'Grignotage émotionnel', icon: '🍪' },
  { id: 'rien', label: 'Rien de spécial', icon: '🌿' },
];

// Q « ton plus gros frein en cuisine » (nouveau — arme le miroir menu/frigo)
const barrierOptions = [
  { id: 'temps', label: 'Manque de temps', icon: '🕐' },
  { id: 'idees', label: 'Manque d\'idées', icon: '💡' },
  { id: 'quoi', label: 'Je sais jamais quoi manger', icon: '🤔' },
  { id: 'gaspillage', label: 'Je gaspille de la nourriture', icon: '🗑️' },
  { id: 'budget', label: 'Le budget', icon: '💸' },
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

const ageOptions = [
  { id: '18-24', label: '18-24 ans', icon: '🌱' },
  { id: '25-34', label: '25-34 ans', icon: '🌿' },
  { id: '35-44', label: '35-44 ans', icon: '🌺' },
  { id: '45+', label: '45 ans et +', icon: '✨' },
];

const discoveryOptions = [
  { id: 'instagram', label: 'Instagram', icon: '📸' },
  { id: 'tiktok', label: 'TikTok', icon: '🎵' },
  { id: 'bouche', label: 'Bouche-à-oreille', icon: '🗣️' },
  { id: 'recherche', label: 'Recherche web', icon: '🔍' },
  { id: 'pub', label: 'Publicité', icon: '📣' },
  { id: 'autre', label: 'Autre', icon: '✨' },
];


// Step backgrounds
const STEP_COLORS = [
  { bg: 'linear-gradient(180deg, #FDE8EB 0%, #FAF7F5 100%)', accent: '#C4727F' }, // 0 prénom — rose
  { bg: 'linear-gradient(180deg, #F3EEF8 0%, #FAF7F5 100%)', accent: '#9B7FB8' }, // 1 cycle — lavande
  { bg: 'linear-gradient(180deg, #E8F5E9 0%, #FAF7F5 100%)', accent: '#6B9E76' }, // 2 régime — vert
  { bg: 'linear-gradient(180deg, #F3EEF8 0%, #FAF7F5 100%)', accent: '#B09ACB' }, // 3 santé — lavande
  { bg: 'linear-gradient(180deg, #FFF3EB 0%, #FAF7F5 100%)', accent: '#D4846A' }, // 4 cuisine — pêche
  { bg: 'linear-gradient(180deg, #FDE8D8 0%, #FAF7F5 100%)', accent: '#E8946A' }, // 5 allergies — abricot
  { bg: 'linear-gradient(180deg, #FFF3EB 0%, #FAF7F5 100%)', accent: '#E8946A' }, // 6 objectifs — pêche
  null, // 7 récap — dynamique selon la phase
  { bg: 'linear-gradient(180deg, #FDE8EB 0%, #FAF7F5 100%)', accent: '#C4727F' }, // 8 fringales — rose
  { bg: 'linear-gradient(180deg, #FFF3EB 0%, #FAF7F5 100%)', accent: '#D4846A' }, // 9 frein — pêche
  { bg: 'linear-gradient(180deg, #F3EEF8 0%, #FAF7F5 100%)', accent: '#9B7FB8' }, // 10 découverte — lavande
];

// Ordre de visite des écrans (les ids = numéro de step). Les questions sont
// rangées pour armer les bons miroirs : fringales→santé→promesse, frein→menu.
const ORDER = [0, 1, 8, 3, 2, 5, 4, 9, 6, 10, 7];

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

// Conseil basé sur la question « fringales » (pour montrer qu'on en a tenu compte)
function getCravingTip(cravings) {
  if (!cravings || !cravings.length) return null;
  if (cravings.includes('sucre')) return 'Envies de sucre avant les règles ? On a les en-cas qui les apaisent — sans frustration.';
  if (cravings.includes('ballonnements')) return 'Ballonnements ? On met en avant les aliments qui aident à dégonfler.';
  if (cravings.includes('faim')) return 'Faim accrue ? Des recettes rassasiantes, pile au bon moment du cycle.';
  if (cravings.includes('grignotage')) return 'Grignotage émotionnel ? On t\'aide à le calmer en douceur.';
  if (cravings.includes('appetit')) return 'Moins d\'appétit pendant tes règles ? Des recettes légères et réconfortantes.';
  return null;
}

export default function Onboarding() {
  const navigate = useNavigate();
  const { dispatch, user, saveProfileToSupabase, onboardingComplete } = useCycle();

  useEffect(() => {
    if (onboardingComplete) {
      navigate('/dashboard', { replace: true });
    }
  }, [onboardingComplete, navigate]);

  const [step, setStep] = useState(0);
  const [showIntro, setShowIntro] = useState(true);
  const [mirror, setMirror] = useState(null);
  const [showPaywall, setShowPaywall] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [form, setForm] = useState({
    name: '',
    email: '',
    lastPeriodDate: '',
    cycleLength: 28,
    periodLength: 5,
    goals: [],
    cravings: [],
    barriers: [],
    dietPreferences: [],
    healthIssues: [],
    allergies: [],
    cookingLevel: '',
    cookingTime: '',
    age: '',
    discoverySource: '',
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

  const handleFinish = () => {
    finish().then(() => navigate('/dashboard'));
  };


  // Écran d'abonnement (après le récap, avant d'entrer dans l'app)
  if (showPaywall) {
    return <Paywall onSubscribe={handleFinish} onLater={handleFinish} />;
  }

  // Écran comparatif émotionnel — juste avant le paywall
  if (showComparison) {
        const comparisons = [
      { sans: "Tu t'emportes contre ton mec sans comprendre pourquoi", avec: "Tu sais que c'est ta phase, pas toi", emojiSans: '😢', emojiAvec: '🌙' },
      { sans: "Tu dévores du chocolat à 23h et tu t'en veux", avec: "Tes envies sont normales \u2014 et on les apaise", emojiSans: '🍫', emojiAvec: '🌿' },
      { sans: "Tu te réveilles déjà crevée certains matins", avec: "Tu sais quand ralentir (et pourquoi)", emojiSans: '💀', emojiAvec: '\u26a1' },
      { sans: "Tu gères boulot/maison avec un ventre en feu", avec: "Tu manges ce qui calme tes douleurs", emojiSans: '🤯', emojiAvec: '🌸' },
      { sans: "Tu te sens gonflée, rien ne te va", avec: "Tu dégonfles avec les bons aliments", emojiSans: '👖', emojiAvec: '\u2600\ufe0f' },
      { sans: "20h, t'as rien prévu, encore un Uber Eats", avec: "Ton menu t'attend, pr\u00eat chaque matin", emojiSans: '🥡', emojiAvec: '🍽\ufe0f' },
    ];

    return (
      <div
        className="h-[100dvh] overflow-y-auto bg-luna-bg px-5"
        style={{
          WebkitOverflowScrolling: 'touch',
          paddingTop: 'calc(env(safe-area-inset-top) + 2rem)',
          paddingBottom: 'calc(env(safe-area-inset-bottom) + 1.5rem)',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md mx-auto min-h-full flex flex-col"
        >
          {/* Titre */}
          <div className="text-center mb-6">
            <h1 className="font-display text-[24px] text-luna-text leading-tight">
              Aujourd'hui, tu subis.
            </h1>
            <p className="font-display text-[24px] leading-tight mt-1" style={{ color: '#C4727F', fontStyle: 'italic' }}>
              Demain, tu comprends.
            </p>
          </div>

          {/* Tableau comparatif */}
          <div className="rounded-[20px] overflow-hidden mb-6" style={{ boxShadow: '0 4px 24px rgba(45,34,38,0.08)' }}>
            {/* En-tête */}
            <div className="grid grid-cols-2">
              <div className="bg-gray-50 py-3 px-4">
                <p className="text-[11px] font-body font-bold text-luna-text-hint uppercase tracking-widest text-center">Sans LUNA</p>
              </div>
              <div className="py-3 px-4" style={{ backgroundColor: '#FDE8EB' }}>
                <p className="text-[11px] font-body font-bold uppercase tracking-widest text-center" style={{ color: '#A85A66' }}>Avec LUNA</p>
              </div>
            </div>

            {/* Lignes */}
            {comparisons.map((c, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.1 }}
                className="grid grid-cols-2 border-t border-gray-100"
              >
                <div className="bg-gray-50 px-4 py-3.5 flex items-start gap-2.5">
                  <span className="text-base flex-shrink-0 mt-0.5 grayscale opacity-60">{c.emojiSans}</span>
                  <p className="text-[13px] font-body text-luna-text-muted leading-snug">{c.sans}</p>
                </div>
                <div className="bg-white px-4 py-3.5 flex items-start gap-2.5" style={{ backgroundColor: '#FFFBFC' }}>
                  <span className="text-base flex-shrink-0 mt-0.5">{c.emojiAvec}</span>
                  <p className="text-[13px] font-body font-semibold text-luna-text leading-snug">{c.avec}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Phrase de clôture */}
          <p className="font-display text-lg text-center mb-6" style={{ color: '#A85A66', fontStyle: 'italic' }}>
            Et si tu arrêtais de te battre contre toi-même ?
          </p>

          <div className="flex-1" />

          {/* CTA */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowPaywall(true)}
            className="btn-luna w-full justify-center text-base py-4"
          >
            Découvrir LUNA
            <ArrowRight size={16} />
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // Manifeste d'ouverture — pose le ton dès la première seconde
  if (showIntro) {
    return (
      <div
        className="h-[100dvh] overflow-y-auto px-6 flex flex-col"
        style={{
          background: '#FAF7F5',
          paddingTop: 'calc(env(safe-area-inset-top) + 2.5rem)',
          paddingBottom: 'calc(env(safe-area-inset-bottom) + 1.5rem)',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        <div className="flex-1" />
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md mx-auto"
        >
          <img src="/logo-luna.png" alt="LUNA" className="h-[22px] w-auto mb-8" />
          <h1 className="font-display text-[26px] text-luna-text leading-[1.25]">
            {"C'est le début"}<br />{"d'un nouveau cycle."}<br /><em className="not-italic" style={{ fontStyle: 'italic', color: '#A85A66' }}>Le tien.</em>
          </h1>
          <p className="text-[15px] font-body text-luna-text-body mt-4 leading-relaxed max-w-[280px]">
            En quelques questions, LUNA va apprendre à te connaître pour s'adapter à toi. Rien qu'à toi.
          </p>
        </motion.div>
        <div className="flex-1" />
        <div className="w-full max-w-md mx-auto flex justify-center">
          <button
            onClick={() => setShowIntro(false)}
            className="btn-luna justify-center text-base px-12 py-3.5"
          >
            Commencer
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    );
  }

  // Écrans-miroir « problème → solution » (génériques) semés entre les questions
  if (mirror && MIRRORS[mirror]) {
    const m = MIRRORS[mirror];
    const MIcon = m.Icon;
    return (
      <div
        className="h-[100dvh] overflow-y-auto px-6 flex flex-col"
        style={{
          background: m.bg,
          paddingTop: 'calc(env(safe-area-inset-top) + 2.5rem)',
          paddingBottom: 'calc(env(safe-area-inset-bottom) + 1.5rem)',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        <div className="flex-1" />
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md mx-auto"
        >
          {m.visual === 'lines' ? (
            <svg viewBox="0 0 280 90" width="280" height="90" className="mb-6" role="img" aria-label="Hormones masculines stables vs hormones féminines cycliques">
              <text x="6" y="12" style={{ fontSize: '9px', fill: '#9A8A8E', fontFamily: 'DM Sans, sans-serif' }}>Hormones masculines</text>
              <motion.line
                x1="6" y1="28" x2="180" y2="28"
                stroke="#B8AAAD" strokeWidth="2.5" strokeLinecap="round"
                strokeDasharray="174"
                initial={{ strokeDashoffset: 174 }}
                animate={{ strokeDashoffset: 0 }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
              />
              <motion.text
                x="188" y="32"
                style={{ fontSize: '9px', fill: '#9A8A8E', fontFamily: 'DM Sans, sans-serif' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
              >~24h</motion.text>
              <text x="6" y="52" style={{ fontSize: '9px', fill: '#A85A66', fontFamily: 'DM Sans, sans-serif', fontWeight: 600 }}>Hormones féminines</text>
              <motion.path
                d="M6 72 Q 30 52, 55 72 T 105 72 T 155 72 T 180 72"
                fill="none" stroke="#C4727F" strokeWidth="3" strokeLinecap="round"
                strokeDasharray="200"
                initial={{ strokeDashoffset: 200 }}
                animate={{ strokeDashoffset: 0 }}
                transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1], delay: 0.6 }}
              />
              <motion.text
                x="188" y="76"
                style={{ fontSize: '9px', fill: '#A85A66', fontFamily: 'DM Sans, sans-serif', fontWeight: 600 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
              >~28 j</motion.text>
            </svg>
          ) : m.phaseImages ? (
            <div className="grid grid-cols-2 gap-3 mb-6">
              {[
                { src: '/phase-menstruelle.png', name: 'Menstruelle', days: 'Jours 1 \u00e0 5', mood: 'Repos', color: '#D4727F' },
                { src: '/phase-folliculaire.png', name: 'Folliculaire', days: 'Jours 6 \u00e0 13', mood: '\u00c9lan', color: '#7BAE7F' },
                { src: '/phase-ovulatoire.png', name: 'Ovulatoire', days: 'Jours 14 \u00e0 16', mood: '\u00c9clat', color: '#E8A87C' },
                { src: '/phase-luteale.png', name: 'Lut\u00e9ale', days: 'Jours 17 \u00e0 28', mood: 'Cocon', color: '#B09ACB' },
              ].map((p, i) => (
                <motion.div
                  key={p.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.15 + i * 0.1, type: 'spring' }}
                  className="flex flex-col items-center text-center py-2"
                >
                  <img src={p.src} alt={p.name} className="w-32 h-32 object-contain -mb-2" />
                  <p className="text-sm font-display font-semibold" style={{ color: p.color }}>{p.name}</p>
                  <p className="text-[10px] font-body text-luna-text-hint uppercase tracking-wider mt-0.5">{p.days}</p>
                  <p className="text-xs font-display italic mt-0.5" style={{ color: p.color }}>{p.mood}</p>
                </motion.div>
              ))}
            </div>
          ) : m.icons ? (
            <div className="flex gap-2.5 mb-6">
              {m.icons.map((Ic, i) => (
                <div key={i} className="w-12 h-12 rounded-[15px] bg-white flex items-center justify-center" style={{ boxShadow: '0 4px 14px rgba(45,34,38,0.06)' }}>
                  <Ic size={22} style={{ color: m.iconColor }} />
                </div>
              ))}
            </div>
          ) : MIcon ? (
            <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center mb-6" style={{ boxShadow: '0 4px 16px rgba(45,34,38,0.10)' }}>
              <MIcon size={26} style={{ color: m.iconColor || m.accent }} />
            </div>
          ) : null}
          <h1 className="font-display text-[24px] text-luna-text leading-[1.25] whitespace-pre-line">
            {m.titleMain} <em className="not-italic" style={{ fontStyle: 'italic', color: m.accent }}>{m.titleItalic}</em>
          </h1>
          <p className="text-[15px] font-body text-luna-text-body mt-4 leading-relaxed max-w-[280px]">
            {m.text}
          </p>
        </motion.div>
        <div className="flex-1" />
        <div className="w-full max-w-md mx-auto flex justify-center">
          <button
            onClick={() => { setStep(ORDER[ORDER.indexOf(m.after) + 1]); setMirror(null); }}
            className="btn-luna justify-center text-base px-12 py-3.5"
          >
            Continuer
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    );
  }

  const stepColor = STEP_COLORS[step];

  return (
    <div
      className="h-[100dvh] overflow-y-auto px-6 transition-all duration-500"
      style={{
        background: step === 7 ? (info ? `linear-gradient(180deg, ${PHASES[info.phase].bgColor} 0%, #FAF7F5 100%)` : '#FAF7F5') : (stepColor?.bg || '#FAF7F5'),
        WebkitOverflowScrolling: 'touch',
      }}
    >
      <div
        className="w-full max-w-md mx-auto min-h-full flex flex-col justify-center"
        style={{
          paddingTop: 'calc(env(safe-area-inset-top) + 2rem)',
          paddingBottom: 'calc(env(safe-area-inset-bottom) + 2rem)',
        }}
      >
        {/* Progress dots — suivent l'ordre de visite */}
        <div className="flex justify-center gap-2 mb-6">
          {ORDER.map((sid, i) => {
            const pos = ORDER.indexOf(step);
            const accent = step === 7 ? (info ? PHASES[info.phase].color : '#C4727F') : (stepColor?.accent || '#C4727F');
            return (
              <motion.div
                key={sid}
                animate={{
                  width: i === pos ? 24 : 8,
                  backgroundColor: i <= pos ? accent : '#E0D5D8',
                }}
                className="h-2 rounded-full"
                transition={{ duration: 0.3 }}
              />
            );
          })}
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
              className="bg-white rounded-[24px] p-6"
              style={{ boxShadow: '0 2px 20px rgba(45, 34, 38, 0.06)' }}
            >
              <div className="text-center mb-5">
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.2 }}
                  className="text-4xl block mb-3"
                >
                  👋
                </motion.span>
                <h2 className="font-display text-2xl text-luna-text mb-2">
                  Comment tu t'appelles ?
                </h2>
                <p className="text-luna-text-muted font-body text-sm">
                  Ton cycle est unique. Ton programme aussi.
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

              {/* Tranche d’âge */}
              <div className="mt-5">
                <label className="block text-xs font-semibold text-luna-text-hint mb-2.5 font-body uppercase tracking-wider text-center">
                  Ta tranche d’âge
                </label>
                <div className="flex flex-wrap justify-center gap-2">
                  {ageOptions.map(({ id, label, icon }) => (
                    <motion.button
                      key={id}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => updateForm('age', id)}
                      className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-pill text-sm font-body font-semibold transition-all border-2 ${
                        form.age === id
                          ? 'border-luna-rose bg-luna-rose-bg text-luna-rose-deep'
                          : 'border-gray-100 bg-white text-luna-text-muted'
                      }`}
                    >
                      <span className="text-sm">{icon}</span>
                      {label}
                    </motion.button>
                  ))}
                </div>
              </div>
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
              className="bg-white rounded-[24px] p-6 overflow-hidden"
              style={{ boxShadow: '0 2px 20px rgba(45, 34, 38, 0.06)' }}
            >
              <div className="text-center mb-5">
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.2 }}
                  className="text-4xl block mb-3"
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
                  <div
                    className="relative rounded-[16px] px-5 py-4 flex items-center gap-4 cursor-pointer"
                    style={{
                      border: form.lastPeriodDate ? '1.5px solid #C4727F' : '1.5px dashed #C4727F',
                      backgroundColor: form.lastPeriodDate ? '#FDE8EB' : 'transparent',
                    }}
                    onClick={() => document.getElementById('date-picker-hidden').showPicker?.() || document.getElementById('date-picker-hidden').focus()}
                  >
                    <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#FDE8EB' }}>
                      <CalendarDays size={20} style={{ color: '#C4727F' }} strokeWidth={1.8} />
                    </div>
                    <div className="flex-1 min-w-0">
                      {form.lastPeriodDate ? (
                        <span className="text-sm font-body font-semibold text-luna-text">
                          {new Date(form.lastPeriodDate + 'T12:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </span>
                      ) : (
                        <>
                          <p className="text-sm font-body font-semibold text-luna-text">Sélectionner la date</p>
                          <p className="text-xs font-body text-luna-text-muted mt-0.5">Touche ici pour ouvrir le calendrier</p>
                        </>
                      )}
                    </div>
                    <input
                      id="date-picker-hidden"
                      type="date"
                      value={form.lastPeriodDate}
                      onChange={(e) => updateForm('lastPeriodDate', e.target.value)}
                      className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                      style={{ WebkitAppearance: 'none' }}
                    />
                  </div>
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
                <div className="flex items-center justify-center gap-1.5 pt-1">
                  <Lock size={11} className="text-luna-text-hint flex-shrink-0" />
                  <p className="text-[11px] text-luna-text-hint font-body">Tes données restent privées · modifiable plus tard</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Régime alimentaire */}
          {step === 2 && (
            <motion.div
              key="step2"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="bg-white rounded-[24px] p-6"
              style={{ boxShadow: '0 2px 20px rgba(45, 34, 38, 0.06)' }}
            >
              <div className="text-center mb-5">
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.2 }}
                  className="text-4xl block mb-3"
                >
                  🥑
                </motion.span>
                <h2 className="font-display text-2xl text-luna-text mb-2">
                  Comment tu manges ?
                </h2>
                <p className="text-luna-text-muted font-body text-sm">
                  Pour adapter chaque recette à toi.
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-2.5">
                {dietOptions.map(({ id, icon }) => (
                  <motion.button
                    key={id}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleArray('dietPreferences', id)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-pill text-sm font-body font-semibold transition-all border-2 ${
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
            </motion.div>
          )}

          {/* Step 3: Santé */}
          {step === 3 && (
            <motion.div
              key="step3"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="bg-white rounded-[24px] p-6"
              style={{ boxShadow: '0 2px 20px rgba(45, 34, 38, 0.06)' }}
            >
              <div className="text-center mb-5">
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.2 }}
                  className="text-4xl block mb-3"
                >
                  🩺
                </motion.span>
                <h2 className="font-display text-2xl text-luna-text mb-2">
                  Une condition à connaître ?
                </h2>
                <p className="text-luna-text-muted font-body text-sm">
                  Optionnel — pour des conseils encore plus justes.
                </p>
              </div>
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
              <div className="flex items-center justify-center gap-1.5 mt-4">
                <Lock size={11} className="text-luna-text-hint flex-shrink-0" />
                <p className="text-[11px] text-luna-text-hint font-body">Confidentiel · ces infos restent entre nous</p>
              </div>
            </motion.div>
          )}

          {/* Step 4: En cuisine (niveau + temps) */}
          {step === 4 && (
            <motion.div
              key="step4"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="bg-white rounded-[24px] p-6"
              style={{ boxShadow: '0 2px 20px rgba(45, 34, 38, 0.06)' }}
            >
              <div className="text-center mb-5">
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.2 }}
                  className="text-4xl block mb-3"
                >
                  👩‍🍳
                </motion.span>
                <h2 className="font-display text-2xl text-luna-text mb-2">
                  En cuisine
                </h2>
                <p className="text-luna-text-muted font-body text-sm">
                  Pour des recettes qui te ressemblent.
                </p>
              </div>

              <div className="space-y-4">
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
                        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-[16px] text-left transition-all border-2 ${
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
                        className={`flex flex-col items-center gap-1 px-3 py-3 rounded-[16px] text-center transition-all border-2 ${
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
              </div>
            </motion.div>
          )}

          {/* Step 5: Allergies */}
          {step === 5 && (
            <motion.div
              key="step5"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="bg-white rounded-[24px] p-6"
              style={{ boxShadow: '0 2px 20px rgba(45, 34, 38, 0.06)' }}
            >
              <div className="text-center mb-5">
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.2 }}
                  className="text-4xl block mb-3"
                >
                  🥜
                </motion.span>
                <h2 className="font-display text-2xl text-luna-text mb-2">
                  Des allergies ?
                </h2>
                <p className="text-luna-text-muted font-body text-sm">
                  Optionnel — on écartera ces ingrédients de tes recettes.
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-2">
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
            </motion.div>
          )}

          {/* Step 6: Objectifs */}
          {step === 6 && (
            <motion.div
              key="step6"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="bg-white rounded-[24px] p-6"
              style={{ boxShadow: '0 2px 20px rgba(45, 34, 38, 0.06)' }}
            >
              <div className="text-center mb-5">
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.2 }}
                  className="text-4xl block mb-3"
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
                <div className="flex flex-wrap justify-center gap-2">
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
              </div>
            </motion.div>
          )}

          {/* Step 7: Recap personnalisé */}
          {step === 7 && (
            <motion.div
              key="step7"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              {info ? (() => {
                const ph = PHASES[info.phase];
                const C = 2 * Math.PI * 62;
                const segments = [
                  { start: 0, end: 0.18, color: '#D4727F' },
                  { start: 0.18, end: 0.46, color: '#7BAE7F' },
                  { start: 0.46, end: 0.57, color: '#E8A87C' },
                  { start: 0.57, end: 1, color: '#B09ACB' },
                ];
                const gap = 0.012;
                const menuByPhase = {
                  menstrual: ['Smoothie datte-cacao', 'Soupe lentilles corail', 'Risotto champignons'],
                  follicular: ['Porridge banane-cannelle', 'Bowl quinoa-avocat', 'Saumon-patate douce'],
                  ovulatory: ['Granola fruits frais', 'Salade poulet-mangue', 'Wok crevettes-légumes'],
                  luteal: ['Pancakes flocons avoine', 'Curry pois chiches', 'Gratin courgettes-chèvre'],
                };
                const menu = menuByPhase[info.phase] || menuByPhase.follicular;
                return (
                  <>
                    <h2 className="font-display text-[22px] text-luna-text mb-1">
                      {form.name}, tout est prêt <em className="not-italic" style={{ fontStyle: 'italic', color: ph.colorDark }}>pour toi.</em>
                    </h2>
                    <p className="text-[13px] font-body text-luna-text-muted mb-5">
                      Ton cycle, tes goûts, tes besoins : on a tout pris en compte.
                    </p>

                    {/* Cycle ring */}
                    <svg viewBox="0 0 160 160" className="w-[120px] h-[120px] mx-auto mb-5">
                      <circle cx="80" cy="80" r="62" fill="none" stroke="#E8D5D8" strokeWidth="12" opacity="0.2" />
                      {segments.map((s, i) => {
                        const ss = s.start + (i === 0 ? 0 : gap / 2);
                        const se = s.end - (i === segments.length - 1 ? 0 : gap / 2);
                        const len = (se - ss) * C;
                        const off = -(ss * C);
                        return (
                          <motion.circle
                            key={i}
                            cx="80" cy="80" r="62"
                            fill="none"
                            stroke={s.color}
                            strokeWidth="12"
                            strokeLinecap="round"
                            strokeDasharray={`${len} ${C - len}`}
                            transform="rotate(-90 80 80)"
                            initial={{ strokeDashoffset: off + len }}
                            animate={{ strokeDashoffset: off }}
                            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 + i * 0.1 }}
                          />
                        );
                      })}
                      <text x="80" y="68" textAnchor="middle" className="font-body text-[7px] uppercase" fill={ph.colorDark} opacity="0.7" letterSpacing="0.15em">Jour du cycle</text>
                      <text x="80" y="88" textAnchor="middle" className="font-display text-[24px] font-bold" fill={ph.colorDark}>{String(info.currentDay).padStart(2, '0')}</text>
                      <text x="80" y="100" textAnchor="middle" className="font-body text-[8px]" fill="#8A7B7F">sur {form.cycleLength} jours</text>
                    </svg>

                    {/* Stats */}
                    <div className="flex gap-2 mb-4">
                      <div className="flex-1 bg-white rounded-[14px] p-3 text-center" style={{ boxShadow: '0 2px 8px rgba(45,34,38,0.04)' }}>
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.5 }}
                          className="text-[20px] font-body font-semibold"
                          style={{ color: ph.colorDark }}
                        >
                          {info.energyLevel}%
                        </motion.p>
                        <p className="text-[11px] font-body text-luna-text-muted">Énergie</p>
                      </div>
                      <div className="flex-1 bg-white rounded-[14px] p-3 text-center" style={{ boxShadow: '0 2px 8px rgba(45,34,38,0.04)' }}>
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.6 }}
                          className="text-[20px] font-body font-semibold"
                          style={{ color: '#A85A66' }}
                        >
                          {info.daysUntilPeriod} j
                        </motion.p>
                        <p className="text-[11px] font-body text-luna-text-muted">Prochaines règles</p>
                      </div>
                    </div>

                    {/* Menu du jour */}
                    <div className="bg-white rounded-[14px] p-4 mb-4 text-left" style={{ boxShadow: '0 2px 8px rgba(45,34,38,0.04)' }}>
                      <p className="text-[11px] font-semibold font-body text-luna-text-hint uppercase tracking-wider mb-2">Ton menu du jour</p>
                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-[13px] font-body text-luna-text-body flex items-center gap-1.5"><Sunrise size={14} className="text-luna-text-hint" /> Matin</span>
                          <span className="text-[12px] font-body font-semibold" style={{ color: ph.colorDark }}>{menu[0]}</span>
                        </div>
                        <div className="h-px bg-luna-cream-card" />
                        <div className="flex justify-between items-center">
                          <span className="text-[13px] font-body text-luna-text-body flex items-center gap-1.5"><Sun size={14} className="text-luna-text-hint" /> Midi</span>
                          <span className="text-[12px] font-body font-semibold" style={{ color: ph.colorDark }}>{menu[1]}</span>
                        </div>
                        <div className="h-px bg-luna-cream-card" />
                        <div className="flex justify-between items-center">
                          <span className="text-[13px] font-body text-luna-text-body flex items-center gap-1.5"><Moon size={14} className="text-luna-text-hint" /> Soir</span>
                          <span className="text-[12px] font-body font-semibold" style={{ color: ph.colorDark }}>{menu[2]}</span>
                        </div>
                      </div>
                    </div>

                    {/* Badges */}
                    <div className="flex flex-wrap justify-center gap-1.5">
                      {form.goals.map((g) => {
                        const go = goalOptions.find((o) => o.id === g);
                        return go ? (
                          <span key={g} className="text-[11px] font-body font-semibold px-2.5 py-1 rounded-pill" style={{ backgroundColor: '#FDE8EB', color: '#A85A66' }}>
                            {go.icon} {go.label}
                          </span>
                        ) : null;
                      })}
                      {form.dietPreferences.filter(d => d !== 'Omnivore').map((d) => (
                        <span key={d} className="text-[11px] font-body font-semibold px-2.5 py-1 rounded-pill" style={{ backgroundColor: '#EDF5ED', color: '#4D7A50' }}>
                          🌱 {d}
                        </span>
                      ))}
                      {form.healthIssues.map((h) => (
                        <span key={h} className="text-[11px] font-body font-semibold px-2.5 py-1 rounded-pill" style={{ backgroundColor: '#F3EEF8', color: '#7D6A96' }}>
                          💜 {h}
                        </span>
                      ))}
                      {form.allergies.map((a) => (
                        <span key={a} className="text-[11px] font-body font-semibold px-2.5 py-1 rounded-pill" style={{ backgroundColor: '#FDE8EB', color: '#A85A66' }}>
                          ⚠️ {a}
                        </span>
                      ))}
                    </div>
                  </>
                );
              })() : (
                <p className="text-sm text-luna-text-muted font-body italic">
                  Renseigne la date de tes dernières règles pour voir ton récap.
                </p>
              )}
            </motion.div>
          )}

          {/* Step 8: Fringales / appétit selon le cycle */}
          {step === 8 && (
            <motion.div
              key="step8"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="bg-white rounded-[24px] p-6"
              style={{ boxShadow: '0 2px 20px rgba(45, 34, 38, 0.06)' }}
            >
              <div className="text-center mb-5">
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.2 }}
                  className="text-4xl block mb-3"
                >
                  🍫
                </motion.span>
                <h2 className="font-display text-2xl text-luna-text mb-2">
                  Côté assiette, tu ressens quoi ?
                </h2>
                <p className="text-luna-text-muted font-body text-sm">
                  Ce qui change selon ton cycle, pour mieux t'aider.
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-2.5">
                {cravingOptions.map(({ id, label, icon }) => (
                  <motion.button
                    key={id}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleArray('cravings', id)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-pill text-sm font-body font-semibold transition-all border-2 ${
                      form.cravings.includes(id)
                        ? 'border-luna-rose bg-luna-rose-bg text-luna-rose-deep'
                        : 'border-gray-100 bg-white text-luna-text-muted hover:border-luna-rose-light'
                    }`}
                  >
                    <span className="text-base">{icon}</span>
                    {label}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 9: Plus gros frein en cuisine */}
          {step === 9 && (
            <motion.div
              key="step9"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="bg-white rounded-[24px] p-6"
              style={{ boxShadow: '0 2px 20px rgba(45, 34, 38, 0.06)' }}
            >
              <div className="text-center mb-5">
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.2 }}
                  className="text-4xl block mb-3"
                >
                  🍳
                </motion.span>
                <h2 className="font-display text-2xl text-luna-text mb-2">
                  Ton plus gros frein en cuisine ?
                </h2>
                <p className="text-luna-text-muted font-body text-sm">
                  On va te faciliter la vie pile là-dessus.
                </p>
              </div>
              <div className="space-y-2.5">
                {barrierOptions.map(({ id, label, icon }) => (
                  <motion.button
                    key={id}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => toggleArray('barriers', id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-[16px] text-left transition-all border-2 ${
                      form.barriers.includes(id)
                        ? 'border-luna-rose bg-luna-rose-bg text-luna-rose-deep'
                        : 'border-gray-100 bg-white text-luna-text-muted hover:border-luna-rose-light'
                    }`}
                  >
                    <span className="text-xl">{icon}</span>
                    <span className="text-sm font-body font-semibold">{label}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 10: Comment nous as-tu trouvée ? */}
          {step === 10 && (
            <motion.div
              key="step10"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="bg-white rounded-[24px] p-6"
              style={{ boxShadow: '0 2px 20px rgba(45, 34, 38, 0.06)' }}
            >
              <div className="text-center mb-5">
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.2 }}
                  className="text-4xl block mb-3"
                >
                  💜
                </motion.span>
                <h2 className="font-display text-2xl text-luna-text mb-2">
                  Comment tu nous as trouvée ?
                </h2>
                <p className="text-luna-text-muted font-body text-sm">
                  Juste par curiosité, pour qu’on puisse aider d’autres femmes.
                </p>
              </div>
              <div className="space-y-2.5">
                {discoveryOptions.map(({ id, label, icon }) => (
                  <motion.button
                    key={id}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => updateForm('discoverySource', id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-[16px] text-left transition-all border-2 ${
                      form.discoverySource === id
                        ? 'border-luna-lavender bg-luna-lavender/10'
                        : 'border-gray-100 bg-white'
                    }`}
                  >
                    <span className="text-xl flex-shrink-0">{icon}</span>
                    <span className={`text-sm font-body font-semibold ${form.discoverySource === id ? 'text-luna-lavender-dark' : 'text-luna-text'}`}>{label}</span>
                    {form.discoverySource === id && (
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
            </motion.div>
          )}

        </AnimatePresence>

        {/* Navigation buttons */}
        <div className="flex justify-between mt-6">
          {ORDER.indexOf(step) > 0 ? (
            <button
              onClick={() => setStep(ORDER[ORDER.indexOf(step) - 1])}
              className="flex items-center gap-1 text-sm text-luna-text-muted hover:text-luna-text transition-colors font-body"
            >
              <ChevronLeft size={16} />
              Retour
            </button>
          ) : (
            <div />
          )}

          {step !== 7 ? (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                const mid = Object.keys(MIRRORS).find((k) => MIRRORS[k].after === step);
                if (mid) setMirror(mid);
                else setStep(ORDER[ORDER.indexOf(step) + 1]);
              }}
              disabled={!canNext()}
              className="btn-luna disabled:opacity-40"
            >
              {step === 0 ? `Enchantée ${form.name ? form.name : ''} !` : 'Continuer'}
              <ChevronRight size={16} />
            </motion.button>
          ) : (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowComparison(true)}
              className="btn-luna"
            >
              Continuer
              <ArrowRight size={16} />
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}
