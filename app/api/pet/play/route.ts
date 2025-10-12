import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const MAX_HAPPINESS = 100;
const HAPPINESS_GAIN = 10;
const PLAY_COOLDOWN_MS = 4 * 60 * 60 * 1000; // 4 hours

export async function POST(req: NextRequest) {
  try {
    const { userAddress } = await req.json();

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

    // Check if already at max happiness
    if (user.happiness >= MAX_HAPPINESS) {
      return NextResponse.json({ error: 'Pet is already at maximum happiness' }, { status: 400 });
    }

    // Check cooldown
    if (user.lastPlayTime) {
      const timeSinceLastPlay = Date.now() - new Date(user.lastPlayTime).getTime();
      if (timeSinceLastPlay < PLAY_COOLDOWN_MS) {
        const remainingMs = PLAY_COOLDOWN_MS - timeSinceLastPlay;
        const remainingHours = Math.ceil(remainingMs / (1000 * 60 * 60));
        return NextResponse.json(
          {
            error: `Play is on cooldown. Please wait ${remainingHours} more hours.`,
            cooldownRemaining: remainingMs,
          },
          { status: 429 }
        );
      }
    }

    // Update user: +10 happiness
    const newHappiness = Math.min(MAX_HAPPINESS, user.happiness + HAPPINESS_GAIN);
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        happiness: newHappiness,
        lastPlayTime: new Date(),
        petState: 'playing', // Set animation state
        lastActiveAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      newHappiness: updatedUser.happiness,
      newLives: updatedUser.livesRemaining,
      message: `Played with pet! Happiness increased to ${updatedUser.happiness}/${MAX_HAPPINESS}`,
    });
  } catch (error) {
    console.error('Play error:', error);
    return NextResponse.json(
      {
        error: 'Failed to play with pet',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
