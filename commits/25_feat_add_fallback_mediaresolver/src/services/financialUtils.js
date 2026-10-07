/**
 * Kinova Financial Utilities — Browser-Safe (src/services/financialUtils.js)
 *
 * Contains ONLY pure, zero-dependency utility functions that are safe to bundle
 * into the frontend. Critically, this file does NOT import axios or cheerio —
 * those belong exclusively in the Node.js backend (boxOfficeEngine.js / api/ routes).
 *
 * All frontend components should import from this file instead of boxOfficeEngine.js.
 */

import { formatRegionCurrency } from '../utils/currencyFormatter.js';

// ---------------------------------------------------------------------------
// Currency Formatting
// ---------------------------------------------------------------------------

/**
 * Format a monetary amount using regional currency settings.
 */
export function formatCurrency(amount, currencyOrRegion = 'USD', compactOrOptions = false) {
  if (typeof compactOrOptions === 'boolean') {
    return formatRegionCurrency(amount, currencyOrRegion, { compact: compactOrOptions });
  }
  return formatRegionCurrency(amount, currencyOrRegion, compactOrOptions);
}

// ---------------------------------------------------------------------------
// Box Office Verdict Calculator
// ---------------------------------------------------------------------------

/**
 * Pure algorithmic Box Office Verdict — zero external dependencies.
 *
 * Thresholds (aligned with Indian & global theatrical economics):
 *   >= 2.0x  Blockbuster  (>= 4.0x = All-Time Blockbuster)
 *   >= 1.3x  Super Hit
 *   >= 1.05x Hit
 *   >= 0.85x Average
 *   >= 0.45x Flop
 *   <  0.45x Disaster
 */
export function calculateBoxOfficeVerdict(budget, worldwideGross) {
  const numBudget = Number(budget);
  const numGross  = Number(worldwideGross);

  if (!numBudget || numBudget <= 0 || !numGross || numGross <= 0) {
    return {
      tier: 'unknown',
      title: 'Undisclosed Financials',
      color: 'stone',
      badgeClass: 'bg-[#181816] text-[#8C877E] border border-[#262522] rounded-[2px] font-mono',
      bgGradient: 'from-[#121210] to-[#121210]',
      multiplier: 'N/A',
      roi: 'N/A',
      breakEven: null,
      description: 'Production budget or global theatrical revenue was not publicly reported.'
    };
  }

  const multiplier = numGross / numBudget;
  const roi        = ((numGross - numBudget) / numBudget) * 100;
  const breakEven  = numBudget * 2.3;

  if (multiplier >= 2.0) {
    return {
      tier: 'blockbuster',
      title: multiplier >= 4.0 ? 'All-Time Blockbuster' : 'Blockbuster',
      badgeClass: 'bg-[#181816] text-[#D9C39A] border border-[#D9C39A]/40 rounded-[2px] font-mono',
      bgGradient: 'from-[#121210] to-[#121210]',
      multiplier: multiplier.toFixed(2),
      roi: roi.toFixed(1),
      breakEven,
      description: `Phenomenal performance! Grossed ${multiplier.toFixed(2)}x its production budget with exceptional global demand.`
    };
  } else if (multiplier >= 1.3) {
    return {
      tier: 'super-hit',
      title: 'Super Hit',
      badgeClass: 'bg-[#181816] text-[#D9C39A] border border-[#D9C39A]/30 rounded-[2px] font-mono',
      bgGradient: 'from-[#121210] to-[#121210]',
      multiplier: multiplier.toFixed(2),
      roi: roi.toFixed(1),
      breakEven,
      description: `Solid commercial victory. Earned ${multiplier.toFixed(2)}x budget, generating strong theatrical profits.`
    };
  } else if (multiplier >= 1.05) {
    return {
      tier: 'hit',
      title: 'Hit',
      badgeClass: 'bg-[#181816] text-[#F4F0EA] border border-[#262522] rounded-[2px] font-mono',
      bgGradient: 'from-[#121210] to-[#121210]',
      multiplier: multiplier.toFixed(2),
      roi: roi.toFixed(1),
      breakEven,
      description: 'Good theatrical run. Recovered production costs plus modest net profit.'
    };
  } else if (multiplier >= 0.85) {
    return {
      tier: 'average',
      title: 'Average',
      badgeClass: 'bg-[#181816] text-[#8C877E] border border-[#262522] rounded-[2px] font-mono',
      bgGradient: 'from-[#121210] to-[#121210]',
      multiplier: multiplier.toFixed(2),
      roi: roi.toFixed(1),
      breakEven,
      description: `Near break-even. Nearly recovered production costs (${multiplier.toFixed(2)}x budget). Ancillary revenue saves this.`
    };
  } else if (multiplier >= 0.45) {
    return {
      tier: 'flop',
      title: 'Flop',
      badgeClass: 'bg-[#181816] text-[#E03C31] border border-[#E03C31]/30 rounded-[2px] font-mono',
      bgGradient: 'from-[#121210] to-[#121210]',
      multiplier: multiplier.toFixed(2),
      roi: roi.toFixed(1),
      breakEven,
      description: `Underperformed expectations. Recovered ${(multiplier * 100).toFixed(0)}% of production costs — a net loss at the box office.`
    };
  } else {
    return {
      tier: 'disaster',
      title: 'Disaster',
      badgeClass: 'bg-[#181816] text-[#E03C31] border border-[#E03C31]/50 rounded-[2px] font-mono',
      bgGradient: 'from-[#121210] to-[#121210]',
      multiplier: multiplier.toFixed(2),
      roi: roi.toFixed(1),
      breakEven,
      description: 'Severe commercial loss. Grossed less than 45% of budget, resulting in substantial studio write-downs.'
    };
  }
}

