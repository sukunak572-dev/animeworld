import React from 'react';
import { useRouter } from '../context/RouterContext';
import { useWatch } from '../context/WatchContext';
import { useAuth } from '../context/AuthContext';
import { Bookmark, Play, Trash2, ArrowRight } from 'lucide-react';

export const WatchlistPage: React.FC = () => {
  const { navigate } = useRouter();
  const { watchlist, removeFromWatchlist, animeCatalog } = useWatch();
  const { currentUser, signInWithGoogle } = useAuth();

  return (
    <div className="w-full bg-[#0a0b0e] text-white min-h-screen py-12 px-4 sm:px-6 lg:px-12">
      <div className="max-w-[1440px] mx-auto space-y-8">
        
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <span className="text-xs uppercase font-mono tracking-[0.25em] text-[#d4af37] font-semibold flex items-center gap-2">
              <Bookmark className="w-3.5 h-3.5" />
              <span>SAVED COLLECTION</span>
            </span>
            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white font-['Cinzel'] mt-1">
              Your Watchlist
            </h1>
            <p className="text-xs text-neutral-400 mt-2 font-light">
              {currentUser
                ? 'Synced to your cloud account for multi-device playback.'
                : 'Stored locally. Sign in with Google to synchronize across devices.'}
            </p>
          </div>

          {!currentUser && (
            <button
              onClick={() => signInWithGoogle()}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded border border-white/15"
            >
              Sign In to Sync
            </button>
          )}
        </div>

        {watchlist.length === 0 ? (
          <div className="py-24 text-center bg-[#12141a] rounded-lg border border-white/10 p-8 space-y-4">
            <Bookmark className="w-12 h-12 text-neutral-600 mx-auto" />
            <h3 className="text-lg font-bold text-white">Your Watchlist is Empty</h3>
            <p className="text-xs text-neutral-400 max-w-sm mx-auto">
              Save anime series and theatrical films while browsing to easily access them later.
            </p>
            <button
              onClick={() => navigate('/library')}
              className="px-6 py-3 bg-[#d4af37] text-black text-xs font-bold uppercase tracking-wider rounded hover:bg-[#e6c46a] transition-all"
            >
              Browse Anime Library
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {watchlist.map((item) => {
              const anime = animeCatalog.find((a) => a.id === item.animeId);
              return (
                <div
                  key={item.id}
                  className="group relative bg-[#12141a] border border-white/[0.08] rounded overflow-hidden hover:border-[#d4af37]/50 transition-all flex flex-col"
                >
                  <div
                    onClick={() => navigate(`/anime/${item.animeId}`)}
                    className="relative aspect-[16/9] w-full overflow-hidden cursor-pointer"
                  >
                    <img
                      src={item.posterImage}
                      alt={item.animeTitle}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-10 h-10 rounded-full bg-[#d4af37] text-black flex items-center justify-center shadow-lg">
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400">
                        <span>{item.type}</span>
                        <span className="text-[#d4af37]">★ {item.rating}</span>
                      </div>
                      <h4
                        onClick={() => navigate(`/anime/${item.animeId}`)}
                        className="text-sm font-bold text-white group-hover:text-[#d4af37] transition-colors truncate mt-1 cursor-pointer"
                      >
                        {item.animeTitle}
                      </h4>
                    </div>

                    <div className="pt-4 flex items-center justify-between border-t border-white/5 mt-4">
                      <button
                        onClick={() => {
                          const firstEp = anime?.episodes[0]?.id || 'ep1';
                          navigate(`/watch/${item.animeId}/${firstEp}`);
                        }}
                        className="text-xs text-[#d4af37] hover:underline flex items-center gap-1 font-semibold"
                      >
                        <span>Watch Now</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>

                      <button
                        onClick={() => removeFromWatchlist(item.animeId)}
                        className="p-1.5 text-neutral-400 hover:text-red-400 rounded transition-colors"
                        title="Remove from watchlist"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
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
