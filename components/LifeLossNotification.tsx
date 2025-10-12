'use client';

import { useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';

export interface LifeLossNotificationProps {
  livesLost: number;
  newLives: number;
  notificationType: 'warning' | 'critical';
  message: string;
  onDismiss?: () => void;
}

/**
 * Toast notification for life loss warnings
 *
 * Variants:
 * - Warning (yellow/orange): Lost 1-3 lives, still have 1+ lives
 * - Critical (red): Lost 4+ lives or down to 0-1 lives
 *
 * Auto-dismisses after 5 seconds
 */
export function LifeLossNotification({
  livesLost,
  newLives,
  notificationType,
  message,
  onDismiss,
}: LifeLossNotificationProps) {
  useEffect(() => {
    const toastId = toast.custom(
      (t) => (
        <div
          className={`max-w-md w-full rounded-lg shadow-lg p-4 ${
            notificationType === 'critical'
              ? 'bg-error/90 border border-error'
              : 'bg-warning/90 border border-warning'
          } text-primary backdrop-blur-sm`}
        >
          <div className="flex items-start gap-3">
            {/* Icon */}
            <div className="flex-shrink-0 text-2xl">
              {notificationType === 'critical' ? '💔' : '⚠️'}
            </div>

            {/* Content */}
            <div className="flex-1">
              <h3 className="font-display font-bold text-lg mb-1 text-primary">
                {notificationType === 'critical'
                  ? 'Your Pet is in Danger!'
                  : 'Your Pet Missed You!'}
              </h3>
              <p className="text-sm text-primary/90 mb-2 font-mono">{message}</p>

              {/* Lives indicator */}
              <div className="flex items-center gap-2 text-xs font-mono">
                <span>Lives:</span>
                <div className="flex gap-0.5">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <span key={i} className="text-sm">
                      {i < newLives ? '❤️' : '🖤'}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Close button */}
            <button
              onClick={() => {
                toast.dismiss(t.id);
                onDismiss?.();
              }}
              className="flex-shrink-0 text-primary/60 hover:text-primary transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      ),
      {
        duration: 5000,
        position: 'top-right',
      }
    );

    // Auto-dismiss and cleanup
    const timer = setTimeout(() => {
      toast.dismiss(toastId);
      onDismiss?.();
    }, 5000);

    return () => {
      clearTimeout(timer);
      toast.dismiss(toastId);
    };
  }, [livesLost, newLives, notificationType, message, onDismiss]);

  return null;
}

/**
 * Global toast container
 * Add this once in your app layout
 */
export function ToastContainer() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 5000,
        style: {
          background: 'transparent',
          boxShadow: 'none',
          padding: 0,
        },
      }}
    />
  );
}
