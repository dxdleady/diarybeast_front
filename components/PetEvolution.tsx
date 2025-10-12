import { AsciiPet } from './AsciiPet';

interface EvolutionStage {
  day: number;
  state: 'kitten' | 'young' | 'adult' | 'gen2';
  label: string;
  description: string;
  generation?: number;
}

const EVOLUTION_STAGES: EvolutionStage[] = [
  {
    day: 0,
    state: 'kitten',
    label: 'New Friend',
    description: 'Just starting',
    generation: 1,
  },
  {
    day: 7,
    state: 'young',
    label: 'Bonding',
    description: 'Growing together',
    generation: 1,
  },
  {
    day: 14,
    state: 'adult',
    label: 'Strong',
    description: 'Fully grown',
    generation: 1,
  },
  {
    day: 30,
    state: 'gen2',
    label: 'Level Up',
    description: 'Gen 2',
    generation: 2,
  },
];

export function PetEvolution() {
  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Evolution Timeline */}
      <div className="relative">
        {/* Progress Line */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/20 via-primary/40 to-success/60 -translate-y-1/2 hidden md:block" />

        {/* Evolution Stages */}
        <div className="grid grid-cols-4 gap-3 md:gap-6 relative">
          {EVOLUTION_STAGES.map((stage, index) => (
            <div
              key={stage.day}
              className="flex flex-col items-center gap-1 animate-fade-in"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Pet Container */}
              <div
                className={`
                  relative p-2 md:p-3 rounded-lg border transition-all duration-500
                  ${index === 0 ? 'border-primary/20 bg-primary/5 scale-90' : ''}
                  ${index === 1 ? 'border-primary/30 bg-primary/8 scale-95' : ''}
                  ${index === 2 ? 'border-primary/40 bg-primary/10 scale-100' : ''}
                  ${index === 3 ? 'border-success/50 bg-success/10 scale-105 shadow-glow-green' : ''}
                `}
              >
                {/* Pet */}
                <div
                  className={`
                  transition-all duration-500
                  ${index === 3 ? 'animate-pulse-glow' : ''}
                `}
                >
                  <AsciiPet animal="cat" state={stage.state} />
                </div>

                {/* Generation Badge for final stage */}
                {stage.generation === 2 && (
                  <div className="absolute -top-1 -right-1 text-yellow-400 text-lg animate-pulse">
                    ✨
                  </div>
                )}
              </div>

              {/* Label */}
              <div className="text-center mt-1">
                <div
                  className={`
                  font-mono text-[10px] md:text-xs font-semibold
                  ${index === 0 ? 'text-orange-300' : ''}
                  ${index === 1 ? 'text-green-400' : ''}
                  ${index === 2 ? 'text-cyan-400' : ''}
                  ${index === 3 ? 'text-purple-400' : ''}
                `}
                >
                  {stage.generation === 2 ? `Day ${stage.day} (Gen 2)` : `Day ${stage.day}`}
                </div>
                <div className="text-[9px] md:text-[10px] font-mono text-primary/60 mt-0.5">
                  {stage.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-4 w-full h-1 bg-primary/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-orange-300 via-green-400 via-cyan-400 to-purple-400 rounded-full"
          style={{
            animation: 'progressGrow 2s ease-out forwards',
          }}
        />
      </div>
    </div>
  );
}
