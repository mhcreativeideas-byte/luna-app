import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CycleProvider, useCycle } from './contexts/CycleContext';
import AppLayout from './components/layout/AppLayout';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import Sport from './pages/Sport';
import Alimentation from './pages/Alimentation';
import Sommeil from './pages/Sommeil';
import Extras from './pages/Extras';
import Journal from './pages/Journal';
import CheckIn from './pages/CheckIn';
import Chat from './pages/Chat';
// Calendar is now merged into Dashboard
import Settings from './pages/Settings';
import Profil from './pages/Profil';
import Recettes from './pages/Recettes';
import MonFrigo from './pages/MonFrigo';
import Admin from './pages/Admin';
import CGU from './pages/CGU';
import Privacy from './pages/Privacy';
import NotFound from './pages/NotFound';

function ProtectedRoute({ children }) {
  const { onboardingComplete, user, authLoading } = useCycle();
  if (authLoading) return null;
  if (!onboardingComplete) return <Navigate to="/" replace />;
  return children;
}

function AuthGuard({ children }) {
  const { user, authLoading } = useCycle();
  if (authLoading) return null;
  if (!user) return <Navigate to="/auth" replace />;
  return children;
}

function HomeRedirect() {
  const { onboardingComplete, user, authLoading } = useCycle();
  if (authLoading) return null;
  if (user && onboardingComplete) return <Navigate to="/dashboard" replace />;
  if (user && !onboardingComplete) return <Navigate to="/onboarding" replace />;
  return <Landing />;
}

function App() {
  return (
    <BrowserRouter>
      <CycleProvider>
        <Routes>
          <Route path="/" element={<HomeRedirect />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/onboarding" element={<AuthGuard><Onboarding /></AuthGuard>} />
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
            <Route path="/recettes" element={<Recettes />} />
            <Route path="/mon-frigo" element={<MonFrigo />} />
            <Route path="/sommeil" element={<Sommeil />} />
            <Route path="/journal" element={<Journal />} />
            <Route path="/profil" element={<Profil />} />
            <Route path="/checkin" element={<CheckIn />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/calendrier" element={<Navigate to="/dashboard" replace />} />
            <Route path="/plus" element={<Extras />} />
            <Route path="/parametres" element={<Settings />} />
            <Route path="/conditions" element={<CGU />} />
            <Route path="/confidentialite" element={<Privacy />} />
          </Route>
          {/* Legacy routes redirect */}
          <Route path="/conseils" element={<Navigate to="/alimentation" replace />} />
          <Route path="/explorer" element={<Navigate to="/dashboard" replace />} />
          <Route path="/food" element={<Navigate to="/alimentation" replace />} />
          <Route path="/sleep" element={<Navigate to="/plus" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </CycleProvider>
    </BrowserRouter>
  );
}

export default App;
