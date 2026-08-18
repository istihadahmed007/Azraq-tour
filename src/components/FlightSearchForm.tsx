import React, { useState, useRef, useEffect } from 'react';
import {
  Plane,
  Calendar,
  Users,
  ArrowRightLeft,
  Search,
  ChevronDown,
  AlertCircle,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import {
  Airport,
  BANGLADESH_AIRPORTS,
  POPULAR_AIRPORTS,
  buildAviasalesSearchUrl,
  trackFlightSearchEvent,
} from '../data/flightsData';
import {
  NormalizedFlightSearch,
  validateFlightSearchParams,
  normalizeFlightSearch,
} from '../utils/flightSearchEngine';
import { AirportAutocompleteField } from './AirportAutocompleteField';

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
    initialParams?.destination || POPULAR_AIRPORTS.find((a) => a.code === 'BKK') || POPULAR_AIRPORTS[1]
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
  const [directOnly, setDirectOnly] = useState<boolean>(false);
  const [currency, setCurrency] = useState<string>(initialParams?.currency || 'BDT');

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
    if (initialParams.currency) setCurrency(initialParams.currency);
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
    initialParams?.currency,
  ]);

  // UI popover states
  const [openTravelersMenu, setOpenTravelersMenu] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const travelersMenuRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (travelersMenuRef.current && !travelersMenuRef.current.contains(e.target as Node)) {
        setOpenTravelersMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Airport selection with auto-swap prevention for same airport
  const handleSelectOrigin = (selected: Airport) => {
    if (selected.code.toUpperCase() === destination.code.toUpperCase()) {
      // User picked same airport as destination -> swap them
      setDestination(origin);
    }
    setOrigin(selected);
    setValidationError(null);
  };

  const handleSelectDestination = (selected: Airport) => {
    if (selected.code.toUpperCase() === origin.code.toUpperCase()) {
      // User picked same airport as origin -> swap them
      setOrigin(destination);
    }
    setDestination(selected);
    setValidationError(null);
  };

  // Airport swap
  const handleSwapAirports = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
    setValidationError(null);
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
      currency,
    };

    const validation = validateFlightSearchParams(candidateParams);
    if (!validation.isValid) {
      setValidationError(validation.error || 'Please provide valid flight search details.');
      return;
    }

    setValidationError(null);

    const searchParams = normalizeFlightSearch(candidateParams);

    trackFlightSearchEvent('search_submitted', {
      origin: origin.code,
      destination: destination.code,
      tripType,
      adults,
      children,
      infants,
      cabinClass,
      directOnly,
      currency,
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

  // Quick route shortcuts from Dhaka
  const QUICK_DHAKA_ROUTES = [
    { code: 'BKK', city: 'Bangkok', country: 'Thailand', name: 'Suvarnabhumi Airport' },
    { code: 'DXB', city: 'Dubai', country: 'UAE', name: 'Dubai International Airport' },
    { code: 'KUL', city: 'Kuala Lumpur', country: 'Malaysia', name: 'Kuala Lumpur International Airport' },
    { code: 'SIN', city: 'Singapore', country: 'Singapore', name: 'Singapore Changi Airport' },
    { code: 'KTM', city: 'Kathmandu', country: 'Nepal', name: 'Tribhuvan International Airport' },
    { code: 'MLE', city: 'Male', country: 'Maldives', name: 'Velana International Airport' },
  ];

  const handleApplyQuickRoute = (targetDest: typeof QUICK_DHAKA_ROUTES[0]) => {
    const dac = BANGLADESH_AIRPORTS[0];
    setOrigin(dac);
    setDestination({
      code: targetDest.code,
      city: targetDest.city,
      country: targetDest.country,
      name: targetDest.name,
    });
    setValidationError(null);
    trackFlightSearchEvent('quick_route_used', {
      origin: 'DAC',
      destination: targetDest.code,
      source: sourceTag,
    });
  };

  return (
    <div className={`w-full bg-[#ffb700] rounded-2xl p-4 sm:p-6 shadow-md text-slate-900 ${className}`}>
      <form onSubmit={handleSearchSubmit} className="space-y-3">
        {/* Top Dropdowns Row (Booking.com style: Round-trip ⌵, 1 adult ⌵, Economy ⌵, Currency ⌵) */}
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
              <Users className="w-3.5 h-3.5 text-slate-800" />
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

          {/* Currency Selector */}
          <div className="relative">
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="bg-transparent hover:bg-black/5 font-bold text-slate-900 py-1.5 px-3 rounded-md border border-transparent hover:border-black/10 focus:ring-2 focus:ring-blue-600 focus:outline-none cursor-pointer pr-7 appearance-none"
            >
              <option value="BDT">BDT (৳)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-2 top-2.5 pointer-events-none text-slate-800" />
          </div>

          {/* Direct flights checkbox */}
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-900 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={directOnly}
              onChange={(e) => setDirectOnly(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500 h-3.5 w-3.5 border-slate-400"
            />
            <span>Direct flights only</span>
          </label>

          {/* Active Route display */}
          <div className="ml-auto hidden md:flex items-center gap-1.5 text-[11px] font-bold text-slate-800 bg-white/40 px-2.5 py-1 rounded-md">
            <span>Global Route: {origin.code} ➔ {destination.code}</span>
          </div>
        </div>

        {/* Connected Search Bar Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-1.5 items-center">
          {/* Origin Autocomplete Field */}
          <div className="lg:col-span-3">
            <AirportAutocompleteField
              label="Leaving from"
              selectedAirport={origin}
              onSelect={handleSelectOrigin}
              otherAirportCode={destination.code}
              placeholder="Search origin city/code (DAC, LHR, etc.)..."
            />
          </div>

          {/* Swap Button */}
          <div className="lg:col-span-1 flex justify-center py-1 lg:py-0">
            <button
              type="button"
              onClick={handleSwapAirports}
              aria-label="Swap origin and destination"
              className="w-9 h-9 rounded-full bg-white border border-slate-300 hover:border-[#006ce4] text-slate-700 shadow-xs flex items-center justify-center hover:scale-105 transition-all cursor-pointer"
            >
              <ArrowRightLeft className="w-4 h-4 text-slate-800" />
            </button>
          </div>

          {/* Destination Autocomplete Field */}
          <div className="lg:col-span-3">
            <AirportAutocompleteField
              label="Going to"
              selectedAirport={destination}
              onSelect={handleSelectDestination}
              otherAirportCode={origin.code}
              placeholder="Search destination city/code (BKK, DXB, etc.)..."
            />
          </div>

          {/* Departure Date Container */}
          <div className="lg:col-span-2 relative">
            <div className="w-full h-[52px] px-2 py-1.5 bg-white rounded-lg border border-slate-300 hover:border-[#006ce4] shadow-sm flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-1.5 min-w-0">
                <Calendar className="w-4 h-4 text-slate-700 shrink-0" />
                <label className="cursor-pointer">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Departure
                  </span>
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

          {/* Return Date Container */}
          <div className="lg:col-span-2 relative">
            <div
              className={`w-full h-[52px] px-2 py-1.5 bg-white rounded-lg border border-slate-300 hover:border-[#006ce4] shadow-sm flex items-center justify-between cursor-pointer ${
                tripType === 'oneway' ? 'opacity-50 pointer-events-none bg-slate-100' : ''
              }`}
            >
              <div className="flex items-center gap-1.5 min-w-0">
                <Calendar className="w-4 h-4 text-slate-700 shrink-0" />
                <label className="cursor-pointer">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Return
                  </span>
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

          {/* Search Button */}
          <div className="lg:col-span-1">
            <button
              type="submit"
              className="w-full h-[52px] px-4 rounded-lg bg-[#006ce4] hover:bg-[#0057b8] text-white font-bold text-sm shadow-md transition-colors flex items-center justify-center gap-1 cursor-pointer"
            >
              <span>Search</span>
            </button>
          </div>
        </div>

        {/* Validation error notice */}
        {validationError && (
          <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Popular Shortcuts from Dhaka */}
        <div className="pt-2 border-t border-black/10 flex flex-wrap items-center gap-2 text-xs">
          <span className="font-bold text-slate-900 text-[11px] flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-900" />
            Popular from Dhaka:
          </span>
          {QUICK_DHAKA_ROUTES.map((r) => {
            const isCurrent = origin.code === 'DAC' && destination.code === r.code;
            return (
              <button
                key={r.code}
                type="button"
                onClick={() => handleApplyQuickRoute(r)}
                className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white/70 hover:bg-white text-slate-800 border border-black/5 hover:border-black/20'
                }`}
              >
                DAC ➔ {r.city} ({r.code})
              </button>
            );
          })}
        </div>
      </form>
    </div>
  );
};
