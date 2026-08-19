import React, { useState, useRef, useEffect } from 'react';
import {
  Plane,
  Building2,
  Package,
  FileCheck2,
  Sparkles,
  ArrowRightLeft,
  Calendar,
  Users,
  ChevronDown,
  Search,
  ArrowRight,
  MapPin,
  AlertCircle,
  ShieldCheck,
  Mic,
} from 'lucide-react';
import {
  POPULAR_AIRPORTS,
  BANGLADESH_AIRPORTS,
  Airport,
  trackFlightSearchEvent,
} from '../data/flightsData';
import { AZRAQ_AGENCY_CONFIG } from '../data/agencyConfig';
import { AirportAutocompleteField } from './AirportAutocompleteField';

export type TripFinderMode = 'flights' | 'hotels' | 'packages' | 'visa' | 'planner';

export interface FlightSearchParams {
  tripType: 'round' | 'oneway' | 'multi';
  origin: Airport;
  destination: Airport;
  departureDate: string;
  returnDate: string;
  adults: number;
  children: number;
  infants: number;
  cabinClass: 'Economy' | 'Premium Economy' | 'Business' | 'First';
  currency: string;
}

interface AzraqTripFinderProps {
  initialMode?: TripFinderMode;
  onSearchFlights: (params: FlightSearchParams) => void;
  onNavigateToView: (view: any, extra?: any) => void;
  onOpenVisaModal?: (country?: string) => void;
  onOpenQuoteModal?: () => void;
  onOpenVoiceModal?: (initialTranscript?: string) => void;
  className?: string;
}

