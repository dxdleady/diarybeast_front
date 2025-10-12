import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const MAX_LIVES = 7;
const FEED_COOLDOWN_MS = 8 * 60 * 60 * 1000; // 8 hours

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

    // Check if already at max lives
    if (user.livesRemaining >= MAX_LIVES) {
      return NextResponse.json({ error: 'Pet is already at maximum health' }, { status: 400 });
    }

    // Check cooldown
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

    // Update user: +1 life
    const newLives = Math.min(MAX_LIVES, user.livesRemaining + 1);
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        livesRemaining: newLives,
        lastFeedTime: new Date(),
        petState: 'eating', // Set animation state
        lastActiveAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      newLives: updatedUser.livesRemaining,
      newHappiness: updatedUser.happiness,
      message: `Fed pet! Lives restored to ${updatedUser.livesRemaining}/${MAX_LIVES}`,
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
