import React, { useState, useMemo } from 'react';
import { Destination } from '../types';
import { ALL_DESTINATIONS, UNIQUE_COUNTRIES, UNIQUE_CATEGORIES } from '../data/destinationsData';
import { getVisaFeeForDestination, getVisaRequirement } from '../data/visaRequirementsData';
import { getOptimizedUnsplashUrl, getUnsplashSrcSet } from '../utils/imageOptimization';
import {
  Search,
  Filter,
  MapPin,
  Calendar,
  Sparkles,
  ShieldCheck,
  Plane,
  FileCheck,
  Compass,
  ArrowRight,
  Sun,
  Clock,
  DollarSign,
  Users,
  Award,
} from 'lucide-react';

interface DestinationDiscoveryHubProps {
  onSelectDestination: (destination: Destination) => void;
  onPlanTripPrompt?: (promptText: string) => void;
  onOpenVisaQuote?: (country: string) => void;
  onOpenFlightQuote?: (destination: string) => void;
}

export type VisaDifficulty = 'All' | 'Visa Free' | 'E-Visa / Instant' | 'Sticker Visa / Embassy' | 'On Arrival';
export type TravelerType = 'All' | 'Solo Explorer' | 'Couple / Honeymoon' | 'Family & Kids' | 'Group / Friends';
export type SeasonType = 'All' | 'Winter (Nov-Feb)' | 'Spring (Mar-May)' | 'Monsoon / Summer' | 'Autumn (Sep-Oct)';

