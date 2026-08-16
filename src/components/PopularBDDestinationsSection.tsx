import React, { useState, useMemo } from 'react';
import {
  MapPin,
  Star,
  ArrowRight,
  ShieldCheck,
  Plane,
  Eye,
} from 'lucide-react';
import { Destination } from '../types';
import { POPULAR_BANGLADESHI_DESTINATIONS } from '../data/popularBangladeshiDestinations';
import { VisaQuoteModal } from './VisaQuoteModal';
import { FlightQuoteModal } from './FlightQuoteModal';
import { useAuth } from '../context/AuthContext';
import { getVisaFeeForDestination } from '../data/visaRequirementsData';
import { getOptimizedUnsplashUrl, getUnsplashSrcSet } from '../utils/imageOptimization';

interface PopularBDDestinationsSectionProps {
  onSelectDestination: (destination: Destination) => void;
  onPlanTripPrompt?: (promptText: string) => void;
}

export const PopularBDDestinationsSection: React.FC<PopularBDDestinationsSectionProps> = ({
  onSelectDestination,
}) => {
  const { requireAuth } = useAuth();
  
  // State for sub-modals (Visa and Flight quote directly from card)
  const [visaModalCountry, setVisaModalCountry] = useState<string | null>(null);
  const [flightModalDest, setFlightModalDest] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'Beach' | 'City' | 'Culture' | 'Luxury'>('All');

  // Featured 4 core destinations matching the primary editorial list: Maldives, Dubai, Kuala Lumpur, Bangkok
  const featuredFourDestinations = useMemo(() => {
    const keyNames = ['Maldives', 'Dubai', 'Kuala Lumpur', 'Bangkok'];
    const matched = keyNames.map((name) =>
      POPULAR_BANGLADESHI_DESTINATIONS.find((d) =>
        d.name.toLowerCase().includes(name.toLowerCase()) || d.country.toLowerCase().includes(name.toLowerCase())
      )
    ).filter(Boolean) as Destination[];

    // Fallback if any not found
    if (matched.length < 4) {
      return POPULAR_BANGLADESHI_DESTINATIONS.slice(0, 4);
    }
    return matched.slice(0, 4);
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
    <section className="w-full flex flex-col gap-6 my-6" id="popular-destinations">
      {/* Section Header with exact heading and Right-aligned "View all destinations" */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-sky-400/20">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0D6EFD]/15 border border-[#0D6EFD]/30 text-[#00d2ff] text-xs font-bold uppercase tracking-wider">
            <MapPin className="w-3.5 h-3.5 text-[#22C7C9]" />
            <span>Top Escapes for Bangladeshi Travelers</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif-display font-extrabold text-white tracking-tight">
            Popular destinations for Bangladeshi travelers
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Handpicked places, unforgettable experiences.
          </p>
        </div>

        <button
          onClick={() => {
            const hub = document.getElementById('destination-hub');
            hub?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#22C7C9] hover:text-white transition-colors cursor-pointer shrink-0 self-start sm:self-end"
        >
          <span>View all destinations</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Grid of 4 Equal-width Destination Cards in One Row (Desktop 4 cols, Tablet 2 cols, Mobile 1 col) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-7xl mx-auto w-full">
        {featuredFourDestinations.map((dest) => (
          <div
            key={`featured-${dest.id}`}
            className="group rounded-2xl sm:rounded-3xl overflow-hidden bg-white text-slate-900 border border-slate-200/80 hover:border-[#0D6EFD] transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-blue-900/20 flex flex-col justify-between hover:-translate-y-1"
          >
            {/* Top Image with Location Pin Badge */}
            <div
              className="relative h-48 sm:h-52 overflow-hidden bg-slate-100 cursor-pointer"
              onClick={() => onSelectDestination(dest)}
            >
              <img
                src={getOptimizedUnsplashUrl(dest.imageUrl, 600, 80)}
                srcSet={getUnsplashSrcSet(dest.imageUrl, [300, 600, 800], 80)}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 280px"
                alt={dest.name}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              
              {/* Location Pin Badge over Image */}
              <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#071A33]/80 backdrop-blur-md border border-white/20 text-xs font-bold text-white flex items-center gap-1.5 shadow-md">
                <MapPin className="w-3.5 h-3.5 text-[#22C7C9]" />
                <span>{dest.cityRegion || dest.country}</span>
              </div>

              {/* Star Rating Badge */}
              <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-amber-500 font-bold text-xs flex items-center gap-1 shadow-sm">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="text-slate-900 font-extrabold">{dest.rating}</span>
              </div>
            </div>

            {/* Clean White Content Area */}
            <div className="p-4 sm:p-5 flex flex-col gap-3 flex-1 justify-between bg-white">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-semibold text-[#0D6EFD] uppercase tracking-wider text-[10px]">{dest.country}</span>
                  <span className="text-[11px] text-slate-400">480+ reviews</span>
                </div>
                <h3
                  onClick={() => onSelectDestination(dest)}
                  className="text-base sm:text-lg font-bold text-[#071A33] group-hover:text-[#0D6EFD] transition-colors cursor-pointer line-clamp-1"
                >
                  {dest.name}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {dest.description}
                </p>
              </div>

              {/* Fee & Visa Tag */}
              <div className="p-2.5 rounded-xl bg-[#EAF7FF] border border-sky-200/80 flex items-center justify-between text-[11px]">
                <span className="text-slate-600">Visa:</span>
                <span className="font-bold text-[#0D6EFD] font-mono">
                  {dest.visaFee || getVisaFeeForDestination(dest.country || dest.name)}
                </span>
              </div>

              {/* Action Links */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <button
                  onClick={() => onSelectDestination(dest)}
                  className="text-xs font-extrabold text-[#0D6EFD] hover:text-blue-700 flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <span>Explore</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenVisaQuote(dest.country || dest.name)}
                    className="px-2 py-1 rounded-lg text-[10px] font-bold bg-teal-50 text-teal-700 hover:bg-teal-100 border border-teal-200 transition-all cursor-pointer"
                  >
                    Visa Guide
                  </button>
                  <button
                    onClick={() => handleOpenFlightQuote(dest.name, dest.country)}
                    className="px-2 py-1 rounded-lg text-[10px] font-bold bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200 transition-all cursor-pointer"
                  >
                    Flights
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