// ---------------------------------------------------------------------------
// Industry Revenue Splits Calculator
// ---------------------------------------------------------------------------

/**
 * Computes theatrical exhibitor cut and studio rental share.
 * Domestic ~50% rental | International ~40% net theatrical share
 */
export function calculateIndustryTheatricalSplits({
  domesticGross = 0,
  internationalGross = 0,
  worldwideGross = 0,
  budget = 0
} = {}) {
  const actualWorldwide = worldwideGross || (domesticGross + internationalGross);

  if (!actualWorldwide || actualWorldwide <= 0) {
    return {
      domesticDistributorShare: 0,
      internationalDistributorShare: 0,
      totalDistributorShare: 0,
      estimatedExhibitorCut: 0,
      netTheatricalCollection: 0,
      breakevenThreshold: budget > 0 ? Math.round(budget * 2.3) : 0,
      theatricalProfitLoss: 0,
      multiplier: 0
    };
  }

  const domesticDistributorShare      = Math.round(domesticGross * 0.50);
  const internationalDistributorShare = Math.round(internationalGross * 0.40);
  const totalDistributorShare =
    domesticDistributorShare + internationalDistributorShare ||
    Math.round(actualWorldwide * 0.45);
  const estimatedExhibitorCut = Math.max(0, actualWorldwide - totalDistributorShare);

  return {
    domesticDistributorShare,
    internationalDistributorShare,
    totalDistributorShare,
    estimatedExhibitorCut,
    netTheatricalCollection: totalDistributorShare,
    breakevenThreshold: budget > 0 ? Math.round(budget * 2.3) : 0,
    theatricalProfitLoss: budget > 0 ? totalDistributorShare - budget : 0,
    multiplier: budget > 0 ? Number((actualWorldwide / budget).toFixed(2)) : 0
  };
}

export function getVerdictBadgeClass(tier) {
  switch (tier?.toLowerCase()) {
    case 'blockbuster':
      return 'bg-[#181816] text-[#D9C39A] border border-[#D9C39A]/40 rounded-[2px] font-mono';
    case 'super-hit':
      return 'bg-[#181816] text-[#D9C39A] border border-[#D9C39A]/30 rounded-[2px] font-mono';
    case 'hit':
      return 'bg-[#181816] text-[#F4F0EA] border border-[#262522] rounded-[2px] font-mono';
    case 'average':
      return 'bg-[#181816] text-[#8C877E] border border-[#262522] rounded-[2px] font-mono';
    case 'flop':
      return 'bg-[#181816] text-[#E03C31] border border-[#E03C31]/30 rounded-[2px] font-mono';
    case 'disaster':
      return 'bg-[#181816] text-[#E03C31] border border-[#E03C31]/50 rounded-[2px] font-mono';
    default:
      return 'bg-[#181816] text-[#8C877E] border border-[#262522] rounded-[2px] font-mono';
  }
}

