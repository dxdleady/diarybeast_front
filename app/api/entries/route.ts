import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyMessage } from 'viem';
import { mintTokens } from '@/lib/blockchain';
import { restoreLives } from '@/lib/gamification/lifeSystem';
import { calculateStreakBonus } from '@/lib/gamification/streakRewards';

export async function POST(req: NextRequest) {
  try {
    const { userAddress, encryptedContent, signature, contentHash, wordCount } =
      await req.json();

    if (!userAddress || !encryptedContent || !signature || !contentHash) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify signature (with Smart Wallet fallback)
    try {
      const isValid = await verifyMessage({
        address: userAddress as `0x${string}`,
        message: { raw: contentHash as `0x${string}` },
        signature: signature as `0x${string}`,
      });

      if (!isValid) {
        return NextResponse.json(
          { error: 'Invalid signature' },
          { status: 400 }
        );
      }
    } catch (sigError) {
      console.warn('Signature verification failed (Smart Wallet):', sigError);
      // Allow for Smart Wallets in testnet
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { walletAddress: userAddress.toLowerCase() },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if entry exists today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const existingEntry = await prisma.entry.findFirst({
      where: {
        userId: user.id,
        date: {
          gte: today,
          lt: tomorrow,
        },
      },
    });

    if (existingEntry) {
      return NextResponse.json(
        { error: 'Entry already exists for today' },
        { status: 409 }
      );
    }

    // Create entry
    const entry = await prisma.entry.create({
      data: {
        userId: user.id,
        encryptedContent,
        signature,
        contentHash,
        wordCount: wordCount || 0,
        date: new Date(),
      },
    });

    // Determine reward
    const entryCount = await prisma.entry.count({
      where: { userId: user.id },
    });
    const isFirstEntry = entryCount === 1;
    const rewardAmount = isFirstEntry ? 50 : 10;

    // Mint tokens
    let txHash: string;
    try {
      txHash = await mintTokens(userAddress, rewardAmount);
    } catch (error) {
      console.error('Token mint failed:', error);
      // Still create entry even if mint fails
      txHash = 'mint_failed';
    }

    // Create reward record
    await prisma.reward.create({
      data: {
        userId: user.id,
        type: isFirstEntry ? 'first_entry' : 'daily_entry',
        amount: rewardAmount,
        description: isFirstEntry
          ? 'First entry bonus!'
          : 'Daily entry reward',
        txHash,
      },
    });

    // Calculate lives to restore (+2, not full restore)
    const newLives = restoreLives(user.livesRemaining);
    const livesRestored = newLives - user.livesRemaining;

    // Calculate streak based on consecutive days
    // If user wrote yesterday, increment streak. Otherwise reset to 1.
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    const lastEntryDate = user.lastEntryDate ? new Date(user.lastEntryDate) : null;
    let yesterdayEntry = false;

    if (lastEntryDate) {
      const lastEntry = new Date(lastEntryDate);
      lastEntry.setHours(0, 0, 0, 0);
      yesterdayEntry = lastEntry.getTime() === yesterday.getTime();
    }

    const newStreak = yesterdayEntry ? user.currentStreak + 1 : 1;
    const newLongestStreak = Math.max(user.longestStreak, newStreak);

    // Check for streak milestone bonus
    const { bonus: streakBonus, milestone } = calculateStreakBonus(newStreak);
    const totalReward = rewardAmount + streakBonus;

    // Create streak bonus reward if milestone reached
    if (streakBonus > 0 && milestone) {
      await prisma.reward.create({
        data: {
          userId: user.id,
          type: 'streak_bonus',
          amount: streakBonus,
          description: `${milestone.label} bonus!`,
          txHash: 'streak_milestone',
        },
      });
    }

    // Update user stats
    const now = new Date();
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        coinsBalance: { increment: totalReward },
        currentStreak: newStreak,
        longestStreak: newLongestStreak,
        lastEntryDate: now,
        lastActiveAt: now, // Update last active
        livesRemaining: newLives, // Restore +2 lives
      },
    });

    return NextResponse.json({
      success: true,
      entry: {
        id: entry.id,
        date: entry.date,
      },
      reward: {
        amount: rewardAmount,
        streakBonus,
        totalAmount: totalReward,
        type: isFirstEntry ? 'first_entry' : 'daily_entry',
        txHash,
        milestone: milestone ? milestone.label : null,
      },
      updatedUser: {
        coinsBalance: updatedUser.coinsBalance,
        currentStreak: updatedUser.currentStreak,
        livesRemaining: updatedUser.livesRemaining,
      },
      livesRestored, // Include lives restored for success modal
      oldLives: user.livesRemaining, // Include old lives for before/after display
    });
  } catch (error) {
    console.error('Entry creation error');
    return NextResponse.json(
      { error: 'Failed to create entry', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const userAddress = req.nextUrl.searchParams.get('userAddress');

    if (!userAddress) {
      return NextResponse.json(
        { error: 'Missing userAddress' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { walletAddress: userAddress.toLowerCase() },
      include: {
        entries: {
          orderBy: { date: 'desc' },
          take: 20,
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      entries: user.entries,
      total: user.entries.length,
    });
  } catch (error) {
    console.error('Get entries error');
    return NextResponse.json(
      { error: 'Failed to fetch entries', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
