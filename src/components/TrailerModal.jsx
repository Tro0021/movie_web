import React, { useEffect } from 'react';
import { X, Film } from 'lucide-react';

export default function TrailerModal({ isOpen, onClose, youtubeId, movieTitle }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !youtubeId) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-4xl bg-[#121210] border border-[#262522] rounded-[4px] overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3.5 px-5 border-b border-[#262522] bg-[#0A0A09]">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-[#E03C31]" />
            <h3 className="font-serif text-base font-normal text-[#F4F0EA] tracking-wide truncate">
              {movieTitle} <span className="font-mono text-[11px] text-[#8C877E] uppercase ml-1">— Official 35mm Trailer</span>
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-[2px] bg-[#181816] hover:bg-[#262522] border border-[#262522] text-[#8C877E] hover:text-[#F4F0EA] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Video Player */}
        <div className="relative w-full aspect-video bg-black">
          <iframe
            src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1`}
            title={`${movieTitle} Official Trailer`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="w-full h-full border-0"
          />
        </div>
      </div>
    </div>
  );
}
