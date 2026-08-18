import React from 'react';
import {
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  ShieldAlert,
  Clock,
  Plane,
  Users,
  Check,
  X,
  MessageCircle,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import { FlightOffer } from '../data/flightsData';
import { NormalizedFlightSearch, buildDynamicFlightWhatsAppUrl } from '../utils/flightSearchEngine';
import { PriceRevalidationResult } from '../types';
import { AZRAQ_AGENCY_CONFIG } from '../data/agencyConfig';
import { AirlineLogo } from './AirlineLogo';

interface PriceIncreaseModalProps {
  isOpen: boolean;
  flight: FlightOffer | null;
  search: NormalizedFlightSearch;
  revalidationResult: PriceRevalidationResult | null;
  currency?: string;
  onAccept: (freshPrice: number, bookingUrl: string) => void;
  onDecline: (freshPrice?: number) => void;
}

export const PriceIncreaseModal: React.FC<PriceIncreaseModalProps> = ({
  isOpen,
  flight,
  search,
  revalidationResult,
  currency = 'BDT',
  onAccept,
  onDecline,
}) => {
  if (!isOpen || !flight || !revalidationResult) return null;

  const totalPax = Math.max(1, search.adults + search.children + search.infants);
  const cachedPrice = revalidationResult.cachedPrice || flight.priceBDT;
  const freshPrice = revalidationResult.freshPrice;
  const priceDiff = Math.max(0, freshPrice - cachedPrice);
  const percentIncrease = cachedPrice > 0 ? ((priceDiff / cachedPrice) * 100).toFixed(1) : '0';

  const formatPrice = (amount: number) => {
    if (currency === 'USD') {
      const usd = Math.round(amount / 120);
      return `$${usd.toLocaleString()}`;
    }
    if (currency === 'EUR') {
      const eur = Math.round(amount / 130);
      return `€${eur.toLocaleString()}`;
    }
    return `Tk ${amount.toLocaleString()}`;
  };

  const bookingUrl = revalidationResult.bookingUrl || flight.partnerDeepLink || flight.bookingUrl;
  const whatsappHoldUrl = buildDynamicFlightWhatsAppUrl(search, freshPrice);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn font-sans">
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-amber-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Warning Banner Header */}
        <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-white p-5 sm:p-6 relative">
          <button
            type="button"
            onClick={() => onDecline(freshPrice)}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 text-amber-200 text-xs font-bold uppercase tracking-wider mb-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-300" />
            <span>Live Price Update Detected</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Fare Has Changed
          </h3>
          <p className="text-xs sm:text-sm text-amber-100 mt-1">
            The airline has updated the real-time seat inventory for this route.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5 text-slate-700">
          {/* Flight Summary Card */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold text-slate-800 flex items-center gap-2">
                <AirlineLogo
                  airlineCode={flight.airlineCode}
                  airlineName={flight.airlineName}
                  customLogoUrl={flight.airlineLogo}
                  size="xs"
                />
                <span>{flight.airlineName} • {flight.flightNumber}</span>
              </span>
              <span className="bg-slate-200/80 text-slate-700 font-bold px-2 py-0.5 rounded text-[11px]">
                {flight.cabinClass}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-base font-bold text-slate-900">
                  {flight.origin.code} ➔ {flight.destination.code}
                </p>
                <p className="text-xs text-slate-500">
                  {new Date(flight.departureDate).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                  })}
                  {flight.returnDate && ` – ${new Date(flight.returnDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
                </p>
              </div>

              <div className="text-right text-xs text-slate-500">
                <span className="flex items-center gap-1 justify-end font-medium">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span>{totalPax} traveler{totalPax > 1 ? 's' : ''}</span>
                </span>
                <span className="text-[11px] text-emerald-700 font-semibold">
                  {flight.baggageAllowance?.checked || 'Checked Bag Included'}
                </span>
              </div>
            </div>
          </div>

          {/* Side-by-Side Price Comparison Grid */}
          <div className="grid grid-cols-2 gap-3">
            {/* Previous Cached Fare */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-left space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Previous Cached Fare
              </span>
              <div className="text-lg sm:text-xl font-bold text-slate-400 line-through font-mono">
                {formatPrice(cachedPrice)}
              </div>
              <span className="text-[10px] text-slate-400 block">
                At search time
              </span>
            </div>

            {/* Fresh Live Fare */}
            <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-300 text-left space-y-1 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider">
                  Fresh Verified Fare
                </span>
                <span className="inline-flex items-center gap-0.5 text-[10px] font-extrabold text-amber-700 bg-amber-200/80 px-1.5 py-0.5 rounded">
                  <TrendingUp className="w-3 h-3" />
                  <span>+{percentIncrease}%</span>
                </span>
              </div>

              <div className="text-xl sm:text-2xl font-black text-amber-950 font-mono">
                {formatPrice(freshPrice)}
              </div>
              <span className="text-[10px] font-semibold text-amber-800 block">
                + {formatPrice(priceDiff)} increase
              </span>
            </div>
          </div>

          {/* Explanation Notice */}
          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200/80 text-xs text-amber-900 flex items-start gap-2.5 leading-relaxed">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold mb-0.5">Why did the fare change?</p>
              <p className="text-amber-800 text-[11px]">
                Airlines release seats in limited pricing tiers. As seats sell out in real time, the issuer automatically moves to the next available tier before final checkout.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 space-y-2.5">
            <button
              type="button"
              onClick={() => onAccept(freshPrice, bookingUrl)}
              className="w-full py-3.5 px-4 bg-[#006CE4] hover:bg-[#0057B8] text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg cursor-pointer text-center"
            >
              <span>Accept & Proceed with New Fare ({formatPrice(freshPrice)})</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onDecline(freshPrice)}
                className="w-full py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer text-center"
              >
                Choose Another Flight
              </button>

              <a
                href={whatsappHoldUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-center"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>Ask Dhaka Desk to Hold</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
