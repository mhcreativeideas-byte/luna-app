import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Dumbbell, UtensilsCrossed, Moon, BookHeart, LogOut } from 'lucide-react';
import { useCycle } from '../../contexts/CycleContext';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Tableau de bord' },
  { to: '/sport', icon: Dumbbell, label: 'Sport & Mouvement' },
  { to: '/food', icon: UtensilsCrossed, label: 'Alimentation' },
  { to: '/sleep', icon: Moon, label: 'Sommeil & Énergie' },
  { to: '/journal', icon: BookHeart, label: 'Mon Journal' },
];

export default function Sidebar() {
  const { name, cycleInfo, dispatch } = useCycle();
  const activeColor = cycleInfo?.phaseData?.color || '#E8A0BF';
  const activeBg = cycleInfo?.phaseData?.bgColor || '#FFF0F5';

  return (
    <aside className="hidden lg:flex flex-col w-64 min-h-screen bg-white/80 backdrop-blur-md border-r border-luna-sage/30 px-4 py-6 fixed left-0 top-0 z-40">
      {/* Logo */}
      <div className="mb-8 px-2">
        <img src="/logo-luna.png" alt="LUNA" className="w-28 mb-2" />
        {name && (
          <p className="text-sm text-luna-text-secondary mt-1 font-body">
            Salut, {name}
          </p>
        )}
      </div>

      {/* Phase indicator */}
      {cycleInfo && (
        <div
          className="rounded-luna p-3 mb-6 text-center"
          style={{ backgroundColor: activeBg }}
        >
          <span className="text-2xl">{cycleInfo.phaseData.icon}</span>
          <p className="text-sm font-semibold mt-1" style={{ color: cycleInfo.phaseData.colorDark }}>
            {cycleInfo.phaseData.shortName}
          </p>
          <p className="text-xs text-luna-text-secondary">
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
                isActive ? '' : 'text-luna-text-secondary hover:bg-luna-cream/50'
              }`
            }
            style={({ isActive }) =>
              isActive
                ? { backgroundColor: activeBg, color: cycleInfo?.phaseData?.colorDark || '#C76DA2' }
                : {}
            }
          >
            <Icon size={20} strokeWidth={1.8} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Reset */}
      <button
        onClick={() => {
          if (window.confirm('Réinitialiser ton profil LUNA ?')) {
            dispatch({ type: 'RESET' });
            localStorage.removeItem('luna-profile');
            window.location.href = '/';
          }
        }}
        className="flex items-center gap-2 px-3 py-2 text-sm text-luna-text-secondary hover:text-luna-rose-dark transition-colors mt-4 font-body"
      >
        <LogOut size={16} />
        Réinitialiser
      </button>
    </aside>
  );
}
