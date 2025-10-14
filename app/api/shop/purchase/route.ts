import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { burnTokens } from '@/lib/blockchain';
import { getConsumableItem, getFoodItem } from '@/lib/gamification/itemsConfig';

export async function POST(req: NextRequest) {
  try {
    const { userAddress, itemId, itemType, quantity = 1 } = await req.json();

    if (!userAddress || !itemId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { walletAddress: userAddress.toLowerCase() },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Handle food items
    if (itemType === 'food') {
      const food = getFoodItem(itemId);
      if (!food) {
        return NextResponse.json({ error: 'Food item not found' }, { status: 404 });
      }

      const totalCost = food.price * quantity;

      // Check balance
      if (user.coinsBalance < totalCost) {
        return NextResponse.json(
          { error: `Not enough DIARY. Need ${totalCost}, have ${user.coinsBalance}` },
          { status: 400 }
        );
      }

      // Check max stack
      const inventory = (user.inventory as Record<string, number>) || {};
      const currentCount = inventory[itemId] || 0;
      if (currentCount + quantity > food.maxStack) {
        return NextResponse.json(
          { error: `Cannot exceed max stack of ${food.maxStack}` },
          { status: 400 }
        );
      }

      // Burn tokens
      let txHash = null;
      try {
        txHash = await burnTokens(userAddress, totalCost);
      } catch (error) {
        console.error('Token burn failed:', error);
        txHash = 'burn_failed';
      }

      // Add to inventory
      const newInventory = { ...inventory, [itemId]: currentCount + quantity };

      // Update user
      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: {
          coinsBalance: { decrement: totalCost },
          inventory: newInventory,
        },
      });

      return NextResponse.json({
        success: true,
        updatedBalance: updatedUser.coinsBalance,
        inventory: updatedUser.inventory,
        itemPurchased: food.name,
        quantity,
        txHash,
      });
    }

    // Handle consumable items (not in ShopItem table)
    if (itemType === 'consumable') {
      const consumable = getConsumableItem(itemId);
      if (!consumable) {
        return NextResponse.json({ error: 'Item not found' }, { status: 404 });
      }

      // Check balance
      if (user.coinsBalance < consumable.price) {
        return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 });
      }

      // Burn tokens
      let txHash = null;
      try {
        txHash = await burnTokens(userAddress, consumable.price);
      } catch (error) {
        console.error('Token burn failed:', error);
        txHash = 'burn_failed';
      }

      // Add to inventory
      const inventory = (user.inventory as Record<string, number>) || {};
      const currentCount = inventory[itemId] || 0;
      const newInventory = { ...inventory, [itemId]: currentCount + 1 };

      // Update user
      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: {
          coinsBalance: { decrement: consumable.price },
          inventory: newInventory,
        },
      });

      return NextResponse.json({
        success: true,
        updatedBalance: updatedUser.coinsBalance,
        inventory: updatedUser.inventory,
        itemPurchased: consumable.name,
        txHash,
      });
    }

    // Handle regular shop items (backgrounds, accessories)
    const item = await prisma.shopItem.findUnique({ where: { id: itemId } });

    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    // Check balance
    if (user.coinsBalance < item.price) {
      return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 });
    }

    // Check if already owned
    const existing = await prisma.purchase.findFirst({
      where: { userId: user.id, itemId },
    });

    if (existing) {
      return NextResponse.json({ error: 'Already owned' }, { status: 409 });
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
    return NextResponse.json({ error: 'Purchase failed' }, { status: 500 });
  }
}
