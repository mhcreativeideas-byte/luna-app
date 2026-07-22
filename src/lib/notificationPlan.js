// ============================================================
// luna — Plan de notifications locales (pack lancement, 7 types)
// ============================================================
// Ce module est PUR (aucune API native) : il calcule, à partir du
// profil, la liste des notifications à programmer. La couche native
// (notifications.js) se contente de programmer ce plan.
//
// Garde-fous appliqués ici :
// - Maximum 1 notification « proactive » par jour (cycle > semaine
//   douceur > menu). Le rappel de check-in est à part : il ne part
//   que si le check-in du jour n'est pas fait (annulé sinon).
// - Jamais la nuit : tous les horaires sont entre 9 h et 20 h 30.
// - Chaque type est désactivable individuellement (prefs).
// ============================================================

import { getOvulationDay } from '../data/phases';

// Identifiants stables par type (pour annuler/reprogrammer proprement).
export const NOTIF_IDS = {
  phase: 1000, // +i
  rules: 2000,
  day1: 2100,
  late: 2200, // +i — relances douces en cas de retard (J+3, J+7)
  peak: 2300, // +k — veille du pic de forme (19 h, veille de l'ovulatoire)
  menu: 3000, // +i
  checkin: 4000, // +i
  softweek: 5000,
  comeback: 6000,
  batch: 7000, // +i — batch cooking du dimanche
  allies: 7100, // +i — aliments alliés (2 j après chaque changement de phase)
};

export const DEFAULT_NOTIF_PREFS = {
  phase: true, // changement de phase
  rules: true, // règles qui approchent (J-2)
  day1: true, // confirmation du jour 1
  peak: true, // veille du pic de forme
  menu: true, // menu du jour
  checkin: true, // check-in du soir (seulement si l'app n'a pas été ouverte)
  softweek: true, // semaine douceur (SPM/fringales)
  comeback: true, // retrouvailles (7 j sans ouvrir)
  batch: true, // batch cooking du dimanche
  allies: true, // aliments alliés de la phase
};

// Types de rappels personnalisables (écran Paramètres → « Personnaliser les
// messages ») : clé = celle de notifCustomTexts, sample = le texte luna
// affiché en exemple. Un message personnalisé remplace tout le texte.
export const NOTIF_TEXT_TYPES = [
  { key: 'rules', label: 'Règles qui approchent', sample: 'Tes règles approchent 🌙' },
  { key: 'day1', label: 'Confirmation du jour 1', sample: 'Tes règles ont commencé ?' },
  { key: 'late', label: 'Relance en cas de retard', sample: 'Ton cycle prend son temps 🌙' },
  { key: 'phase', label: 'Changement de phase', sample: 'Nouvelle phase : folliculaire 🌿' },
  { key: 'peak', label: 'Veille du pic de forme', sample: 'Demain, ton pic de forme ☀️' },
  { key: 'menu', label: 'Menu du jour', sample: 'Ton menu du jour est prêt 🍽️' },
  { key: 'checkin', label: 'Check-in du soir', sample: 'Comment tu te sens ce soir ?' },
  { key: 'softweek', label: 'Semaine douceur', sample: 'Ta semaine douceur commence 💛' },
  { key: 'comeback', label: 'Retrouvailles', sample: 'On garde ta place au chaud 🌙' },
  { key: 'batch', label: 'Batch cooking du dimanche', sample: 'Envie de souffler cette semaine ? 🍳' },
  { key: 'allies', label: 'Tes aliments alliés', sample: 'Tes aliments du moment 🥑' },
];

// Horizon de programmation : iOS limite à 64 notifications en attente.
const MENU_DAYS = 10; // menus du jour programmés à l'avance
const CHECKIN_DAYS = 10; // rappels de check-in programmés à l'avance

