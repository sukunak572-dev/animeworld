import React, { useState, useMemo } from 'react';
import { useRouter } from '../context/RouterContext';
import { useWatch } from '../context/WatchContext';
import { useAuth } from '../context/AuthContext';
import { getTranslation } from '../lib/i18n';
import { AnimeCard } from '../components/AnimeCard';
import { Filter, SlidersHorizontal, Grid, Search } from 'lucide-react';

export const LibraryPage: React.FC = () => {
  const { navigate } = useRouter();
  const { animeCatalog } = useWatch();
  const { interfaceLanguage } = useAuth();
  const t = (key: string) => getTranslation(interfaceLanguage, key);

  // Filter states
  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedSort, setSelectedSort] = useState<string>('popular');
  const [searchFilter, setSearchFilter] = useState<string>('');

  // Extract all unique genres
  const allGenres = useMemo(() => {
    const set = new Set<string>();
    animeCatalog.forEach((a) => a.genres.forEach((g) => set.add(g)));
    return ['All', ...Array.from(set)];
  }, [animeCatalog]);

  // Filtered and sorted anime
  const filteredAnime = useMemo(() => {
    return animeCatalog
      .filter((a) => {
        if (selectedGenre !== 'All' && !a.genres.includes(selectedGenre)) return false;
        if (selectedType !== 'All' && a.type !== selectedType) return false;
        if (selectedStatus !== 'All' && a.status !== selectedStatus) return false;
        if (searchFilter.trim()) {
          const q = searchFilter.toLowerCase();
          const matchTitle = a.title.toLowerCase().includes(q);
          const matchRomaji = a.romajiTitle?.toLowerCase().includes(q);
          const matchGenre = a.genres.some((g) => g.toLowerCase().includes(q));
          if (!matchTitle && !matchRomaji && !matchGenre) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (selectedSort === 'popular') return b.ratingCount - a.ratingCount;
        if (selectedSort === 'newest') return b.releaseYear - a.releaseYear;
        if (selectedSort === 'rating') return b.rating - a.rating;
        if (selectedSort === 'alpha') return a.title.localeCompare(b.title);
        return 0;
      });
  }, [animeCatalog, selectedGenre, selectedType, selectedStatus, selectedSort, searchFilter]);

  return (
    <div className="w-full bg-[#0a0b0e] text-white min-h-screen">
      
      {/* Header Banner */}
      <div className="border-b border-white/[0.08] bg-[#0d0f14] py-12 px-4 sm:px-6 lg:px-12">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="text-xs uppercase font-mono tracking-[0.25em] text-[#d4af37] font-semibold">
              COMPLETE CATALOG
            </span>
            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white font-['Cinzel'] mt-1">
              Anime Library
            </h1>
            <p className="text-xs text-neutral-400 mt-2 max-w-xl">
              Browse our complete vault of masterfully curated anime series, original video animations, and theatrical features.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-neutral-400">
              Showing <strong className="text-white">{filteredAnime.length}</strong> of {animeCatalog.length} titles
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="sticky top-20 z-30 bg-[#0a0b0e]/95 backdrop-blur-md border-b border-white/[0.08] py-4 px-4 sm:px-6 lg:px-12">
        <div className="max-w-[1440px] mx-auto flex flex-wrap items-center justify-between gap-4">
          
          {/* Quick Search */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-neutral-500" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Filter by title or tag..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-neutral-900 border border-white/10 rounded text-white focus:outline-none focus:border-[#d4af37]"
            />
          </div>

          {/* Interactive Filter Controls (Segmented Tabs) */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            
            {/* Format Filter */}
            <div className="flex items-center gap-1 p-0.5 bg-neutral-900 rounded border border-white/10">
              {['All', 'Series', 'Movie'].map((format) => (
                <button
                  key={format}
                  onClick={() => setSelectedType(format)}
                  className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                    selectedType === format
                      ? 'bg-[#d4af37] text-black font-semibold'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {format}
                </button>
              ))}
            </div>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-neutral-900 text-neutral-300 text-xs rounded border border-white/10 px-3 py-1.5 focus:outline-none focus:border-[#d4af37]"
            >
              <option value="All">All Statuses</option>
              <option value="Ongoing">Ongoing Broadcast</option>
              <option value="Completed">Completed</option>
            </select>

            {/* Sort Order */}
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className="bg-neutral-900 text-neutral-300 text-xs rounded border border-white/10 px-3 py-1.5 focus:outline-none focus:border-[#d4af37]"
            >
              <option value="popular">{t('sort_popular')}</option>
              <option value="rating">{t('sort_rating')}</option>
              <option value="newest">{t('sort_newest')}</option>
              <option value="alpha">{t('sort_alpha')}</option>
            </select>
          </div>
        </div>

        {/* Genre Pill-less Strip */}
        <div className="max-w-[1440px] mx-auto flex items-center gap-2 overflow-x-auto py-2.5 mt-2 scrollbar-none text-xs">
          <span className="text-neutral-500 font-mono text-[11px] uppercase mr-1 shrink-0">Genre:</span>
          {allGenres.map((g) => (
            <button
              key={g}
              onClick={() => setSelectedGenre(g)}
              className={`px-3 py-1 rounded-sm whitespace-nowrap shrink-0 transition-colors ${
                selectedGenre === g
                  ? 'bg-white/15 text-[#d4af37] font-semibold border border-[#d4af37]/40'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid View */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-12">
        {filteredAnime.length === 0 ? (
          <div className="py-20 text-center space-y-3">
            <p className="text-base text-neutral-400">{t('no_results')}</p>
            <button
              onClick={() => {
                setSelectedGenre('All');
                setSelectedType('All');
                setSelectedStatus('All');
                setSearchFilter('');
              }}
              className="px-4 py-2 bg-[#d4af37] text-black text-xs font-bold uppercase rounded"
            >
              {t('reset_filters')}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredAnime.map((anime) => (
              <AnimeCard key={anime.id} anime={anime} aspect="portrait" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
