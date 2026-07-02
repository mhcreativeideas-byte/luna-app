import { NavLink, useLocation } from 'react-router-dom';
import { UtensilsCrossed, CalendarDays, Apple } from 'lucide-react';
import { useCycle } from '../../contexts/CycleContext';

const navItems = [
  { to: '/recettes', icon: UtensilsCrossed, label: 'Manger' },
  { to: '/dashboard', icon: CalendarDays, label: 'Mon cycle' },
  { to: '/alimentation', icon: Apple, label: 'Aliments' },
];

export default function BottomNav() {
  const { cycleInfo } = useCycle();
  const location = useLocation();
  const phaseData = cycleInfo?.phaseData || { color: '#B0A5AA', colorDark: '#6B5E62', bgColor: '#F5F2F0' };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 lg:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {/* Glass background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(255, 255, 255, 0.4)',
          backdropFilter: 'blur(30px)',
          WebkitBackdropFilter: 'blur(30px)',
          borderTop: '0.5px solid rgba(255, 255, 255, 0.5)',
        }}
      />

      <div className="relative flex items-center justify-around" style={{ height: 64, padding: '0 8px' }}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          const Icon = item.icon;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className="flex flex-col items-center gap-[3px] flex-1 relative"
              style={{ paddingTop: 12, paddingBottom: 8 }}
            >
              {/* Glow line */}
              {isActive && (
                <div
                  style={{
                    position: 'absolute',
                    top: -1,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 44,
                    height: 3,
                    borderRadius: '0 0 3px 3px',
                    backgroundColor: phaseData.color,
                    boxShadow: `0 2px 14px ${phaseData.color}80, 0 0 6px ${phaseData.color}4D`,
                  }}
                />
              )}

              <Icon
                size={22}
                strokeWidth={isActive ? 2 : 1.5}
                fill="none"
                stroke={isActive ? phaseData.color : 'rgba(45, 34, 38, 0.28)'}
                className="transition-all duration-300"
              />

              <span
                className="font-body leading-none"
                style={{
                  fontSize: 10,
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? phaseData.color : 'rgba(45, 34, 38, 0.3)',
                  letterSpacing: '-0.01em',
                  transition: 'color 0.3s, font-weight 0.3s',
                }}
              >
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
