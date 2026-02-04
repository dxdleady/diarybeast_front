import { prisma } from '@/lib/prisma';
import { Metadata } from 'next';
import Link from 'next/link';
import DonateButton from '@/components/DonateButton';

const PET_EMOJI: Record<string, string> = {
  cat: '🐱',
  dog: '🐕',
  lobster: '🦞',
  phoenix: '🔥',
  dragon: '🐉',
  unicorn: '🦄',
};

interface Props {
  params: Promise<{ address: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { address } = await params;
  const user = await prisma.user.findUnique({
    where: { walletAddress: address.toLowerCase() },
    include: { _count: { select: { entries: true } } },
  });

  if (!user) return { title: 'Pet not found — DiaryBeast' };

  const emoji = PET_EMOJI[user.selectedAnimal || 'cat'] || '🐾';
  const title = `${emoji} ${user.petName || 'Unnamed Pet'} — DiaryBeast`;
  const description = `${user.selectedAnimal} · Day ${user.currentStreak} streak · ${user._count.entries} entries · ${user.livesRemaining}/7 lives`;

  const ogImageUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://diarybeast.xyz'}/api/og/pet?address=${address.toLowerCase()}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'profile',
      siteName: 'DiaryBeast',
      images: [{ url: ogImageUrl, width: 1200, height: 630 }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [ogImageUrl] },
  };
}

export default async function PetPage({ params }: Props) {
  const { address } = await params;

  const user = await prisma.user.findUnique({
    where: { walletAddress: address.toLowerCase() },
    include: { _count: { select: { entries: true } } },
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-950 text-green-400 font-mono flex items-center justify-center">
        <p>Pet not found.</p>
      </div>
    );
  }

  const emoji = PET_EMOJI[user.selectedAnimal || 'cat'] || '🐾';
  const daysAlive = Math.floor((Date.now() - user.createdAt.getTime()) / (1000 * 60 * 60 * 24));
  const rarePets = (user.rarePets as string[]) || [];

  return (
    <div className="min-h-screen bg-gray-950 text-green-400 font-mono">
      <div className="max-w-md mx-auto px-4 py-12">
        <div className="border border-green-800 p-6 text-center">
          <div className="text-6xl mb-4">{emoji}</div>
          <h1 className="text-2xl font-bold mb-1">{user.petName || 'Unnamed Pet'}</h1>
          <p className="text-green-700 text-sm mb-6">
            {user.selectedAnimal} · alive for {daysAlive} days
          </p>

          <div className="grid grid-cols-2 gap-4 mb-6 text-left">
            <div className="border border-green-900 p-3">
              <div className="text-green-700 text-xs">STREAK</div>
              <div className="text-xl">{user.currentStreak} days</div>
              <div className="text-green-800 text-xs">best: {user.longestStreak}</div>
            </div>
            <div className="border border-green-900 p-3">
              <div className="text-green-700 text-xs">ENTRIES</div>
              <div className="text-xl">{user._count.entries}</div>
            </div>
            <div className="border border-green-900 p-3">
              <div className="text-green-700 text-xs">LIVES</div>
              <div className="text-xl">
                {'❤️'.repeat(user.livesRemaining)}
                {'🖤'.repeat(7 - user.livesRemaining)}
              </div>
            </div>
            <div className="border border-green-900 p-3">
              <div className="text-green-700 text-xs">HAPPINESS</div>
              <div className="text-xl">{user.happiness}%</div>
            </div>
          </div>

          {rarePets.length > 0 && (
            <div className="border border-yellow-600 p-3 mb-6">
              <div className="text-yellow-500 text-xs mb-2">RARE PETS COLLECTION</div>
              <div className="flex gap-2 justify-center text-2xl">
                {rarePets.map((pet) => (
                  <span key={pet} title={pet}>
                    {PET_EMOJI[pet] || '✨'}
                  </span>
                ))}
              </div>
            </div>
          )}

          {user.isAgent && (
            <div className="text-xs text-green-700 border border-green-900 inline-block px-2 py-1 mb-6">
              AI AGENT
            </div>
          )}
        </div>

        <div className="text-center mt-8 p-6 border border-green-800">
          <p className="text-green-500 mb-3">Want your own virtual pet?</p>
          <Link
            href="/"
            className="inline-block px-6 py-2 bg-green-400 text-gray-950 font-bold hover:bg-green-300 transition-colors"
          >
            Get your own AI pet →
          </Link>
        </div>

        <div className="mt-4">
          <DonateButton />
        </div>
      </div>
    </div>
  );
}
