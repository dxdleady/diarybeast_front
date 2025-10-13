'use client';

import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { BottomNavOverlay } from '@/components/BottomNavOverlay';

interface ShopItem {
  id: string;
  type: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

type TabType = 'persona' | 'pet' | 'animals';

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
  const [activeTab, setActiveTab] = useState<TabType>('persona');

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

  async function handlePurchase(itemId: string, price: number) {
    if (!address) return;

    if (balance < price) {
      alert('Not enough DIARY tokens! Write more entries to earn tokens.');
      return;
    }

    setPurchasing(itemId);
    try {
      const res = await fetch('/api/shop/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userAddress: address, itemId }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        alert('🎉 Purchase successful!');
        setPurchases([...purchases, itemId]);
        setBalance(data.updatedBalance);
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

  // Filter items by tab
  const filteredItems = items.filter((item) => {
    if (activeTab === 'persona') {
      return item.type === 'background';
    } else if (activeTab === 'pet') {
      return item.type === 'accessory';
    } else if (activeTab === 'animals') {
      return item.type === 'animal';
    }
    return false;
  });

  const tabs = [
    {
      id: 'persona' as TabType,
      label: 'Persona Items',
      iconPath: '/assets/tamagochi-personal-items---like-food---toys--games.svg',
      description: 'Backgrounds & Themes',
    },
    {
      id: 'pet' as TabType,
      label: 'Pet Accessories',
      iconPath: '/assets/tamagochi-pet-accessorizes.svg',
      description: 'Coming Soon',
    },
    {
      id: 'animals' as TabType,
      label: 'Collectible Pets',
      iconPath: '/assets/colletible-tamagochies---it-will-be-diffrenet-coll.svg',
      description: 'NFT Collabs',
    },
  ];

  return (
    <div className={`min-h-screen text-white p-8 ${getBackgroundClass()}`}>
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
                className={`px-6 py-4 font-semibold transition-all relative ${
                  activeTab === tab.id ? 'text-primary' : 'text-primary/40 hover:text-primary/70'
                }`}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={tab.iconPath}
                    alt={tab.label}
                    className="w-12 h-12"
                    style={{
                      filter:
                        activeTab === tab.id
                          ? 'brightness(0) saturate(100%) invert(71%) sepia(86%) saturate(2872%) hue-rotate(155deg) brightness(101%) contrast(101%)'
                          : 'brightness(0) saturate(100%) invert(71%) sepia(86%) saturate(2872%) hue-rotate(155deg) brightness(101%) contrast(101%) opacity(0.4)',
                    }}
                  />
                  <div className="text-left">
                    <div className="font-display font-bold">{tab.label}</div>
                    <div className="text-xs text-primary/50 font-mono">{tab.description}</div>
                  </div>
                </div>
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t shadow-glow-cyan"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {filteredItems.map((item) => {
            const owned = purchases.includes(item.id);
            const canAfford = balance >= item.price;
            const isPurchasing = purchasing === item.id;
            const isActive =
              (item.type === 'background' && activeBackground === item.id) ||
              (item.type === 'accessory' && activeAccessory === item.id);
            const isApplying = applying === item.id;

            return (
              <div
                key={item.id}
                className={`bg-bg-card rounded-xl overflow-hidden border-2 ${
                  isActive
                    ? 'border-primary shadow-glow-cyan'
                    : owned
                      ? 'border-success'
                      : 'border-primary/20'
                } transition-transform hover:scale-105`}
              >
                {/* Image */}
                <div className="h-32 lcd-screen flex items-center justify-center relative">
                  {item.type === 'background' ? (
                    <img
                      src="/assets/tamagochi-personal-items---like-food---toys--games.svg"
                      alt="Background"
                      className="w-14 h-14"
                      style={{
                        filter:
                          'brightness(0) saturate(100%) invert(71%) sepia(86%) saturate(2872%) hue-rotate(155deg) brightness(101%) contrast(101%)',
                      }}
                    />
                  ) : item.type === 'animal' ? (
                    <img
                      src="/assets/colletible-tamagochies---it-will-be-diffrenet-coll.svg"
                      alt="Animal"
                      className="w-14 h-14"
                      style={{
                        filter:
                          'brightness(0) saturate(100%) invert(71%) sepia(86%) saturate(2872%) hue-rotate(155deg) brightness(101%) contrast(101%)',
                      }}
                    />
                  ) : (
                    <img
                      src="/assets/tamagochi-pet-accessorizes.svg"
                      alt="Accessory"
                      className="w-14 h-14"
                      style={{
                        filter:
                          'brightness(0) saturate(100%) invert(71%) sepia(86%) saturate(2872%) hue-rotate(155deg) brightness(101%) contrast(101%)',
                      }}
                    />
                  )}
                  {isActive ? (
                    <div className="absolute top-1 right-1 bg-primary text-bg-dark px-2 py-0.5 rounded-full text-xs font-mono font-bold animate-pulse">
                      ★
                    </div>
                  ) : owned ? (
                    <div className="absolute top-1 right-1 bg-success text-bg-dark px-2 py-0.5 rounded-full text-xs font-mono font-bold">
                      ✓
                    </div>
                  ) : null}
                </div>

                {/* Details */}
                <div className="p-3">
                  <div className="text-xs text-primary/50 uppercase mb-1 font-mono">
                    {item.type}
                  </div>
                  <h3 className="text-base font-display font-bold mb-1 text-primary line-clamp-1">
                    {item.name}
                  </h3>
                  <p className="text-xs text-primary/60 mb-3 font-mono line-clamp-2">
                    {item.description}
                  </p>

                  {/* Price & Action */}
                  <div className="space-y-2">
                    <div className="text-center">
                      {item.price === 0 ? (
                        <span className="text-success text-sm font-bold font-mono">FREE</span>
                      ) : (
                        <div className="text-tokens drop-shadow-[0_0_6px_rgba(255,215,0,0.5)] flex items-center justify-center gap-1">
                          <img
                            src="/assets/tamagochi-coin.svg"
                            alt="DIARY"
                            className="w-4 h-4"
                            style={{
                              filter:
                                'brightness(0) saturate(100%) invert(80%) sepia(48%) saturate(1000%) hue-rotate(2deg) brightness(104%) contrast(101%)',
                            }}
                          />
                          <span className="text-lg font-bold font-mono">{item.price}</span>
                        </div>
                      )}
                    </div>

                    {isActive ? (
                      <button
                        disabled
                        className="w-full px-3 py-1.5 bg-primary/20 border border-primary rounded text-xs cursor-not-allowed font-mono text-primary"
                      >
                        [ACTIVE]
                      </button>
                    ) : owned ? (
                      <button
                        onClick={() => handleApply(item.id, item.type)}
                        disabled={isApplying}
                        className="w-full px-3 py-1.5 bg-transparent hover:bg-success/10 border border-success hover:border-success rounded text-xs font-mono font-semibold transition-all text-success hover:shadow-glow-green"
                      >
                        {isApplying ? '[...]' : '[APPLY]'}
                      </button>
                    ) : (
                      <button
                        onClick={() => handlePurchase(item.id, item.price)}
                        disabled={!canAfford || isPurchasing || item.price === 0}
                        className={`w-full px-3 py-1.5 rounded text-xs font-mono font-semibold transition-all ${
                          canAfford
                            ? 'bg-transparent hover:bg-primary/10 border border-primary/40 hover:border-primary text-primary hover:shadow-glow-cyan'
                            : 'bg-transparent border border-inactive text-disabled cursor-not-allowed'
                        }`}
                      >
                        {isPurchasing
                          ? '[...]'
                          : item.price === 0
                            ? '[DEF]'
                            : canAfford
                              ? '[BUY]'
                              : '[NO]'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12 bg-bg-card rounded-xl border border-primary/20 shadow-glow-cyan">
            {activeTab === 'animals' ? (
              // NFT Collectible Pets Coming Soon
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

                <div className="bg-bg-lcd/50 rounded-xl p-6 mb-6 border border-primary/20">
                  <div className="text-sm text-primary/60 mb-4 font-mono font-bold">
                    What&apos;s Coming:
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 text-primary">
                      <span className="text-2xl">🎨</span>
                      <div className="flex-1 text-left">
                        <div className="font-display font-semibold">Your NFT Collection</div>
                        <div className="text-xs text-primary/50 font-mono">
                          Use your owned NFTs as diary companions
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 text-primary">
                      <span className="text-2xl">🏆</span>
                      <div className="flex-1 text-left">
                        <div className="font-display font-semibold">Blue-Chip Collections</div>
                        <div className="text-xs text-primary/50 font-mono">
                          Partnerships with top-tier NFT projects
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 text-primary">
                      <span className="text-2xl">✨</span>
                      <div className="flex-1 text-left">
                        <div className="font-display font-semibold">Exclusive Variants</div>
                        <div className="text-xs text-primary/50 font-mono">
                          Special edition pets for collectors
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-sm text-primary/50 mb-4 font-mono">
                  Connect your wallet to bring your NFT collection to life!
                </div>

                <div className="inline-block btn-primary px-6 py-3 rounded-lg font-mono font-semibold">
                  🔔 COMING Q1 2025
                </div>
              </div>
            ) : activeTab === 'pet' ? (
              // Pet Accessories Coming Soon
              <div className="max-w-xl mx-auto px-8">
                <div className="mb-4 flex justify-center">
                  <img
                    src="/assets/tamagochi-pet-accessorizes.svg"
                    alt="Pet Accessories"
                    className="w-20 h-20"
                    style={{
                      filter:
                        'brightness(0) saturate(100%) invert(71%) sepia(86%) saturate(2872%) hue-rotate(155deg) brightness(101%) contrast(101%)',
                    }}
                  />
                </div>
                <h2 className="text-2xl font-display font-bold text-primary mb-3 drop-shadow-[0_0_10px_rgba(0,229,255,0.3)]">
                  Pet Accessories
                </h2>
                <p className="text-primary/70 mb-4 font-mono">
                  Dress up your pet with exclusive accessories
                </p>
                <div className="text-sm text-primary/50 font-mono">
                  Hats, Glasses, Outfits & More
                </div>
                <div className="mt-6 inline-block btn-primary px-6 py-2 rounded-lg font-mono font-semibold text-sm">
                  [COMING SOON]
                </div>
              </div>
            ) : (
              // Default Empty State
              <div>
                <div className="mb-4 flex justify-center">
                  <img
                    src={tabs.find((t) => t.id === activeTab)?.iconPath || ''}
                    alt="Category"
                    className="w-20 h-20"
                    style={{
                      filter:
                        'brightness(0) saturate(100%) invert(71%) sepia(86%) saturate(2872%) hue-rotate(155deg) brightness(101%) contrast(101%)',
                    }}
                  />
                </div>
                <p className="text-xl font-display font-semibold mb-2 text-primary">
                  No items in this category yet
                </p>
                <p className="text-sm text-primary/60 font-mono">
                  Check back soon for new{' '}
                  {tabs.find((t) => t.id === activeTab)?.label.toLowerCase()}!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
