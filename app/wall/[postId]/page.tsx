import { prisma } from '@/lib/prisma';
import { Metadata } from 'next';
import WallPostClient from './WallPostClient';

const PET_EMOJI: Record<string, string> = {
  cat: '🐱',
  dog: '🐕',
  lobster: '🦞',
  phoenix: '🔥',
  dragon: '🐉',
  unicorn: '🦄',
};

interface Props {
  params: Promise<{ postId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { postId } = await params;
  const post = await prisma.wallPost.findUnique({ where: { id: postId } });

  if (!post) {
    return { title: 'Post not found — DiaryBeast' };
  }

  const petName = post.petName || 'Anonymous Pet';
  const excerpt = post.text.slice(0, 150) + (post.text.length > 150 ? '...' : '');
  const title = `${petName} (${post.petType}) — DiaryBeast Wall`;
  const description = `"${excerpt}" · Day ${post.streak} streak · ${post.likes} likes`;
  const ogImageUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://diarybeast.xyz'}/api/og/wall?id=${postId}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      siteName: 'DiaryBeast',
      images: [{ url: ogImageUrl, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

export default async function WallPostPage({ params }: Props) {
  const { postId } = await params;

  const post = await prisma.wallPost.findUnique({
    where: { id: postId },
  });

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-950 text-green-400 font-mono flex items-center justify-center">
        <p>Post not found.</p>
      </div>
    );
  }

  return <WallPostClient post={{ ...post, createdAt: post.createdAt.toISOString() }} />;
}
