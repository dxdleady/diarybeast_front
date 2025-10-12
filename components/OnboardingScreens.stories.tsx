import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import {
  OnboardingStep1,
  OnboardingStep2,
  OnboardingStep3,
  OnboardingStep4,
} from './OnboardingScreens';

// Wrapper for Step 1
function Step1Wrapper() {
  const [petName, setPetName] = useState('');
  return (
    <div className="min-h-screen bg-bg-dark text-primary flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <OnboardingStep1
          petName={petName}
          setPetName={setPetName}
          onNext={() => alert('Next clicked!')}
          animal="cat"
          animalName="Cat"
        />
      </div>
    </div>
  );
}

// Wrapper for Step 2
function Step2Wrapper() {
  const [userName, setUserName] = useState('');
  return (
    <div className="min-h-screen bg-bg-dark text-primary flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <OnboardingStep2
          userName={userName}
          setUserName={setUserName}
          onBack={() => alert('Back clicked!')}
          onNext={() => alert('Next clicked!')}
          petName="Whiskers"
        />
      </div>
    </div>
  );
}

// Wrapper for Step 3
function Step3Wrapper() {
  const [userAge, setUserAge] = useState('');
  return (
    <div className="min-h-screen bg-bg-dark text-primary flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <OnboardingStep3
          userAge={userAge}
          setUserAge={setUserAge}
          onBack={() => alert('Back clicked!')}
          onNext={() => alert('Next clicked!')}
        />
      </div>
    </div>
  );
}

// Wrapper for Step 4
function Step4Wrapper() {
  const [diaryGoal, setDiaryGoal] = useState('');
  return (
    <div className="min-h-screen bg-bg-dark text-primary flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <OnboardingStep4
          diaryGoal={diaryGoal}
          setDiaryGoal={setDiaryGoal}
          onBack={() => alert('Back clicked!')}
          onComplete={() => alert('Complete clicked!')}
        />
      </div>
    </div>
  );
}

const meta: Meta = {
  title: 'Pages/Onboarding',
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'dark',
    },
    docs: {
      description: {
        component:
          'Interactive onboarding flow with 4 steps: pet naming, user info, age selection, and goal setting. These are pure presentation components that work without wallet connection.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;

export const Step1_NameYourPet_Cat: StoryObj = {
  render: () => <Step1Wrapper />,
  parameters: {
    docs: {
      description: {
        story: 'First onboarding step where users name their randomly assigned cat.',
      },
    },
  },
};

export const Step1_NameYourPet_Dog: StoryObj = {
  render: () => {
    const [petName, setPetName] = useState('');
    return (
      <div className="min-h-screen bg-bg-dark text-primary flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <OnboardingStep1
            petName={petName}
            setPetName={setPetName}
            onNext={() => alert('Next clicked!')}
            animal="dog"
            animalName="Dog"
          />
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'First onboarding step where users name their randomly assigned dog.',
      },
    },
  },
};

export const Step2_YourName: StoryObj = {
  render: () => <Step2Wrapper />,
  parameters: {
    docs: {
      description: {
        story: 'Second step where users provide their own name.',
      },
    },
  },
};

export const Step3_AgeGroup: StoryObj = {
  render: () => <Step3Wrapper />,
  parameters: {
    docs: {
      description: {
        story: 'Third step where users select their age group from predefined ranges.',
      },
    },
  },
};

export const Step4_DiaryGoal: StoryObj = {
  render: () => <Step4Wrapper />,
  parameters: {
    docs: {
      description: {
        story: 'Final step where users select their primary journaling goal.',
      },
    },
  },
};
