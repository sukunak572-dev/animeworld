export type LanguageCode =
  | 'en'
  | 'hi'
  | 'ja'
  | 'bn'
  | 'ta'
  | 'te'
  | 'ml'
  | 'kn'
  | 'es'
  | 'pt'
  | 'fr'
  | 'ar';

export type ThemeMode = 'noir' | 'midnight' | 'editorial-light';

export interface AudioTrack {
  id: string;
  language: string;
  label: string;
  isDefault?: boolean;
}

export interface SubtitleTrack {
  id: string;
  language: string;
  label: string;
  src?: string;
  isDefault?: boolean;
}

export interface Episode {
  id: string;
  animeId: string;
  seasonNumber: number;
  episodeNumber: number;
  title: string;
  romajiTitle?: string;
  synopsis: string;
  duration: number; // in seconds
  videoUrl: string;
  thumbnail: string;
  airDate: string;
  introStart?: number; // in seconds
  introEnd?: number;
  outroStart?: number;
  outroEnd?: number;
  audioTracks: AudioTrack[];
  subtitleTracks: SubtitleTrack[];
}

export interface Anime {
  id: string;
  title: string;
  romajiTitle: string;
  japaneseTitle?: string;
  synopsis: string;
  releaseYear: number;
  season: 'Winter' | 'Spring' | 'Summer' | 'Fall';
  type: 'Series' | 'Movie';
  status: 'Ongoing' | 'Completed';
  rating: number; // e.g. 9.4
  ratingCount: number;
  studios: string[];
  genres: string[];
  seasonsCount: number;
  episodesCount: number;
  isFeatured?: boolean;
  isTrending?: boolean;
  isPopular?: boolean;
  bannerImage: string;
  posterImage: string;
  trailerUrl?: string;
  audioLanguages: string[];
  subtitleLanguages: string[];
  episodes: Episode[];
  cast?: { character: string; voiceActor: string; role: string }[];
  director?: string;
  ageRating?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  count: number;
}

export interface WatchlistItem {
  id: string;
  userId: string;
  animeId: string;
  animeTitle: string;
  posterImage: string;
  rating: number;
  type: string;
  releaseYear: number;
  addedAt: string;
}

export interface HistoryItem {
  id: string;
  userId: string;
  animeId: string;
  episodeId: string;
  animeTitle: string;
  episodeNumber: number;
  episodeTitle: string;
  thumbnail: string;
  progressSeconds: number;
  totalSeconds: number;
  lastWatchedAt: string;
  completed: boolean;
}

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  isAdmin: boolean;
  preferences: {
    theme: ThemeMode;
    interfaceLanguage: LanguageCode;
    defaultAudioLanguage: string;
    defaultSubtitleLanguage: string;
    autoplayNext: boolean;
    autoSkipIntro: boolean;
  };
}

export interface AdminLog {
  id: string;
  adminEmail: string;
  action: string;
  target: string;
  details: string;
  timestamp: string;
}

export interface SiteSettings {
  siteName: string;
  tagline: string;
  announcement: string;
  maintenanceMode: boolean;
  featuredAnimeId: string;
  allowedAdmins: string[];
}
