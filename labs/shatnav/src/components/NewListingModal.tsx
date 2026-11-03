import React, { useState } from 'react';
import { BathroomListing } from '../types';
import { X, Sparkles, Plus, Image as ImageIcon, Check, ShieldCheck, MapPin } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface NewListingModalProps {
  currentCityName: string;
  currentCityCenter: { lat: number; lng: number };
  onClose: () => void;
  onAddListing: (listing: BathroomListing) => void;
}

const BATHROOM_PRESET_IMAGES = [
  'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=80',
];

export const NewListingModal: React.FC<NewListingModalProps> = ({
  currentCityName,
  currentCityCenter,
  onClose,
  onAddListing,
}) => {
  const [title, setTitle] = useState('');
  const [address, setAddress] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [weePrice, setWeePrice] = useState(1.00);
  const [pooPrice, setPooPrice] = useState(2.00);
  const [paperPly, setPaperPly] = useState<2 | 3 | 4>(3);
  const [floorLevel, setFloorLevel] = useState<'Ground Floor (Step-Free)' | '1st Floor' | '2nd Floor' | 'Basement'>('Ground Floor (Step-Free)');
  const [doorCode, setDoorCode] = useState('5541');
  const [doorInstructions, setDoorInstructions] = useState('Keypad on right door jamb. Enter PIN and turn handle.');
  const [description, setDescription] = useState('Quiet, sanitized home bathroom with fresh towels and gentle extraction fan.');
  const [selectedImage, setSelectedImage] = useState(BATHROOM_PRESET_IMAGES[0]);

  const [amenities, setAmenities] = useState({
    bidet: true,
    heatedSeat: true,
    stepFree: true,
    wifi: true,
    scentedCandles: true,
    courtesyRadio: true,
    luxurySoaps: true,
    babyChange: false,
    wetWipes: true,
    privateEntrance: true,
  });

  const toggleAmenity = (key: keyof typeof amenities) => {
    setAmenities((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundManager.playChimeSound();

    // Slight coordinate offset around center
    const latOffset = (Math.random() - 0.5) * 0.008;
    const lngOffset = (Math.random() - 0.5) * 0.008;

    const newBathroom: BathroomListing = {
      id: 'shat-custom-' + Date.now(),
      title: title.trim() || 'Cozy Home Throne',
      tagline: 'Private home restroom hosted by you',
      hostName: 'You',
      hostAvatar:
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      hostBadge: 'SuperHost',
      address: address.trim() || `15 High Street, ${neighborhood || 'Center'}, ${currentCityName}`,
      neighborhood: neighborhood.trim() || 'Central',
      city: currentCityName as any,
      position: {
        lat: currentCityCenter.lat + latOffset,
        lng: currentCityCenter.lng + lngOffset,
      },
      weePrice,
      pooPrice,
      status: 'available',
      cleanlinessScore: 5.0,
      reviewCount: 1,
      paperPly,
      floorLevel,
      amenities,
      image: selectedImage,
      gallery: [selectedImage],
      description: description.trim(),
      doorCodeInstructions: doorInstructions.trim(),
      defaultDoorCode: doorCode.trim() || '1234',
      totalVisits: 0,
      recentReviews: [
        {
          id: 'rev-init',
          author: 'Shatnav Inspector',
          authorAvatar:
            'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
          date: 'Just now',
          type: 'wee',
          rating: 5,
          cleanlinessScore: 5,
          smellScore: 5,
          paperScore: paperPly >= 4 ? 5 : 4,
          comment: 'Facility verified and certified sparkling clean by Shatnav field standards.',
          verifiedVisit: true,
        },
      ],
    };

    onAddListing(newBathroom);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col text-slate-100">
        {/* Header */}
        <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🚽</span>
            <div>
              <h3 className="font-extrabold text-base text-white">List Your Home Bathroom</h3>
              <p className="text-xs text-slate-400">Join the Shatnav host community in {currentCityName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Title & Street Address */}
          <div className="space-y-3">
            <div>
              <label className="font-bold text-slate-300 block mb-1">Throne Title</label>
              <input
                type="text"
                required
                placeholder="e.g. The Marylebone Bidet & Botanical Ensuite"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-bold text-slate-300 block mb-1">Street Address</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 24 George St"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <label className="font-bold text-slate-300 block mb-1">Neighborhood</label>
                <input
                  type="text"
                  placeholder="e.g. Marylebone / Fitzrovia"
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          </div>

          {/* Pricing & Paper */}
          <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-800/60 border border-slate-700/80">
            <div>
              <label className="font-bold text-sky-400 block mb-1">💧 Wee Price</label>
              <div className="relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                <input
                  type="number"
                  step="0.25"
                  min="0.50"
                  max="5.00"
                  value={weePrice}
                  onChange={(e) => setWeePrice(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-6 pr-2 py-1.5 font-mono font-bold text-white focus:outline-none focus:border-sky-400"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-amber-400 block mb-1">💩 Poo Price</label>
              <div className="relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                <input
                  type="number"
                  step="0.25"
                  min="1.00"
                  max="10.00"
                  value={pooPrice}
                  onChange={(e) => setPooPrice(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-6 pr-2 py-1.5 font-mono font-bold text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-300 block mb-1">🧻 Paper Ply</label>
              <select
                value={paperPly}
                onChange={(e) => setPaperPly(Number(e.target.value) as 2 | 3 | 4)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-white focus:outline-none focus:border-amber-400"
              >
                <option value={2}>2-Ply Standard</option>
                <option value={3}>3-Ply Soft</option>
                <option value={4}>4-Ply Cloud Velvet</option>
              </select>
            </div>
          </div>

          {/* Photo Preset Picker */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-300 block">Select Bathroom Photo</label>
            <div className="grid grid-cols-5 gap-2">
              {BATHROOM_PRESET_IMAGES.map((img, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedImage(img)}
                  className={`h-14 rounded-lg overflow-hidden cursor-pointer border-2 transition ${
                    selectedImage === img
                      ? 'border-amber-400 scale-105 shadow-md'
                      : 'border-slate-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* Amenities Toggles */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-300 block">Facilities & Etiquette</label>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => toggleAmenity('bidet')}
                className={`p-2 rounded-lg border text-left flex items-center justify-between ${
                  amenities.bidet ? 'bg-sky-500/20 border-sky-400 text-sky-200' : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}
              >
                <span>Electronic Bidet / Washlet</span>
                <span>{amenities.bidet ? '✓' : ''}</span>
              </button>

              <button
                type="button"
                onClick={() => toggleAmenity('heatedSeat')}
                className={`p-2 rounded-lg border text-left flex items-center justify-between ${
                  amenities.heatedSeat ? 'bg-amber-500/20 border-amber-400 text-amber-200' : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}
              >
                <span>🔥 Heated Toilet Seat</span>
                <span>{amenities.heatedSeat ? '✓' : ''}</span>
              </button>

              <button
                type="button"
                onClick={() => toggleAmenity('stepFree')}
                className={`p-2 rounded-lg border text-left flex items-center justify-between ${
                  amenities.stepFree ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200' : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}
              >
                <span>♿ Step-Free Ground Floor</span>
                <span>{amenities.stepFree ? '✓' : ''}</span>
              </button>

              <button
                type="button"
                onClick={() => toggleAmenity('scentedCandles')}
                className={`p-2 rounded-lg border text-left flex items-center justify-between ${
                  amenities.scentedCandles ? 'bg-purple-500/20 border-purple-400 text-purple-200' : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}
              >
                <span>🕯️ Scented Candles</span>
                <span>{amenities.scentedCandles ? '✓' : ''}</span>
              </button>

              <button
                type="button"
                onClick={() => toggleAmenity('courtesyRadio')}
                className={`p-2 rounded-lg border text-left flex items-center justify-between ${
                  amenities.courtesyRadio ? 'bg-indigo-500/20 border-indigo-400 text-indigo-200' : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}
              >
                <span>📻 Courtesy Sound Radio</span>
                <span>{amenities.courtesyRadio ? '✓' : ''}</span>
              </button>

              <button
                type="button"
                onClick={() => toggleAmenity('privateEntrance')}
                className={`p-2 rounded-lg border text-left flex items-center justify-between ${
                  amenities.privateEntrance ? 'bg-amber-500/20 border-amber-400 text-amber-200' : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}
              >
                <span>🚪 Private Direct Entrance</span>
                <span>{amenities.privateEntrance ? '✓' : ''}</span>
              </button>
            </div>
          </div>

          {/* Access Instructions & PIN */}
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="font-bold text-slate-300 block mb-1">Smart Lock PIN</label>
              <input
                type="text"
                placeholder="4-digit code"
                value={doorCode}
                onChange={(e) => setDoorCode(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 font-mono font-bold text-emerald-400 focus:outline-none focus:border-amber-400"
              />
            </div>
            <div className="col-span-2">
              <label className="font-bold text-slate-300 block mb-1">Entry Instructions</label>
              <input
                type="text"
                placeholder="e.g. Ring buzzer 2B, door on 1st floor landing"
                value={doorInstructions}
                onChange={(e) => setDoorInstructions(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Submit button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-sm tracking-wide shadow-xl shadow-amber-500/25 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Publish Bathroom on Shatnav Map</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
