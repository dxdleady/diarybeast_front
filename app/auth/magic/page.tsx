'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAgent } from '@/lib/AgentSessionContext';

function MagicAuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { agentLogin } = useAgent();
  const [status, setStatus] = useState<'validating' | 'success' | 'error'>('validating');
  const [error, setError] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setStatus('error');
      setError('Missing token');
      return;
    }

    async function validate() {
      try {
        const res = await fetch('/api/auth/validate', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          setStatus('error');
          setError('Invalid or expired token');
          return;
        }

        const data = await res.json();
        agentLogin(token!, data.user.walletAddress);
        setStatus('success');

        setTimeout(() => {
          if (data.user.onboardingCompleted) {
            router.push('/diary');
          } else {
            router.push('/onboarding');
          }
        }, 1500);
      } catch {
        setStatus('error');
        setError('Failed to validate token');
      }
    }

    validate();
  }, [searchParams, agentLogin, router]);

  return (
    <div className="min-h-screen bg-bg-dark text-primary font-mono flex items-center justify-center">
      <div className="text-center max-w-md">
        {status === 'validating' && (
          <>
            <div className="text-4xl mb-4 animate-pulse">...</div>
            <p className="text-primary/80">Authenticating agent session...</p>
          </>
        )}
        {status === 'success' && (
          <>
            <div className="text-4xl mb-4 text-green-400">[OK]</div>
            <p className="text-green-400 font-bold mb-2">Authenticated!</p>
            <p className="text-primary/60 text-sm">Redirecting...</p>
          </>
        )}
        {status === 'error' && (
          <>
            <div className="text-4xl mb-4 text-red-400">[ERR]</div>
            <p className="text-red-400 font-bold mb-2">Authentication failed</p>
            <p className="text-primary/60 text-sm">{error}</p>
          </>
        )}
      </div>
    </div>
  );
}

export default function MagicAuthPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-bg-dark text-primary font-mono flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-4 animate-pulse">...</div>
            <p className="text-primary/80">Loading...</p>
          </div>
        </div>
      }
    >
      <MagicAuthContent />
    </Suspense>
  );
}
