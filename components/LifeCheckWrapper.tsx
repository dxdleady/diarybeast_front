'use client';

import { useLifeCheck } from '@/hooks/useLifeCheck';
import { LifeLossNotification, ToastContainer } from './LifeLossNotification';
import { CriticalLifeModal } from './CriticalLifeModal';

/**
 * Wrapper component that handles automatic life checking
 * and displays appropriate notifications/modals
 *
 * Place this in your app layout to enable life loss system
 * throughout the entire application
 *
 * Usage:
 * ```tsx
 * <LifeCheckWrapper>
 *   {children}
 * </LifeCheckWrapper>
 * ```
 */
export function LifeCheckWrapper({ children }: { children: React.ReactNode }) {
  const { notification, clearNotification } = useLifeCheck();

  const isCritical = notification?.newLives === 0;
  const daysInactive = notification
    ? Math.floor(notification.hoursInactive / 24)
    : 0;

  return (
    <>
      {/* Toast Container for react-hot-toast */}
      <ToastContainer />

      {/* Critical Modal (0 lives) */}
      {isCritical && notification && (
        <CriticalLifeModal
          isOpen={true}
          daysInactive={daysInactive}
          oldStreak={notification.streakReset ? notification.newLives : 0}
          onClose={clearNotification}
        />
      )}

      {/* Warning/Critical Toast (1+ lives lost but not critical) */}
      {!isCritical && notification && notification.notificationType && (
        <LifeLossNotification
          livesLost={notification.livesLost}
          newLives={notification.newLives}
          notificationType={notification.notificationType}
          message={notification.message}
          onDismiss={clearNotification}
        />
      )}

      {/* App content */}
      {children}
    </>
  );
}
