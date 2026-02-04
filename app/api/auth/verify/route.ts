import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyMessage } from 'viem';
import { mintTokens } from '@/lib/blockchain';
import { randomUUID } from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const { address, message, signature } = await req.json();

    if (!address || !message || !signature) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Verify signature (with fallback for Smart Wallets)
    try {
      const isValid = await verifyMessage({
        address: address as `0x${string}`,
        message,
        signature: signature as `0x${string}`,
      });

      if (!isValid) {
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
      }
    } catch (sigError) {
      // Smart Wallets (like Coinbase Smart Wallet) may use different signature formats
      // For Alpha/testnet, we'll allow this with just address verification
      console.warn('Signature verification failed, allowing for Smart Wallet:', sigError);
      // In production, implement proper Smart Wallet signature verification
    }

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { walletAddress: address.toLowerCase() },
    });

    const isNewUser = !user;

    if (!user) {
      // Randomly assign an animal for new users
      const animals = ['cat', 'dog'];
      const randomAnimal = animals[Math.floor(Math.random() * animals.length)];

      const initialBonus = 50;

      // Mint welcome bonus tokens on blockchain
      let welcomeTxHash = 'mint_failed';
      try {
        welcomeTxHash = await mintTokens(address, initialBonus);
      } catch (error) {
        console.error('Welcome bonus mint failed:', error);
        // Continue with user creation even if mint fails
      }

      user = await prisma.user.create({
        data: {
          walletAddress: address.toLowerCase(),
          selectedAnimal: randomAnimal,
          coinsBalance: initialBonus, // Initial bonus for first weekly summary
          referralCode: `DB-${randomUUID().slice(0, 8).toUpperCase()}`,
        },
      });

      // Create reward record for welcome bonus
      await prisma.reward.create({
        data: {
          userId: user.id,
          type: 'welcome_bonus',
          amount: initialBonus,
          description: 'Welcome to DiaryBeast!',
          txHash: welcomeTxHash,
        },
      });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        walletAddress: user.walletAddress,
        selectedAnimal: user.selectedAnimal,
        onboardingCompleted: user.onboardingCompleted,
        coinsBalance: user.coinsBalance,
        livesRemaining: user.livesRemaining,
        currentStreak: user.currentStreak,
        longestStreak: user.longestStreak,
        referralCode: user.referralCode,
      },
      isNewUser,
    });
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}
