import React, { useState } from 'react';
import { TrendingUp } from 'lucide-react';
import { formatCurrency } from '../services/financialUtils';
import { useRegion } from '../context/RegionContext';

export default function BoxOfficeLeaderboardPage({ movies = [], onSelectMovie }) {
  const { selectedRegion } = useRegion();
  const [sortField, setSortField] = useState('worldwideGross');
  const [sortAsc, setSortAsc] = useState(false);

  const sortedMovies = [...movies].sort((a, b) => {
    const aVal = a.financials?.[sortField] || 0;
    const bVal = b.financials?.[sortField] || 0;
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
              </tr>
            </thead>
            <tbody className="divide-y divide-[#262522]">
              {sortedMovies.map((movie, index) => (
                <tr 
                  key={movie.id}
                  onClick={() => onSelectMovie && onSelectMovie(movie)}
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
                      selectedRegion
                    )}
                  </td>

                  <td className="py-3 px-4 font-mono tabular-nums text-[#8C877E] text-xs">
                    {formatCurrency(
                      movie.financials?.budget || movie.financials?.budgetRaw, 
                      selectedRegion
                    )}
                  </td>

                  <td className="py-3 px-4 font-mono tabular-nums text-[#8C877E] text-xs">
                    {formatCurrency(
                      movie.financials?.domesticNet || movie.financials?.domesticNetRaw, 
                      selectedRegion
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