// Textes v2 (validés par Margaux le 2026-07-22, après étude concurrentielle) :
// émotion problème → solution, jamais culpabilisant, voix « on » (luna n'est
// PAS une personne), corps ≤ ~115 caractères (troncature iOS).
const PHASE_CHANGE_TEXTS = {
  follicular: {
    title: 'Nouvelle phase : folliculaire 🌿',
    body: 'Fini le mode survie des règles. Ton énergie revient : on te dit quoi manger pour la faire durer.',
  },
  ovulatory: {
    title: 'Nouvelle phase : ovulatoire ☀️',
    body: 'Tes 3 meilleurs jours du mois : énergie au sommet, tête claire. Ton assiette suit le rythme.',
  },
  luteal: {
    title: 'Nouvelle phase : lutéale 🍂',
    body: 'Fatigue qui tombe d\'un coup, envies de sucre, moral fragile ? C\'est la lutéale. On adoucit tout ça dans l\'assiette.',
  },
};

// Menu du jour : 4 variantes par phase, en rotation jour après jour (l'usure
// d'un texte répété est prouvée — étude Duolingo KDD 2020). Le prénom
// n'apparaît que dans 1 variante sur 4 (le contexte prime sur le prénom).
// La 4e est la « punchline » : très courte, complice, elle tranche avec les
// autres (levier de la surprise, façon Stardust). En menstruelle elle reste
// douce : jamais d'humour un jour de douleur.
const MENU_VARIANTS = {
  menstrual: [
    () => 'Pas la force de réfléchir aux repas aujourd\'hui ? On a choisi pour toi : fer et réconfort au menu.',
    () => 'Les règles vident tes réserves de fer. Ton menu du jour les remplit, sans effort de ta part.',
    (name) => `Crampes et coup de mou ? Ton assiette peut les adoucir${name ? `, ${name}` : ''}. Ouvre ton menu du jour.`,
    () => 'Ce soir : plaid, curry doux, zéro vaisselle compliquée.',
  ],
  follicular: [
    () => 'La question « on mange quoi ? » est déjà réglée pour aujourd\'hui : ton menu folliculaire est prêt.',
    () => 'Ton corps reconstruit ses réserves cette semaine : ton menu sait exactement quoi lui apporter.',
    (name) => `L'énergie revient${name ? `, ${name}` : ''}. Ton menu du jour est calé pour la faire monter encore.`,
    () => 'Ça repart. Ton menu aussi. 🌿',
  ],
  ovulatory: [
    () => 'Un repas lourd gâcherait ta meilleure forme du mois. Ton menu léger et coloré t\'attend.',
    () => 'Journée chargée ? Ton menu du jour fait vite, bon et léger : rien à décider, tout est prêt.',
    (name) => `Énergie au sommet${name ? `, ${name}` : ''} : ton menu est calibré pour la garder jusqu'au soir.`,
    () => 'Éclat maximal. Menu assorti. ☀️',
  ],
  luteal: [
    () => 'Les envies de sucre débarquent sans prévenir ces jours-ci. Ton menu les calme sans frustration.',
    () => 'Fatiguée dès le matin ? Ton assiette peut changer ta journée : ton menu lutéal est prêt.',
    (name) => `Du réconfort sans culpabilité${name ? `, ${name}` : ''} : ton menu du jour concilie les deux.`,
    () => 'Chocolat ? Oui. Bien accompagné, c\'est encore mieux.',
  ],
};

function parseLocalDate(dateStr) {
  const [y, m, d] = String(dateStr).split('-').map(Number);
  return new Date(y, m - 1, d);
}

// Date à `days` jours de `base` (minuit local), à h:min.
function at(base, days, h, min = 0) {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  d.setHours(h, min, 0, 0);
  return d;
}

const dayKey = (d) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;

