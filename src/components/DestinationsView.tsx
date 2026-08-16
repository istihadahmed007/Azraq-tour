import React, { useState, useMemo } from 'react';
import { Destination } from '../types';
import { Search, MapPin, ArrowRight, Star, Sparkles, Filter } from 'lucide-react';
import { getOptimizedUnsplashUrl, getUnsplashSrcSet } from '../utils/imageOptimization';

interface DestinationsViewProps {
  destinations: Destination[];
  onSelectDestination: (destination: Destination) => void;
  onPlanTripPrompt: (promptText: string) => void;
}

export const DestinationsView: React.FC<DestinationsViewProps> = ({
  destinations,
  onSelectDestination,
  onPlanTripPrompt,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedCountry, setSelectedCountry] = useState<string>('All');

  const categories = ['All', 'Beach', 'City', 'Culture', 'Nature', 'Luxury'];

  const countries = useMemo(() => {
    const set = new Set<string>();
    destinations.forEach((d) => {
      if (d.country) set.add(d.country);
    });
    return ['All', ...Array.from(set).sort()];
  }, [destinations]);

  const filteredDestinations = useMemo(() => {
    return destinations.filter((d) => {
      const matchCat = selectedCategory === 'All' || d.category === selectedCategory;
      const matchCountry = selectedCountry === 'All' || d.country === selectedCountry;
      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        d.name.toLowerCase().includes(q) ||
        d.country.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q);
      return matchCat && matchCountry && matchQuery;
    });
  }, [destinations, selectedCategory, selectedCountry, searchQuery]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-10 animate-fadeIn">
      {/* Header */}
      <div className="max-w-3xl space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-[#0D6EFD] text-xs font-bold uppercase tracking-wider">
          <MapPin className="w-3.5 h-3.5" />
          <span>Destination Catalog</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#071A33] tracking-tight">
          Explore Asian Destinations
        </h1>
        <p className="text-slate-600 text-base leading-relaxed">
          Handcrafted escapes with verified visa guidelines, seasonal weather forecasts, and direct flights from Dhaka.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by city or country (e.g. Bali, Bangkok, Dubai)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-[#071A33] focus:bg-white focus:outline-none focus:border-[#0D6EFD]"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#0D6EFD] text-white font-bold'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Clean Destination Cards */}
      {filteredDestinations.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200/80 p-8 space-y-3">
          <p className="text-base font-bold text-slate-700">No destinations found</p>
          <p className="text-xs text-slate-500">
            Try adjusting your search criteria or category filter.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
            className="px-4 py-2 rounded-lg bg-blue-50 text-[#0D6EFD] font-bold text-xs hover:bg-blue-100 cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDestinations.map((dest) => (
            <div
              key={dest.id}
              className="group bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-md hover:border-[#0D6EFD]/60 transition-all duration-300 flex flex-col justify-between"
            >
              {/* Image Container */}
              <div
                className="relative h-48 sm:h-52 overflow-hidden bg-slate-100 cursor-pointer"
                onClick={() => onSelectDestination(dest)}
              >
                <img
                  src={getOptimizedUnsplashUrl(dest.imageUrl, 600, 80)}
                  srcSet={getUnsplashSrcSet(dest.imageUrl, [300, 600, 800], 80)}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
                  alt={dest.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-xs text-white text-xs font-semibold flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-sky-300" />
                  <span>{dest.country}</span>
                </div>
                <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-white/90 backdrop-blur-xs text-amber-600 text-xs font-bold flex items-center gap-1 shadow-xs">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span>{dest.rating}</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex flex-col flex-1 justify-between gap-4">
                <div className="space-y-1.5">
                  <h3
                    onClick={() => onSelectDestination(dest)}
                    className="text-lg font-bold text-[#071A33] group-hover:text-[#0D6EFD] transition-colors cursor-pointer"
                  >
                    {dest.name}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {dest.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    Visa: <strong className="text-slate-800 font-mono">{dest.visaFee || 'Available'}</strong>
                  </span>
                  <button
                    onClick={() => onSelectDestination(dest)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#0D6EFD] hover:text-blue-700 cursor-pointer"
                  >
                    <span>Explore</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
