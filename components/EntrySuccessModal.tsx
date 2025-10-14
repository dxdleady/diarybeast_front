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
  baseAmount?: number;
  multiplier?: number;
  multiplierReason?: string;
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
  baseAmount,
  multiplier,
  multiplierReason,
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
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-bg-card border-2 border-success rounded-2xl shadow-2xl max-w-md w-full animate-in zoom-in duration-300 shadow-glow-green">
        {/* Header */}
        <div className="p-8 text-center">
          {/* Success Icon */}
          <div className="text-8xl mb-4 animate-bounce">🎉</div>

          {/* Title */}
          <h2 className="text-3xl font-display font-bold text-primary mb-2 drop-shadow-[0_0_8px_rgba(57,255,20,0.4)]">
            Entry Saved!
          </h2>
        </div>

        {/* Content */}
        <div className="px-8 pb-6 space-y-4">
          {/* Tokens Earned */}
          <div className="bg-primary/20 border border-primary/50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img
                  src="/assets/tamagochi-coin.svg"
                  alt="DIARY Token"
                  className="w-8 h-8"
                  style={{
                    filter:
                      'brightness(0) saturate(100%) invert(80%) sepia(48%) saturate(1000%) hue-rotate(2deg) brightness(104%) contrast(101%)',
                  }}
                />
                <span className="text-primary font-semibold font-mono">DIARY Tokens</span>
              </div>
              <span className="text-2xl font-bold text-tokens font-mono">+{tokensEarned}</span>
            </div>

            {/* Multiplier Info */}
            {multiplier !== undefined && baseAmount !== undefined && multiplier < 1.0 && (
              <div className="mt-2 pt-2 border-t border-primary/20">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-primary/60">Base reward:</span>
                  <span className="text-primary/60">{baseAmount} DIARY</span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-warning font-semibold">Multiplier: {multiplier}x</span>
                  <span className="text-tokens font-semibold">{tokensEarned} DIARY</span>
                </div>
                {multiplierReason && (
                  <div className="mt-1 text-xs text-warning/80 font-mono">{multiplierReason}</div>
                )}
              </div>
            )}
          </div>

          {/* Streak Bonus */}
          {streakBonus > 0 && milestone && (
            <div className="bg-streak/20 border border-streak/50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img
                    src="/assets/tamagochi-achievements-daily-crypto.svg"
                    alt="Streak"
                    className="w-8 h-8"
                    style={{
                      filter:
                        'brightness(0) saturate(100%) invert(69%) sepia(52%) saturate(2288%) hue-rotate(359deg) brightness(101%) contrast(101%)',
                    }}
                  />
                  <div>
                    <div className="text-primary font-semibold font-mono">{milestone} Bonus!</div>
                    <div className="text-xs text-primary/60 font-mono">Keep the streak going!</div>
                  </div>
                </div>
                <span className="text-2xl font-bold text-streak font-mono">+{streakBonus}</span>
              </div>
            </div>
          )}

          {/* Lives Restored */}
          {livesRestored > 0 && (
            <div className="bg-success/20 border border-success/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-3xl">❤️</span>
                  <span className="text-primary font-semibold font-mono">Lives Restored</span>
                </div>
                <span className="text-2xl font-bold text-success font-mono">+{livesRestored}</span>
              </div>

              {/* Before/After Lives */}
              <div className="flex items-center justify-center gap-4 text-sm text-primary/80 font-mono">
                {/* Before */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <span key={i} className="text-xs">
                      {i < oldLives ? '❤️' : '🖤'}
                    </span>
                  ))}
                </div>

                <span className="text-primary/60">→</span>

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
          <div className="text-center text-primary/80 font-mono">
            <p className="text-lg">Your pet is happier! 😺</p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-bg-lcd/30 rounded-b-2xl">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 btn-primary font-semibold rounded-lg transition-colors font-mono shadow-glow-green"
          >
            [CONTINUE]
          </button>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-primary/60 hover:text-primary transition-colors"
        >
          <span className="text-2xl">✕</span>
        </button>
      </div>
    </div>
  );
}
