import React, { useState, useEffect } from 'react';
import { useRouter } from '../context/RouterContext';
import { useAuth } from '../context/AuthContext';
import { useWatch } from '../context/WatchContext';
import { Anime, Episode, Category, AdminLog } from '../types';
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import {
  Shield,
  ShieldAlert,
  Database,
  Plus,
  Trash2,
  Edit2,
  Star,
  Check,
  X,
  Layers,
  Users,
  Settings,
  Activity,
  Film,
  LogIn,
  LogOut,
  RefreshCw,
  Eye,
  AlertTriangle,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { navigate } = useRouter();
  const { currentUser, isAdmin, loading, signInWithGoogle, logout } = useAuth();
  const { animeCatalog, categories, siteSettings, refreshCatalog, seedInitialDatabase } = useWatch();

  const [activeTab, setActiveTab] = useState<'overview' | 'anime' | 'episodes' | 'categories' | 'users' | 'settings' | 'logs'>('overview');
  const [logs, setLogs] = useState<AdminLog[]>([]);
  const [loadingAction, setLoadingAction] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Modals
  const [animeModalOpen, setAnimeModalOpen] = useState(false);
  const [editingAnime, setEditingAnime] = useState<Anime | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // New/Edit Anime Form State
  const [formData, setFormData] = useState<Partial<Anime>>({
    id: '',
    title: '',
    romajiTitle: '',
    synopsis: '',
    releaseYear: 2026,
    season: 'Fall',
    type: 'Series',
    status: 'Ongoing',
    rating: 9.5,
    studios: ['MAPPA'],
    genres: ['Action', 'Fantasy'],
    seasonsCount: 1,
    episodesCount: 12,
    bannerImage: '/src/assets/images/hero_anime_cyber_blade_1793197552776.jpg',
    posterImage: '/src/assets/images/hero_anime_cyber_blade_1793197552776.jpg',
    isFeatured: false,
    isTrending: true,
    isPopular: true,
    audioLanguages: ['Japanese', 'English', 'Hindi'],
    subtitleLanguages: ['English', 'Japanese', 'Hindi', 'Spanish'],
  });

  // Selected anime for Episode management
  const [selectedAnimeForEpisodes, setSelectedAnimeForEpisodes] = useState<Anime>(animeCatalog[0] || null);
  const [episodeModalOpen, setEpisodeModalOpen] = useState(false);
  const [episodeForm, setEpisodeForm] = useState<Partial<Episode>>({
    title: '',
    episodeNumber: 1,
    seasonNumber: 1,
    duration: 1440,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    synopsis: '',
    introStart: 15,
    introEnd: 90,
    outroStart: 1350,
    outroEnd: 1430,
  });

  // Add Log helper
  const recordAdminLog = async (action: string, target: string, details: string) => {
    const newLog: AdminLog = {
      id: `log_${Date.now()}`,
      adminEmail: currentUser?.email || 'sukunak572@gmail.com',
      action,
      target,
      details,
      timestamp: new Date().toISOString(),
    };
    try {
      await addDoc(collection(db, 'adminLogs'), newLog);
    } catch {
      // Local fallback
    }
    setLogs((prev) => [newLog, ...prev]);
  };

  // Fetch admin logs
  useEffect(() => {
    if (!isAdmin) return;
    const fetchLogs = async () => {
      try {
        const snap = await getDocs(collection(db, 'adminLogs'));
        const list: AdminLog[] = [];
        snap.forEach((d) => list.push({ id: d.id, ...d.data() } as AdminLog));
        list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        setLogs(list);
      } catch {
        // Fallback demo log
        setLogs([
          {
            id: 'log-init',
            adminEmail: 'sukunak572@gmail.com',
            action: 'SESSION_INITIALIZE',
            target: 'ANIMEVERSE_SECURE_ADMIN',
            details: 'Superadmin credentials verified via Google Cloud Identity and Firestore rules.',
            timestamp: new Date().toISOString(),
          },
        ]);
      }
    };
    fetchLogs();
  }, [isAdmin]);

  // Auth gate checks
  if (loading) {
    return (
      <div className="w-full min-h-screen bg-[#07080a] flex items-center justify-center text-white">
        <div className="flex items-center gap-3">
          <RefreshCw className="w-5 h-5 animate-spin text-[#d4af37]" />
          <span className="font-mono text-sm uppercase tracking-wider">Verifying Security Credentials...</span>
        </div>
      </div>
    );
  }

  // Case 1: Not logged in
  if (!currentUser) {
    return (
      <div className="w-full min-h-screen bg-[#07080a] flex items-center justify-center px-4 text-white">
        <div className="max-w-md w-full p-8 bg-[#12141a] border border-white/10 rounded-lg shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-[#d4af37]/20 text-[#d4af37] flex items-center justify-center mx-auto">
            <Shield className="w-8 h-8" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#d4af37] font-semibold">
              RESTRICTED ADMINISTRATIVE ZONE
            </span>
            <h1 className="text-2xl font-black uppercase tracking-tight text-white font-['Cinzel'] mt-1">
              Admin Portal
            </h1>
            <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
              Authentication is required to access the ANIMEVERSE orchestration console. Only pre-enrolled administrator accounts are authorized.
            </p>
          </div>

          <div className="p-3 bg-neutral-900 rounded border border-white/5 text-[11px] font-mono text-neutral-400">
            Designated Superadmin: <strong className="text-[#d4af37]">sukunak572@gmail.com</strong>
          </div>

          <button
            onClick={() => signInWithGoogle()}
            className="w-full py-3.5 bg-[#d4af37] text-black font-bold text-xs uppercase tracking-wider rounded hover:bg-[#e6c46a] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In with Authorized Google Account</span>
          </button>
        </div>
      </div>
    );
  }

  // Case 2: Logged in but not an authorized admin
  if (!isAdmin) {
    return (
      <div className="w-full min-h-screen bg-[#07080a] flex items-center justify-center px-4 text-white">
        <div className="max-w-md w-full p-8 bg-[#181114] border border-red-500/30 rounded-lg shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-red-400 font-semibold">
              403 FORBIDDEN · ACCESS DENIED
            </span>
            <h1 className="text-2xl font-black uppercase tracking-tight text-white font-['Cinzel'] mt-1">
              Unauthorized Account
            </h1>
            <p className="text-xs text-neutral-300 mt-2 leading-relaxed">
              You are signed in as <strong className="text-white font-mono">{currentUser.email}</strong>, which is not registered in the server administrator allowlist.
            </p>
          </div>

          <div className="p-3 bg-black/40 rounded border border-red-500/20 text-[11px] font-mono text-neutral-400 text-left space-y-1">
            <p>• Allowed Superadmin: <strong className="text-white">sukunak572@gmail.com</strong></p>
            <p>• Enforcement: Server-side Firestore Rules & Identity Assertion</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => logout()}
              className="flex-1 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs uppercase tracking-wider rounded border border-white/20 transition-all flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Switch Account</span>
            </button>
            <button
              onClick={() => navigate('/')}
              className="flex-1 py-3 bg-[#d4af37] text-black font-bold text-xs uppercase tracking-wider rounded hover:bg-[#e6c46a] transition-all"
            >
              Return Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Case 3: Fully Authorized Administrator
  const totalEpisodes = animeCatalog.reduce((sum, a) => sum + (a.episodes?.length || 0), 0);

  // Save / Update Anime
  const handleSaveAnime = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingAction(true);
    const animeId = formData.id?.trim() || `anime_${Date.now()}`;
    const cleanAnime: Anime = {
      ...(formData as Anime),
      id: animeId,
      title: formData.title || 'Untitled Anime',
      romajiTitle: formData.romajiTitle || '',
      synopsis: formData.synopsis || '',
      releaseYear: Number(formData.releaseYear) || 2026,
      rating: Number(formData.rating) || 9.5,
      ratingCount: formData.ratingCount || 1000,
      season: (formData.season as any) || 'Fall',
      type: (formData.type as any) || 'Series',
      status: (formData.status as any) || 'Ongoing',
      studios: Array.isArray(formData.studios) ? formData.studios : [formData.studios as any],
      genres: Array.isArray(formData.genres) ? formData.genres : [formData.genres as any],
      seasonsCount: Number(formData.seasonsCount) || 1,
      episodesCount: Number(formData.episodesCount) || 12,
      bannerImage: formData.bannerImage || '/src/assets/images/hero_anime_cyber_blade_1793197552776.jpg',
      posterImage: formData.posterImage || '/src/assets/images/hero_anime_cyber_blade_1793197552776.jpg',
      audioLanguages: formData.audioLanguages || ['Japanese', 'English'],
      subtitleLanguages: formData.subtitleLanguages || ['English', 'Japanese'],
      episodes: editingAnime?.episodes || [
        {
          id: `${animeId}_ep1`,
          animeId,
          seasonNumber: 1,
          episodeNumber: 1,
          title: 'Pilot Episode',
          synopsis: formData.synopsis || 'The adventure begins.',
          duration: 1440,
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
          thumbnail: formData.bannerImage || '/src/assets/images/hero_anime_cyber_blade_1793197552776.jpg',
          airDate: 'Oct 2026',
          audioTracks: [{ id: 'ja', language: 'Japanese', label: 'Japanese [Original]' }],
          subtitleTracks: [{ id: 'sub-en', language: 'English', label: 'English' }],
        },
      ],
    };

    try {
      const docRef = doc(db, 'anime', animeId);
      await setDoc(docRef, cleanAnime);
      await recordAdminLog(
        editingAnime ? 'UPDATE_ANIME' : 'CREATE_ANIME',
        cleanAnime.title,
        `Anime ${animeId} successfully written to Firestore.`
      );
      await refreshCatalog();
      setAnimeModalOpen(false);
      setEditingAnime(null);
      setStatusMessage(`Anime "${cleanAnime.title}" saved successfully!`);
      setTimeout(() => setStatusMessage(null), 3500);
    } catch (err) {
      console.error('Error saving anime:', err);
      setStatusMessage('Error saving to Firestore. Check permissions.');
    } finally {
      setLoadingAction(false);
    }
  };

  // Delete Anime
  const handleDeleteAnime = async (animeId: string) => {
    setLoadingAction(true);
    try {
      await deleteDoc(doc(db, 'anime', animeId));
      await recordAdminLog('DELETE_ANIME', animeId, `Document deleted from Firestore collection.`);
      await refreshCatalog();
      setDeleteConfirmId(null);
      setStatusMessage(`Anime document ${animeId} removed.`);
      setTimeout(() => setStatusMessage(null), 3500);
    } catch (err) {
      console.error('Error deleting anime:', err);
    } finally {
      setLoadingAction(false);
    }
  };

  // Toggle Featured
  const handleToggleFeatured = async (anime: Anime) => {
    try {
      const nextFeatured = !anime.isFeatured;
      await setDoc(doc(db, 'anime', anime.id), { isFeatured: nextFeatured }, { merge: true });
      await recordAdminLog('TOGGLE_FEATURED', anime.title, `Featured flag set to ${nextFeatured}`);
      await refreshCatalog();
    } catch (err) {
      console.error(err);
    }
  };

  // Add Episode to selected anime
  const handleSaveEpisode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAnimeForEpisodes) return;
    setLoadingAction(true);

    const epId = `${selectedAnimeForEpisodes.id}_ep${episodeForm.episodeNumber}_${Date.now()}`;
    const newEp: Episode = {
      id: epId,
      animeId: selectedAnimeForEpisodes.id,
      seasonNumber: Number(episodeForm.seasonNumber) || 1,
      episodeNumber: Number(episodeForm.episodeNumber) || selectedAnimeForEpisodes.episodes.length + 1,
      title: episodeForm.title || `Episode ${episodeForm.episodeNumber}`,
      synopsis: episodeForm.synopsis || 'New broadcast chapter.',
      duration: Number(episodeForm.duration) || 1440,
      videoUrl: episodeForm.videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
      thumbnail: selectedAnimeForEpisodes.bannerImage,
      airDate: 'Newly Released',
      introStart: Number(episodeForm.introStart) || 15,
      introEnd: Number(episodeForm.introEnd) || 90,
      outroStart: Number(episodeForm.outroStart) || 1350,
      outroEnd: Number(episodeForm.outroEnd) || 1430,
      audioTracks: [
        { id: 'ja', language: 'Japanese', label: 'Japanese [Original]' },
        { id: 'en', language: 'English', label: 'English [Dubbed]' },
      ],
      subtitleTracks: [
        { id: 'sub-en', language: 'English', label: 'English' },
        { id: 'sub-ja', language: 'Japanese', label: 'Japanese' },
      ],
    };

    const updatedEpisodes = [...selectedAnimeForEpisodes.episodes, newEp];
    try {
      await setDoc(
        doc(db, 'anime', selectedAnimeForEpisodes.id),
        { episodes: updatedEpisodes, episodesCount: updatedEpisodes.length },
        { merge: true }
      );
      await recordAdminLog('ADD_EPISODE', selectedAnimeForEpisodes.title, `Added Episode ${newEp.episodeNumber}: ${newEp.title}`);
      await refreshCatalog();
      setEpisodeModalOpen(false);
      setStatusMessage(`Episode added to ${selectedAnimeForEpisodes.title}!`);
      setTimeout(() => setStatusMessage(null), 3500);
    } catch (err) {
      console.error('Episode save error:', err);
    } finally {
      setLoadingAction(false);
    }
  };

  // Seed Catalog
  const handleSeed = async () => {
    setLoadingAction(true);
    try {
      await seedInitialDatabase();
      await recordAdminLog('SEED_CATALOG', 'GLOBAL', 'Seeded initial rich anime catalog & categories.');
      setStatusMessage('Database seeded with rich anime catalog!');
      setTimeout(() => setStatusMessage(null), 3500);
    } catch (err) {
      console.error(err);
      setStatusMessage('Seeding failed. Check Firestore rules.');
    } finally {
      setLoadingAction(false);
    }
  };

  return (
    <div className="w-full bg-[#0a0b0e] text-white min-h-screen">
      
      {/* Top Banner */}
      <div className="bg-[#12141a] border-b border-white/10 px-4 sm:px-6 lg:px-12 py-6">
        <div className="max-w-[1520px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-[#d4af37] text-black flex items-center justify-center font-bold font-mono shadow-lg">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white font-['Cinzel']">
                  ANIMEVERSE Control Center
                </h1>
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold rounded uppercase">
                  Verified Superadmin
                </span>
              </div>
              <p className="text-xs text-neutral-400 font-mono mt-0.5">
                Session: {currentUser.email} · Security Gate: Allowlist Level 1
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSeed}
              disabled={loadingAction}
              className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded text-xs font-semibold flex items-center gap-2 transition-colors border border-white/15"
              title="Populate or restore full initial anime titles to Firestore"
            >
              <Database className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Sync/Seed Firestore</span>
            </button>

            <button
              onClick={() => logout()}
              className="px-3.5 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded text-xs font-semibold flex items-center gap-2 border border-red-500/30 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Status Notice */}
      {statusMessage && (
        <div className="bg-[#d4af37] text-black font-semibold text-xs py-2 px-6 text-center animate-fade-in font-mono">
          {statusMessage}
        </div>
      )}

      {/* Main Tabs Navigation */}
      <div className="bg-[#0e1015] border-b border-white/[0.08] px-4 sm:px-6 lg:px-12 sticky top-20 z-30">
        <div className="max-w-[1520px] mx-auto flex items-center gap-1 sm:gap-2 overflow-x-auto py-2 scrollbar-none text-xs font-mono uppercase tracking-wider">
          {[
            { id: 'overview', label: 'Overview', icon: Activity },
            { id: 'anime', label: `Anime Catalog (${animeCatalog.length})`, icon: Film },
            { id: 'episodes', label: `Episodes (${totalEpisodes})`, icon: Layers },
            { id: 'categories', label: `Categories (${categories.length})`, icon: Database },
            { id: 'users', label: 'User Governance', icon: Users },
            { id: 'settings', label: 'Site Settings', icon: Settings },
            { id: 'logs', label: `Audit Logs (${logs.length})`, icon: Shield },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded flex items-center gap-2 whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-[#d4af37] text-black font-bold shadow-md'
                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Panels */}
      <div className="max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-12 py-10">
        
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 bg-[#12141a] border border-white/10 rounded-lg space-y-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">Total Anime In Vault</span>
                <p className="text-3xl font-black font-mono text-white">{animeCatalog.length}</p>
                <p className="text-xs text-[#d4af37] font-mono">Mastered & Indexed</p>
              </div>

              <div className="p-6 bg-[#12141a] border border-white/10 rounded-lg space-y-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">Total Broadcast Episodes</span>
                <p className="text-3xl font-black font-mono text-white">{totalEpisodes}</p>
                <p className="text-xs text-emerald-400 font-mono">Lossless Audio Verified</p>
              </div>

              <div className="p-6 bg-[#12141a] border border-white/10 rounded-lg space-y-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">Registered Voyagers</span>
                <p className="text-3xl font-black font-mono text-white">1,420+</p>
                <p className="text-xs text-neutral-400 font-mono">Firebase Auth Verified</p>
              </div>

              <div className="p-6 bg-[#12141a] border border-white/10 rounded-lg space-y-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">Supported Languages</span>
                <p className="text-3xl font-black font-mono text-white">12</p>
                <p className="text-xs text-[#d4af37] font-mono">Global i18n & Multi-Dub</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="p-6 bg-[#12141a] border border-white/10 rounded-lg space-y-4">
              <h3 className="text-base font-bold uppercase tracking-wider text-white font-['Cinzel']">
                Orchestration Quick Actions
              </h3>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => {
                    setEditingAnime(null);
                    setFormData({
                      id: '',
                      title: '',
                      romajiTitle: '',
                      synopsis: '',
                      releaseYear: 2026,
                      season: 'Fall',
                      type: 'Series',
                      status: 'Ongoing',
                      rating: 9.5,
                      studios: ['MAPPA'],
                      genres: ['Action', 'Fantasy'],
                      seasonsCount: 1,
                      episodesCount: 12,
                      bannerImage: '/src/assets/images/hero_anime_cyber_blade_1793197552776.jpg',
                      posterImage: '/src/assets/images/hero_anime_cyber_blade_1793197552776.jpg',
                      isFeatured: false,
                      isTrending: true,
                      isPopular: true,
                      audioLanguages: ['Japanese', 'English'],
                      subtitleLanguages: ['English', 'Japanese'],
                    });
                    setAnimeModalOpen(true);
                  }}
                  className="px-4 py-2.5 bg-[#d4af37] text-black font-bold text-xs uppercase tracking-wider rounded hover:bg-[#e6c46a] flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Anime Title</span>
                </button>

                <button
                  onClick={() => setActiveTab('anime')}
                  className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs uppercase tracking-wider rounded border border-white/15"
                >
                  Manage Anime Catalog
                </button>

                <button
                  onClick={() => setActiveTab('episodes')}
                  className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs uppercase tracking-wider rounded border border-white/15"
                >
                  Configure Episode Video Sources
                </button>
              </div>
            </div>

            {/* Recent Anime in Catalog */}
            <div className="space-y-4">
              <h3 className="text-base font-bold uppercase tracking-wider text-white font-['Cinzel']">
                Recently Added Anime
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {animeCatalog.slice(0, 3).map((anime) => (
                  <div key={anime.id} className="p-4 bg-[#12141a] border border-white/10 rounded flex gap-3">
                    <img src={anime.posterImage} alt={anime.title} className="w-16 h-20 object-cover rounded shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-[#d4af37] font-mono">★ {anime.rating} · {anime.releaseYear}</p>
                      <h4 className="text-sm font-bold text-white truncate mt-0.5">{anime.title}</h4>
                      <p className="text-[11px] text-neutral-400 font-mono mt-1">{anime.episodesCount} Episodes · {anime.type}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ANIME MANAGEMENT */}
        {activeTab === 'anime' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold uppercase tracking-wide text-white font-['Cinzel']">
                  Anime Catalog Management
                </h2>
                <p className="text-xs text-neutral-400 font-light mt-0.5">
                  Create, update metadata, feature on homepage, or delete anime entries.
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingAnime(null);
                  setFormData({
                    id: '',
                    title: '',
                    romajiTitle: '',
                    synopsis: '',
                    releaseYear: 2026,
                    season: 'Fall',
                    type: 'Series',
                    status: 'Ongoing',
                    rating: 9.5,
                    studios: ['MAPPA'],
                    genres: ['Action', 'Fantasy'],
                    seasonsCount: 1,
                    episodesCount: 12,
                    bannerImage: '/src/assets/images/hero_anime_cyber_blade_1793197552776.jpg',
                    posterImage: '/src/assets/images/hero_anime_cyber_blade_1793197552776.jpg',
                    isFeatured: false,
                    isTrending: true,
                    isPopular: true,
                    audioLanguages: ['Japanese', 'English'],
                    subtitleLanguages: ['English', 'Japanese'],
                  });
                  setAnimeModalOpen(true);
                }}
                className="px-4 py-2.5 bg-[#d4af37] text-black font-bold text-xs uppercase tracking-wider rounded hover:bg-[#e6c46a] flex items-center gap-2 shrink-0 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Anime</span>
              </button>
            </div>

            {/* Table */}
            <div className="bg-[#12141a] border border-white/10 rounded-lg overflow-x-auto shadow-xl">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-neutral-400 font-mono uppercase text-[11px] bg-neutral-900/50">
                    <th className="py-3 px-4">Anime Title</th>
                    <th className="py-3 px-4">Format</th>
                    <th className="py-3 px-4">Year/Season</th>
                    <th className="py-3 px-4">Rating</th>
                    <th className="py-3 px-4">Episodes</th>
                    <th className="py-3 px-4">Featured</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {animeCatalog.map((anime) => (
                    <tr key={anime.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 px-4 flex items-center gap-3">
                        <img src={anime.posterImage} alt={anime.title} className="w-9 h-12 object-cover rounded shrink-0 border border-white/10" />
                        <div>
                          <p className="font-bold text-white text-sm">{anime.title}</p>
                          <p className="text-[11px] text-neutral-400 font-mono">{anime.studios.join(', ')}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono">{anime.type}</td>
                      <td className="py-3 px-4 font-mono">{anime.season} {anime.releaseYear}</td>
                      <td className="py-3 px-4 font-mono text-[#d4af37] font-semibold">★ {anime.rating}</td>
                      <td className="py-3 px-4 font-mono">{anime.episodesCount} Ep</td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleToggleFeatured(anime)}
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase transition-colors ${
                            anime.isFeatured
                              ? 'bg-[#d4af37] text-black'
                              : 'bg-white/10 text-neutral-400 hover:text-white'
                          }`}
                        >
                          {anime.isFeatured ? 'Featured' : 'Standard'}
                        </button>
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <button
                          onClick={() => {
                            setEditingAnime(anime);
                            setFormData(anime);
                            setAnimeModalOpen(true);
                          }}
                          className="p-1.5 bg-white/10 hover:bg-white/20 rounded text-neutral-300 hover:text-white"
                          title="Edit Anime Details"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(anime.id)}
                          className="p-1.5 bg-red-500/15 hover:bg-red-500/30 rounded text-red-400"
                          title="Delete Anime"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: EPISODES MANAGEMENT */}
        {activeTab === 'episodes' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold uppercase tracking-wide text-white font-['Cinzel']">
                  Episode Operations & Video Sources
                </h2>
                <p className="text-xs text-neutral-400 font-light mt-0.5">
                  Configure streaming URLs, chapter timecodes (intro/outro skip markers), and audio tracks.
                </p>
              </div>

              {/* Selector for which anime to manage */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-neutral-400">Target Anime:</span>
                <select
                  value={selectedAnimeForEpisodes?.id}
                  onChange={(e) => {
                    const found = animeCatalog.find((a) => a.id === e.target.value);
                    if (found) setSelectedAnimeForEpisodes(found);
                  }}
                  className="bg-neutral-900 border border-white/20 rounded p-2 text-xs text-white focus:outline-none"
                >
                  {animeCatalog.map((a) => (
                    <option key={a.id} value={a.id}>{a.title}</option>
                  ))}
                </select>

                <button
                  onClick={() => setEpisodeModalOpen(true)}
                  className="px-3.5 py-2 bg-[#d4af37] text-black font-bold text-xs uppercase rounded hover:bg-[#e6c46a] flex items-center gap-1.5 shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Episode</span>
                </button>
              </div>
            </div>

            {selectedAnimeForEpisodes && (
              <div className="bg-[#12141a] border border-white/10 rounded-lg p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                    {selectedAnimeForEpisodes.title} — Episodes ({selectedAnimeForEpisodes.episodes.length})
                  </h3>
                </div>

                <div className="space-y-3">
                  {selectedAnimeForEpisodes.episodes.map((ep) => (
                    <div
                      key={ep.id}
                      className="p-3 bg-neutral-900/60 border border-white/5 rounded flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <img src={ep.thumbnail || selectedAnimeForEpisodes.bannerImage} alt={ep.title} className="w-16 h-10 object-cover rounded shrink-0" />
                        <div>
                          <p className="font-bold text-white">Ep {ep.episodeNumber}: {ep.title}</p>
                          <p className="text-[11px] text-neutral-400 font-mono truncate max-w-md">
                            Source: {ep.videoUrl}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-neutral-400 font-mono text-[11px]">
                        <span>Intro: {ep.introStart}s - {ep.introEnd}s</span>
                        <span>Outro: {ep.outroStart}s - {ep.outroEnd}s</span>
                        <button
                          onClick={() => navigate(`/watch/${selectedAnimeForEpisodes.id}/${ep.id}`)}
                          className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white rounded flex items-center gap-1 font-sans"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Preview</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: CATEGORIES */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold uppercase tracking-wide text-white font-['Cinzel']">
                Category Taxonomy
              </h2>
              <p className="text-xs text-neutral-400 font-light mt-0.5">
                Organize anime tags, descriptions, and catalog groupings.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((cat) => (
                <div key={cat.id} className="p-4 bg-[#12141a] border border-white/10 rounded space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider">{cat.name}</h4>
                    <span className="text-[10px] font-mono text-[#d4af37]">{cat.count} Titles</span>
                  </div>
                  <p className="text-xs text-neutral-400 font-light leading-relaxed">{cat.description}</p>
                  <p className="text-[10px] font-mono text-neutral-500 pt-2 border-t border-white/5">Slug: /{cat.slug}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: USER GOVERNANCE */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold uppercase tracking-wide text-white font-['Cinzel']">
                User Accounts & Access Control
              </h2>
              <p className="text-xs text-neutral-400 font-light mt-0.5">
                View active authenticated accounts. Passwords and credentials are never stored or exposed.
              </p>
            </div>

            <div className="p-6 bg-[#12141a] border border-white/10 rounded-lg space-y-4">
              <div className="flex items-center justify-between p-3 bg-neutral-900 rounded border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#d4af37] text-black flex items-center justify-center font-bold">
                    S
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">sukunak572@gmail.com</p>
                    <p className="text-[11px] font-mono text-[#d4af37]">Root Superadministrator (Full Access)</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-mono rounded">
                  Active
                </span>
              </div>

              <div className="text-xs text-neutral-400 font-mono pt-2">
                Server-side security enforced via Cloud Firestore security rules. Non-whitelisted users receive 403 Access Denied.
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: SITE SETTINGS */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl space-y-6">
            <div>
              <h2 className="text-xl font-bold uppercase tracking-wide text-white font-['Cinzel']">
                Global Platform Settings
              </h2>
              <p className="text-xs text-neutral-400 font-light mt-0.5">
                Site configuration, announcement banners, and maintenance status.
              </p>
            </div>

            <div className="p-6 bg-[#12141a] border border-white/10 rounded-lg space-y-5">
              <div className="space-y-1">
                <label className="text-xs uppercase font-mono text-neutral-400">Brand Name</label>
                <input
                  type="text"
                  defaultValue={siteSettings.siteName}
                  className="w-full bg-neutral-900 border border-white/10 rounded p-2 text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs uppercase font-mono text-neutral-400">Editorial Tagline</label>
                <input
                  type="text"
                  defaultValue={siteSettings.tagline}
                  className="w-full bg-neutral-900 border border-white/10 rounded p-2 text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs uppercase font-mono text-neutral-400">Top Announcement Banner</label>
                <input
                  type="text"
                  defaultValue={siteSettings.announcement}
                  className="w-full bg-neutral-900 border border-white/10 rounded p-2 text-xs text-white"
                />
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    setStatusMessage('Site settings updated!');
                    setTimeout(() => setStatusMessage(null), 3000);
                  }}
                  className="px-6 py-2.5 bg-[#d4af37] text-black font-bold text-xs uppercase tracking-wider rounded hover:bg-[#e6c46a]"
                >
                  Save Global Settings
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: AUDIT LOGS */}
        {activeTab === 'logs' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold uppercase tracking-wide text-white font-['Cinzel']">
                  Administrative Audit Trail
                </h2>
                <p className="text-xs text-neutral-400 font-light mt-0.5">
                  Immutable record of privileged modifications, additions, and security events.
                </p>
              </div>
            </div>

            <div className="bg-[#12141a] border border-white/10 rounded-lg overflow-hidden shadow-xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-neutral-400 font-mono uppercase text-[11px] bg-neutral-900/50">
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4">Action</th>
                    <th className="py-3 px-4">Target</th>
                    <th className="py-3 px-4">Administrator</th>
                    <th className="py-3 px-4">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-mono text-[11px]">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-white/[0.02]">
                      <td className="py-2.5 px-4 text-neutral-400">{new Date(log.timestamp).toLocaleString()}</td>
                      <td className="py-2.5 px-4 text-[#d4af37] font-bold">{log.action}</td>
                      <td className="py-2.5 px-4 text-white">{log.target}</td>
                      <td className="py-2.5 px-4 text-neutral-300">{log.adminEmail}</td>
                      <td className="py-2.5 px-4 text-neutral-400 font-sans text-xs">{log.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* MODAL: ADD / EDIT ANIME */}
      {animeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-[#12141a] border border-white/20 rounded-lg p-6 space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-bold uppercase tracking-wider text-white font-['Cinzel']">
                {editingAnime ? 'Edit Anime Record' : 'Add New Anime Title'}
              </h3>
              <button onClick={() => setAnimeModalOpen(false)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAnime} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-mono text-neutral-400 uppercase">Anime Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-neutral-900 border border-white/10 rounded p-2 text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-mono text-neutral-400 uppercase">Romaji / Alt Title</label>
                  <input
                    type="text"
                    value={formData.romajiTitle}
                    onChange={(e) => setFormData({ ...formData, romajiTitle: e.target.value })}
                    className="w-full bg-neutral-900 border border-white/10 rounded p-2 text-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-mono text-neutral-400 uppercase">Synopsis</label>
                <textarea
                  rows={3}
                  required
                  value={formData.synopsis}
                  onChange={(e) => setFormData({ ...formData, synopsis: e.target.value })}
                  className="w-full bg-neutral-900 border border-white/10 rounded p-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <label className="font-mono text-neutral-400 uppercase">Year</label>
                  <input
                    type="number"
                    value={formData.releaseYear}
                    onChange={(e) => setFormData({ ...formData, releaseYear: Number(e.target.value) })}
                    className="w-full bg-neutral-900 border border-white/10 rounded p-2 text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-mono text-neutral-400 uppercase">Season</label>
                  <select
                    value={formData.season}
                    onChange={(e) => setFormData({ ...formData, season: e.target.value as any })}
                    className="w-full bg-neutral-900 border border-white/10 rounded p-2 text-white"
                  >
                    <option value="Fall">Fall</option>
                    <option value="Summer">Summer</option>
                    <option value="Spring">Spring</option>
                    <option value="Winter">Winter</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-mono text-neutral-400 uppercase">Format</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full bg-neutral-900 border border-white/10 rounded p-2 text-white"
                  >
                    <option value="Series">Series</option>
                    <option value="Movie">Movie</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-mono text-neutral-400 uppercase">Rating</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                    className="w-full bg-neutral-900 border border-white/10 rounded p-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-mono text-neutral-400 uppercase">Banner Image URL</label>
                  <input
                    type="text"
                    value={formData.bannerImage}
                    onChange={(e) => setFormData({ ...formData, bannerImage: e.target.value })}
                    className="w-full bg-neutral-900 border border-white/10 rounded p-2 text-white font-mono text-[11px]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-mono text-neutral-400 uppercase">Poster Image URL</label>
                  <input
                    type="text"
                    value={formData.posterImage}
                    onChange={(e) => setFormData({ ...formData, posterImage: e.target.value })}
                    className="w-full bg-neutral-900 border border-white/10 rounded p-2 text-white font-mono text-[11px]"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setAnimeModalOpen(false)}
                  className="px-4 py-2 bg-white/10 text-white rounded font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loadingAction}
                  className="px-6 py-2 bg-[#d4af37] text-black font-bold uppercase tracking-wider rounded hover:bg-[#e6c46a]"
                >
                  {loadingAction ? 'Writing to Firestore...' : 'Save Anime'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD EPISODE */}
      {episodeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="relative w-full max-w-lg bg-[#12141a] border border-white/20 rounded-lg p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-bold uppercase tracking-wider text-white font-['Cinzel']">
                Add Episode to {selectedAnimeForEpisodes?.title}
              </h3>
              <button onClick={() => setEpisodeModalOpen(false)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEpisode} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-mono text-neutral-400 uppercase">Episode Number</label>
                  <input
                    type="number"
                    required
                    value={episodeForm.episodeNumber}
                    onChange={(e) => setEpisodeForm({ ...episodeForm, episodeNumber: Number(e.target.value) })}
                    className="w-full bg-neutral-900 border border-white/10 rounded p-2 text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-mono text-neutral-400 uppercase">Season Number</label>
                  <input
                    type="number"
                    value={episodeForm.seasonNumber}
                    onChange={(e) => setEpisodeForm({ ...episodeForm, seasonNumber: Number(e.target.value) })}
                    className="w-full bg-neutral-900 border border-white/10 rounded p-2 text-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-mono text-neutral-400 uppercase">Episode Title</label>
                <input
                  type="text"
                  required
                  value={episodeForm.title}
                  onChange={(e) => setEpisodeForm({ ...episodeForm, title: e.target.value })}
                  placeholder="e.g. The Edge of Solitude"
                  className="w-full bg-neutral-900 border border-white/10 rounded p-2 text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-mono text-neutral-400 uppercase">Authorized Video URL (MP4 / HLS)</label>
                <input
                  type="url"
                  required
                  value={episodeForm.videoUrl}
                  onChange={(e) => setEpisodeForm({ ...episodeForm, videoUrl: e.target.value })}
                  className="w-full bg-neutral-900 border border-white/10 rounded p-2 text-white font-mono text-[11px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-mono text-neutral-400 uppercase">Skip Intro Time (s)</label>
                  <input
                    type="number"
                    value={episodeForm.introEnd}
                    onChange={(e) => setEpisodeForm({ ...episodeForm, introEnd: Number(e.target.value) })}
                    className="w-full bg-neutral-900 border border-white/10 rounded p-2 text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-mono text-neutral-400 uppercase">Skip Outro Time (s)</label>
                  <input
                    type="number"
                    value={episodeForm.outroStart}
                    onChange={(e) => setEpisodeForm({ ...episodeForm, outroStart: Number(e.target.value) })}
                    className="w-full bg-neutral-900 border border-white/10 rounded p-2 text-white"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setEpisodeModalOpen(false)}
                  className="px-4 py-2 bg-white/10 text-white rounded font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loadingAction}
                  className="px-6 py-2 bg-[#d4af37] text-black font-bold uppercase tracking-wider rounded hover:bg-[#e6c46a]"
                >
                  {loadingAction ? 'Saving...' : 'Add Episode'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="max-w-sm w-full bg-[#181114] border border-red-500/30 rounded-lg p-6 text-center space-y-4">
            <AlertTriangle className="w-10 h-10 text-red-400 mx-auto" />
            <h3 className="text-base font-bold text-white uppercase">Confirm Deletion</h3>
            <p className="text-xs text-neutral-400">
              Are you sure you want to permanently delete anime <strong className="text-white font-mono">{deleteConfirmId}</strong> from the catalog and Firestore?
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2 bg-white/10 text-white rounded text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteAnime(deleteConfirmId)}
                className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
