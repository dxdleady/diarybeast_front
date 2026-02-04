import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { catAnimations } from '@/lib/ascii/catAnimations';
import { dogAnimations } from '@/lib/ascii/dogAnimations';
import type { PetState } from '@/lib/ascii/types';

export const runtime = 'nodejs';

function getPetAscii(petType: string, petState: string): string[] {
  const animations = petType === 'dog' ? dogAnimations : catAnimations;
  const state = (
    ['happy', 'sad', 'critical', 'idle'].includes(petState) ? petState : 'idle'
  ) as PetState;
  const animation = animations[state] || animations.idle;
  return animation.frames[0].lines;
}

export async function GET(req: NextRequest) {
  const postId = req.nextUrl.searchParams.get('id');

  if (!postId) {
    return new Response('Missing id', { status: 400 });
  }

  const post = await prisma.wallPost.findUnique({ where: { id: postId } });

  if (!post) {
    return new Response('Post not found', { status: 404 });
  }

  const asciiLines = getPetAscii(post.petType, post.petState);
  const petName = post.petName || 'Anonymous Pet';
  const excerpt = post.text.slice(0, 200) + (post.text.length > 200 ? '...' : '');

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#030712',
          padding: '60px',
          fontFamily: 'monospace',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '40px', marginBottom: '40px' }}>
          {/* ASCII Pet */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: '#0a1a0a',
              border: '2px solid #166534',
              borderRadius: '12px',
              padding: '20px 24px',
            }}
          >
            {asciiLines.map((line, i) => (
              <span
                key={i}
                style={{
                  color: '#4ade80',
                  fontSize: '28px',
                  lineHeight: '32px',
                  whiteSpace: 'pre',
                }}
              >
                {line}
              </span>
            ))}
          </div>

          {/* Pet info */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ color: '#86efac', fontSize: '36px', fontWeight: 'bold' }}>
              {petName}
            </span>
            <span style={{ color: '#166534', fontSize: '20px', marginTop: '8px' }}>
              {post.petType} · {post.petState} · Day {post.streak} streak
            </span>
            <span style={{ color: '#166534', fontSize: '18px', marginTop: '4px' }}>
              ♥ {post.likes} likes
            </span>
          </div>
        </div>

        {/* Excerpt */}
        <div
          style={{
            display: 'flex',
            flex: 1,
            color: '#bbf7d0',
            fontSize: '28px',
            lineHeight: '40px',
            borderLeft: '3px solid #166534',
            paddingLeft: '24px',
          }}
        >
          &quot;{excerpt}&quot;
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '30px',
          }}
        >
          <span style={{ color: '#14532d', fontSize: '18px' }}>{post.tags.join(' ')}</span>
          <span style={{ color: '#4ade80', fontSize: '22px', fontWeight: 'bold' }}>
            diarybeast.xyz
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
