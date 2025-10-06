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
    <div className="bg-gray-800 rounded-xl p-6">
      <h2 className="text-xl font-semibold mb-4">{monthName}</h2>

      {/* Week day headers */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {weekDays.map((day) => (
          <div key={day} className="text-center text-xs font-semibold text-gray-400">
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
              className={`aspect-square flex items-center justify-center rounded-lg text-sm font-semibold transition-all ${
                hasEntryForDay
                  ? 'bg-green-500 text-white'
                  : isTodayDate
                  ? 'bg-orange-500/30 text-orange-400 border-2 border-orange-500'
                  : future
                  ? 'bg-gray-900 text-gray-600 cursor-not-allowed'
                  : 'bg-gray-700 text-gray-400'
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
      <div className="mt-4 flex items-center justify-center gap-4 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded bg-green-500"></div>
          <span className="text-gray-400">Entry written</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded bg-orange-500/30 border-2 border-orange-500"></div>
          <span className="text-gray-400">Today</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded bg-gray-700"></div>
          <span className="text-gray-400">Missed</span>
        </div>
      </div>
    </div>
  );
}
