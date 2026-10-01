import React, { useState } from 'react';
import { TrendingUp, Award, DollarSign, ArrowUpRight, ArrowDownRight, Filter } from 'lucide-react';
import { formatCurrency } from '../services/financialUtils';
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
    <div className="space-y-8 pb-20 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white font-heading flex items-center gap-2.5">
            <TrendingUp className="w-8 h-8 text-emerald-400" />
            Global Box Office Leaderboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Audited worldwide collections, distributor share splits, and algorithmic commercial verdicts
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {['ALL', 'blockbuster', 'super-hit', 'hit', 'average', 'flop'].map(tier => (
            <button
              key={tier}
              onClick={() => setFilterTier(tier)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                filterTier === tier
                  ? 'bg-amber-400 text-black shadow-sm'
                  : 'bg-[#121622] text-slate-400 hover:text-white border border-white/5'
              }`}
            >
              {tier === 'ALL' ? 'All Verdicts' : tier.replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Leaderboard Table Container */}
      <div className="bg-[#121622] rounded-2xl border border-white/[0.08] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm text-slate-200">
            <thead className="bg-[#0e121c] text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-white/10">
              <tr>
                <th className="py-4 px-4 sm:px-6">Rank & Film</th>
                <th 
                  onClick={() => handleSort('worldwideGross')} 
                  className="py-4 px-4 cursor-pointer hover:text-white"
                >
                  Worldwide Gross {sortField === 'worldwideGross' && (sortAsc ? '↑' : '↓')}
                </th>
                <th 
                  onClick={() => handleSort('budget')} 
                  className="py-4 px-4 cursor-pointer hover:text-white"
                >
                  Budget {sortField === 'budget' && (sortAsc ? '↑' : '↓')}
                </th>
                <th 
                  onClick={() => handleSort('domesticNet')} 
                  className="py-4 px-4 cursor-pointer hover:text-white"
                >
                  Domestic Net {sortField === 'domesticNet' && (sortAsc ? '↑' : '↓')}
                </th>
                <th 
                  onClick={() => handleSort('multiplier')} 
                  className="py-4 px-4 cursor-pointer hover:text-white"
                >
                  Multiple {sortField === 'multiplier' && (sortAsc ? '↑' : '↓')}
                </th>
                <th className="py-4 px-4">Verdict Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((movie, index) => {
                const bVal = Number(movie.financials?.budget) || 0;
                const gVal = Number(movie.financials?.worldwideGross) || 0;
                const multiplier = (bVal > 0 && gVal > 0) ? (gVal / bVal).toFixed(2) : null;
                return (
                  <tr 
                    key={movie.id}
                    onClick={() => onSelectMovie(movie)}
                    className="hover:bg-white/5 cursor-pointer transition-colors group"
                  >
                    <td className="py-4 px-4 sm:px-6 flex items-center gap-3">
                      <span className="w-6 font-extrabold text-slate-500 group-hover:text-amber-400 font-heading">
                        #{index + 1}
                      </span>
                      <img 
                        src={movie.posterUrl} 
                        alt={movie.title} 
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=100&q=80";
                        }}
                        className="w-10 h-14 object-cover rounded-lg shadow flex-shrink-0"
                      />
                      <div>
                        <span className="font-bold text-white group-hover:text-amber-300 transition-colors block">
                          {movie.title}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {movie.releaseDate?.slice(0, 4) || 'N/A'} • {movie.director || 'Director Unavailable'}
                        </span>
                      </div>
                    </td>

                    <td className="py-4 px-4 font-mono font-bold text-emerald-400 text-sm">
                      {formatCurrency(
                        movie.financials?.worldwideGrossRaw ?? movie.financials?.worldwideGross, 
                        selectedRegion, 
                        { nativeInrCrores: movie.financials?.grossInrCrores }
                      )}
                    </td>

                    <td className="py-4 px-4 font-mono text-slate-300">
                      {formatCurrency(
                        movie.financials?.budgetRaw ?? movie.financials?.budget, 
                        selectedRegion, 
                        { nativeInrCrores: movie.financials?.budgetInrCrores }
                      )}
                    </td>

                    <td className="py-4 px-4 font-mono text-slate-300">
                      {formatCurrency(
                        movie.financials?.domesticNetRaw ?? movie.financials?.domesticNet, 
                        selectedRegion
                      )}
                    </td>

                    <td className="py-4 px-4">
                      <span className="font-mono font-bold text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20 text-xs">
                        {multiplier ? `${multiplier}x` : 'N/A'}
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30">
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
