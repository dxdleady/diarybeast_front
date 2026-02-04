import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { type, message, walletAddress, contact, isAgent } = await req.json();

    if (!message || typeof message !== 'string' || message.trim().length < 5) {
      return NextResponse.json({ error: 'Message must be at least 5 characters' }, { status: 400 });
    }

    const validTypes = ['bug', 'feature', 'general', 'love'];
    if (!type || !validTypes.includes(type)) {
      return NextResponse.json({ error: 'Invalid feedback type' }, { status: 400 });
    }

    const feedback = await prisma.feedback.create({
      data: {
        type,
        message: message.trim().slice(0, 5000),
        walletAddress: walletAddress?.toLowerCase() || null,
        contact: contact?.trim().slice(0, 200) || null,
        isAgent: isAgent || false,
      },
    });

    return NextResponse.json({ success: true, id: feedback.id });
  } catch {
    return NextResponse.json({ error: 'Failed to submit feedback' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const adminKey = req.headers.get('x-admin-key');
  if (adminKey !== process.env.ADMIN_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const feedback = await prisma.feedback.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100,
  });

  return NextResponse.json({ feedback });
}
