/**
 * Pure presentation components for onboarding screens
 * Used for Storybook visualization without requiring wallet connection
 */

import { AsciiPet } from './AsciiPet';
import type { Animal } from '@/lib/ascii/types';

interface OnboardingStep1Props {
  petName: string;
  setPetName: (name: string) => void;
  onNext: () => void;
  animal: Animal;
  animalName: string;
}

export function OnboardingStep1({
  petName,
  setPetName,
  onNext,
  animal,
  animalName,
}: OnboardingStep1Props) {
  return (
    <div className="text-center animate-fade-in">
      <div className="mb-6 scale-150 transform">
        <AsciiPet animal={animal} state="idle" />
      </div>
      <h1 className="text-4xl font-display font-bold mb-4 text-primary drop-shadow-[0_0_8px_rgba(0,229,255,0.4)]">
        Meet Your Companion!
      </h1>
      <p className="text-primary/70 mb-8 font-mono">
        A {animalName.toLowerCase()} has chosen to join you on your journaling journey.
        <br />
        What would you like to name them?
      </p>
      <div className="flex flex-col items-center gap-4">
        <input
          type="text"
          value={petName}
          onChange={(e) => setPetName(e.target.value)}
          placeholder="Enter your pet's name..."
          className="w-full max-w-md px-6 py-4 bg-bg-card border-2 border-primary/20 rounded-xl text-primary text-center text-xl focus:border-primary focus:outline-none font-mono placeholder-primary/40"
          maxLength={20}
        />
        <button
          onClick={onNext}
          disabled={!petName.trim()}
          className="px-12 py-4 btn-primary rounded-xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-mono"
        >
          [NEXT]
        </button>
      </div>
    </div>
  );
}

interface OnboardingStep2Props {
  userName: string;
  setUserName: (name: string) => void;
  onBack: () => void;
  onNext: () => void;
  petName: string;
}

export function OnboardingStep2({
  userName,
  setUserName,
  onBack,
  onNext,
  petName,
}: OnboardingStep2Props) {
  return (
    <div className="text-center animate-fade-in">
      <div className="text-6xl mb-6">👋</div>
      <h1 className="text-4xl font-display font-bold mb-4 text-primary drop-shadow-[0_0_8px_rgba(0,229,255,0.4)]">
        Nice to Meet You!
      </h1>
      <p className="text-primary/70 mb-8 font-mono">
        {petName} wants to know who their new friend is.
        <br />
        What should they call you?
      </p>
      <div className="flex flex-col items-center gap-4">
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="Your name..."
          className="w-full max-w-md px-6 py-4 bg-bg-card border-2 border-primary/20 rounded-xl text-primary text-center text-xl focus:border-primary focus:outline-none font-mono placeholder-primary/40"
          maxLength={30}
        />
        <div className="flex gap-4 justify-center">
          <button
            onClick={onBack}
            className="px-8 py-4 bg-bg-lcd/50 border border-primary/20 hover:bg-primary/10 hover:border-primary/40 rounded-xl font-semibold transition-colors font-mono text-primary"
          >
            [BACK]
          </button>
          <button
            onClick={onNext}
            disabled={!userName.trim()}
            className="px-12 py-4 btn-primary rounded-xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-mono"
          >
            [NEXT]
          </button>
        </div>
      </div>
    </div>
  );
}

const AGE_GROUPS = ['13-17', '18-24', '25-34', '35-44', '45-54', '55+'];

interface OnboardingStep3Props {
  userAge: string;
  setUserAge: (age: string) => void;
  onBack: () => void;
  onNext: () => void;
}

