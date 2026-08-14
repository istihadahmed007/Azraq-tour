import React, { useState } from 'react';
import { Destination, Spot } from '../types';
import { InteractiveAsiaMap } from './InteractiveAsiaMap';
import { VisaQuoteModal } from './VisaQuoteModal';
import { FlightQuoteModal } from './FlightQuoteModal';

interface MapViewProps {
  destinations: Destination[];
  onSelectDestination: (destination: Destination) => void;
  selectedSpot?: Spot;
  onQuickGenerateItinerary?: (destName: string) => void;
}

export const MapView: React.FC<MapViewProps> = ({
  destinations,
  onSelectDestination,
  onQuickGenerateItinerary,
}) => {
  const [quoteCountry, setQuoteCountry] = useState<string | undefined>(undefined);
  const [isVisaModalOpen, setIsVisaModalOpen] = useState(false);
  const [isFlightModalOpen, setIsFlightModalOpen] = useState(false);

  const handleOpenQuotation = (countryOrName: string) => {
    setQuoteCountry(countryOrName);
    setIsVisaModalOpen(true);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pt-24 md:pt-12 pb-24 flex flex-col gap-8">
      {/* Map Header & Value Proposition */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/80 p-6 sm:p-8 rounded-3xl border border-sky-400/25 backdrop-blur-xl shadow-2xl">
        <div className="space-y-1 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 border border-sky-400/30 text-sky-300 text-xs font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            <span>Interactive Asia Corridor Map</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-serif-display font-extrabold text-white">
            Explore Asia by Region & Corridors
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed font-normal">
            Browse 15 handpicked destinations from South Asia to East Asia. View direct Dhaka flight corridors, instant visa classifications, and request customized travel quotes with a single tap.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={() => setIsVisaModalOpen(true)}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer min-h-[44px]"
          >
            <span className="material-symbols-outlined text-base">verified</span>
            <span>Visa Quote</span>
          </button>

          <button
            onClick={() => setIsFlightModalOpen(true)}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer min-h-[44px]"
          >
            <span className="material-symbols-outlined text-base">flight_takeoff</span>
            <span>Flight Quote</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Leaflet Asia Map */}
      <InteractiveAsiaMap
        destinations={destinations}
        onSelectDestination={onSelectDestination}
        onOpenQuotation={handleOpenQuotation}
        onQuickGenerateItinerary={onQuickGenerateItinerary}
      />

      {/* Key Corridors & Regional Insights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Dhaka ↔ Maldives & Island Escapes */}
        <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/90 border border-sky-400/20 backdrop-blur-md shadow-xl flex flex-col justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
              <span className="material-symbols-outlined text-base">beach_access</span>
              <span>Island & Beach Escapes</span>
            </div>
            <h3 className="text-lg font-bold text-white">Dhaka ↔ Maldives & Bali</h3>
            <p className="text-xs text-slate-300 leading-relaxed font-normal">
              Specialized fast-track resort bookings, seaplane transfers, and 30-day Visa-on-Arrival assistance for Bangladeshi passport holders.
            </p>
          </div>
          <button
            onClick={() => handleOpenQuotation('Maldives')}
            className="text-xs font-bold text-sky-400 hover:text-sky-200 flex items-center gap-1 cursor-pointer pt-2 border-t border-white/10"
          >
            <span>Quote Island Holiday</span>
            <span className="material-symbols-outlined text-xs">arrow_forward</span>
          </button>
        </div>

        {/* Card 2: ASEAN & Shopping Corridors */}
        <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/90 border border-sky-400/20 backdrop-blur-md shadow-xl flex flex-col justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sky-400 font-bold text-xs uppercase tracking-wider">
              <span className="material-symbols-outlined text-base">shopping_bag</span>
              <span>Southeast Asia Hubs</span>
            </div>
            <h3 className="text-lg font-bold text-white">Dhaka ↔ Bangkok & KL</h3>
            <p className="text-xs text-slate-300 leading-relaxed font-normal">
              High-frequency daily flights, Thai sticker visa documentation, Malaysian eVisa approvals, and medical tourism concierge.
            </p>
          </div>
          <button
            onClick={() => handleOpenQuotation('Thailand')}
            className="text-xs font-bold text-sky-400 hover:text-sky-200 flex items-center gap-1 cursor-pointer pt-2 border-t border-white/10"
          >
            <span>Quote ASEAN Package</span>
            <span className="material-symbols-outlined text-xs">arrow_forward</span>
          </button>
        </div>

        {/* Card 3: East Asia & Middle East Luxury */}
        <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/90 border border-sky-400/20 backdrop-blur-md shadow-xl flex flex-col justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
              <span className="material-symbols-outlined text-base">temple_buddhist</span>
              <span>East Asia & Gulf Luxury</span>
            </div>
            <h3 className="text-lg font-bold text-white">Dhaka ↔ Tokyo & Dubai</h3>
            <p className="text-xs text-slate-300 leading-relaxed font-normal">
              Japan Embassy visa consultation, Dubai multi-entry eVisas, luxury desert glamping, and seasonal cherry blossom tours.
            </p>
          </div>
          <button
            onClick={() => handleOpenQuotation('Japan')}
            className="text-xs font-bold text-sky-400 hover:text-sky-200 flex items-center gap-1 cursor-pointer pt-2 border-t border-white/10"
          >
            <span>Quote Japan & Dubai Trip</span>
            <span className="material-symbols-outlined text-xs">arrow_forward</span>
          </button>
        </div>
      </div>

      {/* Modals for Direct Quotation */}
      <VisaQuoteModal
        isOpen={isVisaModalOpen}
        onClose={() => {
          setIsVisaModalOpen(false);
          setQuoteCountry(undefined);
        }}
        initialCountry={quoteCountry}
      />

      <FlightQuoteModal
        isOpen={isFlightModalOpen}
        onClose={() => {
          setIsFlightModalOpen(false);
          setQuoteCountry(undefined);
        }}
        initialDestination={quoteCountry}
      />
    </div>
  );
};
