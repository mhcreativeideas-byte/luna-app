import { createContext, useContext, useReducer, useEffect } from 'react';
import { PHASES } from '../data/phases';

const CycleContext = createContext();

const initialState = {
  name: '',
  lastPeriodDate: '',
  cycleLength: 28,
  periodLength: 5,
  goals: [],
  fitnessLevel: 'intermediate',
  dietPreferences: ['omnivore'],
  healthIssues: [],
  onboardingComplete: false,
  journalEntries: [],
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

  const nextPeriodIn = cycleLength - currentDay;

  return {
    currentDay,
    cycleLength,
    phase,
    phaseDay,
    phaseDuration,
    phaseData: PHASES[phase],
    nextPeriodIn,
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

  const isEvening = new Date().getHours() >= 18;

  const greeting = state.name
    ? isEvening
      ? `Bonne soirée ${state.name} 🌙`
      : `Bonjour ${state.name} 🌸`
    : isEvening
      ? 'Bonne soirée 🌙'
      : 'Bonjour 🌸';

  return (
    <CycleContext.Provider
      value={{
        ...state,
        dispatch,
        cycleInfo,
        greeting,
        isEvening,
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
