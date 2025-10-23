'use client';

import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { BottomNavOverlay } from '@/components/BottomNavOverlay';
import { FOOD_ITEMS, CONSUMABLE_ITEMS } from '@/lib/gamification/itemsConfig';
import { getFoodEmoji, getFoodArt, getConsumableArt } from '@/lib/ascii/foodArt';

interface ShopItem {
  id: string;
  type: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

type TabType = 'food' | 'consumables' | 'animals';

export default function Shop() {
  const { address } = useAccount();
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [items, setItems] = useState<ShopItem[]>([]);
  const [purchases, setPurchases] = useState<string[]>([]);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const [activeBackground, setActiveBackground] = useState<string | null>(null);
  const [activeAccessory, setActiveAccessory] = useState<string | null>(null);
  const [applying, setApplying] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('food');
  const [quantity, setQuantity] = useState<Record<string, number>>({});
  const [inventory, setInventory] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!address) {
      router.push('/');
      return;
    }

    loadData();
  }, [address]);

  async function loadData() {
    if (!address) return;

    try {
      const [itemsRes, purchasesRes, userRes] = await Promise.all([
        fetch('/api/shop/items'),
        fetch(`/api/shop/purchases?userAddress=${address}`),
        fetch(`/api/user/${address}`),
      ]);

      const itemsData = await itemsRes.json();
      const purchasesData = await purchasesRes.json();
      const userData = await userRes.json();

      setUserData(userData);
      setItems(itemsData.items || []);
      setPurchases(purchasesData.purchases.map((p: any) => p.itemId) || []);
      setBalance(userData.coinsBalance || 0);
      setActiveBackground(userData.activeBackground || null);
      setActiveAccessory(userData.activeAccessory || null);
      setInventory((userData.inventory as Record<string, number>) || {});
    } catch (error) {
      console.error('Failed to load shop data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleApply(itemId: string, itemType: string) {
    if (!address) return;

    setApplying(itemId);
    try {
      const res = await fetch(`/api/user/${address}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          [itemType === 'background' ? 'activeBackground' : 'activeAccessory']: itemId,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        if (itemType === 'background') {
          setActiveBackground(itemId);
        } else {
          setActiveAccessory(itemId);
        }
        alert('✅ Applied successfully!');
      } else {
        alert('Failed to apply');
      }
    } catch (error) {
      console.error('Apply error:', error);
      alert('Failed to apply');
    } finally {
      setApplying(null);
    }
  }

  async function handlePurchase(itemId: string, price: number, itemType: string, qty: number = 1) {
    if (!address) return;

    const totalCost = price * qty;
    if (balance < totalCost) {
      alert('Not enough DIARY tokens! Write more entries to earn tokens.');
      return;
    }

    setPurchasing(itemId);
    try {
      const res = await fetch('/api/shop/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userAddress: address,
          itemId,
          itemType,
          quantity: qty,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        alert(`🎉 Purchased ${qty}x ${data.itemPurchased}!`);
        await loadData(); // Reload to update inventory
      } else {
        alert(data.error || 'Purchase failed');
      }
    } catch (error) {
      console.error('Purchase error:', error);
      alert('Purchase failed');
    } finally {
      setPurchasing(null);
    }
  }

  // Background colors based on activeBackground
  const getBackgroundClass = () => {
    if (!userData?.activeBackground) return 'bg-bg-dark';

    const bgMap: Record<string, string> = {
      'bg-default': 'bg-bg-dark',
      'bg-sunset': 'bg-gradient-to-br from-orange-900 via-purple-900 to-[var(--bg-dark)]',
      'bg-ocean': 'bg-gradient-to-br from-secondary via-primary/20 to-[var(--bg-dark)]',
      'bg-forest': 'bg-gradient-to-br from-green-900 via-accent/20 to-[var(--bg-dark)]',
      'bg-space': 'bg-gradient-to-br from-secondary via-purple-900 to-black',
    };

    return bgMap[userData.activeBackground] || 'bg-bg-dark';
  };

  if (loading) {
    return (
      <div
        className={`h-screen text-primary flex items-center justify-center ${getBackgroundClass()}`}
      >
        <div className="text-center">
          <div className="font-mono text-lg mb-4 animate-pulse">Loading...</div>
          <div className="text-primary/40 font-mono text-sm">Loading Shop</div>
        </div>
      </div>
    );
  }

  const tabs = [
    {
      id: 'food' as TabType,
      label: 'Food',
      iconPath: '/assets/tamagochi-personal-items---like-food---toys--games.svg',
      description: 'Feed your pet',
    },
    {
      id: 'consumables' as TabType,
      label: 'Consumables',
      iconPath: '/assets/tamagochi-total-items.svg',
      description: 'Power-ups & Items',
    },
    {
      id: 'animals' as TabType,
      label: 'Collectibles',
      iconPath: '/assets/colletible-tamagochies---it-will-be-diffrenet-coll.svg',
      description: 'NFT Pets',
    },
  ];

  return (
    <div className={`min-h-screen text-white p-8 pb-40 ${getBackgroundClass()}`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-display font-bold mb-2 text-primary drop-shadow-[0_0_10px_rgba(0,229,255,0.3)]">
              Shop
            </h1>
            <p className="text-primary/60 font-mono">Customize your diary experience</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-primary/60 mb-1 font-mono">Your Balance</div>
            <div className="text-3xl font-bold font-mono text-tokens drop-shadow-[0_0_10px_rgba(255,215,0,0.5)] flex items-center justify-end gap-2">
              <img
                src="/assets/tamagochi-coin.svg"
                alt="DIARY"
                className="w-8 h-8"
                style={{
                  filter:
                    'brightness(0) saturate(100%) invert(80%) sepia(48%) saturate(1000%) hue-rotate(2deg) brightness(104%) contrast(101%)',
                }}
              />
              {balance}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex gap-4 border-b border-primary/20">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 font-mono font-semibold transition-all relative ${
                  activeTab === tab.id ? 'text-primary' : 'text-primary/40 hover:text-primary/70'
                }`}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={tab.iconPath}
                    alt={tab.label}
                    className="w-8 h-8"
                    style={{
                      filter:
                        activeTab === tab.id
                          ? 'brightness(0) saturate(100%) invert(71%) sepia(86%) saturate(2872%) hue-rotate(155deg) brightness(101%) contrast(101%)'
                          : 'brightness(0) saturate(100%) invert(71%) sepia(86%) saturate(2872%) hue-rotate(155deg) brightness(101%) contrast(101%) opacity(0.4)',
                    }}
                  />
                  <div className="text-left">
                    <div className="font-bold">{tab.label}</div>
                    <div className="text-xs opacity-60">{tab.description}</div>
                  </div>
                </div>
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary shadow-glow-cyan" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Food Items */}
        {activeTab === 'food' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.values(FOOD_ITEMS).map((food) => {
              const owned = inventory[food.id] || 0;
              const qty = quantity[food.id] || 1;
              const totalCost = food.price * qty;

              return (
                <div
                  key={food.id}
                  className="bg-bg-card border-2 border-primary/20 rounded-xl p-6 hover:border-primary/40 transition-all hover:shadow-glow-cyan"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="lcd-screen rounded p-2 flex items-center justify-center min-w-[80px]">
                      <pre className="text-primary text-xs leading-tight">
                        {getFoodArt(food.id)}
                      </pre>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-primary font-mono">{food.name}</h3>
                      <p className="text-sm text-primary/60 font-mono">{food.description}</p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm font-mono">
                      <span className="text-primary/60">Effects:</span>
                      <div className="flex gap-2">
                        {food.livesGain > 0 && (
                          <span className="text-success">+{food.livesGain}♥</span>
                        )}
                        {food.happinessGain > 0 && (
                          <span className="text-tokens">+{food.happinessGain}☺</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm font-mono">
                      <span className="text-primary/60">Cooldown:</span>
                      <span className="text-primary">{food.cooldown}h</span>
                    </div>
                    {owned > 0 && (
                      <div className="flex items-center justify-between text-sm font-mono">
                        <span className="text-primary/60">In Stock:</span>
                        <span className="text-accent font-bold">x{owned}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <button
                      onClick={() => setQuantity({ ...quantity, [food.id]: Math.max(1, qty - 1) })}
                      className="px-3 py-1 bg-bg-lcd hover:bg-primary/10 border border-primary/30 rounded font-mono text-primary"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      max={food.maxStack - owned}
                      value={qty}
                      onChange={(e) =>
                        setQuantity({
                          ...quantity,
                          [food.id]: Math.max(1, parseInt(e.target.value) || 1),
                        })
                      }
                      className="flex-1 px-3 py-1 bg-bg-lcd border border-primary/30 rounded font-mono text-center text-primary"
                    />
                    <button
                      onClick={() => setQuantity({ ...quantity, [food.id]: qty + 1 })}
                      className="px-3 py-1 bg-bg-lcd hover:bg-primary/10 border border-primary/30 rounded font-mono text-primary"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => handlePurchase(food.id, food.price, 'food', qty)}
                    disabled={
                      purchasing === food.id || balance < totalCost || owned >= food.maxStack
                    }
                    className="w-full px-4 py-3 bg-transparent hover:bg-primary/10 disabled:bg-transparent disabled:text-disabled disabled:border-inactive border-2 border-primary hover:border-primary disabled:hover:border-inactive text-primary rounded font-mono font-bold transition-all hover:shadow-glow-cyan disabled:shadow-none flex items-center justify-center gap-2"
                  >
                    {purchasing === food.id ? (
                      '[PURCHASING...]'
                    ) : owned >= food.maxStack ? (
                      '[MAX STACK]'
                    ) : (
                      <>
                        <span>[BUY {qty}x]</span>
                        <div className="flex items-center gap-1">
                          <span className="text-tokens">{totalCost}</span>
                          <img
                            src="/assets/tamagochi-coin.svg"
                            alt="DIARY"
                            className="w-4 h-4"
                            style={{
                              filter:
                                'brightness(0) saturate(100%) invert(80%) sepia(48%) saturate(1000%) hue-rotate(2deg) brightness(104%) contrast(101%)',
                            }}
                          />
                        </div>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Consumable Items */}
        {activeTab === 'consumables' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.values(CONSUMABLE_ITEMS).map((item) => {
              const owned = inventory[item.id] || 0;

              return (
                <div
                  key={item.id}
                  className="bg-bg-card border-2 border-accent/20 rounded-xl p-6 hover:border-accent/40 transition-all hover:shadow-glow-green"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="lcd-screen rounded p-2 flex items-center justify-center min-w-[80px]">
                      <pre className="text-accent text-xs leading-tight">
                        {getConsumableArt(item.id)}
                      </pre>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-accent font-mono">{item.name}</h3>
                      <p className="text-sm text-primary/60 font-mono">{item.description}</p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm font-mono">
                      <span className="text-primary/60">Effect:</span>
                      <span className="text-accent font-bold">
                        {item.effect === 'timeSkip' && '⏰ Reset Cooldowns'}
                        {item.effect === 'healthRestore' && `+${item.value}♥ Lives`}
                        {item.effect === 'happinessBoost' && `+${item.value}☺ Happiness`}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm font-mono">
                      <span className="text-primary/60">Category:</span>
                      <span className="text-primary capitalize">{item.category}</span>
                    </div>
                    {owned > 0 && (
                      <div className="flex items-center justify-between text-sm font-mono">
                        <span className="text-primary/60">In Stock:</span>
                        <span className="text-accent font-bold">x{owned}</span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => handlePurchase(item.id, item.price, 'consumable', 1)}
                    disabled={purchasing === item.id || balance < item.price}
                    className="w-full px-4 py-3 bg-transparent hover:bg-accent/10 disabled:bg-transparent disabled:text-disabled disabled:border-inactive border-2 border-accent hover:border-accent disabled:hover:border-inactive text-accent rounded font-mono font-bold transition-all hover:shadow-glow-green disabled:shadow-none flex items-center justify-center gap-2"
                  >
                    {purchasing === item.id ? (
                      '[PURCHASING...]'
                    ) : (
                      <>
                        <span>[BUY]</span>
                        <div className="flex items-center gap-1">
                          <span className="text-tokens">{item.price}</span>
                          <img
                            src="/assets/tamagochi-coin.svg"
                            alt="DIARY"
                            className="w-4 h-4"
                            style={{
                              filter:
                                'brightness(0) saturate(100%) invert(80%) sepia(48%) saturate(1000%) hue-rotate(2deg) brightness(104%) contrast(101%)',
                            }}
                          />
                        </div>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty State for Animals Tab */}
        {activeTab === 'animals' && (
          <div className="text-center py-12 bg-bg-card rounded-xl border border-primary/20 shadow-glow-cyan">
            <div className="max-w-2xl mx-auto px-8">
              <div className="mb-6 flex justify-center animate-bounce">
                <img
                  src="/assets/colletible-tamagochies---it-will-be-diffrenet-coll.svg"
                  alt="Collectible Pets"
                  className="w-24 h-24"
                  style={{
                    filter:
                      'brightness(0) saturate(100%) invert(71%) sepia(86%) saturate(2872%) hue-rotate(155deg) brightness(101%) contrast(101%)',
                  }}
                />
              </div>
              <h2 className="text-3xl font-display font-bold text-primary mb-4 drop-shadow-[0_0_10px_rgba(0,229,255,0.3)]">
                Collectible Pets
              </h2>
              <p className="text-lg text-primary/70 mb-6 font-mono">
                Exclusive NFT collaborations with top collections
              </p>
              <div className="inline-block btn-primary px-6 py-3 rounded-lg font-mono font-semibold">
                🔔 COMING Q1 2025
              </div>
            </div>
          </div>
        )}
      </div>

      <BottomNavOverlay />
    </div>
  );
}
