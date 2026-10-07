import React, { createContext, useContext, useState, useCallback } from 'react';

export const RegionContext = createContext(null);

const DEFAULT_REGION = 'IN';

export function RegionProvider({ children }) {
  const [selectedRegion, setSelectedRegionState] = useState(() => {
    try {
      return localStorage.getItem('kinova_country') || localStorage.getItem('cinepulse_country') || DEFAULT_REGION;
    } catch {
      return DEFAULT_REGION;
    }
  });

  const setSelectedRegion = useCallback((code) => {
    if (!code) return;
    const cleanCode = String(code).toUpperCase().trim();
    setSelectedRegionState(cleanCode);
    try {
      localStorage.setItem('kinova_country', cleanCode);
      localStorage.setItem('cinepulse_country', cleanCode);
    } catch (e) {}
  }, []);

  return (
    <RegionContext.Provider
      value={{
        selectedRegion,
        setSelectedRegion,
        currentCountry: selectedRegion,
        setCurrentCountry: setSelectedRegion
      }}
    >
      {children}
    </RegionContext.Provider>
  );
}

export function useRegion() {
  const ctx = useContext(RegionContext);
  if (!ctx) {
    return {
      selectedRegion: DEFAULT_REGION,
      setSelectedRegion: () => {},
      currentCountry: DEFAULT_REGION,
      setCurrentCountry: () => {}
    };
  }
  return ctx;
}
