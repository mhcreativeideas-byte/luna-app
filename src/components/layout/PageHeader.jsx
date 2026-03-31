import { useCycle } from '../../contexts/CycleContext';

export default function PageHeader({ title, subtitle, icon }) {
  const { cycleInfo } = useCycle();
  const phaseIcon = icon || cycleInfo?.phaseData?.icon || '🌸';

  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-1">
        <span className="text-2xl">{phaseIcon}</span>
        <h1 className="font-display text-2xl md:text-3xl text-luna-text">{title}</h1>
      </div>
      {subtitle && (
        <p className="text-luna-text-secondary text-sm md:text-base font-body ml-11">
          {subtitle}
        </p>
      )}
    </div>
  );
}
