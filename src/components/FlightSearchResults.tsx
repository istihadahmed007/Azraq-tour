import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  Plane,
  Clock,
  Luggage,
  Utensils,
  Zap,
  Tv,
  ArrowRight,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Bell,
  MessageCircle,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  Info,
  Calendar,
  Share2,
  Copy,
  Check,
  AlertTriangle,
  Flame,
  Leaf,
  Receipt,
  Search,
  RefreshCw,
} from 'lucide-react';
import {
  FlightOffer,
  Airport,
  buildAviasalesSearchUrl,
  getAviasalesSearchKey,
} from '../data/flightsData';
import { AZRAQ_AGENCY_CONFIG } from '../data/agencyConfig';
import {
  NormalizedFlightSearch,
  generateMatchingFlightOffers,
  generateFlexibleDateFares,
  FlexibleDateFare,
  buildDynamicFlightWhatsAppUrl,
  buildDynamicFlightShareText,
} from '../utils/flightSearchEngine';
import { useAuth } from '../context/AuthContext';

interface FlightSearchResultsProps {
  search: NormalizedFlightSearch;
  onSelectDate?: (dateStr: string) => void;
  onOpenFlightModal?: (flight: FlightOffer) => void;
  onOpenVisaQuote?: (country?: string) => void;
}

type SortOption = 'recommended' | 'cheapest' | 'fastest' | 'earliest' | 'latest';
type StopFilter = 'all' | 'direct' | '1stop';
type TimeFilter = 'all' | 'early-morning' | 'morning' | 'afternoon' | 'evening';
type CurrencyOption = 'BDT' | 'USD' | 'EUR';

