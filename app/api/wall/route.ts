import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const sort = searchParams.get('sort') || 'recent';
    const tag = searchParams.get('tag');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50);
    const skip = (page - 1) * limit;

    const where: any = {};
    if (tag) {
      where.tags = { has: tag };
    }

    const orderBy =
      sort === 'popular' ? { likes: 'desc' as const } : { createdAt: 'desc' as const };

    const [posts, total] = await Promise.all([
      prisma.wallPost.findMany({
        where,
        orderBy,
        skip,
        take: limit,
      }),
      prisma.wallPost.count({ where }),
    ]);

    return NextResponse.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Wall fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch wall' }, { status: 500 });
  }
}
