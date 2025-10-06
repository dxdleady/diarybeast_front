'use client';

import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';

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
    if (!userData?.activeBackground) return 'bg-gray-900';

    const bgMap: Record<string, string> = {
      'bg-default': 'bg-gray-900',
      'bg-sunset': 'bg-gradient-to-br from-orange-900 via-purple-900 to-gray-900',
      'bg-ocean': 'bg-gradient-to-br from-blue-900 via-cyan-900 to-gray-900',
      'bg-forest': 'bg-gradient-to-br from-green-900 via-emerald-900 to-gray-900',
      'bg-space': 'bg-gradient-to-br from-indigo-900 via-purple-900 to-black',
    };

    return bgMap[userData.activeBackground] || 'bg-gray-900';
  };

  if (loading) {
    return (
      <div className={`h-screen text-white flex items-center justify-center ${getBackgroundClass()}`}>
        <div>Loading shop...</div>
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
    { id: 'persona' as TabType, label: 'Persona Items', icon: '🎨', description: 'Backgrounds & Themes' },
    { id: 'pet' as TabType, label: 'Pet Accessories', icon: '✨', description: 'Coming Soon' },
    { id: 'animals' as TabType, label: 'Collectible Pets', icon: '🐾', description: 'NFT Collabs' },
  ];

  return (
    <div className={`min-h-screen text-white p-8 ${getBackgroundClass()}`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Shop</h1>
            <p className="text-gray-400">Customize your diary experience</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-400 mb-1">Your Balance</div>
            <div className="text-3xl font-bold">💎 {balance} DIARY</div>
            <button
              onClick={() => router.push('/diary')}
              className="mt-2 text-sm text-blue-400 hover:text-blue-300"
            >
              ← Back to Diary
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex gap-4 border-b border-gray-700">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 font-semibold transition-colors relative ${
                  activeTab === tab.id
                    ? 'text-white'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{tab.icon}</span>
                  <div className="text-left">
                    <div className="font-bold">{tab.label}</div>
                    <div className="text-xs text-gray-500">{tab.description}</div>
                  </div>
                </div>
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500 rounded-t"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                className={`bg-gray-800 rounded-xl overflow-hidden border-2 ${
                  isActive
                    ? 'border-blue-500 shadow-lg shadow-blue-500/50'
                    : owned
                    ? 'border-green-500'
                    : 'border-gray-700'
                } transition-transform hover:scale-105`}
              >
                {/* Image */}
                <div className="h-48 bg-gray-700 flex items-center justify-center relative">
                  {item.type === 'background' ? (
                    <div className="text-6xl">🎨</div>
                  ) : item.type === 'animal' ? (
                    <div className="text-6xl">🐾</div>
                  ) : (
                    <div className="text-6xl">✨</div>
                  )}
                  {isActive ? (
                    <div className="absolute top-2 right-2 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse">
                      ★ Active
                    </div>
                  ) : owned ? (
                    <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      ✓ Owned
                    </div>
                  ) : null}
                </div>

                {/* Details */}
                <div className="p-4">
                  <div className="text-xs text-gray-400 uppercase mb-1">
                    {item.type}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{item.name}</h3>
                  <p className="text-sm text-gray-400 mb-4">
                    {item.description}
                  </p>

                  {/* Price & Action */}
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold">
                      {item.price === 0 ? (
                        <span className="text-green-400">FREE</span>
                      ) : (
                        <span>💎 {item.price}</span>
                      )}
                    </div>

                    {isActive ? (
                      <button
                        disabled
                        className="px-6 py-2 bg-blue-600 rounded-lg cursor-not-allowed"
                      >
                        Active
                      </button>
                    ) : owned ? (
                      <button
                        onClick={() => handleApply(item.id, item.type)}
                        disabled={isApplying}
                        className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition-colors"
                      >
                        {isApplying ? 'Applying...' : 'Apply'}
                      </button>
                    ) : (
                      <button
                        onClick={() => handlePurchase(item.id, item.price)}
                        disabled={!canAfford || isPurchasing || item.price === 0}
                        className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                          canAfford
                            ? 'bg-blue-600 hover:bg-blue-700'
                            : 'bg-gray-600 cursor-not-allowed opacity-50'
                        }`}
                      >
                        {isPurchasing
                          ? 'Buying...'
                          : item.price === 0
                          ? 'Default'
                          : canAfford
                          ? 'Buy'
                          : 'Not enough'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center text-gray-400 py-12 bg-gradient-to-br from-gray-800 via-purple-900/20 to-gray-800 rounded-xl border border-purple-700/50">
            {activeTab === 'animals' ? (
              // NFT Collectible Pets Coming Soon
              <div className="max-w-2xl mx-auto px-8">
                <div className="text-7xl mb-6 animate-bounce">🐾</div>
                <h2 className="text-3xl font-bold text-white mb-4">Collectible Pets</h2>
                <p className="text-lg text-gray-300 mb-6">
                  Exclusive NFT collaborations with top collections
                </p>

                <div className="bg-black/30 rounded-xl p-6 mb-6">
                  <div className="text-sm text-gray-400 mb-4">What&apos;s Coming:</div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 text-white">
                      <span className="text-2xl">🎨</span>
                      <div className="flex-1 text-left">
                        <div className="font-semibold">Your NFT Collection</div>
                        <div className="text-xs text-gray-400">Use your owned NFTs as diary companions</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 text-white">
                      <span className="text-2xl">🏆</span>
                      <div className="flex-1 text-left">
                        <div className="font-semibold">Blue-Chip Collections</div>
                        <div className="text-xs text-gray-400">Partnerships with top-tier NFT projects</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 text-white">
                      <span className="text-2xl">✨</span>
                      <div className="flex-1 text-left">
                        <div className="font-semibold">Exclusive Variants</div>
                        <div className="text-xs text-gray-400">Special edition pets for collectors</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-sm text-gray-500 mb-4">
                  Connect your wallet to bring your NFT collection to life!
                </div>

                <div className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold">
                  🔔 Coming in Q1 2025
                </div>
              </div>
            ) : activeTab === 'pet' ? (
              // Pet Accessories Coming Soon
              <div className="max-w-xl mx-auto px-8">
                <div className="text-6xl mb-4">✨</div>
                <h2 className="text-2xl font-bold text-white mb-3">Pet Accessories</h2>
                <p className="text-gray-300 mb-4">
                  Dress up your pet with exclusive accessories
                </p>
                <div className="text-sm text-gray-500">
                  Hats, Glasses, Outfits & More
                </div>
                <div className="mt-6 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold text-sm">
                  Coming Soon
                </div>
              </div>
            ) : (
              // Default Empty State
              <div>
                <div className="text-6xl mb-4">{tabs.find(t => t.id === activeTab)?.icon}</div>
                <p className="text-xl font-semibold mb-2">No items in this category yet</p>
                <p className="text-sm">Check back soon for new {tabs.find(t => t.id === activeTab)?.label.toLowerCase()}!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
