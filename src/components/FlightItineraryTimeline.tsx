import React, { useState, useEffect } from 'react';
import {
  Plane,
  Clock,
  ArrowRight,
  ShieldCheck,
  Luggage,
  Coffee,
  Wifi,
  Tv,
  Zap,
  Info,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  MessageCircle,
  Share2,
  Check,
  AlertTriangle,
  Sparkles,
  MapPin,
  Calendar,
  Layers,
  Sliders,
  SlidersHorizontal,
  Compass,
  Building,
  HelpCircle,
} from 'lucide-react';
import {
  FullFlightItinerary,
  ItinerarySegment,
  LayoverInfo,
  SAMPLE_FLIGHT_ITINERARIES,
} from '../data/flightItinerariesData';
import { AZRAQ_AGENCY_CONFIG } from '../data/agencyConfig';
import { buildAviasalesSearchUrl, trackFlightSearchEvent } from '../data/flightsData';
import {
  NormalizedFlightSearch,
  generateMatchingFlightItinerary,
  buildDynamicFlightWhatsAppUrl,
  buildDynamicFlightShareText,
} from '../utils/flightSearchEngine';
import { AirlineLogo } from './AirlineLogo';

interface FlightItineraryTimelineProps {
  search?: NormalizedFlightSearch;
  itinerary?: FullFlightItinerary;
  isSampleDemo?: boolean;
  onBookDirect?: (url: string) => void;
  onSelectItinerary?: (itinerary: FullFlightItinerary) => void;
  showControls?: boolean;
  defaultViewMode?: 'timeline' | 'compact' | 'details';
  className?: string;
}

