import React, { useState, useEffect, useRef } from 'react';
import { Plane, AlertCircle, MessageCircle, ShieldCheck, Sparkles, Building2, ExternalLink } from 'lucide-react';
import { AZRAQ_AGENCY_CONFIG } from '../data/agencyConfig';

interface TravelpayoutsWidgetProps {
  originCode?: string;
  destinationCode?: string;
  onOpenQuote?: () => void;
  className?: string;
  defaultTab?: 'deals' | 'hotels' | 'schedule' | 'map' | 'search';
}

export const TravelpayoutsWidget: React.FC<TravelpayoutsWidgetProps> = ({
  originCode = 'DAC',
  destinationCode = 'BKK',
  onOpenQuote,
  className = '',
  defaultTab = 'deals',
}) => {
  const [activeTab, setActiveTab] = useState<'deals' | 'hotels' | 'schedule' | 'map' | 'search'>(defaultTab);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [hasError, setHasError] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear previous children if any to prevent duplicate widgets on re-renders
    const currentContainer = containerRef.current;
    currentContainer.innerHTML = '';
    setHasError(false);
    setIsScriptLoaded(false);

    const script = document.createElement('script');
    if (activeTab === 'deals') {
      script.src =
        'https://tpwidg.com/content?currency=usd&trs=563001&shmarker=760251&target_host=www.aviasales.com%2Fsearch&locale=en&limit=10&powered_by=true&primary=%230085FF&promo_id=4044&campaign_id=100';
    } else if (activeTab === 'hotels') {
      script.src =
        'https://tpwidg.com/content?currency=usd&trs=563001&shmarker=760251&locale=en&stops=any&show_hotels=true&powered_by=true&border_radius=0&plain=true&color_button=%2300A991&color_button_text=%23ffffff&promo_id=3414&campaign_id=111';
    } else if (activeTab === 'schedule') {
      script.src =
        'https://tpwidg.com/content?currency=usd&trs=563001&shmarker=760251&color_button=%23FF0000&target_host=www.aviasales.com%2Fsearch&locale=en&powered_by=true&origin=LON&destination=BKK&with_fallback=true&non_direct_flights=false&min_lines=5&border_radius=0&color_background=%23FFFFFF&color_text=%23000000&color_border=%23FFFFFF&promo_id=2811&campaign_id=100';
    } else if (activeTab === 'map') {
      script.src =
        'https://tpwidg.com/content?currency=usd&trs=563001&shmarker=760251&lat=51.5073509&lng=-0.1277583&powered_by=true&search_host=www.aviasales.com%2Fsearch&locale=en&origin=LON&value_min=0&value_max=1000000&round_trip=true&only_direct=false&radius=1&draggable=true&disable_zoom=false&show_logo=false&scrollwheel=false&primary=%233FABDB&secondary=%233FABDB&light=%23ffffff&width=1500&height=500&zoom=2&promo_id=4054&campaign_id=100';
    } else {
      script.src =
        'https://tpwidg.com/content?currency=usd&trs=563001&shmarker=760251&show_hotels=true&powered_by=true&locale=en&searchUrl=www.aviasales.com%2Fsearch&primary_override=%2332a8dd&color_button=%2332a8dd&color_icons=%2332a8dd&dark=%23262626&light=%23ffffff&secondary=%233FABDB&special=%23C4C4C4&color_focused=%2332a8dd&border_radius=0&plain=false&promo_id=7879&campaign_id=100';
    }
    script.async = true;
    script.charset = 'utf-8';

    script.onload = () => {
      setIsScriptLoaded(true);
      setHasError(false);
    };

    script.onerror = () => {
      setHasError(true);
    };

    currentContainer.appendChild(script);

    // Timeout check if script failed or was blocked by browser adblockers
    const timeout = setTimeout(() => {
      if (currentContainer && currentContainer.childElementCount <= 1 && !isScriptLoaded) {
        setHasError(true);
      }
    }, 4500);

    return () => {
      clearTimeout(timeout);
      if (currentContainer) {
        currentContainer.innerHTML = '';
      }
    };
  }, [originCode, destinationCode, activeTab]);

  return (
    <div
      id="travelpayouts-booking-widget"
      className={`travelpayouts-booking-widget w-full rounded-2xl bg-[#071A33]/95 border border-sky-400/30 backdrop-blur-md p-4 sm:p-6 shadow-2xl transition-all ${className}`}
    >
      {/* Widget Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-700/60 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-sky-500/20 border border-sky-400/30 text-sky-300 flex items-center justify-center shadow-inner">
            <Plane className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm sm:text-base font-extrabold text-white tracking-tight flex items-center gap-2">
              <span>
                {activeTab === 'deals'
                  ? 'Top 10 Live Flight Deals'
                  : activeTab === 'hotels'
                  ? 'Top Hotel Deals (Hotellook)'
                  : activeTab === 'schedule'
                  ? 'Direct Routes & Live Schedules'
                  : activeTab === 'map'
                  ? 'Interactive Global Flight Map'
                  : 'Flight & Hotel Search Engine'}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono font-semibold">
                Partner Network
              </span>
            </h4>
            <p className="text-xs text-slate-300 flex items-center gap-1.5 pt-0.5">
              <span>Aviasales & Travelpayouts Live Feed</span>
              <span>•</span>
              <span className="text-sky-300 font-medium">Marker: 760251</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          {/* Switcher Pills */}
          <div className="flex items-center bg-slate-900/80 p-1 rounded-xl border border-slate-700/70 flex-wrap sm:flex-nowrap gap-1">
            <button
              type="button"
              onClick={() => setActiveTab('deals')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'deals'
                  ? 'bg-sky-500 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Top Deals
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('hotels')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'hotels'
                  ? 'bg-emerald-500 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Hotels
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('schedule')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'schedule'
                  ? 'bg-sky-500 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Direct Schedules
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('map')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'map'
                  ? 'bg-sky-500 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Flight Map
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('search')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'search'
                  ? 'bg-sky-500 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Search Engine
            </button>
          </div>

          <a
            href={`https://wa.me/${AZRAQ_AGENCY_CONFIG.whatsappNumber}?text=${encodeURIComponent(
              `Hello Azraq Travel Concierge! I am searching for flight deals from ${originCode} to ${destinationCode}. Can you assist with offline group booking or hold?`
            )}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition-all shadow-sm cursor-pointer whitespace-nowrap"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Dhaka Desk WhatsApp</span>
          </a>
        </div>
      </div>

      {/* Target injection container for Travelpayouts dynamic DOM */}
      <div className="w-full relative min-h-[140px] flex flex-col justify-center">
        {/* Dynamic widget container where script injects UI */}
        <div
          ref={containerRef}
          id="tp-widget-container"
          className="w-full min-h-[100px] overflow-hidden rounded-xl bg-white/5 border border-white/10 p-2 sm:p-3"
        />

        {hasError && (
          <div className="mt-3 p-4 rounded-xl bg-amber-500/10 border border-amber-400/30 text-amber-200 text-xs space-y-3 animate-fadeIn">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold text-amber-300">Third-Party Script Notice</p>
                <p className="leading-relaxed text-slate-300">
                  If the interactive search widget is blocked by browser ad-blockers or privacy extensions, you can search directly or connect with our Gulshan-2 Dhaka travel desk for instant flight quotes and hotel holds.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              <a
                href={`https://flights.travelpayouts.com/search?origin=${originCode}&destination=${destinationCode}&marker=563001`}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-1.5 rounded-lg bg-[#0D6EFD] text-white font-bold text-xs hover:bg-blue-600 transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <span>Open Aviasales Search</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href={`https://wa.me/${AZRAQ_AGENCY_CONFIG.whatsappNumber}?text=${encodeURIComponent(
                  `Hello Azraq! Please provide a custom flight and hotel quote from ${originCode} to ${destinationCode}.`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors flex items-center gap-1.5"
              >
                <MessageCircle className="w-3 h-3" />
                <span>Chat with Travel Desk</span>
              </a>
              {onOpenQuote && (
                <button
                  type="button"
                  onClick={onOpenQuote}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-800 text-slate-200 border border-slate-700 font-bold text-xs hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  Request Official Quotation
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Trust reassurance footer */}
      <div className="mt-4 pt-3 border-t border-slate-700/50 flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-300">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#22C7C9]" />
          <span>IATA Licensed Airline Distribution & Verified Partner Inventory</span>
        </div>
        <div className="flex items-center gap-4 text-slate-400">
          <span className="flex items-center gap-1">
            <Building2 className="w-3.5 h-3.5 text-sky-400" />
            <span>Gulshan-2, Dhaka</span>
          </span>
          <span className="text-slate-400 font-mono">Hotline: {AZRAQ_AGENCY_CONFIG.phoneDisplay}</span>
        </div>
      </div>
    </div>
  );
};

