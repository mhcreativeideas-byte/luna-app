import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Check, ArrowRight, Lock, ShieldCheck, UtensilsCrossed, Refrigerator, Sunrise, Sun, Moon, CalendarDays, Bell } from 'lucide-react';
import { Capacitor } from '@capacitor/core';
import { useCycle } from '../contexts/CycleContext';
import { PHASES } from '../data/phases';
import PhaseRing from '../components/cycle/PhaseRing';
import AnalysisScreen from '../components/onboarding/AnalysisScreen';
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
  // Les pauses « volonté » (après fringales) et « promesse » (après santé)
  // ont été retirées : la révélation personnalisée dit la même chose, en
  // mieux, avec SES réponses. Moins d'écrans = plus de momentum.
  cycle: {
    after: 1,
    bg: 'linear-gradient(180deg, #FDE8EB 0%, #FAF7F5 100%)',
    accent: '#A85A66',
    phaseImages: ['/phase-menstruelle.png', '/phase-folliculaire.png', '/phase-ovulatoire.png', '/phase-luteale.png'],
    titleMain: '4 phases,',
    titleItalic: '4 besoins.',
    text: 'Chaque phase a ses propres besoins. luna adapte ton alimentation, phase après phase.',
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

// ——— Écran révélation (le « moment aha ») ———
// Juste avant le paywall : on renvoie à l'utilisatrice SES réponses,
// décodées et datées. Signal principal = sa fringale déclarée (ou, à
// défaut, sa condition santé), + ce qu'elle vit dans sa phase actuelle.
// Les textes reprennent les explications déjà validées ailleurs dans
// l'app (chat, miroirs, page Nutrition) — pas de nouvelle allégation santé.
const CRAVING_SIGNALS = {
  sucre: {
    icon: '🍫',
    title: 'Tes envies de sucre',
    text: 'Quand la progestérone et la sérotonine chutent, surtout avant tes règles, ton corps réclame de l\'énergie rapide. C\'est hormonal, et ça s\'apaise dans l\'assiette, sans te priver.',
  },
  faim: {
    icon: '🍽️',
    title: 'Ta faim plus forte certains jours',
    text: 'En phase lutéale, ton métabolisme brûle davantage : avoir plus faim est physiologique. On nourrit, on ne restreint pas.',
  },
  ballonnements: {
    icon: '🎈',
    title: 'Tes ballonnements',
    text: 'La progestérone ralentit la digestion en deuxième partie de cycle. Les bons aliments t\'aident à dégonfler.',
  },
  appetit: {
    icon: '😶',
    title: 'Ton appétit en berne',
    text: 'Pendant les règles, c\'est courant. Des repas légers et riches en fer nourrissent sans peser.',
  },
  grignotage: {
    icon: '🍪',
    title: 'Ton grignotage émotionnel',
    text: 'Quand la sérotonine baisse, ton corps cherche du réconfort. On l\'apaise en douceur, jamais avec de la culpabilité.',
  },
};

const HEALTH_SIGNALS = {
  'SOPK': {
    icon: '💜',
    title: 'Ton SOPK',
    text: 'Tes recommandations sont déjà filtrées pour lui : index glycémique bas et anti-inflammatoires naturels.',
  },
  'Endométriose': {
    icon: '💜',
    title: 'Ton endométriose',
    text: 'On met en avant les aliments anti-inflammatoires et riches en oméga-3, à chaque phase.',
  },
  'SPM sévère': {
    icon: '💜',
    title: 'Ton SPM',
    text: 'Magnésium, B6 et calcium seront tes alliés, on les glisse dans tes menus au bon moment.',
  },
};

// Ce qu'elle vit probablement en ce moment, selon sa phase du jour.
// Aliments alignés sur la page Nutrition (aliments clés par phase).
const PHASE_NOW_SIGNALS = {
  menstrual: {
    icon: '🌙',
    title: 'Ton énergie au plus bas',
    text: 'Normal : tes hormones sont au plancher pendant les règles. Tes alliés du moment : lentilles, épinards, chocolat noir.',
  },
  follicular: {
    icon: '🌿',
    title: 'Ton énergie qui remonte',
    text: 'L\'œstrogène grimpe de jour en jour, ton corps construit. Tes alliés du moment : œufs, brocoli, agrumes.',
  },
  ovulatory: {
    icon: '☀️',
    title: 'Ton pic de forme',
    text: 'Tu es au sommet hormonal de ton cycle. Tes alliés du moment : légumes colorés, baies, saumon.',
  },
  luteal: {
    icon: '🍂',
    title: 'Ta fatigue de fin de journée',
    text: 'Classique en phase lutéale : la progestérone apaise… et fatigue. Tes alliés du moment : chocolat noir, amandes, patate douce.',
  },
};


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
// rangées pour armer les bons miroirs : fringales→santé, frein→menu.
// La question « découverte » (ex-step 10) vit désormais sur l'écran prénom.
// Le récap (7) arrive APRÈS l'analyse et la révélation, juste avant le paywall.
const ORDER = [0, 1, 8, 3, 2, 5, 4, 9, 6, 7];

export default function Onboarding() {
  const navigate = useNavigate();
  const { dispatch, user, saveProfileToSupabase, onboardingComplete } = useCycle();

  useEffect(() => {
    if (onboardingComplete) {
      navigate('/aujourdhui', { replace: true });
    }
  }, [onboardingComplete, navigate]);

  const [step, setStep] = useState(0);
  const [showIntro, setShowIntro] = useState(true);
  const [mirror, setMirror] = useState(null);
  const [showPaywall, setShowPaywall] = useState(false);
  const [showRevelation, setShowRevelation] = useState(false);
  const [showNotifPrimer, setShowNotifPrimer] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
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

  // Enregistre le profil et termine — instantané : le temps « d'analyse »
  // vit désormais AVANT la révélation (startAnalysis), pas après le paywall.
  const finish = async () => {
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
  };

  // Faux temps d'analyse après la dernière question : crée l'attente juste
  // avant la révélation personnalisée (le moment où il a le plus de valeur).
  // ~4,3 s = l'anneau se remplit (3,2 s) + une pause pour lire les réponses.
  const startAnalysis = async () => {
    setAnalyzing(true);
    await new Promise((r) => setTimeout(r, 4300));
    setAnalyzing(false);
    if (form.lastPeriodDate) setShowRevelation(true);
    else setStep(7);
  };

  const info = form.lastPeriodDate
    ? getCycleInfo(form.lastPeriodDate, form.cycleLength, form.periodLength)
    : null;

  const slideVariants = {
    enter: { x: 80, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: -80, opacity: 0 },
  };

  // Écran d'analyse — anneau signature qui se remplit + les vraies réponses
  // qui s'allument une par une (mix A+B validé). Les puces reprennent SES
  // réponses pour l'effet « l'app m'a vraiment écoutée ».
  if (analyzing) {
    const chips = [];
    chips.push({ icon: '🌙', label: `Cycle de ${form.cycleLength} jours` });
    const craving = (form.cravings || []).find((c) => c !== 'rien');
    const co = craving && cravingOptions.find((o) => o.id === craving);
    if (co) chips.push({ icon: co.icon, label: co.label });
    const diet = (form.dietPreferences || []).find((d) => d && d !== 'Omnivore');
    if (diet) chips.push({ icon: dietOptions.find((o) => o.id === diet)?.icon || '🍽️', label: diet });
    const health = (form.healthIssues || [])[0];
    if (health) chips.push({ icon: healthOptions.find((o) => o.id === health)?.icon || '💜', label: health });
    if ((form.goals || []).length) chips.push({ icon: '🎯', label: `Tes ${form.goals.length} objectif${form.goals.length > 1 ? 's' : ''}` });
    return <AnalysisScreen name={form.name} chips={chips.slice(0, 4)} />;
  }

  const handleFinish = () => {
    finish().then(() => navigate('/aujourdhui'));
  };


  // Après le paywall (natif) : proposer les rappels doux avant d'entrer
  // dans l'app. La pop-up iOS ne part que sur le geste « Activer ».
  const handlePaywallDone = () => {
    if (Capacitor.isNativePlatform()) setShowNotifPrimer(true);
    else handleFinish();
  };

  const activateNotifs = async () => {
    try {
      const { requestNotifPermission } = await import('../lib/notifications');
      // Garde-fou : si la popup système ne répond pas sous 10 s, on continue
      // quand même — ce bouton ne peut jamais rester bloqué. La permission
      // reste redemandable depuis les Paramètres.
      await Promise.race([
        requestNotifPermission(),
        new Promise((r) => setTimeout(r, 10000)),
      ]);
    } catch { /* la permission pourra être redemandée depuis les Paramètres */ }
    handleFinish();
  };

  // Écran d'explication des rappels — affiché après le paywall (natif)
  if (showNotifPrimer) {
    const previews = [
      { icon: '🌿', text: 'Nouvelle phase : folliculaire, ton énergie remonte.' },
      { icon: '🌙', text: 'Tes règles approchent : magnésium et douceur au menu.' },
      { icon: '🍽️', text: 'Ton menu du jour est prêt, pensé pour ta phase.' },
    ];
    return (
      <div
        className="h-[100dvh] overflow-y-auto bg-luna-bg px-6 flex flex-col"
        style={{
          WebkitOverflowScrolling: 'touch',
          paddingTop: 'calc(env(safe-area-inset-top) + 2.5rem)',
          paddingBottom: 'calc(env(safe-area-inset-bottom) + 1.5rem)',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md mx-auto min-h-full flex flex-col"
        >
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-[18px] flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#FDE8EB' }}>
              <Bell size={26} style={{ color: '#C4727F' }} />
            </div>
            <h1 className="font-display text-[26px] text-luna-text leading-tight">
              Tes rappels <em className="not-italic" style={{ fontStyle: 'italic', color: '#A85A66' }}>doux</em>
            </h1>
            <p className="text-sm font-body text-luna-text-muted mt-2 px-2">
              On vient de te donner des dates, tes rappels les tiendront. Jamais plus d'une fois par jour, jamais la nuit.
            </p>
          </div>

          <div className="space-y-2.5 mb-6">
            {previews.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.12 }}
                className="bg-white rounded-[16px] px-4 py-3 flex items-center gap-3"
                style={{ boxShadow: '0 2px 12px rgba(45,34,38,0.05)' }}
              >
                <span className="text-xl flex-shrink-0">{p.icon}</span>
                <p className="text-[13px] font-body text-luna-text-body leading-snug">{p.text}</p>
              </motion.div>
            ))}
          </div>

          <p className="text-[12px] font-body text-luna-text-hint text-center px-4">
            Chaque rappel est désactivable dans les Paramètres. Zéro pression, promis.
          </p>

          <div className="flex-1" />

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={activateNotifs}
            className="btn-luna w-full justify-center text-base py-4"
          >
            Activer mes rappels
            <ArrowRight size={16} />
          </motion.button>
          <button
            onClick={handleFinish}
            className="w-full text-center text-sm font-body font-semibold text-luna-text-muted mt-4 py-2"
          >
            Plus tard
          </button>
        </motion.div>
      </div>
    );
  }

  // Écran d'abonnement (après le récap, avant d'entrer dans l'app)
  if (showPaywall) {
    return <Paywall onSubscribe={handlePaywallDone} onLater={handlePaywallDone} />;
  }

  // Écran révélation — le « moment aha », juste avant le paywall :
  // on décode SES réponses (fringales, santé) et on date ses prochaines
  // étapes de cycle. La prédiction sera tenue par les notifications.
  if (showRevelation && info) {
    const ph = PHASES[info.phase];

    // Signal principal : sa fringale déclarée, sinon sa condition santé.
    const cravingId = (form.cravings || []).find((c) => CRAVING_SIGNALS[c]);
    const healthId = (form.healthIssues || []).find((h) => HEALTH_SIGNALS[h]);
    const mainSignal = cravingId ? CRAVING_SIGNALS[cravingId] : (healthId ? HEALTH_SIGNALS[healthId] : null);
    const phaseSignal = PHASE_NOW_SIGNALS[info.phase];

    // Dates réelles, calculées depuis son cycle (jamais de date passée).
    const fmtIn = (days) => {
      const d = new Date();
      d.setDate(d.getDate() + Math.max(0, days));
      return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' });
    };
    const predictionsByPhase = {
      menstrual: [
        `Vers le ${fmtIn(form.periodLength - info.currentDay + 1)}, ton énergie va remonter, tes assiettes revitalisantes seront prêtes.`,
        `Et autour du ${fmtIn(info.ovulationDay - 1 - info.currentDay)}, tu atteindras ton pic de forme. Tu verras.`,
      ],
      follicular: [
        `Ton pic d'énergie arrivera vers le ${fmtIn(info.ovulationDay - 1 - info.currentDay)}, on te proposera des assiettes légères et colorées.`,
        `Tes prochaines règles sont attendues vers le ${fmtIn(info.daysUntilPeriod)} : on les anticipera ensemble. Tu verras.`,
      ],
      ovulatory: [
        `Vers le ${fmtIn(info.ovulationDay + 2 - info.currentDay)}, ton corps ralentira doucement, on adaptera tes assiettes pour t'apaiser.`,
        `Tes prochaines règles sont attendues vers le ${fmtIn(info.daysUntilPeriod)}. Tu verras.`,
      ],
      luteal: [
        `Tes règles arriveront vers le ${fmtIn(info.daysUntilPeriod)}, tes recettes riches en fer seront prêtes.`,
        `Et vers le ${fmtIn(info.daysUntilPeriod + form.periodLength)}, ton énergie remontera. Tu verras.`,
      ],
    };
    const predictions = predictionsByPhase[info.phase];

    return (
      <div
        className="h-[100dvh] overflow-y-auto px-5"
        style={{
          WebkitOverflowScrolling: 'touch',
          background: `linear-gradient(180deg, ${ph.bgColor} 0%, #FAF7F5 45%)`,
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
          {/* Badge phase */}
          <p className="text-[11px] font-body font-bold uppercase tracking-widest text-center mb-2" style={{ color: ph.colorDark }}>
            Jour {info.currentDay} · {ph.name}
          </p>

          {/* Titre */}
          <div className="text-center mb-6">
            <h1 className="font-display text-[24px] text-luna-text leading-tight">
              {form.name}, ton corps t'envoie des signaux.
            </h1>
            <p className="font-display text-[24px] leading-tight mt-1" style={{ color: ph.colorDark, fontStyle: 'italic' }}>
              luna les a décodés.
            </p>
          </div>

          {/* Signal principal (fringale ou santé) */}
          {mainSignal && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="bg-white rounded-[20px] px-5 py-4 mb-3"
              style={{ boxShadow: '0 4px 18px rgba(45,34,38,0.06)' }}
            >
              <p className="text-[14px] font-body font-bold text-luna-text mb-1">
                <span className="mr-1.5">{mainSignal.icon}</span>{mainSignal.title}
              </p>
              <p className="text-[13px] font-body text-luna-text-body leading-relaxed">{mainSignal.text}</p>
            </motion.div>
          )}

          {/* Ce qu'elle vit en ce moment (phase) */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="bg-white rounded-[20px] px-5 py-4 mb-3"
            style={{ boxShadow: '0 4px 18px rgba(45,34,38,0.06)' }}
          >
            <p className="text-[14px] font-body font-bold text-luna-text mb-1">
              <span className="mr-1.5">{phaseSignal.icon}</span>{phaseSignal.title}
            </p>
            <p className="text-[13px] font-body text-luna-text-body leading-relaxed">{phaseSignal.text}</p>
          </motion.div>

          {/* Prédictions datées */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65 }}
            className="rounded-[20px] px-5 py-4 mb-6"
            style={{ backgroundColor: ph.bgColor }}
          >
            <p className="text-[14px] font-body font-bold mb-1" style={{ color: ph.colorDark }}>
              <CalendarDays size={15} className="inline mr-1.5 -mt-0.5" />Et voici ce qui t'attend
            </p>
            <p className="text-[13px] font-body leading-relaxed" style={{ color: ph.colorDark }}>
              {predictions[0]}
            </p>
            <p className="text-[13px] font-body leading-relaxed mt-1.5" style={{ color: ph.colorDark }}>
              {predictions[1]}
            </p>
          </motion.div>

          <div className="flex-1" />

          {/* CTA — vers le récap « tout est prêt », puis le paywall */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => { setShowRevelation(false); setStep(7); }}
            className="btn-luna w-full justify-center text-base py-4"
          >
            Découvrir mon programme
            <ArrowRight size={16} />
          </motion.button>
          <p className="text-[11px] font-body text-luna-text-hint text-center mt-2.5">
            Basé sur tes réponses · modifiable à tout moment
          </p>
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
          <img src="/logo-luna.svg" alt="luna" className="h-[22px] w-auto mb-8" />
          <h1 className="font-display text-[26px] text-luna-text leading-[1.25]">
            {"C'est le début"}<br />{"d'un nouveau cycle."}<br /><em className="not-italic" style={{ fontStyle: 'italic', color: '#A85A66' }}>Le tien.</em>
          </h1>
          <p className="text-[15px] font-body text-luna-text-body mt-4 leading-relaxed max-w-[280px]">
            En quelques questions, luna va apprendre à te connaître pour s'adapter à toi. Rien qu'à toi.
          </p>
        </motion.div>
        <div className="flex-1" />
        <div className="w-full max-w-md mx-auto">
          <button
            onClick={() => setShowIntro(false)}
            className="btn-luna w-full justify-center text-base py-4"
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
            <div className="grid grid-cols-2 gap-3 mb-6 w-full">
              {[
                { key: 'menstrual', name: 'Menstruelle', days: 'Jours 1 \u00e0 5', mood: 'Repos' },
                { key: 'follicular', name: 'Folliculaire', days: 'Jours 6 \u00e0 12', mood: '\u00c9lan' },
                { key: 'ovulatory', name: 'Ovulatoire', days: 'Jours 13 \u00e0 15', mood: '\u00c9clat' },
                { key: 'luteal', name: 'Lut\u00e9ale', days: 'Jours 16 \u00e0 28', mood: 'Cocon' },
              ].map((p, i) => {
                const pd = PHASES[p.key];
                return (
                  <motion.div
                    key={p.key}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 + i * 0.08 }}
                    className="rounded-[22px] px-3 py-5 text-center"
                    style={{ backgroundColor: pd.bgColor }}
                  >
                    <div className="mb-3">
                      <PhaseRing phase={p.key} size={64} />
                    </div>
                    <h3 className="font-display text-base leading-tight" style={{ color: pd.colorDark }}>
                      {p.name}
                    </h3>
                    <p className="text-[10px] font-body font-bold uppercase tracking-widest mt-1" style={{ color: pd.color }}>
                      {p.days}
                    </p>
                    <span
                      className="inline-block mt-2.5 px-3 py-1 rounded-pill text-[11px] font-body font-semibold text-white"
                      style={{ backgroundColor: pd.color }}
                    >
                      {p.mood}
                    </span>
                  </motion.div>
                );
              })}
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
            className="btn-luna w-full justify-center text-base py-4"
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
        {/* Retour (en haut à gauche, place fixe) + progress dots */}
        <div className="relative mb-6" style={{ minHeight: 44 }}>
          {ORDER.indexOf(step) > 0 && step !== 7 && (
            <button
              onClick={() => setStep(ORDER[ORDER.indexOf(step) - 1])}
              aria-label="Retour"
              className="absolute left-0 top-1/2 -translate-y-1/2 w-11 h-11 -ml-2 rounded-full flex items-center justify-center text-luna-text-muted active:scale-95 transition-transform"
            >
              <ChevronLeft size={22} />
            </button>
          )}
          <div className="flex justify-center gap-2 h-full items-center" style={{ minHeight: 44 }}>
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

              {/* Canal de découverte (ex-écran dédié, remonté ici : question
                  marketing, elle ne doit pas casser le momentum de la fin) */}
              <div className="mt-5">
                <label className="block text-xs font-semibold text-luna-text-hint mb-2.5 font-body uppercase tracking-wider text-center">
                  Comment tu nous as connues&#8239;?
                </label>
                <div className="flex flex-wrap justify-center gap-2">
                  {discoveryOptions.map(({ id, label, icon }) => (
                    <motion.button
                      key={id}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => updateForm('discoverySource', id)}
                      className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-pill text-sm font-body font-semibold transition-all border-2 ${
                        form.discoverySource === id
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
                      max={new Date().toLocaleDateString('fr-CA')}
                      onChange={(e) => {
                        // Une date de règles dans le futur n'a pas de sens et
                        // fausserait le calcul de phase : on plafonne à aujourd'hui
                        // (max ci-dessus n'est pas garanti par tous les claviers).
                        const v = e.target.value;
                        const today = new Date().toLocaleDateString('fr-CA');
                        updateForm('lastPeriodDate', v && v > today ? today : v);
                      }}
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
                  Optionnel : pour des conseils encore plus justes.
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
                  Optionnel : on écartera ces ingrédients de tes recettes.
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
                          <span className="text-[13px] font-body text-luna-text-body flex items-center gap-1.5"><Sunrise size={14} className="text-luna-text-hint" /> Petit-déj</span>
                          <span className="text-[12px] font-body font-semibold" style={{ color: ph.colorDark }}>{menu[0]}</span>
                        </div>
                        <div className="h-px bg-luna-cream-card" />
                        <div className="flex justify-between items-center">
                          <span className="text-[13px] font-body text-luna-text-body flex items-center gap-1.5"><Sun size={14} className="text-luna-text-hint" /> Déjeuner</span>
                          <span className="text-[12px] font-body font-semibold" style={{ color: ph.colorDark }}>{menu[1]}</span>
                        </div>
                        <div className="h-px bg-luna-cream-card" />
                        <div className="flex justify-between items-center">
                          <span className="text-[13px] font-body text-luna-text-body flex items-center gap-1.5"><Moon size={14} className="text-luna-text-hint" /> Dîner</span>
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

        </AnimatePresence>

        {/* Bouton principal — pleine largeur, toujours en bas, même place partout */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            if (step === 7) { setShowPaywall(true); return; }
            const mid = Object.keys(MIRRORS).find((k) => MIRRORS[k].after === step);
            if (mid) setMirror(mid);
            else if (ORDER[ORDER.indexOf(step) + 1] === 7) startAnalysis();
            else setStep(ORDER[ORDER.indexOf(step) + 1]);
          }}
          disabled={!canNext()}
          className="btn-luna w-full justify-center text-base py-4 mt-6 disabled:opacity-40"
        >
          {step === 0 ? `Enchantée ${form.name ? form.name : ''} !` : 'Continuer'}
          <ArrowRight size={16} />
        </motion.button>
      </div>
    </div>
  );
}
