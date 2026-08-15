import React, { useState } from 'react';
import { BRAND_LOGOS } from '../data/mockData';

interface FooterProps {
  onNavigate?: (view: string) => void;
  onOpenVisaQuote?: () => void;
  onOpenFlightQuote?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenVisaQuote,
  onOpenFlightQuote,
}) => {
  const [activeLegalModal, setActiveLegalModal] = useState<'terms' | 'privacy' | 'refund' | null>(null);

  const currentYear = new Date().getFullYear();

  return (
    <>
      <footer className="w-full bg-[#071626] border-t border-sky-500/20 text-slate-300 pt-10 pb-12 px-4 sm:px-6 md:px-12 relative overflow-hidden">
        {/* Subtle background glow effect */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>

        {/* Mockup Exclusive Brand Bar */}
        <div className="max-w-7xl mx-auto mb-10 pb-6 border-b border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-pulse"></span>
            <span className="font-bold text-sm sm:text-base tracking-widest uppercase text-sky-400">
              AZRAQ TOURS & TRAVELS EXCLUSIVE
            </span>
          </div>

          <div className="hidden md:flex items-center flex-1 mx-6">
            <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-sky-400/30 to-transparent"></div>
          </div>

          <div className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-slate-300">
            <span className="flex items-center gap-1 text-emerald-400">
              <span className="material-symbols-outlined text-base">support_agent</span>
              24/7 TRAVEL DESK
            </span>
            <span className="text-white/30">│</span>
            <span className="text-sky-400 font-bold">Azraq</span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-white/10 relative z-10">
          {/* Col 1: Brand & Bio */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src={BRAND_LOGOS.azraq}
                alt="Azraq Tours & Travels Logo"
                className="w-10 h-10 rounded-full border border-sky-400/40 shadow-md object-cover"
              />
              <div>
                <h3 className="font-serif-display text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Azraq Tours & Travels
                </h3>
                <p className="text-xs text-sky-400 font-semibold tracking-wider uppercase">
                  Luxury Travel Concierge & Quotations
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-md">
              Specialized travel agency providing tailored flight itineraries, visa assistance, and luxury Asian holiday packages designed specifically for Bangladeshi and international travelers.
            </p>

            <div className="pt-2 flex flex-wrap gap-2 text-xs">
              <span className="px-3 py-1 rounded-full bg-sky-500/10 text-sky-300 border border-sky-400/20 font-medium">
                Official Agency
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-400/20 font-medium">
                Verified Visa Guidance
              </span>
              <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-400/20 font-medium">
                Direct WhatsApp Hotline
              </span>
            </div>

            {/* Social Icons */}
            <div className="pt-3 flex items-center gap-3">
              <a
                href="https://wa.me/8801851172032?text=Hello%20Azraq%20Tours%20%26%20Travels!"
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp"
                className="w-9 h-9 rounded-full bg-emerald-500/15 hover:bg-emerald-500/30 text-emerald-400 hover:text-emerald-200 border border-emerald-400/30 flex items-center justify-center transition-all shadow-sm"
              >
                <span className="material-symbols-outlined text-lg">chat</span>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 rounded-full bg-blue-600/15 hover:bg-blue-600/30 text-blue-400 hover:text-blue-200 border border-blue-400/30 flex items-center justify-center transition-all shadow-sm font-bold text-xs"
              >
                FB
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full bg-pink-600/15 hover:bg-pink-600/30 text-pink-400 hover:text-pink-200 border border-pink-400/30 flex items-center justify-center transition-all shadow-sm font-bold text-xs"
              >
                IG
              </a>
              <a
                href="mailto:istihadahmed1163@gmail.com"
                aria-label="Email Us"
                className="w-9 h-9 rounded-full bg-sky-500/15 hover:bg-sky-500/30 text-sky-400 hover:text-sky-200 border border-sky-400/30 flex items-center justify-center transition-all shadow-sm"
              >
                <span className="material-symbols-outlined text-lg">mail</span>
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="font-serif-display text-sm font-bold text-white uppercase tracking-wider">
              Explore & Plan
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-400">
              <li>
                <button
                  onClick={() => onNavigate?.('discover')}
                  className="hover:text-sky-300 transition-colors text-left cursor-pointer"
                >
                  Featured Destinations
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate?.('packages')}
                  className="hover:text-sky-300 transition-colors text-left cursor-pointer"
                >
                  Tour Packages
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate?.('planner')}
                  className="hover:text-sky-300 transition-colors text-left cursor-pointer"
                >
                  AI Smart Planner
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate?.('feed')}
                  className="hover:text-sky-300 transition-colors text-left cursor-pointer"
                >
                  Traveler Feed
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate?.('map')}
                  className="hover:text-sky-300 transition-colors text-left cursor-pointer"
                >
                  Interactive Map
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Quotations & Services */}
          <div className="space-y-3">
            <h4 className="font-serif-display text-sm font-bold text-white uppercase tracking-wider">
              Agency Services
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-400">
              <li>
                <button
                  onClick={() => onOpenVisaQuote?.()}
                  className="hover:text-teal-300 transition-colors text-left flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-xs text-teal-400">verified</span>
                  <span>Visa Consultation & Filing</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenFlightQuote?.()}
                  className="hover:text-sky-300 transition-colors text-left flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-xs text-sky-400">flight</span>
                  <span>Flight Ticket Quotations</span>
                </button>
              </li>
              <li>
                <a
                  href="https://wa.me/8801851172032?text=Hello!%20I%20would%20like%20a%20Custom%20Holiday%20Package."
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-emerald-300 transition-colors flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-xs text-emerald-400">chat</span>
                  <span>Custom Holiday Packages</span>
                </a>
              </li>
              <li>
                <button
                  onClick={() => setActiveLegalModal('refund')}
                  className="hover:text-slate-200 transition-colors text-left cursor-pointer"
                >
                  Ticketing & Cancellation Policy
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Office */}
          <div className="space-y-3">
            <h4 className="font-serif-display text-sm font-bold text-white uppercase tracking-wider">
              Headquarters & Support
            </h4>
            <div className="space-y-2.5 text-xs sm:text-sm text-slate-400">
              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-sm text-sky-400 shrink-0 mt-0.5">location_on</span>
                <span>Gulshan-2, Dhaka-1212, Bangladesh</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-sm text-emerald-400 shrink-0">call</span>
                <a href="tel:+8801851172032" className="hover:text-emerald-300 transition-colors font-medium">
                  +880 1851-172032
                </a>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-sm text-sky-400 shrink-0">mail</span>
                <a href="mailto:istihadahmed1163@gmail.com" className="hover:text-sky-300 transition-colors truncate">
                  istihadahmed1163@gmail.com
                </a>
              </div>
              <div className="flex items-start gap-2 pt-1">
                <span className="material-symbols-outlined text-sm text-amber-400 shrink-0 mt-0.5">schedule</span>
                <span className="text-[11px] text-slate-400">
                  Sun - Thu: 9:00 AM – 8:00 PM (BST)<br />
                  Emergency WhatsApp: 24/7
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Legal & Copyright Bar */}
        <div className="max-w-7xl mx-auto pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {currentYear} Azraq Tours & Travels. All rights reserved. Registered Travel Concierge.
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <button
              onClick={() => setActiveLegalModal('terms')}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Terms of Service
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveLegalModal('privacy')}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveLegalModal('refund')}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Refund Policy
            </button>
          </div>
        </div>
      </footer>

      {/* Legal Information Modal */}
      {activeLegalModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in"
          onClick={() => setActiveLegalModal(null)}
        >
          <div
            className="relative w-full max-w-2xl bg-slate-900 border border-sky-400/30 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[85vh] overflow-y-auto text-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
              <h3 className="font-serif-display text-xl font-bold text-white">
                {activeLegalModal === 'terms' && 'Terms of Service – Azraq Tours & Travels'}
                {activeLegalModal === 'privacy' && 'Privacy Policy – Azraq Tours & Travels'}
                {activeLegalModal === 'refund' && 'Refund & Cancellation Policy'}
              </h3>
              <button
                onClick={() => setActiveLegalModal(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
              {activeLegalModal === 'terms' && (
                <>
                  <p>
                    Welcome to <strong>Azraq Tours & Travels</strong>. By browsing our website, requesting flight/visa quotations, or booking travel packages, you agree to the following terms:
                  </p>
                  <h4 className="font-bold text-white">1. Quotations & Pricing</h4>
                  <p>
                    All flight prices and visa processing fees are provided based on real-time availability and embassy regulations. Quotations remain valid for 24–48 hours unless otherwise specified.
                  </p>
                  <h4 className="font-bold text-white">2. Visa Processing Services</h4>
                  <p>
                    Azraq Tours & Travels acts as an authorized facilitator and advisory concierge for visa applications. While we ensure accuracy and compliant documentation, final visa issuance is at the sole discretion of respective foreign embassies and consulates.
                  </p>
                  <h4 className="font-bold text-white">3. Customer Responsibilities</h4>
                  <p>
                    Travelers must provide authentic documents, valid passports (minimum 6 months validity from departure date), and accurate personal details.
                  </p>
                </>
              )}

              {activeLegalModal === 'privacy' && (
                <>
                  <p>
                    At <strong>Azraq Tours & Travels</strong>, your personal and travel details are handled with strict confidentiality and security:
                  </p>
                  <h4 className="font-bold text-white">1. Information We Collect</h4>
                  <p>
                    We only collect information necessary to process flight quotes, visa assistance, and hotel bookings (such as your name, email, phone/WhatsApp number, passport validity, and travel dates).
                  </p>
                  <h4 className="font-bold text-white">2. Use of Information</h4>
                  <p>
                    Your data is solely used to prepare tailored travel quotations and coordinate with airlines or visa portals. We never sell or share your information with third-party advertisers.
                  </p>
                  <h4 className="font-bold text-white">3. Data Security</h4>
                  <p>
                    All form transmissions are protected with SSL encryption and stored securely in accordance with standard data protection guidelines.
                  </p>
                </>
              )}

              {activeLegalModal === 'refund' && (
                <>
                  <h4 className="font-bold text-white">1. Flight Ticket Cancellations & Changes</h4>
                  <p>
                    Airfare refund and date-change policies follow the respective airline’s tariff rules (Biman, Emirates, Singapore Airlines, US-Bangla, etc.). Airline cancellation penalties and nominal service fees apply.
                  </p>
                  <h4 className="font-bold text-white">2. Visa Application Fees</h4>
                  <p>
                    Official government and embassy visa application fees are non-refundable once submitted to the embassy portal or visa center, regardless of the visa outcome.
                  </p>
                  <h4 className="font-bold text-white">3. Holiday Packages</h4>
                  <p>
                    Package cancellations made 15 days prior to departure qualify for partial refunds according to hotel and tour operator cancellation schedules.
                  </p>
                </>
              )}
            </div>

            <div className="pt-6 mt-6 border-t border-white/10 flex justify-end">
              <button
                onClick={() => setActiveLegalModal(null)}
                className="px-5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition-all cursor-pointer"
              >
                Understood & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
