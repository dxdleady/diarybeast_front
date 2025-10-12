'use client';

import { useEffect, useState } from 'react';

interface DailyTimerProps {
  hasWrittenToday: boolean;
}

export function DailyTimer({ hasWrittenToday }: DailyTimerProps) {
  const [timeLeft, setTimeLeft] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
  }>({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();

      // Get next midnight UTC
      const nextMidnight = new Date();
      nextMidnight.setUTCHours(24, 0, 0, 0);

      const diff = nextMidnight.getTime() - now.getTime();

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds });
    };

    // Calculate immediately
    calculateTimeLeft();

    // Update every second
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (num: number) => String(num).padStart(2, '0');

  return (
    <div className="bg-bg-card border border-primary/20 rounded-lg p-2 shadow-glow-cyan">
      <div className="text-center">
        {hasWrittenToday ? (
          <>
            <div className="text-xs text-success mb-0.5 flex items-center justify-center gap-1 font-mono">
              <span>✅</span>
              <span>ENTRY CLAIMED!</span>
            </div>
            <div className="text-xs text-primary/50 mb-1 font-mono">Next entry in:</div>
          </>
        ) : (
          <div className="text-xs text-warning mb-1 flex items-center justify-center gap-1 animate-pulse font-mono">
            <span>⏰</span>
            <span>TIME LEFT:</span>
          </div>
        )}

        {/* Countdown Timer */}
        <div className="flex items-center justify-center gap-1">
          <div className="bg-bg-lcd/50 rounded px-1.5 py-1 border border-primary/20">
            <div className="text-sm font-bold text-primary font-mono drop-shadow-[0_0_4px_rgba(0,229,255,0.4)]">
              {formatTime(timeLeft.hours)}
            </div>
          </div>
          <div className="text-sm text-primary/40 font-mono">:</div>
          <div className="bg-bg-lcd/50 rounded px-1.5 py-1 border border-primary/20">
            <div className="text-sm font-bold text-primary font-mono drop-shadow-[0_0_4px_rgba(0,229,255,0.4)]">
              {formatTime(timeLeft.minutes)}
            </div>
          </div>
          <div className="text-sm text-primary/40 font-mono">:</div>
          <div className="bg-bg-lcd/50 rounded px-1.5 py-1 border border-primary/20">
            <div className="text-sm font-bold text-primary font-mono drop-shadow-[0_0_4px_rgba(0,229,255,0.4)]">
              {formatTime(timeLeft.seconds)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
