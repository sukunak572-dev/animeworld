import React, { createContext, useContext, useEffect, useState } from 'react';

export type RoutePath =
  | '/'
  | '/library'
  | '/search'
  | '/categories'
  | '/movies'
  | '/latest'
  | '/seasons'
  | '/languages'
  | '/watchlist'
  | '/history'
  | '/profile'
  | '/about'
  | '/contact'
  | '/privacy'
  | '/terms'
  | '/admin';

export interface RouteState {
  path: string;
  params: Record<string, string>;
  searchParams: URLSearchParams;
}

interface RouterContextType {
  currentPath: string;
  params: Record<string, string>;
  searchParams: URLSearchParams;
  navigate: (url: string) => void;
  goBack: () => void;
}

const RouterContext = createContext<RouterContextType>({
  currentPath: '/',
  params: {},
  searchParams: new URLSearchParams(),
  navigate: () => {},
  goBack: () => {},
});

export const RouterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUrl, setCurrentUrl] = useState<string>(() => window.location.pathname + window.location.search);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentUrl(window.location.pathname + window.location.search);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (url: string) => {
    if (url === currentUrl) return;
    window.history.pushState({}, '', url);
    setCurrentUrl(url);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goBack = () => {
    window.history.back();
  };

  // Parse path and params
  const [pathname, searchString] = currentUrl.split('?');
  const searchParams = new URLSearchParams(searchString || '');
  const params: Record<string, string> = {};

  // Pattern matching: /anime/:id, /watch/:id/:epId?, /categories/:slug
  const cleanPath = pathname || '/';
  if (cleanPath.startsWith('/anime/')) {
    params.id = cleanPath.replace('/anime/', '');
  } else if (cleanPath.startsWith('/watch/')) {
    const parts = cleanPath.replace('/watch/', '').split('/');
    params.id = parts[0] || '';
    if (parts[1]) params.epId = parts[1];
  } else if (cleanPath.startsWith('/categories/')) {
    params.slug = cleanPath.replace('/categories/', '');
  }

  return (
    <RouterContext.Provider
      value={{
        currentPath: cleanPath,
        params,
        searchParams,
        navigate,
        goBack,
      }}
    >
      {children}
    </RouterContext.Provider>
  );
};

export const useRouter = () => useContext(RouterContext);
