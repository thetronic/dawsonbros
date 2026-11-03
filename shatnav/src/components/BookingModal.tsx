import React, { useState } from 'react';
import { BathroomListing, ActiveBooking } from '../types';
import {
  X,
  Droplets,
  Check,
  ShieldCheck,
  Sparkles,
  Wallet,
  CreditCard,
  Lock,
  ArrowRight,
  Flame,
  Wind,
} from 'lucide-react';
import { soundManager } from '../utils/audio';

interface BookingModalProps {
  bathroom: BathroomListing;
  initialType?: 'wee' | 'poo';
  onClose: () => void;
  walletBalance: number;
  onConfirmBooking: (booking: ActiveBooking) => void;
}

interface AddonOption {
  id: string;
  name: string;
  price: number;
  icon: string;
  description: string;
}

const AVAILABLE_ADDONS: AddonOption[] = [
  {
    id: 'ply4',
    name: '4-Ply Cloud Bamboo Roll',
    price: 0.50,
    icon: '🧻',
    description: 'Guaranteed fresh roll of 4-ply ultra-soft quilted paper',
  },
  {
    id: 'bidet',
    name: 'Pre-Warmed Bidet Washlet',
    price: 0.75,
    icon: '🌊',
    description: 'Oscillating warm stream & heated air dry cycle',
  },
  {
    id: 'candle',
    name: 'Fresh Lavender Candle Strike',
    price: 0.50,
    icon: '🕯️',
    description: 'Host lights scented candle right before your arrival',
  },
  {
    id: 'lotion',
    name: 'Luxury Botanical Hand Balm',
    price: 0.50,
    icon: '🧴',
    description: 'Aesop Geranium Leaf hydrating hand cream pump',
  },
];

