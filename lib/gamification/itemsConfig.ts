/**
 * Food & Consumable Items Configuration
 *
 * Enhanced feeding system with variety and strategic choices
 */

// ============================================================================
// FOOD TYPES
// ============================================================================

export interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number; // DIARY tokens per unit
  livesGain: number;
  happinessGain: number;
  cooldown: number; // Hours
  emoji: string;
  rarity: 'common' | 'premium' | 'rare';
  stackable: boolean; // Can buy multiple
  maxStack: number; // Max in inventory
}

export const FOOD_ITEMS: Record<string, FoodItem> = {
  basicKibble: {
    id: 'basic-kibble',
    name: 'Basic Kibble',
    description: 'Standard pet food. Always in stock!',
    price: 5, // Changed from 0 - now purchasable
    livesGain: 1,
    happinessGain: 0,
    cooldown: 8,
    emoji: '🥘',
    rarity: 'common',
    stackable: true,
    maxStack: 99,
  },
  premiumMeat: {
    id: 'premium-meat',
    name: 'Premium Meat',
    description: 'High-quality protein. Boosts happiness!',
    price: 20,
    livesGain: 1,
    happinessGain: 10,
    cooldown: 6,
    emoji: '🍖',
    rarity: 'premium',
    stackable: true,
    maxStack: 50,
  },
  veggeBowl: {
    id: 'veggie-bowl',
    name: 'Veggie Bowl',
    description: 'Healthy greens. Great mood boost!',
    price: 15,
    livesGain: 1,
    happinessGain: 20,
    cooldown: 6,
    emoji: '🥗',
    rarity: 'premium',
    stackable: true,
    maxStack: 50,
  },
  energyDrink: {
    id: 'energy-drink',
    name: 'Energy Drink',
    description: 'Powerful restoration! Best value.',
    price: 50,
    livesGain: 2,
    happinessGain: 30,
    cooldown: 8,
    emoji: '⚡',
    rarity: 'rare',
    stackable: true,
    maxStack: 20,
  },
};

// ============================================================================
// CONSUMABLE ITEMS
// ============================================================================

export interface ConsumableItem {
  id: string;
  name: string;
  description: string;
  price: number;
  effect: 'timeSkip' | 'healthRestore' | 'happinessBoost';
  value: number; // Effect strength
  emoji: string;
  category: 'utility' | 'restoration' | 'boost';
}

export const CONSUMABLE_ITEMS: Record<string, ConsumableItem> = {
  timeSkip: {
    id: 'time-skip',
    name: 'Time Skip Potion',
    description: 'Instantly reset feed and play cooldowns',
    price: 100,
    effect: 'timeSkip',
    value: 1, // Resets cooldowns
    emoji: '⏰',
    category: 'utility',
  },
  healthPotion: {
    id: 'health-potion',
    name: 'Health Potion',
    description: 'Instantly restore 3 lives',
    price: 150,
    effect: 'healthRestore',
    value: 3,
    emoji: '💊',
    category: 'restoration',
  },
  happyPill: {
    id: 'happy-pill',
    name: 'Happy Pill',
    description: 'Instantly gain 30 happiness',
    price: 50,
    effect: 'happinessBoost',
    value: 30,
    emoji: '💊',
    category: 'boost',
  },
};

// ============================================================================
// PET PERSONALITY TYPES
// ============================================================================

export type EnergyLevel = 'lazy' | 'normal' | 'hyper';
export type FavoriteFood = 'meat' | 'veggie' | 'kibble' | 'energy';
export type SleepSchedule = 'morning' | 'afternoon' | 'night';

export interface PetPersonality {
  energyLevel: EnergyLevel;
  favoriteFood: FavoriteFood;
  sleepSchedule: SleepSchedule;
}

export const ENERGY_LEVEL_EFFECTS = {
  lazy: {
    playBonus: 5, // -5 from base 10
    happinessDecayMultiplier: 0.5, // Slower decay
    description: 'Relaxed and chill. Prefers lazy days.',
  },
  normal: {
    playBonus: 10,
    happinessDecayMultiplier: 1.0,
    description: 'Balanced and friendly. Easy to care for.',
  },
  hyper: {
    playBonus: 15, // +5 from base 10
    happinessDecayMultiplier: 1.5, // Faster decay
    description: 'Energetic and playful! Needs attention.',
  },
};

// Favorite food gives 2x effect
export const FAVORITE_FOOD_MULTIPLIER = 2;

/**
 * Generate random pet personality based on wallet hash
 * Ensures consistent personality per user
 */
export function generatePetPersonality(walletAddress: string): PetPersonality {
  // Simple hash-based randomization
  const hash = walletAddress
    .toLowerCase()
    .split('')
    .reduce((acc, char) => {
      return acc + char.charCodeAt(0);
    }, 0);

  const energyLevels: EnergyLevel[] = ['lazy', 'normal', 'hyper'];
  const favoriteFoods: FavoriteFood[] = ['meat', 'veggie', 'kibble', 'energy'];
  const sleepSchedules: SleepSchedule[] = ['morning', 'afternoon', 'night'];

  return {
    energyLevel: energyLevels[hash % 3],
    favoriteFood: favoriteFoods[hash % 4],
    sleepSchedule: sleepSchedules[(hash * 7) % 3],
  };
}

/**
 * Get food item by ID
 */
export function getFoodItem(foodId: string): FoodItem | null {
  // Search by id field, not object key
  return Object.values(FOOD_ITEMS).find((item) => item.id === foodId) || null;
}

/**
 * Get consumable item by ID
 */
export function getConsumableItem(itemId: string): ConsumableItem | null {
  // Search by id field, not object key
  return Object.values(CONSUMABLE_ITEMS).find((item) => item.id === itemId) || null;
}

/**
 * Calculate food effect with personality bonus
 */
export function calculateFoodEffect(
  foodId: string,
  personality: PetPersonality
): { livesGain: number; happinessGain: number } {
  const food = getFoodItem(foodId);
  if (!food) {
    return { livesGain: 0, happinessGain: 0 };
  }

  let livesGain = food.livesGain;
  let happinessGain = food.happinessGain;

  // Apply favorite food multiplier
  const foodTypeMap: Record<string, FavoriteFood> = {
    'premium-meat': 'meat',
    'veggie-bowl': 'veggie',
    'basic-kibble': 'kibble',
    'energy-drink': 'energy',
  };

  const foodType = foodTypeMap[foodId];
  if (foodType === personality.favoriteFood) {
    livesGain *= FAVORITE_FOOD_MULTIPLIER;
    happinessGain *= FAVORITE_FOOD_MULTIPLIER;
  }

  return { livesGain, happinessGain };
}
