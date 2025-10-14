import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getEncryptionKey, decryptContent } from '@/lib/encryption';
import { burnTokens } from '@/lib/blockchain';

const SUMMARY_COST = 50;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

interface PlutchikEmotions {
  joy: number;
  trust: number;
  fear: number;
  surprise: number;
  sadness: number;
  disgust: number;
  anger: number;
  anticipation: number;
}

interface AnalysisResult {
  emotions: PlutchikEmotions;
  summary: string;
  insights: string[];
  trend: 'improving' | 'stable' | 'declining';
}

export async function POST(req: NextRequest) {
  try {
    const { userAddress, weekStart, weekEnd } = await req.json();

    if (!userAddress || !weekStart || !weekEnd) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { walletAddress: userAddress.toLowerCase() },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check balance
    if (user.coinsBalance < SUMMARY_COST) {
      return NextResponse.json(
        { error: 'Insufficient balance', required: SUMMARY_COST, current: user.coinsBalance },
        { status: 400 }
      );
    }

    // Check if summary already exists
    const existingSummary = await prisma.weeklySummary.findUnique({
      where: {
        userId_weekStart: {
          userId: user.id,
          weekStart: new Date(weekStart),
        },
      },
    });

    if (existingSummary) {
      return NextResponse.json({ error: 'Summary already exists for this week' }, { status: 400 });
    }

    // Get entries for the week
    const entries = await prisma.entry.findMany({
      where: {
        userId: user.id,
        date: {
          gte: new Date(weekStart),
          lte: new Date(weekEnd),
        },
      },
      orderBy: { date: 'asc' },
    });

    if (entries.length === 0) {
      return NextResponse.json({ error: 'No entries found for this week' }, { status: 400 });
    }

    // Decrypt entries
    const encryptionKey = getEncryptionKey(userAddress);
    const decryptedEntries = entries.map((entry) => ({
      date: entry.date.toISOString().split('T')[0],
      content: decryptContent(entry.encryptedContent, encryptionKey),
      wordCount: entry.wordCount,
    }));

    // Analyze with AI
    const analysis = await analyzeWeek(decryptedEntries);

    // Burn tokens on blockchain
    let txHash: string;
    try {
      txHash = await burnTokens(userAddress, SUMMARY_COST);
    } catch (error) {
      console.error('Token burn failed:', error);
      return NextResponse.json({ error: 'Failed to burn tokens on blockchain' }, { status: 500 });
    }

    // Deduct cost and create summary in a transaction
    const [summary, updatedUser] = await prisma.$transaction([
      prisma.weeklySummary.create({
        data: {
          userId: user.id,
          weekStart: new Date(weekStart),
          weekEnd: new Date(weekEnd),
          emotions: analysis.emotions as any,
          summary: analysis.summary,
          insights: analysis.insights,
          trend: analysis.trend,
        },
      }),
      prisma.user.update({
        where: { id: user.id },
        data: { coinsBalance: user.coinsBalance - SUMMARY_COST },
      }),
    ]);

    return NextResponse.json({
      success: true,
      summary: {
        id: summary.id,
        emotions: summary.emotions,
        summary: summary.summary,
        insights: summary.insights,
        trend: summary.trend,
      },
      newBalance: updatedUser.coinsBalance,
      txHash, // Include blockchain transaction hash
    });
  } catch (error) {
    console.error('Summary generation error:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate summary',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

async function analyzeWeek(
  entries: Array<{ date: string; content: string; wordCount: number }>
): Promise<AnalysisResult> {
  const entriesText = entries
    .map((e) => `Date: ${e.date}\nContent: ${e.content}\n---`)
    .join('\n\n');

  const prompt = `You are an emotional intelligence AI analyzing diary entries using Plutchik's Wheel of Emotions framework.

Analyze these diary entries from the past week and provide:

1. **Plutchik's 8 Emotions** (0-100% intensity for each):
   - Joy
   - Trust
   - Fear
   - Surprise
   - Sadness
   - Disgust
   - Anger
   - Anticipation

2. **Summary**: A brief 3-4 sentence summary of the week's emotional journey

3. **Insights**: 2-3 key insights or patterns you noticed

4. **Trend**: Overall emotional trend (improving/stable/declining)

Diary Entries:
${entriesText}

Respond in this exact JSON format:
{
  "emotions": {
    "joy": <0-100>,
    "trust": <0-100>,
    "fear": <0-100>,
    "surprise": <0-100>,
    "sadness": <0-100>,
    "disgust": <0-100>,
    "anger": <0-100>,
    "anticipation": <0-100>
  },
  "summary": "...",
  "insights": ["...", "...", "..."],
  "trend": "improving|stable|declining"
}`;

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      'HTTP-Referer': 'https://diarybeast.com',
      'X-Title': 'DiaryBeast',
    },
    body: JSON.stringify({
      model: 'google/gemini-2.5-flash-lite',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      response_format: { type: 'json_object' },
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('OpenRouter API error:', response.status, errorData);
    throw new Error(`OpenRouter API error: ${response.statusText} - ${JSON.stringify(errorData)}`);
  }

  const data = await response.json();

  if (!data.choices || !data.choices[0] || !data.choices[0].message) {
    throw new Error('Invalid OpenRouter response format');
  }

  const content = data.choices[0].message.content;
  const analysis: AnalysisResult = JSON.parse(content);

  return analysis;
}
