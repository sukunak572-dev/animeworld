import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from '../context/RouterContext';
import { useAuth } from '../context/AuthContext';
import { useWatch } from '../context/WatchContext';
import { SUPPORTED_LANGUAGES, getTranslation } from '../lib/i18n';
import { LanguageCode } from '../types';
import {
  Search,
  Globe,
  Bookmark,
  Shield,
  User as UserIcon,
  LogOut,
  Moon,
  Sun,
  Menu,
  X,
  Compass,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { currentPath, navigate } = useRouter();
  const { currentUser, userProfile, isAdmin, signInWithGoogle, logout, interfaceLanguage, updateLanguage, theme, updateTheme } = useAuth();
  const { watchlist } = useWatch();
  const [langOpen, setLangOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);

  const langRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  const t = (key: string) => getTranslation(interfaceLanguage, key);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { label: t('nav_home'), path: '/' },
    { label: t('nav_library'), path: '/library' },
    { label: t('nav_movies'), path: '/movies' },
    { label: t('nav_categories'), path: '/categories' },
    { label: t('nav_seasons'), path: '/seasons' },
    { label: t('nav_languages'), path: '/languages' },
  ];

  const currentLangMeta = SUPPORTED_LANGUAGES.find((l) => l.code === interfaceLanguage) || SUPPORTED_LANGUAGES[0];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0b0c10]/85 backdrop-blur-md border-b border-white/[0.08] transition-colors">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-6">
        
        {/* Zone 1: Brand wordmark with geometric mark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2.5 text-left focus:outline-none group"
            aria-label="Animeverse Home"
          >
            <div className="w-8 h-8 rounded-sm bg-[#d4af37] flex items-center justify-center shadow-lg shadow-[#d4af37]/20 group-hover:scale-105 transition-transform">
              <span className="text-[#0b0c10] font-black text-xs tracking-tighter font-mono">AV</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-white font-['Cinzel'] leading-none">
                ANIME<span className="text-[#d4af37]">VERSE</span>
              </span>
              <span className="text-[9px] uppercase tracking-[0.28em] text-neutral-400 font-sans font-medium mt-0.5">
                Cinematic Archive
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 text-xs font-semibold uppercase tracking-wider text-neutral-300">
          {navLinks.map((link) => {
            const isActive = currentPath === link.path;
            return (
              <button
                key={link.path}
                onClick={() => navigate(link.path)}
                className={`transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                  isActive
                    ? 'text-white border-[#d4af37]'
                    : 'border-transparent text-neutral-400 hover:text-white hover:border-neutral-500'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Interactive Affordances & User Control */}
        <div className="flex items-center gap-2 sm:gap-3.5 shrink-0">
          
          {/* Quick Search Trigger / Form */}
          <div className="relative">
            {searchOpen ? (
              <form onSubmit={handleSearchSubmit} className="flex items-center">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('nav_search_placeholder')}
                  autoFocus
                  className="w-48 sm:w-64 px-3 py-1.5 text-xs bg-neutral-900 border border-[#d4af37]/50 rounded text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-[#d4af37]"
                />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="ml-1 p-1 text-neutral-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 text-neutral-300 hover:text-white hover:bg-white/5 rounded-md transition-colors"
                title="Search"
                aria-label="Search anime"
              >
                <Search className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Language Selector Dropdown (12 Languages) */}
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-neutral-300 hover:text-white hover:bg-white/5 rounded-md transition-colors"
              title="Change Language"
              aria-label="Language selector"
            >
              <Globe className="w-4 h-4 text-[#d4af37]" />
              <span className="hidden sm:inline font-mono uppercase">{currentLangMeta.code}</span>
            </button>

            {langOpen && (
              <div className="absolute right-0 mt-2 w-56 max-h-80 overflow-y-auto bg-[#12141a] border border-white/10 rounded-lg shadow-2xl py-1 z-50 divide-y divide-white/5">
                <div className="px-3 py-2 text-[10px] uppercase font-mono tracking-wider text-neutral-400">
                  Select Interface Language
                </div>
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      updateLanguage(lang.code);
                      setLangOpen(false);
                    }}
                    className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between transition-colors ${
                      interfaceLanguage === lang.code
                        ? 'bg-[#d4af37]/15 text-[#d4af37] font-semibold'
                        : 'text-neutral-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span>{lang.nativeLabel}</span>
                    <span className="text-[10px] text-neutral-500 font-mono uppercase">{lang.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Watchlist Quick Link */}
          <button
            onClick={() => navigate('/watchlist')}
            className="relative p-2 text-neutral-300 hover:text-white hover:bg-white/5 rounded-md transition-colors"
            title="Watchlist"
            aria-label="Watchlist"
          >
            <Bookmark className="w-4 h-4" />
            {watchlist.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#d4af37]" />
            )}
          </button>

          {/* Admin Dashboard Direct Shortcut (Always visible to superadmin, subtle icon for inspection) */}
          <button
            onClick={() => navigate('/admin')}
            className={`p-2 rounded-md transition-colors ${
              isAdmin
                ? 'text-[#d4af37] bg-[#d4af37]/10 hover:bg-[#d4af37]/20 border border-[#d4af37]/30'
                : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
            title="Admin Portal"
            aria-label="Admin Portal"
          >
            <Shield className="w-4 h-4" />
          </button>

          {/* User Profile / Auth Button */}
          {currentUser ? (
            <div className="relative" ref={userRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-[#d4af37]/50 transition-all"
                aria-label="User account menu"
              >
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt={currentUser.displayName || 'Avatar'}
                    referrerPolicy="no-referrer"
                    className="w-7 h-7 rounded-full object-cover border border-white/20"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-neutral-800 text-[#d4af37] flex items-center justify-center font-bold text-xs">
                    {currentUser.displayName ? currentUser.displayName[0].toUpperCase() : 'U'}
                  </div>
                )}
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-60 bg-[#12141a] border border-white/10 rounded-lg shadow-2xl py-2 z-50">
                  <div className="px-4 py-2 border-b border-white/5">
                    <p className="text-xs font-semibold text-white truncate">{currentUser.displayName || 'Anime Voyager'}</p>
                    <p className="text-[11px] text-neutral-400 truncate font-mono">{currentUser.email}</p>
                    {isAdmin && (
                      <span className="inline-block mt-1 text-[9px] uppercase tracking-wider text-[#d4af37] font-semibold">
                        Authorized Administrator
                      </span>
                    )}
                  </div>
                  <div className="py-1">
                    <button
                      onClick={() => {
                        navigate('/profile');
                        setUserMenuOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-xs text-neutral-300 hover:bg-white/5 hover:text-white flex items-center gap-2"
                    >
                      <UserIcon className="w-3.5 h-3.5" />
                      {t('nav_profile')}
                    </button>
                    <button
                      onClick={() => {
                        navigate('/history');
                        setUserMenuOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-xs text-neutral-300 hover:bg-white/5 hover:text-white flex items-center gap-2"
                    >
                      <Compass className="w-3.5 h-3.5" />
                      {t('nav_history')}
                    </button>
                    {isAdmin && (
                      <button
                        onClick={() => {
                          navigate('/admin');
                          setUserMenuOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left text-xs text-[#d4af37] hover:bg-[#d4af37]/10 flex items-center gap-2 font-semibold"
                      >
                        <Shield className="w-3.5 h-3.5" />
                        {t('nav_admin')}
                      </button>
                    )}
                  </div>
                  <div className="pt-1 border-t border-white/5">
                    <button
                      onClick={() => {
                        logout();
                        setUserMenuOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-xs text-red-400 hover:bg-red-500/10 flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      {t('nav_signout')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => signInWithGoogle()}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/15 rounded-md transition-colors whitespace-nowrap"
            >
              {t('nav_signin')}
            </button>
          )}

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-neutral-300 hover:text-white"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0e1015] border-b border-white/10 px-6 py-4 space-y-3">
          <nav className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => {
                  navigate(link.path);
                  setMobileMenuOpen(false);
                }}
                className={`text-left py-2 text-sm font-semibold uppercase tracking-wider ${
                  currentPath === link.path ? 'text-[#d4af37]' : 'text-neutral-300'
                }`}
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => {
                navigate('/watchlist');
                setMobileMenuOpen(false);
              }}
              className="text-left py-2 text-sm font-semibold uppercase tracking-wider text-neutral-300"
            >
              {t('nav_watchlist')} ({watchlist.length})
            </button>
            <button
              onClick={() => {
                navigate('/admin');
                setMobileMenuOpen(false);
              }}
              className="text-left py-2 text-sm font-semibold uppercase tracking-wider text-[#d4af37]"
            >
              {t('nav_admin')}
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};
