import type { Meta, StoryObj } from '@storybook/react';
import { AsciiPet } from './AsciiPet';
import type { Animal, PetState } from '@/lib/ascii/types';

const meta = {
  title: 'Components/AsciiPet',
  component: AsciiPet,
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
    state: {
      control: 'select',
      options: [
        'idle',
        'happy',
        'sad',
        'critical',
        'eating',
        'playing',
        'sleeping',
        'kitten',
        'young',
        'adult',
        'gen2',
      ],
      description: 'Current emotional/action state of the pet',
    },
  },
  decorators: [
    (Story) => (
      <div className="lcd-screen p-8 rounded-lg">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AsciiPet>;

export default meta;
type Story = StoryObj<typeof meta>;

// Cat States
export const CatIdle: Story = {
  args: {
    animal: 'cat',
    state: 'idle',
  },
};

export const CatHappy: Story = {
  args: {
    animal: 'cat',
    state: 'happy',
  },
};

export const CatSad: Story = {
  args: {
    animal: 'cat',
    state: 'sad',
  },
};

export const CatCritical: Story = {
  args: {
    animal: 'cat',
    state: 'critical',
  },
};

export const CatEating: Story = {
  args: {
    animal: 'cat',
    state: 'eating',
  },
};

export const CatPlaying: Story = {
  args: {
    animal: 'cat',
    state: 'playing',
  },
};

export const CatSleeping: Story = {
  args: {
    animal: 'cat',
    state: 'sleeping',
  },
};

// Cat Life Stages
export const CatKitten: Story = {
  args: {
    animal: 'cat',
    state: 'kitten',
  },
  parameters: {
    docs: {
      description: {
        story: 'Baby cat (Day 0) - Very small with big eyes, just starting their journey',
      },
    },
  },
};

export const CatYoung: Story = {
  args: {
    animal: 'cat',
    state: 'young',
  },
  parameters: {
    docs: {
      description: {
        story: 'Teenage cat (Day 7) - Growing stronger with consistent journaling',
      },
    },
  },
};

export const CatAdult: Story = {
  args: {
    animal: 'cat',
    state: 'adult',
  },
  parameters: {
    docs: {
      description: {
        story: 'Adult cat (Day 14) - Fully grown Generation 1, peak form',
      },
    },
  },
};

export const CatGen2: Story = {
  args: {
    animal: 'cat',
    state: 'gen2',
  },
  parameters: {
    docs: {
      description: {
        story: 'Generation 2 (Day 30) - Evolved magical form with sparkles and stars',
      },
    },
  },
};

// Dog States
export const DogIdle: Story = {
  args: {
    animal: 'dog',
    state: 'idle',
  },
};

export const DogHappy: Story = {
  args: {
    animal: 'dog',
    state: 'happy',
  },
};

export const DogSad: Story = {
  args: {
    animal: 'dog',
    state: 'sad',
  },
};

export const DogCritical: Story = {
  args: {
    animal: 'dog',
    state: 'critical',
  },
};

export const DogEating: Story = {
  args: {
    animal: 'dog',
    state: 'eating',
  },
};

export const DogPlaying: Story = {
  args: {
    animal: 'dog',
    state: 'playing',
  },
};

export const DogSleeping: Story = {
  args: {
    animal: 'dog',
    state: 'sleeping',
  },
};
