import React from 'react';
import { useRouter } from '../context/RouterContext';
import { useAuth } from '../context/AuthContext';
import { getTranslation } from '../lib/i18n';
import { Shield } from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigate } = useRouter();
  const { interfaceLanguage } = useAuth();
  const t = (key: string) => getTranslation(interfaceLanguage, key);

  return (
    <footer className="w-full bg-[#07080a] border-t border-white/[0.08] text-neutral-400 text-xs">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-16">
        
        {/* Top row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/[0.06]">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-sm bg-[#d4af37] flex items-center justify-center">
                <span className="text-black font-black text-[10px] font-mono">AV</span>
              </div>
              <span className="text-xl font-bold tracking-tight text-white font-['Cinzel']">
                ANIME<span className="text-[#d4af37]">VERSE</span>
              </span>
            </div>
            <p className="text-neutral-400 max-w-sm leading-relaxed text-xs">
              A high-fidelity cinematic streaming sanctuary engineered for visionary anime storytelling, lossless acoustics, and global accessibility.
            </p>
            <div className="flex items-center gap-4 text-xs font-mono text-[#d4af37]">
              <span>DOLBY ATMOS 7.1</span>
              <span aria-hidden="true">·</span>
              <span>4K HDR MASTER</span>
            </div>
          </div>

          {/* Navigation Col 1 */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-mono tracking-widest text-white font-semibold">Explore</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => navigate('/library')} className="hover:text-white transition-colors">
                  {t('nav_library')}
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/movies')} className="hover:text-white transition-colors">
                  {t('nav_movies')}
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/categories')} className="hover:text-white transition-colors">
                  {t('nav_categories')}
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/latest')} className="hover:text-white transition-colors">
                  {t('nav_latest')}
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/seasons')} className="hover:text-white transition-colors">
                  {t('nav_seasons')}
                </button>
              </li>
            </ul>
          </div>

          {/* Navigation Col 2 */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-mono tracking-widest text-white font-semibold">User Experience</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => navigate('/watchlist')} className="hover:text-white transition-colors">
                  {t('nav_watchlist')}
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/history')} className="hover:text-white transition-colors">
                  {t('nav_history')}
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/languages')} className="hover:text-white transition-colors">
                  {t('nav_languages')}
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/profile')} className="hover:text-white transition-colors">
                  {t('nav_profile')}
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/admin')} className="text-[#d4af37] hover:underline flex items-center gap-1.5 font-semibold">
                  <Shield className="w-3.5 h-3.5" />
                  <span>{t('nav_admin')}</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Institutional / Legal */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-mono tracking-widest text-white font-semibold">Institutional</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => navigate('/about')} className="hover:text-white transition-colors">
                  About Us
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/contact')} className="hover:text-white transition-colors">
                  Contact Support
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/privacy')} className="hover:text-white transition-colors">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/terms')} className="hover:text-white transition-colors">
                  Terms of Service
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-500">
          <p>© 2026 ANIMEVERSE ARCHIVE. All streaming rights reserved. Content licensed via authorized studio partners.</p>
          <div className="flex items-center gap-6">
            <span>Powered by Firebase & Google Cloud</span>
            <span aria-hidden="true">·</span>
            <span>Version 2.4-Cinematic</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
