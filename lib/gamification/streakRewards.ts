/**
 * Streak Rewards System
 *
 * Provides bonus tokens for reaching streak milestones
 */

export interface StreakReward {
  streak: number;
  bonus: number;
  label: string;
}

// Streak milestone rewards
export const STREAK_MILESTONES: StreakReward[] = [
  { streak: 3, bonus: 5, label: '3-Day Streak' },
  { streak: 7, bonus: 20, label: 'Week Streak' },
  { streak: 14, bonus: 50, label: '2-Week Streak' },
  { streak: 30, bonus: 100, label: 'Month Streak' },
  { streak: 60, bonus: 250, label: '2-Month Streak' },
  { streak: 90, bonus: 500, label: '3-Month Streak' },
  { streak: 180, bonus: 1000, label: '6-Month Streak' },
  { streak: 365, bonus: 5000, label: 'Year Streak' },
];

/**
 * Calculate bonus tokens for a given streak
 * Returns 0 if no milestone reached
 */
export function calculateStreakBonus(currentStreak: number): {
  bonus: number;
  milestone: StreakReward | null;
} {
  // Check if current streak is a milestone
  const milestone = STREAK_MILESTONES.find(m => m.streak === currentStreak);

  if (milestone) {
    return {
      bonus: milestone.bonus,
      milestone,
    };
  }

  return {
    bonus: 0,
    milestone: null,
  };
}

/**
 * Get next milestone for a given streak
 */
export function getNextMilestone(currentStreak: number): StreakReward | null {
  return STREAK_MILESTONES.find(m => m.streak > currentStreak) || null;
}

/**
 * Get all milestones for display
 */
export function getAllMilestones(): StreakReward[] {
  return STREAK_MILESTONES;
}
