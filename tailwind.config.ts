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
        'pulse-slow': 'pulse-slow 6s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-slower': 'pulse-slower 8s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'rotate-slow': 'rotate-slow 30s linear infinite',
        glow: 'glow 2s ease-in-out infinite alternate',
        shake: 'shake 0.5s cubic-bezier(.36,.07,.19,.97) infinite',
        float: 'float 3s ease-in-out infinite',
        'fade-in': 'fade-in 0.5s ease-out',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'progress-grow': 'progressGrow 2s ease-out forwards',
      },
      keyframes: {
        'pulse-slow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        'pulse-slower': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        'rotate-slow': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
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
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0, 229, 255, 0.3)' },
          '50%': { boxShadow: '0 0 30px rgba(0, 229, 255, 0.6)' },
        },
        progressGrow: {
          '0%': { width: '0%', opacity: '0.8' },
          '100%': { width: '100%', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
