'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';

interface Entry {
  id: string;
  date: string;
  wordCount: number;
  encryptedContent: string;
}

interface WeekGroup {
  weekLabel: string;
  startDate: Date;
  endDate: Date;
  entries: Entry[];
  isCurrentWeek: boolean;
}

interface WeeklyHistoryProps {
  entries: Entry[];
  onEntryClick: (entry: Entry) => void;
  onSummaryGenerated?: (summary: any) => void;
  userBalance?: number;
}

function groupEntriesByWeek(entries: Entry[]): WeekGroup[] {
  if (!entries || entries.length === 0) return [];

  const now = new Date();
  const groups: WeekGroup[] = [];
  const weekMap = new Map<string, Entry[]>();

  entries.forEach((entry) => {
    const entryDate = new Date(entry.date);
    const weekStart = getWeekStart(entryDate);
    const weekKey = weekStart.toISOString();

    if (!weekMap.has(weekKey)) {
      weekMap.set(weekKey, []);
    }
    weekMap.get(weekKey)!.push(entry);
  });

  const currentWeekStart = getWeekStart(now);

  Array.from(weekMap.entries())
    .sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())
    .forEach(([weekKey, weekEntries]) => {
      const weekStart = new Date(weekKey);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);

      const isCurrentWeek =
        weekStart.toISOString() === currentWeekStart.toISOString();

      groups.push({
        weekLabel: formatWeekLabel(weekStart, weekEnd, isCurrentWeek),
        startDate: weekStart,
        endDate: weekEnd,
        entries: weekEntries.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        ),
        isCurrentWeek,
      });
    });

  return groups;
}

function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday as first day
  const weekStart = new Date(d.setDate(diff));
  weekStart.setHours(0, 0, 0, 0);
  return weekStart;
}

function formatWeekLabel(
  start: Date,
  end: Date,
  isCurrentWeek: boolean
): string {
  if (isCurrentWeek) return 'This Week';

  const startMonth = start.toLocaleDateString('en-US', { month: 'short' });
  const endMonth = end.toLocaleDateString('en-US', { month: 'short' });
  const startDay = start.getDate();
  const endDay = end.getDate();

  if (startMonth === endMonth) {
    return `${startMonth} ${startDay}-${endDay}`;
  }
  return `${startMonth} ${startDay} - ${endMonth} ${endDay}`;
}

function formatEntryDate(date: string): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

export function WeeklyHistory({ entries, onEntryClick, onSummaryGenerated, userBalance = 0 }: WeeklyHistoryProps) {
  const { address } = useAccount();
  const weekGroups = groupEntriesByWeek(entries);
  const [expandedWeeks, setExpandedWeeks] = useState<Set<string>>(
    new Set(weekGroups.find((w) => w.isCurrentWeek)?.weekLabel ? [weekGroups[0].weekLabel] : [])
  );
  const [generatingWeek, setGeneratingWeek] = useState<string | null>(null);

  const toggleWeek = (weekLabel: string) => {
    setExpandedWeeks((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(weekLabel)) {
        newSet.delete(weekLabel);
      } else {
        newSet.add(weekLabel);
      }
      return newSet;
    });
  };

  const handleGenerateSummary = async (week: WeekGroup) => {
    if (!address || userBalance < 500) {
      alert('You need 500 DIARY tokens to generate a summary');
      return;
    }

    setGeneratingWeek(week.weekLabel);
    try {
      const res = await fetch('/api/summary/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userAddress: address,
          weekStart: week.startDate.toISOString(),
          weekEnd: week.endDate.toISOString(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate summary');
      }

      if (onSummaryGenerated) {
        onSummaryGenerated({
          ...data.summary,
          weekLabel: week.weekLabel,
          newBalance: data.newBalance,
        });
      }
    } catch (error: any) {
      console.error('Summary generation failed:', error);
      alert(error.message || 'Failed to generate summary');
    } finally {
      setGeneratingWeek(null);
    }
  };

  if (weekGroups.length === 0) {
    return (
      <div className="h-full bg-gray-800 border-r border-gray-700 p-4">
        <h2 className="text-lg font-semibold mb-4 text-gray-300">History</h2>
        <p className="text-sm text-gray-500">No entries yet</p>
      </div>
    );
  }

  return (
    <div className="h-full bg-gray-800 border-r border-gray-700 overflow-y-auto">
      <div className="p-4 border-b border-gray-700 sticky top-0 bg-gray-800 z-10">
        <h2 className="text-lg font-semibold text-gray-300">History</h2>
      </div>

      <div className="p-2">
        {weekGroups.map((week) => {
          const isExpanded = expandedWeeks.has(week.weekLabel);

          return (
            <div key={week.weekLabel} className="mb-2">
              <div>
                <button
                  onClick={() => toggleWeek(week.weekLabel)}
                  className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-700 transition-colors text-left"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm">
                      {isExpanded ? '▼' : '▶'}
                    </span>
                    <span className="font-medium text-sm">
                      {week.weekLabel}
                    </span>
                    {week.isCurrentWeek && (
                      <span className="text-xs bg-blue-600 px-2 py-0.5 rounded-full">
                        Current
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-xs text-gray-400">
                      {week.entries.length}/7 days
                    </span>
                    <span className="text-xs text-gray-500">
                      {week.entries.length} {week.entries.length === 1 ? 'entry' : 'entries'}
                    </span>
                  </div>
                </button>

                {/* Generate Summary Button */}
                {week.entries.length > 0 && (
                  <div className="px-3 pb-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleGenerateSummary(week);
                      }}
                      disabled={generatingWeek === week.weekLabel || userBalance < 500}
                      className={`w-full px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                        generatingWeek === week.weekLabel
                          ? 'bg-blue-600/50 cursor-wait'
                          : userBalance < 500
                          ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                          : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'
                      }`}
                    >
                      {generatingWeek === week.weekLabel
                        ? '⏳ Analyzing...'
                        : '📊 Generate Summary 💎500'}
                    </button>
                  </div>
                )}
              </div>

              {isExpanded && (
                <div className="ml-6 mt-2 space-y-2">
                  {/* Week Grid View */}
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {Array.from({ length: 7 }).map((_, dayIndex) => {
                      const currentDay = new Date(week.startDate);
                      currentDay.setDate(currentDay.getDate() + dayIndex);

                      const hasEntry = week.entries.some((entry) => {
                        const entryDate = new Date(entry.date);
                        return entryDate.toDateString() === currentDay.toDateString();
                      });

                      const dayLabel = ['M', 'T', 'W', 'T', 'F', 'S', 'S'][dayIndex];
                      const isFuture = currentDay > new Date();

                      return (
                        <div
                          key={dayIndex}
                          className={`aspect-square flex flex-col items-center justify-center rounded text-xs ${
                            hasEntry
                              ? 'bg-green-500 text-white font-semibold'
                              : isFuture
                              ? 'bg-gray-800 text-gray-600'
                              : 'bg-gray-700 text-gray-500'
                          }`}
                          title={currentDay.toLocaleDateString()}
                        >
                          <div>{dayLabel}</div>
                          <div className="text-xs">{hasEntry ? '✓' : currentDay.getDate()}</div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Entry List */}
                  {week.entries.map((entry) => (
                    <div
                      key={entry.id}
                      onClick={() => onEntryClick(entry)}
                      className="p-2 rounded-lg hover:bg-gray-700/50 cursor-pointer transition-colors"
                    >
                      <div className="text-xs text-gray-300">
                        {formatEntryDate(entry.date)}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {entry.wordCount} words
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
