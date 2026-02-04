import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Missing token' }, { status: 401 });
  }

  const token = authHeader.slice(7);
  const user = await prisma.user.findFirst({
    where: {
      authToken: token,
      authTokenExpiry: { gt: new Date() },
    },
  });

  if (!user) {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
  }

  return NextResponse.json({
    user: {
      walletAddress: user.walletAddress,
      petName: user.petName,
      selectedAnimal: user.selectedAnimal,
      onboardingCompleted: user.onboardingCompleted,
    },
  });
}
