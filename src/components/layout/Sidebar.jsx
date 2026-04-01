import { NavLink } from 'react-router-dom';
import { Sun, Compass, BookOpen, User, LogOut, Settings } from 'lucide-react';
import { useCycle } from '../../contexts/CycleContext';

const navItems = [
  { to: '/dashboard', icon: Sun, label: 'Accueil' },
  { to: '/conseils', icon: Compass, label: 'Conseils' },
  { to: '/explorer', icon: BookOpen, label: 'Explorer' },
  { to: '/profil', icon: User, label: 'Profil' },
];

export default function Sidebar() {
  const { name, cycleInfo, dispatch } = useCycle();

  return (
    <aside className="hidden lg:flex flex-col w-64 min-h-screen bg-luna-cream-light/80 backdrop-blur-md border-r border-luna-sage/20 px-4 py-6 fixed left-0 top-0 z-40">
      {/* Logo */}
      <div className="mb-8 px-2">
        <img src="/logo-luna.png" alt="LUNA" className="w-28 mb-2" />
        {name && (
          <p className="text-sm text-luna-text-muted mt-1 font-body">
            Salut, {name}
          </p>
        )}
      </div>

      {/* Phase indicator */}
      {cycleInfo && (
        <div
          className="rounded-luna p-3 mb-6 text-center"
          style={{ backgroundColor: cycleInfo.phaseData.bgColor }}
        >
          <span className="text-2xl">{cycleInfo.phaseData.icon}</span>
          <p className="text-sm font-semibold mt-1" style={{ color: cycleInfo.phaseData.colorDark }}>
            {cycleInfo.phaseData.shortName}
          </p>
          <p className="text-xs text-luna-text-muted">
            Jour {cycleInfo.currentDay}/{cycleInfo.cycleLength}
          </p>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-luna-sm transition-all duration-300 text-sm font-body font-semibold ${
                isActive ? 'bg-luna-orange/10 text-luna-orange' : 'text-luna-text-muted hover:bg-luna-cream-card/50'
              }`
            }
          >
            <Icon size={20} strokeWidth={1.8} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Settings & Reset */}
      <NavLink
        to="/parametres"
        className="flex items-center gap-2 px-3 py-2 text-sm text-luna-text-muted hover:text-luna-text transition-colors font-body"
      >
        <Settings size={16} />
        Paramètres
      </NavLink>
      <button
        onClick={() => {
          if (window.confirm('Réinitialiser ton profil LUNA ?')) {
            dispatch({ type: 'RESET' });
            localStorage.removeItem('luna-profile');
            window.location.href = '/';
          }
        }}
        className="flex items-center gap-2 px-3 py-2 text-sm text-luna-text-hint hover:text-luna-orange transition-colors mt-1 font-body"
      >
        <LogOut size={16} />
        Réinitialiser
      </button>
    </aside>
  );
}
