/**
 * Luna Illustrations — Minimalist line-art SVGs
 * Style: organic fluid curves, warm muted mauve (#7A6B63), editorial wellness aesthetic
 * Inspired by the Luna brand pictograms
 */

const strokeColor = '#7A6B63';
const strokeWidth = 1.5;

// Brand symbol: circle with crescent moon and wave
export function BrandSymbol({ size = 64, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" className={className}>
      <circle cx="40" cy="40" r="28" stroke={strokeColor} strokeWidth={strokeWidth} />
      <path d="M52 28C52 28 44 34 44 44C44 54 52 56 52 56" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="M28 48C32 44 38 42 44 44C50 46 54 50 56 54" stroke={strokeColor} strokeWidth={strokeWidth + 0.5} strokeLinecap="round" />
    </svg>
  );
}

// Sport/Yoga: person in lotus pose with fluid curves
export function SportIcon({ size = 48, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none" className={className}>
      <circle cx="30" cy="14" r="4" stroke={strokeColor} strokeWidth={strokeWidth} />
      <path d="M20 42C20 42 24 28 30 24C36 28 40 42 40 42" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="M16 32C20 30 24 26 30 24C36 26 40 30 44 32" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="M22 18C26 22 30 24 30 24" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" opacity="0.5" />
      <path d="M38 18C34 22 30 24 30 24" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" opacity="0.5" />
      <circle cx="30" cy="30" r="20" stroke={strokeColor} strokeWidth={1} strokeDasharray="2 4" opacity="0.3" />
    </svg>
  );
}

// Food/Nutrition: leaf with organic fruit shape
export function FoodIcon({ size = 48, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none" className={className}>
      <circle cx="30" cy="32" r="14" stroke={strokeColor} strokeWidth={strokeWidth} />
      <path d="M30 18C30 18 36 14 38 8" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="M38 8C38 8 40 14 36 20" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="M32 20C32 20 28 26 24 28" stroke={strokeColor} strokeWidth={1} strokeLinecap="round" opacity="0.4" />
      <circle cx="30" cy="32" r="3" stroke={strokeColor} strokeWidth={1} opacity="0.3" />
    </svg>
  );
}

// Sleep: crescent moon with clouds
export function SleepIcon({ size = 48, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none" className={className}>
      <path d="M36 16C28 16 22 24 22 32C22 40 28 46 36 46C32 44 30 38 30 32C30 26 32 20 36 16Z" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M18 38C16 38 14 40 14 42C14 44 16 46 18 46C20 46 22 46 24 46C22 44 20 42 20 40C20 38 18 38 18 38Z" stroke={strokeColor} strokeWidth={1.2} strokeLinecap="round" opacity="0.5" />
      <path d="M28 44C26 44 24 44 24 46C26 46 28 46 30 46" stroke={strokeColor} strokeWidth={1} strokeLinecap="round" opacity="0.3" />
    </svg>
  );
}

// Journal: elegant feather/plume
export function JournalIcon({ size = 48, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none" className={className}>
      <path d="M38 8C38 8 20 28 18 48" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="M38 8C38 8 42 16 40 24C38 32 28 40 18 48" stroke={strokeColor} strokeWidth={1} strokeLinecap="round" opacity="0.5" />
      <path d="M38 8C38 8 34 16 34 24C34 32 24 40 18 48" stroke={strokeColor} strokeWidth={1} strokeLinecap="round" opacity="0.3" />
      <path d="M18 48C18 48 22 46 24 50" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" />
    </svg>
  );
}

// Hormones/Flow: two swirling interconnected circles
export function HormonesIcon({ size = 48, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none" className={className}>
      <circle cx="24" cy="30" r="12" stroke={strokeColor} strokeWidth={strokeWidth} />
      <circle cx="36" cy="30" r="12" stroke={strokeColor} strokeWidth={strokeWidth} />
      <circle cx="30" cy="24" r="4" stroke={strokeColor} strokeWidth={1} opacity="0.4" />
      <path d="M24 18C28 16 32 16 36 18" stroke={strokeColor} strokeWidth={1} strokeLinecap="round" opacity="0.3" />
    </svg>
  );
}

