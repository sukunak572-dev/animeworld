import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { auth, db, googleProvider, handleFirestoreError, OperationType } from '../lib/firebase';
import { UserProfile, LanguageCode, ThemeMode } from '../types';

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  isAdmin: boolean;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateLanguage: (code: LanguageCode) => void;
  updateTheme: (theme: ThemeMode) => void;
  interfaceLanguage: LanguageCode;
  theme: ThemeMode;
}

const SUPERADMIN_EMAIL = 'sukunak572@gmail.com';

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  userProfile: null,
  isAdmin: false,
  loading: true,
  signInWithGoogle: async () => {},
  logout: async () => {},
  updateLanguage: () => {},
  updateTheme: () => {},
  interfaceLanguage: 'en',
  theme: 'noir',
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [interfaceLanguage, setInterfaceLanguage] = useState<LanguageCode>(() => {
    return (localStorage.getItem('animeverse_lang') as LanguageCode) || 'en';
  });
  const [theme, setTheme] = useState<ThemeMode>(() => {
    return (localStorage.getItem('animeverse_theme') as ThemeMode) || 'noir';
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        // Determine admin status strictly:
        // 1. Matches superadmin email allowlist
        // 2. Or registered admin doc in firestore
        const emailMatches = user.email?.toLowerCase() === SUPERADMIN_EMAIL.toLowerCase();
        let docIsAdmin = false;

        try {
          const adminDocRef = doc(db, 'admins', user.uid);
          const adminSnap = await getDoc(adminDocRef);
          if (adminSnap.exists()) {
            docIsAdmin = true;
          }
        } catch {
          // Non-blocking
        }

        const effectiveAdmin = emailMatches || docIsAdmin;
        setIsAdmin(effectiveAdmin);

        // Fetch or create user profile
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userSnap = await getDoc(userDocRef);
          if (userSnap.exists()) {
            const data = userSnap.data();
            setUserProfile({
              uid: user.uid,
              email: user.email,
              displayName: user.displayName || data.displayName || 'Anime Voyager',
              photoURL: user.photoURL || data.photoURL,
              isAdmin: effectiveAdmin,
              preferences: data.preferences || {
                theme,
                interfaceLanguage,
                defaultAudioLanguage: 'Japanese',
                defaultSubtitleLanguage: 'English',
                autoplayNext: true,
                autoSkipIntro: true,
              },
            });
          } else {
            const newProfile: UserProfile = {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName || 'Anime Voyager',
              photoURL: user.photoURL,
              isAdmin: effectiveAdmin,
              preferences: {
                theme,
                interfaceLanguage,
                defaultAudioLanguage: 'Japanese',
                defaultSubtitleLanguage: 'English',
                autoplayNext: true,
                autoSkipIntro: true,
              },
            };
            await setDoc(userDocRef, {
              ...newProfile,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
            });
            setUserProfile(newProfile);
          }
        } catch (error) {
          console.warn('Could not sync user profile to Firestore:', error);
          // Fallback in-memory profile
          setUserProfile({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || 'Anime Voyager',
            photoURL: user.photoURL,
            isAdmin: effectiveAdmin,
            preferences: {
              theme,
              interfaceLanguage,
              defaultAudioLanguage: 'Japanese',
              defaultSubtitleLanguage: 'English',
              autoplayNext: true,
              autoSkipIntro: true,
            },
          });
        }
      } else {
        setUserProfile(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [theme, interfaceLanguage]);

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error('Google Sign-in failed:', err);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      setUserProfile(null);
      setIsAdmin(false);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const updateLanguage = (code: LanguageCode) => {
    setInterfaceLanguage(code);
    localStorage.setItem('animeverse_lang', code);
    document.documentElement.lang = code;
    document.documentElement.dir = code === 'ar' ? 'rtl' : 'ltr';
    if (userProfile && currentUser) {
      const docRef = doc(db, 'users', currentUser.uid);
      setDoc(docRef, { preferences: { ...userProfile.preferences, interfaceLanguage: code } }, { merge: true })
        .catch(() => {});
    }
  };

  const updateTheme = (newTheme: ThemeMode) => {
    setTheme(newTheme);
    localStorage.setItem('animeverse_theme', newTheme);
    if (userProfile && currentUser) {
      const docRef = doc(db, 'users', currentUser.uid);
      setDoc(docRef, { preferences: { ...userProfile.preferences, theme: newTheme } }, { merge: true })
        .catch(() => {});
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        isAdmin,
        loading,
        signInWithGoogle,
        logout,
        updateLanguage,
        updateTheme,
        interfaceLanguage,
        theme,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
