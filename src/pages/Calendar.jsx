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
  const firstDayOfWeek = (new Date(year, month, 1).getDay() + 6) % 7; // Monday start

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
        <button onClick={() => navigate(-1)} className="text-luna-text-muted hover:text-luna-text">
          <ChevronLeft size={24} />
        </button>
        <h1 className="section-title text-xl">CALENDRIER</h1>
      </div>

      {/* Month nav */}
      <div className="flex items-center justify-between">
        <button onClick={prevMonth} className="p-2 text-luna-text-muted hover:text-luna-text">
          <ChevronLeft size={20} />
        </button>
        <h2 className="font-display text-lg text-luna-text capitalize">{monthName}</h2>
        <button onClick={nextMonth} className="p-2 text-luna-text-muted hover:text-luna-text">
          <ChevRight size={20} />
        </button>
      </div>

      {/* Week headers */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {weekDays.map((d, i) => (
          <span key={i} className="text-xs font-accent font-semibold text-luna-text-hint py-1">
            {d}
          </span>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Empty cells for offset */}
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
              transition={{ delay: i * 0.01 }}
              className={`aspect-square flex flex-col items-center justify-center rounded-luna-sm text-sm font-accent relative ${
                info.isToday ? 'ring-2 ring-luna-orange' : ''
              }`}
              style={{
                backgroundColor: info.isPeriod
                  ? '#E25B33'
                  : info.isOvulation
                    ? '#F5A623'
                    : PHASES[info.phase]?.bgColor || '#F7F4EF',
              }}
            >
              <span className={`font-semibold ${
                info.isPeriod ? 'text-white' : info.isOvulation ? 'text-white' : 'text-luna-text-body'
              }`}>
                {dayNum}
              </span>
              <span className="text-[8px] mt-0.5">
                {info.isPeriod ? '🩸' : info.isOvulation ? '🥚' : ''}
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 justify-center pt-2">
        <span className="flex items-center gap-1.5 text-xs font-body text-luna-text-muted">
          <span className="w-3 h-3 rounded-full bg-[#E25B33]" /> Règles
        </span>
        <span className="flex items-center gap-1.5 text-xs font-body text-luna-text-muted">
          <span className="w-3 h-3 rounded-full bg-[#F5A623]" /> Ovulation
        </span>
        <span className="flex items-center gap-1.5 text-xs font-body text-luna-text-muted">
          <span className="w-3 h-3 rounded-full bg-[#D6CDB8]" /> Folliculaire
        </span>
        <span className="flex items-center gap-1.5 text-xs font-body text-luna-text-muted">
          <span className="w-3 h-3 rounded-full bg-[#C9A0D3]" /> Lutéale
        </span>
      </div>
    </div>
  );
}
