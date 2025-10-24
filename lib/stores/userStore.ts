/**
 * User State Management Store
 * Manages user balance, stats, and profile data globally
 */

import { create } from 'zustand';

interface UserData {
  id: string;
  walletAddress: string;
  selectedAnimal: string | null;
  petName: string | null;
  userName: string | null;
  userAge: number | null;
  diaryGoal: string | null;
  onboardingCompleted: boolean;
  coinsBalance: number;
  livesRemaining: number;
  currentStreak: number;
  longestStreak: number;
  lastEntryDate: string | null;
  lastActiveAt: string;
  aiAnalysisEnabled: boolean;
  activeBackground: string | null;
  activeAccessory: string | null;
  totalEntries: number;
  happiness: number;
  petState: string;
  petPersonality: any;
  inventory: Record<string, number>;
  lastFeedTime: string | null;
  lastPlayTime: string | null;
}

interface UserStoreState {
  // User data
  user: UserData | null;
  loading: boolean;
  error: string | null;

  // Actions
  initializeUser: (userData: UserData) => void;
  refreshUser: (address: string) => Promise<void>;
  updateBalance: (newBalance: number) => void;
  incrementBalance: (amount: number) => void;
  decrementBalance: (amount: number) => void;
  updateInventory: (newInventory: Record<string, number>) => void;
  updateLives: (newLives: number) => void;
  updateHappiness: (newHappiness: number) => void;
  updateStreak: (currentStreak: number, longestStreak?: number) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserStoreState>((set, get) => ({
  // Initial state
  user: null,
  loading: false,
  error: null,

  // Initialize user with data (e.g., after auth)
  initializeUser: (userData) => {
    set({
      user: userData,
      loading: false,
      error: null,
    });
  },

  // Refresh user data from API
  refreshUser: async (address) => {
    if (!address) return;

    set({ loading: true, error: null });

    try {
      const res = await fetch(`/api/user/${address}?t=${Date.now()}`, {
        cache: 'no-store',
      });

      if (!res.ok) {
        throw new Error('Failed to fetch user data');
      }

      const userData = await res.json();

      set({
        user: userData,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error('Failed to refresh user:', error);
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  },

  // Update balance directly
  updateBalance: (newBalance) => {
    const { user } = get();
    if (!user) return;

    set({
      user: {
        ...user,
        coinsBalance: newBalance,
      },
    });
  },

  // Increment balance (optimistic update)
  incrementBalance: (amount) => {
    const { user } = get();
    if (!user) return;

    set({
      user: {
        ...user,
        coinsBalance: user.coinsBalance + amount,
      },
    });
  },

  // Decrement balance (optimistic update)
  decrementBalance: (amount) => {
    const { user } = get();
    if (!user) return;

    set({
      user: {
        ...user,
        coinsBalance: Math.max(0, user.coinsBalance - amount),
      },
    });
  },

  // Update inventory
  updateInventory: (newInventory) => {
    const { user } = get();
    if (!user) return;

    set({
      user: {
        ...user,
        inventory: newInventory,
      },
    });
  },

  // Update lives
  updateLives: (newLives) => {
    const { user } = get();
    if (!user) return;

    set({
      user: {
        ...user,
        livesRemaining: newLives,
      },
    });
  },

  // Update happiness
  updateHappiness: (newHappiness) => {
    const { user } = get();
    if (!user) return;

    set({
      user: {
        ...user,
        happiness: newHappiness,
      },
    });
  },

  // Update streak
  updateStreak: (currentStreak, longestStreak) => {
    const { user } = get();
    if (!user) return;

    set({
      user: {
        ...user,
        currentStreak,
        longestStreak: longestStreak ?? user.longestStreak,
      },
    });
  },

  // Clear user data (e.g., on logout)
  clearUser: () => {
    set({
      user: null,
      loading: false,
      error: null,
    });
  },
}));
