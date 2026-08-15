import React, { useState, useMemo } from 'react';
import { Destination } from '../types';
import { useAuth } from '../context/AuthContext';
import { QuotationSection } from './QuotationSection';
import { PopularBDDestinationsSection } from './PopularBDDestinationsSection';
import { InteractiveAsiaMap } from './InteractiveAsiaMap';
import { getVisaFeeForDestination } from '../data/visaRequirementsData';

interface DiscoverViewProps {
  destinations: Destination[];
  onSelectDestination: (destination: Destination) => void;
  onPlanTripPrompt: (promptText: string) => void;
  onQuickGenerateItinerary: (destName: string) => void;
}

export const DiscoverView: React.FC<DiscoverViewProps> = ({
  destinations,
  onSelectDestination,
  onPlanTripPrompt,
  onQuickGenerateItinerary,
}) => {
  const { requireAuth } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedCountry, setSelectedCountry] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'match' | 'rating' | 'name'>('match');
  const [directQuoteCountry, setDirectQuoteCountry] = useState<string | undefined>(undefined);
  const [isDirectVisaModalOpen, setIsDirectVisaModalOpen] = useState(false);
  const [isDirectFlightModalOpen, setIsDirectFlightModalOpen] = useState(false);
  const [showInteractiveMap, setShowInteractiveMap] = useState(true);

  const categories = [
    'All',
    'Beach',
    'Culture',
    'Nature',
    'City',
    'Mountain',
    'Adventure',
    'Wildlife',
    'Luxury',
  ];

  // Extract list of all unique countries sorted alphabetically
  const countries = useMemo(() => {
    const set = new Set<string>();
    destinations.forEach((d) => {
      if (d.country) set.add(d.country);
    });
    return ['All', ...Array.from(set).sort()];
  }, [destinations]);

  // Filter destinations based on search, category, and country
  const filteredDestinations = useMemo(() => {
    let result = destinations.filter((d) => {
      const matchesCategory =
        selectedCategory === 'All' || d.category === selectedCategory;
      const matchesCountry =
        selectedCountry === 'All' || d.country === selectedCountry;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        d.name.toLowerCase().includes(q) ||
        d.country.toLowerCase().includes(q) ||
        (d.cityRegion && d.cityRegion.toLowerCase().includes(q)) ||
        d.description.toLowerCase().includes(q) ||
        (d.popularAttractions &&
          d.popularAttractions.some((a) => a.toLowerCase().includes(q))) ||
        (d.thingsToDo &&
          d.thingsToDo.some((a) => a.toLowerCase().includes(q)));

      return matchesCategory && matchesCountry && matchesSearch;
    });

    if (sortBy === 'rating') {
      result = [...result].sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'name') {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    } else {
      result = [...result].sort(
        (a, b) => (b.matchScore || 90) - (a.matchScore || 90)
      );
    }

    return result;
  }, [destinations, selectedCategory, selectedCountry, searchQuery, sortBy]);

  // Strictly limit displayed destinations to exactly 15 max
  const visibleDestinations = useMemo(() => {
    return filteredDestinations.slice(0, 15);
  }, [filteredDestinations]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onPlanTripPrompt(searchQuery.trim());
    }
  };

  const handleCardQuoteClick = (e: React.MouseEvent, countryOrName: string) => {
    e.stopPropagation();
    setDirectQuoteCountry(countryOrName);
    setIsDirectVisaModalOpen(true);
  };

  const samplePrompts = [
    "Cox's Bazar 120km Beach",
    'Kyoto Arashiyama bamboo forest',
    'Overwater bungalows in Maldives',
    'Cappadocia Hot Air Balloon',
    'Everest Base Camp Trek',
  ];

  return (
    <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8 pt-4 pb-24 flex flex-col gap-10">
      {/* Hero Header Section with High-Quality Cinematic Visual Backdrop */}
      <section className="relative overflow-hidden rounded-3xl border border-sky-400/25 bg-slate-950 p-6 sm:p-10 md:p-14 text-center shadow-2xl flex flex-col items-center justify-center gap-6">
        {/* Background Cinematic Visual & Gradient Overlay */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <img
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80"
            alt="Luxury Asian Travel Wonders"
            className="w-full h-full object-cover opacity-20 scale-105 filter saturate-125"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/90 to-slate-950"></div>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-sky-500/15 rounded-full blur-3xl"></div>
        </div>

        {/* Hero Eyebrow */}
        <div className="relative z-10 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-500/20 border border-sky-400/40 text-sky-200 text-xs sm:text-sm font-bold uppercase tracking-wider shadow-md">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
          <span>15 Handpicked Asian Wonders • Verified Visa & Flight Concierge</span>
        </div>

        {/* Hero Headline */}
        <h1 className="relative z-10 text-3xl sm:text-5xl md:text-6xl font-serif-display font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#e0f2fe] via-[#7dd3fc] to-[#fcd34d] drop-shadow-md leading-tight max-w-4xl">
          Discover Asia's Most Breathtaking Wonders
        </h1>

        {/* Hero Subtitle */}
        <p className="relative z-10 text-sm sm:text-base md:text-lg text-slate-200 max-w-2xl font-normal leading-relaxed">
          Explore 15 Handpicked Asian Wonders – From Cox's Bazar to Kyoto. Get Visa Guidance & Flight Quotes Instantly from licensed travel specialists.
        </p>

        {/* Primary Hero CTAs with High-Contrast Colors */}
        <div className="relative z-10 flex flex-wrap items-center justify-center gap-3.5 pt-2">
          <button
            onClick={() => setIsDirectVisaModalOpen(true)}
            className="px-6 sm:px-7 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-bold text-sm sm:text-base shadow-xl shadow-emerald-500/25 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer min-h-[48px]"
          >
            <span className="material-symbols-outlined text-lg">verified</span>
            <span>Get Visa Quote</span>
          </button>

          <button
            onClick={() => setIsDirectFlightModalOpen(true)}
            className="px-6 sm:px-7 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-sm sm:text-base shadow-xl shadow-amber-500/25 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer min-h-[48px]"
          >
            <span className="material-symbols-outlined text-lg">flight_takeoff</span>
            <span>Flight Quotation</span>
          </button>

          <a
            href="#featured-destinations"
            className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 hover:border-sky-400/40 transition-all flex items-center gap-2 cursor-pointer min-h-[48px]"
          >
            <span>Explore 15 Wonders</span>
            <span className="material-symbols-outlined text-lg">arrow_downward</span>
          </a>
        </div>

        {/* Hero Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="relative z-10 w-full max-w-3xl mt-2 rounded-2xl md:rounded-full p-2 flex flex-col sm:flex-row items-center gap-2 shadow-2xl bg-slate-900/90 border border-sky-400/30 backdrop-blur-xl"
        >
          <div className="flex items-center w-full px-3 py-2 sm:py-0">
            <span className="material-symbols-outlined text-sky-400 mr-2">search</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search destinations, cities, countries, or activities..."
              className="w-full bg-transparent border-none focus:outline-none focus:ring-0 text-white placeholder:text-slate-400 text-sm sm:text-base font-normal"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-xs sm:text-sm text-slate-400 hover:text-white px-2 cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto min-h-[48px] bg-sky-500 text-slate-950 hover:bg-sky-400 font-bold text-sm sm:text-base px-6 py-3 rounded-xl sm:rounded-full transition-all duration-200 ease-out flex items-center justify-center gap-2 shadow-lg shadow-sky-500/25 shrink-0 cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">auto_awesome</span>
            <span>Search & Plan</span>
          </button>
        </form>

        {/* Quick Sample Suggestions */}
        <div className="relative z-10 flex flex-wrap items-center justify-center gap-2 max-w-3xl">
          <span className="text-xs text-slate-400 font-medium">Quick searches:</span>
          {samplePrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => setSearchQuery(prompt)}
              className="text-xs px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 hover:text-sky-300 transition-all border border-white/10 cursor-pointer"
            >
              {prompt}
            </button>
          ))}
        </div>
      </section>

      {/* Official Travel Agency Visa & Flight Quotation Section */}
      <QuotationSection
        initialVisaCountry={directQuoteCountry}
        isVisaModalOpenExternal={isDirectVisaModalOpen}
        isFlightModalOpenExternal={isDirectFlightModalOpen}
        onCloseExternalModals={() => {
          setIsDirectVisaModalOpen(false);
          setIsDirectFlightModalOpen(false);
          setDirectQuoteCountry(undefined);
        }}
      />

      {/* Dedicated Popular Destinations for Bangladeshi Travelers Section */}
      <PopularBDDestinationsSection
        onSelectDestination={onSelectDestination}
        onPlanTripPrompt={onPlanTripPrompt}
      />

      {/* Interactive Asia Travel Map Explorer (Option A - Direct Visual Discovery) */}
      <section className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/90 p-5 rounded-3xl border border-sky-400/25 shadow-xl">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/20 border border-sky-400/30 text-sky-300 text-xs font-bold uppercase tracking-wider">
              <span className="material-symbols-outlined text-sm">map</span>
              <span>Visual Asia Explorer</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif-display font-bold text-white">
              Explore Destinations on Interactive Map
            </h2>
            <p className="text-xs text-slate-300">
              Tap any branded marker across Asia to view 10-word teasers, Dhaka flight corridors, and get instant travel quotes.
            </p>
          </div>

          <button
            onClick={() => setShowInteractiveMap(!showInteractiveMap)}
            className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 hover:border-sky-400/40 transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0 min-h-[40px]"
          >
            <span className="material-symbols-outlined text-base">
              {showInteractiveMap ? 'visibility_off' : 'explore'}
            </span>
            <span>{showInteractiveMap ? 'Hide Map' : 'Show Interactive Map'}</span>
          </button>
        </div>

        {showInteractiveMap && (
          <InteractiveAsiaMap
            destinations={destinations}
            onSelectDestination={onSelectDestination}
            onOpenQuotation={(country) => {
              setDirectQuoteCountry(country);
              setIsDirectVisaModalOpen(true);
            }}
            onQuickGenerateItinerary={(destName) => {
              requireAuth(
                { type: 'generate_itinerary', label: `Itinerary for ${destName}` },
                () => onQuickGenerateItinerary(destName)
              );
            }}
          />
        )}
      </section>

      {/* Comprehensive Filter Controls */}
      <div id="featured-destinations" className="flex flex-col gap-4 bg-slate-900/80 p-5 rounded-3xl border border-sky-400/20 backdrop-blur-md shadow-xl">
        {/* Category Row */}
        <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider shrink-0 mr-2">
            Category:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold shrink-0 transition-all cursor-pointer min-h-[38px] flex items-center ${
                selectedCategory === cat
                  ? 'bg-sky-500 text-slate-950 font-bold shadow-md'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Country & Sort Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-white/10">
          <div className="flex items-center gap-3 overflow-x-auto hide-scrollbar">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider shrink-0">
              Country:
            </span>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="bg-slate-800 text-white text-xs rounded-xl px-3 py-2.5 border border-white/20 focus:outline-none focus:border-sky-400 font-medium min-h-[44px]"
            >
              {countries.map((c) => (
                <option key={c} value={c}>
                  {c === 'All' ? '🌐 All Asian Countries' : c}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                Sort:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-slate-800 text-white text-xs rounded-xl px-3 py-2.5 border border-white/20 focus:outline-none focus:border-sky-400 font-medium min-h-[44px]"
              >
                <option value="match">Popularity / Match</option>
                <option value="rating">Top Rated ⭐</option>
                <option value="name">Name (A-Z)</option>
              </select>
            </div>

            <span className="text-xs text-sky-300 font-bold bg-sky-500/10 border border-sky-400/20 px-3 py-2 rounded-xl">
              Showing {visibleDestinations.length} of 15 Asian Wonders
            </span>
          </div>
        </div>
      </div>

      {/* Grid of Exactly 15 Destinations (5 cards per row on desktop) */}
      <section className="flex flex-col gap-6">
        {visibleDestinations.length === 0 ? (
          <div className="text-center py-16 bg-white/5 rounded-3xl border border-white/10 space-y-3">
            <span className="material-symbols-outlined text-4xl text-slate-400">travel_explore</span>
            <h3 className="text-lg font-bold text-white">No destinations found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Try adjusting your search criteria or clear category filters to view all Asian destinations.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setSelectedCountry('All');
              }}
              className="text-xs font-semibold text-sky-400 underline pt-2 cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4.5 sm:gap-5">
            {visibleDestinations.map((dest, index) => {
              const truncatedDesc =
                dest.description.length > 75
                  ? dest.description.substring(0, 75) + '...'
                  : dest.description;

              return (
                <div
                  key={dest.id}
                  onClick={() => onSelectDestination(dest)}
                  style={{ animationDelay: `${index * 40}ms` }}
                  className="group relative flex flex-col h-[410px] rounded-2xl overflow-hidden glass-card border border-white/15 bg-slate-900/90 shadow-lg hover:shadow-2xl hover:shadow-sky-500/20 hover:border-sky-400/60 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer animate-fade-in"
                >
                  {/* Image Container */}
                  <div className="relative h-44 w-full overflow-hidden shrink-0">
                    <img
                      src={dest.imageUrl}
                      alt={dest.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>

                    {/* Top Badges */}
                    <div className="absolute top-2.5 left-2.5 right-2.5 flex justify-between items-center z-10">
                      <span className="bg-black/75 backdrop-blur-md border border-white/20 text-white font-semibold text-[11px] px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md">
                        <span>{dest.flag}</span>
                        <span className="truncate max-w-[80px]">{dest.country}</span>
                      </span>

                      <span className="bg-sky-500/90 backdrop-blur-md text-slate-950 font-extrabold text-[10px] px-2 py-0.5 rounded-full shadow-md uppercase tracking-wider">
                        {dest.category}
                      </span>
                    </div>

                    {/* Rating Badge */}
                    <div className="absolute bottom-2.5 right-2.5 z-10">
                      <span className="bg-black/75 backdrop-blur-md text-amber-400 font-bold text-[11px] px-2 py-0.5 rounded-full border border-amber-400/30 flex items-center gap-0.5 shadow-md">
                        <span className="material-symbols-outlined text-[12px]">star</span>
                        {dest.rating}
                      </span>
                    </div>
                  </div>

                  {/* Content Body */}
                  <div className="p-4 flex flex-col justify-between flex-1 bg-slate-900/95 text-slate-200">
                    <div className="space-y-1">
                      <div className="text-[10px] font-bold text-sky-400 uppercase tracking-wider truncate">
                        {dest.cityRegion || dest.country}
                      </div>

                      <h3 className="font-serif-display font-bold text-base text-white group-hover:text-sky-300 transition-colors line-clamp-1">
                        {dest.name}
                      </h3>

                      {/* Truncated description with Read More */}
                      <p className="text-[11px] text-slate-300 leading-relaxed font-normal">
                        {truncatedDesc}{' '}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectDestination(dest);
                          }}
                          className="text-sky-400 hover:text-sky-200 font-semibold underline inline ml-1 cursor-pointer"
                        >
                          Read More
                        </button>
                      </p>
                    </div>

                    {/* Specs & Actions Footer */}
                    <div className="pt-2.5 border-t border-white/10 space-y-2">
                      {/* Key Specs Row */}
                      <div className="grid grid-cols-2 gap-1 text-[10px] font-medium">
                        <span className="flex items-center gap-1 text-emerald-300 truncate">
                          <span className="material-symbols-outlined text-xs shrink-0">calendar_month</span>
                          <span className="truncate">{dest.bestTimeToVisit || 'Nov - Mar'}</span>
                        </span>

                        <span className="flex items-center gap-1 text-teal-300 font-bold truncate justify-end">
                          <span className="material-symbols-outlined text-xs shrink-0">verified_user</span>
                          <span className="truncate">{getVisaFeeForDestination(dest.country || dest.name)}</span>
                        </span>
                      </div>

                      {/* Quotation & Explore Buttons Row */}
                      <div className="flex items-center justify-between gap-1.5 pt-1">
                        <button
                          onClick={(e) => handleCardQuoteClick(e, dest.country || dest.name)}
                          className="flex-1 text-[10px] font-bold px-2 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 transition-all flex items-center justify-center gap-1 shadow-sm cursor-pointer"
                          title={`Get Visa/Flight Quotation for ${dest.name}`}
                        >
                          <span className="material-symbols-outlined text-xs">request_quote</span>
                          <span>Get Quote</span>
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            requireAuth(
                              { type: 'generate_itinerary', label: `Itinerary for ${dest.name}` },
                              () => onQuickGenerateItinerary(dest.name)
                            );
                          }}
                          className="text-[10px] font-bold px-2.5 py-1.5 rounded-xl bg-sky-500/20 hover:bg-sky-400 text-sky-300 hover:text-slate-950 transition-all border border-sky-400/30 flex items-center gap-1 cursor-pointer"
                          title="Generate AI Itinerary"
                        >
                          <span className="material-symbols-outlined text-xs">auto_awesome</span>
                          <span>Plan</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};


