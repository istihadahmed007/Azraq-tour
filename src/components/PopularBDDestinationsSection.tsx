import React, { useState, useMemo } from 'react';
import { Destination } from '../types';
import { POPULAR_BANGLADESHI_DESTINATIONS } from '../data/popularBangladeshiDestinations';
import { VisaQuoteModal } from './VisaQuoteModal';
import { FlightQuoteModal } from './FlightQuoteModal';
import { useAuth } from '../context/AuthContext';

interface PopularBDDestinationsSectionProps {
  onSelectDestination: (destination: Destination) => void;
  onPlanTripPrompt?: (promptText: string) => void;
}

export const PopularBDDestinationsSection: React.FC<PopularBDDestinationsSectionProps> = ({
  onSelectDestination,
  onPlanTripPrompt,
}) => {
  const { requireAuth } = useAuth();
  
  // State for search and filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedCountry, setSelectedCountry] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  
  // State for sub-modals (Visa and Flight quote directly from card)
  const [visaModalCountry, setVisaModalCountry] = useState<string | null>(null);
  const [flightModalDest, setFlightModalDest] = useState<string | null>(null);

  // Top 6 featured spotlight destinations
  const featuredIds = ['kuala-lumpur-malaysia', 'bangkok-thailand', 'maldives-island', 'dubai-uae', 'singapore-city', 'bali-indonesia'];
  const featuredDestinations = useMemo(() => {
    return POPULAR_BANGLADESHI_DESTINATIONS.filter(d => featuredIds.includes(d.id));
  }, []);

  // Categories list
  const categories = ['All', 'Beach', 'City', 'Culture', 'Nature', 'Shopping', 'Honeymoon', 'Family', 'Adventure'];

  // Extract unique countries
  const countries = useMemo(() => {
    const set = new Set<string>();
    POPULAR_BANGLADESHI_DESTINATIONS.forEach(d => {
      if (d.country) set.add(d.country);
    });
    return ['All', ...Array.from(set).sort()];
  }, []);

  // Filtered list of 30 destinations
  const filteredDestinations = useMemo(() => {
    return POPULAR_BANGLADESHI_DESTINATIONS.filter((d) => {
      const matchesCategory = selectedCategory === 'All' || d.category === selectedCategory;
      const matchesCountry = selectedCountry === 'All' || d.country === selectedCountry;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        d.name.toLowerCase().includes(q) ||
        d.country.toLowerCase().includes(q) ||
        (d.cityRegion && d.cityRegion.toLowerCase().includes(q)) ||
        d.description.toLowerCase().includes(q) ||
        (d.popularAttractions && d.popularAttractions.some((a) => a.toLowerCase().includes(q))) ||
        (d.thingsToDo && d.thingsToDo.some((a) => a.toLowerCase().includes(q)));

      return matchesCategory && matchesCountry && matchesSearch;
    });
  }, [selectedCategory, selectedCountry, searchQuery]);

  const handleOpenVisaQuote = (countryName: string) => {
    requireAuth(
      { type: 'submit_quote', label: `Visa quote for ${countryName}` },
      () => setVisaModalCountry(countryName)
    );
  };

  const handleOpenFlightQuote = (destName: string, countryName: string) => {
    requireAuth(
      { type: 'submit_quote', label: `Flight quote for ${destName}` },
      () => setFlightModalDest(`${destName}, ${countryName}`)
    );
  };

  return (
    <section className="w-full flex flex-col gap-10 my-8">
      {/* Section Header */}
      <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-500/10 border border-sky-400/30 text-sky-300 text-xs font-bold tracking-wide uppercase shadow-inner">
          <span className="material-symbols-outlined text-sm text-sky-400">verified</span>
          <span>Azraq Tours & Travels Exclusive</span>
        </div>

        <h2 className="font-serif-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
          Popular Destinations for <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-sky-400 to-blue-500">Bangladeshi Travelers</span>
        </h2>

        <p className="text-sm md:text-base text-slate-300/90 leading-relaxed max-w-2xl">
          Discover the places Bangladeshi travelers love to explore. Find travel information, visa guidance and flight quotation options in one place.
        </p>
      </div>

      {/* Featured Spotlight Grid (Top 6 Popular Choice Cards) */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">🔥</span>
            <h3 className="text-lg md:text-xl font-bold font-serif-display text-white">
              Top Rated Favorites
            </h3>
          </div>
          <span className="text-xs text-sky-300 font-medium">6 Most Booked Destinations</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredDestinations.map((dest) => (
            <div
              key={`featured-${dest.id}`}
              className="glass-card rounded-3xl overflow-hidden border border-white/20 hover:border-sky-400/50 transition-all duration-300 shadow-xl hover:shadow-sky-500/10 group flex flex-col justify-between"
            >
              <div className="relative h-56 overflow-hidden bg-slate-900">
                <img
                  src={dest.imageUrl}
                  alt={dest.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>

                {/* Country Flag & Category */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/20 text-xs font-bold text-white flex items-center gap-1.5 shadow-lg">
                    <span>{dest.flag}</span>
                    <span>{dest.country}</span>
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-sky-500/80 backdrop-blur-md text-[11px] font-bold text-slate-950 uppercase tracking-wider shadow-md">
                    {dest.category}
                  </span>
                </div>

                {/* Star Rating Badge */}
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-amber-400/30 text-amber-300 font-bold text-xs flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm text-amber-400 fill-amber-400">star</span>
                  <span>{dest.rating}</span>
                </div>

                {/* Card Title & Location */}
                <div className="absolute bottom-3 left-4 right-4">
                  <span className="text-[11px] text-sky-300 font-semibold uppercase tracking-wider">{dest.cityRegion}</span>
                  <h4 className="text-xl font-bold font-serif-display text-white drop-shadow-md">
                    {dest.name}
                  </h4>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex flex-col gap-4 flex-1 justify-between bg-slate-900/40">
                <p className="text-xs text-slate-300/90 line-clamp-2 leading-relaxed">
                  {dest.description}
                </p>

                {/* Metadata Pills */}
                <div className="grid grid-cols-2 gap-2 text-[11px] bg-white/5 rounded-xl p-2.5 border border-white/10">
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <span className="material-symbols-outlined text-sm text-sky-400">calendar_today</span>
                    <span className="truncate">{dest.bestTimeToVisit}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <span className="material-symbols-outlined text-sm text-amber-400">payments</span>
                    <span className="truncate">{dest.estimatedBudget}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-2 pt-2 border-t border-white/10">
                  <button
                    onClick={() => onSelectDestination(dest)}
                    className="w-full py-2.5 px-4 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition-all shadow-md flex items-center justify-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-base">visibility</span>
                    <span>Explore Destination</span>
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleOpenVisaQuote(dest.country)}
                      className="py-2 px-3 rounded-xl bg-white/10 hover:bg-emerald-500/20 hover:border-emerald-400/40 border border-white/15 text-emerald-300 font-semibold text-[11px] transition-all flex items-center justify-center gap-1"
                    >
                      <span className="material-symbols-outlined text-sm text-emerald-400">description</span>
                      <span>Visa Quote</span>
                    </button>
                    <button
                      onClick={() => handleOpenFlightQuote(dest.name, dest.country)}
                      className="py-2 px-3 rounded-xl bg-white/10 hover:bg-sky-500/20 hover:border-sky-400/40 border border-white/15 text-sky-300 font-semibold text-[11px] transition-all flex items-center justify-center gap-1"
                    >
                      <span className="material-symbols-outlined text-sm text-sky-400">flight_takeoff</span>
                      <span>Flight Quote</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="glass-card rounded-3xl p-5 md:p-6 border border-white/15 shadow-2xl flex flex-col gap-5 bg-slate-900/60">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 30 Bangladeshi favorite destinations, countries, attractions..."
              className="w-full pl-11 pr-10 py-3 rounded-2xl bg-white/5 border border-white/15 focus:border-sky-400 focus:outline-none text-white text-xs md:text-sm placeholder-slate-400 transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            )}
          </div>

          {/* Country Selector Dropdown */}
          <div className="flex items-center gap-3">
            <div className="relative min-w-[160px]">
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full pl-3 pr-8 py-3 rounded-2xl bg-white/5 border border-white/15 text-white text-xs font-medium focus:border-sky-400 focus:outline-none appearance-none cursor-pointer"
              >
                <option value="All" className="bg-slate-900 text-white">All 16 Countries</option>
                {countries.filter(c => c !== 'All').map((c) => (
                  <option key={c} value={c} className="bg-slate-900 text-white">
                    {c}
                  </option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">expand_more</span>
            </div>

            {/* View Switcher (Grid vs Map) */}
            <div className="flex items-center bg-white/5 p-1 rounded-2xl border border-white/15 shrink-0">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  viewMode === 'grid'
                    ? 'bg-sky-500 text-slate-950 shadow-md'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined text-base">grid_view</span>
                <span className="hidden sm:inline">Grid</span>
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  viewMode === 'map'
                    ? 'bg-sky-500 text-slate-950 shadow-md'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined text-base">map</span>
                <span className="hidden sm:inline">Interactive Map</span>
              </button>
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pt-1 pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs px-4 py-2 rounded-xl font-medium transition-all shrink-0 ${
                selectedCategory === cat
                  ? 'bg-sky-500 text-slate-950 font-bold shadow-md shadow-sky-500/20'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white border border-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area (Grid or Map) */}
      {viewMode === 'grid' ? (
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center text-xs text-slate-400 px-1">
            <span>Showing <strong className="text-white">{filteredDestinations.length}</strong> of 30 Popular Destinations</span>
            {(searchQuery || selectedCategory !== 'All' || selectedCountry !== 'All') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                  setSelectedCountry('All');
                }}
                className="text-sky-300 hover:underline flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">refresh</span>
                <span>Reset Filters</span>
              </button>
            )}
          </div>

          {filteredDestinations.length === 0 ? (
            <div className="glass-card rounded-3xl p-12 text-center flex flex-col items-center justify-center gap-4 border border-white/15">
              <span className="text-4xl">🏝️</span>
              <h3 className="text-xl font-bold font-serif-display text-white">No Matching Destinations Found</h3>
              <p className="text-xs text-slate-400 max-w-md">
                Try tweaking your search query or selecting a different country/category filter.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                  setSelectedCountry('All');
                }}
                className="mt-2 px-5 py-2.5 rounded-2xl bg-sky-500 text-slate-950 font-bold text-xs"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredDestinations.map((dest) => (
                <div
                  key={dest.id}
                  className="glass-card rounded-3xl overflow-hidden border border-white/15 hover:border-sky-400/40 transition-all duration-300 shadow-lg hover:shadow-2xl flex flex-col justify-between group"
                >
                  <div className="relative h-48 overflow-hidden bg-slate-900">
                    <img
                      src={dest.imageUrl}
                      alt={dest.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>

                    {/* Flag & Category */}
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/20 text-[11px] font-bold text-white flex items-center gap-1">
                        <span>{dest.flag}</span>
                        <span>{dest.country}</span>
                      </span>
                    </div>

                    <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-amber-300 font-bold text-[11px] flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-xs text-amber-400">star</span>
                      <span>{dest.rating}</span>
                    </div>

                    <div className="absolute bottom-2.5 left-3 right-3">
                      <span className="text-[10px] text-sky-300 font-medium uppercase tracking-wide">{dest.cityRegion}</span>
                      <h4 className="text-lg font-bold font-serif-display text-white line-clamp-1">
                        {dest.name}
                      </h4>
                    </div>
                  </div>

                  <div className="p-4 flex flex-col gap-3 flex-1 justify-between bg-slate-900/30">
                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                      {dest.description}
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-slate-300/80 pt-1 border-t border-white/10">
                      <span className="truncate flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs text-sky-400">calendar_month</span>
                        <span>{dest.bestTimeToVisit}</span>
                      </span>
                      <span className="truncate font-semibold text-emerald-300">
                        {dest.estimatedBudget}
                      </span>
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-col gap-1.5 pt-2 border-t border-white/10">
                      <button
                        onClick={() => onSelectDestination(dest)}
                        className="w-full py-2 px-3 rounded-xl bg-sky-500/90 hover:bg-sky-400 text-slate-950 font-bold text-xs transition-all flex items-center justify-center gap-1 shadow-sm"
                      >
                        <span className="material-symbols-outlined text-sm">visibility</span>
                        <span>Explore</span>
                      </button>

                      <div className="grid grid-cols-2 gap-1.5">
                        <button
                          onClick={() => handleOpenVisaQuote(dest.country)}
                          className="py-1.5 px-2 rounded-xl bg-white/5 hover:bg-emerald-500/20 border border-white/10 text-emerald-300 text-[10px] font-semibold transition-all flex items-center justify-center gap-1"
                        >
                          <span className="material-symbols-outlined text-xs text-emerald-400">description</span>
                          <span>Visa</span>
                        </button>

                        <button
                          onClick={() => handleOpenFlightQuote(dest.name, dest.country)}
                          className="py-1.5 px-2 rounded-xl bg-white/5 hover:bg-sky-500/20 border border-white/10 text-sky-300 text-[10px] font-semibold transition-all flex items-center justify-center gap-1"
                        >
                          <span className="material-symbols-outlined text-xs text-sky-400">flight_takeoff</span>
                          <span>Flight</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Interactive Map Section */
        <div className="relative w-full h-[600px] rounded-3xl overflow-hidden glass-card border border-white/20 shadow-2xl bg-slate-950">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity pointer-events-none"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=2000&q=80')`
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/80"></div>

          {/* Asia Coordinates Pin Visualization */}
          <div className="absolute inset-0 p-8 flex items-center justify-center overflow-hidden">
            {filteredDestinations.map((dest, idx) => {
              // Map lat (approx 0 to 40) and lng (approx 60 to 140) to percentage box
              const minLat = -10, maxLat = 45;
              const minLng = 35, maxLng = 145;
              
              const topPercent = 100 - ((dest.coordinates.lat - minLat) / (maxLat - minLat)) * 100;
              const leftPercent = ((dest.coordinates.lng - minLng) / (maxLng - minLng)) * 100;

              const topClamped = Math.max(10, Math.min(85, topPercent));
              const leftClamped = Math.max(8, Math.min(92, leftPercent));

              return (
                <div
                  key={`map-pin-${dest.id}`}
                  onClick={() => onSelectDestination(dest)}
                  style={{ top: `${topClamped}%`, left: `${leftClamped}%` }}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 group"
                  title={`${dest.name}, ${dest.country}`}
                >
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950/90 backdrop-blur-md text-white border border-sky-400/50 shadow-xl group-hover:scale-110 group-hover:bg-sky-500 group-hover:text-slate-950 transition-all duration-300">
                    <span className="text-xs">{dest.flag}</span>
                    <span className="text-[11px] font-bold whitespace-nowrap">{dest.name}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="absolute bottom-4 left-4 right-4 md:right-auto bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-xs text-slate-300 flex items-center gap-3">
            <span className="material-symbols-outlined text-sky-400 text-lg">touch_app</span>
            <span>Click any marker on the map to view detailed travel info, visa requirements, and flight options.</span>
          </div>
        </div>
      )}

      {/* Sub-Modals */}
      <VisaQuoteModal
        isOpen={!!visaModalCountry}
        onClose={() => setVisaModalCountry(null)}
        initialCountry={visaModalCountry || undefined}
      />

      <FlightQuoteModal
        isOpen={!!flightModalDest}
        onClose={() => setFlightModalDest(null)}
        initialDestination={flightModalDest || undefined}
      />
    </section>
  );
};
