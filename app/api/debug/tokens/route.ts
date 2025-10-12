import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getTokenBalance } from '@/lib/blockchain';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userAddress = searchParams.get('address');

    if (!userAddress) {
      return NextResponse.json({ error: 'Address required' }, { status: 400 });
    }

    // Get user from DB
    const user = await prisma.user.findUnique({
      where: { walletAddress: userAddress.toLowerCase() },
      include: {
        entries: {
          select: {
            id: true,
            date: true,
            wordCount: true,
          },
          orderBy: { date: 'desc' },
          take: 5,
        },
        rewards: {
          select: {
            id: true,
            type: true,
            amount: true,
            description: true,
            txHash: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get on-chain balance
    let onChainBalance = 0;
    let balanceError = null;
    try {
      onChainBalance = await getTokenBalance(userAddress);
    } catch (error) {
      balanceError = error instanceof Error ? error.message : 'Unknown error';
    }

    return NextResponse.json({
      user: {
        address: user.walletAddress,
        coinsBalanceDB: user.coinsBalance,
        onChainBalance,
        balanceError,
      },
      entries: {
        total: user.entries.length,
        recent: user.entries,
      },
      rewards: {
        total: user.rewards.length,
        totalAmount: user.rewards.reduce((sum, r) => sum + r.amount, 0),
        recent: user.rewards,
      },
      contracts: {
        tokenAddress: process.env.NEXT_PUBLIC_DIARY_TOKEN_ADDRESS,
        ownerPrivateKeySet: !!process.env.OWNER_PRIVATE_KEY,
      },
    });
  } catch (error) {
    console.error('Debug tokens error:', error);
    return NextResponse.json(
      {
        error: 'Failed to debug',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
