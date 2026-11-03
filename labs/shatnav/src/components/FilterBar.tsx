import React from 'react';
import { FilterState } from '../types';
import { Search, Droplets, Sparkles, Accessibility, Flame, Wind, SlidersHorizontal } from 'lucide-react';

interface FilterBarProps {
  filters: FilterState;
  onChangeFilters: (filters: FilterState) => void;
  totalAvailable: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onChangeFilters,
  totalAvailable,
}) => {
  return (
    <div className="bg-slate-900/90 border-b border-slate-800 px-4 py-2.5 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2.5">
        {/* Left: Search & Service Type Toggle */}
        <div className="flex items-center gap-2 w-full md:w-auto flex-wrap">
          {/* Quick Search */}
          <div className="relative flex-1 md:w-60">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search street, area or host..."
              value={filters.searchQuery}
              onChange={(e) => onChangeFilters({ ...filters, searchQuery: e.target.value })}
              className="w-full bg-slate-800/90 border border-slate-700/80 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* $1 Wee vs $2 Poo Quick Selector */}
          <div className="inline-flex rounded-xl bg-slate-800/90 p-0.5 border border-slate-700/80 text-xs font-semibold">
            <button
              onClick={() => onChangeFilters({ ...filters, serviceType: 'all' })}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                filters.serviceType === 'all'
                  ? 'bg-slate-700 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All Thrones
            </button>
            <button
              onClick={() => onChangeFilters({ ...filters, serviceType: 'wee' })}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all ${
                filters.serviceType === 'wee'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-amber-300'
              }`}
            >
              <Droplets className="w-3 h-3" />
              <span>$1 Wee</span>
            </button>
            <button
              onClick={() => onChangeFilters({ ...filters, serviceType: 'poo' })}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all ${
                filters.serviceType === 'poo'
                  ? 'bg-amber-600 text-white font-bold shadow-sm'
                  : 'text-slate-400 hover:text-amber-300'
              }`}
            >
              <span>💩</span>
              <span>$2 Poo</span>
            </button>
          </div>
        </div>

        {/* Right: Amenity Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none text-xs">
          {/* Bidet chip */}
          <button
            onClick={() => onChangeFilters({ ...filters, needBidet: !filters.needBidet })}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border whitespace-nowrap transition-all ${
              filters.needBidet
                ? 'bg-sky-500/20 text-sky-300 border-sky-500/50'
                : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:border-slate-600'
            }`}
          >
            <Wind className="w-3 h-3 text-sky-400" />
            <span>Heated Bidet</span>
          </button>

          {/* Step-Free / Accessible */}
          <button
            onClick={() => onChangeFilters({ ...filters, stepFreeOnly: !filters.stepFreeOnly })}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border whitespace-nowrap transition-all ${
              filters.stepFreeOnly
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:border-slate-600'
            }`}
          >
            <Accessibility className="w-3 h-3 text-emerald-400" />
            <span>Step-Free Ground Floor</span>
          </button>

          {/* 4.8+ Rating */}
          <button
            onClick={() =>
              onChangeFilters({
                ...filters,
                minCleanliness: filters.minCleanliness >= 4.8 ? 0 : 4.8,
              })
            }
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border whitespace-nowrap transition-all ${
              filters.minCleanliness >= 4.8
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:border-slate-600'
            }`}
          >
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>⭐ 4.8+ Pristine Clean</span>
          </button>

          {/* Reset Filters button if active */}
          {(filters.needBidet || filters.stepFreeOnly || filters.minCleanliness > 0 || filters.serviceType !== 'all' || filters.searchQuery) && (
            <button
              onClick={() =>
                onChangeFilters({
                  serviceType: 'all',
                  maxDistanceM: 2000,
                  emergencyOnly: false,
                  needBidet: false,
                  stepFreeOnly: false,
                  minCleanliness: 0,
                  searchQuery: '',
                })
              }
              className="text-slate-400 hover:text-slate-200 underline text-[11px] px-1 whitespace-nowrap"
            >
              Reset
            </button>
          )}

          <span className="text-[11px] text-slate-400 font-medium ml-auto md:ml-2 whitespace-nowrap">
            <span className="text-emerald-400 font-bold">{totalAvailable}</span> thrones available
          </span>
        </div>
      </div>
    </div>
  );
};
