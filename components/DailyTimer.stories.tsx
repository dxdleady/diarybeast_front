import type { Meta, StoryObj } from '@storybook/react';
import { DailyTimer } from './DailyTimer';

const meta = {
  title: 'Components/DailyTimer',
  component: DailyTimer,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark',
    },
  },
  tags: ['autodocs'],
  argTypes: {
    hasWrittenToday: {
      control: 'boolean',
      description: 'Whether the user has written an entry today',
    },
  },
} satisfies Meta<typeof DailyTimer>;

export default meta;
type Story = StoryObj<typeof meta>;

// User has written today - showing "Entry claimed!" and countdown to next entry
export const EntryClaimed: Story = {
  args: {
    hasWrittenToday: true,
  },
};

// User has NOT written today - showing urgent "Time left!" warning
export const TimeRemaining: Story = {
  args: {
    hasWrittenToday: false,
  },
};
