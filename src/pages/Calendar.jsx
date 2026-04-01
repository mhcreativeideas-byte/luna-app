import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight as ChevRight } from 'lucide-react';
import { useCycle } from '../contexts/CycleContext';
import { getPhaseForDay } from '../data/phases';
import { PHASES } from '../data/phases';

export default function Calendar() {
  const navigate = useNavigate();
  const { cycleLength, periodLength, lastPeriodDate } = useCycle();
  const [viewDate, setViewDate] = useState(new Date());

  const today = new Date();
  const lastPeriod = new Date(lastPeriodDate);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = (new Date(year, month, 1).getDay() + 6) % 7;

  const monthName = viewDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });

  const getDayInfo = (dayNum) => {
    const date = new Date(year, month, dayNum);
    const diffDays = Math.floor((date - lastPeriod) / (1000 * 60 * 60 * 24));
    const cycleDay = ((diffDays % cycleLength) + cycleLength) % cycleLength + 1;
    const phase = getPhaseForDay(cycleDay, cycleLength, periodLength);
    const isToday = date.toDateString() === today.toDateString();
    const isPeriod = cycleDay <= periodLength;
    const isOvulation = cycleDay === cycleLength - 14;
    return { cycleDay, phase, isToday, isPeriod, isOvulation };
  };

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

  const weekDays = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

  return (
    <div className="space-y-5 pb-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-luna-text-muted hover:text-luna-text transition-colors"
          style={{ boxShadow: '0 2px 8px rgba(45, 34, 38, 0.06)' }}
        >
          <ChevronLeft size={20} />
        </button>
        <h1 className="font-display text-xl text-luna-text">Calendrier</h1>
      </div>

      {/* Month nav */}
      <div
        className="flex items-center justify-between bg-white rounded-[20px] px-4 py-3"
        style={{ boxShadow: '0 2px 12px rgba(45, 34, 38, 0.04)' }}
      >
        <button onClick={prevMonth} className="w-8 h-8 rounded-full bg-luna-cream flex items-center justify-center text-luna-text-muted hover:text-luna-text">
          <ChevronLeft size={18} />
        </button>
        <h2 className="font-display text-lg text-luna-text capitalize">{monthName}</h2>
        <button onClick={nextMonth} className="w-8 h-8 rounded-full bg-luna-cream flex items-center justify-center text-luna-text-muted hover:text-luna-text">
          <ChevRight size={18} />
        </button>
      </div>

      {/* Calendar card */}
      <div
        className="bg-white rounded-[24px] p-4"
        style={{ boxShadow: '0 2px 16px rgba(45, 34, 38, 0.06)' }}
      >
        {/* Week headers */}
        <div className="grid grid-cols-7 gap-1 text-center mb-2">
          {weekDays.map((d, i) => (
            <span key={i} className="text-[10px] font-body font-bold text-luna-text-hint py-1 uppercase">
              {d}
            </span>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: firstDayOfWeek }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}

          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const info = getDayInfo(dayNum);

            return (
              <motion.div
                key={dayNum}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.008 }}
                className={`aspect-square flex flex-col items-center justify-center rounded-[12px] text-sm font-body relative ${
                  info.isToday ? 'ring-2' : ''
                }`}
                style={{
                  backgroundColor: info.isPeriod
                    ? PHASES.menstrual.color
                    : info.isOvulation
                      ? PHASES.ovulatory.color
                      : PHASES[info.phase]?.bgColor || '#FAF7F5',
                  ...(info.isToday ? { '--tw-ring-color': PHASES[info.phase]?.colorDark || '#C4727F' } : {}),
                }}
              >
                <span className={`font-semibold text-xs ${
                  info.isPeriod || info.isOvulation ? 'text-white' : 'text-luna-text-body'
                }`}>
                  {dayNum}
                </span>
                {(info.isPeriod || info.isOvulation) && (
                  <span className="text-[7px] mt-0.5">
                    {info.isPeriod ? '🩸' : '🥚'}
                  </span>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 justify-center pt-1">
        <span className="flex items-center gap-1.5 text-xs font-body text-luna-text-muted">
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: PHASES.menstrual.color }} /> Regles
        </span>
        <span className="flex items-center gap-1.5 text-xs font-body text-luna-text-muted">
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: PHASES.ovulatory.color }} /> Ovulation
        </span>
        <span className="flex items-center gap-1.5 text-xs font-body text-luna-text-muted">
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: PHASES.follicular.color }} /> Folliculaire
        </span>
        <span className="flex items-center gap-1.5 text-xs font-body text-luna-text-muted">
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: PHASES.luteal.color }} /> Luteale
        </span>
      </div>
    </div>
  );
}
