'use client';

import { OnchainKitProvider } from '@coinbase/onchainkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { baseSepolia } from 'wagmi/chains';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { coinbaseWallet } from 'wagmi/connectors';
import { ReactNode } from 'react';
import { EncryptionKeyProvider } from '@/lib/EncryptionKeyContext';
import { LifeCheckWrapper } from '@/components/LifeCheckWrapper';
import { MusicProvider } from '@/lib/contexts/MusicContext';
import { GlobalMusicProvider } from '@/components/GlobalMusicPlayer';
import { PawPlayer } from '@/components/GlobalMusicPlayer/PawPlayer';
import { GamificationProvider } from '@/lib/contexts/GamificationContext';
import { BottomNavOverlay } from '@/components/BottomNavOverlay';

const config = createConfig({
  chains: [baseSepolia],
  connectors: [
    coinbaseWallet({
      appName: 'DiaryBeast',
      preference: 'smartWalletOnly',
    }),
  ],
  transports: {
    [baseSepolia.id]: http(),
  },
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider
          apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY || undefined}
          chain={baseSepolia}
        >
          <EncryptionKeyProvider>
            <MusicProvider>
              <GlobalMusicProvider>
                <GamificationProvider>
                  <LifeCheckWrapper>{children}</LifeCheckWrapper>
                  <PawPlayer />
                  <BottomNavOverlay />
                </GamificationProvider>
              </GlobalMusicProvider>
            </MusicProvider>
          </EncryptionKeyProvider>
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
