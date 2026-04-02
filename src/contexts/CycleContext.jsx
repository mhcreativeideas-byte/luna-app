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
  checkIns: [],
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
