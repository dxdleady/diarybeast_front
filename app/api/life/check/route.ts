import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { calculateLifeLoss, shouldCheckLifeLoss, MAX_LIVES } from '@/lib/gamification/lifeSystem';

/**
 * POST /api/life/check
 *
 * Check and update user's pet lives based on inactivity
 *
 * Request: { userAddress: string }
 * Response: {
 *   livesLost: number,
 *   newLives: number,
 *   streakReset: boolean,
 *   shouldNotify: boolean,
 *   notificationType: 'warning' | 'critical' | null,
 *   message: string,
 *   hoursInactive: number
 * }
 */
export async function POST(req: NextRequest) {
  try {
    const { userAddress } = await req.json();

    if (!userAddress) {
      return NextResponse.json({ error: 'Missing userAddress' }, { status: 400 });
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { walletAddress: userAddress.toLowerCase() },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const now = new Date();

    // Check if we should do a full check (rate limiting)
    const shouldDoFullCheck = shouldCheckLifeLoss(user.lastLifeLossCheck);

    // If not enough time passed, just update lastActiveAt
    if (!shouldDoFullCheck) {
      await prisma.user.update({
        where: { id: user.id },
        data: { lastActiveAt: now },
      });

      return NextResponse.json({
        livesLost: 0,
        newLives: user.livesRemaining,
        streakReset: false,
        shouldNotify: false,
        notificationType: null,
        message: 'Welcome back!',
        hoursInactive: 0,
      });
    }

    // Do full life loss calculation
    const result = calculateLifeLoss(user.lastActiveAt, user.livesRemaining);

    // Prepare update data
    const updateData: any = {
      lastActiveAt: now,
      lastLifeLossCheck: now,
      livesRemaining: result.newLives,
    };

    // If any lives lost due to inactivity, reset streak
    // This means user missed a day and broke the consecutive days chain
    if (result.livesLost > 0) {
      // Save longest streak if current is higher
      if (user.currentStreak > user.longestStreak) {
        updateData.longestStreak = user.currentStreak;
      }
      updateData.currentStreak = 0;
    }

    // Update user in database
    await prisma.user.update({
      where: { id: user.id },
      data: updateData,
    });

    return NextResponse.json({
      livesLost: result.livesLost,
      newLives: result.newLives,
      streakReset: result.streakReset,
      shouldNotify: result.shouldNotify,
      notificationType: result.notificationType,
      message: result.message,
      hoursInactive: result.hoursInactive,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : error ? String(error) : 'Unknown error';
    console.error('Life check error:', errorMessage);
    return NextResponse.json(
      { error: 'Failed to check lives', details: errorMessage },
      { status: 500 }
    );
  }
}

/**
 * GET /api/life/check?userAddress=0x...
 *
 * Get current life status without updating
 * (For display purposes only)
 */
export async function GET(req: NextRequest) {
  try {
    const userAddress = req.nextUrl.searchParams.get('userAddress');

    if (!userAddress) {
      return NextResponse.json({ error: 'Missing userAddress' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { walletAddress: userAddress.toLowerCase() },
      select: {
        livesRemaining: true,
        lastActiveAt: true,
        currentStreak: true,
        longestStreak: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : error ? String(error) : 'Unknown error';
    console.error('Get life status error:', errorMessage);
    return NextResponse.json(
      { error: 'Failed to get life status', details: errorMessage },
      { status: 500 }
    );
  }
}
