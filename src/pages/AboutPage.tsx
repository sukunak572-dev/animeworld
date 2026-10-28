import React from 'react';
import { useRouter } from '../context/RouterContext';
import { Shield, Sparkles, Film, Globe } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { navigate } = useRouter();

  return (
    <div className="w-full bg-[#0a0b0e] text-white min-h-screen py-16 px-4 sm:px-6 lg:px-12">
      <div className="max-w-4xl mx-auto space-y-12">
        
        <div className="border-b border-white/10 pb-8 space-y-3">
          <span className="text-xs uppercase font-mono tracking-[0.25em] text-[#d4af37] font-semibold">
            PHILOSOPHY & VISION
          </span>
          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white font-['Cinzel']">
            About ANIMEVERSE
          </h1>
          <p className="text-base sm:text-lg text-neutral-300 font-light leading-relaxed">
            Crafted for enthusiasts who view anime not merely as entertainment, but as one of humanity’s most vital cinematic art forms.
          </p>
        </div>

        <div className="space-y-6 text-neutral-300 text-sm sm:text-base font-light leading-relaxed">
          <p>
            ANIMEVERSE was born out of frustration with noisy, ad-cluttered platforms that compromise visual fidelity with harsh compression artifacts. We set out to build an editorial streaming platform with the curatorial precision of a contemporary art gallery and the acoustic performance of a premier cinema.
          </p>
          <p>
            From the grand celestial spaces of <strong className="text-white">Solaris: Beyond Time</strong> to the rain-slicked neon streets of <strong className="text-white">Cyber Blade</strong>, every frame is presented in certified 4K High Dynamic Range, accompanied by master multi-track Dolby Atmos acoustics.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6">
          <div className="p-6 bg-[#12141a] border border-white/10 rounded space-y-2">
            <Film className="w-6 h-6 text-[#d4af37]" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">Lossless Mastering</h3>
            <p className="text-xs text-neutral-400 font-light">
              Uncompressed studio bitrates up to 25 Mbps, preserving hand-drawn grain and digital color grading.
            </p>
          </div>

          <div className="p-6 bg-[#12141a] border border-white/10 rounded space-y-2">
            <Globe className="w-6 h-6 text-[#d4af37]" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">12 Global Locales</h3>
            <p className="text-xs text-neutral-400 font-light">
              Internationalized interface alongside authentic multi-language dubs and studio-supervised translation scripts.
            </p>
          </div>

          <div className="p-6 bg-[#12141a] border border-white/10 rounded space-y-2">
            <Shield className="w-6 h-6 text-[#d4af37]" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">Authorized Licensing</h3>
            <p className="text-xs text-neutral-400 font-light">
              Direct partner relationships ensuring creators, animators, and studios receive rightful compensation.
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex justify-between items-center">
          <span className="text-xs text-neutral-500 font-mono">ESTABLISHED 2026 · TOKYO & SAN FRANCISCO</span>
          <button
            onClick={() => navigate('/library')}
            className="px-6 py-3 bg-[#d4af37] text-black text-xs font-bold uppercase tracking-wider rounded"
          >
            Explore Catalog
          </button>
        </div>
      </div>
    </div>
  );
};
