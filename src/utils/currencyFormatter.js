/**
 * Centralized Regional Currency Formatting & Conversion Utility (src/utils/currencyFormatter.js)
 * 
 * Dynamically converts and formats base USD financials (or native scraped INR values)
 * into regional currencies using official territorial box office conventions:
 * 
 * - India ('IN'): Indian Box Office System (Crores '₹X Cr' for >= 10M INR, Lakhs '₹X Lakh' for >= 100K INR)
 * - United States ('US'): USD ($M / $B)
 * - United Kingdom ('GB'): GBP (£M / £B)
 * - European Union ('DE', 'FR', 'ES', 'IT', 'EU', 'NL', 'IE'): EUR (€M / €B)
 * - Japan ('JP'): JPY (¥M / ¥B)
 * - Canada ('CA'): CAD (CA$M / CA$B)
 * - Australia ('AU'): AUD (A$M / A$B)
 */

export const EXCHANGE_RATES = {
  US: { currency: 'USD', symbol: '$', rate: 1.0, label: 'United States Dollar (USD)' },
  IN: { currency: 'INR', symbol: '₹', rate: 84.0, label: 'Indian Rupee (INR)' },
  GB: { currency: 'GBP', symbol: '£', rate: 0.79, label: 'British Pound (GBP)' },
  DE: { currency: 'EUR', symbol: '€', rate: 0.92, label: 'Euro (EUR)' },
  FR: { currency: 'EUR', symbol: '€', rate: 0.92, label: 'Euro (EUR)' },
  ES: { currency: 'EUR', symbol: '€', rate: 0.92, label: 'Euro (EUR)' },
  IT: { currency: 'EUR', symbol: '€', rate: 0.92, label: 'Euro (EUR)' },
  EU: { currency: 'EUR', symbol: '€', rate: 0.92, label: 'Euro (EUR)' },
  NL: { currency: 'EUR', symbol: '€', rate: 0.92, label: 'Euro (EUR)' },
  IE: { currency: 'EUR', symbol: '€', rate: 0.92, label: 'Euro (EUR)' },
  JP: { currency: 'JPY', symbol: '¥', rate: 150.0, label: 'Japanese Yen (JPY)' },
  CA: { currency: 'CAD', symbol: 'CA$', rate: 1.36, label: 'Canadian Dollar (CAD)' },
  AU: { currency: 'AUD', symbol: 'A$', rate: 1.52, label: 'Australian Dollar (AUD)' }
};

// Aliases mapping currency code to country code
const CURRENCY_TO_REGION_MAP = {
  USD: 'US',
  INR: 'IN',
  GBP: 'GB',
  EUR: 'DE',
  JPY: 'JP',
  CAD: 'CA',
  AUD: 'AU'
};

/**
 * Robust numeric parser for amounts (handles raw numbers, strings, or strings with unit multipliers)
 */
export function parseRawNumericAmount(amount) {
  if (amount === undefined || amount === null || amount === '') return null;
  if (typeof amount === 'number') {
    return isNaN(amount) || amount <= 0 ? null : amount;
  }
  const str = String(amount).trim();
  if (
    str === 'N/A' || 
    str === 'Not Reported' || 
    str === 'Data Unavailable' || 
    str === 'Undisclosed' || 
    str === '0' ||
    str === '$0'
  ) {
    return null;
  }

  // Handle strings like "$43.5M", "£30.7M", "$1.2B"
  const multiplierMatch = str.match(/([0-9.]+)\s*([BMK])\b/i);
  if (multiplierMatch) {
    const val = parseFloat(multiplierMatch[1]);
    const unit = multiplierMatch[2].toUpperCase();
    if (unit === 'B') return Math.round(val * 1e9);
    if (unit === 'M') return Math.round(val * 1e6);
    if (unit === 'K') return Math.round(val * 1e3);
  }

  // Handle strings like "₹365 Cr" or "365 crore"
  const croreMatch = str.match(/([0-9.]+)\s*(?:Cr|Crore)/i);
  if (croreMatch) {
    const val = parseFloat(croreMatch[1]);
    return Math.round((val * 10000000) / 84);
  }

  const cleaned = str.replace(/[^0-9.]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) || parsed <= 0 ? null : parsed;
}