export const DestinationDiscoveryHub: React.FC<DestinationDiscoveryHubProps> = ({
  onSelectDestination,
  onPlanTripPrompt,
  onOpenVisaQuote,
  onOpenFlightQuote,
}) => {
  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedVisaDifficulty, setSelectedVisaDifficulty] = useState<VisaDifficulty>('All');
  const [selectedTravelerType, setSelectedTravelerType] = useState<TravelerType>('All');
  const [selectedSeason, setSelectedSeason] = useState<SeasonType>('All');
  const [maxBudgetBDT, setMaxBudgetBDT] = useState<number>(250000);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Helper to map destination visa difficulty
  const getVisaDifficultyLevel = (country: string): VisaDifficulty => {
    const c = country.toLowerCase();
    if (c.includes('maldives') || c.includes('nepal') || c.includes('bhutan') || c.includes('sri lanka')) {
      return 'Visa Free';
    }
    if (c.includes('malaysia') || c.includes('uae') || c.includes('dubai') || c.includes('vietnam') || c.includes('indonesia') || c.includes('cambodia')) {
      return 'E-Visa / Instant';
    }
    if (c.includes('thailand') || c.includes('singapore') || c.includes('turkey') || c.includes('japan') || c.includes('saudi') || c.includes('uk') || c.includes('europe') || c.includes('china')) {
      return 'Sticker Visa / Embassy';
    }
    return 'E-Visa / Instant';
  };

  // Helper to parse estimated budget in BDT
  const parseBudgetBDT = (dest: Destination): number => {
    const budgetStr = dest.estimatedBudget || dest.priceRange || '';
    if (budgetStr.includes('৳') || budgetStr.toLowerCase().includes('bdt')) {
      const match = budgetStr.match(/\d[\d,]*/);
      if (match) return parseInt(match[0].replace(/,/g, ''), 10);
    }
    if (budgetStr.includes('$')) {
      const match = budgetStr.match(/\d+/);
      if (match) return parseInt(match[0], 10) * 122; // $1 = ~122 BDT
    }
    return 65000;
  };

  // Flight duration lookup
  const getApproxFlightTime = (country: string): string => {
    const c = country.toLowerCase();
    if (c.includes('bangladesh')) return 'Domestic (45m - 1h)';
    if (c.includes('india') || c.includes('nepal') || c.includes('bhutan')) return '1h 15m - 2h Direct';
    if (c.includes('thailand') || c.includes('malaysia') || c.includes('singapore')) return '3h 30m - 4h Direct';
    if (c.includes('maldives') || c.includes('sri lanka')) return '4h 15m (1-stop/direct)';
    if (c.includes('uae') || c.includes('dubai') || c.includes('qatar') || c.includes('saudi')) return '5h 15m - 5h 45m Direct';
    if (c.includes('turkey') || c.includes('vietnam') || c.includes('indonesia')) return '6h - 8h (1-stop)';
    if (c.includes('japan') || c.includes('china') || c.includes('korea')) return '8h - 10h (1-stop)';
    if (c.includes('uk') || c.includes('europe')) return '10h - 13h (Biman/1-stop)';
    return '3h - 6h from Dhaka';
  };

  // Filtered List
  const filteredDestinations = useMemo(() => {
    return ALL_DESTINATIONS.filter((dest) => {
      // Search term
      if (searchTerm) {
        const query = searchTerm.toLowerCase();
        const matchName = dest.name.toLowerCase().includes(query);
        const matchCountry = dest.country.toLowerCase().includes(query);
        const matchCity = (dest.cityRegion || '').toLowerCase().includes(query);
        const matchDesc = (dest.description || '').toLowerCase().includes(query);
        if (!matchName && !matchCountry && !matchCity && !matchDesc) return false;
      }

      // Country
      if (selectedCountry !== 'All' && dest.country !== selectedCountry) {
        return false;
      }

      // Category
      if (selectedCategory !== 'All' && dest.category !== selectedCategory) {
        return false;
      }

      // Visa Difficulty
      if (selectedVisaDifficulty !== 'All') {
        const difficulty = getVisaDifficultyLevel(dest.country);
        if (difficulty !== selectedVisaDifficulty) return false;
      }

      // Budget Filter
      const approxCost = parseBudgetBDT(dest);
      if (approxCost > maxBudgetBDT) {
        return false;
      }

      return true;
    });
  }, [searchTerm, selectedCountry, selectedCategory, selectedVisaDifficulty, maxBudgetBDT]);

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCountry('All');
    setSelectedCategory('All');
    setSelectedVisaDifficulty('All');
    setSelectedTravelerType('All');
    setSelectedSeason('All');
    setMaxBudgetBDT(250000);
  };

  return (
    <div className="w-full flex flex-col gap-6" id="dynamic-discovery">
      {/* Search and Multi-Filter Control Hub */}
      <div className="glass-card rounded-3xl p-5 sm:p-6 border border-sky-400/30 shadow-2xl bg-gradient-to-b from-slate-900/95 via-slate-900/90 to-[#07162c]/95 space-y-4">
        {/* Main Search Bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-sky-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search destination, city, country, or vibe (e.g. Bangkok, Maldives, Honeymoon, E-Visa)..."
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-800/90 border border-sky-400/30 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition-all shadow-inner"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className={`px-5 py-3.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border transition-all cursor-pointer ${
              showAdvancedFilters
                ? 'bg-sky-500 text-slate-950 border-sky-400 shadow-lg'
                : 'bg-slate-800 text-sky-200 border-sky-400/30 hover:border-sky-400'
            }`}
          >
            <Filter className="w-4 h-4" />
            <span>{showAdvancedFilters ? 'Hide Filters' : 'Smart Filters'}</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </button>
        </div>

        {/* Quick Visa Difficulty Chips */}
        <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1">
          <span className="text-xs font-bold text-slate-400 whitespace-nowrap flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-sky-400" /> Visa Type:
          </span>
          {(['All', 'Visa Free', 'E-Visa / Instant', 'Sticker Visa / Embassy'] as VisaDifficulty[]).map((v) => (
            <button
              key={v}
              onClick={() => setSelectedVisaDifficulty(v)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedVisaDifficulty === v
                  ? 'bg-sky-400 text-slate-950 font-bold shadow-md'
                  : 'bg-slate-800/80 text-slate-300 hover:text-white border border-slate-700'
              }`}
            >
              {v}
            </button>
          ))}
        </div>

        {/* Advanced Filters Expandable Matrix */}
        {showAdvancedFilters && (
          <div className="pt-4 border-t border-slate-800/90 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fadeIn">
            {/* Country Selector */}
            <div>
              <label className="block text-xs font-bold text-sky-300 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-sky-400" /> Country
              </label>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-semibold focus:outline-none focus:border-sky-400 cursor-pointer"
              >
                <option value="All">All Countries ({UNIQUE_COUNTRIES.length})</option>
                {UNIQUE_COUNTRIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Travel Category */}
            <div>
              <label className="block text-xs font-bold text-sky-300 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Category & Vibe
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-semibold focus:outline-none focus:border-sky-400 cursor-pointer"
              >
                <option value="All">All Categories</option>
                {UNIQUE_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Traveler Profile */}
            <div>
              <label className="block text-xs font-bold text-sky-300 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-emerald-400" /> Traveler Type
              </label>
              <select
                value={selectedTravelerType}
                onChange={(e) => setSelectedTravelerType(e.target.value as TravelerType)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-semibold focus:outline-none focus:border-sky-400 cursor-pointer"
              >
                <option value="All">All Profiles</option>
                <option value="Solo Explorer">Solo Explorer</option>
                <option value="Couple / Honeymoon">Couple / Honeymoon</option>
                <option value="Family & Kids">Family & Kids</option>
                <option value="Group / Friends">Group / Friends</option>
              </select>
            </div>

            {/* Max Budget Slider */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold text-sky-300 uppercase tracking-wider flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-400" /> Max Est. Budget
                </label>
                <span className="text-xs font-mono font-extrabold text-emerald-400">
                  ৳ {maxBudgetBDT.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min={20000}
                max={400000}
                step={10000}
                value={maxBudgetBDT}
                onChange={(e) => setMaxBudgetBDT(Number(e.target.value))}
                className="w-full accent-sky-400 cursor-pointer"
              />
            </div>
          </div>
        )}

        {/* Active Filter summary + Reset */}
        {(selectedCountry !== 'All' ||
          selectedCategory !== 'All' ||
          selectedVisaDifficulty !== 'All' ||
          maxBudgetBDT < 250000 ||
          searchTerm !== '') && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800 text-xs">
            <span className="text-slate-400 font-semibold">Showing {filteredDestinations.length} destination spots</span>
            <button
              onClick={resetFilters}
              className="px-2.5 py-1 rounded-full text-xs font-bold text-rose-300 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 transition-colors ml-auto cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>

      {/* Grid of Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDestinations.map((dest) => {
          const approxCostBDT = parseBudgetBDT(dest);
          const flightTime = getApproxFlightTime(dest.country);
          const visaFee = dest.visaFee || getVisaFeeForDestination(dest.country || dest.name);

          return (
            <div
              key={dest.id}
              className="group rounded-3xl overflow-hidden bg-slate-900/90 border border-white/15 hover:border-sky-400/60 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-sky-500/10 flex flex-col justify-between hover:-translate-y-1"
            >
              {/* Destination Cover Image */}
              <div
                className="relative h-60 overflow-hidden bg-slate-950 cursor-pointer"
                onClick={() => onSelectDestination(dest)}
              >
                <img
                  src={getOptimizedUnsplashUrl(dest.imageUrl, 800, 75)}
                  srcSet={getUnsplashSrcSet(dest.imageUrl, [400, 800, 1000], 75)}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
                  alt={dest.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                {/* Country Flag & Category Badges */}
                <div className="absolute top-3 left-3 flex items-center gap-2 z-10">
                  <span className="px-3 py-1 rounded-full bg-slate-950/85 backdrop-blur-md border border-white/20 text-xs font-bold text-white flex items-center gap-1.5 shadow-lg">
                    <span>{dest.flag}</span>
                    <span>{dest.country}</span>
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-sky-500/90 backdrop-blur-md text-[11px] font-bold text-slate-950 uppercase tracking-wider shadow-md">
                    {dest.category}
                  </span>
                </div>

                {/* Star Rating Badge */}
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-sky-400/40 text-sky-300 font-bold text-xs flex items-center gap-1 z-10">
                  <span className="material-symbols-outlined text-sm text-sky-400 fill-sky-400">star</span>
                  <span>{dest.rating || '4.9'}</span>
                </div>

                {/* Destination Title & Estimated Cost Overlay */}
                <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between gap-2 z-10">
                  <div>
                    <span className="text-[11px] text-sky-300/90 font-semibold uppercase tracking-wider">
                      {dest.cityRegion || dest.country}
                    </span>
                    <h4 className="text-xl font-extrabold text-white drop-shadow-md group-hover:text-sky-300 transition-colors">
                      {dest.name}
                    </h4>
                  </div>

                  <div className="text-right bg-slate-950/80 px-2.5 py-1 rounded-xl border border-emerald-500/40 backdrop-blur-md">
                    <span className="text-[10px] text-emerald-400 block font-bold uppercase">Est. Trip Cost</span>
                    <span className="text-sm font-extrabold text-emerald-300 font-mono">
                      ৳ {approxCostBDT.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Content & Travel Parameters */}
              <div className="p-5 flex flex-col gap-4 flex-1 justify-between bg-slate-900/60">
                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                  {dest.description}
                </p>

                {/* Key Travel Intelligence Grid */}
                <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-950/70 rounded-2xl p-3 border border-sky-400/20">
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <Calendar className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                    <span className="truncate">Season: {dest.bestTimeToVisit || 'Nov - Mar'}</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-slate-300">
                    <Plane className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                    <span className="truncate">{flightTime}</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-teal-300 font-semibold col-span-2 pt-1 border-t border-slate-800">
                    <ShieldCheck className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                    <span className="truncate">Visa: {visaFee} ({getVisaDifficultyLevel(dest.country)})</span>
                  </div>
                </div>

                {/* Actions: Build My Trip & Direct Quote */}
                <div className="pt-2 border-t border-slate-800/80 flex flex-col gap-2">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => onSelectDestination(dest)}
                      className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-300 hover:text-white font-bold text-xs border border-sky-400/30 transition-all flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Compass className="w-3.5 h-3.5" />
                      <span>Details & Map</span>
                    </button>

                    <button
                      onClick={() => {
                        if (onOpenVisaQuote) {
                          onOpenVisaQuote(dest.country);
                        } else {
                          onSelectDestination(dest);
                        }
                      }}
                      className="py-2.5 px-3 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 font-bold text-xs border border-teal-400/40 transition-all flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <FileCheck className="w-3.5 h-3.5" />
                      <span>Visa Quote</span>
                    </button>
                  </div>

                  {/* Primary "Build My Trip" Action */}
                  <button
                    onClick={() => {
                      if (onPlanTripPrompt) {
                        onPlanTripPrompt(`Create a luxury personalized travel itinerary for ${dest.name}, ${dest.country} starting from Dhaka.`);
                      } else {
                        onSelectDestination(dest);
                      }
                    }}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-400 via-cyan-400 to-emerald-400 hover:from-sky-300 hover:to-emerald-300 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-sky-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                  >
                    <Sparkles className="w-4 h-4 text-slate-950" />
                    <span>Build My Trip to {dest.name}</span>
                    <ArrowRight className="w-4 h-4 text-slate-950" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
