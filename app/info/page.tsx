'use client';

import { useRouter } from 'next/navigation';

export default function InfoPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg-dark via-bg-darker to-bg-dark text-white">
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
              <p>• New Entry: 60 DIARY tokens</p>
              <p>• Weekly Insights: 50 DIARY tokens</p>
              <p>• Feeding Cost: -10 HP</p>
              <p>• Shop Items: Various prices</p>
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
            <h2 className="text-2xl font-bold text-primary mb-4">[Pet States]</h2>
            <div className="space-y-2">
              <p>
                <span className="text-success">• Happy (HP 6-7):</span> Your pet is thriving!
              </p>
              <p>
                <span className="text-warning">• Hungry (HP 3-5):</span> Feed your pet soon
              </p>
              <p>
                <span className="text-error">• Critical (HP 1-2):</span> Urgent! Feed immediately
              </p>
              <p>
                <span className="text-inactive">• Lost (HP 0):</span> Pet has run away - write to
                revive
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
