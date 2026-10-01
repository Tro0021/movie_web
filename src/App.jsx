import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import RightSidebar from './components/RightSidebar';
import OnboardingModal from './components/OnboardingModal';
import TrailerModal from './components/TrailerModal';
import AuthModal from './components/AuthModal';
import ErrorBoundary from './components/ErrorBoundary';

// Route-level code splitting — each page is its own JS chunk (loaded on demand)
const HomePage                = lazy(() => import('./pages/HomePage'));
const MovieDetailsPage        = lazy(() => import('./pages/MovieDetailsPage'));
const AiDiscoveryPage         = lazy(() => import('./pages/AiDiscoveryPage'));
const BoxOfficeLeaderboardPage = lazy(() => import('./pages/BoxOfficeLeaderboardPage'));
const WatchlistPage           = lazy(() => import('./pages/WatchlistPage'));
import { MOCK_MOVIES } from './data/mockMovies';
import { getAggregatedMovieData, fetchMoviesFromBackend } from './services/movieApi';
import { supabase } from './lib/supabaseClient';
import { 
  addToWatchlist, 
  removeFromWatchlist, 
  getUserWatchlist 
} from './services/watchlistService';
import { Loader2, CheckCircle2, Film } from 'lucide-react';
import { sanitizeGenres } from './services/genreEngine';
import { useRegion } from './context/RegionContext';

