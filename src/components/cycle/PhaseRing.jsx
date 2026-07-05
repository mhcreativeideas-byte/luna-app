import { Flame, Sun, Sparkles, Moon } from 'lucide-react';
import { PHASES } from '../../data/phases';

// Anneau de phase (arc coloré + point de progression + icône lucide centrée).
// Extrait de Landing.jsx — utilisé par la landing (« Et si tu l'écoutais ? »)
// et par l'écran « 4 phases, 4 besoins » de l'onboarding.
// Usage : <PhaseRing phase="menstrual" size={76} />

// Icône + progression de l'anneau par phase (comme l'anneau de cycle de l'app)
const PHASE_RING = {
  menstrual: { Icon: Flame, progress: 0.11 },
  follicular: { Icon: Sun, progress: 0.34 },
  ovulatory: { Icon: Sparkles, progress: 0.54 },
  luteal: { Icon: Moon, progress: 0.80 },
};

export default function PhaseRing({ phase, size = 76 }) {
  const { color, colorDark } = PHASES[phase];
  const { Icon, progress } = PHASE_RING[phase];
  const R = 42, C = 2 * Math.PI * R;
  const dash = progress * C;
  const ang = progress * 2 * Math.PI;
  const dotX = 50 + R * Math.sin(ang);
  const dotY = 50 - R * Math.cos(ang);
  return (
    <div className="relative mx-auto" style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <circle cx="50" cy="50" r={R} fill="none" stroke={color} strokeWidth="6.5" opacity="0.16" />
        <circle
          cx="50" cy="50" r={R} fill="none" stroke={color} strokeWidth="6.5" strokeLinecap="round"
          strokeDasharray={`${dash} ${C}`} transform="rotate(-90 50 50)"
        />
        <circle cx={dotX} cy={dotY} r="7.5" fill="#FFFFFF" stroke={color} strokeWidth="3" />
        <circle cx={dotX} cy={dotY} r="2.4" fill={colorDark} />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <Icon size={size * 0.34} strokeWidth={1.9} style={{ color: colorDark }} />
      </div>
    </div>
  );
}
