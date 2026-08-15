import React, { useState } from 'react';
import { FlightQuoteModal } from './FlightQuoteModal';
import { VisaQuoteModal } from './VisaQuoteModal';
import { TrackQuoteModal } from './TrackQuoteModal';

interface QuotationSectionProps {
  initialVisaCountry?: string;
  isVisaModalOpenExternal?: boolean;
  isFlightModalOpenExternal?: boolean;
  onCloseExternalModals?: () => void;
}

export const QuotationSection: React.FC<QuotationSectionProps> = ({
  initialVisaCountry,
  isVisaModalOpenExternal = false,
  isFlightModalOpenExternal = false,
  onCloseExternalModals,
}) => {
  const [isFlightModalOpenInternal, setIsFlightModalOpenInternal] = useState(false);
  const [isVisaModalOpenInternal, setIsVisaModalOpenInternal] = useState(false);
  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);
  const [selectedVisaCountry, setSelectedVisaCountry] = useState<string | undefined>(initialVisaCountry);

  const isFlightModalOpen = isFlightModalOpenExternal || isFlightModalOpenInternal;
  const isVisaModalOpen = isVisaModalOpenExternal || isVisaModalOpenInternal;

  const handleCloseFlightModal = () => {
    setIsFlightModalOpenInternal(false);
    onCloseExternalModals?.();
  };

  const handleCloseVisaModal = () => {
    setIsVisaModalOpenInternal(false);
    setSelectedVisaCountry(undefined);
    onCloseExternalModals?.();
  };

  const trustPoints = [
    { text: 'Personalized Pricing', icon: 'payments' },
    { text: 'Visa Assistance', icon: 'assignment_turned_in' },
    { text: 'Multiple Airline Options', icon: 'connecting_airports' },
    { text: 'Expert Travel Support', icon: 'support_agent' },
    { text: 'WhatsApp Assistance', icon: 'chat' },
    { text: 'Transparent Service', icon: 'verified' },
  ];

  return (
    <section className="w-full my-6 animate-fade-in" id="quotations-section">
      {/* Section Outer Container with subtle glass border & soft sky/emerald accents */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900/90 border border-sky-400/30 p-6 md:p-10 shadow-2xl backdrop-blur-xl">
        
        {/* Soft Ambient Background Glows */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Section Header */}
        <div className="relative text-center max-w-3xl mx-auto space-y-3 mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-500/15 border border-sky-400/30 text-sky-300 text-xs font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>Official Travel Agency Services</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-serif-display font-bold text-white tracking-tight leading-tight">
            Plan Your Journey With Confidence
          </h2>

          <p className="text-sm md:text-base text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto">
            Get personalized Visa and Flight Quotations from our travel experts. Submit your travel requirements and receive a customized quotation within hours.
          </p>

          {/* Track Quotation Quick Trigger & WhatsApp Direct */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setIsTrackModalOpen(true)}
              className="inline-flex items-center gap-2 text-xs font-semibold text-sky-300 hover:text-white bg-white/5 hover:bg-white/10 px-4 py-2.5 rounded-full border border-sky-400/20 transition-all hover:border-sky-400/50 cursor-pointer min-h-[44px]"
            >
              <span className="material-symbols-outlined text-sm text-sky-400">find_in_page</span>
              <span>Already submitted? Track your request →</span>
            </button>

            <a
              href="https://wa.me/8801851172032?text=Hello%20Azraq%20Tours%20%26%20Travels!%20I%20would%20like%20to%20inquire%20about%20a%20Flight%20or%20Visa%20quotation."
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-xs font-bold text-emerald-300 hover:text-white bg-emerald-500/20 hover:bg-emerald-500/30 px-4 py-2.5 rounded-full border border-emerald-400/40 transition-all shadow-sm min-h-[44px]"
            >
              <span className="material-symbols-outlined text-sm text-emerald-400">chat</span>
              <span>Direct WhatsApp Hotline: +880 1851-172032</span>
            </a>
          </div>
        </div>

        {/* Two Large Interactive Cards Side-By-Side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto relative z-10">
          
          {/* Card 1: Flight Ticket Quotation */}
          <div className="group relative rounded-3xl bg-gradient-to-b from-slate-800/95 via-slate-800/80 to-slate-900/95 border-2 border-sky-400/30 hover:border-sky-400/70 p-7 sm:p-8 shadow-xl transition-all duration-300 hover:shadow-2xl hover:shadow-sky-500/10 flex flex-col justify-between overflow-hidden">
            {/* Background Travel Image Accent */}
            <div className="absolute top-0 right-0 w-36 h-36 opacity-15 group-hover:opacity-25 transition-opacity pointer-events-none overflow-hidden rounded-bl-full">
              <img
                src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=600&q=80"
                alt="Airplane in sky"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-4 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 transition-transform">
                ✈️
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-2xl font-serif-display font-bold text-white group-hover:text-sky-300 transition-colors">
                    Flight Ticket Quotation
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 text-[11px] font-bold border border-sky-400/30">
                    Best Airfares
                  </span>
                </div>
                <p className="text-sm text-slate-300 mt-2 leading-relaxed font-normal">
                  Tell us your route and dates. Our team will find optimal airlines, flexible dates, and prepare a personalized quotation with no hidden fees.
                </p>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-sky-200/90 font-medium">
                <span className="flex items-center gap-1 bg-white/5 px-2.5 py-1 rounded-lg">
                  <span className="material-symbols-outlined text-sm text-sky-400">check_circle</span>
                  Best Fare Guarantee
                </span>
                <span className="flex items-center gap-1 bg-white/5 px-2.5 py-1 rounded-lg">
                  <span className="material-symbols-outlined text-sm text-sky-400">check_circle</span>
                  Flexible Dates
                </span>
                <span className="flex items-center gap-1 bg-white/5 px-2.5 py-1 rounded-lg">
                  <span className="material-symbols-outlined text-sm text-sky-400">check_circle</span>
                  Top Global Airlines
                </span>
              </div>
            </div>

            <div className="pt-6 relative z-10">
              <button
                onClick={() => setIsFlightModalOpenInternal(true)}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-sky-400 to-cyan-400 hover:from-sky-300 hover:to-cyan-300 text-slate-950 font-bold text-sm sm:text-base transition-all duration-200 ease-out shadow-lg shadow-sky-500/25 hover:scale-[1.02] active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer min-h-[48px]"
              >
                <span>Get Flight Quotation Now</span>
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </button>
            </div>
          </div>

          {/* Card 2: Visa Quotation */}
          <div className="group relative rounded-3xl bg-gradient-to-b from-slate-800/95 via-slate-800/80 to-slate-900/95 border-2 border-emerald-400/30 hover:border-emerald-400/70 p-7 sm:p-8 shadow-xl transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/10 flex flex-col justify-between overflow-hidden">
            {/* Background Travel Image Accent */}
            <div className="absolute top-0 right-0 w-36 h-36 opacity-15 group-hover:opacity-25 transition-opacity pointer-events-none overflow-hidden rounded-bl-full">
              <img
                src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80"
                alt="Passport & Visa"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-4 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 transition-transform">
                🛂
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-2xl font-serif-display font-bold text-white group-hover:text-emerald-300 transition-colors">
                    Visa Assistance & Quotation
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold border border-emerald-400/30">
                    From BDT 2,000
                  </span>
                </div>
                <p className="text-sm text-slate-300 mt-2 leading-relaxed font-normal">
                  Expert visa processing, transparent embassy fee breakdowns, full document guidance & filing support for 50+ Asian and global countries.
                </p>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-emerald-200/90 font-medium">
                <span className="flex items-center gap-1 bg-white/5 px-2.5 py-1 rounded-lg">
                  <span className="material-symbols-outlined text-sm text-emerald-400">check_circle</span>
                  Schengen / US / UK
                </span>
                <span className="flex items-center gap-1 bg-white/5 px-2.5 py-1 rounded-lg">
                  <span className="material-symbols-outlined text-sm text-emerald-400">check_circle</span>
                  Full Document Checklist
                </span>
                <span className="flex items-center gap-1 bg-white/5 px-2.5 py-1 rounded-lg">
                  <span className="material-symbols-outlined text-sm text-emerald-400">check_circle</span>
                  Fast Submission
                </span>
              </div>
            </div>

            <div className="pt-6 relative z-10">
              <button
                onClick={() => {
                  setSelectedVisaCountry(initialVisaCountry || 'Malaysia');
                  setIsVisaModalOpenInternal(true);
                }}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-bold text-sm sm:text-base transition-all duration-200 ease-out shadow-lg shadow-emerald-500/25 hover:scale-[1.02] active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer min-h-[48px]"
              >
                <span>Get Visa Quote Now</span>
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </button>
            </div>
          </div>

        </div>

        {/* Trust Section Underneath (Clean Without Redundant '✓') */}
        <div className="mt-10 pt-8 border-t border-white/10 max-w-4xl mx-auto">
          <div className="text-center mb-6">
            <h4 className="text-sm font-serif-display font-bold text-slate-200 tracking-wide uppercase">
              Why Request a Quote From Azraq Tours?
            </h4>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-center">
            {trustPoints.map((point, idx) => (
              <div
                key={idx}
                className="p-3 rounded-2xl bg-white/5 border border-white/5 hover:border-sky-400/30 transition-all flex flex-col items-center gap-2 group"
              >
                <div className="w-8 h-8 rounded-full bg-sky-500/10 text-sky-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-base">{point.icon}</span>
                </div>
                <span className="text-xs font-semibold text-slate-200">
                  {point.text}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Modals */}
      <FlightQuoteModal
        isOpen={isFlightModalOpen}
        onClose={handleCloseFlightModal}
      />

      <VisaQuoteModal
        isOpen={isVisaModalOpen}
        onClose={handleCloseVisaModal}
        initialCountry={selectedVisaCountry || initialVisaCountry}
      />

      <TrackQuoteModal
        isOpen={isTrackModalOpen}
        onClose={() => setIsTrackModalOpen(false)}
      />
    </section>
  );
};

