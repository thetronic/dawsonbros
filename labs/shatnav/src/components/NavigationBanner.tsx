import React, { useState, useEffect } from 'react';
import { ActiveBooking } from '../types';
import { Navigation, MapPin, KeyRound, Check, AlertCircle, Volume2, ShieldCheck, ArrowRight } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface NavigationBannerProps {
  booking: ActiveBooking;
  onArrived: () => void;
  onCancel: () => void;
}

export const NavigationBanner: React.FC<NavigationBannerProps> = ({
  booking,
  onArrived,
  onCancel,
}) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [progressSec, setProgressSec] = useState(0);

  // Simulate walking progress countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setProgressSec((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const totalDistanceM = 160;
  const distanceRemaining = Math.max(10, totalDistanceM - progressSec * 4);
  const etaMinutes = Math.max(1, Math.ceil(distanceRemaining / 80));

  const copyCode = () => {
    navigator.clipboard?.writeText?.(booking.doorCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleArrival = () => {
    soundManager.playDoorUnlockSound();
    onArrived();
  };

  return (
    <div className="fixed top-20 left-4 right-4 max-w-xl mx-auto z-40 bg-slate-900/95 backdrop-blur-xl border border-amber-500/50 rounded-2xl shadow-2xl p-4 text-slate-100 ring-2 ring-amber-500/20">
      {/* Top row: Status and Walking ETA */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Navigation className="w-4 h-4 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xs text-white uppercase tracking-wider">
                Shatnav Walking Directions
              </span>
              <span className="text-[10px] bg-amber-400/20 text-amber-300 font-bold px-1.5 py-0.5 rounded">
                Live Route
              </span>
            </div>
            <p className="text-[11px] text-slate-400">To {booking.bathroomTitle}</p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs font-mono font-black text-amber-400">
            {distanceRemaining}m
          </span>
          <span className="text-[10px] text-slate-400 block">~{etaMinutes} min walk</span>
        </div>
      </div>

      {/* Middle Row: Turn guidance & Door PIN */}
      <div className="py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="space-y-0.5 flex-1">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
            <MapPin className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
            <span>Turn right in 35m into entrance on {booking.address.split(',')[0]}</span>
          </div>
          <p className="text-[11px] text-slate-400 pl-5">
            {booking.doorInstructions}
          </p>
        </div>

        {/* Revealed Door PIN */}
        <div className="flex items-center gap-2 bg-slate-800/90 border border-slate-700 px-3 py-1.5 rounded-xl self-stretch sm:self-auto justify-between sm:justify-start">
          <div className="flex items-center gap-1.5">
            <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[10px] uppercase font-bold text-slate-400">PIN:</span>
            <span className="font-mono font-black text-sm text-emerald-300 tracking-wider">
              {booking.doorCode}
            </span>
          </div>
          <button
            onClick={copyCode}
            className="text-[10px] text-amber-400 hover:text-amber-300 font-semibold px-1.5 py-0.5 rounded bg-slate-700/80"
          >
            {copiedCode ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800">
        <button
          onClick={onCancel}
          className="text-xs text-slate-400 hover:text-red-400 underline transition"
        >
          Cancel & Refund
        </button>

        <button
          onClick={handleArrival}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-1.5 active:scale-95"
        >
          <ShieldCheck className="w-4 h-4" />
          <span>I'm at the Door & Entering</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
