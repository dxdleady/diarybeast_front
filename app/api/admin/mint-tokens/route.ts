import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { mintTokens, getTokenBalance } from '@/lib/blockchain';

const ADMIN_API_KEY = process.env.ADMIN_API_KEY || 'dev-admin-key-2024';

export async function POST(req: NextRequest) {
  try {
    // Check admin authentication
    const apiKey = req.headers.get('x-admin-api-key');

    if (apiKey !== ADMIN_API_KEY) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { userAddress, amount } = await req.json();

    if (!userAddress || !amount) {
      return NextResponse.json(
        { error: 'Missing userAddress or amount' },
        { status: 400 }
      );
    }

    if (typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json(
        { error: 'Amount must be a positive number' },
        { status: 400 }
      );
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { walletAddress: userAddress.toLowerCase() },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Mint tokens on-chain
    const txHash = await mintTokens(userAddress, amount);

    // Get new on-chain balance
    const onChainBalance = await getTokenBalance(userAddress);

    // Sync database balance with blockchain
    await prisma.user.update({
      where: { walletAddress: userAddress.toLowerCase() },
      data: { coinsBalance: onChainBalance },
    });

    return NextResponse.json({
      success: true,
      txHash,
      amount,
      newBalance: onChainBalance,
      message: `Successfully minted ${amount} DIARY tokens`,
    });
  } catch (error) {
    console.error('Admin mint error:', error);
    return NextResponse.json(
      {
        error: 'Failed to mint tokens',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
