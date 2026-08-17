import React, { useState } from 'react';
import {
  MapPin,
  Calendar,
  Users,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Plane,
  Clock,
  Coins,
  Headphones,
  ExternalLink,
} from 'lucide-react';
import { FlightSearchForm, FlightSearchParams } from './FlightSearchForm';
import { AffiliateDisclosure } from './AffiliateDisclosure';
import { POPULAR_AIRPORTS, buildAviasalesSearchUrl } from '../data/flightsData';
import { AZRAQ_AGENCY_CONFIG } from '../data/agencyConfig';

interface HeroSectionProps {
  onPlanTripPrompt?: (promptText: string) => void;
  onRequestQuote?: () => void;
  onExploreDestinations: () => void;
  onExplorePackages?: () => void;
  onSearchFlights?: (params: FlightSearchParams) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onPlanTripPrompt,
  onRequestQuote,
  onExploreDestinations,
  onExplorePackages,
  onSearchFlights,
}) => {
  const handleFlightSearch = (params: FlightSearchParams) => {
    if (onSearchFlights) {
      onSearchFlights(params);
    } else {
      const url = buildAviasalesSearchUrl({
        origin: params.origin.code,
        destination: params.destination.code,
        departDate: params.departureDate,
        returnDate: params.tripType === 'round' ? params.returnDate : undefined,
        adults: params.adults,
        children: params.children,
        infants: params.infants,
        cabin: params.cabinClass,
        tripType: params.tripType,
        source: 'homepage_hero',
      });
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 my-2">
      {/* 1. Cinematic Hero Section with Aircraft / Luxury Travel Atmospheric Backdrop */}
      <section className="relative overflow-hidden rounded-3xl border border-sky-400/25 bg-[#071A33] min-h-[540px] sm:min-h-[600px] p-6 sm:p-10 md:p-12 shadow-2xl flex flex-col justify-between">
        {/* Full-width premium aircraft & luxury travel photography backdrop */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <img
            src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=2400&q=85"
            alt="Aircraft wing above clouds with golden travel atmosphere"
            loading="eager"
            fetchPriority="high"
            className="w-full h-full object-cover object-center filter saturate-110"
          />
          {/* Dark luxury navy gradient overlay for pristine text and widget contrast */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#071A33]/95 via-[#071A33]/85 to-[#071A33]/40"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#071A33] via-transparent to-transparent sm:hidden"></div>
        </div>

        {/* Hero Top & Typography */}
        <div className="relative z-10 max-w-2xl space-y-3.5 pt-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0D6EFD]/20 border border-[#0D6EFD]/40 text-[#22C7C9] text-xs font-bold uppercase tracking-wider shadow-md backdrop-blur-md">
            <Plane className="w-3.5 h-3.5" />
            <span>Azraq Tours & Travels • Official Aviasales Partner</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif-display font-extrabold text-white tracking-tight leading-[1.15] drop-shadow-md">
            Where Will You <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-sky-100 to-[#22C7C9]">
              Fly Next?
            </span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-sky-100/90 leading-relaxed font-normal max-w-xl">
            Compare flight options and discover great fares for your next journey from Bangladesh.
          </p>

          {/* CTAs & Secondary Links */}
          <div className="flex flex-wrap items-center gap-3.5 pt-1">
            <button
              onClick={onExploreDestinations}
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#22C7C9] hover:text-white border border-[#22C7C9]/40 font-bold text-xs sm:text-sm transition-all shadow-md backdrop-blur-md cursor-pointer flex items-center gap-2"
            >
              <MapPin className="w-4 h-4 text-[#22C7C9]" />
              <span>Explore Popular Destinations</span>
            </button>

            {onRequestQuote && (
              <button
                onClick={onRequestQuote}
                className="px-5 py-2.5 rounded-xl bg-[#0D6EFD]/40 hover:bg-[#0D6EFD]/60 text-white font-bold text-xs sm:text-sm transition-all border border-[#0D6EFD]/50 cursor-pointer flex items-center gap-1.5"
              >
                <span>Request Custom Quote</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* 2. Prominent Flight Search Widget Placed Directly Underneath */}
        <div className="relative z-10 w-full pt-6 sm:pt-8 space-y-3">
          <FlightSearchForm
            variant="hero"
            onSearch={handleFlightSearch}
            sourceTag="homepage_hero_widget"
          />

          {/* Hero Affiliate Micro Disclosure */}
          <div className="flex items-center justify-between gap-3 text-xs text-sky-200/80 px-2 flex-wrap">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-[#22C7C9]" />
              <span>Flight search and booking powered by Aviasales • Real-time airline fares</span>
            </div>
            <a
              href="https://www.aviasales.com/?params=DAC1"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#22C7C9] hover:underline flex items-center gap-1 font-semibold"
            >
              <span>Aviasales Gateway (DAC)</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </section>

      {/* 3. Trust & Concierge Strip */}
      <section className="w-full rounded-2xl p-4 sm:p-5 bg-[#EAF7FF] border border-sky-200 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 text-slate-800">
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/80 border border-sky-100 shadow-2xs">
            <div className="w-9 h-9 rounded-xl bg-[#0D6EFD]/10 text-[#0D6EFD] flex items-center justify-center shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#071A33]">Dhaka Travel Desk</h4>
              <p className="text-[11px] text-slate-600">Gulshan-2, Dhaka</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/80 border border-sky-100 shadow-2xs">
            <div className="w-9 h-9 rounded-xl bg-[#0D6EFD]/10 text-[#0D6EFD] flex items-center justify-center shrink-0">
              <Plane className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#071A33]">Live Flight Comparison</h4>
              <p className="text-[11px] text-slate-600">Official Aviasales partner</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/80 border border-sky-100 shadow-2xs">
            <div className="w-9 h-9 rounded-xl bg-[#22C7C9]/15 text-teal-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#071A33]">Visa Assistance</h4>
              <p className="text-[11px] text-slate-600">Document checklists & review</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/80 border border-sky-100 shadow-2xs">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#071A33]">No Invented Prices</h4>
              <p className="text-[11px] text-slate-600">100% transparent rates</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/80 border border-sky-100 shadow-2xs">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-700 flex items-center justify-center shrink-0">
              <Headphones className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#071A33]">24/7 WhatsApp Hotline</h4>
              <p className="text-[11px] text-slate-600">+880 1851-172032</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
