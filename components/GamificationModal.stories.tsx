import type { Meta, StoryObj } from '@storybook/react';
import { GamificationModal } from './GamificationModal';

const meta: Meta<typeof GamificationModal> = {
  title: 'Modals/Gamification',
  component: GamificationModal,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof GamificationModal>;

export const Default: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
  },
};
