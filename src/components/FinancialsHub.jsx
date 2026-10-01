import React from 'react';
import { 
  DollarSign, TrendingUp, Award, PieChart, ShieldCheck, 
  HelpCircle, ArrowUpRight, BarChart3, AlertCircle, Sparkles, Globe, Calendar
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { calculateBoxOfficeVerdict } from '../services/financialUtils';
import { useRegion } from '../context/RegionContext';
import { formatRegionCurrency, EXCHANGE_RATES } from '../utils/currencyFormatter';

export default function FinancialsHub({ financials, movieTitle, currentCountry, isUpcoming = false, releaseDate = null, tmdbStatus = null }) {
  const regionContext = useRegion();
  const activeRegion = currentCountry || regionContext?.selectedRegion || 'IN';
  const regionConfig = EXCHANGE_RATES[activeRegion] || EXCHANGE_RATES.US;

  if (!financials) {
    return (
      <div className="glass-card rounded-2xl p-6 text-center text-slate-400">
        No financial tracking data available for this title.
      </div>
    );
  }

  // Compute live verdict from real financials
  const liveVerdict = calculateBoxOfficeVerdict(
    financials.budgetRaw ?? financials.budget,
    financials.worldwideGrossRaw ?? financials.worldwideGross,
    financials.domesticNetRaw ?? financials.domesticNet
  );

  const handleCelebrate = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const numBudget = Number(financials.budgetRaw ?? financials.budget) || 0;
  const numGross = Number(financials.worldwideGrossRaw ?? financials.worldwideGross) || 0;
  const numDomestic = Number(financials.domesticNetRaw ?? financials.domesticNet) || 0;
  const numOpening = Number(financials.openingWeekendDomesticRaw ?? financials.openingWeekendDomestic) || 0;

  const breakEven = numBudget > 0 ? numBudget * 2.3 : null;
  const breakEvenProgress = (breakEven && breakEven > 0 && numGross > 0)
    ? Math.min(100, Math.round((numGross / breakEven) * 100))
    : null;

  // Format release date nicely
  const formattedReleaseDate = releaseDate ? (() => {
    try { return new Date(releaseDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }); }
    catch { return releaseDate; }
  })() : null;

  // ─── UPCOMING MOVIE: Show special pre-release banner instead of verdict ───
  if (isUpcoming) {
    const statusLabel = tmdbStatus === 'In Production' ? 'Currently in Production'
      : tmdbStatus === 'Post Production' ? 'In Post-Production'
      : tmdbStatus === 'Planned' ? 'Greenlit & Announced'
      : formattedReleaseDate ? `Scheduled for ${formattedReleaseDate}`
      : 'Upcoming Theatrical Release';

    return (
      <div className="space-y-6">
        {/* Pre-Release Banner */}
        <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 border border-sky-500/20 bg-gradient-to-br from-sky-500/10 via-slate-900/60 to-transparent glass-card">
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(ellipse at 20% 50%, #0ea5e9 0%, transparent 60%)' }} />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs uppercase tracking-widest font-bold text-sky-400 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" /> Theatrical Release Status
                </span>
                <span className="px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 text-[10px] font-bold border border-sky-500/30">
                  {tmdbStatus || 'Upcoming'}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 text-[10px] font-bold border border-amber-500/25 flex items-center gap-1">
                  <Globe className="w-3 h-3 text-amber-400" /> {regionConfig.label} ({regionConfig.symbol})
                </span>
              </div>
              <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-heading">
                {statusLabel}
              </h3>
              <p className="text-sm text-sky-200/80 max-w-2xl leading-relaxed">
                {movieTitle} is scheduled for theatrical release{formattedReleaseDate ? ` on ${formattedReleaseDate}` : ' soon'}. Box office collections, worldwide gross, and verdict will be tracked once the film opens theatrically.
              </p>
            </div>

            {/* Countdown-style visual indicator */}
            <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 sm:border-l border-sky-500/20 pt-4 sm:pt-0 sm:pl-8 gap-1 flex-shrink-0">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Box Office</span>
              <span className="text-3xl font-extrabold font-heading text-sky-400">TBA</span>
              <span className="text-[11px] text-slate-400">Opens {formattedReleaseDate || 'Soon'}</span>
            </div>
          </div>
        </div>

        {/* Budget section (if reported even before release) */}
        {numBudget > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="glass-card glass-card-hover rounded-2xl p-5 border border-white/10">
              <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
                <span>Est. Production Budget</span>
                <ShieldCheck className="w-4 h-4 text-blue-400" />
              </div>
              <div className="text-2xl font-extrabold text-white font-heading">
                {formatRegionCurrency(numBudget, activeRegion, { nativeInrCrores: financials.budgetInrCrores })}
              </div>
              <div className="text-[11px] text-slate-400 font-medium mt-1">
                Reported production spend — box office TBA upon release
              </div>
            </div>
            <div className="glass-card rounded-2xl p-5 border border-white/10">
              <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
                <span>Break-Even Target (~2.3x)</span>
                <TrendingUp className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-extrabold text-white font-heading">
                {formatRegionCurrency(numBudget * 2.3, activeRegion, { nativeInrCrores: financials.budgetInrCrores ? Math.round(financials.budgetInrCrores * 2.3 * 10) / 10 : null })}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Required worldwide gross for profitability</div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner / Verdict Card */}
      <div className={`relative overflow-hidden rounded-3xl p-6 sm:p-8 border border-white/10 bg-gradient-to-br ${liveVerdict.bgGradient} glass-card`}>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs uppercase tracking-widest font-bold text-slate-400 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-400" />
                Theatrical Box Office Verdict
              </span>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 text-[10px] font-bold border border-amber-500/25 flex items-center gap-1">
                <Globe className="w-3 h-3 text-amber-400" /> {regionConfig.label} ({regionConfig.symbol})
              </span>
              {financials.boxOfficeMojoEnriched && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Box Office Mojo Scraped
                </span>
              )}
              {liveVerdict.tier === 'blockbuster' && (
                <button 
                  onClick={handleCelebrate}
                  className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-semibold hover:bg-amber-500/30 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3 h-3 text-amber-400 animate-spin" />
                  Celebrate
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-baseline gap-3">
              <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-heading">
                {liveVerdict.title}
              </h3>
              <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${liveVerdict.badgeClass}`}>
                {liveVerdict.multiplier !== 'N/A' ? `${liveVerdict.multiplier}x Budget Multiple` : 'Multiple: Data Unavailable'}
              </div>
            </div>

            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              {liveVerdict.description}
            </p>
          </div>

          {/* ROI Metric Highlight */}
          <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 sm:border-l border-white/10 pt-4 sm:pt-0 sm:pl-8 gap-1 flex-shrink-0">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Est. Net ROI
            </span>
            <span className={`text-3xl font-extrabold font-heading ${liveVerdict.roi !== 'N/A' ? (Number(liveVerdict.roi) >= 0 ? 'text-emerald-400' : 'text-rose-400') : 'text-slate-400'}`}>
              {liveVerdict.roi !== 'N/A' ? `${Number(liveVerdict.roi) > 0 ? '+' : ''}${liveVerdict.roi}%` : 'N/A'}
            </span>
            <span className="text-[11px] text-slate-400">
              Break-Even: {breakEven ? formatRegionCurrency(breakEven, activeRegion, { compact: true }) : 'Data Unavailable'}
            </span>
          </div>
        </div>

        {/* Break-even Progress Bar */}
        <div className="mt-6 pt-6 border-t border-white/10 space-y-2">
          <div className="flex justify-between text-xs font-medium text-slate-300">
            <span>Break-Even Threshold ({breakEven ? formatRegionCurrency(breakEven, activeRegion, { compact: true }) : 'Data Unavailable'})</span>
            <span className="font-bold text-white">{breakEvenProgress !== null ? `${breakEvenProgress}% Achieved` : 'Data Unavailable'}</span>
          </div>
          <div className="w-full h-3 bg-slate-900/80 rounded-full overflow-hidden border border-white/5 relative">
            <div 
              className={`h-full transition-all duration-1000 ${
                (breakEvenProgress || 0) >= 100 
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-glow-emerald' 
                  : 'bg-gradient-to-r from-amber-500 to-rose-500'
              }`}
              style={{ width: `${breakEvenProgress !== null ? breakEvenProgress : 0}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-slate-400">
            <span>Production: {formatRegionCurrency(financials.budgetRaw ?? financials.budget, activeRegion, { nativeInrCrores: financials.budgetInrCrores, compact: true })}</span>
            <span>Worldwide: {formatRegionCurrency(financials.worldwideGrossRaw ?? financials.worldwideGross, activeRegion, { nativeInrCrores: financials.grossInrCrores, compact: true })}</span>
          </div>
        </div>
      </div>

      {/* Financial Core Numbers Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Worldwide Gross */}
        <div className="glass-card glass-card-hover rounded-2xl p-5 border border-white/10">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
            <span>Worldwide Gross</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-heading">
            {formatRegionCurrency(financials.worldwideGrossRaw ?? financials.worldwideGross, activeRegion, { nativeInrCrores: financials.grossInrCrores })}
          </div>
          <div className="text-[11px] text-emerald-400/90 font-medium mt-1 flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" />
            {numBudget > 0 && numGross > 0 ? `${(numGross / numBudget).toFixed(2)}x Production Budget` : 'Multiple: Data Unavailable'}
          </div>
        </div>

        {/* Domestic Net Collection */}
        <div className="glass-card glass-card-hover rounded-2xl p-5 border border-white/10">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
            <span>Domestic Net (USA/CAN)</span>
            <DollarSign className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-heading">
            {formatRegionCurrency(financials.domesticNetRaw ?? financials.domesticNet, activeRegion)}
          </div>
          <div className="text-[11px] text-slate-400 font-medium mt-1">
            {numDomestic > 0 && numGross > 0 ? `${((numDomestic / numGross) * 100).toFixed(1)}% of Global Total` : 'Share of Global: Data Unavailable'}
          </div>
        </div>

        {/* Production Budget */}
        <div className="glass-card glass-card-hover rounded-2xl p-5 border border-white/10">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
            <span>Production Budget</span>
            <ShieldCheck className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-heading">
            {formatRegionCurrency(financials.budgetRaw ?? financials.budget, activeRegion, { nativeInrCrores: financials.budgetInrCrores })}
          </div>
          <div className="text-[11px] text-slate-400 font-medium mt-1">
            Marketing: {numBudget > 0 ? `~${formatRegionCurrency(financials.marketingBudget || numBudget * 0.5, activeRegion, { compact: true })}` : 'Data Unavailable'}
          </div>
        </div>

        {/* Distributor Worldwide Share */}
        <div className="glass-card glass-card-hover rounded-2xl p-5 border border-white/10">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
            <span>Distributor Net Share</span>
            <PieChart className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-heading">
            {formatRegionCurrency(
              financials.distributorShareWorldwideRaw ?? financials.distributorShareWorldwide, 
              activeRegion, 
              { nativeInrCrores: financials.grossInrCrores ? Math.round(financials.grossInrCrores * 0.47 * 10) / 10 : null }
            )}
          </div>
          <div className="text-[11px] text-purple-300/80 font-medium mt-1">
            Theatrical Studio Rental Cut (~47%)
          </div>
        </div>
      </div>

      {/* Opening Weekend & Leg Multipliers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card rounded-2xl p-5 border border-white/10">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            Domestic Opening Weekend
          </span>
          <span className="text-xl font-bold text-white font-heading">
            {formatRegionCurrency(financials.openingWeekendDomesticRaw ?? financials.openingWeekendDomestic, activeRegion)}
          </span>
          <p className="text-xs text-slate-400 mt-2">
            {numOpening > 0 && numDomestic > 0
              ? `Represents ${((numOpening / numDomestic) * 100).toFixed(1)}% of total domestic run.`
              : 'Domestic run breakdown unavailable.'}
          </p>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-white/10">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            Global Opening Weekend
          </span>
          <span className="text-xl font-bold text-white font-heading">
            {formatRegionCurrency(financials.openingWeekendWorldwideRaw ?? financials.openingWeekendWorldwide, activeRegion)}
          </span>
          <p className="text-xs text-slate-400 mt-2">
            Simultaneous day-and-date international rollout footprint.
          </p>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-white/10">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            Theatrical Multiplier (Legs)
          </span>
          <span className="text-xl font-bold text-amber-400 font-heading">
            {financials.multiplier || (numDomestic > 0 && numOpening > 0 ? `${(numDomestic / numOpening).toFixed(2)}x` : 'N/A')}
          </span>
          <p className="text-xs text-slate-400 mt-2">
            Higher than 3.0x indicates outstanding word-of-mouth & repeat viewings.
          </p>
        </div>
      </div>

      {/* Territory Breakdown Accordion / Card */}
      {financials.territoryBreakdown && financials.territoryBreakdown.length > 0 && (
        <div className="glass-card rounded-2xl p-6 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-base font-bold text-white font-heading flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-rose-500" />
              Regional Box Office Distribution
            </h4>
            <span className="text-xs text-slate-400">Audited studio theatrical splits</span>
          </div>

          <div className="space-y-3">
            {financials.territoryBreakdown.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">{item.territory}</span>
                  <span className="text-slate-200 font-bold font-mono">
                    {formatRegionCurrency(item.gross, activeRegion)} ({item.sharePct}%)
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-rose-500 to-amber-500 rounded-full" 
                    style={{ width: `${Math.min(100, item.sharePct * 1.5)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Domestic Distributor & Theatrical Split Architecture */}
      <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
          <div>
            <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">Domestic Distribution Partner</span>
            <h4 className="text-base font-bold text-white font-heading">{financials.domesticDistributor || 'Independent / Studio Not Listed'}</h4>
          </div>
          <span className="text-[11px] text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 font-medium">
            Standard Theatrical Model: 50/40/25 Rule
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5">
            <span className="text-slate-400 block mb-0.5">Domestic Cut (50%)</span>
            <span className="font-bold text-emerald-400 text-sm">
              {numDomestic > 0 ? formatRegionCurrency(Math.round(numDomestic * 0.50), activeRegion) : 'Data Unavailable'}
            </span>
            <p className="text-[10px] text-slate-500 mt-1">Est. Studio rental share returned from USA/CAN exhibitors</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5">
            <span className="text-slate-400 block mb-0.5">Overseas Cut (40%)</span>
            <span className="font-bold text-teal-400 text-sm">
              {Number(financials.overseasGross) > 0 ? formatRegionCurrency(Math.round(Number(financials.overseasGross) * 0.40), activeRegion) : 'Data Unavailable'}
            </span>
            <p className="text-[10px] text-slate-500 mt-1">Average international theatrical distributor net margin</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5">
            <span className="text-slate-400 block mb-0.5">Exhibitor Retention (~53%)</span>
            <span className="font-bold text-amber-400 text-sm">
              {numGross > 0 ? formatRegionCurrency(Math.max(0, numGross - (financials.distributorShareWorldwide || Math.round(numGross * 0.47))), activeRegion) : 'Data Unavailable'}
            </span>
            <p className="text-[10px] text-slate-500 mt-1">Retained by global cinema chains & multiplexes</p>
          </div>
        </div>
      </div>

    </div>
  );
}

