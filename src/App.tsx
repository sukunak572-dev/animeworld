/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { WatchProvider } from './context/WatchContext';
import { RouterProvider, useRouter } from './context/RouterContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Pages
import { HomePage } from './pages/HomePage';
import { LibraryPage } from './pages/LibraryPage';
import { AnimeDetailsPage } from './pages/AnimeDetailsPage';
import { WatchPage } from './pages/WatchPage';
import { SearchPage } from './pages/SearchPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { MoviesPage } from './pages/MoviesPage';
import { LatestEpisodesPage } from './pages/LatestEpisodesPage';
import { SeasonsPage } from './pages/SeasonsPage';
import { LanguagesPage } from './pages/LanguagesPage';
import { WatchlistPage } from './pages/WatchlistPage';
import { HistoryPage } from './pages/HistoryPage';
import { ProfilePage } from './pages/ProfilePage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { LegalPage } from './pages/LegalPage';
import { AdminDashboard } from './pages/AdminDashboard';

const AppContent: React.FC = () => {
  const { currentPath } = useRouter();

  // Route routing
  const renderView = () => {
    if (currentPath === '/' || currentPath === '') {
      return <HomePage />;
    }
    if (currentPath === '/library') {
      return <LibraryPage />;
    }
    if (currentPath.startsWith('/anime/')) {
      return <AnimeDetailsPage />;
    }
    if (currentPath.startsWith('/watch/')) {
      return <WatchPage />;
    }
    if (currentPath.startsWith('/search')) {
      return <SearchPage />;
    }
    if (currentPath.startsWith('/categories')) {
      return <CategoriesPage />;
    }
    if (currentPath === '/movies') {
      return <MoviesPage />;
    }
    if (currentPath === '/latest') {
      return <LatestEpisodesPage />;
    }
    if (currentPath === '/seasons') {
      return <SeasonsPage />;
    }
    if (currentPath === '/languages') {
      return <LanguagesPage />;
    }
    if (currentPath === '/watchlist') {
      return <WatchlistPage />;
    }
    if (currentPath === '/history') {
      return <HistoryPage />;
    }
    if (currentPath === '/profile') {
      return <ProfilePage />;
    }
    if (currentPath === '/about') {
      return <AboutPage />;
    }
    if (currentPath === '/contact') {
      return <ContactPage />;
    }
    if (currentPath === '/privacy') {
      return <LegalPage initialTab="privacy" />;
    }
    if (currentPath === '/terms') {
      return <LegalPage initialTab="terms" />;
    }
    if (currentPath === '/admin') {
      return <AdminDashboard />;
    }

    // Default fallback to Home
    return <HomePage />;
  };

  const isWatchPage = currentPath.startsWith('/watch/');

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0c10] text-[#f3f4f6]">
      <Navbar />
      <main className="flex-1 w-full">{renderView()}</main>
      {!isWatchPage && <Footer />}
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <WatchProvider>
        <RouterProvider>
          <AppContent />
        </RouterProvider>
      </WatchProvider>
    </AuthProvider>
  );
}