/**
 * Format dynamic regional currency with Indian Box Office system (Crores/Lakhs) and international abbreviations.
 * 
 * @param {number|string} amount Base amount in USD (or raw number)
 * @param {string} regionCode Territorial region ('IN', 'US', 'GB', 'DE', etc.) or currency code ('USD', 'INR')
 * @param {object|boolean} [options={}] Formatting options or boolean for compact
 * @returns {string} Formatted currency string or 'Not Reported'
 */
export function formatRegionCurrency(amount, regionCode = 'IN', options = {}) {
  // Support legacy boolean compact parameter
  const isCompact = typeof options === 'boolean' ? options : (options.compact !== false);
  const nativeInrCrores = typeof options === 'object' ? options.nativeInrCrores : null;
  const fallback = (typeof options === 'object' && options.fallback) ? options.fallback : 'Not Reported';

  // Normalize region code (handling currency strings like 'USD' or 'INR')
  let cleanRegion = String(regionCode || 'IN').toUpperCase().trim();
  if (CURRENCY_TO_REGION_MAP[cleanRegion]) {
    cleanRegion = CURRENCY_TO_REGION_MAP[cleanRegion];
  }

  // 1. If native pre-scraped INR Crore value exists and region is India, preserve exact Crore figure without rounding loss
  if (cleanRegion === 'IN' && nativeInrCrores !== undefined && nativeInrCrores !== null && Number(nativeInrCrores) > 0) {
    const numCrores = Number(nativeInrCrores);
    const formatted = Number(numCrores.toFixed(1)).toString();
    return `₹${formatted} Cr`;
  }

  // 2. Parse numeric USD base amount
  const numericUSD = parseRawNumericAmount(amount);
  if (numericUSD === null || numericUSD <= 0) {
    return fallback;
  }

  // 3. Indian Box Office System ('IN')
  if (cleanRegion === 'IN') {
    const inrValue = numericUSD * 84;

    // Values >= 1 Crore (10,000,000 INR)
    if (inrValue >= 10000000) {
      const crores = inrValue / 10000000;
      // Round to 1 decimal place, stripping trailing zero if whole
      const formatted = Number(crores.toFixed(1)).toString();
      return `₹${formatted} Cr`;
    }

    // Values >= 1 Lakh (100,000 INR) and < 1 Crore
    if (inrValue >= 100000) {
      const lakhs = inrValue / 100000;
      const formatted = Number(lakhs.toFixed(1)).toString();
      return `₹${formatted} Lakh`;
    }

    // Values < 1 Lakh
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(Math.round(inrValue));
  }

  // 4. Other Regions (US, GB, DE, FR, ES, IT, EU, JP, CA, AU)
  const regionConfig = EXCHANGE_RATES[cleanRegion] || EXCHANGE_RATES.US;
  const converted = numericUSD * regionConfig.rate;

  if (isCompact) {
    if (converted >= 1e9) {
      return `${regionConfig.symbol}${Number((converted / 1e9).toFixed(2))}B`;
    }
    if (converted >= 1e6) {
      return `${regionConfig.symbol}${Number((converted / 1e6).toFixed(1))}M`;
    }
    if (converted >= 1e3) {
      return `${regionConfig.symbol}${Number((converted / 1e3).toFixed(0))}K`;
    }
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: regionConfig.currency,
    maximumFractionDigits: 0
  }).format(Math.round(converted));
}

// Default export and standard alias for seamless backwards-compatibility
export const formatCurrency = formatRegionCurrency;
export default formatRegionCurrency;
