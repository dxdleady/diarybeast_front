'use client';

import { useRouter } from 'next/navigation';

export interface CriticalLifeModalProps {
  daysInactive: number;
  oldStreak: number;
  isOpen: boolean;
  onClose?: () => void;
}

/**
 * Modal shown when pet has 0 lives remaining
 *
 * Features:
 * - Blocks UI (cannot be dismissed without action)
 * - Shows days inactive
 * - Shows streak reset info
 * - "Write Now" button redirects to /diary
 *
 * This creates urgency and emotional connection to revive the pet
 */
export function CriticalLifeModal({
  daysInactive,
  oldStreak,
  isOpen,
  onClose,
}: CriticalLifeModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  const handleWriteNow = () => {
    onClose?.();
    router.push('/diary');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={(e) => e.stopPropagation()} // Prevent click-through
      />

      {/* Modal */}
      <div className="relative bg-bg-card border-2 border-error rounded-2xl shadow-2xl max-w-md w-full animate-in zoom-in duration-300">
        {/* Header */}
        <div className="p-8 text-center">
          {/* Critical Icon */}
          <div className="text-8xl mb-4 animate-pulse">💔</div>

          {/* Title */}
          <h2 className="text-3xl font-display font-bold text-primary mb-2 drop-shadow-[0_0_8px_rgba(255,23,68,0.4)]">
            Your Pet Needs You!
          </h2>

          {/* Subtitle */}
          <p className="text-primary/80 text-lg font-mono">
            Your pet lost all lives while you were away for{' '}
            <span className="font-bold text-error">{daysInactive} days</span>
          </p>
        </div>

        {/* Content */}
        <div className="px-8 pb-6 space-y-4">
          {/* Streak Reset Info */}
          {oldStreak > 0 && (
            <div className="bg-error/20 border border-error/50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-error">
                <span className="text-2xl">🔥</span>
                <div className="font-mono">
                  <p className="font-semibold">Streak Reset</p>
                  <p className="text-sm">{oldStreak} day streak → 0</p>
                </div>
              </div>
            </div>
          )}

          {/* Lives Indicator */}
          <div className="bg-bg-lcd/50 border border-primary/20 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-primary/60 text-sm font-mono">Pet Health</span>
              <span className="text-error font-bold font-mono">Critical</span>
            </div>
            <div className="flex gap-1 justify-center">
              {Array.from({ length: 7 }).map((_, i) => (
                <span key={i} className="text-2xl">
                  💔
                </span>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center text-primary/70 text-sm font-mono">
            Write an entry to revive them!
          </div>
        </div>

        {/* Footer / Actions */}
        <div className="p-6 bg-bg-lcd/30 rounded-b-2xl">
          <button
            onClick={handleWriteNow}
            className="w-full px-6 py-4 btn-primary font-bold rounded-lg shadow-lg transform transition-all hover:scale-105 active:scale-95 font-mono"
          >
            <span className="flex items-center justify-center gap-2">
              <span>[WRITE NOW]</span>
              <span>→</span>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
