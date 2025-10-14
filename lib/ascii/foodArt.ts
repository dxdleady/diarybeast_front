/**
 * ASCII Art for Food Items
 * Tamagotchi-style pixel art food animations
 */

export const FOOD_ASCII = {
  // Basic Kibble - Simple bowl
  'basic-kibble': `
   ╔═══╗
   ║ ○ ║
   ║○ ○║
   ╚═══╝
  `,

  // Premium Meat - Juicy steak
  'premium-meat': `
   ┌───┐
   │███│
   │▓▓▓│
   └───┘
  `,

  // Veggie Bowl - Healthy salad
  'veggie-bowl': `
   ╭───╮
   │🥬🍅│
   │🥕🥦│
   ╰───╯
  `,

  // Energy Drink - Power bottle
  'energy-drink': `
   ┌─┐
   │⚡│
   │█│
   └─┘
  `,
};

export const FOOD_ASCII_ANIMATED = {
  // Basic Kibble - Steaming
  'basic-kibble': [
    `
   ╔═══╗
   ║ ○ ║
   ║○ ○║
   ╚═══╝
    `,
    `
    ~
   ╔═══╗
   ║ ○ ║
   ║○ ○║
   ╚═══╝
    `,
    `
   ~ ~
   ╔═══╗
   ║ ○ ║
   ║○ ○║
   ╚═══╝
    `,
  ],

  // Premium Meat - Sizzling
  'premium-meat': [
    `
   ┌───┐
   │███│
   │▓▓▓│
   └───┘
    `,
    `
    *
   ┌───┐
   │███│
   │▓▓▓│
   └───┘
    `,
    `
   * *
   ┌───┐
   │███│
   │▓▓▓│
   └───┘
    `,
  ],

  // Veggie Bowl - Fresh
  'veggie-bowl': [
    `
   ╭───╮
   │🥬🍅│
   │🥕🥦│
   ╰───╯
    `,
    `
     ✨
   ╭───╮
   │🥬🍅│
   │🥕🥦│
   ╰───╯
    `,
  ],

  // Energy Drink - Glowing
  'energy-drink': [
    `
   ┌─┐
   │⚡│
   │█│
   └─┘
    `,
    `
   ┌─┐
   │⚡│
   │▓│
   └─┘
    `,
    `
   ┌─┐
   │⚡│
   │░│
   └─┘
    `,
  ],
};

// Compact emoji versions for inventory/shop lists
export const FOOD_EMOJI = {
  'basic-kibble': '🥘',
  'premium-meat': '🍖',
  'veggie-bowl': '🥗',
  'energy-drink': '⚡',
};

// Get food ASCII art
export function getFoodArt(foodId: string): string {
  return FOOD_ASCII[foodId as keyof typeof FOOD_ASCII] || FOOD_ASCII['basic-kibble'];
}

// Get food animation frames
export function getFoodAnimation(foodId: string): string[] {
  return (
    FOOD_ASCII_ANIMATED[foodId as keyof typeof FOOD_ASCII_ANIMATED] || [FOOD_ASCII['basic-kibble']]
  );
}

// Get food emoji
export function getFoodEmoji(foodId: string): string {
  return FOOD_EMOJI[foodId as keyof typeof FOOD_EMOJI] || '🍽️';
}

// ============================================================================
// CONSUMABLE ITEMS ASCII ART
// ============================================================================

export const CONSUMABLE_ASCII = {
  // Time Skip Potion - Clock/Hourglass
  'time-skip': `
   ┌───┐
   │⏰ │
   │░▒▓│
   └───┘
  `,

  // Health Potion - Medical cross
  'health-potion': `
   ┌─┬─┐
   │ + │
   ├─┼─┤
   └─┴─┘
  `,

  // Happy Pill - Smiley
  'happy-pill': `
   ╭───╮
   │☺ ☺│
   │ ⌣ │
   ╰───╯
  `,
};

// Get consumable ASCII art
export function getConsumableArt(itemId: string): string {
  return (
    CONSUMABLE_ASCII[itemId as keyof typeof CONSUMABLE_ASCII] || CONSUMABLE_ASCII['happy-pill']
  );
}
