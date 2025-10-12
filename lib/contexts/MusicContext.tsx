'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface MusicContextType {
  isPlaying: boolean;
  currentTrack: string | null;
  play: (track?: string) => void;
  pause: () => void;
  toggle: () => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export function MusicProvider({ children }: { children: ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<string | null>(null);

  const play = (track?: string) => {
    setIsPlaying(true);
    if (track) setCurrentTrack(track);
  };

  const pause = () => {
    setIsPlaying(false);
  };

  const toggle = () => {
    setIsPlaying((prev) => !prev);
  };

  return (
    <MusicContext.Provider
      value={{
        isPlaying,
        currentTrack,
        play,
        pause,
        toggle,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
}

export function useMusic() {
  const context = useContext(MusicContext);
  if (context === undefined) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
}
