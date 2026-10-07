import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';

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

  return (
    <div className="min-h-screen bg-[#0A0A09] text-[#F4F0EA] flex flex-col font-sans selection:bg-[#E03C31] selection:text-white antialiased relative overflow-x-hidden">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        movies={[]}
        watchlistCount={0}
        onSelectMovie={() => {}}
        onOpenSidebar={() => {}}
        user={null}
        onOpenAuth={() => {}}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 relative">
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-xs font-mono uppercase tracking-widest text-[#8C877E]">
            Route: {activeTab} — page under construction
          </p>
        </div>
      </main>
    </div>
  );
}
