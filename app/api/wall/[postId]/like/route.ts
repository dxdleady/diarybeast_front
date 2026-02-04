import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateRequest } from '@/lib/authMiddleware';

export async function POST(req: NextRequest, { params }: { params: Promise<{ postId: string }> }) {
  try {
    const { postId } = await params;

    // Only authenticated users can like
    const auth = await authenticateRequest(req);
    if (!auth) {
      return NextResponse.json({ error: 'Authentication required to like posts' }, { status: 401 });
    }

    const fingerprint = auth.user.walletAddress;

    const post = await prisma.wallPost.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const existingLike = await prisma.wallLike.findUnique({
      where: {
        postId_fingerprint: { postId, fingerprint },
      },
    });

    if (existingLike) {
      return NextResponse.json({ error: 'Already liked', likes: post.likes }, { status: 409 });
    }

    await prisma.$transaction([
      prisma.wallLike.create({
        data: { postId, fingerprint },
      }),
      prisma.wallPost.update({
        where: { id: postId },
        data: { likes: { increment: 1 } },
      }),
    ]);

    return NextResponse.json({
      success: true,
      likes: post.likes + 1,
    });
  } catch (error) {
    console.error('Like error:', error);
    return NextResponse.json({ error: 'Failed to like post' }, { status: 500 });
  }
}
