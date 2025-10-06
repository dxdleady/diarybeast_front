'use client';

import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { WeeklySummaryModal } from '@/components/WeeklySummaryModal';

interface WeeklySummary {
  id: string;
  weekStart: string;
  weekEnd: string;
  emotions: any;
  summary: string;
  insights: string[];
  trend: 'improving' | 'stable' | 'declining';
  createdAt: string;
}

const TREND_CONFIG = {
  improving: { emoji: '📈', label: 'Improving', color: 'text-green-400' },
  stable: { emoji: '➡️', label: 'Stable', color: 'text-blue-400' },
  declining: { emoji: '📉', label: 'Needs Attention', color: 'text-orange-400' },
};

export default function InsightsPage() {
  const { address } = useAccount();
  const router = useRouter();
  const [summaries, setSummaries] = useState<WeeklySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSummary, setSelectedSummary] = useState<WeeklySummary | null>(null);

  useEffect(() => {
    if (!address) {
      router.push('/');
      return;
    }

    loadSummaries();
  }, [address, router]);

  async function loadSummaries() {
    if (!address) return;

    try {
      const res = await fetch(`/api/summary/history?userAddress=${address}`);
      const data = await res.json();

      if (res.ok) {
        setSummaries(data.summaries || []);
      }
    } catch (error) {
      console.error('Failed to load summaries:', error);
    } finally {
      setLoading(false);
    }
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  function getWeekLabel(start: string, end: string) {
    const startDate = new Date(start);
    const endDate = new Date(end);

    const startMonth = startDate.toLocaleDateString('en-US', { month: 'short' });
    const endMonth = endDate.toLocaleDateString('en-US', { month: 'short' });
    const startDay = startDate.getDate();
    const endDay = endDate.getDate();

    if (startMonth === endMonth) {
      return `${startMonth} ${startDay}-${endDay}`;
    }
    return `${startMonth} ${startDay} - ${endMonth} ${endDay}`;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div>Loading insights...</div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => router.push('/diary')}
              className="text-blue-400 hover:text-blue-300 mb-4"
            >
              ← Back to Diary
            </button>
            <h1 className="text-4xl font-bold mb-2">📊 Your Insights</h1>
            <p className="text-gray-400">
              All your weekly emotional analyses
            </p>
          </div>

          {/* Summaries List */}
          {summaries.length === 0 ? (
            <div className="text-center py-12 bg-gray-800 rounded-xl border border-gray-700">
              <div className="text-6xl mb-4">📊</div>
              <h2 className="text-2xl font-bold mb-2">No Insights Yet</h2>
              <p className="text-gray-400 mb-4">
                Generate your first weekly analysis to see insights here
              </p>
              <button
                onClick={() => router.push('/diary')}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors"
              >
                Go to Diary
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {summaries.map((summary) => {
                const trendInfo = TREND_CONFIG[summary.trend];
                const topEmotion = Object.entries(summary.emotions)
                  .sort(([, a], [, b]) => (b as number) - (a as number))[0];

                return (
                  <div
                    key={summary.id}
                    onClick={() => setSelectedSummary(summary)}
                    className="bg-gray-800 border border-gray-700 rounded-xl p-6 cursor-pointer hover:border-blue-500 transition-all hover:scale-105"
                  >
                    {/* Date */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-sm text-gray-400">
                        {getWeekLabel(summary.weekStart, summary.weekEnd)}
                      </div>
                      <div className={`text-xl ${trendInfo.color}`}>
                        {trendInfo.emoji}
                      </div>
                    </div>

                    {/* Summary Preview */}
                    <p className="text-sm text-gray-300 mb-4 line-clamp-3">
                      {summary.summary}
                    </p>

                    {/* Top Emotion */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs text-gray-500">Top Emotion:</span>
                      <span className="text-sm font-semibold capitalize">
                        {topEmotion[0]} ({Number(topEmotion[1])}%)
                      </span>
                    </div>

                    {/* Insights Count */}
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>💡 {summary.insights.length} insights</span>
                      <span>•</span>
                      <span>{formatDate(summary.createdAt)}</span>
                    </div>

                    {/* View Button */}
                    <button className="mt-4 w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-semibold transition-colors">
                      View Details
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Summary Modal */}
      {selectedSummary && (
        <WeeklySummaryModal
          isOpen={!!selectedSummary}
          onClose={() => setSelectedSummary(null)}
          weekLabel={getWeekLabel(selectedSummary.weekStart, selectedSummary.weekEnd)}
          emotions={selectedSummary.emotions}
          summary={selectedSummary.summary}
          insights={selectedSummary.insights}
          trend={selectedSummary.trend}
        />
      )}
    </>
  );
}
