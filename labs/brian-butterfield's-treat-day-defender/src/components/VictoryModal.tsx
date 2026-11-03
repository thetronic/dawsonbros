import React, { useEffect } from 'react';
import { GameStats } from '../types';
import confetti from 'canvas-confetti';
import { Trophy, RotateCcw, Home, Sparkles } from 'lucide-react';

interface VictoryModalProps {
  stats: GameStats;
  onRestart: () => void;
  onTitle: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({ stats, onRestart, onTitle }) => {
  useEffect(() => {
    // Fire celebratory confetti cannons
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });

    const timer = setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
      });
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
      });
    }, 400);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="absolute inset-0 z-40 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border-2 border-amber-500/80 rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl text-center relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="w-16 h-16 bg-gradient-to-tr from-amber-500 to-yellow-300 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-950 shadow-lg">
          <Trophy className="w-8 h-8" />
        </div>

        <div className="text-xs uppercase font-extrabold tracking-widest text-amber-400 mb-1 flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>OFFICIAL BUTTERFIELD DIPLOMA</span>
          <Sparkles className="w-3.5 h-3.5" />
        </div>

        <h2 className="font-display font-black text-2xl sm:text-3xl text-white mb-2">
          TREAT DAY ACHIEVED!
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 mb-5 leading-relaxed">
          Brian Butterfield has conquered the week! From Monday's solitary cornflake to Sunday's glorious pork sandwich feast!
        </p>

        {/* Stats Grid */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 mb-5 text-left grid grid-cols-2 gap-3 text-xs">
          <div>
            <span className="text-slate-400 block text-[11px]">Final Score</span>
            <span className="font-mono text-lg font-bold text-amber-400 tabular-nums">
              {stats.score.toLocaleString()}
            </span>
          </div>

          <div>
            <span className="text-slate-400 block text-[11px]">Treats Gobbled</span>
            <span className="font-mono text-lg font-bold text-emerald-400 tabular-nums">
              {stats.treatsGobbled}
            </span>
          </div>

          <div>
            <span className="text-slate-400 block text-[11px]">Cornflakes Eaten</span>
            <span className="font-mono text-base font-bold text-slate-200 tabular-nums">
              {stats.cornflakesEaten}
            </span>
          </div>

          <div>
            <span className="text-slate-400 block text-[11px]">Water Consumed</span>
            <span className="font-mono text-base font-bold text-sky-400 tabular-nums">
              {stats.waterDrank} pints
            </span>
          </div>
        </div>

        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 mb-6 text-xs text-amber-300 italic">
          "You are now an accredited practitioner of the Butterfield Diet Plan. Call now for your free lapel pin."
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={onRestart}
            className="flex-1 py-3 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-display font-extrabold text-sm rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
          >
            <RotateCcw className="w-4 h-4" />
            <span>PLAY AGAIN</span>
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
