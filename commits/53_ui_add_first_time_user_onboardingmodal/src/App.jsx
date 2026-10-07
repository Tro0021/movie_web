import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import RightSidebar from './components/RightSidebar';
import TrailerModal from './components/TrailerModal';
import AuthModal from './components/AuthModal';
import OnboardingModal from './components/OnboardingModal';
import ErrorBoundary from './components/ErrorBoundary';
import HomePage from './pages/HomePage';
import MovieDetailsPage from './pages/MovieDetailsPage';
import BoxOfficeLeaderboardPage from './pages/BoxOfficeLeaderboardPage';
import WatchlistPage from './pages/WatchlistPage';
import AiDiscoveryPage from './pages/AiDiscoveryPage';
import { MOCK_MOVIES } from './data/mockMovies';
import { useRegion } from './context/RegionContext';
import { sanitizeGenres } from './services/genreEngine';
import { supabase } from './lib/supabaseClient';
import { 
  addToWatchlist, 
  removeFromWatchlist, 
  getUserWatchlist 
} from './services/watchlistService';

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
  const [trailerMovie, setTrailerMovie] = useState(null);
  const { currentCountry, setCurrentCountry } = useRegion();

  // Supabase Auth state
  const [user, setUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLoadingWatchlist, setIsLoadingWatchlist] = useState(false);

  // User Curated Cinema Preferences / Taste Profile
  const [isTasteModalOpen, setIsTasteModalOpen] = useState(false);
  const [tasteProfile, setTasteProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('kinova_user_taste_profile');
      if (!saved) return null;
      const parsed = JSON.parse(saved);
      if (parsed && Array.isArray(parsed.genres)) {
        parsed.genres = sanitizeGenres(parsed.genres);
      }
      return parsed;
    } catch {
      return null;
    }
  });

  const handleSaveTasteProfile = (profile) => {
    setTasteProfile(profile);
    localStorage.setItem('kinova_user_taste_profile', JSON.stringify(profile));
  };

  // Watchlist state initialized with local guest cache
  const [watchlist, setWatchlist] = useState(() => {
    try {
      const saved = localStorage.getItem('kinova_watchlist_guest');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const setActiveTab = (tab, updateHistory = true) => {
    setActiveTabState(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (updateHistory && typeof window !== 'undefined') {
      const targetPath = tab === 'home' ? '/' : tab === 'details' ? window.location.pathname : (ROUTES[tab] || `/${tab}`);
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

  // Sync user's Supabase cloud watchlist
  const syncUserWatchlist = useCallback(async (userId) => {
    if (!userId) return;
    setIsLoadingWatchlist(true);
    try {
      const cloudMovies = await getUserWatchlist(userId);
      const cloudList = cloudMovies ?? [];
      setWatchlist(cloudList);
      localStorage.setItem(`kinova_watchlist_${userId}`, JSON.stringify(cloudList));
      localStorage.removeItem('kinova_watchlist_guest');
    } catch (err) {
      console.error('[App] Watchlist sync error:', err.message || err);
      try {
        const cached = localStorage.getItem(`kinova_watchlist_${userId}`);
        if (cached) setWatchlist(JSON.parse(cached));
      } catch {}
    } finally {
      setIsLoadingWatchlist(false);
    }
  }, []);

  // Global Supabase Auth state listener
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        syncUserWatchlist(currentUser.id);
        if (!localStorage.getItem('kinova_user_taste_profile')) {
          setIsTasteModalOpen(true);
        }
      }
    }).catch(err => {
      console.warn('[Supabase] Initial session retrieval note:', err);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);

      if (event === 'SIGNED_IN' && currentUser) {
        const guestRaw = localStorage.getItem('kinova_watchlist_guest');
        if (guestRaw) {
          try {
            const guestItems = JSON.parse(guestRaw);
            if (Array.isArray(guestItems) && guestItems.length > 0) {
              await Promise.allSettled(
                guestItems.map(m => addToWatchlist(currentUser.id, m))
              );
            }
          } catch (e) {
            console.warn('[App] Guest migration warning:', e.message);
          }
        }
        syncUserWatchlist(currentUser.id);
        if (!localStorage.getItem('kinova_user_taste_profile')) {
          setIsTasteModalOpen(true);
        }
      } else if (event === 'SIGNED_OUT') {
        setWatchlist([]);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [syncUserWatchlist]);

  const handleToggleWatchlist = async (movie) => {
    if (!movie) return;
    const movieId = String(movie.id || movie.tmdbId || movie.tmdb_movie_id);
    const exists = watchlist.some(m => String(m.id || m.tmdbId || m.tmdb_movie_id) === movieId);

    if (user) {
      try {
        if (exists) {
          await removeFromWatchlist(user.id, movie.tmdbId || movie.id);
          const updated = watchlist.filter(m => String(m.id || m.tmdbId || m.tmdb_movie_id) !== movieId);
          setWatchlist(updated);
          localStorage.setItem(`kinova_watchlist_${user.id}`, JSON.stringify(updated));
        } else {
          await addToWatchlist(user.id, movie);
          const updated = [...watchlist, movie];
          setWatchlist(updated);
          localStorage.setItem(`kinova_watchlist_${user.id}`, JSON.stringify(updated));
        }
      } catch (err) {
        console.error('[App] Toggle watchlist error:', err);
      }
    } else {
      setWatchlist(prev => {
        const next = exists
          ? prev.filter(m => String(m.id || m.tmdbId || m.tmdb_movie_id) !== movieId)
          : [...prev, movie];
        localStorage.setItem('kinova_watchlist_guest', JSON.stringify(next));
        return next;
      });
    }
  };

  const handlePlayTrailer = (movie) => {
    setTrailerMovie(movie);
  };

  const handleSelectMovie = (movie) => {
    if (!movie) return;
    setSelectedMovie(movie);
    setActiveTab('details');
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
        onSelectMovie={handleSelectMovie}
        onOpenSidebar={() => setIsSidebarOpen(true)}
        user={user}
        onOpenAuth={() => setIsAuthModalOpen(true)}
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
        user={user}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenTasteModal={() => setIsTasteModalOpen(true)}
        tasteProfile={tasteProfile}
        onRefreshMovies={() => {}}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 relative">
        <ErrorBoundary key={activeTab} onReset={() => setActiveTab('home')}>
          {activeTab === 'home' && (
            <HomePage
              movies={movies}
              onSelectMovie={handleSelectMovie}
              watchlist={watchlist}
              onToggleWatchlist={handleToggleWatchlist}
              onPlayTrailer={handlePlayTrailer}
              currentCountry={currentCountry}
              onCountryChange={setCurrentCountry}
              tasteProfile={tasteProfile}
              onOpenTasteModal={() => setIsTasteModalOpen(true)}
              onRefreshMovies={() => {}}
            />
          )}

          {activeTab === 'details' && selectedMovie && (
            <MovieDetailsPage
              movie={selectedMovie}
              onBack={() => setActiveTab('home')}
              watchlist={watchlist}
              onToggleWatchlist={handleToggleWatchlist}
              onPlayTrailer={handlePlayTrailer}
              allMovies={movies}
              onSelectMovie={handleSelectMovie}
              currentCountry={currentCountry}
              onCountryChange={setCurrentCountry}
              user={user}
              onOpenAuth={() => setIsAuthModalOpen(true)}
              apiKey=""
            />
          )}

          {activeTab === 'boxoffice' && (
            <BoxOfficeLeaderboardPage
              movies={movies}
              onSelectMovie={handleSelectMovie}
            />
          )}

          {activeTab === 'watchlist' && (
            <WatchlistPage
              watchlist={watchlist}
              onSelectMovie={handleSelectMovie}
              onToggleWatchlist={handleToggleWatchlist}
              onPlayTrailer={handlePlayTrailer}
              onNavigateHome={() => setActiveTab('home')}
              currentCountry={currentCountry}
              user={user}
              onOpenAuth={() => setIsAuthModalOpen(true)}
              isLoadingWatchlist={isLoadingWatchlist}
            />
          )}

          {activeTab === 'ai-discovery' && (
            <AiDiscoveryPage
              allMovies={movies}
              onSelectMovie={handleSelectMovie}
              apiKeys={{}}
              onPlayTrailer={handlePlayTrailer}
            />
          )}

          {activeTab !== 'home' && activeTab !== 'details' && activeTab !== 'boxoffice' && activeTab !== 'watchlist' && activeTab !== 'ai-discovery' && (
            <div className="flex items-center justify-center min-h-[60vh]">
              <p className="text-xs font-mono uppercase tracking-widest text-[#8C877E]">
                Route: {activeTab} — page under construction
              </p>
            </div>
          )}
        </ErrorBoundary>
      </main>

      {/* Cinema Preferences Onboarding Modal */}
      <OnboardingModal
        isOpen={isTasteModalOpen}
        onClose={() => setIsTasteModalOpen(false)}
        onSaveProfile={handleSaveTasteProfile}
        initialProfile={tasteProfile}
      />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        user={user}
        onAuthSuccess={(authenticatedUser) => {
          setUser(authenticatedUser);
          syncUserWatchlist(authenticatedUser.id);
          if (!tasteProfile) {
            setIsTasteModalOpen(true);
          }
        }}
      />

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
