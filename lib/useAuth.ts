'use client';

import { useAccount, useSignMessage } from 'wagmi';
import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  walletAddress: string;
  selectedAnimal: string | null;
  coinsBalance: number;
  livesRemaining: number;
  currentStreak: number;
  longestStreak: number;
}

export function useAuth() {
  const { address, isConnected } = useAccount();
  const { signMessage, data: signature, error: signError } = useSignMessage();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingMessage, setPendingMessage] = useState<string | null>(null);
  const prevAddressRef = useRef<string | undefined>(undefined);
  const isAuthenticatingRef = useRef(false);

  const authenticate = useCallback(() => {
    if (!address || isAuthenticatingRef.current) {
      return;
    }

    isAuthenticatingRef.current = true;
    setLoading(true);
    setError(null);

    const message = 'Sign this message to authenticate with DiaryBeast';
    setPendingMessage(message);

    // Set timeout to reset loading if signature modal doesn't appear
    const timeoutId = setTimeout(() => {
      isAuthenticatingRef.current = false;
      setLoading(false);
      setPendingMessage(null);
      setError(
        'Wallet did not respond. Please try again or check if the signature window is open.'
      );
    }, 30000); // 30 seconds timeout

    signMessage({ message });

    // Store timeout ID to clear it if signature completes
    (window as any).__authTimeout = timeoutId;
  }, [address, signMessage]);

  // Handle signature result
  useEffect(() => {
    if (!signature || !pendingMessage || !address) return;

    // Clear timeout if signature received
    if ((window as any).__authTimeout) {
      clearTimeout((window as any).__authTimeout);
      (window as any).__authTimeout = null;
    }

    const verifySignature = async () => {
      try {
        const res = await fetch('/api/auth/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ address, message: pendingMessage, signature }),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || 'Authentication failed');
        }

        const data = await res.json();
        setUser(data.user);
        setPendingMessage(null);

        // Redirect to onboarding if new user or onboarding not completed
        if (data.isNewUser || !data.user.onboardingCompleted) {
          router.push('/onboarding');
        } else {
          // Existing user with completed onboarding
          router.push('/diary');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to authenticate. Please try again.');
        setPendingMessage(null);
      } finally {
        isAuthenticatingRef.current = false;
        setLoading(false);
      }
    };

    verifySignature();
  }, [signature, pendingMessage, address, router]);

  // Handle signature error
  useEffect(() => {
    if (!signError) return;

    // Clear timeout if error occurred
    if ((window as any).__authTimeout) {
      clearTimeout((window as any).__authTimeout);
      (window as any).__authTimeout = null;
    }

    if (signError.message?.includes('User rejected') || (signError as any).code === 4001) {
      setError('Signature rejected. Please try again.');
    } else {
      setError(signError.message || 'Failed to sign message. Please try again.');
    }

    isAuthenticatingRef.current = false;
    setLoading(false);
    setPendingMessage(null);
  }, [signError]);

  // Reset states when address changes (logout is handled by AuthGuard globally)
  useEffect(() => {
    const currentAddress = address?.toLowerCase();
    const prevAddress = prevAddressRef.current;

    if (prevAddress !== currentAddress) {
      isAuthenticatingRef.current = false;
      setError(null);
      setPendingMessage(null);
      prevAddressRef.current = currentAddress;
    }
  }, [address]);

  return {
    user,
    loading,
    error,
    isAuthenticated: !!user && isConnected,
    authenticate,
  };
}
