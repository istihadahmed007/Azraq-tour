import React, { useState, useEffect } from 'react';
import { Plane, AlertCircle, MessageCircle, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { AZRAQ_AGENCY_CONFIG } from '../data/agencyConfig';

interface TravelpayoutsWidgetProps {
  originCode?: string;
  destinationCode?: string;
  onOpenQuote?: () => void;
  className?: string;
}

export const TravelpayoutsWidget: React.FC<TravelpayoutsWidgetProps> = ({
  originCode = 'DAC',
  destinationCode = 'BKK',
  onOpenQuote,
  className = '',
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if widget script container has loaded or if it takes too long
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      id="travelpayouts-booking-widget"
      className={`travelpayouts-booking-widget w-full rounded-2xl bg-[#071A33]/90 border border-sky-400/20 backdrop-blur-md p-4 sm:p-6 shadow-xl transition-all ${className}`}
    >
      {/* Widget Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-700/60 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-300 flex items-center justify-center">
            <Plane className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <span>Live Fare Search & Comparison</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-semibold">
                Partner Network
              </span>
            </h4>
            <p className="text-xs text-slate-300">
              Powered by Travelpayouts • Comparing 700+ airlines from Dhaka
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={`https://wa.me/${AZRAQ_AGENCY_CONFIG.whatsappNumber}?text=${encodeURIComponent(
              `Hello Azraq! I am looking for flight fares from ${originCode} to ${destinationCode}. Can you assist?`
            )}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition-colors cursor-pointer"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>WhatsApp Desk</span>
          </a>
        </div>
      </div>

      {/* Target injection container for Travelpayouts dynamic DOM */}
      <div id="tp-widget-container" className="min-h-[60px] w-full flex flex-col justify-center">
        {hasError ? (
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-400/30 text-amber-200 text-xs space-y-3">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <p className="leading-relaxed font-medium">
                Flight search is temporarily unavailable. Contact the Azraq travel desk on WhatsApp or request a personalized quote, and our team will help arrange your journey.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              <a
                href={`https://wa.me/${AZRAQ_AGENCY_CONFIG.whatsappNumber}?text=${encodeURIComponent(
                  'Hello Azraq! Flight search was unavailable, please assist me with a custom quote.'
                )}`}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors"
              >
                Chat on WhatsApp
              </a>
              {onOpenQuote && (
                <button
                  type="button"
                  onClick={onOpenQuote}
                  className="px-3 py-1.5 rounded-lg bg-[#0D6EFD] text-white font-bold text-xs hover:bg-blue-600 transition-colors cursor-pointer"
                >
                  Request Quote
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="text-xs text-slate-300 space-y-2">
            <div className="flex items-center gap-2 text-sky-200 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              <span>
                Real-time airline routes active for <strong className="text-white font-semibold">{originCode}</strong> ➔ <strong className="text-white font-semibold">{destinationCode}</strong>
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              {AZRAQ_AGENCY_CONFIG.partnerDisclaimer}
            </p>
          </div>
        )}
      </div>

      {/* Trust reassurance footer */}
      <div className="mt-3 pt-3 border-t border-slate-700/50 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-[#22C7C9]" />
          <span>Concierge booking assistance available for all selected routes</span>
        </div>
        <span className="text-slate-500">Dhaka Desk Hotline: {AZRAQ_AGENCY_CONFIG.phoneDisplay}</span>
      </div>
    </div>
  );
};
