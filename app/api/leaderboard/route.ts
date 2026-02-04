import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const sort = searchParams.get('sort') || 'streak';
    const filter = searchParams.get('filter');
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);

    const where: any = {};
    if (filter === 'agents') where.isAgent = true;
    if (filter === 'humans') where.isAgent = false;
    if (filter === 'rare') where.rarePets = { isEmpty: false };

    let orderBy: any;
    switch (sort) {
      case 'entries':
        orderBy = { entries: { _count: 'desc' } };
        break;
      case 'balance':
        orderBy = { coinsBalance: 'desc' };
        break;
      case 'streak':
      default:
        orderBy = { currentStreak: 'desc' };
        break;
    }

    const users = await prisma.user.findMany({
      where: {
        ...where,
        onboardingCompleted: true,
      },
      orderBy,
      take: limit,
      select: {
        walletAddress: true,
        petName: true,
        selectedAnimal: true,
        currentStreak: true,
        longestStreak: true,
        coinsBalance: true,
        isAgent: true,
        rarePets: true,
        happiness: true,
        livesRemaining: true,
        _count: { select: { entries: true } },
      },
    });

    return NextResponse.json({
      leaderboard: users.map((u, i) => ({
        rank: i + 1,
        walletAddress: `${u.walletAddress.slice(0, 6)}...${u.walletAddress.slice(-4)}`,
        fullAddress: u.walletAddress,
        petName: u.petName,
        petType: u.selectedAnimal,
        streak: u.currentStreak,
        bestStreak: u.longestStreak,
        entries: u._count.entries,
        balance: u.coinsBalance,
        isAgent: u.isAgent,
        isRare: ((u.rarePets as string[]) || []).length > 0,
        rarePets: u.rarePets,
        happiness: u.happiness,
        lives: u.livesRemaining,
      })),
      sort,
      filter,
      total: users.length,
    });
  } catch (error) {
    console.error('Leaderboard error:', error);
    return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 });
  }
}
