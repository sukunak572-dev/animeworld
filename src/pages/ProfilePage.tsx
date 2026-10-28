import React from 'react';
import { useRouter } from '../context/RouterContext';
import { useAuth } from '../context/AuthContext';
import { SUPPORTED_LANGUAGES, getTranslation } from '../lib/i18n';
import { LanguageCode, ThemeMode } from '../types';
import {
  User,
  Shield,
  Settings,
  Globe,
  Palette,
  Volume2,
  Subtitles,
  LogOut,
  LogIn,
  Check,
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { navigate } = useRouter();
  const {
    currentUser,
    userProfile,
    isAdmin,
    signInWithGoogle,
    logout,
    interfaceLanguage,
    updateLanguage,
    theme,
    updateTheme,
  } = useAuth();

  const t = (key: string) => getTranslation(interfaceLanguage, key);

  if (!currentUser) {
    return (
      <div className="w-full bg-[#0a0b0e] text-white min-h-screen py-20 px-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-[#12141a] p-8 rounded-lg border border-white/10 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-[#d4af37]/20 text-[#d4af37] flex items-center justify-center mx-auto">
            <User className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold uppercase font-['Cinzel'] text-white">Join the Archive</h2>
            <p className="text-xs text-neutral-400 mt-2">
              Sign in with your Google account to synchronize your watchlist, save playback progress across devices, and manage preferences.
            </p>
          </div>
          <button
            onClick={() => signInWithGoogle()}
            className="w-full py-3 bg-[#d4af37] text-black font-bold text-xs uppercase tracking-wider rounded hover:bg-[#e6c46a] transition-all flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            <span>Continue with Google</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#0a0b0e] text-white min-h-screen py-12 px-4 sm:px-6 lg:px-12">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Profile Header */}
        <div className="p-8 bg-[#12141a] border border-white/10 rounded-lg shadow-xl flex flex-col sm:flex-row items-center gap-6">
          {currentUser.photoURL ? (
            <img
              src={currentUser.photoURL}
              alt={currentUser.displayName || 'Avatar'}
              referrerPolicy="no-referrer"
              className="w-24 h-24 rounded-full object-cover border-2 border-[#d4af37]"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-neutral-800 text-[#d4af37] flex items-center justify-center text-3xl font-bold">
              {currentUser.displayName ? currentUser.displayName[0] : 'U'}
            </div>
          )}

          <div className="flex-1 text-center sm:text-left space-y-1">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl font-black text-white font-['Cinzel']">
                {currentUser.displayName || 'Anime Voyager'}
              </h1>
              {isAdmin && (
                <span className="px-2 py-0.5 bg-[#d4af37]/20 border border-[#d4af37] text-[#d4af37] text-[10px] font-mono font-bold rounded uppercase">
                  Admin
                </span>
              )}
            </div>
            <p className="text-xs font-mono text-neutral-400">{currentUser.email}</p>
            <p className="text-xs text-neutral-500 pt-1">
              Member ID: <span className="font-mono text-neutral-400">{currentUser.uid.slice(0, 14)}...</span>
            </p>
          </div>

          <div className="flex flex-col gap-2 w-full sm:w-auto">
            {isAdmin && (
              <button
                onClick={() => navigate('/admin')}
                className="px-4 py-2 bg-[#d4af37]/15 border border-[#d4af37] text-[#d4af37] text-xs font-bold uppercase rounded hover:bg-[#d4af37]/25 flex items-center justify-center gap-2"
              >
                <Shield className="w-4 h-4" />
                <span>Admin Portal</span>
              </button>
            )}
            <button
              onClick={() => logout()}
              className="px-4 py-2 bg-white/5 hover:bg-red-500/10 text-neutral-300 hover:text-red-400 text-xs font-semibold rounded border border-white/10 flex items-center justify-center gap-2 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>{t('nav_signout')}</span>
            </button>
          </div>
        </div>

        {/* Preferences Section */}
        <div className="p-8 bg-[#12141a] border border-white/10 rounded-lg space-y-8">
          <div className="border-b border-white/10 pb-4">
            <h2 className="text-xl font-bold uppercase tracking-tight text-white font-['Cinzel'] flex items-center gap-2">
              <Settings className="w-5 h-5 text-[#d4af37]" />
              <span>Account Preferences</span>
            </h2>
            <p className="text-xs text-neutral-400 mt-1">
              Personalize interface localization, theme aesthetics, and video playback defaults.
            </p>
          </div>

          {/* Interface Language */}
          <div className="space-y-3">
            <label className="text-xs uppercase font-mono tracking-wider text-neutral-400 flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#d4af37]" />
              <span>Interface Language (12 Locales)</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {SUPPORTED_LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => updateLanguage(lang.code)}
                  className={`p-2.5 rounded text-left text-xs transition-colors border ${
                    interfaceLanguage === lang.code
                      ? 'bg-[#d4af37]/15 border-[#d4af37] text-[#d4af37] font-semibold'
                      : 'bg-neutral-900 border-white/5 text-neutral-300 hover:bg-white/5'
                  }`}
                >
                  <p className="font-medium">{lang.nativeLabel}</p>
                  <p className="text-[10px] text-neutral-500 font-mono uppercase">{lang.label}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Theme Mode */}
          <div className="space-y-3 pt-4 border-t border-white/10">
            <label className="text-xs uppercase font-mono tracking-wider text-neutral-400 flex items-center gap-2">
              <Palette className="w-4 h-4 text-[#d4af37]" />
              <span>Visual Theme Palette</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'noir', title: 'Obsidian Noir (Default)', desc: 'Pure dark charcoal and obsidian blacks' },
                { id: 'midnight', title: 'Midnight Sapphire', desc: 'Deep cosmic navy with electric blue sheen' },
                { id: 'editorial-light', title: 'Editorial Noir White', desc: 'High-contrast gallery editorial paper mode' },
              ].map((th) => (
                <button
                  key={th.id}
                  onClick={() => updateTheme(th.id as ThemeMode)}
                  className={`p-3 rounded text-left border transition-all ${
                    theme === th.id
                      ? 'bg-[#d4af37]/15 border-[#d4af37] text-[#d4af37]'
                      : 'bg-neutral-900 border-white/10 text-neutral-300 hover:bg-white/5'
                  }`}
                >
                  <p className="text-xs font-bold">{th.title}</p>
                  <p className="text-[11px] text-neutral-400 mt-1">{th.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Audio & Subtitle Defaults */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-white/10">
            <div className="space-y-2">
              <label className="text-xs uppercase font-mono tracking-wider text-neutral-400 flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-[#d4af37]" />
                <span>Preferred Audio Track</span>
              </label>
              <select className="w-full bg-neutral-900 text-white text-xs p-2.5 rounded border border-white/10 focus:outline-none">
                <option>Japanese [Original 5.1]</option>
                <option>English [Dubbed]</option>
                <option>Hindi [Dubbed]</option>
                <option>Spanish [Dubbed]</option>
                <option>French [Dubbed]</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase font-mono tracking-wider text-neutral-400 flex items-center gap-2">
                <Subtitles className="w-4 h-4 text-[#d4af37]" />
                <span>Preferred Subtitles</span>
              </label>
              <select className="w-full bg-neutral-900 text-white text-xs p-2.5 rounded border border-white/10 focus:outline-none">
                <option>English [Full Translation]</option>
                <option>Japanese [Kanji/Kana]</option>
                <option>Hindi [हिन्दी]</option>
                <option>Spanish [Español]</option>
                <option>French [Français]</option>
                <option>Arabic [العربية]</option>
                <option>Off</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
