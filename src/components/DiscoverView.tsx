import React, { useState, useMemo } from 'react';
import { Destination } from '../types';
import { useAuth } from '../context/AuthContext';
import { QuotationSection } from './QuotationSection';
import { PopularBDDestinationsSection } from './PopularBDDestinationsSection';
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

  const samplePrompts = [
    "Cox's Bazar 120km Beach",
    'Kyoto Arashiyama bamboo forest',
    'Overwater bungalows in Maldives',
    'Cappadocia Hot Air Balloon',
    'Everest Base Camp Trek',
  ];

  return (
    <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8 pt-24 md:pt-12 pb-24 flex flex-col gap-10">
      {/* Hero Header Section */}
      <section className="flex flex-col items-center justify-center text-center pt-6 md:pt-12 pb-4 gap-6 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-500/15 border border-sky-400/30 text-sky-300 text-xs sm:text-sm font-semibold uppercase tracking-wider">
          <span>Explore 15 Handpicked Asian Destinations</span>
        </div>

        <h1 className="hero-title max-w-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#adc7ff] via-[#76d6d5] to-[#ffba20] drop-shadow-sm leading-tight">
          Discover Asia's Most Breathtaking Wonders
        </h1>
        <p className="body-text text-base md:text-lg text-on-surface-variant max-w-2xl font-normal leading-relaxed">
          From Cox's Bazar and Kyoto to Bali, Maldives, and Dubai—explore complete records, local food, visa guides, and instant travel quotations.
        </p>

        {/* Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="w-full max-w-3xl mt-2 glass-card rounded-2xl md:rounded-full p-2 flex flex-col sm:flex-row items-center gap-2 shadow-2xl relative overflow-hidden group border border-white/20"
        >
          <div className="flex items-center w-full px-3 py-2 sm:py-0">
            <span className="material-symbols-outlined text-on-surface-variant mr-2">search</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search top destinations, cities, countries, or activities..."
              className="w-full bg-transparent border-none focus:outline-none focus:ring-0 text-on-surface placeholder:text-outline text-base font-normal"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-xs sm:text-sm text-outline hover:text-white px-2 cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto min-h-[48px] bg-primary text-on-primary hover:bg-primary-fixed font-semibold text-base px-6 py-3 rounded-xl sm:rounded-full transition-all duration-200 ease-out flex items-center justify-center gap-2 shadow-lg shadow-primary/20 shrink-0 cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">auto_awesome</span>
            <span>AI Search</span>
          </button>
        </form>

        {/* Quick Sample Suggestions */}
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-3xl">
          <span className="text-xs sm:text-sm text-outline font-medium">Quick searches:</span>
          {samplePrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => setSearchQuery(prompt)}
              className="text-xs sm:text-sm px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-on-surface-variant hover:text-primary transition-all border border-white/10 cursor-pointer"
            >
              {prompt}
            </button>
          ))}
        </div>
      </section>

      {/* Official Travel Agency Visa & Flight Quotation Bar */}
      <QuotationSection />

      {/* Dedicated Popular Destinations for Bangladeshi Travelers Section */}
      <PopularBDDestinationsSection
        onSelectDestination={onSelectDestination}
        onPlanTripPrompt={onPlanTripPrompt}
      />

      {/* Comprehensive Filter Controls */}
      <div className="flex flex-col gap-4 bg-slate-900/60 p-5 rounded-3xl border border-white/10 backdrop-blur-md">
        {/* Category Row */}
        <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1">
          <span className="text-xs text-outline font-semibold uppercase tracking-wider shrink-0 mr-2">
            Category:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-primary text-on-primary shadow-md'
                  : 'bg-white/5 text-on-surface-variant hover:bg-white/10 hover:text-white border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Country & Sort Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-white/10">
          <div className="flex items-center gap-3 overflow-x-auto hide-scrollbar">
            <span className="text-xs text-outline font-semibold uppercase tracking-wider shrink-0">
              Country:
            </span>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="bg-slate-800 text-white text-xs rounded-xl px-3 py-2 border border-white/20 focus:outline-none focus:border-sky-400 font-medium"
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
              <span className="text-xs text-outline font-semibold uppercase tracking-wider">
                Sort:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-slate-800 text-white text-xs rounded-xl px-3 py-2 border border-white/20 focus:outline-none focus:border-sky-400 font-medium"
              >
                <option value="match">Popularity / Match</option>
                <option value="rating">Top Rated ⭐</option>
                <option value="name">Name (A-Z)</option>
              </select>
            </div>

            <span className="text-xs text-sky-300 font-bold bg-sky-500/10 border border-sky-400/20 px-3 py-1.5 rounded-xl">
              Displaying {visibleDestinations.length} of 15 Featured Destinations
            </span>
          </div>
        </div>
      </div>

      {/* Grid of Exactly 15 Destinations (5 cards per row on desktop) */}
      <section className="flex flex-col gap-6">
        {visibleDestinations.length === 0 ? (
          <div className="text-center py-16 bg-white/5 rounded-3xl border border-white/10 space-y-3">
            <span className="material-symbols-outlined text-4xl text-outline">travel_explore</span>
            <h3 className="text-lg font-bold text-white">No destinations found</h3>
            <p className="text-xs text-outline max-w-sm mx-auto">
              Try adjusting your search criteria or clear category filters to view all Asian destinations.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setSelectedCountry('All');
              }}
              className="text-xs font-semibold text-primary underline pt-2 cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4.5 sm:gap-5">
            {visibleDestinations.map((dest, index) => (
              <div
                key={dest.id}
                onClick={() => onSelectDestination(dest)}
                style={{ animationDelay: `${index * 40}ms` }}
                className="group relative flex flex-col h-[390px] rounded-2xl overflow-hidden glass-card border border-white/15 bg-slate-900/90 shadow-lg hover:shadow-2xl hover:shadow-sky-500/20 hover:border-sky-400/60 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer animate-fade-in"
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
                    <span className="bg-black/70 backdrop-blur-md border border-white/20 text-white font-semibold text-[11px] px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md">
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
                <div className="p-4 flex flex-col justify-between flex-1 bg-slate-900/95 text-on-surface">
                  <div className="space-y-1">
                    <div className="text-[10px] font-bold text-sky-400 uppercase tracking-wider truncate">
                      {dest.cityRegion || dest.country}
                    </div>

                    <h3 className="font-serif-display font-bold text-base text-white group-hover:text-sky-300 transition-colors line-clamp-1">
                      {dest.name}
                    </h3>

                    <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed font-normal">
                      {dest.description}
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

                    {/* Buttons Row */}
                    <div className="flex items-center justify-between pt-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectDestination(dest);
                        }}
                        className="text-[11px] text-sky-300 hover:text-white font-bold flex items-center gap-0.5 transition-colors cursor-pointer"
                      >
                        <span>Explore</span>
                        <span className="material-symbols-outlined text-xs">arrow_forward</span>
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          requireAuth(
                            { type: 'generate_itinerary', label: `Itinerary for ${dest.name}` },
                            () => onQuickGenerateItinerary(dest.name)
                          );
                        }}
                        className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-sky-500/20 hover:bg-sky-400 text-sky-300 hover:text-slate-950 transition-all border border-sky-400/30 flex items-center gap-1 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-xs">auto_awesome</span>
                        <span>Itinerary</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

