'use client';

import { useRouter } from 'next/navigation';

export default function InfoPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg-dark via-bg-darker to-bg-dark text-white pb-40">
      <div className="max-w-4xl mx-auto p-8">
        {/* Header with Back Button */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="btn-primary px-4 py-2 rounded-lg font-mono text-sm mb-4"
          >
            [← BACK]
          </button>
          <h1 className="text-5xl font-display font-bold text-primary drop-shadow-[0_0_10px_rgba(0,229,255,0.3)]">
            About DiaryBeast
          </h1>
        </div>

        {/* Content */}
        <div className="space-y-6 font-mono text-primary/80">
          <section className="bg-bg-card/80 backdrop-blur-md border border-primary/10 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-primary mb-4">[What is DiaryBeast?]</h2>
            <p className="leading-relaxed">
              DiaryBeast is a Web3 gamified journaling app where you write daily entries to feed and
              evolve your virtual pet. Your thoughts become your pet&apos;s food, and your
              consistency determines its growth.
            </p>
          </section>

          <section className="bg-bg-card/80 backdrop-blur-md border border-primary/10 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-primary mb-4">[How It Works]</h2>
            <ul className="space-y-3 list-disc list-inside">
              <li>Write daily journal entries (min 50 words)</li>
              <li>Earn DIARY tokens for each entry</li>
              <li>Feed your pet to keep it alive and happy</li>
              <li>Buy items from the shop to customize your pet</li>
              <li>Build streaks for bonus rewards</li>
            </ul>
          </section>

          <section className="bg-bg-card/80 backdrop-blur-md border border-primary/10 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-primary mb-4">[Token Economy]</h2>
            <div className="space-y-2">
              <p className="font-bold text-tokens">Earn DIARY tokens:</p>
              <p>• First Entry: 50 DIARY tokens (base)</p>
              <p>• Daily Entry: 10 DIARY tokens (base)</p>
              <p>• Streak Bonuses: 7d/30d/100d milestones</p>
              <p className="font-bold text-tokens mt-3">Spend DIARY tokens:</p>
              <p>• Weekly Summary: -50 DIARY</p>
              <p>• Shop Items: 50-100 DIARY</p>
              <p>• Premium Food: 15-50 DIARY</p>
              <p>• Consumables: 50-150 DIARY</p>
              <p className="text-warning mt-4">⚠️ Rewards affected by pet condition!</p>
            </div>
          </section>

          <section className="bg-bg-card/80 backdrop-blur-md border border-primary/10 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-primary mb-4">[Reward Multipliers]</h2>
            <div className="space-y-3">
              <div>
                <p className="text-success font-bold">Perfect (1.0x) - Full Rewards</p>
                <p className="text-sm opacity-80">Happiness ≥70% AND Lives ≥5</p>
              </div>
              <div>
                <p className="text-tokens font-bold">Good (0.8x) - 80% Rewards</p>
                <p className="text-sm opacity-80">Happiness ≥50% AND Lives ≥3</p>
              </div>
              <div>
                <p className="text-warning font-bold">Poor (0.5x) - 50% Rewards</p>
                <p className="text-sm opacity-80">Happiness &lt;50% OR Lives &lt;3</p>
              </div>
              <div>
                <p className="text-error font-bold">Critical (0.25x) - 25% Rewards</p>
                <p className="text-sm opacity-80">Lives ≤1 (Pet dying!)</p>
              </div>
              <p className="text-primary/60 text-sm mt-4">
                Example: 10 DIARY daily reward becomes 2.5 DIARY when critical
              </p>
            </div>
          </section>

          <section className="bg-bg-card/80 backdrop-blur-md border border-primary/10 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-primary mb-4">[Privacy & Security]</h2>
            <p className="leading-relaxed">
              Your journal entries are encrypted end-to-end and stored securely. Only you have
              access to your private thoughts. We use blockchain technology to ensure data integrity
              and ownership.
            </p>
          </section>

          <section className="bg-bg-card/80 backdrop-blur-md border border-primary/10 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-primary mb-4">[Pet Mechanics]</h2>
            <div className="space-y-3">
              <div>
                <p className="font-bold text-primary">Lives System</p>
                <p className="text-sm opacity-80">• Start: 7/7 lives</p>
                <p className="text-sm opacity-80">• Grace Period: 24h without penalty</p>
                <p className="text-sm opacity-80">• Life Loss: -1 life per 24h inactivity</p>
                <p className="text-sm opacity-80">• Write Entry: +2 lives (not full restore!)</p>
                <p className="text-sm opacity-80">• Feed Pet: +1-2 lives (depends on food)</p>
              </div>
              <div className="mt-4">
                <p className="font-bold text-primary">Happiness System</p>
                <p className="text-sm opacity-80">• Start: 100%</p>
                <p className="text-sm opacity-80">• Decay: -1% every 2 hours inactive</p>
                <p className="text-sm opacity-80">
                  • Play with Pet: +10-15% (varies by personality)
                </p>
                <p className="text-sm opacity-80">• Premium Food: +10-30% bonus</p>
              </div>
              <div className="mt-4">
                <p className="font-bold text-primary">Pet Personality</p>
                <p className="text-sm opacity-80">
                  <span className="text-accent">• Unique per wallet!</span> Each pet has random
                  traits
                </p>
                <p className="text-sm opacity-80">• Energy Level: Lazy / Normal / Hyper</p>
                <p className="text-sm opacity-80">
                  • Favorite Food: Meat / Veggie / Kibble / Energy
                </p>
                <p className="text-sm opacity-80">• Sleep Schedule: Morning / Afternoon / Night</p>
                <p className="text-sm opacity-80 text-warning">💡 Favorite food gives 2x effect!</p>
              </div>
              <div className="mt-4">
                <p className="font-bold text-primary">Pet States</p>
                <p className="text-sm opacity-80">
                  <span className="text-success">• Happy:</span> Happiness ≥70%, Lives ≥5
                </p>
                <p className="text-sm opacity-80">
                  <span className="text-warning">• Sad:</span> Happiness &lt;30% OR Lives ≤2
                </p>
                <p className="text-sm opacity-80">
                  <span className="text-error">• Critical:</span> Lives = 0 (Pet dies)
                </p>
                <p className="text-sm opacity-80">
                  <span className="text-primary">• Sleeping:</span> Inactive 12+ hours
                </p>
              </div>
            </div>
          </section>

          <section className="bg-bg-card/80 backdrop-blur-md border border-primary/10 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-primary mb-4">[Food & Items]</h2>
            <div className="space-y-3">
              <div>
                <p className="font-bold text-tokens">Food Types:</p>
                <p className="text-sm opacity-80">🥘 Basic Kibble: 5 DIARY (+1♥, 8h cooldown)</p>
                <p className="text-sm opacity-80">
                  🍖 Premium Meat: 20 DIARY (+1♥ +10☺, 6h cooldown)
                </p>
                <p className="text-sm opacity-80">
                  🥗 Veggie Bowl: 15 DIARY (+1♥ +20☺, 6h cooldown)
                </p>
                <p className="text-sm opacity-80">
                  ⚡ Energy Drink: 50 DIARY (+2♥ +30☺, 8h cooldown)
                </p>
                <p className="text-warning text-sm mt-2">
                  💡 Favorite food bonus: 2x effect! Check your pet&apos;s personality.
                </p>
              </div>
              <div className="mt-3">
                <p className="font-bold text-tokens">Consumable Items:</p>
                <p className="text-sm opacity-80">
                  ⏰ Time Skip Potion: 100 DIARY (reset feed/play cooldowns)
                </p>
                <p className="text-sm opacity-80">
                  💊 Health Potion: 150 DIARY (+3♥ lives instant)
                </p>
                <p className="text-sm opacity-80">
                  💊 Happy Pill: 50 DIARY (+30☺ happiness instant)
                </p>
              </div>
              <div className="mt-3">
                <p className="font-bold text-accent">Shop System:</p>
                <p className="text-sm opacity-80">• Buy food → Stored in inventory</p>
                <p className="text-sm opacity-80">• Click [FEED] on pet → Select from inventory</p>
                <p className="text-sm opacity-80">• DIARY tokens burn on-chain when purchasing</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
