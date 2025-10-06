import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { syncUserBalance } from '@/lib/blockchain';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ address: string }> }
) {
  try {
    const { address } = await params;

    // Sync balance from blockchain
    try {
      await syncUserBalance(address, prisma);
    } catch (error) {
      console.error('Balance sync error:', error);
      // Continue even if sync fails
    }

    const user = await prisma.user.findUnique({
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
      lastEntryDate: user.lastEntryDate?.toISOString(),
      lastActiveAt: user.lastActiveAt.toISOString(),
      aiAnalysisEnabled: user.aiAnalysisEnabled,
      activeBackground: user.activeBackground,
      activeAccessory: user.activeAccessory,
      totalEntries: user._count.entries,
    });
  } catch (error) {
    console.error('Get user error');
    return NextResponse.json(
      { error: 'Failed to fetch user', details: error instanceof Error ? error.message : 'Unknown error' },
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
    console.error('Update user error');
    return NextResponse.json(
      { error: 'Failed to update user', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
