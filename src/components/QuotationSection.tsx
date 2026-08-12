import React, { useState } from 'react';
import { FlightQuoteModal } from './FlightQuoteModal';
import { VisaQuoteModal } from './VisaQuoteModal';
import { TrackQuoteModal } from './TrackQuoteModal';

export const QuotationSection: React.FC = () => {
  const [isFlightModalOpen, setIsFlightModalOpen] = useState(false);
  const [isVisaModalOpen, setIsVisaModalOpen] = useState(false);
  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);

  const trustPoints = [
    { text: 'Personalized pricing', icon: 'payments' },
    { text: 'Visa assistance', icon: 'assignment_turned_in' },
    { text: 'Multiple airline options', icon: 'connecting_airports' },
    { text: 'Expert travel support', icon: 'support_agent' },
    { text: 'WhatsApp assistance', icon: 'chat' },
    { text: 'Transparent service', icon: 'verified' },
  ];

  return (
    <section className="w-full my-8 animate-fade-in">
      {/* Section Outer Container with subtle glass border & soft sky/turquoise accents */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900/80 border border-sky-400/20 p-6 md:p-12 shadow-2xl backdrop-blur-xl">
        
        {/* Soft Ambient Background Glows */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Section Header */}
        <div className="relative text-center max-w-3xl mx-auto space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky-500/15 border border-sky-400/30 text-sky-300 text-xs font-semibold uppercase tracking-wider">
            <span>Official Travel Agency Services</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-serif-display font-bold text-white tracking-tight leading-tight">
            Plan Your Journey With Confidence
          </h2>

          <p className="text-sm md:text-base text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto">
            Get personalized Visa and Flight Quotations from our travel experts. Submit your travel requirements and receive a customized quotation.
          </p>

          {/* Track Quotation Quick Trigger */}
          <div className="pt-2">
            <button
              onClick={() => setIsTrackModalOpen(true)}
              className="inline-flex items-center gap-2 text-xs font-semibold text-sky-300 hover:text-white bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full border border-sky-400/20 transition-all hover:border-sky-400/50"
            >
              <span className="material-symbols-outlined text-sm">find_in_page</span>
              <span>Already submitted? Track your quotation request →</span>
            </button>
          </div>
        </div>

        {/* Two Large Interactive Cards Side-By-Side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto relative z-10">
          
          {/* Card 1: Flight Ticket Quotation */}
          <div className="group relative rounded-3xl bg-gradient-to-b from-slate-800/90 via-slate-800/70 to-slate-900/90 border border-sky-300/20 hover:border-sky-400/60 p-8 shadow-xl transition-all duration-300 hover:shadow-2xl hover:shadow-sky-500/10 flex flex-col justify-between overflow-hidden">
            {/* Background Travel Image Accent */}
            <div className="absolute top-0 right-0 w-32 h-32 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none overflow-hidden rounded-bl-full">
              <img
                src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=600&q=80"
                alt="Airplane"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-4 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 transition-transform">
                ✈️
              </div>

              <div>
                <h3 className="text-2xl font-serif-display font-bold text-white group-hover:text-sky-300 transition-colors">
                  Flight Ticket Quotation
                </h3>
                <p className="text-sm text-slate-300 mt-2 leading-relaxed font-normal">
                  Tell us your travel requirements and our team will find suitable flight options and prepare a personalized quotation.
                </p>
              </div>

              <div className="pt-2 flex items-center gap-3 text-xs text-sky-200/80 font-medium">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm text-sky-400">check_circle</span>
                  Best airfares
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm text-sky-400">check_circle</span>
                  Flexible dates
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm text-sky-400">check_circle</span>
                  Top airlines
                </span>
              </div>
            </div>

            <div className="pt-6 relative z-10">
              <button
                onClick={() => setIsFlightModalOpen(true)}
                className="w-full py-3.5 px-6 rounded-2xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm transition-all duration-200 ease-out shadow-lg shadow-sky-500/20 hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                <span>Get Flight Quote</span>
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </button>
            </div>
          </div>

          {/* Card 2: Visa Quotation */}
          <div className="group relative rounded-3xl bg-gradient-to-b from-slate-800/90 via-slate-800/70 to-slate-900/90 border border-teal-300/20 hover:border-teal-400/60 p-8 shadow-xl transition-all duration-300 hover:shadow-2xl hover:shadow-teal-500/10 flex flex-col justify-between overflow-hidden">
            {/* Background Travel Image Accent */}
            <div className="absolute top-0 right-0 w-32 h-32 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none overflow-hidden rounded-bl-full">
              <img
                src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80"
                alt="Passport & Visa"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-4 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 transition-transform">
                🛂
              </div>

              <div>
                <h3 className="text-2xl font-serif-display font-bold text-white group-hover:text-teal-300 transition-colors">
                  Visa Quotation
                </h3>
                <p className="text-sm text-slate-300 mt-2 leading-relaxed font-normal">
                  Get personalized visa assistance, document guidance and service quotations for your destination.
                </p>
              </div>

              <div className="pt-2 flex items-center gap-3 text-xs text-teal-200/80 font-medium">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm text-teal-400">check_circle</span>
                  Schengen / US / UK
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm text-teal-400">check_circle</span>
                  Full guidance
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm text-teal-400">check_circle</span>
                  Fast filing
                </span>
              </div>
            </div>

            <div className="pt-6 relative z-10">
              <button
                onClick={() => setIsVisaModalOpen(true)}
                className="w-full py-3.5 px-6 rounded-2xl bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold text-sm transition-all duration-200 ease-out shadow-lg shadow-teal-500/20 hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                <span>Get Visa Quote</span>
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </button>
            </div>
          </div>

        </div>

        {/* Small Trust Section Underneath */}
        <div className="mt-12 pt-8 border-t border-white/10 max-w-4xl mx-auto">
          <div className="text-center mb-6">
            <h4 className="text-base font-serif-display font-bold text-white tracking-wide">
              Why Request a Quote From Us?
            </h4>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 text-center">
            {trustPoints.map((point, idx) => (
              <div
                key={idx}
                className="p-3 rounded-2xl bg-white/5 border border-white/5 hover:border-sky-400/30 transition-all flex flex-col items-center gap-2 group"
              >
                <div className="w-8 h-8 rounded-full bg-sky-500/10 text-sky-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-base">{point.icon}</span>
                </div>
                <span className="text-xs font-semibold text-slate-200">
                  ✓ {point.text}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Modals */}
      <FlightQuoteModal
        isOpen={isFlightModalOpen}
        onClose={() => setIsFlightModalOpen(false)}
      />

      <VisaQuoteModal
        isOpen={isVisaModalOpen}
        onClose={() => setIsVisaModalOpen(false)}
      />

      <TrackQuoteModal
        isOpen={isTrackModalOpen}
        onClose={() => setIsTrackModalOpen(false)}
      />
    </section>
  );
};
