'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface GamificationContextType {
  showGamificationModal: boolean;
  openGamificationModal: () => void;
  closeGamificationModal: () => void;
}

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

export function GamificationProvider({ children }: { children: ReactNode }) {
  const [showGamificationModal, setShowGamificationModal] = useState(false);

  const openGamificationModal = () => setShowGamificationModal(true);
  const closeGamificationModal = () => setShowGamificationModal(false);

  return (
    <GamificationContext.Provider
      value={{
        showGamificationModal,
        openGamificationModal,
        closeGamificationModal,
      }}
    >
      {children}
    </GamificationContext.Provider>
  );
}

export function useGamification() {
  const context = useContext(GamificationContext);
  if (context === undefined) {
    throw new Error('useGamification must be used within a GamificationProvider');
  }
  return context;
}
