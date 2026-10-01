import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { formatRegionCurrency, EXCHANGE_RATES } from '../utils/currencyFormatter';
import { detectUserCountry } from '../services/movieApi';

export const RegionContext = createContext(null);

export function RegionProvider({ children }) {
  // Region defaults to user preference or 'IN'
  const [selectedRegion, setSelectedRegionState] = useState(() => {
    return localStorage.getItem('kinova_country') || localStorage.getItem('cinepulse_country') || 'IN';
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

  // Auto-detect geo if not cached
  useEffect(() => {
    async function initGeo() {
      if (!localStorage.getItem('kinova_country') && !localStorage.getItem('cinepulse_country')) {
        const detected = await detectUserCountry('IN');
        if (detected) {
          setSelectedRegion(detected);
        }
      }
    }
    initGeo();
  }, [setSelectedRegion]);

  // Bound formatting helper for the active region
  const format = useCallback((amount, options = {}) => {
    return formatRegionCurrency(amount, selectedRegion, options);
  }, [selectedRegion]);

  return (
    <RegionContext.Provider
      value={{
        selectedRegion,
        setSelectedRegion,
        currentCountry: selectedRegion,
        setCurrentCountry: setSelectedRegion,
        formatRegionCurrency: format,
        formatCurrency: format,
        exchangeRates: EXCHANGE_RATES
      }}
    >
      {children}
    </RegionContext.Provider>
  );
}

export function useRegion() {
  const ctx = useContext(RegionContext);
  if (!ctx) {
    const fallbackRegion = 'IN';
    return {
      selectedRegion: fallbackRegion,
      setSelectedRegion: () => {},
      currentCountry: fallbackRegion,
      setCurrentCountry: () => {},
      formatRegionCurrency: (amount, options) => formatRegionCurrency(amount, fallbackRegion, options),
      formatCurrency: (amount, options) => formatRegionCurrency(amount, fallbackRegion, options),
      exchangeRates: EXCHANGE_RATES
    };
  }
  return ctx;
}
