/**
 * Types for ASCII Pet Animations
 */

export type PetState =
  | 'idle'
  | 'happy'
  | 'sad'
  | 'critical'
  | 'eating'
  | 'playing'
  | 'sleeping'
  | 'kitten'
  | 'young'
  | 'adult'
  | 'gen2';

export type Animal = 'cat' | 'dog';

/**
 * Single frame of ASCII animation
 */
export interface AsciiFrame {
  /** Lines of ASCII art */
  lines: string[];
  /** Tailwind CSS classes for each line */
  colors: string[];
  /** Duration of this frame in milliseconds */
  duration: number;
}

/**
 * Complete animation for a pet state
 */
export interface AsciiAnimation {
  /** Array of frames */
  frames: AsciiFrame[];
  /** Whether animation should loop */
  loop: boolean;
  /** Total duration of animation cycle */
  totalDuration: number;
}

/**
 * Collection of all animations for an animal
 */
export type PetAnimations = {
  idle: AsciiAnimation;
  happy: AsciiAnimation;
  sad: AsciiAnimation;
  critical: AsciiAnimation;
  eating: AsciiAnimation;
  playing: AsciiAnimation;
  sleeping: AsciiAnimation;
  kitten?: AsciiAnimation;
  young?: AsciiAnimation;
  adult?: AsciiAnimation;
  gen2?: AsciiAnimation;
};

/**
 * Color palette for pet emotions
 */
export interface EmotionColors {
  primary: string;
  accent: string;
  glow: string;
}

// LCD Tamagotchi Color Scheme
export const emotionColors: Record<PetState, EmotionColors> = {
  idle: {
    primary: 'text-primary',
    accent: 'text-primary/80',
    glow: 'drop-shadow-[0_0_8px_rgba(0,229,255,0.4)]',
  },
  happy: {
    primary: 'text-success',
    accent: 'text-tokens',
    glow: 'drop-shadow-[0_0_10px_rgba(57,255,20,0.6)]',
  },
  sad: {
    primary: 'text-primary/60',
    accent: 'text-secondary/60',
    glow: 'opacity-70 drop-shadow-[0_0_6px_rgba(0,229,255,0.3)]',
  },
  critical: {
    primary: 'text-error',
    accent: 'text-warning',
    glow: 'animate-pulse drop-shadow-[0_0_12px_rgba(255,23,68,0.8)]',
  },
  eating: {
    primary: 'text-primary',
    accent: 'text-success',
    glow: 'drop-shadow-[0_0_8px_rgba(0,229,255,0.5)]',
  },
  playing: {
    primary: 'text-accent',
    accent: 'text-primary',
    glow: 'drop-shadow-[0_0_10px_rgba(57,255,20,0.7)]',
  },
  sleeping: {
    primary: 'text-secondary',
    accent: 'text-primary/40',
    glow: 'opacity-80 drop-shadow-[0_0_8px_rgba(0,82,255,0.5)]',
  },
  kitten: {
    primary: 'text-orange-300',
    accent: 'text-pink-300',
    glow: 'drop-shadow-[0_0_8px_rgba(255,154,0,0.4)]',
  },
  young: {
    primary: 'text-green-400',
    accent: 'text-primary',
    glow: 'drop-shadow-[0_0_10px_rgba(34,197,94,0.5)]',
  },
  adult: {
    primary: 'text-cyan-400',
    accent: 'text-primary',
    glow: 'drop-shadow-[0_0_10px_rgba(0,229,255,0.6)]',
  },
  gen2: {
    primary: 'text-purple-400',
    accent: 'text-yellow-300',
    glow: 'animate-pulse drop-shadow-[0_0_15px_rgba(168,85,247,0.8)]',
  },
};

/**
 * Animal-specific color palette
 */
export interface AnimalColors {
  base: string;
  eyes: string;
  nose: string;
}

export const animalColors: Record<Animal, AnimalColors> = {
  cat: {
    base: 'text-orange-400',
    eyes: 'text-yellow-300',
    nose: 'text-pink-400',
  },
  dog: {
    base: 'text-amber-600',
    eyes: 'text-brown-800',
    nose: 'text-gray-700',
  },
};
