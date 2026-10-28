import React, { useState } from 'react';
import { useRouter } from '../context/RouterContext';
import { useWatch } from '../context/WatchContext';
import { AnimeCard } from '../components/AnimeCard';
import { Globe, Volume2, Subtitles } from 'lucide-react';

export const LanguagesPage: React.FC = () => {
  const { navigate } = useRouter();
  const { animeCatalog } = useWatch();

  const [mode, setMode] = useState<'audio' | 'subtitle'>('audio');
  const [selectedLang, setSelectedLang] = useState<string>('Japanese');

  const audioOptions = ['Japanese', 'English', 'Hindi', 'Tamil', 'Spanish', 'French', 'Portuguese'];
  const subtitleOptions = ['English', 'Japanese', 'Hindi', 'Bengali', 'Tamil', 'Telugu', 'Spanish', 'French', 'Arabic'];

  const activeList = mode === 'audio' ? audioOptions : subtitleOptions;

  const filteredAnime = animeCatalog.filter((a) => {
    if (mode === 'audio') {
      return a.audioLanguages.includes(selectedLang);
    } else {
      return a.subtitleLanguages.includes(selectedLang);
    }
  });

  return (
    <div className="w-full bg-[#0a0b0e] text-white min-h-screen py-12 px-4 sm:px-6 lg:px-12">
      <div className="max-w-[1440px] mx-auto space-y-10">
        
        <div className="border-b border-white/10 pb-6">
          <span className="text-xs uppercase font-mono tracking-[0.25em] text-[#d4af37] font-semibold flex items-center gap-2">
            <Globe className="w-3.5 h-3.5" />
            <span>LINGUISTIC ACCESSIBILITY</span>
          </span>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white font-['Cinzel'] mt-1">
            Browse by Audio & Subtitles
          </h1>
          <p className="text-xs text-neutral-400 mt-2 max-w-xl font-light">
            Genuine multi-track voice dubbings and native localized subtitles. Only titles with verified available tracks are displayed.
          </p>
        </div>

        {/* Audio vs Subtitles Mode Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setMode('audio');
              setSelectedLang('Japanese');
            }}
            className={`px-4 py-2 text-xs uppercase font-mono tracking-wider rounded flex items-center gap-2 transition-colors ${
              mode === 'audio' ? 'bg-[#d4af37] text-black font-bold' : 'bg-white/5 hover:bg-white/10 text-neutral-300'
            }`}
          >
            <Volume2 className="w-4 h-4" />
            <span>Audio Dubbings ({audioOptions.length})</span>
          </button>

          <button
            onClick={() => {
              setMode('subtitle');
              setSelectedLang('English');
            }}
            className={`px-4 py-2 text-xs uppercase font-mono tracking-wider rounded flex items-center gap-2 transition-colors ${
              mode === 'subtitle' ? 'bg-[#d4af37] text-black font-bold' : 'bg-white/5 hover:bg-white/10 text-neutral-300'
            }`}
          >
            <Subtitles className="w-4 h-4" />
            <span>Subtitle Tracks ({subtitleOptions.length})</span>
          </button>
        </div>

        {/* Language selector chips */}
        <div className="flex flex-wrap gap-2 border-b border-white/10 pb-4">
          {activeList.map((lang) => {
            const count = animeCatalog.filter((a) =>
              mode === 'audio' ? a.audioLanguages.includes(lang) : a.subtitleLanguages.includes(lang)
            ).length;

            return (
              <button
                key={lang}
                onClick={() => setSelectedLang(lang)}
                className={`px-3.5 py-1.5 text-xs rounded transition-colors flex items-center gap-2 ${
                  selectedLang === lang
                    ? 'bg-white/20 text-[#d4af37] border border-[#d4af37] font-semibold'
                    : 'bg-white/5 hover:bg-white/10 text-neutral-300 border border-white/5'
                }`}
              >
                <span>{lang}</span>
                <span className="text-[10px] font-mono text-neutral-400">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Results grid */}
        <div>
          <div className="mb-6 text-xs font-mono text-neutral-400">
            Showing anime with verified <strong className="text-white">{selectedLang}</strong> {mode === 'audio' ? 'dubbing' : 'subtitles'}:
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredAnime.map((anime) => (
              <AnimeCard key={anime.id} anime={anime} aspect="portrait" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
