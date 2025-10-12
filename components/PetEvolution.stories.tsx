import type { Meta, StoryObj } from '@storybook/react';
import { PetEvolution } from './PetEvolution';

const meta: Meta<typeof PetEvolution> = {
  title: 'Components/PetEvolution',
  component: PetEvolution,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark',
    },
    docs: {
      description: {
        component:
          "Pet evolution timeline showing 4 life stages: Kitten (Day 0) → Young (Day 7) → Adult (Day 14) → Gen 2 (Day 30). Visual progression from baby to evolved generation, reflecting the user's journaling journey and pet growth.",
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof PetEvolution>;

export const Default: Story = {
  render: () => (
    <div className="w-full max-w-6xl p-8 bg-bg-dark">
      <PetEvolution />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Complete evolution timeline showing cat life stages: Kitten → Young → Adult → Gen 2. Each stage features unique animations with progressively enhanced styling, culminating in the magical Gen 2 evolution.',
      },
    },
  },
};