export const BookingModal: React.FC<BookingModalProps> = ({
  bathroom,
  initialType = 'wee',
  onClose,
  walletBalance,
  onConfirmBooking,
}) => {
  const [serviceType, setServiceType] = useState<'wee' | 'poo' | 'combo'>(
    initialType === 'poo' ? 'poo' : 'wee'
  );
  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'card'>('wallet');
  const [isProcessing, setIsProcessing] = useState(false);

  // Calculate base price
  const baseCost =
    serviceType === 'wee'
      ? bathroom.weePrice
      : serviceType === 'poo'
      ? bathroom.pooPrice
      : 2.50; // Royal Flush Combo

  const allocatedMinutes = serviceType === 'wee' ? 7 : serviceType === 'poo' ? 20 : 25;

  // Calculate add-on cost
  const selectedAddons = AVAILABLE_ADDONS.filter((a) => selectedAddonIds.includes(a.id));
  const addonsTotal = selectedAddons.reduce((sum, a) => sum + a.price, 0);
  const totalCost = baseCost + addonsTotal;

  const toggleAddon = (id: string) => {
    setSelectedAddonIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleCheckout = () => {
    setIsProcessing(true);
    soundManager.playDoorUnlockSound();

    setTimeout(() => {
      soundManager.playChimeSound();
      const newBooking: ActiveBooking = {
        id: 'book-' + Date.now(),
        bathroomId: bathroom.id,
        bathroomTitle: bathroom.title,
        hostName: bathroom.hostName,
        address: bathroom.address,
        serviceType,
        baseCost,
        selectedAddons: selectedAddons.map((a) => ({ name: a.name, price: a.price })),
        totalCost,
        status: 'navigating',
        startTime: Date.now(),
        allocatedMinutes,
        doorCode: bathroom.defaultDoorCode,
        doorInstructions: bathroom.doorCodeInstructions,
        courtesyFlushes: 0,
        intercomMessages: [
          {
            sender: 'host',
            text: `Hi! Cleaned the seat 5 mins ago. Code is ${bathroom.defaultDoorCode}. Door is unlocked!`,
            time: 'Just now',
          },
        ],
      };

      onConfirmBooking(newBooking);
      setIsProcessing(false);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 bg-slate-900/90 sticky top-0 z-10 backdrop-blur-sm">
          <div>
            <h3 className="font-extrabold text-base text-white">Book Bathroom Access</h3>
            <p className="text-xs text-slate-400">At {bathroom.title}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-5 overflow-y-auto space-y-5">
          {/* Service Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Step 1: Choose Your Session Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              {/* Wee */}
              <button
                type="button"
                onClick={() => setServiceType('wee')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  serviceType === 'wee'
                    ? 'bg-sky-500/15 border-sky-400 text-white ring-2 ring-sky-400/30'
                    : 'bg-slate-800/80 border-slate-700 hover:border-slate-600 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Droplets className="w-4 h-4 text-sky-400" />
                  <span className="font-mono font-black text-sm text-sky-400">
                    ${bathroom.weePrice.toFixed(2)}
                  </span>
                </div>
                <div className="font-bold text-xs text-white mt-1.5">The Wee</div>
                <div className="text-[10px] text-slate-400">7 mins slot</div>
              </button>

              {/* Poo */}
              <button
                type="button"
                onClick={() => setServiceType('poo')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  serviceType === 'poo'
                    ? 'bg-amber-500/20 border-amber-400 text-white ring-2 ring-amber-400/40'
                    : 'bg-slate-800/80 border-slate-700 hover:border-slate-600 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-base">💩</span>
                  <span className="font-mono font-black text-sm text-amber-400">
                    ${bathroom.pooPrice.toFixed(2)}
                  </span>
                </div>
                <div className="font-bold text-xs text-white mt-1.5">The Poo</div>
                <div className="text-[10px] text-slate-400">20 mins + Radio</div>
              </button>

              {/* Royal Combo */}
              <button
                type="button"
                onClick={() => setServiceType('combo')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  serviceType === 'combo'
                    ? 'bg-purple-500/20 border-purple-400 text-white ring-2 ring-purple-400/40'
                    : 'bg-slate-800/80 border-slate-700 hover:border-slate-600 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-base">👑</span>
                  <span className="font-mono font-black text-sm text-purple-400">$2.50</span>
                </div>
                <div className="font-bold text-xs text-white mt-1.5">Royal Combo</div>
                <div className="text-[10px] text-slate-400">25m + Mist</div>
              </button>
            </div>
          </div>

          {/* Optional VIP Upgrades */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Step 2: Comfort & Hygiene Add-Ons
              </label>
              <span className="text-[11px] text-amber-400 font-medium">Optional luxury</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {AVAILABLE_ADDONS.map((addon) => {
                const isSelected = selectedAddonIds.includes(addon.id);
                return (
                  <button
                    key={addon.id}
                    type="button"
                    onClick={() => toggleAddon(addon.id)}
                    className={`flex items-start gap-2.5 p-2.5 rounded-xl border text-left transition ${
                      isSelected
                        ? 'bg-amber-400/10 border-amber-400/70 text-white'
                        : 'bg-slate-800/60 border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <span className="text-xl">{addon.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-200">{addon.name}</span>
                        <span className="font-mono text-xs font-bold text-amber-400">
                          +${addon.price.toFixed(2)}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 line-clamp-1">{addon.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Step 3: Select Payment
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('wallet')}
                className={`flex items-center gap-2 p-2.5 rounded-xl border transition ${
                  paymentMethod === 'wallet'
                    ? 'bg-emerald-500/15 border-emerald-400 text-white'
                    : 'bg-slate-800/80 border-slate-700 text-slate-400'
                }`}
              >
                <Wallet className="w-4 h-4 text-emerald-400" />
                <div className="text-left">
                  <span className="font-bold text-xs text-slate-200 block">Shatnav Wallet</span>
                  <span className="text-[10px] text-emerald-400 font-mono">
                    ${walletBalance.toFixed(2)} available
                  </span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`flex items-center gap-2 p-2.5 rounded-xl border transition ${
                  paymentMethod === 'card'
                    ? 'bg-amber-500/15 border-amber-400 text-white'
                    : 'bg-slate-800/80 border-slate-700 text-slate-400'
                }`}
              >
                <CreditCard className="w-4 h-4 text-amber-400" />
                <div className="text-left">
                  <span className="font-bold text-xs text-slate-200 block">Apple / Card Pay</span>
                  <span className="text-[10px] text-slate-400">Instant 1-Tap</span>
                </div>
              </button>
            </div>
          </div>

          {/* Cost Summary Box */}
          <div className="p-3.5 rounded-xl bg-slate-800/90 border border-slate-700/80 space-y-1.5 text-xs">
            <div className="flex items-center justify-between text-slate-400">
              <span>
                {serviceType === 'wee' ? 'Wee Session (7 min)' : serviceType === 'poo' ? 'Poo Session (20 min)' : 'Royal Combo (25 min)'}
              </span>
              <span className="font-mono text-slate-200">${baseCost.toFixed(2)}</span>
            </div>

            {selectedAddons.map((addon) => (
              <div key={addon.id} className="flex items-center justify-between text-slate-400">
                <span>{addon.name}</span>
                <span className="font-mono text-slate-200">+${addon.price.toFixed(2)}</span>
              </div>
            ))}

            <div className="pt-2 border-t border-slate-700 flex items-center justify-between font-bold text-sm text-white">
              <span>Total Payable</span>
              <span className="font-mono text-lg text-amber-400 font-black">
                ${totalCost.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Checkout Button */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 sticky bottom-0 z-10">
          <button
            disabled={isProcessing}
            onClick={handleCheckout}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-sm tracking-wide shadow-xl shadow-amber-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isProcessing ? (
              <span>Unlocking Contactless PIN...</span>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>Pay ${totalCost.toFixed(2)} & Start Walking Directions</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
