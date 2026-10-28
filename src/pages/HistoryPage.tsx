import React from 'react';
import { useRouter } from '../context/RouterContext';
import { useWatch } from '../context/WatchContext';
import { Clock, Play, RotateCcw, CheckCircle2 } from 'lucide-react';

export const HistoryPage: React.FC = () => {
  const { navigate } = useRouter();
  const { history, animeCatalog } = useWatch();

  return (
    <div className="w-full bg-[#0a0b0e] text-white min-h-screen py-12 px-4 sm:px-6 lg:px-12">
      <div className="max-w-[1440px] mx-auto space-y-8">
        
        <div className="border-b border-white/10 pb-6">
          <span className="text-xs uppercase font-mono tracking-[0.25em] text-[#d4af37] font-semibold flex items-center gap-2">
            <Clock className="w-3.5 h-3.5" />
            <span>PLAYBACK LOG</span>
          </span>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white font-['Cinzel'] mt-1">
            Viewing History
          </h1>
          <p className="text-xs text-neutral-400 mt-2 font-light">
            Resume recently played anime chapters and feature films from where you left off.
          </p>
        </div>

        {history.length === 0 ? (
          <div className="py-24 text-center bg-[#12141a] rounded-lg border border-white/10 p-8 space-y-4">
            <Clock className="w-12 h-12 text-neutral-600 mx-auto" />
            <h3 className="text-lg font-bold text-white">No Viewing History Yet</h3>
            <p className="text-xs text-neutral-400 max-w-sm mx-auto">
              Episodes you stream will appear here with your exact progress recorded.
            </p>
            <button
              onClick={() => navigate('/library')}
              className="px-6 py-3 bg-[#d4af37] text-black text-xs font-bold uppercase tracking-wider rounded hover:bg-[#e6c46a] transition-all"
            >
              Start Streaming
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {history.map((item) => {
              const progressPct = Math.min(100, Math.floor((item.progressSeconds / (item.totalSeconds || 1400)) * 100));
              const mins = Math.floor(item.progressSeconds / 60);

              return (
                <div
                  key={item.id}
                  onClick={() => navigate(`/watch/${item.animeId}/${item.episodeId}`)}
                  className="group bg-[#12141a] border border-white/[0.08] rounded overflow-hidden cursor-pointer hover:border-[#d4af37]/50 transition-all flex flex-col"
                >
                  <div className="relative aspect-video w-full overflow-hidden bg-neutral-900">
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
                      <div className="h-full bg-[#d4af37]" style={{ width: `${progressPct}%` }} />
                    </div>
                  </div>

                  <div className="p-4 space-y-1">
                    <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
                      <span className="text-[#d4af37]">Ep {item.episodeNumber}</span>
                      <span>{item.completed ? 'Finished' : `${mins}m in (${progressPct}%)`}</span>
                    </div>
                    <h3 className="text-sm font-bold text-white group-hover:text-[#d4af37] transition-colors truncate">
                      {item.animeTitle}
                    </h3>
                    <p className="text-xs text-neutral-400 truncate">{item.episodeTitle}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
