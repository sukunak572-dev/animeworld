import React, { useState } from 'react';
import { useRouter } from '../context/RouterContext';
import { useWatch } from '../context/WatchContext';
import { AnimeCard } from '../components/AnimeCard';
import { Calendar } from 'lucide-react';

export const SeasonsPage: React.FC = () => {
  const { navigate } = useRouter();
  const { animeCatalog } = useWatch();

  const [selectedSeason, setSelectedSeason] = useState<string>('Fall 2026');

  const seasonsList = ['Fall 2026', 'Summer 2026', 'Spring 2026', 'Winter 2025'];

  const filtered = animeCatalog.filter((a) => {
    const key = `${a.season} ${a.releaseYear}`;
    return key === selectedSeason;
  });

  return (
    <div className="w-full bg-[#0a0b0e] text-white min-h-screen py-12 px-4 sm:px-6 lg:px-12">
      <div className="max-w-[1440px] mx-auto space-y-10">
        
        <div className="border-b border-white/10 pb-6">
          <span className="text-xs uppercase font-mono tracking-[0.25em] text-[#d4af37] font-semibold flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5" />
            <span>SEASONAL ARCHIVE</span>
          </span>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white font-['Cinzel'] mt-1">
            Browse by Season
          </h1>
          <p className="text-xs text-neutral-400 mt-2 max-w-xl font-light">
            Chronological broadcasting archive organized by seasonal quarterly premiere blocks.
          </p>
        </div>

        {/* Season Selector Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-4">
          {seasonsList.map((season) => (
            <button
              key={season}
              onClick={() => setSelectedSeason(season)}
              className={`px-5 py-2 text-xs uppercase font-mono tracking-wider rounded transition-colors ${
                selectedSeason === season
                  ? 'bg-[#d4af37] text-black font-bold'
                  : 'bg-white/5 hover:bg-white/10 text-neutral-300'
              }`}
            >
              {season}
            </button>
          ))}
        </div>

        {/* Grid Output */}
        {filtered.length === 0 ? (
          <div className="py-20 text-center text-neutral-400">
            No anime found for {selectedSeason}.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtered.map((anime) => (
              <AnimeCard key={anime.id} anime={anime} aspect="portrait" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
