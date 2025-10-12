/**
 * ASCII Animations for Cat
 */

import { PetAnimations } from './types';

export const catAnimations: PetAnimations = {
  // ========================================
  // IDLE - Calm resting state (3 frames)
  // ========================================
  idle: {
    frames: [
      {
        lines: ['   /\\_/\\   ', '  ( o.o )  ', '   > ^ <   ', '  /|   |\\  ', ' (_|___|_) '],
        colors: [
          'text-orange-400',
          'text-orange-300',
          'text-pink-300',
          'text-orange-400',
          'text-orange-500',
        ],
        duration: 800,
      },
      {
        lines: ['   /\\_/\\   ', '  ( -.^ )  ', '   > ^ <   ', '  /|   |\\  ', ' (_|___|_) '],
        colors: [
          'text-orange-400',
          'text-orange-300',
          'text-pink-300',
          'text-orange-400',
          'text-orange-500',
        ],
        duration: 300,
      },
      {
        lines: ['   /\\_/\\   ', '  ( o.o )  ', '   > ^ <   ', '  /|   |\\  ', ' (_|___|_) '],
        colors: [
          'text-orange-400',
          'text-orange-300',
          'text-pink-300',
          'text-orange-400',
          'text-orange-500',
        ],
        duration: 800,
      },
    ],
    loop: true,
    totalDuration: 2000,
  },

  // ========================================
  // HAPPY - Joyful bouncing (4 frames)
  // ========================================
  happy: {
    frames: [
      {
        lines: [' ♥ /\\_/\\ ♥', '  ( ^.^ ) ', '  ♥> ^ <♥', '  /|   |\\ ', ' (_|___|_)'],
        colors: [
          'text-pink-400',
          'text-green-300',
          'text-pink-300',
          'text-green-400',
          'text-green-500',
        ],
        duration: 300,
      },
      {
        lines: ['          ', ' ♥ /\\_/\\ ♥', '  ( ^ω^ ) ', '  ♥> ^ <♥', '  /|   |\\ '],
        colors: ['', 'text-pink-400', 'text-green-300', 'text-pink-300', 'text-green-400'],
        duration: 300,
      },
      {
        lines: ['     ★    ', ' ♥ /\\_/\\ ♥', '  ( ^.^ ) ', '  ♥> ^ <♥', '  /|   |\\ '],
        colors: [
          'text-yellow-300',
          'text-pink-400',
          'text-green-300',
          'text-pink-300',
          'text-green-400',
        ],
        duration: 300,
      },
      {
        lines: ['          ', ' ♥ /\\_/\\ ♥', '  ( ^ω^ ) ', '  ♥> ^ <♥', '  /|   |\\ '],
        colors: ['', 'text-pink-400', 'text-green-300', 'text-pink-300', 'text-green-400'],
        duration: 300,
      },
    ],
    loop: true,
    totalDuration: 1200,
  },

  // ========================================
  // SAD - Sad but still cute (2 frames)
  // ========================================
  sad: {
    frames: [
      {
        lines: ['   /\\_/\\   ', '  ( ︵.︵ ) ', '   > ﹏ <  ', '  /|   |\\  ', ' (_|___|_) '],
        colors: [
          'text-blue-400',
          'text-blue-300',
          'text-blue-300',
          'text-blue-400',
          'text-blue-500',
        ],
        duration: 1000,
      },
      {
        lines: ['   /\\_/\\   ', '  ( -.- )  ', '   > ﹏ <  ', '  /|   |\\  ', ' (_|___|_) '],
        colors: [
          'text-blue-400',
          'text-blue-300',
          'text-blue-300',
          'text-blue-400',
          'text-blue-500',
        ],
        duration: 1000,
      },
    ],
    loop: true,
    totalDuration: 2000,
  },

  // ========================================
  // CRITICAL - Needs care but not scary (2 frames)
  // ========================================
  critical: {
    frames: [
      {
        lines: ['   /\\_/\\   ', '  ( ._. )  ', '   > ~ <   ', '  /|   |\\  ', ' (_|___|_) '],
        colors: [
          'text-gray-400',
          'text-gray-300',
          'text-gray-300',
          'text-gray-400',
          'text-gray-500',
        ],
        duration: 800,
      },
      {
        lines: ['   /\\_/\\   ', '  ( -.- )  ', '   >   <   ', '  /|   |\\  ', ' (_|___|_) '],
        colors: [
          'text-gray-400',
          'text-gray-300',
          'text-gray-300',
          'text-gray-400',
          'text-gray-500',
        ],
        duration: 800,
      },
    ],
    loop: true,
    totalDuration: 1600,
  },

  // ========================================
  // EATING - Consuming food (3 frames)
  // ========================================
  eating: {
    frames: [
      {
        lines: ['   /\\_/\\   ', '  ( o.o )  ', '   > ω <  🥫', '  /|   |\\  ', ' (_|___|_) '],
        colors: [
          'text-orange-400',
          'text-orange-300',
          'text-pink-300',
          'text-orange-400',
          'text-orange-500',
        ],
        duration: 500,
      },
      {
        lines: ['   /\\_/\\   ', '  ( ^.^ )  ', '   > ω < ♥ ', '  /|   |\\  ', ' (_|___|_) '],
        colors: [
          'text-orange-400',
          'text-green-300',
          'text-pink-400',
          'text-orange-400',
          'text-orange-500',
        ],
        duration: 500,
      },
      {
        lines: ['   /\\_/\\   ', '  ( ^ω^ )  ', '   > ^ <   ', '  /|   |\\  ', ' (_|___|_) '],
        colors: [
          'text-green-400',
          'text-green-300',
          'text-pink-300',
          'text-green-400',
          'text-green-500',
        ],
        duration: 500,
      },
    ],
    loop: false,
    totalDuration: 1500,
  },

  // ========================================
  // PLAYING - Playing with ball (4 frames)
  // ========================================
  playing: {
    frames: [
      {
        lines: ['   /\\_/\\   ', '  ( ^.^ )  ', '   > ^ < ⚽', '  /|   |\\  ', ' (_|___|_) '],
        colors: [
          'text-yellow-400',
          'text-yellow-300',
          'text-pink-300',
          'text-yellow-400',
          'text-yellow-500',
        ],
        duration: 400,
      },
      {
        lines: ['    ⚽    ', '   /\\_/\\   ', '  ( ◠.◠ )  ', '   > ^ <   ', '  /|   |\\  '],
        colors: [
          'text-cyan-400',
          'text-yellow-400',
          'text-yellow-300',
          'text-pink-300',
          'text-yellow-400',
        ],
        duration: 400,
      },
      {
        lines: [' ⚽ /\\_/\\   ', '  ( o.o )  ', '   > ^ <   ', '  /|   |\\  ', ' (_|___|_) '],
        colors: [
          'text-cyan-400',
          'text-yellow-400',
          'text-yellow-300',
          'text-pink-300',
          'text-yellow-400',
        ],
        duration: 400,
      },
      {
        lines: ['   /\\_/\\   ', '  ( ^ω^ )  ', '   > ^ <   ', ' ⚽|   |\\  ', ' (_|___|_) '],
        colors: [
          'text-yellow-400',
          'text-yellow-300',
          'text-pink-300',
          'text-yellow-400',
          'text-yellow-500',
        ],
        duration: 400,
      },
    ],
    loop: true,
    totalDuration: 1600,
  },

  // ========================================
  // SLEEPING - Zzz state (2 frames)
  // ========================================
  sleeping: {
    frames: [
      {
        lines: ['   /\\_/\\   ', '  ( -.- )  ', '   > ~ <   ', '  /|   |\\  ', ' (_|___|_)z'],
        colors: [
          'text-purple-400',
          'text-purple-300',
          'text-purple-300',
          'text-purple-400',
          'text-purple-500',
        ],
        duration: 1200,
      },
      {
        lines: ['   Z /\\   ', '  z /\\_/\\  ', '  ( -.- )  ', '   > ~ <   ', '  /|   |\\  '],
        colors: [
          'text-indigo-400',
          'text-purple-400',
          'text-purple-300',
          'text-purple-300',
          'text-purple-400',
        ],
        duration: 1200,
      },
    ],
    loop: true,
    totalDuration: 2400,
  },

  // ========================================
  // KITTEN - Baby cat (very small and cute)
  // ========================================
  kitten: {
    frames: [
      {
        lines: ['           ', '   /\\_/\\   ', '  ( ◉.◉ )  ', '   >ᴗ<    ', '   | |     '],
        colors: ['', 'text-orange-300', 'text-orange-200', 'text-pink-300', 'text-orange-300'],
        duration: 800,
      },
      {
        lines: ['           ', '   /\\_/\\   ', '  ( ◉.◉ )  ', '   >ᴗ<    ', '   |˄|     '],
        colors: ['', 'text-orange-300', 'text-orange-200', 'text-pink-300', 'text-orange-300'],
        duration: 300,
      },
      {
        lines: ['           ', '   /\\_/\\   ', '  ( ◉w◉ )  ', '   >ᴗ<    ', '   | |     '],
        colors: ['', 'text-orange-300', 'text-orange-200', 'text-pink-300', 'text-orange-300'],
        duration: 800,
      },
    ],
    loop: true,
    totalDuration: 2000,
  },

  // ========================================
  // YOUNG - Teenage cat (medium size)
  // ========================================
  young: {
    frames: [
      {
        lines: ['   /\\_/\\   ', '  ( ^.^ )  ', '   > ◡ <   ', '  /|   |\\  ', ' (_|___|_) '],
        colors: [
          'text-orange-400',
          'text-green-300',
          'text-pink-300',
          'text-green-400',
          'text-green-500',
        ],
        duration: 600,
      },
      {
        lines: ['   /\\_/\\   ', '  ( ^ω^ )  ', '   > ◡ <   ', '  /|   |\\  ', ' (_|___|_) '],
        colors: [
          'text-orange-400',
          'text-green-300',
          'text-pink-300',
          'text-green-400',
          'text-green-500',
        ],
        duration: 600,
      },
    ],
    loop: true,
    totalDuration: 1200,
  },

  // ========================================
  // ADULT - Full grown Gen 1 cat
  // ========================================
  adult: {
    frames: [
      {
        lines: ['   /\\_/\\   ', '  ( ◕.◕ )  ', '   > ^ <   ', '  /|   |\\  ', ' (_|___|_) '],
        colors: [
          'text-cyan-400',
          'text-cyan-300',
          'text-pink-300',
          'text-cyan-400',
          'text-cyan-500',
        ],
        duration: 700,
      },
      {
        lines: ['   /\\_/\\   ', '  ( ◕w◕ )  ', '   > ^ <   ', '  /|   |\\  ', ' (_|___|_) '],
        colors: [
          'text-cyan-400',
          'text-cyan-300',
          'text-pink-300',
          'text-cyan-400',
          'text-cyan-500',
        ],
        duration: 700,
      },
    ],
    loop: true,
    totalDuration: 1400,
  },

  // ========================================
  // GEN2 - Generation 2 evolved cat (magical)
  // ========================================
  gen2: {
    frames: [
      {
        lines: [' ★ /\\_/\\ ★ ', '  ( ◉ω◉ )  ', '  ✨> ^ <✨ ', '  /|   |\\  ', ' (_|___|_) '],
        colors: [
          'text-yellow-400',
          'text-purple-300',
          'text-pink-400',
          'text-purple-400',
          'text-purple-500',
        ],
        duration: 600,
      },
      {
        lines: ['   /\\_/\\   ', ' ✨( ◉.◉ )✨', '   > ^ <   ', '  /|   |\\  ', ' (_|___|_) '],
        colors: [
          'text-purple-400',
          'text-purple-300',
          'text-pink-300',
          'text-purple-400',
          'text-purple-500',
        ],
        duration: 600,
      },
      {
        lines: ['   /\\_/\\ ★ ', '  ( ◉ω◉ )  ', ' ★ > ^ < ★ ', '  /|   |\\  ', ' (_|___|_) '],
        colors: [
          'text-purple-400',
          'text-yellow-300',
          'text-pink-400',
          'text-purple-400',
          'text-purple-500',
        ],
        duration: 600,
      },
    ],
    loop: true,
    totalDuration: 1800,
  },
};
