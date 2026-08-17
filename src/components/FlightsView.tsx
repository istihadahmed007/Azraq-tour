import React, { useState, useEffect } from 'react';
import {
  Plane,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Building2,
  Phone,
  MessageCircle,
  Clock,
  Globe2,
  SlidersHorizontal,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import {
  Airport,
  POPULAR_AIRPORTS,
  BANGLADESH_AIRPORTS,
  buildAviasalesSearchUrl,
  trackFlightSearchEvent,
} from '../data/flightsData';
import { AZRAQ_AGENCY_CONFIG } from '../data/agencyConfig';
import { FlightSearchForm, FlightSearchParams } from './FlightSearchForm';
import { PopularDestinations } from './PopularDestinations';
import { DestinationExplorer } from './DestinationExplorer';
import { RouteGuidesSection } from './RouteGuidesSection';
import { AffiliateDisclosure } from './AffiliateDisclosure';
import { TravelpayoutsWidget } from './TravelpayoutsWidget';
import { PartnerRedirectModal } from './PartnerRedirectModal';
import { FlightItineraryTimeline } from './FlightItineraryTimeline';
import { SAMPLE_FLIGHT_ITINERARIES, FullFlightItinerary } from '../data/flightItinerariesData';
import { useAuth } from '../context/AuthContext';

interface FlightsViewProps {
  initialParams?: Partial<FlightSearchParams>;
  onOpenFlightModal?: (dest?: string) => void;
  onNavigateToView?: (view: any) => void;
  onOpenVisaQuote?: (country?: string) => void;
}

export const FlightsView: React.FC<FlightsViewProps> = ({
  initialParams,
  onOpenFlightModal,
  onNavigateToView,
  onOpenVisaQuote,
}) => {
  const { showToast } = useAuth();

  // Active search state
  const [activeParams, setActiveParams] = useState<Partial<FlightSearchParams>>({
    origin: initialParams?.origin || BANGLADESH_AIRPORTS[0], // DAC
    destination: initialParams?.destination || POPULAR_AIRPORTS.find((a) => a.code === 'BKK'),
    departureDate:
      initialParams?.departureDate ||
      new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    returnDate:
      initialParams?.returnDate ||
      new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    tripType: initialParams?.tripType || 'round',
    cabinClass: initialParams?.cabinClass || 'Economy',
    adults: initialParams?.adults || 1,
    children: initialParams?.children || 0,
    infants: initialParams?.infants || 0,
  });

  const [activeTab, setActiveTab] = useState<'search' | 'deals' | 'routes' | 'explorer'>('search');
  const [isSearching, setIsSearching] = useState(false);
  const [selectedFlightForRedirect, setSelectedFlightForRedirect] = useState<any | null>(null);

  // Handle Search Submission
  const handleSearch = (params: FlightSearchParams) => {
    setActiveParams(params);
    setIsSearching(true);

    trackFlightSearchEvent('search_completed', {
      origin: params.origin.code,
      destination: params.destination.code,
      tripType: params.tripType,
      adults: params.adults,
      cabin: params.cabinClass,
      source: 'flights_page_main',
    });

    const targetUrl = buildAviasalesSearchUrl({
      origin: params.origin.code,
      destination: params.destination.code,
      departDate: params.departureDate,
      returnDate: params.tripType === 'round' ? params.returnDate : undefined,
      adults: params.adults,
      children: params.children,
      infants: params.infants,
      cabin: params.cabinClass,
      tripType: params.tripType,
      source: 'flights_page',
    });

    setTimeout(() => {
      setIsSearching(false);
      showToast(
        `Searching live flights: ${params.origin.code} ➔ ${params.destination.code}`,
        'success'
      );
      // Open in Aviasales affiliate gateway or switch to live results tab
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
    }, 450);
  };

  // Handle Direct Airport / Destination shortcut click
  const handleSelectDestination = (destCode: string) => {
    const foundDest = POPULAR_AIRPORTS.find((a) => a.code === destCode);
    if (foundDest) {
      setActiveParams((prev) => ({
        ...prev,
        destination: foundDest,
      }));
    }

    const url = buildAviasalesSearchUrl({
      origin: activeParams.origin?.code || 'DAC',
      destination: destCode,
      departDate: activeParams.departureDate,
      returnDate: activeParams.tripType === 'round' ? activeParams.returnDate : undefined,
      adults: activeParams.adults || 1,
      cabin: activeParams.cabinClass || 'Economy',
      tripType: activeParams.tripType || 'round',
      source: 'popular_destination_card',
    });

    trackFlightSearchEvent('destination_card_clicked', {
      origin: activeParams.origin?.code || 'DAC',
      destination: destCode,
      source: 'flights_view',
    });

    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleSelectRoute = (originCode: string, destinationCode: string) => {
    const foundOrigin = POPULAR_AIRPORTS.find((a) => a.code === originCode);
    const foundDest = POPULAR_AIRPORTS.find((a) => a.code === destinationCode);

    if (foundOrigin) setActiveParams((prev) => ({ ...prev, origin: foundOrigin }));
    if (foundDest) setActiveParams((prev) => ({ ...prev, destination: foundDest }));

    const url = buildAviasalesSearchUrl({
      origin: originCode,
      destination: destinationCode,
      departDate: activeParams.departureDate,
      returnDate: activeParams.tripType === 'round' ? activeParams.returnDate : undefined,
      adults: 1,
      source: 'route_guide_section',
    });

    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="w-full bg-[#F8FAFC] min-h-screen py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
        {/* 1. Page Header */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-bold uppercase tracking-wider">
                <Plane className="w-3.5 h-3.5" />
                <span>Official Aviasales Affiliate Partner</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif-display font-extrabold text-slate-900 tracking-tight">
                Search & Compare Flights
              </h1>
              <p className="text-sm sm:text-base text-slate-600 max-w-2xl">
                Find flights from Bangladesh to destinations around the world.
              </p>
            </div>

            {/* Quick concierge contact pill */}
            <div className="flex items-center gap-2">
              <a
                href={`https://wa.me/${AZRAQ_AGENCY_CONFIG.whatsappNumber}?text=${encodeURIComponent(
                  'Hello Azraq Concierge! I need assistance searching and booking flights from Dhaka.'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>Dhaka Flight Desk</span>
              </a>

              <a
                href="https://www.aviasales.com/?params=DAC1"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <span>Aviasales Direct</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Affiliate & Trust Disclosure */}
          <AffiliateDisclosure variant="inline" />
        </div>

        {/* 2. Main Flight Search Form */}
        <section className="w-full">
          <FlightSearchForm
            initialParams={activeParams}
            onSearch={handleSearch}
            variant="page"
            sourceTag="flights_page"
          />
        </section>

        {/* 3. Live Search & White Label Widget Container */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Live Aviasales & Travelpayouts Flight Comparison</span>
            </h3>
            <span className="text-xs text-slate-500 font-medium">
              Real-time airline inventory & official ticket booking
            </span>
          </div>

          <TravelpayoutsWidget
            originCode={activeParams.origin?.code || 'DAC'}
            destinationCode={activeParams.destination?.code || 'BKK'}
            defaultTab="deals"
            onOpenQuote={() => {
              if (onOpenVisaQuote) onOpenVisaQuote('Flight Inquiry');
            }}
          />
        </section>

        {/* 4. Interactive Flight Itinerary Timeline & Layover Visualizer */}
        <section className="space-y-4 pt-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider">
                <Clock className="w-3 h-3" />
                <span>Interactive Flight Timeline</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-serif-display font-extrabold text-slate-900 tracking-tight">
                Flight Itinerary & Layover Explorer
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
                Explore horizontal flight flows, inspect layover durations, airport transit rules for Bangladeshi passport holders, arrival/departure terminals, and in-flight amenities.
              </p>
            </div>
            <span className="text-xs text-slate-400 font-medium self-start sm:self-center">
              Click any node to inspect terminal and baggage details
            </span>
          </div>

          <FlightItineraryTimeline
            showControls={true}
            defaultViewMode="timeline"
          />
        </section>

        {/* 5. Popular Flight Destinations from Bangladesh (30+ worldwide cards) */}
        <PopularDestinations
          onSelectDestination={handleSelectDestination}
          className="pt-4"
        />

        {/* 5. Explore Flights Around the World (Regional Filterable Grid) */}
        <DestinationExplorer
          onSelectDestination={handleSelectDestination}
          className="pt-6"
        />

        {/* 6. Popular Route Guides from Dhaka */}
        <RouteGuidesSection
          onSelectRoute={handleSelectRoute}
          className="pt-6"
        />

        {/* 7. Comprehensive Trust & Partner Disclaimer */}
        <section className="space-y-4 pt-4">
          <AffiliateDisclosure variant="card" />

          {/* Azraq Concierge Details */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-600">
            <div className="space-y-1">
              <h4 className="font-bold text-slate-900 text-sm">
                Azraq Tours & Travels — Flight Concierge Desk
              </h4>
              <p className="text-slate-500">
                {AZRAQ_AGENCY_CONFIG.officeAddress}, {AZRAQ_AGENCY_CONFIG.officeCity},{' '}
                {AZRAQ_AGENCY_CONFIG.officeCountry} • Working Hours: {AZRAQ_AGENCY_CONFIG.workingHours}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <a
                href={`tel:${AZRAQ_AGENCY_CONFIG.phone}`}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors flex items-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5 text-blue-600" />
                <span>{AZRAQ_AGENCY_CONFIG.phoneDisplay}</span>
              </a>
              <a
                href={`https://wa.me/${AZRAQ_AGENCY_CONFIG.whatsappNumber}?text=${encodeURIComponent(
                  'Hello Azraq! I am looking for flight booking assistance.'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp 24/7</span>
              </a>
            </div>
          </div>
        </section>
      </div>

      {/* Partner Redirect Modal if needed */}
      <PartnerRedirectModal
        flight={selectedFlightForRedirect}
        isOpen={!!selectedFlightForRedirect}
        onClose={() => setSelectedFlightForRedirect(null)}
      />
    </div>
  );
};
