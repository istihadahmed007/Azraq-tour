import React, { useState, useRef, useEffect } from 'react';
import {
  Plane,
  Calendar,
  Users,
  MapPin,
  ArrowRightLeft,
  Search,
  ChevronDown,
  Check,
  Sparkles,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';
import {
  Airport,
  BANGLADESH_AIRPORTS,
  INTERNATIONAL_AIRPORTS,
  POPULAR_AIRPORTS,
  buildAviasalesSearchUrl,
  trackFlightSearchEvent,
} from '../data/flightsData';
import { AZRAQ_AGENCY_CONFIG } from '../data/agencyConfig';
import {
  NormalizedFlightSearch,
  validateFlightSearchParams,
  normalizeFlightSearch,
} from '../utils/flightSearchEngine';

export type FlightSearchParams = NormalizedFlightSearch;

interface FlightSearchFormProps {
  initialParams?: Partial<NormalizedFlightSearch>;
  onSearch?: (params: NormalizedFlightSearch) => void;
  onDirectAviasalesSearch?: (url: string) => void;
  variant?: 'hero' | 'compact' | 'page';
  className?: string;
  sourceTag?: string;
}

export const FlightSearchForm: React.FC<FlightSearchFormProps> = ({
  initialParams,
  onSearch,
  onDirectAviasalesSearch,
  variant = 'page',
  className = '',
  sourceTag = 'flights_form',
}) => {
  // Default dates: departure in 14 days, return in 21 days
  const today = new Date().toISOString().split('T')[0];
  const defaultDepDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const defaultRetDate = new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const [tripType, setTripType] = useState<'round' | 'oneway' | 'multi'>(initialParams?.tripType || 'round');
  const [origin, setOrigin] = useState<Airport>(initialParams?.origin || BANGLADESH_AIRPORTS[0]); // DAC by default
  const [destination, setDestination] = useState<Airport>(
    initialParams?.destination || INTERNATIONAL_AIRPORTS.find((a) => a.code === 'BKK') || INTERNATIONAL_AIRPORTS[0]
  );
  const [departureDate, setDepartureDate] = useState<string>(initialParams?.departureDate || defaultDepDate);
  const [returnDate, setReturnDate] = useState<string>(initialParams?.returnDate || defaultRetDate);

  // Passengers
  const [adults, setAdults] = useState<number>(initialParams?.adults || 1);
  const [children, setChildren] = useState<number>(initialParams?.children || 0);
  const [infants, setInfants] = useState<number>(initialParams?.infants || 0);
  const [cabinClass, setCabinClass] = useState<'Economy' | 'Premium Economy' | 'Business' | 'First'>(
    initialParams?.cabinClass || 'Economy'
  );

  // Synchronize internal state whenever initialParams changes from parent / URL
  useEffect(() => {
    if (!initialParams) return;
    if (initialParams.origin) setOrigin(initialParams.origin);
    if (initialParams.destination) setDestination(initialParams.destination);
    if (initialParams.departureDate) setDepartureDate(initialParams.departureDate);
    if (initialParams.returnDate) setReturnDate(initialParams.returnDate);
    if (initialParams.tripType) setTripType(initialParams.tripType);
    if (typeof initialParams.adults === 'number') setAdults(initialParams.adults);
    if (typeof initialParams.children === 'number') setChildren(initialParams.children);
    if (typeof initialParams.infants === 'number') setInfants(initialParams.infants);
    if (initialParams.cabinClass) setCabinClass(initialParams.cabinClass);
  }, [
    initialParams?.origin?.code,
    initialParams?.destination?.code,
    initialParams?.departureDate,
    initialParams?.returnDate,
    initialParams?.tripType,
    initialParams?.adults,
    initialParams?.children,
    initialParams?.infants,
    initialParams?.cabinClass,
  ]);

  // UI popover states
  const [openOriginMenu, setOpenOriginMenu] = useState(false);
  const [openDestMenu, setOpenDestMenu] = useState(false);
  const [openTravelersMenu, setOpenTravelersMenu] = useState(false);
  const [originQuery, setOriginQuery] = useState('');
  const [destQuery, setDestQuery] = useState('');
  const [destCategoryTab, setDestCategoryTab] = useState<'all' | 'domestic' | 'asia' | 'middle_east' | 'europe'>('all');
  const [validationError, setValidationError] = useState<string | null>(null);

  const originMenuRef = useRef<HTMLDivElement>(null);
  const destMenuRef = useRef<HTMLDivElement>(null);
  const travelersMenuRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (originMenuRef.current && !originMenuRef.current.contains(e.target as Node)) {
        setOpenOriginMenu(false);
      }
      if (destMenuRef.current && !destMenuRef.current.contains(e.target as Node)) {
        setOpenDestMenu(false);
      }
      if (travelersMenuRef.current && !travelersMenuRef.current.contains(e.target as Node)) {
        setOpenTravelersMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filtered origins list
  const filteredOrigins = POPULAR_AIRPORTS.filter((a) => {
    const q = originQuery.toLowerCase();
    return (
      a.city.toLowerCase().includes(q) ||
      a.code.toLowerCase().includes(q) ||
      a.country.toLowerCase().includes(q) ||
      a.name.toLowerCase().includes(q)
    );
  });

  // Filtered destinations list with categories
  const filteredDestinations = POPULAR_AIRPORTS.filter((a) => {
    const q = destQuery.toLowerCase();
    const matchesQuery =
      a.city.toLowerCase().includes(q) ||
      a.code.toLowerCase().includes(q) ||
      a.country.toLowerCase().includes(q) ||
      a.name.toLowerCase().includes(q);

    if (!matchesQuery) return false;

    if (destCategoryTab === 'domestic') {
      return a.isBangladesh || ['DAC', 'CGP', 'ZYL', 'CXB', 'JSR', 'RJH', 'SPD', 'BZL'].includes(a.code);
    }
    if (destCategoryTab === 'asia') {
      return ['BKK', 'DMK', 'KUL', 'SIN', 'DPS', 'DEL', 'CCU', 'BOM', 'MAA', 'MLE', 'KTM', 'HND', 'NRT', 'ICN', 'PEK', 'PVG', 'CAN'].includes(a.code);
    }
    if (destCategoryTab === 'middle_east') {
      return ['DXB', 'AUH', 'DOH', 'JED', 'MED', 'RUH', 'MCT', 'KWI', 'BAH', 'SHJ', 'IST'].includes(a.code);
    }
    if (destCategoryTab === 'europe') {
      return ['LHR', 'LGW', 'CDG', 'FCO', 'FRA', 'BCN', 'MAD', 'JFK', 'YYZ', 'SYD', 'MEL', 'CAI'].includes(a.code);
    }
    return true;
  });

  // Airport swap
  const handleSwapAirports = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  // Date validation
  const handleDepartureDateChange = (val: string) => {
    setDepartureDate(val);
    setValidationError(null);
    if (tripType === 'round' && returnDate && val > returnDate) {
      // Auto-bump return date to 7 days after departure
      const depTime = new Date(val).getTime();
      const newRet = new Date(depTime + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      setReturnDate(newRet);
    }
  };

  const handleReturnDateChange = (val: string) => {
    if (departureDate && val < departureDate) {
      setValidationError('Return date cannot be earlier than departure date.');
      return;
    }
    setValidationError(null);
    setReturnDate(val);
  };

  const totalPassengers = adults + children + infants;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const candidateParams: NormalizedFlightSearch = {
      tripType,
      origin,
      destination,
      departureDate,
      returnDate: tripType === 'round' ? returnDate : undefined,
      adults,
      children,
      infants,
      cabinClass,
      currency: 'BDT',
    };

    const validation = validateFlightSearchParams(candidateParams);
    if (!validation.isValid) {
      setValidationError(validation.error || 'Please provide valid flight search details.');
      return;
    }

    setValidationError(null);

    const searchParams = normalizeFlightSearch(candidateParams);

    trackFlightSearchEvent('search_completed', {
      origin: origin.code,
      destination: destination.code,
      tripType,
      adults,
      children,
      infants,
      cabinClass,
      source: sourceTag,
    });

    if (onSearch) {
      onSearch(searchParams);
    } else {
      const url = buildAviasalesSearchUrl({
        origin: origin.code,
        destination: destination.code,
        departDate: departureDate,
        returnDate: tripType === 'round' ? returnDate : undefined,
        adults,
        children,
        infants,
        cabin: cabinClass,
        tripType,
        source: sourceTag,
      });

      if (onDirectAviasalesSearch) {
        onDirectAviasalesSearch(url);
      } else {
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    }
  };

  const isDarkHero = variant === 'hero';

  return (
    <div
      className={`w-full rounded-2xl sm:rounded-3xl transition-all ${
        isDarkHero
          ? 'bg-[#071A33]/90 backdrop-blur-xl border border-white/20 p-4 sm:p-6 shadow-2xl text-white'
          : 'bg-white border border-slate-200/90 p-4 sm:p-6 shadow-lg text-slate-800'
      } ${className}`}
    >
      <form onSubmit={handleSearchSubmit} className="space-y-4">
        {/* Top Controls: Trip Type & Cabin Class & Quick Bangladesh Airports */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-1 border-b border-slate-200/40">
          {/* Trip Type Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setTripType('round');
                trackFlightSearchEvent('flight_search_started', { tripType: 'round', source: sourceTag });
              }}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                tripType === 'round'
                  ? 'bg-blue-600 text-white shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              Round-trip
            </button>
            <button
              type="button"
              onClick={() => {
                setTripType('oneway');
                trackFlightSearchEvent('flight_search_started', { tripType: 'oneway', source: sourceTag });
              }}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                tripType === 'oneway'
                  ? 'bg-blue-600 text-white shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              One-way
            </button>
          </div>

          {/* Quick Bangladesh Departure Airports Pills */}
          <div className="hidden lg:flex items-center gap-1 text-xs">
            <span className={`text-[11px] font-medium mr-1 ${isDarkHero ? 'text-sky-200' : 'text-slate-500'}`}>
              BD Hubs:
            </span>
            {BANGLADESH_AIRPORTS.slice(0, 6).map((ap) => (
              <button
                key={ap.code}
                type="button"
                onClick={() => {
                  setOrigin(ap);
                  trackFlightSearchEvent('origin_selected', { code: ap.code, source: sourceTag });
                }}
                className={`px-2 py-0.5 rounded-md text-[11px] font-mono font-bold transition-colors cursor-pointer ${
                  origin.code === ap.code
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : isDarkHero
                    ? 'bg-white/10 hover:bg-white/20 text-slate-200'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {ap.code}
              </button>
            ))}
          </div>

          {/* Cabin Class Selection */}
          <div className="flex items-center gap-1 text-xs">
            {(['Economy', 'Premium Economy', 'Business', 'First'] as const).map((cls) => (
              <button
                key={cls}
                type="button"
                onClick={() => setCabinClass(cls)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  cabinClass === cls
                    ? isDarkHero
                      ? 'bg-sky-500/30 text-sky-200 border border-sky-400/50 font-bold'
                      : 'bg-blue-50 text-blue-700 border border-blue-200 font-bold'
                    : isDarkHero
                    ? 'text-slate-300 hover:text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cls}
              </button>
            ))}
          </div>
        </div>

        {/* Search Input Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Origin Airport */}
          <div className="md:col-span-3 relative" ref={originMenuRef}>
            <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1 ${isDarkHero ? 'text-sky-200' : 'text-slate-500'}`}>
              From (Origin)
            </label>
            <div
              onClick={() => setOpenOriginMenu(!openOriginMenu)}
              className={`w-full p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                isDarkHero
                  ? 'bg-slate-900/80 border-slate-700 hover:border-blue-400 text-white'
                  : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200 hover:border-blue-500 text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <MapPin className="w-4 h-4 text-blue-500 shrink-0" />
                <div className="truncate">
                  <div className="font-extrabold text-sm flex items-center gap-1.5 truncate">
                    <span>{origin.city}</span>
                    <span className="font-mono text-xs px-1.5 py-0.2 rounded bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-bold">
                      {origin.code}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {origin.name}
                  </div>
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
            </div>

            {/* Origin Dropdown Menu */}
            {openOriginMenu && (
              <div className="absolute top-full left-0 mt-1.5 w-72 sm:w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 z-50 p-2 text-slate-900 dark:text-slate-100 animate-fadeIn">
                <div className="p-2 border-b border-slate-100 dark:border-slate-800">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search city or airport code..."
                      value={originQuery}
                      onChange={(e) => setOriginQuery(e.target.value)}
                      autoFocus
                      className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-100 dark:bg-slate-800 rounded-lg border-none focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                  <div className="p-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Bangladesh Departure Hubs
                  </div>
                  {BANGLADESH_AIRPORTS.map((ap) => (
                    <button
                      key={ap.code}
                      type="button"
                      onClick={() => {
                        setOrigin(ap);
                        setOpenOriginMenu(false);
                        trackFlightSearchEvent('origin_selected', { code: ap.code, source: sourceTag });
                      }}
                      className="w-full p-2 text-left rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 flex items-center justify-between group transition-colors"
                    >
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                          <span>{ap.city}</span>
                          <span className="font-mono text-[10px] font-bold px-1 bg-slate-200 dark:bg-slate-700 rounded">
                            {ap.code}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-500 truncate max-w-[200px]">{ap.name}</div>
                      </div>
                      {origin.code === ap.code && <Check className="w-3.5 h-3.5 text-blue-600" />}
                    </button>
                  ))}

                  {originQuery && (
                    <>
                      <div className="p-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        All Matching Airports
                      </div>
                      {filteredOrigins.map((ap) => (
                        <button
                          key={ap.code}
                          type="button"
                          onClick={() => {
                            setOrigin(ap);
                            setOpenOriginMenu(false);
                            trackFlightSearchEvent('origin_selected', { code: ap.code, source: sourceTag });
                          }}
                          className="w-full p-2 text-left rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 flex items-center justify-between group transition-colors"
                        >
                          <div>
                            <div className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                              <span>{ap.city}</span>
                              <span className="font-mono text-[10px] font-bold px-1 bg-slate-200 dark:bg-slate-700 rounded">
                                {ap.code}
                              </span>
                            </div>
                            <div className="text-[10px] text-slate-500 truncate max-w-[200px]">{ap.name}</div>
                          </div>
                          {origin.code === ap.code && <Check className="w-3.5 h-3.5 text-blue-600" />}
                        </button>
                      ))}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Swap Button */}
          <div className="hidden md:flex md:col-span-1 justify-center pt-5">
            <button
              type="button"
              onClick={handleSwapAirports}
              aria-label="Swap origin and destination"
              className={`p-2 rounded-full border transition-transform hover:rotate-180 duration-300 cursor-pointer ${
                isDarkHero
                  ? 'bg-slate-800 border-slate-600 text-sky-300 hover:bg-slate-700'
                  : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-100 shadow-xs'
              }`}
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Destination Airport */}
          <div className="md:col-span-3 relative" ref={destMenuRef}>
            <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1 ${isDarkHero ? 'text-sky-200' : 'text-slate-500'}`}>
              To (Destination)
            </label>
            <div
              onClick={() => setOpenDestMenu(!openDestMenu)}
              className={`w-full p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                isDarkHero
                  ? 'bg-slate-900/80 border-slate-700 hover:border-blue-400 text-white'
                  : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200 hover:border-blue-500 text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Plane className="w-4 h-4 text-emerald-500 shrink-0" />
                <div className="truncate">
                  <div className="font-extrabold text-sm flex items-center gap-1.5 truncate">
                    <span>{destination.city}</span>
                    <span className="font-mono text-xs px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 font-bold">
                      {destination.code}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {destination.name}
                  </div>
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
            </div>

            {/* Destination Dropdown Menu */}
            {openDestMenu && (
              <div className="absolute top-full right-0 md:left-0 mt-1.5 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 z-50 p-2 text-slate-900 dark:text-slate-100 animate-fadeIn">
                <div className="p-2 border-b border-slate-100 dark:border-slate-800 space-y-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search destination city or airport code..."
                      value={destQuery}
                      onChange={(e) => setDestQuery(e.target.value)}
                      autoFocus
                      className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-100 dark:bg-slate-800 rounded-lg border-none focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  {/* Regional Tabs */}
                  <div className="flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar text-[11px]">
                    {(
                      [
                        { id: 'all', label: 'All' },
                        { id: 'asia', label: 'Asia' },
                        { id: 'middle_east', label: 'Middle East' },
                        { id: 'europe', label: 'Europe/US' },
                        { id: 'domestic', label: 'BD Domestic' },
                      ] as const
                    ).map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setDestCategoryTab(tab.id)}
                        className={`px-2 py-0.5 rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                          destCategoryTab === tab.id
                            ? 'bg-emerald-600 text-white font-bold'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                  <div className="p-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                    <span>Matching Destinations ({filteredDestinations.length})</span>
                    <span className="text-[9px] text-slate-400">Click to select</span>
                  </div>
                  {filteredDestinations.map((ap) => (
                    <button
                      key={ap.code}
                      type="button"
                      onClick={() => {
                        setDestination(ap);
                        setOpenDestMenu(false);
                        trackFlightSearchEvent('destination_selected', { code: ap.code, source: sourceTag });
                      }}
                      className="w-full p-2 text-left rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/30 flex items-center justify-between group transition-colors cursor-pointer"
                    >
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                          <span>{ap.city}</span>
                          <span className="font-mono text-[10px] font-bold px-1.5 py-0.2 bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 rounded">
                            {ap.code}
                          </span>
                          <span className="text-[10px] text-slate-500 font-medium">({ap.country})</span>
                        </div>
                        <div className="text-[10px] text-slate-500 truncate max-w-[220px]">{ap.name}</div>
                      </div>
                      {destination.code === ap.code && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Dates Selection (Departure & Return) */}
          <div className="md:col-span-3 grid grid-cols-2 gap-2">
            <div>
              <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1 ${isDarkHero ? 'text-sky-200' : 'text-slate-500'}`}>
                Departure
              </label>
              <div className="relative">
                <input
                  type="date"
                  min={today}
                  value={departureDate}
                  onChange={(e) => handleDepartureDateChange(e.target.value)}
                  className={`w-full p-3 text-xs font-semibold rounded-xl border transition-all ${
                    isDarkHero
                      ? 'bg-slate-900/80 border-slate-700 text-white focus:border-blue-400'
                      : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-500'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1 ${isDarkHero ? 'text-sky-200' : 'text-slate-500'}`}>
                {tripType === 'round' ? 'Return' : 'One-Way'}
              </label>
              <input
                type="date"
                min={departureDate || today}
                disabled={tripType === 'oneway'}
                value={tripType === 'round' ? returnDate : ''}
                onChange={(e) => handleReturnDateChange(e.target.value)}
                placeholder={tripType === 'oneway' ? 'One-way trip' : ''}
                className={`w-full p-3 text-xs font-semibold rounded-xl border transition-all ${
                  tripType === 'oneway'
                    ? 'opacity-40 cursor-not-allowed bg-slate-200 dark:bg-slate-800'
                    : isDarkHero
                    ? 'bg-slate-900/80 border-slate-700 text-white focus:border-blue-400'
                    : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-500'
                }`}
              />
            </div>
          </div>

          {/* Passengers Popover */}
          <div className="md:col-span-2 relative" ref={travelersMenuRef}>
            <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1 ${isDarkHero ? 'text-sky-200' : 'text-slate-500'}`}>
              Passengers
            </label>
            <div
              onClick={() => setOpenTravelersMenu(!openTravelersMenu)}
              className={`w-full p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                isDarkHero
                  ? 'bg-slate-900/80 border-slate-700 hover:border-blue-400 text-white'
                  : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200 hover:border-blue-500 text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <Users className="w-4 h-4 text-purple-500 shrink-0" />
                <span className="text-xs font-extrabold truncate">
                  {totalPassengers} {totalPassengers === 1 ? 'Traveler' : 'Travelers'}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            </div>

            {/* Travelers Popover */}
            {openTravelersMenu && (
              <div className="absolute top-full right-0 mt-1.5 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 z-50 p-4 text-slate-900 dark:text-slate-100 space-y-3 animate-fadeIn">
                {/* Adults */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold">Adults</div>
                    <div className="text-[10px] text-slate-500">Age 12+</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={adults <= 1}
                      onClick={() => setAdults(Math.max(1, adults - 1))}
                      className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-sm font-bold disabled:opacity-30 cursor-pointer"
                    >
                      -
                    </button>
                    <span className="w-4 text-center text-xs font-bold">{adults}</span>
                    <button
                      type="button"
                      disabled={adults >= 9}
                      onClick={() => setAdults(adults + 1)}
                      className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-sm font-bold cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Children */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold">Children</div>
                    <div className="text-[10px] text-slate-500">Age 2-11</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={children <= 0}
                      onClick={() => setChildren(Math.max(0, children - 1))}
                      className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-sm font-bold disabled:opacity-30 cursor-pointer"
                    >
                      -
                    </button>
                    <span className="w-4 text-center text-xs font-bold">{children}</span>
                    <button
                      type="button"
                      disabled={children >= 8}
                      onClick={() => setChildren(children + 1)}
                      className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-sm font-bold cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Infants */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold">Infants</div>
                    <div className="text-[10px] text-slate-500">Under 2 (on lap)</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={infants <= 0}
                      onClick={() => setInfants(Math.max(0, infants - 1))}
                      className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-sm font-bold disabled:opacity-30 cursor-pointer"
                    >
                      -
                    </button>
                    <span className="w-4 text-center text-xs font-bold">{infants}</span>
                    <button
                      type="button"
                      disabled={infants >= adults}
                      onClick={() => setInfants(infants + 1)}
                      className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-sm font-bold cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setOpenTravelersMenu(false)}
                  className="w-full py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Apply
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Validation error notice */}
        {validationError && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Bottom Actions Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          {/* Quick Route info */}
          <div className="text-xs flex items-center gap-2">
            <span className={isDarkHero ? 'text-sky-200' : 'text-slate-600'}>
              Route: <strong className="text-blue-500">{origin.city} ({origin.code})</strong> →{' '}
              <strong className="text-emerald-500">{destination.city} ({destination.code})</strong>
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-mono text-slate-500">
              {cabinClass}
            </span>
          </div>

          {/* Primary Search Button */}
          <div className="w-full sm:w-auto flex items-center gap-2">
            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#0D6EFD] hover:bg-blue-600 text-white font-extrabold text-xs sm:text-sm transition-all duration-200 shadow-lg shadow-blue-600/30 hover:scale-[1.01] active:scale-98 cursor-pointer flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>Search Flights</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
