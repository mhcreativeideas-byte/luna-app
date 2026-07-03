import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { Capacitor } from '@capacitor/core';
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
const RecipesList = lazy(() => import('./pages/RecipesList'));
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
      <img src="/logo-luna.svg" alt="LUNA" className="w-24 opacity-90 animate-pulse" />
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

// Mise en page simple pour les pages légales, accessibles sans connexion
// (Apple exige une politique de confidentialité publiquement accessible).
function LegalPage({ children }) {
  return (
    <div className="min-h-screen bg-luna-bg">
      <div className="max-w-4xl mx-auto px-4 pt-[calc(env(safe-area-inset-top)+1.5rem)] pb-[calc(env(safe-area-inset-bottom)+2rem)]">
        {children}
      </div>
    </div>
  );
}

// Sur le WEB, l'app est « murée » : seule la vitrine (liste d'attente), l'admin
// et les pages légales sont accessibles. Toute autre URL renvoie vers la vitrine.
// Rien n'est supprimé — l'app native iPhone (Capacitor) garde TOUTES ses routes.
const IS_NATIVE = Capacitor.isNativePlatform();

function WebRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/conditions" element={<LegalPage><CGU /></LegalPage>} />
      <Route path="/confidentialite" element={<LegalPage><Privacy /></LegalPage>} />
      {/* Tout le reste (app, auth, onboarding…) est fermé sur le web → vitrine */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function NativeRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomeRedirect />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/onboarding" element={<AuthGuard><Onboarding /></AuthGuard>} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/conditions" element={<LegalPage><CGU /></LegalPage>} />
      <Route path="/confidentialite" element={<LegalPage><Privacy /></LegalPage>} />
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
        <Route path="/recettes-liste" element={<RecipesList />} />
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
      </Route>
      {/* Legacy routes redirect */}
      <Route path="/conseils" element={<Navigate to="/alimentation" replace />} />
      <Route path="/explorer" element={<Navigate to="/dashboard" replace />} />
      <Route path="/food" element={<Navigate to="/alimentation" replace />} />
      <Route path="/sleep" element={<Navigate to="/plus" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <CycleProvider>
          <Toaster />
          <Suspense fallback={<PageLoader />}>
            {IS_NATIVE ? <NativeRoutes /> : <WebRoutes />}
          </Suspense>
        </CycleProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
