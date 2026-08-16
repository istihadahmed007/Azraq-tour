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
} from 'lucide-react';

interface HeroSectionProps {
  onPlanTripPrompt: (promptText: string) => void;
  onRequestQuote: () => void;
  onExploreDestinations: () => void;
  onExplorePackages?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onPlanTripPrompt,
  onRequestQuote,
  onExploreDestinations,
  onExplorePackages,
}) => {
  const [destinationQuery, setDestinationQuery] = useState('');
  const [travelDates, setTravelDates] = useState('');
  const [travelersCount, setTravelersCount] = useState('1 Traveler, Economy');

  const handlePlanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const queryParts = [
      destinationQuery || 'Asian Escape',
      travelDates ? `for ${travelDates}` : '',
      travelersCount ? `(${travelersCount})` : '',
    ]
      .filter(Boolean)
      .join(' ');
    onPlanTripPrompt(queryParts || 'Curated Asian Escape from Dhaka');
  };

  const quickStartChips = [
    { label: '🏖️ Maldives Overwater', prompt: '5-Day luxury overwater villa honeymoon in Maldives with speed boat transfer' },
    { label: '🏙️ Dubai Luxury Tour', prompt: '5-Day Dubai desert safari, Burj Khalifa, and UAE tourist visa guidance' },
    { label: '🌴 Bangkok & Phuket', prompt: '6-Day family holiday in Bangkok and Phuket with halal food and island tour' },
    { label: '🛍️ Kuala Lumpur City', prompt: '4-Day budget friendly tour in Kuala Lumpur and Genting Highlands from Dhaka' },
    { label: '✨ Singapore Marina', prompt: '4-Day Singapore Marina Bay Sands and Universal Studios holiday package' },
  ];

  return (
    <div className="w-full flex flex-col gap-6 my-2">
      {/* 1. Cinematic Hero Section (16:9 editorial landscape feel) */}
      <section className="relative overflow-hidden rounded-3xl border border-sky-400/25 bg-[#071A33] min-h-[520px] sm:min-h-[580px] p-6 sm:p-10 md:p-14 shadow-2xl flex flex-col justify-between">
        {/* Full-width cinematic tropical Asian beach photograph background */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <img
            src="https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=2200&q=85"
            alt="Cinematic tropical Asian beach with turquoise water and limestone cliffs"
            loading="eager"
            fetchPriority="high"
            className="w-full h-full object-cover object-center filter saturate-110"
          />
          {/* Subtle dark navy gradient overlay on left for crystal-clear readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#071A33]/95 via-[#071A33]/80 sm:via-[#071A33]/70 to-[#071A33]/30"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#071A33] via-transparent to-transparent sm:hidden"></div>
        </div>

        {/* Hero Top & Typography (Left-aligned luxury editorial) */}
        <div className="relative z-10 max-w-2xl space-y-4 pt-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0D6EFD]/20 border border-[#0D6EFD]/40 text-[#22C7C9] text-xs font-bold uppercase tracking-wider shadow-md backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#22C7C9] animate-pulse"></span>
            <span>Dhaka Travel Desk • Official Concierge</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif-display font-extrabold text-white tracking-tight leading-[1.15] drop-shadow-md">
            Your Gateway to <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-sky-100 to-[#22C7C9]">
              Curated Asian Escapes
            </span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-sky-100/90 leading-relaxed font-normal max-w-xl">
            Personalized flights, visas, and itineraries crafted for Bangladeshi travelers.
          </p>

          {/* Hero CTAs */}
          <div className="flex flex-wrap items-center gap-3.5 pt-2">
            <button
              onClick={onRequestQuote}
              className="px-6 sm:px-7 py-3.5 rounded-2xl bg-[#0D6EFD] hover:bg-blue-600 text-white font-extrabold text-xs sm:text-sm transition-all duration-200 ease-out shadow-lg shadow-blue-600/30 hover:scale-[1.02] active:scale-98 cursor-pointer flex items-center gap-2"
            >
              <span>Request a Quote</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onExploreDestinations}
              className="px-6 sm:px-7 py-3.5 rounded-2xl bg-[#071A33]/70 hover:bg-[#071A33] text-[#22C7C9] hover:text-white border border-[#22C7C9]/60 hover:border-[#22C7C9] font-bold text-xs sm:text-sm transition-all duration-200 shadow-md backdrop-blur-md active:scale-98 cursor-pointer flex items-center gap-2"
            >
              <MapPin className="w-4 h-4 text-[#22C7C9]" />
              <span>Explore Destinations</span>
            </button>
          </div>
        </div>

        {/* Translucent Travel Planning Bar near bottom of hero */}
        <div className="relative z-10 w-full pt-8 sm:pt-10">
          <form
            onSubmit={handlePlanSubmit}
            className="w-full rounded-2xl sm:rounded-3xl p-3 sm:p-4 bg-[#071A33]/85 backdrop-blur-xl border border-white/20 shadow-2xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-center"
          >
            {/* Input 1: Destination */}
            <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-[#22C7C9]/50 transition-colors">
              <MapPin className="w-5 h-5 text-[#22C7C9] shrink-0" />
              <div className="flex flex-col w-full text-left">
                <span className="text-[11px] font-bold text-slate-200">Where do you want to go?</span>
                <input
                  type="text"
                  value={destinationQuery}
                  onChange={(e) => setDestinationQuery(e.target.value)}
                  placeholder="Search destinations (e.g. Maldives)"
                  className="bg-transparent text-xs text-white placeholder-slate-400 focus:outline-none w-full"
                />
              </div>
            </div>

            {/* Input 2: Dates */}
            <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-[#22C7C9]/50 transition-colors">
              <Calendar className="w-5 h-5 text-[#22C7C9] shrink-0" />
              <div className="flex flex-col w-full text-left">
                <span className="text-[11px] font-bold text-slate-200">Travel dates</span>
                <input
                  type="text"
                  value={travelDates}
                  onChange={(e) => setTravelDates(e.target.value)}
                  placeholder="Select dates (e.g. Nov 2026)"
                  className="bg-transparent text-xs text-white placeholder-slate-400 focus:outline-none w-full"
                />
              </div>
            </div>

            {/* Input 3: Travelers */}
            <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-[#22C7C9]/50 transition-colors">
              <Users className="w-5 h-5 text-[#22C7C9] shrink-0" />
              <div className="flex flex-col w-full text-left">
                <span className="text-[11px] font-bold text-slate-200">Travelers</span>
                <select
                  value={travelersCount}
                  onChange={(e) => setTravelersCount(e.target.value)}
                  className="bg-transparent text-xs text-white focus:outline-none cursor-pointer w-full"
                >
                  <option value="1 Traveler, Economy" className="bg-[#071A33] text-white">1 Traveler, Economy</option>
                  <option value="2 Travelers, Couple" className="bg-[#071A33] text-white">2 Travelers, Couple</option>
                  <option value="Family (3-4 Persons)" className="bg-[#071A33] text-white">Family (3-4 Persons)</option>
                  <option value="Group (5+ Persons)" className="bg-[#071A33] text-white">Group (5+ Persons)</option>
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full h-full min-h-[46px] px-6 py-3 rounded-xl bg-[#0D6EFD] hover:bg-blue-600 text-white font-bold text-xs sm:text-sm transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Plan my trip</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick-Start Chips */}
          <div className="flex flex-wrap items-center gap-2 mt-3 text-xs">
            <span className="text-[11px] text-slate-300 font-medium">Quick Ideas:</span>
            {quickStartChips.map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onPlanTripPrompt(chip.prompt)}
                className="px-2.5 py-1 rounded-lg bg-black/40 hover:bg-[#0D6EFD]/30 text-sky-200 hover:text-white border border-white/10 transition-colors text-[11px] cursor-pointer"
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Four-Column Trust Strip (Light sky-blue aesthetic #EAF7FF) */}
      <section className="w-full rounded-2xl p-5 sm:p-6 bg-[#EAF7FF] border border-sky-200 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 text-slate-800">
          {/* Col 1 */}
          <div className="flex items-center gap-3.5 p-2">
            <div className="w-11 h-11 rounded-xl bg-[#0D6EFD]/10 text-[#0D6EFD] flex items-center justify-center shrink-0 border border-[#0D6EFD]/20">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-[#071A33]">Personalized Pricing</h4>
              <p className="text-[11px] sm:text-xs text-slate-600">Quotes tailored to you</p>
            </div>
          </div>

          {/* Col 2 */}
          <div className="flex items-center gap-3.5 p-2">
            <div className="w-11 h-11 rounded-xl bg-[#22C7C9]/15 text-teal-700 flex items-center justify-center shrink-0 border border-[#22C7C9]/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-[#071A33]">Visa Assistance</h4>
              <p className="text-[11px] sm:text-xs text-slate-600">End-to-end visa support</p>
            </div>
          </div>

          {/* Col 3 */}
          <div className="flex items-center gap-3.5 p-2">
            <div className="w-11 h-11 rounded-xl bg-[#0D6EFD]/10 text-[#0D6EFD] flex items-center justify-center shrink-0 border border-[#0D6EFD]/20">
              <Plane className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-[#071A33]">Top Airline Options</h4>
              <p className="text-[11px] sm:text-xs text-slate-600">Best routes, best fares</p>
            </div>
          </div>

          {/* Col 4 */}
          <div className="flex items-center gap-3.5 p-2">
            <div className="w-11 h-11 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center shrink-0 border border-amber-500/20">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-[#071A33]">24/7 Travel Support</h4>
              <p className="text-[11px] sm:text-xs text-slate-600">We’re here anytime</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};


