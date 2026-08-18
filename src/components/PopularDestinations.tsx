import React, { useState } from 'react';
import {
  Plane,
  ArrowRight,
  ExternalLink,
  Sparkles,
  MapPin,
  Clock,
  ShieldCheck,
  Search,
} from 'lucide-react';
import {
  POPULAR_DESTINATIONS_FROM_BD,
  DestinationCardItem,
  buildAviasalesSearchUrl,
  trackFlightSearchEvent,
} from '../data/flightsData';

interface PopularDestinationsProps {
  onSelectDestination?: (code: string) => void;
  className?: string;
}

export const PopularDestinations: React.FC<PopularDestinationsProps> = ({
  onSelectDestination,
  className = '',
}) => {
  const [filterRegion, setFilterRegion] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filtered = POPULAR_DESTINATIONS_FROM_BD.filter((item) => {
    const matchesRegion = filterRegion === 'all' || item.region === filterRegion;
    const q = searchQuery.toLowerCase();
    const matchesQuery =
      !searchQuery ||
      item.city.toLowerCase().includes(q) ||
      item.country.toLowerCase().includes(q) ||
      item.code.toLowerCase().includes(q) ||
      item.popularReason.toLowerCase().includes(q);
    return matchesRegion && matchesQuery;
  });

  const handleCardSearch = (dest: DestinationCardItem) => {
    trackFlightSearchEvent('destination_card_clicked', {
      city: dest.city,
      code: dest.code,
      country: dest.country,
      source: 'popular_destinations_section',
    });

    if (onSelectDestination) {
      onSelectDestination(dest.code);
    } else {
      const url = buildAviasalesSearchUrl({
        origin: 'DAC',
        destination: dest.code,
        adults: 1,
        source: 'popular_destinations',
      });
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <section className={`w-full space-y-6 ${className}`}>
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-bold uppercase tracking-wider mb-2">
            <Plane className="w-3.5 h-3.5" />
            <span>Direct & 1-Stop Hubs</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif-display font-extrabold text-slate-900 tracking-tight">
            Popular Flight Destinations from Bangladesh
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mt-1">
            Explore high-demand international routes originating from Hazrat Shahjalal International Airport (DAC) and major Bangladesh terminals.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Filter by city, code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-blue-500 w-40 sm:w-48"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs overflow-x-auto max-w-full">
            {['all', 'Asia', 'Middle East', 'Europe', 'North America', 'Australia & Oceania', 'Africa'].map(
              (r) => (
                <button
                  key={r}
                  onClick={() => setFilterRegion(r)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    filterRegion === r
                      ? 'bg-white text-blue-600 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {r === 'all' ? 'All' : r}
                </button>
              )
            )}
          </div>
        </div>
      </div>

      {/* Grid of Destination Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
        {filtered.map((dest) => (
          <div
            key={dest.id}
            className="group rounded-2xl bg-white border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1"
          >
            {/* Image & Badges */}
            <div className="relative h-44 overflow-hidden bg-slate-100">
              <img
                src={dest.imageUrl}
                alt={`${dest.city}, ${dest.country}`}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>

              {/* Airport Code Badge */}
              <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-slate-950/75 backdrop-blur-md border border-white/20 text-white font-mono text-xs font-bold flex items-center gap-1 shadow-md">
                <Plane className="w-3 h-3 text-sky-400" />
                <span>{dest.code}</span>
              </div>

              {/* Flight Duration from DAC */}
              <div className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-sm text-slate-800 text-[10px] font-bold flex items-center gap-1 shadow-sm">
                <Clock className="w-2.5 h-2.5 text-blue-600" />
                <span>{dest.flightDurationFromDAC}</span>
              </div>

              {/* City & Country Title over Image */}
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <h3 className="text-lg font-bold font-serif-display leading-tight drop-shadow-sm">
                  {dest.city}
                </h3>
                <p className="text-xs text-sky-200 font-medium">{dest.country}</p>
              </div>
            </div>

            {/* Content & Details */}
            <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {dest.popularReason}
                </p>

                {/* Visa Note */}
                <div className="text-[11px] text-slate-500 flex items-center gap-1.5 pt-1 border-t border-slate-100">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="truncate">{dest.visaRequirement}</span>
                </div>
              </div>

              {/* Action Button: Search Flights via Aviasales */}
              <button
                type="button"
                onClick={() => handleCardSearch(dest)}
                className="w-full py-2.5 px-4 rounded-xl bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white font-bold text-xs transition-all duration-200 flex items-center justify-center gap-2 group-hover:bg-blue-600 group-hover:text-white shadow-xs cursor-pointer"
              >
                <span>Search Flights</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200">
          <p className="text-sm text-slate-600 font-medium">No destinations found matching your filter.</p>
        </div>
      )}
    </section>
  );
};
