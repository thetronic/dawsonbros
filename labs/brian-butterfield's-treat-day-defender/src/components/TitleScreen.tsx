import React, { useState } from 'react';
import { GameMode } from '../types';
import { Play, Flame, UtensilsCrossed, Shield, Volume2, VolumeX, Mic, MicOff } from 'lucide-react';

interface TitleScreenProps {
  onStart: (mode: GameMode) => void;
  highScore: number;
  isMuted: boolean;
  onToggleMute: () => void;
  isVoiceEnabled: boolean;
  onToggleVoice: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  onStart,
  highScore,
  isMuted,
  onToggleMute,
  isVoiceEnabled,
  onToggleVoice,
}) => {
  const [selectedMode, setSelectedMode] = useState<GameMode>('story');

  return (
    <div className="absolute inset-0 z-30 bg-slate-950 flex flex-col items-center justify-between p-6 sm:p-10 select-none overflow-y-auto">
      {/* Top Header Row */}
      <div className="w-full max-w-5xl flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-200">BRIAN BUTTERFIELD'S DIET PLAN</span>
          <span>·</span>
          <span>OFFICIAL DEFENDER</span>
        </div>

        <div className="flex items-center gap-4">
          {highScore > 0 && (
            <div className="flex items-center gap-1.5 font-mono text-amber-400">
              <span className="text-slate-400 text-[11px]">RECORD:</span>
              <span className="font-bold tabular-nums">{highScore.toLocaleString()}</span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={onToggleVoice}
              className="p-1.5 text-slate-400 hover:text-white rounded-md transition-colors"
              title="Toggle Brian Butterfield Voice"
            >
              {isVoiceEnabled ? <Mic className="w-4 h-4 text-emerald-400" /> : <MicOff className="w-4 h-4" />}
            </button>
            <button
              onClick={onToggleMute}
              className="p-1.5 text-slate-400 hover:text-white rounded-md transition-colors"
              title="Toggle Audio"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Centerpiece & Title Lockup */}
      <div className="w-full max-w-4xl my-auto flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 py-6">
        {/* Brian's Portrait Card */}
        <div className="relative group shrink-0">
          <div className="w-56 h-72 sm:w-64 sm:h-80 rounded-2xl overflow-hidden border-2 border-slate-700 shadow-2xl relative bg-slate-900">
            <img
              src="/assets/aistudio/image_b53d7ec1.png"
              alt="Brian Butterfield"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-top filter contrast-105"
            />
            {/* Elegant gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
            <div className="absolute bottom-3 inset-x-3 text-center">
              <div className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                Official Diet Consultant
              </div>
              <div className="text-sm font-extrabold text-white">Brian Butterfield</div>
            </div>
          </div>

          {/* Floating Diet Pamphlet Badge */}
          <div className="absolute -bottom-3 -right-3 bg-amber-500 text-slate-950 px-3 py-1 rounded-lg font-display font-extrabold text-xs shadow-lg transform rotate-2">
            CALL NOW!
          </div>
        </div>

        {/* Title & Briefing */}
        <div className="flex flex-col text-center md:text-left max-w-lg">
          {/* Bespoke inline SVG Title Lockup */}
          <div className="mb-3">
            <svg viewBox="0 0 460 70" className="w-full max-w-[420px] mx-auto md:mx-0">
              <defs>
                <linearGradient id="butterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#fbbf24" />
                </linearGradient>
              </defs>
              <text x="0" y="24" fill="#94a3b8" fontFamily="'Plus Jakarta Sans', sans-serif" fontSize="14" fontWeight="800" letterSpacing="3">
                BRIAN BUTTERFIELD'S
              </text>
              <text x="0" y="60" fill="url(#butterGrad)" fontFamily="'Bricolage Grotesque', sans-serif" fontSize="38" fontWeight="800" letterSpacing="1">
                TREAT DAY DEFENDER
              </text>
            </svg>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed mb-4">
            Fight away tempting treat day foods until Sunday! You may only subsist on{' '}
            <strong className="text-amber-300">one cornflake</strong>,{' '}
            <strong className="text-sky-300">an ice cube</strong>, and{' '}
            <strong className="text-blue-300">room temperature water</strong>.
          </p>

          {/* Diet Schedule Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 mb-5 text-xs text-left">
            <div className="font-semibold text-amber-400 mb-1.5 flex items-center justify-between">
              <span>THE OFFICIAL BUTTERFIELD DIET SCHEDULE</span>
              <span className="text-[10px] text-slate-400 font-mono">MON - SUN</span>
            </div>
            <ul className="space-y-1 text-slate-300 text-[11.5px]">
              <li><strong className="text-slate-100">Monday & Thursday:</strong> Just one cornflake (+Speed).</li>
              <li><strong className="text-slate-100">Tuesday & Friday:</strong> Pint of room temperature water (Shield).</li>
              <li><strong className="text-slate-100">Wednesday & Saturday:</strong> An ice cube (Freezes all foods).</li>
              <li className="text-amber-300 font-semibold pt-1 border-t border-slate-800">
                <strong>Sunday: TREAT DAY!</strong> Invulnerable eating frenzy! Gobble everything!
              </li>
            </ul>
          </div>

          {/* Mode Selector Tabs */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            <button
              onClick={() => setSelectedMode('story')}
              className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                selectedMode === 'story'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Week Campaign</span>
            </button>

            <button
              onClick={() => setSelectedMode('endless')}
              className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                selectedMode === 'endless'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Endless Diet</span>
            </button>

            <button
              onClick={() => setSelectedMode('treat_day_sandbox')}
              className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                selectedMode === 'treat_day_sandbox'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              <UtensilsCrossed className="w-3.5 h-3.5" />
              <span>Treat Day!</span>
            </button>
          </div>

          {/* Start CTA Button */}
          <button
            onClick={() => onStart(selectedMode)}
            className="w-full py-3.5 px-6 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-display font-black text-lg rounded-xl shadow-xl transition-all transform active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Play className="w-5 h-5 fill-slate-950" />
            <span>START DIET DEFENSE</span>
          </button>
        </div>
      </div>

      {/* Flat Control Hint Line */}
      <div className="w-full max-w-4xl pt-4 border-t border-slate-800/80 text-center text-xs text-slate-500">
        <span>WASD Move</span>
        <span className="mx-2.5">·</span>
        <span>Space / Left-Click Swat</span>
        <span className="mx-2.5">·</span>
        <span>E / Right-Click Megaphone "CALL NOW!"</span>
        <span className="mx-2.5">·</span>
        <span>Esc Pause</span>
      </div>
    </div>
  );
};
