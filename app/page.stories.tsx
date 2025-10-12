import type { Meta, StoryObj } from '@storybook/react';
import Home from './page';

const meta: Meta<typeof Home> = {
  title: 'Pages/Landing',
  component: Home,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'dark',
    },
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/',
        query: {},
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Home>;

// Default landing page with transformation visual
export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Landing page with monochrome logo positioned inline with title. Features pet evolution timeline showing transformation from Gen 1 (Day 0) to Gen 2 (Day 30). Process flow uses SVG icons instead of emoji. Powerful visual metaphor: "What if your mental health had a face?"',
      },
    },
  },
};