export function OnboardingStep3({ userAge, setUserAge, onBack, onNext }: OnboardingStep3Props) {
  return (
    <div className="text-center animate-fade-in">
      <div className="text-6xl mb-6">🎂</div>
      <h1 className="text-4xl font-display font-bold mb-4 text-primary drop-shadow-[0_0_8px_rgba(0,229,255,0.4)]">
        How Old Are You?
      </h1>
      <p className="text-primary/70 mb-8 font-mono">This helps us personalize your experience</p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {AGE_GROUPS.map((age) => (
          <button
            key={age}
            onClick={() => setUserAge(age)}
            className={`p-6 border-2 rounded-xl transition-all hover:scale-105 font-mono ${
              userAge === age
                ? 'border-primary bg-primary/10 shadow-glow-cyan'
                : 'border-primary/20 hover:border-primary/40 bg-bg-card'
            }`}
          >
            <div className="text-2xl font-bold text-primary">{age}</div>
          </button>
        ))}
      </div>
      <div className="flex gap-4 justify-center">
        <button
          onClick={onBack}
          className="px-8 py-4 bg-bg-lcd/50 border border-primary/20 hover:bg-primary/10 hover:border-primary/40 rounded-xl font-semibold transition-colors font-mono text-primary"
        >
          [BACK]
        </button>
        <button
          onClick={onNext}
          disabled={!userAge}
          className="px-12 py-4 btn-primary rounded-xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-mono"
        >
          [NEXT]
        </button>
      </div>
    </div>
  );
}

const DIARY_GOALS = [
  {
    id: 'self-reflection',
    label: 'Self-reflection & Personal Growth',
    emoji: '🌱',
    description: 'Understand yourself better and grow as a person',
  },
  {
    id: 'mental-health',
    label: 'Mental Health & Emotional Wellness',
    emoji: '🧠',
    description: 'Track your mood and improve emotional well-being',
  },
  {
    id: 'creativity',
    label: 'Creativity & Self-Expression',
    emoji: '🎨',
    description: 'Express yourself creatively through writing',
  },
  {
    id: 'goal-tracking',
    label: 'Goal Tracking & Productivity',
    emoji: '🎯',
    description: 'Monitor progress towards your goals',
  },
  {
    id: 'memory-keeping',
    label: 'Memory Keeping & Life Documentation',
    emoji: '📸',
    description: 'Preserve memories and document your journey',
  },
  {
    id: 'stress-relief',
    label: 'Stress Relief & Mindfulness',
    emoji: '🧘',
    description: 'Find peace and reduce stress through reflection',
  },
  {
    id: 'gratitude',
    label: 'Gratitude & Positive Thinking',
    emoji: '✨',
    description: 'Cultivate gratitude and focus on the positive',
  },
];

interface OnboardingStep4Props {
  diaryGoal: string;
  setDiaryGoal: (goal: string) => void;
  onBack: () => void;
  onComplete: () => void;
  saving?: boolean;
}

export function OnboardingStep4({
  diaryGoal,
  setDiaryGoal,
  onBack,
  onComplete,
  saving = false,
}: OnboardingStep4Props) {
  return (
    <div className="text-center animate-fade-in">
      <div className="text-6xl mb-6">🎯</div>
      <h1 className="text-4xl font-display font-bold mb-4 text-primary drop-shadow-[0_0_8px_rgba(0,229,255,0.4)]">
        What&apos;s Your Goal?
      </h1>
      <p className="text-primary/70 mb-8 font-mono">
        Why do you want to keep a diary? Choose your main goal.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 text-left">
        {DIARY_GOALS.map((goal) => (
          <button
            key={goal.id}
            onClick={() => setDiaryGoal(goal.id)}
            className={`p-4 border-2 rounded-xl transition-all hover:scale-105 ${
              diaryGoal === goal.id
                ? 'border-primary bg-primary/10 shadow-glow-cyan'
                : 'border-primary/20 hover:border-primary/40 bg-bg-card'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="text-3xl">{goal.emoji}</div>
              <div className="flex-1">
                <div className="font-semibold mb-1 text-primary font-mono">{goal.label}</div>
                <div className="text-xs text-primary/60 font-mono">{goal.description}</div>
              </div>
            </div>
          </button>
        ))}
      </div>
      <div className="flex gap-4 justify-center">
        <button
          onClick={onBack}
          className="px-8 py-4 bg-bg-lcd/50 border border-primary/20 hover:bg-primary/10 hover:border-primary/40 rounded-xl font-semibold transition-colors font-mono text-primary"
        >
          [BACK]
        </button>
        <button
          onClick={onComplete}
          disabled={!diaryGoal || saving}
          className="px-12 py-4 bg-success border-0 hover:bg-success/90 rounded-xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-mono text-bg-dark shadow-glow-green"
        >
          {saving ? '[SAVING...]' : '[START YOUR JOURNEY! 🚀]'}
        </button>
      </div>
    </div>
  );
}
