import { useCycle } from '../../contexts/CycleContext';
import { getPhaseForDay } from '../../data/phases';
import { PHASES } from '../../data/phases';
import { CycleTimelineSkeleton } from '../ui/SkeletonLoader';

export default function CycleTimeline() {
  const { cycleInfo, cycleLength, periodLength } = useCycle();
  if (!cycleInfo) return <CycleTimelineSkeleton />;

  const days = Array.from({ length: cycleLength }, (_, i) => i + 1);

  return (
    <div className="bg-luna-cream-light rounded-luna p-4">
      <p className="text-sm font-semibold text-luna-text mb-3 font-body">Mon cycle</p>
      <div className="flex gap-1 overflow-x-auto pb-2 scrollbar-hide">
        {days.map((day) => {
          const phase = getPhaseForDay(day, cycleLength, periodLength);
          const phaseData = PHASES[phase];
          const isToday = day === cycleInfo.currentDay;

          return (
            <div
              key={day}
              className={`flex-shrink-0 flex items-center justify-center rounded-full text-[10px] font-accent font-bold transition-all ${
                isToday
                  ? 'w-8 h-8 ring-2 ring-offset-1'
                  : 'w-6 h-6'
              }`}
              style={{
                backgroundColor: isToday ? phaseData.color : phaseData.bgColor,
                color: isToday ? 'white' : phaseData.colorDark,
                ringColor: isToday ? phaseData.colorDark : undefined,
              }}
              title={`Jour ${day} — ${phaseData.shortName}`}
            >
              {day}
            </div>
          );
        })}
      </div>
      <div className="flex gap-3 mt-3 flex-wrap">
        {['menstrual', 'follicular', 'ovulatory', 'luteal'].map((p) => (
          <div key={p} className="flex items-center gap-1">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: PHASES[p].color }}
            />
            <span className="text-[10px] text-luna-text-secondary font-body">
              {PHASES[p].icon} {PHASES[p].shortName}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
