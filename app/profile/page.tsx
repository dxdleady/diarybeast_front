'use client';

import { useAccount } from 'wagmi';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { MonthlyCalendar } from '@/components/MonthlyCalendar';

export default function Profile() {
  const { address } = useAccount();
  const [userData, setUserData] = useState<any>(null);
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [aiAnalysisEnabled, setAiAnalysisEnabled] = useState(false);

  useEffect(() => {
    loadUserData();
  }, [address]);

  async function loadUserData() {
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
      setAiAnalysisEnabled(userData.aiAnalysisEnabled || false);
    } catch (error) {
      console.error('Failed to load user:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleAiAnalysis(enabled: boolean) {
    if (!address) return;

    setSaving(true);
    try {
      const res = await fetch(`/api/user/${address}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ aiAnalysisEnabled: enabled }),
      });

      if (!res.ok) {
        throw new Error('Failed to update settings');
      }

      setAiAnalysisEnabled(enabled);
    } catch (error) {
      console.error('Failed to update:', error);
      alert('Failed to update settings');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div>User not found</div>
      </div>
    );
  }

  const petImage = userData.selectedAnimal === 'cat'
    ? '/pets/cat.svg'
    : '/pets/dog.svg';

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/diary"
            className="text-gray-400 hover:text-white transition-colors mb-4 inline-block"
          >
            ← Back to Diary
          </Link>
          <h1 className="text-4xl font-bold">Profile</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Pet Image */}
          <div className="bg-gray-800 rounded-xl p-8">
            <h2 className="text-xl font-semibold mb-6">Your Beast</h2>
            <div className="text-center">
              <div className="w-64 h-64 mx-auto bg-gray-700 rounded-full flex items-center justify-center mb-4 overflow-hidden">
                <img
                  src={petImage}
                  alt={userData.selectedAnimal}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to emoji if image not found
                    e.currentTarget.style.display = 'none';
                    const parent = e.currentTarget.parentElement;
                    if (parent) {
                      parent.innerHTML = `<div class="text-9xl">${
                        userData.selectedAnimal === 'cat' ? '😺' : '🐶'
                      }</div>`;
                    }
                  }}
                />
              </div>
              <div className="text-2xl font-bold capitalize mb-2">
                {userData.selectedAnimal}
              </div>
              <div className="text-gray-400">
                Health: {userData.livesRemaining}/7 ❤️
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-gray-800 rounded-xl p-8">
            <h2 className="text-xl font-semibold mb-6">Statistics</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-gray-700 rounded-lg">
                <span className="text-gray-300">💎 DIARY Tokens</span>
                <span className="text-2xl font-bold text-blue-400">
                  {userData.coinsBalance}
                </span>
              </div>
              <div className="flex justify-between items-center p-4 bg-gray-700 rounded-lg">
                <span className="text-gray-300">🔥 Current Streak</span>
                <span className="text-2xl font-bold text-orange-400">
                  {userData.currentStreak} days
                </span>
              </div>
              <div className="flex justify-between items-center p-4 bg-gray-700 rounded-lg">
                <span className="text-gray-300">🏆 Longest Streak</span>
                <span className="text-2xl font-bold text-yellow-400">
                  {userData.longestStreak} days
                </span>
              </div>
              <div className="flex justify-between items-center p-4 bg-gray-700 rounded-lg">
                <span className="text-gray-300">📝 Total Entries</span>
                <span className="text-2xl font-bold text-green-400">
                  {userData.totalEntries}
                </span>
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className="bg-gray-800 rounded-xl p-8 md:col-span-2">
            <h2 className="text-xl font-semibold mb-6">Settings</h2>

            <div className="space-y-6">
              {/* AI Analysis Permission */}
              <div className="flex items-start justify-between p-6 bg-gray-700 rounded-lg">
                <div className="flex-1 pr-4">
                  <h3 className="font-semibold mb-2">AI Analysis</h3>
                  <p className="text-sm text-gray-400">
                    Allow AI to read and analyze your diary entries to provide
                    insights, mood tracking, and personalized recommendations.
                    Your entries remain encrypted and private.
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Coming soon: AI-powered insights and analysis
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <label className="relative inline-block w-14 h-8">
                    <input
                      type="checkbox"
                      checked={aiAnalysisEnabled}
                      onChange={(e) => handleToggleAiAnalysis(e.target.checked)}
                      disabled={saving}
                      className="opacity-0 w-0 h-0 peer"
                    />
                    <span className="absolute cursor-pointer inset-0 bg-gray-600 rounded-full transition-colors peer-checked:bg-blue-600 peer-disabled:opacity-50">
                      <span className="absolute left-1 bottom-1 bg-white w-6 h-6 rounded-full transition-transform peer-checked:translate-x-6"></span>
                    </span>
                  </label>
                </div>
              </div>

              {/* Wallet Info */}
              <div className="p-6 bg-gray-700 rounded-lg">
                <h3 className="font-semibold mb-2">Wallet Address</h3>
                <p className="text-sm text-gray-400 font-mono break-all">
                  {userData.walletAddress}
                </p>
              </div>
            </div>
          </div>

          {/* Monthly Calendar */}
          <div className="md:col-span-2">
            <MonthlyCalendar entries={entries} />
          </div>
        </div>
      </div>
    </div>
  );
}
