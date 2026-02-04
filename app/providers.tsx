'use client';

import { OnchainKitProvider } from '@coinbase/onchainkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { base, baseSepolia } from 'wagmi/chains';
import { WagmiProvider, createConfig, http, useReconnect } from 'wagmi';
import { coinbaseWallet, injected } from 'wagmi/connectors';
import { ReactNode, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useSession } from '@/lib/useSession';
import { EncryptionKeyProvider } from '@/lib/EncryptionKeyContext';
import { AgentSessionProvider } from '@/lib/AgentSessionContext';
import { LifeCheckWrapper } from '@/components/LifeCheckWrapper';
import { MusicProvider } from '@/lib/contexts/MusicContext';
import { GlobalMusicProvider } from '@/components/GlobalMusicPlayer';
import { PawPlayer } from '@/components/GlobalMusicPlayer/PawPlayer';
import { GamificationProvider } from '@/lib/contexts/GamificationContext';
import { BottomNavOverlay } from '@/components/BottomNavOverlay';
import { AuthGuard } from '@/components/AuthGuard';

const config = createConfig({
  chains: [baseSepolia, base],
  connectors: [
    coinbaseWallet({
      appName: 'DiaryBeast',
      preference: 'smartWalletOnly',
    }),
    injected({
      shimDisconnect: true,
    }),
  ],
  transports: {
    [baseSepolia.id]: http(),
    [base.id]: http(),
  },
  ssr: true,
});

const queryClient = new QueryClient();

/**
 * Smart reconnect component - only reconnects on protected routes
 */
function SmartReconnect() {
  const pathname = usePathname();
  const { isConnected } = useSession();
  const { reconnect } = useReconnect();

  useEffect(() => {
    // Protected routes that should auto-reconnect wallet
    const protectedRoutes = ['/diary', '/shop', '/profile', '/insights', '/info'];
    const isProtectedRoute = protectedRoutes.some((route) => pathname?.startsWith(route));

    // If on protected route and not connected (wallet or agent), try to reconnect wallet
    if (isProtectedRoute && !isConnected) {
      reconnect();
    }
  }, [pathname, isConnected, reconnect]);

  return null;
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config} reconnectOnMount={false}>
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider
          apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY || undefined}
          chain={baseSepolia}
        >
          <AgentSessionProvider>
            <EncryptionKeyProvider>
              <MusicProvider>
                <GlobalMusicProvider>
                  <GamificationProvider>
                    <SmartReconnect />
                    <AuthGuard />
                    <LifeCheckWrapper>{children}</LifeCheckWrapper>
                    <PawPlayer />
                    <BottomNavOverlay />
                  </GamificationProvider>
                </GlobalMusicProvider>
              </MusicProvider>
            </EncryptionKeyProvider>
          </AgentSessionProvider>
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
