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
  onOpenGamification?: () => void;
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

      const isCurrentWeek = weekStart.toISOString() === currentWeekStart.toISOString();

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

function formatWeekLabel(start: Date, end: Date, isCurrentWeek: boolean): string {
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

export function WeeklyHistory({
  entries,
  onEntryClick,
  onSummaryGenerated,
  userBalance = 0,
  onOpenGamification,
}: WeeklyHistoryProps) {
  const { address } = useAccount();
  const weekGroups = groupEntriesByWeek(entries);
  const [expandedWeeks, setExpandedWeeks] = useState<Set<string>>(
    new Set(weekGroups.find((w) => w.isCurrentWeek)?.weekLabel ? [weekGroups[0].weekLabel] : [])
  );
  const [generatingWeek, setGeneratingWeek] = useState<string | null>(null);
  const [isHistoryCollapsed, setIsHistoryCollapsed] = useState(false);

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
    if (!address || userBalance < 50) {
      alert('You need 50 DIARY tokens to generate a summary');
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
        console.error('Summary generation failed:', { status: res.status, data });
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
      <div className="h-full bg-bg-dark border-r border-primary/20 p-4">
        {/* Logo */}
        <div className="mb-6 flex items-center gap-3">
          <img
            src="/assets/diary-beast-tamagochi.svg"
            alt="DiaryBeast"
            className="w-10 h-10 object-contain"
            style={{
              filter:
                'brightness(0) saturate(100%) invert(70%) sepia(98%) saturate(2476%) hue-rotate(160deg) brightness(103%) contrast(101%)',
            }}
          />
          <h1 className="text-xl font-display font-bold text-primary drop-shadow-[0_0_8px_rgba(0,229,255,0.3)]">
            DiaryBeast
          </h1>
        </div>

        <h2 className="text-lg font-mono font-semibold mb-4 text-white">History</h2>
        <p className="text-sm text-primary/50 font-mono">No entries yet</p>
      </div>
    );
  }

  return (
    <div className="h-full bg-bg-dark border-r border-primary/20 flex flex-col">
      {/* Logo */}
      <div className="p-4 pb-3 flex items-center gap-3">
        <img
          src="/assets/diary-beast-tamagochi.svg"
          alt="DiaryBeast"
          className="w-10 h-10 object-contain"
          style={{
            filter:
              'brightness(0) saturate(100%) invert(70%) sepia(98%) saturate(2476%) hue-rotate(160deg) brightness(103%) contrast(101%)',
          }}
        />
        <h1 className="text-xl font-display font-bold text-primary drop-shadow-[0_0_8px_rgba(0,229,255,0.3)]">
          DiaryBeast
        </h1>
      </div>

      <div className="px-4 pb-3 pt-6 border-b border-primary/20 flex items-center justify-between">
        <h2 className="text-lg font-mono font-semibold text-white">History</h2>
        <button
          onClick={() => setIsHistoryCollapsed(!isHistoryCollapsed)}
          className="text-primary hover:text-primary/80 transition-all"
        >
          <span className="text-xl">{isHistoryCollapsed ? '▶' : '▼'}</span>
        </button>
      </div>

      {!isHistoryCollapsed && (
        <div className="flex-1 overflow-y-auto p-2">
          {weekGroups.map((week) => {
            const isExpanded = expandedWeeks.has(week.weekLabel);

            return (
              <div key={week.weekLabel} className="mb-2">
                <div>
                  <button
                    onClick={() => toggleWeek(week.weekLabel)}
                    className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-primary/10 border border-transparent hover:border-primary/20 transition-all text-left"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-primary font-mono">
                        {isExpanded ? '▼' : '▶'}
                      </span>
                      <span className="font-display font-medium text-sm text-primary">
                        {week.weekLabel}
                      </span>
                      {week.isCurrentWeek && (
                        <span className="text-xs bg-primary/20 text-primary border border-primary/40 px-2 py-0.5 rounded-full font-mono">
                          CURRENT
                        </span>
                      )}
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
                        disabled={generatingWeek === week.weekLabel || userBalance < 50}
                        className="w-full btn-primary px-3 py-2 rounded-lg text-xs font-mono font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1"
                      >
                        {generatingWeek === week.weekLabel ? (
                          '[ANALYZING...]'
                        ) : (
                          <>
                            <span>[SUMMARY -</span>
                            <img
                              src="/assets/tamagochi-coin.svg"
                              alt="DIARY"
                              className="w-3 h-3"
                              style={{
                                filter:
                                  'brightness(0) saturate(100%) invert(80%) sepia(48%) saturate(1000%) hue-rotate(2deg) brightness(104%) contrast(101%)',
                              }}
                            />
                            <span>50]</span>
                          </>
                        )}
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
                            className={`aspect-square flex flex-col items-center justify-center rounded text-xs font-mono border ${
                              hasEntry
                                ? 'bg-success/20 text-success border-success/40 font-semibold drop-shadow-[0_0_4px_rgba(57,255,20,0.4)]'
                                : isFuture
                                  ? 'bg-bg-lcd/30 text-primary/30 border-primary/10'
                                  : 'bg-bg-lcd/30 text-primary/50 border-primary/20'
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
                        className="p-2 rounded-lg hover:bg-primary/10 border border-transparent hover:border-primary/20 cursor-pointer transition-all"
                      >
                        <div className="text-xs text-primary font-mono">
                          {formatEntryDate(entry.date)}
                        </div>
                        <div className="text-xs text-primary/50 mt-0.5 font-mono">
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
      )}
    </div>
  );
}
