import { create } from 'zustand';

export type Genre = 'ambient' | 'lofi' | 'nature';

interface Track {
  id: string;
  title: string;
  genre: Genre;
  streamUrl: string;
  artist?: string;
  duration?: number;
}

// Кэш streaming URL для каждого жанра
const streamCache: Record<Genre, Track | null> = {
  ambient: null,
  lofi: null,
  nature: null,
};

// Функция загрузки streaming link с API
async function fetchStreamLink(genre: Genre): Promise<Track | null> {
  try {
    const response = await fetch(`/api/music/track?genre=${genre}`);
    if (!response.ok) throw new Error('Failed to fetch stream');

    const data = await response.json();
    if (data.success && data.track) {
      return data.track;
    }
    return null;
  } catch (error) {
    console.error(`Failed to fetch ${genre} stream:`, error);
    return null;
  }
}

interface MusicPlayerState {
  // Состояние
  currentGenre: Genre;
  isPlaying: boolean;
  volume: number;
  isLoading: boolean;

  // Вычисляемые значения
  getCurrentTrack: () => Track | null;

  // Действия
  setGenre: (genre: Genre) => void;
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  setVolume: (volume: number) => void;
  reset: () => void;
}

export const useMusicPlayerStore = create<MusicPlayerState>((set, get) => {
  // Load saved preferences
  const savedGenre =
    (typeof window !== 'undefined' && (localStorage.getItem('music-genre') as Genre)) || 'lofi';
  const savedVolume =
    (typeof window !== 'undefined' && parseFloat(localStorage.getItem('music-volume') || '0.5')) ||
    0.5;

  return {
    // Начальное состояние
    currentGenre: savedGenre,
    isPlaying: false,
    volume: savedVolume,
    isLoading: false,

    // Получить текущий stream
    getCurrentTrack: () => {
      const { currentGenre } = get();
      return streamCache[currentGenre];
    },

    // Установить жанр
    setGenre: async (genre: Genre) => {
      const { currentGenre } = get();

      // Загружаем новый streaming link (даже если жанр тот же - для смены трека)
      set({ isLoading: true });

      try {
        const stream = await fetchStreamLink(genre);
        if (stream) {
          streamCache[genre] = stream;
          set({
            currentGenre: genre,
            isPlaying: true,
            isLoading: false,
          });

          // Сохраняем выбор жанра
          if (typeof window !== 'undefined') {
            localStorage.setItem('music-genre', genre);
          }
        } else {
          set({ isLoading: false });
        }
      } catch (error) {
        console.error('Failed to set genre:', error);
        set({ isLoading: false });
      }
    },

    // Play
    play: async () => {
      const { currentGenre } = get();

      // If no stream cached for current genre, fetch it first
      if (!streamCache[currentGenre]) {
        set({ isLoading: true });
        try {
          const stream = await fetchStreamLink(currentGenre);
          if (stream) {
            streamCache[currentGenre] = stream;
            set({ isPlaying: true, isLoading: false });
          } else {
            set({ isLoading: false });
          }
        } catch (error) {
          console.error('Failed to load stream:', error);
          set({ isLoading: false });
        }
      } else {
        set({ isPlaying: true });
      }
    },

    // Pause
    pause: () => set({ isPlaying: false }),

    // Toggle play/pause
    togglePlay: async () => {
      const { isPlaying, play, pause } = get();
      if (isPlaying) {
        pause();
      } else {
        await play();
      }
    },

    // Установить громкость
    setVolume: (volume: number) => {
      const clampedVolume = Math.max(0, Math.min(1, volume));
      set({ volume: clampedVolume });

      // Сохраняем громкость
      if (typeof window !== 'undefined') {
        localStorage.setItem('music-volume', clampedVolume.toString());
      }
    },

    // Сброс
    reset: () =>
      set({
        isPlaying: false,
      }),
  };
});
