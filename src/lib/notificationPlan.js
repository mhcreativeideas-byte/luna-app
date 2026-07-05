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

// Identifiants stables par type (pour annuler/reprogrammer proprement).
export const NOTIF_IDS = {
  phase: 1000, // +i
  rules: 2000,
  day1: 2100,
  menu: 3000, // +i
  checkin: 4000, // +i
  softweek: 5000,
  comeback: 6000,
};

export const DEFAULT_NOTIF_PREFS = {
  phase: true, // changement de phase
  rules: true, // règles qui approchent (J-2)
  day1: true, // confirmation du jour 1
  menu: true, // menu du jour
  checkin: true, // check-in du soir
  softweek: true, // semaine douceur (SPM/fringales)
  comeback: true, // retrouvailles (7 j sans ouvrir)
};

// Horizon de programmation : iOS limite à 64 notifications en attente.
const MENU_DAYS = 10; // menus du jour programmés à l'avance
const CHECKIN_DAYS = 10; // rappels de check-in programmés à l'avance

const PHASE_CHANGE_TEXTS = {
  follicular: {
    title: 'Nouvelle phase : folliculaire 🌿',
    body: (name) => `Ton énergie remonte${name ? `, ${name}` : ''}. Découvre les aliments qui l'accompagnent.`,
  },
  ovulatory: {
    title: 'Nouvelle phase : ovulatoire ☀️',
    body: (name) => `Tu entres dans ton pic de forme${name ? `, ${name}` : ''}. Des assiettes légères et colorées t'attendent.`,
  },
  luteal: {
    title: 'Nouvelle phase : lutéale 🍂',
    body: (name) => `Ton corps ralentit doucement${name ? `, ${name}` : ''}. Place au réconfort qui te fait du bien.`,
  },
};

const MENU_TEXTS = {
  menstrual: 'Pensé pour ta phase menstruelle : réconfortant et riche en fer.',
  follicular: 'Pensé pour ta phase folliculaire : de l\'énergie dans l\'assiette.',
  ovulatory: 'Pensé pour ta phase ovulatoire : léger et coloré, comme toi.',
  luteal: 'Pensé pour ta phase lutéale : équilibré et réconfortant.',
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
  const ovulationDay = cycleLength - 14;
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
    todayCheckInDone = false,
  } = profile;

  const plan = [];
  if (!notifications) return plan;
  const prefs = { ...DEFAULT_NOTIF_PREFS, ...notifPrefs };

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
    const currentDay = (daysSince % cycleLength) + 1;
    // Début du cycle en cours (minuit local).
    const cycleStart = at(today, -(currentDay - 1), 0);
    const ovulationDay = cycleLength - 14;

    // Frontières de phase des 5 prochaines semaines (cycle courant + suivant).
    // La menstruelle est couverte par « Confirmation du jour 1 » (day1).
    for (let k = 0; k < 2; k++) {
      const base = k * cycleLength;

      // 3 · Confirmation du jour 1 — le jour prévu des règles, 9 h 30
      if (prefs.day1) {
        push(
          NOTIF_IDS.day1 + k,
          'C\'est le jour 1 ?',
          'Si tes règles ont commencé, note-le : ton cycle reste juste, tes conseils aussi.',
          at(cycleStart, base + cycleLength, 9, 30),
        );
      }

      // 2 · Règles qui approchent — 2 jours avant, 19 h
      if (prefs.rules) {
        push(
          NOTIF_IDS.rules + k,
          'Tes règles approchent 🌙',
          'D\'ici 2 jours environ. Magnésium et douceur au menu — on t\'a tout préparé.',
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
          push(NOTIF_IDS.phase + k * 10 + i, t.title, t.body(name), at(cycleStart, base + day - 1, 9));
        });
      }

      // 6 · Semaine douceur — ~5 jours avant les règles, 18 h,
      // seulement si SPM déclaré ou fringales cochées.
      const hasSoftweekSignal =
        healthIssues.includes('SPM sévère') ||
        cravings.some((c) => c && c !== 'rien');
      if (prefs.softweek && hasSoftweekSignal) {
        push(
          NOTIF_IDS.softweek + k,
          'Ta semaine douceur commence 💛',
          'Le SPM pointe souvent ces jours-ci. Magnésium, B6 : tes alliés sont prêts dans l\'app.',
          at(cycleStart, base + cycleLength - 5, 18),
        );
      }
    }

    // 4 · Menu du jour — chaque matin 10 h, sauf jour déjà pris
    // (changement de phase, règles J-2, jour 1, semaine douceur).
    if (prefs.menu) {
      for (let i = 0; i < MENU_DAYS; i++) {
        const when = at(today, i, 10);
        if (!isFuture(when)) continue;
        const dayOfCycle = ((daysSince + i) % cycleLength) + 1;
        const phase = phaseForDay(dayOfCycle, cycleLength, periodLength);
        push(NOTIF_IDS.menu + i, 'Ton menu du jour est prêt 🍽️', MENU_TEXTS[phase], when);
      }
    }
  }

  // ——— 5 · Check-in du soir — 20 h 30, hors règle du 1/jour ———
  // (conditionnel : celui d'aujourd'hui saute si le check-in est fait ;
  // la resynchronisation quotidienne entretient la fenêtre glissante)
  if (prefs.checkin) {
    for (let i = 0; i < CHECKIN_DAYS; i++) {
      if (i === 0 && todayCheckInDone) continue;
      push(
        NOTIF_IDS.checkin + i,
        'Comment tu te sens ce soir ?',
        '2 minutes pour écouter ton corps. Sans pression, promis.',
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
      'On garde ta place au chaud 🌙',
      'Ton cycle a continué. Tout est prêt pour toi, quand tu veux.',
      at(today, 7, 12, 30),
      { exclusiveDay: false },
    );
  }

  return plan.sort((a, b) => a.at - b.at);
}
