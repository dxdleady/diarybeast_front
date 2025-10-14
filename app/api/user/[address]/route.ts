import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { syncUserBalance } from '@/lib/blockchain';
import { calculateHappinessDecay } from '@/lib/gamification/lifeSystem';
import { generatePetPersonality } from '@/lib/gamification/itemsConfig';

export async function GET(req: NextRequest, { params }: { params: Promise<{ address: string }> }) {
  try {
    const { address } = await params;

    // Sync balance from blockchain
    try {
      await syncUserBalance(address, prisma);
    } catch (error) {
      console.error('Balance sync error:', error);
      // Continue even if sync fails
    }

    let user = await prisma.user.findUnique({
      where: { walletAddress: address.toLowerCase() },
      include: {
        _count: {
          select: { entries: true },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Generate pet personality if not exists
    if (!user.petPersonality) {
      const personality = generatePetPersonality(address);
      user = await prisma.user.update({
        where: { id: user.id },
        data: { petPersonality: personality as any },
        include: {
          _count: {
            select: { entries: true },
          },
        },
      });
    }

    // Apply happiness decay based on time since last active
    const { newHappiness, happinessLost } = calculateHappinessDecay(
      user.happiness,
      user.lastActiveAt
    );

    // Update happiness if it changed
    if (happinessLost > 0) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { happiness: newHappiness },
        include: {
          _count: {
            select: { entries: true },
          },
        },
      });
    }

    return NextResponse.json({
      id: user.id,
      walletAddress: user.walletAddress,
      selectedAnimal: user.selectedAnimal,
      petName: user.petName,
      userName: user.userName,
      userAge: user.userAge,
      diaryGoal: user.diaryGoal,
      onboardingCompleted: user.onboardingCompleted,
      coinsBalance: user.coinsBalance,
      livesRemaining: user.livesRemaining,
      currentStreak: user.currentStreak,
      longestStreak: user.longestStreak,
      lastEntryDate: user.lastEntryDate?.toISOString() ?? null,
      lastActiveAt: user.lastActiveAt.toISOString(),
      aiAnalysisEnabled: user.aiAnalysisEnabled,
      activeBackground: user.activeBackground,
      activeAccessory: user.activeAccessory,
      totalEntries: user._count.entries,
      // Tamagotchi fields
      happiness: user.happiness,
      petState: user.petState,
      petPersonality: user.petPersonality,
      inventory: user.inventory ?? {},
      lastFeedTime: user.lastFeedTime?.toISOString() ?? null,
      lastPlayTime: user.lastPlayTime?.toISOString() ?? null,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : error ? String(error) : 'Unknown error';
    console.error('Get user error:', errorMessage);
    return NextResponse.json(
      { error: 'Failed to fetch user', details: errorMessage },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ address: string }> }
) {
  try {
    const { address } = await params;
    const data = await req.json();

    const updateData: any = {};

    if (data.selectedAnimal !== undefined) {
      updateData.selectedAnimal = data.selectedAnimal;
    }

    if (data.petName !== undefined) {
      updateData.petName = data.petName;
    }

    if (data.userName !== undefined) {
      updateData.userName = data.userName;
    }

    if (data.userAge !== undefined) {
      updateData.userAge = data.userAge;
    }

    if (data.diaryGoal !== undefined) {
      updateData.diaryGoal = data.diaryGoal;
    }

    if (data.onboardingCompleted !== undefined) {
      updateData.onboardingCompleted = data.onboardingCompleted;
    }

    if (data.aiAnalysisEnabled !== undefined) {
      updateData.aiAnalysisEnabled = data.aiAnalysisEnabled;
    }

    if (data.activeBackground !== undefined) {
      updateData.activeBackground = data.activeBackground;
    }

    if (data.activeAccessory !== undefined) {
      updateData.activeAccessory = data.activeAccessory;
    }

    const user = await prisma.user.update({
      where: { walletAddress: address.toLowerCase() },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        walletAddress: user.walletAddress,
        selectedAnimal: user.selectedAnimal,
        aiAnalysisEnabled: user.aiAnalysisEnabled,
      },
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : error ? String(error) : 'Unknown error';
    console.error('Update user error:', errorMessage);
    return NextResponse.json(
      { error: 'Failed to update user', details: errorMessage },
      { status: 500 }
    );
  }
}
