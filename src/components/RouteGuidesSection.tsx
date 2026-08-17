import React, { useState } from 'react';
import {
  Plane,
  Clock,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Sparkles,
  Info,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import {
  POPULAR_ROUTE_GUIDES,
  RouteGuideItem,
  buildAviasalesSearchUrl,
  trackFlightSearchEvent,
} from '../data/flightsData';

interface RouteGuidesSectionProps {
  onSelectRoute?: (origin: string, destination: string) => void;
  className?: string;
}

export const RouteGuidesSection: React.FC<RouteGuidesSectionProps> = ({
  onSelectRoute,
  className = '',
}) => {
  const [expandedSlug, setExpandedSlug] = useState<string | null>(POPULAR_ROUTE_GUIDES[0].slug);

  const handleLaunchSearch = (route: RouteGuideItem) => {
    trackFlightSearchEvent('search_completed', {
      origin: route.originCode,
      destination: route.destinationCode,
      source: 'route_guide_card',
    });

    if (onSelectRoute) {
      onSelectRoute(route.originCode, route.destinationCode);
    } else {
      const url = buildAviasalesSearchUrl({
        origin: route.originCode,
        destination: route.destinationCode,
        adults: 1,
        source: 'route_guide',
      });
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <section className={`w-full space-y-6 ${className}`}>
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-200/80 text-purple-700 text-xs font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Curated Bangladesh Route Guides</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif-display font-extrabold text-slate-900 tracking-tight">
          Popular Flight Routes from Dhaka
        </h2>
        <p className="text-sm text-slate-600 max-w-2xl mt-1">
          Essential travel insights, visa guidelines, transit advice, and direct search shortcuts for top routes out of Dhaka (DAC).
        </p>
      </div>

      {/* Accordion / Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        {POPULAR_ROUTE_GUIDES.map((route) => {
          const isExpanded = expandedSlug === route.slug;

          return (
            <div
              key={route.slug}
              className="rounded-2xl bg-white border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              {/* Card Banner */}
              <div className="relative h-36 overflow-hidden">
                <img
                  src={route.heroImage}
                  alt={`Flights from ${route.originCity} to ${route.destinationCity}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent"></div>

                {/* Route Header */}
                <div className="absolute bottom-3 left-4 right-4 text-white flex items-end justify-between">
                  <div>
                    <span className="text-[11px] font-semibold text-sky-300 block uppercase tracking-wider">
                      Flight Guide & Comparison
                    </span>
                    <h3 className="text-lg font-bold font-serif-display leading-tight">
                      {route.originCity} ({route.originCode}) → {route.destinationCity} ({route.destinationCode})
                    </h3>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-md text-[11px] font-mono font-bold">
                    {route.averageFlightTime}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-2 text-xs text-slate-600">
                  {/* Airlines */}
                  <div className="flex items-start gap-2">
                    <Plane className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-800">Airlines: </strong>
                      <span>{route.popularAirlines.join(', ')}</span>
                    </div>
                  </div>

                  {/* Visa */}
                  <div className="flex items-start gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-800">Visa: </strong>
                      <span>{route.visaSummary}</span>
                    </div>
                  </div>

                  {/* Best Season */}
                  <div className="flex items-start gap-2">
                    <Calendar className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-800">Best Season: </strong>
                      <span>{route.bestTimeToFly}</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Action */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                  <span className="text-[11px] text-slate-500 truncate">
                    {route.travelTips}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleLaunchSearch(route)}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shrink-0 shadow-xs cursor-pointer"
                  >
                    <span>Check Fares</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
