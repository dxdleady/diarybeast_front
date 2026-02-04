'use client';

import { useAccount, useSignMessage } from 'wagmi';
import { useEffect, useState } from 'react';
import { encryptContent, hashContent } from '@/lib/encryption';
import { WeeklyHistory } from '@/components/WeeklyHistory';
import { RightSidebar } from '@/components/RightSidebar';
import { EntryViewer } from '@/components/EntryViewer';
import { TextEditor } from '@/components/TextEditor';
import { useEncryptionKey } from '@/lib/EncryptionKeyContext';
import { EntrySuccessModal } from '@/components/EntrySuccessModal';
import { DailyTimer } from '@/components/DailyTimer';
import { WeeklySummaryModal } from '@/components/WeeklySummaryModal';
import { GamificationModal } from '@/components/GamificationModal';
import { useGamification } from '@/lib/contexts/GamificationContext';
import { useUserStore } from '@/lib/stores/userStore';

export default function Diary() {
  const { address } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { encryptionKey } = useEncryptionKey();
  const { showGamificationModal, closeGamificationModal } = useGamification();
  const { user: userData, refreshUser, initializeUser } = useUserStore();
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedEntry, setSelectedEntry] = useState<any>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successData, setSuccessData] = useState<any>(null);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [summaryData, setSummaryData] = useState<any>(null);
  const [shareToWall, setShareToWall] = useState(false);
  const [publicExcerpt, setPublicExcerpt] = useState('');
  const [publicTags, setPublicTags] = useState<string[]>([]);

  // Function to reload data (used by Pet component when stats change)
  async function reloadData() {
    if (!address) return;

    try {
      // Refresh user from store (updates balance globally)
      await refreshUser(address);

      // Reload entries
      const entriesRes = await fetch(`/api/entries?userAddress=${address}&t=${Date.now()}`, {
        cache: 'no-store',
      });
      const entriesData = await entriesRes.json();
      setEntries(entriesData.entries || []);
    } catch (error) {
      console.error('Failed to reload data:', error);
    }
  }

  // Load data on mount and when address changes
  useEffect(() => {
    async function loadData() {
      if (!address) return;

      try {
        // Use store's refreshUser instead of direct fetch to avoid duplication
        await refreshUser(address);

        // Load entries
        const entriesRes = await fetch(`/api/entries?userAddress=${address}&t=${Date.now()}`, {
          cache: 'no-store',
        });
        const entriesData = await entriesRes.json();
        setEntries(entriesData.entries || []);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  async function handleSummaryGenerated(summary: any) {
    // Refresh user data from store to update balance
    if (address) {
      await refreshUser(address);
    }
    // Show modal with updated balance
    setSummaryData(summary);
    setShowSummaryModal(true);
  }

  async function handleSave() {
    if (!address || !content.trim() || !encryptionKey) return;

    setSaving(true);
    setSuccessMessage('');

    try {
      // 1. Encrypt content with deterministic key
      const encryptedContent = encryptContent(content, encryptionKey);

      // 2. Hash content
      const contentHash = hashContent(content);

      // 4. Sign hash
      const signature = await signMessageAsync({
        message: { raw: contentHash },
      });

      // 5. Save to API
      const res = await fetch('/api/entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userAddress: address,
          encryptedContent,
          signature,
          contentHash,
          wordCount: content.split(/\s+/).filter(Boolean).length,
          ...(shareToWall &&
            publicExcerpt.trim() && {
              publicExcerpt: publicExcerpt.trim(),
              publicTags,
            }),
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to save');
      }

      const data = await res.json();

      // Show success modal with data
      setSuccessData({
        tokensEarned: data.reward.amount,
        streakBonus: data.reward.streakBonus || 0,
        milestone: data.reward.milestone || null,
        livesRestored: data.livesRestored || 0,
        oldLives: data.oldLives || 0,
        newLives: data.updatedUser.livesRemaining,
        baseAmount: data.reward.baseAmount,
        multiplier: data.reward.multiplier,
        multiplierReason: data.reward.multiplierReason,
      });
      setShowSuccessModal(true);
      setContent('');
      setShareToWall(false);
      setPublicExcerpt('');
      setPublicTags([]);

      // Reload data - both user and entries
      if (address) {
        await refreshUser(address);
      }
      const entriesRes = await fetch(`/api/entries?userAddress=${address}&t=${Date.now()}`, {
        cache: 'no-store',
      });
      const entriesData = await entriesRes.json();
      setEntries(entriesData.entries || []);
    } catch (error: any) {
      console.error('Save failed:', error);
      alert(error.message || 'Failed to save entry');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="h-screen bg-bg-dark text-primary flex items-center justify-center">
        <div className="text-center">
          <div className="font-mono text-lg mb-4 animate-pulse">Loading...</div>
          <div className="text-primary/40 font-mono text-sm">Initializing DiaryBeast</div>
        </div>
      </div>
    );
  }

  // Background colors based on activeBackground
  const getBackgroundClass = () => {
    if (!userData?.activeBackground) return 'bg-bg-dark';

    const bgMap: Record<string, string> = {
      'bg-default': 'bg-bg-dark',
      'bg-sunset': 'bg-gradient-to-br from-orange-900 via-purple-900 to-[var(--bg-dark)]',
      'bg-ocean': 'bg-gradient-to-br from-secondary via-primary/20 to-[var(--bg-dark)]',
      'bg-forest': 'bg-gradient-to-br from-green-900 via-accent/20 to-[var(--bg-dark)]',
      'bg-space': 'bg-gradient-to-br from-secondary via-purple-900 to-black',
    };

    return bgMap[userData.activeBackground] || 'bg-bg-dark';
  };

  // Check if user has written today
  const hasWrittenToday = userData?.lastEntryDate
    ? new Date(userData.lastEntryDate).toDateString() === new Date().toDateString()
    : false;

  return (
    <>
      <div className={`h-screen text-white flex overflow-hidden ${getBackgroundClass()}`}>
        {/* Left Sidebar - Weekly History */}
        <div className="w-80 flex-shrink-0 overflow-hidden">
          <WeeklyHistory
            entries={entries}
            onEntryClick={setSelectedEntry}
            onSummaryGenerated={handleSummaryGenerated}
            userBalance={userData?.coinsBalance || 0}
          />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto relative">
          {/* Daily Timer - Fixed in top right of content area */}
          <div className="absolute top-4 right-4 z-40">
            <DailyTimer hasWrittenToday={hasWrittenToday} />
          </div>

          {selectedEntry ? (
            <EntryViewer entry={selectedEntry} onBack={() => setSelectedEntry(null)} />
          ) : (
            <div className="pt-4 pb-32">
              <div className="w-full px-8">
                <div className="mb-6 text-center">
                  <h1 className="text-4xl font-display font-bold mb-2 text-primary drop-shadow-[0_0_10px_rgba(0,229,255,0.3)]">
                    Today&apos;s Entry
                  </h1>
                  <p className="text-primary/60 font-mono text-sm">
                    {new Date().toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>

                <TextEditor
                  value={content}
                  onChange={setContent}
                  placeholder="How was your day? Write your thoughts here..."
                  wordCount={content.split(/\s+/).filter(Boolean).length}
                  actionButton={
                    <button
                      onClick={handleSave}
                      disabled={!content.trim() || saving || (shareToWall && !publicExcerpt.trim())}
                      className="btn-primary px-6 py-2 rounded-lg font-mono text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {saving ? '[SAVING...]' : '[SAVE & SIGN]'}
                    </button>
                  }
                />

                {/* Share to The Wall */}
                <div className="mt-4 bg-bg-card/80 backdrop-blur-md border border-primary/10 rounded-xl p-4 hover:border-primary/20 transition-all duration-300">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={shareToWall}
                      onChange={(e) => setShareToWall(e.target.checked)}
                      className="w-4 h-4 accent-primary"
                    />
                    <span className="font-mono text-sm text-primary/80">Share to The Wall</span>
                    <span className="font-mono text-xs text-primary/40">
                      — publish an excerpt anonymously
                    </span>
                  </label>

                  {shareToWall && (
                    <div className="mt-3 space-y-3 pl-7">
                      <textarea
                        value={publicExcerpt}
                        onChange={(e) => setPublicExcerpt(e.target.value)}
                        placeholder="Write what you want to share publicly (a poem, a thought, a confession...)"
                        rows={3}
                        maxLength={2000}
                        className="w-full p-3 lcd-screen rounded-lg text-primary placeholder-primary/40 resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 font-mono text-sm"
                      />
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs text-primary/50">Tags:</span>
                        {['#rant', '#poem', '#feelings', '#wisdom', '#confession'].map((tag) => (
                          <button
                            key={tag}
                            type="button"
                            onClick={() =>
                              setPublicTags((prev) =>
                                prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
                              )
                            }
                            className={`px-2 py-0.5 rounded text-xs font-mono transition-all ${
                              publicTags.includes(tag)
                                ? 'bg-primary/20 text-primary border border-primary/40'
                                : 'bg-bg-lcd/50 text-primary/50 border border-primary/10 hover:border-primary/30'
                            }`}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                      <p className="font-mono text-xs text-primary/30">
                        {publicExcerpt.length}/2000 · This will be posted anonymously. Your pet type
                        and streak will be shown.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar - Stats, Pet, Menu */}
        <div className="w-80 flex-shrink-0 overflow-hidden">
          <RightSidebar userData={userData} entries={entries} onStatsChange={reloadData} />
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && successData && (
        <EntrySuccessModal
          isOpen={showSuccessModal}
          tokensEarned={successData.tokensEarned}
          streakBonus={successData.streakBonus}
          milestone={successData.milestone}
          livesRestored={successData.livesRestored}
          oldLives={successData.oldLives}
          newLives={successData.newLives}
          baseAmount={successData.baseAmount}
          multiplier={successData.multiplier}
          multiplierReason={successData.multiplierReason}
          onClose={() => setShowSuccessModal(false)}
        />
      )}

      {/* Weekly Summary Modal */}
      {showSummaryModal && summaryData && (
        <WeeklySummaryModal
          isOpen={showSummaryModal}
          onClose={() => setShowSummaryModal(false)}
          weekLabel={summaryData.weekLabel}
          emotions={summaryData.emotions}
          summary={summaryData.summary}
          insights={summaryData.insights}
          trend={summaryData.trend}
          newBalance={summaryData.newBalance}
        />
      )}

      {/* Gamification Modal */}
      <GamificationModal isOpen={showGamificationModal} onClose={closeGamificationModal} />
    </>
  );
}
