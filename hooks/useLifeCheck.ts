'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useAccount } from 'wagmi';
import { usePathname } from 'next/navigation';
import { didCrossMidnight } from '@/lib/gamification/lifeSystem';

export interface LifeCheckNotification {
  livesLost: number;
  newLives: number;
  streakReset: boolean;
  notificationType: 'warning' | 'critical' | null;
  message: string;
  hoursInactive: number;
}

export interface UseLifeCheckReturn {
  checkLives: () => Promise<void>;
  isChecking: boolean;
  notification: LifeCheckNotification | null;
  clearNotification: () => void;
}

/**
 * React hook for automatic life loss checking
 *
 * Features:
 * - Auto-check on component mount
 * - Check on route change
 * - Interval check every minute for midnight crossing
 * - Debounced to prevent spam
 * - Manages notification state
 *
 * Usage:
 * ```tsx
 * const { notification, clearNotification } = useLifeCheck();
 *
 * {notification && (
 *   <Toast type={notification.notificationType}>
 *     {notification.message}
 *   </Toast>
 * )}
 * ```
 */
export function useLifeCheck(): UseLifeCheckReturn {
  const { address, isConnected } = useAccount();
  const pathname = usePathname();

  const [isChecking, setIsChecking] = useState(false);
  const [notification, setNotification] = useState<LifeCheckNotification | null>(null);

  // Track last check time to prevent spam
  const lastCheckRef = useRef<Date | null>(null);
  const lastMidnightCheckRef = useRef<Date | null>(null);

  const clearNotification = useCallback(() => {
    setNotification(null);
  }, []);

  const checkLives = useCallback(async () => {
    if (!address || !isConnected || isChecking) {
      return;
    }

    // Debounce: prevent checks within 30 seconds
    const now = new Date();
    if (lastCheckRef.current) {
      const secondsSinceLastCheck = (now.getTime() - lastCheckRef.current.getTime()) / 1000;
      if (secondsSinceLastCheck < 30) {
        return;
      }
    }

    setIsChecking(true);
    lastCheckRef.current = now;

    try {
      const res = await fetch('/api/life/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userAddress: address }),
        cache: 'no-store',
      });

      if (!res.ok) {
        // If user not found (404), they haven't signed in yet - silently skip
        if (res.status === 404) {
          return;
        }
        console.error('Life check failed:', res.statusText);
        return;
      }

      const data = await res.json();

      // Only show notification if there's something to notify about
      if (data.shouldNotify && data.livesLost > 0) {
        setNotification({
          livesLost: data.livesLost,
          newLives: data.newLives,
          streakReset: data.streakReset,
          notificationType: data.notificationType,
          message: data.message,
          hoursInactive: data.hoursInactive,
        });
      }
    } catch (error) {
      console.error('Life check error:', error);
    } finally {
      setIsChecking(false);
    }
  }, [address, isConnected, isChecking]);

  // Check on mount (initial load/login)
  useEffect(() => {
    if (address && isConnected) {
      checkLives();
    }
  }, [address, isConnected]); // Only run when wallet connects

  // Check on route change
  useEffect(() => {
    if (address && isConnected && pathname) {
      checkLives();
    }
  }, [pathname]); // Only run on pathname change

  // Interval check for midnight crossing
  useEffect(() => {
    if (!address || !isConnected) {
      return;
    }

    // Check every minute for midnight crossing
    const intervalId = setInterval(() => {
      const now = new Date();

      // If we haven't checked midnight yet, or if we last checked yesterday
      if (!lastMidnightCheckRef.current || didCrossMidnight(lastMidnightCheckRef.current)) {
        lastMidnightCheckRef.current = now;
        checkLives();
      }
    }, 60 * 1000); // Every 1 minute

    return () => clearInterval(intervalId);
  }, [address, isConnected, checkLives]);

  return {
    checkLives,
    isChecking,
    notification,
    clearNotification,
  };
}
