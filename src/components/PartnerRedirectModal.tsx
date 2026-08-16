import React from 'react';
import { ExternalLink, ShieldCheck, AlertCircle, X, Check, Plane, MessageCircle } from 'lucide-react';
import { FlightOffer } from '../data/flightsData';
import { AZRAQ_AGENCY_CONFIG } from '../data/agencyConfig';

interface PartnerRedirectModalProps {
  flight: FlightOffer | null;
  isOpen: boolean;
  onClose: () => void;
}

export const PartnerRedirectModal: React.FC<PartnerRedirectModalProps> = ({
  flight,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !flight) return null;

  const partnerUrl =
    flight.partnerDeepLink ||
    `https://flights.travelpayouts.com/search?origin=${flight.origin.code}&destination=${flight.destination.code}&marker=563001`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-[#071A33] text-white p-5 sm:p-6 relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 text-sky-400 text-xs font-bold uppercase tracking-wider mb-1">
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Partner Booking Redirect</span>
          </div>

          <h3 className="text-xl font-bold text-white tracking-tight">
            Continue to {flight.airlineName} / Partner
          </h3>
          <p className="text-xs text-slate-300 mt-1">
            {flight.origin.city} ({flight.origin.code}) ➔ {flight.destination.city} ({flight.destination.code}) · {flight.flightNumber}
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5 text-slate-700 text-sm">
          {/* Flight Summary Card */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-base">{flight.airlineName}</span>
                <span className="text-xs text-slate-500 font-mono">({flight.flightNumber})</span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {flight.departureDate} • {flight.departureTime} departure
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 block">Verified Fare</span>
              <span className="text-base font-extrabold text-[#0D6EFD] font-mono">
                BDT {flight.priceBDT.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Transparency Notices */}
          <div className="space-y-2.5 text-xs text-slate-600">
            <div className="flex items-start gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>You will be redirected securely to the partner ticket checkout page.</span>
            </div>
            <div className="flex items-start gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Flight prices and seat availability are finalized directly on partner systems.</span>
            </div>
            <div className="flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
              <span>
                Azraq Concierge Desk can assist with visas, itinerary coordination, and hotel connections once booked.
              </span>
            </div>
          </div>

          {/* Legal Partner Disclaimer */}
          <div className="p-3 rounded-xl bg-slate-100/80 border border-slate-200 text-[11px] text-slate-500 leading-relaxed">
            {AZRAQ_AGENCY_CONFIG.partnerDisclaimer}
          </div>

          {/* Actions */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <a
              href={partnerUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
              className="w-full sm:flex-1 py-3.5 px-4 rounded-xl bg-[#0D6EFD] hover:bg-blue-600 text-white font-extrabold text-xs sm:text-sm text-center shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Proceed to Partner Booking</span>
              <ExternalLink className="w-4 h-4" />
            </a>

            <a
              href={`https://wa.me/${AZRAQ_AGENCY_CONFIG.whatsappNumber}?text=${encodeURIComponent(
                `Hello Azraq Concierge! I would like your Dhaka desk to hold and book this flight for me: ${flight.airlineName} ${flight.flightNumber} (${flight.origin.code} -> ${flight.destination.code}) on ${flight.departureDate} for BDT ${flight.priceBDT.toLocaleString()}.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
              className="w-full sm:w-auto py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Book with Azraq Desk</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
