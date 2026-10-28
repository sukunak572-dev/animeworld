import React from 'react';
import { useRouter } from '../context/RouterContext';
import { useWatch } from '../context/WatchContext';
import { useAuth } from '../context/AuthContext';
import { getTranslation } from '../lib/i18n';
import { Anime } from '../types';
import { Play, Plus, Check, Star, ArrowUpRight, Volume2 } from 'lucide-react';

interface HeroSectionProps {
  anime: Anime;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ anime }) => {
  const { navigate } = useRouter();
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatch();
  const { interfaceLanguage } = useAuth();
  const inWatchlist = isInWatchlist(anime.id);

  const t = (key: string) => getTranslation(interfaceLanguage, key);

  const handleWatchClick = () => {
    const firstEpId = anime.episodes[0]?.id || 'ep1';
    navigate(`/watch/${anime.id}/${firstEpId}`);
  };

  const handleWatchlistToggle = () => {
    if (inWatchlist) {
      removeFromWatchlist(anime.id);
    } else {
      addToWatchlist(anime);
    }
  };

  return (
    <section className="relative w-full min-h-[92vh] flex items-center overflow-hidden bg-[#0a0b0e]">
      
      {/* Cinematic anime hero background */}
      <div className="absolute inset-0 z-0">
        <img
          src={anime.bannerImage}
          alt={anime.title}
          className="w-full h-full object-cover object-right md:object-center brightness-[0.85] contrast-[1.08] transition-transform duration-1000 scale-105"
        />
        {/* Editorial Gradients & Scrims */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0b0e] via-[#0a0b0e]/75 to-transparent md:to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0b0e] via-transparent to-black/30" />
      </div>

      {/* Floating subtle ambient particle glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#7952ec]/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-[#d4af37]/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Editorial Content Grid */}
      <div className="relative z-10 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-12 py-16 flex flex-col justify-between min-h-[85vh]">
        
        {/* Top subtle operational tag */}
        <div className="flex items-center justify-between w-full pt-4">
          <div className="flex items-center gap-3 text-xs tracking-[0.25em] uppercase text-neutral-400 font-mono">
            <span className="text-[#d4af37]">★ {anime.rating}</span>
            <span aria-hidden="true">·</span>
            <span>{anime.releaseYear}</span>
            <span aria-hidden="true">·</span>
            <span>{t('hero_season_premiere')}</span>
          </div>

          {/* Right Rail Top Info (mirroring phone / tech specs in Dev_UN template) */}
          <div className="hidden md:flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-neutral-300">
            <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
            <span>4K HDR · 120FPS · LOSSLESS</span>
          </div>
        </div>

        {/* Center / Mid Section: Oversized Editorial Lockup */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center my-auto">
          
          {/* Left Column: Oversized Typographic Monolith (DEV.UN inspiration) */}
          <div className="lg:col-span-8 flex flex-col items-start pr-0 lg:pr-8">
            
            {/* Massive Display Title */}
            <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[7.5rem] xl:text-[8.5rem] font-black tracking-tighter text-white font-['Plus_Jakarta_Sans'] uppercase leading-[0.88] select-none text-balance">
              ANIME<span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#f3f4f6] to-[#d4af37]/90">.VRS</span>
            </h1>

            {/* Editorial Series Name & Kicker */}
            <div className="mt-4 sm:mt-6 max-w-xl">
              <p className="text-sm sm:text-base font-bold uppercase tracking-[0.22em] text-[#d4af37] font-mono">
                {anime.title}
              </p>
              <p className="mt-2 text-base sm:text-xl font-light text-neutral-200 tracking-wide font-['Plus_Jakarta_Sans'] leading-relaxed">
                {t('hero_kicker')} — {anime.synopsis.slice(0, 140)}...
              </p>
            </div>

            {/* Action Buttons: Characteristic Chamfered Gold CTA & Secondary Watchlist */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              
              {/* Chamfered Gold Button (Dev_UN inspiration) */}
              <button
                onClick={handleWatchClick}
                className="group relative inline-flex items-center gap-3 px-8 py-4 bg-[#d4af37] text-[#0a0b0e] font-bold text-xs uppercase tracking-[0.2em] transition-all duration-300 hover:bg-[#e6c46a] hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] active:scale-[0.98] cursor-pointer"
                style={{
                  clipPath: 'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 0 100%)',
                }}
              >
                <Play className="w-4 h-4 fill-current" />
                <span>{t('hero_watch_now')}</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>

              {/* Secondary View Details */}
              <button
                onClick={() => navigate(`/anime/${anime.id}`)}
                className="px-6 py-4 bg-white/10 hover:bg-white/15 text-white font-medium text-xs uppercase tracking-[0.18em] border border-white/20 transition-all rounded-sm backdrop-blur-sm"
              >
                {t('hero_details')}
              </button>

              {/* Add to Watchlist Button */}
              <button
                onClick={handleWatchlistToggle}
                className={`p-4 border transition-all rounded-sm backdrop-blur-sm ${
                  inWatchlist
                    ? 'bg-[#d4af37]/20 border-[#d4af37] text-[#d4af37]'
                    : 'bg-white/5 border-white/15 text-neutral-300 hover:text-white hover:bg-white/10'
                }`}
                title={inWatchlist ? t('hero_in_watchlist') : t('hero_add_watchlist')}
                aria-label="Toggle watchlist"
              >
                {inWatchlist ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Right Column: Architectural Category Rail & Cursive Accent (Dev_UN template signature) */}
          <div className="hidden lg:flex lg:col-span-4 flex-col items-end justify-center space-y-12 pl-6">
            
            {/* Stacked Minimalist Categories */}
            <div className="flex flex-col items-end space-y-1 text-right">
              <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-neutral-400">
                CURATED SPECIFICATIONS
              </span>
              <div className="text-xs font-semibold uppercase tracking-wider text-neutral-200 mt-2 space-y-1">
                <p>STUDIO {anime.studios.join(' · ')}</p>
                <p>{anime.genres.join(' · ')}</p>
                <p>{t('hero_sound')}</p>
              </div>
            </div>

            {/* Cursive Signature Accent (Mirroring cursive 'interior design' in uploaded template) */}
            <div className="pt-8 pr-2">
              <span className="font-['Playfair_Display'] italic text-3xl xl:text-4xl text-[#d4af37]/90 font-light tracking-wide select-none drop-shadow-md">
                {t('hero_signature')}
              </span>
            </div>

            {/* Languages available pill-less text indicator */}
            <div className="text-right">
              <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">
                AVAILABLE AUDIO
              </p>
              <p className="text-xs text-neutral-300 font-medium mt-0.5">
                {anime.audioLanguages.slice(0, 4).join(' · ')}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Strip: Metadata Bar */}
        <div className="w-full pt-8 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-4 text-xs text-neutral-400">
          <div className="flex items-center gap-6">
            <span className="text-white font-medium">EPISODE 01 STREAMING NOW</span>
            <span className="hidden sm:inline" aria-hidden="true">·</span>
            <span className="hidden sm:inline">GENRES: {anime.genres.join(', ')}</span>
            <span className="hidden md:inline" aria-hidden="true">·</span>
            <span className="hidden md:inline">AGE RATING: {anime.ageRating || '16+'}</span>
          </div>

          <div className="flex items-center gap-4 text-[#d4af37] font-mono">
            <span>TOTAL EPISODES: {anime.episodesCount}</span>
          </div>
        </div>
      </div>
    </section>
  );
};
