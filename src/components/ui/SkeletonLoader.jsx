/**
 * Skeleton loading placeholders for Luna DA.
 * Provides visual feedback while cycle data is loading.
 */

const BASE_CLASSES = 'animate-pulse rounded-[24px]';

export function SkeletonBlock({ className = '', style = {} }) {
  return (
    <div
      className={`${BASE_CLASSES} ${className}`}
      style={{ backgroundColor: '#F0EDEE', ...style }}
    />
  );
}

export function SkeletonText({ lines = 3, className = '' }) {
  return (
    <div className={`space-y-2.5 ${className}`}>
      {Array.from({ length: lines }, (_, i) => (
        <div
          key={i}
          className="animate-pulse rounded-full"
          style={{
            backgroundColor: '#E8E4E5',
            height: '12px',
            width: i === lines - 1 ? '60%' : '100%',
          }}
        />
      ))}
    </div>
  );
}

export function SkeletonCircle({ size = 48, className = '' }) {
  return (
    <div
      className={`animate-pulse rounded-full flex-shrink-0 ${className}`}
      style={{ width: size, height: size, backgroundColor: '#F0EDEE' }}
    />
  );
}

export function SkeletonCard({ className = '', height = 140 }) {
  return (
    <div
      className={`${BASE_CLASSES} p-5 ${className}`}
      style={{ backgroundColor: '#F0EDEE', height }}
    >
      <div className="space-y-3">
        <div className="animate-pulse rounded-full" style={{ backgroundColor: '#E8E4E5', height: 10, width: '30%' }} />
        <div className="animate-pulse rounded-full" style={{ backgroundColor: '#E8E4E5', height: 16, width: '55%' }} />
        <div className="animate-pulse rounded-full" style={{ backgroundColor: '#E8E4E5', height: 10, width: '80%' }} />
      </div>
    </div>
  );
}

/* ---- Page-level skeletons ---- */

export function DashboardSkeleton() {
  return (
    <div className="space-y-6 pb-6">
      {/* Top bar placeholder */}
      <div className="flex items-center justify-between">
        <SkeletonBlock className="rounded-full" style={{ width: 100, height: 14 }} />
        <SkeletonCircle size={32} />
      </div>
      {/* Greeting */}
      <div className="space-y-2">
        <SkeletonBlock className="rounded-full" style={{ width: '50%', height: 28 }} />
        <SkeletonBlock className="rounded-full" style={{ width: '70%', height: 14 }} />
      </div>
      {/* Phase hero card */}
      <SkeletonCard height={180} />
      {/* Sanctuary cards */}
      <div className="space-y-3">
        <SkeletonCard height={80} />
        <SkeletonCard height={80} />
        <SkeletonCard height={80} />
      </div>
      {/* Calendar placeholder */}
      <SkeletonCard height={220} />
    </div>
  );
}

export function ProfilSkeleton() {
  return (
    <div className="space-y-6 pb-6">
      {/* Back button */}
      <SkeletonBlock className="rounded-full" style={{ width: 32, height: 32 }} />
      {/* Avatar + name */}
      <div className="flex flex-col items-center gap-3">
        <SkeletonCircle size={80} />
        <SkeletonBlock className="rounded-full" style={{ width: 120, height: 20 }} />
        <SkeletonBlock className="rounded-full" style={{ width: 180, height: 12 }} />
      </div>
      {/* Stats cards */}
      <div className="grid grid-cols-2 gap-3">
        <SkeletonCard height={100} />
        <SkeletonCard height={100} />
      </div>
      {/* Report section */}
      <SkeletonCard height={200} />
    </div>
  );
}

export function SportSkeleton() {
  return (
    <div className="space-y-6 pb-6">
      <SkeletonBlock className="rounded-full" style={{ width: 32, height: 32 }} />
      {/* Hero */}
      <SkeletonCard height={160} />
      {/* Exercises */}
      <div className="space-y-3">
        <SkeletonCard height={90} />
        <SkeletonCard height={90} />
        <SkeletonCard height={90} />
      </div>
      {/* Activity tracker */}
      <SkeletonCard height={120} />
    </div>
  );
}

export function ExtrasSkeleton() {
  return (
    <div className="space-y-6 pb-6">
      <SkeletonBlock className="rounded-full" style={{ width: 32, height: 32 }} />
      {/* Header */}
      <div className="space-y-2">
        <SkeletonBlock className="rounded-full" style={{ width: '40%', height: 10 }} />
        <SkeletonBlock className="rounded-full" style={{ width: '55%', height: 24 }} />
        <SkeletonBlock className="rounded-full" style={{ width: '75%', height: 12 }} />
      </div>
      {/* Cards */}
      <SkeletonCard height={130} />
      <SkeletonCard height={130} />
      <SkeletonCard height={100} />
    </div>
  );
}

/* Cycle sub-component skeletons */

export function PhaseCardSkeleton() {
  return (
    <div className="animate-pulse rounded-luna p-6" style={{ backgroundColor: '#F0EDEE' }}>
      <div className="flex flex-col items-center gap-3">
        <SkeletonCircle size={48} />
        <SkeletonBlock className="rounded-full" style={{ width: 120, height: 22 }} />
        <SkeletonBlock className="rounded-full" style={{ width: 90, height: 12 }} />
        <SkeletonBlock className="rounded-full" style={{ width: '70%', height: 10, maxWidth: 200 }} />
        <SkeletonBlock className="rounded-full" style={{ width: '80%', height: 12, maxWidth: 240 }} />
      </div>
    </div>
  );
}

export function CycleTimelineSkeleton() {
  return (
    <div className="rounded-luna p-4" style={{ backgroundColor: '#F0EDEE' }}>
      <SkeletonBlock className="rounded-full mb-3" style={{ width: 80, height: 12 }} />
      <div className="flex gap-1 overflow-hidden">
        {Array.from({ length: 20 }, (_, i) => (
          <SkeletonCircle key={i} size={24} />
        ))}
      </div>
      <div className="flex gap-3 mt-3">
        {Array.from({ length: 4 }, (_, i) => (
          <SkeletonBlock key={i} className="rounded-full" style={{ width: 60, height: 10 }} />
        ))}
      </div>
    </div>
  );
}

export function EnergyGaugeSkeleton() {
  return (
    <div className="rounded-luna p-4" style={{ backgroundColor: '#F0EDEE' }}>
      <div className="flex items-center gap-2 mb-3">
        <SkeletonCircle size={18} />
        <SkeletonBlock className="rounded-full" style={{ width: 120, height: 12 }} />
      </div>
      <SkeletonBlock className="rounded-full" style={{ width: '100%', height: 12 }} />
      <SkeletonBlock className="rounded-full mt-2" style={{ width: '50%', height: 10 }} />
    </div>
  );
}
