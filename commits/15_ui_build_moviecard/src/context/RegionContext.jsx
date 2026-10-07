import React, { createContext, useContext, useState, useCallback } from 'react';
import { formatRegionCurrency, EXCHANGE_RATES } from '../utils/currencyFormatter';

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
    return {
      selectedRegion: DEFAULT_REGION,
      setSelectedRegion: () => {},
      currentCountry: DEFAULT_REGION,
      setCurrentCountry: () => {},
      formatRegionCurrency: (amount, options) => formatRegionCurrency(amount, DEFAULT_REGION, options),
      formatCurrency: (amount, options) => formatRegionCurrency(amount, DEFAULT_REGION, options),
      exchangeRates: EXCHANGE_RATES
    };
  }
  return ctx;
}
