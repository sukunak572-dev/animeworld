import React from 'react';
import { useRouter } from '../context/RouterContext';
import { useWatch } from '../context/WatchContext';
import { AnimeCard } from '../components/AnimeCard';
import { Film } from 'lucide-react';

export const MoviesPage: React.FC = () => {
  const { navigate } = useRouter();
  const { animeCatalog } = useWatch();

  const movies = animeCatalog.filter((a) => a.type === 'Movie');

  return (
    <div className="w-full bg-[#0a0b0e] text-white min-h-screen py-12 px-4 sm:px-6 lg:px-12">
      <div className="max-w-[1440px] mx-auto space-y-10">
        
        <div className="border-b border-white/10 pb-6">
          <span className="text-xs uppercase font-mono tracking-[0.25em] text-[#d4af37] font-semibold flex items-center gap-2">
            <Film className="w-3.5 h-3.5" />
            <span>THEATRICAL VAULT</span>
          </span>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white font-['Cinzel'] mt-1">
            Anime Feature Movies
          </h1>
          <p className="text-xs text-neutral-400 mt-2 max-w-xl font-light">
            Award-winning theatrical animations mastered in ultra-high bitrate 4K video and lossless multi-channel soundscapes.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {movies.map((movie) => (
            <div key={movie.id} className="space-y-3">
              <AnimeCard anime={movie} aspect="landscape" />
              <div className="text-xs text-neutral-300 font-light leading-relaxed">
                {movie.synopsis.slice(0, 120)}...
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
