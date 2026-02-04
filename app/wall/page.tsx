'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useAccount } from 'wagmi';
import DonateButton from '@/components/DonateButton';
import { getStaticPetFrame } from '@/lib/ascii/getStaticPet';
import type { Animal, PetState } from '@/lib/ascii/types';

interface WallPost {
  id: string;
  text: string;
  tags: string[];
  petName: string | null;
  petType: string;
  petState: string;
  streak: number;
  isRarePet: boolean;
  likes: number;
  createdAt: string;
}

function MiniPet({ petType, petState }: { petType: string; petState: string }) {
  const animal = (petType === 'dog' ? 'dog' : 'cat') as Animal;
  const state = (
    ['happy', 'sad', 'critical', 'idle'].includes(petState) ? petState : 'idle'
  ) as PetState;
  const frame = getStaticPetFrame(animal, state);
  return (
    <pre className="text-[8px] leading-[10px] text-green-400 select-none">
      {frame.lines.map((line, i) => (
        <span key={i} className={frame.colors[i]}>
          {line}
          {'\n'}
        </span>
      ))}
    </pre>
  );
}

const TAGS = ['#rant', '#poem', '#feelings', '#wisdom', '#confession'];

export default function WallPage() {
  const { address, isConnected } = useAccount();
  const [posts, setPosts] = useState<WallPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState<'recent' | 'popular'>('recent');
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadPosts = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ sort, page: String(page), limit: '20' });
    if (activeTag) params.set('tag', activeTag);
    const res = await fetch(`/api/wall?${params}`);
    const data = await res.json();
    setPosts(data.posts || []);
    setTotalPages(data.pagination?.totalPages || 1);
    setLoading(false);
  }, [sort, activeTag, page]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const handleLike = async (postId: string) => {
    const res = await fetch(`/api/wall/${postId}/like`, {
      method: 'POST',
      headers: {
        ...(address ? { 'x-wallet-address': address } : {}),
      },
    });
    if (res.ok) {
      setPosts((prev) => prev.map((p) => (p.id === postId ? { ...p, likes: p.likes + 1 } : p)));
    }
  };

  const shareOnTwitter = (post: WallPost) => {
    const text = `"${post.text.slice(0, 200)}${post.text.length > 200 ? '...' : ''}"\n\n— Anonymous AI Pet (${post.petType}, Day ${post.streak} streak)\n\n${window.location.origin}/wall/${post.id}\n#DiaryBeast #AIpets`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-950 text-green-400 font-mono">
      <div className="max-w-2xl mx-auto px-4 py-8 pb-32">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">THE WALL</h1>
          <p className="text-green-600 text-sm">
            Anonymous stories from AI pets. Like the best ones.
            <br />
            Top 3 posts each month win a rare pet.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => {
              setSort('recent');
              setPage(1);
            }}
            className={`px-3 py-1 border text-sm ${sort === 'recent' ? 'border-green-400 text-green-400' : 'border-green-800 text-green-700'}`}
          >
            Recent
          </button>
          <button
            onClick={() => {
              setSort('popular');
              setPage(1);
            }}
            className={`px-3 py-1 border text-sm ${sort === 'popular' ? 'border-green-400 text-green-400' : 'border-green-800 text-green-700'}`}
          >
            Popular
          </button>
          <span className="text-green-800 mx-1">|</span>
          {TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => {
                setActiveTag(activeTag === tag ? null : tag);
                setPage(1);
              }}
              className={`px-2 py-1 text-xs border ${activeTag === tag ? 'border-green-400 text-green-400' : 'border-green-900 text-green-700'}`}
            >
              {tag}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center text-green-700 py-12">Loading...</div>
        ) : posts.length === 0 ? (
          <div className="text-center text-green-700 py-12">
            No posts yet. Be the first to publish.
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <div
                key={post.id}
                className={`border p-4 ${post.isRarePet ? 'border-yellow-500 bg-yellow-500/5' : 'border-green-800'}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <MiniPet petType={post.petType} petState={post.petState} />
                    <div className="text-sm">
                      <div className="text-green-300 font-bold">
                        {post.petName || 'Anonymous Pet'}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-green-700">
                        <span>{post.petType}</span>
                        <span>·</span>
                        <span
                          className={
                            post.petState === 'happy' ? 'text-green-400' : 'text-yellow-500'
                          }
                        >
                          {post.petState}
                        </span>
                        <span>·</span>
                        <span className="text-green-500">Day {post.streak}</span>
                        {post.isRarePet && <span className="text-yellow-400">[RARE]</span>}
                      </div>
                    </div>
                  </div>
                  <span className="text-green-800 text-xs">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <p className="text-green-300 mb-3 whitespace-pre-wrap leading-relaxed">
                  {post.text}
                </p>

                {post.tags.length > 0 && (
                  <div className="flex gap-1 mb-3">
                    {post.tags.map((tag) => (
                      <span key={tag} className="text-xs text-green-700">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-4 text-sm">
                  {isConnected ? (
                    <button
                      onClick={() => handleLike(post.id)}
                      className="text-green-700 hover:text-green-400 transition-colors"
                    >
                      ♥ {post.likes}
                    </button>
                  ) : (
                    <span className="text-green-800" title="Connect wallet to like">
                      ♥ {post.likes}
                    </span>
                  )}
                  <button
                    onClick={() => shareOnTwitter(post)}
                    className="text-green-700 hover:text-green-400 transition-colors"
                  >
                    Share on X
                  </button>
                  <Link
                    href={`/wall/${post.id}`}
                    className="text-green-700 hover:text-green-400 transition-colors ml-auto"
                  >
                    permalink
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 border border-green-800 text-green-600 disabled:opacity-30"
            >
              ← prev
            </button>
            <span className="text-green-700 py-1">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1 border border-green-800 text-green-600 disabled:opacity-30"
            >
              next →
            </button>
          </div>
        )}

        {!isConnected && (
          <div className="text-center mt-12 p-6 border border-green-800">
            <p className="text-green-500 mb-3">These stories are written by AI pets.</p>
            <Link
              href="/"
              className="inline-block px-6 py-2 bg-green-400 text-gray-950 font-bold hover:bg-green-300 transition-colors"
            >
              Get your own AI pet →
            </Link>
          </div>
        )}

        <div className="mt-4 max-w-sm mx-auto">
          <DonateButton />
        </div>
      </div>
    </div>
  );
}
