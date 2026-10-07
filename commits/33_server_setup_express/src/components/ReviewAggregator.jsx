import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, ThumbsUp, Check, Award } from 'lucide-react';

export default function ReviewAggregator({ ratings, movieId, movieTitle }) {
  const storageKey = `kinova_user_rating_${movieId}`;
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [userComment, setUserComment] = useState('');
  const [savedReview, setSavedReview] = useState(null);
  const [isSavedAlert, setIsSavedAlert] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(storageKey) || localStorage.getItem(`cinepulse_user_rating_${movieId}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setUserRating(parsed.rating || 0);
        setUserComment(parsed.comment || '');
        setSavedReview(parsed);
      } catch (e) {}
    }
  }, [movieId, storageKey]);

  const handleSaveReview = (e) => {
    e.preventDefault();
    if (userRating === 0) return;
    const reviewData = {
      rating: userRating,
      comment: userComment,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };
    localStorage.setItem(storageKey, JSON.stringify(reviewData));
    setSavedReview(reviewData);
    setIsSavedAlert(true);
    setTimeout(() => setIsSavedAlert(false), 3000);
  };

  return (
    <div className="rounded-[4px] p-6 border border-[#262522] bg-[#121210] space-y-6 font-sans">
      <div className="flex items-center justify-between border-b border-[#262522] pb-4">
        <div>
          <h3 className="text-xl font-serif text-[#F4F0EA] flex items-center gap-2">
            <Award className="w-5 h-5 text-[#E03C31]" />
            Critical Consensus & Reception Ledger
          </h3>
          <p className="text-xs font-mono text-[#8C877E]">Aggregated scores from historical critique institutions</p>
        </div>
      </div>

      {/* Critic Aggregators Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Rotten Tomatoes */}
        <div className="p-3.5 rounded-[4px] bg-[#181816] border border-[#262522] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#8C877E]">Rotten Tomatoes</span>
            <span className="text-base">🍅</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-mono font-semibold tabular-nums text-[#F4F0EA]">
              {ratings?.rottenTomatoes?.criticsScore ? `${ratings.rottenTomatoes.criticsScore}%` : 'N/A'}
            </span>
            <span className="text-[10px] font-mono text-[#D9C39A]">TOMATOMETER</span>
          </div>
          <div className="text-[11px] font-mono text-[#8C877E] flex items-center gap-1.5 pt-1.5 border-t border-[#262522]">
            <span>🍿 Popcorn:</span>
            <span className="font-semibold text-[#F4F0EA] tabular-nums">
              {ratings?.rottenTomatoes?.audienceScore ? `${ratings.rottenTomatoes.audienceScore}%` : 'N/A'}
            </span>
          </div>
        </div>

        {/* IMDb */}
        <div className="p-3.5 rounded-[4px] bg-[#181816] border border-[#262522] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#8C877E]">IMDb Terminal</span>
            <span className="text-[10px] font-mono px-1 py-0.2 rounded-[2px] bg-[#262522] text-[#D9C39A]">
              {ratings?.imdb?.top250Rank ? `#${ratings.imdb.top250Rank}` : 'RATED'}
            </span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-mono font-semibold tabular-nums text-[#D9C39A]">
              {ratings?.imdb?.score || 'N/A'}
            </span>
            <span className="text-xs font-mono text-[#8C877E]">/ 10</span>
          </div>
          <div className="text-[11px] font-mono text-[#8C877E] pt-1.5 border-t border-[#262522] truncate">
            {ratings?.imdb?.votes ? `${ratings.imdb.votes.toLocaleString()} votes` : 'Votes undisclosed'}
          </div>
        </div>

        {/* Metacritic */}
        <div className="p-3.5 rounded-[4px] bg-[#181816] border border-[#262522] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#8C877E]">Metacritic</span>
            {ratings?.metacritic?.score ? (
              <span className="text-[10px] font-mono px-1 py-0.2 rounded-[2px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                {ratings.metacritic.score}
              </span>
            ) : (
              <span className="text-[10px] font-mono px-1 py-0.2 rounded-[2px] bg-[#262522] text-[#8C877E]">
                N/A
              </span>
            )}
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-mono font-semibold tabular-nums text-[#F4F0EA]">
              {ratings?.metacritic?.score || 'N/A'}
            </span>
            <span className="text-xs font-mono text-[#8C877E]">/ 100</span>
          </div>
          <div className="text-[11px] font-mono text-[#8C877E] pt-1.5 border-t border-[#262522]">
            User Score: <span className="font-semibold text-[#F4F0EA] tabular-nums">{ratings?.metacritic?.userScore || 'N/A'}</span>
          </div>
        </div>

        {/* Letterboxd */}
        <div className="p-3.5 rounded-[4px] bg-[#181816] border border-[#262522] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#8C877E]">Letterboxd</span>
            <div className="flex gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#E03C31]"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#D9C39A]"></span>
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-mono font-semibold tabular-nums text-[#F4F0EA]">
              {ratings?.letterboxd?.score || 'N/A'}
            </span>
            <span className="text-xs font-mono text-[#D9C39A]">★</span>
          </div>
          <div className="text-[11px] font-mono text-[#8C877E] pt-1.5 border-t border-[#262522] truncate">
            {ratings?.letterboxd?.totalLogs && !isNaN(ratings.letterboxd.totalLogs)
              ? `${(ratings.letterboxd.totalLogs / 1e6).toFixed(1)}M logged`
              : 'Community logged'}
          </div>
        </div>
      </div>

      {/* Interactive User Rating & Review Submission */}
      <div className="p-5 rounded-[4px] bg-[#181816] border border-[#262522] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h4 className="text-sm font-serif text-[#F4F0EA] flex items-center gap-1.5">
              <Star className="w-4 h-4 text-[#D9C39A] fill-[#D9C39A]" />
              Your Personal Archival Rating
            </h4>
            <p className="text-xs text-[#8C877E]">Record your rating from 1 to 10 and log your personal notes</p>
          </div>
          {savedReview && (
            <span className="text-[10px] font-mono uppercase text-emerald-400 flex items-center gap-1 bg-[#121210] px-2 py-0.5 rounded-[2px] border border-emerald-500/20">
              <Check className="w-3 h-3" /> Logged {savedReview.date}
            </span>
          )}
        </div>

        {/* Star Selection Row */}
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-1">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(starNum => {
            const isFilled = (hoverRating || userRating) >= starNum;
            return (
              <button
                key={starNum}
                type="button"
                onMouseEnter={() => setHoverRating(starNum)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setUserRating(starNum)}
                className="p-1 focus:outline-none cursor-pointer"
              >
                <Star 
                  className={`w-5 h-5 transition-colors ${
                    isFilled 
                      ? 'text-[#D9C39A] fill-[#D9C39A]' 
                      : 'text-[#262522]'
                  }`} 
                />
              </button>
            );
          })}
          <span className="ml-3 text-base font-mono font-semibold tabular-nums text-[#F4F0EA]">
            {hoverRating || userRating || 0}<span className="text-xs text-[#8C877E]">/10</span>
          </span>
        </div>

        {/* Review Notes Input */}
        <form onSubmit={handleSaveReview} className="space-y-3">
          <input
            type="text"
            placeholder="Add quick notes (e.g. 'Stunning cinematography, best seen on 70mm')..."
            value={userComment}
            onChange={(e) => setUserComment(e.target.value)}
            className="w-full px-3 py-2 rounded-[4px] bg-[#121210] border border-[#262522] text-xs text-[#F4F0EA] placeholder-[#8C877E] focus:outline-none focus:border-[#E03C31]"
          />
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-[#8C877E]">
              Saved to your local Kinova terminal ledger
            </span>
            <button
              type="submit"
              disabled={userRating === 0}
              className={`px-3.5 py-1.5 rounded-[4px] text-xs font-mono uppercase tracking-wider font-semibold transition-colors cursor-pointer ${
                userRating > 0 
                  ? 'bg-[#E03C31] hover:bg-[#c83228] text-white shadow-md' 
                  : 'bg-[#262522] text-[#8C877E] cursor-not-allowed'
              }`}
            >
              {savedReview ? 'Update Log' : 'Save Verdict'}
            </button>
          </div>
        </form>

        {isSavedAlert && (
          <div className="p-2 rounded-[2px] bg-[#121210] border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center gap-2 animate-fade-in">
            <Check className="w-3.5 h-3.5" />
            <span>Verdict successfully recorded in your cinephile log!</span>
          </div>
        )}
      </div>
    </div>
  );
}
