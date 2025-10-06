'use client';

import { useEffect, useState } from 'react';
import { getPetState, type PetState } from '@/lib/gamification/lifeSystem';

interface PetProps {
  animal: 'cat' | 'dog';
  livesRemaining: number;
  hasWrittenToday?: boolean;
  useImage?: boolean;
  petName?: string;
}

export function Pet({ animal, livesRemaining, hasWrittenToday = false, useImage = false, petName }: PetProps) {
  const [emotion, setEmotion] = useState<PetState>('happy');
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setEmotion(getPetState(livesRemaining));
  }, [livesRemaining]);

  // Emoji based on animal and emotion state
  const getEmoji = () => {
    if (animal === 'cat') {
      if (emotion === 'critical') return '🙀';
      if (emotion === 'sad') return '😿';
      return '😺';
    } else {
      // dog
      if (emotion === 'critical') return '😵';
      if (emotion === 'sad') return '🐕‍🦺';
      return '🐶';
    }
  };

  const emoji = getEmoji();
  const petImage = animal === 'cat' ? '/pets/cat.svg' : '/pets/dog.svg';

  // Animation class based on emotion
  const animationClass =
    emotion === 'happy'
      ? 'animate-bounce'
      : emotion === 'critical'
      ? 'animate-pulse'
      : '';

  // Health status text
  const healthStatus =
    emotion === 'critical'
      ? 'Critical'
      : emotion === 'sad'
      ? 'Needs Care'
      : 'Healthy';

  const healthColor =
    emotion === 'critical'
      ? 'text-red-400'
      : emotion === 'sad'
      ? 'text-orange-400'
      : 'text-green-400';

  return (
    <div className="text-center">
      {useImage && !imageError ? (
        <div
          className={`w-32 h-32 mx-auto rounded-full overflow-hidden bg-gray-700 flex items-center justify-center ${animationClass}`}
        >
          <img
            src={petImage}
            alt={animal}
            className="w-full h-full object-cover"
            onError={() => {
              setImageError(true);
            }}
          />
        </div>
      ) : (
        <div className={`text-8xl transition-transform ${animationClass}`}>
          {emoji}
        </div>
      )}

      {petName && (
        <div className="mt-3 mb-1">
          <h3 className="text-xl font-bold text-white">{petName}</h3>
          <p className="text-xs text-gray-400 capitalize">{animal}</p>
        </div>
      )}

      <div className="mt-4">
        <div className="flex items-center justify-between mb-2 px-2">
          <span className="text-xs text-gray-400 uppercase tracking-wider">
            Pet Health
          </span>
          <span className={`text-xs font-bold uppercase ${healthColor}`}>
            {healthStatus}
          </span>
        </div>
        <div className="flex gap-1 justify-center">
          {Array.from({ length: 7 }).map((_, i) => {
            // If written today and this is the first life, show claimed (green heart)
            if (hasWrittenToday && i === 0) {
              return <span key={i} className="text-xl">💚</span>;
            }
            // Show red heart if life is available
            if (i < livesRemaining) {
              return <span key={i} className="text-xl">❤️</span>;
            }
            // Show broken heart if all lives lost, otherwise black heart
            if (livesRemaining === 0) {
              return <span key={i} className="text-xl">💔</span>;
            }
            return <span key={i} className="text-xl">🖤</span>;
          })}
        </div>
        <div className="mt-2 text-xs text-gray-400 space-y-1">
          <div className="flex items-center justify-center gap-4">
            <span>💚 Claimed</span>
            <span>❤️ Available</span>
            <span>🖤 Lost</span>
          </div>
        </div>
      </div>
    </div>
  );
}