export const FlightItineraryTimeline: React.FC<FlightItineraryTimelineProps> = ({
  search,
  itinerary: initialItinerary,
  isSampleDemo = false,
  onBookDirect,
  onSelectItinerary,
  showControls = true,
  defaultViewMode = 'timeline',
  className = '',
}) => {
  // Resolve initial itinerary: if search is given, generate strictly matching itinerary; otherwise use initialItinerary
  const resolveItinerary = (): FullFlightItinerary => {
    if (search) {
      return generateMatchingFlightItinerary(search);
    }
    if (initialItinerary) {
      return initialItinerary;
    }
    return SAMPLE_FLIGHT_ITINERARIES[0];
  };

  const [currentItinerary, setCurrentItinerary] = useState<FullFlightItinerary>(resolveItinerary);
  const [activeDirection, setActiveDirection] = useState<'outbound' | 'return'>('outbound');
  const [viewMode, setViewMode] = useState<'timeline' | 'compact' | 'details'>(defaultViewMode);
  const [timeDisplayMode, setTimeDisplayMode] = useState<'local' | 'origin'>('local');
  const [selectedNodeIndex, setSelectedNodeIndex] = useState<{
    type: 'segment' | 'layover';
    index: number;
  } | null>({ type: 'segment', index: 0 });
  const [copied, setCopied] = useState<boolean>(false);
  const [isSampleMode, setIsSampleMode] = useState<boolean>(isSampleDemo);

  // Sync if search or initialItinerary changes from parent
  useEffect(() => {
    if (search) {
      const generated = generateMatchingFlightItinerary(search);
      setCurrentItinerary(generated);
      setIsSampleMode(false);
      setActiveDirection('outbound');
      setSelectedNodeIndex({ type: 'segment', index: 0 });
    } else if (initialItinerary) {
      setCurrentItinerary(initialItinerary);
      setIsSampleMode(isSampleDemo);
    }
  }, [
    search?.origin?.code,
    search?.destination?.code,
    search?.departureDate,
    search?.returnDate,
    search?.tripType,
    search?.adults,
    search?.children,
    search?.infants,
    search?.cabinClass,
    initialItinerary,
    isSampleDemo,
  ]);

  const activeSegments =
    activeDirection === 'outbound' || !currentItinerary.returnSegments
      ? currentItinerary.outboundSegments
      : currentItinerary.returnSegments;

  const activeLayovers =
    activeDirection === 'outbound' || !currentItinerary.returnLayovers
      ? currentItinerary.outboundLayovers
      : currentItinerary.returnLayovers;

  const totalJourneyTime =
    activeDirection === 'outbound' || !currentItinerary.returnTotalJourneyFormatted
      ? currentItinerary.totalJourneyFormatted
      : currentItinerary.returnTotalJourneyFormatted;

  // Format time based on mode (Local vs. Origin Dhaka Time)
  const formatTime = (timeStr: string, utcOffset: number, originOffset: number = 6) => {
    if (timeDisplayMode === 'local') {
      return { time: timeStr, label: `UTC${utcOffset >= 0 ? '+' + utcOffset : utcOffset}` };
    }
    const [hours, minutes] = timeStr.split(':').map(Number);
    const diff = originOffset - utcOffset;
    let convertedHours = (hours + diff + 24) % 24;
    const formatted = `${String(convertedHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    return { time: formatted, label: 'Dhaka Time (BST)' };
  };

  const handleCopyItinerary = () => {
    let summary = '';
    if (search) {
      summary = buildDynamicFlightShareText(search, currentItinerary.samplePriceBDT);
    } else {
      summary = `✈️ ${currentItinerary.routeTitle}\nDuration: ${totalJourneyTime} (${currentItinerary.stopsCount === 0 ? 'Non-Stop' : `${currentItinerary.stopsCount} Stop`})\nAirline: ${currentItinerary.primaryAirlineName}\nFare: BDT ${currentItinerary.samplePriceBDT.toLocaleString()}\nBooked via Azraq Tours & Travels`;
    }
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleBookingRedirect = () => {
    if (isSampleMode) return;

    trackFlightSearchEvent('affiliate_deal_clicked', {
      route: currentItinerary.routeTitle,
      airline: currentItinerary.primaryAirlineName,
      price: currentItinerary.samplePriceBDT,
      source: 'flight_itinerary_timeline',
    });

    const targetUrl =
      currentItinerary.aviasalesDeepLink ||
      buildAviasalesSearchUrl({
        origin: currentItinerary.originCode,
        destination: currentItinerary.destinationCode,
        departDate: activeSegments[0]?.departureDate,
        returnDate: currentItinerary.returnSegments?.[0]?.departureDate,
        source: 'itinerary_timeline_widget',
      });

    if (onBookDirect) {
      onBookDirect(targetUrl);
    } else {
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
    }
  };

  // Helper for Amenity Icon
  const renderAmenityIcon = (iconName: string) => {
    switch (iconName) {
      case 'wifi':
        return <Wifi className="w-3.5 h-3.5 text-blue-500" />;
      case 'meal':
        return <Coffee className="w-3.5 h-3.5 text-amber-500" />;
      case 'entertainment':
        return <Tv className="w-3.5 h-3.5 text-purple-500" />;
      case 'power':
        return <Zap className="w-3.5 h-3.5 text-emerald-500" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-sky-500" />;
    }
  };

  // Build dynamic WhatsApp URL strictly for current route and parameters
  const dynamicWhatsAppUrl = search
    ? buildDynamicFlightWhatsAppUrl(search, currentItinerary.samplePriceBDT)
    : `https://wa.me/${AZRAQ_AGENCY_CONFIG.whatsappNumber}?text=${encodeURIComponent(
        `Hello Azraq Desk! Please review and assist me with booking this flight itinerary: ${currentItinerary.routeTitle} (${currentItinerary.primaryAirlineName}) for BDT ${currentItinerary.samplePriceBDT.toLocaleString()}.`
      )}`;

  return (
    <div
      className={`w-full rounded-3xl bg-white border border-slate-200/90 shadow-xl overflow-hidden transition-all duration-300 ${className}`}
    >
      {/* 1. Header Toolbar */}
      <div className="bg-gradient-to-r from-[#071A33] via-[#0B2548] to-[#071A33] p-5 sm:p-6 text-white border-b border-slate-700/60">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Route Title & Main Specs */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-sky-200 text-xs font-bold">
                <AirlineLogo airlineName={currentItinerary.primaryAirlineName} size="xs" />
                <span>{currentItinerary.primaryAirlineName}</span>
              </span>

              <span className="px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium">
                {currentItinerary.fareClass}
              </span>

              {currentItinerary.stopsCount === 0 ? (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold">
                  Direct Non-Stop
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold">
                  {currentItinerary.stopsCount} Layover ({currentItinerary.totalLayoverTimeFormatted || 'Transit'})
                </span>
              )}

              {currentItinerary.tags.map((tag) => (
                <span
                  key={tag}
                  className="hidden sm:inline-block px-2 py-0.5 rounded-md bg-white/10 text-slate-200 text-[11px]"
                >
                  {tag}
                </span>
              ))}
            </div>

            <h3 className="text-xl sm:text-2xl font-serif-display font-extrabold text-white tracking-tight">
              {currentItinerary.routeTitle}
            </h3>

            <div className="flex items-center gap-3 text-xs text-sky-200/90 flex-wrap">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-sky-400" />
                <span>Total Elapsed: <strong>{totalJourneyTime}</strong></span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Luggage className="w-3.5 h-3.5 text-sky-400" />
                <span>Baggage: <strong>{activeSegments[0]?.baggageAllowance.checked}</strong></span>
              </span>
              <span>•</span>
              <span>Flight Time: <strong>{currentItinerary.totalFlightTimeFormatted}</strong></span>
            </div>
          </div>

          {/* Right Controls & Toggles */}
          <div className="flex items-center gap-2.5 flex-wrap self-start lg:self-center">
            {/* Direction Tab if Roundtrip */}
            {currentItinerary.returnSegments && (
              <div className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-700 text-xs">
                <button
                  type="button"
                  onClick={() => setActiveDirection('outbound')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    activeDirection === 'outbound'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Outbound Leg
                </button>
                <button
                  type="button"
                  onClick={() => setActiveDirection('return')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    activeDirection === 'return'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Return Leg
                </button>
              </div>
            )}

            {/* Timezone Display Toggle */}
            <button
              type="button"
              onClick={() => setTimeDisplayMode(timeDisplayMode === 'local' ? 'origin' : 'local')}
              className="px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Toggle between local airport time and Dhaka Bangladesh departure time"
            >
              <Compass className="w-3.5 h-3.5 text-sky-400" />
              <span>{timeDisplayMode === 'local' ? 'Local Times' : 'Dhaka (BST)'}</span>
            </button>

            {/* View Mode Switcher */}
            <div className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-700 text-xs">
              <button
                type="button"
                onClick={() => setViewMode('timeline')}
                className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'timeline'
                    ? 'bg-blue-600 text-white font-bold shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Interactive horizontal visual timeline"
              >
                Timeline
              </button>
              <button
                type="button"
                onClick={() => setViewMode('details')}
                className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'details'
                    ? 'bg-blue-600 text-white font-bold shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Card boarding pass detail view"
              >
                Cards
              </button>
              <button
                type="button"
                onClick={() => setViewMode('compact')}
                className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'compact'
                    ? 'bg-blue-600 text-white font-bold shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Streamlined compact bar"
              >
                Compact
              </button>
            </div>
          </div>
        </div>

        {/* Preset Sample Route Switcher (Optional showcase selector for testing top Bangladesh routes) */}
        {showControls && (
          <div className="mt-4 pt-3 border-t border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <span className="text-slate-400 font-semibold shrink-0">Sample Route Demos:</span>
              {SAMPLE_FLIGHT_ITINERARIES.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setCurrentItinerary(item);
                    setIsSampleMode(true);
                    setActiveDirection('outbound');
                    setSelectedNodeIndex({ type: 'segment', index: 0 });
                    if (onSelectItinerary) onSelectItinerary(item);
                  }}
                  className={`px-3 py-1 rounded-lg shrink-0 font-medium transition-colors cursor-pointer ${
                    currentItinerary.id === item.id && isSampleMode
                      ? 'bg-sky-500 text-white font-bold shadow-xs'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  {item.originCode} ➔ {item.destinationCode} ({item.primaryAirlineName})
                </button>
              ))}
            </div>

            {search && isSampleMode && (
              <button
                type="button"
                onClick={() => {
                  const generated = generateMatchingFlightItinerary(search);
                  setCurrentItinerary(generated);
                  setIsSampleMode(false);
                }}
                className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold shrink-0 transition-colors cursor-pointer"
              >
                Back to My Search ({search.origin.code}➔{search.destination.code})
              </button>
            )}
          </div>
        )}

        {/* Non-Bookable Sample Itinerary Notice */}
        {isSampleMode && (
          <div className="mt-3 p-3 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-200 text-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong>Non-Bookable Sample Itinerary:</strong> This route is displayed for layout and timeline demonstration purposes only.
              </span>
            </div>
            {search && (
              <button
                type="button"
                onClick={() => {
                  const generated = generateMatchingFlightItinerary(search);
                  setCurrentItinerary(generated);
                  setIsSampleMode(false);
                }}
                className="text-xs text-sky-300 hover:text-white underline font-semibold shrink-0 cursor-pointer"
              >
                Show My Searched Route
              </button>
            )}
          </div>
        )}
      </div>

      {/* 2. Main Timeline View (Horizontal Flow) */}
      {viewMode === 'timeline' && (
        <div className="p-5 sm:p-7 bg-[#F8FAFC] space-y-6">
          {/* Horizontal Track Container */}
          <div className="relative bg-white rounded-2xl p-5 sm:p-7 border border-slate-200/90 shadow-sm overflow-x-auto">
            <div className="min-w-[650px] flex items-center justify-between relative py-4">
              {/* Background Connecting Route Line */}
              <div className="absolute top-1/2 left-10 right-10 -translate-y-1/2 h-1.5 bg-gradient-to-r from-blue-500 via-sky-400 to-indigo-600 rounded-full z-0 opacity-40"></div>

              {/* Step 1: Origin Airport Node */}
              {(() => {
                const originSeg = activeSegments[0];
                const originTime = formatTime(
                  originSeg.departureTimeLocal,
                  originSeg.departureUtcOffset
                );
                return (
                  <div
                    onClick={() => setSelectedNodeIndex({ type: 'segment', index: 0 })}
                    className="relative z-10 flex flex-col items-center text-center cursor-pointer group"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 text-white flex flex-col items-center justify-center shadow-lg group-hover:scale-105 transition-transform border-2 border-white ring-4 ring-blue-100">
                      <span className="font-mono text-base font-extrabold tracking-wider">
                        {originSeg.originCode}
                      </span>
                      <span className="text-[10px] text-sky-200 font-semibold">
                        {originSeg.originTerminal.split(' ')[0]}
                      </span>
                    </div>

                    <div className="mt-3 space-y-0.5">
                      <span className="text-lg font-extrabold text-slate-900 font-mono block">
                        {originTime.time}
                      </span>
                      <span className="text-[11px] font-bold text-slate-700 block">
                        {originSeg.originCity}
                      </span>
                      <span className="text-[10px] text-slate-400 block max-w-[120px] truncate">
                        {originSeg.originAirportName}
                      </span>
                      <span className="inline-block text-[10px] px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium">
                        {originSeg.departureDate}
                      </span>
                    </div>
                  </div>
                );
              })()}

              {/* Segment 1 Path & Details */}
              {(() => {
                const seg1 = activeSegments[0];
                const isSelected =
                  selectedNodeIndex?.type === 'segment' && selectedNodeIndex.index === 0;

                return (
                  <div
                    onClick={() => setSelectedNodeIndex({ type: 'segment', index: 0 })}
                    className={`flex-1 mx-4 p-3 rounded-2xl transition-all cursor-pointer text-center relative z-10 border ${
                      isSelected
                        ? 'bg-blue-50/90 border-blue-400 shadow-md ring-2 ring-blue-200'
                        : 'bg-slate-50/80 hover:bg-slate-100 border-slate-200/80 hover:border-slate-300'
                    }`}
                  >
                    {/* Top Flight Badge */}
                    <div className="flex items-center justify-center gap-2 mb-1.5 flex-wrap">
                      <AirlineLogo airlineCode={seg1.airlineCode} airlineName={seg1.airlineName} size="xs" />
                      <span className="font-mono font-bold text-xs text-blue-900 bg-white px-2 py-0.5 rounded-md border border-slate-200 shadow-2xs">
                        {seg1.flightNumber}
                      </span>
                      <span className="text-xs font-semibold text-slate-700">
                        {seg1.airlineName}
                      </span>
                      <span className="text-[11px] text-slate-500 font-mono">
                        ({seg1.aircraft})
                      </span>
                    </div>

                    {/* Flight Flow Line with Flying Plane Icon */}
                    <div className="relative py-1 flex items-center justify-center">
                      <div className="w-full h-0.5 bg-blue-300 border-t border-dashed border-blue-400"></div>
                      <div className="absolute w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md -translate-y-0.5">
                        <Plane className="w-3.5 h-3.5 transform rotate-45" />
                      </div>
                    </div>

                    {/* Duration & Key Amenities */}
                    <div className="mt-1.5 flex items-center justify-center gap-2 text-xs">
                      <span className="font-bold text-slate-800 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                        {seg1.durationFormatted}
                      </span>
                      <div className="flex items-center gap-1">
                        {seg1.amenities.slice(0, 3).map((a, i) => (
                          <span
                            key={i}
                            title={`${a.label}: ${a.detail}`}
                            className="p-1 rounded-md bg-white border border-slate-200"
                          >
                            {renderAmenityIcon(a.iconName)}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Layover Node(s) if 1+ stops */}
              {activeLayovers && activeLayovers.length > 0 && (
                <>
                  {activeLayovers.map((layover, layoverIdx) => {
                    const isSelected =
                      selectedNodeIndex?.type === 'layover' &&
                      selectedNodeIndex.index === layoverIdx;

                    return (
                      <div
                        key={layover.airportCode}
                        onClick={() =>
                          setSelectedNodeIndex({ type: 'layover', index: layoverIdx })
                        }
                        className="relative z-10 flex flex-col items-center text-center cursor-pointer group"
                      >
                        {/* Transit Pulse Node */}
                        <div
                          className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex flex-col items-center justify-center transition-all border-2 ${
                            isSelected
                              ? 'bg-amber-500 text-white border-amber-300 ring-4 ring-amber-100 scale-105 shadow-lg'
                              : 'bg-amber-100 text-amber-900 border-amber-300 hover:bg-amber-200 hover:scale-105 shadow-md'
                          }`}
                        >
                          <Clock className="w-4 h-4 text-amber-800" />
                          <span className="font-mono text-xs font-black">
                            {layover.airportCode}
                          </span>
                        </div>

                        {/* Layover Info Pill */}
                        <div className="mt-2.5 space-y-1">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-[11px] font-bold shadow-2xs whitespace-nowrap">
                            <Clock className="w-3 h-3 text-amber-600" />
                            <span>{layover.durationFormatted} Layover</span>
                          </span>

                          <span className="text-[11px] font-bold text-slate-800 block">
                            {layover.city}
                          </span>

                          <span className="inline-block text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-1.5 py-0.5 rounded-md font-medium">
                            {layover.isTerminalChange
                              ? 'Terminal Change'
                              : 'Same Terminal'}
                          </span>
                        </div>
                      </div>
                    );
                  })}

                  {/* Segment 2 Path (Second Leg) */}
                  {activeSegments[1] && (
                    (() => {
                      const seg2 = activeSegments[1];
                      const isSelected =
                        selectedNodeIndex?.type === 'segment' &&
                        selectedNodeIndex.index === 1;

                      return (
                        <div
                          onClick={() =>
                            setSelectedNodeIndex({ type: 'segment', index: 1 })
                          }
                          className={`flex-1 mx-4 p-3 rounded-2xl transition-all cursor-pointer text-center relative z-10 border ${
                            isSelected
                              ? 'bg-blue-50/90 border-blue-400 shadow-md ring-2 ring-blue-200'
                              : 'bg-slate-50/80 hover:bg-slate-100 border-slate-200/80 hover:border-slate-300'
                          }`}
                        >
                          {/* Flight Badge */}
                          <div className="flex items-center justify-center gap-2 mb-1.5 flex-wrap">
                            <AirlineLogo airlineCode={seg2.airlineCode} airlineName={seg2.airlineName} size="xs" />
                            <span className="font-mono font-bold text-xs text-blue-900 bg-white px-2 py-0.5 rounded-md border border-slate-200 shadow-2xs">
                              {seg2.flightNumber}
                            </span>
                            <span className="text-xs font-semibold text-slate-700">
                              {seg2.airlineName}
                            </span>
                            <span className="text-[11px] text-slate-500 font-mono">
                              ({seg2.aircraft})
                            </span>
                          </div>

                          {/* Flight Flow Line */}
                          <div className="relative py-1 flex items-center justify-center">
                            <div className="w-full h-0.5 bg-blue-300 border-t border-dashed border-blue-400"></div>
                            <div className="absolute w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-md -translate-y-0.5">
                              <Plane className="w-3.5 h-3.5 transform rotate-45" />
                            </div>
                          </div>

                          {/* Duration & Key Amenities */}
                          <div className="mt-1.5 flex items-center justify-center gap-2 text-xs">
                            <span className="font-bold text-slate-800 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                              {seg2.durationFormatted}
                            </span>
                            <div className="flex items-center gap-1">
                              {seg2.amenities.slice(0, 3).map((a, i) => (
                                <span
                                  key={i}
                                  title={`${a.label}: ${a.detail}`}
                                  className="p-1 rounded-md bg-white border border-slate-200"
                                >
                                  {renderAmenityIcon(a.iconName)}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })()
                  )}
                </>
              )}

              {/* Final Destination Airport Node */}
              {(() => {
                const lastSeg = activeSegments[activeSegments.length - 1];
                const destTime = formatTime(
                  lastSeg.arrivalTimeLocal,
                  lastSeg.arrivalUtcOffset
                );
                return (
                  <div
                    onClick={() =>
                      setSelectedNodeIndex({
                        type: 'segment',
                        index: activeSegments.length - 1,
                      })
                    }
                    className="relative z-10 flex flex-col items-center text-center cursor-pointer group"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-700 to-slate-950 text-white flex flex-col items-center justify-center shadow-lg group-hover:scale-105 transition-transform border-2 border-white ring-4 ring-indigo-100">
                      <span className="font-mono text-base font-extrabold tracking-wider">
                        {lastSeg.destinationCode}
                      </span>
                      <span className="text-[10px] text-sky-200 font-semibold">
                        {lastSeg.destinationTerminal.split(' ')[0]}
                      </span>
                    </div>

                    <div className="mt-3 space-y-0.5">
                      <div className="flex items-center justify-center gap-1">
                        <span className="text-lg font-extrabold text-slate-900 font-mono">
                          {destTime.time}
                        </span>
                        {lastSeg.daysDifference > 0 && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-rose-100 text-rose-700 font-bold">
                            +{lastSeg.daysDifference}d
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-bold text-slate-700 block">
                        {lastSeg.destinationCity}
                      </span>
                      <span className="text-[10px] text-slate-400 block max-w-[120px] truncate">
                        {lastSeg.destinationAirportName}
                      </span>
                      <span className="inline-block text-[10px] px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium">
                        {lastSeg.arrivalDate}
                      </span>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* 3. Interactive Inspector Card (Displays Selected Leg / Layover) */}
          {selectedNodeIndex && (
            <div className="p-5 sm:p-6 rounded-2xl bg-white border border-blue-200 shadow-sm space-y-4 animate-fadeIn">
              {selectedNodeIndex.type === 'segment' ? (
                (() => {
                  const seg = activeSegments[selectedNodeIndex.index];
                  if (!seg) return null;

                  return (
                    <div className="space-y-4">
                      {/* Title & Airline Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center font-mono font-extrabold text-sm">
                            {seg.airlineCode}
                          </div>
                          <div>
                            <h4 className="font-serif-display font-bold text-slate-900 text-base flex items-center gap-2">
                              <span>Leg {selectedNodeIndex.index + 1}: {seg.airlineName} {seg.flightNumber}</span>
                              <span className="text-xs px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-mono font-semibold">
                                {seg.aircraft}
                              </span>
                            </h4>
                            <p className="text-xs text-slate-500">
                              {seg.originCity} ({seg.originCode}) ➔ {seg.destinationCity} ({seg.destinationCode}) • {seg.cabinClass} Class
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-xs">
                          <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-semibold font-mono">
                            Flight Time: {seg.durationFormatted}
                          </span>
                          <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-semibold">
                            Distance: {seg.distanceKm.toLocaleString()} km
                          </span>
                        </div>
                      </div>

                      {/* Flight Details Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
                          <span className="text-slate-400 text-[11px] block font-medium">Departure Terminal</span>
                          <p className="font-bold text-slate-900">{seg.originTerminal}</p>
                          <p className="text-[11px] text-slate-500">{seg.originAirportName}</p>
                        </div>

                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
                          <span className="text-slate-400 text-[11px] block font-medium">Arrival Terminal</span>
                          <p className="font-bold text-slate-900">{seg.destinationTerminal}</p>
                          <p className="text-[11px] text-slate-500">{seg.destinationAirportName}</p>
                        </div>

                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
                          <span className="text-slate-400 text-[11px] block font-medium">Seat Pitch & Recline</span>
                          <p className="font-bold text-slate-900">{seg.seatPitch}</p>
                          <p className="text-[11px] text-slate-500">Ergonomic adjustable headrest</p>
                        </div>

                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
                          <span className="text-slate-400 text-[11px] block font-medium">Baggage Allowance</span>
                          <p className="font-bold text-slate-900">{seg.baggageAllowance.checked}</p>
                          <p className="text-[11px] text-slate-500">Cabin: {seg.baggageAllowance.cabin}</p>
                        </div>
                      </div>

                      {/* Inflight Amenities */}
                      <div className="space-y-2 pt-1">
                        <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                          Included In-flight Amenities & Services
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                          {seg.amenities.map((amenity, i) => (
                            <div
                              key={i}
                              className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-start gap-2.5 shadow-2xs"
                            >
                              <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-100 shrink-0">
                                {renderAmenityIcon(amenity.iconName)}
                              </div>
                              <div className="text-xs">
                                <span className="font-bold text-slate-900 block leading-tight">
                                  {amenity.label}
                                </span>
                                <span className="text-[11px] text-slate-500 line-clamp-2">
                                  {amenity.detail}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })()
              ) : (
                (() => {
                  const layover = activeLayovers[selectedNodeIndex.index];
                  if (!layover) return null;

                  return (
                    <div className="space-y-4">
                      {/* Layover Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-amber-200/80">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-300 text-amber-900 flex items-center justify-center font-mono font-extrabold text-sm">
                            <Clock className="w-5 h-5 text-amber-700" />
                          </div>
                          <div>
                            <h4 className="font-serif-display font-bold text-slate-900 text-base flex items-center gap-2">
                              <span>Transit Hub: {layover.airportName} ({layover.airportCode})</span>
                              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold">
                                {layover.durationFormatted} Stopover
                              </span>
                            </h4>
                            <p className="text-xs text-slate-600">
                              {layover.city}, {layover.country} • Arrive at {layover.arrivalTerminal}, Depart from {layover.departureTerminal}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Baggage Auto-Transferred</span>
                          </span>
                        </div>
                      </div>

                      {/* Transit Alert & Visa Guideline */}
                      <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200/90 text-xs text-amber-950 space-y-1.5">
                        <div className="flex items-center gap-2 font-bold text-amber-900">
                          <Info className="w-4 h-4 text-amber-700 shrink-0" />
                          <span>Bangladesh Passport Transit Advisory</span>
                        </div>
                        <p className="text-[11px] leading-relaxed text-amber-900/90">
                          {layover.transitVisaNote}
                        </p>
                      </div>

                      {/* Highlights & Airport Amenities */}
                      <div className="space-y-2">
                        <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                          {layover.airportCode} Terminal Facilities & Transit Highlights
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {layover.airportHighlights.map((hl, i) => (
                            <div
                              key={i}
                              className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700"
                            >
                              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                              <span>{hl}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })()
              )}
            </div>
          )}
        </div>
      )}

      {/* 3. Alternative View: Step-by-Step Card Mode */}
      {viewMode === 'details' && (
        <div className="p-5 sm:p-7 bg-[#F8FAFC] space-y-4">
          {activeSegments.map((seg, idx) => (
            <React.Fragment key={seg.id}>
              {/* Flight Segment Card */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <AirlineLogo airlineCode={seg.airlineCode} airlineName={seg.airlineName} size="md" />
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">
                        {seg.airlineName} · {seg.flightNumber}
                      </h4>
                      <p className="text-xs text-slate-500">
                        {seg.aircraft} • {seg.cabinClass}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full font-mono self-start sm:self-center">
                    Duration: {seg.durationFormatted}
                  </span>
                </div>

                {/* Times Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs py-1">
                  <div className="space-y-1">
                    <span className="text-slate-400 font-medium">Departure</span>
                    <p className="text-base font-extrabold text-slate-900 font-mono">
                      {seg.departureTimeLocal}{' '}
                      <span className="text-xs font-normal text-slate-500">({seg.originCode})</span>
                    </p>
                    <p className="text-slate-600">{seg.originCity} · {seg.originTerminal}</p>
                    <p className="text-[11px] text-slate-400">{seg.departureDate}</p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-slate-400 font-medium">Arrival</span>
                    <p className="text-base font-extrabold text-slate-900 font-mono">
                      {seg.arrivalTimeLocal}{' '}
                      <span className="text-xs font-normal text-slate-500">({seg.destinationCode})</span>
                      {seg.daysDifference > 0 && (
                        <span className="ml-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-rose-100 text-rose-700">
                          +{seg.daysDifference} Day
                        </span>
                      )}
                    </p>
                    <p className="text-slate-600">{seg.destinationCity} · {seg.destinationTerminal}</p>
                    <p className="text-[11px] text-slate-400">{seg.arrivalDate}</p>
                  </div>
                </div>

                {/* Amenities Pills */}
                <div className="pt-2 border-t border-slate-100 flex items-center gap-2 flex-wrap text-xs text-slate-600">
                  <span className="text-slate-400 font-medium">Included:</span>
                  {seg.amenities.map((a, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] flex items-center gap-1"
                    >
                      {renderAmenityIcon(a.iconName)}
                      <span>{a.label}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Layover separator if not last segment */}
              {activeLayovers && activeLayovers[idx] && (
                <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200 flex items-center justify-between text-xs text-amber-950">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-amber-600" />
                    <div>
                      <strong className="block text-sm">
                        {activeLayovers[idx].durationFormatted} Layover in {activeLayovers[idx].city} ({activeLayovers[idx].airportCode})
                      </strong>
                      <span className="text-[11px] text-amber-800">
                        {activeLayovers[idx].transitVisaNote}
                      </span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-white/80 border border-amber-300 font-bold text-[11px] text-amber-900 shrink-0">
                    Baggage Checked Through
                  </span>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      )}

      {/* 4. Alternative View: Compact Bar Mode */}
      {viewMode === 'compact' && (
        <div className="p-5 sm:p-7 bg-[#F8FAFC] space-y-3">
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
            {/* Origin */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-mono font-bold flex items-center justify-center">
                {activeSegments[0].originCode}
              </div>
              <div>
                <span className="text-base font-extrabold text-slate-900 font-mono">
                  {activeSegments[0].departureTimeLocal}
                </span>
                <p className="text-slate-500">{activeSegments[0].originCity}</p>
              </div>
            </div>

            {/* Flight Path Graphic */}
            <div className="flex-1 w-full flex flex-col items-center px-4">
              <div className="flex items-center justify-between w-full text-[11px] text-slate-500 mb-1">
                <span>{currentItinerary.primaryAirlineName}</span>
                <span className="font-bold text-slate-800">{totalJourneyTime}</span>
                <span>
                  {currentItinerary.stopsCount === 0
                    ? 'Non-stop'
                    : `${currentItinerary.stopsCount} stop (${activeLayovers[0]?.airportCode})`}
                </span>
              </div>
              <div className="relative w-full h-1 bg-blue-300 rounded-full flex items-center justify-center">
                <Plane className="w-3.5 h-3.5 text-blue-600 bg-white rounded-full p-0.5" />
              </div>
            </div>

            {/* Destination */}
            <div className="flex items-center gap-3 w-full md:w-auto justify-end">
              <div className="text-right">
                <span className="text-base font-extrabold text-slate-900 font-mono">
                  {activeSegments[activeSegments.length - 1].arrivalTimeLocal}
                  {activeSegments[activeSegments.length - 1].daysDifference > 0 && (
                    <span className="ml-1 text-[10px] text-rose-600 font-bold">+1d</span>
                  )}
                </span>
                <p className="text-slate-500">
                  {activeSegments[activeSegments.length - 1].destinationCity}
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white font-mono font-bold flex items-center justify-center">
                {activeSegments[activeSegments.length - 1].destinationCode}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. Bottom Action Bar & Booking Deep-Link */}
      <div className="p-4 sm:p-5 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Price & Fare Details */}
        <div className="space-y-0.5 text-center sm:text-left">
          <div className="flex items-center gap-2 justify-center sm:justify-start">
            <span className="text-xs text-slate-500">Estimated Live Fare:</span>
            <span className="text-lg sm:text-xl font-extrabold text-[#0D6EFD] font-mono">
              BDT {currentItinerary.samplePriceBDT.toLocaleString()}
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            Real-time fares subject to airline availability • Official Aviasales Gateway
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto flex-wrap justify-end">
          {/* Copy / Share Button */}
          <button
            type="button"
            onClick={handleCopyItinerary}
            className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Copy itinerary summary"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>Share</span>
              </>
            )}
          </button>

          {/* WhatsApp Concierge Assistance */}
          <a
            href={dynamicWhatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
            title="Chat directly with Dhaka desk with your exact route details"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>Dhaka Desk Hold</span>
          </a>

          {/* Book via Aviasales Official Link / Sample Mode Notice */}
          {isSampleMode ? (
            <button
              type="button"
              disabled
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-slate-300 text-slate-600 font-bold text-xs sm:text-sm cursor-not-allowed flex items-center justify-center gap-2"
              title="Demonstration sample only - non-bookable"
            >
              <span>Sample Demonstration Only</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleBookingRedirect}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs sm:text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Search & Book via Aviasales</span>
              <ExternalLink className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
