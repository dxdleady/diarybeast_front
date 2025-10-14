'use client';

import { useAccount, useSignMessage } from 'wagmi';
import { useEffect, useState, useCallback } from 'react';
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
  const { signMessageAsync } = useSignMessage();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasAttempted, setHasAttempted] = useState(false);

  const authenticate = useCallback(async () => {
    if (!address) return;

    setLoading(true);
    setError(null);
    setHasAttempted(true);

    try {
      const message = 'Sign this message to authenticate with DiaryBeast';

      // Add timeout to signature request
      const signaturePromise = signMessageAsync({
        message,
        account: address as `0x${string}`,
      });

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Signature request timed out. Please try again.')), 60000)
      );

      const signature = (await Promise.race([signaturePromise, timeoutPromise])) as string;

      const res = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address, message, signature }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error('[Auth] API error:', errorData);
        throw new Error(errorData.error || 'Authentication failed');
      }

      const data = await res.json();
      setUser(data.user);

      // Redirect to onboarding if new user or onboarding not completed
      if (data.isNewUser || !data.user.onboardingCompleted) {
        router.push('/onboarding');
      } else {
        // Existing user with completed onboarding
        router.push('/diary');
      }
    } catch (err: any) {
      console.error('[Auth] Authentication error:', err);

      // Check if user rejected the signature
      if (err.message?.includes('User rejected') || err.code === 4001) {
        setError('Signature rejected. Please try again.');
      } else {
        setError(err.message || 'Failed to authenticate. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }, [address, signMessageAsync, router]);

  // Removed auto-authentication on wallet connect
  // Users must explicitly click to authenticate

  // Reset hasAttempted when address changes
  useEffect(() => {
    setHasAttempted(false);
    setError(null);
  }, [address]);

  return {
    user,
    loading,
    error,
    isAuthenticated: !!user && isConnected,
    authenticate,
  };
}
