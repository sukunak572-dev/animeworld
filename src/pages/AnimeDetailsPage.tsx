import React, { useState } from 'react';
import { useRouter } from '../context/RouterContext';
import { useWatch } from '../context/WatchContext';
import { useAuth } from '../context/AuthContext';
import { getTranslation } from '../lib/i18n';
import { AnimeCard } from '../components/AnimeCard';
import {
  Play,
  Plus,
  Check,
  Star,
  Film,
  Calendar,
  Volume2,
  Subtitles,
  Users,
  Clock,
  ArrowLeft,
  X,
} from 'lucide-react';

export const AnimeDetailsPage: React.FC = () => {
  const { params, navigate, goBack } = useRouter();
  const { animeCatalog, addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatch();
  const { interfaceLanguage } = useAuth();
  const [trailerOpen, setTrailerOpen] = useState(false);

  const t = (key: string) => getTranslation(interfaceLanguage, key);

  const anime = animeCatalog.find((a) => a.id === params.id) || animeCatalog[0];
  const inWatchlist = anime ? isInWatchlist(anime.id) : false;

  if (!anime) {
    return (
      <div className="max-w-[1440px] mx-auto px-6 py-20 text-center">
        <h2 className="text-2xl font-bold text-white">Anime Title Not Found</h2>
        <button onClick={() => navigate('/library')} className="mt-4 px-4 py-2 bg-[#d4af37] text-black text-xs font-bold uppercase">
          Back to Library
        </button>
      </div>
    );
  }

  // Related anime
  const relatedAnime = animeCatalog
    .filter((a) => a.id !== anime.id && a.genres.some((g) => anime.genres.includes(g)))
    .slice(0, 4);

  const handleStartWatch = () => {
    const firstEpId = anime.episodes[0]?.id || 'ep1';
    navigate(`/watch/${anime.id}/${firstEpId}`);
  };

  return (
    <div className="w-full bg-[#0a0b0e] text-white">
      
      {/* Hero Header with Media Scrim */}
      <div className="relative w-full min-h-[60vh] lg:min-h-[70vh] flex items-end overflow-hidden pb-12">
        <img
          src={anime.bannerImage}
          alt={anime.title}
          className="absolute inset-0 w-full h-full object-cover object-center brightness-[0.6] contrast-[1.05]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0b0e] via-[#0a0b0e]/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0b0e] via-[#0a0b0e]/50 to-transparent" />

        {/* Back Button */}
        <button
          onClick={goBack}
          className="absolute top-6 left-6 z-20 flex items-center gap-2 px-3 py-1.5 bg-black/60 hover:bg-black/80 rounded text-xs text-neutral-300 hover:text-white backdrop-blur border border-white/10"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="relative z-10 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-12 pt-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            
            {/* Poster Thumbnail */}
            <div className="hidden lg:block lg:col-span-3">
              <div className="w-full aspect-[3/4] rounded overflow-hidden shadow-2xl border border-white/10">
                <img src={anime.posterImage} alt={anime.title} className="w-full h-full object-cover" />
              </div>
            </div>

            {/* Title & Metadata Details */}
            <div className="lg:col-span-9 space-y-4">
              
              {/* Unboxed Metadata Line */}
              <div className="flex flex-wrap items-center gap-3 text-xs font-mono uppercase tracking-wider text-neutral-400">
                <span className="text-[#d4af37] font-semibold flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  {anime.rating} ({anime.ratingCount.toLocaleString()} votes)
                </span>
                <span aria-hidden="true">·</span>
                <span>{anime.releaseYear}</span>
                <span aria-hidden="true">·</span>
                <span>{anime.season} Season</span>
                <span aria-hidden="true">·</span>
                <span>{anime.type}</span>
                <span aria-hidden="true">·</span>
                <span>{anime.status}</span>
                <span aria-hidden="true">·</span>
                <span>Studio {anime.studios.join(', ')}</span>
              </div>

              {/* Title Lockup */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white font-['Cinzel'] leading-tight">
                {anime.title}
              </h1>

              {anime.romajiTitle && (
                <p className="text-sm font-mono text-neutral-400">
                  {anime.romajiTitle} {anime.japaneseTitle && `(${anime.japaneseTitle})`}
                </p>
              )}

              {/* Genres Inline */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {anime.genres.map((g) => (
                  <span
                    key={g}
                    className="px-2.5 py-1 text-xs font-medium bg-white/10 rounded text-neutral-200 border border-white/10"
                  >
                    {g}
                  </span>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <button
                  onClick={handleStartWatch}
                  className="px-8 py-3.5 bg-[#d4af37] text-black font-bold text-xs uppercase tracking-[0.2em] hover:bg-[#e6c46a] transition-all flex items-center gap-2.5 cursor-pointer shadow-lg"
                  style={{
                    clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%)',
                  }}
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Start Watching S1 E1</span>
                </button>

                <button
                  onClick={() => inWatchlist ? removeFromWatchlist(anime.id) : addToWatchlist(anime)}
                  className={`px-5 py-3.5 text-xs font-semibold uppercase tracking-wider rounded border transition-all flex items-center gap-2 ${
                    inWatchlist
                      ? 'bg-[#d4af37]/20 border-[#d4af37] text-[#d4af37]'
                      : 'bg-white/10 hover:bg-white/20 border-white/20 text-white'
                  }`}
                >
                  {inWatchlist ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  <span>{inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}</span>
                </button>

                {anime.trailerUrl && (
                  <button
                    onClick={() => setTrailerOpen(true)}
                    className="px-5 py-3.5 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold uppercase tracking-wider rounded border border-white/15 flex items-center gap-2"
                  >
                    <Film className="w-4 h-4" />
                    <span>Watch Trailer</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Body: Synopsis, Episodes, Cast, Audio/Subtitles */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Synopsis & Episodes List */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* Synopsis */}
            <div>
              <h2 className="text-xs font-mono uppercase tracking-[0.25em] text-[#d4af37] font-semibold mb-2">
                Synopsis & Narrative
              </h2>
              <p className="text-base sm:text-lg text-neutral-200 font-light leading-relaxed">
                {anime.synopsis}
              </p>
            </div>

            {/* Episodes Collection */}
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                <h3 className="text-xl sm:text-2xl font-bold uppercase tracking-wide font-['Cinzel']">
                  Episodes ({anime.episodes.length})
                </h3>
                <span className="text-xs font-mono text-neutral-400">
                  Season 1 Broadcast
                </span>
              </div>

              <div className="space-y-4">
                {anime.episodes.map((ep) => (
                  <div
                    key={ep.id}
                    onClick={() => navigate(`/watch/${anime.id}/${ep.id}`)}
                    className="group flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-[#12141a] border border-white/[0.06] rounded hover:border-[#d4af37]/50 transition-all cursor-pointer"
                  >
                    <div className="relative aspect-video w-full sm:w-48 overflow-hidden rounded shrink-0">
                      <img
                        src={ep.thumbnail || anime.bannerImage}
                        alt={ep.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-10 h-10 rounded-full bg-[#d4af37] text-black flex items-center justify-center shadow-lg">
                          <Play className="w-4 h-4 fill-current ml-0.5" />
                        </div>
                      </div>
                      <span className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/75 rounded text-[10px] font-mono text-white">
                        {Math.floor(ep.duration / 60)} min
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 text-xs font-mono text-[#d4af37]">
                        <span>Episode {ep.episodeNumber}</span>
                        <span aria-hidden="true">·</span>
                        <span className="text-neutral-400">{ep.airDate}</span>
                      </div>
                      <h4 className="text-base font-bold text-white group-hover:text-[#d4af37] transition-colors truncate mt-1">
                        {ep.title}
                      </h4>
                      <p className="text-xs text-neutral-400 line-clamp-2 mt-1 leading-relaxed">
                        {ep.synopsis}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cast & Characters */}
            {anime.cast && anime.cast.length > 0 && (
              <div>
                <h3 className="text-xl font-bold uppercase tracking-wide font-['Cinzel'] mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#d4af37]" />
                  <span>Main Cast & Characters</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {anime.cast.map((c, i) => (
                    <div key={i} className="p-3 bg-[#12141a] border border-white/[0.06] rounded flex justify-between items-center text-xs">
                      <div>
                        <p className="font-semibold text-white">{c.character}</p>
                        <p className="text-neutral-400 text-[11px] font-mono">{c.role}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[#d4af37] font-medium">{c.voiceActor}</p>
                        <p className="text-[10px] text-neutral-500 font-mono">Voice Actor</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Audio, Subtitles, Studio Info, Related */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Audio & Subtitles Genuine Matrix */}
            <div className="p-6 bg-[#12141a] border border-white/10 rounded space-y-6">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#d4af37] mb-2">
                  <Volume2 className="w-4 h-4" />
                  <span>Available Audio Tracks</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {anime.audioLanguages.map((lang) => (
                    <span key={lang} className="px-2 py-1 bg-white/5 border border-white/10 rounded text-xs text-neutral-200">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#d4af37] mb-2">
                  <Subtitles className="w-4 h-4" />
                  <span>Available Subtitles</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {anime.subtitleLanguages.map((lang) => (
                    <span key={lang} className="px-2 py-1 bg-white/5 border border-white/10 rounded text-xs text-neutral-200">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 text-xs text-neutral-400 space-y-2">
                <p><strong className="text-white">Director:</strong> {anime.director || 'Studio Visionary'}</p>
                <p><strong className="text-white">Age Rating:</strong> {anime.ageRating || '16+'}</p>
                <p><strong className="text-white">Format:</strong> {anime.type} ({anime.episodesCount} Chapters)</p>
              </div>
            </div>

            {/* Related Anime */}
            {relatedAnime.length > 0 && (
              <div>
                <h3 className="text-base font-bold uppercase tracking-wider text-white font-['Cinzel'] mb-4">
                  Recommended For You
                </h3>
                <div className="space-y-4">
                  {relatedAnime.map((rel) => (
                    <AnimeCard key={rel.id} anime={rel} aspect="landscape" />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Trailer Modal */}
      {trailerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
          <div className="relative w-full max-w-4xl bg-black rounded-lg overflow-hidden border border-white/20">
            <button
              onClick={() => setTrailerOpen(false)}
              className="absolute top-4 right-4 z-10 p-2 bg-black/60 rounded-full text-white hover:bg-black"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="aspect-video w-full">
              <video
                src={anime.trailerUrl}
                controls
                autoPlay
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
