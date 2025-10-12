/**
 * ASCII Animations for Dog
 */

import { PetAnimations } from './types';

export const dogAnimations: PetAnimations = {
  // ========================================
  // IDLE - Calm resting state (3 frames)
  // ========================================
  idle: {
    frames: [
      {
        lines: [' ┌─┐ ┌─┐ ', ' │ ╲╱ │ ', '╱ •ᴥ• ╲ ', '╲ ▼▼▼ ╱ ', ' └───┘   '],
        colors: [
          'text-amber-600',
          'text-amber-600',
          'text-amber-500',
          'text-amber-600',
          'text-gray-400',
        ],
        duration: 800,
      },
      {
        lines: [' ┌─┐ ┌─┐ ', ' │ ╲╱ │ ', '╱ -ᴥ- ╲ ', '╲ ▼▼▼ ╱ ', ' └───┘   '],
        colors: [
          'text-amber-600',
          'text-amber-600',
          'text-amber-500',
          'text-amber-600',
          'text-gray-400',
        ],
        duration: 300,
      },
      {
        lines: [' ┌─┐ ┌─┐ ', ' │ ╲╱ │ ', '╱ •ᴥ• ╲ ', '╲ ▼▼▼ ╱ ', ' └───┘   '],
        colors: [
          'text-amber-600',
          'text-amber-600',
          'text-amber-500',
          'text-amber-600',
          'text-gray-400',
        ],
        duration: 800,
      },
    ],
    loop: true,
    totalDuration: 2000,
  },

  // ========================================
  // HAPPY - Joyful bouncing with tongue (4 frames)
  // ========================================
  happy: {
    frames: [
      {
        lines: ['♥┌─┐ ┌─┐♥', ' │ ╲╱ │ ', '╱ ^ᴥ^ ╲ ', '╲ ≈W≈ ╱ ', ' └───┘   '],
        colors: [
          'text-pink-400',
          'text-yellow-500',
          'text-yellow-400',
          'text-pink-300',
          'text-gray-400',
        ],
        duration: 300,
      },
      {
        lines: ['         ', '♥┌─┐ ┌─┐♥', ' │ ╲╱ │ ', '╱ ^ᴥ^ ╲ ', '╲ ≈W≈ ╱ '],
        colors: ['', 'text-pink-400', 'text-yellow-500', 'text-yellow-400', 'text-pink-300'],
        duration: 300,
      },
      {
        lines: ['    ★    ', '♥┌─┐ ┌─┐♥', ' │ ╲╱ │ ', '╱ ^ᴥ^ ╲ ', '╲ ≈W≈ ╱ '],
        colors: [
          'text-yellow-300',
          'text-pink-400',
          'text-yellow-500',
          'text-yellow-400',
          'text-pink-300',
        ],
        duration: 300,
      },
      {
        lines: ['         ', '♥┌─┐ ┌─┐♥', ' │ ╲╱ │ ', '╱ ^ᴥ^ ╲ ', '╲ ≈W≈ ╱ '],
        colors: ['', 'text-pink-400', 'text-yellow-500', 'text-yellow-400', 'text-pink-300'],
        duration: 300,
      },
    ],
    loop: true,
    totalDuration: 1200,
  },

  // ========================================
  // SAD - Whimpering state (2 frames)
  // ========================================
  sad: {
    frames: [
      {
        lines: [' ┌─┐ ┌─┐ ', ' │ ╲╱ │ ', '╱ T﹏T ╲ ', '╲ ▼▼▼ ╱ ', ' └┘ ° ° °'],
        colors: [
          'text-gray-400',
          'text-gray-400',
          'text-blue-300',
          'text-gray-400',
          'text-blue-400',
        ],
        duration: 1000,
      },
      {
        lines: [' ┌─┐ ┌─┐ ', ' │ ╲╱ │ ', '╱ ;﹏; ╲ ', '╲  ° ╱ ', ' └┘  °   '],
        colors: [
          'text-gray-400',
          'text-gray-400',
          'text-blue-300',
          'text-blue-400',
          'text-blue-400',
        ],
        duration: 1000,
      },
    ],
    loop: true,
    totalDuration: 2000,
  },

  // ========================================
  // CRITICAL - Near death (2 frames)
  // ========================================
  critical: {
    frames: [
      {
        lines: [' ┌─┐ ┌─┐ ', ' │ ╲╱ │ ', '╱ x﹏x ╲ ', '╲ ▼▼▼ ╱ ', ' └───┘   '],
        colors: ['text-red-500', 'text-red-500', 'text-red-700', 'text-red-600', 'text-gray-700'],
        duration: 800,
      },
      {
        lines: [' ┌─┐ ┌─┐ ', ' │ ╲╱ │ ', '╱ X﹏X ╲ ', '╲  ~  ╱ ', ' └───┘   '],
        colors: ['text-red-500', 'text-red-500', 'text-red-800', 'text-red-600', 'text-gray-700'],
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
        lines: [' ┌─┐ ┌─┐ ', ' │ ╲╱ │ ', '╱ •ᴥ• ╲ ', '╲ ▼▼▼ ╱ ', ' └┘ ■    '],
        colors: [
          'text-amber-600',
          'text-amber-600',
          'text-amber-500',
          'text-amber-600',
          'text-amber-700',
        ],
        duration: 500,
      },
      {
        lines: [' ┌─┐ ┌─┐ ', ' │ ╲╱ │ ', '╱ OᴥO ╲ ', '╲  ◆  ╱ ', ' └───┘   '],
        colors: [
          'text-amber-600',
          'text-amber-600',
          'text-amber-500',
          'text-amber-700',
          'text-gray-400',
        ],
        duration: 500,
      },
      {
        lines: [' ┌─┐ ┌─┐ ', ' │ ╲╱ │ ', '╱ ^ᴥ^ ╲ ', '╲ ≈W≈ ╱ ', ' └───┘   '],
        colors: [
          'text-green-400',
          'text-green-400',
          'text-green-300',
          'text-pink-300',
          'text-gray-400',
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
        lines: [' ┌─┐ ┌─┐ ', ' │ ╲╱ │ ', '╱ ◠ᴥ◠ ╲ ', '╲ ▼▼▼ ╱ ', ' └┘    ◉ '],
        colors: [
          'text-yellow-400',
          'text-yellow-400',
          'text-yellow-300',
          'text-yellow-400',
          'text-cyan-400',
        ],
        duration: 400,
      },
      {
        lines: ['    ◉    ', ' ┌─┐ ┌─┐ ', ' │ ╲╱ │ ', '╱ ^ᴥ^ ╲ ', '╲ ▼▼▼ ╱ '],
        colors: [
          'text-cyan-400',
          'text-yellow-400',
          'text-yellow-400',
          'text-yellow-300',
          'text-yellow-400',
        ],
        duration: 400,
      },
      {
        lines: [' ◉       ', ' ┌─┐ ┌─┐ ', ' │ ╲╱ │ ', '╱ •ᴥ• ╲ ', '╲ ▼▼▼ ╱ '],
        colors: [
          'text-cyan-400',
          'text-yellow-400',
          'text-yellow-400',
          'text-yellow-300',
          'text-yellow-400',
        ],
        duration: 400,
      },
      {
        lines: [' ┌─┐ ┌─┐ ', ' │ ╲╱ │ ', '╱ ◠ᴥ◠ ╲ ', '╲ ▼▼▼ ╱ ', '◉└───┘   '],
        colors: [
          'text-yellow-400',
          'text-yellow-400',
          'text-yellow-300',
          'text-yellow-400',
          'text-cyan-400',
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
        lines: [' ┌─┐ ┌─┐ ', ' │ ╲╱ │ ', '╱ -ᴥ- ╲ ', '╲ ▼▼▼ ╱ ', ' └┘  z   '],
        colors: [
          'text-purple-400',
          'text-purple-400',
          'text-purple-300',
          'text-purple-400',
          'text-indigo-300',
        ],
        duration: 1200,
      },
      {
        lines: ['    Z    ', ' ┌─┐ ┌─┐ ', ' │ ╲╱ │ ', '╱ -ᴥ- ╲ ', '╲ ▼▼▼ ╱ '],
        colors: [
          'text-indigo-400',
          'text-purple-400',
          'text-purple-400',
          'text-purple-300',
          'text-purple-400',
        ],
        duration: 1200,
      },
    ],
    loop: true,
    totalDuration: 2400,
  },
};
