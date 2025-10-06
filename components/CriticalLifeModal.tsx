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
      <div className="relative bg-gradient-to-br from-gray-900 via-red-900/20 to-gray-900 rounded-2xl shadow-2xl max-w-md w-full border border-red-600/50 animate-in zoom-in duration-300">
        {/* Header */}
        <div className="p-8 text-center">
          {/* Critical Icon */}
          <div className="text-8xl mb-4 animate-pulse">💔</div>

          {/* Title */}
          <h2 className="text-3xl font-bold text-white mb-2">
            Your Pet Needs You!
          </h2>

          {/* Subtitle */}
          <p className="text-gray-300 text-lg">
            Your pet lost all lives while you were away for{' '}
            <span className="font-bold text-red-400">{daysInactive} days</span>
          </p>
        </div>

        {/* Content */}
        <div className="px-8 pb-6 space-y-4">
          {/* Streak Reset Info */}
          {oldStreak > 0 && (
            <div className="bg-red-600/20 border border-red-600/50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-red-300">
                <span className="text-2xl">🔥</span>
                <div>
                  <p className="font-semibold">Streak Reset</p>
                  <p className="text-sm">
                    {oldStreak} day streak → 0
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Lives Indicator */}
          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Pet Health</span>
              <span className="text-red-400 font-bold">Critical</span>
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
          <div className="text-center text-gray-300 text-sm">
            Write an entry to revive them!
          </div>
        </div>

        {/* Footer / Actions */}
        <div className="p-6 bg-gray-800/30 rounded-b-2xl">
          <button
            onClick={handleWriteNow}
            className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-lg shadow-lg transform transition-all hover:scale-105 active:scale-95"
          >
            <span className="flex items-center justify-center gap-2">
              <span>Write Now</span>
              <span>→</span>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
