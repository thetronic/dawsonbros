/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { BathroomListing, ActiveBooking, FilterState, Review } from './types';
import { CITIES, INITIAL_BATHROOMS } from './data/bathrooms';
import { Navbar } from './components/Navbar';
import { FilterBar } from './components/FilterBar';
import { ShatMap } from './components/ShatMap';
import { ToiletCard } from './components/ToiletCard';
import { ToiletDetailModal } from './components/ToiletDetailModal';
import { BookingModal } from './components/BookingModal';
import { NavigationBanner } from './components/NavigationBanner';
import { ThroneModeModal } from './components/ThroneModeModal';
import { RatingModal } from './components/RatingModal';
import { HostPortal } from './components/HostPortal';
import { NewListingModal } from './components/NewListingModal';
import { soundManager } from './utils/audio';
import { AlertCircle, CheckCircle2, Droplets, MapPin, Sparkles, Navigation, X } from 'lucide-react';

const GOOGLE_MAPS_API_KEY =
  (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string) ||
  'AIzaSyAv_5VmNbvcg7IePvXCX6RkNZQLK4k3d4A';

export default function App() {
  // Cities & Location
  const [currentCityName, setCurrentCityName] = useState<string>('London');
  const currentCity = useMemo(() => {
    return CITIES.find((c) => c.name === currentCityName) || CITIES[0];
  }, [currentCityName]);

  // User simulated GPS location (slightly offset from city center)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number }>({
    lat: currentCity.center.lat + 0.0012,
    lng: currentCity.center.lng + 0.0009,
  });

  // When city changes, update user location
  useEffect(() => {
    setUserLocation({
      lat: currentCity.center.lat + 0.0012,
      lng: currentCity.center.lng + 0.0009,
    });
  }, [currentCity]);

  // Bathroom Listings
  const [bathrooms, setBathrooms] = useState<BathroomListing[]>(() => {
    const saved = localStorage.getItem('shatnav_bathrooms');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_BATHROOMS;
      }
    }
    return INITIAL_BATHROOMS;
  });

  useEffect(() => {
    localStorage.setItem('shatnav_bathrooms', JSON.stringify(bathrooms));
  }, [bathrooms]);

  // UI Modes & Modals
  const [isHostMode, setIsHostMode] = useState(false);
  const [selectedBathroom, setSelectedBathroom] = useState<BathroomListing | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingInitialType, setBookingInitialType] = useState<'wee' | 'poo'>('wee');
  const [isNewListingModalOpen, setIsNewListingModalOpen] = useState(false);

  // Active Session State
  const [activeBooking, setActiveBooking] = useState<ActiveBooking | null>(null);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [lastCompletedBooking, setLastCompletedBooking] = useState<ActiveBooking | null>(null);

  // Wallet
  const [walletBalance, setWalletBalance] = useState(14.50);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Filters
  const [filters, setFilters] = useState<FilterState>({
    serviceType: 'all',
    maxDistanceM: 2000,
    emergencyOnly: false,
    needBidet: false,
    stepFreeOnly: false,
    minCleanliness: 0,
    searchQuery: '',
  });

  // Filtered bathrooms for current city
  const filteredBathrooms = useMemo(() => {
    return bathrooms.filter((b) => {
      if (b.city !== currentCityName) return false;

      if (filters.needBidet && !b.amenities.bidet) return false;
      if (filters.stepFreeOnly && !b.amenities.stepFree) return false;
      if (filters.minCleanliness > 0 && b.cleanlinessScore < filters.minCleanliness) return false;

      if (filters.serviceType === 'wee' && b.weePrice > 1.50) return false;
      if (filters.serviceType === 'poo' && b.pooPrice > 2.50) return false;

      if (filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase();
        const matchesTitle = b.title.toLowerCase().includes(q);
        const matchesAddress = b.address.toLowerCase().includes(q);
        const matchesHost = b.hostName.toLowerCase().includes(q);
        const matchesNeighborhood = b.neighborhood.toLowerCase().includes(q);
        if (!matchesTitle && !matchesAddress && !matchesHost && !matchesNeighborhood) {
          return false;
        }
      }

      return true;
    });
  }, [bathrooms, currentCityName, filters]);

  // Emergency SOS Button: Find nearest available loo immediately!
  const handleEmergencySOS = () => {
    soundManager.playEmergencyPing();
    const available = filteredBathrooms.filter((b) => b.status === 'available');
    if (available.length === 0) {
      showToast('⚠️ No vacant throne found in immediate vicinity. Broadening search...');
      return;
    }

    // Pick closest (first in list)
    const closest = available[0];
    setSelectedBathroom(closest);
    setBookingInitialType('poo');
    setIsBookingModalOpen(true);
    showToast(`🚨 CODE RED: Nearest throne found (${closest.title})!`);
  };

  // Top up wallet
  const handleTopUpWallet = () => {
    soundManager.playChimeSound();
    setWalletBalance((prev) => prev + 10.00);
    showToast('💳 Added $10.00 to Shatnav Wallet!');
  };

  // Start booking flow
  const handleOpenBook = (bathroom: BathroomListing, type: 'wee' | 'poo' = 'wee') => {
    setSelectedBathroom(bathroom);
    setBookingInitialType(type);
    setIsBookingModalOpen(true);
  };

  // Confirm booking
  const handleConfirmBooking = (booking: ActiveBooking) => {
    setWalletBalance((prev) => Math.max(0, prev - booking.totalCost));
    setActiveBooking(booking);
    setIsBookingModalOpen(false);
    showToast(`🔓 Door code ${booking.doorCode} revealed! Follow walking directions.`);
  };

  // Cancel booking
  const handleCancelBooking = () => {
    if (activeBooking) {
      setWalletBalance((prev) => prev + activeBooking.totalCost);
      showToast('Refunded to your Shatnav Wallet.');
      setActiveBooking(null);
    }
  };

  // Arrive at door
  const handleArrived = () => {
    if (activeBooking) {
      setActiveBooking({
        ...activeBooking,
        status: 'in_throne',
      });
      showToast('🚪 Welcome inside! Throne Mode activated.');
    }
  };

  // Finish session & rate
  const handleFinishSession = () => {
    if (activeBooking) {
      setLastCompletedBooking(activeBooking);
      setActiveBooking(null);
      setIsRatingModalOpen(true);
    }
  };

  // Submit review & tip
  const handleSubmitReview = (review: Review, tipAmount: number) => {
    if (tipAmount > 0) {
      setWalletBalance((prev) => Math.max(0, prev - tipAmount));
      showToast(`⭐ Review submitted & $${tipAmount.toFixed(2)} tip sent to host!`);
    } else {
      showToast('⭐ Cleanliness rating submitted! Thank you.');
    }

    if (lastCompletedBooking) {
      setBathrooms((prev) =>
        prev.map((b) => {
          if (b.id === lastCompletedBooking.bathroomId) {
            const updatedReviews = [review, ...b.recentReviews];
            const newAverage =
              updatedReviews.reduce((sum, r) => sum + r.cleanlinessScore, 0) /
              updatedReviews.length;
            return {
              ...b,
              cleanlinessScore: Number(newAverage.toFixed(2)),
              reviewCount: b.reviewCount + 1,
              recentReviews: updatedReviews,
            };
          }
          return b;
        })
      );
    }

    setIsRatingModalOpen(false);
    setLastCompletedBooking(null);
  };

  // Host Mode: update listing status
  const handleUpdateListingStatus = (
    id: string,
    status: 'available' | 'in-use' | 'cleaning' | 'closed'
  ) => {
    setBathrooms((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status } : b))
    );
    showToast(`Status updated to ${status}.`);
  };

  // Host Mode: update pricing
  const handleUpdateListingPrices = (id: string, weePrice: number, pooPrice: number) => {
    setBathrooms((prev) =>
      prev.map((b) => (b.id === id ? { ...b, weePrice, pooPrice } : b))
    );
    showToast('Updated wee and poo tariffs!');
  };

  // Host Mode: add new listing
  const handleAddNewListing = (newListing: BathroomListing) => {
    setBathrooms((prev) => [newListing, ...prev]);
    setIsNewListingModalOpen(false);
    showToast(`🎉 "${newListing.title}" is now published on Shatnav!`);
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-950 font-['Plus_Jakarta_Sans']">
      {/* Top Navbar */}
      <Navbar
        currentCityName={currentCityName}
        onSelectCity={(name) => {
          setCurrentCityName(name);
          setSelectedBathroom(null);
        }}
        isHostMode={isHostMode}
        onToggleHostMode={() => setIsHostMode(!isHostMode)}
        onEmergencySOS={handleEmergencySOS}
        walletBalance={walletBalance}
        onTopUpWallet={handleTopUpWallet}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 border border-amber-400 text-amber-200 px-4 py-2.5 rounded-xl shadow-2xl text-xs font-bold flex items-center gap-2 backdrop-blur-md animate-fade-in">
          <Sparkles className="w-4 h-4 text-amber-400 animate-spin-slow" />
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="ml-2 text-slate-400 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main View Area */}
      {isHostMode ? (
        /* Host Management Portal */
        <div className="flex-1 overflow-y-auto bg-slate-900/95">
          <HostPortal
            myListings={bathrooms}
            onOpenNewListingModal={() => setIsNewListingModalOpen(true)}
            onUpdateListingStatus={handleUpdateListingStatus}
            onUpdateListingPrices={handleUpdateListingPrices}
            onClose={() => setIsHostMode(false)}
          />
        </div>
      ) : (
        /* Guest Explorer & Map View */
        <div className="flex-1 flex flex-col relative overflow-hidden">
          {/* Quick Filter Bar */}
          <FilterBar
            filters={filters}
            onChangeFilters={setFilters}
            totalAvailable={filteredBathrooms.filter((b) => b.status === 'available').length}
          />

          {/* Interactive Google Map */}
          <div className="flex-1 relative w-full h-full">
            <ShatMap
              apiKey={GOOGLE_MAPS_API_KEY}
              center={currentCity.center}
              zoom={currentCity.zoom}
              bathrooms={filteredBathrooms}
              selectedBathroom={selectedBathroom}
              onSelectBathroom={(b) => setSelectedBathroom(b)}
              userLocation={userLocation}
              isNavigating={activeBooking?.status === 'navigating'}
            />

            {/* Selected Bathroom Preview Card */}
            {selectedBathroom && !activeBooking && (
              <ToiletCard
                bathroom={selectedBathroom}
                onClose={() => setSelectedBathroom(null)}
                onBook={handleOpenBook}
                onOpenDetails={() => setIsDetailModalOpen(true)}
              />
            )}
          </div>
        </div>
      )}

      {/* Active Navigation HUD (When Guest is walking to the bathroom) */}
      {activeBooking && activeBooking.status === 'navigating' && (
        <NavigationBanner
          booking={activeBooking}
          onArrived={handleArrived}
          onCancel={handleCancelBooking}
        />
      )}

      {/* Active Throne Mode (When Guest is in the bathroom) */}
      {activeBooking && activeBooking.status === 'in_throne' && (
        <ThroneModeModal
          booking={activeBooking}
          onFinishSession={handleFinishSession}
        />
      )}

      {/* Bathroom Details & Full Review Scorecard Modal */}
      {isDetailModalOpen && selectedBathroom && (
        <ToiletDetailModal
          bathroom={selectedBathroom}
          onClose={() => setIsDetailModalOpen(false)}
          onBook={handleOpenBook}
        />
      )}

      {/* Booking Checkout Modal */}
      {isBookingModalOpen && selectedBathroom && (
        <BookingModal
          bathroom={selectedBathroom}
          initialType={bookingInitialType}
          walletBalance={walletBalance}
          onClose={() => setIsBookingModalOpen(false)}
          onConfirmBooking={handleConfirmBooking}
        />
      )}

      {/* Cleanliness Rating & Host Tip Modal */}
      {isRatingModalOpen && lastCompletedBooking && (
        <RatingModal
          booking={lastCompletedBooking}
          onSubmitReview={handleSubmitReview}
          onClose={() => {
            setIsRatingModalOpen(false);
            setLastCompletedBooking(null);
          }}
        />
      )}

      {/* Create New Bathroom Listing Modal */}
      {isNewListingModalOpen && (
        <NewListingModal
          currentCityName={currentCityName}
          currentCityCenter={currentCity.center}
          onClose={() => setIsNewListingModalOpen(false)}
          onAddListing={handleAddNewListing}
        />
      )}
    </div>
  );
}
