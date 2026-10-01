import React from 'react';
import { Film, ShieldCheck } from 'lucide-react';

export default function Footer({ onNavigateToAi }) {
  return (
    <footer className="w-full bg-[#080a10] border-t border-white/[0.06] py-4 px-4 sm:px-6 lg:px-8 text-[11px] text-slate-500">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">

        {/* Brand */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-amber-400 flex items-center justify-center text-black">
            <Film className="w-3 h-3 fill-black text-black" />
          </div>
          <span className="font-bold text-slate-300 tracking-wide text-xs">KINOVA</span>
          <span className="text-slate-600">·</span>
          <span className="text-slate-500">The Cinema &amp; Box Office Journal</span>
        </div>

        {/* API Attribution */}
        <div className="flex flex-wrap items-center gap-2 text-slate-500">
          <span>Feeds:</span>
          <span className="text-slate-400 font-medium">TMDB</span>
          <span>·</span>
          <span className="text-slate-400 font-medium">JustWatch</span>
          <span>·</span>
          <span className="text-slate-400 font-medium flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-500" /> BOM Scraper
          </span>
          <span>·</span>
          <span className="text-amber-400/80 font-medium">Kinova API</span>
        </div>

        {/* Copyright + Link */}
        <div className="flex items-center gap-3 text-slate-600">
          <button onClick={onNavigateToAi} className="hover:text-amber-400 transition-colors cursor-pointer text-slate-500">
            AI Recommender
          </button>
          <span>·</span>
          <span>© {new Date().getFullYear()} Kinova</span>
        </div>

      </div>
    </footer>
  );
}
