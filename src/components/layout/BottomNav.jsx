import { NavLink } from 'react-router-dom';
import { UtensilsCrossed, ChefHat, CalendarDays, MessageCircle, BookOpen } from 'lucide-react';
import { useCycle } from '../../contexts/CycleContext';

const leftItems = [
  { to: '/alimentation', icon: UtensilsCrossed, label: 'Nutrition' },
  { to: '/recettes', icon: ChefHat, label: 'Recettes' },
];

const rightItems = [
  { to: '/journal', icon: BookOpen, label: 'Journal' },
  { to: '/chat', icon: MessageCircle, label: 'LUNA' },
];

const centerItem = { to: '/dashboard', icon: CalendarDays, label: 'Cycle' };

function NavItem({ to, icon: Icon, label, phaseData }) {
  return (
    <NavLink
      key={to}
      to={to}
      className={({ isActive }) =>
        `flex flex-col items-center gap-0.5 flex-1 py-1.5 transition-all duration-300 relative ${
          isActive ? '' : 'opacity-40 hover:opacity-60'
        }`
      }
      style={({ isActive }) =>
        isActive ? { color: phaseData.color } : { color: '#2D2226' }
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[3px] rounded-full"
              style={{ backgroundColor: phaseData.color }}
            />
          )}
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center transition-all"
            style={isActive ? { backgroundColor: phaseData.bgColor } : {}}
          >
            <Icon size={18} strokeWidth={isActive ? 2 : 1.5} />
          </div>
          <span className="text-[8px] font-semibold font-body leading-none tracking-tight">{label}</span>
        </>
      )}
    </NavLink>
  );
}

export default function BottomNav() {
  const { cycleInfo } = useCycle();
  const phaseData = cycleInfo?.phaseData || { color: '#B0A5AA', colorDark: '#6B5E62', bgColor: '#F5F2F0' };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-100 z-50 lg:hidden">
      <div className="flex items-end justify-around px-1 h-[68px] relative">
        {/* Left items */}
        {leftItems.map((item) => (
          <NavItem key={item.to} {...item} phaseData={phaseData} />
        ))}

        {/* Center — Cycle hero button */}
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
                    ? `linear-gradient(145deg, ${phaseData.color} 0%, ${phaseData.colorDark} 100%)`
                    : `linear-gradient(145deg, ${phaseData.bgColor} 0%, ${phaseData.bgColor} 100%)`,
                  boxShadow: isActive
                    ? `0 4px 16px ${phaseData.color}66`
                    : `0 2px 10px ${phaseData.color}26`,
                }}
              >
                <CalendarDays size={22} strokeWidth={2} className="text-white" />
              </div>
              <span className="h-[9px] mt-1" />
            </>
          )}
        </NavLink>

        {/* Right items */}
        {rightItems.map((item) => (
          <NavItem key={item.to} {...item} phaseData={phaseData} />
        ))}
      </div>
    </nav>
  );
}
