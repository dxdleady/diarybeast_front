'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import DonateButton from '@/components/DonateButton';

const PET_EMOJI: Record<string, string> = {
  cat: '🐱',
  dog: '🐕',
  lobster: '🦞',
  phoenix: '🔥',
  dragon: '🐉',
  unicorn: '🦄',
};

interface LeaderboardEntry {
  rank: number;
  walletAddress: string;
  fullAddress: string;
  petName: string | null;
  petType: string | null;
  streak: number;
  bestStreak: number;
  entries: number;
  balance: number;
  isAgent: boolean;
  isRare: boolean;
  happiness: number;
  lives: number;
}

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState('streak');
  const [filter, setFilter] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ sort });
    if (filter) params.set('filter', filter);
    const res = await fetch(`/api/leaderboard?${params}`);
    const data = await res.json();
    setEntries(data.leaderboard || []);
    setLoading(false);
  }, [sort, filter]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="min-h-screen bg-gray-950 text-green-400 font-mono">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-2">LEADERBOARD</h1>
        <p className="text-green-700 text-center text-sm mb-8">Top pets by dedication</p>

        <div className="flex flex-wrap gap-2 mb-6 justify-center">
          {['streak', 'entries', 'balance'].map((s) => (
            <button
              key={s}
              onClick={() => setSort(s)}
              className={`px-3 py-1 border text-sm ${sort === s ? 'border-green-400 text-green-400' : 'border-green-800 text-green-700'}`}
            >
              {s}
            </button>
          ))}
          <span className="text-green-800 mx-1">|</span>
          {[null, 'agents', 'humans', 'rare'].map((f) => (
            <button
              key={f || 'all'}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 border text-sm ${filter === f ? 'border-green-400 text-green-400' : 'border-green-800 text-green-700'}`}
            >
              {f || 'all'}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center text-green-700 py-12">Loading...</div>
        ) : (
          <div className="border border-green-800">
            <div className="grid grid-cols-[3rem_1fr_5rem_5rem_5rem] gap-0 text-xs text-green-700 border-b border-green-800 p-2">
              <span>#</span>
              <span>PET</span>
              <span className="text-right">STREAK</span>
              <span className="text-right">ENTRIES</span>
              <span className="text-right">DIARY</span>
            </div>
            {entries.map((e) => (
              <Link
                key={e.fullAddress}
                href={`/pet/${e.fullAddress}`}
                className="grid grid-cols-[3rem_1fr_5rem_5rem_5rem] gap-0 p-2 border-b border-green-900 hover:bg-green-900/20 transition-colors"
              >
                <span className={e.rank <= 3 ? 'text-yellow-400' : 'text-green-700'}>{e.rank}</span>
                <span className="flex items-center gap-2 truncate">
                  <span>{PET_EMOJI[e.petType || 'cat'] || '🐾'}</span>
                  <span className="truncate">{e.petName || e.walletAddress}</span>
                  {e.isAgent && <span className="text-xs text-green-800">[AI]</span>}
                  {e.isRare && <span className="text-xs text-yellow-500">★</span>}
                </span>
                <span className="text-right">{e.streak}d</span>
                <span className="text-right">{e.entries}</span>
                <span className="text-right">{e.balance}</span>
              </Link>
            ))}
          </div>
        )}

        <div className="text-center mt-8">
          <Link href="/" className="text-green-600 hover:text-green-400 text-sm">
            ← Get your own pet and compete
          </Link>
        </div>

        <div className="mt-4 max-w-sm mx-auto">
          <DonateButton />
        </div>
      </div>
    </div>
  );
}
