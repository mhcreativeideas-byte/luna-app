import { NavLink } from 'react-router-dom';
import { UtensilsCrossed, ChefHat, CalendarDays, Refrigerator, LayoutGrid } from 'lucide-react';
import { useCycle } from '../../contexts/CycleContext';

const leftItems = [
  { to: '/recettes', icon: ChefHat, label: 'Recettes' },
  { to: '/mon-frigo', icon: Refrigerator, label: 'Frigo' },
];

const rightItems = [
  { to: '/alimentation', icon: UtensilsCrossed, label: 'Nutrition' },
  { to: '/plus', icon: LayoutGrid, label: 'Plus' },
];

const centerItem = { to: '/dashboard', icon: CalendarDays, label: 'Cycle' };

function NavItem({ to, icon: Icon, label, phaseData }) {
  return (
    <NavLink
      key={to}
      to={to}
      className="flex flex-col items-center gap-0.5 flex-1 py-1.5 transition-all duration-300 relative"
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[3px] rounded-full"
              style={{ backgroundColor: phaseData.color }}
            />
          )}
          {/* Icône estompée quand inactive (hiérarchie visuelle) */}
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${isActive ? '' : 'opacity-40 group-hover:opacity-60'}`}
            style={isActive ? { backgroundColor: phaseData.bgColor, color: phaseData.color } : { color: '#2D2226' }}
          >
            <Icon size={18} strokeWidth={isActive ? 2 : 1.5} />
          </div>
          {/* Label en couleur pleine lisible (WCAG) — pas d'opacity sur le texte */}
          <span
            className="text-[8px] font-semibold font-body leading-none tracking-tight"
            style={{ color: isActive ? phaseData.color : '#756568' }}
          >
            {label}
          </span>
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
          aria-label={centerItem.label}
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
