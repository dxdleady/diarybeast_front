'use client';

interface GamificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GamificationModal({ isOpen, onClose }: GamificationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
      <div className="bg-bg-card rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-primary/20 shadow-glow-cyan">
        {/* Header */}
        <div className="sticky top-0 bg-bg-card border-b border-primary/20 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-display font-bold text-primary drop-shadow-[0_0_6px_rgba(0,229,255,0.3)]">
            🎮 Gamification Guide
          </h2>
          <button
            onClick={onClose}
            className="text-primary/60 hover:text-primary transition-colors text-2xl"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 text-primary/80 font-mono">
          {/* Earning Tokens */}
          <section>
            <h3 className="text-xl font-display font-bold text-primary mb-3 flex items-center gap-2 drop-shadow-[0_0_4px_rgba(0,229,255,0.3)]">
              <img
                src="/assets/tamagochi-coin.svg"
                alt="DIARY"
                className="w-6 h-6"
                style={{
                  filter:
                    'brightness(0) saturate(100%) invert(80%) sepia(48%) saturate(1000%) hue-rotate(2deg) brightness(104%) contrast(101%)',
                }}
              />
              How to Earn DIARY Tokens
            </h3>
            <div className="space-y-3 pl-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">📝</span>
                <div>
                  <p className="font-semibold text-primary">Daily Entry</p>
                  <p className="text-sm">
                    Write a diary entry to earn{' '}
                    <strong className="text-tokens">10 DIARY tokens</strong>
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">🎉</span>
                <div>
                  <p className="font-semibold text-primary">First Entry Bonus</p>
                  <p className="text-sm">
                    Your very first entry rewards you with{' '}
                    <strong className="text-tokens">50 DIARY tokens</strong>
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <img
                  src="/assets/tamagochi-achievements-daily-crypto.svg"
                  alt="Streak"
                  className="w-8 h-8"
                  style={{
                    filter:
                      'brightness(0) saturate(100%) invert(69%) sepia(52%) saturate(2288%) hue-rotate(359deg) brightness(101%) contrast(101%)',
                  }}
                />
                <div className="flex-1">
                  <p className="font-semibold text-primary">Streak Milestone Bonuses</p>
                  <p className="text-sm mb-2">Reach these milestones for bonus tokens:</p>
                  <div className="text-xs space-y-1 ml-4">
                    <div className="flex justify-between">
                      <span>• 3 days:</span>
                      <span className="text-streak font-semibold">+5 tokens</span>
                    </div>
                    <div className="flex justify-between">
                      <span>• 7 days (Week):</span>
                      <span className="text-streak font-semibold">+20 tokens</span>
                    </div>
                    <div className="flex justify-between">
                      <span>• 14 days (2 Weeks):</span>
                      <span className="text-streak font-semibold">+50 tokens</span>
                    </div>
                    <div className="flex justify-between">
                      <span>• 30 days (Month):</span>
                      <span className="text-streak font-semibold">+100 tokens</span>
                    </div>
                    <div className="flex justify-between">
                      <span>• 90 days (3 Months):</span>
                      <span className="text-streak font-semibold">+500 tokens</span>
                    </div>
                    <div className="flex justify-between">
                      <span>• 365 days (Year):</span>
                      <span className="text-streak font-semibold">+5000 tokens 🎉</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Pet Lives System */}
          <section>
            <h3 className="text-xl font-display font-bold text-primary mb-3 flex items-center gap-2 drop-shadow-[0_0_4px_rgba(0,229,255,0.3)]">
              ❤️ Pet Lives System
            </h3>
            <div className="space-y-3 pl-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">💚</span>
                <div>
                  <p className="font-semibold text-primary">Claimed Life</p>
                  <p className="text-sm">
                    Write your entry today to claim a life and restore +2 lives
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">❤️</span>
                <div>
                  <p className="font-semibold text-primary">Available Life</p>
                  <p className="text-sm">Lives you currently have but haven&apos;t claimed today</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">🖤</span>
                <div>
                  <p className="font-semibold text-primary">Lost Life</p>
                  <p className="text-sm">
                    Lost due to missing entries (1 life per 24h after grace period)
                  </p>
                </div>
              </div>
              <div className="bg-warning/20 border border-warning rounded-lg p-3 mt-3">
                <p className="text-sm">
                  <strong>⚠️ Grace Period:</strong> You have 24 hours before losing your first life.
                  After that, you lose 1 life every 24 hours until you write an entry.
                </p>
              </div>
            </div>
          </section>

          {/* Spending Tokens */}
          <section>
            <h3 className="text-xl font-display font-bold text-primary mb-3 flex items-center gap-2 drop-shadow-[0_0_4px_rgba(0,229,255,0.3)]">
              🛍️ How to Spend DIARY Tokens
            </h3>
            <div className="space-y-3 pl-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">🎨</span>
                <div>
                  <p className="font-semibold text-primary">Backgrounds</p>
                  <p className="text-sm">
                    Customize your diary with beautiful themed backgrounds (20-50 tokens)
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">👔</span>
                <div>
                  <p className="font-semibold text-primary">Pet Accessories</p>
                  <p className="text-sm">
                    Dress up your pet with hats, glasses, and more (30-100 tokens)
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">🐾</span>
                <div>
                  <p className="font-semibold text-primary">New Animals</p>
                  <p className="text-sm">
                    Unlock different pet companions to join you (100+ tokens)
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">🎵</span>
                <div>
                  <p className="font-semibold text-primary">Music & Themes (Coming Soon)</p>
                  <p className="text-sm">Unlock ambient music and special diary themes</p>
                </div>
              </div>
            </div>
          </section>

          {/* Streaks */}
          <section>
            <h3 className="text-xl font-display font-bold text-primary mb-3 flex items-center gap-2 drop-shadow-[0_0_4px_rgba(0,229,255,0.3)]">
              <img
                src="/assets/tamagochi-achievements-daily-crypto.svg"
                alt="Streak"
                className="w-6 h-6"
                style={{
                  filter:
                    'brightness(0) saturate(100%) invert(69%) sepia(52%) saturate(2288%) hue-rotate(359deg) brightness(101%) contrast(101%)',
                }}
              />
              Streaks - How They Work
            </h3>
            <div className="space-y-3 pl-4">
              <p className="text-sm">
                Build your writing habit by maintaining a daily streak. Your{' '}
                <strong className="text-primary">Current Streak</strong> shows{' '}
                <strong className="text-primary">consecutive days</strong> of writing, while{' '}
                <strong className="text-primary">Longest Streak</strong> is your personal record.
              </p>

              <div className="bg-primary/20 border border-primary/40 rounded-lg p-3">
                <p className="text-sm mb-2">
                  <strong>✅ How to Continue a Streak:</strong>
                </p>
                <ul className="text-sm space-y-1 ml-4">
                  <li>• Write an entry today</li>
                  <li>
                    • Come back <strong className="text-primary">tomorrow</strong> and write again
                  </li>
                  <li>• Repeat daily to build your streak</li>
                </ul>
                <p className="text-xs text-primary/60 mt-2 flex items-center gap-1">
                  <span>Example: Write on Mon, Tue, Wed = 3 day streak</span>
                  <img
                    src="/assets/tamagochi-achievements-daily-crypto.svg"
                    alt="Streak"
                    className="w-3 h-3 inline"
                    style={{
                      filter:
                        'brightness(0) saturate(100%) invert(69%) sepia(52%) saturate(2288%) hue-rotate(359deg) brightness(101%) contrast(101%)',
                    }}
                  />
                </p>
              </div>

              <div className="bg-warning/20 border border-warning rounded-lg p-3">
                <p className="text-sm mb-2">
                  <strong>⚠️ When Streaks Reset:</strong>
                </p>
                <ul className="text-sm space-y-1 ml-4">
                  <li>• Skip a day → streak resets to 0</li>
                  <li>• Lose any lives due to inactivity → streak resets</li>
                  <li>• Write again to start a new streak</li>
                </ul>
                <p className="text-xs text-primary/60 mt-2">
                  Example: Write Mon, Tue, skip Wed → streak resets ❌
                </p>
              </div>

              <div className="bg-error/20 border border-error rounded-lg p-3">
                <p className="text-sm">
                  <strong>💔 Critical:</strong> If your pet loses all lives (reaches 0), your streak
                  is lost forever! Write daily to keep both your pet and streak alive.
                </p>
              </div>

              <div className="text-xs text-primary/50 mt-3 text-center">
                💡 Tip: Check the 7-day calendar in the sidebar to track your streak progress!
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-bg-card border-t border-primary/20 p-4">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 btn-primary rounded-lg font-semibold transition-colors font-mono"
          >
            [Got it! Let&apos;s write 📝]
          </button>
        </div>
      </div>
    </div>
  );
}
