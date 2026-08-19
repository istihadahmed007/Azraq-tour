import React, { useState } from 'react';
import { BRAND_LOGOS } from '../data/mockData';
import { MapPin, Phone, Mail, MessageSquare, ArrowRight, ShieldCheck, X, ExternalLink, HelpCircle } from 'lucide-react';
import { NavView } from '../types';
import { AZRAQ_AGENCY_CONFIG } from '../data/agencyConfig';

interface FooterProps {
  onNavigate?: (view: NavView) => void;
  onOpenVisaQuote?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenVisaQuote,
}) => {
  const [activeLegalModal, setActiveLegalModal] = useState<'faq' | 'terms' | 'privacy' | 'affiliate' | null>(null);
  const currentYear = new Date().getFullYear();

  const handleNav = (view: NavView) => {
    if (onNavigate) {
      onNavigate(view);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <>
      <footer className="w-full bg-[#12304A] border-t border-sky-900/40 text-slate-300 pt-16 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-sky-900/40">
          {/* Column 1: Brand & Company Bio (Span 2) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden bg-white shadow-sm flex items-center justify-center p-0.5 border border-white/20">
                <img
                  src={BRAND_LOGOS.azraq}
                  alt="Azraq Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-white tracking-tight font-poppins flex items-center gap-1.5">
                  <span>AZRAQ</span>
                  <span className="text-xs font-bold text-[#5BC7F4] uppercase tracking-wider px-1.5 py-0.5 rounded bg-white/10">
                    TOUR
                  </span>
                </h3>
                <p className="text-xs text-[#5BC7F4] font-medium">
                  {AZRAQ_AGENCY_CONFIG.tagline} • Curated Asian Escapes
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-sm">
              Verified visa assistance, intelligent flight comparisons, and bespoke tour packages designed for Bangladeshi and international travelers.
            </p>

            <div className="pt-2 space-y-1.5 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#5BC7F4]" />
                <span>{AZRAQ_AGENCY_CONFIG.officeAddress}, {AZRAQ_AGENCY_CONFIG.officeCity}, {AZRAQ_AGENCY_CONFIG.officeCountry}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#5BC7F4]" />
                <a href={`https://wa.me/${AZRAQ_AGENCY_CONFIG.whatsappNumber}`} target="_blank" rel="noreferrer" className="hover:text-white font-mono">
                  {AZRAQ_AGENCY_CONFIG.phoneDisplay}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#5BC7F4]" />
                <a href={`mailto:${AZRAQ_AGENCY_CONFIG.email}`} className="hover:text-white transition-colors">
                  {AZRAQ_AGENCY_CONFIG.email}
                </a>
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
                  onClick={() => handleNav('flights')}
                  className="hover:text-white text-sky-300 font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <span>Flight Search & Compare</span>
                  <span className="text-[9px] px-1 py-0.5 rounded bg-sky-400/20 text-sky-300">New</span>
                </button>
              </li>
              <li>
                <a
                  href="https://aviasales.tp.st/72ntufDx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white text-slate-300 transition-colors flex items-center gap-1.5"
                >
                  <span>Aviasales Global Search</span>
                  <span className="text-[9px] px-1 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">Partner</span>
                </a>
              </li>
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
                <button
                  onClick={() => setActiveLegalModal('affiliate')}
                  className="hover:text-white text-slate-300 transition-colors cursor-pointer"
                >
                  Affiliate Disclosure
                </button>
              </li>
              <li>
                <a
                  href={`https://wa.me/${AZRAQ_AGENCY_CONFIG.whatsappNumber}`}
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

        {/* Affiliate & Legal Transparency Disclaimer */}
        <div className="max-w-7xl mx-auto py-6 border-b border-slate-800/80 text-[11px] text-slate-400 leading-relaxed space-y-1.5">
          <p>
            <strong className="text-slate-300">Transparency Notice:</strong> {AZRAQ_AGENCY_CONFIG.partnerDisclaimer}
          </p>
          <p className="text-slate-500">
            {AZRAQ_AGENCY_CONFIG.affiliateDisclosureText}
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="max-w-7xl mx-auto pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {currentYear} Azraq. All rights reserved.</p>
          <div className="flex items-center gap-4 text-slate-400 text-[11px]">
            <span>Official Travel Agency</span>
            <span>•</span>
            <span>Gulshan-2, Dhaka</span>
            <span>•</span>
            <button
              onClick={() => setActiveLegalModal('affiliate')}
              className="hover:underline text-slate-400"
            >
              Affiliate Policy
            </button>
          </div>
        </div>
      </footer>

      {/* Legal, FAQ, & Affiliate Disclosure Modal */}
      {activeLegalModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setActiveLegalModal(null)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {activeLegalModal === 'faq' && (
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-[#071A33]">Frequently Asked Questions</h3>
                <div className="space-y-2 text-xs text-slate-600 max-h-80 overflow-y-auto pr-1">
                  <p className="font-bold text-slate-800">How does Azraq flight search work?</p>
                  <p>Azraq aggregates live flight routes and rates from 700+ airlines via our licensed travel distribution partner network. You can book directly with verified partners or contact our Dhaka desk for offline holds.</p>
                  <p className="font-bold text-slate-800 pt-2">How do I request a customized package?</p>
                  <p>Click "Trip Planner" in the navigation or contact our desk on WhatsApp.</p>
                  <p className="font-bold text-slate-800 pt-2">What documents are required for tourist visas?</p>
                  <p>Check our dedicated Visa tab for full country checklists including passport validity, bank statements, and NOC requirements.</p>
                  <p className="font-bold text-slate-800 pt-2">How fast do I receive package quotes?</p>
                  <p>Our concierge team provides customized holiday quotes and hotel breakdowns within 2 hours during office hours.</p>
                </div>
              </div>
            )}

            {activeLegalModal === 'affiliate' && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-[#0D6EFD]">
                  <ShieldCheck className="w-5 h-5" />
                  <h3 className="text-lg font-bold text-[#071A33]">Affiliate & Partner Disclosure</h3>
                </div>
                <div className="space-y-2 text-xs text-slate-600 leading-relaxed">
                  <p>
                    Azraq partners with global travel aggregators including Travelpayouts to provide comprehensive airfare and hotel comparisons.
                  </p>
                  <p>
                    When you click on flight or hotel booking links and complete a purchase with our partners, Azraq may receive an affiliate referral commission at no additional cost to you.
                  </p>
                  <p>
                    All ticket issuance, airline schedule changes, cancellations, and refunds are subject to the terms and conditions of the booking partner and operating airline.
                  </p>
                  <p className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-500">
                    For direct offline booking assistance, group GDS fares, or concierge invoice payments, please contact the Azraq desk at Gulshan-2, Dhaka or via WhatsApp.
                  </p>
                </div>
              </div>
            )}

            {activeLegalModal === 'privacy' && (
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-[#071A33]">Privacy Policy</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Azraq collects personal details such as names, passport details, contact numbers, and travel dates strictly to process hotel bookings, flights, and visa applications. We do not sell or share personal traveler data with unauthorized third parties.
                </p>
              </div>
            )}

            {activeLegalModal === 'terms' && (
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-[#071A33]">Terms & Conditions</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Package rates and hotel rooms are subject to property availability until confirmed with booking vouchers. Visa approval is strictly at the discretion of respective foreign embassies. Airfares displayed are live estimates verified at partner checkout.
                </p>
              </div>
            )}

            <button
              onClick={() => setActiveLegalModal(null)}
              className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};
