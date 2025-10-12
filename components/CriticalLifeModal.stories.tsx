import type { Meta, StoryObj } from '@storybook/react';
import { CriticalLifeModal } from './CriticalLifeModal';

const meta: Meta<typeof CriticalLifeModal> = {
  title: 'Modals/CriticalLife',
  component: CriticalLifeModal,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof CriticalLifeModal>;

export const TwoLivesLeft: Story = {
  args: {
    isOpen: true,
    livesRemaining: 2,
    onClose: () => {},
  },
};

export const OneLifeLeft: Story = {
  args: {
    isOpen: true,
    livesRemaining: 1,
    onClose: () => {},
  },
};

export const ZeroLives: Story = {
  args: {
    isOpen: true,
    livesRemaining: 0,
    onClose: () => {},
  },
};
