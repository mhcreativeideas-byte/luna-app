import { NavLink } from 'react-router-dom';
import { Home, Dumbbell, UtensilsCrossed, Moon, BookOpen, CalendarDays, MessageCircle, Settings, LogOut } from 'lucide-react';
import { useCycle } from '../../contexts/CycleContext';

const navItems = [
  { to: '/dashboard', icon: Home, label: 'Accueil' },
  { to: '/calendrier', icon: CalendarDays, label: 'Calendrier' },
  { to: '/journal', icon: BookOpen, label: 'Journal' },
  { to: '/alimentation', icon: UtensilsCrossed, label: 'Alimentation' },
  { to: '/sport', icon: Dumbbell, label: 'Sport' },
  { to: '/sommeil', icon: Moon, label: 'Sommeil' },
  { to: '/chat', icon: MessageCircle, label: 'LUNA' },
];

export default function Sidebar() {
  const { name, cycleInfo, dispatch } = useCycle();

  return (
    <aside className="hidden lg:flex flex-col w-64 min-h-screen bg-white/80 backdrop-blur-md border-r border-gray-100 px-4 py-6 fixed left-0 top-0 z-40">
      {/* Logo */}
      <div className="mb-8 px-2">
        <img src="/logo-luna.png" alt="LUNA" className="h-8 object-contain" />
        {name && (
          <p className="text-sm text-luna-text-muted mt-2 font-body">
            Salut, {name}
          </p>
        )}
      </div>

      {/* Phase indicator */}
      {cycleInfo && (
        <div
          className="rounded-[20px] p-4 mb-6"
          style={{ backgroundColor: cycleInfo.phaseData.bgColor }}
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">{cycleInfo.phaseData.icon}</span>
            <div>
              <p className="text-sm font-semibold font-body" style={{ color: cycleInfo.phaseData.colorDark }}>
                {cycleInfo.phaseData.shortName}
              </p>
              <p className="text-xs text-luna-text-muted font-body">
                Jour {cycleInfo.currentDay}/{cycleInfo.cycleLength}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-[14px] transition-all duration-300 text-sm font-body font-semibold ${
                isActive ? 'text-[#C4727F]' : 'text-luna-text-muted hover:bg-gray-50'
              }`
            }
            style={({ isActive }) => isActive ? { backgroundColor: '#FDE8EB' } : {}}
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
          if (window.confirm('Te déconnecter de LUNA ?')) {
            window.location.href = '/';
          }
        }}
        className="flex items-center gap-2 px-3 py-2 text-sm text-luna-text-hint hover:text-[#C4727F] transition-colors mt-1 font-body"
      >
        <LogOut size={16} />
        Déconnexion
      </button>
    </aside>
  );
}
