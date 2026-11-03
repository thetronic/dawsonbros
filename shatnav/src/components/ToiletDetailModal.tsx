import React, { useState } from 'react';
import { BathroomListing } from '../types';
import {
  X,
  Star,
  ShieldCheck,
  MapPin,
  Sparkles,
  Droplets,
  Wind,
  Flame,
  Wifi,
  Baby,
  Volume2,
  KeyRound,
  CheckCircle2,
  Heart,
  MessageSquare,
} from 'lucide-react';

interface ToiletDetailModalProps {
  bathroom: BathroomListing;
  onClose: () => void;
  onBook: (bathroom: BathroomListing, type: 'wee' | 'poo') => void;
}

export const ToiletDetailModal: React.FC<ToiletDetailModalProps> = ({
  bathroom,
  onClose,
  onBook,
}) => {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const photos = bathroom.gallery.length > 0 ? bathroom.gallery : [bathroom.image];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col text-slate-100">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 bg-slate-900/90 sticky top-0 z-10 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <span className="text-xl">🚽</span>
            <span className="font-bold text-sm text-slate-200">Shatnav Verified Throne</span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold px-2 py-0.5 rounded-full">
              Hospitality Grade
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto p-5 space-y-6">
          {/* Gallery View */}
          <div className="space-y-2">
            <div className="relative h-64 sm:h-72 w-full rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
              <img
                src={photos[selectedPhotoIndex]}
                alt={bathroom.title}
                className="w-full h-full object-cover transition-all duration-300"
              />
              <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-700 text-xs font-semibold text-amber-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Cleanliness Verified: {bathroom.cleanlinessScore} / 5.0</span>
              </div>
            </div>

            {/* Thumbnail selector */}
            {photos.length > 1 && (
              <div className="flex items-center gap-2">
                {photos.map((photo, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedPhotoIndex(idx)}
                    className={`w-16 h-12 rounded-lg overflow-hidden border-2 transition ${
                      selectedPhotoIndex === idx
                        ? 'border-amber-400 scale-105'
                        : 'border-slate-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={photo} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Title & Host row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <h2 className="text-xl font-extrabold text-white">{bathroom.title}</h2>
              <p className="text-xs text-amber-300/90 font-medium mt-0.5">{bathroom.tagline}</p>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                <span>{bathroom.address}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/80 self-start sm:self-auto">
              <img
                src={bathroom.hostAvatar}
                alt={bathroom.hostName}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-amber-400"
              />
              <div>
                <div className="flex items-center gap-1">
                  <span className="font-bold text-xs text-slate-100">{bathroom.hostName}</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <span className="text-[10px] text-amber-400 font-semibold block">
                  {bathroom.hostBadge}
                </span>
                <span className="text-[10px] text-slate-400">
                  {bathroom.totalVisits} happy poopers hosted
                </span>
              </div>
            </div>
          </div>

          {/* Pricing Highlight */}
          <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700/80">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Shatnav Official Tariff
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-700/90">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
                    <Droplets className="w-4 h-4 text-sky-400" />
                    <span>Number 1 (Wee)</span>
                  </div>
                  <span className="text-lg font-black text-amber-400 font-mono">
                    ${bathroom.weePrice.toFixed(2)}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Quick pitstop. 5-7 min slot. Includes 1 courtesy flush & soap.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                    <span>💩</span>
                    <span>Number 2 (Poo)</span>
                  </div>
                  <span className="text-lg font-black text-amber-400 font-mono">
                    ${bathroom.pooPrice.toFixed(2)}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  The full throne experience. 20 min slot. Soft 3+ ply & sound barrier radio.
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">About this Throne</h4>
            <p className="text-xs text-slate-300 leading-relaxed">{bathroom.description}</p>
          </div>

          {/* Amenities Grid */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Sanitary Amenities & Features
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/60 border border-slate-800">
                <span className="text-base">🧻</span>
                <div>
                  <span className="font-semibold text-slate-200 block">{bathroom.paperPly}-Ply Toilet Paper</span>
                  <span className="text-[10px] text-slate-400">Guaranteed cloud soft</span>
                </div>
              </div>

              {bathroom.amenities.bidet && (
                <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/60 border border-slate-800">
                  <Wind className="w-4 h-4 text-sky-400" />
                  <div>
                    <span className="font-semibold text-slate-200 block">Electronic Bidet</span>
                    <span className="text-[10px] text-slate-400">Warm wash & air dry</span>
                  </div>
                </div>
              )}

              {bathroom.amenities.heatedSeat && (
                <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/60 border border-slate-800">
                  <Flame className="w-4 h-4 text-amber-400" />
                  <div>
                    <span className="font-semibold text-slate-200 block">Heated Seat</span>
                    <span className="text-[10px] text-slate-400">Pre-warmed porcelain</span>
                  </div>
                </div>
              )}

              {bathroom.amenities.stepFree && (
                <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/60 border border-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <div>
                    <span className="font-semibold text-slate-200 block">Step-Free Access</span>
                    <span className="text-[10px] text-slate-400">Ground floor accessible</span>
                  </div>
                </div>
              )}

              {bathroom.amenities.scentedCandles && (
                <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/60 border border-slate-800">
                  <span className="text-base">🕯️</span>
                  <div>
                    <span className="font-semibold text-slate-200 block">Aromatherapy</span>
                    <span className="text-[10px] text-slate-400">Diffusers & matchsticks</span>
                  </div>
                </div>
              )}

              {bathroom.amenities.courtesyRadio && (
                <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/60 border border-slate-800">
                  <Volume2 className="w-4 h-4 text-indigo-400" />
                  <div>
                    <span className="font-semibold text-slate-200 block">Sound-Dampening Radio</span>
                    <span className="text-[10px] text-slate-400">Courtesy audio mask</span>
                  </div>
                </div>
              )}

              {bathroom.amenities.wifi && (
                <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/60 border border-slate-800">
                  <Wifi className="w-4 h-4 text-cyan-400" />
                  <div>
                    <span className="font-semibold text-slate-200 block">High-Speed Wi-Fi</span>
                    <span className="text-[10px] text-slate-400">For leisurely throne scrolling</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Access & Door Code Instructions */}
          <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-bold text-xs text-white">Contactless Access Upon Booking</h5>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {bathroom.doorCodeInstructions}
              </p>
              <span className="text-[10px] text-amber-400 font-semibold block mt-1">
                Your private 4-digit PIN will be unlocked instantly on checkout.
              </span>
            </div>
          </div>

          {/* Cleanliness Ratings & Verified Reviews */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Guest Ratings & Hygiene Score</span>
                  <span className="text-amber-400 flex items-center text-xs">
                    <Star className="w-3.5 h-3.5 fill-amber-400 mr-0.5" />
                    {bathroom.cleanlinessScore} ({bathroom.reviewCount} reviews)
                  </span>
                </h4>
              </div>
            </div>

            {/* Scorecard */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
              <div className="p-2 rounded-lg bg-slate-800/50 border border-slate-800">
                <span className="text-slate-400 text-[10px] block">Porcelain Gleam</span>
                <span className="font-bold text-emerald-400 text-sm">5.0 / 5</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-800/50 border border-slate-800">
                <span className="text-slate-400 text-[10px] block">Smell & Air</span>
                <span className="font-bold text-sky-400 text-sm">4.9 / 5</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-800/50 border border-slate-800">
                <span className="text-slate-400 text-[10px] block">Paper Softness</span>
                <span className="font-bold text-amber-400 text-sm">4.8 / 5</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-800/50 border border-slate-800">
                <span className="text-slate-400 text-[10px] block">Acoustic Privacy</span>
                <span className="font-bold text-purple-400 text-sm">4.9 / 5</span>
              </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-2.5">
              {bathroom.recentReviews.map((rev) => (
                <div key={rev.id} className="p-3 rounded-xl bg-slate-800/50 border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={rev.authorAvatar}
                        alt={rev.author}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                      <span className="font-bold text-xs text-slate-200">{rev.author}</span>
                      <span className="text-[10px] text-slate-400">• {rev.date}</span>
                    </div>
                    <div className="flex items-center text-amber-400">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-2.5 h-2.5 fill-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 italic">"{rev.comment}"</p>
                  {rev.hostReply && (
                    <div className="ml-4 pl-2 border-l border-amber-500/40 text-[11px] text-slate-400">
                      <span className="text-amber-400 font-semibold">{bathroom.hostName} (Host):</span>{' '}
                      {rev.hostReply}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sticky Booking Action Footer */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between gap-3 sticky bottom-0 z-10">
          <div>
            <span className="text-xs text-slate-400 block">Instant Reservation</span>
            <span className="text-sm font-bold text-white">Book Your Relief Slot</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onBook(bathroom, 'wee');
              }}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-sky-300 hover:text-white transition flex items-center gap-1.5"
            >
              <Droplets className="w-3.5 h-3.5 text-sky-400" />
              <span>Book Wee ($1)</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onBook(bathroom, 'poo');
              }}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-900/40 border border-amber-400 transition flex items-center gap-1.5"
            >
              <span>💩</span>
              <span>Book Poo ($2)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
