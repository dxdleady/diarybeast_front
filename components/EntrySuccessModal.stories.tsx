import type { Meta, StoryObj } from '@storybook/react';
import { EntrySuccessModal } from './EntrySuccessModal';

const meta: Meta<typeof EntrySuccessModal> = {
  title: 'Modals/EntrySuccess',
  component: EntrySuccessModal,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof EntrySuccessModal>;

export const FirstEntry: Story = {
  args: {
    isOpen: true,
    tokensEarned: 50,
    streakBonus: 0,
    milestone: null,
    livesRestored: 2,
    oldLives: 3,
    newLives: 5,
    onClose: () => {},
  },
};

export const DailyEntry: Story = {
  args: {
    isOpen: true,
    tokensEarned: 10,
    streakBonus: 0,
    milestone: null,
    livesRestored: 2,
    oldLives: 4,
    newLives: 6,
    onClose: () => {},
  },
};

export const WithStreakBonus: Story = {
  args: {
    isOpen: true,
    tokensEarned: 10,
    streakBonus: 5,
    milestone: '5 Day Streak',
    livesRestored: 2,
    oldLives: 5,
    newLives: 7,
    onClose: () => {},
  },
};

export const MajorMilestone: Story = {
  args: {
    isOpen: true,
    tokensEarned: 10,
    streakBonus: 50,
    milestone: '30 Day Streak',
    livesRestored: 2,
    oldLives: 6,
    newLives: 7,
    onClose: () => {},
  },
};
