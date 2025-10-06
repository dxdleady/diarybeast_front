'use client';

import { getNextMilestone } from '@/lib/gamification/streakRewards';

interface Entry {
  id: string;
  date: string;
}

interface StreakCalendarProps {
  entries: Entry[];
  currentStreak: number;
}

export function StreakCalendar({ entries, currentStreak }: StreakCalendarProps) {
  // Get last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    date.setHours(0, 0, 0, 0);
    return date;
  });

  // Check which days have entries
  const hasEntry = (date: Date) => {
    return entries.some((entry) => {
      const entryDate = new Date(entry.date);
      entryDate.setHours(0, 0, 0, 0);
      return entryDate.getTime() === date.getTime();
    });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date.getTime() === today.getTime();
  };

  return (
    <div className="mt-3">
      <div className="text-xs text-gray-400 mb-2 text-center">Last 7 Days</div>
      <div className="flex items-center justify-center gap-1">
        {last7Days.map((date, index) => {
          const hasEntryForDay = hasEntry(date);
          const isTodayDate = isToday(date);
          const dayLabel = date.toLocaleDateString('en-US', { weekday: 'short' })[0];

          return (
            <div key={index} className="flex flex-col items-center">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  hasEntryForDay
                    ? 'bg-green-500 text-white'
                    : isTodayDate
                    ? 'bg-orange-500/30 text-orange-400 border border-orange-500 animate-pulse'
                    : 'bg-gray-700 text-gray-500'
                }`}
                title={date.toLocaleDateString()}
              >
                {hasEntryForDay ? '✓' : dayLabel}
              </div>
              <div className="text-xs text-gray-500 mt-0.5">{dayLabel}</div>
            </div>
          );
        })}
      </div>
      {currentStreak > 0 && (
        <div className="text-xs text-center mt-2 space-y-1">
          <div className="text-orange-400 font-semibold">
            🔥 {currentStreak} day streak!
          </div>
          {(() => {
            const nextMilestone = getNextMilestone(currentStreak);
            if (!nextMilestone) {
              return <div className="text-yellow-400">🏆 Max milestone reached!</div>;
            }
            const daysLeft = nextMilestone.streak - currentStreak;
            return (
              <div className="text-gray-500">
                {daysLeft} more for +{nextMilestone.bonus} 💎
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
