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
  
  // State for sub-modals (Visa and Flight quote directly from card)
  const [visaModalCountry, setVisaModalCountry] = useState<string | null>(null);
  const [flightModalDest, setFlightModalDest] = useState<string | null>(null);

  // Top 6 featured spotlight destinations
  const featuredIds = ['kuala-lumpur-malaysia', 'bangkok-thailand', 'maldives-island', 'dubai-uae', 'singapore-city', 'bali-indonesia'];
  const featuredDestinations = useMemo(() => {
    return POPULAR_BANGLADESHI_DESTINATIONS.filter(d => featuredIds.includes(d.id));
  }, []);

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
