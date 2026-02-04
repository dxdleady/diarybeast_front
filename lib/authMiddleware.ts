import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

export interface AuthResult {
  user: {
    id: string;
    walletAddress: string;
    [key: string]: any;
  };
  authMethod: 'wallet' | 'token';
}

export async function authenticateRequest(req: NextRequest): Promise<AuthResult | null> {
  // Method 1: Bearer token (agents)
  const authHeader = req.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.slice(7);
    const user = await prisma.user.findFirst({
      where: {
        authToken: token,
        authTokenExpiry: { gt: new Date() },
      },
    });
    if (user) {
      return { user, authMethod: 'token' };
    }
    return null;
  }

  // Method 2: Wallet address header (existing UI flow)
  const walletAddress =
    req.headers.get('x-wallet-address') || req.nextUrl.searchParams.get('userAddress');

  if (walletAddress) {
    const user = await prisma.user.findUnique({
      where: { walletAddress: walletAddress.toLowerCase() },
    });
    if (user) {
      return { user, authMethod: 'wallet' };
    }
  }

  return null;
}
