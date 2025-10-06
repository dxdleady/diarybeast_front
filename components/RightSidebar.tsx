'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useDisconnect } from 'wagmi';
import { useState } from 'react';
import { Pet } from './Pet';
import { formatLastActive } from '@/lib/gamification/lifeSystem';
import { GamificationModal } from './GamificationModal';
import { StreakCalendar } from './StreakCalendar';
import { getNextMilestone } from '@/lib/gamification/streakRewards';

interface Entry {
  id: string;
  date: string;
}

interface UserData {
  selectedAnimal: 'cat' | 'dog';
  coinsBalance: number;
  currentStreak: number;
  livesRemaining: number;
  longestStreak: number;
  totalEntries?: number;
  lastActiveAt?: string;
  lastEntryDate?: string;
  petName?: string;
}

interface RightSidebarProps {
  userData: UserData | null;
  entries?: Entry[];
}

export function RightSidebar({ userData, entries = [] }: RightSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { disconnect } = useDisconnect();
  const [showGamificationModal, setShowGamificationModal] = useState(false);

  const handleLogout = () => {
    disconnect();
    router.push('/');
  };

  // Check if user has written today
  const hasWrittenToday = userData?.lastEntryDate
    ? new Date(userData.lastEntryDate).toDateString() === new Date().toDateString()
    : false;

  const menuItems = [
    { href: '/diary', label: 'Diary', icon: '📔' },
    { href: '/insights', label: 'Insights', icon: '📊' },
    { href: '/shop', label: 'Shop', icon: '🛍️' },
    { href: '/profile', label: 'Profile', icon: '👤' },
  ];

  return (
    <>
      <div className="h-full bg-gray-800 border-l border-gray-700 flex flex-col overflow-y-auto">
        {/* Statistics */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs uppercase tracking-wider text-gray-400">
              Statistics
            </h3>
            <button
              onClick={() => setShowGamificationModal(true)}
              className="text-blue-400 hover:text-blue-300 transition-colors text-xs font-medium flex items-center gap-1"
              title="Learn about gamification"
            >
              <span>ℹ️</span>
            </button>
          </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-300">💎 DIARY Tokens</span>
            <span className="text-sm font-bold text-blue-400">
              {userData?.coinsBalance ?? 0}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-300">🔥 Current Streak</span>
            <span className="text-sm font-bold text-orange-400">
              {userData?.currentStreak ?? 0}
            </span>
          </div>

          {/* Next Milestone Progress */}
          {userData && (() => {
            const nextMilestone = getNextMilestone(userData.currentStreak);
            if (!nextMilestone) return null;

            const progress = (userData.currentStreak / nextMilestone.streak) * 100;
            const daysLeft = nextMilestone.streak - userData.currentStreak;

            return (
              <div className="mt-2 p-2 bg-gray-700/50 rounded-lg">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-gray-400">Next: {nextMilestone.label}</span>
                  <span className="text-orange-400 font-semibold">+{nextMilestone.bonus} 💎</span>
                </div>
                <div className="w-full bg-gray-600 rounded-full h-1.5 mb-1">
                  <div
                    className="bg-gradient-to-r from-orange-500 to-yellow-500 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="text-xs text-gray-500 text-center">
                  {daysLeft} {daysLeft === 1 ? 'day' : 'days'} to go
                </div>
              </div>
            );
          })()}
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-300">🏆 Longest Streak</span>
            <span className="text-sm font-bold text-yellow-400">
              {userData?.longestStreak ?? 0}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-300">📝 Total Entries</span>
            <span className="text-sm font-bold text-green-400">
              {userData?.totalEntries ?? 0}
            </span>
          </div>
        </div>

        {/* Streak Calendar */}
        {userData && (
          <StreakCalendar
            entries={entries}
            currentStreak={userData.currentStreak}
          />
        )}
      </div>

      {/* Pet */}
      <div className="p-4 border-b border-gray-700">
        {userData && (
          <>
            <Pet
              animal={userData.selectedAnimal}
              livesRemaining={userData.livesRemaining}
              hasWrittenToday={hasWrittenToday}
              petName={userData.petName}
            />
          </>
        )}
      </div>

      {/* Navigation Menu */}
      <div className="p-3 flex-1">
        <h3 className="text-xs uppercase tracking-wider text-gray-400 mb-3 px-2">
          Navigation
        </h3>
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700 space-y-3">
        <button
          onClick={handleLogout}
          className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
        >
          <span>🚪</span>
          <span>Logout</span>
        </button>
        <div className="text-xs text-gray-500 text-center">
          DiaryBeast Alpha
        </div>
      </div>
    </div>

    {/* Gamification Modal */}
    <GamificationModal
      isOpen={showGamificationModal}
      onClose={() => setShowGamificationModal(false)}
    />
    </>
  );
}
