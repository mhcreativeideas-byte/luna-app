// En-tête compact des écrans alimentaires (Manger, Mes aliments).
// Garde le dégradé et l'identité colorée de la phase, mais sur peu de hauteur
// pour laisser voir le contenu rapidement. Purement visuel : reçoit la phase
// et les textes en props.
export default function PhaseHero({ phaseData, section, titleMain, titleItalic, intro }) {
  return (
    <div
      className="rounded-[28px] px-5 pt-5 pb-5 relative overflow-hidden"
      style={{
        background: `linear-gradient(145deg, ${phaseData.bgColor} 0%, ${phaseData.color}18 100%)`,
        boxShadow: '0 10px 30px rgba(45,34,38,0.06)',
      }}
    >
      <div
        className="absolute -top-6 -right-6 w-24 h-24 rounded-full"
        style={{ backgroundColor: phaseData.color, opacity: 0.16 }}
      />

      <div className="relative">
        <div className="flex items-center gap-2.5 mb-2.5">
          <div
            className="w-9 h-9 rounded-[12px] flex items-center justify-center text-lg flex-shrink-0"
            style={{ backgroundColor: 'rgba(255,255,255,0.7)', boxShadow: '0 4px 14px rgba(45,34,38,0.06)' }}
          >
            {phaseData.icon}
          </div>
          <p className="text-[10px] font-body font-bold uppercase tracking-[0.18em]" style={{ color: phaseData.color }}>
            {phaseData.shortName} · {section}
          </p>
        </div>
        <h1 className="font-display text-[23px] md:text-3xl text-luna-text leading-tight mb-1.5">
          {titleMain}{' '}
          <em style={{ color: phaseData.colorDark }}>{titleItalic}</em>
        </h1>
        <p className="text-[13px] font-body text-luna-text-body leading-snug">
          {intro}
        </p>
      </div>
    </div>
  );
}
