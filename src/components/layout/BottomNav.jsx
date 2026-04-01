import { NavLink } from 'react-router-dom';
import { Home, Dumbbell, UtensilsCrossed, Moon, BookOpen } from 'lucide-react';

const navItems = [
  { to: '/dashboard', icon: Home, label: 'Accueil' },
  { to: '/sport', icon: Dumbbell, label: 'Sport' },
  { to: '/alimentation', icon: UtensilsCrossed, label: 'Food' },
  { to: '/sommeil', icon: Moon, label: 'Sommeil' },
  { to: '/journal', icon: BookOpen, label: 'Journal' },
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-100 z-50 lg:hidden">
      <div className="flex justify-around items-center h-16 px-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition-all duration-300 ${
                isActive ? '' : 'opacity-40 hover:opacity-60'
              }`
            }
            style={({ isActive }) =>
              isActive ? { color: '#C4727F' } : { color: '#2D2226' }
            }
          >
            {({ isActive }) => (
              <>
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    isActive ? 'bg-[#FDE8EB]' : ''
                  }`}
                >
                  <Icon size={20} strokeWidth={isActive ? 2 : 1.5} />
                </div>
                <span className="text-[9px] font-semibold font-body leading-none">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
