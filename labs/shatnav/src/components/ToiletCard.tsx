import React from 'react';
import { BathroomListing } from '../types';
import { Star, MapPin, Wind, Sparkles, ShieldCheck, ChevronRight, X, Clock, Droplets } from 'lucide-react';

interface ToiletCardProps {
  bathroom: BathroomListing;
  onClose: () => void;
  onBook: (bathroom: BathroomListing, initialType?: 'wee' | 'poo') => void;
  onOpenDetails: (bathroom: BathroomListing) => void;
  distanceMeters?: number;
}

export const ToiletCard: React.FC<ToiletCardProps> = ({
  bathroom,
  onClose,
  onBook,
  onOpenDetails,
  distanceMeters = 180,
}) => {
  const isAvailable = bathroom.status === 'available';
  const isInUse = bathroom.status === 'in-use';

  // Calculate walking time (~80 meters per minute)
  const walkingMinutes = Math.max(1, Math.ceil(distanceMeters / 80));

  return (
    <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 z-30 bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden transition-all text-slate-100">
      {/* Top Banner with Close */}
      <div className="relative h-28 w-full overflow-hidden">
        <img
          src={bathroom.image}
          alt={bathroom.title}
          className="w-full h-full object-cover brightness-90 hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-black/40" />

        <button
          onClick={onClose}
          className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-slate-900/70 hover:bg-slate-900 text-slate-300 hover:text-white flex items-center justify-center transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Status chip on image */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold backdrop-blur-md border shadow-sm">
          {isAvailable ? (
            <span className="bg-emerald-500/90 text-white px-2 py-0.5 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              Vacant & Sanitized
            </span>
          ) : isInUse ? (
            <span className="bg-amber-500/90 text-slate-950 px-2 py-0.5 rounded-full flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Occupied ({bathroom.inUseRemainingMins || 3}m left)
            </span>
          ) : (
            <span className="bg-slate-700 text-slate-200 px-2 py-0.5 rounded-full">Closed</span>
          )}
        </div>

        {/* Distance Badge */}
        <div className="absolute bottom-2 left-3 flex items-center gap-1 text-[11px] font-bold text-amber-300 bg-slate-950/80 px-2 py-0.5 rounded-lg border border-slate-700/60">
          <MapPin className="w-3 h-3 text-amber-400" />
          <span>{distanceMeters}m away</span>
          <span className="text-slate-400">•</span>
          <span>~{walkingMinutes} min walk</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title and Ratings */}
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3
              onClick={() => onOpenDetails(bathroom)}
              className="font-bold text-base text-white hover:text-amber-400 cursor-pointer line-clamp-1 transition"
            >
              {bathroom.title}
            </h3>
            <div className="flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/20 whitespace-nowrap">
              <Star className="w-3 h-3 fill-amber-400" />
              <span>{bathroom.cleanlinessScore}</span>
              <span className="text-slate-400 font-normal">({bathroom.reviewCount})</span>
            </div>
          </div>
          <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{bathroom.address}</p>
        </div>

        {/* Host and Paper Specs */}
        <div className="flex items-center justify-between text-xs py-1.5 border-y border-slate-800">
          <div className="flex items-center gap-2">
            <img
              src={bathroom.hostAvatar}
              alt={bathroom.hostName}
              className="w-6 h-6 rounded-full object-cover ring-1 ring-amber-400/40"
            />
            <div>
              <span className="text-slate-300 font-medium">Host: {bathroom.hostName}</span>
              <span className="text-[10px] text-amber-400 block -mt-0.5">
                {bathroom.hostBadge}
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[11px] text-slate-400">Paper Grade:</span>
            <span className="font-bold text-amber-300 ml-1">
              {bathroom.paperPly}-ply {bathroom.paperPly >= 4 ? 'Cloud' : 'Soft'}
            </span>
          </div>
        </div>

        {/* Amenity Badges */}
        <div className="flex items-center gap-1.5 flex-wrap text-[11px] text-slate-300">
          {bathroom.amenities.bidet && (
            <span className="px-2 py-0.5 rounded bg-sky-500/10 text-sky-300 border border-sky-500/20 flex items-center gap-1">
              <Wind className="w-2.5 h-2.5" /> Bidet
            </span>
          )}
          {bathroom.amenities.heatedSeat && (
            <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
              🔥 Heated Seat
            </span>
          )}
          {bathroom.amenities.stepFree && (
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
              ♿ Step-Free
            </span>
          )}
          {bathroom.amenities.scentedCandles && (
            <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
              🕯️ Scented
            </span>
          )}
        </div>

        {/* Pricing & Booking Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={() => onBook(bathroom, 'wee')}
            className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 hover:border-amber-400/50 text-white transition active:scale-95 group"
          >
            <div className="flex items-center gap-1 text-xs font-semibold text-slate-300 group-hover:text-amber-300">
              <Droplets className="w-3.5 h-3.5 text-sky-400" />
              <span>Wee Session</span>
            </div>
            <div className="text-base font-extrabold text-amber-400 font-mono">
              ${bathroom.weePrice.toFixed(2)}
            </div>
            <span className="text-[10px] text-slate-400">7 mins slot</span>
          </button>

          <button
            onClick={() => onBook(bathroom, 'poo')}
            className="flex flex-col items-center justify-center p-2 rounded-xl bg-gradient-to-br from-amber-600 via-amber-500 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-bold shadow-md shadow-amber-900/30 border border-amber-400 transition active:scale-95"
          >
            <div className="flex items-center gap-1 text-xs font-bold text-slate-950">
              <span>💩</span>
              <span>Poo Session</span>
            </div>
            <div className="text-base font-black font-mono">
              ${bathroom.pooPrice.toFixed(2)}
            </div>
            <span className="text-[10px] text-slate-900/80">20 mins + Radio</span>
          </button>
        </div>

        {/* Full Details link */}
        <button
          onClick={() => onOpenDetails(bathroom)}
          className="w-full text-center text-xs text-slate-400 hover:text-amber-300 flex items-center justify-center gap-1 pt-0.5 transition"
        >
          <span>See photos, door access code & verified reviews</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
