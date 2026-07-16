import { createContext, useContext, useReducer, useEffect, useState, useRef } from 'react';
import { Capacitor } from '@capacitor/core';
import { PHASES, getOvulationDay } from '../data/phases';
import { supabase } from '../lib/supabase';
import { toast } from '../lib/toast';
import { DEFAULT_NOTIF_PREFS } from '../lib/notificationPlan';

const CycleContext = createContext();

// Parse une date « YYYY-MM-DD » en heure LOCALE (minuit chez l'utilisatrice).
// `new Date('2026-07-04')` serait interprété minuit UTC : en France, entre
// minuit et 2 h du matin, le calcul du jour de cycle serait décalé d'un jour.
function parseLocalDate(dateStr) {
  const [y, m, d] = String(dateStr).split('-').map(Number);
  return new Date(y, m - 1, d);
}

const initialState = {
  name: '',
  email: '',
  lastPeriodDate: '',
  cycleLength: 28,
  periodLength: 5,
  goals: [],
  fitnessLevel: 'intermediate',
  dietPreferences: ['omnivore'],
  healthIssues: [],
  allergies: [],
  cookingLevel: '',
  cookingTime: '',
  age: '',
  cravings: [],
  barriers: [],
  discoverySource: '',
  onboardingComplete: false,
  journalEntries: [],
  sportSessions: [],
  sportLogs: [],
  periodLogs: [],
  checkIns: [],
  customSymptoms: [],
  temperatureLogs: {},
  spottingLogs: [],
  conversations: [],
  activeConversationId: null,
  notifications: true,
  notifPrefs: DEFAULT_NOTIF_PREFS,
  language: 'fr',
  smartTracking: false,
  calendarStartDay: 'monday',
  profileImage: null,
  partnerCode: null,
  favorites: [],
  fridgeItems: [],
  shoppingList: [],
  shoppingPeople: 1, // nombre de personnes pour la mise à l'échelle des quantités
};

