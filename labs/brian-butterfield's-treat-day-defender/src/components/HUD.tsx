import React from 'react';
import { GameStats } from '../types';
import { DAYS_CONFIG } from '../game/constants';
import { Volume2, VolumeX, Mic, MicOff, Pause, Megaphone, Shield, Snowflake, Sparkles } from 'lucide-react';
import { sound } from '../audio/soundEngine';

interface HUDProps {
  stats: GameStats;
  willpower: number;
  megaphoneCharge: number;
  shieldTime: number;
  iceAuraTime: number;
  speedBoostTime: number;
  isTreatDay: boolean;
  onPause: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  isVoiceEnabled: boolean;
  onToggleVoice: () => void;
}

export const HUD: React.FC<HUDProps> = ({
  stats,
  willpower,
  megaphoneCharge,
  shieldTime,
  iceAuraTime,
  speedBoostTime,
  isTreatDay,
  onPause,
  isMuted,
  onToggleMute,
  isVoiceEnabled,
  onToggleVoice,
}) => {
  const currentDay = DAYS_CONFIG[stats.dayIndex];

  // Calculate in-game clock from dayElapsed (e.g. 9:00 AM to 5:00 PM, or to 11:59 PM on Saturday)
  const totalDaySecs = currentDay.duration;
  const progress = Math.min(1, stats.dayElapsed / totalDaySecs);

  let timeString = '09:00 AM';
  if (currentDay.name === 'Saturday') {
    // 9 AM to 12 AM midnight (15 hours)
    const totalMinutes = Math.floor(progress * 15 * 60);
    const hour24 = 9 + Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    const hour12 = hour24 > 12 ? hour24 - 12 : hour24;
    const ampm = hour24 >= 12 ? 'PM' : 'AM';
    timeString = `${hour12.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')} ${ampm}`;
  } else if (currentDay.name === 'Sunday') {
    timeString = 'TREAT DAY!';
  } else {
    // 9 AM to 5 PM (8 hours)
    const totalMinutes = Math.floor(progress * 8 * 60);
    const hour24 = 9 + Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    const hour12 = hour24 > 12 ? hour24 - 12 : hour24;
    const ampm = hour24 >= 12 ? 'PM' : 'AM';
    timeString = `${hour12.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')} ${ampm}`;
  }

  return (
    <div className="absolute inset-0 pointer-events-none p-4 flex flex-col justify-between">
      {/* Top Bar Status Zone */}
      <div className="flex items-start justify-between gap-4">
        {/* Left Cluster: Willpower & Active Buffs */}
        <div className="bg-slate-900/90 border border-slate-700/80 rounded-xl p-3 shadow-lg pointer-events-auto backdrop-blur-sm min-w-[240px]">
          <div className="flex items-center justify-between text-xs mb-1 font-semibold tracking-wide">
            <span className="text-slate-300">DIET WILLPOWER</span>
            <span className="tabular-nums font-mono text-emerald-400">{Math.round(willpower)}%</span>
          </div>

          {/* Willpower Progress Bar */}
          <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
            <div
              className={`h-full rounded-full transition-all duration-150 ${
                isTreatDay
                  ? 'bg-gradient-to-r from-amber-400 to-yellow-300 animate-pulse'
                  : willpower > 50
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                  : willpower > 25
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                  : 'bg-gradient-to-r from-rose-600 to-red-500 animate-pulse'
              }`}
              style={{ width: `${Math.max(3, willpower)}%` }}
            />
          </div>

          {/* Status Subtitle */}
          <div className="text-[11px] text-slate-400 mt-1.5 flex items-center justify-between">
            <span>Allowed: <strong className="text-amber-300 font-medium">{currentDay.dietLabel}</strong></span>
            {stats.currentCombo > 1 && (
              <span className="text-rose-400 font-bold tabular-nums">Combo x{stats.currentCombo}</span>
            )}
          </div>

          {/* Active Buffs Strip */}
          {(shieldTime > 0 || iceAuraTime > 0 || speedBoostTime > 0) && (
            <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-800/80 text-[11px]">
              {shieldTime > 0 && (
                <div className="flex items-center gap-1 text-sky-300">
                  <Shield className="w-3.5 h-3.5" />
                  <span className="tabular-nums">{shieldTime.toFixed(1)}s</span>
                </div>
              )}
              {speedBoostTime > 0 && (
                <div className="flex items-center gap-1 text-amber-300">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span className="tabular-nums">{speedBoostTime.toFixed(1)}s</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Center Cluster: Day Calendar & In-Game Clock */}
        <div className="bg-slate-900/90 border border-slate-700/80 rounded-xl px-4 py-2.5 shadow-lg text-center backdrop-blur-sm pointer-events-auto">
          <div className="flex items-center justify-center gap-1.5 mb-1.5">
            {DAYS_CONFIG.map((d, idx) => {
              const isPast = idx < stats.dayIndex;
              const isCurrent = idx === stats.dayIndex;
              return (
                <div
                  key={d.name}
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded transition-colors ${
                    isCurrent
                      ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-300'
                      : isPast
                      ? 'bg-slate-700 text-slate-300'
                      : 'bg-slate-800/60 text-slate-500'
                  }`}
                  title={`${d.name}: ${d.dietLabel}`}
                >
                  {d.name.slice(0, 3).toUpperCase()}
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-center gap-3">
            <span className="font-display font-extrabold text-lg tracking-wide text-white">
              {currentDay.name.toUpperCase()}
            </span>
            <span className="text-slate-500">·</span>
            <span className="font-mono tabular-nums text-sm font-semibold text-amber-400">
              {timeString}
            </span>
          </div>

          {/* Day Progress bar */}
          <div className="w-48 h-1.5 bg-slate-800 rounded-full mt-1.5 overflow-hidden mx-auto">
            <div
              className="h-full bg-amber-400 transition-all duration-200"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
        </div>

        {/* Right Cluster: Score & Action Controls */}
        <div className="flex items-start gap-3 pointer-events-auto">
          {/* Score display */}
          <div className="bg-slate-900/90 border border-slate-700/80 rounded-xl px-4 py-2.5 shadow-lg backdrop-blur-sm text-right min-w-[120px]">
            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Score</div>
            <div className="font-mono font-bold text-xl text-amber-400 tabular-nums">
              {stats.score.toLocaleString()}
            </div>
          </div>

          {/* Utility Action Buttons */}
          <div className="bg-slate-900/90 border border-slate-700/80 rounded-xl p-1.5 shadow-lg backdrop-blur-sm flex items-center gap-1">
            <button
              onClick={onToggleVoice}
              title={isVoiceEnabled ? 'Mute Brian Voice' : 'Unmute Brian Voice'}
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              {isVoiceEnabled ? <Mic className="w-4 h-4 text-emerald-400" /> : <MicOff className="w-4 h-4 text-slate-500" />}
            </button>

            <button
              onClick={onToggleMute}
              title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-slate-300" />}
            </button>

            <button
              onClick={onPause}
              title="Pause Game (Esc)"
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <Pause className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Megaphone "CALL NOW!" Cooldown Readiness */}
      <div className="flex items-end justify-between">
        <div className="bg-slate-900/90 border border-slate-700/80 rounded-xl p-3 shadow-lg backdrop-blur-sm pointer-events-auto flex items-center gap-3">
          <div className={`p-2 rounded-lg ${megaphoneCharge >= 100 ? 'bg-amber-500 text-slate-950 animate-bounce' : 'bg-slate-800 text-slate-500'}`}>
            <Megaphone className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-sm tracking-wide text-white">
                "CALL NOW!" BLAST
              </span>
              <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 text-slate-300 text-[10px] rounded font-mono">
                E / R-CLICK
              </kbd>
            </div>
            <div className="w-32 h-2 bg-slate-800 rounded-full overflow-hidden mt-1 border border-slate-700">
              <div
                className={`h-full transition-all duration-100 ${
                  megaphoneCharge >= 100 ? 'bg-amber-400' : 'bg-slate-600'
                }`}
                style={{ width: `${megaphoneCharge}%` }}
              />
            </div>
          </div>
        </div>

        {/* Flat control-hint line */}
        <div className="hidden sm:block text-xs text-slate-400 bg-slate-900/80 border border-slate-800 rounded-lg px-3 py-1.5 backdrop-blur-sm">
          <span>WASD Move</span>
          <span className="mx-2 text-slate-600">·</span>
          <span>Click / Space Swat</span>
          <span className="mx-2 text-slate-600">·</span>
          <span>E Megaphone</span>
          <span className="mx-2 text-slate-600">·</span>
          <span>Esc Pause</span>
        </div>
      </div>
    </div>
  );
};
