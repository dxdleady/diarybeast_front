'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { getAnimations, emotionColors, type Animal, type PetState } from '@/lib/ascii';

interface AsciiPetProps {
  animal: Animal;
  state: PetState;
  className?: string;
}

export function AsciiPet({ animal, state, className }: AsciiPetProps) {
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const animations = getAnimations(animal);
  const animation = animations[state] || animations.idle; // Fallback to idle if state not available
  const currentFrame = animation.frames[currentFrameIndex];
  const colors = emotionColors[state] || emotionColors.idle;

  useEffect(() => {
    if (animation.frames.length === 1) return; // No animation needed

    const interval = setInterval(() => {
      setCurrentFrameIndex((prev) => {
        if (!animation.loop && prev === animation.frames.length - 1) {
          return prev; // Stop at last frame
        }
        return (prev + 1) % animation.frames.length;
      });
    }, currentFrame.duration);

    return () => clearInterval(interval);
  }, [animation, currentFrame.duration, state]);

  // Reset frame index when state changes
  useEffect(() => {
    setCurrentFrameIndex(0);
  }, [state]);

  return (
    <div className="h-24 flex items-center justify-center overflow-hidden">
      <pre
        className={cn(
          'font-mono text-center leading-tight select-none transition-all duration-300',
          colors.primary,
          colors.glow,
          className
        )}
        style={{ fontSize: '0.85rem', lineHeight: '1.1' }}
      >
        {currentFrame.lines.map((line, i) => (
          <div key={i} className={cn('whitespace-pre', currentFrame.colors[i])}>
            {line}
          </div>
        ))}
      </pre>
    </div>
  );
}
