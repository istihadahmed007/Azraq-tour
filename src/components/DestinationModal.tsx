import React, { useState } from 'react';
import { Destination } from '../types';
import { useAuth } from '../context/AuthContext';
import { VisaQuoteModal } from './VisaQuoteModal';
import { FlightQuoteModal } from './FlightQuoteModal';

interface DestinationModalProps {
  destination: Destination | null;
  onClose: () => void;
  onGenerateItinerary: (destName: string) => void;
}

export const DestinationModal: React.FC<DestinationModalProps> = ({
  destination,
  onClose,
  onGenerateItinerary,
}) => {
  const { requireAuth } = useAuth();
  const [isVisaModalOpen, setIsVisaModalOpen] = useState(false);
  const [isFlightModalOpen, setIsFlightModalOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  if (!destination) return null;

  const attractions = destination.popularAttractions || destination.highlights || [];
  const activities = destination.thingsToDo || [];
  const foods = destination.localFood || [];
  const tips = destination.travelTips || [];

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
        <div
          onClick={(e) => e.stopPropagation()}
          className="glass-card rounded-3xl max-w-3xl w-full overflow-hidden border border-white/20 shadow-2xl flex flex-col max-h-[92vh] relative my-auto"
        >
          {/* Top Image Hero Banner */}
          <div className="relative h-64 md:h-80 w-full shrink-0 overflow-hidden">
            <img
              src={destination.imageUrl}
              alt={destination.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#111316] via-black/40 to-black/20"></div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/60 backdrop-blur-md text-white hover:bg-black flex items-center justify-center transition-all border border-white/20 shadow-lg z-10"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>

            {/* Category & Badge */}
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <span className="bg-sky-500/80 backdrop-blur-md text-white font-bold text-xs px-3 py-1 rounded-full shadow-md border border-white/20 flex items-center gap-1">
                <span>{destination.flag || '📍'}</span>
                <span>{destination.category}</span>
              </span>
              {destination.badge && (
                <span className="bg-amber-500/80 backdrop-blur-md text-slate-950 font-bold text-xs px-3 py-1 rounded-full shadow-md">
                  {destination.badge}
                </span>
              )}
            </div>

            {/* Hero Title & Location */}
            <div className="absolute bottom-4 left-6 right-6 flex flex-col md:flex-row md:items-end justify-between gap-2">
              <div>
                <div className="flex items-center gap-2 text-sky-300 text-xs font-semibold uppercase tracking-wider">
                  <span>{destination.flag} {destination.country}</span>
                  <span>•</span>
                  <span>{destination.cityRegion}</span>
                </div>
                <h2 className="font-serif-display text-3xl md:text-4xl font-bold text-white drop-shadow-md mt-0.5">
                  {destination.name}
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <span className="bg-black/60 backdrop-blur-md text-amber-400 font-bold text-xs px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">star</span>
                  {destination.rating} / 5.0
                </span>
              </div>
            </div>
          </div>

          {/* Modal Body Scrollable */}
          <div className="p-6 md:p-8 flex flex-col gap-6 overflow-y-auto hide-scrollbar text-on-surface">
            
            {/* Quick Specs Grid Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white/5 rounded-2xl p-4 border border-white/10">
              <div className="flex flex-col">
                <span className="text-[10px] text-outline uppercase font-semibold">Best Time</span>
                <span className="text-xs text-sky-300 font-semibold mt-1 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">calendar_month</span>
                  {destination.bestTimeToVisit || 'Nov - Mar'}
                </span>
              </div>

              <div className="flex flex-col">
                <span className="text-[10px] text-outline uppercase font-semibold">Recommended</span>
                <span className="text-xs text-emerald-300 font-semibold mt-1 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">schedule</span>
                  {destination.recommendedDays || '3-5 Days'}
                </span>
              </div>

              <div className="flex flex-col">
                <span className="text-[10px] text-outline uppercase font-semibold">Estimated Budget</span>
                <span className="text-xs text-amber-300 font-semibold mt-1 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">payments</span>
                  {destination.estimatedBudget || '$200 - $500'}
                </span>
              </div>

              <div className="flex flex-col">
                <span className="text-[10px] text-outline uppercase font-semibold">Currency</span>
                <span className="text-xs text-purple-300 font-semibold mt-1 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">currency_exchange</span>
                  {destination.currency || 'Local Currency'}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h3 className="font-serif-display text-lg text-primary font-semibold flex items-center gap-2">
                <span className="material-symbols-outlined text-base">explore</span>
                About {destination.name}
              </h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                {destination.description}
              </p>
            </div>

            {/* Visa Info Box */}
            {destination.visaInfo && (
              <div className="p-4 rounded-2xl bg-sky-500/10 border border-sky-400/20 flex items-start gap-3">
                <span className="material-symbols-outlined text-sky-400 text-xl shrink-0 mt-0.5">verified_user</span>
                <div className="text-xs space-y-0.5">
                  <span className="font-bold text-sky-300 uppercase tracking-wide block">Visa Information</span>
                  <p className="text-slate-200">{destination.visaInfo}</p>
                </div>
              </div>
            )}

            {/* Attractions & Activities Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Popular Attractions */}
              {attractions.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-amber-400 text-base">castle</span>
                    Popular Attractions
                  </h4>
                  <ul className="space-y-2">
                    {attractions.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-xs text-slate-300 bg-white/5 p-2.5 rounded-xl border border-white/5">
                        <span className="text-amber-400 font-bold">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Things to Do */}
              {activities.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-sky-400 text-base">surfing</span>
                    Things to Do & Activities
                  </h4>
                  <ul className="space-y-2">
                    {activities.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-xs text-slate-300 bg-white/5 p-2.5 rounded-xl border border-white/5">
                        <span className="text-sky-400 font-bold">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Local Food & Travel Tips */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Local Food */}
              {foods.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-emerald-400 text-base">restaurant</span>
                    Local Food & Dishes to Try
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {foods.map((food, idx) => (
                      <span key={idx} className="text-xs bg-emerald-500/10 text-emerald-300 border border-emerald-400/20 px-3 py-1.5 rounded-xl font-medium">
                        🍲 {food}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Travel Tips */}
              {tips.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-purple-400 text-base">lightbulb</span>
                    Travel Tips
                  </h4>
                  <ul className="space-y-2">
                    {tips.map((tip, idx) => (
                      <li key={idx} className="text-xs text-slate-300 bg-purple-500/10 p-2.5 rounded-xl border border-purple-400/20">
                        💡 {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Map Location Bar */}
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs text-slate-300">
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-sky-400">pin_drop</span>
                <span>Coordinates: {destination.lat}, {destination.lng}</span>
              </span>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${destination.lat},${destination.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sky-400 hover:underline flex items-center gap-1 font-semibold"
              >
                <span>Google Maps</span>
                <span className="material-symbols-outlined text-xs">open_in_new</span>
              </a>
            </div>

            {/* Direct Travel Agency Action Bar */}
            <div className="pt-2 border-t border-white/10 flex flex-col gap-3">
              <div className="text-xs font-semibold text-outline text-center">
                Get Direct Travel Agency Quotations for {destination.name}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => setIsVisaModalOpen(true)}
                  className="py-3 px-4 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
                >
                  <span className="material-symbols-outlined text-base">assignment_turned_in</span>
                  <span>Get Visa Quote for {destination.country}</span>
                </button>

                <button
                  onClick={() => setIsFlightModalOpen(true)}
                  className="py-3 px-4 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
                >
                  <span className="material-symbols-outlined text-base">connecting_airports</span>
                  <span>Get Flight Quote to {destination.name}</span>
                </button>
              </div>

              {/* Primary AI Itinerary Generator Button */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => {
                    requireAuth(
                      { type: 'save_destination', label: `Saved ${destination.name}` },
                      () => setIsSaved(!isSaved)
                    );
                  }}
                  className={`p-3.5 rounded-2xl border transition-all flex items-center justify-center ${
                    isSaved
                      ? 'bg-amber-500/20 text-amber-300 border-amber-400/50'
                      : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
                  }`}
                  title={isSaved ? 'Saved to Favorites' : 'Save Destination'}
                >
                  <span className="material-symbols-outlined text-xl">
                    {isSaved ? 'bookmark_added' : 'bookmark'}
                  </span>
                </button>

                <button
                  onClick={() => {
                    requireAuth(
                      { type: 'generate_itinerary', label: `Itinerary for ${destination.name}` },
                      () => {
                        onClose();
                        onGenerateItinerary(destination.name);
                      }
                    );
                  }}
                  className="flex-1 bg-primary text-on-primary font-bold text-sm py-3.5 px-6 rounded-2xl hover:bg-primary-fixed transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-xl">auto_awesome</span>
                  <span>Generate Full AI Itinerary</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Sub-Modals */}
      <VisaQuoteModal
        isOpen={isVisaModalOpen}
        onClose={() => setIsVisaModalOpen(false)}
        initialCountry={destination.country}
      />

      <FlightQuoteModal
        isOpen={isFlightModalOpen}
        onClose={() => setIsFlightModalOpen(false)}
        initialDestination={`${destination.name}, ${destination.country}`}
      />
    </>
  );
};
