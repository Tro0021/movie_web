import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import RightSidebar from './components/RightSidebar';
import TrailerModal from './components/TrailerModal';
import ErrorBoundary from './components/ErrorBoundary';
import HomePage from './pages/HomePage';
import { MOCK_MOVIES } from './data/mockMovies';
import { useRegion } from './context/RegionContext';

const ROUTES = {
  home: '/',
  boxoffice: '/boxoffice',
  'ai-discovery': '/discovery',
  watchlist: '/watchlist'
};

function resolveTabFromPath(pathname) {
  const path = (pathname || '/').toLowerCase();
  if (path === '/watchlist') return 'watchlist';
  if (path === '/boxoffice') return 'boxoffice';
  if (path === '/discovery' || path === '/ai-discovery') return 'ai-discovery';
  return 'home';
}

export default function App() {
  const getInitialTab = () => {
    if (typeof window !== 'undefined') {
      return resolveTabFromPath(window.location.pathname);
    }
    return 'home';
  };

  const [activeTab, setActiveTabState] = useState(getInitialTab);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [movies, setMovies] = useState(MOCK_MOVIES);
  const [selectedMovie, setSelectedMovie] = useState(MOCK_MOVIES[0]);
  const [watchlist, setWatchlist] = useState([]);
  const [trailerMovie, setTrailerMovie] = useState(null);
  const { currentCountry, setCurrentCountry } = useRegion();

  const setActiveTab = (tab, updateHistory = true) => {
    setActiveTabState(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (updateHistory && typeof window !== 'undefined') {
      const targetPath = ROUTES[tab] || '/';
      if (window.location.pathname !== targetPath) {
        window.history.pushState({ tab }, '', targetPath);
      }
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      setActiveTabState(resolveTabFromPath(window.location.pathname));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleToggleWatchlist = (movie) => {
    setWatchlist(prev => {
      const exists = prev.some(m => m.id === movie.id);
      return exists ? prev.filter(m => m.id !== movie.id) : [...prev, movie];
    });
  };

  const handlePlayTrailer = (movie) => {
    setTrailerMovie(movie);
  };

  return (
    <div className="min-h-screen bg-[#0A0A09] text-[#F4F0EA] flex flex-col font-sans selection:bg-[#E03C31] selection:text-white antialiased relative overflow-x-hidden">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        movies={movies}
        watchlistCount={watchlist.length}
        currentCountry={currentCountry}
        onCountryChange={setCurrentCountry}
        onSelectMovie={(movie) => {
          setSelectedMovie(movie);
          setActiveTab('home');
        }}
        onOpenSidebar={() => setIsSidebarOpen(true)}
        user={null}
        onOpenAuth={() => {}}
      />

      <RightSidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        onClose={() => setIsSidebarOpen(false)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        watchlistCount={watchlist.length}
        currentCountry={currentCountry}
        onCountryChange={setCurrentCountry}
        user={null}
        onOpenAuth={() => {}}
        onOpenTasteModal={() => {}}
        tasteProfile={null}
        onRefreshMovies={() => {}}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 relative">
        <ErrorBoundary key={activeTab} onReset={() => setActiveTab('home')}>
          {activeTab === 'home' && (
            <HomePage
              movies={movies}
              onSelectMovie={setSelectedMovie}
              watchlist={watchlist}
              onToggleWatchlist={handleToggleWatchlist}
              onPlayTrailer={handlePlayTrailer}
              currentCountry={currentCountry}
              onCountryChange={setCurrentCountry}
              tasteProfile={null}
              onOpenTasteModal={() => {}}
              onRefreshMovies={() => {}}
            />
          )}

          {activeTab !== 'home' && (
            <div className="flex items-center justify-center min-h-[60vh]">
              <p className="text-xs font-mono uppercase tracking-widest text-[#8C877E]">
                Route: {activeTab} — page under construction
              </p>
            </div>
          )}
        </ErrorBoundary>
      </main>

      <TrailerModal
        isOpen={Boolean(trailerMovie)}
        onClose={() => setTrailerMovie(null)}
        youtubeId={trailerMovie?.youtubeTrailerId}
        movieTitle={trailerMovie?.title}
      />

      <Footer 
        onNavigateToAi={() => setActiveTab('ai-discovery')}
      />
    </div>
  );
}
