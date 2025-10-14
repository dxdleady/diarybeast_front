import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getConsumableItem } from '@/lib/gamification/itemsConfig';

const MAX_LIVES = 7;
const MAX_HAPPINESS = 100;

export async function POST(req: NextRequest) {
  try {
    const { userAddress, itemId } = await req.json();

    if (!userAddress || !itemId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get consumable item
    const item = getConsumableItem(itemId);
    if (!item) {
      return NextResponse.json({ error: 'Invalid item' }, { status: 400 });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { walletAddress: userAddress.toLowerCase() },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if user has the item in inventory
    const inventory = (user.inventory as Record<string, number>) || {};
    const itemCount = inventory[itemId] || 0;

    if (itemCount <= 0) {
      return NextResponse.json({ error: 'Item not in inventory' }, { status: 400 });
    }

    // Apply item effect
    let updates: any = {
      lastActiveAt: new Date(),
    };

    switch (item.effect) {
      case 'timeSkip':
        // Reset cooldowns
        updates.lastFeedTime = null;
        updates.lastPlayTime = null;
        break;

      case 'healthRestore':
        // Restore lives
        const newLives = Math.min(MAX_LIVES, user.livesRemaining + item.value);
        updates.livesRemaining = newLives;
        break;

      case 'happinessBoost':
        // Boost happiness
        const newHappiness = Math.min(MAX_HAPPINESS, user.happiness + item.value);
        updates.happiness = newHappiness;
        break;
    }

    // Decrease item count in inventory
    const newInventory = { ...inventory };
    newInventory[itemId] = itemCount - 1;
    if (newInventory[itemId] === 0) {
      delete newInventory[itemId];
    }
    updates.inventory = newInventory;

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: updates,
    });

    return NextResponse.json({
      success: true,
      itemUsed: item.name,
      effect: item.effect,
      newLives: updatedUser.livesRemaining,
      newHappiness: updatedUser.happiness,
      inventory: updatedUser.inventory,
      message: `Used ${item.name}! ${item.description}`,
    });
  } catch (error) {
    console.error('Use item error:', error);
    return NextResponse.json(
      {
        error: 'Failed to use item',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
