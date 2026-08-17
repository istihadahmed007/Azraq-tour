import React, { useState, useRef, useEffect } from 'react';
import {
  Plane,
  Building,
  Package,
  FileCheck2,
  Sparkles,
  ArrowRightLeft,
  Calendar,
  Users,
  ChevronDown,
  ArrowRight,
  MapPin,
  Check,
  Search,
  Clock,
  Coins,
  ShieldCheck,
} from 'lucide-react';
import { POPULAR_AIRPORTS, Airport } from '../data/flightsData';
import { AZRAQ_AGENCY_CONFIG } from '../data/agencyConfig';

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
  className?: string;
}

export const AzraqTripFinder: React.FC<AzraqTripFinderProps> = ({
  initialMode = 'flights',
  onSearchFlights,
  onNavigateToView,
  onOpenVisaModal,
  onOpenQuoteModal,
  className = '',
}) => {
  const [activeTab, setActiveTab] = useState<TripFinderMode>(initialMode);

  // Flight search states
  const [tripType, setTripType] = useState<'round' | 'oneway' | 'multi'>('round');
  const [origin, setOrigin] = useState<Airport>(POPULAR_AIRPORTS[0]); // DAC
  const [destination, setDestination] = useState<Airport>(POPULAR_AIRPORTS[4]); // BKK (Bangkok)

  // Default dates: departure in 14 days, return in 21 days
  const todayStr = new Date().toISOString().split('T')[0];
  const defaultDepDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const defaultRetDate = new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const [departureDate, setDepartureDate] = useState(defaultDepDate);
  const [returnDate, setReturnDate] = useState(defaultRetDate);

  // Travelers count
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [cabinClass, setCabinClass] = useState<'Economy' | 'Premium Economy' | 'Business' | 'First'>('Economy');
  const [currency, setCurrency] = useState('BDT');

  // Popover menus
  const [openOriginMenu, setOpenOriginMenu] = useState(false);
  const [openDestMenu, setOpenDestMenu] = useState(false);
  const [openTravelersMenu, setOpenTravelersMenu] = useState(false);
  const [originQuery, setOriginQuery] = useState('');
  const [destQuery, setDestQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Hotel search states
  const [hotelCity, setHotelCity] = useState('Bangkok, Thailand');
  const [hotelGuests, setHotelGuests] = useState('2 Guests, 1 Room');

  // Package & Visa states
  const [selectedCountry, setSelectedCountry] = useState('Thailand');
  const [plannerPrompt, setPlannerPrompt] = useState('5-day luxury family escape in Bangkok and Phuket');

  const originMenuRef = useRef<HTMLDivElement>(null);
  const destMenuRef = useRef<HTMLDivElement>(null);
  const travelersMenuRef = useRef<HTMLDivElement>(null);

  // Click outside handlers
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

  // Swap Origin & Destination
  const handleSwapAirports = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  const handleFlightSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      onSearchFlights({
        tripType,
        origin,
        destination,
        departureDate,
        returnDate,
        adults,
        children,
        infants,
        cabinClass,
        currency,
      });
    }, 450);
  };

  // Filtered airport lists
  const filteredOrigins = POPULAR_AIRPORTS.filter(
    (a) =>
      a.city.toLowerCase().includes(originQuery.toLowerCase()) ||
      a.code.toLowerCase().includes(originQuery.toLowerCase()) ||
      a.country.toLowerCase().includes(originQuery.toLowerCase())
  );

  const filteredDestinations = POPULAR_AIRPORTS.filter(
    (a) =>
      a.city.toLowerCase().includes(destQuery.toLowerCase()) ||
      a.code.toLowerCase().includes(destQuery.toLowerCase()) ||
      a.country.toLowerCase().includes(destQuery.toLowerCase())
  );

  const totalTravelers = adults + children + infants;

  const quickRouteChips = [
    { from: 'DAC', to: 'BKK', label: 'Dhaka ⇄ Bangkok', tag: 'Direct Flight' },
    { from: 'DAC', to: 'DXB', label: 'Dhaka ⇄ Dubai', tag: 'Direct Hub' },
    { from: 'DAC', to: 'KUL', label: 'Dhaka ⇄ Kuala Lumpur', tag: 'Popular Route' },
    { from: 'DAC', to: 'SIN', label: 'Dhaka ⇄ Singapore', tag: 'Direct Flight' },
    { from: 'DAC', to: 'KTM', label: 'Dhaka ⇄ Kathmandu', tag: 'Short Haul' },
    { from: 'DAC', to: 'MLE', label: 'Dhaka ⇄ Maldives', tag: 'Honeymoon' },
  ];

  const handleQuickRouteSelect = (fromCode: string, toCode: string) => {
    const o = POPULAR_AIRPORTS.find((a) => a.code === fromCode) || POPULAR_AIRPORTS[0];
    const d = POPULAR_AIRPORTS.find((a) => a.code === toCode) || POPULAR_AIRPORTS[4];
    setOrigin(o);
    setDestination(d);
    onSearchFlights({
      tripType,
      origin: o,
      destination: d,
      departureDate,
      returnDate,
      adults,
      children,
      infants,
      cabinClass,
      currency,
    });
  };

  return (
    <div
      id="azraq-trip-finder"
      className={`w-full bg-[#071A33]/95 backdrop-blur-xl border border-sky-400/30 rounded-3xl shadow-2xl overflow-visible text-white p-4 sm:p-6 transition-all ${className}`}
    >
      {/* 5-Mode Navigation Tabs */}
      <div className="flex items-center gap-1 sm:gap-2 pb-4 border-b border-slate-700/70 overflow-x-auto no-scrollbar">
        <button
          type="button"
          onClick={() => setActiveTab('flights')}
          className={`flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'flights'
              ? 'bg-[#0D6EFD] text-white shadow-md shadow-blue-500/25'
              : 'text-slate-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <Plane className="w-4 h-4 text-sky-300" />
          <span>Flights</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-sky-400/20 text-sky-200 font-mono">
            New
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('hotels')}
          className={`flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'hotels'
              ? 'bg-[#0D6EFD] text-white shadow-md'
              : 'text-slate-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <Building className="w-4 h-4 text-teal-300" />
          <span>Hotels</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('packages')}
          className={`flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'packages'
              ? 'bg-[#0D6EFD] text-white shadow-md'
              : 'text-slate-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <Package className="w-4 h-4 text-amber-300" />
          <span>Tour Packages</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('visa')}
          className={`flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'visa'
              ? 'bg-[#0D6EFD] text-white shadow-md'
              : 'text-slate-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <FileCheck2 className="w-4 h-4 text-emerald-300" />
          <span>Visa Assistance</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('planner')}
          className={`flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'planner'
              ? 'bg-[#0D6EFD] text-white shadow-md'
              : 'text-slate-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <Sparkles className="w-4 h-4 text-purple-300" />
          <span>Custom Itinerary</span>
        </button>
      </div>

      {/* MODE 1: FLIGHTS SEARCH (Primary Mode) */}
      {activeTab === 'flights' && (
        <form onSubmit={handleFlightSubmit} className="mt-4 space-y-4">
          {/* Trip Type & Preferences Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-1.5 bg-slate-900/80 p-1 rounded-xl border border-slate-700/60">
              {(['round', 'oneway', 'multi'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setTripType(type)}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                    tripType === type
                      ? 'bg-blue-600/60 text-white border border-sky-400/40'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {type === 'round' ? 'Round Trip' : type === 'oneway' ? 'One Way' : 'Multi-City'}
                </button>
              ))}
            </div>

            {/* Currency & Direct Route Indicator */}
            <div className="flex items-center gap-2 text-slate-300">
              <span className="text-[11px] text-slate-400">Currency:</span>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white font-mono focus:outline-none focus:border-sky-400 cursor-pointer"
              >
                {AZRAQ_AGENCY_CONFIG.currencies.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code} ({c.symbol.trim()})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Core Flight Search Fields Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center relative">
            {/* Origin Airport (From) */}
            <div ref={originMenuRef} className="relative md:col-span-3">
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">From</label>
              <button
                type="button"
                onClick={() => {
                  setOpenOriginMenu(!openOriginMenu);
                  setOpenDestMenu(false);
                  setOpenTravelersMenu(false);
                }}
                className="w-full text-left p-3 rounded-xl bg-slate-900/80 hover:bg-slate-900 border border-slate-700/80 hover:border-sky-400/60 transition-all flex items-center justify-between gap-2 cursor-pointer group"
              >
                <div className="min-w-0 flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-sky-400 shrink-0" />
                  <div className="truncate">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-white tracking-tight font-mono">{origin.code}</span>
                      <span className="text-xs text-slate-300 font-semibold truncate">{origin.city}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 truncate">{origin.country}</p>
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-white shrink-0" />
              </button>

              {/* Origin Autocomplete Dropdown */}
              {openOriginMenu && (
                <div className="absolute top-full mt-2 left-0 w-full sm:w-80 bg-[#071A33] border border-slate-700 rounded-2xl shadow-2xl p-3 z-50 animate-fadeIn space-y-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={originQuery}
                      onChange={(e) => setOriginQuery(e.target.value)}
                      placeholder="Type city or airport code..."
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-sky-400"
                      autoFocus
                    />
                  </div>
                  <div className="max-h-56 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                    {filteredOrigins.map((airport) => (
                      <button
                        key={airport.code}
                        type="button"
                        onClick={() => {
                          setOrigin(airport);
                          setOpenOriginMenu(false);
                          setOriginQuery('');
                        }}
                        className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition-colors cursor-pointer ${
                          origin.code === airport.code
                            ? 'bg-blue-600/30 text-sky-300 font-bold'
                            : 'text-slate-200 hover:bg-white/10'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-sky-400 px-1.5 py-0.5 rounded bg-sky-950/60 border border-sky-800">
                            {airport.code}
                          </span>
                          <div>
                            <p className="font-semibold text-white">{airport.city}</p>
                            <p className="text-[10px] text-slate-400">{airport.name}</p>
                          </div>
                        </div>
                        <span className="text-[10px] text-slate-400">{airport.country}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Swap Button */}
            <div className="hidden md:flex md:col-span-1 justify-center pt-5">
              <button
                type="button"
                onClick={handleSwapAirports}
                title="Swap Origin and Destination"
                className="w-9 h-9 rounded-full bg-slate-800 hover:bg-[#0D6EFD] border border-slate-600 hover:border-blue-400 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-md active:rotate-180"
              >
                <ArrowRightLeft className="w-4 h-4" />
              </button>
            </div>

            {/* Destination Airport (To) */}
            <div ref={destMenuRef} className="relative md:col-span-3">
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">To</label>
              <button
                type="button"
                onClick={() => {
                  setOpenDestMenu(!openDestMenu);
                  setOpenOriginMenu(false);
                  setOpenTravelersMenu(false);
                }}
                className="w-full text-left p-3 rounded-xl bg-slate-900/80 hover:bg-slate-900 border border-slate-700/80 hover:border-sky-400/60 transition-all flex items-center justify-between gap-2 cursor-pointer group"
              >
                <div className="min-w-0 flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-teal-400 shrink-0" />
                  <div className="truncate">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-white tracking-tight font-mono">{destination.code}</span>
                      <span className="text-xs text-slate-300 font-semibold truncate">{destination.city}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 truncate">{destination.country}</p>
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-white shrink-0" />
              </button>

              {/* Destination Autocomplete Dropdown */}
              {openDestMenu && (
                <div className="absolute top-full mt-2 left-0 w-full sm:w-80 bg-[#071A33] border border-slate-700 rounded-2xl shadow-2xl p-3 z-50 animate-fadeIn space-y-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={destQuery}
                      onChange={(e) => setDestQuery(e.target.value)}
                      placeholder="Type destination city or airport..."
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-sky-400"
                      autoFocus
                    />
                  </div>
                  <div className="max-h-56 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                    {filteredDestinations.map((airport) => (
                      <button
                        key={airport.code}
                        type="button"
                        onClick={() => {
                          setDestination(airport);
                          setOpenDestMenu(false);
                          setDestQuery('');
                        }}
                        className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition-colors cursor-pointer ${
                          destination.code === airport.code
                            ? 'bg-blue-600/30 text-sky-300 font-bold'
                            : 'text-slate-200 hover:bg-white/10'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-teal-400 px-1.5 py-0.5 rounded bg-teal-950/60 border border-teal-800">
                            {airport.code}
                          </span>
                          <div>
                            <p className="font-semibold text-white">{airport.city}</p>
                            <p className="text-[10px] text-slate-400">{airport.name}</p>
                          </div>
                        </div>
                        <span className="text-[10px] text-slate-400">{airport.country}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Travel Dates (Departure & Optional Return) */}
            <div className={`relative ${tripType === 'round' ? 'md:col-span-3' : 'md:col-span-3'} grid grid-cols-2 gap-2`}>
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Departure</label>
                <div className="relative">
                  <input
                    type="date"
                    min={todayStr}
                    value={departureDate}
                    onChange={(e) => {
                      setDepartureDate(e.target.value);
                      if (returnDate < e.target.value) {
                        setReturnDate(e.target.value);
                      }
                    }}
                    className="w-full p-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-xs font-mono font-medium text-white focus:outline-none focus:border-sky-400 cursor-pointer"
                    required
                  />
                </div>
              </div>

              {tripType === 'round' ? (
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Return</label>
                  <div className="relative">
                    <input
                      type="date"
                      min={departureDate}
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-xs font-mono font-medium text-white focus:outline-none focus:border-sky-400 cursor-pointer"
                      required
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Trip</label>
                  <div className="p-2.5 rounded-xl bg-slate-900/40 border border-slate-800 text-xs text-slate-400">
                    One-Way Direct
                  </div>
                </div>
              )}
            </div>

            {/* Travelers & Cabin Class */}
            <div ref={travelersMenuRef} className="relative md:col-span-2">
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Travelers & Class</label>
              <button
                type="button"
                onClick={() => {
                  setOpenTravelersMenu(!openTravelersMenu);
                  setOpenOriginMenu(false);
                  setOpenDestMenu(false);
                }}
                className="w-full text-left p-3 rounded-xl bg-slate-900/80 hover:bg-slate-900 border border-slate-700/80 hover:border-sky-400/60 transition-all flex items-center justify-between gap-1 cursor-pointer group"
              >
                <div className="truncate">
                  <p className="text-xs font-bold text-white truncate">
                    {totalTravelers} Pax · {cabinClass.split(' ')[0]}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate">
                    {adults} Ad{children > 0 ? `, ${children} Ch` : ''}
                  </p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-white shrink-0" />
              </button>

              {/* Travelers Selection Popover */}
              {openTravelersMenu && (
                <div className="absolute top-full mt-2 right-0 w-72 bg-[#071A33] border border-slate-700 rounded-2xl shadow-2xl p-4 z-50 animate-fadeIn space-y-3.5">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-700/60">
                    <div>
                      <p className="text-xs font-bold text-white">Adults</p>
                      <p className="text-[10px] text-slate-400">Age 12+ years</p>
                    </div>
                    <div className="flex items-center gap-2 bg-slate-900 rounded-lg p-1 border border-slate-700">
                      <button
                        type="button"
                        onClick={() => setAdults(Math.max(1, adults - 1))}
                        className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center justify-center text-xs"
                      >
                        -
                      </button>
                      <span className="w-5 text-center font-bold text-xs text-white">{adults}</span>
                      <button
                        type="button"
                        onClick={() => setAdults(adults + 1)}
                        className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center justify-center text-xs"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pb-2 border-b border-slate-700/60">
                    <div>
                      <p className="text-xs font-bold text-white">Children</p>
                      <p className="text-[10px] text-slate-400">Age 2-11 years</p>
                    </div>
                    <div className="flex items-center gap-2 bg-slate-900 rounded-lg p-1 border border-slate-700">
                      <button
                        type="button"
                        onClick={() => setChildren(Math.max(0, children - 1))}
                        className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center justify-center text-xs"
                      >
                        -
                      </button>
                      <span className="w-5 text-center font-bold text-xs text-white">{children}</span>
                      <button
                        type="button"
                        onClick={() => setChildren(children + 1)}
                        className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center justify-center text-xs"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pb-2 border-b border-slate-700/60">
                    <div>
                      <p className="text-xs font-bold text-white">Infants</p>
                      <p className="text-[10px] text-slate-400">Under 2 years (lap)</p>
                    </div>
                    <div className="flex items-center gap-2 bg-slate-900 rounded-lg p-1 border border-slate-700">
                      <button
                        type="button"
                        onClick={() => setInfants(Math.max(0, infants - 1))}
                        className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center justify-center text-xs"
                      >
                        -
                      </button>
                      <span className="w-5 text-center font-bold text-xs text-white">{infants}</span>
                      <button
                        type="button"
                        onClick={() => setInfants(infants + 1)}
                        className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center justify-center text-xs"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Cabin Class Selection */}
                  <div className="space-y-1.5 pt-1">
                    <p className="text-[11px] font-bold text-slate-300">Cabin Class</p>
                    <div className="grid grid-cols-2 gap-1.5">
                      {(['Economy', 'Premium Economy', 'Business', 'First'] as const).map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setCabinClass(c)}
                          className={`py-1 px-2 rounded-lg text-xs font-semibold transition-colors ${
                            cabinClass === c
                              ? 'bg-[#0D6EFD] text-white'
                              : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-700'
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setOpenTravelersMenu(false)}
                    className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors"
                  >
                    Done
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Action Row: Search Button & Quick Route Shortcuts */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-700/60">
            {/* Quick Popular Asian Route Shortcuts for Bangladeshi travelers */}
            <div className="w-full sm:w-auto flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
                Top BD Routes:
              </span>
              {quickRouteChips.map((chip) => (
                <button
                  key={chip.to}
                  type="button"
                  onClick={() => handleQuickRouteSelect(chip.from, chip.to)}
                  className="shrink-0 px-2.5 py-1 rounded-lg bg-slate-900/80 hover:bg-blue-600/30 text-slate-300 hover:text-sky-300 border border-slate-700/80 text-[11px] font-medium transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{chip.from}➔{chip.to}</span>
                  <span className="text-sky-400 font-mono text-[10px]">{chip.tag}</span>
                </button>
              ))}
            </div>

            {/* Search Flights CTA Button */}
            <button
              type="submit"
              disabled={isSearching}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#0D6EFD] hover:bg-blue-600 text-white font-extrabold text-sm shadow-xl shadow-blue-600/30 hover:scale-[1.02] active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              {isSearching ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Scanning Airline Fares...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Search Flights</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* MODE 2: HOTELS SEARCH */}
      {activeTab === 'hotels' && (
        <div className="mt-4 space-y-4 animate-fadeIn">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-400">Destination / Property</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-teal-400 absolute left-3 top-3.5" />
                <input
                  type="text"
                  value={hotelCity}
                  onChange={(e) => setHotelCity(e.target.value)}
                  placeholder="e.g. Bangkok, Dubai, Maldives"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-sky-400"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-400">Dates</label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="text"
                  defaultValue="Nov 15 - Nov 22, 2026 (7 Nights)"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-sky-400"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-400">Guests</label>
              <div className="relative">
                <Users className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="text"
                  value={hotelGuests}
                  onChange={(e) => setHotelGuests(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-sky-400"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-700/60">
            <p className="text-xs text-slate-400">
              Vetted 4★ and 5★ luxury hotels with breakfast, airport transfers, and halal dining options.
            </p>
            <button
              type="button"
              onClick={() => onNavigateToView('packages')}
              className="px-6 py-3 rounded-xl bg-[#0D6EFD] hover:bg-blue-600 text-white font-bold text-xs transition-colors flex items-center gap-2 cursor-pointer"
            >
              <span>Explore Hotel Packages</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* MODE 3: TOUR PACKAGES */}
      {activeTab === 'packages' && (
        <div className="mt-4 space-y-4 animate-fadeIn">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-400">Select Country</label>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-sky-400"
              >
                <option value="Thailand">Thailand (Bangkok & Pattaya)</option>
                <option value="Nepal">Nepal (Kathmandu, Nagarkot & Pokhara)</option>
                <option value="Maldives">Maldives (Overwater Villa)</option>
                <option value="Malaysia">Malaysia (Kuala Lumpur & Langkawi)</option>
                <option value="Dubai">UAE / Dubai (City & Desert)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-400">Travel Style</label>
              <select className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-sky-400">
                <option>Family Holiday Package</option>
                <option>Honeymoon / Couple Escape</option>
                <option>Group / Corporate Tour</option>
                <option>Budget-Friendly Getaway</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-400">Included Services</label>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-emerald-300 font-medium">
                Hotel + Sightseeing + Transfers + Guide
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-700/60">
            <p className="text-xs text-slate-400">
              Handcrafted packages starting from BDT 14,999 with verified Dhaka desk concierge.
            </p>
            <button
              type="button"
              onClick={() => onNavigateToView('packages')}
              className="px-6 py-3 rounded-xl bg-[#0D6EFD] hover:bg-blue-600 text-white font-bold text-xs transition-colors flex items-center gap-2 cursor-pointer"
            >
              <span>View All Tour Packages</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* MODE 4: VISA ASSISTANCE */}
      {activeTab === 'visa' && (
        <div className="mt-4 space-y-4 animate-fadeIn">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-400">Destination Embassy</label>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-sky-400"
              >
                <option value="Thailand">Thailand (Tourist / Sticker Visa)</option>
                <option value="Malaysia">Malaysia (eVisa & Single Entry)</option>
                <option value="Singapore">Singapore (e-Visa via Dhaka Desk)</option>
                <option value="UAE">United Arab Emirates (30/60 Days)</option>
                <option value="Nepal">Nepal (On Arrival / Gratis Entry)</option>
                <option value="Maldives">Maldives (30-Day Tourist Entry)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-400">Passport Type</label>
              <select className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-sky-400">
                <option>Bangladeshi Regular E-Passport (Valid 6+ Mos)</option>
                <option>Bangladeshi MRP Passport</option>
                <option>Official / Diplomatic Passport</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-400">Assistance Scope</label>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-sky-300 font-medium">
                Document Checklist & Embassy Processing
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-700/60">
            <p className="text-xs text-slate-400">
              Clear document checklists, NOC templates, and application verification at Gulshan-2 desk.
            </p>
            <button
              type="button"
              onClick={() => {
                if (onOpenVisaModal) onOpenVisaModal(selectedCountry);
                else onNavigateToView('visa');
              }}
              className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors flex items-center gap-2 cursor-pointer"
            >
              <span>Check Visa Requirements</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* MODE 5: CUSTOM ITINERARY PLANNING */}
      {activeTab === 'planner' && (
        <div className="mt-4 space-y-4 animate-fadeIn">
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-400">Describe Your Dream Journey</label>
            <div className="relative">
              <Sparkles className="w-4 h-4 text-purple-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={plannerPrompt}
                onChange={(e) => setPlannerPrompt(e.target.value)}
                placeholder="e.g. 5-day luxury honeymoon in Maldives with overwater villa and scuba diving"
                className="w-full pl-10 pr-3 py-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-purple-400"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-700/60">
            <div className="flex items-center gap-2 text-xs text-purple-300">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Tailored route planning with Day-by-Day schedule and budget breakdown</span>
            </div>
            <button
              type="button"
              onClick={() => onNavigateToView('planner', { prompt: plannerPrompt })}
              className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition-colors flex items-center gap-2 cursor-pointer"
            >
              <span>Generate Itinerary</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
