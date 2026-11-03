import React from 'react';
import { Play, RotateCcw, Home, Volume2, VolumeX, Mic, MicOff } from 'lucide-react';

interface PauseModalProps {
  onResume: () => void;
  onRestart: () => void;
  onTitle: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  isVoiceEnabled: boolean;
  onToggleVoice: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  onResume,
  onRestart,
  onTitle,
  isMuted,
  onToggleMute,
  isVoiceEnabled,
  onToggleVoice,
}) => {
  return (
    <div className="absolute inset-0 z-40 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-sm w-full p-6 shadow-2xl text-center">
        <h3 className="font-display font-black text-2xl text-white mb-1">
          DIET PAUSED
        </h3>
        <p className="text-xs text-slate-400 mb-6">
          Brian Butterfield is taking a brief tea-less break.
        </p>

        {/* Audio Toggles inside pause menu */}
        <div className="flex items-center justify-center gap-3 mb-6 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
          <button
            onClick={onToggleVoice}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              isVoiceEnabled ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'
            }`}
          >
            {isVoiceEnabled ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
            <span>Voice Lines</span>
          </button>

          <button
            onClick={onToggleMute}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              !isMuted ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-800 text-slate-400'
            }`}
          >
            {!isMuted ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span>Sound Effects</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          <button
            onClick={onResume}
            className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-display font-extrabold text-sm rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            <span>RESUME DIET</span>
          </button>

          <button
            onClick={onRestart}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>RESTART WEEK</span>
          </button>

          <button
            onClick={onTitle}
            className="w-full py-2.5 bg-transparent hover:bg-slate-800/50 text-slate-400 font-medium text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Home className="w-3.5 h-3.5" />
            <span>RETURN TO TITLE</span>
          </button>
        </div>
      </div>
    </div>
  );
};
