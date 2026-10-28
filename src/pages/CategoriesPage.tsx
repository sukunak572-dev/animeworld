import React from 'react';
import { useRouter } from '../context/RouterContext';
import { useWatch } from '../context/WatchContext';
import { AnimeCard } from '../components/AnimeCard';
import { ArrowLeft, Compass } from 'lucide-react';

export const CategoriesPage: React.FC = () => {
  const { params, navigate, goBack } = useRouter();
  const { categories, animeCatalog } = useWatch();

  const selectedSlug = params.slug;
  const activeCategory = categories.find((c) => c.slug === selectedSlug);

  // If a category slug is active, show filtered anime
  if (activeCategory) {
    const matchingAnime = animeCatalog.filter((a) =>
      a.genres.some((g) => g.toLowerCase().includes(activeCategory.slug.toLowerCase()) || activeCategory.name.toLowerCase().includes(g.toLowerCase()))
    );

    return (
      <div className="w-full bg-[#0a0b0e] text-white min-h-screen py-12 px-4 sm:px-6 lg:px-12">
        <div className="max-w-[1440px] mx-auto space-y-8">
          <button
            onClick={() => navigate('/categories')}
            className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-neutral-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>All Categories</span>
          </button>

          <div className="border-b border-white/10 pb-6">
            <span className="text-xs uppercase font-mono tracking-[0.25em] text-[#d4af37] font-semibold">
              GENRE SPOTLIGHT
            </span>
            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white font-['Cinzel'] mt-1">
              {activeCategory.name}
            </h1>
            <p className="text-sm text-neutral-300 mt-2 max-w-xl font-light">
              {activeCategory.description}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {matchingAnime.map((anime) => (
              <AnimeCard key={anime.id} anime={anime} aspect="portrait" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#0a0b0e] text-white min-h-screen py-12 px-4 sm:px-6 lg:px-12">
      <div className="max-w-[1440px] mx-auto space-y-10">
        
        <div className="border-b border-white/10 pb-6">
          <span className="text-xs uppercase font-mono tracking-[0.25em] text-[#d4af37] font-semibold flex items-center gap-2">
            <Compass className="w-3.5 h-3.5" />
            <span>GENRE TAXONOMY</span>
          </span>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white font-['Cinzel'] mt-1">
            Browse by Category
          </h1>
          <p className="text-xs text-neutral-400 mt-2 max-w-xl font-light">
            Navigate through cinematic traditions, from high fantasy to hard cyberpunk.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => navigate(`/categories/${cat.slug}`)}
              className="group relative h-64 rounded-lg overflow-hidden bg-neutral-900 border border-white/10 cursor-pointer hover:border-[#d4af37]/60 transition-all shadow-xl"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 brightness-[0.7]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <span className="text-xs font-mono text-[#d4af37] uppercase">{cat.count} Masterpieces</span>
                <h3 className="text-2xl font-bold uppercase tracking-tight text-white font-['Cinzel'] mt-0.5">
                  {cat.name}
                </h3>
                <p className="text-xs text-neutral-300 line-clamp-2 mt-1 font-light">
                  {cat.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
