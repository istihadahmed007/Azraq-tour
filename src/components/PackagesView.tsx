import React from 'react';
import { usePackages } from '../context/PackageContext';
import { PackageCard } from './PackageCard';
import { PackageDetailModal } from './PackageDetailModal';
import { PackageQuotationModal } from './PackageQuotationModal';
import {
  Search,
  Filter,
  MapPin,
  Calendar,
  Sparkles,
  FileText,
  DollarSign,
  Compass,
  RefreshCw,
} from 'lucide-react';

export const PackagesView: React.FC = () => {
  const {
    destinations,
    allCountries,
    searchQuery,
    setSearchQuery,
    selectedCountry,
    setSelectedCountry,
    selectedDestinationId,
    setSelectedDestinationId,
    selectedDuration,
    setSelectedDuration,
    maxPriceFilter,
    setMaxPriceFilter,
    filteredPackages,
    activePackageModal,
    setActivePackageModal,
    activeQuotationModal,
    setActiveQuotationModal,
    clearAllPackages,
  } = usePackages();

  return (
    <div className="w-full min-h-screen pb-20 pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-fadeIn">
      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-sky-950 via-slate-900 to-slate-950 border border-sky-500/30 shadow-2xl p-6 sm:p-10">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30 text-xs font-bold uppercase tracking-wider">
            <FileText className="w-4 h-4 text-sky-400" />
            Verified Agency PDF Packages
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Explore Curated <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-emerald-400">Tour Packages</span>
          </h1>

          <p className="text-sm sm:text-base text-sky-100/80 leading-relaxed">
            Browse verified travel itineraries, pricing tiers, and complete day-by-day tour programs extracted directly from official agency PDF documents.
          </p>

          {/* Quick Metrics Badge */}
          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-300">
            <span className="flex items-center gap-1.5 bg-slate-900/80 px-3.5 py-1.5 rounded-xl border border-sky-400/40 text-emerald-400 font-extrabold text-sm">
              <Compass className="w-4 h-4 text-sky-400" />
              {filteredPackages.length} Tour Packages Available
            </span>
            <span className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-700/80">
              <MapPin className="w-4 h-4 text-emerald-400" />
              {destinations.length} Active Destination(s)
            </span>
          </div>
        </div>

        {/* Ambient Glow background */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Filter and Search Control Bar */}
      <div className="bg-slate-900/80 backdrop-blur-md p-5 rounded-2xl border border-sky-500/20 shadow-xl space-y-4">
        {/* Search Input */}
        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-sky-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by package name, destination, country, or hotel..."
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-800/90 border border-slate-700 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-sky-400 transition-colors shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>

        {/* Selectors Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-3 border-t border-slate-800">
          {/* Country Filter */}
          <div>
            <label className="block text-xs font-bold text-sky-300 uppercase tracking-wider mb-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              Country
            </label>
            <select
              value={selectedCountry}
              onChange={(e) => {
                setSelectedCountry(e.target.value);
                setSelectedDestinationId('All');
              }}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-base font-semibold focus:outline-none focus:border-sky-400 cursor-pointer"
            >
              <option value="All">All Countries ({allCountries.length})</option>
              {allCountries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>

          {/* Destination Filter */}
          <div>
            <label className="block text-[11px] font-bold text-sky-300 uppercase tracking-wider mb-1 flex items-center gap-1">
              <Compass className="w-3.5 h-3.5" />
              Destination
            </label>
            <select
              value={selectedDestinationId}
              onChange={(e) => setSelectedDestinationId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-semibold focus:outline-none focus:border-sky-400 cursor-pointer"
            >
              <option value="All">All Destinations ({destinations.length})</option>
              {destinations
                .filter((d) => selectedCountry === 'All' || d.country === selectedCountry)
                .map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.packageCount} pkg)
                  </option>
                ))}
            </select>
          </div>

          {/* Duration Filter */}
          <div>
            <label className="block text-[11px] font-bold text-sky-300 uppercase tracking-wider mb-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              Duration
            </label>
            <select
              value={selectedDuration}
              onChange={(e) => setSelectedDuration(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-semibold focus:outline-none focus:border-sky-400 cursor-pointer"
            >
              <option value="All">All Durations</option>
              <option value="Short (1-3 Days)">Short (1-3 Days)</option>
              <option value="Medium (4-6 Days)">Medium (4-6 Days)</option>
              <option value="Long (7+ Days)">Long (7+ Days)</option>
            </select>
          </div>

          {/* Price Range Slider */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-[11px] font-bold text-sky-300 uppercase tracking-wider flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5" />
                Max Price
              </label>
              <span className="text-xs font-mono font-extrabold text-emerald-400">
                ৳ {maxPriceFilter.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min={2000}
              max={100000}
              step={1000}
              value={maxPriceFilter}
              onChange={(e) => setMaxPriceFilter(Number(e.target.value))}
              className="w-full accent-sky-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Active Filters Pill Bar */}
        {(selectedCountry !== 'All' ||
          selectedDestinationId !== 'All' ||
          selectedDuration !== 'All' ||
          searchQuery !== '' ||
          maxPriceFilter < 100000) && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80">
            <span className="text-[11px] font-bold text-slate-400">Active Filters:</span>
            {selectedCountry !== 'All' && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                Country: {selectedCountry}
              </span>
            )}
            {selectedDestinationId !== 'All' && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                Destination: {destinations.find((d) => d.id === selectedDestinationId)?.name || selectedDestinationId}
              </span>
            )}
            {selectedDuration !== 'All' && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                Duration: {selectedDuration}
              </span>
            )}
            {maxPriceFilter < 100000 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Under ৳ {maxPriceFilter.toLocaleString()}
              </span>
            )}
            <button
              onClick={() => {
                setSelectedCountry('All');
                setSelectedDestinationId('All');
                setSelectedDuration('All');
                setMaxPriceFilter(100000);
                setSearchQuery('');
              }}
              className="px-2.5 py-0.5 rounded-full text-xs font-bold text-rose-300 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Featured Destinations Row */}
      {destinations.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
              <Compass className="w-5 h-5 text-sky-400" />
              PDF Verified Destinations ({destinations.length})
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {destinations.map((dest) => {
              const isSelected = selectedDestinationId === dest.id;
              return (
                <button
                  key={dest.id}
                  onClick={() => {
                    if (isSelected) {
                      setSelectedDestinationId('All');
                    } else {
                      setSelectedDestinationId(dest.id);
                      setSelectedCountry(dest.country);
                    }
                  }}
                  className={`relative rounded-2xl overflow-hidden h-28 border text-left group transition-all cursor-pointer ${
                    isSelected
                      ? 'border-sky-400 ring-2 ring-sky-400/50 shadow-lg scale-105'
                      : 'border-slate-800 hover:border-sky-500/40 hover:scale-102'
                  }`}
                >
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                  <div className="absolute bottom-2 left-2 right-2">
                    <p className="text-xs font-bold text-white truncate">{dest.name}</p>
                    <p className="text-[10px] text-sky-300 font-medium">{dest.country}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Tour Packages Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-sky-400" />
            Tour Packages List ({filteredPackages.length})
          </h2>
        </div>

        {filteredPackages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPackages.map((pkg) => (
              <PackageCard
                key={pkg.id}
                pkg={pkg}
                onViewDetails={setActivePackageModal}
                onRequestQuote={setActiveQuotationModal}
              />
            ))}
          </div>
        ) : (
          <div className="bg-slate-900/60 rounded-3xl border border-slate-800 p-12 text-center space-y-4 max-w-xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-3xl mx-auto">
              🌴
            </div>
            <h3 className="text-lg font-bold text-white">No Tour Packages Found</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              No tour packages matched your selected search criteria or price filters. Try resetting your search filters or browse all destinations.
            </p>
            <button
              onClick={() => {
                setSelectedCountry('All');
                setSelectedDestinationId('All');
                setSelectedDuration('All');
                setMaxPriceFilter(100000);
                setSearchQuery('');
              }}
              className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition-all shadow-md cursor-pointer"
            >
              Show All Packages
            </button>
          </div>
        )}
      </div>

      {/* Active Modals */}
      <PackageDetailModal
        pkg={activePackageModal}
        onClose={() => setActivePackageModal(null)}
        onRequestQuote={setActiveQuotationModal}
      />

      <PackageQuotationModal
        pkg={activeQuotationModal}
        onClose={() => setActiveQuotationModal(null)}
      />
    </div>
  );
};
