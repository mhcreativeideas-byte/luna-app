import { createContext, useContext, useReducer, useEffect } from 'react';
import { PHASES } from '../data/phases';

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
  onboardingComplete: false,
  journalEntries: [],
  sportSessions: [],
  sportLogs: [],
  periodLogs: [],
  checkIns: [],
  customSymptoms: [],
  chatHistory: [],
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
  const [state, dispatch] = useReducer(cycleReducer, initialState, (init) => {
    try {
      const saved = localStorage.getItem('luna-profile');
      return saved ? { ...init, ...JSON.parse(saved) } : init;
    } catch {
      return init;
    }
  });


  useEffect(() => {
    localStorage.setItem('luna-profile', JSON.stringify(state));
  }, [state]);

  const cycleInfo = getCycleInfo(
    state.lastPeriodDate,
    state.cycleLength,
    state.periodLength
  );

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

  const todayStr = new Date().toISOString().split('T')[0];
  const todayCheckIn = state.checkIns.find((c) => c.date === todayStr);

  return (
    <CycleContext.Provider
      value={{
        ...state,
        dispatch,
        cycleInfo,
        greeting,
        isEvening,
        todayCheckIn,
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
