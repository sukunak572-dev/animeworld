import React from 'react';
import { useRouter } from '../context/RouterContext';
import { useWatch } from '../context/WatchContext';
import { Play, Clock, Sparkles } from 'lucide-react';

export const LatestEpisodesPage: React.FC = () => {
  const { navigate } = useRouter();
  const { animeCatalog } = useWatch();

  // Aggregate all episodes across anime
  const allEpisodes = animeCatalog.flatMap((anime) =>
    anime.episodes.map((ep) => ({
      ...ep,
      animeTitle: anime.title,
      animePoster: anime.posterImage,
      animeRating: anime.rating,
      animeGenres: anime.genres,
    }))
  );

  return (
    <div className="w-full bg-[#0a0b0e] text-white min-h-screen py-12 px-4 sm:px-6 lg:px-12">
      <div className="max-w-[1440px] mx-auto space-y-10">
        
        <div className="border-b border-white/10 pb-6">
          <span className="text-xs uppercase font-mono tracking-[0.25em] text-[#d4af37] font-semibold flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>SIMULCAST STREAM</span>
          </span>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white font-['Cinzel'] mt-1">
            Latest Episode Releases
          </h1>
          <p className="text-xs text-neutral-400 mt-2 max-w-xl font-light">
            Newly broadcast episodes updated in real time from Tokyo broadcast networks with synchronized subtitling.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {allEpisodes.map((ep) => (
            <div
              key={ep.id}
              onClick={() => navigate(`/watch/${ep.animeId}/${ep.id}`)}
              className="group bg-[#12141a] border border-white/[0.08] rounded overflow-hidden cursor-pointer hover:border-[#d4af37]/60 transition-all shadow-lg"
            >
              <div className="relative aspect-video w-full overflow-hidden bg-neutral-900">
                <img
                  src={ep.thumbnail || ep.animePoster}
                  alt={ep.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-10 h-10 rounded-full bg-[#d4af37] text-black flex items-center justify-center shadow-lg">
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  </div>
                </div>
                <span className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/80 rounded text-[10px] font-mono text-white">
                  {Math.floor(ep.duration / 60)} min
                </span>
                <span className="absolute top-2 left-2 px-2 py-0.5 bg-[#d4af37] text-black font-mono font-bold text-[10px] rounded">
                  NEW
                </span>
              </div>

              <div className="p-4 space-y-1">
                <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
                  <span className="text-[#d4af37]">Episode {ep.episodeNumber}</span>
                  <span>{ep.airDate}</span>
                </div>
                <h3 className="text-sm font-bold text-white group-hover:text-[#d4af37] transition-colors truncate">
                  {ep.animeTitle}
                </h3>
                <p className="text-xs text-neutral-400 truncate">{ep.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
