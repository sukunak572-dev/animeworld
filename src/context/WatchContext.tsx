import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { useAuth } from './AuthContext';
import { Anime, Category, HistoryItem, WatchlistItem, SiteSettings } from '../types';
import { INITIAL_ANIME_CATALOG, SAMPLE_CATEGORIES } from '../lib/sampleData';

interface WatchContextType {
  animeCatalog: Anime[];
  categories: Category[];
  watchlist: WatchlistItem[];
  history: HistoryItem[];
  siteSettings: SiteSettings;
  loadingCatalog: boolean;
  addToWatchlist: (anime: Anime) => Promise<void>;
  removeFromWatchlist: (animeId: string) => Promise<void>;
  isInWatchlist: (animeId: string) => boolean;
  updateProgress: (anime: Anime, episodeId: string, currentSeconds: number, totalSeconds: number) => Promise<void>;
  getEpisodeProgress: (animeId: string, episodeId: string) => number;
  refreshCatalog: () => Promise<void>;
  seedInitialDatabase: () => Promise<void>;
}

const DEFAULT_SETTINGS: SiteSettings = {
  siteName: 'ANIMEVERSE',
  tagline: 'Streaming Worlds That Transcend Reality',
  announcement: 'Fall 2026 Season Premieres are now broadcasting in Dolby Atmos 7.1',
  maintenanceMode: false,
  featuredAnimeId: 'cyber-blade-zero',
  allowedAdmins: ['sukunak572@gmail.com'],
};

const WatchContext = createContext<WatchContextType>({
  animeCatalog: INITIAL_ANIME_CATALOG,
  categories: SAMPLE_CATEGORIES,
  watchlist: [],
  history: [],
  siteSettings: DEFAULT_SETTINGS,
  loadingCatalog: false,
  addToWatchlist: async () => {},
  removeFromWatchlist: async () => {},
  isInWatchlist: () => false,
  updateProgress: async () => {},
  getEpisodeProgress: () => 0,
  refreshCatalog: async () => {},
  seedInitialDatabase: async () => {},
});

