import React from 'react';
import { Send, ShieldCheck, Clock, Award } from 'lucide-react';
import { AzraqTripFinder, FlightSearchParams } from '../AzraqTripFinder';
import { TourPackage } from '../../types';

interface HomeHeroProps {
  onSearchFlights: (params: FlightSearchParams) => void;
  onNavigateToView?: (view: string, extra?: any) => void;
  onPlanTripPrompt: (promptText: any) => void;
  onOpenVisaModal?: (country?: string) => void;
  onOpenQuote?: (pkg?: TourPackage) => void;
  onOpenVoiceModal?: (initialTranscript?: string) => void;
}

export const HomeHero: React.FC<HomeHeroProps> = ({
  onSearchFlights,
  onNavigateToView,
  onPlanTripPrompt,
  onOpenVisaModal,
  onOpenQuote,
  onOpenVoiceModal,
}) => {
  return (
    <section className="relative w-full text-white pt-8 sm:pt-14 pb-14 sm:pb-20 shadow-lg overflow-hidden bg-slate-950">
      {/* Wonderful Natural Landscape Background - Thailand Phang Nga Bay & Longtail Boat Scenery */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src="https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=2560&q=90"
          alt="Thailand James Bond Island and longtail boat in crystal turquoise bay"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center scale-100"
        />
        {/* Soft, minimal dark gradient strictly for white typography contrast, keeping the natural scenery 100% vibrant */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/25 to-black/60" />
      </div>

      {/* Decorative Paper-Airplane Flight Paths */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-40 z-1">
        {/* Subtle curved flight path vector */}
        <svg
          className="absolute -top-10 -right-20 w-[600px] h-[400px] text-white"
          viewBox="0 0 600 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M 10 350 Q 250 50 580 120"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeDasharray="8 8"
          />
        </svg>
        <div className="absolute top-20 right-28 animate-float">
          <Send className="w-8 h-8 text-white transform -rotate-12 drop-shadow-lg" />
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        {/* Brand Promise Header */}
        <div className="max-w-3xl text-left space-y-3.5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-xs font-semibold text-white shadow-md">
            <Send className="w-3.5 h-3.5 text-[#5BC7F4] transform -rotate-45" />
            <span className="tracking-wide uppercase font-mono text-[11px]">
              Azraq Travel Concierge · Dhaka to the World
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.12] font-poppins drop-shadow-md">
            Travel further. Plan smarter. Feel looked after.
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-slate-100 font-medium max-w-2xl leading-relaxed drop-shadow-sm">
            Compare flights worldwide, book handcrafted Asian tour packages, organize embassy visas, and experience 24/7 dedicated support from Bangladesh.
          </p>

          {/* Trust Chips Row */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/35 backdrop-blur-md border border-white/20 text-xs text-white shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5 text-[#5BC7F4]" />
              <span>Verified Visa Assistance</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/35 backdrop-blur-md border border-white/20 text-xs text-white shadow-sm">
              <Award className="w-3.5 h-3.5 text-amber-300" />
              <span>Gulshan-2 Travel Desk</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/35 backdrop-blur-md border border-white/20 text-xs text-white shadow-sm">
              <Clock className="w-3.5 h-3.5 text-[#5BC7F4]" />
              <span>Instant BDT Quotes</span>
            </div>
          </div>
        </div>

        {/* 5-Mode Travel Search & Conversion Engine (Floating Panel) */}
        <div className="w-full pt-2">
          <AzraqTripFinder
            initialMode="flights"
            onSearchFlights={onSearchFlights}
            onNavigateToView={(view, extra) => {
              if (extra?.prompt) onPlanTripPrompt(extra.prompt);
              else if (onNavigateToView) onNavigateToView(view);
            }}
            onOpenVisaModal={onOpenVisaModal}
            onOpenQuoteModal={onOpenQuote ? () => onOpenQuote() : undefined}
            onOpenVoiceModal={onOpenVoiceModal}
          />
        </div>
      </div>
    </section>
  );
};
