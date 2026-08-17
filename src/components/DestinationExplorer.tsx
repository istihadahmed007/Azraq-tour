import React, { useState } from 'react';
import {
  Globe2,
  Plane,
  ArrowRight,
  Sparkles,
  MapPin,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import {
  POPULAR_DESTINATIONS_FROM_BD,
  DestinationCardItem,
  buildAviasalesSearchUrl,
  trackFlightSearchEvent,
} from '../data/flightsData';

interface DestinationExplorerProps {
  onSelectDestination?: (code: string) => void;
  className?: string;
}

const REGION_CATEGORIES = [
  'Asia',
  'Middle East',
  'Europe',
  'North America',
  'Australia & Oceania',
  'Africa',
] as const;

export const DestinationExplorer: React.FC<DestinationExplorerProps> = ({
  onSelectDestination,
  className = '',
}) => {
  const [selectedRegion, setSelectedRegion] = useState<string>('Asia');

  const destinationsInRegion = POPULAR_DESTINATIONS_FROM_BD.filter(
    (d) => d.region === selectedRegion
  );

  const handleSearch = (item: DestinationCardItem) => {
    trackFlightSearchEvent('destination_card_clicked', {
      city: item.city,
      code: item.code,
      region: item.region,
      source: 'destination_explorer_category',
    });

    if (onSelectDestination) {
      onSelectDestination(item.code);
    } else {
      const url = buildAviasalesSearchUrl({
        origin: 'DAC',
        destination: item.code,
        adults: 1,
        source: 'destination_explorer',
      });
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <section className={`w-full space-y-6 ${className}`}>
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-2">
            <Globe2 className="w-3.5 h-3.5" />
            <span>Worldwide Network</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif-display font-extrabold text-slate-900 tracking-tight">
            Explore Flights Around the World
          </h2>
          <p className="text-sm text-slate-600 max-w-2xl mt-1">
            Browse international aviation routes by continent with live Aviasales rate comparisons and Bangladesh visa information.
          </p>
        </div>

        {/* Region Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100/90 rounded-2xl overflow-x-auto max-w-full">
          {REGION_CATEGORIES.map((region) => (
            <button
              key={region}
              type="button"
              onClick={() => setSelectedRegion(region)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedRegion === region
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              {region}
            </button>
          ))}
        </div>
      </div>

      {/* Destination Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
        {destinationsInRegion.map((dest) => (
          <div
            key={dest.id}
            className="group rounded-2xl bg-white border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
          >
            <div className="relative h-40 overflow-hidden bg-slate-100">
              <img
                src={dest.imageUrl}
                alt={`${dest.city}, ${dest.country}`}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>

              <div className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-md text-white font-mono text-xs font-bold border border-white/20">
                {dest.code}
              </div>

              <div className="absolute bottom-2.5 left-3 right-3 text-white">
                <h3 className="text-base font-bold font-serif-display leading-tight drop-shadow-xs">
                  {dest.city}
                </h3>
                <p className="text-xs text-sky-200">{dest.country}</p>
              </div>
            </div>

            <div className="p-3.5 space-y-2.5 flex-1 flex flex-col justify-between">
              <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                {dest.popularReason}
              </p>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                <span className="text-[11px] font-medium text-slate-500 truncate max-w-[150px]">
                  {dest.airportName}
                </span>
                <button
                  type="button"
                  onClick={() => handleSearch(dest)}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors flex items-center gap-1 shrink-0 shadow-xs cursor-pointer"
                >
                  <span>Search Flights</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
