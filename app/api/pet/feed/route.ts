import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { burnTokens } from '@/lib/blockchain';
import {
  getFoodItem,
  calculateFoodEffect,
  type PetPersonality,
} from '@/lib/gamification/itemsConfig';

const MAX_LIVES = 7;
const MAX_HAPPINESS = 100;

export async function POST(req: NextRequest) {
  try {
    const { userAddress, foodId = 'basic-kibble' } = await req.json();

    if (!userAddress) {
      return NextResponse.json({ error: 'Missing userAddress' }, { status: 400 });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { walletAddress: userAddress.toLowerCase() },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get food item
    const food = getFoodItem(foodId);
    if (!food) {
      return NextResponse.json({ error: 'Invalid food item' }, { status: 400 });
    }

    // Check if user has food in inventory
    const inventory = (user.inventory as Record<string, number>) || {};
    const foodCount = inventory[foodId] || 0;

    if (foodCount <= 0) {
      return NextResponse.json(
        { error: `No ${food.name} in inventory. Buy from shop first!` },
        { status: 400 }
      );
    }

    // Check cooldown
    const FEED_COOLDOWN_MS = food.cooldown * 60 * 60 * 1000;
    if (user.lastFeedTime) {
      const timeSinceLastFeed = Date.now() - new Date(user.lastFeedTime).getTime();
      if (timeSinceLastFeed < FEED_COOLDOWN_MS) {
        const remainingMs = FEED_COOLDOWN_MS - timeSinceLastFeed;
        const remainingHours = Math.ceil(remainingMs / (1000 * 60 * 60));
        return NextResponse.json(
          {
            error: `Feed is on cooldown. Please wait ${remainingHours} more hours.`,
            cooldownRemaining: remainingMs,
          },
          { status: 429 }
        );
      }
    }

    // Calculate effects with personality bonus
    const personality = (user.petPersonality as PetPersonality) || {
      energyLevel: 'normal',
      favoriteFood: 'kibble',
      sleepSchedule: 'afternoon',
    };
    const { livesGain, happinessGain } = calculateFoodEffect(foodId, personality);

    // Check if already at max lives
    if (user.livesRemaining >= MAX_LIVES && livesGain > 0) {
      return NextResponse.json({ error: 'Pet is already at maximum health' }, { status: 400 });
    }

    // Decrease food count in inventory
    const newInventory = { ...inventory };
    newInventory[foodId] = foodCount - 1;
    if (newInventory[foodId] === 0) {
      delete newInventory[foodId]; // Remove from inventory if empty
    }

    // Update user stats (no token burn - already paid in shop)
    const newLives = Math.min(MAX_LIVES, user.livesRemaining + livesGain);
    const newHappiness = Math.min(MAX_HAPPINESS, user.happiness + happinessGain);

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        livesRemaining: newLives,
        happiness: newHappiness,
        inventory: newInventory,
        lastFeedTime: new Date(),
        petState: 'eating',
        lastActiveAt: new Date(),
      },
    });

    // Check if favorite food
    const isFavorite = personality.favoriteFood === food.id.replace('-', '');

    return NextResponse.json({
      success: true,
      newLives: updatedUser.livesRemaining,
      newHappiness: updatedUser.happiness,
      inventory: updatedUser.inventory,
      livesGain,
      happinessGain,
      foodUsed: food.name,
      foodRemaining: newInventory[foodId] || 0,
      isFavorite,
      message: isFavorite
        ? `Your pet LOVES ${food.name}! 2x effect! ❤️`
        : `Fed pet ${food.name}! Lives: ${updatedUser.livesRemaining}/${MAX_LIVES}`,
    });
  } catch (error) {
    console.error('Feed error:', error);
    return NextResponse.json(
      {
        error: 'Failed to feed pet',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
