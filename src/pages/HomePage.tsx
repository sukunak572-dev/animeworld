import React from 'react';
import { useRouter } from '../context/RouterContext';
import { useWatch } from '../context/WatchContext';
import { useAuth } from '../context/AuthContext';
import { getTranslation } from '../lib/i18n';
import { HeroSection } from '../components/HeroSection';
import { AnimeCard } from '../components/AnimeCard';
import { Anime } from '../types';
import {
  ChevronRight,
  TrendingUp,
  Flame,
  Clock,
  Sparkles,
  Trophy,
  ArrowRight,
  Globe,
  Film,
  Play,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { navigate } = useRouter();
  const { animeCatalog, categories, history } = useWatch();
  const { interfaceLanguage } = useAuth();
  const t = (key: string) => getTranslation(interfaceLanguage, key);

  // Featured anime for hero
  const heroAnime =
    animeCatalog.find((a) => a.isFeatured) || animeCatalog[0];

  // Sliced sections
  const trendingAnime = animeCatalog.filter((a) => a.isTrending);
  const popularAnime = animeCatalog.filter((a) => a.isPopular);
  const movieAnime = animeCatalog.filter((a) => a.type === 'Movie');
  const seriesAnime = animeCatalog.filter((a) => a.type === 'Series');

  // Top 10 leaderboard sorted by rating
  const top10Anime = [...animeCatalog].sort((a, b) => b.rating - a.rating).slice(0, 10);

  // Continue watching items
  const continueWatchingItems = history.filter((h) => !h.completed).slice(0, 4);

  return (
    <div className="w-full flex flex-col bg-[#0a0b0e] text-white overflow-hidden">
      
      {/* 1. Cinematic Editorial Hero Section */}
      {heroAnime && <HeroSection anime={heroAnime} />}

      {/* 2. Continue Watching (if any history) */}
      {continueWatchingItems.length > 0 && (
        <section className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-12 py-10 border-b border-white/[0.06]">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-[#d4af37]" />
              <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-wide font-['Cinzel']">
                {t('sec_continue_watching')}
              </h2>
            </div>
            <button
              onClick={() => navigate('/history')}
              className="text-xs uppercase font-mono tracking-wider text-neutral-400 hover:text-white flex items-center gap-1"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {continueWatchingItems.map((item) => {
              const anime = animeCatalog.find((a) => a.id === item.animeId);
              const progressPct = Math.min(100, Math.floor((item.progressSeconds / (item.totalSeconds || 1400)) * 100));

              return (
                <div
                  key={item.id}
                  onClick={() => navigate(`/watch/${item.animeId}/${item.episodeId}`)}
                  className="group relative bg-[#12141a] border border-white/[0.08] rounded overflow-hidden cursor-pointer hover:border-[#d4af37]/50 transition-all"
                >
                  <div className="relative aspect-video w-full overflow-hidden">
                    <img
                      src={item.thumbnail}
                      alt={item.animeTitle}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-10 h-10 rounded-full bg-[#d4af37] text-black flex items-center justify-center shadow-lg">
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                      </div>
                    </div>
                    {/* Progress Bar */}
                    <div className="absolute bottom-0 inset-x-0 h-1 bg-black/60">
                      <div
                        className="h-full bg-[#d4af37]"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="text-xs text-[#d4af37] font-mono">Episode {item.episodeNumber}</p>
                    <h4 className="text-sm font-semibold text-white truncate mt-0.5">{item.animeTitle}</h4>
                    <p className="text-[11px] text-neutral-400 truncate">{item.episodeTitle}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 3. Trending Anime Carousel Section */}
      <section className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-12 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-[#d4af37] mb-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Worldwide Buzz</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white font-['Cinzel']">
              {t('sec_trending')}
            </h2>
            <p className="text-xs text-neutral-400 mt-1 max-w-xl">
              {t('sec_trending_sub')}
            </p>
          </div>
          <button
            onClick={() => navigate('/library')}
            className="hidden sm:flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-neutral-400 hover:text-white transition-colors"
          >
            <span>See Library</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {trendingAnime.map((anime) => (
            <AnimeCard key={anime.id} anime={anime} aspect="landscape" />
          ))}
        </div>
      </section>

      {/* 4. Editorial Split Spotlight (Dev_UN inspired editorial section with white/charcoal contrast) */}
      <section className="w-full bg-[#f8f9fa] text-[#0a0b0e] py-20 px-4 sm:px-6 lg:px-12 border-y border-neutral-300">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs uppercase font-mono tracking-[0.25em] text-[#b38600] font-bold">
              THE CINEMATIC MANIFESTO
            </span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light font-['Playfair_Display'] leading-[1.05] tracking-tight text-neutral-900">
              Where high animation becomes <span className="italic font-normal">pure art</span>.
            </h2>
            <p className="text-base text-neutral-600 font-light leading-relaxed max-w-xl">
              ANIMEVERSE strips away low-bitrate compression, commercial distractions, and generic interfaces. Every title in our archive is hand-curated and mastered with Dolby Atmos multi-track acoustics, providing uncompromised fidelity from studio canvas straight to your screen.
            </p>

            <div className="pt-4 grid grid-cols-3 gap-6 border-t border-neutral-300 text-neutral-800">
              <div>
                <p className="text-2xl sm:text-3xl font-bold font-mono text-[#0a0b0e]">12</p>
                <p className="text-[11px] uppercase tracking-wider text-neutral-500 font-mono mt-0.5">Languages</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-bold font-mono text-[#0a0b0e]">4K</p>
                <p className="text-[11px] uppercase tracking-wider text-neutral-500 font-mono mt-0.5">Ultra Master</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-bold font-mono text-[#0a0b0e]">7.1</p>
                <p className="text-[11px] uppercase tracking-wider text-neutral-500 font-mono mt-0.5">Surround Sound</p>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => navigate('/library')}
                className="px-6 py-3.5 bg-[#0a0b0e] text-white hover:bg-neutral-800 text-xs uppercase tracking-[0.2em] font-semibold transition-all"
              >
                Explore The Complete Archive
              </button>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="aspect-[4/3] rounded overflow-hidden shadow-2xl relative">
              <img
                src={heroAnime?.bannerImage}
                alt="Editorial Anime Spotlight"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 border border-black/10" />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white border border-neutral-200 p-4 shadow-xl hidden sm:block max-w-xs">
              <p className="text-xs font-mono text-neutral-500 uppercase tracking-widest">CURATOR’S PICK</p>
              <p className="text-sm font-bold text-neutral-900 mt-1">{heroAnime?.title}</p>
              <p className="text-xs text-neutral-600 mt-0.5">Score: ★ {heroAnime?.rating} · Directed by {heroAnime?.director || 'Visionary Masters'}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Popular Anime Section */}
      <section className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-12 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-[#d4af37] mb-1">
              <Flame className="w-3.5 h-3.5" />
              <span>Curated Gems</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white font-['Cinzel']">
              {t('sec_popular')}
            </h2>
            <p className="text-xs text-neutral-400 mt-1 max-w-xl">
              {t('sec_popular_sub')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {popularAnime.map((anime) => (
            <AnimeCard key={anime.id} anime={anime} aspect="landscape" />
          ))}
        </div>
      </section>

      {/* 6. Top 10 Global Leaderboard Section */}
      <section className="w-full bg-[#0d0f14] py-16 px-4 sm:px-6 lg:px-12 border-t border-white/[0.06]">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Trophy className="w-6 h-6 text-[#d4af37]" />
              <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white font-['Cinzel']">
                {t('sec_top10')}
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {top10Anime.slice(0, 5).map((anime, idx) => (
              <div
                key={anime.id}
                onClick={() => navigate(`/anime/${anime.id}`)}
                className="group relative flex items-center gap-4 p-3 bg-neutral-900/60 border border-white/[0.06] rounded hover:border-[#d4af37]/40 transition-all cursor-pointer"
              >
                {/* Massive Styled Rank Number */}
                <span className="text-4xl lg:text-5xl font-black font-mono text-white/20 group-hover:text-[#d4af37] transition-colors leading-none shrink-0 w-12 text-center">
                  0{idx + 1}
                </span>

                <img
                  src={anime.posterImage}
                  alt={anime.title}
                  className="w-16 h-20 object-cover rounded shrink-0 border border-white/10"
                />

                <div className="min-w-0">
                  <h4 className="text-sm font-semibold text-white truncate group-hover:text-[#d4af37] transition-colors">
                    {anime.title}
                  </h4>
                  <p className="text-xs text-neutral-400 font-mono mt-0.5">★ {anime.rating}</p>
                  <p className="text-[11px] text-neutral-500 truncate mt-0.5">{anime.genres[0]} · {anime.releaseYear}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Anime By Genre Spotlight */}
      <section className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-12 py-16">
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white font-['Cinzel']">
            {t('sec_genre_spotlight')}
          </h2>
          <p className="text-xs text-neutral-400 mt-1">Explore specialized cinematic anime genres.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => navigate(`/categories/${cat.slug}`)}
              className="group relative aspect-[3/4] rounded overflow-hidden bg-neutral-900 border border-white/[0.08] cursor-pointer hover:border-[#d4af37]/50 transition-all"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 brightness-75"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-3 flex flex-col justify-end">
                <span className="text-[10px] font-mono text-[#d4af37] uppercase">{cat.count} Titles</span>
                <h4 className="text-sm font-bold text-white tracking-wide">{cat.name}</h4>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. Movies Showcase Banner */}
      <section className="w-full bg-[#12141a] py-16 px-4 sm:px-6 lg:px-12 border-t border-white/[0.08]">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-[#d4af37]">
              <Film className="w-4 h-4" />
              <span>Feature Length Cinema</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold uppercase tracking-tight text-white font-['Cinzel']">
              Theatrical Anime Feature Films
            </h2>
            <p className="text-xs text-neutral-300 leading-relaxed font-light">
              Experience unbroken feature-length anime masterworks with extended theatrical cuts, commentary tracks, and lossless 7.1 audio mastering.
            </p>
            <button
              onClick={() => navigate('/movies')}
              className="mt-2 px-6 py-3 bg-[#d4af37] text-black font-bold text-xs uppercase tracking-wider hover:bg-[#e6c46a] transition-all"
            >
              Explore Anime Movies
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
            {movieAnime.slice(0, 2).map((m) => (
              <div
                key={m.id}
                onClick={() => navigate(`/anime/${m.id}`)}
                className="w-40 sm:w-48 aspect-[3/4] rounded overflow-hidden relative border border-white/10 group cursor-pointer"
              >
                <img
                  src={m.posterImage}
                  alt={m.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2.5">
                  <p className="text-xs font-bold text-white truncate">{m.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
