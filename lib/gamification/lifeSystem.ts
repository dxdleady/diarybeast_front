/**
 * Life Loss System - Core Gamification Logic
 *
 * Manages pet health based on user activity:
 * - Grace period: 24 hours without penalty
 * - Life loss: 1 life per 24 hours after grace period
 * - Life restore: +2 lives per diary entry (not full restore)
 * - Midnight crossing detection for session expiration
 */

// ============================================================================
// CONSTANTS
// ============================================================================

export const GRACE_PERIOD_HOURS = 24;
export const LIFE_LOSS_INTERVAL_HOURS = 24;
export const CHECK_COOLDOWN_HOURS = 1;
export const LIVES_RESTORE_AMOUNT = 2;
export const MAX_LIVES = 7;

// ============================================================================
// TYPES
// ============================================================================

export type PetState = 'happy' | 'sad' | 'critical';

export interface LifeLossResult {
  livesLost: number;
  newLives: number;
  streakReset: boolean;
  hoursInactive: number;
  shouldNotify: boolean;
  notificationType: 'warning' | 'critical' | null;
  message: string;
}

// ============================================================================
// CORE FUNCTIONS
// ============================================================================

/**
 * Calculate life loss based on inactivity
 *
 * Formula:
 * - hoursInactive = now - lastActiveAt
 * - hoursAfterGrace = hoursInactive - GRACE_PERIOD_HOURS
 * - livesToLose = floor(hoursAfterGrace / LIFE_LOSS_INTERVAL_HOURS)
 * - newLives = max(0, currentLives - livesToLose)
 *
 * Examples:
 * - 23 hours inactive: 0 lives lost (within grace period)
 * - 48 hours inactive: 1 life lost (24h after grace)
 * - 72 hours inactive: 2 lives lost (48h after grace)
 * - 8 days inactive: 7 lives lost (all lives)
 */
export function calculateLifeLoss(
  lastActiveAt: Date,
  currentLives: number
): LifeLossResult {
  const now = new Date();
  const hoursInactive = (now.getTime() - lastActiveAt.getTime()) / (1000 * 60 * 60);

  // Within grace period - no penalty
  if (hoursInactive <= GRACE_PERIOD_HOURS) {
    return {
      livesLost: 0,
      newLives: currentLives,
      streakReset: false,
      hoursInactive,
      shouldNotify: false,
      notificationType: null,
      message: 'Welcome back!',
    };
  }

  // Calculate lives to lose after grace period
  const hoursAfterGrace = hoursInactive - GRACE_PERIOD_HOURS;
  const livesToLose = Math.floor(hoursAfterGrace / LIFE_LOSS_INTERVAL_HOURS);
  const actualLivesLost = Math.min(livesToLose, currentLives);
  const newLives = Math.max(0, currentLives - actualLivesLost);

  // Determine notification type
  let notificationType: 'warning' | 'critical' | null = null;
  let shouldNotify = false;

  if (actualLivesLost > 0) {
    shouldNotify = true;
    notificationType = newLives === 0 ? 'critical' : 'warning';
  }

  // Generate message
  const daysInactive = Math.floor(hoursInactive / 24);
  const message =
    newLives === 0
      ? `Your pet lost all lives after ${daysInactive} days away!`
      : actualLivesLost > 0
      ? `Your pet missed you! Lost ${actualLivesLost} ${actualLivesLost === 1 ? 'life' : 'lives'}`
      : 'Welcome back!';

  return {
    livesLost: actualLivesLost,
    newLives,
    streakReset: newLives === 0,
    hoursInactive,
    shouldNotify,
    notificationType,
    message,
  };
}

/**
 * Check if enough time has passed since last full check
 * Prevents spam checking (minimum 1 hour between full checks)
 */
export function shouldCheckLifeLoss(lastLifeLossCheck: Date): boolean {
  const now = new Date();
  const hoursSinceLastCheck =
    (now.getTime() - lastLifeLossCheck.getTime()) / (1000 * 60 * 60);

  return hoursSinceLastCheck >= CHECK_COOLDOWN_HOURS;
}

/**
 * Restore lives after writing entry
 * Adds LIVES_RESTORE_AMOUNT but caps at MAX_LIVES
 */
export function restoreLives(currentLives: number): number {
  return Math.min(currentLives + LIVES_RESTORE_AMOUNT, MAX_LIVES);
}

/**
 * Determine pet emotional state based on lives
 * - Happy: 4-7 lives
 * - Sad: 1-3 lives
 * - Critical: 0 lives
 */
export function getPetState(livesRemaining: number): PetState {
  if (livesRemaining === 0) return 'critical';
  if (livesRemaining >= 4) return 'happy';
  return 'sad';
}

/**
 * Format last active time in human-readable format
 * - < 1 hour: "Just now"
 * - 1-23 hours: "X hours ago"
 * - 24+ hours: "X days ago"
 */
export function formatLastActive(lastActiveAt: Date): string {
  const now = new Date();
  const hoursAgo = (now.getTime() - lastActiveAt.getTime()) / (1000 * 60 * 60);

  if (hoursAgo < 1) {
    return 'Just now';
  }

  if (hoursAgo < 24) {
    const hours = Math.floor(hoursAgo);
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  }

  const daysAgo = Math.floor(hoursAgo / 24);
  return `${daysAgo} ${daysAgo === 1 ? 'day' : 'days'} ago`;
}

/**
 * Check if user crossed midnight since last active
 * Used for session expiration logic
 *
 * Returns true if:
 * - Current date > lastActiveAt date (day boundary crossed)
 * - Even if less than 24 hours passed
 *
 * Example:
 * - lastActiveAt: Jan 1, 23:30
 * - now: Jan 2, 00:30
 * - Result: true (crossed midnight, even though only 1 hour passed)
 */
export function didCrossMidnight(lastActiveAt: Date): boolean {
  const now = new Date();

  // Get dates at midnight (00:00:00)
  const lastDate = new Date(lastActiveAt);
  lastDate.setHours(0, 0, 0, 0);

  const nowDate = new Date(now);
  nowDate.setHours(0, 0, 0, 0);

  return nowDate.getTime() > lastDate.getTime();
}

/**
 * Check if user should lose a life due to missing yesterday's entry
 * This works in conjunction with the hourly check
 *
 * Logic:
 * - If crossed midnight AND no activity today yet
 * - This triggers a life check even if <24 hours passed
 * - Integrates with grace period system
 */
export function shouldCheckDailyEntry(
  lastActiveAt: Date,
  lastEntryDate: Date | null
): boolean {
  if (!didCrossMidnight(lastActiveAt)) {
    return false;
  }

  // If user has no entry, always check
  if (!lastEntryDate) {
    return true;
  }

  // Check if last entry was before yesterday
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);

  const lastEntry = new Date(lastEntryDate);
  lastEntry.setHours(0, 0, 0, 0);

  return lastEntry.getTime() < yesterday.getTime();
}
