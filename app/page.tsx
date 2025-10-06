'use client';

import { WalletConnect } from '@/components/WalletConnect';
import { useAuth } from '@/lib/useAuth';

export default function Home() {
  const { loading, error } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4">🐾 DiaryBeast</h1>
        <p className="text-xl text-gray-400 mb-8">Feed your beast, grow your mind</p>

        {loading ? (
          <div className="text-gray-400">Authenticating...</div>
        ) : (
          <WalletConnect />
        )}

        {error && (
          <div className="mt-4 text-red-400 text-sm">{error}</div>
        )}
      </div>
    </div>
  );
}
