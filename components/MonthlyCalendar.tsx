'use client';

interface Entry {
  id: string;
  date: string;
}

interface MonthlyCalendarProps {
  entries: Entry[];
}

export function MonthlyCalendar({ entries }: MonthlyCalendarProps) {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  // Get first day of month
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);

  // Get day of week for first day (0 = Sunday, 1 = Monday, etc.)
  const startingDayOfWeek = firstDayOfMonth.getDay();

  // Get total days in month
  const daysInMonth = lastDayOfMonth.getDate();

  // Create array of all days in month
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Create array of empty slots for days before month starts
  const emptySlots = Array.from({ length: startingDayOfWeek }, () => null);

  // Check if a day has an entry
  const hasEntry = (day: number) => {
    const date = new Date(currentYear, currentMonth, day);
    date.setHours(0, 0, 0, 0);

    return entries.some((entry) => {
      const entryDate = new Date(entry.date);
      entryDate.setHours(0, 0, 0, 0);
      return entryDate.getTime() === date.getTime();
    });
  };

  // Check if day is today
  const isToday = (day: number) => {
    return day === now.getDate() && currentMonth === now.getMonth();
  };

  // Check if day is in the future
  const isFutureDay = (day: number) => {
    const date = new Date(currentYear, currentMonth, day);
    return date > now;
  };

  const monthName = now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-bg-card border border-primary/20 rounded-xl p-6 shadow-glow-cyan">
      <h2 className="text-xl font-display font-semibold mb-4 text-primary drop-shadow-[0_0_6px_rgba(0,229,255,0.3)]">
        {monthName}
      </h2>

      {/* Week day headers */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {weekDays.map((day) => (
          <div key={day} className="text-center text-xs font-semibold text-primary/60 font-mono">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-2">
        {/* Empty slots before month starts */}
        {emptySlots.map((_, index) => (
          <div key={`empty-${index}`} className="aspect-square" />
        ))}

        {/* Days of month */}
        {days.map((day) => {
          const hasEntryForDay = hasEntry(day);
          const isTodayDate = isToday(day);
          const future = isFutureDay(day);

          return (
            <div
              key={day}
              className={`aspect-square flex items-center justify-center rounded text-sm font-semibold transition-all font-mono border ${
                hasEntryForDay
                  ? 'bg-success/20 text-success border-success/40 drop-shadow-[0_0_4px_rgba(57,255,20,0.4)]'
                  : isTodayDate
                    ? 'bg-warning/20 text-warning border-warning animate-pulse drop-shadow-[0_0_4px_rgba(255,165,0,0.4)]'
                    : future
                      ? 'bg-bg-lcd/30 text-primary/30 border-primary/10 cursor-not-allowed'
                      : 'bg-bg-lcd/30 text-primary/50 border-primary/20'
              }`}
              title={
                hasEntryForDay
                  ? `Entry written on ${day}`
                  : isTodayDate
                    ? 'Today'
                    : future
                      ? 'Future day'
                      : 'No entry'
              }
            >
              {hasEntryForDay ? '✓' : day}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center justify-center gap-4 text-xs font-mono">
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded bg-success/20 border border-success/40"></div>
          <span className="text-primary/60">Written</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded bg-warning/20 border border-warning"></div>
          <span className="text-primary/60">Today</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded bg-bg-lcd/30 border border-primary/20"></div>
          <span className="text-primary/60">Missed</span>
        </div>
      </div>
    </div>
  );
}