function cycleReducer(state, action) {
  switch (action.type) {
    case 'SET_PROFILE':
      return { ...state, ...action.payload };
    case 'COMPLETE_ONBOARDING':
      return { ...state, onboardingComplete: true };
    case 'ADD_JOURNAL_ENTRY': {
      const existing = state.journalEntries.findIndex(
        (e) => e.date === action.payload.date
      );
      const entries = [...state.journalEntries];
      if (existing >= 0) {
        entries[existing] = { ...entries[existing], ...action.payload };
      } else {
        entries.push(action.payload);
      }
      return { ...state, journalEntries: entries };
    }
    case 'TOGGLE_SPORT_SESSION': {
      const date = action.payload.date;
      const exists = state.sportSessions.find((s) => s.date === date);
      if (exists) {
        return { ...state, sportSessions: state.sportSessions.filter((s) => s.date !== date) };
      }
      return { ...state, sportSessions: [...state.sportSessions, action.payload] };
    }
    case 'UPDATE_SPORT_LOG': {
      // payload: { date, steps?, activities?: [{ name, duration }] }
      const idx = state.sportLogs.findIndex((l) => l.date === action.payload.date);
      const logs = [...state.sportLogs];
      if (idx >= 0) {
        logs[idx] = { ...logs[idx], ...action.payload };
      } else {
        logs.push(action.payload);
      }
      return { ...state, sportLogs: logs };
    }
    case 'ADD_CUSTOM_ACTIVITY': {
      // payload: { date, activity: { name, duration } }
      const logIdx = state.sportLogs.findIndex((l) => l.date === action.payload.date);
      const allLogs = [...state.sportLogs];
      if (logIdx >= 0) {
        const existing = allLogs[logIdx];
        allLogs[logIdx] = { ...existing, activities: [...(existing.activities || []), action.payload.activity] };
      } else {
        allLogs.push({ date: action.payload.date, activities: [action.payload.activity] });
      }
      return { ...state, sportLogs: allLogs };
    }
    case 'REMOVE_CUSTOM_ACTIVITY': {
      // payload: { date, index }
      const li = state.sportLogs.findIndex((l) => l.date === action.payload.date);
      if (li < 0) return state;
      const updated = [...state.sportLogs];
      const acts = [...(updated[li].activities || [])];
      acts.splice(action.payload.index, 1);
      updated[li] = { ...updated[li], activities: acts };
      return { ...state, sportLogs: updated };
    }
    case 'TOGGLE_PERIOD_DAY': {
      // payload: { date } — toggle a single day as period day
      const date = action.payload.date;
      const exists = state.periodLogs.includes(date);
      const newLogs = exists
        ? state.periodLogs.filter((d) => d !== date)
        : [...state.periodLogs, date].sort();
      return { ...state, periodLogs: newLogs };
    }
    case 'TOGGLE_SPOTTING': {
      const spotDate = action.payload.date;
      const spotExists = (state.spottingLogs || []).includes(spotDate);
      const newSpotLogs = spotExists
        ? state.spottingLogs.filter((d) => d !== spotDate)
        : [...(state.spottingLogs || []), spotDate].sort();
      return { ...state, spottingLogs: newSpotLogs };
    }
    case 'SET_TEMPERATURE': {
      // payload: { date, temperature } — save basal temperature for a day
      const { date: tempDate, temperature } = action.payload;
      const newTempLogs = { ...(state.temperatureLogs || {}) };
      if (temperature === null || temperature === '' || temperature === undefined) {
        delete newTempLogs[tempDate];
      } else {
        const parsed = parseFloat(String(temperature).replace(',', '.'));
        if (!isNaN(parsed)) {
          newTempLogs[tempDate] = parsed;
        }
      }
      return { ...state, temperatureLogs: newTempLogs };
    }
    case 'SET_PERIOD_START': {
      // payload: { date } — mark as period start and update lastPeriodDate
      const date = action.payload.date;
      const newLogs = state.periodLogs.includes(date)
        ? state.periodLogs
        : [...state.periodLogs, date].sort();
      // Apprentissage du cycle réel (décision Margaux 2026-07-16) : la longueur
      // du cycle devient la MOYENNE des 3 derniers cycles observés, comme chez
      // Flo/Clue. Un cycle inhabituel isolé ne fausse plus la prédiction, et
      // elle s'affine au fil des mois.
      // Un « début de cycle » = un jour de règles marqué dont la veille ne
      // l'est pas. On mesure les écarts entre débuts successifs et on ne garde
      // que les plausibles (16 à 49 jours : au-delà, règles non enregistrées).
      const prevStart = state.lastPeriodDate;
      const dayBefore = (d) => {
        const t = parseLocalDate(d);
        t.setDate(t.getDate() - 1);
        return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`;
      };
      const allDays = new Set(prevStart ? [...newLogs, prevStart] : newLogs);
      const starts = [...allDays].sort().filter((d) => !allDays.has(dayBefore(d)));
      const gaps = [];
      for (let i = 1; i < starts.length; i++) {
        const diff = Math.round((parseLocalDate(starts[i]) - parseLocalDate(starts[i - 1])) / (1000 * 60 * 60 * 24));
        if (diff > 15 && diff < 50) gaps.push(diff);
      }
      const recent = gaps.slice(-3);
      const newCycleLength = recent.length
        ? Math.round(recent.reduce((a, b) => a + b, 0) / recent.length)
        : state.cycleLength;
      // Marquer rétroactivement une date antérieure ne recule jamais
      // lastPeriodDate (garde existante conservée ci-dessous).
      return {
        ...state,
        lastPeriodDate: prevStart && date < prevStart ? prevStart : date,
        cycleLength: newCycleLength,
        periodLogs: newLogs,
      };
    }
    case 'ADD_CHECKIN': {
      const existing = state.checkIns.findIndex(
        (c) => c.date === action.payload.date
      );
      const checkIns = [...state.checkIns];
      if (existing >= 0) {
        checkIns[existing] = action.payload;
      } else {
        checkIns.push(action.payload);
      }
      return { ...state, checkIns };
    }
    case 'ADD_CUSTOM_SYMPTOM': {
      const label = action.payload.label?.trim();
      if (!label || state.customSymptoms.includes(label)) return state;
      return { ...state, customSymptoms: [...state.customSymptoms, label] };
    }
    case 'REMOVE_CUSTOM_SYMPTOM': {
      return { ...state, customSymptoms: state.customSymptoms.filter((s) => s !== action.payload.label) };
    }
    case 'CREATE_CONVERSATION': {
      // payload: { id, title? }
      const newConv = {
        id: action.payload.id,
        title: action.payload.title || 'Nouvelle conversation',
        messages: [],
        createdAt: new Date().toISOString(),
        archived: false,
      };
      return {
        ...state,
        conversations: [newConv, ...state.conversations],
        activeConversationId: newConv.id,
      };
    }
    case 'ADD_CONVERSATION_MESSAGE': {
      // payload: { conversationId, message }
      const convs = state.conversations.map((c) => {
        if (c.id !== action.payload.conversationId) return c;
        const msgs = [...c.messages, action.payload.message];
        // Auto-titre basé sur le premier message user
        let title = c.title;
        if (title === 'Nouvelle conversation' && action.payload.message.role === 'user') {
          title = action.payload.message.content.slice(0, 40) + (action.payload.message.content.length > 40 ? '...' : '');
        }
        return { ...c, messages: msgs, title };
      });
      return { ...state, conversations: convs };
    }
    case 'SET_ACTIVE_CONVERSATION':
      return { ...state, activeConversationId: action.payload.id };
    case 'DELETE_CONVERSATION': {
      const filtered = state.conversations.filter((c) => c.id !== action.payload.id);
      const newActiveId = state.activeConversationId === action.payload.id
        ? (filtered.find((c) => !c.archived)?.id || null)
        : state.activeConversationId;
      return { ...state, conversations: filtered, activeConversationId: newActiveId };
    }
    case 'ARCHIVE_CONVERSATION': {
      const MAX_ARCHIVED = 3;
      let convs = state.conversations.map((c) =>
        c.id === action.payload.id ? { ...c, archived: !c.archived } : c
      );
      // Si on dépasse 3 archives, supprimer la plus ancienne
      const archived = convs.filter((c) => c.archived).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      if (archived.length > MAX_ARCHIVED) {
        const toRemove = archived.slice(0, archived.length - MAX_ARCHIVED).map((c) => c.id);
        convs = convs.filter((c) => !toRemove.includes(c.id));
      }
      const newActiveId = state.activeConversationId === action.payload.id
        ? (convs.find((c) => !c.archived && c.id !== action.payload.id)?.id || null)
        : state.activeConversationId;
      return { ...state, conversations: convs, activeConversationId: newActiveId };
    }
    case 'TOGGLE_FAVORITE': {
      const name = action.payload.name;
      const favs = state.favorites.includes(name)
        ? state.favorites.filter((n) => n !== name)
        : [...state.favorites, name];
      return { ...state, favorites: favs };
    }
    case 'SET_FRIDGE_ITEMS':
      return { ...state, fridgeItems: action.payload };

    // ——— Liste de courses (organisée par recette) ———
    // Bloc : { id, name, source: 'recette'|'menu'|'ajouts', items: [{ name, checked }] }
    case 'ADD_SHOPPING_RECIPE': {
      const { name, ingredients, source, emoji, servings, servingLabel } = action.payload;
      if (state.shoppingList.some((b) => b.id !== 'ajouts' && b.name === name)) return state;
      const block = {
        id: `r-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        name,
        emoji: emoji || null,
        source: source || 'recette',
        // servings = base des quantités stockées ; servingLabel présent = fournée
        // (energy balls, granola…) qu'on ne met jamais à l'échelle par personne.
        servings: servings || null,
        servingLabel: servingLabel || null,
        items: (ingredients || []).map((ing) => ({ name: ing, checked: false })),
      };
      return { ...state, shoppingList: [...state.shoppingList, block] };
    }
    case 'SET_SHOPPING_PEOPLE': {
      const n = Math.max(1, Math.min(8, parseInt(action.payload, 10) || 1));
      return { ...state, shoppingPeople: n };
    }
    case 'REMOVE_SHOPPING_RECIPE':
      return { ...state, shoppingList: state.shoppingList.filter((b) => b.id !== action.payload && b.name !== action.payload) };
    case 'TOGGLE_SHOPPING_ITEM': {
      const { blockId, index, itemName } = action.payload;
      return {
        ...state,
        shoppingList: state.shoppingList.map((b) => {
          if (b.id !== blockId) return b;
          // Garde-fou : si la liste a bougé entre l'affichage et le tap
          // (ex. « Vider les cochés »), on retrouve l'article par son nom
          // plutôt que de cocher la mauvaise ligne.
          const target = itemName && b.items[index]?.name !== itemName
            ? b.items.findIndex((it) => it.name === itemName)
            : index;
          if (target < 0) return b;
          return { ...b, items: b.items.map((it, i) => i === target ? { ...it, checked: !it.checked } : it) };
        }),
      };
    }
    case 'ADD_SHOPPING_CUSTOM_ITEM': {
      const name = action.payload.trim();
      if (!name) return state;
      const existing = state.shoppingList.find((b) => b.id === 'ajouts');
      if (existing) {
        return {
          ...state,
          shoppingList: state.shoppingList.map((b) =>
            b.id === 'ajouts' ? { ...b, items: [...b.items, { name, checked: false }] } : b
          ),
        };
      }
      return {
        ...state,
        shoppingList: [...state.shoppingList, { id: 'ajouts', name: 'Mes ajouts', source: 'ajouts', items: [{ name, checked: false }] }],
      };
    }
    case 'CLEAR_CHECKED_SHOPPING': {
      const cleaned = state.shoppingList
        .map((b) => ({ ...b, items: b.items.filter((it) => !it.checked) }))
        .filter((b) => b.items.length > 0);
      return { ...state, shoppingList: cleaned };
    }
    case 'CLEAR_ALL_SHOPPING':
      return { ...state, shoppingList: [] };

    case 'UPDATE_SETTINGS':
      return { ...state, ...action.payload };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

// Retire les caractères de contrôle (dont le caractère nul \u0000) que Postgres
// refuse dans une colonne JSON : une seule note/symptôme contenant un tel
// caractère faisait échouer TOUTE la sauvegarde du suivi (erreur 22P05).
function sanitizeForJson(value) {
  if (typeof value === 'string') {
    // eslint-disable-next-line no-control-regex
    return value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '');
  }
  if (Array.isArray(value)) return value.map(sanitizeForJson);
  if (value && typeof value === 'object') {
    const out = {};
    for (const k of Object.keys(value)) out[k] = sanitizeForJson(value[k]);
    return out;
  }
  return value;
}

function getCycleInfo(lastPeriodDate, cycleLength, periodLength) {
  if (!lastPeriodDate) return null;

  // Données corrompues (0, null, NaN…) → valeurs par défaut plutôt que
  // des calculs en NaN qui se propagent dans toute l'app.
  cycleLength = Number(cycleLength) > 0 ? Math.round(Number(cycleLength)) : 28;
  periodLength = Number(periodLength) > 0 ? Math.round(Number(periodLength)) : 5;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const lastPeriod = parseLocalDate(lastPeriodDate);
  if (Number.isNaN(lastPeriod.getTime())) return null;
  const diffTime = today.getTime() - lastPeriod.getTime();
  // Math.round : les deux dates sont à minuit local, mais un changement
  // d'heure été/hiver dans l'intervalle décalerait un Math.floor.
  // Math.max(0, …) : une date future (donnée corrompue) affiche « jour 1 »
  // plutôt qu'une phase absurde calculée sur un nombre négatif.
  const daysSinceLastPeriod = Math.max(0, Math.round(diffTime / (1000 * 60 * 60 * 24)));
  const currentDay = (daysSinceLastPeriod % cycleLength) + 1;

  const ovulationDay = getOvulationDay(cycleLength, periodLength);
  const ovulatoryStart = ovulationDay - 1;
  const ovulatoryEnd = ovulationDay + 1;

  let phase, phaseDay, phaseDuration;

  // Fenêtre ovulatoire = 3 jours (ovulatoryStart, ovulation, ovulatoryEnd),
  // d'où le < strict pour la folliculaire — cohérent avec getPhaseForDay
  // (phases.js) et les segments d'anneau/barre du Dashboard.
  if (currentDay <= periodLength) {
    phase = 'menstrual';
    phaseDay = currentDay;
    phaseDuration = periodLength;
  } else if (currentDay < ovulatoryStart) {
    phase = 'follicular';
    phaseDay = currentDay - periodLength;
    phaseDuration = ovulatoryStart - 1 - periodLength;
  } else if (currentDay <= ovulatoryEnd) {
    phase = 'ovulatory';
    phaseDay = currentDay - ovulatoryStart + 1;
    phaseDuration = 3;
  } else {
    phase = 'luteal';
    phaseDay = currentDay - ovulatoryEnd;
    phaseDuration = cycleLength - ovulatoryEnd;
  }

  const daysUntilPeriod = cycleLength - currentDay;
  const energyLevel = phase === 'menstrual' ? 30
    : phase === 'follicular' ? 75
    : phase === 'ovulatory' ? 95
    : currentDay <= ovulatoryEnd + 5 ? 60 : 35;

  const hormones = {
    estrogen: phase === 'ovulatory' ? 'high' : phase === 'follicular' ? 'rising' : phase === 'luteal' ? 'medium' : 'low',
    progesterone: phase === 'luteal' ? 'high' : 'low',
    lh: phase === 'ovulatory' ? 'peak' : 'low',
    fsh: phase === 'follicular' ? 'rising' : 'low',
  };

  return {
    currentDay,
    cycleLength,
    periodLength,
    phase,
    phaseDay,
    phaseDuration,
    phaseData: PHASES[phase],
    daysUntilPeriod,
    energyLevel,
    hormones,
    ovulationDay,
  };
}

export function CycleProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const signedOutRef = useRef(false);
  // Verrou anti-écrasement : tant que le suivi serveur (journal, règles,
  // favoris…) n'a pas été chargé, AUCUNE sauvegarde de suivi ne doit partir,
  // sinon un état local vide écraserait tout l'historique en base.
  const trackingLoadedRef = useRef(false);
  // Propriétaire du cache local, lu une seule fois au démarrage (avant que la
  // session soit connue) puis tenu à jour — sinon le premier passage de
  // l'effet de persistance (user encore null) effacerait cette information.
  const [bootCacheOwner] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('luna-profile'))?._cacheAuthId ?? null;
    } catch {
      return null;
    }
  });
  const cacheOwnerRef = useRef(bootCacheOwner);

  const [state, dispatch] = useReducer(cycleReducer, initialState, (init) => {
    try {
      const saved = localStorage.getItem('luna-profile');
      if (!saved) return init;
      const parsed = JSON.parse(saved);
      const merged = { ...init };
      for (const key of Object.keys(init)) {
        if (parsed[key] !== undefined) merged[key] = parsed[key];
      }
      return merged;
    } catch {
      return init;
    }
  });

  // Au changement de compte sur un même appareil : si le cache local
  // appartient à quelqu'un d'autre, on repart de zéro plutôt que d'afficher
  // (et de risquer de sauvegarder) les données de la personne précédente.
  const resetIfCacheFromOtherUser = (userId, { freshLogin = false } = {}) => {
    const owner = cacheOwnerRef.current;
    const hasCache = Boolean(localStorage.getItem('luna-profile'));
    // Deux cas où le cache local est écarté :
    // 1. il appartient à un autre compte ;
    // 2. connexion fraîche avec un cache « legacy » sans propriétaire
    //    (créé avant le marquage _cacheAuthId) — impossible de savoir à qui
    //    il est, et le serveur va de toute façon recharger les données.
    if ((owner && owner !== userId) || (freshLogin && !owner && hasCache)) {
      localStorage.removeItem('luna-profile');
      dispatch({ type: 'RESET' });
    }
    cacheOwnerRef.current = userId;
  };

  const loadUserData = async (userId, { freshLogin = false } = {}) => {
    trackingLoadedRef.current = false;
    resetIfCacheFromOtherUser(userId, { freshLogin });
    await Promise.all([
      loadProfileFromSupabase(userId),
      loadTrackingFromSupabase(userId),
    ]);
    loadAvatarFromSupabase(userId);
  };

  // Listen to Supabase auth changes
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        await loadUserData(session.user.id);
      }
      setAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      // setTimeout : la doc supabase-js déconseille d'attendre d'autres appels
      // Supabase directement dans ce callback (verrou interne d'auth →
      // risque de blocage au rafraîchissement de session).
      setTimeout(async () => {
        // INITIAL_SESSION is handled by getSession above — skip to avoid
        // prematurely setting authLoading=false before OAuth hash is processed
        if (event === 'INITIAL_SESSION') return;

        if (event === 'SIGNED_IN' && session?.user) {
          setAuthLoading(true);
          setUser(session.user);
          await loadUserData(session.user.id, { freshLogin: true });
          setAuthLoading(false);
          return;
        }

        if (event === 'SIGNED_OUT') {
          setUser(null);
          return;
        }

        // TOKEN_REFRESHED, USER_UPDATED — just sync the user object
        setUser(session?.user ?? null);
      }, 0);
    });

    return () => subscription.unsubscribe();
    // Écouteur d'auth monté une seule fois, volontairement.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Natif : capte le retour de la connexion Google (deep-link) et échange le
  // code contre une session. Sans effet sur le web.
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;
    let handle;
    import('@capacitor/app').then(({ App }) => {
      handle = App.addListener('appUrlOpen', async ({ url }) => {
        if (!url || !url.includes('login-callback')) return;
        try {
          const code = new URL(url).searchParams.get('code');
          if (code) await supabase.auth.exchangeCodeForSession(code);
        } catch (e) {
          console.error('OAuth callback error:', e);
        }
        import('@capacitor/browser').then(({ Browser }) => Browser.close().catch(() => {}));
      });
    });
    return () => { handle?.then?.((l) => l.remove?.()); };
  }, []);

  // Load profile from Supabase if exists
  const loadProfileFromSupabase = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('auth_id', userId)
        .single();

      if (signedOutRef.current) return;
      if (data && !error) {
        dispatch({
          type: 'SET_PROFILE',
          payload: {
            name: data.name || '',
            email: data.email || '',
            lastPeriodDate: data.last_period_date || '',
            cycleLength: data.cycle_length || 28,
            periodLength: data.period_length || 5,
            goals: data.goals || [],
            fitnessLevel: data.fitness_level || 'intermediate',
            dietPreferences: data.diet_preferences || ['omnivore'],
            healthIssues: data.health_issues || [],
            allergies: data.allergies || [],
            cookingLevel: data.cooking_level || '',
            cookingTime: data.cooking_time || '',
            age: data.age || '',
            cravings: data.cravings || [],
            barriers: data.barriers || [],
            discoverySource: data.discovery_source || '',
          },
        });
        if (data.onboarding_complete) {
          dispatch({ type: 'COMPLETE_ONBOARDING' });
        }
      }
    } catch (e) {
      console.error('Load profile error:', e);
    }
  };

  const loadTrackingFromSupabase = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('user_tracking')
        .select('*')
        .eq('auth_id', userId)
        .maybeSingle();

      if (signedOutRef.current) return;
      if (error) {
        // Échec de lecture : on laisse le verrou fermé (pas de sauvegarde
        // possible) plutôt que de risquer d'écraser l'historique en base.
        console.error('Load tracking error:', error);
        return;
      }
      if (data) {
        dispatch({
          type: 'SET_PROFILE',
          payload: {
            journalEntries: data.journal_entries || [],
            sportSessions: data.sport_sessions || [],
            sportLogs: data.sport_logs || [],
            periodLogs: data.period_logs || [],
            checkIns: data.check_ins || [],
            customSymptoms: data.custom_symptoms || [],
            temperatureLogs: data.temperature_logs || {},
            spottingLogs: data.spotting_logs || [],
            conversations: data.conversations || [],
            partnerCode: data.partner_code || null,
            ...(data.settings ? {
              notifications: data.settings.notifications ?? true,
              notifPrefs: { ...DEFAULT_NOTIF_PREFS, ...(data.settings.notifPrefs || {}) },
              language: data.settings.language || 'fr',
              smartTracking: data.settings.smartTracking ?? false,
              calendarStartDay: data.settings.calendarStartDay || 'monday',
              favorites: data.settings.favorites || [],
              fridgeItems: data.settings.fridgeItems || [],
              shoppingList: data.settings.shoppingList || [],
              shoppingPeople: data.settings.shoppingPeople || 1,
            } : {}),
          },
        });
      }
      // Chargé (ligne existante ou compte tout neuf sans ligne) :
      // les sauvegardes peuvent reprendre sans risque d'écrasement.
      trackingLoadedRef.current = true;
    } catch (e) {
      console.error('Load tracking error:', e);
    }
  };

  const loadAvatarFromSupabase = async (userId) => {
    try {
      const { data } = await supabase.storage.from('avatars').list(userId);
      if (data && data.length > 0) {
        const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(`${userId}/avatar.jpg`);
        dispatch({
          type: 'SET_PROFILE',
          payload: { profileImage: `${urlData.publicUrl}?t=${Date.now()}` },
        });
      }
    } catch (e) {
      console.error('Load avatar error:', e);
    }
  };

  useEffect(() => {
    // _cacheAuthId marque à qui appartient ce cache : au prochain démarrage,
    // si un autre compte se connecte sur le même appareil, on l'écarte
    // (voir resetIfCacheFromOtherUser). Clé ignorée à l'hydratation.
    if (user?.id) cacheOwnerRef.current = user.id;
    localStorage.setItem('luna-profile', JSON.stringify({ ...state, _cacheAuthId: cacheOwnerRef.current }));
  }, [state, user]);

  // One-time migration: move favorites/fridge from old localStorage keys into context
  useEffect(() => {
    try {
      const savedFavs = localStorage.getItem('luna-favorites');
      if (savedFavs) {
        const favs = JSON.parse(savedFavs);
        if (favs.length > 0 && state.favorites.length === 0) {
          dispatch({ type: 'SET_PROFILE', payload: { favorites: favs } });
        }
        localStorage.removeItem('luna-favorites');
      }
      const savedFridge = localStorage.getItem('luna-frigo');
      if (savedFridge) {
        const items = JSON.parse(savedFridge);
        if (items.length > 0 && state.fridgeItems.length === 0) {
          dispatch({ type: 'SET_PROFILE', payload: { fridgeItems: items } });
        }
        localStorage.removeItem('luna-frigo');
      }
    } catch {
      // Ignore malformed localStorage — migration is best-effort
    }
  }, []);

  const cycleInfo = getCycleInfo(
    state.lastPeriodDate,
    state.cycleLength,
    state.periodLength
  );

  // Gère un échec d'écriture Supabase de façon non alarmante :
  //  - si la session n'est plus valide (compte de test supprimé, jeton
  //    orphelin), on déconnecte proprement plutôt que de réafficher l'erreur
  //    « Réessaie » à chaque tentative → la personne revient à l'écran de
  //    connexion au lieu de voir des messages rouges en boucle ;
  //  - sinon (souci réseau passager, souci ponctuel), on montre le message.
  const reportSaveError = async (error, message) => {
    console.error('Save error:', error);
    let sessionDead = false;
    try {
      const { error: authErr } = await supabase.auth.getUser();
      // 401/403 = le serveur rejette le jeton (compte supprimé / session
      // expirée). Une simple coupure réseau n'a pas ce statut → pas de
      // déconnexion intempestive dans ce cas.
      if (authErr && (authErr.status === 401 || authErr.status === 403)) sessionDead = true;
    } catch {
      // getUser injoignable (réseau) : on garde la session, on ne déconnecte pas.
    }
    if (sessionDead) {
      await signOut();
      return;
    }
    toast(message, 'error');
  };

  // Save profile to Supabase when state changes (if logged in)
  const saveProfileToSupabase = async () => {
    if (!user || !state.onboardingComplete) return;
    try {
      const { error } = await supabase.from('users').upsert({
        auth_id: user.id,
        name: state.name,
        email: state.email || user.email,
        // Colonne de type date : une chaîne vide provoque l'erreur Postgres
        // 22007 (« invalid input syntax for type date »). On envoie null.
        last_period_date: state.lastPeriodDate || null,
        cycle_length: state.cycleLength,
        period_length: state.periodLength,
        goals: state.goals,
        fitness_level: state.fitnessLevel,
        diet_preferences: state.dietPreferences,
        health_issues: state.healthIssues,
        allergies: state.allergies,
        cooking_level: state.cookingLevel,
        cooking_time: state.cookingTime,
        age: state.age,
        cravings: state.cravings,
        barriers: state.barriers,
        discovery_source: state.discoverySource,
        onboarding_complete: state.onboardingComplete,
        current_phase: cycleInfo?.phase || 'unknown',
      }, { onConflict: 'auth_id' });
      if (error) {
        // supabase-js ne lève pas d'exception : sans cette lecture, un refus
        // du serveur (colonne manquante, policy…) passerait inaperçu.
        await reportSaveError(error, 'Ton profil n\'a pas pu être sauvegardé. Réessaie dans un instant 🌙');
      }
    } catch (e) {
      console.error('Save profile error:', e);
    }
  };

  // Auto-sync to Supabase when key profile settings change
  useEffect(() => {
    if (user && state.onboardingComplete) {
      const timer = setTimeout(() => {
        saveProfileToSupabase();
      }, 500); // debounce 500ms
      return () => clearTimeout(timer);
    }
  }, [
    state.cycleLength,
    state.periodLength,
    state.dietPreferences,
    state.healthIssues,
    state.goals,
    state.fitnessLevel,
    state.name,
    state.allergies,
    state.cookingLevel,
    state.cookingTime,
    state.age,
    state.cravings,
    state.barriers,
    state.discoverySource,
    state.lastPeriodDate,
    state.onboardingComplete,
  ]);

  const saveTrackingToSupabase = async () => {
    // trackingLoadedRef : jamais de sauvegarde avant d'avoir chargé le suivi
    // serveur, sinon un état local vide écraserait tout l'historique.
    if (!user || !state.onboardingComplete || !trackingLoadedRef.current) return;
    try {
      // sanitizeForJson : un caractère de contrôle (ex. collé dans une note)
      // ferait rejeter tout le JSON par Postgres (erreur 22P05).
      const { error } = await supabase.from('user_tracking').upsert(sanitizeForJson({
        auth_id: user.id,
        journal_entries: state.journalEntries,
        sport_sessions: state.sportSessions,
        sport_logs: state.sportLogs,
        period_logs: state.periodLogs,
        check_ins: state.checkIns,
        custom_symptoms: state.customSymptoms,
        temperature_logs: state.temperatureLogs,
        spotting_logs: state.spottingLogs,
        conversations: state.conversations,
        partner_code: state.partnerCode,
        settings: {
          notifications: state.notifications,
          notifPrefs: state.notifPrefs,
          language: state.language,
          smartTracking: state.smartTracking,
          calendarStartDay: state.calendarStartDay,
          favorites: state.favorites,
          fridgeItems: state.fridgeItems,
          shoppingList: state.shoppingList,
          shoppingPeople: state.shoppingPeople,
        },
        updated_at: new Date().toISOString(),
      }), { onConflict: 'auth_id' });
      if (error) {
        await reportSaveError(error, 'Tes données n\'ont pas pu être sauvegardées. Réessaie dans un instant 🌙');
      }
    } catch (e) {
      console.error('Save tracking error:', e);
    }
  };

  useEffect(() => {
    if (user && state.onboardingComplete) {
      const timer = setTimeout(() => {
        saveTrackingToSupabase();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [
    state.journalEntries,
    state.sportSessions,
    state.sportLogs,
    state.periodLogs,
    state.checkIns,
    state.customSymptoms,
    state.temperatureLogs,
    state.spottingLogs,
    state.conversations,
    state.partnerCode,
    state.notifications,
    state.notifPrefs,
    state.language,
    state.smartTracking,
    state.calendarStartDay,
    state.favorites,
    state.fridgeItems,
    state.shoppingList,
    state.shoppingPeople,
  ]);

  // Flush pending saves immediately when the app is backgrounded or closed,
  // so changes made within the debounce window aren't lost. The ref always
  // points to the freshest save closure without re-binding the listener.
  const flushRef = useRef(() => {});
  flushRef.current = () => {
    if (user && state.onboardingComplete) {
      saveTrackingToSupabase();
      saveProfileToSupabase();
    }
  };

  useEffect(() => {
    const flushOnHide = () => {
      if (document.visibilityState === 'hidden') flushRef.current();
    };
    const flushNow = () => flushRef.current();
    document.addEventListener('visibilitychange', flushOnHide);
    window.addEventListener('pagehide', flushNow);
    return () => {
      document.removeEventListener('visibilitychange', flushOnHide);
      window.removeEventListener('pagehide', flushNow);
    };
  }, []);

  // ——— Notifications locales (natif uniquement) ———
  // Reprogramme le plan à chaque ouverture et quand le profil change :
  // fenêtre glissante + notification « retrouvailles » repoussée de 7 j.
  const todayCheckInDone = Boolean(
    state.checkIns.find((c) => {
      const n = new Date();
      const key = `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, '0')}-${String(n.getDate()).padStart(2, '0')}`;
      return c.date === key;
    })
  );
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;
    if (!user || !state.onboardingComplete) return;
    const timer = setTimeout(() => {
      import('../lib/notifications').then(({ syncNotifications }) =>
        syncNotifications({
          name: state.name,
          lastPeriodDate: state.lastPeriodDate,
          cycleLength: state.cycleLength,
          periodLength: state.periodLength,
          healthIssues: state.healthIssues,
          cravings: state.cravings,
          notifications: state.notifications,
          notifPrefs: state.notifPrefs,
          todayCheckInDone,
        })
      );
    }, 1500); // laisse l'ouverture de l'app respirer
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    user,
    state.onboardingComplete,
    state.lastPeriodDate,
    state.cycleLength,
    state.periodLength,
    state.healthIssues,
    state.cravings,
    state.notifications,
    state.notifPrefs,
    todayCheckInDone,
  ]);

  const hour = new Date().getHours();
  const isEvening = hour >= 18;
  const isMorning = hour < 12;

  const greeting = state.name
    ? isEvening
      ? `Bonne soirée ${state.name} 🌙`
      : isMorning
        ? `Bonjour ${state.name} ☀️`
        : `Hello ${state.name} 🌿`
    : isEvening
      ? 'Bonne soirée 🌙'
      : 'Bonjour ☀️';

  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const todayCheckIn = state.checkIns.find((c) => c.date === todayStr);

  const signOut = async () => {
    signedOutRef.current = true;
    trackingLoadedRef.current = false;
    cacheOwnerRef.current = null;
    await supabase.auth.signOut();
    setUser(null);
    localStorage.removeItem('luna-profile');
    dispatch({ type: 'RESET' });
    signedOutRef.current = false;
  };

  return (
    <CycleContext.Provider
      value={{
        ...state,
        dispatch,
        cycleInfo,
        greeting,
        isEvening,
        todayCheckIn,
        user,
        authLoading,
        saveProfileToSupabase,
        signOut,
      }}
    >
      {children}
    </CycleContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components -- hook du contexte, exporté avec son Provider par convention
export function useCycle() {
  const context = useContext(CycleContext);
  if (!context) {
    throw new Error('useCycle must be used within a CycleProvider');
  }
  return context;
}

// eslint-disable-next-line react-refresh/only-export-components -- utilisé par l'Onboarding pour prévisualiser la phase avant enregistrement
export { getCycleInfo, parseLocalDate };
