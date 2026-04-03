import { NavLink } from 'react-router-dom';
import { Home, UtensilsCrossed, Refrigerator, CalendarDays, MessageCircle, LayoutGrid } from 'lucide-react';

const leftItems = [
  { to: '/alimentation', icon: UtensilsCrossed, label: 'Food' },
  { to: '/mon-frigo', icon: Refrigerator, label: 'Frigo' },
];

const rightItems = [
  { to: '/calendrier', icon: CalendarDays, label: 'Cycle' },
  { to: '/chat', icon: MessageCircle, label: 'LUNA' },
];

const centerItem = { to: '/dashboard', icon: Home, label: 'Accueil' };

function NavItem({ to, icon: Icon, label }) {
  return (
    <NavLink
      key={to}
      to={to}
      className={({ isActive }) =>
        `flex flex-col items-center gap-0.5 flex-1 py-1.5 transition-all duration-300 ${
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
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
              isActive ? 'bg-[#FDE8EB]' : ''
            }`}
          >
            <Icon size={18} strokeWidth={isActive ? 2 : 1.5} />
          </div>
          <span className="text-[9px] font-semibold font-body leading-none">{label}</span>
        </>
      )}
    </NavLink>
  );
}

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-100 z-50 lg:hidden">
      <div className="flex items-end justify-around px-1 h-[68px] relative">
        {/* Left items */}
        {leftItems.map((item) => (
          <NavItem key={item.to} {...item} />
        ))}

        {/* Center — Accueil hero button */}
        <NavLink
          to={centerItem.to}
          className="flex flex-col items-center flex-1 -mt-5 relative"
        >
          {({ isActive }) => (
            <>
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300"
                style={{
                  background: isActive
                    ? 'linear-gradient(145deg, #C4727F 0%, #D4846A 50%, #E8A87C 100%)'
                    : 'linear-gradient(145deg, #E8C5C9 0%, #E2BEB0 50%, #F0D4C0 100%)',
                  boxShadow: isActive
                    ? '0 4px 16px rgba(196, 114, 127, 0.4)'
                    : '0 2px 10px rgba(196, 114, 127, 0.15)',
                }}
              >
                <Home size={22} strokeWidth={2} className="text-white" />
              </div>
              <span className="h-[9px] mt-1" />
            </>
          )}
        </NavLink>

        {/* Right items */}
        {rightItems.map((item) => (
          <NavItem key={item.to} {...item} />
        ))}
      </div>
    </nav>
  );
}
