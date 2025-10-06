import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userAddress = searchParams.get('userAddress');

    if (!userAddress) {
      return NextResponse.json(
        { error: 'Missing userAddress' },
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

    // Get all summaries
    const summaries = await prisma.weeklySummary.findMany({
      where: { userId: user.id },
      orderBy: { weekStart: 'desc' },
    });

    return NextResponse.json({
      success: true,
      summaries: summaries.map((s) => ({
        id: s.id,
        weekStart: s.weekStart.toISOString(),
        weekEnd: s.weekEnd.toISOString(),
        emotions: s.emotions,
        summary: s.summary,
        insights: s.insights,
        trend: s.trend,
        createdAt: s.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error('Get summaries error');
    return NextResponse.json(
      {
        error: 'Failed to fetch summaries',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
