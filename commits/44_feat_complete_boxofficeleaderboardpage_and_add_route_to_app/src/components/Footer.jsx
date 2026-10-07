import React from 'react';
import { Film, ShieldCheck } from 'lucide-react';

export default function Footer({ onNavigateToAi }) {
  return (
    <footer className="w-full bg-[#0A0A09] border-t border-[#262522] py-5 px-4 sm:px-6 lg:px-8 text-[11px] text-[#8C877E]">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">

        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-[3px] bg-[#121210] border border-[#262522] flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5 text-[#F4F0EA]">
              <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
              <line x1="3" y1="8" x2="21" y2="8" stroke="#262522" strokeWidth="1" />
              <line x1="3" y1="16" x2="21" y2="16" stroke="#262522" strokeWidth="1" />
              <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.25" />
              <circle cx="15.5" cy="8.5" r="1.1" fill="#E03C31" />
            </svg>
          </div>
          <span className="font-semibold tracking-[0.22em] text-[#F4F0EA] text-xs">KINOVA</span>
          <span className="text-[#262522]">|</span>
          <span className="font-mono text-[10px] text-[#8C877E] tracking-wider uppercase">Cinema Archive &amp; Box Office Intelligence</span>
        </div>

        {/* API Attribution */}
        <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] text-[#8C877E]">
          <span className="text-[#8C877E]/80">FEEDS:</span>
          <span className="text-[#F4F0EA] font-medium">TMDB</span>
          <span>·</span>
          <span className="text-[#F4F0EA] font-medium">JustWatch</span>
          <span>·</span>
          <span className="text-[#F4F0EA] font-medium flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-[#709CA8]" /> BOM
          </span>
          <span>·</span>
          <span className="text-[#D9C39A] font-medium">KINOVA TERMINAL</span>
        </div>

        {/* Copyright + Link */}
        <div className="flex items-center gap-3 font-mono text-[10px] text-[#8C877E]">
          <button onClick={onNavigateToAi} className="hover:text-[#E03C31] transition-colors cursor-pointer text-[#8C877E]">
            AI Recommender
          </button>
          <span>·</span>
          <span>© {new Date().getFullYear()} Kinova Archive</span>
        </div>

      </div>
    </footer>
  );
}
