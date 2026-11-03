import React, { useEffect } from 'react';
import { APIProvider, Map, AdvancedMarker, useMap } from '@vis.gl/react-google-maps';
import { BathroomListing } from '../types';
import { Droplets, Navigation, Sparkles } from 'lucide-react';

interface ShatMapProps {
  apiKey: string;
  center: { lat: number; lng: number };
  zoom: number;
  bathrooms: BathroomListing[];
  selectedBathroom: BathroomListing | null;
  onSelectBathroom: (bathroom: BathroomListing) => void;
  userLocation: { lat: number; lng: number };
  isNavigating: boolean;
}

// Controller component to smoothly pan/zoom when center or selected bathroom changes
const MapController: React.FC<{
  targetCenter: { lat: number; lng: number };
  targetZoom?: number;
}> = ({ targetCenter, targetZoom }) => {
  const map = useMap();

  useEffect(() => {
    if (map && targetCenter) {
      map.panTo(targetCenter);
      if (targetZoom) {
        map.setZoom(targetZoom);
      }
    }
  }, [map, targetCenter.lat, targetCenter.lng, targetZoom]);

  return null;
};

export const ShatMap: React.FC<ShatMapProps> = ({
  apiKey,
  center,
  zoom,
  bathrooms,
  selectedBathroom,
  onSelectBathroom,
  userLocation,
  isNavigating,
}) => {
  const mapCenter = selectedBathroom ? selectedBathroom.position : center;

  return (
    <div className="relative w-full h-full min-h-[400px] overflow-hidden bg-slate-950">
      <APIProvider apiKey={apiKey} libraries={['marker']}>
        <Map
          mapId="DEMO_MAP_ID"
          internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
          defaultCenter={center}
          defaultZoom={zoom}
          gestureHandling="greedy"
          disableDefaultUI={false}
          className="w-full h-full"
        >
          <MapController targetCenter={mapCenter} targetZoom={selectedBathroom ? 17 : zoom} />

          {/* User Location Marker */}
          <AdvancedMarker position={userLocation} title="Your Location">
            <div className="relative flex items-center justify-center">
              <span className="absolute w-8 h-8 rounded-full bg-blue-500/30 animate-ping" />
              <div className="w-5 h-5 rounded-full bg-blue-600 border-2 border-white shadow-lg flex items-center justify-center text-white">
                <Navigation className="w-2.5 h-2.5 -rotate-45" />
              </div>
            </div>
          </AdvancedMarker>

          {/* Bathroom Markers */}
          {bathrooms.map((toilet) => {
            const isSelected = selectedBathroom?.id === toilet.id;
            const isAvailable = toilet.status === 'available';
            const isInUse = toilet.status === 'in-use';

            return (
              <AdvancedMarker
                key={toilet.id}
                position={toilet.position}
                title={`${toilet.title} - $${toilet.weePrice} wee / $${toilet.pooPrice} poo`}
                onClick={() => onSelectBathroom(toilet)}
                zIndex={isSelected ? 50 : isAvailable ? 20 : 10}
              >
                <div
                  className={`group relative flex flex-col items-center cursor-pointer transition-transform duration-200 select-none ${
                    isSelected ? 'scale-110 -translate-y-2' : 'hover:scale-105'
                  }`}
                >
                  {/* Floating Price Pill */}
                  <div
                    className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-extrabold shadow-md border ${
                      isSelected
                        ? 'bg-amber-400 text-slate-950 border-amber-300 ring-2 ring-amber-400/50'
                        : isAvailable
                        ? 'bg-slate-900 text-white border-emerald-500/70'
                        : 'bg-slate-800 text-slate-300 border-amber-500/70'
                    }`}
                  >
                    <span className="text-[10px]">🚽</span>
                    <span className="text-emerald-400 font-mono">${toilet.weePrice.toFixed(0)}</span>
                    <span className="text-slate-400 text-[9px]">/</span>
                    <span className="text-amber-400 font-mono">${toilet.pooPrice.toFixed(0)}</span>
                  </div>

                  {/* Pin Pointer with Live Status Dot */}
                  <div className="relative -mt-0.5 flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg border-2 ${
                        isSelected
                          ? 'bg-amber-500 border-white text-slate-950'
                          : isAvailable
                          ? 'bg-emerald-600 border-emerald-300 text-white'
                          : isInUse
                          ? 'bg-amber-600 border-amber-300 text-white'
                          : 'bg-slate-700 border-slate-500 text-slate-300'
                      }`}
                    >
                      {toilet.amenities.bidet ? (
                        <Droplets className="w-4 h-4" />
                      ) : (
                        <span className="text-xs font-black">WC</span>
                      )}
                    </div>
                    {/* Downward triangle pointer */}
                    <div
                      className={`w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] -mt-0.5 ${
                        isSelected
                          ? 'border-t-amber-500'
                          : isAvailable
                          ? 'border-t-emerald-600'
                          : 'border-t-amber-600'
                      }`}
                    />
                  </div>

                  {/* Cleanliness Micro-Badge */}
                  <div className="absolute -top-1.5 -right-2 bg-slate-950/90 text-amber-300 px-1 py-0.2 rounded text-[9px] font-bold border border-slate-700 shadow-sm flex items-center gap-0.5">
                    <Sparkles className="w-2 h-2 text-amber-400" />
                    <span>{toilet.cleanlinessScore}</span>
                  </div>
                </div>
              </AdvancedMarker>
            );
          })}
        </Map>
      </APIProvider>

      {/* Map Legend Overlay */}
      <div className="absolute bottom-4 left-4 z-10 bg-slate-900/90 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-800 text-[11px] text-slate-300 shadow-xl hidden sm:flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
          <span>Vacant & Sanitized</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
          <span>Occupied (Short Queue)</span>
        </div>
        <div className="flex items-center gap-1.5 font-semibold text-amber-300">
          <span>💧 $1 Wee</span>
          <span className="text-slate-500">•</span>
          <span>💩 $2 Poo</span>
        </div>
      </div>
    </div>
  );
};
