import React, { useState } from 'react';
import { useRouter } from '../context/RouterContext';
import { useWatch } from '../context/WatchContext';
import { useAuth } from '../context/AuthContext';
import { VideoPlayer } from '../components/VideoPlayer';
import { AnimeCard } from '../components/AnimeCard';
import {
  ArrowLeft,
  Bookmark,
  Share2,
  Star,
  Info,
  Layers,
  ChevronRight,
  Check,
} from 'lucide-react';

export const WatchPage: React.FC = () => {
  const { params, navigate, goBack } = useRouter();
  const { animeCatalog, addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatch();
  const { interfaceLanguage } = useAuth();
  const [copied, setCopied] = useState(false);

  const animeId = params.id;
  const episodeId = params.epId;

  const anime = animeCatalog.find((a) => a.id === animeId) || animeCatalog[0];

  if (!anime) {
    return (
      <div className="max-w-[1440px] mx-auto px-6 py-20 text-center text-white">
        <h2 className="text-2xl font-bold">Anime Not Found</h2>
        <button onClick={() => navigate('/library')} className="mt-4 px-4 py-2 bg-[#d4af37] text-black text-xs font-bold uppercase">
          Back to Library
        </button>
      </div>
    );
  }

  const activeEpisode =
    anime.episodes.find((e) => e.id === episodeId) || anime.episodes[0];

  const inWatchlist = isInWatchlist(anime.id);

  const handleEpisodeChange = (newEpId: string) => {
    navigate(`/watch/${anime.id}/${newEpId}`);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Up next episodes
  const relatedAnime = animeCatalog.filter((a) => a.id !== anime.id).slice(0, 3);

  return (
    <div className="w-full bg-[#07080a] text-white min-h-screen">
      
      {/* Top Utility Bar */}
      <div className="max-w-[1520px] mx-auto px-4 sm:px-6 py-3 flex items-center justify-between text-xs text-neutral-400 border-b border-white/[0.06]">
        <button
          onClick={goBack}
          className="flex items-center gap-1.5 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit Theater</span>
        </button>

        <div className="flex items-center gap-2 font-mono text-[11px]">
          <span className="text-white font-semibold">{anime.title}</span>
          <span aria-hidden="true">·</span>
          <span className="text-[#d4af37]">Episode {activeEpisode?.episodeNumber}</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => inWatchlist ? removeFromWatchlist(anime.id) : addToWatchlist(anime)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-colors ${
              inWatchlist ? 'bg-[#d4af37] text-black font-semibold' : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>{inWatchlist ? 'Saved' : 'Watchlist'}</span>
          </button>

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Share'}</span>
          </button>
        </div>
      </div>

      {/* Main Video Viewport Container */}
      <div className="max-w-[1520px] mx-auto px-0 sm:px-4 lg:px-6 pt-2 pb-8">
        <VideoPlayer
          anime={anime}
          initialEpisodeId={activeEpisode?.id}
          onEpisodeChange={handleEpisodeChange}
        />
      </div>

      {/* Details & Episode Matrix Grid */}
      <div className="max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Info */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex flex-col space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono text-[#d4af37]">
                <span>Season {activeEpisode?.seasonNumber}</span>
                <span aria-hidden="true">·</span>
                <span>Episode {activeEpisode?.episodeNumber}</span>
                <span aria-hidden="true">·</span>
                <span className="text-neutral-400">Air Date: {activeEpisode?.airDate}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white font-['Cinzel']">
                {activeEpisode?.title}
              </h1>
              <p className="text-sm text-neutral-300 leading-relaxed font-light">
                {activeEpisode?.synopsis}
              </p>
            </div>

            {/* Quick Series Bio Card */}
            <div className="p-4 bg-[#12141a] border border-white/[0.08] rounded flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img
                  src={anime.posterImage}
                  alt={anime.title}
                  className="w-14 h-18 object-cover rounded border border-white/10"
                />
                <div>
                  <h3 className="text-sm font-bold text-white hover:text-[#d4af37] cursor-pointer" onClick={() => navigate(`/anime/${anime.id}`)}>
                    {anime.title}
                  </h3>
                  <p className="text-xs text-neutral-400 font-mono mt-0.5">
                    Studio {anime.studios.join(', ')} · ★ {anime.rating}
                  </p>
                  <p className="text-[11px] text-neutral-500 mt-0.5">
                    {anime.genres.join(', ')} · {anime.status}
                  </p>
                </div>
              </div>

              <button
                onClick={() => navigate(`/anime/${anime.id}`)}
                className="px-4 py-2 bg-white/10 hover:bg-white/15 text-xs font-semibold uppercase tracking-wider rounded border border-white/15"
              >
                All Series Details
              </button>
            </div>

            {/* Episode Grid Selector */}
            <div className="pt-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                <h3 className="text-base font-bold uppercase tracking-wider text-white font-['Cinzel'] flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#d4af37]" />
                  <span>All Episodes in Season {activeEpisode?.seasonNumber}</span>
                </h3>
                <span className="text-xs font-mono text-neutral-400">
                  {anime.episodes.length} Total
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {anime.episodes.map((ep) => {
                  const isCurrent = ep.id === activeEpisode?.id;
                  return (
                    <div
                      key={ep.id}
                      onClick={() => handleEpisodeChange(ep.id)}
                      className={`p-3 rounded flex gap-3 cursor-pointer transition-all ${
                        isCurrent
                          ? 'bg-[#d4af37]/20 border border-[#d4af37]'
                          : 'bg-[#12141a] hover:bg-white/5 border border-white/[0.06]'
                      }`}
                    >
                      <img
                        src={ep.thumbnail || anime.bannerImage}
                        alt={ep.title}
                        className="w-20 h-14 object-cover rounded shrink-0"
                      />
                      <div className="min-w-0 flex flex-col justify-center">
                        <span className="text-[11px] font-mono text-[#d4af37]">Ep {ep.episodeNumber}</span>
                        <h4 className="text-xs font-bold text-white truncate">{ep.title}</h4>
                        <span className="text-[10px] text-neutral-400 font-mono">{Math.floor(ep.duration / 60)} min</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Rail: Up Next Recommendations */}
          <div className="lg:col-span-4 space-y-6">
            <h3 className="text-base font-bold uppercase tracking-wider text-white font-['Cinzel'] pb-2 border-b border-white/10">
              Up Next For You
            </h3>
            <div className="space-y-4">
              {relatedAnime.map((rel) => (
                <AnimeCard key={rel.id} anime={rel} aspect="landscape" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
