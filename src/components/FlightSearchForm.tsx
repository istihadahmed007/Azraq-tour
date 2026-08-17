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

  // Format date for Booking.com display (e.g., "Wed 9/2")
  const formatBookingDate = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr + 'T00:00:00');
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      const month = d.getMonth() + 1;
      const day = d.getDate();
      return `${dayName} ${month}/${day}`;
    } catch {
      return dateStr;
    }
  };

  const adjustDateByDays = (dateStr: string, days: number): string => {
    try {
      const d = new Date(dateStr + 'T00:00:00');
      d.setDate(d.getDate() + days);
      const todayDate = new Date();
      todayDate.setHours(0, 0, 0, 0);
      if (d < todayDate) return today;
      return d.toISOString().split('T')[0];
    } catch {
      return dateStr;
    }
  };

  const handleStepDeparture = (days: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const newDate = adjustDateByDays(departureDate, days);
    handleDepartureDateChange(newDate);
  };

  const handleStepReturn = (days: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (tripType !== 'round') return;
    const newDate = adjustDateByDays(returnDate, days);
    if (newDate >= departureDate) {
      handleReturnDateChange(newDate);
    }
  };

  return (
    <div
      className={`w-full bg-[#ffb700] rounded-2xl p-4 sm:p-6 shadow-md text-slate-900 ${className}`}
    >
      <form onSubmit={handleSearchSubmit} className="space-y-3">
        {/* Top Dropdowns Row (Booking.com style: Round-trip ⌵, 1 adult ⌵, Economy ⌵) */}
        <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-900 pb-1">
          {/* Trip Type Selector */}
          <div className="relative">
            <select
              value={tripType}
              onChange={(e) => {
                const val = e.target.value as 'round' | 'oneway' | 'multi';
                setTripType(val);
                trackFlightSearchEvent('flight_search_started', { tripType: val, source: sourceTag });
              }}
              className="bg-transparent hover:bg-black/5 font-bold text-slate-900 py-1.5 px-3 rounded-md border border-transparent hover:border-black/10 focus:ring-2 focus:ring-blue-600 focus:outline-none cursor-pointer pr-7 appearance-none"
            >
              <option value="round">Round-trip</option>
              <option value="oneway">One-way</option>
              <option value="multi">Multi-city</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-2 top-2.5 pointer-events-none text-slate-800" />
          </div>

          {/* Passenger Selector Dropdown Button */}
          <div className="relative" ref={travelersMenuRef}>
            <button
              type="button"
              onClick={() => setOpenTravelersMenu(!openTravelersMenu)}
              className="flex items-center gap-1.5 bg-transparent hover:bg-black/5 font-bold text-slate-900 py-1.5 px-3 rounded-md border border-transparent hover:border-black/10 transition-colors cursor-pointer"
            >
              <span>
                {adults} {adults === 1 ? 'adult' : 'adults'}
                {children > 0 ? `, ${children} child` : ''}
                {infants > 0 ? `, ${infants} infant` : ''}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-800" />
            </button>

            {/* Travelers Popover */}
            {openTravelersMenu && (
              <div className="absolute top-full left-0 mt-1.5 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 p-4 text-slate-900 space-y-3 animate-fadeIn">
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
                      className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-sm font-bold disabled:opacity-30 cursor-pointer"
                    >
                      -
                    </button>
                    <span className="w-4 text-center text-xs font-bold">{adults}</span>
                    <button
                      type="button"
                      disabled={adults >= 9}
                      onClick={() => setAdults(adults + 1)}
                      className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-sm font-bold cursor-pointer"
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
                      className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-sm font-bold disabled:opacity-30 cursor-pointer"
                    >
                      -
                    </button>
                    <span className="w-4 text-center text-xs font-bold">{children}</span>
                    <button
                      type="button"
                      disabled={children >= 8}
                      onClick={() => setChildren(children + 1)}
                      className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-sm font-bold cursor-pointer"
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
                      className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-sm font-bold disabled:opacity-30 cursor-pointer"
                    >
                      -
                    </button>
                    <span className="w-4 text-center text-xs font-bold">{infants}</span>
                    <button
                      type="button"
                      disabled={infants >= adults}
                      onClick={() => setInfants(infants + 1)}
                      className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-sm font-bold cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setOpenTravelersMenu(false)}
                  className="w-full py-1.5 rounded-lg bg-[#006ce4] hover:bg-blue-700 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>
            )}
          </div>

          {/* Cabin Class Selector */}
          <div className="relative">
            <select
              value={cabinClass}
              onChange={(e) => setCabinClass(e.target.value as any)}
              className="bg-transparent hover:bg-black/5 font-bold text-slate-900 py-1.5 px-3 rounded-md border border-transparent hover:border-black/10 focus:ring-2 focus:ring-blue-600 focus:outline-none cursor-pointer pr-7 appearance-none"
            >
              <option value="Economy">Economy</option>
              <option value="Premium Economy">Premium Economy</option>
              <option value="Business">Business</option>
              <option value="First">First-class</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-2 top-2.5 pointer-events-none text-slate-800" />
          </div>

          {/* Quick direct route indicator */}
          <div className="ml-auto hidden md:flex items-center gap-1 text-[11px] font-bold text-slate-800">
            <span>Route: {origin.code} ➔ {destination.code}</span>
          </div>
        </div>

        {/* Booking.com Search Bar Row (Connected layout on yellow banner) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-1.5 items-center">
          {/* Origin Field */}
          <div className="lg:col-span-3 relative" ref={originMenuRef}>
            <div
              onClick={() => setOpenOriginMenu(!openOriginMenu)}
              className="w-full h-13 px-3 py-2 bg-white rounded-lg border border-slate-300 hover:border-blue-500 shadow-xs flex items-center justify-between cursor-pointer transition-all"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-xs font-bold text-slate-900 truncate">
                  {origin.city} ({origin.code})
                </span>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOriginQuery('');
                    setOpenOriginMenu(true);
                  }}
                  className="p-1 text-slate-400 hover:text-slate-700 rounded cursor-pointer"
                  title="Clear"
                >
                  ✕
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenOriginMenu(true);
                  }}
                  className="p-1 text-slate-400 hover:text-slate-700 rounded cursor-pointer text-xs font-bold"
                  title="Add departure airport"
                >
                  +
                </button>
              </div>
            </div>

            {/* Origin Dropdown Menu */}
            {openOriginMenu && (
              <div className="absolute top-full left-0 mt-1.5 w-72 sm:w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 p-2 text-slate-900 animate-fadeIn">
                <div className="p-2 border-b border-slate-100">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search city or airport code..."
                      value={originQuery}
                      onChange={(e) => setOriginQuery(e.target.value)}
                      autoFocus
                      className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-100 rounded-lg border-none focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="max-h-60 overflow-y-auto divide-y divide-slate-100">
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
                      className="w-full p-2 text-left rounded-lg hover:bg-blue-50 flex items-center justify-between group transition-colors cursor-pointer"
                    >
                      <div>
                        <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          <span>{ap.city}</span>
                          <span className="font-mono text-[10px] font-bold px-1 bg-slate-200 rounded">
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
                          className="w-full p-2 text-left rounded-lg hover:bg-blue-50 flex items-center justify-between group transition-colors cursor-pointer"
                        >
                          <div>
                            <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                              <span>{ap.city}</span>
                              <span className="font-mono text-[10px] font-bold px-1 bg-slate-200 rounded">
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
          <div className="lg:col-span-1 flex justify-center py-1 lg:py-0">
            <button
              type="button"
              onClick={handleSwapAirports}
              aria-label="Swap origin and destination"
              className="w-9 h-9 rounded-full bg-white border border-slate-300 hover:border-slate-400 text-slate-700 shadow-xs flex items-center justify-center hover:scale-105 transition-all cursor-pointer"
            >
              <ArrowRightLeft className="w-4 h-4 text-slate-800" />
            </button>
          </div>

          {/* Destination Field */}
          <div className="lg:col-span-3 relative" ref={destMenuRef}>
            <div
              onClick={() => setOpenDestMenu(!openDestMenu)}
              className="w-full h-13 px-3 py-2 bg-white rounded-lg border border-slate-300 hover:border-blue-500 shadow-xs flex items-center justify-between cursor-pointer transition-all"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-xs font-bold text-slate-900 truncate">
                  {destination.city} ({destination.code})
                </span>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDestQuery('');
                    setOpenDestMenu(true);
                  }}
                  className="p-1 text-slate-400 hover:text-slate-700 rounded cursor-pointer"
                  title="Clear"
                >
                  ✕
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenDestMenu(true);
                  }}
                  className="p-1 text-slate-400 hover:text-slate-700 rounded cursor-pointer text-xs font-bold"
                  title="Add arrival airport"
                >
                  +
                </button>
              </div>
            </div>

            {/* Destination Dropdown Menu */}
            {openDestMenu && (
              <div className="absolute top-full right-0 md:left-0 mt-1.5 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 p-2 text-slate-900 animate-fadeIn">
                <div className="p-2 border-b border-slate-100 space-y-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search destination city or airport code..."
                      value={destQuery}
                      onChange={(e) => setDestQuery(e.target.value)}
                      autoFocus
                      className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-100 rounded-lg border-none focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                            ? 'bg-[#006ce4] text-white font-bold'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
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
                      className="w-full p-2 text-left rounded-lg hover:bg-blue-50 flex items-center justify-between group transition-colors cursor-pointer"
                    >
                      <div>
                        <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          <span>{ap.city}</span>
                          <span className="font-mono text-[10px] font-bold px-1.5 py-0.2 bg-blue-100 text-blue-800 rounded">
                            {ap.code}
                          </span>
                          <span className="text-[10px] text-slate-500 font-medium">({ap.country})</span>
                        </div>
                        <div className="text-[10px] text-slate-500 truncate max-w-[220px]">{ap.name}</div>
                      </div>
                      {destination.code === ap.code && <Check className="w-3.5 h-3.5 text-blue-600" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Departure Date Container (Booking.com style with step buttons: < Wed 9/2 >) */}
          <div className="lg:col-span-2 relative">
            <div className="w-full h-13 px-2 py-1.5 bg-white rounded-lg border border-slate-300 hover:border-blue-500 shadow-xs flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-1.5 min-w-0">
                <Calendar className="w-4 h-4 text-slate-700 shrink-0" />
                <label className="cursor-pointer">
                  <span className="text-xs font-bold text-slate-900 block truncate">
                    {formatBookingDate(departureDate)}
                  </span>
                  <input
                    type="date"
                    min={today}
                    value={departureDate}
                    onChange={(e) => handleDepartureDateChange(e.target.value)}
                    className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                  />
                </label>
              </div>
              <div className="flex items-center z-10">
                <button
                  type="button"
                  onClick={(e) => handleStepDeparture(-1, e)}
                  className="p-1 hover:bg-slate-100 rounded text-slate-600 font-bold text-xs"
                  title="Previous Day"
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={(e) => handleStepDeparture(1, e)}
                  className="p-1 hover:bg-slate-100 rounded text-slate-600 font-bold text-xs"
                  title="Next Day"
                >
                  ›
                </button>
              </div>
            </div>
          </div>

          {/* Return Date Container (Booking.com style with step buttons: < Wed 9/2 >) */}
          <div className="lg:col-span-2 relative">
            <div
              className={`w-full h-13 px-2 py-1.5 bg-white rounded-lg border border-slate-300 hover:border-blue-500 shadow-xs flex items-center justify-between cursor-pointer ${
                tripType === 'oneway' ? 'opacity-50 pointer-events-none bg-slate-100' : ''
              }`}
            >
              <div className="flex items-center gap-1.5 min-w-0">
                <Calendar className="w-4 h-4 text-slate-700 shrink-0" />
                <label className="cursor-pointer">
                  <span className="text-xs font-bold text-slate-900 block truncate">
                    {tripType === 'oneway' ? 'One-way' : formatBookingDate(returnDate)}
                  </span>
                  {tripType === 'round' && (
                    <input
                      type="date"
                      min={departureDate || today}
                      value={returnDate}
                      onChange={(e) => handleReturnDateChange(e.target.value)}
                      className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                    />
                  )}
                </label>
              </div>
              {tripType === 'round' && (
                <div className="flex items-center z-10">
                  <button
                    type="button"
                    onClick={(e) => handleStepReturn(-1, e)}
                    className="p-1 hover:bg-slate-100 rounded text-slate-600 font-bold text-xs"
                    title="Previous Day"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    onClick={(e) => handleStepReturn(1, e)}
                    className="p-1 hover:bg-slate-100 rounded text-slate-600 font-bold text-xs"
                    title="Next Day"
                  >
                    ›
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Search Button (Booking.com style vibrant blue button) */}
          <div className="lg:col-span-1">
            <button
              type="submit"
              className="w-full h-13 px-4 rounded-lg bg-[#006ce4] hover:bg-[#0057b8] text-white font-bold text-sm shadow-md transition-colors flex items-center justify-center gap-1 cursor-pointer"
            >
              <span>Search</span>
            </button>
          </div>
        </div>

        {/* Validation error notice */}
        {validationError && (
          <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}
      </form>
    </div>
  );
};