// Vitality/Energy: organic sun burst
export function EnergyIcon({ size = 48, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none" className={className}>
      <circle cx="30" cy="30" r="8" stroke={strokeColor} strokeWidth={strokeWidth} />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const x1 = 30 + Math.cos(rad) * 13;
        const y1 = 30 + Math.sin(rad) * 13;
        const x2 = 30 + Math.cos(rad) * (i % 2 === 0 ? 20 : 17);
        const y2 = 30 + Math.sin(rad) * (i % 2 === 0 ? 20 : 17);
        return (
          <line key={angle} x1={x1} y1={y1} x2={x2} y2={y2} stroke={strokeColor} strokeWidth={i % 2 === 0 ? strokeWidth : 1} strokeLinecap="round" opacity={i % 2 === 0 ? 1 : 0.5} />
        );
      })}
    </svg>
  );
}

// Mindset: stacked zen stones
export function MindsetIcon({ size = 48, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none" className={className}>
      <ellipse cx="30" cy="46" rx="14" ry="5" stroke={strokeColor} strokeWidth={strokeWidth} />
      <ellipse cx="30" cy="36" rx="10" ry="4" stroke={strokeColor} strokeWidth={strokeWidth} />
      <ellipse cx="30" cy="28" rx="7" ry="3" stroke={strokeColor} strokeWidth={strokeWidth} />
      <circle cx="30" cy="20" r="4" stroke={strokeColor} strokeWidth={strokeWidth} />
    </svg>
  );
}

// Hydration: elegant water droplet
export function HydrationIcon({ size = 48, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none" className={className}>
      <path d="M30 12C30 12 18 28 18 38C18 44.6 23.4 50 30 50C36.6 50 42 44.6 42 38C42 28 30 12 30 12Z" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M24 40C24 40 26 36 30 36" stroke={strokeColor} strokeWidth={1} strokeLinecap="round" opacity="0.4" />
    </svg>
  );
}

// Self-care: candle flame
export function SelfCareIcon({ size = 48, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none" className={className}>
      <path d="M30 10C30 10 24 20 24 26C24 30 27 32 30 32C33 32 36 30 36 26C36 20 30 10 30 10Z" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <line x1="30" y1="32" x2="30" y2="50" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="M24 50L36 50" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" />
    </svg>
  );
}

// Cycle/Moon phases: four moon phases
export function CycleIcon({ size = 48, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none" className={className}>
      <circle cx="30" cy="30" r="18" stroke={strokeColor} strokeWidth={1} strokeDasharray="2 3" opacity="0.3" />
      {/* New moon */}
      <circle cx="30" cy="12" r="4" stroke={strokeColor} strokeWidth={strokeWidth} />
      {/* Crescent */}
      <path d="M50 30C48 26 46 28 46 30C46 32 48 34 50 30Z" stroke={strokeColor} strokeWidth={strokeWidth} />
      {/* Full */}
      <circle cx="30" cy="48" r="4" stroke={strokeColor} strokeWidth={strokeWidth} fill={strokeColor} fillOpacity="0.15" />
      {/* Half */}
      <path d="M10 30A4 4 0 0 1 10 30" stroke={strokeColor} strokeWidth={strokeWidth} />
      <path d="M14 26C12 28 12 32 14 34" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" />
    </svg>
  );
}

// Decorative divider
export function Divider({ className = '' }) {
  return (
    <svg width="120" height="20" viewBox="0 0 120 20" fill="none" className={className}>
      <path d="M10 10C30 4 50 16 60 10C70 4 90 16 110 10" stroke={strokeColor} strokeWidth={1} strokeLinecap="round" opacity="0.3" />
      <circle cx="60" cy="10" r="2" fill={strokeColor} fillOpacity="0.3" />
    </svg>
  );
}

export const ILLUSTRATIONS = {
  sport: SportIcon,
  food: FoodIcon,
  sleep: SleepIcon,
  journal: JournalIcon,
  hormones: HormonesIcon,
  energy: EnergyIcon,
  mindset: MindsetIcon,
  hydration: HydrationIcon,
  selfcare: SelfCareIcon,
  cycle: CycleIcon,
  symbol: BrandSymbol,
  divider: Divider,
};
