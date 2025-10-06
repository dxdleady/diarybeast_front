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

export default function Diary() {
  const { address } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { encryptionKey } = useEncryptionKey();
  const [userData, setUserData] = useState<any>(null);
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

  useEffect(() => {
    loadData();
  }, [address]);

  async function loadData() {
    if (!address) return;

    try {
      const [userRes, entriesRes] = await Promise.all([
        fetch(`/api/user/${address}`),
        fetch(`/api/entries?userAddress=${address}`),
      ]);

      const userData = await userRes.json();
      const entriesData = await entriesRes.json();

      setUserData(userData);
      setEntries(entriesData.entries || []);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  }

  function handleSummaryGenerated(summary: any) {
    setSummaryData(summary);
    setShowSummaryModal(true);
    // Reload user data to update balance
    loadData();
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
      });
      setShowSuccessModal(true);
      setContent('');

      // Reload data
      await loadData();
    } catch (error: any) {
      console.error('Save failed:', error);
      alert(error.message || 'Failed to save entry');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="h-screen bg-gray-900 text-white flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  // Background colors based on activeBackground
  const getBackgroundClass = () => {
    if (!userData?.activeBackground) return 'bg-gray-900';

    const bgMap: Record<string, string> = {
      'bg-default': 'bg-gray-900',
      'bg-sunset': 'bg-gradient-to-br from-orange-900 via-purple-900 to-gray-900',
      'bg-ocean': 'bg-gradient-to-br from-blue-900 via-cyan-900 to-gray-900',
      'bg-forest': 'bg-gradient-to-br from-green-900 via-emerald-900 to-gray-900',
      'bg-space': 'bg-gradient-to-br from-indigo-900 via-purple-900 to-black',
    };

    return bgMap[userData.activeBackground] || 'bg-gray-900';
  };

  // Check if user has written today
  const hasWrittenToday = userData?.lastEntryDate
    ? new Date(userData.lastEntryDate).toDateString() === new Date().toDateString()
    : false;

  return (
    <>
      <div className={`h-screen text-white flex overflow-hidden ${getBackgroundClass()}`}>
        {/* Left Sidebar - Weekly History */}
        <div className="w-64 flex-shrink-0 overflow-hidden">
          <WeeklyHistory
            entries={entries}
            onEntryClick={setSelectedEntry}
            onSummaryGenerated={handleSummaryGenerated}
            userBalance={userData?.coinsBalance || 0}
          />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto relative">
          {/* Daily Timer - Fixed in corner */}
          <div className="fixed top-4 right-[21rem] z-40">
            <DailyTimer hasWrittenToday={hasWrittenToday} />
          </div>

          {selectedEntry ? (
            <EntryViewer
              entry={selectedEntry}
              onBack={() => setSelectedEntry(null)}
            />
          ) : (
            <div className="max-w-3xl mx-auto p-8">
              <div className="mb-6">
                <h1 className="text-3xl font-bold mb-2">Today&apos;s Entry</h1>
                <p className="text-gray-400">
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
              />

              <div className="mt-4 flex justify-between items-center">
                <div className="text-sm text-gray-400">
                  {content.split(/\s+/).filter(Boolean).length} words
                </div>
                <button
                  onClick={handleSave}
                  disabled={!content.trim() || saving}
                  className="px-8 py-3 bg-blue-600 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
                >
                  {saving ? 'Saving...' : 'Save & Sign Entry'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar - Stats, Pet, Menu */}
        <div className="w-80 flex-shrink-0 overflow-hidden">
          <RightSidebar userData={userData} entries={entries} />
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
    </>
  );
}
