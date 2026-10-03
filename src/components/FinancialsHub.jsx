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
      <div className="bg-[#121210] border border-[#262522] rounded-[4px] p-6 text-center text-[#8C877E] font-mono text-xs">
        NO AUDITED FINANCIAL TRACKING DATA AVAILABLE FOR THIS TITLE.
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
        <div className="relative overflow-hidden rounded-[4px] p-6 sm:p-8 border border-[#262522] bg-[#121210]">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#709CA8] flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" /> Theatrical Release Status
                </span>
                <span className="px-2 py-0.5 rounded-[2px] bg-[#181816] text-[#709CA8] text-[10px] font-mono border border-[#709CA8]/30">
                  {tmdbStatus || 'Upcoming'}
                </span>
                <span className="px-2 py-0.5 rounded-[2px] bg-[#181816] text-[#D9C39A] text-[10px] font-mono border border-[#D9C39A]/25 flex items-center gap-1">
                  <Globe className="w-3 h-3 text-[#D9C39A]" /> {regionConfig.label} ({regionConfig.symbol})
                </span>
              </div>
              <h3 className="text-3xl sm:text-4xl font-serif text-[#F4F0EA]">
                {statusLabel}
              </h3>
              <p className="text-xs sm:text-sm text-[#8C877E] max-w-2xl leading-relaxed">
                {movieTitle} is scheduled for theatrical release{formattedReleaseDate ? ` on ${formattedReleaseDate}` : ' soon'}. Audited box office collections, worldwide ledger, and break-even milestones will be reported upon release.
              </p>
            </div>

            {/* Visual indicator */}
            <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 sm:border-l border-[#262522] pt-4 sm:pt-0 sm:pl-8 gap-1 flex-shrink-0">
              <span className="text-[10px] font-mono text-[#8C877E] uppercase tracking-wider">Box Office</span>
              <span className="text-3xl font-serif text-[#709CA8]">TBA</span>
              <span className="text-[11px] font-mono text-[#8C877E]">Opens {formattedReleaseDate || 'Soon'}</span>
            </div>
          </div>
        </div>

        {/* Budget section */}
        {numBudget > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-[#121210] rounded-[4px] p-5 border border-[#262522]">
              <div className="flex items-center justify-between text-[#8C877E] text-[11px] font-mono uppercase tracking-wider mb-1">
                <span>Est. Production Spend</span>
                <ShieldCheck className="w-4 h-4 text-[#709CA8]" />
              </div>
              <div className="text-2xl font-mono text-[#F4F0EA] tabular-nums">
                {formatRegionCurrency(numBudget, activeRegion, { nativeInrCrores: financials.budgetInrCrores })}
              </div>
              <div className="text-[11px] text-[#8C877E] mt-1 font-mono">
                Reported studio capital allocation
              </div>
            </div>
            <div className="bg-[#121210] rounded-[4px] p-5 border border-[#262522]">
              <div className="flex items-center justify-between text-[#8C877E] text-[11px] font-mono uppercase tracking-wider mb-1">
                <span>Break-Even Target (~2.3x)</span>
                <TrendingUp className="w-4 h-4 text-[#D9C39A]" />
              </div>
              <div className="text-2xl font-mono text-[#D9C39A] tabular-nums">
                {formatRegionCurrency(numBudget * 2.3, activeRegion, { nativeInrCrores: financials.budgetInrCrores ? Math.round(financials.budgetInrCrores * 2.3 * 10) / 10 : null })}
              </div>
              <div className="text-[11px] text-[#8C877E] mt-1 font-mono">Required worldwide theatrical gross for break-even</div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner / Verdict Card */}
      <div className="relative overflow-hidden rounded-[4px] p-6 sm:p-8 border border-[#262522] bg-[#121210]">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#8C877E] flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-[#D9C39A]" />
                Theatrical Box Office Verdict
              </span>
              <span className="px-2 py-0.5 rounded-[2px] bg-[#181816] text-[#D9C39A] text-[10px] font-mono border border-[#D9C39A]/25 flex items-center gap-1">
                <Globe className="w-3 h-3 text-[#D9C39A]" /> {regionConfig.label} ({regionConfig.symbol})
              </span>
              {financials.boxOfficeMojoEnriched && (
                <span className="px-2 py-0.5 rounded-[2px] bg-[#181816] text-[#709CA8] text-[10px] font-mono border border-[#709CA8]/30 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Mojo Audited
                </span>
              )}
              {liveVerdict.tier === 'blockbuster' && (
                <button 
                  onClick={handleCelebrate}
                  className="px-2 py-0.5 rounded-[2px] bg-[#181816] text-[#D9C39A] text-[10px] font-mono border border-[#D9C39A]/40 hover:bg-[#201F1D] transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3 h-3 text-[#D9C39A] animate-spin" />
                  Celebrate Run
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-baseline gap-3">
              <h3 className="text-3xl sm:text-4xl font-serif text-[#F4F0EA] tracking-wide">
                {liveVerdict.title}
              </h3>
              <div className="px-2.5 py-0.5 rounded-[2px] font-mono text-[11px] uppercase tracking-wider bg-[#181816] text-[#D9C39A] border border-[#D9C39A]/30">
                {liveVerdict.multiplier !== 'N/A' ? `${liveVerdict.multiplier}x Multiple` : 'Multiple Unavailable'}
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#8C877E] max-w-2xl leading-relaxed font-sans">
              {liveVerdict.description}
            </p>
          </div>

          {/* ROI Metric Highlight */}
          <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 sm:border-l border-[#262522] pt-4 sm:pt-0 sm:pl-8 gap-1 flex-shrink-0">
            <span className="text-[10px] font-mono text-[#8C877E] uppercase tracking-widest">
              Est. Net ROI
            </span>
            <span className={`text-3xl font-mono tabular-nums ${liveVerdict.roi !== 'N/A' ? (Number(liveVerdict.roi) >= 0 ? 'text-emerald-400' : 'text-[#E03C31]') : 'text-[#8C877E]'}`}>
              {liveVerdict.roi !== 'N/A' ? `${Number(liveVerdict.roi) > 0 ? '+' : ''}${liveVerdict.roi}%` : 'N/A'}
            </span>
            <span className="text-[11px] font-mono text-[#8C877E] tabular-nums">
              Break-Even: {breakEven ? formatRegionCurrency(breakEven, activeRegion, { compact: true }) : 'N/A'}
            </span>
          </div>
        </div>

        {/* Break-even Progress Bar */}
        <div className="mt-6 pt-5 border-t border-[#262522] space-y-2">
          <div className="flex justify-between text-xs font-mono text-[#8C877E]">
            <span>Break-Even Threshold ({breakEven ? formatRegionCurrency(breakEven, activeRegion, { compact: true }) : 'N/A'})</span>
            <span className="text-[#D9C39A] font-semibold">{breakEvenProgress !== null ? `${breakEvenProgress}% Achieved` : 'N/A'}</span>
          </div>
          <div className="w-full h-1.5 bg-[#181816] rounded-[2px] overflow-hidden border border-[#262522] relative">
            <div 
              className={`h-full transition-all duration-1000 ${
                (breakEvenProgress || 0) >= 100 
                  ? 'bg-emerald-400' 
                  : 'bg-[#D9C39A]'
              }`}
              style={{ width: `${breakEvenProgress !== null ? breakEvenProgress : 0}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] font-mono text-[#8C877E] tabular-nums">
            <span>Spend: {formatRegionCurrency(financials.budgetRaw ?? financials.budget, activeRegion, { nativeInrCrores: financials.budgetInrCrores, compact: true })}</span>
            <span>Worldwide: {formatRegionCurrency(financials.worldwideGrossRaw ?? financials.worldwideGross, activeRegion, { nativeInrCrores: financials.grossInrCrores, compact: true })}</span>
          </div>
        </div>
      </div>

      {/* Financial Core Numbers Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Worldwide Gross */}
        <div className="bg-[#121210] rounded-[4px] p-5 border border-[#262522]">
          <div className="flex items-center justify-between text-[#8C877E] text-[10px] font-mono uppercase tracking-wider mb-1">
            <span>Worldwide Gross</span>
            <TrendingUp className="w-3.5 h-3.5 text-[#D9C39A]" />
          </div>
          <div className="text-xl sm:text-2xl font-mono text-[#D9C39A] tabular-nums font-medium">
            {formatRegionCurrency(financials.worldwideGrossRaw ?? financials.worldwideGross, activeRegion, { nativeInrCrores: financials.grossInrCrores })}
          </div>
          <div className="text-[11px] font-mono text-[#8C877E] mt-1 flex items-center gap-1 tabular-nums">
            <ArrowUpRight className="w-3 h-3 text-[#D9C39A]" />
            {numBudget > 0 && numGross > 0 ? `${(numGross / numBudget).toFixed(2)}x Production Budget` : 'Multiple Unavailable'}
          </div>
        </div>

        {/* Domestic Net Collection */}
        <div className="bg-[#121210] rounded-[4px] p-5 border border-[#262522]">
          <div className="flex items-center justify-between text-[#8C877E] text-[10px] font-mono uppercase tracking-wider mb-1">
            <span>Domestic Net (USA/CAN)</span>
            <DollarSign className="w-3.5 h-3.5 text-[#8C877E]" />
          </div>
          <div className="text-xl sm:text-2xl font-mono text-[#F4F0EA] tabular-nums font-medium">
            {formatRegionCurrency(financials.domesticNetRaw ?? financials.domesticNet, activeRegion)}
          </div>
          <div className="text-[11px] font-mono text-[#8C877E] mt-1 tabular-nums">
            {numDomestic > 0 && numGross > 0 ? `${((numDomestic / numGross) * 100).toFixed(1)}% of Global Total` : 'Share Unavailable'}
          </div>
        </div>

        {/* Production Budget */}
        <div className="bg-[#121210] rounded-[4px] p-5 border border-[#262522]">
          <div className="flex items-center justify-between text-[#8C877E] text-[10px] font-mono uppercase tracking-wider mb-1">
            <span>Production Budget</span>
            <ShieldCheck className="w-3.5 h-3.5 text-[#8C877E]" />
          </div>
          <div className="text-xl sm:text-2xl font-mono text-[#F4F0EA] tabular-nums font-medium">
            {formatRegionCurrency(financials.budgetRaw ?? financials.budget, activeRegion, { nativeInrCrores: financials.budgetInrCrores })}
          </div>
          <div className="text-[11px] font-mono text-[#8C877E] mt-1 tabular-nums">
            Marketing: {numBudget > 0 ? `~${formatRegionCurrency(financials.marketingBudget || numBudget * 0.5, activeRegion, { compact: true })}` : 'N/A'}
          </div>
        </div>

        {/* Distributor Worldwide Share */}
        <div className="bg-[#121210] rounded-[4px] p-5 border border-[#262522]">
          <div className="flex items-center justify-between text-[#8C877E] text-[10px] font-mono uppercase tracking-wider mb-1">
            <span>Distributor Net Share</span>
            <PieChart className="w-3.5 h-3.5 text-[#8C877E]" />
          </div>
          <div className="text-xl sm:text-2xl font-mono text-[#F4F0EA] tabular-nums font-medium">
            {formatRegionCurrency(
              financials.distributorShareWorldwideRaw ?? financials.distributorShareWorldwide, 
              activeRegion, 
              { nativeInrCrores: financials.grossInrCrores ? Math.round(financials.grossInrCrores * 0.47 * 10) / 10 : null }
            )}
          </div>
          <div className="text-[11px] font-mono text-[#8C877E] mt-1">
            Studio Rental Cut (~47%)
          </div>
        </div>
      </div>

      {/* Opening Weekend & Multipliers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#121210] rounded-[4px] p-5 border border-[#262522]">
          <span className="text-[10px] font-mono text-[#8C877E] uppercase tracking-wider block mb-1">
            Domestic Opening Weekend
          </span>
          <span className="text-lg font-mono text-[#F4F0EA] tabular-nums font-medium">
            {formatRegionCurrency(financials.openingWeekendDomesticRaw ?? financials.openingWeekendDomestic, activeRegion)}
          </span>
          <p className="text-xs text-[#8C877E] mt-2 font-mono">
            {numOpening > 0 && numDomestic > 0
              ? `${((numOpening / numDomestic) * 100).toFixed(1)}% of total domestic run.`
              : 'Breakdown unavailable.'}
          </p>
        </div>

        <div className="bg-[#121210] rounded-[4px] p-5 border border-[#262522]">
          <span className="text-[10px] font-mono text-[#8C877E] uppercase tracking-wider block mb-1">
            Global Opening Weekend
          </span>
          <span className="text-lg font-mono text-[#F4F0EA] tabular-nums font-medium">
            {formatRegionCurrency(financials.openingWeekendWorldwideRaw ?? financials.openingWeekendWorldwide, activeRegion)}
          </span>
          <p className="text-xs text-[#8C877E] mt-2 font-sans">
            Simultaneous day-and-date international rollout footprint.
          </p>
        </div>

        <div className="bg-[#121210] rounded-[4px] p-5 border border-[#262522]">
          <span className="text-[10px] font-mono text-[#8C877E] uppercase tracking-wider block mb-1">
            Theatrical Multiplier (Legs)
          </span>
          <span className="text-lg font-mono text-[#D9C39A] tabular-nums font-medium">
            {financials.multiplier || (numDomestic > 0 && numOpening > 0 ? `${(numDomestic / numOpening).toFixed(2)}x` : 'N/A')}
          </span>
          <p className="text-xs text-[#8C877E] mt-2 font-sans">
            Higher than 3.0x indicates outstanding theatrical word-of-mouth.
          </p>
        </div>
      </div>

      {/* Territory Breakdown Ledger */}
      {financials.territoryBreakdown && financials.territoryBreakdown.length > 0 && (
        <div className="bg-[#121210] rounded-[4px] p-6 border border-[#262522]">
          <div className="flex items-center justify-between mb-4 border-b border-[#262522] pb-3">
            <h4 className="font-serif text-lg text-[#F4F0EA] flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#D9C39A]" />
              Regional Box Office Ledger
            </h4>
            <span className="text-[10px] font-mono text-[#8C877E] uppercase tracking-wider">Audited Splits</span>
          </div>

          <div className="space-y-3">
            {financials.territoryBreakdown.map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-[#F4F0EA] font-sans">{item.territory}</span>
                  <span className="text-[#D9C39A] font-mono tabular-nums">
                    {formatRegionCurrency(item.gross, activeRegion)} ({item.sharePct}%)
                  </span>
                </div>
                <div className="w-full h-1 bg-[#181816] rounded-none overflow-hidden">
                  <div 
                    className="h-full bg-[#D9C39A]" 
                    style={{ width: `${Math.min(100, item.sharePct * 1.5)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Domestic Distributor & Theatrical Split Architecture */}
      <div className="bg-[#121210] rounded-[4px] p-6 border border-[#262522] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#262522] pb-3">
          <div>
            <span className="text-[10px] uppercase font-mono text-[#8C877E] tracking-wider">Domestic Distribution Partner</span>
            <h4 className="font-serif text-lg text-[#F4F0EA]">{financials.domesticDistributor || 'Independent / Studio Not Listed'}</h4>
          </div>
          <span className="text-[10px] font-mono text-[#D9C39A] bg-[#181816] px-2.5 py-1 rounded-[2px] border border-[#262522]">
            Standard Model: 50/40/25 Split Rule
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-[2px] bg-[#181816] border border-[#262522]">
            <span className="text-[#8C877E] font-mono text-[10px] uppercase block mb-1">Domestic Cut (50%)</span>
            <span className="font-mono text-sm text-[#F4F0EA] tabular-nums font-medium">
              {numDomestic > 0 ? formatRegionCurrency(Math.round(numDomestic * 0.50), activeRegion) : 'N/A'}
            </span>
            <p className="text-[10px] text-[#8C877E] mt-1 font-mono">Est. studio rental return from USA/CAN</p>
          </div>
          <div className="p-3.5 rounded-[2px] bg-[#181816] border border-[#262522]">
            <span className="text-[#8C877E] font-mono text-[10px] uppercase block mb-1">Overseas Cut (40%)</span>
            <span className="font-mono text-sm text-[#F4F0EA] tabular-nums font-medium">
              {Number(financials.overseasGross) > 0 ? formatRegionCurrency(Math.round(Number(financials.overseasGross) * 0.40), activeRegion) : 'N/A'}
            </span>
            <p className="text-[10px] text-[#8C877E] mt-1 font-mono">Avg international distributor margin</p>
          </div>
          <div className="p-3.5 rounded-[2px] bg-[#181816] border border-[#262522]">
            <span className="text-[#8C877E] font-mono text-[10px] uppercase block mb-1">Exhibitor Retention (~53%)</span>
            <span className="font-mono text-sm text-[#D9C39A] tabular-nums font-medium">
              {numGross > 0 ? formatRegionCurrency(Math.max(0, numGross - (financials.distributorShareWorldwide || Math.round(numGross * 0.47))), activeRegion) : 'N/A'}
            </span>
            <p className="text-[10px] text-[#8C877E] mt-1 font-mono">Retained by exhibitors & multiplexes</p>
          </div>
        </div>
      </div>

    </div>
  );
}

