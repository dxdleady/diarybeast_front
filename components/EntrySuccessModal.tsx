'use client';

import { useEffect } from 'react';
import confetti from 'canvas-confetti';

export interface EntrySuccessModalProps {
  isOpen: boolean;
  tokensEarned: number;
  livesRestored: number;
  oldLives: number;
  newLives: number;
  streakBonus?: number;
  milestone?: string | null;
  onClose: () => void;
}

/**
 * Success modal shown after saving diary entry
 *
 * Features:
 * - Celebration with confetti animation
 * - Shows tokens earned
 * - Shows lives restored (+2)
 * - Before/after lives display
 * - Auto-closes after 5 seconds
 * - Can be manually closed
 */
export function EntrySuccessModal({
  isOpen,
  tokensEarned,
  livesRestored,
  oldLives,
  newLives,
  streakBonus = 0,
  milestone = null,
  onClose,
}: EntrySuccessModalProps) {
  // Trigger confetti on mount
  useEffect(() => {
    if (!isOpen) return;

    // Fire confetti
    const duration = 3000;
    const animationEnd = Date.now() + duration;

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        clearInterval(interval);
        return;
      }

      const particleCount = 50 * (timeLeft / duration);

      // Left side
      confetti({
        particleCount,
        startVelocity: 30,
        spread: 360,
        origin: {
          x: randomInRange(0.1, 0.3),
          y: Math.random() - 0.2,
        },
        colors: ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b'],
      });

      // Right side
      confetti({
        particleCount,
        startVelocity: 30,
        spread: 360,
        origin: {
          x: randomInRange(0.7, 0.9),
          y: Math.random() - 0.2,
        },
        colors: ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b'],
      });
    }, 250);

    // Auto-close after 5 seconds
    const autoCloseTimer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(autoCloseTimer);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-gradient-to-br from-gray-900 via-green-900/20 to-gray-900 rounded-2xl shadow-2xl max-w-md w-full border border-green-600/50 animate-in zoom-in duration-300">
        {/* Header */}
        <div className="p-8 text-center">
          {/* Success Icon */}
          <div className="text-8xl mb-4 animate-bounce">🎉</div>

          {/* Title */}
          <h2 className="text-3xl font-bold text-white mb-2">Entry Saved!</h2>
        </div>

        {/* Content */}
        <div className="px-8 pb-6 space-y-4">
          {/* Tokens Earned */}
          <div className="bg-blue-600/20 border border-blue-600/50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-3xl">💎</span>
                <span className="text-white font-semibold">DIARY Tokens</span>
              </div>
              <span className="text-2xl font-bold text-blue-400">
                +{tokensEarned}
              </span>
            </div>
          </div>

          {/* Streak Bonus */}
          {streakBonus > 0 && milestone && (
            <div className="bg-orange-600/20 border border-orange-600/50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-3xl">🔥</span>
                  <div>
                    <div className="text-white font-semibold">{milestone} Bonus!</div>
                    <div className="text-xs text-gray-400">Keep the streak going!</div>
                  </div>
                </div>
                <span className="text-2xl font-bold text-orange-400">
                  +{streakBonus}
                </span>
              </div>
            </div>
          )}

          {/* Lives Restored */}
          {livesRestored > 0 && (
            <div className="bg-green-600/20 border border-green-600/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-3xl">❤️</span>
                  <span className="text-white font-semibold">
                    Lives Restored
                  </span>
                </div>
                <span className="text-2xl font-bold text-green-400">
                  +{livesRestored}
                </span>
              </div>

              {/* Before/After Lives */}
              <div className="flex items-center justify-center gap-4 text-sm text-gray-300">
                {/* Before */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <span key={i} className="text-xs">
                      {i < oldLives ? '❤️' : '🖤'}
                    </span>
                  ))}
                </div>

                <span className="text-gray-400">→</span>

                {/* After */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <span key={i} className="text-xs">
                      {i < newLives ? '❤️' : '🖤'}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Pet Happy Message */}
          <div className="text-center text-gray-300">
            <p className="text-lg">Your pet is happier! 😺</p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-800/30 rounded-b-2xl">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
          >
            Continue
          </button>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <span className="text-2xl">✕</span>
        </button>
      </div>
    </div>
  );
}
