import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { CycleProvider, useCycle } from './contexts/CycleContext';
import AppLayout from './components/layout/AppLayout';
import ErrorBoundary from './components/ErrorBoundary';
import Toaster from './components/Toaster';
import Landing from './pages/Landing';

const Auth = lazy(() => import('./pages/Auth'));
const Onboarding = lazy(() => import('./pages/Onboarding'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Calendar = lazy(() => import('./pages/Calendar'));
const Sport = lazy(() => import('./pages/Sport'));
const Alimentation = lazy(() => import('./pages/Alimentation'));
const Sommeil = lazy(() => import('./pages/Sommeil'));
const Extras = lazy(() => import('./pages/Extras'));
const Journal = lazy(() => import('./pages/Journal'));
const CheckIn = lazy(() => import('./pages/CheckIn'));
const Chat = lazy(() => import('./pages/Chat'));
const Settings = lazy(() => import('./pages/Settings'));
const Profil = lazy(() => import('./pages/Profil'));
const Recettes = lazy(() => import('./pages/Recettes'));
const Menu = lazy(() => import('./pages/Menu'));
const MonFrigo = lazy(() => import('./pages/MonFrigo'));
const Admin = lazy(() => import('./pages/Admin'));
const CGU = lazy(() => import('./pages/CGU'));
const Privacy = lazy(() => import('./pages/Privacy'));
const NotFound = lazy(() => import('./pages/NotFound'));

function PageLoader() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: 'linear-gradient(180deg,#F0C4C9 0%,#EDC4B3 50%,#FAF8F5 100%)' }}
    >
      <img src="/logo-luna.png" alt="LUNA" className="w-24 opacity-90 animate-pulse" />
    </div>
  );
}

function ProtectedRoute({ children }) {
  const { onboardingComplete, authLoading } = useCycle();
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
    <ErrorBoundary>
      <BrowserRouter>
        <CycleProvider>
          <Toaster />
          <Suspense fallback={<PageLoader />}>
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
              <Route path="/menu" element={<Menu />} />
              <Route path="/mon-frigo" element={<MonFrigo />} />
              <Route path="/sommeil" element={<Sommeil />} />
              <Route path="/journal" element={<Journal />} />
              <Route path="/profil" element={<Profil />} />
              <Route path="/checkin" element={<CheckIn />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/calendrier" element={<Calendar />} />
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
          </Suspense>
        </CycleProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
