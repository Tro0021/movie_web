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
    <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-6">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <h3 className="text-lg font-bold text-white font-heading flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            Critical Consensus & Audience Reception
          </h3>
          <p className="text-xs text-slate-400">Aggregated scores from leading film critique institutions</p>
        </div>
      </div>

      {/* Critic Aggregators Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Rotten Tomatoes */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-white/5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Rotten Tomatoes</span>
            <span className="text-lg">🍅</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white font-heading">
              {ratings?.rottenTomatoes?.criticsScore ? `${ratings.rottenTomatoes.criticsScore}%` : 'N/A'}
            </span>
            <span className="text-[11px] font-semibold text-emerald-400">Tomatometer</span>
          </div>
          <div className="text-xs text-slate-400 flex items-center gap-1.5 pt-1 border-t border-white/5">
            <span>🍿 Popcorn:</span>
            <span className="font-bold text-slate-200">
              {ratings?.rottenTomatoes?.audienceScore ? `${ratings.rottenTomatoes.audienceScore}%` : 'N/A'}
            </span>
          </div>
        </div>

        {/* IMDb */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-white/5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider font-heading">IMDb</span>
            <span className="text-xs px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 font-bold">
              {ratings?.imdb?.top250Rank ? `#${ratings.imdb.top250Rank} Top 250` : 'Rated'}
            </span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-amber-400 font-heading">
              {ratings?.imdb?.score || 'N/A'}
            </span>
            <span className="text-xs text-slate-400">/ 10</span>
          </div>
          <div className="text-xs text-slate-400 pt-1 border-t border-white/5 truncate">
            {ratings?.imdb?.votes ? `${ratings.imdb.votes.toLocaleString()} user votes` : 'User votes undisclosed'}
          </div>
        </div>

        {/* Metacritic */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-white/5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Metacritic</span>
            {ratings?.metacritic?.score ? (
              <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-emerald-500 text-black">
                {ratings.metacritic.score}
              </span>
            ) : (
              <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-white/10 text-slate-300">
                N/A
              </span>
            )}
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-white font-heading">
              {ratings?.metacritic?.score || 'N/A'}
            </span>
            <span className="text-xs text-slate-400">/ 100</span>
          </div>
          <div className="text-xs text-slate-400 pt-1 border-t border-white/5">
            User Score: <span className="font-semibold text-white">{ratings?.metacritic?.userScore || 'N/A'}</span>
          </div>
        </div>

        {/* Letterboxd */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-white/5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Letterboxd</span>
            <div className="flex gap-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              <span className="w-2 h-2 rounded-full bg-blue-400"></span>
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-white font-heading">
              {ratings?.letterboxd?.score || 'N/A'}
            </span>
            <span className="text-xs text-slate-400">★</span>
          </div>
          <div className="text-xs text-slate-400 pt-1 border-t border-white/5 truncate">
            {ratings?.letterboxd?.totalLogs && !isNaN(ratings.letterboxd.totalLogs)
              ? `${(ratings.letterboxd.totalLogs / 1e6).toFixed(1)}M logged members`
              : 'Community logged'}
          </div>
        </div>
      </div>

      {/* Interactive User Rating & Review Submission */}
      <div className="p-5 rounded-2xl bg-[#090d18] border border-white/10 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              Your Personal Verdict & Cinephile Rating
            </h4>
            <p className="text-xs text-slate-400">Rate this film from 1 to 10 and log your personal notes</p>
          </div>
          {savedReview && (
            <span className="text-[11px] text-emerald-400 flex items-center gap-1 bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-500/20">
              <Check className="w-3 h-3" /> Logged on {savedReview.date}
            </span>
          )}
        </div>

        {/* Star Selection Row (1 to 10) */}
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(starNum => {
            const isFilled = (hoverRating || userRating) >= starNum;
            return (
              <button
                key={starNum}
                type="button"
                onMouseEnter={() => setHoverRating(starNum)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setUserRating(starNum)}
                className="p-1 hover:scale-110 transition-transform focus:outline-none"
              >
                <Star 
                  className={`w-6 h-6 transition-colors ${
                    isFilled 
                      ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]' 
                      : 'text-slate-600'
                  }`} 
                />
              </button>
            );
          })}
          <span className="ml-3 text-lg font-bold font-heading text-white">
            {hoverRating || userRating || 0}<span className="text-xs text-slate-400">/10</span>
          </span>
        </div>

        {/* Review Notes Input */}
        <form onSubmit={handleSaveReview} className="space-y-3">
          <input
            type="text"
            placeholder="Add quick notes (e.g. 'Stunning cinematography, best seen on IMAX 70mm')..."
            value={userComment}
            onChange={(e) => setUserComment(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400"
          />
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-500">
              Saved locally to your private Kinova device vault
            </span>
            <button
              type="submit"
              disabled={userRating === 0}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                userRating > 0 
                  ? 'bg-amber-500 hover:bg-amber-400 text-black shadow-glow-gold' 
                  : 'bg-white/5 text-slate-500 cursor-not-allowed'
              }`}
            >
              {savedReview ? 'Update Log' : 'Save Verdict'}
            </button>
          </div>
        </form>

        {isSavedAlert && (
          <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-fade-in">
            <Check className="w-4 h-4" />
            <span>Verdict successfully recorded in your cinephile log!</span>
          </div>
        )}
      </div>
    </div>
  );
}