export const AzraqTripFinder: React.FC<AzraqTripFinderProps> = ({
  initialMode = 'flights',
  onSearchFlights,
  onNavigateToView,
  onOpenVisaModal,
  onOpenQuoteModal,
  onOpenVoiceModal,
  className = '',
}) => {
  const [activeTab, setActiveTab] = useState<TripFinderMode>(initialMode);

  // Default dates: departure in 14 days, return in 21 days
  const todayStr = new Date().toISOString().split('T')[0];
  const defaultDepDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const defaultRetDate = new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  // Flight search states
  const [tripType, setTripType] = useState<'round' | 'oneway' | 'multi'>('round');
  const [origin, setOrigin] = useState<Airport>(BANGLADESH_AIRPORTS[0]); // DAC
  const [destination, setDestination] = useState<Airport>(
    POPULAR_AIRPORTS.find((a) => a.code === 'BKK') || POPULAR_AIRPORTS[4]
  );
  const [departureDate, setDepartureDate] = useState<string>(defaultDepDate);
  const [returnDate, setReturnDate] = useState<string>(defaultRetDate);
  const [adults, setAdults] = useState<number>(1);
  const [children, setChildren] = useState<number>(0);
  const [infants, setInfants] = useState<number>(0);
  const [cabinClass, setCabinClass] = useState<'Economy' | 'Premium Economy' | 'Business' | 'First'>('Economy');
  const [currency, setCurrency] = useState<string>('BDT');
  const [directOnly, setDirectOnly] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Popover menus
  const [openTravelersMenu, setOpenTravelersMenu] = useState(false);
  const travelersMenuRef = useRef<HTMLDivElement>(null);

  // Hotel search states
  const [hotelCity, setHotelCity] = useState('Bangkok, Thailand');
  const [hotelCheckIn, setHotelCheckIn] = useState(defaultDepDate);
  const [hotelCheckOut, setHotelCheckOut] = useState(defaultRetDate);
  const [hotelGuests, setHotelGuests] = useState('2 adults · 1 room');

  // Tour Package states
  const [packageCountry, setPackageCountry] = useState('Thailand');
  const [packageStyle, setPackageStyle] = useState('Family Holiday');

  // Visa states
  const [visaCountry, setVisaCountry] = useState('Thailand');
  const [passportType, setPassportType] = useState('Bangladeshi Regular E-Passport');

  // Custom trip prompt
  const [plannerPrompt, setPlannerPrompt] = useState('5-day family holiday in Bangkok & Phuket with private transfers');

  // Close menus on click outside
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
      setDestination(origin);
    }
    setOrigin(selected);
    setValidationError(null);
  };

  const handleSelectDestination = (selected: Airport) => {
    if (selected.code.toUpperCase() === origin.code.toUpperCase()) {
      setOrigin(destination);
    }
    setDestination(selected);
    setValidationError(null);
  };

  const handleSwapAirports = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
    setValidationError(null);
  };

  // Date handlers
  const handleDepartureDateChange = (val: string) => {
    setDepartureDate(val);
    setValidationError(null);
    if (tripType === 'round' && returnDate && val > returnDate) {
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
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (d < today) return todayStr;
      return d.toISOString().split('T')[0];
    } catch {
      return dateStr;
    }
  };

  const handleFlightSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (origin.code === destination.code) {
      setValidationError('Origin and destination cannot be the same airport.');
      return;
    }

    setValidationError(null);
    trackFlightSearchEvent('search_submitted', {
      origin: origin.code,
      destination: destination.code,
      tripType,
      departureDate,
      returnDate: tripType === 'round' ? returnDate : undefined,
      adults,
      children,
      infants,
      cabinClass,
      currency,
    });

    onSearchFlights({
      tripType,
      origin,
      destination,
      departureDate,
      returnDate: tripType === 'round' ? returnDate : departureDate,
      adults,
      children,
      infants,
      cabinClass,
      currency,
    });
  };

  // Top quick routes from Dhaka
  const QUICK_ROUTES = [
    { code: 'BKK', city: 'Bangkok', country: 'Thailand', name: 'Suvarnabhumi Airport' },
    { code: 'DXB', city: 'Dubai', country: 'UAE', name: 'Dubai International Airport' },
    { code: 'KUL', city: 'Kuala Lumpur', country: 'Malaysia', name: 'Kuala Lumpur International Airport' },
    { code: 'SIN', city: 'Singapore', country: 'Singapore', name: 'Singapore Changi Airport' },
    { code: 'KTM', city: 'Kathmandu', country: 'Nepal', name: 'Tribhuvan International Airport' },
    { code: 'MLE', city: 'Male', country: 'Maldives', name: 'Velana International Airport' },
  ];

  const handleSelectQuickRoute = (r: typeof QUICK_ROUTES[0]) => {
    const dac = BANGLADESH_AIRPORTS[0];
    setOrigin(dac);
    setDestination({
      code: r.code,
      city: r.city,
      country: r.country,
      name: r.name,
    });
    setValidationError(null);
  };

  return (
    <div className={`w-full max-w-full ${className}`}>      {/* 1. Mode Category Tabs (Floating rounded pills) */}
      <div className="flex items-center gap-1.5 sm:gap-2 pb-2 overflow-x-auto no-scrollbar">
        <button
          type="button"
          onClick={() => setActiveTab('flights')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'flights'
              ? 'bg-white text-[#0759B8] shadow-md border border-[#CDE9FB]'
              : 'bg-white/80 hover:bg-white text-slate-700 hover:text-[#0759B8] border border-transparent'
          }`}
        >
          <Plane className="w-4 h-4 text-[#1389E8]" />
          <span>Flights</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('hotels')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'hotels'
              ? 'bg-white text-[#0759B8] shadow-md border border-[#CDE9FB]'
              : 'bg-white/80 hover:bg-white text-slate-700 hover:text-[#0759B8] border border-transparent'
          }`}
        >
          <Building2 className="w-4 h-4 text-[#0759B8]" />
          <span>Stays & Hotels</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('packages')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'packages'
              ? 'bg-white text-[#0759B8] shadow-md border border-[#CDE9FB]'
              : 'bg-white/80 hover:bg-white text-slate-700 hover:text-[#0759B8] border border-transparent'
          }`}
        >
          <Package className="w-4 h-4 text-[#F59E0B]" />
          <span>Tour Packages</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('visa')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'visa'
              ? 'bg-white text-[#0759B8] shadow-md border border-[#CDE9FB]'
              : 'bg-white/80 hover:bg-white text-slate-700 hover:text-[#0759B8] border border-transparent'
          }`}
        >
          <FileCheck2 className="w-4 h-4 text-[#10B981]" />
          <span>Visa Assistance</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('planner')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'planner'
              ? 'bg-white text-[#0759B8] shadow-md border border-[#CDE9FB]'
              : 'bg-white/80 hover:bg-white text-slate-700 hover:text-[#0759B8] border border-transparent'
          }`}
        >
          <Sparkles className="w-4 h-4 text-[#8B5CF6]" />
          <span>Custom Trip</span>
        </button>

        {/* Voice Trip Planner Quick Trigger */}
        {onOpenVoiceModal && (
          <button
            type="button"
            onClick={() => onOpenVoiceModal()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer bg-gradient-to-r from-[#1389E8] to-[#0759B8] hover:from-[#0E7FE3] hover:to-[#064B9C] text-white shadow-md hover:scale-105 active:scale-95 ml-auto border border-white/30"
          >
            <Mic className="w-4 h-4 text-sky-200 animate-pulse" />
            <span>Voice Search</span>
          </button>
        )}
      </div>

      {/* 2. Main Search Container: Floating White Card with Soft Blue Border & Shadow */}
      <div className="w-full bg-white rounded-3xl p-4 sm:p-6 shadow-floating-search border border-[#CDE9FB] text-slate-900">
        {/* ================= MODE 1: FLIGHTS ================= */}
        {activeTab === 'flights' && (
          <form onSubmit={handleFlightSubmit} className="space-y-4">
            {/* Top Secondary Controls Row */}
            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-700 pb-2 border-b border-[#E1EFF8]">
              {/* Trip Type Selector */}
              <div className="relative">
                <select
                  value={tripType}
                  onChange={(e) => setTripType(e.target.value as any)}
                  className="bg-[#EAF7FF] hover:bg-[#DDF4FD] font-bold text-[#0759B8] py-1.5 px-3 rounded-lg border border-[#CDE9FB] focus:ring-2 focus:ring-[#1389E8] focus:outline-none cursor-pointer pr-7 appearance-none"
                >
                  <option value="round">Round-trip</option>
                  <option value="oneway">One-way</option>
                  <option value="multi">Multi-city</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 absolute right-2 top-2.5 pointer-events-none text-[#0759B8]" />
              </div>

              {/* Passenger Selector Button & Popover */}
              <div className="relative" ref={travelersMenuRef}>
                <button
                  type="button"
                  onClick={() => setOpenTravelersMenu(!openTravelersMenu)}
                  className="flex items-center gap-1.5 bg-[#EAF7FF] hover:bg-[#DDF4FD] font-bold text-[#0759B8] py-1.5 px-3 rounded-lg border border-[#CDE9FB] transition-colors cursor-pointer"
                >
                  <Users className="w-3.5 h-3.5 text-[#1389E8]" />
                  <span>
                    {adults} {adults === 1 ? 'adult' : 'adults'}
                    {children > 0 ? `, ${children} child` : ''}
                    {infants > 0 ? `, ${infants} infant` : ''}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-[#0759B8]" />
                </button>

                {openTravelersMenu && (
                  <div className="absolute top-full left-0 mt-1.5 w-64 bg-white rounded-2xl shadow-2xl border border-[#CDE9FB] z-50 p-4 text-slate-900 space-y-3 animate-fadeIn">
                    {/* Adults */}
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-slate-900">Adults</div>
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
                        <div className="text-xs font-bold text-slate-900">Children</div>
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
                        <div className="text-xs font-bold text-slate-900">Infants</div>
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
                      className="w-full py-2 rounded-xl bg-[#1389E8] hover:bg-[#0E7FE3] text-white text-xs font-bold transition-colors cursor-pointer"
                    >
                      Done
                    </button>
                  </div>
                )}
              </div>

              {/* Cabin Class */}
              <div className="relative">
                <select
                  value={cabinClass}
                  onChange={(e) => setCabinClass(e.target.value as any)}
                  className="bg-[#EAF7FF] hover:bg-[#DDF4FD] font-bold text-[#0759B8] py-1.5 px-3 rounded-lg border border-[#CDE9FB] focus:ring-2 focus:ring-[#1389E8] focus:outline-none cursor-pointer pr-7 appearance-none"
                >
                  <option value="Economy">Economy</option>
                  <option value="Premium Economy">Premium Economy</option>
                  <option value="Business">Business</option>
                  <option value="First">First-class</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 absolute right-2 top-2.5 pointer-events-none text-[#0759B8]" />
              </div>

              {/* Currency */}
              <div className="relative">
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="bg-[#EAF7FF] hover:bg-[#DDF4FD] font-bold text-[#0759B8] py-1.5 px-3 rounded-lg border border-[#CDE9FB] focus:ring-2 focus:ring-[#1389E8] focus:outline-none cursor-pointer pr-7 appearance-none"
                >
                  <option value="BDT">BDT (৳)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 absolute right-2 top-2.5 pointer-events-none text-[#0759B8]" />
              </div>

              {/* Direct flights only */}
              <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={directOnly}
                  onChange={(e) => setDirectOnly(e.target.checked)}
                  className="rounded text-[#1389E8] focus:ring-[#1389E8] h-3.5 w-3.5 border-slate-300"
                />
                <span>Direct flights only</span>
              </label>

              {/* Voice Flight Search Shortcut */}
              {onOpenVoiceModal && (
                <button
                  type="button"
                  onClick={() => onOpenVoiceModal('Find flights from Dhaka to Bangkok next Friday for 2 adults')}
                  className="ml-auto flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF7FF] hover:bg-[#DDF4FD] text-[#0759B8] font-bold text-xs border border-[#CDE9FB] transition-all hover:scale-105 cursor-pointer"
                  title="Search flights by voice"
                >
                  <Mic className="w-3.5 h-3.5 text-[#1389E8] animate-pulse" />
                  <span>Voice Flight Search</span>
                </button>
              )}
            </div>

            {/* Main Primary Search Row (Connected Field Grid) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 items-center">
              {/* Origin Field */}
              <div className="lg:col-span-3">
                <AirportAutocompleteField
                  label="Leaving from"
                  selectedAirport={origin}
                  onSelect={handleSelectOrigin}
                  otherAirportCode={destination.code}
                  placeholder="Where from? (DAC, LHR...)"
                />
              </div>

              {/* Swap Button */}
              <div className="lg:col-span-1 flex justify-center py-1 lg:py-0">
                <button
                  type="button"
                  onClick={handleSwapAirports}
                  aria-label="Swap origin and destination"
                  className="w-10 h-10 rounded-full bg-[#EAF7FF] border border-[#CDE9FB] hover:border-[#1389E8] text-[#0759B8] shadow-xs flex items-center justify-center hover:scale-105 transition-all cursor-pointer"
                >
                  <ArrowRightLeft className="w-4 h-4 text-[#1389E8]" />
                </button>
              </div>

              {/* Destination Field */}
              <div className="lg:col-span-3">
                <AirportAutocompleteField
                  label="Going to"
                  selectedAirport={destination}
                  onSelect={handleSelectDestination}
                  otherAirportCode={origin.code}
                  placeholder="Where to? (BKK, DXB...)"
                />
              </div>

              {/* Departure Date */}
              <div className="lg:col-span-2 relative">
                <div className="w-full h-[54px] px-3 py-1.5 bg-[#F4FAFD] hover:bg-white rounded-xl border border-[#E1EFF8] hover:border-[#1389E8] shadow-xs flex items-center justify-between cursor-pointer transition-all">
                  <div className="flex items-center gap-2 min-w-0">
                    <Calendar className="w-4 h-4 text-[#1389E8] shrink-0" />
                    <label className="cursor-pointer">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        Departure
                      </span>
                      <span className="text-xs font-bold text-slate-900 block truncate">
                        {formatBookingDate(departureDate)}
                      </span>
                      <input
                        type="date"
                        min={todayStr}
                        value={departureDate}
                        onChange={(e) => handleDepartureDateChange(e.target.value)}
                        className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                      />
                    </label>
                  </div>
                  <div className="flex items-center z-10">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDepartureDateChange(adjustDateByDays(departureDate, -1));
                      }}
                      className="p-1 hover:bg-[#EAF7FF] rounded text-slate-600 font-bold text-xs"
                      title="Previous Day"
                    >
                      ‹
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDepartureDateChange(adjustDateByDays(departureDate, 1));
                      }}
                      className="p-1 hover:bg-[#EAF7FF] rounded text-slate-600 font-bold text-xs"
                      title="Next Day"
                    >
                      ›
                    </button>
                  </div>
                </div>
              </div>

              {/* Return Date */}
              <div className="lg:col-span-2 relative">
                <div
                  className={`w-full h-[54px] px-3 py-1.5 bg-[#F4FAFD] hover:bg-white rounded-xl border border-[#E1EFF8] hover:border-[#1389E8] shadow-xs flex items-center justify-between cursor-pointer transition-all ${
                    tripType === 'oneway' ? 'opacity-50 pointer-events-none bg-slate-100' : ''
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Calendar className="w-4 h-4 text-[#1389E8] shrink-0" />
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
                          min={departureDate || todayStr}
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
                        onClick={(e) => {
                          e.stopPropagation();
                          const newD = adjustDateByDays(returnDate, -1);
                          if (newD >= departureDate) handleReturnDateChange(newD);
                        }}
                        className="p-1 hover:bg-[#EAF7FF] rounded text-slate-600 font-bold text-xs"
                        title="Previous Day"
                      >
                        ‹
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReturnDateChange(adjustDateByDays(returnDate, 1));
                        }}
                        className="p-1 hover:bg-[#EAF7FF] rounded text-slate-600 font-bold text-xs"
                        title="Next Day"
                      >
                        ›
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Primary Search Button with integrated Voice Mic */}
              <div className="lg:col-span-1 flex gap-1">
                <button
                  type="submit"
                  className="flex-1 h-[54px] px-3 rounded-xl bg-[#1389E8] hover:bg-[#0E7FE3] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-1 cursor-pointer active:scale-98"
                >
                  <span>Search</span>
                </button>
                {onOpenVoiceModal && (
                  <button
                    type="button"
                    onClick={() => onOpenVoiceModal()}
                    className="h-[54px] px-2.5 rounded-xl bg-[#EAF7FF] hover:bg-[#DDF4FD] text-[#1389E8] border border-[#CDE9FB] font-bold text-xs shadow-xs transition-colors flex items-center justify-center cursor-pointer"
                    title="Voice Flight Search"
                  >
                    <Mic className="w-4 h-4 animate-pulse text-[#1389E8]" />
                  </button>
                )}
              </div>
            </div>

            {/* Validation Error Message */}
            {validationError && (
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{validationError}</span>
              </div>
            )}

            {/* Quick Route Shortcuts */}
            <div className="pt-2 border-t border-[#E1EFF8] flex flex-wrap items-center gap-2 text-xs">
              <span className="font-bold text-slate-800 text-[11px]">Popular from Dhaka:</span>
              {QUICK_ROUTES.map((r) => {
                const isCurrent = origin.code === 'DAC' && destination.code === r.code;
                return (
                  <button
                    key={r.code}
                    type="button"
                    onClick={() => handleSelectQuickRoute(r)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-[#0759B8] text-white shadow-xs'
                        : 'bg-[#EAF7FF] hover:bg-[#DDF4FD] text-[#0759B8] border border-[#CDE9FB]'
                    }`}
                  >
                    DAC ➔ {r.city} ({r.code})
                  </button>
                );
              })}
            </div>
          </form>
        )}

        {/* ================= MODE 2: STAYS & HOTELS ================= */}
        {activeTab === 'hotels' && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 items-center">
              {/* Destination Input */}
              <div className="lg:col-span-5 relative">
                <div className="w-full h-[54px] px-3 py-1.5 bg-[#F4FAFD] hover:bg-white rounded-xl border border-[#E1EFF8] hover:border-[#1389E8] shadow-xs flex items-center gap-2 transition-all">
                  <MapPin className="w-4 h-4 text-[#1389E8] shrink-0" />
                  <div className="flex-1 min-w-0">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Where are you going?
                    </label>
                    <input
                      type="text"
                      value={hotelCity}
                      onChange={(e) => setHotelCity(e.target.value)}
                      placeholder="e.g. Bangkok, Dubai, Maldives, Singapore..."
                      className="w-full text-xs font-bold text-slate-900 bg-transparent border-none p-0 focus:outline-none placeholder-slate-400 truncate"
                    />
                  </div>
                </div>
              </div>

              {/* Check-in / Check-out Dates */}
              <div className="lg:col-span-3 relative">
                <div className="w-full h-[54px] px-3 py-1.5 bg-[#F4FAFD] hover:bg-white rounded-xl border border-[#E1EFF8] hover:border-[#1389E8] shadow-xs flex items-center gap-2 transition-all">
                  <Calendar className="w-4 h-4 text-[#1389E8] shrink-0" />
                  <div className="flex-1 min-w-0">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Check-in — Check-out
                    </label>
                    <div className="text-xs font-bold text-slate-900 truncate">
                      {formatBookingDate(hotelCheckIn)} — {formatBookingDate(hotelCheckOut)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Guests */}
              <div className="lg:col-span-2 relative">
                <div className="w-full h-[54px] px-3 py-1.5 bg-[#F4FAFD] hover:bg-white rounded-xl border border-[#E1EFF8] hover:border-[#1389E8] shadow-xs flex items-center gap-2 transition-all">
                  <Users className="w-4 h-4 text-[#1389E8] shrink-0" />
                  <div className="flex-1 min-w-0">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Rooms & Guests
                    </label>
                    <input
                      type="text"
                      value={hotelGuests}
                      onChange={(e) => setHotelGuests(e.target.value)}
                      className="w-full text-xs font-bold text-slate-900 bg-transparent border-none p-0 focus:outline-none truncate"
                    />
                  </div>
                </div>
              </div>

              {/* Search Stays Button */}
              <div className="lg:col-span-2">
                <button
                  type="button"
                  onClick={() => onNavigateToView('packages')}
                  className="w-full h-[54px] px-4 rounded-xl bg-[#1389E8] hover:bg-[#0E7FE3] text-white font-bold text-sm shadow-md transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                  <span>Search Stays</span>
                </button>
              </div>
            </div>
            <div className="pt-2 border-t border-[#E1EFF8] text-xs text-slate-600 font-medium">
              Vetted 4★ and 5★ luxury hotels with breakfast, airport transfers, and halal dining options.
            </div>
          </div>
        )}

        {/* ================= MODE 3: TOUR PACKAGES ================= */}
        {activeTab === 'packages' && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 items-center">
              {/* Destination Country */}
              <div className="lg:col-span-5 relative">
                <div className="w-full h-[54px] px-3 py-1.5 bg-[#F4FAFD] hover:bg-white rounded-xl border border-[#E1EFF8] hover:border-[#1389E8] shadow-xs flex items-center gap-2 transition-all">
                  <Package className="w-4 h-4 text-[#F59E0B] shrink-0" />
                  <div className="flex-1 min-w-0">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Destination Country
                    </label>
                    <select
                      value={packageCountry}
                      onChange={(e) => setPackageCountry(e.target.value)}
                      className="w-full text-xs font-bold text-slate-900 bg-transparent border-none p-0 focus:outline-none cursor-pointer"
                    >
                      <option value="Thailand">Thailand (Bangkok, Pattaya, Phuket)</option>
                      <option value="UAE">United Arab Emirates (Dubai & Abu Dhabi)</option>
                      <option value="Malaysia">Malaysia (Kuala Lumpur & Langkawi)</option>
                      <option value="Maldives">Maldives (Overwater Luxury Resort)</option>
                      <option value="Nepal">Nepal (Kathmandu & Pokhara)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Package Type */}
              <div className="lg:col-span-4 relative">
                <div className="w-full h-[54px] px-3 py-1.5 bg-[#F4FAFD] hover:bg-white rounded-xl border border-[#E1EFF8] hover:border-[#1389E8] shadow-xs flex items-center gap-2 transition-all">
                  <ShieldCheck className="w-4 h-4 text-[#1389E8] shrink-0" />
                  <div className="flex-1 min-w-0">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Travel Style
                    </label>
                    <select
                      value={packageStyle}
                      onChange={(e) => setPackageStyle(e.target.value)}
                      className="w-full text-xs font-bold text-slate-900 bg-transparent border-none p-0 focus:outline-none cursor-pointer"
                    >
                      <option value="Family Holiday">Family Holiday Package</option>
                      <option value="Honeymoon Escape">Honeymoon & Couple Escape</option>
                      <option value="Group & Corporate">Group & Corporate Tour</option>
                      <option value="Budget Getaway">Budget-Friendly Getaway</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Search Packages Button */}
              <div className="lg:col-span-3">
                <button
                  type="button"
                  onClick={() => onNavigateToView('packages')}
                  className="w-full h-[54px] px-4 rounded-xl bg-[#1389E8] hover:bg-[#0E7FE3] text-white font-bold text-sm shadow-md transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>Explore Packages</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="pt-2 border-t border-[#E1EFF8] text-xs text-slate-600 font-medium">
              Handcrafted packages starting from BDT 14,999 with verified Dhaka desk concierge.
            </div>
          </div>
        )}

        {/* ================= MODE 4: VISA ASSISTANCE ================= */}
        {activeTab === 'visa' && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 items-center">
              {/* Destination Country */}
              <div className="lg:col-span-5 relative">
                <div className="w-full h-[54px] px-3 py-1.5 bg-[#F4FAFD] hover:bg-white rounded-xl border border-[#E1EFF8] hover:border-[#1389E8] shadow-xs flex items-center gap-2 transition-all">
                  <FileCheck2 className="w-4 h-4 text-[#10B981] shrink-0" />
                  <div className="flex-1 min-w-0">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Destination Embassy
                    </label>
                    <select
                      value={visaCountry}
                      onChange={(e) => setVisaCountry(e.target.value)}
                      className="w-full text-xs font-bold text-slate-900 bg-transparent border-none p-0 focus:outline-none cursor-pointer"
                    >
                      <option value="Thailand">Thailand (Tourist / Sticker Visa)</option>
                      <option value="Malaysia">Malaysia (eVisa & Single Entry)</option>
                      <option value="Singapore">Singapore (e-Visa via Dhaka Desk)</option>
                      <option value="UAE">United Arab Emirates (30/60 Days)</option>
                      <option value="Nepal">Nepal (On Arrival / Gratis Entry)</option>
                      <option value="Maldives">Maldives (30-Day Tourist Entry)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Passport Type */}
              <div className="lg:col-span-4 relative">
                <div className="w-full h-[54px] px-3 py-1.5 bg-[#F4FAFD] hover:bg-white rounded-xl border border-[#E1EFF8] hover:border-[#1389E8] shadow-xs flex items-center gap-2 transition-all">
                  <ShieldCheck className="w-4 h-4 text-[#1389E8] shrink-0" />
                  <div className="flex-1 min-w-0">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Passport Type
                    </label>
                    <select
                      value={passportType}
                      onChange={(e) => setPassportType(e.target.value)}
                      className="w-full text-xs font-bold text-slate-900 bg-transparent border-none p-0 focus:outline-none cursor-pointer"
                    >
                      <option value="Bangladeshi Regular E-Passport">Bangladeshi Regular E-Passport</option>
                      <option value="Bangladeshi MRP Passport">Bangladeshi MRP Passport</option>
                      <option value="Official / Diplomatic Passport">Official / Diplomatic Passport</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Check Visa Button */}
              <div className="lg:col-span-3">
                <button
                  type="button"
                  onClick={() => {
                    if (onOpenVisaModal) onOpenVisaModal(visaCountry);
                    else onNavigateToView('visa');
                  }}
                  className="w-full h-[54px] px-4 rounded-xl bg-[#1389E8] hover:bg-[#0E7FE3] text-white font-bold text-sm shadow-md transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>Check Visa Info</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="pt-2 border-t border-[#E1EFF8] text-xs text-slate-600 font-medium">
              Clear document checklists, NOC templates, and application verification at Gulshan-2 desk.
            </div>
          </div>
        )}

        {/* ================= MODE 5: CUSTOM TRIP ================= */}
        {activeTab === 'planner' && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 items-center">
              {/* Prompt Input */}
              <div className="lg:col-span-9 relative">
                <div className="w-full h-[54px] px-3 py-1.5 bg-[#F4FAFD] hover:bg-white rounded-xl border border-[#E1EFF8] hover:border-[#1389E8] shadow-xs flex items-center gap-2 transition-all">
                  <Sparkles className="w-4 h-4 text-[#8B5CF6] shrink-0" />
                  <div className="flex-1 min-w-0">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Describe your dream trip
                    </label>
                    <input
                      type="text"
                      value={plannerPrompt}
                      onChange={(e) => setPlannerPrompt(e.target.value)}
                      placeholder="e.g. 5-day luxury family escape in Bangkok and Phuket..."
                      className="w-full text-xs font-bold text-slate-900 bg-transparent border-none p-0 focus:outline-none placeholder-slate-400 truncate"
                    />
                  </div>
                  {onOpenVoiceModal && (
                    <button
                      type="button"
                      onClick={() => onOpenVoiceModal(plannerPrompt)}
                      className="p-2 rounded-lg bg-[#EAF7FF] hover:bg-[#DDF4FD] text-[#1389E8] transition-colors cursor-pointer shrink-0"
                      title="Speak your dream trip using Web Speech AI"
                    >
                      <Mic className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Plan Trip CTA */}
              <div className="lg:col-span-3">
                <button
                  type="button"
                  onClick={() => onNavigateToView('planner', { prompt: plannerPrompt })}
                  className="w-full h-[54px] px-4 rounded-xl bg-[#1389E8] hover:bg-[#0E7FE3] text-white font-bold text-sm shadow-md transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Plan My Trip</span>
                </button>
              </div>
            </div>
            <div className="pt-2 border-t border-[#E1EFF8] text-xs text-slate-600 font-medium">
              Instant AI itinerary builder with day-by-day activities, hotel recommendations, and budget estimation.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
