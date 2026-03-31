import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CycleProvider, useCycle } from './contexts/CycleContext';
import AppLayout from './components/layout/AppLayout';
import Landing from './pages/Landing';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import Sport from './pages/Sport';
import Food from './pages/Food';
import Sleep from './pages/Sleep';
import Journal from './pages/Journal';
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
            <Route path="/food" element={<Food />} />
            <Route path="/sleep" element={<Sleep />} />
            <Route path="/journal" element={<Journal />} />
          </Route>
        </Routes>
      </CycleProvider>
    </BrowserRouter>
  );
}

export default App;