export default function App() {
  // Sync with browser URL path (supports direct navigation to /watchlist)
  const getInitialTab = () => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      if (path === '/watchlist') return 'watchlist';
      if (path === '/boxoffice') return 'boxoffice';
      if (path === '/discovery' || path === '/ai-discovery') return 'ai-discovery';
    }
    return 'home';
  };

  const [activeTab, setActiveTabState] = useState(getInitialTab);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isTasteModalOpen, setIsTasteModalOpen] = useState(false);

  const setActiveTab = (tab, updateHistory = true) => {
    setActiveTabState(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (updateHistory && typeof window !== 'undefined') {
      const targetPath = tab === 'home' ? '/' : tab === 'details' ? window.location.pathname : `/${tab}`;
      if (window.location.pathname !== targetPath) {
        window.history.pushState({ tab }, '', targetPath);
      }
    }
  };

  // Listen to browser navigation (back/forward)
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.toLowerCase();
      if (path === '/watchlist') setActiveTabState('watchlist');
      else if (path === '/boxoffice') setActiveTabState('boxoffice');
      else if (path === '/discovery' || path === '/ai-discovery') setActiveTabState('ai-discovery');
      else setActiveTabState('home');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const [selectedMovie, setSelectedMovie] = useState(MOCK_MOVIES[0]);
  const [movies, setMovies] = useState(MOCK_MOVIES);
  const [isLoadingMovie, setIsLoadingMovie] = useState(false);
  const [notification, setNotification] = useState(null);

  // User Curated Cinema Preferences / Taste Profile
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

  // Toast notification helper
  const showNotification = useCallback((msg, type = 'info') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3500);
  }, []);

  // Supabase Authentication state
  const [user, setUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLoadingWatchlist, setIsLoadingWatchlist] = useState(false);
  
  // Persistent Watchlist
  const [watchlist, setWatchlist] = useState(() => {
    try {
      const saved = localStorage.getItem('kinova_watchlist') || localStorage.getItem('cinepulse_watchlist');
      return saved ? JSON.parse(saved) : [MOCK_MOVIES[0], MOCK_MOVIES[2]];
    } catch {
      return [MOCK_MOVIES[0]];
    }
  });

  // Persistent Regional Country selection with global RegionContext
  const { currentCountry, setCurrentCountry, setSelectedRegion } = useRegion();

  // Sync user's Supabase cloud watchlist
  const syncUserWatchlist = useCallback(async (userId) => {
    if (!userId) return;
    setIsLoadingWatchlist(true);
    try {
      const cloudMovies = await getUserWatchlist(userId);
      if (cloudMovies && cloudMovies.length > 0) {
        setWatchlist(cloudMovies);
        localStorage.setItem('kinova_watchlist', JSON.stringify(cloudMovies));
      }
    } catch (err) {
      console.warn('[App] Watchlist sync warning:', err.message);
    } finally {
      setIsLoadingWatchlist(false);
    }
  }, []);

  // Sync movies from backend microservice on launch with dynamic session rotation
  // Note: intentionally runs only on mount — currentCountry is excluded from deps
  // to prevent re-fetching (and resetting selectedMovie) on every region change.
  useEffect(() => {
    async function initCatalog() {
      try {
        const remoteMovies = await fetchMoviesFromBackend(currentCountry, true);
        if (remoteMovies && remoteMovies.length > 0) {
          setMovies(remoteMovies);
          setSelectedMovie(remoteMovies[0]);
        }
      } catch (e) {
        // Fall back to bundled movies
      }
    }
    initCatalog();
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
        showNotification(`Welcome back, ${currentUser.email}!`, 'success');
        syncUserWatchlist(currentUser.id);
        // Ask for tastes if not yet configured
        if (!localStorage.getItem('kinova_user_taste_profile')) {
          setIsTasteModalOpen(true);
        }
      } else if (event === 'SIGNED_OUT') {
        showNotification('Signed out of cloud account.', 'info');
        try {
          const saved = localStorage.getItem('kinova_watchlist') || localStorage.getItem('cinepulse_watchlist');
          if (saved) setWatchlist(JSON.parse(saved));
        } catch {}
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [syncUserWatchlist, showNotification]);

  // Internal API Keys for backend/services (not exposed in UI)
  const apiKeys = {
    gemini: import.meta.env.VITE_GEMINI_API_KEY || '',
    tmdb: import.meta.env.VITE_TMDB_API_KEY || '',
    omdb: import.meta.env.VITE_OMDB_API_KEY || ''
  };

  const [trailerMovie, setTrailerMovie] = useState(null);

  // Sync watchlist to localStorage
  useEffect(() => {
    localStorage.setItem('kinova_watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  // Sync country + re-fetch the catalog sorted for the new region so "Available
  // in Your Region" updates. selectedMovie is intentionally NOT touched here.
  const handleCountryChange = async (countryCode) => {
    setCurrentCountry(countryCode);
    localStorage.setItem('kinova_country', countryCode);
    showNotification(`Regional availability updated to ${countryCode}`, 'info');
    try {
      const regionalList = await fetchMoviesFromBackend(countryCode, false);
      if (regionalList && regionalList.length > 0) {
        setMovies(regionalList); // updates catalog order — does NOT touch selectedMovie
      }
    } catch (e) {
      // keep current catalog on failure
    }
  };

  // Save Taste Profile
  const handleSaveTasteProfile = (profile) => {
    const cleanProfile = {
      ...profile,
      genres: sanitizeGenres(profile?.genres)
    };
    setTasteProfile(cleanProfile);
    localStorage.setItem('kinova_user_taste_profile', JSON.stringify(cleanProfile));
    showNotification('Cinema preferences saved! Your Curated Archive is now updated.', 'success');
  };

  // Shuffle / Refresh Movie Catalog (New Titles)
  const handleRefreshMovies = async () => {
    try {
      const rotatedMovies = await fetchMoviesFromBackend(currentCountry, true);
      if (rotatedMovies && rotatedMovies.length > 0) {
        setMovies(rotatedMovies);
        setSelectedMovie(rotatedMovies[0]);
        showNotification('Rotated Film Vault with new titles', 'info');
      }
    } catch (e) {
      console.error('Refresh failed:', e);
    }
  };



  // Handle selecting a movie with unified backend/client data aggregation
  const handleSelectMovie = async (movie) => {
    if (!movie) return;
    const movieId = movie.tmdbId || movie.id;
    
    setIsLoadingMovie(true);
    try {
      const response = await getAggregatedMovieData({
        movieIdOrTmdbId: movieId,
        userCountry: currentCountry,
        apiKey: apiKeys.tmdb
      });

      if (response?.data) {
        setSelectedMovie(response.data);
        setActiveTab('details');
        window.scrollTo({ top: 0, behavior: 'smooth' });

        if (response.source === 'backend_api') {
          showNotification('Aggregated live data from Kinova backend & Box Office Mojo', 'success');
        } else if (response.source === 'tmdb_and_bom_live') {
          showNotification('Live Box Office Mojo data merged', 'success');
        }
      } else {
        setSelectedMovie(movie);
        setActiveTab('details');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err) {
      console.error('Data aggregation failed:', err);
      setSelectedMovie(movie);
      setActiveTab('details');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsLoadingMovie(false);
    }
  };

  // Add to Watchlist handler with Supabase auth trigger
  const handleToggleWatchlist = async (movie) => {
    if (!user) {
      setIsAuthModalOpen(true);
      showNotification('Sign in to sync saved movies to your cloud Watchlist.', 'info');
      return;
    }

    const movieId = String(movie.tmdbId || movie.id);
    const isAlreadySaved = watchlist.some(
      m => String(m.id) === movieId || String(m.tmdbId) === movieId
    );

    if (isAlreadySaved) {
      setWatchlist(prev => prev.filter(m => String(m.id) !== movieId && String(m.tmdbId) !== movieId));
      showNotification(`Removed "${movie.title}" from Watchlist`, 'info');

      try {
        await removeFromWatchlist(user.id, movieId);
      } catch (err) {
        console.error('[Supabase] Remove failed:', err);
      }
    } else {
      setWatchlist(prev => [movie, ...prev]);
      showNotification(`Saved "${movie.title}" to Watchlist`, 'success');

      try {
        await addToWatchlist(user.id, movie);
      } catch (err) {
        console.error('[Supabase] Add failed:', err);
      }
    }
  };

  const handlePlayTrailer = (movie) => {
    setTrailerMovie(movie);
  };

  return (
    <div className="min-h-screen bg-[#0a0d14] text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-black antialiased relative overflow-x-hidden">
      
      {/* Streamlined Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onSelectMovie={handleSelectMovie}
        movies={movies}
        watchlistCount={watchlist.length}
        currentCountry={currentCountry}
        onCountryChange={handleCountryChange}
        onOpenSidebar={() => setIsSidebarOpen(true)}
        apiKeys={apiKeys}
        user={user}
        onOpenAuth={() => setIsAuthModalOpen(true)}
      />

      {/* Auto-Hiding Right Sidebar with Arrow Bar Handle */}
      <RightSidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        onClose={() => setIsSidebarOpen(false)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        watchlistCount={watchlist.length}
        currentCountry={currentCountry}
        onCountryChange={handleCountryChange}
        user={user}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenTasteModal={() => setIsTasteModalOpen(true)}
        tasteProfile={tasteProfile}
        onRefreshMovies={handleRefreshMovies}
      />

      {/* Floating Status Notification Toast */}
      {notification && (
        <div className="fixed top-20 right-6 z-[70] animate-fade-in">
          <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-[#141a27] border border-white/10 shadow-2xl text-xs font-semibold text-white">
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <Film className="w-4 h-4 text-amber-400" />
            )}
            <span>{notification.msg}</span>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 relative">
        
        {/* Loading Overlay */}
        {isLoadingMovie && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-9 h-9 text-amber-400 animate-spin" />
            <h3 className="text-base font-bold text-white font-heading">
              Loading Film Dossier & Theatrical Data...
            </h3>
            <p className="text-xs text-slate-400">
              Querying Kinova Microservice, Box Office Mojo & OTT Distribution ({currentCountry})
            </p>
          </div>
        )}

        {/* Page-level Suspense boundary with dark-mode spinner */}
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
              <span className="text-xs text-slate-500 font-medium tracking-widest uppercase">Loading</span>
            </div>
          </div>
        }>

        {activeTab === 'home' && (
          <HomePage
            movies={movies}
            onSelectMovie={handleSelectMovie}
            watchlist={watchlist}
            onToggleWatchlist={handleToggleWatchlist}
            onPlayTrailer={handlePlayTrailer}
            onNavigateToAi={() => {
              setActiveTab('ai-discovery');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            currentCountry={currentCountry}
            onCountryChange={handleCountryChange}
            tasteProfile={tasteProfile}
            onOpenTasteModal={() => setIsTasteModalOpen(true)}
            onRefreshMovies={handleRefreshMovies}
            user={user}
          />
        )}

        {activeTab === 'details' && selectedMovie && (
          <ErrorBoundary onReset={() => setActiveTab('home')}>
          <MovieDetailsPage
              movie={selectedMovie}
              onBack={() => setActiveTab('home')}
              watchlist={watchlist}
              onToggleWatchlist={handleToggleWatchlist}
              onPlayTrailer={handlePlayTrailer}
              allMovies={movies}
              onSelectMovie={handleSelectMovie}
              currentCountry={currentCountry}
              onCountryChange={handleCountryChange}
              user={user}
              onOpenAuth={() => setIsAuthModalOpen(true)}
              apiKey={apiKeys.tmdb}
            />
          </ErrorBoundary>
        )}

        {activeTab === 'ai-discovery' && (
          <AiDiscoveryPage
            allMovies={movies}
            onSelectMovie={handleSelectMovie}
            apiKeys={apiKeys}
            onPlayTrailer={handlePlayTrailer}
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
        </Suspense>
      </main>

      {/* Cinema Preferences Onboarding Modal */}
      <OnboardingModal
        isOpen={isTasteModalOpen}
        onClose={() => setIsTasteModalOpen(false)}
        onSaveProfile={handleSaveTasteProfile}
        initialProfile={tasteProfile}
      />

      {/* Trailer Modal */}
      <TrailerModal
        isOpen={Boolean(trailerMovie)}
        onClose={() => setTrailerMovie(null)}
        youtubeId={trailerMovie?.youtubeTrailerId}
        movieTitle={trailerMovie?.title}
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

      {/* Footer */}
      <Footer 
        onNavigateToAi={() => {
          setActiveTab('ai-discovery');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
}
