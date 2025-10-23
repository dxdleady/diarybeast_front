import type { Preview } from '@storybook/nextjs-vite';
import React from 'react';
import '../app/globals.css';
import { Providers } from '../app/providers';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'dark',
      values: [
        {
          name: 'dark',
          value: '#0A0E1A',
        },
        {
          name: 'light',
          value: '#ffffff',
        },
      ],
    },
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/diary',
        push: () => {},
      },
    },
  },
  decorators: [
    (Story) => (
      <Providers>
        <Story />
      </Providers>
    ),
  ],
};

export default preview;
