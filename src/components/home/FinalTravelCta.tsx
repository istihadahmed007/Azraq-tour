import React from 'react';
import { ArrowRight, Plane, MessageCircle } from 'lucide-react';

interface FinalTravelCtaProps {
  onPlanTrip: () => void;
  onNavigateToFlights?: () => void;
  onNavigateToContact?: () => void;
}

export const FinalTravelCta: React.FC<FinalTravelCtaProps> = ({
  onPlanTrip,
  onNavigateToFlights,
  onNavigateToContact,
}) => {
  return (
    <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
      <div className="relative rounded-3xl overflow-hidden text-white p-8 sm:p-14 text-center space-y-6 shadow-2xl">
        <img
          src="https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=2400&q=85"
          alt="Golden sunset ocean horizon and peaceful shoreline"
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#071A33]/95 via-[#00224F]/80 to-black/50" />

        <div className="relative z-10 max-w-2xl mx-auto space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300 font-mono">
              Start Exploring
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white font-poppins">
              Your next journey starts with a better plan.
            </h2>
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
              Let our Dhaka travel specialists craft a personalized itinerary with transparent rates, handpicked hotels, and end-to-end visa assistance.
            </p>
          </div>

          {/* Primary Action + Secondary Links */}
          <div className="flex flex-col items-center justify-center gap-4 pt-2">
            <button
              onClick={onPlanTrip}
              type="button"
              className="min-h-[50px] px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-emerald-400 text-slate-950 font-extrabold text-sm sm:text-base shadow-xl hover:brightness-110 active:scale-97 transition-all flex items-center justify-center gap-2 cursor-pointer font-poppins"
            >
              <span>Plan My Trip</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </button>

            <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-sky-200">
              {onNavigateToFlights && (
                <button
                  type="button"
                  onClick={onNavigateToFlights}
                  className="hover:text-white hover:underline flex items-center gap-1.5 cursor-pointer py-1"
                >
                  <Plane className="w-3.5 h-3.5" />
                  <span>Search Flights</span>
                </button>
              )}
              <span className="text-white/30 hidden sm:inline">•</span>
              <a
                href="https://wa.me/8801851172032?text=Hello%20Azraq!%20I%20would%20like%20assistance%20with%20travel%20planning."
                target="_blank"
                rel="noreferrer"
                className="hover:text-white hover:underline flex items-center gap-1.5 cursor-pointer py-1"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>Contact Azraq Support on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
