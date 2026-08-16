import React, { useState } from 'react';
import { BRAND_LOGOS } from '../data/mockData';
import { MapPin, Phone, Mail, MessageSquare, ArrowRight, ShieldCheck, X } from 'lucide-react';
import { NavView } from '../types';

interface FooterProps {
  onNavigate?: (view: NavView) => void;
  onOpenVisaQuote?: () => void;
  onOpenFlightQuote?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenVisaQuote,
  onOpenFlightQuote,
}) => {
  const [activeLegalModal, setActiveLegalModal] = useState<'faq' | 'terms' | 'privacy' | null>(null);
  const currentYear = new Date().getFullYear();

  const handleNav = (view: NavView) => {
    if (onNavigate) {
      onNavigate(view);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <>
      <footer className="w-full bg-[#071A33] border-t border-slate-800 text-slate-400 pt-16 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-slate-800">
          {/* Column 1: Brand & Company Bio (Span 2) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden bg-white/10 border border-slate-700">
                <img
                  src={BRAND_LOGOS.azraq}
                  alt="Azraq Tours & Travels Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">
                  Azraq Tours & Travels
                </h3>
                <p className="text-xs text-sky-400 font-medium">
                  Curated Asian Escapes & Travel Services
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-sm">
              Tailored flight tickets, verified visa assistance, and bespoke tour packages designed for Bangladeshi and international travelers.
            </p>

            <div className="pt-2 space-y-1.5 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-sky-400" />
                <span>Dhaka, Bangladesh</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-sky-400" />
                <a href="https://wa.me/8801851172032" target="_blank" rel="noreferrer" className="hover:text-white font-mono">
                  +880 1851-172032
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-sky-400" />
                <span>support@azraqtravels.com</span>
              </div>
            </div>
          </div>

          {/* Column 2: Company */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Company
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => handleNav('about')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('contact')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Contact & Inquiry
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('feed')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Travel Buddies
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('planner')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Trip Planner
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Travel */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Travel Services
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => handleNav('destinations')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Destinations
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('packages')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Tour Packages
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('visa')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Visa Assistance
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('flights')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Flight Quotation
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Support & Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Support & Legal
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => setActiveLegalModal('faq')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Frequently Asked Questions
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveLegalModal('privacy')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveLegalModal('terms')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Terms & Conditions
                </button>
              </li>
              <li>
                <a
                  href="https://wa.me/8801851172032"
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors inline-flex items-center gap-1 mt-1"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>24/7 WhatsApp Help</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="max-w-7xl mx-auto pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {currentYear} Azraq Tours & Travels. All rights reserved.</p>
          <div className="flex items-center gap-4 text-slate-400 text-[11px]">
            <span>Official Travel Agency</span>
            <span>•</span>
            <span>Dhaka, Bangladesh</span>
          </div>
        </div>
      </footer>

      {/* Legal & FAQ Modal */}
      {activeLegalModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setActiveLegalModal(null)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            {activeLegalModal === 'faq' && (
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-[#071A33]">Frequently Asked Questions</h3>
                <div className="space-y-2 text-xs text-slate-600 max-h-80 overflow-y-auto pr-1">
                  <p className="font-bold text-slate-800">How do I request a customized package?</p>
                  <p>Click "Plan My Trip" in the top navigation or contact our desk on WhatsApp.</p>
                  <p className="font-bold text-slate-800 pt-2">What documents are required for tourist visas?</p>
                  <p>Check our dedicated Visa tab for full country checklists including passport validity, bank statements, and NOC requirements.</p>
                  <p className="font-bold text-slate-800 pt-2">How fast do I receive flight quotations?</p>
                  <p>Our ticketing team provides GDS seat availability and fare breakdowns within 2 hours during office hours.</p>
                </div>
              </div>
            )}

            {activeLegalModal === 'privacy' && (
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-[#071A33]">Privacy Policy</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Azraq Tours & Travels collects personal details such as names, passport details, contact numbers, and travel dates strictly to process airline bookings and visa applications. We do not sell or share personal traveler data with unauthorized third parties.
                </p>
              </div>
            )}

            {activeLegalModal === 'terms' && (
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-[#071A33]">Terms & Conditions</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Flight fares and hotel rates are subject to airline and property availability until confirmed with tickets/vouchers. Visa approval is strictly at the discretion of respective foreign embassies.
                </p>
              </div>
            )}

            <button
              onClick={() => setActiveLegalModal(null)}
              className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};
