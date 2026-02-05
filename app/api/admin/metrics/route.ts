import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const adminKey = req.headers.get('x-admin-key');
    if (adminKey !== process.env.ADMIN_API_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const now = new Date();
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    const [
      totalUsers,
      totalAgents,
      totalHumans,
      onboardedUsers,
      totalEntries,
      todayEntries,
      weekEntries,
      avgStreak,
      deadPets,
      totalWallPosts,
      todayWallPosts,
      avgLikes,
      totalPurchases,
      usersWithPurchases,
      totalMinted,
      totalBurned,
      referredUsers,
      rareHolders,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { isAgent: true } }),
      prisma.user.count({ where: { isAgent: false } }),
      prisma.user.count({ where: { onboardingCompleted: true } }),
      prisma.entry.count(),
      prisma.entry.count({ where: { date: { gte: today } } }),
      prisma.entry.count({ where: { date: { gte: weekAgo } } }),
      prisma.user.aggregate({ _avg: { currentStreak: true } }),
      prisma.user.count({ where: { livesRemaining: 0 } }),
      prisma.wallPost.count(),
      prisma.wallPost.count({ where: { createdAt: { gte: today } } }),
      prisma.wallPost.aggregate({ _avg: { likes: true } }),
      prisma.purchase.count(),
      prisma.purchase.groupBy({ by: ['userId'], _count: true }).then((r) => r.length),
      prisma.reward.aggregate({ _sum: { amount: true } }),
      prisma.purchase.aggregate({ _sum: { price: true } }),
      prisma.user.count({ where: { referredBy: { not: null } } }),
      prisma.user.count({ where: { rarePets: { isEmpty: false } } }),
    ]);

    const dauResult = await prisma.entry.groupBy({
      by: ['userId'],
      where: { date: { gte: today } },
    });
    const dau = dauResult.length;

    const wauResult = await prisma.entry.groupBy({
      by: ['userId'],
      where: { date: { gte: weekAgo } },
    });
    const wau = wauResult.length;

    const referrers = await prisma.user.count({
      where: { referralCode: { not: null } },
    });
    const kFactor = referrers > 0 ? referredUsers / referrers : 0;

    return NextResponse.json({
      timestamp: now.toISOString(),
      users: {
        total: totalUsers,
        agents: totalAgents,
        humans: totalHumans,
        onboarded: onboardedUsers,
        onboardingRate:
          totalUsers > 0 ? ((onboardedUsers / totalUsers) * 100).toFixed(1) + '%' : '0%',
        botHumanRatio: `${totalAgents}:${totalHumans}`,
      },
      engagement: {
        dau,
        wau,
        totalEntries,
        entriesToday: todayEntries,
        entriesThisWeek: weekEntries,
        avgStreak: (avgStreak._avg.currentStreak || 0).toFixed(1),
      },
      petHealth: {
        deadPets,
        deathRate: totalUsers > 0 ? ((deadPets / totalUsers) * 100).toFixed(1) + '%' : '0%',
      },
      wall: {
        totalPosts: totalWallPosts,
        postsToday: todayWallPosts,
        avgLikesPerPost: (avgLikes._avg.likes || 0).toFixed(1),
      },
      economy: {
        totalMinted: totalMinted._sum.amount || 0,
        totalBurned: totalBurned._sum.price || 0,
        tokenVelocity:
          (totalBurned._sum.price || 0) > 0
            ? (((totalBurned._sum.price || 0) / (totalMinted._sum.amount || 1)) * 100).toFixed(1) +
              '%'
            : '0%',
        totalPurchases,
        shopConversion:
          totalUsers > 0 ? ((usersWithPurchases / totalUsers) * 100).toFixed(1) + '%' : '0%',
      },
      virality: {
        referredUsers,
        kFactor: kFactor.toFixed(2),
        rareHolders,
      },
    });
  } catch (error) {
    console.error('Metrics error:', error);
    return NextResponse.json({ error: 'Failed to compute metrics' }, { status: 500 });
  }
}