export const WatchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [animeCatalog, setAnimeCatalog] = useState<Anime[]>(INITIAL_ANIME_CATALOG);
  const [categories, setCategories] = useState<Category[]>(SAMPLE_CATEGORIES);
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>(() => {
    try {
      const saved = localStorage.getItem('animeverse_guest_watchlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('animeverse_guest_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [loadingCatalog, setLoadingCatalog] = useState<boolean>(true);

  // Sync catalog from Firestore if populated
  const refreshCatalog = async () => {
    try {
      const animeCol = collection(db, 'anime');
      const snap = await getDocs(animeCol);
      if (!snap.empty) {
        const firestoreList: Anime[] = [];
        snap.forEach((docSnap) => {
          firestoreList.push(docSnap.data() as Anime);
        });
        setAnimeCatalog(firestoreList);
      }
    } catch (err) {
      console.warn('Using local catalog baseline:', err);
    } finally {
      setLoadingCatalog(false);
    }
  };

  useEffect(() => {
    refreshCatalog();
  }, []);

  // Sync Watchlist with Firestore for authenticated users
  useEffect(() => {
    if (!currentUser) {
      try {
        const saved = localStorage.getItem('animeverse_guest_watchlist');
        setWatchlist(saved ? JSON.parse(saved) : []);
      } catch {
        setWatchlist([]);
      }
      return;
    }

    const q = query(collection(db, 'watchlists'), where('userId', '==', currentUser.uid));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items: WatchlistItem[] = [];
        snapshot.forEach((docSnap) => {
          items.push({ id: docSnap.id, ...docSnap.data() } as WatchlistItem);
        });
        setWatchlist(items);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'watchlists');
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

  // Sync History with Firestore for authenticated users
  useEffect(() => {
    if (!currentUser) {
      try {
        const saved = localStorage.getItem('animeverse_guest_history');
        setHistory(saved ? JSON.parse(saved) : []);
      } catch {
        setHistory([]);
      }
      return;
    }

    const q = query(collection(db, 'history'), where('userId', '==', currentUser.uid));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items: HistoryItem[] = [];
        snapshot.forEach((docSnap) => {
          items.push({ id: docSnap.id, ...docSnap.data() } as HistoryItem);
        });
        setHistory(items);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'history');
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

  const addToWatchlist = async (anime: Anime) => {
    const item: WatchlistItem = {
      id: `${currentUser?.uid || 'guest'}_${anime.id}`,
      userId: currentUser?.uid || 'guest',
      animeId: anime.id,
      animeTitle: anime.title,
      posterImage: anime.posterImage,
      rating: anime.rating,
      type: anime.type,
      releaseYear: anime.releaseYear,
      addedAt: new Date().toISOString(),
    };

    if (currentUser) {
      const docRef = doc(db, 'watchlists', item.id);
      await setDoc(docRef, { ...item, createdAt: serverTimestamp() });
    } else {
      const updated = [item, ...watchlist.filter((w) => w.animeId !== anime.id)];
      setWatchlist(updated);
      localStorage.setItem('animeverse_guest_watchlist', JSON.stringify(updated));
    }
  };

  const removeFromWatchlist = async (animeId: string) => {
    const itemId = `${currentUser?.uid || 'guest'}_${animeId}`;
    if (currentUser) {
      const docRef = doc(db, 'watchlists', itemId);
      await deleteDoc(docRef);
    } else {
      const updated = watchlist.filter((w) => w.animeId !== animeId);
      setWatchlist(updated);
      localStorage.setItem('animeverse_guest_watchlist', JSON.stringify(updated));
    }
  };

  const isInWatchlist = (animeId: string) => {
    return watchlist.some((w) => w.animeId === animeId);
  };

  const updateProgress = async (
    anime: Anime,
    episodeId: string,
    currentSeconds: number,
    totalSeconds: number
  ) => {
    const ep = anime.episodes.find((e) => e.id === episodeId) || anime.episodes[0];
    const itemId = `${currentUser?.uid || 'guest'}_${anime.id}_${episodeId}`;
    const completed = totalSeconds > 0 && currentSeconds >= totalSeconds * 0.9;

    const histItem: HistoryItem = {
      id: itemId,
      userId: currentUser?.uid || 'guest',
      animeId: anime.id,
      episodeId,
      animeTitle: anime.title,
      episodeNumber: ep?.episodeNumber || 1,
      episodeTitle: ep?.title || 'Episode 1',
      thumbnail: ep?.thumbnail || anime.bannerImage,
      progressSeconds: Math.floor(currentSeconds),
      totalSeconds: Math.floor(totalSeconds || ep?.duration || 1400),
      lastWatchedAt: new Date().toISOString(),
      completed,
    };

    if (currentUser) {
      const docRef = doc(db, 'history', itemId);
      await setDoc(docRef, { ...histItem, updatedAt: serverTimestamp() }, { merge: true });
    } else {
      const filtered = history.filter((h) => h.id !== itemId);
      const updated = [histItem, ...filtered].slice(0, 30);
      setHistory(updated);
      localStorage.setItem('animeverse_guest_history', JSON.stringify(updated));
    }
  };

  const getEpisodeProgress = (animeId: string, episodeId: string): number => {
    const found = history.find((h) => h.animeId === animeId && h.episodeId === episodeId);
    return found ? found.progressSeconds : 0;
  };

  // Seed initial catalog to Firestore
  const seedInitialDatabase = async () => {
    for (const anime of INITIAL_ANIME_CATALOG) {
      const animeRef = doc(db, 'anime', anime.id);
      await setDoc(animeRef, anime);
    }
    for (const cat of SAMPLE_CATEGORIES) {
      const catRef = doc(db, 'categories', cat.id);
      await setDoc(catRef, cat);
    }
    const settingsRef = doc(db, 'siteSettings', 'general');
    await setDoc(settingsRef, DEFAULT_SETTINGS);
    await refreshCatalog();
  };

  return (
    <WatchContext.Provider
      value={{
        animeCatalog,
        categories,
        watchlist,
        history,
        siteSettings,
        loadingCatalog,
        addToWatchlist,
        removeFromWatchlist,
        isInWatchlist,
        updateProgress,
        getEpisodeProgress,
        refreshCatalog,
        seedInitialDatabase,
      }}
    >
      {children}
    </WatchContext.Provider>
  );
};

export const useWatch = () => useContext(WatchContext);
