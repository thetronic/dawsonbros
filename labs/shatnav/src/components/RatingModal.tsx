import React, { useState } from 'react';
import { ActiveBooking, Review } from '../types';
import { Star, Sparkles, Heart, Check, X, ThumbsUp, ShieldCheck } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface RatingModalProps {
  booking: ActiveBooking;
  onSubmitReview: (review: Review, tipAmount: number) => void;
  onClose: () => void;
}

export const RatingModal: React.FC<RatingModalProps> = ({
  booking,
  onSubmitReview,
  onClose,
}) => {
  const [overallRating, setOverallRating] = useState(5);
  const [cleanlinessScore, setCleanlinessScore] = useState(5);
  const [smellScore, setSmellScore] = useState(5);
  const [paperScore, setPaperScore] = useState(5);
  const [comment, setComment] = useState('');
  const [tipAmount, setTipAmount] = useState<number>(1.00);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundManager.playChimeSound();

    const newReview: Review = {
      id: 'rev-' + Date.now(),
      author: 'You (Verified Guest)',
      authorAvatar:
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      date: 'Just now',
      type: booking.serviceType === 'wee' ? 'wee' : 'poo',
      rating: overallRating,
      cleanlinessScore,
      smellScore,
      paperScore,
      comment:
        comment.trim() ||
        (cleanlinessScore === 5
          ? 'Spotless porcelain and excellent hospitality. 10/10 relief.'
          : 'Decent facilities, served its purpose!'),
      verifiedVisit: true,
    };

    onSubmitReview(newReview, tipAmount);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col text-slate-100">
        {/* Header */}
        <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-base text-white flex items-center gap-2">
              <span>Rate Your Visit</span>
              <span className="text-[10px] bg-amber-400/20 text-amber-300 font-bold px-2 py-0.5 rounded-full border border-amber-400/30">
                Verified Visit
              </span>
            </h3>
            <p className="text-xs text-slate-400">At {booking.bathroomTitle}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Rating Form */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-5">
          {/* 1. Overall Star Rating */}
          <div className="text-center space-y-1.5 p-3 rounded-xl bg-slate-800/50 border border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Overall Throne Satisfaction
            </span>
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setOverallRating(star)}
                  className="p-1 text-2xl transition hover:scale-125 focus:outline-none"
                >
                  <Star
                    className={`w-7 h-7 ${
                      star <= overallRating
                        ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                        : 'text-slate-600'
                    }`}
                  />
                </button>
              ))}
            </div>
            <span className="text-xs font-bold text-amber-300">
              {overallRating === 5
                ? '⭐ Royal Porcelain Perfection'
                : overallRating === 4
                ? '⭐ Very Clean & Comfortable'
                : overallRating === 3
                ? '⭐ Average Relief'
                : '⭐ Needs Sanitation Improvement'}
            </span>
          </div>

          {/* 2. Specific Cleanliness Breakdown Sliders */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Hygiene & Facility Quality Verification
            </label>

            {/* Porcelain Gleam */}
            <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-200">🧼 Porcelain Cleanliness</span>
                <span className="font-bold text-emerald-400">{cleanlinessScore} / 5</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                value={cleanlinessScore}
                onChange={(e) => setCleanlinessScore(Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>Stained</span>
                <span>Decent</span>
                <span className="text-emerald-400 font-semibold">Hospital Spotless</span>
              </div>
            </div>

            {/* Scent & Odor */}
            <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-200">🌸 Scent & Ventilation</span>
                <span className="font-bold text-sky-400">{smellScore} / 5</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                value={smellScore}
                onChange={(e) => setSmellScore(Number(e.target.value))}
                className="w-full accent-sky-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>Stuffy</span>
                <span>Neutral</span>
                <span className="text-sky-400 font-semibold">Lavender Fresh</span>
              </div>
            </div>

            {/* Paper Ply */}
            <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-200">🧻 Paper Softness</span>
                <span className="font-bold text-amber-400">{paperScore} / 5</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                value={paperScore}
                onChange={(e) => setPaperScore(Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>Rough 1-ply</span>
                <span>Standard</span>
                <span className="text-amber-400 font-semibold">Cloud-soft 4-ply</span>
              </div>
            </div>
          </div>

          {/* 3. Review Comment */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Leave a Note for Fellow Poopers (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Great bidet, host was super discreet, spotless bathroom!"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 resize-none"
            />
          </div>

          {/* 4. Tip Host */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
                <span>Tip {booking.hostName} for Cleanliness</span>
              </label>
              <span className="text-[11px] text-slate-400">100% goes to host</span>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {[0, 0.50, 1.00, 2.00].map((amount) => (
                <button
                  key={amount}
                  type="button"
                  onClick={() => setTipAmount(amount)}
                  className={`py-2 px-1 rounded-xl border text-center transition text-xs font-mono font-bold ${
                    tipAmount === amount
                      ? 'bg-rose-500/20 border-rose-400 text-rose-300'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                  }`}
                >
                  {amount === 0 ? 'No tip' : `+$${amount.toFixed(2)}`}
                </button>
              ))}
            </div>
          </div>

          {/* Submit button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-sm tracking-wide shadow-xl shadow-amber-500/25 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Submit Rating & Complete Visit</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
