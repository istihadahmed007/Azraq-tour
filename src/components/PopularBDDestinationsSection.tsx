import React, { useState, useMemo } from 'react';
import { Destination } from '../types';
import { POPULAR_BANGLADESHI_DESTINATIONS } from '../data/popularBangladeshiDestinations';
import { VisaQuoteModal } from './VisaQuoteModal';
import { FlightQuoteModal } from './FlightQuoteModal';
import { useAuth } from '../context/AuthContext';
import { getVisaFeeForDestination } from '../data/visaRequirementsData';

interface PopularBDDestinationsSectionProps {
  onSelectDestination: (destination: Destination) => void;
  onPlanTripPrompt?: (promptText: string) => void;
}

export const PopularBDDestinationsSection: React.FC<PopularBDDestinationsSectionProps> = ({
  onSelectDestination,
  onPlanTripPrompt,
}) => {
  const { requireAuth } = useAuth();
  
  // State for sub-modals (Visa and Flight quote directly from card)
  const [visaModalCountry, setVisaModalCountry] = useState<string | null>(null);
  const [flightModalDest, setFlightModalDest] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'Beach' | 'City' | 'Culture' | 'Luxury'>('All');

  // Featured destinations representing Bangladeshi traveler favorites
  const featuredDestinations = useMemo(() => {
    let list = POPULAR_BANGLADESHI_DESTINATIONS;
    if (selectedFilter !== 'All') {
      list = list.filter((d) => d.category === selectedFilter);
    }
    return list.slice(0, 9);
  }, [selectedFilter]);

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
    <section className="w-full flex flex-col gap-8 my-8" id="popular-destinations">
      {/* Section Header with Exact Mockup Title & Subtext */}
      <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-4 pt-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-400/40 text-cyan-300 text-xs font-bold tracking-wider uppercase shadow-inner">
          <span className="material-symbols-outlined text-sm text-[#00d2ff]">verified</span>
          <span>AZRAQ TOURS & TRAVELS EXCLUSIVE</span>
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
          Popular Destinations for <span className="text-[#38bdf8]">Bangladeshi Travelers</span>
        </h2>

        <p className="text-sm md:text-base text-slate-200/90 leading-relaxed max-w-3xl">
          Discover the places Bangladeshi travelers love to explore. Find travel information, visa guidance and flight quotation options in one place.
        </p>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          {(['All', 'Beach', 'City', 'Culture', 'Luxury'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                selectedFilter === filter
                  ? 'bg-sky-400 text-slate-950 font-bold shadow-md shadow-sky-500/20'
                  : 'bg-[#0B1726] text-slate-300 hover:text-white border border-white/10 hover:border-sky-400/40'
              }`}
            >
              {filter === 'All' ? 'All Popular' : filter}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Destination Cards (3 Columns Desktop, 2 Tablet, 1 Mobile) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto w-full">
        {featuredDestinations.map((dest) => (
          <div
            key={`featured-${dest.id}`}
            className="group rounded-3xl overflow-hidden bg-slate-900/90 border border-white/15 hover:border-sky-400/60 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-sky-500/10 flex flex-col justify-between hover:-translate-y-1"
          >
            {/* Destination Cover Image */}
            <div className="relative h-56 overflow-hidden bg-slate-950 cursor-pointer" onClick={() => onSelectDestination(dest)}>
              <img
                src={dest.imageUrl}
                alt={dest.name}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>

              {/* Country Flag & Category Badges */}
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-slate-950/85 backdrop-blur-md border border-white/20 text-xs font-bold text-white flex items-center gap-1.5 shadow-lg">
                  <span>{dest.flag}</span>
                  <span>{dest.country}</span>
                </span>
                <span className="px-2.5 py-1 rounded-full bg-sky-500/90 backdrop-blur-md text-[11px] font-bold text-slate-950 uppercase tracking-wider shadow-md">
                  {dest.category}
                </span>
              </div>

              {/* Star Rating Badge */}
              <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-sky-400/40 text-sky-300 font-bold text-xs flex items-center gap-1">
                <span className="material-symbols-outlined text-sm text-sky-400 fill-sky-400">star</span>
                <span>{dest.rating}</span>
              </div>

              {/* Destination Title & City */}
              <div className="absolute bottom-3 left-4 right-4">
                <span className="text-[11px] text-sky-300/90 font-semibold uppercase tracking-wider">{dest.cityRegion}</span>
                <h4 className="text-xl font-bold text-white drop-shadow-md group-hover:text-sky-300 transition-colors">
                  {dest.name}
                </h4>
              </div>
            </div>

            {/* Card Content */}
            <div className="p-5 flex flex-col gap-4 flex-1 justify-between bg-slate-900/50">
              <p className="text-xs text-slate-300/90 line-clamp-2 leading-relaxed">
                {dest.description}
              </p>

              {/* Metadata: Best Time & Visa Preview */}
              <div className="grid grid-cols-2 gap-2 text-[11px] bg-white/5 rounded-xl p-2.5 border border-white/10">
                <div className="flex items-center gap-1.5 text-slate-300">
                  <span className="material-symbols-outlined text-sm text-sky-400">calendar_today</span>
                  <span className="truncate">{dest.bestTimeToVisit}</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-300 font-bold">
                  <span className="material-symbols-outlined text-sm text-emerald-400">verified_user</span>
                  <span className="truncate">Visa: {dest.visaFee || getVisaFeeForDestination(dest.country || dest.name)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 pt-2 border-t border-white/10">
                <button
                  onClick={() => onSelectDestination(dest)}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-sky-400 to-cyan-400 hover:from-sky-300 hover:to-cyan-300 text-slate-950 font-bold text-xs transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <span className="material-symbols-outlined text-base">visibility</span>
                  <span>Explore Destination</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleOpenVisaQuote(dest.country || dest.name)}
                    className="py-2 px-2 rounded-xl bg-white/5 hover:bg-white/10 text-emerald-300 border border-emerald-400/30 text-[11px] font-semibold transition-all flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-xs">verified</span>
                    <span>Visa Info</span>
                  </button>

                  <button
                    onClick={() => handleOpenFlightQuote(dest.name, dest.country)}
                    className="py-2 px-2 rounded-xl bg-white/5 hover:bg-white/10 text-sky-300 border border-sky-400/30 text-[11px] font-semibold transition-all flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-xs">flight_takeoff</span>
                    <span>Flight Quote</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sub-Modals for direct card actions */}
      {visaModalCountry && (
        <VisaQuoteModal
          isOpen={!!visaModalCountry}
          onClose={() => setVisaModalCountry(null)}
          initialCountry={visaModalCountry}
        />
      )}

      {flightModalDest && (
        <FlightQuoteModal
          isOpen={!!flightModalDest}
          onClose={() => setFlightModalDest(null)}
          initialDestination={flightModalDest}
        />
      )}
    </section>
  );
};
