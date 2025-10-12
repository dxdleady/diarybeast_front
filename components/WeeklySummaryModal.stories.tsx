import type { Meta, StoryObj } from '@storybook/react';
import { WeeklySummaryModal } from './WeeklySummaryModal';

const meta: Meta<typeof WeeklySummaryModal> = {
  title: 'Modals/WeeklySummary',
  component: WeeklySummaryModal,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof WeeklySummaryModal>;

export const PositiveWeek: Story = {
  args: {
    isOpen: true,
    weekLabel: 'This Week',
    emotions: {
      joy: 75,
      trust: 65,
      fear: 15,
      surprise: 40,
      sadness: 20,
      disgust: 10,
      anger: 15,
      anticipation: 60,
    },
    summary:
      "This week has been filled with positive energy and growth. You've shown remarkable progress in your self-reflection journey, expressing gratitude and optimism throughout your entries.",
    insights: [
      'Strong focus on personal goals and achievement',
      'Increased confidence in facing challenges',
      'Consistent practice of gratitude and mindfulness',
    ],
    trend: 'improving',
    newBalance: 30,
    onClose: () => {},
  },
};

export const StressfulWeek: Story = {
  args: {
    isOpen: true,
    weekLabel: 'Last Week',
    emotions: {
      joy: 30,
      trust: 40,
      fear: 55,
      surprise: 20,
      sadness: 45,
      disgust: 25,
      anger: 35,
      anticipation: 30,
    },
    summary:
      'This week presented several challenges that affected your emotional state. Your entries reflect a period of stress and uncertainty, but also resilience in facing difficulties.',
    insights: [
      'Work-related stress has been a major theme',
      'Self-care practices need attention',
      'Strong support system helping you through tough times',
    ],
    trend: 'declining',
    newBalance: 25,
    onClose: () => {},
  },
};

export const BalancedWeek: Story = {
  args: {
    isOpen: true,
    weekLabel: 'Oct 1-7',
    emotions: {
      joy: 50,
      trust: 55,
      fear: 30,
      surprise: 35,
      sadness: 30,
      disgust: 20,
      anger: 25,
      anticipation: 45,
    },
    summary:
      "A balanced week with a healthy mix of emotions. You've maintained stability while navigating both positive experiences and minor challenges.",
    insights: [
      'Good balance between work and personal life',
      'Regular exercise contributing to well-being',
      'Mindful approach to daily challenges',
    ],
    trend: 'stable',
    newBalance: 35,
    onClose: () => {},
  },
};
