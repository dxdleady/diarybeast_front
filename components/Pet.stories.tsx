import type { Meta, StoryObj } from '@storybook/react';
import { Pet } from './Pet';

const meta = {
  title: 'Components/Pet',
  component: Pet,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark',
    },
  },
  tags: ['autodocs'],
  argTypes: {
    animal: {
      control: 'select',
      options: ['cat', 'dog'],
      description: 'The type of pet to display',
    },
    livesRemaining: {
      control: { type: 'range', min: 0, max: 7, step: 1 },
      description: 'Number of lives the pet has (0-7)',
    },
    happiness: {
      control: { type: 'range', min: 0, max: 100, step: 5 },
      description: 'Pet happiness level (0-100)',
    },
    hasWrittenToday: {
      control: 'boolean',
      description: 'Whether user has written an entry today',
    },
    petName: {
      control: 'text',
      description: 'Name of the pet',
    },
  },
} satisfies Meta<typeof Pet>;

export default meta;
type Story = StoryObj<typeof meta>;

// Healthy & Happy Pet
export const Healthy: Story = {
  args: {
    animal: 'cat',
    livesRemaining: 7,
    happiness: 100,
    hasWrittenToday: true,
    petName: 'Whiskers',
    lastFeedTime: null,
    lastPlayTime: null,
  },
};

// Happy Dog
export const HappyDog: Story = {
  args: {
    animal: 'dog',
    livesRemaining: 7,
    happiness: 95,
    hasWrittenToday: true,
    petName: 'Buddy',
    lastFeedTime: null,
    lastPlayTime: null,
  },
};

// Medium Health
export const MediumHealth: Story = {
  args: {
    animal: 'cat',
    livesRemaining: 4,
    happiness: 60,
    hasWrittenToday: false,
    petName: 'Mittens',
    lastFeedTime: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
    lastPlayTime: null,
  },
};

// Low Health - Needs Care
export const NeedsCare: Story = {
  args: {
    animal: 'dog',
    livesRemaining: 2,
    happiness: 30,
    hasWrittenToday: false,
    petName: 'Rover',
    lastFeedTime: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
    lastPlayTime: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(), // 10 hours ago
  },
};

// Critical State
export const Critical: Story = {
  args: {
    animal: 'cat',
    livesRemaining: 0,
    happiness: 10,
    hasWrittenToday: false,
    petName: 'Shadow',
    lastFeedTime: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 24 hours ago
    lastPlayTime: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 24 hours ago
  },
};

// Sad Pet
export const Sad: Story = {
  args: {
    animal: 'dog',
    livesRemaining: 3,
    happiness: 20,
    hasWrittenToday: false,
    petName: 'Max',
    lastFeedTime: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    lastPlayTime: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
  },
};

// Full Hearts but Low Happiness
export const HealthyButUnhappy: Story = {
  args: {
    animal: 'cat',
    livesRemaining: 7,
    happiness: 25,
    hasWrittenToday: true,
    petName: 'Luna',
    lastFeedTime: null,
    lastPlayTime: new Date(Date.now() - 15 * 60 * 60 * 1000).toISOString(),
  },
};

// Low Hearts but High Happiness
export const UnhealthyButHappy: Story = {
  args: {
    animal: 'dog',
    livesRemaining: 2,
    happiness: 90,
    hasWrittenToday: false,
    petName: 'Charlie',
    lastFeedTime: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
    lastPlayTime: null,
  },
};
