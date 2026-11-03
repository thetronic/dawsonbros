import React from 'react';
import { GameStats } from '../types';
import { DAYS_CONFIG } from '../game/constants';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

interface DayCompleteModalProps {
  stats: GameStats;
  onNextDay: () => void;
}

export const DayCompleteModal: React.FC<DayCompleteModalProps> = ({ stats, onNextDay }) => {
  const currentDay = DAYS_CONFIG[stats.dayIndex];
  const nextDay = DAYS_CONFIG[stats.dayIndex + 1];

  return (
    <div className="absolute inset-0 z-40 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-md w-full p-6 shadow-2xl text-center">
        {/* Success checkmark badge */}
        <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-3 text-emerald-400">
          <CheckCircle2 className="w-7 h-7" />
        </div>

        <div className="text-xs uppercase font-bold tracking-widest text-emerald-400 mb-1">
          {currentDay.name} Concluded
        </div>
        <h2 className="font-display font-black text-2xl sm:text-3xl text-white mb-2">
          SURVIVED {currentDay.name.toUpperCase()}!
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 mb-5 leading-relaxed">
          {currentDay.subtitle}
        </p>

        {/* Next Day Preview Card */}
        {nextDay && (
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 mb-5 text-left">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Coming Up Tomorrow
            </div>
            <div className="font-display font-black text-lg text-amber-400">
              {nextDay.name}: {nextDay.dietLabel}
            </div>
            <p className="text-xs text-slate-300 mt-1">
              {nextDay.description}
            </p>
          </div>
        )}

        <button
          onClick={onNextDay}
          className="w-full py-3.5 px-6 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-display font-extrabold text-base rounded-xl transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>CONTINUE TO {nextDay ? nextDay.name.toUpperCase() : 'NEXT DAY'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
