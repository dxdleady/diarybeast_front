'use client';

import { createContext, useContext, ReactNode, useMemo } from 'react';
import { useSession } from './useSession';
import { getEncryptionKey } from './encryption';

interface EncryptionKeyContextType {
  encryptionKey: string | null;
  isLoading: boolean;
}

const EncryptionKeyContext = createContext<EncryptionKeyContextType | undefined>(undefined);

/**
 * Simplified encryption context for DiaryBeast
 * Uses deterministic key derivation from wallet or agent address
 * No signatures required, works across all devices
 */
export function EncryptionKeyProvider({ children }: { children: ReactNode }) {
  const { address, isConnected } = useSession();

  const encryptionKey = useMemo(() => {
    if (!address || !isConnected) return null;
    return getEncryptionKey(address);
  }, [address, isConnected]);

  return (
    <EncryptionKeyContext.Provider value={{ encryptionKey, isLoading: false }}>
      {children}
    </EncryptionKeyContext.Provider>
  );
}

export function useEncryptionKey() {
  const context = useContext(EncryptionKeyContext);
  if (context === undefined) {
    throw new Error('useEncryptionKey must be used within EncryptionKeyProvider');
  }
  return context;
}
