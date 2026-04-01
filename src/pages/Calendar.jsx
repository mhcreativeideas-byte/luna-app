import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight as ChevRight, Info } from 'lucide-react';
import { useCycle } from '../contexts/CycleContext';
import { getPhaseForDay, PHASES } from '../data/phases';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};
const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const PHASE_LABELS = {
  menstrual: 'Règles',
  follicular: 'Folliculaire',
  ovulatory: 'Ovulation',
  luteal: 'Lutéale',
};

export default function Calendar() {
  const { cycleLength, periodLength, lastPeriodDate, cycleInfo } = useCycle();
  const [viewDate, setViewDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);

  const today = new Date();
  const lastPeriod = new Date(lastPeriodDate);

  const weekDays = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

  const getDayInfo = (year, month, dayNum) => {
    const date = new Date(year, month, dayNum);
    const diffDays = Math.floor((date - lastPeriod) / (1000 * 60 * 60 * 24));
    const cycleDay = ((diffDays % cycleLength) + cycleLength) % cycleLength + 1;
    const phase = getPhaseForDay(cycleDay, cycleLength, periodLength);
    const isToday = date.toDateString() === today.toDateString();
    const isPeriod = cycleDay <= periodLength;
    const isOvulation = cycleDay === cycleLength - 14;
    const isFertileWindow = cycleDay >= cycleLength - 17 && cycleDay <= cycleLength - 12;
    return { cycleDay, phase, isToday, isPeriod, isOvulation, isFertileWindow, date };
  };

  const renderMonth = (monthOffset) => {
    const d = new Date(viewDate.getFullYear(), viewDate.getMonth() + monthOffset, 1);
    const year = d.getFullYear();
    const month = d.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfWeek = (new Date(year, month, 1).getDay() + 6) % 7;
    const monthName = d.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });

    return (
      <div key={`${year}-${month}`} className="mb-8">
        <h2 className="font-display text-lg text-luna-text capitalize mb-4 px-1">{monthName}</h2>

        {/* Week headers */}
        <div className="grid grid-cols-7 gap-1 text-center mb-2">
          {weekDays.map((wd, i) => (
            <span key={i} className="text-[10px] font-body font-bold text-luna-text-hint uppercase tracking-wider py-1">
              {wd}
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
            const info = getDayInfo(year, month, dayNum);
            const isSelected = selectedDay?.date?.toDateString() === info.date.toDateString();

            // Determine styling
            let bgColor = 'transparent';
            let textColor = '#4A3F43';
            let borderStyle = {};
            let dotColor = null;

            if (info.isPeriod) {
              bgColor = PHASES.menstrual.color;
              textColor = 'white';
            } else if (info.isOvulation) {
              bgColor = PHASES.ovulatory.color;
              textColor = 'white';
            } else if (info.isFertileWindow) {
              borderStyle = {
                border: `1.5px dashed ${PHASES.ovulatory.color}`,
              };
            } else {
              // Subtle phase background
              dotColor = PHASES[info.phase]?.color;
            }

            return (
              <button
                key={dayNum}
                onClick={() => setSelectedDay(info)}
                className={`aspect-square flex flex-col items-center justify-center rounded-[12px] text-sm font-body relative transition-all ${
                  info.isToday ? 'ring-2 ring-luna-text font-bold' : ''
                } ${isSelected ? 'scale-110 shadow-md' : ''}`}
                style={{
                  backgroundColor: bgColor,
                  color: textColor,
                  ...borderStyle,
                }}
              >
                <span className="text-xs font-semibold">{dayNum}</span>
                {/* Phase dot indicator */}
                {dotColor && !info.isPeriod && !info.isOvulation && !info.isFertileWindow && (
                  <span
                    className="w-1 h-1 rounded-full mt-0.5"
                    style={{ backgroundColor: dotColor, opacity: 0.5 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const prevMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  const nextMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-5 pb-6">
      {/* Header */}
      <motion.div variants={item} className="flex items-center justify-between">
        <h1 className="font-display text-2xl text-luna-text">Calendrier</h1>
        {/* Month navigation */}
        <div className="flex gap-2">
          <button
            onClick={prevMonth}
            className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-luna-text-muted hover:text-luna-text transition-colors"
            style={{ boxShadow: '0 1px 4px rgba(45,34,38,0.06)' }}
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={nextMonth}
            className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-luna-text-muted hover:text-luna-text transition-colors"
            style={{ boxShadow: '0 1px 4px rgba(45,34,38,0.06)' }}
          >
            <ChevRight size={16} />
          </button>
        </div>
      </motion.div>

      {/* Current phase info */}
      {cycleInfo && (
        <motion.div variants={item}>
          <div
            className="rounded-[20px] p-4 flex items-center gap-4"
            style={{ backgroundColor: cycleInfo.phaseData.bgColor }}
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-xl"
              style={{ backgroundColor: `${cycleInfo.phaseData.color}20` }}
            >
              {cycleInfo.phaseData.icon}
            </div>
            <div>
              <p className="text-sm font-display text-luna-text">
                {cycleInfo.phaseData.name} · Jour {cycleInfo.currentDay}
              </p>
              <p className="text-xs font-body text-luna-text-muted mt-0.5">
                Prochain cycle dans {cycleInfo.daysUntilPeriod} jours
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Calendar - 2 months */}
      <motion.div variants={item}>
        <div
          className="bg-white rounded-[24px] p-5"
          style={{ boxShadow: '0 2px 16px rgba(45, 34, 38, 0.06)' }}
        >
          {renderMonth(0)}
          {renderMonth(1)}
        </div>
      </motion.div>

      {/* Selected day detail */}
      {selectedDay && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div
            className="rounded-[20px] p-5"
            style={{ backgroundColor: PHASES[selectedDay.phase]?.bgColor || '#F5F2F0' }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{PHASES[selectedDay.phase]?.icon}</span>
              <h3 className="font-display text-base text-luna-text">
                {selectedDay.date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
              </h3>
            </div>
            <div className="flex items-center gap-3 mb-3">
              <span
                className="text-xs font-body font-semibold px-3 py-1 rounded-pill text-white"
                style={{ backgroundColor: PHASES[selectedDay.phase]?.color }}
              >
                {PHASE_LABELS[selectedDay.phase]}
              </span>
              <span className="text-xs font-body text-luna-text-muted">
                Jour {selectedDay.cycleDay} du cycle
              </span>
            </div>
            <p className="text-sm font-body text-luna-text-body leading-relaxed">
              {PHASES[selectedDay.phase]?.summary}
            </p>
            {selectedDay.isOvulation && (
              <p className="text-xs font-body font-semibold mt-2" style={{ color: PHASES.ovulatory.colorDark }}>
                ⭐ Jour d'ovulation estimé
              </p>
            )}
            {selectedDay.isFertileWindow && !selectedDay.isOvulation && (
              <p className="text-xs font-body font-semibold mt-2" style={{ color: PHASES.ovulatory.colorDark }}>
                🔸 Fenêtre de fertilité
              </p>
            )}
          </div>
        </motion.div>
      )}

      {/* Legend */}
      <motion.div variants={item}>
        <div className="bg-white rounded-[20px] p-4" style={{ boxShadow: '0 2px 12px rgba(45,34,38,0.04)' }}>
          <h3 className="text-[10px] font-body font-bold text-luna-text-hint uppercase tracking-widest mb-3">Légende</h3>
          <div className="grid grid-cols-2 gap-y-2.5 gap-x-4">
            <span className="flex items-center gap-2 text-xs font-body text-luna-text-muted">
              <span className="w-4 h-4 rounded-[4px]" style={{ backgroundColor: PHASES.menstrual.color }} />
              Règles
            </span>
            <span className="flex items-center gap-2 text-xs font-body text-luna-text-muted">
              <span className="w-4 h-4 rounded-[4px]" style={{ backgroundColor: PHASES.ovulatory.color }} />
              Ovulation
            </span>
            <span className="flex items-center gap-2 text-xs font-body text-luna-text-muted">
              <span className="w-4 h-4 rounded-[4px] border-2 border-dashed" style={{ borderColor: PHASES.ovulatory.color }} />
              Fenêtre fertile
            </span>
            <span className="flex items-center gap-2 text-xs font-body text-luna-text-muted">
              <span className="w-4 h-4 rounded-[4px] ring-2 ring-luna-text flex items-center justify-center text-[6px] font-bold">
                ●
              </span>
              Aujourd'hui
            </span>
          </div>
        </div>
      </motion.div>

      {/* Disclaimer */}
      <motion.div variants={item} className="flex items-start gap-2 px-1">
        <Info size={14} className="text-luna-text-hint mt-0.5 flex-shrink-0" />
        <p className="text-[10px] font-body text-luna-text-hint leading-relaxed">
          Les dates sont des estimations basées sur la durée moyenne de ton cycle. Les variations sont normales.
        </p>
      </motion.div>
    </motion.div>
  );
}
