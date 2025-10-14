import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary - LCD Cyan
        primary: {
          DEFAULT: 'var(--color-primary)',
          dark: 'var(--color-primary-dark)',
          light: 'var(--color-primary-light)',
        },
        // Secondary - Base Blue
        secondary: {
          DEFAULT: 'var(--color-secondary)',
          dark: 'var(--color-secondary-dark)',
          light: 'var(--color-secondary-light)',
        },
        // Accent - Pixel Green
        accent: {
          DEFAULT: 'var(--color-accent)',
          dark: 'var(--color-accent-dark)',
          light: 'var(--color-accent-light)',
        },
        // Backgrounds
        'bg-dark': 'var(--bg-dark)',
        'bg-card': 'var(--bg-card)',
        'bg-lcd': 'var(--bg-lcd)',
        // UI States
        active: 'var(--color-active)',
        inactive: 'var(--color-inactive)',
        disabled: 'var(--color-disabled)',
        hover: 'var(--color-hover)',
        // Status
        warning: 'var(--color-warning)',
        error: 'var(--color-error)',
        success: 'var(--color-success)',
        streak: 'var(--color-streak)',
        tokens: 'var(--color-tokens)',
        // Legacy
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'Courier New', 'monospace'],
        display: ['var(--font-chakra)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-cyan': 'var(--glow-cyan)',
        'glow-cyan-strong': 'var(--glow-cyan-strong)',
        'glow-green': 'var(--glow-green)',
        'glow-blue': 'var(--glow-blue)',
      },
      animation: {
        'pulse-slow': 'pulse-slow 10s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        glow: 'glow 2s ease-in-out infinite alternate',
        shake: 'shake 0.5s cubic-bezier(.36,.07,.19,.97) infinite',
      },
      keyframes: {
        'pulse-slow': {
          '0%, 100%': {
            opacity: '1',
          },
          '50%': {
            opacity: '0.5',
          },
        },
        glow: {
          '0%': { boxShadow: 'var(--glow-cyan)' },
          '100%': { boxShadow: 'var(--glow-cyan-strong)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-2px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(2px)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
