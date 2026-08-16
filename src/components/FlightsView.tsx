import React, { useState, useMemo, useEffect } from 'react';
import {
  Plane,
  Calendar,
  Users,
  MapPin,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Phone,
  SlidersHorizontal,
  ArrowUpDown,
  Clock,
  Luggage,
  Sparkles,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  MessageCircle,
  Coins,
  Check,
  X,
  RotateCcw,
} from 'lucide-react';
import {
  FlightOffer,
  POPULAR_AIRPORTS,
  Airport,
  generateSampleFlights,
  POPULAR_FLIGHT_SHORTCUTS,
} from '../data/flightsData';
import { AZRAQ_AGENCY_CONFIG } from '../data/agencyConfig';
import { TravelpayoutsWidget } from './TravelpayoutsWidget';
import { PartnerRedirectModal } from './PartnerRedirectModal';
import { AzraqTripFinder, FlightSearchParams } from './AzraqTripFinder';
import { useAuth } from '../context/AuthContext';

interface FlightsViewProps {
  initialParams?: FlightSearchParams;
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

  // Search parameters
  const [origin, setOrigin] = useState<Airport>(initialParams?.origin || POPULAR_AIRPORTS[0]); // DAC
  const [destination, setDestination] = useState<Airport>(initialParams?.destination || POPULAR_AIRPORTS[4]); // BKK
  const [departureDate, setDepartureDate] = useState<string>(
    initialParams?.departureDate || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [returnDate, setReturnDate] = useState<string>(
    initialParams?.returnDate || new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [tripType, setTripType] = useState<'round' | 'oneway' | 'multi'>(initialParams?.tripType || 'round');
  const [cabinClass, setCabinClass] = useState<'Economy' | 'Premium Economy' | 'Business' | 'First'>(
    initialParams?.cabinClass || 'Economy'
  );
  const [adults, setAdults] = useState<number>(initialParams?.adults || 1);
  const [selectedCurrency, setSelectedCurrency] = useState<string>('BDT');

  // Search modify bar toggle
  const [isModifyOpen, setIsModifyOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Sorting state
  const [sortBy, setSortBy] = useState<'recommended' | 'price' | 'duration' | 'departure'>('recommended');

  // Filter states
  const [filterStops, setFilterStops] = useState<string[]>([]); // '0', '1', '2+'
  const [filterAirlines, setFilterAirlines] = useState<string[]>([]);
  const [filterRefundableOnly, setFilterRefundableOnly] = useState(false);
  const [maxPriceBDT, setMaxPriceBDT] = useState<number>(150000);
  const [filterTimeWindow, setFilterTimeWindow] = useState<string>('all'); // 'morning', 'afternoon', 'evening', 'night', 'all'
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Partner Redirect Modal state
  const [selectedFlightForRedirect, setSelectedFlightForRedirect] = useState<FlightOffer | null>(null);

  // Generate flight offers based on parameters
  const rawFlights = useMemo(() => {
    return generateSampleFlights(
      origin.code,
      destination.code,
      departureDate,
      tripType === 'round' ? returnDate : undefined,
      tripType,
      cabinClass,
      adults
    );
  }, [origin.code, destination.code, departureDate, returnDate, tripType, cabinClass, adults]);

  // Extract unique airlines from raw results
  const availableAirlines = useMemo(() => {
    const names = new Set<string>();
    rawFlights.forEach((f) => names.add(f.airlineName));
    return Array.from(names);
  }, [rawFlights]);

  // Apply filters and sorting
  const filteredFlights = useMemo(() => {
    let list = [...rawFlights];

    // Filter by stops
    if (filterStops.length > 0) {
      list = list.filter((f) => {
        if (filterStops.includes('0') && f.stops === 0) return true;
        if (filterStops.includes('1') && f.stops === 1) return true;
        if (filterStops.includes('2+') && f.stops >= 2) return true;
        return false;
      });
    }

    // Filter by airlines
    if (filterAirlines.length > 0) {
      list = list.filter((f) => filterAirlines.includes(f.airlineName));
    }

    // Filter by refundable
    if (filterRefundableOnly) {
      list = list.filter((f) => f.refundable);
    }

    // Filter by price
    list = list.filter((f) => f.priceBDT <= maxPriceBDT);

    // Filter by departure time window
    if (filterTimeWindow !== 'all') {
      list = list.filter((f) => {
        const hour = parseInt(f.departureTime.split(':')[0], 10);
        if (filterTimeWindow === 'morning') return hour >= 6 && hour < 12;
        if (filterTimeWindow === 'afternoon') return hour >= 12 && hour < 18;
        if (filterTimeWindow === 'evening') return hour >= 18 && hour < 24;
        if (filterTimeWindow === 'night') return hour >= 0 && hour < 6;
        return true;
      });
    }

    // Sorting
    list.sort((a, b) => {
      if (sortBy === 'price') return a.priceBDT - b.priceBDT;
      if (sortBy === 'duration') {
        const durA = parseInt(a.duration.split('h')[0], 10) * 60 + parseInt(a.duration.split('h')[1] || '0', 10);
        const durB = parseInt(b.duration.split('h')[0], 10) * 60 + parseInt(b.duration.split('h')[1] || '0', 10);
        return durA - durB;
      }
      if (sortBy === 'departure') {
        return a.departureTime.localeCompare(b.departureTime);
      }
      // 'recommended'
      if (a.isRecommended && !b.isRecommended) return -1;
      if (!a.isRecommended && b.isRecommended) return 1;
      return a.priceBDT - b.priceBDT;
    });

    return list;
  }, [rawFlights, filterStops, filterAirlines, filterRefundableOnly, maxPriceBDT, filterTimeWindow, sortBy]);

  // Handle Search from the Trip Finder or Modify Bar
  const handleApplySearch = (params: FlightSearchParams) => {
    setIsSearching(true);
    setOrigin(params.origin);
    setDestination(params.destination);
    setDepartureDate(params.departureDate);
    setReturnDate(params.returnDate);
    setTripType(params.tripType);
    setCabinClass(params.cabinClass);
    setAdults(params.adults);
    setSelectedCurrency(params.currency);
    setIsModifyOpen(false);

    setTimeout(() => {
      setIsSearching(false);
      showToast(`Updated flight search for ${params.origin.code} ➔ ${params.destination.code}`, 'success');
    }, 400);
  };

  const handleResetFilters = () => {
    setFilterStops([]);
    setFilterAirlines([]);
    setFilterRefundableOnly(false);
    setMaxPriceBDT(150000);
    setFilterTimeWindow('all');
  };

  // Currency Converter helper
  const formatPrice = (bdtPrice: number) => {
    const curr = AZRAQ_AGENCY_CONFIG.currencies.find((c) => c.code === selectedCurrency) || AZRAQ_AGENCY_CONFIG.currencies[0];
    const converted = Math.round(bdtPrice * curr.rateAgainstBDT);
    return `${curr.symbol} ${converted.toLocaleString()} ${curr.code !== 'BDT' ? curr.code : ''}`.trim();
  };

  return (
    <div className="w-full min-h-screen bg-[#F4F8FA] text-slate-900 pb-20 animate-fadeIn">
      {/* 1. TOP HEADER & ACTIVE SEARCH SUMMARY BAR */}
      <section className="w-full bg-[#071A33] text-white pt-8 pb-12 px-4 sm:px-6 lg:px-8 border-b border-slate-800 shadow-lg">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Breadcrumb & Title */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-sky-400/30 text-sky-300 text-xs font-bold uppercase tracking-wider">
                <Plane className="w-3.5 h-3.5" />
                <span>Azraq Flight Search & Concierge</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight font-sans">
                Compare Flights & Partner Fares
              </h1>
              <p className="text-xs sm:text-sm text-slate-300">
                Live flight schedules and partner routes from Dhaka and international gateways with Azraq concierge care.
              </p>
            </div>

            {/* Currency Selector */}
            <div className="flex items-center gap-2 bg-slate-900/80 p-2 rounded-xl border border-slate-700/80 self-start sm:self-auto">
              <Coins className="w-4 h-4 text-sky-400" />
              <span className="text-xs text-slate-300 font-semibold">Currency:</span>
              <select
                value={selectedCurrency}
                onChange={(e) => setSelectedCurrency(e.target.value)}
                className="bg-slate-800 text-white text-xs font-mono font-bold px-2 py-1 rounded border border-slate-600 focus:outline-none focus:border-sky-400 cursor-pointer"
              >
                {AZRAQ_AGENCY_CONFIG.currencies.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code} ({c.symbol.trim()})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Search Summary Pill Bar */}
          <div className="bg-[#0B1E38] border border-sky-400/30 rounded-2xl p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-xl">
            <div className="flex flex-wrap items-center gap-3 sm:gap-6">
              {/* Route */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-300 flex items-center justify-center font-mono font-bold text-sm">
                  {origin.code}
                </div>
                <div>
                  <p className="text-[11px] text-slate-400 font-semibold">From</p>
                  <p className="text-sm font-bold text-white">{origin.city}</p>
                </div>
                <div className="px-2 text-slate-400 font-bold">➔</div>
                <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center font-mono font-bold text-sm">
                  {destination.code}
                </div>
                <div>
                  <p className="text-[11px] text-slate-400 font-semibold">To</p>
                  <p className="text-sm font-bold text-white">{destination.city}</p>
                </div>
              </div>

              <div className="h-8 w-px bg-slate-700 hidden sm:block" />

              {/* Dates & Passengers */}
              <div className="flex flex-wrap items-center gap-4 text-xs">
                <div className="flex items-center gap-2 text-slate-200">
                  <Calendar className="w-4 h-4 text-sky-400" />
                  <span className="font-mono font-medium">
                    {departureDate}
                    {tripType === 'round' && ` — ${returnDate}`}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-200">
                  <Users className="w-4 h-4 text-sky-400" />
                  <span className="font-medium">
                    {adults} Traveler{adults > 1 ? 's' : ''} · {cabinClass}
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-semibold uppercase">
                  {tripType === 'round' ? 'Round Trip' : 'One Way'}
                </span>
              </div>
            </div>

            {/* Modify Search Button */}
            <button
              type="button"
              onClick={() => setIsModifyOpen(!isModifyOpen)}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer self-start lg:self-auto"
            >
              <span>{isModifyOpen ? 'Close Search Bar' : 'Modify Search'}</span>
              {isModifyOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          {/* Expandable Search Bar Form */}
          {isModifyOpen && (
            <div className="pt-2 animate-fadeIn">
              <AzraqTripFinder
                initialMode="flights"
                onSearchFlights={handleApplySearch}
                onNavigateToView={(view) => {
                  if (onNavigateToView) onNavigateToView(view);
                }}
                onOpenVisaModal={onOpenVisaQuote}
              />
            </div>
          )}
        </div>
      </section>

      {/* 2. MAIN CONTENT AREA: FILTERS + RESULTS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* DESKTOP SIDEBAR FILTERS (4 Cols) */}
          <aside className="hidden lg:block lg:col-span-4 xl:col-span-3 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-6 sticky top-24">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2 font-bold text-[#071A33] text-sm">
                  <SlidersHorizontal className="w-4 h-4 text-[#0D6EFD]" />
                  <span>Filter Flights</span>
                </div>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-xs font-bold text-[#0D6EFD] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              </div>

              {/* Stops Filter */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Stops</h4>
                <div className="space-y-1.5 text-xs text-slate-700">
                  {[
                    { id: '0', label: 'Non-stop (Direct)' },
                    { id: '1', label: '1 Stop' },
                    { id: '2+', label: '2+ Stops' },
                  ].map((s) => (
                    <label
                      key={s.id}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={filterStops.includes(s.id)}
                          onChange={(e) => {
                            if (e.target.checked) setFilterStops([...filterStops, s.id]);
                            else setFilterStops(filterStops.filter((id) => id !== s.id));
                          }}
                          className="rounded border-slate-300 text-[#0D6EFD] focus:ring-blue-500 cursor-pointer"
                        />
                        <span className="font-medium">{s.label}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Departure Time Window */}
              <div className="space-y-2.5 pt-4 border-t border-slate-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Departure Time</h4>
                <div className="grid grid-cols-2 gap-1.5 text-xs">
                  {[
                    { id: 'all', label: 'Any Time' },
                    { id: 'morning', label: '06:00 – 12:00' },
                    { id: 'afternoon', label: '12:00 – 18:00' },
                    { id: 'evening', label: '18:00 – 24:00' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setFilterTimeWindow(t.id)}
                      className={`p-2 rounded-xl text-center text-xs font-semibold transition-colors cursor-pointer ${
                        filterTimeWindow === t.id
                          ? 'bg-[#0D6EFD] text-white shadow-xs'
                          : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Max Price Range Slider */}
              <div className="space-y-2.5 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold uppercase tracking-wider text-slate-500">Max Budget</span>
                  <span className="font-bold text-[#0D6EFD] font-mono">{formatPrice(maxPriceBDT)}</span>
                </div>
                <input
                  type="range"
                  min={20000}
                  max={200000}
                  step={5000}
                  value={maxPriceBDT}
                  onChange={(e) => setMaxPriceBDT(Number(e.target.value))}
                  className="w-full accent-[#0D6EFD] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>BDT 20k</span>
                  <span>BDT 200k+</span>
                </div>
              </div>

              {/* Airlines Filter */}
              <div className="space-y-2.5 pt-4 border-t border-slate-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Airlines</h4>
                <div className="space-y-1 max-h-48 overflow-y-auto pr-1 text-xs text-slate-700 custom-scrollbar">
                  {availableAirlines.map((airline) => (
                    <label
                      key={airline}
                      className="flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-50 cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={filterAirlines.includes(airline)}
                          onChange={(e) => {
                            if (e.target.checked) setFilterAirlines([...filterAirlines, airline]);
                            else setFilterAirlines(filterAirlines.filter((a) => a !== airline));
                          }}
                          className="rounded border-slate-300 text-[#0D6EFD] focus:ring-blue-500 cursor-pointer"
                        />
                        <span className="font-medium truncate">{airline}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Refundable Option */}
              <div className="pt-4 border-t border-slate-100">
                <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filterRefundableOnly}
                    onChange={(e) => setFilterRefundableOnly(e.target.checked)}
                    className="rounded border-slate-300 text-[#0D6EFD] focus:ring-blue-500 cursor-pointer"
                  />
                  <span>Refundable Tickets Only</span>
                </label>
              </div>

              {/* Concierge Desk Banner */}
              <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-100 text-xs space-y-2">
                <div className="flex items-center gap-1.5 text-[#0D6EFD] font-bold">
                  <Phone className="w-3.5 h-3.5" />
                  <span>Need an Offline Group Hold?</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Direct GDS group allocations, Umrah bookings, and corporate ticketing available at our Dhaka desk.
                </p>
                <a
                  href={`https://wa.me/${AZRAQ_AGENCY_CONFIG.whatsappNumber}?text=${encodeURIComponent(
                    `Hello Azraq! I need offline group flight assistance for route ${origin.code} to ${destination.code}.`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#0D6EFD] hover:underline pt-1"
                >
                  <span>Chat with Specialist</span>
                  <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          </aside>

          {/* FLIGHT RESULTS (8 Cols) */}
          <main className="lg:col-span-8 xl:col-span-9 space-y-6">
            {/* Sorting Tabs & Results Header */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-[#071A33]">
                  {filteredFlights.length} Flights Available
                </span>
                <span className="text-xs text-slate-400">
                  for {origin.code} ➔ {destination.code}
                </span>
              </div>

              {/* Sort Tabs */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl overflow-x-auto no-scrollbar">
                {[
                  { id: 'recommended', label: 'Recommended' },
                  { id: 'price', label: 'Cheapest' },
                  { id: 'duration', label: 'Fastest' },
                  { id: 'departure', label: 'Earliest' },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSortBy(s.id as any)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
                      sortBy === s.id
                        ? 'bg-white text-[#0D6EFD] shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* TRAVELPAYOUTS LIVE INTEGRATION WIDGET CONTAINER */}
            <TravelpayoutsWidget
              originCode={origin.code}
              destinationCode={destination.code}
              onOpenQuote={() => {
                if (onOpenVisaQuote) onOpenVisaQuote(destination.country);
              }}
            />

            {/* LOADING STATE OR EMPTY STATE */}
            {isSearching ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs animate-pulse space-y-4"
                  >
                    <div className="flex justify-between">
                      <div className="h-6 w-40 bg-slate-200 rounded"></div>
                      <div className="h-6 w-24 bg-slate-200 rounded"></div>
                    </div>
                    <div className="h-16 w-full bg-slate-100 rounded-xl"></div>
                  </div>
                ))}
              </div>
            ) : filteredFlights.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200/80 p-10 text-center space-y-4 shadow-xs">
                <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                  <AlertCircle className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-[#071A33]">No Flights Match Your Filters</h3>
                <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
                  Try adjusting the price slider, clearing airline filters, or contacting our concierge desk for custom chartered and offline partner tickets.
                </p>
                <div className="pt-2 flex justify-center gap-3">
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="px-5 py-2.5 rounded-xl bg-[#0D6EFD] text-white font-bold text-xs hover:bg-blue-600 transition-colors cursor-pointer"
                  >
                    Clear All Filters
                  </button>
                  <a
                    href={`https://wa.me/${AZRAQ_AGENCY_CONFIG.whatsappNumber}?text=${encodeURIComponent(
                      `Hello Azraq! I couldn't find flights for ${origin.code} to ${destination.code} on ${departureDate}. Can you check offline airline inventory for me?`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors cursor-pointer"
                  >
                    WhatsApp Travel Desk
                  </a>
                </div>
              </div>
            ) : (
              /* FLIGHT RESULTS LIST */
              <div className="space-y-4">
                {filteredFlights.map((flight) => (
                  <div
                    key={flight.id}
                    className="group bg-white rounded-2xl border border-slate-200/80 hover:border-[#0D6EFD]/50 p-5 sm:p-6 shadow-xs hover:shadow-md transition-all space-y-4"
                  >
                    {/* Top Airline Info & Badges */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-800">
                          {flight.airlineCode}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-bold text-[#071A33]">{flight.airlineName}</h3>
                            <span className="text-xs font-mono text-slate-400 font-semibold">
                              {flight.flightNumber}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500">{flight.aircraft}</p>
                        </div>
                      </div>

                      {/* Highlight badges */}
                      <div className="flex items-center gap-2">
                        {flight.isRecommended && (
                          <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#0D6EFD] text-[11px] font-bold border border-blue-200">
                            ★ Recommended
                          </span>
                        )}
                        {flight.isBestValue && (
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200">
                            ✓ Best Value
                          </span>
                        )}
                        {flight.seatsRemaining && flight.seatsRemaining <= 5 && (
                          <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[11px] font-semibold border border-amber-200">
                            {flight.seatsRemaining} seats left
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Flight Schedule Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                      {/* Outbound Leg (8 Cols) */}
                      <div className="md:col-span-8 space-y-3">
                        {/* Outbound Details */}
                        <div className="flex items-center justify-between gap-3">
                          {/* Departure */}
                          <div className="text-left">
                            <span className="text-xl font-extrabold text-slate-900 font-mono">
                              {flight.departureTime}
                            </span>
                            <p className="text-xs font-bold text-slate-700">{flight.origin.code}</p>
                            <p className="text-[10px] text-slate-400">{flight.origin.city}</p>
                          </div>

                          {/* Flight Duration Visual Graphic */}
                          <div className="flex-1 max-w-[200px] text-center space-y-1 px-2">
                            <span className="text-[11px] font-semibold text-slate-500 font-mono">
                              {flight.duration}
                            </span>
                            <div className="relative flex items-center justify-center">
                              <div className="h-[2px] w-full bg-slate-200"></div>
                              <Plane className="w-3.5 h-3.5 text-[#0D6EFD] absolute bg-white px-0.5" />
                            </div>
                            <span className="text-[10px] font-bold text-emerald-600 block">
                              {flight.stops === 0 ? 'Non-stop' : `${flight.stops} Stop (${flight.stopAirports?.join(', ')})`}
                            </span>
                          </div>

                          {/* Arrival */}
                          <div className="text-right">
                            <span className="text-xl font-extrabold text-slate-900 font-mono">
                              {flight.arrivalTime}
                            </span>
                            <p className="text-xs font-bold text-slate-700">{flight.destination.code}</p>
                            <p className="text-[10px] text-slate-400">{flight.destination.city}</p>
                          </div>
                        </div>

                        {/* Return Leg (if round-trip) */}
                        {flight.returnSegment && (
                          <div className="pt-2 border-t border-dashed border-slate-200 flex items-center justify-between gap-3 text-xs text-slate-600">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                                Return
                              </span>
                              <span className="font-mono font-bold text-slate-900">
                                {flight.returnSegment.departureDate}
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="font-mono font-bold">{flight.returnSegment.departureTime}</span>
                              <span className="text-slate-400">➔</span>
                              <span className="font-mono font-bold">{flight.returnSegment.arrivalTime}</span>
                              <span className="text-slate-400">({flight.returnSegment.duration})</span>
                            </div>
                          </div>
                        )}

                        {/* Amenities and Baggage Tags */}
                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px]">
                            <Luggage className="w-3 h-3 text-slate-500" />
                            <span>{flight.baggageAllowance.checked} checked</span>
                          </span>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px]">
                            <span>💼 {flight.baggageAllowance.cabin} cabin</span>
                          </span>
                          {flight.inFlightAmenities.slice(0, 2).map((amenity) => (
                            <span
                              key={amenity}
                              className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[11px] hidden sm:inline"
                            >
                              {amenity}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Pricing & Booking Actions (4 Cols) */}
                      <div className="md:col-span-4 md:border-l md:border-slate-100 md:pl-6 flex flex-col justify-between items-start md:items-end gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                        <div className="text-left md:text-right w-full">
                          <span className="text-[10px] text-slate-400 block uppercase tracking-wider">
                            Total Fare ({adults} Traveler{adults > 1 ? 's' : ''})
                          </span>
                          <span className="text-2xl font-extrabold text-[#071A33] font-mono tracking-tight">
                            {formatPrice(flight.priceBDT)}
                          </span>
                          <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">
                            {flight.refundable ? 'Refundable ticket' : 'Standard fare'} • Taxes included
                          </span>
                        </div>

                        {/* Action Buttons */}
                        <div className="w-full space-y-2">
                          <button
                            type="button"
                            onClick={() => setSelectedFlightForRedirect(flight)}
                            className="w-full py-2.5 px-4 rounded-xl bg-[#0D6EFD] hover:bg-blue-600 text-white font-extrabold text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                          >
                            <span>Book via Partner</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>

                          <a
                            href={`https://wa.me/${AZRAQ_AGENCY_CONFIG.whatsappNumber}?text=${encodeURIComponent(
                              `Hello Azraq! I would like to hold/inquire about this flight: ${flight.airlineName} ${flight.flightNumber} (${flight.origin.code} -> ${flight.destination.code}) on ${flight.departureDate} for BDT ${flight.priceBDT.toLocaleString()}.`
                            )}`}
                            target="_blank"
                            rel="noreferrer"
                            className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 border border-slate-200 text-[11px] font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <MessageCircle className="w-3 h-3 text-emerald-600" />
                            <span>Hold with Azraq Desk</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 3. TRANSPARENT PARTNER & CONCIERGE DISCLAIMER BOX */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-3 text-xs text-slate-600">
              <div className="flex items-center gap-2 font-bold text-[#071A33] text-sm">
                <ShieldCheck className="w-4 h-4 text-[#0D6EFD]" />
                <span>Azraq Flight Search & Concierge Terms</span>
              </div>
              <p className="leading-relaxed">{AZRAQ_AGENCY_CONFIG.partnerDisclaimer}</p>
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 text-[11px] text-slate-500">
                <span>Azraq Travel Concierge • Gulshan-2, Dhaka</span>
                <span className="font-mono">Direct Support: {AZRAQ_AGENCY_CONFIG.phoneDisplay}</span>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Partner Redirect Modal */}
      <PartnerRedirectModal
        flight={selectedFlightForRedirect}
        isOpen={!!selectedFlightForRedirect}
        onClose={() => setSelectedFlightForRedirect(null)}
      />
    </div>
  );
};
