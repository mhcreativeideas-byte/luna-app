import { NavLink } from 'react-router-dom';
import { Sun, Compass, BookOpen, User } from 'lucide-react';
import { useCycle } from '../../contexts/CycleContext';

const navItems = [
  { to: '/dashboard', icon: Sun, label: 'Accueil' },
  { to: '/conseils', icon: Compass, label: 'Conseils' },
  { to: '/explorer', icon: BookOpen, label: 'Explorer' },
  { to: '/profil', icon: User, label: 'Profil' },
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-luna-cream-light/95 backdrop-blur-md border-t border-luna-sage/30 z-50 lg:hidden">
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all duration-300 ${
                isActive ? 'scale-105' : 'opacity-50 hover:opacity-70'
              }`
            }
            style={({ isActive }) =>
              isActive ? { color: '#D94F1E' } : { color: '#B8A89E' }
            }
          >
            <Icon size={22} strokeWidth={isActive => isActive ? 2 : 1.5} />
            <span className="text-[10px] font-semibold font-body">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
