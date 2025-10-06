'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';

const AGE_GROUPS = [
  '13-17',
  '18-24',
  '25-34',
  '35-44',
  '45-54',
  '55+',
];

const DIARY_GOALS = [
  { id: 'self-reflection', label: 'Self-reflection & Personal Growth', emoji: '🌱', description: 'Understand yourself better and grow as a person' },
  { id: 'mental-health', label: 'Mental Health & Emotional Wellness', emoji: '🧠', description: 'Track your mood and improve emotional well-being' },
  { id: 'creativity', label: 'Creativity & Self-Expression', emoji: '🎨', description: 'Express yourself creatively through writing' },
  { id: 'goal-tracking', label: 'Goal Tracking & Productivity', emoji: '🎯', description: 'Monitor progress towards your goals' },
  { id: 'memory-keeping', label: 'Memory Keeping & Life Documentation', emoji: '📸', description: 'Preserve memories and document your journey' },
  { id: 'stress-relief', label: 'Stress Relief & Mindfulness', emoji: '🧘', description: 'Find peace and reduce stress through reflection' },
  { id: 'gratitude', label: 'Gratitude & Positive Thinking', emoji: '✨', description: 'Cultivate gratitude and focus on the positive' },
];

export default function Onboarding() {
  const { address } = useAccount();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedAnimal, setSelectedAnimal] = useState<'cat' | 'dog' | null>(null);
  const [petName, setPetName] = useState('');
  const [userName, setUserName] = useState('');
  const [userAge, setUserAge] = useState('');
  const [diaryGoal, setDiaryGoal] = useState('');
  const [saving, setSaving] = useState(false);

  // Fetch user's randomly assigned animal
  useEffect(() => {
    if (!address) {
      router.push('/');
      return;
    }

    async function fetchUser() {
      try {
        const res = await fetch(`/api/user/${address}`);
        if (res.ok) {
          const data = await res.json();
          setSelectedAnimal(data.selectedAnimal);
        }
      } catch (error) {
        console.error('Failed to fetch user');
      }
    }

    fetchUser();
  }, [address, router]);

  async function handleComplete() {
    if (!address) return;

    setSaving(true);
    try {
      const res = await fetch(`/api/user/${address}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          petName,
          userName,
          userAge,
          diaryGoal,
          onboardingCompleted: true,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to save');
      }

      router.push('/diary');
    } catch (error) {
      console.error('Save error:', error);
      alert('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  const getAnimalEmoji = () => {
    return selectedAnimal === 'cat' ? '😺' : '🐶';
  };

  const getAnimalName = () => {
    return selectedAnimal === 'cat' ? 'Cat' : 'Dog';
  };

  const canProceed = () => {
    if (step === 1) return petName.trim().length > 0;
    if (step === 2) return userName.trim().length > 0;
    if (step === 3) return userAge.length > 0;
    if (step === 4) return diaryGoal.length > 0;
    return false;
  };

  if (!selectedAnimal) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`flex items-center justify-center w-10 h-10 rounded-full font-bold transition-all ${
                  s === step
                    ? 'bg-blue-600 text-white scale-110'
                    : s < step
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-700 text-gray-400'
                }`}
              >
                {s < step ? '✓' : s}
              </div>
            ))}
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Step 1: Name your pet */}
        {step === 1 && (
          <div className="text-center animate-fade-in">
            <div className="text-8xl mb-6 animate-bounce">{getAnimalEmoji()}</div>
            <h1 className="text-4xl font-bold mb-4">Meet Your Companion!</h1>
            <p className="text-gray-400 mb-8">
              A {getAnimalName().toLowerCase()} has chosen to join you on your journaling journey.
              <br />
              What would you like to name them?
            </p>
            <input
              type="text"
              value={petName}
              onChange={(e) => setPetName(e.target.value)}
              placeholder="Enter your pet's name..."
              className="w-full max-w-md px-6 py-4 bg-gray-800 border-2 border-gray-700 rounded-xl text-white text-center text-xl focus:border-blue-500 focus:outline-none mb-8"
              maxLength={20}
            />
            <button
              onClick={() => setStep(2)}
              disabled={!canProceed()}
              className="px-12 py-4 bg-blue-600 rounded-xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
            >
              Next
            </button>
          </div>
        )}

        {/* Step 2: User's name */}
        {step === 2 && (
          <div className="text-center animate-fade-in">
            <div className="text-6xl mb-6">👋</div>
            <h1 className="text-4xl font-bold mb-4">Nice to Meet You!</h1>
            <p className="text-gray-400 mb-8">
              {petName} wants to know who their new friend is.
              <br />
              What should they call you?
            </p>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Your name..."
              className="w-full max-w-md px-6 py-4 bg-gray-800 border-2 border-gray-700 rounded-xl text-white text-center text-xl focus:border-blue-500 focus:outline-none mb-8"
              maxLength={30}
            />
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setStep(1)}
                className="px-8 py-4 bg-gray-700 hover:bg-gray-600 rounded-xl font-semibold transition-colors"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!canProceed()}
                className="px-12 py-4 bg-blue-600 rounded-xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Age */}
        {step === 3 && (
          <div className="text-center animate-fade-in">
            <div className="text-6xl mb-6">🎂</div>
            <h1 className="text-4xl font-bold mb-4">How Old Are You?</h1>
            <p className="text-gray-400 mb-8">
              This helps us personalize your experience
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              {AGE_GROUPS.map((age) => (
                <button
                  key={age}
                  onClick={() => setUserAge(age)}
                  className={`p-6 border-2 rounded-xl transition-all hover:scale-105 ${
                    userAge === age
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <div className="text-2xl font-bold">{age}</div>
                </button>
              ))}
            </div>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setStep(2)}
                className="px-8 py-4 bg-gray-700 hover:bg-gray-600 rounded-xl font-semibold transition-colors"
              >
                Back
              </button>
              <button
                onClick={() => setStep(4)}
                disabled={!canProceed()}
                className="px-12 py-4 bg-blue-600 rounded-xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Diary goal */}
        {step === 4 && (
          <div className="text-center animate-fade-in">
            <div className="text-6xl mb-6">🎯</div>
            <h1 className="text-4xl font-bold mb-4">What&apos;s Your Goal?</h1>
            <p className="text-gray-400 mb-8">
              Why do you want to keep a diary? Choose your main goal.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 text-left">
              {DIARY_GOALS.map((goal) => (
                <button
                  key={goal.id}
                  onClick={() => setDiaryGoal(goal.id)}
                  className={`p-4 border-2 rounded-xl transition-all hover:scale-105 ${
                    diaryGoal === goal.id
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="text-3xl">{goal.emoji}</div>
                    <div className="flex-1">
                      <div className="font-semibold mb-1">{goal.label}</div>
                      <div className="text-xs text-gray-400">{goal.description}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setStep(3)}
                className="px-8 py-4 bg-gray-700 hover:bg-gray-600 rounded-xl font-semibold transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleComplete}
                disabled={!canProceed() || saving}
                className="px-12 py-4 bg-green-600 rounded-xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-700 transition-colors"
              >
                {saving ? 'Saving...' : 'Start Your Journey! 🚀'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
