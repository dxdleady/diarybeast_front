import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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
      include: { purchases: true },
    });

    if (!user) {
      return NextResponse.json({ purchases: [] });
    }

    return NextResponse.json({ purchases: user.purchases });
  } catch (error) {
    console.error('Get purchases error');
    return NextResponse.json(
      { error: 'Failed to fetch purchases', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
