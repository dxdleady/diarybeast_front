'use client';

interface GamificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GamificationModal({ isOpen, onClose }: GamificationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
      <div className="bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
        {/* Header */}
        <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">🎮 Gamification Guide</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors text-2xl"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 text-gray-300">
          {/* Earning Tokens */}
          <section>
            <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              💎 How to Earn DIARY Tokens
            </h3>
            <div className="space-y-3 pl-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">📝</span>
                <div>
                  <p className="font-semibold text-white">Daily Entry</p>
                  <p className="text-sm">Write a diary entry to earn <strong>10 DIARY tokens</strong></p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">🎉</span>
                <div>
                  <p className="font-semibold text-white">First Entry Bonus</p>
                  <p className="text-sm">Your very first entry rewards you with <strong>50 DIARY tokens</strong></p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">🔥</span>
                <div className="flex-1">
                  <p className="font-semibold text-white">Streak Milestone Bonuses</p>
                  <p className="text-sm mb-2">Reach these milestones for bonus tokens:</p>
                  <div className="text-xs space-y-1 ml-4">
                    <div className="flex justify-between">
                      <span>• 3 days:</span>
                      <span className="text-orange-400 font-semibold">+5 tokens</span>
                    </div>
                    <div className="flex justify-between">
                      <span>• 7 days (Week):</span>
                      <span className="text-orange-400 font-semibold">+20 tokens</span>
                    </div>
                    <div className="flex justify-between">
                      <span>• 14 days (2 Weeks):</span>
                      <span className="text-orange-400 font-semibold">+50 tokens</span>
                    </div>
                    <div className="flex justify-between">
                      <span>• 30 days (Month):</span>
                      <span className="text-orange-400 font-semibold">+100 tokens</span>
                    </div>
                    <div className="flex justify-between">
                      <span>• 90 days (3 Months):</span>
                      <span className="text-orange-400 font-semibold">+500 tokens</span>
                    </div>
                    <div className="flex justify-between">
                      <span>• 365 days (Year):</span>
                      <span className="text-orange-400 font-semibold">+5000 tokens 🎉</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Pet Lives System */}
          <section>
            <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              ❤️ Pet Lives System
            </h3>
            <div className="space-y-3 pl-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">💚</span>
                <div>
                  <p className="font-semibold text-white">Claimed Life</p>
                  <p className="text-sm">Write your entry today to claim a life and restore +2 lives</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">❤️</span>
                <div>
                  <p className="font-semibold text-white">Available Life</p>
                  <p className="text-sm">Lives you currently have but haven&apos;t claimed today</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">🖤</span>
                <div>
                  <p className="font-semibold text-white">Lost Life</p>
                  <p className="text-sm">Lost due to missing entries (1 life per 24h after grace period)</p>
                </div>
              </div>
              <div className="bg-orange-900/30 border border-orange-700 rounded-lg p-3 mt-3">
                <p className="text-sm">
                  <strong>⚠️ Grace Period:</strong> You have 24 hours before losing your first life. After that, you lose 1 life every 24 hours until you write an entry.
                </p>
              </div>
            </div>
          </section>

          {/* Spending Tokens */}
          <section>
            <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              🛍️ How to Spend DIARY Tokens
            </h3>
            <div className="space-y-3 pl-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">🎨</span>
                <div>
                  <p className="font-semibold text-white">Backgrounds</p>
                  <p className="text-sm">Customize your diary with beautiful themed backgrounds (20-50 tokens)</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">👔</span>
                <div>
                  <p className="font-semibold text-white">Pet Accessories</p>
                  <p className="text-sm">Dress up your pet with hats, glasses, and more (30-100 tokens)</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">🐾</span>
                <div>
                  <p className="font-semibold text-white">New Animals</p>
                  <p className="text-sm">Unlock different pet companions to join you (100+ tokens)</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">🎵</span>
                <div>
                  <p className="font-semibold text-white">Music & Themes (Coming Soon)</p>
                  <p className="text-sm">Unlock ambient music and special diary themes</p>
                </div>
              </div>
            </div>
          </section>

          {/* Streaks */}
          <section>
            <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              🔥 Streaks - How They Work
            </h3>
            <div className="space-y-3 pl-4">
              <p className="text-sm">
                Build your writing habit by maintaining a daily streak. Your <strong>Current Streak</strong> shows <strong>consecutive days</strong> of writing, while <strong>Longest Streak</strong> is your personal record.
              </p>

              <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-3">
                <p className="text-sm mb-2">
                  <strong>✅ How to Continue a Streak:</strong>
                </p>
                <ul className="text-sm space-y-1 ml-4">
                  <li>• Write an entry today</li>
                  <li>• Come back <strong>tomorrow</strong> and write again</li>
                  <li>• Repeat daily to build your streak</li>
                </ul>
                <p className="text-xs text-gray-400 mt-2">
                  Example: Write on Mon, Tue, Wed = 3 day streak 🔥
                </p>
              </div>

              <div className="bg-orange-900/30 border border-orange-700 rounded-lg p-3">
                <p className="text-sm mb-2">
                  <strong>⚠️ When Streaks Reset:</strong>
                </p>
                <ul className="text-sm space-y-1 ml-4">
                  <li>• Skip a day → streak resets to 0</li>
                  <li>• Lose any lives due to inactivity → streak resets</li>
                  <li>• Write again to start a new streak</li>
                </ul>
                <p className="text-xs text-gray-400 mt-2">
                  Example: Write Mon, Tue, skip Wed → streak resets ❌
                </p>
              </div>

              <div className="bg-red-900/30 border border-red-700 rounded-lg p-3">
                <p className="text-sm">
                  <strong>💔 Critical:</strong> If your pet loses all lives (reaches 0), your streak is lost forever! Write daily to keep both your pet and streak alive.
                </p>
              </div>

              <div className="text-xs text-gray-500 mt-3 text-center">
                💡 Tip: Check the 7-day calendar in the sidebar to track your streak progress!
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
            Got it! Let&apos;s write 📝
          </button>
        </div>
      </div>
    </div>
  );
}
