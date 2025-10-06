import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { burnTokens } from '@/lib/blockchain';

export async function POST(req: NextRequest) {
  try {
    const { userAddress, itemId } = await req.json();

    if (!userAddress || !itemId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { walletAddress: userAddress.toLowerCase() },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Find item
    const item = await prisma.shopItem.findUnique({ where: { id: itemId } });

    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    // Check balance
    if (user.coinsBalance < item.price) {
      return NextResponse.json(
        { error: 'Insufficient balance' },
        { status: 400 }
      );
    }

    // Check if already owned
    const existing = await prisma.purchase.findFirst({
      where: { userId: user.id, itemId },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Already owned' },
        { status: 409 }
      );
    }

    // Burn tokens (if item costs something)
    let txHash = null;
    if (item.price > 0) {
      try {
        txHash = await burnTokens(userAddress, item.price);
      } catch (error) {
        console.error('Token burn failed:', error);
        // Still continue with purchase
        txHash = 'burn_failed';
      }
    }

    // Create purchase record
    await prisma.purchase.create({
      data: {
        userId: user.id,
        itemType: item.type,
        itemId: item.id,
        price: item.price,
        txHash,
      },
    });

    // Update user balance
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { coinsBalance: { decrement: item.price } },
    });

    return NextResponse.json({
      success: true,
      updatedBalance: updatedUser.coinsBalance,
      txHash,
    });
  } catch (error) {
    console.error('Purchase error:', error);
    return NextResponse.json(
      { error: 'Purchase failed' },
      { status: 500 }
    );
  }
}
