import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Droplets, Check, CircleDot, Thermometer, Trash2, Pencil } from 'lucide-react';
import BackButton from '../components/ui/BackButton';
import BottomSheet from '../components/ui/BottomSheet';
import { DashboardSkeleton } from '../components/ui/SkeletonLoader';
import { useCycle, parseLocalDate } from '../contexts/CycleContext';
import { toast } from '../lib/toast';
import { getPhaseForDay, getOvulationDay, PHASES } from '../data/phases';

const MONTH_NAMES = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
const WEEKDAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

export default function Calendar() {
  const { cycleInfo, cycleLength, periodLength, lastPeriodDate, periodLogs, temperatureLogs, spottingLogs, dispatch } = useCycle();

  const [viewDate, setViewDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);
  const [confirmStart, setConfirmStart] = useState(false);
  const [confirmCycleReset, setConfirmCycleReset] = useState(false);
  const [tempInput, setTempInput] = useState('');
  const [, setTempDirty] = useState(false);
  const [editingTemp, setEditingTemp] = useState(false);
  const [tempConfirming, setTempConfirming] = useState(false);
  const [tempToConfirm, setTempToConfirm] = useState(null);

  if (!cycleInfo) return <DashboardSkeleton />;

  const { phaseData } = cycleInfo;

  const today = new Date();
  // parseLocalDate : minuit LOCAL (new Date('YYYY-MM-DD') parserait en UTC
  // et décalerait tout le calendrier d'un jour en France)
  const lastPeriod = parseLocalDate(lastPeriodDate);
  const ovulationDay = getOvulationDay(cycleLength, periodLength);
  const logs = periodLogs || [];

  const getDayInfo = (year, month, dayNum) => {
    const date = new Date(year, month, dayNum);
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    // Math.round : les deux dates sont à minuit local, mais un changement
    // d'heure été/hiver dans l'intervalle fausserait un Math.floor.
    const diffDays = Math.round((date - lastPeriod) / (1000 * 60 * 60 * 24));
    const cycleDay = ((diffDays % cycleLength) + cycleLength) % cycleLength + 1;
    const dayPhase = getPhaseForDay(cycleDay, cycleLength, periodLength);
    const isToday = date.toDateString() === today.toDateString();
    const isPeriodEstimated = cycleDay <= periodLength;
    const isManualPeriod = logs.includes(dateStr);
    const isPeriod = isPeriodEstimated || isManualPeriod;
    const isOvulation = cycleDay === ovulationDay;
    const isFertileWindow = cycleDay >= ovulationDay - 3 && cycleDay <= ovulationDay + 2;
    return { cycleDay, phase: dayPhase, isToday, isPeriod, isPeriodEstimated, isManualPeriod, isOvulation, isFertileWindow, date, dateStr };
  };

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = (new Date(year, month, 1).getDay() + 6) % 7;

  const prevMonth = () => { setViewDate(new Date(year, month - 1, 1)); setSelectedDay(null); };
  const nextMonth = () => { setViewDate(new Date(year, month + 1, 1)); setSelectedDay(null); };

  const closeSheet = () => {
    setSelectedDay(null);
    setConfirmStart(false);
    setConfirmCycleReset(false);
    setTempInput('');
    setTempDirty(false);
    setEditingTemp(false);
    setTempConfirming(false);
    setTempToConfirm(null);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 pb-6">
      <div>
        <BackButton />
        <h1 className="font-display text-2xl text-luna-text">Mon calendrier</h1>
        <p className="text-xs font-body text-luna-text-hint mt-1">Suivi jour par jour de ton cycle</p>
      </div>

      {/* Calendar grid */}
      <div className="bg-white rounded-[24px] p-5" style={{ boxShadow: '0 2px 16px rgba(45,34,38,0.06)' }}>
        {/* Month nav */}
        <div className="flex items-center justify-between mb-5">
          <button onClick={prevMonth} aria-label="Mois précédent" className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center text-luna-text-muted hover:text-luna-text active:text-luna-text transition-colors">
            <ChevronLeft size={18} />
          </button>
          <h2 className="font-display text-lg text-luna-text">
            {MONTH_NAMES[month]} {year}
          </h2>
          <button onClick={nextMonth} aria-label="Mois suivant" className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center text-luna-text-muted hover:text-luna-text active:text-luna-text transition-colors">
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Legend pills */}
        <div className="flex items-center gap-2 mb-4 overflow-x-auto hide-scrollbar pb-1">
          <span className="flex items-center gap-1.5 text-[11px] font-body text-luna-text-muted whitespace-nowrap px-2.5 py-1 rounded-pill bg-gray-50">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PHASES.menstrual.color }} />
            Confirmé
          </span>
          <span className="flex items-center gap-1.5 text-[11px] font-body text-luna-text-muted whitespace-nowrap px-2.5 py-1 rounded-pill bg-gray-50">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PHASES.menstrual.color, opacity: 0.45 }} />
            Estimé
          </span>
          <span className="flex items-center gap-1.5 text-[11px] font-body text-luna-text-muted whitespace-nowrap px-2.5 py-1 rounded-pill bg-gray-50">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PHASES.follicular.color }} />
            Folliculaire
          </span>
          <span className="flex items-center gap-1.5 text-[11px] font-body text-luna-text-muted whitespace-nowrap px-2.5 py-1 rounded-pill bg-gray-50">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PHASES.ovulatory.color }} />
            Ovulation
          </span>
          <span className="flex items-center gap-1.5 text-[11px] font-body text-luna-text-muted whitespace-nowrap px-2.5 py-1 rounded-pill bg-gray-50">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PHASES.luteal.color }} />
            Lutéale
          </span>
          <span className="flex items-center gap-1.5 text-[11px] font-body text-luna-text-muted whitespace-nowrap px-2.5 py-1 rounded-pill bg-gray-50">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#C4727F', opacity: 0.6 }} />
            Spotting
          </span>
        </div>

        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-1.5 mb-2">
          {WEEKDAYS.map((wd, i) => (
            <span key={i} className="text-center text-[11px] font-body font-semibold text-luna-text-hint uppercase tracking-wider py-1">
              {wd}
            </span>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-1.5">
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
                  setSelectedDay(isSelected ? null : info);
                  setConfirmStart(false);
                  setConfirmCycleReset(false);
                  setTempInput('');
                  setTempDirty(false);
                  setEditingTemp(false);
                  setTempConfirming(false);
                  setTempToConfirm(null);
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
                  style={{ color: info.isPeriod || info.isOvulation ? 'white' : '#4A3F43' }}
                >
                  {dayNum}
                </span>

                {info.isManualPeriod && (
                  <Check size={8} className="absolute top-0.5 right-0.5" style={{ color: 'white' }} strokeWidth={3} />
                )}

                {info.isPeriodEstimated && !info.isManualPeriod && (
                  <CircleDot size={7} className="absolute top-0.5 right-0.5" style={{ color: 'white', opacity: 0.7 }} />
                )}

                {(spottingLogs || []).includes(info.dateStr) && (
                  <span className="absolute top-0.5 left-0.5 w-2 h-2 rounded-full" style={{ backgroundColor: '#C4727F' }} />
                )}

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

      {/* Calendar disclaimer */}
      <div className="rounded-[16px] p-3" style={{ backgroundColor: phaseData.bgColor }}>
        <p className="text-xs font-body text-luna-text-muted text-center leading-relaxed">
          📅 Les dates sont des estimations basées sur ton cycle de {cycleLength} jours. Les variations sont normales.
        </p>
        <p className="text-[11px] font-body text-luna-text-muted text-center leading-relaxed mt-2 opacity-80">
          luna est un outil de bien-être, pas un dispositif médical. Pour toute question de santé, consulte un professionnel.
        </p>
      </div>

      {/* Selected day detail — bottom sheet */}
      <BottomSheet open={!!selectedDay} onClose={closeSheet}>
        {selectedDay && (
          <div className="rounded-[24px] overflow-hidden bg-white" style={{ boxShadow: '0 4px 20px rgba(45,34,38,0.06)' }}>
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
            <div className="p-5 space-y-3">
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
                  { label: 'Œstrogène', level: selectedDay.phase === 'ovulatory' ? 'Élevé' : selectedDay.phase === 'follicular' ? 'En hausse' : selectedDay.phase === 'luteal' ? 'Moyen' : 'Bas' },
                  { label: 'Progestérone', level: selectedDay.phase === 'luteal' ? 'Élevée' : 'Basse' },
                ].map((h) => (
                  <div key={h.label} className="rounded-[12px] p-2.5" style={{ backgroundColor: PHASES[selectedDay.phase]?.bgColor }}>
                    <p className="text-[10px] font-body font-bold text-luna-text-hint uppercase tracking-widest">{h.label}</p>
                    <p className="text-xs font-body font-semibold mt-0.5" style={{ color: PHASES[selectedDay.phase]?.colorDark }}>{h.level}</p>
                  </div>
                ))}
              </div>

              {/* Basal Temperature */}
              <div className="pt-2">
                <p className="text-[10px] font-body font-bold text-luna-text-hint uppercase tracking-widest mb-2">Température basale</p>
                {(() => {
                  const tempLogs = temperatureLogs || {};
                  const raw = tempLogs[selectedDay.dateStr];
                  const savedTemp = (raw !== undefined && raw !== null && raw !== '' && !isNaN(Number(raw))) ? Number(raw) : null;
                  const hasSaved = savedTemp !== null;
                  const phaseColor = PHASES[selectedDay.phase]?.color;
                  const phaseDark = PHASES[selectedDay.phase]?.colorDark;

                  if (tempConfirming && tempToConfirm !== null) {
                    return (
                      <div className="rounded-[14px] px-4 py-4" style={{ backgroundColor: `${phaseColor}10`, border: `1.5px solid ${phaseColor}30` }}>
                        <div className="text-center mb-3">
                          <p className="text-2xl font-display font-bold" style={{ color: phaseDark }}>{tempToConfirm}°C</p>
                          <p className="text-xs font-body text-luna-text-muted mt-1">C'est bien ta température ?</p>
                        </div>
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => {
                              dispatch({ type: 'SET_TEMPERATURE', payload: { date: selectedDay.dateStr, temperature: String(tempToConfirm) } });
                              setEditingTemp(false); setTempInput(''); setTempDirty(false); setTempConfirming(false); setTempToConfirm(null);
                            }}
                            className="flex items-center gap-1.5 px-5 py-2 rounded-full text-xs font-body font-semibold text-white transition-all"
                            style={{ backgroundColor: phaseColor }}
                          >
                            <Check size={13} />
                            Valider
                          </button>
                          <button
                            onClick={() => { setTempConfirming(false); setTempToConfirm(null); setEditingTemp(true); }}
                            className="px-4 py-2 rounded-full text-xs font-body font-semibold transition-all"
                            style={{ backgroundColor: '#E8E4E0', color: '#8A7B7F' }}
                          >
                            Modifier
                          </button>
                        </div>
                      </div>
                    );
                  }

                  if (hasSaved && !editingTemp) {
                    return (
                      <button
                        onClick={() => { setEditingTemp(true); setTempInput(String(savedTemp)); setTempDirty(false); }}
                        className="w-full flex items-center gap-3 rounded-[14px] px-4 py-3 transition-all hover:shadow-sm active:scale-[0.98]"
                        style={{ backgroundColor: `${phaseColor}10`, border: `1.5px solid ${phaseColor}30` }}
                      >
                        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${phaseColor}20` }}>
                          <Thermometer size={14} style={{ color: phaseDark }} />
                        </div>
                        <div className="flex-1 text-left">
                          <p className="text-lg font-display font-bold" style={{ color: phaseDark }}>{savedTemp}°C</p>
                          <p className="text-[11px] font-body text-luna-text-muted">Appuie pour modifier ou supprimer</p>
                        </div>
                        <Check size={16} style={{ color: phaseColor }} />
                      </button>
                    );
                  }

                  if (hasSaved && editingTemp) {
                    return (
                      <div className="rounded-[14px] px-4 py-3" style={{ backgroundColor: '#F8F6F4' }}>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${phaseColor}20` }}>
                            <Thermometer size={14} style={{ color: phaseDark }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <input
                              type="text" inputMode="decimal" pattern="[0-9]*[.,]?[0-9]*" placeholder="36.5"
                              value={tempInput}
                              onChange={(e) => { setTempInput(e.target.value); }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  const val = parseFloat(tempInput.replace(',', '.'));
                                  if (!isNaN(val) && val > 0) { setTempToConfirm(val); setTempConfirming(true); setEditingTemp(false); }
                                }
                              }}
                              className="w-full bg-transparent text-sm font-body font-semibold text-luna-text outline-none placeholder:text-luna-text-hint placeholder:font-normal"
                              autoFocus
                            />
                            <p className="text-[11px] font-body text-luna-text-muted mt-0.5">Modifie ta température</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-3 pt-3" style={{ borderTop: '1px solid #E8E4E0' }}>
                          <button
                            onClick={() => {
                              const val = parseFloat(tempInput.replace(',', '.'));
                              if (!isNaN(val) && val > 0) { setTempToConfirm(val); setTempConfirming(true); setEditingTemp(false); }
                            }}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-body font-semibold text-white transition-all"
                            style={{ backgroundColor: phaseColor }}
                          >
                            <Check size={13} />
                            Confirmer
                          </button>
                          <button
                            onClick={() => {
                              dispatch({ type: 'SET_TEMPERATURE', payload: { date: selectedDay.dateStr, temperature: null } });
                              setTempInput(''); setTempDirty(false); setEditingTemp(false);
                            }}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-body font-semibold transition-all"
                            style={{ backgroundColor: '#D4727F15', color: '#D4727F' }}
                          >
                            <Trash2 size={13} />
                            Supprimer
                          </button>
                          <button
                            onClick={() => { setEditingTemp(false); setTempInput(''); setTempDirty(false); }}
                            className="px-3 py-1.5 rounded-full text-xs font-body text-luna-text-muted hover:text-luna-text active:text-luna-text transition-all"
                          >
                            Annuler
                          </button>
                        </div>
                      </div>
                    );
                  }

                  const tempVal = parseFloat((tempInput || '').replace(',', '.'));
                  const isTempValid = !isNaN(tempVal) && tempVal > 0;

                  return (
                    <div className="rounded-[14px] px-4 py-3" style={{ backgroundColor: '#F8F6F4' }}>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#E8E4E0' }}>
                          <Thermometer size={14} className="text-luna-text-muted" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <input
                            type="text" inputMode="decimal" pattern="[0-9]*[.,]?[0-9]*" placeholder="36,5"
                            value={tempInput}
                            onChange={(e) => { setTempInput(e.target.value); setTempDirty(true); }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && isTempValid) {
                                dispatch({ type: 'SET_TEMPERATURE', payload: { date: selectedDay.dateStr, temperature: String(tempVal) } });
                                setEditingTemp(false); setTempInput(''); setTempDirty(false);
                              }
                            }}
                            className="w-full bg-transparent text-sm font-body font-semibold text-luna-text outline-none placeholder:font-normal placeholder:italic placeholder:text-gray-300"
                          />
                          <p className="text-[11px] font-body text-luna-text-muted mt-0.5">Appuie pour la noter · en °C, au réveil</p>
                        </div>
                        {isTempValid ? (
                          <button
                            onClick={() => {
                              dispatch({ type: 'SET_TEMPERATURE', payload: { date: selectedDay.dateStr, temperature: String(tempVal) } });
                              setEditingTemp(false); setTempInput(''); setTempDirty(false);
                            }}
                            className="flex-shrink-0 px-4 py-2 rounded-full text-xs font-body font-semibold text-white transition-all"
                            style={{ backgroundColor: phaseColor }}
                          >
                            Valider
                          </button>
                        ) : (
                          <Pencil size={15} className="flex-shrink-0" style={{ color: phaseColor }} aria-hidden="true" />
                        )}
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Period logging actions */}
              <div className="pt-2 space-y-2">
                <p className="text-[10px] font-body font-bold text-luna-text-hint uppercase tracking-widest">Suivi des règles</p>

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
                      <p className="text-[11px] font-body text-luna-text-muted">
                        {selectedDay.isManualPeriod ? 'Appuie pour retirer la confirmation' : 'L\'estimation semble correcte ? Confirme d\'un tap'}
                      </p>
                    </div>
                  </button>
                )}

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
                      <p className="text-[11px] font-body text-luna-text-muted">Ce jour n'est pas dans l'estimation</p>
                    </div>
                  </button>
                )}

                {!selectedDay.isPeriodEstimated && !selectedDay.isManualPeriod && confirmStart && (
                  <div className="rounded-[14px] p-4" style={{ backgroundColor: PHASES.menstrual.bgColor, border: `1.5px solid ${PHASES.menstrual.color}40` }}>
                    <p className="text-sm font-body text-luna-text font-semibold mb-1">Marquer comme jour de règles ?</p>
                    <p className="text-xs font-body text-luna-text-muted mb-3">
                      Le {selectedDay.date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}, ce jour n'était pas prévu dans l'estimation.
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
                      <p className="text-[11px] font-body text-luna-text-muted">Appuie pour retirer</p>
                    </div>
                  </button>
                )}

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
                      <p className="text-[11px] font-body text-luna-text-muted">Recalcule tout le cycle à partir de ce jour</p>
                    </div>
                  </button>
                ) : (
                  <div className="rounded-[14px] p-4" style={{ backgroundColor: PHASES.menstrual.bgColor, border: `1.5px solid ${PHASES.menstrual.color}40` }}>
                    <p className="text-sm font-body text-luna-text font-semibold mb-1">Confirmer le début de tes règles ?</p>
                    <p className="text-xs font-body text-luna-text-muted mb-3">
                      Le {selectedDay.date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })} sera ton nouveau jour 1. Toutes les estimations de ton cycle seront recalculées.
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          dispatch({ type: 'SET_PERIOD_START', payload: { date: selectedDay.dateStr } });
                          closeSheet();
                          toast('Début des règles enregistré ✓');
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
                        <p className="text-[11px] font-body text-luna-text-muted">
                          {hasSpotting ? 'Appuie pour retirer' : 'Légères pertes de sang en dehors des règles'}
                        </p>
                      </div>
                    </button>
                  );
                })()}
              </div>
            </div>
          </div>
        )}
      </BottomSheet>
    </motion.div>
  );
}
