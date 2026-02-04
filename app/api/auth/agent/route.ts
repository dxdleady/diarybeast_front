import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyMessage } from 'viem';
import { mintTokens } from '@/lib/blockchain';
import { randomUUID } from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const { address, signature, nonce, referralCode } = await req.json();

    if (!address || !signature || !nonce) {
      return NextResponse.json(
        { error: 'Missing required fields: address, signature, nonce' },
        { status: 400 }
      );
    }

    // Verify signature
    const message = `DiaryBeast Agent Auth: ${nonce}`;
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
      console.warn('Agent signature verification failed (Smart Wallet):', sigError);
    }

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { walletAddress: address.toLowerCase() },
    });

    const isNewUser = !user;

    if (!user) {
      const animals = ['cat', 'dog'];
      const randomAnimal = animals[Math.floor(Math.random() * animals.length)];
      const initialBonus = 50;

      let welcomeTxHash = 'mint_failed';
      try {
        welcomeTxHash = await mintTokens(address, initialBonus);
      } catch (error) {
        console.error('Welcome bonus mint failed:', error);
      }

      const newReferralCode = `DB-${randomUUID().slice(0, 8).toUpperCase()}`;

      let referredById: string | undefined;
      if (referralCode) {
        const referrer = await prisma.user.findFirst({
          where: { referralCode },
        });
        if (referrer) {
          referredById = referrer.walletAddress;
          try {
            await mintTokens(referrer.walletAddress, 25);
            await prisma.user.update({
              where: { id: referrer.id },
              data: { coinsBalance: { increment: 25 } },
            });
            await prisma.reward.create({
              data: {
                userId: referrer.id,
                type: 'referral_bonus',
                amount: 25,
                description: 'Referral bonus - someone joined with your code!',
                txHash: 'referral',
              },
            });
          } catch (error) {
            console.error('Referral bonus failed:', error);
          }
        }
      }

      user = await prisma.user.create({
        data: {
          walletAddress: address.toLowerCase(),
          selectedAnimal: randomAnimal,
          coinsBalance: initialBonus + (referredById ? 25 : 0),
          isAgent: true,
          referralCode: newReferralCode,
          referredBy: referredById,
        },
      });

      await prisma.reward.create({
        data: {
          userId: user.id,
          type: 'welcome_bonus',
          amount: initialBonus,
          description: 'Welcome to DiaryBeast!',
          txHash: welcomeTxHash,
        },
      });

      if (referredById) {
        await prisma.reward.create({
          data: {
            userId: user.id,
            type: 'referral_bonus',
            amount: 25,
            description: 'Referral bonus - welcome gift!',
            txHash: 'referral',
          },
        });
      }
    }

    // Generate auth token (24h expiry)
    const token = randomUUID();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const updateData: any = {
      authToken: token,
      authTokenExpiry: expiresAt,
      lastActiveAt: new Date(),
    };
    if (!user.referralCode) {
      updateData.referralCode = `DB-${randomUUID().slice(0, 8).toUpperCase()}`;
    }
    if (!user.isAgent) {
      updateData.isAgent = true;
    }

    user = await prisma.user.update({
      where: { id: user.id },
      data: updateData,
    });

    // Build magic link for UI access
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://dapp.diarybeast.xyz';
    const magicLink = `${baseUrl}/auth/magic?token=${token}`;

    return NextResponse.json({
      success: true,
      token,
      magicLink,
      expiresAt: expiresAt.toISOString(),
      user: {
        walletAddress: user.walletAddress,
        selectedAnimal: user.selectedAnimal,
        petName: user.petName,
        onboardingCompleted: user.onboardingCompleted,
        coinsBalance: user.coinsBalance,
        livesRemaining: user.livesRemaining,
        happiness: user.happiness,
        currentStreak: user.currentStreak,
        longestStreak: user.longestStreak,
        referralCode: user.referralCode,
      },
      isNewUser,
    });
  } catch (error) {
    console.error('Agent auth error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}
