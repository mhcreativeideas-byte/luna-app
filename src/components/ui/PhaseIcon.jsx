import { Moon } from 'lucide-react';
import { PHASE_ICONS } from '../../data/phaseIcons';
import { PHASES } from '../../data/phases';

// Icône de phase en trait fin, dans la couleur de la phase (voir
// src/data/phaseIcons.js pour la correspondance et le pourquoi).
export default function PhaseIcon({ phase, size = 16, strokeWidth = 2, className = '', style }) {
  const Icon = PHASE_ICONS[phase] || Moon;
  return (
    <Icon
      size={size}
      strokeWidth={strokeWidth}
      className={className}
      style={{ color: PHASES[phase]?.color, ...style }}
    />
  );
}
