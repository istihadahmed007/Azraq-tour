import React, { useState, useMemo } from 'react';
import { Destination } from '../types';
import { useAuth } from '../context/AuthContext';
import { HeroSection } from './HeroSection';
import { WhyRequestQuoteSection } from './WhyRequestQuoteSection';
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

  const handleCardQuoteClick = (e: React.MouseEvent, countryOrName: string) => {
    e.stopPropagation();
    setDirectQuoteCountry(countryOrName);
    setIsDirectVisaModalOpen(true);
  };

  return (
    <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8 pt-4 pb-24 flex flex-col gap-10">
      {/* 1. Why Request a Quote from Azraq Tours (6-Feature Row matching Capture.PNG) */}
      <WhyRequestQuoteSection
        onOpenVisaQuote={() => setIsDirectVisaModalOpen(true)}
        onOpenFlightQuote={() => setIsDirectFlightModalOpen(true)}
      />

      {/* 2. Popular Destinations for Bangladeshi Travelers Section */}
      <PopularBDDestinationsSection
        onSelectDestination={onSelectDestination}
        onPlanTripPrompt={onPlanTripPrompt}
      />

      {/* 3. Hero Section (Luxury AI Concierge & Trip Planner) */}
      <HeroSection
        onPlanTripPrompt={onPlanTripPrompt}
        onRequestQuote={() => setIsDirectFlightModalOpen(true)}
        onExploreDestinations={() => {
          const el = document.getElementById('popular-destinations');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* 4. Official Travel Agency Visa & Flight Quotation Section */}
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


