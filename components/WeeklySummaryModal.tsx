'use client';

interface PlutchikEmotions {
  joy: number;
  trust: number;
  fear: number;
  surprise: number;
  sadness: number;
  disgust: number;
  anger: number;
  anticipation: number;
}

interface WeeklySummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  weekLabel: string;
  emotions: PlutchikEmotions;
  summary: string;
  insights: string[];
  trend: 'improving' | 'stable' | 'declining';
  newBalance?: number;
}

const EMOTION_CONFIG = {
  joy: { emoji: '😊', color: 'bg-yellow-500', label: 'Joy' },
  trust: { emoji: '🤝', color: 'bg-green-500', label: 'Trust' },
  fear: { emoji: '😨', color: 'bg-purple-500', label: 'Fear' },
  surprise: { emoji: '😲', color: 'bg-orange-500', label: 'Surprise' },
  sadness: { emoji: '😢', color: 'bg-blue-500', label: 'Sadness' },
  disgust: { emoji: '🤢', color: 'bg-pink-500', label: 'Disgust' },
  anger: { emoji: '😡', color: 'bg-red-500', label: 'Anger' },
  anticipation: { emoji: '🎯', color: 'bg-cyan-500', label: 'Anticipation' },
};

const TREND_CONFIG = {
  improving: { emoji: '📈', label: 'Improving', color: 'text-green-400' },
  stable: { emoji: '➡️', label: 'Stable', color: 'text-blue-400' },
  declining: { emoji: '📉', label: 'Needs Attention', color: 'text-orange-400' },
};

export function WeeklySummaryModal({
  isOpen,
  onClose,
  weekLabel,
  emotions,
  summary,
  insights,
  trend,
  newBalance,
}: WeeklySummaryModalProps) {
  if (!isOpen) return null;

  // Sort emotions by intensity
  const sortedEmotions = Object.entries(emotions)
    .sort(([, a], [, b]) => b - a)
    .map(([emotion, intensity]) => ({
      emotion: emotion as keyof PlutchikEmotions,
      intensity,
    }));

  const trendInfo = TREND_CONFIG[trend];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
      <div className="bg-gray-800 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
        {/* Header */}
        <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              📊 Weekly Analysis
            </h2>
            <p className="text-gray-400 text-sm mt-1">{weekLabel}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors text-2xl"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Cost Info */}
          {newBalance !== undefined && (
            <div className="bg-purple-900/30 border border-purple-700 rounded-lg p-4 text-center">
              <div className="text-sm text-gray-400">Analysis Cost: 💎 500 DIARY</div>
              <div className="text-lg font-semibold text-white mt-1">
                New Balance: 💎 {newBalance} DIARY
              </div>
            </div>
          )}

          {/* Emotion Wheel */}
          <section>
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              🎭 Plutchik&apos;s Emotions
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {sortedEmotions.map(({ emotion, intensity }) => {
                const config = EMOTION_CONFIG[emotion];
                return (
                  <div
                    key={emotion}
                    className="bg-gray-700 rounded-lg p-3 text-center"
                  >
                    <div className="text-3xl mb-2">{config.emoji}</div>
                    <div className="text-sm font-medium text-white mb-2">
                      {config.label}
                    </div>
                    <div className="w-full bg-gray-600 rounded-full h-2 mb-1">
                      <div
                        className={`h-2 rounded-full ${config.color} transition-all duration-300`}
                        style={{ width: `${intensity}%` }}
                      />
                    </div>
                    <div className="text-xs text-gray-400">{intensity}%</div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Summary */}
          <section>
            <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              📝 Summary
            </h3>
            <div className="bg-gray-700 rounded-lg p-4">
              <p className="text-gray-300 leading-relaxed">{summary}</p>
            </div>
          </section>

          {/* Key Insights */}
          <section>
            <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              💡 Key Insights
            </h3>
            <div className="space-y-3">
              {insights.map((insight, index) => (
                <div
                  key={index}
                  className="bg-gray-700 rounded-lg p-4 flex items-start gap-3"
                >
                  <span className="text-blue-400 font-bold">#{index + 1}</span>
                  <p className="text-gray-300 flex-1">{insight}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Emotional Trend */}
          <section>
            <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              📊 Emotional Trend
            </h3>
            <div className="bg-gray-700 rounded-lg p-4 text-center">
              <div className="text-4xl mb-2">{trendInfo.emoji}</div>
              <div className={`text-2xl font-bold ${trendInfo.color}`}>
                {trendInfo.label}
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-800 border-t border-gray-700 p-4">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
