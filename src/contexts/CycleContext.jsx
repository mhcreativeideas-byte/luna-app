import { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { PHASES } from '../data/phases';
import { supabase } from '../lib/supabase';

const CycleContext = createContext();

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
  onboardingComplete: false,
  journalEntries: [],
  sportSessions: [],
  sportLogs: [],
  periodLogs: [],
  checkIns: [],
  customSymptoms: [],
  temperatureLogs: {},
  spottingLogs: [],
  chatHistory: [],
  conversations: [],
  activeConversationId: null,
  notifications: true,
  language: 'fr',
  smartTracking: false,
  calendarStartDay: 'monday',
  partnerCode: null,
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
      // Recalculate cycle length if we have a previous period start
      const prevStart = state.lastPeriodDate;
      let newCycleLength = state.cycleLength;
      if (prevStart && prevStart !== date) {
        const diff = Math.abs(Math.floor((new Date(date) - new Date(prevStart)) / (1000 * 60 * 60 * 24)));
        if (diff > 15 && diff < 50) {
          newCycleLength = diff;
        }
      }
      return {
        ...state,
        lastPeriodDate: date,
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
    case 'ADD_CHAT_MESSAGE':
      return { ...state, chatHistory: [...state.chatHistory, action.payload] };
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
      const convs = state.conversations.map((c) =>
        c.id === action.payload.id ? { ...c, archived: !c.archived } : c
      );
      const newActiveId = state.activeConversationId === action.payload.id
        ? (convs.find((c) => !c.archived && c.id !== action.payload.id)?.id || null)
        : state.activeConversationId;
      return { ...state, conversations: convs, activeConversationId: newActiveId };
    }
    case 'UPDATE_SETTINGS':
      return { ...state, ...action.payload };
    case 'LOAD_DEMO_DATA':
      return { ...state, journalEntries: action.payload.entries, sportSessions: action.payload.sportSessions || [] };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

function getCycleInfo(lastPeriodDate, cycleLength, periodLength) {
  if (!lastPeriodDate) return null;

  const today = new Date();
  const lastPeriod = new Date(lastPeriodDate);
  const diffTime = today.getTime() - lastPeriod.getTime();
  const daysSinceLastPeriod = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const currentDay = ((daysSinceLastPeriod % cycleLength) + cycleLength) % cycleLength + 1;

  const ovulationDay = cycleLength - 14;
  const ovulatoryStart = ovulationDay - 1;
  const ovulatoryEnd = ovulationDay + 1;

  let phase, phaseDay, phaseDuration;

  if (currentDay <= periodLength) {
    phase = 'menstrual';
    phaseDay = currentDay;
    phaseDuration = periodLength;
  } else if (currentDay <= ovulatoryStart) {
    phase = 'follicular';
    phaseDay = currentDay - periodLength;
    phaseDuration = ovulatoryStart - periodLength;
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

  const [state, dispatch] = useReducer(cycleReducer, initialState, (init) => {
    try {
      const saved = localStorage.getItem('luna-profile');
      return saved ? { ...init, ...JSON.parse(saved) } : init;
    } catch {
      return init;
    }
  });

  // Listen to Supabase auth changes
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfileFromSupabase(session.user.id);
      }
      setAuthLoading(false);
    });

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfileFromSupabase(session.user.id);
      }
      setAuthLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Load profile from Supabase if exists
  const loadProfileFromSupabase = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('auth_id', userId)
        .single();

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
          },
        });
        if (data.onboarding_complete) {
          dispatch({ type: 'COMPLETE_ONBOARDING' });
        }
      }
    } catch (e) {
      console.log('Load profile error:', e);
    }
  };

  useEffect(() => {
    localStorage.setItem('luna-profile', JSON.stringify(state));
  }, [state]);

  const cycleInfo = getCycleInfo(
    state.lastPeriodDate,
    state.cycleLength,
    state.periodLength
  );

  // Save profile to Supabase when state changes (if logged in)
  const saveProfileToSupabase = async () => {
    if (!user || !state.onboardingComplete) return;
    try {
      await supabase.from('users').upsert({
        auth_id: user.id,
        name: state.name,
        email: state.email || user.email,
        last_period_date: state.lastPeriodDate,
        cycle_length: state.cycleLength,
        period_length: state.periodLength,
        goals: state.goals,
        fitness_level: state.fitnessLevel,
        diet_preferences: state.dietPreferences,
        health_issues: state.healthIssues,
        allergies: state.allergies,
        cooking_level: state.cookingLevel,
        cooking_time: state.cookingTime,
        onboarding_complete: state.onboardingComplete,
        current_phase: cycleInfo?.phase || 'unknown',
      }, { onConflict: 'auth_id' });
    } catch (e) {
      console.log('Save profile error:', e);
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
    await supabase.auth.signOut();
    setUser(null);
    localStorage.removeItem('luna-profile');
    dispatch({ type: 'RESET' });
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

export function useCycle() {
  const context = useContext(CycleContext);
  if (!context) {
    throw new Error('useCycle must be used within a CycleProvider');
  }
  return context;
}

export { getCycleInfo };
