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

  const authenticate = useCallback(async () => {
    if (!address) return;

    setLoading(true);
    setError(null);

    try {
      const message = 'Sign this message to authenticate with DiaryBeast';
      const signature = await signMessageAsync({ message });

      const res = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address, message, signature }),
      });

      if (!res.ok) {
        throw new Error('Authentication failed');
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
    } catch (err) {
      console.error('Authentication error:', err);
      setError('Failed to authenticate. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [address, signMessageAsync, router]);

  useEffect(() => {
    if (isConnected && address && !user && !loading) {
      authenticate();
    }
  }, [isConnected, address, user, loading, authenticate]);

  return {
    user,
    loading,
    error,
    isAuthenticated: !!user && isConnected,
  };
}
