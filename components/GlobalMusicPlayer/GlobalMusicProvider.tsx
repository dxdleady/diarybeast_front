'use client';

import React, { useEffect, useRef } from 'react';
import { useMusicPlayerStore } from '@/lib/stores/musicPlayerStore';

export const GlobalMusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { isPlaying, volume, getCurrentTrack, pause } = useMusicPlayerStore();

  const currentTrack = getCurrentTrack();

  // Создаем audio элемент
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.preload = 'none';

    // Останавливаем музыку при закрытии/перезагрузке страницы
    const handleBeforeUnload = () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
      pause();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('pagehide', handleBeforeUnload);

    return () => {
      handleBeforeUnload();
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('pagehide', handleBeforeUnload);
    };
  }, [pause]);

  // Обрабатываем смену трека
  useEffect(() => {
    if (!audioRef.current || !currentTrack) return;

    const audio = audioRef.current;
    const newSrc = currentTrack.streamUrl;

    // Если трек изменился
    if (audio.src !== newSrc) {
      audio.src = newSrc;
      audio.load();

      if (isPlaying) {
        audio.play().catch((error) => {
          console.error('Audio playback failed:', error);
        });
      }
    }
  }, [currentTrack, isPlaying]);

  // Обрабатываем play/pause
  useEffect(() => {
    if (!audioRef.current) return;

    const audio = audioRef.current;

    if (isPlaying) {
      audio.play().catch((error) => {
        console.error('Audio playback failed:', error);
        pause(); // Возвращаем состояние в pause при ошибке
      });
    } else {
      audio.pause();
    }
  }, [isPlaying, pause]);

  // Обрабатываем громкость
  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = volume;
  }, [volume]);

  // Слушаем события audio
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleError = (e: Event) => {
      console.error('Audio error:', e);
      pause();
    };

    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('error', handleError);
    };
  }, [pause]);

  return <>{children}</>;
};
