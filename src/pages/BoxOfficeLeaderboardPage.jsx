import React, { useState } from 'react';
import { TrendingUp, ArrowUpRight, ArrowDownRight, Filter } from 'lucide-react';
import { formatCurrency, getVerdictBadgeClass } from '../services/financialUtils';
import { useRegion } from '../context/RegionContext';

export default function BoxOfficeLeaderboardPage({ movies, onSelectMovie }) {
  const { selectedRegion } = useRegion();
  const [filterTier, setFilterTier] = useState('ALL');
  const [sortField, setSortField] = useState('worldwideGross');
  const [sortAsc, setSortAsc] = useState(false);

  const filtered = movies.filter(m => {
    if (filterTier === 'ALL') return true;
    return m.financials?.verdictTier === filterTier;
  }).sort((a, b) => {
    let aVal = a.financials?.[sortField] || 0;
    let bVal = b.financials?.[sortField] || 0;
    if (sortField === 'multiplier') {
      aVal = (a.financials?.worldwideGross || 0) / (a.financials?.budget || 1);
      bVal = (b.financials?.worldwideGross || 0) / (b.financials?.budget || 1);
    }
    return sortAsc ? aVal - bVal : bVal - aVal;
  });

  const handleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  return (
    <div className="space-y-8 pb-20 animate-fade-in font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#262522] pb-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-serif text-[#F4F0EA] flex items-center gap-3">
            <TrendingUp className="w-7 h-7 text-[#E03C31]" />
            Global Box Office Trade Ledger
          </h1>
          <p className="text-xs sm:text-sm text-[#8C877E] mt-1 font-sans">
            Audited theatrical collections, production capital multiples, and commercial verdict stamps
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {['ALL', 'blockbuster', 'super-hit', 'hit', 'average', 'flop'].map(tier => (
            <button
              key={tier}
              onClick={() => setFilterTier(tier)}
              className={`px-3 py-1.5 rounded-[4px] text-[11px] font-mono uppercase tracking-wider transition-colors whitespace-nowrap cursor-pointer ${
                filterTier === tier
                  ? 'bg-[#181816] text-[#D9C39A] border border-[#D9C39A]/40'
                  : 'bg-[#121210] hover:bg-[#181816] text-[#8C877E] hover:text-[#F4F0EA] border border-[#262522]'
              }`}
            >
              {tier === 'ALL' ? 'All Ledger Tiers' : tier.replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Leaderboard Table Container */}
      <div className="bg-[#121210] rounded-[4px] border border-[#262522] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm text-[#F4F0EA]">
            <thead className="bg-[#181816] text-[10px] font-mono uppercase tracking-wider text-[#8C877E] border-b border-[#262522]">
              <tr>
                <th className="py-3.5 px-4 sm:px-6">Index & Film Title</th>
                <th 
                  onClick={() => handleSort('worldwideGross')} 
                  className="py-3.5 px-4 cursor-pointer hover:text-[#F4F0EA] transition-colors select-none"
                >
                  Worldwide Gross {sortField === 'worldwideGross' && (sortAsc ? '↑' : '↓')}
                </th>
                <th 
                  onClick={() => handleSort('budget')} 
                  className="py-3.5 px-4 cursor-pointer hover:text-[#F4F0EA] transition-colors select-none"
                >
                  Budget {sortField === 'budget' && (sortAsc ? '↑' : '↓')}
                </th>
                <th 
                  onClick={() => handleSort('domesticNet')} 
                  className="py-3.5 px-4 cursor-pointer hover:text-[#F4F0EA] transition-colors select-none"
                >
                  Domestic Net {sortField === 'domesticNet' && (sortAsc ? '↑' : '↓')}
                </th>
                <th 
                  onClick={() => handleSort('multiplier')} 
                  className="py-3.5 px-4 cursor-pointer hover:text-[#F4F0EA] transition-colors select-none"
                >
                  Multiple {sortField === 'multiplier' && (sortAsc ? '↑' : '↓')}
                </th>
                <th className="py-3.5 px-4">Verdict Stamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#262522]">
              {filtered.map((movie, index) => {
                const bVal = Number(movie.financials?.budget) || 0;
                const gVal = Number(movie.financials?.worldwideGross) || 0;
                const multiplier = (bVal > 0 && gVal > 0) ? (gVal / bVal).toFixed(2) : null;
                const verdictTier = movie.financials?.verdictTier || 'average';
                return (
                  <tr 
                    key={movie.id}
                    onClick={() => onSelectMovie(movie)}
                    className="hover:bg-[#181816] cursor-pointer transition-colors group"
                  >
                    <td className="py-3 px-4 sm:px-6 flex items-center gap-3">
                      <span className="w-6 font-mono text-xs text-[#8C877E] group-hover:text-[#D9C39A]">
                        #{String(index + 1).padStart(2, '0')}
                      </span>
                      <img 
                        src={movie.posterUrl} 
                        alt={movie.title} 
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=100&q=80";
                        }}
                        className="w-8 h-12 object-cover rounded-[2px] border border-white/10 flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <span className="font-serif text-sm text-[#F4F0EA] group-hover:text-[#D9C39A] transition-colors block truncate">
                          {movie.title}
                        </span>
                        <span className="text-[11px] font-mono text-[#8C877E] block">
                          {movie.releaseDate?.slice(0, 4) || 'N/A'} · {movie.director || 'Director Unavailable'}
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono font-semibold tabular-nums text-[#D9C39A] text-xs">
                      {formatCurrency(
                        movie.financials?.worldwideGross || movie.financials?.worldwideGrossRaw, 
                        selectedRegion, 
                        { nativeInrCrores: movie.financials?.grossInrCrores }
                      )}
                    </td>

                    <td className="py-3 px-4 font-mono tabular-nums text-[#8C877E] text-xs">
                      {formatCurrency(
                        movie.financials?.budget || movie.financials?.budgetRaw, 
                        selectedRegion, 
                        { nativeInrCrores: movie.financials?.budgetInrCrores }
                      )}
                    </td>

                    <td className="py-3 px-4 font-mono tabular-nums text-[#8C877E] text-xs">
                      {formatCurrency(
                        movie.financials?.domesticNet || movie.financials?.domesticNetRaw, 
                        selectedRegion
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-mono tabular-nums text-[#F4F0EA] bg-[#181816] px-1.5 py-0.5 rounded-[2px] border border-[#262522] text-[11px]">
                        {multiplier ? `${multiplier}x` : 'N/A'}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-[2px] font-mono text-[10px] uppercase tracking-wider ${getVerdictBadgeClass(verdictTier)}`}>
                        {movie.financials?.verdict || 'Undisclosed'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
