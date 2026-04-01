import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CycleProvider, useCycle } from './contexts/CycleContext';
import AppLayout from './components/layout/AppLayout';
import Landing from './pages/Landing';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import Sport from './pages/Sport';
import Alimentation from './pages/Alimentation';
import Sommeil from './pages/Sommeil';
import Journal from './pages/Journal';
import CheckIn from './pages/CheckIn';
import Chat from './pages/Chat';
import Calendar from './pages/Calendar';
import Settings from './pages/Settings';
import Profil from './pages/Profil';
import Admin from './pages/Admin';

function ProtectedRoute({ children }) {
  const { onboardingComplete } = useCycle();
  if (!onboardingComplete) return <Navigate to="/" replace />;
  return children;
}

function HomeRedirect() {
  const { onboardingComplete } = useCycle();
  if (onboardingComplete) return <Navigate to="/dashboard" replace />;
  return <Landing />;
}

function App() {
  return (
    <BrowserRouter>
      <CycleProvider>
        <Routes>
          <Route path="/" element={<HomeRedirect />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/admin" element={<Admin />} />
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/sport" element={<Sport />} />
            <Route path="/alimentation" element={<Alimentation />} />
            <Route path="/sommeil" element={<Sommeil />} />
            <Route path="/journal" element={<Journal />} />
            <Route path="/profil" element={<Profil />} />
            <Route path="/checkin" element={<CheckIn />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/calendrier" element={<Calendar />} />
            <Route path="/parametres" element={<Settings />} />
          </Route>
          {/* Legacy routes redirect */}
          <Route path="/conseils" element={<Navigate to="/alimentation" replace />} />
          <Route path="/explorer" element={<Navigate to="/dashboard" replace />} />
          <Route path="/food" element={<Navigate to="/alimentation" replace />} />
          <Route path="/sleep" element={<Navigate to="/sommeil" replace />} />
        </Routes>
      </CycleProvider>
    </BrowserRouter>
  );
}

export default App;
