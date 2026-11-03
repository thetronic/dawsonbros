import React, { useState } from 'react';
import { BathroomListing } from '../types';
import {
  DollarSign,
  TrendingUp,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  ShieldCheck,
  Plus,
  KeyRound,
  CheckCircle2,
  Clock,
  Droplets,
  AlertCircle,
  Eye,
  Sliders,
} from 'lucide-react';
import { soundManager } from '../utils/audio';

interface HostPortalProps {
  myListings: BathroomListing[];
  onOpenNewListingModal: () => void;
  onUpdateListingStatus: (id: string, status: 'available' | 'in-use' | 'cleaning' | 'closed') => void;
  onUpdateListingPrices: (id: string, weePrice: number, pooPrice: number) => void;
  onClose: () => void;
}

export const HostPortal: React.FC<HostPortalProps> = ({
  myListings,
  onOpenNewListingModal,
  onUpdateListingStatus,
  onUpdateListingPrices,
  onClose,
}) => {
  const [selectedListingId, setSelectedListingId] = useState(
    myListings[0]?.id || ''
  );
  const activeListing = myListings.find((l) => l.id === selectedListingId) || myListings[0];

  // Simulated earnings
  const [weePrice, setWeePrice] = useState(activeListing?.weePrice || 1.00);
  const [pooPrice, setPooPrice] = useState(activeListing?.pooPrice || 2.00);
  const [showPriceSavedToast, setShowPriceSavedToast] = useState(false);

  // Incoming guest simulation state
  const [incomingRequest, setIncomingRequest] = useState<{
    guestName: string;
    type: 'wee' | 'poo';
    minutesAgo: string;
  } | null>(null);

  // Checklist
  const [checklist, setChecklist] = useState({
    bleach: true,
    paper: true,
    towels: true,
    candle: true,
    battery: true,
  });

  const toggleChecklist = (key: keyof typeof checklist) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSavePrices = () => {
    if (activeListing) {
      onUpdateListingPrices(activeListing.id, weePrice, pooPrice);
      setShowPriceSavedToast(true);
      setTimeout(() => setShowPriceSavedToast(false), 2500);
    }
  };

  const simulateIncomingGuest = () => {
    soundManager.playChimeSound();
    setIncomingRequest({
      guestName: 'Liam Kensington (4.9⭐ Guest)',
      type: Math.random() > 0.4 ? 'poo' : 'wee',
      minutesAgo: 'Just now',
    });
  };

  const handleApproveGuest = () => {
    soundManager.playDoorUnlockSound();
    if (activeListing) {
      onUpdateListingStatus(activeListing.id, 'in-use');
    }
    setIncomingRequest(null);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 text-slate-100 space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-amber-500/20 via-slate-800/80 to-slate-900 border border-amber-500/40">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/30 border border-amber-400/50 flex items-center justify-center text-2xl shadow-lg">
            🏠
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-white">Shatnav Host Command Center</h2>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-500/40">
                P2P Verified Host
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Turn your private spare bathroom into passive recurring income.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={simulateIncomingGuest}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-amber-300 flex items-center gap-1.5 transition"
          >
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>Simulate Guest Request</span>
          </button>

          <button
            onClick={onOpenNewListingModal}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 flex items-center gap-1.5 transition active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>List Another Bathroom</span>
          </button>
        </div>
      </div>

      {/* Incoming Request Alert Banner */}
      {incomingRequest && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/30 via-slate-800 to-slate-900 border-2 border-amber-400 animate-pulse flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center text-lg font-bold">
              {incomingRequest.type === 'wee' ? '💧' : '💩'}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm text-white">
                  Incoming Reservation Request!
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-400 text-slate-950">
                  {incomingRequest.type === 'wee' ? '$1 Wee' : '$2 Poo'}
                </span>
              </div>
              <p className="text-xs text-slate-300">
                {incomingRequest.guestName} is 90 meters away requesting immediate access.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIncomingRequest(null)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-400"
            >
              Decline
            </button>
            <button
              onClick={handleApproveGuest}
              className="px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs shadow-md shadow-emerald-500/30 flex items-center gap-1"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Accept & Send Smart Lock PIN</span>
            </button>
          </div>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="font-mono text-2xl font-black text-emerald-400">$178.50</div>
          <span className="text-[10px] text-slate-400 block">+24% vs last week</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Wees Hosted ($1)</span>
            <Droplets className="w-4 h-4 text-sky-400" />
          </div>
          <div className="font-mono text-2xl font-black text-sky-300">92</div>
          <span className="text-[10px] text-slate-400 block">Avg duration: 4.2 mins</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Poos Hosted ($2)</span>
            <span className="text-base">💩</span>
          </div>
          <div className="font-mono text-2xl font-black text-amber-400">38</div>
          <span className="text-[10px] text-slate-400 block">Avg duration: 16.5 mins</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Cleanliness Score</span>
            <Sparkles className="w-4 h-4 text-yellow-400" />
          </div>
          <div className="font-mono text-2xl font-black text-yellow-300">4.96 ⭐</div>
          <span className="text-[10px] text-emerald-400 font-semibold block">Top 2% in city</span>
        </div>
      </div>

      {/* Main Two-Column View */}
      {activeListing && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Listing Manager & Pricing */}
          <div className="lg:col-span-2 space-y-5">
            {/* Active Listing Card */}
            <div className="p-5 rounded-2xl bg-slate-800/70 border border-slate-700/80 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-bold text-base text-white">{activeListing.title}</h3>
                  <p className="text-xs text-slate-400">{activeListing.address}</p>
                </div>

                {/* Status Toggle buttons */}
                <div className="inline-flex rounded-xl bg-slate-900 p-1 border border-slate-700/80 text-xs">
                  <button
                    onClick={() => onUpdateListingStatus(activeListing.id, 'available')}
                    className={`px-3 py-1 rounded-lg font-bold transition ${
                      activeListing.status === 'available'
                        ? 'bg-emerald-500 text-slate-950 shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    ● Open to Public
                  </button>
                  <button
                    onClick={() => onUpdateListingStatus(activeListing.id, 'cleaning')}
                    className={`px-3 py-1 rounded-lg font-bold transition ${
                      activeListing.status === 'cleaning'
                        ? 'bg-sky-500 text-slate-950 shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Sanitizing
                  </button>
                  <button
                    onClick={() => onUpdateListingStatus(activeListing.id, 'closed')}
                    className={`px-3 py-1 rounded-lg font-bold transition ${
                      activeListing.status === 'closed'
                        ? 'bg-rose-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Snoozed
                  </button>
                </div>
              </div>

              {/* Pricing Customization */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5 text-amber-400" />
                      <span>Adjust Tariff (Wee vs Poo)</span>
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Standard Shatnav rate is $1 for a wee and $2 for a poo. You can adjust for peak events.
                    </p>
                  </div>
                  {showPriceSavedToast && (
                    <span className="text-xs text-emerald-400 font-bold animate-bounce">
                      ✓ Prices Updated!
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="p-3 rounded-lg bg-slate-800 border border-slate-700 space-y-1">
                    <label className="text-[11px] font-semibold text-slate-300 block">
                      💧 Wee Price ($)
                    </label>
                    <input
                      type="number"
                      step="0.25"
                      min="0.50"
                      max="5.00"
                      value={weePrice}
                      onChange={(e) => setWeePrice(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-sm font-mono font-bold text-amber-400 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="p-3 rounded-lg bg-slate-800 border border-slate-700 space-y-1">
                    <label className="text-[11px] font-semibold text-slate-300 block">
                      💩 Poo Price ($)
                    </label>
                    <input
                      type="number"
                      step="0.25"
                      min="1.00"
                      max="10.00"
                      value={pooPrice}
                      onChange={(e) => setPooPrice(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-sm font-mono font-bold text-amber-400 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <button
                  onClick={handleSavePrices}
                  className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition"
                >
                  Save New Rates
                </button>
              </div>

              {/* Door Code & Instructions */}
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start justify-between gap-3 text-xs">
                <div>
                  <span className="font-bold text-slate-300 block">Current Smart Lock Code</span>
                  <p className="text-[11px] text-slate-400">{activeListing.doorCodeInstructions}</p>
                </div>
                <div className="font-mono text-base font-black text-emerald-400 bg-slate-900 px-3 py-1 rounded border border-slate-700">
                  {activeListing.defaultDoorCode}
                </div>
              </div>
            </div>
          </div>

          {/* Right Col: Host Hygiene & Inspection Checklist */}
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-slate-800/70 border border-slate-700/80 space-y-3">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>5-Star Cleanliness Checklist</span>
                </h4>
                <p className="text-[11px] text-slate-400">
                  Keep your ratings above 4.8 to qualify for SuperHost royalty bonuses
                </p>
              </div>

              <div className="space-y-2 text-xs">
                <button
                  type="button"
                  onClick={() => toggleChecklist('bleach')}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-900/70 border border-slate-800 text-left transition"
                >
                  <span className="text-slate-300">Sanitize porcelain rim with Dettol</span>
                  <span className={`text-base ${checklist.bleach ? 'text-emerald-400' : 'text-slate-600'}`}>
                    {checklist.bleach ? '✓' : '○'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => toggleChecklist('paper')}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-900/70 border border-slate-800 text-left transition"
                >
                  <span className="text-slate-300">Replenish 3-ply/4-ply roll</span>
                  <span className={`text-base ${checklist.paper ? 'text-emerald-400' : 'text-slate-600'}`}>
                    {checklist.paper ? '✓' : '○'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => toggleChecklist('towels')}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-900/70 border border-slate-800 text-left transition"
                >
                  <span className="text-slate-300">Hang fresh Egyptian cotton hand towels</span>
                  <span className={`text-base ${checklist.towels ? 'text-emerald-400' : 'text-slate-600'}`}>
                    {checklist.towels ? '✓' : '○'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => toggleChecklist('candle')}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-900/70 border border-slate-800 text-left transition"
                >
                  <span className="text-slate-300">Light lavender scented candle / diffuser</span>
                  <span className={`text-base ${checklist.candle ? 'text-emerald-400' : 'text-slate-600'}`}>
                    {checklist.candle ? '✓' : '○'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => toggleChecklist('battery')}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-900/70 border border-slate-800 text-left transition"
                >
                  <span className="text-slate-300">Keypad deadbolt battery &gt; 80%</span>
                  <span className={`text-base ${checklist.battery ? 'text-emerald-400' : 'text-slate-600'}`}>
                    {checklist.battery ? '✓' : '○'}
                  </span>
                </button>
              </div>

              <div className="pt-2 text-center">
                <span className="text-[11px] text-emerald-400 font-semibold">
                  ✓ Ready for the next guest
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
