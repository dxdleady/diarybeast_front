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
    <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 border border-blue-700/50 rounded-lg p-2">
      <div className="text-center">
        {hasWrittenToday ? (
          <>
            <div className="text-xs text-gray-300 mb-0.5 flex items-center justify-center gap-1">
              <span>✅</span>
              <span>Entry claimed!</span>
            </div>
            <div className="text-xs text-gray-500 mb-1">Next entry in:</div>
          </>
        ) : (
          <div className="text-xs text-orange-400 mb-1 flex items-center justify-center gap-1 animate-pulse">
            <span>⏰</span>
            <span>Time left:</span>
          </div>
        )}

        {/* Countdown Timer */}
        <div className="flex items-center justify-center gap-1">
          <div className="bg-gray-800 rounded px-1.5 py-1">
            <div className="text-sm font-bold text-white">{formatTime(timeLeft.hours)}</div>
          </div>
          <div className="text-sm text-gray-500">:</div>
          <div className="bg-gray-800 rounded px-1.5 py-1">
            <div className="text-sm font-bold text-white">{formatTime(timeLeft.minutes)}</div>
          </div>
          <div className="text-sm text-gray-500">:</div>
          <div className="bg-gray-800 rounded px-1.5 py-1">
            <div className="text-sm font-bold text-white">{formatTime(timeLeft.seconds)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
