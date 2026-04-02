import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Droplets, Sun, Sparkles, Moon, Check, CircleDot, Thermometer, Trash2 } from 'lucide-react';
import { useCycle } from '../contexts/CycleContext';
import { getPhaseForDay, PHASES, PHASE_ORDER } from '../data/phases';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

const MONTH_NAMES = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
const WEEKDAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

const PHASE_ICONS = {
  menstrual: Droplets,
  follicular: Sun,
  ovulatory: Sparkles,
  luteal: Moon,
};

export default function Calendar() {
  const { cycleLength, periodLength, lastPeriodDate, periodLogs, temperatureLogs, spottingLogs, cycleInfo, dispatch } = useCycle();
  const [viewDate, setViewDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);
  const [confirmStart, setConfirmStart] = useState(false);
  const [confirmCycleReset, setConfirmCycleReset] = useState(false);
  const [tempInput, setTempInput] = useState('');
  const [editingTemp, setEditingTemp] = useState(false);

  const today = new Date();
  const lastPeriod = new Date(lastPeriodDate);
  const phase = cycleInfo?.phase || 'follicular';
  const phaseData = PHASES[phase];
  const logs = periodLogs || [];

  const getDayInfo = (year, month, dayNum) => {
    const date = new Date(year, month, dayNum);
    const dateStr = date.toISOString().split('T')[0];
    const diffDays = Math.floor((date - lastPeriod) / (1000 * 60 * 60 * 24));
    const cycleDay = ((diffDays % cycleLength) + cycleLength) % cycleLength + 1;
    const dayPhase = getPhaseForDay(cycleDay, cycleLength, periodLength);
    const isToday = date.toDateString() === today.toDateString();
    const isPeriodEstimated = cycleDay <= periodLength;
    const isManualPeriod = logs.includes(dateStr);
    const isPeriod = isPeriodEstimated || isManualPeriod;
    const isOvulation = cycleDay === cycleLength - 14;
    const isFertileWindow = cycleDay >= cycleLength - 17 && cycleDay <= cycleLength - 12;
    return { cycleDay, phase: dayPhase, isToday, isPeriod, isPeriodEstimated, isManualPeriod, isOvulation, isFertileWindow, date, dateStr };
  };

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = (new Date(year, month, 1).getDay() + 6) % 7;

  const prevMonth = () => {
    setViewDate(new Date(year, month - 1, 1));
    setSelectedDay(null);
  };
  const nextMonth = () => {
    setViewDate(new Date(year, month + 1, 1));
    setSelectedDay(null);
  };

  // Cycle progress
  const cycleDay = cycleInfo?.currentDay || 1;
  const cyclePct = Math.round((cycleDay / cycleLength) * 100);

  // Phase segments for cycle bar
  const ovulationDay = cycleLength - 14;
  const phaseSegments = [
    { key: 'menstrual', width: (periodLength / cycleLength) * 100 },
    { key: 'follicular', width: ((ovulationDay - 1 - periodLength) / cycleLength) * 100 },
    { key: 'ovulatory', width: (3 / cycleLength) * 100 },
    { key: 'luteal', width: ((cycleLength - ovulationDay - 1) / cycleLength) * 100 },
  ];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-5 pb-6">
      {/* Phase tag + Title */}
      <motion.div variants={item}>
        <p className="text-[10px] font-body text-luna-text-hint uppercase tracking-widest mb-3">
          {phaseData.shortName} · Cycle
        </p>
        <h1 className="font-display text-[28px] md:text-4xl text-luna-text leading-tight">
          Ton cycle,{' '}
          <em style={{ color: phaseData.colorDark }}>jour après jour</em>
        </h1>
      </motion.div>

      {/* Cycle overview card */}
      {cycleInfo && (
        <motion.div variants={item}>
          <div className="rounded-[24px] p-5 bg-white" style={{ boxShadow: '0 4px 24px rgba(45,34,38,0.06)' }}>
            {/* Current phase */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-xl"
                  style={{ backgroundColor: phaseData.bgColor }}
                >
                  {phaseData.icon}
                </div>
                <div>
                  <p className="font-display text-base text-luna-text">{phaseData.shortName}</p>
                  <p className="text-xs font-body text-luna-text-muted">Jour {cycleDay} sur {cycleLength}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-display font-bold" style={{ color: phaseData.colorDark }}>
                  {cycleInfo.daysUntilPeriod}
                </p>
                <p className="text-[9px] font-body text-luna-text-hint uppercase">jours avant règles</p>
              </div>
            </div>

            {/* Cycle progress bar with phase colors */}
            <div className="relative mb-3">
              <div className="h-3 rounded-full overflow-hidden flex">
                {phaseSegments.map((seg) => (
                  <div
                    key={seg.key}
                    className="h-full"
                    style={{ width: `${seg.width}%`, backgroundColor: PHASES[seg.key].color, opacity: 0.3 }}
                  />
                ))}
              </div>
              {/* Current position indicator */}
              <div
                className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-white transition-all duration-500"
                style={{
                  left: `${cyclePct}%`,
                  transform: `translateX(-50%) translateY(-50%)`,
                  backgroundColor: phaseData.color,
                  boxShadow: `0 0 0 3px ${phaseData.color}30`,
                }}
              />
            </div>

            {/* Phase labels under bar */}
            <div className="flex">
              {phaseSegments.map((seg) => {
                const pd = PHASES[seg.key];
                const Icon = PHASE_ICONS[seg.key];
                return (
                  <div key={seg.key} className="flex flex-col items-center" style={{ width: `${seg.width}%` }}>
                    <Icon size={10} style={{ color: pd.color }} />
                    <span className="text-[8px] font-body text-luna-text-hint mt-0.5 leading-none">
                      {pd.shortName.split(' ')[0]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}

      {/* Calendar */}
      <motion.div variants={item}>
        <div className="bg-white rounded-[24px] p-5" style={{ boxShadow: '0 2px 16px rgba(45,34,38,0.06)' }}>
          {/* Month nav */}
          <div className="flex items-center justify-between mb-5">
            <button onClick={prevMonth} className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center text-luna-text-muted hover:text-luna-text transition-colors">
              <ChevronLeft size={18} />
            </button>
            <h2 className="font-display text-lg text-luna-text">
              {MONTH_NAMES[month]} {year}
            </h2>
            <button onClick={nextMonth} className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center text-luna-text-muted hover:text-luna-text transition-colors">
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Legend pills */}
          <div className="flex items-center gap-2 mb-4 overflow-x-auto hide-scrollbar pb-1">
            <span className="flex items-center gap-1.5 text-[10px] font-body text-luna-text-muted whitespace-nowrap px-2.5 py-1 rounded-pill bg-gray-50">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PHASES.menstrual.color }} />
              Confirmé
            </span>
            <span className="flex items-center gap-1.5 text-[10px] font-body text-luna-text-muted whitespace-nowrap px-2.5 py-1 rounded-pill bg-gray-50">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PHASES.menstrual.color, opacity: 0.45 }} />
              Estimé
            </span>
            <span className="flex items-center gap-1.5 text-[10px] font-body text-luna-text-muted whitespace-nowrap px-2.5 py-1 rounded-pill bg-gray-50">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PHASES.follicular.color }} />
              Folliculaire
            </span>
            <span className="flex items-center gap-1.5 text-[10px] font-body text-luna-text-muted whitespace-nowrap px-2.5 py-1 rounded-pill bg-gray-50">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PHASES.ovulatory.color }} />
              Ovulation
            </span>
            <span className="flex items-center gap-1.5 text-[10px] font-body text-luna-text-muted whitespace-nowrap px-2.5 py-1 rounded-pill bg-gray-50">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PHASES.luteal.color }} />
              Lutéale
            </span>
            <span className="flex items-center gap-1.5 text-[10px] font-body text-luna-text-muted whitespace-nowrap px-2.5 py-1 rounded-pill bg-gray-50">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#C4727F', opacity: 0.6 }} />
              Spotting
            </span>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-1.5 mb-2">
            {WEEKDAYS.map((wd, i) => (
              <span key={i} className="text-center text-[10px] font-body font-semibold text-luna-text-hint uppercase tracking-wider py-1">
                {wd}
              </span>
            ))}
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7 gap-1.5">
            {/* Empty cells */}
            {Array.from({ length: firstDayOfWeek }).map((_, i) => (
              <div key={`e-${i}`} />
            ))}

            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const info = getDayInfo(year, month, dayNum);
              const isSelected = selectedDay?.date?.toDateString() === info.date.toDateString();
              const dp = PHASES[info.phase];

              return (
                <button
                  key={dayNum}
                  onClick={() => {
                    const next = isSelected ? null : info;
                    setSelectedDay(next);
                    setConfirmStart(false);
                    setConfirmCycleReset(false);
                    setTempInput(next ? ((temperatureLogs || {})[next.dateStr] ?? '') : '');
                    setEditingTemp(false);
                  }}
                  className="aspect-square rounded-[14px] flex flex-col items-center justify-center relative transition-all"
                  style={{
                    backgroundColor: info.isManualPeriod
                      ? PHASES.menstrual.color
                      : info.isPeriodEstimated
                        ? `${PHASES.menstrual.color}60`
                        : info.isOvulation
                          ? PHASES.ovulatory.color
                          : `${dp.color}15`,
                    border: isSelected
                      ? `2px solid ${dp.color}`
                      : info.isFertileWindow && !info.isOvulation
                        ? `1.5px dashed ${PHASES.ovulatory.color}`
                        : '2px solid transparent',
                    transform: isSelected ? 'scale(1.08)' : 'scale(1)',
                    boxShadow: isSelected ? `0 4px 12px ${dp.color}30` : 'none',
                  }}
                >
                  <span
                    className="text-xs font-body font-semibold"
                    style={{
                      color: info.isPeriod || info.isOvulation ? 'white' : '#4A3F43',
                    }}
                  >
                    {dayNum}
                  </span>

                  {/* Manual period confirmed check */}
                  {info.isManualPeriod && (
                    <Check
                      size={8}
                      className="absolute top-0.5 right-0.5"
                      style={{ color: 'white' }}
                      strokeWidth={3}
                    />
                  )}

                  {/* Estimated period indicator */}
                  {info.isPeriodEstimated && !info.isManualPeriod && (
                    <CircleDot
                      size={7}
                      className="absolute top-0.5 right-0.5"
                      style={{ color: 'white', opacity: 0.7 }}
                    />
                  )}

                  {/* Spotting indicator */}
                  {(spottingLogs || []).includes(info.dateStr) && (
                    <span
                      className="absolute top-0.5 left-0.5 w-2 h-2 rounded-full"
                      style={{ backgroundColor: '#C4727F' }}
                    />
                  )}

                  {/* Today dot */}
                  {info.isToday && (
                    <span
                      className="absolute -bottom-0.5 w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: info.isPeriod || info.isOvulation ? 'white' : dp.color }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Selected day detail */}
      {selectedDay && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="rounded-[24px] overflow-hidden" style={{ boxShadow: '0 4px 20px rgba(45,34,38,0.06)' }}>
            {/* Header colored */}
            <div className="p-5" style={{ backgroundColor: PHASES[selectedDay.phase]?.bgColor }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-body font-bold text-luna-text-hint uppercase tracking-widest mb-1">
                    {selectedDay.date.toLocaleDateString('fr-FR', { weekday: 'long' })}
                  </p>
                  <h3 className="font-display text-xl text-luna-text">
                    {selectedDay.date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}
                  </h3>
                </div>
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-xl"
                  style={{ backgroundColor: `${PHASES[selectedDay.phase]?.color}20` }}
                >
                  {PHASES[selectedDay.phase]?.icon}
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="bg-white p-5 space-y-3">
              {/* Tags */}
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className="text-xs font-body font-semibold px-3 py-1.5 rounded-pill text-white"
                  style={{ backgroundColor: PHASES[selectedDay.phase]?.color }}
                >
                  {PHASES[selectedDay.phase]?.shortName}
                </span>
                <span className="text-xs font-body font-semibold px-3 py-1.5 rounded-pill" style={{ backgroundColor: '#F5F2F0', color: '#5A4A4E' }}>
                  Jour {selectedDay.cycleDay}/{cycleLength}
                </span>
                {selectedDay.isOvulation && (
                  <span className="text-xs font-body font-semibold px-3 py-1.5 rounded-pill" style={{ backgroundColor: PHASES.ovulatory.bgColor, color: PHASES.ovulatory.colorDark }}>
                    ⭐ Ovulation
                  </span>
                )}
                {selectedDay.isFertileWindow && !selectedDay.isOvulation && (
                  <span className="text-xs font-body font-semibold px-3 py-1.5 rounded-pill" style={{ backgroundColor: PHASES.ovulatory.bgColor, color: PHASES.ovulatory.colorDark }}>
                    🔸 Fenêtre fertile
                  </span>
                )}
                {selectedDay.isManualPeriod && (
                  <span className="text-xs font-body font-semibold px-3 py-1.5 rounded-pill" style={{ backgroundColor: PHASES.menstrual.bgColor, color: PHASES.menstrual.colorDark }}>
                    ✓ Règles confirmées
                  </span>
                )}
                {selectedDay.isPeriodEstimated && !selectedDay.isManualPeriod && (
                  <span className="text-xs font-body font-semibold px-3 py-1.5 rounded-pill" style={{ backgroundColor: '#F5F2F0', color: '#9A8A8E' }}>
                    ~ Règles estimées
                  </span>
                )}
              </div>

              {/* Phase summary */}
              <p className="text-sm font-body text-luna-text-body leading-relaxed">
                {PHASES[selectedDay.phase]?.summary}
              </p>

              {/* Hormones */}
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Œstrogène', phase: selectedDay.phase, level: selectedDay.phase === 'ovulatory' ? 'Élevé' : selectedDay.phase === 'follicular' ? 'En hausse' : selectedDay.phase === 'luteal' ? 'Moyen' : 'Bas' },
                  { label: 'Progestérone', phase: selectedDay.phase, level: selectedDay.phase === 'luteal' ? 'Élevée' : 'Basse' },
                ].map((h) => (
                  <div key={h.label} className="rounded-[12px] p-2.5" style={{ backgroundColor: PHASES[selectedDay.phase]?.bgColor }}>
                    <p className="text-[9px] font-body font-bold text-luna-text-hint uppercase tracking-widest">{h.label}</p>
                    <p className="text-xs font-body font-semibold mt-0.5" style={{ color: PHASES[selectedDay.phase]?.colorDark }}>{h.level}</p>
                  </div>
                ))}
              </div>

              {/* Basal Temperature */}
              <div className="pt-2">
                <p className="text-[10px] font-body font-bold text-luna-text-hint uppercase tracking-widest mb-2">Température basale</p>
                {(() => {
                  const savedTemp = (temperatureLogs || {})[selectedDay.dateStr];
                  const hasSaved = savedTemp !== undefined && savedTemp !== '';
                  const phaseColor = PHASES[selectedDay.phase]?.color;
                  const phaseDark = PHASES[selectedDay.phase]?.colorDark;

                  /* ── État 2 : valeur sauvegardée, pas en édition ── */
                  if (hasSaved && !editingTemp) {
                    return (
                      <button
                        onClick={() => { setEditingTemp(true); setTempInput(savedTemp); }}
                        className="w-full flex items-center gap-3 rounded-[14px] px-4 py-3 transition-all hover:shadow-sm active:scale-[0.98]"
                        style={{ backgroundColor: `${phaseColor}10`, border: `1.5px solid ${phaseColor}30` }}
                      >
                        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${phaseColor}20` }}>
                          <Thermometer size={14} style={{ color: phaseDark }} />
                        </div>
                        <div className="flex-1 text-left">
                          <p className="text-lg font-display font-bold" style={{ color: phaseDark }}>
                            {savedTemp}°C
                          </p>
                          <p className="text-[10px] font-body text-luna-text-muted">
                            Appuie pour modifier ou supprimer
                          </p>
                        </div>
                        <Check size={16} style={{ color: phaseColor }} />
                      </button>
                    );
                  }

                  /* ── État 1 & 3 : saisie (nouveau) ou édition ── */
                  const hasInput = tempInput !== '' && tempInput !== undefined;

                  return (
                    <div className="rounded-[14px] px-4 py-3" style={{ backgroundColor: '#F8F6F4' }}>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#E8E4E0' }}>
                          <Thermometer size={14} className="text-luna-text-muted" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <input
                            type="number"
                            step="0.1"
                            min="35"
                            max="39"
                            placeholder="36.5"
                            value={tempInput}
                            onChange={(e) => setTempInput(e.target.value)}
                            className="w-full bg-transparent text-sm font-body font-semibold text-luna-text outline-none placeholder:text-luna-text-hint placeholder:font-normal"
                            autoFocus={editingTemp}
                          />
                          <p className="text-[10px] font-body text-luna-text-muted mt-0.5">
                            En °C, au réveil avant de te lever
                          </p>
                        </div>
                      </div>

                      {/* Boutons — seulement si l'utilisatrice a tapé qqch */}
                      {hasInput && (
                        <div className="flex items-center gap-2 mt-3 pt-3" style={{ borderTop: '1px solid #E8E4E0' }}>
                          <button
                            onClick={() => {
                              const val = parseFloat(tempInput);
                              if (!isNaN(val) && val >= 35 && val <= 39) {
                                dispatch({ type: 'SET_TEMPERATURE', payload: { date: selectedDay.dateStr, temperature: tempInput } });
                                setEditingTemp(false);
                              }
                            }}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-body font-semibold text-white transition-all"
                            style={{ backgroundColor: phaseColor }}
                          >
                            <Check size={13} />
                            {editingTemp ? 'Modifier' : 'Valider'}
                          </button>

                          {editingTemp && (
                            <>
                              <button
                                onClick={() => {
                                  dispatch({ type: 'SET_TEMPERATURE', payload: { date: selectedDay.dateStr, temperature: '' } });
                                  setTempInput('');
                                  setEditingTemp(false);
                                }}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-body font-semibold transition-all"
                                style={{ backgroundColor: '#D4727F15', color: '#D4727F' }}
                              >
                                <Trash2 size={13} />
                                Supprimer
                              </button>
                              <button
                                onClick={() => { setEditingTemp(false); setTempInput(savedTemp || ''); }}
                                className="px-3 py-1.5 rounded-full text-xs font-body text-luna-text-muted hover:text-luna-text transition-all"
                              >
                                Annuler
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>

              {/* Period logging actions */}
              <div className="pt-2 space-y-2">
                <p className="text-[10px] font-body font-bold text-luna-text-hint uppercase tracking-widest">Suivi des règles</p>

                {/* Case 1: Estimated period day → simple confirm/unconfirm, no extra confirmation */}
                {selectedDay.isPeriodEstimated && (
                  <button
                    onClick={() => {
                      dispatch({ type: 'TOGGLE_PERIOD_DAY', payload: { date: selectedDay.dateStr } });
                      setSelectedDay((prev) => prev ? { ...prev, isManualPeriod: !prev.isManualPeriod, isPeriod: true } : null);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-[14px] transition-all"
                    style={{
                      backgroundColor: selectedDay.isManualPeriod ? PHASES.menstrual.bgColor : '#F8F6F4',
                      border: selectedDay.isManualPeriod ? `1.5px solid ${PHASES.menstrual.color}` : '1.5px solid transparent',
                    }}
                  >
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: selectedDay.isManualPeriod ? PHASES.menstrual.color : '#E8E4E0' }}
                    >
                      {selectedDay.isManualPeriod
                        ? <Check size={14} className="text-white" />
                        : <Droplets size={14} className="text-luna-text-muted" />
                      }
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-body font-semibold text-luna-text">
                        {selectedDay.isManualPeriod ? 'Règles confirmées ✓' : 'Confirmer ce jour de règles'}
                      </p>
                      <p className="text-[10px] font-body text-luna-text-muted">
                        {selectedDay.isManualPeriod ? 'Appuie pour retirer la confirmation' : 'L\'estimation semble correcte ? Confirme d\'un tap'}
                      </p>
                    </div>
                  </button>
                )}

                {/* Case 2: NOT an estimated period day → toggle with confirmation */}
                {!selectedDay.isPeriodEstimated && !selectedDay.isManualPeriod && !confirmStart && (
                  <button
                    onClick={() => setConfirmStart(true)}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-[14px] transition-all"
                    style={{ backgroundColor: '#F8F6F4', border: '1.5px solid transparent' }}
                  >
                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#E8E4E0' }}>
                      <Droplets size={14} className="text-luna-text-muted" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-body font-semibold text-luna-text">J'ai eu mes règles ce jour</p>
                      <p className="text-[10px] font-body text-luna-text-muted">Ce jour n'est pas dans l'estimation</p>
                    </div>
                  </button>
                )}

                {/* Confirmation dialog for non-estimated day */}
                {!selectedDay.isPeriodEstimated && !selectedDay.isManualPeriod && confirmStart && (
                  <div className="rounded-[14px] p-4" style={{ backgroundColor: PHASES.menstrual.bgColor, border: `1.5px solid ${PHASES.menstrual.color}40` }}>
                    <p className="text-sm font-body text-luna-text font-semibold mb-1">
                      Marquer comme jour de règles ?
                    </p>
                    <p className="text-xs font-body text-luna-text-muted mb-3">
                      Le {selectedDay.date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })} — ce jour n'était pas prévu dans l'estimation.
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          dispatch({ type: 'TOGGLE_PERIOD_DAY', payload: { date: selectedDay.dateStr } });
                          setSelectedDay((prev) => prev ? { ...prev, isManualPeriod: true, isPeriod: true } : null);
                          setConfirmStart(false);
                        }}
                        className="flex-1 py-2.5 rounded-pill text-sm font-body font-semibold text-white transition-colors"
                        style={{ backgroundColor: PHASES.menstrual.color }}
                      >
                        Oui, marquer
                      </button>
                      <button
                        onClick={() => setConfirmStart(false)}
                        className="flex-1 py-2.5 rounded-pill text-sm font-body font-semibold text-luna-text-muted bg-white transition-colors"
                      >
                        Annuler
                      </button>
                    </div>
                  </div>
                )}

                {/* Already manually marked (non-estimated) → allow removal */}
                {!selectedDay.isPeriodEstimated && selectedDay.isManualPeriod && (
                  <button
                    onClick={() => {
                      dispatch({ type: 'TOGGLE_PERIOD_DAY', payload: { date: selectedDay.dateStr } });
                      setSelectedDay((prev) => prev ? { ...prev, isManualPeriod: false, isPeriod: false } : null);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-[14px] transition-all"
                    style={{
                      backgroundColor: PHASES.menstrual.bgColor,
                      border: `1.5px solid ${PHASES.menstrual.color}`,
                    }}
                  >
                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: PHASES.menstrual.color }}>
                      <Check size={14} className="text-white" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-body font-semibold text-luna-text">Règles marquées ✓</p>
                      <p className="text-[10px] font-body text-luna-text-muted">Appuie pour retirer</p>
                    </div>
                  </button>
                )}

                {/* Set as period START (recalculates cycle) — with confirmation */}
                {!confirmCycleReset ? (
                  <button
                    onClick={() => setConfirmCycleReset(true)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-[14px] transition-all"
                    style={{ backgroundColor: '#FFF8F0', border: '1.5px solid #F2C0A830' }}
                  >
                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#F2C0A830' }}>
                      <CircleDot size={14} style={{ color: '#C4727F' }} />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-body font-semibold text-luna-text">Début de mes règles</p>
                      <p className="text-[10px] font-body text-luna-text-muted">Recalcule tout le cycle à partir de ce jour</p>
                    </div>
                  </button>
                ) : (
                  <div className="rounded-[14px] p-4" style={{ backgroundColor: PHASES.menstrual.bgColor, border: `1.5px solid ${PHASES.menstrual.color}40` }}>
                    <p className="text-sm font-body text-luna-text font-semibold mb-1">
                      Confirmer le début de tes règles ?
                    </p>
                    <p className="text-xs font-body text-luna-text-muted mb-3">
                      Le {selectedDay.date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })} sera ton nouveau jour 1. Toutes les estimations de ton cycle seront recalculées.
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          dispatch({ type: 'SET_PERIOD_START', payload: { date: selectedDay.dateStr } });
                          setConfirmCycleReset(false);
                          setSelectedDay(null);
                        }}
                        className="flex-1 py-2.5 rounded-pill text-sm font-body font-semibold text-white transition-colors"
                        style={{ backgroundColor: PHASES.menstrual.color }}
                      >
                        Oui, recalculer
                      </button>
                      <button
                        onClick={() => setConfirmCycleReset(false)}
                        className="flex-1 py-2.5 rounded-pill text-sm font-body font-semibold text-luna-text-muted bg-white transition-colors"
                      >
                        Annuler
                      </button>
                    </div>
                  </div>
                )}

                {/* Spotting toggle */}
                {(() => {
                  const hasSpotting = (spottingLogs || []).includes(selectedDay.dateStr);
                  return (
                    <button
                      onClick={() => {
                        dispatch({ type: 'TOGGLE_SPOTTING', payload: { date: selectedDay.dateStr } });
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-[14px] transition-all"
                      style={{
                        backgroundColor: hasSpotting ? '#FDE8EB' : '#F8F6F4',
                        border: hasSpotting ? '1.5px solid #C4727F' : '1.5px solid transparent',
                      }}
                    >
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: hasSpotting ? '#C4727F' : '#E8E4E0' }}
                      >
                        {hasSpotting
                          ? <Check size={14} className="text-white" />
                          : <Droplets size={14} style={{ color: '#C4727F' }} />
                        }
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-body font-semibold text-luna-text">
                          {hasSpotting ? 'Spotting noté ✓' : 'Spotting'}
                        </p>
                        <p className="text-[10px] font-body text-luna-text-muted">
                          {hasSpotting ? 'Appuie pour retirer' : 'Légères pertes de sang en dehors des règles'}
                        </p>
                      </div>
                    </button>
                  );
                })()}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Disclaimer */}
      <motion.div variants={item}>
        <div className="rounded-[16px] p-3" style={{ backgroundColor: phaseData.bgColor }}>
          <p className="text-xs font-body text-luna-text-muted text-center leading-relaxed">
            📅 Les dates sont des estimations basées sur ton cycle de {cycleLength} jours. Les variations sont normales.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
