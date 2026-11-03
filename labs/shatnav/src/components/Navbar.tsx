import React from 'react';
import { Compass, AlertOctagon, Sparkles, Home, User, Wallet, Droplets } from 'lucide-react';
import { CITIES } from '../data/bathrooms';

interface NavbarProps {
  currentCityName: string;
  onSelectCity: (cityName: string) => void;
  isHostMode: boolean;
  onToggleHostMode: () => void;
  onEmergencySOS: () => void;
  walletBalance: number;
  onTopUpWallet: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentCityName,
  onSelectCity,
  isHostMode,
  onToggleHostMode,
  onEmergencySOS,
  walletBalance,
  onTopUpWallet,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 text-slate-950 shadow-lg shadow-amber-500/25 font-black text-xl">
            <span className="text-xl">🚽</span>
            <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-slate-900 rounded-full flex items-center justify-center text-[9px] font-bold text-white">
              ✓
            </span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-amber-200 bg-clip-text text-transparent font-['Space_Grotesk']">
                Shatnav
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                P2P Loo
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              $1 for a wee • $2 for a poo • Peer-to-peer porcelain
            </p>
          </div>
        </div>

        {/* Center / City Selector */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-800/90 border border-slate-700/80 rounded-lg px-2.5 py-1 text-xs text-slate-300">
            <Compass className="w-3.5 h-3.5 text-amber-400 mr-1.5 animate-spin-slow" />
            <select
              value={currentCityName}
              onChange={(e) => onSelectCity(e.target.value)}
              className="bg-transparent text-slate-200 font-semibold focus:outline-none cursor-pointer pr-1"
            >
              {CITIES.map((c) => (
                <option key={c.name} value={c.name} className="bg-slate-900 text-slate-200">
                  {c.name} ({c.country})
                </option>
              ))}
            </select>
          </div>

          {/* Emergency SOS Button */}
          {!isHostMode && (
            <button
              onClick={onEmergencySOS}
              className="relative group overflow-hidden px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-red-900/40 border border-red-400/30 flex items-center gap-1.5 transition-all transform active:scale-95 animate-pulse"
              title="Find nearest available toilet instantly!"
            >
              <AlertOctagon className="w-4 h-4 text-white animate-bounce" />
              <span className="tracking-wide uppercase font-extrabold text-[11px] sm:text-xs">
                Code Red SOS
              </span>
            </button>
          )}
        </div>

        {/* Right Actions: Wallet & Mode Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Wallet Balance */}
          <button
            onClick={onTopUpWallet}
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-xs transition"
            title="Shatnav Pay Wallet"
          >
            <Wallet className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-400">Balance:</span>
            <span className="font-bold text-emerald-400 font-mono">${walletBalance.toFixed(2)}</span>
            <span className="text-[10px] text-amber-400 font-semibold ml-0.5">+Top-up</span>
          </button>

          {/* Host Mode Toggle Switch */}
          <button
            onClick={onToggleHostMode}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
              isHostMode
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20'
                : 'bg-slate-800 text-slate-200 border-slate-700 hover:border-slate-600 hover:bg-slate-700/70'
            }`}
          >
            {isHostMode ? (
              <>
                <Home className="w-3.5 h-3.5" />
                <span>Host Portal</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Host a Bathroom</span>
                <span className="sm:hidden">Host</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