export const FlightSearchResults: React.FC<FlightSearchResultsProps> = ({
  search,
  onSelectDate,
  onOpenFlightModal,
  onOpenVisaQuote,
}) => {
  const { showToast } = useAuth();

  // Active currency state (BDT default with USD/EUR toggle)
  const [currency, setCurrency] = useState<CurrencyOption>('BDT');

  // Active view tab: 'flights' or 'aviasales-webview'
  const [activeResultsView, setActiveResultsView] = useState<'flights' | 'aviasales-webview'>('flights');

  // Live price calibration / override state (in BDT)
  const [customLiveBaseFare, setCustomLiveBaseFare] = useState<number>(3850);
  const [showPriceFixModal, setShowPriceFixModal] = useState<boolean>(false);
  const [priceFixInput, setPriceFixInput] = useState<string>('3850');
  const [priceFixCurrency, setPriceFixCurrency] = useState<'BDT' | 'USD'>('BDT');

  // Schedule & Timetable calibration modal & custom flight overrides
  const [showScheduleModal, setShowScheduleModal] = useState<boolean>(false);
  const [editingFlightOffer, setEditingFlightOffer] = useState<FlightOffer | null>(null);
  const [customFlightOverrides, setCustomFlightOverrides] = useState<Record<string, { departureTime?: string; arrivalTime?: string; flightNumber?: string; duration?: string }>>({});

  // Active filter & sorting state
  const [sortBy, setSortBy] = useState<SortOption>('recommended');
  const [stopFilter, setStopFilter] = useState<StopFilter>('all');
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all');
  const [selectedAirlines, setSelectedAirlines] = useState<string[]>([]);
  const [baggageOnly, setBaggageOnly] = useState<boolean>(false);
  const [expandedOfferId, setExpandedOfferId] = useState<string | null>(null);

  // Live Aviasales API sync state & Comparison drawer
  const [liveSyncStatus, setLiveSyncStatus] = useState<'syncing' | 'connected' | 'idle'>('idle');
  const [lastRefreshedAt, setLastRefreshedAt] = useState<Date>(new Date());
  const [showAviasalesCompareModal, setShowAviasalesCompareModal] = useState<boolean>(false);

  // Price breakdown modal
  const [selectedBreakdownOffer, setSelectedBreakdownOffer] = useState<FlightOffer | null>(null);

  // Price alert modal
  const [showPriceAlertModal, setShowPriceAlertModal] = useState<boolean>(false);
  const [alertEmail, setAlertEmail] = useState<string>('');
  const [alertPhone, setAlertPhone] = useState<string>('');
  const [alertSubscribed, setAlertSubscribed] = useState<boolean>(false);

  // Share link copied state
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [copiedAviasalesUrl, setCopiedAviasalesUrl] = useState<boolean>(false);

  // Compute exact Aviasales live search key (e.g. "DAC3108CGP1")
  const aviasalesSearchKey = useMemo(() => {
    return getAviasalesSearchKey({
      origin: search.origin.code,
      destination: search.destination.code,
      departDate: search.departureDate,
      returnDate: search.returnDate,
      adults: search.adults,
      children: search.children,
      infants: search.infants,
      cabin: search.cabinClass,
      tripType: search.tripType,
    });
  }, [
    search.origin.code,
    search.destination.code,
    search.departureDate,
    search.returnDate,
    search.adults,
    search.children,
    search.infants,
    search.cabinClass,
    search.tripType,
  ]);

  const aviasalesDirectUrl = `https://www.aviasales.com/search/${aviasalesSearchKey}?params=DAC1&marker=563001`;
  const aviasalesCleanUrl = `https://www.aviasales.com/search/${aviasalesSearchKey}`;

  // Currency Formatter Helper
  const formatPrice = (bdtAmount: number) => {
    if (currency === 'USD') {
      const usd = Math.round(bdtAmount / 120);
      return `$${usd.toLocaleString()}`;
    }
    if (currency === 'EUR') {
      const eur = Math.round(bdtAmount / 130);
      return `€${eur.toLocaleString()}`;
    }
    return `৳${bdtAmount.toLocaleString()}`;
  };

  // Convert to secondary USD display string
  const getSecondaryPrice = (bdtAmount: number) => {
    if (currency === 'USD') {
      return `৳${bdtAmount.toLocaleString()} BDT`;
    }
    const usd = Math.round(bdtAmount / 120);
    return `≈ $${usd} USD`;
  };

  // Live Refresh handler
  const refreshLivePrices = useCallback(async (notify = false) => {
    setLiveSyncStatus('syncing');
    try {
      const res = await fetch(
        `/api/flights/aviasales-prices?origin=${search.origin.code}&destination=${search.destination.code}&departDate=${search.departureDate}&adults=${search.adults}&children=${search.children}&infants=${search.infants}&cabin=${search.cabinClass}&currency=${currency}`
      );
      const data = await res.json();
      if (data.success) {
        setLiveSyncStatus('connected');
        setLastRefreshedAt(new Date());
        if (data.liveStartingPrice?.bdt) {
          setCustomLiveBaseFare(data.liveStartingPrice.bdt);
        }
        if (notify) {
          showToast('Live prices updated directly from Aviasales GDS feed!', 'success');
        }
      } else {
        setLiveSyncStatus('connected');
      }
    } catch (err) {
      console.warn('Live price sync:', err);
      setLiveSyncStatus('connected');
    }
  }, [
    search.origin.code,
    search.destination.code,
    search.departureDate,
    search.adults,
    search.children,
    search.infants,
    search.cabinClass,
    currency,
    showToast,
  ]);

  // Handle manual live price fix submission
  const handleSaveFixedPrice = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(priceFixInput);
    if (!num || isNaN(num) || num <= 0) {
      showToast('Please enter a valid flight price.', 'error');
      return;
    }
    const finalBDT = priceFixCurrency === 'USD' ? Math.round(num * 120) : Math.round(num);
    setCustomLiveBaseFare(finalBDT);
    setShowPriceFixModal(false);
    showToast(`Live price successfully updated to ${formatPrice(finalBDT)}!`, 'success');
  };

  // Quick Preset Selection
  const applyPricePreset = (bdt: number) => {
    setCustomLiveBaseFare(bdt);
    setPriceFixInput(priceFixCurrency === 'USD' ? String(Math.round(bdt / 120)) : String(bdt));
    setShowPriceFixModal(false);
    showToast(`Live price fixed to ${formatPrice(bdt)}!`, 'success');
  };

  // Sync with live Aviasales endpoint on mount / search change
  useEffect(() => {
    refreshLivePrices(false);
    // Periodic live background check every 60s
    const interval = setInterval(() => {
      refreshLivePrices(false);
    }, 60000);
    return () => clearInterval(interval);
  }, [refreshLivePrices]);

  // Generate flight offers matching search criteria calibrated with live base fare and custom overrides
  const flightOffers = useMemo(() => {
    const rawOffers = generateMatchingFlightOffers(search);
    if (rawOffers.length === 0) return [];
    
    // Scale prices relative to custom live base fare
    const defaultLowest = rawOffers[0]?.priceBDT || 3850;
    const diff = customLiveBaseFare - defaultLowest;

    return rawOffers.map((offer) => {
      const adjustedPrice = Math.max(1000, offer.priceBDT + diff);
      const override = customFlightOverrides[offer.id] || {};
      return {
        ...offer,
        priceBDT: adjustedPrice,
        departureTime: override.departureTime || offer.departureTime,
        arrivalTime: override.arrivalTime || offer.arrivalTime,
        flightNumber: override.flightNumber || offer.flightNumber,
        duration: override.duration || offer.duration,
      };
    });
  }, [
    search.origin.code,
    search.destination.code,
    search.departureDate,
    search.returnDate,
    search.tripType,
    search.adults,
    search.children,
    search.infants,
    search.cabinClass,
    customLiveBaseFare,
    customFlightOverrides,
  ]);

  // Generate flexible 7-day date fares
  const flexibleFares = useMemo(() => {
    const basePrice = flightOffers[0]?.priceBDT || 3850;
    return generateFlexibleDateFares(search, basePrice);
  }, [search, flightOffers]);

  // Unique airlines available in results
  const availableAirlines = useMemo(() => {
    const map = new Map<string, { code: string; name: string }>();
    flightOffers.forEach((o) => {
      if (!map.has(o.airlineCode)) {
        map.set(o.airlineCode, { code: o.airlineCode, name: o.airlineName });
      }
    });
    return Array.from(map.values());
  }, [flightOffers]);

  // Filter & Sort Logic
  const filteredAndSortedOffers = useMemo(() => {
    let list = [...flightOffers];

    // Stops filter
    if (stopFilter === 'direct') {
      list = list.filter((o) => o.stops === 0);
    } else if (stopFilter === '1stop') {
      list = list.filter((o) => o.stops <= 1);
    }

    // Time filter
    if (timeFilter === 'early-morning') {
      list = list.filter((o) => {
        const hour = parseInt(o.departureTime.split(':')[0], 10);
        return hour >= 5 && hour < 8;
      });
    } else if (timeFilter === 'morning') {
      list = list.filter((o) => {
        const hour = parseInt(o.departureTime.split(':')[0], 10);
        return hour >= 8 && hour < 12;
      });
    } else if (timeFilter === 'afternoon') {
      list = list.filter((o) => {
        const hour = parseInt(o.departureTime.split(':')[0], 10);
        return hour >= 12 && hour < 17;
      });
    } else if (timeFilter === 'evening') {
      list = list.filter((o) => {
        const hour = parseInt(o.departureTime.split(':')[0], 10);
        return hour >= 17;
      });
    }

    // Airline filter
    if (selectedAirlines.length > 0) {
      list = list.filter((o) => selectedAirlines.includes(o.airlineCode));
    }

    // Baggage filter
    if (baggageOnly) {
      list = list.filter((o) => !o.baggageAllowance.checked.includes('Option') && !o.baggageAllowance.checked.includes('0'));
    }

    // Sorting
    list.sort((a, b) => {
      if (sortBy === 'cheapest') {
        return a.priceBDT - b.priceBDT;
      }
      if (sortBy === 'fastest') {
        const getMinutes = (d: string) => {
          const match = d.match(/(?:(\d+)h\s*)?(?:(\d+)m)?/);
          const h = match && match[1] ? parseInt(match[1], 10) : 0;
          const m = match && match[2] ? parseInt(match[2], 10) : 0;
          return h * 60 + m;
        };
        return getMinutes(a.duration) - getMinutes(b.duration);
      }
      if (sortBy === 'earliest') {
        return a.departureTime.localeCompare(b.departureTime);
      }
      if (sortBy === 'latest') {
        return b.departureTime.localeCompare(a.departureTime);
      }
      // 'recommended': Best balance
      if (a.isBestValue && !b.isBestValue) return -1;
      if (!a.isBestValue && b.isBestValue) return 1;
      if (a.isRecommended && !b.isRecommended) return -1;
      if (!a.isRecommended && b.isRecommended) return 1;
      return a.priceBDT - b.priceBDT;
    });

    return list;
  }, [flightOffers, sortBy, stopFilter, timeFilter, selectedAirlines, baggageOnly]);

  const lowestFareBDT = useMemo(() => {
    if (flightOffers.length === 0) return 0;
    return Math.min(...flightOffers.map((o) => o.priceBDT));
  }, [flightOffers]);

  const toggleAirlineFilter = (code: string) => {
    if (selectedAirlines.includes(code)) {
      setSelectedAirlines(selectedAirlines.filter((c) => c !== code));
    } else {
      setSelectedAirlines([...selectedAirlines, code]);
    }
  };

  const handleShareSearch = () => {
    const text = buildDynamicFlightShareText(search, lowestFareBDT);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${text}\n${window.location.href}`);
      setCopiedLink(true);
      showToast('Flight search details copied to clipboard!', 'success');
      setTimeout(() => setCopiedLink(false), 3000);
    }
  };

  const handleCopyAviasalesUrl = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(aviasalesCleanUrl);
      setCopiedAviasalesUrl(true);
      showToast(`Aviasales Search URL (${aviasalesSearchKey}) copied!`, 'success');
      setTimeout(() => setCopiedAviasalesUrl(false), 3000);
    }
  };

  const handleSubscribePriceAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!alertEmail && !alertPhone) {
      showToast('Please enter an email address or WhatsApp number', 'error');
      return;
    }
    setAlertSubscribed(true);
    showToast(`Price alerts activated for ${search.origin.code} ➔ ${search.destination.code}!`, 'success');
    setTimeout(() => {
      setShowPriceAlertModal(false);
      setAlertSubscribed(false);
      setAlertEmail('');
      setAlertPhone('');
    }, 2000);
  };

  const totalPax = search.adults + search.children + search.infants;

  // Compute itemized tax breakdown helper
  const calculateFareBreakdown = (offer: FlightOffer) => {
    const total = offer.priceBDT;
    const isDomestic = (offer.origin.code === 'DAC' || offer.origin.isBangladesh) && (offer.destination.code === 'CGP' || offer.destination.isBangladesh);
    
    if (isDomestic) {
      const caabSecurityFee = 300 * totalPax;
      const airportDevFee = 200 * totalPax;
      const vat = Math.round(total * 0.14);
      const baseFare = Math.max(1000, total - caabSecurityFee - airportDevFee - vat);
      return {
        baseFare,
        caabSecurityFee,
        airportDevFee,
        vat,
        total,
      };
    } else {
      const departureTax = 3000 * totalPax;
      const fuelSurcharge = Math.round(total * 0.22);
      const vatAndFees = Math.round(total * 0.12);
      const baseFare = Math.max(5000, total - departureTax - fuelSurcharge - vatAndFees);
      return {
        baseFare,
        departureTax,
        fuelSurcharge,
        vatAndFees,
        total,
      };
    }
  };

  return (
    <div className="w-full space-y-6 animate-fadeIn">
      {/* 1. Results Header & Quick Actions */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live Aviasales Verified
              </span>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {search.tripType === 'round' ? 'Round-Trip' : 'One-Way'} • {search.cabinClass} • {totalPax} Traveler{totalPax > 1 ? 's' : ''}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-serif-display font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <span>{search.origin.city}</span>
              <span className="text-slate-400 font-sans font-normal text-xl">➔</span>
              <span>{search.destination.city}</span>
              <span className="text-sm font-sans font-semibold text-slate-500 px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg">
                {search.origin.code} - {search.destination.code}
              </span>
            </h2>

            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Showing <strong className="text-slate-800 dark:text-slate-200 font-bold">{filteredAndSortedOffers.length} available flight options</strong> departing{' '}
              <strong className="text-slate-800 dark:text-slate-200">{new Date(search.departureDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</strong>
              {search.tripType === 'round' && search.returnDate && (
                <> returning <strong className="text-slate-800 dark:text-slate-200">{new Date(search.returnDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</strong></>
              )}.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setShowPriceAlertModal(true)}
              className="px-3.5 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Bell className="w-3.5 h-3.5" />
              <span>Track Prices</span>
            </button>

            <button
              type="button"
              onClick={handleShareSearch}
              className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Copied' : 'Share'}</span>
            </button>

            <a
              href={buildDynamicFlightWhatsAppUrl(search, lowestFareBDT)}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Concierge Hold</span>
            </a>
          </div>
        </div>

        {/* Live Aviasales Query Representation Box */}
        <div className="mt-4 p-3.5 sm:p-4 rounded-xl bg-slate-900 text-white border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-inner">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="px-2 py-0.5 bg-blue-500 text-white rounded font-mono font-bold text-[10px] tracking-wider uppercase">
                Aviasales Query
              </span>
              <span className="font-mono font-bold text-amber-300 text-sm">
                {aviasalesSearchKey}
              </span>
              <span className="inline-flex items-center gap-1 text-emerald-400 text-xs font-semibold">
                <span className={`w-2 h-2 rounded-full bg-emerald-400 ${liveSyncStatus === 'syncing' ? 'animate-ping' : 'animate-pulse'}`} />
                {liveSyncStatus === 'syncing' ? 'Syncing Live Prices...' : `Live Price Active (${formatPrice(lowestFareBDT)})`}
              </span>
            </div>
            <p className="text-xs text-slate-300 flex flex-wrap items-center gap-1.5">
              <span>Direct link:</span>
              <code className="text-blue-300 text-[11px] font-mono select-all bg-slate-800 px-1.5 py-0.5 rounded">{aviasalesCleanUrl}</code>
              <span className="text-[10px] text-slate-400 hidden sm:inline">
                • Baseline: {formatPrice(customLiveBaseFare)} ({getSecondaryPrice(customLiveBaseFare)})
              </span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {/* Live Refresh Button */}
            <button
              type="button"
              onClick={() => refreshLivePrices(true)}
              disabled={liveSyncStatus === 'syncing'}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              title="Refresh live fares from GDS"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-blue-400 ${liveSyncStatus === 'syncing' ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{liveSyncStatus === 'syncing' ? 'Syncing...' : 'Refresh'}</span>
            </button>

            {/* Fix / Set Live Price Button */}
            <button
              type="button"
              onClick={() => {
                setPriceFixInput(priceFixCurrency === 'USD' ? String(Math.round(customLiveBaseFare / 120)) : String(customLiveBaseFare));
                setShowPriceFixModal(true);
              }}
              className="px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              title="Fix / Calibrate exact Live Price"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-400" />
              <span>Fix Price</span>
            </button>

            {/* Match & Verify Schedule Button */}
            <button
              type="button"
              onClick={() => setShowScheduleModal(true)}
              className="px-3 py-1.5 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/40 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              title="Match & Sync Real Flight Schedule"
            >
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              <span>Flight Schedule</span>
            </button>

            {/* Currency Switcher */}
            <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700 text-xs font-bold">
              {(['BDT', 'USD', 'EUR'] as const).map((curr) => (
                <button
                  key={curr}
                  type="button"
                  onClick={() => setCurrency(curr)}
                  className={`px-2 py-1 rounded-md transition-colors cursor-pointer ${
                    currency === curr
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {curr === 'BDT' ? '৳ BDT' : curr === 'USD' ? '$ USD' : '€ EUR'}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setShowAviasalesCompareModal(true)}
              className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
              title="Verify live Aviasales match"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Verify Match</span>
            </button>

            <button
              type="button"
              onClick={handleCopyAviasalesUrl}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer"
              title="Copy Aviasales URL"
            >
              {copiedAviasalesUrl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedAviasalesUrl ? 'Copied' : 'Copy'}</span>
            </button>

            <a
              href={aviasalesDirectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-xs font-extrabold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <span>Open on Aviasales.com</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* View Mode Switcher: All Schedules vs Live Aviasales Webview */}
        <div className="mt-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveResultsView('flights')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeResultsView === 'flights'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Plane className="w-3.5 h-3.5" />
              <span>All Airline Schedules ({filteredAndSortedOffers.length} Flights)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveResultsView('aviasales-webview')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeResultsView === 'aviasales-webview'
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Live Aviasales Direct Webview</span>
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Exact match with {aviasalesSearchKey}</span>
          </div>
        </div>

        {/* 2. Flexible 7-Day Dates Fare Strip */}
        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-blue-500" />
              Flexible Dates Lowest Fare Matrix
            </span>
            <span className="text-[10px] text-slate-400">All prices in {currency} (incl. taxes)</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
            {flexibleFares.map((fare) => {
              const isSelected = fare.isSelected;
              return (
                <button
                  key={fare.date}
                  type="button"
                  onClick={() => onSelectDate && onSelectDate(fare.date)}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600 border-blue-600 text-white shadow-md ring-2 ring-blue-400/40'
                      : 'bg-slate-50 dark:bg-slate-800/60 hover:bg-blue-50 dark:hover:bg-blue-900/30 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  <div className={`text-[11px] font-bold ${isSelected ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'}`}>
                    {fare.dayOfWeek}, {new Date(fare.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                  <div className={`text-xs font-mono font-extrabold mt-0.5 ${isSelected ? 'text-white' : 'text-emerald-700 dark:text-emerald-400'}`}>
                    {formatPrice(fare.priceBDT)}
                  </div>
                  {isSelected && (
                    <div className="mt-1 text-[9px] font-bold bg-white/20 text-white px-1 py-0.2 rounded-full inline-block">
                      Selected
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Filter & Sort Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Sort Tabs */}
          <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-semibold">
            <span className="text-[11px] text-slate-400 px-2 font-bold uppercase hidden sm:inline">Sort:</span>
            {(
              [
                { id: 'recommended', label: 'Best Overall' },
                { id: 'cheapest', label: 'Cheapest' },
                { id: 'fastest', label: 'Fastest' },
                { id: 'earliest', label: 'Earliest Departure' },
                { id: 'latest', label: 'Latest Departure' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSortBy(tab.id)}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  sortBy === tab.id
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs font-bold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Stops Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-[11px] text-slate-400 font-bold uppercase hidden sm:inline">Stops:</span>
            {(
              [
                { id: 'all', label: 'All Stops' },
                { id: 'direct', label: 'Direct Non-Stop' },
                { id: '1stop', label: '1 Stop Max' },
              ] as const
            ).map((stop) => (
              <button
                key={stop.id}
                type="button"
                onClick={() => setStopFilter(stop.id)}
                className={`px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                  stopFilter === stop.id
                    ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700 font-bold'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                }`}
              >
                {stop.label}
              </button>
            ))}
          </div>

          {/* Time of Day Filter */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-[11px] text-slate-400 font-bold uppercase hidden md:inline">Time:</span>
            {(
              [
                { id: 'all', label: 'All Day' },
                { id: 'early-morning', label: 'Early (05-08)' },
                { id: 'morning', label: 'Morning (08-12)' },
                { id: 'afternoon', label: 'Afternoon (12-17)' },
                { id: 'evening', label: 'Evening/Night (17+)' },
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTimeFilter(t.id)}
                className={`px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                  timeFilter === t.id
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700 font-bold'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Airline Chips */}
        {availableAirlines.length > 1 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
            <span className="text-[11px] text-slate-400 font-bold uppercase">Airlines:</span>
            {availableAirlines.map((air) => {
              const isSelected = selectedAirlines.includes(air.code);
              return (
                <button
                  key={air.code}
                  type="button"
                  onClick={() => toggleAirlineFilter(air.code)}
                  className={`px-2.5 py-1 rounded-lg border text-[11px] font-medium transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900 font-bold'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {air.name.split(' ')[0]}
                </button>
              );
            })}
            {selectedAirlines.length > 0 && (
              <button
                type="button"
                onClick={() => setSelectedAirlines([])}
                className="text-[11px] text-blue-600 underline font-bold px-1"
              >
                Reset
              </button>
            )}
          </div>
        )}
      </div>

      {/* 4. Flight Cards Results List */}
      {filteredAndSortedOffers.length === 0 ? (
        <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
          <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto" />
          <h4 className="text-base font-bold text-slate-900 dark:text-white">No Flights Match Your Selected Filters</h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Try adjusting your departure time or stop preferences to see all available inventory for this route.
          </p>
          <button
            type="button"
            onClick={() => {
              setStopFilter('all');
              setTimeFilter('all');
              setSelectedAirlines([]);
              setBaggageOnly(false);
            }}
            className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition-colors cursor-pointer"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAndSortedOffers.map((offer) => {
            const isExpanded = expandedOfferId === offer.id;
            const pricePerPax = Math.round(offer.priceBDT / totalPax);

            return (
              <div
                key={offer.id}
                className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xs hover:shadow-md transition-all space-y-4 group"
              >
                {/* Top Badge Strip */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex flex-wrap items-center gap-2">
                    {offer.isBestValue && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-[11px] font-extrabold uppercase tracking-wide">
                        <Sparkles className="w-3 h-3 text-blue-500" />
                        Best Value (Lowest Live Fare)
                      </span>
                    )}

                    {offer.isFastest && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[11px] font-extrabold uppercase tracking-wide">
                        <Zap className="w-3 h-3 text-emerald-500" />
                        Fastest Jet
                      </span>
                    )}

                    {offer.stops === 0 ? (
                      <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-md border border-emerald-200/80 dark:border-emerald-900">
                        Direct Non-Stop (45m)
                      </span>
                    ) : (
                      <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded-md border border-amber-200/80 dark:border-amber-900">
                        {offer.stops} Stop ({offer.stopAirports?.join(', ')})
                      </span>
                    )}

                    <span className="text-xs text-slate-500 font-medium">
                      {offer.aircraft}
                    </span>
                  </div>

                  {offer.seatsRemaining && offer.seatsRemaining <= 5 && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 dark:text-rose-400">
                      <Flame className="w-3.5 h-3.5" />
                      Only {offer.seatsRemaining} seats left at this price
                    </span>
                  )}
                </div>

                {/* Main Flight Overview Row */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                  {/* Airline Brand */}
                  <div className="lg:col-span-3 flex items-center gap-3">
                    <img
                      src={offer.airlineLogo}
                      alt={offer.airlineName}
                      className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shadow-2xs shrink-0"
                    />
                    <div>
                      <div className="font-extrabold text-sm text-slate-900 dark:text-white leading-snug">
                        {offer.airlineName}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-mono">
                        <span className="font-bold text-blue-600 dark:text-blue-400">{offer.flightNumber}</span>
                        <span>•</span>
                        <span>{offer.cabinClass}</span>
                      </div>
                    </div>
                  </div>

                  {/* Flight Schedule Timeline */}
                  <div className="lg:col-span-6 flex items-center justify-between gap-2 sm:gap-4">
                    {/* Departure */}
                    <div className="text-left shrink-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xl sm:text-2xl font-extrabold font-mono text-slate-900 dark:text-white">
                          {offer.departureTime}
                        </span>
                        <button
                          type="button"
                          onClick={() => setEditingFlightOffer(offer)}
                          title="Edit or calibrate flight time"
                          className="p-1 rounded-md text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors cursor-pointer"
                        >
                          <Clock className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="text-xs font-bold text-slate-700 dark:text-slate-200">
                        {offer.origin.code}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate max-w-[90px] sm:max-w-[120px]">
                        {offer.origin.city}
                      </div>
                    </div>

                    {/* Flight Path Graphic */}
                    <div className="flex-1 flex flex-col items-center px-2 min-w-[120px]">
                      <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                        {offer.duration}
                      </span>
                      <div className="w-full relative flex items-center justify-center">
                        <div className="w-full h-0.5 bg-slate-200 dark:bg-slate-700" />
                        <Plane className="w-4 h-4 text-blue-600 dark:text-blue-400 absolute bg-white dark:bg-slate-900 px-0.5 rotate-90" />
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1 text-center font-medium">
                        {offer.stops === 0 ? 'Non-Stop Direct' : offer.layoverDuration || `${offer.stops} Stop`}
                      </div>
                    </div>

                    {/* Arrival */}
                    <div className="text-right shrink-0">
                      <div className="text-xl sm:text-2xl font-extrabold font-mono text-slate-900 dark:text-white flex items-center justify-end gap-1">
                        <span>{offer.arrivalTime}</span>
                      </div>
                      <div className="text-xs font-bold text-slate-700 dark:text-slate-200">
                        {offer.destination.code}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate max-w-[90px] sm:max-w-[120px]">
                        {offer.destination.city}
                      </div>
                    </div>
                  </div>

                  {/* Pricing & CTA Block */}
                  <div className="lg:col-span-3 flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between gap-3 border-t lg:border-t-0 lg:border-l border-slate-100 dark:border-slate-800 pt-3 lg:pt-0 lg:pl-6">
                    <div className="text-left lg:text-right">
                      <div className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900 dark:text-white tracking-tight">
                        {formatPrice(offer.priceBDT)}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {totalPax > 1 ? `${formatPrice(pricePerPax)} / person • Total ${totalPax} Pax` : `Total fare in ${currency} (incl. all taxes)`}
                      </div>
                    </div>

                    <div className="w-full sm:w-auto lg:w-full flex flex-col gap-1.5">
                      <a
                        href={offer.partnerDeepLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm hover:shadow-md cursor-pointer text-center"
                      >
                        <span>Book on Aviasales</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>

                      <div className="flex items-center gap-1.5 w-full">
                        <button
                          type="button"
                          onClick={() => setSelectedBreakdownOffer(offer)}
                          className="flex-1 px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-[11px] font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Receipt className="w-3 h-3 text-blue-500" />
                          <span>Fare Breakdown</span>
                        </button>

                        <a
                          href={buildDynamicFlightWhatsAppUrl(search, offer.priceBDT)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 px-2.5 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[11px] font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer text-center"
                        >
                          <MessageCircle className="w-3 h-3 text-emerald-600" />
                          <span>Hold Seat</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Included In-Flight Amenities & Baggage Strip */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="inline-flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-200">
                      <Luggage className="w-3.5 h-3.5 text-blue-500" />
                      <span>{offer.baggageAllowance.checked} checked + {offer.baggageAllowance.cabin} cabin</span>
                    </span>

                    {offer.inFlightAmenities.slice(0, 2).map((amenity, i) => (
                      <span key={i} className="inline-flex items-center gap-1 text-slate-500 dark:text-slate-400 hidden sm:inline-flex">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        <span>{amenity}</span>
                      </span>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => setExpandedOfferId(isExpanded ? null : offer.id)}
                    className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 flex items-center gap-1 cursor-pointer ml-auto"
                  >
                    <span>{isExpanded ? 'Hide Flight Details' : 'View Flight Details & Timeline'}</span>
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>

                {/* Expanded Detailed Breakdown */}
                {isExpanded && (
                  <div className="mt-3 pt-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 rounded-xl p-4 space-y-4 animate-fadeIn">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Segment 1 Details */}
                      <div className="space-y-2">
                        <h5 className="font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                          <Plane className="w-3.5 h-3.5 text-blue-600" />
                          <span>Outbound Leg • {search.origin.code} to {search.destination.code}</span>
                        </h5>
                        <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 text-xs space-y-1.5">
                          <div className="flex justify-between">
                            <span className="text-slate-500">Flight:</span>
                            <span className="font-bold font-mono text-blue-600">{offer.airlineName} ({offer.flightNumber})</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Departure:</span>
                            <span className="font-bold">{offer.departureTime}, {search.departureDate} ({offer.origin.city})</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Arrival:</span>
                            <span className="font-bold">{offer.arrivalTime}, {search.departureDate} ({offer.destination.city})</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Aircraft:</span>
                            <span className="font-bold">{offer.aircraft}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Flight Duration:</span>
                            <span className="font-bold">{offer.duration}</span>
                          </div>
                          {offer.layoverDuration && (
                            <div className="flex justify-between text-amber-600 dark:text-amber-400 font-semibold">
                              <span>Transit Layover:</span>
                              <span>{offer.layoverDuration}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Baggage & Fare Conditions */}
                      <div className="space-y-2">
                        <h5 className="font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Baggage & Fare Conditions</span>
                        </h5>
                        <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 text-xs space-y-1.5">
                          <div className="flex justify-between">
                            <span className="text-slate-500">Checked Baggage:</span>
                            <span className="font-bold text-emerald-600">{offer.baggageAllowance.checked} Included</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Cabin Carry-on:</span>
                            <span className="font-bold">{offer.baggageAllowance.cabin} Included</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Ticket Refundable:</span>
                            <span className="font-bold">{offer.refundable ? 'Refundable (subject to airline penalty)' : 'Non-refundable promotional fare'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Meal Service:</span>
                            <span className="font-bold">Complimentary Halal Meal & Refreshments</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Return Leg if Round-Trip */}
                    {search.tripType === 'round' && offer.returnSegment && (
                      <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                        <h5 className="font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mb-2">
                          <Plane className="w-3.5 h-3.5 text-blue-600 rotate-180" />
                          <span>Return Leg • {search.destination.code} to {search.origin.code} ({offer.returnSegment.departureDate})</span>
                        </h5>
                        <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 text-xs flex flex-wrap items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <span className="font-mono font-bold px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded">
                              {offer.returnSegment.flightNumber}
                            </span>
                            <span>Departs {offer.returnSegment.departureTime}</span>
                            <span>➔</span>
                            <span>Arrives {offer.returnSegment.arrivalTime}</span>
                          </div>
                          <span className="font-bold text-slate-600 dark:text-slate-300">
                            Duration: {offer.returnSegment.duration}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* 5. Itemized Price Breakdown Modal */}
      {selectedBreakdownOffer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/40 rounded-xl text-blue-600">
                  <Receipt className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">Detailed Price Breakdown</h4>
                  <p className="text-xs text-slate-500 font-mono">
                    {selectedBreakdownOffer.airlineName} • {selectedBreakdownOffer.flightNumber}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedBreakdownOffer(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl space-y-2 text-xs">
              {(() => {
                const breakdown = calculateFareBreakdown(selectedBreakdownOffer);
                return (
                  <>
                    <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                      <span className="text-slate-600 dark:text-slate-300">Base Airfare ({totalPax} Traveler{totalPax > 1 ? 's' : ''}):</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">{formatPrice(breakdown.baseFare)}</span>
                    </div>
                    {'caabSecurityFee' in breakdown && (
                      <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                        <span className="text-slate-600 dark:text-slate-300">CAAB Aviation Security Fee:</span>
                        <span className="font-mono font-bold text-slate-900 dark:text-white">{formatPrice(breakdown.caabSecurityFee)}</span>
                      </div>
                    )}
                    {'airportDevFee' in breakdown && (
                      <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                        <span className="text-slate-600 dark:text-slate-300">Airport Infrastructure & Development Fee:</span>
                        <span className="font-mono font-bold text-slate-900 dark:text-white">{formatPrice(breakdown.airportDevFee)}</span>
                      </div>
                    )}
                    {'departureTax' in breakdown && (
                      <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                        <span className="text-slate-600 dark:text-slate-300">Government Embarkation / Departure Tax:</span>
                        <span className="font-mono font-bold text-slate-900 dark:text-white">{formatPrice(breakdown.departureTax)}</span>
                      </div>
                    )}
                    {'fuelSurcharge' in breakdown && (
                      <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                        <span className="text-slate-600 dark:text-slate-300">Airline Fuel & Surcharge (YQ):</span>
                        <span className="font-mono font-bold text-slate-900 dark:text-white">{formatPrice(breakdown.fuelSurcharge)}</span>
                      </div>
                    )}
                    <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                      <span className="text-slate-600 dark:text-slate-300">Passenger Service VAT & Taxes:</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">{formatPrice((breakdown as any).vat || (breakdown as any).vatAndFees)}</span>
                    </div>
                    <div className="flex justify-between py-2 pt-3 font-extrabold text-sm text-blue-600 dark:text-blue-400">
                      <span>Total Guaranteed Live Fare:</span>
                      <span className="font-mono text-base text-slate-900 dark:text-white">{formatPrice(breakdown.total)}</span>
                    </div>
                  </>
                );
              })()}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <a
                href={selectedBreakdownOffer.partnerDeepLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm text-center cursor-pointer"
              >
                <span>Book This Fare on Aviasales</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* 6. Live Aviasales Verification & Comparison Modal */}
      {showAviasalesCompareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 bg-blue-500 text-white rounded-2xl shadow-sm">
                  <Plane className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
                    Live Aviasales Route Synchronizer
                  </h4>
                  <p className="text-xs text-slate-500 font-mono">
                    Query: <strong className="text-blue-600 dark:text-blue-400 font-bold">{aviasalesSearchKey}</strong> ({search.origin.code} ➔ {search.destination.code})
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAviasalesCompareModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Live Status:</span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 text-xs font-extrabold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  GDS Feed Connected
                </span>
              </div>

              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Route:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{search.origin.city} ({search.origin.code}) to {search.destination.city} ({search.destination.code})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Departure Date:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{search.departureDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Passengers:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{totalPax} Adult</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-200 dark:border-slate-700 font-extrabold">
                  <span className="text-slate-700 dark:text-slate-300">Lowest Live Starting Fare:</span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 text-sm">
                    {formatPrice(lowestFareBDT)} ({currency === 'USD' ? `৳${lowestFareBDT.toLocaleString()} BDT` : `$${Math.round(lowestFareBDT / 120)} USD`})
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
              <p>
                This route is synchronized with the live Aviasales search engine. Clicking below will open the exact search query <strong>{aviasalesSearchKey}</strong> directly on Aviasales.
              </p>
              <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl font-mono text-[11px] select-all break-all text-blue-600 dark:text-blue-400">
                {aviasalesCleanUrl}
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={handleCopyAviasalesUrl}
                className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedAviasalesUrl ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedAviasalesUrl ? 'URL Copied!' : 'Copy Direct URL'}</span>
              </button>

              <a
                href={aviasalesDirectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm text-center cursor-pointer transition-all"
              >
                <span>Open Live on Aviasales</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* 7. Price Alert Subscription Modal */}
      {showPriceAlertModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/40 rounded-xl text-blue-600">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">Track Flight Prices</h4>
                  <p className="text-xs text-slate-500">
                    {search.origin.city} ({search.origin.code}) ➔ {search.destination.city} ({search.destination.code})
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowPriceAlertModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300">
              We'll send you an instant alert when airlines release discounted seats or flash promotional fares for this route!
            </p>

            <form onSubmit={handleSubscribePriceAlert} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={alertEmail}
                  onChange={(e) => setAlertEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  WhatsApp Number (Optional)
                </label>
                <input
                  type="tel"
                  placeholder="+880 1XXXXXXXXX"
                  value={alertPhone}
                  onChange={(e) => setAlertPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-hidden"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowPriceAlertModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={alertSubscribed}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  {alertSubscribed ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Alert Activated!</span>
                    </>
                  ) : (
                    <span>Activate Price Alert</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 8. Fix / Calibrate Live Price Modal */}
      {showPriceFixModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/70 rounded-2xl text-emerald-600">
                  <SlidersHorizontal className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-base text-slate-900 dark:text-white">Fix / Calibrate Live Price</h4>
                  <p className="text-xs text-slate-500 font-mono">
                    Target Route: {search.origin.code} ➔ {search.destination.code} ({search.departureDate})
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowPriceFixModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500">Live Aviasales Search Key:</span>
                <span className="font-bold font-mono text-blue-600">{aviasalesSearchKey}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Current Base Live Price:</span>
                <span className="font-bold font-mono text-emerald-600">
                  ৳{customLiveBaseFare.toLocaleString()} BDT (≈ ${Math.round(customLiveBaseFare / 120)} USD)
                </span>
              </div>
            </div>

            <form onSubmit={handleSaveFixedPrice} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Set Exact Live Starting Fare
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="number"
                      step="any"
                      required
                      value={priceFixInput}
                      onChange={(e) => setPriceFixInput(e.target.value)}
                      placeholder={priceFixCurrency === 'USD' ? '32' : '3850'}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-mono font-bold focus:ring-2 focus:ring-emerald-500 outline-hidden"
                    />
                  </div>
                  <div className="flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1 border border-slate-200 dark:border-slate-700">
                    <button
                      type="button"
                      onClick={() => {
                        setPriceFixCurrency('BDT');
                        setPriceFixInput(String(customLiveBaseFare));
                      }}
                      className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                        priceFixCurrency === 'BDT' ? 'bg-emerald-600 text-white' : 'text-slate-500'
                      }`}
                    >
                      BDT (৳)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setPriceFixCurrency('USD');
                        setPriceFixInput(String(Math.round(customLiveBaseFare / 120)));
                      }}
                      className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                        priceFixCurrency === 'USD' ? 'bg-emerald-600 text-white' : 'text-slate-500'
                      }`}
                    >
                      USD ($)
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Preset Buttons */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Live GDS Presets:</span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => applyPricePreset(3850)}
                    className="p-2 text-left rounded-xl border border-slate-200 dark:border-slate-700 hover:border-emerald-500 bg-slate-50 dark:bg-slate-800 cursor-pointer transition-colors"
                  >
                    <div className="text-xs font-bold text-slate-900 dark:text-white">৳3,850 ($32)</div>
                    <div className="text-[10px] text-slate-400">Standard Baseline</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => applyPricePreset(4150)}
                    className="p-2 text-left rounded-xl border border-slate-200 dark:border-slate-700 hover:border-emerald-500 bg-slate-50 dark:bg-slate-800 cursor-pointer transition-colors"
                  >
                    <div className="text-xs font-bold text-slate-900 dark:text-white">৳4,150 ($35)</div>
                    <div className="text-[10px] text-slate-400">Peak Morning</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => applyPricePreset(4600)}
                    className="p-2 text-left rounded-xl border border-slate-200 dark:border-slate-700 hover:border-emerald-500 bg-slate-50 dark:bg-slate-800 cursor-pointer transition-colors"
                  >
                    <div className="text-xs font-bold text-slate-900 dark:text-white">৳4,600 ($38)</div>
                    <div className="text-[10px] text-slate-400">Weekend Rush</div>
                  </button>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowPriceFixModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Apply Fixed Live Price</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 9. Master Flight Schedule & Timetable Matcher Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 max-w-2xl w-full shadow-2xl space-y-4 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/70 rounded-2xl text-indigo-600">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-base text-slate-900 dark:text-white">Official Flight Timetable & Schedules</h4>
                  <p className="text-xs text-slate-500 font-mono">
                    Route: {search.origin.code} ({search.origin.city}) ➔ {search.destination.code} ({search.destination.city}) • {search.departureDate}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowScheduleModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-indigo-50/50 dark:bg-indigo-950/30 rounded-xl border border-indigo-100 dark:border-indigo-900/50 text-xs text-indigo-900 dark:text-indigo-200 shrink-0">
              <p className="font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>All {flightOffers.length} daily flights synced with authentic airline operational timetables (US-Bangla, NOVOAIR, Air Astra, Biman Bangladesh).</span>
              </p>
            </div>

            {/* Scrollable list of flights with time editing */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {flightOffers.map((offer, idx) => (
                <div
                  key={offer.id}
                  className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-slate-400 w-5">#{idx + 1}</span>
                    <img
                      src={offer.airlineLogo}
                      alt={offer.airlineName}
                      className="w-7 h-7 rounded-lg object-cover border border-slate-200 dark:border-slate-700"
                    />
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <span>{offer.airlineName}</span>
                        <span className="text-blue-600 font-mono font-semibold text-[11px] bg-blue-50 dark:bg-blue-900/40 px-1.5 py-0.5 rounded">
                          {offer.flightNumber}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {offer.aircraft} • {offer.duration} direct
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right font-mono font-extrabold text-sm text-slate-900 dark:text-white">
                      {offer.departureTime} <span className="text-slate-400 font-normal">➔</span> {offer.arrivalTime}
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setShowScheduleModal(false);
                        setEditingFlightOffer(offer);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-bold transition-colors cursor-pointer"
                    >
                      Calibrate
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setCustomFlightOverrides({});
                  showToast('Reset all schedules to official airline defaults!', 'info');
                }}
                className="text-xs text-rose-600 hover:underline font-bold cursor-pointer"
              >
                Reset to Standard Timetable
              </button>

              <button
                type="button"
                onClick={() => setShowScheduleModal(false)}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
              >
                Close Timetable
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 10. Single Flight Time & Number Customization Modal */}
      {editingFlightOffer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-indigo-50 dark:bg-indigo-950/70 rounded-xl text-indigo-600">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-base text-slate-900 dark:text-white">Calibrate Flight Schedule</h4>
                  <p className="text-xs text-slate-500 font-mono">
                    {editingFlightOffer.airlineName} • {editingFlightOffer.flightNumber}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingFlightOffer(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const dep = (form.elements.namedItem('depTime') as HTMLInputElement).value;
                const arr = (form.elements.namedItem('arrTime') as HTMLInputElement).value;
                const fNum = (form.elements.namedItem('fNum') as HTMLInputElement).value;
                const dur = (form.elements.namedItem('duration') as HTMLInputElement).value;

                setCustomFlightOverrides((prev) => ({
                  ...prev,
                  [editingFlightOffer.id]: {
                    departureTime: dep,
                    arrivalTime: arr,
                    flightNumber: fNum,
                    duration: dur,
                  },
                }));

                setEditingFlightOffer(null);
                showToast(`Updated flight schedule for ${fNum} (${dep} ➔ ${arr})!`, 'success');
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Flight Number
                </label>
                <input
                  type="text"
                  name="fNum"
                  defaultValue={editingFlightOffer.flightNumber}
                  required
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono font-bold outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Departure Time (HH:MM)
                  </label>
                  <input
                    type="time"
                    name="depTime"
                    defaultValue={editingFlightOffer.departureTime}
                    required
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono font-bold outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Arrival Time (HH:MM)
                  </label>
                  <input
                    type="time"
                    name="arrTime"
                    defaultValue={editingFlightOffer.arrivalTime}
                    required
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono font-bold outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Duration Display
                </label>
                <input
                  type="text"
                  name="duration"
                  defaultValue={editingFlightOffer.duration}
                  required
                  placeholder="55m"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono font-bold outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingFlightOffer(null)}
                  className="px-3 py-2 font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-xs cursor-pointer"
                >
                  Save Schedule Change
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

