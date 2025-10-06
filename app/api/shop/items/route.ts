import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const items = await prisma.shopItem.findMany({
      where: { available: true },
      orderBy: { sortOrder: 'asc' },
    });

    return NextResponse.json({ items });
  } catch (error) {
    console.error('Get shop items error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch items' },
      { status: 500 }
    );
  }
}
