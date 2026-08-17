import React from 'react';
import { ExternalLink, ShieldCheck, AlertCircle, X, Check, Plane, MessageCircle, Clock, Luggage } from 'lucide-react';
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
    AZRAQ_AGENCY_CONFIG.aviasalesAffiliateUrl ||
    'https://aviasales.tp.st/72ntufDx';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden"
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
            <span>Official Partner Booking & Itinerary</span>
          </div>

          <h3 className="text-xl font-bold text-white tracking-tight">
            {flight.airlineName} · {flight.flightNumber}
          </h3>
          <p className="text-xs text-slate-300 mt-1">
            {flight.origin.city} ({flight.origin.code}) ➔ {flight.destination.city} ({flight.destination.code}) • {flight.cabinClass} Class
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5 text-slate-700 text-sm max-h-[80vh] overflow-y-auto">
          {/* Horizontal Itinerary Timeline Flow */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500 pb-2 border-b border-slate-200/60">
              <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                <Plane className="w-3.5 h-3.5 text-blue-600" />
                <span>Flight Itinerary Flow</span>
              </span>
              <span className="font-mono font-bold text-slate-700">
                Duration: {flight.duration}
              </span>
            </div>

            {/* Horizontal Track */}
            <div className="flex items-center justify-between gap-2 pt-1">
              {/* Origin */}
              <div className="text-left space-y-0.5">
                <span className="text-xs font-mono font-bold text-slate-500">Departure</span>
                <p className="text-lg font-extrabold text-slate-900 font-mono leading-none">
                  {flight.departureTime}
                </p>
                <p className="text-xs font-bold text-blue-700">{flight.origin.code}</p>
                <p className="text-[11px] text-slate-400 truncate max-w-[100px]">{flight.origin.city}</p>
              </div>

              {/* Center Flow Bar with Stop info */}
              <div className="flex-1 px-3 flex flex-col items-center">
                <div className="text-[11px] font-bold text-slate-600 mb-1 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>{flight.duration}</span>
                  <span>•</span>
                  <span>{flight.stops === 0 ? 'Non-Stop' : `${flight.stops} Stop (${flight.stopAirports?.join(', ') || 'Transit'})`}</span>
                </div>

                <div className="relative w-full h-1 bg-blue-200 rounded-full flex items-center justify-between">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div>
                  {flight.stops > 0 && (
                    <div className="w-3 h-3 rounded-full bg-amber-500 border-2 border-white shadow-2xs" title={`Layover: ${flight.layoverDuration || 'Transit'}`}></div>
                  )}
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-900"></div>
                </div>

                {flight.layoverDuration && (
                  <span className="mt-1 text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-semibold">
                    {flight.layoverDuration} Layover in {flight.stopAirports?.[0] || 'Hub'}
                  </span>
                )}
              </div>

              {/* Destination */}
              <div className="text-right space-y-0.5">
                <span className="text-xs font-mono font-bold text-slate-500">Arrival</span>
                <p className="text-lg font-extrabold text-slate-900 font-mono leading-none">
                  {flight.arrivalTime}
                </p>
                <p className="text-xs font-bold text-slate-900">{flight.destination.code}</p>
                <p className="text-[11px] text-slate-400 truncate max-w-[100px]">{flight.destination.city}</p>
              </div>
            </div>

            {/* Baggage & Fare Badge */}
            <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-slate-600">
                <Luggage className="w-3.5 h-3.5 text-slate-400" />
                <span>Baggage: <strong>{flight.baggageAllowance?.checked || 'Checked Baggage Included'}</strong></span>
              </div>
              <div className="text-right">
                <span className="text-base font-extrabold text-[#0D6EFD] font-mono">
                  BDT {flight.priceBDT.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Transparency Notices */}
          <div className="space-y-2 text-xs text-slate-600">
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
