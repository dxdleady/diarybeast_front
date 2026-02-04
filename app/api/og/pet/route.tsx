import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { catAnimations } from '@/lib/ascii/catAnimations';
import { dogAnimations } from '@/lib/ascii/dogAnimations';
import type { PetState } from '@/lib/ascii/types';

export const runtime = 'nodejs';

function getPetState(happiness: number, lives: number): PetState {
  if (lives === 0) return 'critical';
  if (happiness >= 70 && lives >= 5) return 'happy';
  if (happiness < 30 || lives <= 2) return 'sad';
  return 'idle';
}

function getPetAscii(petType: string, state: PetState): string[] {
  const animations = petType === 'dog' ? dogAnimations : catAnimations;
  const animation = animations[state] || animations.idle;
  return animation.frames[0].lines;
}

export async function GET(req: NextRequest) {
  const address = req.nextUrl.searchParams.get('address');

  if (!address) {
    return new Response('Missing address', { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { walletAddress: address.toLowerCase() },
    include: { _count: { select: { entries: true } } },
  });

  if (!user) {
    return new Response('Pet not found', { status: 404 });
  }

  const state = getPetState(user.happiness, user.livesRemaining);
  const asciiLines = getPetAscii(user.selectedAnimal || 'cat', state);
  const petName = user.petName || 'Unnamed Pet';
  const daysAlive = Math.floor((Date.now() - user.createdAt.getTime()) / (1000 * 60 * 60 * 24));

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
        {/* Center content */}
        <div style={{ display: 'flex', flex: 1, alignItems: 'center', gap: '60px' }}>
          {/* ASCII Pet - large */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: '#0a1a0a',
              border: '2px solid #166534',
              borderRadius: '16px',
              padding: '30px 36px',
            }}
          >
            {asciiLines.map((line, i) => (
              <span
                key={i}
                style={{
                  color: '#4ade80',
                  fontSize: '40px',
                  lineHeight: '46px',
                  whiteSpace: 'pre',
                }}
              >
                {line}
              </span>
            ))}
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <span style={{ color: '#86efac', fontSize: '48px', fontWeight: 'bold' }}>
              {petName}
            </span>
            <span style={{ color: '#166534', fontSize: '22px' }}>
              {user.selectedAnimal} · alive for {daysAlive} days
            </span>

            <div style={{ display: 'flex', gap: '30px', marginTop: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ color: '#166534', fontSize: '16px' }}>STREAK</span>
                <span style={{ color: '#4ade80', fontSize: '36px' }}>{user.currentStreak}d</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ color: '#166534', fontSize: '16px' }}>ENTRIES</span>
                <span style={{ color: '#4ade80', fontSize: '36px' }}>{user._count.entries}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ color: '#166534', fontSize: '16px' }}>LIVES</span>
                <span style={{ fontSize: '28px' }}>
                  {'❤️'.repeat(user.livesRemaining)}
                  {'🖤'.repeat(7 - user.livesRemaining)}
                </span>
              </div>
            </div>

            {user.isAgent && (
              <span
                style={{
                  color: '#166534',
                  fontSize: '16px',
                  border: '1px solid #166534',
                  padding: '4px 12px',
                  borderRadius: '4px',
                  width: 'fit-content',
                }}
              >
                AI AGENT
              </span>
            )}
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
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
