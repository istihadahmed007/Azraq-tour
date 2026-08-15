import React, { useState } from 'react';

interface HeroSectionProps {
  onPlanTripPrompt: (promptText: string) => void;
  onRequestQuote: () => void;
  onExploreDestinations: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onPlanTripPrompt,
  onRequestQuote,
  onExploreDestinations,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onPlanTripPrompt(searchQuery.trim());
    }
  };

  const samplePrompts = [
    "Cox's Bazar 120km Beach",
    'Overwater bungalows in Maldives',
    'Kuala Lumpur Petronas Towers',
    'Bangkok Temple & Street Food',
    'Dubai Desert Safari & Burj Khalifa',
  ];

  return (
    <section className="relative overflow-hidden rounded-3xl border border-sky-500/25 bg-slate-950 p-6 sm:p-10 md:p-14 text-center shadow-2xl flex flex-col items-center justify-center gap-6 my-2">
      {/* Background Cinematic Visual & Luxury Gradient Overlay */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1800&q=85"
          alt="Luxury Asian Travel Escapes"
          className="w-full h-full object-cover opacity-25 scale-105 filter saturate-125 transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/85 to-slate-950"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-sky-500/15 rounded-full blur-3xl"></div>
      </div>

      {/* Tagline / Eyebrow */}
      <div className="relative z-10 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-500/15 border border-sky-400/35 text-sky-300 text-xs sm:text-sm font-bold uppercase tracking-widest shadow-md">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span>Luxury AI Concierge</span>
      </div>

      {/* Main Serif Headline */}
      <div className="relative z-10 max-w-4xl space-y-3">
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif-display font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#e0f2fe] via-[#7dd3fc] to-[#38bdf8] drop-shadow-md leading-tight">
          Your Gateway to Curated Asian Escapes
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
          Your gateway to curated Asian escapes – personalized flights, visas, and itineraries crafted for Bangladeshi travelers.
        </p>
      </div>

      {/* Main CTA Buttons */}
      <div className="relative z-10 flex flex-wrap items-center justify-center gap-3 pt-2">
        <button
          onClick={onRequestQuote}
          className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-sky-400 via-cyan-400 to-sky-500 hover:from-sky-300 hover:to-cyan-300 text-slate-950 font-bold text-sm sm:text-base transition-all duration-200 ease-out shadow-xl shadow-sky-500/25 hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-lg">request_quote</span>
          <span>Request a Quote</span>
        </button>

        <button
          onClick={onExploreDestinations}
          className="px-6 py-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-sky-200 hover:text-white border border-sky-400/30 hover:border-sky-400/60 font-semibold text-sm sm:text-base transition-all duration-200 shadow-md active:scale-95 cursor-pointer flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-lg text-sky-400">explore</span>
          <span>Explore Destinations</span>
        </button>
      </div>

      {/* AI Search & Prompt Bar */}
      <div className="relative z-10 w-full max-w-3xl pt-2">
        <form
          onSubmit={handleSearchSubmit}
          className="relative flex items-center w-full shadow-2xl rounded-2xl overflow-hidden border border-sky-400/40 bg-slate-900/95 backdrop-blur-md transition-all focus-within:border-sky-400 focus-within:ring-2 focus-within:ring-sky-400/20"
        >
          <div className="pl-4 text-sky-400 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">auto_awesome</span>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Ask AI concierge (e.g., '5-day luxury honeymoon in Maldives' or 'Cox's Bazar family package')..."
            className="w-full py-4 pl-3 pr-28 bg-transparent text-sm md:text-base text-white placeholder-slate-400 focus:outline-none"
          />
          <button
            type="submit"
            className="absolute right-2 px-4 py-2 rounded-xl bg-gradient-to-r from-sky-400 to-cyan-400 hover:from-sky-300 hover:to-cyan-300 text-slate-950 font-bold text-xs md:text-sm transition-all shadow-md active:scale-95 flex items-center gap-1 cursor-pointer"
          >
            <span>Plan AI Trip</span>
            <span className="material-symbols-outlined text-base">arrow_forward</span>
          </button>
        </form>

        {/* Quick Inspiration Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-3 text-xs">
          <span className="text-slate-400 flex items-center gap-1">
            <span className="material-symbols-outlined text-xs text-sky-400">tips_and_updates</span>
            Trending:
          </span>
          {samplePrompts.map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onPlanTripPrompt(prompt)}
              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-sky-400/20 text-slate-300 hover:text-sky-300 border border-white/10 hover:border-sky-400/40 transition-colors text-[11px] cursor-pointer"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Trust Badges & Stats Row */}
      <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-4xl pt-4 border-t border-white/10 text-center">
        <div className="p-3 rounded-xl bg-white/5 border border-white/5">
          <div className="text-xl sm:text-2xl font-serif-display font-bold text-sky-400">500+</div>
          <div className="text-[11px] text-slate-300 font-medium">Happy BD Travelers</div>
        </div>
        <div className="p-3 rounded-xl bg-white/5 border border-white/5">
          <div className="text-xl sm:text-2xl font-serif-display font-bold text-emerald-400">50+</div>
          <div className="text-[11px] text-slate-300 font-medium">Countries Visa Support</div>
        </div>
        <div className="p-3 rounded-xl bg-white/5 border border-white/5">
          <div className="text-xl sm:text-2xl font-serif-display font-bold text-cyan-400">100%</div>
          <div className="text-[11px] text-slate-300 font-medium">Transparent Pricing</div>
        </div>
        <div className="p-3 rounded-xl bg-white/5 border border-white/5">
          <div className="text-xl sm:text-2xl font-serif-display font-bold text-purple-400">24/7</div>
          <div className="text-[11px] text-slate-300 font-medium">Dhaka Travel Desk</div>
        </div>
      </div>
    </section>
  );
};
