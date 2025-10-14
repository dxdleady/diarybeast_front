'use client';

import { FOOD_ITEMS, type FoodItem } from '@/lib/gamification/itemsConfig';
import { getFoodEmoji } from '@/lib/ascii/foodArt';

interface FoodSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  inventory: Record<string, number>;
  onSelectFood: (foodId: string) => void;
  petPersonality?: {
    favoriteFood?: string;
  };
}

export function FoodSelectModal({
  isOpen,
  onClose,
  inventory,
  onSelectFood,
  petPersonality,
}: FoodSelectModalProps) {
  if (!isOpen) return null;

  const availableFoods = Object.entries(FOOD_ITEMS).filter(([key, food]) => {
    const count = inventory[food.id] || 0;
    return count > 0;
  });

  const handleSelect = (foodId: string) => {
    onSelectFood(foodId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-bg-card border-2 border-primary rounded-xl shadow-2xl max-w-md w-full animate-in zoom-in duration-300 shadow-glow-cyan">
        {/* Header */}
        <div className="p-6 border-b border-primary/20">
          <h2 className="text-2xl font-display font-bold text-primary">[SELECT FOOD]</h2>
          <p className="text-sm text-primary/60 font-mono mt-1">Choose food from your inventory</p>
        </div>

        {/* Food List */}
        <div className="p-4 max-h-96 overflow-y-auto">
          {availableFoods.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-primary/60 font-mono mb-4">No food in inventory!</p>
              <p className="text-sm text-primary/40 font-mono">Buy food from the shop first</p>
            </div>
          ) : (
            <div className="space-y-2">
              {availableFoods.map(([key, food]) => {
                const count = inventory[food.id] || 0;
                const isFavorite =
                  petPersonality?.favoriteFood ===
                  food.id.replace('basic-', '').replace('premium-', '').replace('-', '');

                return (
                  <button
                    key={food.id}
                    onClick={() => handleSelect(food.id)}
                    className={`w-full p-4 rounded-lg border-2 transition-all font-mono text-left hover:scale-[1.02] ${
                      isFavorite
                        ? 'border-accent bg-accent/10 hover:bg-accent/20 shadow-glow-green'
                        : 'border-primary/30 bg-bg-lcd/50 hover:bg-bg-lcd hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{getFoodEmoji(food.id)}</span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-primary">{food.name}</span>
                            {isFavorite && (
                              <span className="text-xs text-accent font-bold px-2 py-0.5 bg-accent/20 rounded">
                                ⭐ FAVORITE
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-primary/60 mt-1">{food.description}</p>
                          <div className="flex items-center gap-3 mt-2 text-xs">
                            {food.livesGain > 0 && (
                              <span className="text-success">
                                +{isFavorite ? food.livesGain * 2 : food.livesGain}♥
                              </span>
                            )}
                            {food.happinessGain > 0 && (
                              <span className="text-tokens">
                                +{isFavorite ? food.happinessGain * 2 : food.happinessGain}☺
                              </span>
                            )}
                            <span className="text-primary/40">{food.cooldown}h cooldown</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-bold text-primary">x{count}</span>
                        <p className="text-xs text-primary/40">in stock</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-primary/20">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 btn-secondary rounded-lg font-mono text-sm transition-colors"
          >
            [CANCEL]
          </button>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-primary/60 hover:text-primary transition-colors"
        >
          <span className="text-2xl">✕</span>
        </button>
      </div>
    </div>
  );
}
