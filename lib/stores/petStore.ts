/**
 * Pet State Management Store
 * Manages pet stats, actions, and cooldowns
 */

import { create } from 'zustand';
import type { PetState } from '../ascii/types';

const MAX_LIVES = 7;
const MAX_HAPPINESS = 100;
const FEED_COOLDOWN_MS = 8 * 60 * 60 * 1000; // 8 hours
const PLAY_COOLDOWN_MS = 4 * 60 * 60 * 1000; // 4 hours

interface PetStoreState {
  // Core stats
  lives: number;
  happiness: number;
  state: PetState;
  lastFeedTime: Date | null;
  lastPlayTime: Date | null;

  // Computed properties
  canFeed: boolean;
  canPlay: boolean;
  feedCooldownRemaining: number; // milliseconds
  playCooldownRemaining: number; // milliseconds

  // Actions
  initializePet: (data: {
    lives: number;
    happiness: number;
    lastFeedTime?: string | null;
    lastPlayTime?: string | null;
  }) => void;
  setState: (newState: PetState) => void;
  feed: (userAddress: string) => Promise<void>;
  play: (userAddress: string) => Promise<void>;
  updateHappiness: (delta: number) => void;
  updateLives: (newLives: number) => void;
  updateCooldowns: () => void;
}

export const usePetStore = create<PetStoreState>((set, get) => ({
  // Initial state
  lives: 7,
  happiness: 100,
  state: 'idle',
  lastFeedTime: null,
  lastPlayTime: null,
  canFeed: true,
  canPlay: true,
  feedCooldownRemaining: 0,
  playCooldownRemaining: 0,

  // Initialize pet with server data
  initializePet: (data) => {
    const lastFeed = data.lastFeedTime ? new Date(data.lastFeedTime) : null;
    const lastPlay = data.lastPlayTime ? new Date(data.lastPlayTime) : null;

    set({
      lives: data.lives,
      happiness: data.happiness,
      lastFeedTime: lastFeed,
      lastPlayTime: lastPlay,
    });

    get().updateCooldowns();
  },

  // Set pet animation state
  setState: (newState) => set({ state: newState }),

  // Feed action
  feed: async (userAddress) => {
    const { canFeed, lives } = get();

    if (!canFeed) {
      throw new Error('Feed is on cooldown');
    }

    if (lives >= MAX_LIVES) {
      throw new Error('Pet is already at max health');
    }

    // Optimistic update
    set({
      state: 'eating',
      lastFeedTime: new Date(),
      canFeed: false,
      feedCooldownRemaining: FEED_COOLDOWN_MS,
    });

    try {
      const res = await fetch('/api/pet/feed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userAddress }),
      });

      if (!res.ok) {
        throw new Error('Feed request failed');
      }

      const data = await res.json();

      set({
        lives: data.newLives,
        happiness: data.newHappiness,
      });

      // Reset to idle after animation
      setTimeout(() => {
        if (get().state === 'eating') {
          get().setState('idle');
        }
      }, 1500);
    } catch (error) {
      // Revert on error
      set({
        state: 'idle',
        lastFeedTime: get().lastFeedTime,
        canFeed: true,
        feedCooldownRemaining: 0,
      });
      throw error;
    }
  },

  // Play action
  play: async (userAddress) => {
    const { canPlay } = get();

    if (!canPlay) {
      throw new Error('Play is on cooldown');
    }

    // Optimistic update
    set({
      state: 'playing',
      lastPlayTime: new Date(),
      canPlay: false,
      playCooldownRemaining: PLAY_COOLDOWN_MS,
    });

    try {
      const res = await fetch('/api/pet/play', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userAddress }),
      });

      if (!res.ok) {
        throw new Error('Play request failed');
      }

      const data = await res.json();

      set({
        happiness: data.newHappiness,
      });

      // Reset to happy after animation
      setTimeout(() => {
        if (get().state === 'playing') {
          get().setState('happy');
        }
      }, 1600);
    } catch (error) {
      // Revert on error
      set({
        state: 'idle',
        lastPlayTime: get().lastPlayTime,
        canPlay: true,
        playCooldownRemaining: 0,
      });
      throw error;
    }
  },

  // Update happiness (from external source)
  updateHappiness: (delta) => {
    const { happiness } = get();
    const newHappiness = Math.max(0, Math.min(MAX_HAPPINESS, happiness + delta));
    set({ happiness: newHappiness });
  },

  // Update lives (from external source)
  updateLives: (newLives) => {
    set({ lives: Math.max(0, Math.min(MAX_LIVES, newLives)) });
  },

  // Update cooldown status
  updateCooldowns: () => {
    const { lastFeedTime, lastPlayTime } = get();
    const now = Date.now();

    // Feed cooldown
    if (lastFeedTime) {
      const feedElapsed = now - lastFeedTime.getTime();
      const feedRemaining = Math.max(0, FEED_COOLDOWN_MS - feedElapsed);
      set({
        canFeed: feedRemaining === 0,
        feedCooldownRemaining: feedRemaining,
      });
    } else {
      set({ canFeed: true, feedCooldownRemaining: 0 });
    }

    // Play cooldown
    if (lastPlayTime) {
      const playElapsed = now - lastPlayTime.getTime();
      const playRemaining = Math.max(0, PLAY_COOLDOWN_MS - playElapsed);
      set({
        canPlay: playRemaining === 0,
        playCooldownRemaining: playRemaining,
      });
    } else {
      set({ canPlay: true, playCooldownRemaining: 0 });
    }
  },
}));

// Helper to format cooldown time
export function formatCooldown(ms: number): string {
  if (ms === 0) return 'Ready';

  const hours = Math.floor(ms / (1000 * 60 * 60));
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}
