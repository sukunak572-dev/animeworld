import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from '../context/RouterContext';
import { useWatch } from '../context/WatchContext';
import { useAuth } from '../context/AuthContext';
import { getTranslation } from '../lib/i18n';
import { AnimeCard } from '../components/AnimeCard';
import { Search, RotateCcw, Filter, Star } from 'lucide-react';

export const SearchPage: React.FC = () => {
  const { searchParams } = useRouter();
  const { animeCatalog } = useWatch();
  const { interfaceLanguage } = useAuth();
  const t = (key: string) => getTranslation(interfaceLanguage, key);

  const initialQuery = searchParams.get('q') || '';

  // Search & Filter State
  const [queryText, setQueryText] = useState(initialQuery);
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedSeason, setSelectedSeason] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedAudio, setSelectedAudio] = useState('All');
  const [selectedSubtitle, setSelectedSubtitle] = useState('All');
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('popular');

  useEffect(() => {
    const q = searchParams.get('q');
    if (q !== null) setQueryText(q);
  }, [searchParams]);

  // Unique lists for selectors
  const genresList = useMemo(() => {
    const s = new Set<string>();
    animeCatalog.forEach((a) => a.genres.forEach((g) => s.add(g)));
    return ['All', ...Array.from(s)];
  }, [animeCatalog]);

  const audioList = useMemo(() => {
    const s = new Set<string>();
    animeCatalog.forEach((a) => a.audioLanguages.forEach((al) => s.add(al)));
    return ['All', ...Array.from(s)];
  }, [animeCatalog]);

  const subtitleList = useMemo(() => {
    const s = new Set<string>();
    animeCatalog.forEach((a) => a.subtitleLanguages.forEach((sl) => s.add(sl)));
    return ['All', ...Array.from(s)];
  }, [animeCatalog]);

  // Filter evaluation
  const results = useMemo(() => {
    return animeCatalog
      .filter((a) => {
        // Query match
        if (queryText.trim()) {
          const q = queryText.toLowerCase();
          const matchTitle = a.title.toLowerCase().includes(q);
          const matchRomaji = a.romajiTitle?.toLowerCase().includes(q);
          const matchDesc = a.synopsis.toLowerCase().includes(q);
          const matchStudio = a.studios.some((s) => s.toLowerCase().includes(q));
          const matchGenre = a.genres.some((g) => g.toLowerCase().includes(q));
          if (!matchTitle && !matchRomaji && !matchDesc && !matchStudio && !matchGenre) {
            return false;
          }
        }

        if (selectedGenre !== 'All' && !a.genres.includes(selectedGenre)) return false;
        if (selectedYear !== 'All' && a.releaseYear.toString() !== selectedYear) return false;
        if (selectedSeason !== 'All' && a.season !== selectedSeason) return false;
        if (selectedType !== 'All' && a.type !== selectedType) return false;
        if (selectedStatus !== 'All' && a.status !== selectedStatus) return false;
        if (selectedAudio !== 'All' && !a.audioLanguages.includes(selectedAudio)) return false;
        if (selectedSubtitle !== 'All' && !a.subtitleLanguages.includes(selectedSubtitle)) return false;
        if (minRating > 0 && a.rating < minRating) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'popular') return b.ratingCount - a.ratingCount;
        if (sortBy === 'newest') return b.releaseYear - a.releaseYear;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'alpha') return a.title.localeCompare(b.title);
        return 0;
      });
  }, [
    animeCatalog,
    queryText,
    selectedGenre,
    selectedYear,
    selectedSeason,
    selectedType,
    selectedStatus,
    selectedAudio,
    selectedSubtitle,
    minRating,
    sortBy,
  ]);

  const handleReset = () => {
    setQueryText('');
    setSelectedGenre('All');
    setSelectedYear('All');
    setSelectedSeason('All');
    setSelectedType('All');
    setSelectedStatus('All');
    setSelectedAudio('All');
    setSelectedSubtitle('All');
    setMinRating(0);
    setSortBy('popular');
  };

  return (
    <div className="w-full bg-[#0a0b0e] text-white min-h-screen py-10 px-4 sm:px-6 lg:px-12">
      <div className="max-w-[1440px] mx-auto space-y-8">
        
        {/* Header Search Box */}
        <div className="p-6 sm:p-8 bg-[#12141a] border border-white/10 rounded-lg shadow-xl">
          <span className="text-xs uppercase font-mono tracking-[0.25em] text-[#d4af37] font-semibold">
            EXPLORATION ARCHIVE
          </span>
          <h1 className="text-2xl sm:text-4xl font-bold uppercase tracking-tight text-white font-['Cinzel'] mt-1">
            Search Anime Catalog
          </h1>

          <div className="relative mt-4">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-neutral-400" />
            <input
              type="text"
              value={queryText}
              onChange={(e) => setQueryText(e.target.value)}
              placeholder="Search by title, romaji, character, studio, or genre..."
              className="w-full pl-12 pr-4 py-3 bg-neutral-900 border border-white/15 rounded text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#d4af37]"
            />
          </div>
        </div>

        {/* Layout: Sidebar Filters + Results Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Filters Sidebar */}
          <div className="lg:col-span-3 space-y-5 bg-[#12141a] p-5 rounded-lg border border-white/10 h-fit">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-xs font-mono uppercase tracking-wider text-white font-semibold flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>Filters & Sorting</span>
              </span>
              <button
                onClick={handleReset}
                className="text-[11px] text-neutral-400 hover:text-[#d4af37] flex items-center gap-1 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            {/* Genre */}
            <div className="space-y-1">
              <label className="text-[11px] font-mono uppercase text-neutral-400">Genre</label>
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="w-full bg-neutral-900 text-xs text-white p-2 rounded border border-white/10 focus:outline-none focus:border-[#d4af37]"
              >
                {genresList.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            {/* Format (Series/Movie) */}
            <div className="space-y-1">
              <label className="text-[11px] font-mono uppercase text-neutral-400">Format</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full bg-neutral-900 text-xs text-white p-2 rounded border border-white/10 focus:outline-none"
              >
                <option value="All">All Formats</option>
                <option value="Series">Series</option>
                <option value="Movie">Movie</option>
              </select>
            </div>

            {/* Audio Language */}
            <div className="space-y-1">
              <label className="text-[11px] font-mono uppercase text-neutral-400">Available Audio</label>
              <select
                value={selectedAudio}
                onChange={(e) => setSelectedAudio(e.target.value)}
                className="w-full bg-neutral-900 text-xs text-white p-2 rounded border border-white/10 focus:outline-none"
              >
                {audioList.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>

            {/* Subtitle Language */}
            <div className="space-y-1">
              <label className="text-[11px] font-mono uppercase text-neutral-400">Available Subtitle</label>
              <select
                value={selectedSubtitle}
                onChange={(e) => setSelectedSubtitle(e.target.value)}
                className="w-full bg-neutral-900 text-xs text-white p-2 rounded border border-white/10 focus:outline-none"
              >
                {subtitleList.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Min Rating */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-mono uppercase text-neutral-400">
                <span>Min Rating</span>
                <span className="text-[#d4af37]">★ {minRating > 0 ? minRating : 'Any'}</span>
              </div>
              <input
                type="range"
                min={0}
                max={9.5}
                step={0.5}
                value={minRating}
                onChange={(e) => setMinRating(parseFloat(e.target.value))}
                className="w-full accent-[#d4af37]"
              />
            </div>

            {/* Sort */}
            <div className="space-y-1 pt-2 border-t border-white/10">
              <label className="text-[11px] font-mono uppercase text-neutral-400">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-neutral-900 text-xs text-white p-2 rounded border border-white/10 focus:outline-none"
              >
                <option value="popular">{t('sort_popular')}</option>
                <option value="rating">{t('sort_rating')}</option>
                <option value="newest">{t('sort_newest')}</option>
                <option value="alpha">{t('sort_alpha')}</option>
              </select>
            </div>
          </div>

          {/* Results Output */}
          <div className="lg:col-span-9 space-y-6">
            <div className="flex items-center justify-between text-xs text-neutral-400 font-mono">
              <span>
                Found <strong className="text-white">{results.length}</strong> matching anime
              </span>
            </div>

            {results.length === 0 ? (
              <div className="py-20 text-center bg-[#12141a] rounded-lg border border-white/10 p-8 space-y-3">
                <p className="text-base text-neutral-300">No anime titles match your search criteria.</p>
                <button
                  onClick={handleReset}
                  className="px-4 py-2 bg-[#d4af37] text-black text-xs font-bold uppercase rounded"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map((anime) => (
                  <AnimeCard key={anime.id} anime={anime} aspect="portrait" />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
