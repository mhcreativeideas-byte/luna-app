import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CycleProvider, useCycle } from './contexts/CycleContext';
import AppLayout from './components/layout/AppLayout';
import Landing from './pages/Landing';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import Conseils from './pages/Conseils';
import Explorer from './pages/Explorer';
import Profil from './pages/Profil';
import CheckIn from './pages/CheckIn';
import Chat from './pages/Chat';
import Calendar from './pages/Calendar';
import Settings from './pages/Settings';
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
            <Route path="/conseils" element={<Conseils />} />
            <Route path="/explorer" element={<Explorer />} />
            <Route path="/profil" element={<Profil />} />
            <Route path="/checkin" element={<CheckIn />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/calendrier" element={<Calendar />} />
            <Route path="/parametres" element={<Settings />} />
          </Route>
          {/* Legacy routes redirect */}
          <Route path="/sport" element={<Navigate to="/conseils" replace />} />
          <Route path="/food" element={<Navigate to="/conseils" replace />} />
          <Route path="/sleep" element={<Navigate to="/explorer" replace />} />
          <Route path="/journal" element={<Navigate to="/profil" replace />} />
        </Routes>
      </CycleProvider>
    </BrowserRouter>
  );
}

export default App;
