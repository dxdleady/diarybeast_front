import { NextResponse } from 'next/server';

// Mubert API v3 configuration
const MUBERT_API_BASE = 'https://music-api.mubert.com/api/v3';
const MUBERT_COMPANY_ID = 'a01b1075-5bad-4d48-9e7d-f280182bca41';
const MUBERT_LICENSE_TOKEN = 'TT1KRfkjidruoG5pWVSJREGa1g9t3HCziTFcFEPIQhk3wAlCOdJ70eILAuYYMGbg';

// Genre mappings to Mubert playlist indices (based on documentation: 3.0.0 = Calm > Ambient > Meditation)
const GENRE_PLAYLISTS: Record<string, string> = {
  ambient: '3.0.0', // Calm > Ambient > Meditation
  lofi: '3.0.0', // We'll use same calm ambient for lofi
  nature: '3.0.0', // Same for nature
};

async function generateTrack(
  customerId: string,
  accessToken: string,
  genre: string,
  playlistIndex: string
) {
  const trackResponse = await fetch(`${MUBERT_API_BASE}/public/tracks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'customer-id': customerId,
      'access-token': accessToken,
    },
    body: JSON.stringify({
      playlist_index: playlistIndex,
      duration: 180, // 3 минуты
      mode: 'loop',
      bitrate: 128,
      format: 'mp3',
      intensity: 'high',
    }),
  });

  if (!trackResponse.ok) {
    const errorText = await trackResponse.text();
    console.error('Generate track error:', trackResponse.status, errorText);
    throw new Error(`Failed to generate track: ${trackResponse.status}`);
  }

  const trackData = await trackResponse.json();

  const generation = trackData.data.generations[0];

  return {
    id: trackData.data.id || Date.now().toString(),
    title: `${genre.charAt(0).toUpperCase() + genre.slice(1)} Track`,
    artist: 'Mubert AI',
    genre,
    streamUrl: generation.url,
    duration: trackData.data.duration,
    status: generation.status,
  };
}

export async function POST() {
  try {
    // Step 1: Register customer
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

    // Step 2: Generate 10 tracks for each genre
    const allTracks: Record<string, any[]> = {
      ambient: [],
      lofi: [],
      nature: [],
    };

    for (const genre of Object.keys(GENRE_PLAYLISTS)) {
      const playlistIndex = GENRE_PLAYLISTS[genre];

      // Generate 10 tracks sequentially to avoid rate limits
      const tracks = [];
      for (let i = 0; i < 10; i++) {
        try {
          const track = await generateTrack(customerId, accessToken, genre, playlistIndex);
          tracks.push(track);
          // Small delay between requests
          await new Promise((resolve) => setTimeout(resolve, 1000));
        } catch (error) {
          console.error(`Failed to generate track ${i + 1} for ${genre}:`, error);
        }
      }

      allTracks[genre] = tracks;
    }

    return NextResponse.json({
      success: true,
      tracks: allTracks,
      message: 'Tracks preloaded successfully',
    });
  } catch (error) {
    console.error('Preload error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to preload tracks',
      },
      { status: 500 }
    );
  }
}