// Phase d'un jour de cycle donné (mêmes frontières que getCycleInfo).
function phaseForDay(day, cycleLength, periodLength) {
  const ovulationDay = getOvulationDay(cycleLength, periodLength);
  if (day <= periodLength) return 'menstrual';
  if (day < ovulationDay - 1) return 'follicular';
  if (day <= ovulationDay + 1) return 'ovulatory';
  return 'luteal';
}

/**
 * Construit le plan de notifications.
 * @param profile { name, lastPeriodDate, cycleLength, periodLength,
 *                  healthIssues, cravings, notifications, notifPrefs,
 *                  todayCheckInDone }
 * @param now     Date courante (injectée pour les tests)
 * @returns       [{ id, title, body, at: Date }]
 */
export function buildNotificationPlan(profile, now = new Date()) {
  const {
    name = '',
    lastPeriodDate,
    cycleLength = 28,
    periodLength = 5,
    healthIssues = [],
    cravings = [],
    notifications = true,
    notifPrefs = DEFAULT_NOTIF_PREFS,
    notifCustomTexts = {},
    todayCheckInDone = false,
  } = profile;

  const plan = [];
  if (!notifications) return plan;
  const prefs = { ...DEFAULT_NOTIF_PREFS, ...notifPrefs };

  // Message personnalisé (façon Clue) : si l'utilisatrice a écrit son propre
  // texte pour un type de rappel, il remplace TOUT le message (affiché seul,
  // sans corps) — c'est son mot à elle, il apparaît tel quel à l'écran.
  const texts = (key, title, body) => {
    const t = (notifCustomTexts[key] || '').trim();
    return t ? [t, ''] : [title, body];
  };

  const today = new Date(now);
  today.setHours(0, 0, 0, 0);

  // Jours déjà « pris » par une notification proactive (max 1/jour).
  const takenDays = new Set();
  const isFuture = (d) => d.getTime() > now.getTime() + 60 * 1000;
  const push = (id, title, body, when, { exclusiveDay = true } = {}) => {
    if (!isFuture(when)) return false;
    if (exclusiveDay) {
      const k = dayKey(when);
      if (takenDays.has(k)) return false;
      takenDays.add(k);
    }
    plan.push({ id, title, body, at: when });
    return true;
  };

  // ——— Notifications liées au cycle (priorité la plus haute) ———
  if (lastPeriodDate) {
    const lastPeriod = parseLocalDate(lastPeriodDate);
    const daysSince = Math.max(0, Math.round((today - lastPeriod) / 86400000));
    // Cohérent avec getCycleInfo : plus de modulo. Passé la date prévue,
    // on est « en retard » — les rappels du cycle suivant n'ont pas de sens
    // tant que les règles ne sont pas confirmées.
    const isLate = daysSince >= cycleLength;
    // Début du cycle en cours (minuit local) = la vraie date des dernières règles.
    const cycleStart = at(today, -daysSince, 0);
    const ovulationDay = getOvulationDay(cycleLength, periodLength);

    // 3bis · Relances douces de retard — J+3 et J+7 après la date prévue,
    // 9 h 30 (textes validés 2026-07-16). Programmées à l'avance à CHAQUE
    // synchronisation : si les règles sont confirmées à temps, le plan est
    // reprogrammé avec la nouvelle date et elles ne partent jamais à tort.
    if (prefs.day1) {
      [2, 6].forEach((d, i) => {
        push(
          NOTIF_IDS.late + i,
          ...texts('late', 'Ton cycle prend son temps 🌙', 'Les cycles varient, c\'est courant. Quand tes règles commencent, note-le sur l\'accueil : tout se recale.'),
          at(cycleStart, cycleLength + d, 9, 30),
        );
      });
    }

    // Frontières de phase des 5 prochaines semaines (cycle courant + suivant).
    // La menstruelle est couverte par « Confirmation du jour 1 » (day1).
    // En retard : on saute tout le bloc — ces rappels supposent un cycle
    // suivant déjà commencé, ce qui est faux ; seules les relances partent.
    for (let k = 0; k < (isLate ? 0 : 2); k++) {
      const base = k * cycleLength;

      // 3 · Confirmation du jour 1 — le jour prévu des règles, 9 h 30
      if (prefs.day1) {
        push(
          NOTIF_IDS.day1 + k,
          ...texts('day1', 'Tes règles ont commencé ?', 'Crampes, fatigue, envie de cocon ? Un tap sur l\'accueil et tes prochains jours passent en mode douceur.'),
          at(cycleStart, base + cycleLength, 9, 30),
        );
      }

      // 2 · Règles qui approchent — 2 jours avant, 19 h
      if (prefs.rules) {
        push(
          NOTIF_IDS.rules + k,
          ...texts('rules', 'Tes règles approchent 🌙', 'Crampes, fatigue, fringales : cette fois tu ne les subis pas. Ton menu spécial règles t\'attend déjà.'),
          at(cycleStart, base + cycleLength - 2, 19),
        );
      }

      // 1 · Changements de phase — 1er jour de la phase, 9 h
      if (prefs.phase) {
        const boundaries = [
          { day: periodLength + 1, phase: 'follicular' },
          { day: ovulationDay - 1, phase: 'ovulatory' },
          { day: ovulationDay + 2, phase: 'luteal' },
        ];
        boundaries.forEach(({ day, phase }, i) => {
          // Cycles courts : une frontière peut tomber dans une autre phase
          // (ex. folliculaire quasi inexistante) — on ne l'annonce pas.
          if (phaseForDay(day, cycleLength, periodLength) !== phase) return;
          const t = PHASE_CHANGE_TEXTS[phase];
          push(NOTIF_IDS.phase + k * 10 + i, ...texts('phase', t.title, t.body), at(cycleStart, base + day - 1, 9));
        });
      }

      // 8 · Veille du pic de forme — la veille de l'entrée en ovulatoire,
      // 19 h. Complète (et n'écrase pas) le changement de phase du
      // lendemain matin : anticipation le soir, confirmation au réveil.
      if (prefs.peak) {
        const peakEve = ovulationDay - 2; // l'ovulatoire commence à ovulationDay - 1
        if (peakEve >= 2 && phaseForDay(peakEve + 1, cycleLength, periodLength) === 'ovulatory') {
          push(
            NOTIF_IDS.peak + k,
            ...texts('peak', 'Demain, ton pic de forme ☀️', 'Ta meilleure semaine du mois commence demain. Cette fois, tu le sais à l\'avance : prévois grand.'),
            at(cycleStart, base + peakEve - 1, 19),
          );
        }
      }

      // 6 · Semaine douceur — ~5 jours avant les règles, 18 h,
      // seulement si SPM déclaré ou fringales cochées.
      const hasSoftweekSignal =
        healthIssues.includes('SPM sévère') ||
        cravings.some((c) => c && c !== 'rien');
      if (prefs.softweek && hasSoftweekSignal) {
        push(
          NOTIF_IDS.softweek + k,
          ...texts('softweek', 'Ta semaine douceur commence 💛', 'Irritabilité, fringales, moral en dents de scie ? Le SPM se joue aussi dans l\'assiette. Tes menus douceur sont prêts.'),
          at(cycleStart, base + cycleLength - 5, 18),
        );
      }

      // 9 · Aliments alliés — 2 jours après chaque changement de phase
      // (pas le jour même, pour ne pas doubler le rappel de 9 h), 12 h.
      // 4 fois par cycle : « voilà quoi mettre dans ton panier maintenant ».
      if (prefs.allies) {
        const phaseStarts = [1, periodLength + 1, ovulationDay - 1, ovulationDay + 2];
        phaseStarts.forEach((startDay, i) => {
          const d = startDay + 2;
          if (d > cycleLength) return;
          push(
            NOTIF_IDS.allies + k * 10 + i,
            ...texts('allies', 'Tes aliments du moment 🥑', 'Ton corps n\'a plus les mêmes besoins qu\'il y a 10 jours. Voici ceux qui lui font le plus de bien en ce moment.'),
            at(cycleStart, base + d - 1, 12),
          );
        });
      }
    }

    // 10 · Batch cooking — le dimanche 17 h (avant les menus : il prime
    // sur le menu du jour ce jour-là, règle du 1 rappel proactif par jour).
    if (prefs.batch) {
      let sundays = 0;
      for (let i = 0; i < 14 && sundays < 2; i++) {
        const d = at(today, i, 17);
        if (d.getDay() !== 0) continue;
        push(
          NOTIF_IDS.batch + sundays,
          ...texts('batch', 'Envie de souffler cette semaine ? 🍳', '2-3 plats préparés ce dimanche = tous tes midis réglés. On t\'a trouvé les recettes parfaites à faire en avance.'),
          d,
        );
        sundays += 1;
      }
    }

    // 4 · Menu du jour — chaque matin 10 h, sauf jour déjà pris
    // (changement de phase, règles J-2, jour 1, semaine douceur).
    if (prefs.menu) {
      for (let i = 0; i < MENU_DAYS; i++) {
        const when = at(today, i, 10);
        if (!isFuture(when)) continue;
        // En retard : pas de faux menu « menstruel » prédit — on reste en
        // lutéale (phaseForDay renvoie lutéale au-delà de cycleLength).
        const dayOfCycle = isLate ? daysSince + i + 1 : ((daysSince + i) % cycleLength) + 1;
        const phase = phaseForDay(dayOfCycle, cycleLength, periodLength);
        // Rotation des 4 variantes, stable pour une date donnée (daysSince
        // avance d'un cran par jour → jamais deux matins de suite pareils).
        const variant = MENU_VARIANTS[phase][(daysSince + i) % 4];
        push(NOTIF_IDS.menu + i, ...texts('menu', 'Ton menu du jour est prêt 🍽️', variant(name)), when);
      }
    }
  }

  // ——— 5 · Check-in du soir — 20 h 30, hors règle du 1/jour ———
  // (conditionnel : celui d'aujourd'hui saute si le check-in est fait ;
  // la resynchronisation quotidienne entretient la fenêtre glissante)
  if (prefs.checkin) {
    for (let i = 0; i < CHECKIN_DAYS; i++) {
      // i === 0 : ce plan se construit à l'OUVERTURE de l'app — elle est donc
      // venue aujourd'hui, on ne la relance pas ce soir (standard Duolingo /
      // Headspace : on ne relance jamais quelqu'un qui est déjà là). Le
      // rappel ne part que les jours SANS ouverture : demain elle ouvre →
      // le plan se reconstruit et le rappel du soir saute à nouveau.
      if (i === 0) continue;
      void todayCheckInDone; // couvert par la règle ci-dessus
      push(
        NOTIF_IDS.checkin + i,
        ...texts('checkin', 'Comment tu te sens ce soir ?', 'Ton corps t\'a parlé toute la journée. 2 minutes pour l\'écouter, et tes conseils de demain seront encore plus justes.'),
        at(today, i, 20, 30),
        { exclusiveDay: false },
      );
    }
  }

  // ——— 11 · Retrouvailles — dans 7 jours, 12 h 30 ———
  // Reprogrammée à chaque ouverture de l'app : elle ne part donc que
  // si l'app n'a pas été ouverte pendant 7 jours.
  if (prefs.comeback) {
    push(
      NOTIF_IDS.comeback,
      ...texts('comeback', 'On garde ta place au chaud 🌙', 'Tu es sûrement passée dans une nouvelle phase : tes besoins ont changé. On a déjà tout recalé pour toi.'),
      at(today, 7, 12, 30),
      { exclusiveDay: false },
    );
  }

  return plan.sort((a, b) => a.at - b.at);
}
