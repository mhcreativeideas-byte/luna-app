import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Dumbbell, UtensilsCrossed, Moon, BookHeart } from 'lucide-react';
import { useCycle } from '../../contexts/CycleContext';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Accueil' },
  { to: '/sport', icon: Dumbbell, label: 'Sport' },
  { to: '/food', icon: UtensilsCrossed, label: 'Food' },
  { to: '/sleep', icon: Moon, label: 'Sommeil' },
  { to: '/journal', icon: BookHeart, label: 'Journal' },
];

export default function BottomNav() {
  const { cycleInfo } = useCycle();
  const activeColor = cycleInfo?.phaseData?.color || '#E8A0BF';

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-luna-rose/20 z-50 lg:hidden">
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all duration-300 ${
                isActive ? 'scale-105' : 'opacity-60 hover:opacity-80'
              }`
            }
            style={({ isActive }) =>
              isActive ? { color: activeColor } : { color: '#6B5B73' }
            }
          >
            <Icon size={22} strokeWidth={1.8} />
            <span className="text-[10px] font-semibold font-body">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
