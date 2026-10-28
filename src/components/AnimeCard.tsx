import React from 'react';
import { useRouter } from '../context/RouterContext';
import { useWatch } from '../context/WatchContext';
import { Anime } from '../types';
import { Play, Plus, Check, Star } from 'lucide-react';

interface AnimeCardProps {
  anime: Anime;
  aspect?: 'portrait' | 'landscape';
}

export const AnimeCard: React.FC<AnimeCardProps> = ({ anime, aspect = 'landscape' }) => {
  const { navigate } = useRouter();
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatch();
  const inWatchlist = isInWatchlist(anime.id);

  const handleCardClick = () => {
    navigate(`/anime/${anime.id}`);
  };

  const handleQuickPlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    const firstEp = anime.episodes[0]?.id || 'ep1';
    navigate(`/watch/${anime.id}/${firstEp}`);
  };

  const handleToggleWatchlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (inWatchlist) {
      removeFromWatchlist(anime.id);
    } else {
      addToWatchlist(anime);
    }
  };

  const isPortrait = aspect === 'portrait';

  return (
    <div
      onClick={handleCardClick}
      className="group relative flex flex-col cursor-pointer transition-transform duration-300 hover:-translate-y-1"
    >
      {/* Media Container */}
      <div
        className={`relative w-full overflow-hidden rounded-sm bg-neutral-900 border border-white/[0.08] ${
          isPortrait ? 'aspect-[3/4]' : 'aspect-[16/9]'
        }`}
      >
        <img
          src={isPortrait ? anime.posterImage : anime.bannerImage}
          alt={anime.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />

        {/* Cinematic gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

        {/* Hover Action Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={handleQuickPlay}
            className="w-12 h-12 rounded-full bg-[#d4af37] text-black flex items-center justify-center shadow-lg shadow-black/50 transform scale-90 group-hover:scale-100 transition-transform hover:bg-[#e6c46a]"
            aria-label={`Play ${anime.title}`}
          >
            <Play className="w-5 h-5 fill-current ml-0.5" />
          </button>
        </div>

        {/* Watchlist Quick Button (Top Right) */}
        <button
          onClick={handleToggleWatchlist}
          className={`absolute top-2.5 right-2.5 w-8 h-8 rounded flex items-center justify-center backdrop-blur-md transition-colors ${
            inWatchlist
              ? 'bg-[#d4af37] text-black shadow-md'
              : 'bg-black/60 text-white hover:bg-black/80 border border-white/20'
          }`}
          aria-label={inWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
          title={inWatchlist ? 'Saved in Watchlist' : 'Add to Watchlist'}
        >
          {inWatchlist ? <Check className="w-4 h-4 stroke-[2.5]" /> : <Plus className="w-4 h-4" />}
        </button>

        {/* Format & Rating Badge */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[11px] font-mono text-white/90">
          <span className="uppercase tracking-wider">{anime.type}</span>
          <span className="flex items-center gap-1 text-[#d4af37] font-semibold">
            <Star className="w-3 h-3 fill-current" />
            {anime.rating.toFixed(1)}
          </span>
        </div>
      </div>

      {/* Unboxed Metadata (Zero-pill discipline) */}
      <div className="mt-3 flex flex-col space-y-1">
        <h3 className="text-sm font-semibold text-white tracking-wide truncate group-hover:text-[#d4af37] transition-colors">
          {anime.title}
        </h3>

        {/* Clean Typographic Separators */}
        <div className="flex items-center gap-2 text-xs text-neutral-400 font-sans">
          <span>{anime.releaseYear}</span>
          <span aria-hidden="true">·</span>
          <span>{anime.genres[0]}</span>
          <span aria-hidden="true">·</span>
          <span>{anime.episodesCount} Ep</span>
        </div>

        {/* Audio Tracks indicator */}
        <p className="text-[11px] text-neutral-500 font-mono truncate">
          Audio: {anime.audioLanguages.slice(0, 3).join(', ')}
        </p>
      </div>
    </div>
  );
};
