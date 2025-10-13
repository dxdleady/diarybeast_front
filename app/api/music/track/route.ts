import { NextRequest, NextResponse } from 'next/server';

// Mubert API v3 configuration
const MUBERT_API_BASE = 'https://music-api.mubert.com/api/v3';
const MUBERT_COMPANY_ID = process.env.MUBERT_COMPANY_ID;
const MUBERT_LICENSE_TOKEN = process.env.MUBERT_LICENSE_TOKEN;

// Genre mappings to Mubert playlist indices
// Wildcards work in the final streaming URL: 3.0 = all Ambient, 3 = all Calm
const GENRE_PLAYLISTS: Record<string, string> = {
  ambient: '3.0', // Calm > Ambient > All channels (Meditation, Om, Zen, etc)
  lofi: '3', // All Calm category (random from all calm music)
  nature: '3.0', // Calm > Ambient > All channels (peaceful sounds)
};

// Customer cache (simple in-memory cache)
let customerCache: { id: string; token: string; expiry: number } | null = null;

async function getOrCreateCustomer() {
  // Check if we have a valid cached customer
  if (customerCache && customerCache.expiry > Date.now()) {
    return customerCache;
  }

  // Create new customer
  const customerResponse = await fetch(`${MUBERT_API_BASE}/service/customers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'company-id': MUBERT_COMPANY_ID,
      'license-token': MUBERT_LICENSE_TOKEN,
    },
    body: JSON.stringify({
      custom_id: `diarybeast-${Date.now()}`,
    }),
  });

  if (!customerResponse.ok) {
    const errorText = await customerResponse.text();
    console.error('Customer registration error:', customerResponse.status, errorText);
    throw new Error(`Failed to register customer: ${customerResponse.status}`);
  }

  const customerData = await customerResponse.json();
  const customerId = customerData.data.id;
  const accessToken = customerData.data.access.token;
  const expiredAt = new Date(customerData.data.access.expired_at).getTime();

  // Cache the customer
  customerCache = {
    id: customerId,
    token: accessToken,
    expiry: expiredAt,
  };

  return customerCache;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const genre = searchParams.get('genre') as 'ambient' | 'lofi' | 'nature';

    if (!genre || !GENRE_PLAYLISTS[genre]) {
      return NextResponse.json({ error: 'Invalid genre' }, { status: 400 });
    }

    // Get or create customer
    const customer = await getOrCreateCustomer();

    // Build streaming URL directly - wildcards work in streaming URL
    // According to docs: playlist=3.0 = all Ambient channels, playlist=3 = all Calm category
    const playlistIndex = GENRE_PLAYLISTS[genre];
    const streamingUrl = `https://stream.mubert.com/b2b/v3?customer_id=${customer.id}&access_token=${customer.token}&playlist=${playlistIndex}&bitrate=128&intensity=high`;

    return NextResponse.json({
      success: true,
      track: {
        id: `${genre}-stream-${Date.now()}`,
        title: `${genre.charAt(0).toUpperCase() + genre.slice(1)} Stream`,
        artist: 'Mubert AI',
        genre,
        streamUrl: streamingUrl,
        duration: 0, // Streaming has no fixed duration
        isStream: true,
      },
    });
  } catch (error) {
    console.error('Music API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch stream',
      },
      { status: 500 }
    );
  }
}
