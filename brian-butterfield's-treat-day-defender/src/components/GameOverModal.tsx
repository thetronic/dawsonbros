import React from 'react';
import { GameStats } from '../types';
import { RotateCcw, Home, Skull, ShieldAlert } from 'lucide-react';

interface GameOverModalProps {
  stats: GameStats;
  onRestart: () => void;
  onTitle: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({ stats, onRestart, onTitle }) => {
  return (
    <div className="absolute inset-0 z-40 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-md w-full p-6 shadow-2xl text-center">
        {/* Warning Icon Badge */}
        <div className="w-14 h-14 bg-rose-500/10 border border-rose-500/30 rounded-full flex items-center justify-center mx-auto mb-3 text-rose-500">
          <ShieldAlert className="w-7 h-7" />
        </div>

        <div className="text-xs uppercase font-bold tracking-widest text-rose-400 mb-1">
          Butterfield Diet Assessment
        </div>
        <h2 className="font-display font-black text-2xl sm:text-3xl text-white mb-2">
          DIET RUINED!
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 mb-5 leading-relaxed">
          Temptation overwhelmed Brian before Sunday Treat Day! A stray pork sandwich or bonbonbonbon has broken your resolve.
        </p>

        {/* Stats Grid */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 mb-5 text-left grid grid-cols-2 gap-3 text-xs">
          <div>
            <span className="text-slate-400 block text-[11px]">Final Score</span>
            <span className="font-mono text-base font-bold text-amber-400 tabular-nums">
              {stats.score.toLocaleString()}
            </span>
          </div>

          <div>
            <span className="text-slate-400 block text-[11px]">Best Combo</span>
            <span className="font-mono text-base font-bold text-rose-400 tabular-nums">
              x{stats.maxCombo}
            </span>
          </div>

          <div>
            <span className="text-slate-400 block text-[11px]">Treats Swatted Away</span>
            <span className="font-mono text-base font-bold text-slate-200 tabular-nums">
              {stats.treatsDefeated}
            </span>
          </div>

          <div>
            <span className="text-slate-400 block text-[11px]">Cornflakes Eaten</span>
            <span className="font-mono text-base font-bold text-emerald-400 tabular-nums">
              {stats.cornflakesEaten}
            </span>
          </div>
        </div>

        {/* Butterfield Commercial Footer Quote */}
        <div className="bg-slate-800/60 rounded-lg p-2.5 mb-5 text-[11px] text-slate-400 italic">
          "Call 0800-BUTTERFIELD now to order a replacement box of cornflake."
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={onRestart}
            className="flex-1 py-3 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-display font-extrabold text-sm rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
          >
            <RotateCcw className="w-4 h-4" />
            <span>TRY DIET AGAIN</span>
          </button>

          <button
            onClick={onTitle}
            className="py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>TITLE</span>
          </button>
        </div>
      </div>
    </div>
  );
};
