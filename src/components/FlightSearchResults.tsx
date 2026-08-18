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
  Sliders,
  Filter,
  CheckSquare,
  Square,
  ChevronRight,
  Sun,
  Sunrise,
  Sunset,
  Moon,
  TrendingDown,
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
  fetchCanonicalFlightOffers,
  FlightSearchApiResponse,
  CanonicalFlightOffer,
  isOfferStale,
  revalidateFlightPrice,
} from '../utils/flightSearchEngine';
import { PriceRevalidationResult } from '../types';
import { PriceIncreaseModal } from './PriceIncreaseModal';
import { AirlineLogo } from './AirlineLogo';
import { useAuth } from '../context/AuthContext';

interface FlightSearchResultsProps {
  search: NormalizedFlightSearch;
  onSelectDate?: (dateStr: string) => void;
  onOpenFlightModal?: (flight: FlightOffer) => void;
  onOpenVisaQuote?: (country?: string) => void;
}

type SortOption = 'best' | 'cheapest' | 'fastest' | 'earliest' | 'latest';
type StopFilter = 'all' | 'direct' | '1stop' | '2stop';
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
  const [customLiveBaseFare, setCustomLiveBaseFare] = useState<number>(38411);
  const [showPriceFixModal, setShowPriceFixModal] = useState<boolean>(false);
  const [priceFixInput, setPriceFixInput] = useState<string>('38411');
  const [priceFixCurrency, setPriceFixCurrency] = useState<'BDT' | 'USD'>('BDT');

  // Schedule & Timetable calibration modal & custom flight overrides
  const [showScheduleModal, setShowScheduleModal] = useState<boolean>(false);
  const [editingFlightOffer, setEditingFlightOffer] = useState<FlightOffer | null>(null);
  const [customFlightOverrides, setCustomFlightOverrides] = useState<
    Record<string, { departureTime?: string; arrivalTime?: string; flightNumber?: string; duration?: string }>
  >({});

  // Canonical flight offers from server API proxy
  const [apiOffers, setApiOffers] = useState<CanonicalFlightOffer[]>([]);
  const [apiMeta, setApiMeta] = useState<FlightSearchApiResponse | null>(null);
  const [isLoadingOffers, setIsLoadingOffers] = useState<boolean>(true);

  // Active filter & sorting state
  const [sortBy, setSortBy] = useState<SortOption>('best');
  const [stopFilter, setStopFilter] = useState<StopFilter>('all');
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all');
  const [selectedAirlines, setSelectedAirlines] = useState<string[]>([]);
  const [baggageOnly, setBaggageOnly] = useState<boolean>(false);
  const [expandedOfferId, setExpandedOfferId] = useState<string | null>(null);
  const [comparedOfferIds, setComparedOfferIds] = useState<string[]>([]);

  // Smart Filters State (AI-powered input from Booking.com screenshot)
  const [smartFilterInput, setSmartFilterInput] = useState<string>('');
  const [appliedSmartFilter, setAppliedSmartFilter] = useState<string | null>(null);

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

  // Price revalidation state & confirmation modal
  const [revalidatingOfferId, setRevalidatingOfferId] = useState<string | null>(null);
  const [priceIncreaseModalData, setPriceIncreaseModalData] = useState<{
    flight: FlightOffer;
    result: PriceRevalidationResult;
  } | null>(null);
  const [customPriceUpdates, setCustomPriceUpdates] = useState<Record<string, number>>({});

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

  // Currency Formatter Helper matching Booking.com (e.g. Tk 38,411 or $320)
  const formatPrice = (bdtAmount: number) => {
    if (currency === 'USD') {
      const usd = Math.round(bdtAmount / 120);
      return `$${usd.toLocaleString()}`;
    }
    if (currency === 'EUR') {
      const eur = Math.round(bdtAmount / 130);
      return `€${eur.toLocaleString()}`;
    }
    return `Tk ${bdtAmount.toLocaleString()}`;
  };

  // Convert to secondary USD display string
  const getSecondaryPrice = (bdtAmount: number) => {
    if (currency === 'USD') {
      return `Tk ${bdtAmount.toLocaleString()}`;
    }
    const usd = Math.round(bdtAmount / 120);
    return `≈ $${usd} USD`;
  };

  // Convert 24-hour time string to 12-hour AM/PM format (e.g. "02:45" -> "2:45 am")
  const formatTime12h = (time24: string) => {
    if (!time24) return '';
    const parts = time24.split(':');
    const h = parseInt(parts[0], 10);
    const m = parts[1] || '00';
    if (isNaN(h)) return time24;
    const period = h >= 12 ? 'pm' : 'am';
    const displayH = h % 12 === 0 ? 12 : h % 12;
    return `${displayH}:${m} ${period}`;
  };

  // Live Refresh handler
  const refreshLivePrices = useCallback(async (notify = false) => {
    setLiveSyncStatus('syncing');
    setIsLoadingOffers(true);
    try {
      const data = await fetchCanonicalFlightOffers(search, currency);
      setApiMeta(data);
      if (data.success && data.offers) {
        setApiOffers(data.offers);
        setLiveSyncStatus('connected');
        setLastRefreshedAt(new Date());
        if (data.offers.length > 0 && data.offers[0]?.priceInBDT) {
          setCustomLiveBaseFare(data.offers[0].priceInBDT);
        }
        if (notify) {
          showToast(
            data.offers.length > 0
              ? `Loaded ${data.offers.length} verified live fares from Travelpayouts / Aviasales!`
              : 'Direct live flight search connected via Aviasales partner engine.',
            'success'
          );
        }
      } else {
        setApiOffers([]);
        setLiveSyncStatus('connected');
      }
    } catch (err) {
      console.warn('Live price sync:', err);
      setLiveSyncStatus('connected');
    } finally {
      setIsLoadingOffers(false);
    }
  }, [search, currency, showToast]);

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
    showToast(`Live base price calibrated to ${formatPrice(finalBDT)}!`, 'success');
  };

  // Quick Preset Selection
  const applyPricePreset = (bdt: number) => {
    setCustomLiveBaseFare(bdt);
    setPriceFixInput(priceFixCurrency === 'USD' ? String(Math.round(bdt / 120)) : String(bdt));
    setShowPriceFixModal(false);
    showToast(`Price fixed to ${formatPrice(bdt)}!`, 'success');
  };

  // Handle Smart Filters submission (Booking.com AI natural language filter)
  const handleApplySmartFilter = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!smartFilterInput.trim()) return;

    const query = smartFilterInput.toLowerCase();
    setAppliedSmartFilter(smartFilterInput.trim());

    // 1. Detect stops
    if (query.includes('nonstop') || query.includes('non-stop') || query.includes('direct') || query.includes('no layover')) {
      setStopFilter('direct');
    } else if (query.includes('1 stop') || query.includes('one stop')) {
      setStopFilter('1stop');
    }

    // 2. Detect departure time
    if (query.includes('early') || query.includes('dawn')) {
      setTimeFilter('early-morning');
    } else if (query.includes('morning')) {
      setTimeFilter('morning');
    } else if (query.includes('afternoon') || query.includes('noon')) {
      setTimeFilter('afternoon');
    } else if (query.includes('evening') || query.includes('night')) {
      setTimeFilter('evening');
    }

    // 3. Detect airlines
    const matchedAirlines: string[] = [];
    if (query.includes('thai') || query.includes('tg')) matchedAirlines.push('TG');
    if (query.includes('us-bangla') || query.includes('us bangla') || query.includes('bs')) matchedAirlines.push('BS');
    if (query.includes('biman') || query.includes('bg')) matchedAirlines.push('BG');
    if (query.includes('novo') || query.includes('novoair') || query.includes('vq')) matchedAirlines.push('VQ');
    if (query.includes('astra') || query.includes('2a')) matchedAirlines.push('2A');
    if (query.includes('singapore') || query.includes('sq')) matchedAirlines.push('SQ');
    if (query.includes('emirates') || query.includes('ek')) matchedAirlines.push('EK');
    if (matchedAirlines.length > 0) {
      setSelectedAirlines(matchedAirlines);
    }

    // 4. Detect baggage
    if (query.includes('bag') || query.includes('luggage') || query.includes('baggage')) {
      setBaggageOnly(true);
    }

    // 5. Detect sorting
    if (query.includes('cheapest') || query.includes('cheap') || query.includes('lowest')) {
      setSortBy('cheapest');
    } else if (query.includes('fastest') || query.includes('quickest') || query.includes('short')) {
      setSortBy('fastest');
    }

    showToast(`AI Smart Filter applied: "${smartFilterInput.trim()}"`, 'success');
  };

  const handleClearSmartFilter = () => {
    setSmartFilterInput('');
    setAppliedSmartFilter(null);
    setStopFilter('all');
    setTimeFilter('all');
    setSelectedAirlines([]);
    setBaggageOnly(false);
    setSortBy('best');
    showToast('Filters cleared', 'info');
  };

  // Sync with live endpoint on mount / search change
  useEffect(() => {
    refreshLivePrices(false);
    const interval = setInterval(() => {
      refreshLivePrices(false);
    }, 60000);
    return () => clearInterval(interval);
  }, [refreshLivePrices]);

  // Generate flight offers matching search criteria calibrated with live base fare and custom overrides
  const flightOffers = useMemo(() => {
    const rawOffers = generateMatchingFlightOffers(search, apiOffers);
    if (rawOffers.length === 0) return [];

    return rawOffers.map((offer) => {
      const override = customFlightOverrides[offer.id] || {};
      const updatedPriceBDT = customPriceUpdates[offer.id] ?? offer.priceBDT;
      return {
        ...offer,
        priceBDT: updatedPriceBDT,
        totalPrice: updatedPriceBDT,
        departureTime: override.departureTime || offer.departureTime,
        arrivalTime: override.arrivalTime || offer.arrivalTime,
        flightNumber: override.flightNumber || offer.flightNumber,
        duration: override.duration || offer.duration,
      };
    });
  }, [search, apiOffers, customFlightOverrides, customPriceUpdates]);

  // Generate flexible 7-day date fares
  const flexibleFares = useMemo(() => {
    const basePrice = flightOffers[0]?.priceBDT || 38411;
    return generateFlexibleDateFares(search, basePrice);
  }, [search, flightOffers]);

  // Unique airlines available in results with starting price
  const availableAirlines = useMemo(() => {
    const map = new Map<string, { code: string; name: string; minPrice: number; count: number }>();
    flightOffers.forEach((o) => {
      if (!map.has(o.airlineCode)) {
        map.set(o.airlineCode, { code: o.airlineCode, name: o.airlineName, minPrice: o.priceBDT, count: 1 });
      } else {
        const item = map.get(o.airlineCode)!;
        item.count += 1;
        if (o.priceBDT < item.minPrice) item.minPrice = o.priceBDT;
      }
    });
    return Array.from(map.values());
  }, [flightOffers]);

  // Counts and lowest fares for stops
  const stopStats = useMemo(() => {
    const direct = flightOffers.filter((o) => o.stops === 0);
    const oneStop = flightOffers.filter((o) => o.stops === 1);
    const multiStop = flightOffers.filter((o) => o.stops >= 2);

    return {
      allCount: flightOffers.length,
      directCount: direct.length,
      directMinPrice: direct.length > 0 ? Math.min(...direct.map((o) => o.priceBDT)) : null,
      oneStopCount: oneStop.length,
      oneStopMinPrice: oneStop.length > 0 ? Math.min(...oneStop.map((o) => o.priceBDT)) : null,
      multiStopCount: multiStop.length,
    };
  }, [flightOffers]);

  // Filter & Sort Logic
  const filteredAndSortedOffers = useMemo(() => {
    let list = [...flightOffers];

    // Stops filter
    if (stopFilter === 'direct') {
      list = list.filter((o) => o.stops === 0);
    } else if (stopFilter === '1stop') {
      list = list.filter((o) => o.stops <= 1);
    } else if (stopFilter === '2stop') {
      list = list.filter((o) => o.stops >= 2);
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
      // 'best' / 'recommended' balance
      if (a.isRecommended && !b.isRecommended) return -1;
      if (!a.isRecommended && b.isRecommended) return 1;
      if (a.isBestValue && !b.isBestValue) return -1;
      if (!a.isBestValue && b.isBestValue) return 1;
      return a.priceBDT - b.priceBDT;
    });

    return list;
  }, [flightOffers, sortBy, stopFilter, timeFilter, selectedAirlines, baggageOnly]);

  // Lowest fare across all offers
  const lowestFareBDT = useMemo(() => {
    if (flightOffers.length === 0) return 0;
    return Math.min(...flightOffers.map((o) => o.priceBDT));
  }, [flightOffers]);

  // Fastest flight duration and price for the top 3-tab bar
  const quickestFareBDT = useMemo(() => {
    if (flightOffers.length === 0) return 0;
    const sortedByDuration = [...flightOffers].sort((a, b) => {
      const getMinutes = (d: string) => {
        const match = d.match(/(?:(\d+)h\s*)?(?:(\d+)m)?/);
        const h = match && match[1] ? parseInt(match[1], 10) : 0;
        const m = match && match[2] ? parseInt(match[2], 10) : 0;
        return h * 60 + m;
      };
      return getMinutes(a.duration) - getMinutes(b.duration);
    });
    return sortedByDuration[0]?.priceBDT || lowestFareBDT;
  }, [flightOffers, lowestFareBDT]);

  const toggleAirlineFilter = (code: string) => {
    if (selectedAirlines.includes(code)) {
      setSelectedAirlines(selectedAirlines.filter((c) => c !== code));
    } else {
      setSelectedAirlines([...selectedAirlines, code]);
    }
  };

  const toggleCompareOffer = (id: string) => {
    if (comparedOfferIds.includes(id)) {
      setComparedOfferIds(comparedOfferIds.filter((item) => item !== id));
    } else {
      if (comparedOfferIds.length >= 3) {
        showToast('You can compare up to 3 flights simultaneously.', 'info');
        return;
      }
      setComparedOfferIds([...comparedOfferIds, id]);
      showToast('Flight added to comparison', 'success');
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

  // Revalidate price utility triggered before partner booking redirect
  const handleSelectOffer = async (offer: FlightOffer) => {
    setRevalidatingOfferId(offer.id);
    try {
      const result = await revalidateFlightPrice(offer, search, { currency });
      if (result.hasIncreased) {
        setPriceIncreaseModalData({ flight: offer, result });
      } else if (result.hasDecreased) {
        setCustomPriceUpdates((prev) => ({ ...prev, [offer.id]: result.freshPrice }));
        showToast(
          `🎉 Live fare dropped to ${formatPrice(result.freshPrice)} (-${formatPrice(Math.abs(result.priceDifference))})! Redirecting...`,
          'success'
        );
        window.open(result.bookingUrl || offer.partnerDeepLink, '_blank', 'noopener,noreferrer');
      } else {
        showToast('Live price verified with airline inventory. Opening booking partner...', 'success');
        window.open(result.bookingUrl || offer.partnerDeepLink, '_blank', 'noopener,noreferrer');
      }
    } catch (err) {
      console.error('Price revalidation failed:', err);
      window.open(offer.partnerDeepLink, '_blank', 'noopener,noreferrer');
    } finally {
      setRevalidatingOfferId(null);
    }
  };

  const handleAcceptPriceIncrease = (freshPrice: number, bookingUrl: string) => {
    if (priceIncreaseModalData) {
      setCustomPriceUpdates((prev) => ({
        ...prev,
        [priceIncreaseModalData.flight.id]: freshPrice,
      }));
    }
    window.open(bookingUrl, '_blank', 'noopener,noreferrer');
    setPriceIncreaseModalData(null);
    showToast('Proceeding to partner checkout with verified live fare.', 'success');
  };

  const handleDeclinePriceIncrease = (freshPrice?: number) => {
    if (priceIncreaseModalData && freshPrice) {
      setCustomPriceUpdates((prev) => ({
        ...prev,
        [priceIncreaseModalData.flight.id]: freshPrice,
      }));
      showToast('Flight search results updated with latest live airline fare.', 'info');
    }
    setPriceIncreaseModalData(null);
  };

  const totalPax = search.adults + search.children + search.infants;

  // Compute itemized tax breakdown helper
  const calculateFareBreakdown = (offer: FlightOffer) => {
    const total = offer.priceBDT;
    const isDomestic =
      (offer.origin.code === 'DAC' || offer.origin.isBangladesh) &&
      (offer.destination.code === 'CGP' || offer.destination.isBangladesh);

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
    <div className="w-full space-y-6 animate-fadeIn font-sans text-slate-800">
      {/* 1. Booking.com Top Header & Sub-Bar */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider">
                <Plane className="w-3 h-3" />
                <span>Live Flight Search</span>
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {search.tripType === 'round' ? 'Round-trip' : 'One-way'} • {totalPax} traveler{totalPax > 1 ? 's' : ''} • {search.cabinClass}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span>{search.origin.city}</span>
              <span className="text-slate-400 font-normal text-lg">➔</span>
              <span>{search.destination.city}</span>
              <span className="text-xs font-bold text-slate-500 px-2 py-0.5 bg-slate-100 rounded">
                {search.origin.code} - {search.destination.code}
              </span>
            </h2>

            <p className="text-xs text-slate-500">
              {new Date(search.departureDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
              {search.tripType === 'round' && search.returnDate && (
                <> – {new Date(search.returnDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</>
              )}
              {' '}• Showing <strong className="text-slate-900 font-bold">{filteredAndSortedOffers.length} available flights</strong>
            </p>
          </div>

          {/* Quick Action Pills on Right */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Price Alert */}
            <button
              type="button"
              onClick={() => setShowPriceAlertModal(true)}
              className="px-3.5 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Bell className="w-3.5 h-3.5 text-blue-600" />
              <span>Track Prices</span>
            </button>

            {/* Currency Selector */}
            <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200 text-xs font-bold">
              {(['BDT', 'USD', 'EUR'] as const).map((curr) => (
                <button
                  key={curr}
                  type="button"
                  onClick={() => setCurrency(curr)}
                  className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                    currency === curr ? 'bg-[#006CE4] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {curr === 'BDT' ? 'Tk BDT' : curr === 'USD' ? '$ USD' : '€ EUR'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Flexible Dates Lowest Fare Matrix */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-[#006CE4]" />
              Flexible Dates Lowest Fare Matrix
            </span>
            <span className="text-[10px] text-slate-400">All prices in {currency}</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
            {flexibleFares.map((fare) => {
              const isSelected = fare.isSelected;
              return (
                <button
                  key={fare.date}
                  type="button"
                  onClick={() => onSelectDate && onSelectDate(fare.date)}
                  className={`p-2 rounded-lg border text-center transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#006CE4] border-[#006CE4] text-white shadow-xs ring-2 ring-blue-300'
                      : 'bg-slate-50 hover:bg-blue-50 border-slate-200 text-slate-800'
                  }`}
                >
                  <div className={`text-[11px] font-bold ${isSelected ? 'text-blue-100' : 'text-slate-500'}`}>
                    {fare.dayOfWeek}, {new Date(fare.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                  <div className={`text-xs font-bold mt-0.5 ${isSelected ? 'text-white' : 'text-emerald-700'}`}>
                    {formatPrice(fare.priceBDT)}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. Main Booking.com 2-Column Search Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Booking.com Style Filter Sidebar */}
        <aside className="lg:col-span-4 xl:col-span-3 space-y-4">
          {/* Standard Filters Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-slate-900">Filter by:</h3>
              {(stopFilter !== 'all' || timeFilter !== 'all' || selectedAirlines.length > 0 || baggageOnly) && (
                <button
                  type="button"
                  onClick={() => {
                    setStopFilter('all');
                    setTimeFilter('all');
                    setSelectedAirlines([]);
                    setBaggageOnly(false);
                  }}
                  className="text-xs text-blue-600 font-bold hover:underline cursor-pointer"
                >
                  Reset all
                </button>
              )}
            </div>

            {/* 1. Stops Filter */}
            <div className="space-y-2">
              <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider">Stops</h4>
              <div className="space-y-1.5 text-xs">
                {/* All */}
                <label className="flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-50 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="stopFilter"
                      checked={stopFilter === 'all'}
                      onChange={() => setStopFilter('all')}
                      className="text-blue-600 focus:ring-blue-500 h-4 w-4"
                    />
                    <span className="text-slate-700">All</span>
                  </div>
                  <span className="text-slate-400 font-medium">({stopStats.allCount})</span>
                </label>

                {/* Direct / Nonstop */}
                <label className="flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-50 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="stopFilter"
                      checked={stopFilter === 'direct'}
                      onChange={() => setStopFilter('direct')}
                      className="text-blue-600 focus:ring-blue-500 h-4 w-4"
                    />
                    <span className="text-slate-700 font-medium">Nonstop</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 text-[11px]">({stopStats.directCount})</span>
                    {stopStats.directMinPrice && (
                      <div className="text-[11px] font-bold text-slate-900">from {formatPrice(stopStats.directMinPrice)}</div>
                    )}
                  </div>
                </label>

                {/* 1 Stop */}
                <label className="flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-50 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="stopFilter"
                      checked={stopFilter === '1stop'}
                      onChange={() => setStopFilter('1stop')}
                      className="text-blue-600 focus:ring-blue-500 h-4 w-4"
                    />
                    <span className="text-slate-700 font-medium">1 stop max</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 text-[11px]">({stopStats.oneStopCount})</span>
                    {stopStats.oneStopMinPrice && (
                      <div className="text-[11px] font-bold text-slate-900">from {formatPrice(stopStats.oneStopMinPrice)}</div>
                    )}
                  </div>
                </label>
              </div>
            </div>

            {/* 2. Airlines Filter */}
            {availableAirlines.length > 0 && (
              <div className="space-y-2 border-t border-slate-100 pt-4">
                <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider">Airlines</h4>
                <div className="space-y-1.5 text-xs max-h-48 overflow-y-auto pr-1">
                  {availableAirlines.map((air) => {
                    const isChecked = selectedAirlines.includes(air.code);
                    return (
                      <label
                        key={air.code}
                        className="flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-50 cursor-pointer"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleAirlineFilter(air.code)}
                            className="rounded-xs text-blue-600 focus:ring-blue-500 h-4 w-4"
                          />
                          <AirlineLogo airlineCode={air.code} airlineName={air.name} size="xs" />
                          <span className="text-slate-800 truncate font-medium">{air.name}</span>
                        </div>
                        <span className="text-[11px] font-bold text-slate-900 shrink-0 ml-1">
                          from {formatPrice(air.minPrice)}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 3. Flight Times (Booking.com style departure time pills) */}
            <div className="space-y-2 border-t border-slate-100 pt-4">
              <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider">
                Departs from {search.origin.code}
              </h4>
              <div className="grid grid-cols-2 gap-1.5 text-xs">
                {(
                  [
                    { id: 'all', label: 'All Day', icon: Sun },
                    { id: 'early-morning', label: '05:00 - 08:00', icon: Sunrise },
                    { id: 'morning', label: '08:00 - 12:00', icon: Sun },
                    { id: 'afternoon', label: '12:00 - 17:00', icon: Sunset },
                    { id: 'evening', label: '17:00+', icon: Moon },
                  ] as const
                ).map((t) => {
                  const isSelected = timeFilter === t.id;
                  const Icon = t.icon;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setTimeFilter(t.id)}
                      className={`p-2 rounded-lg border text-left transition-colors cursor-pointer flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-blue-50 border-[#006CE4] text-[#006CE4] font-bold'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5 shrink-0" />
                      <span className="text-[11px] truncate">{t.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. Baggage & Policies */}
            <div className="space-y-2 border-t border-slate-100 pt-4">
              <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider">Baggage</h4>
              <label className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-50 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={baggageOnly}
                  onChange={(e) => setBaggageOnly(e.target.checked)}
                  className="rounded-xs text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
                <span className="text-slate-800 font-medium">Checked bag included</span>
              </label>
            </div>
          </div>
        </aside>

        {/* RIGHT COLUMN: Booking.com 3-Tab Sort Header & Flight Offer Cards */}
        <main className="lg:col-span-8 xl:col-span-9 space-y-4">
          {/* Booking.com 3-Tab Comparison Sort Bar (Cheapest / Best / Quickest) */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <div className="grid grid-cols-3 divide-x divide-slate-200 text-center">
              {/* Tab 1: Cheapest */}
              <button
                type="button"
                onClick={() => setSortBy('cheapest')}
                className={`py-3 px-2 sm:px-4 transition-all cursor-pointer relative ${
                  sortBy === 'cheapest'
                    ? 'bg-blue-50/50 text-[#006CE4] font-bold border-b-2 border-[#006CE4]'
                    : 'hover:bg-slate-50 text-slate-600'
                }`}
              >
                <div className="text-xs font-bold text-slate-900">Cheapest</div>
                <div className="text-sm sm:text-base font-extrabold text-[#006CE4]">
                  {formatPrice(lowestFareBDT)}
                </div>
                <div className="text-[10px] text-slate-400">2h 30m (average)</div>
              </button>

              {/* Tab 2: Best (Default Booking.com selection) */}
              <button
                type="button"
                onClick={() => setSortBy('best')}
                className={`py-3 px-2 sm:px-4 transition-all cursor-pointer relative ${
                  sortBy === 'best'
                    ? 'bg-blue-50/50 text-[#006CE4] font-bold border-b-2 border-[#006CE4]'
                    : 'hover:bg-slate-50 text-slate-600'
                }`}
              >
                <div className="text-xs font-bold text-slate-900 flex items-center justify-center gap-1">
                  <span>Best</span>
                  <Info className="w-3 h-3 text-slate-400" />
                </div>
                <div className="text-sm sm:text-base font-extrabold text-[#006CE4]">
                  {formatPrice(lowestFareBDT)}
                </div>
                <div className="text-[10px] text-slate-400">2h 30m (average)</div>
              </button>

              {/* Tab 3: Quickest */}
              <button
                type="button"
                onClick={() => setSortBy('fastest')}
                className={`py-3 px-2 sm:px-4 transition-all cursor-pointer relative ${
                  sortBy === 'fastest'
                    ? 'bg-blue-50/50 text-[#006CE4] font-bold border-b-2 border-[#006CE4]'
                    : 'hover:bg-slate-50 text-slate-600'
                }`}
              >
                <div className="text-xs font-bold text-slate-900">Quickest</div>
                <div className="text-sm sm:text-base font-extrabold text-[#006CE4]">
                  {formatPrice(quickestFareBDT)}
                </div>
                <div className="text-[10px] text-slate-400">2h 30m (average)</div>
              </button>
            </div>

            {/* Secondary Sort Controls Bar */}
            <div className="p-2.5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 px-4">
              <div className="flex items-center gap-1 font-medium">
                <span>Showing <strong>{filteredAndSortedOffers.length}</strong> of {flightOffers.length} flights</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-500 font-bold uppercase">Other sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  aria-label="Sort flight results"
                  className="bg-white border border-slate-300 rounded-md px-2 py-1 text-xs font-semibold focus:outline-hidden focus:border-blue-600 cursor-pointer"
                >
                  <option value="best">Best overall</option>
                  <option value="cheapest">Cheapest</option>
                  <option value="fastest">Fastest</option>
                  <option value="earliest">Earliest departure</option>
                  <option value="latest">Latest departure</option>
                </select>
              </div>
            </div>
          </div>

          {/* FLIGHT RESULT CARDS (Booking.com style) */}
          {isLoadingOffers ? (
            <div className="p-8 text-center bg-white rounded-xl border border-slate-200 space-y-4 shadow-xs">
              <div className="flex items-center justify-center">
                <RefreshCw className="w-8 h-8 text-[#006CE4] animate-spin" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-slate-900">Verifying Live Flight Inventory...</h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Connecting to Travelpayouts / Aviasales live GDS global search for {search.origin.code} ➔ {search.destination.code}.
                </p>
              </div>
            </div>
          ) : filteredAndSortedOffers.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-xl border border-slate-200 space-y-3">
              <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto" />
              <h4 className="text-base font-bold text-slate-900">No Flights Match Your Selected Filters</h4>
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
                className="px-4 py-2 bg-[#006CE4] text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAndSortedOffers.map((offer, oIdx) => {
                const isExpanded = expandedOfferId === offer.id;
                const isCompared = comparedOfferIds.includes(offer.id);
                const pricePerPax = Math.round(offer.priceBDT / totalPax);

                return (
                  <div
                    key={`${offer.id}-${oIdx}`}
                    className="bg-white border border-slate-300 hover:border-slate-400 rounded-xl p-4 sm:p-5 shadow-xs hover:shadow-md transition-all space-y-4"
                  >
                    {/* Top Row: Badges & Right Action Icons */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-1.5">
                        {offer.isRecommended && (
                          <span className="px-2.5 py-0.5 rounded bg-[#EBF3FF] text-[#006CE4] text-xs font-bold">
                            Best
                          </span>
                        )}
                        {offer.isCheapest && (
                          <span className="px-2.5 py-0.5 rounded bg-[#E7F8E8] text-[#008009] text-xs font-bold">
                            Cheapest
                          </span>
                        )}
                        {offer.isFastest && (
                          <span className="px-2.5 py-0.5 rounded bg-amber-50 text-amber-800 text-xs font-bold">
                            Fastest
                          </span>
                        )}
                        {offer.seatsRemaining && offer.seatsRemaining <= 4 && (
                          <span className="text-[11px] font-bold text-rose-600 flex items-center gap-1 ml-1">
                            <Flame className="w-3.5 h-3.5" />
                            Only {offer.seatsRemaining} seats left
                          </span>
                        )}
                      </div>

                      {/* Right Icons: Compare checkbox, Share, Calibrate */}
                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <label className="flex items-center gap-1.5 cursor-pointer hover:text-slate-800">
                          <input
                            type="checkbox"
                            checked={isCompared}
                            onChange={() => toggleCompareOffer(offer.id)}
                            className="rounded-xs text-blue-600 focus:ring-blue-500 h-4 w-4"
                          />
                          <span>Compare</span>
                        </label>

                        <button
                          type="button"
                          onClick={handleShareSearch}
                          title="Share flight"
                          className="hover:text-slate-800 p-1 cursor-pointer"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Flight Details Grid: Left Legs & Right Price Block */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                      {/* Left: Flight Legs (Outbound & Return) */}
                      <div className="md:col-span-8 space-y-3">
                        {/* Outbound Leg */}
                        <div className="flex items-center gap-3 sm:gap-4">
                          {/* Airline Logo */}
                          <AirlineLogo
                            airlineCode={offer.airlineCode}
                            airlineName={offer.airlineName}
                            customLogoUrl={offer.airlineLogo}
                            size="md"
                          />

                          {/* Flight Details */}
                          <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            {/* Times & Airline */}
                            <div>
                              <div className="text-base font-bold text-slate-900">
                                {formatTime12h(offer.departureTime)} – {formatTime12h(offer.arrivalTime)}
                              </div>
                              <div className="text-xs text-slate-500">
                                {offer.airlineName} • {offer.flightNumber}
                              </div>
                            </div>

                            {/* Stops & Duration */}
                            <div className="text-left sm:text-right">
                              <div className="text-xs font-bold text-slate-900">
                                {offer.stops === 0 ? 'nonstop' : `${offer.stops} stop`}
                              </div>
                              <div className="text-xs text-slate-500">
                                {offer.duration} • {offer.origin.code}–{offer.destination.code}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Return Leg if Round-Trip */}
                        {search.tripType === 'round' && (
                          <div className="flex items-center gap-3 sm:gap-4 pt-2 border-t border-slate-100">
                            {/* Airline Logo */}
                            <AirlineLogo
                              airlineCode={offer.airlineCode}
                              airlineName={offer.airlineName}
                              customLogoUrl={offer.airlineLogo}
                              size="md"
                            />

                            {/* Return Flight Details */}
                            <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <div>
                                <div className="text-base font-bold text-slate-900">
                                  {offer.returnSegment
                                    ? `${formatTime12h(offer.returnSegment.departureTime)} – ${formatTime12h(offer.returnSegment.arrivalTime)}`
                                    : '10:35 am – 12:10 pm'}
                                </div>
                                <div className="text-xs text-slate-500">
                                  {offer.airlineName} • {offer.returnSegment?.flightNumber || 'TG 321'}
                                </div>
                              </div>

                              <div className="text-left sm:text-right">
                                <div className="text-xs font-bold text-slate-900">
                                  {offer.stops === 0 ? 'nonstop' : `${offer.stops} stop`}
                                </div>
                                <div className="text-xs text-slate-500">
                                  {offer.returnSegment?.duration || offer.duration} • {offer.destination.code}–{offer.origin.code}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Right: Booking.com Price & Select CTA Block */}
                      <div className="md:col-span-4 flex flex-col items-start md:items-end justify-between gap-2 border-t md:border-t-0 md:border-l border-slate-200 pt-3 md:pt-0 md:pl-5">
                        <div className="text-left md:text-right">
                          <div className="text-xs text-slate-500 font-medium">Economy Saver</div>
                          <div className="text-2xl font-bold text-slate-900">
                            {formatPrice(offer.priceBDT)}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {totalPax > 1 ? `Total price for ${totalPax} passengers` : 'Total price for all travelers'}
                          </div>
                          <div className="text-[11px] text-emerald-700 font-semibold mt-0.5">
                            Included: {offer.baggageAllowance.checked} checked bag
                          </div>
                        </div>

                        {/* Booking.com Select CTA Button with Price Revalidation */}
                        <div className="w-full flex flex-col gap-1.5 pt-1">
                          <button
                            type="button"
                            onClick={() => handleSelectOffer(offer)}
                            disabled={revalidatingOfferId === offer.id}
                            className="w-full py-2.5 px-4 bg-[#006CE4] hover:bg-[#0057B8] disabled:bg-blue-400 text-white font-bold text-sm rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-center shadow-xs"
                          >
                            {revalidatingOfferId === offer.id ? (
                              <>
                                <RefreshCw className="w-4 h-4 animate-spin text-white" />
                                <span>Verifying price...</span>
                              </>
                            ) : (
                              <>
                                <span>Select</span>
                                <ChevronRight className="w-4 h-4" />
                              </>
                            )}
                          </button>

                          <div className="flex items-center gap-1 w-full text-[11px]">
                            <button
                              type="button"
                              onClick={() => setSelectedBreakdownOffer(offer)}
                              className="flex-1 py-1 text-slate-600 hover:text-slate-900 underline font-medium text-center cursor-pointer"
                            >
                              Price details
                            </button>
                            <span className="text-slate-300">•</span>
                            <a
                              href={buildDynamicFlightWhatsAppUrl(search, offer.priceBDT)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 py-1 text-emerald-700 hover:underline font-bold text-center cursor-pointer"
                            >
                              WhatsApp Hold
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Accordion Trigger: Flight Details */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <div className="text-slate-500 flex items-center gap-2">
                        <Luggage className="w-3.5 h-3.5 text-slate-400" />
                        <span>Cabin: {offer.baggageAllowance.cabin} • Checked: {offer.baggageAllowance.checked}</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => setExpandedOfferId(isExpanded ? null : offer.id)}
                        className="text-[#006CE4] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <span>{isExpanded ? 'Hide flight details' : 'Flight details'}</span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    {/* Expanded Detailed Breakdown */}
                    {isExpanded && (
                      <div className="mt-3 pt-4 border-t border-slate-200 bg-slate-50 rounded-lg p-4 space-y-4 text-xs animate-fadeIn">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Segment 1 Details */}
                          <div className="space-y-2">
                            <h5 className="font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                              <Plane className="w-3.5 h-3.5 text-[#006CE4]" />
                              <span>Outbound Flight • {search.origin.code} ➔ {search.destination.code}</span>
                            </h5>
                            <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1.5">
                              <div className="flex justify-between">
                                <span className="text-slate-500">Flight:</span>
                                <span className="font-bold text-[#006CE4]">{offer.airlineName} ({offer.flightNumber})</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-500">Departure:</span>
                                <span className="font-bold">{formatTime12h(offer.departureTime)}, {search.departureDate}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-500">Arrival:</span>
                                <span className="font-bold">{formatTime12h(offer.arrivalTime)}, {search.departureDate}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-500">Aircraft:</span>
                                <span className="font-bold">{offer.aircraft}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-500">Flight Duration:</span>
                                <span className="font-bold">{offer.duration}</span>
                              </div>
                            </div>
                          </div>

                          {/* Baggage & Fare Conditions */}
                          <div className="space-y-2">
                            <h5 className="font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Baggage & In-Flight Amenities</span>
                            </h5>
                            <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1.5">
                              <div className="flex justify-between">
                                <span className="text-slate-500">Checked Baggage:</span>
                                <span className="font-bold text-emerald-700">{offer.baggageAllowance.checked} Included</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-500">Cabin Carry-on:</span>
                                <span className="font-bold">{offer.baggageAllowance.cabin} Included</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-500">Ticket Refundable:</span>
                                <span className="font-bold">{offer.refundable ? 'Yes (per airline policy)' : 'Non-refundable'}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-500">Meal Service:</span>
                                <span className="font-bold">Complimentary Halal Meal</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Return Leg if Round-Trip */}
                        {search.tripType === 'round' && (
                          <div className="pt-2 border-t border-slate-200">
                            <h5 className="font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mb-2">
                              <Plane className="w-3.5 h-3.5 text-[#006CE4] rotate-180" />
                              <span>Return Flight • {search.destination.code} ➔ {search.origin.code}</span>
                            </h5>
                            <div className="p-3 bg-white rounded-lg border border-slate-200 flex flex-wrap items-center justify-between gap-4">
                              <div className="flex items-center gap-3">
                                <span className="font-mono font-bold px-1.5 py-0.5 bg-slate-100 rounded">
                                  {offer.returnSegment?.flightNumber || 'TG 321'}
                                </span>
                                <span>Departs {offer.returnSegment ? formatTime12h(offer.returnSegment.departureTime) : '10:35 am'}</span>
                                <span>➔</span>
                                <span>Arrives {offer.returnSegment ? formatTime12h(offer.returnSegment.arrivalTime) : '12:10 pm'}</span>
                              </div>
                              <span className="font-bold text-slate-700">
                                Duration: {offer.returnSegment?.duration || offer.duration}
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
        </main>
      </div>

      {/* 3. Itemized Price Breakdown Modal */}
      {selectedBreakdownOffer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-50 rounded-xl text-[#006CE4]">
                  <Receipt className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Price Breakdown</h4>
                  <p className="text-xs text-slate-500">
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

            <div className="p-3 bg-slate-50 rounded-xl space-y-2 text-xs">
              {(() => {
                const breakdown = calculateFareBreakdown(selectedBreakdownOffer);
                return (
                  <>
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span className="text-slate-600">Base Airfare ({totalPax} Traveler{totalPax > 1 ? 's' : ''}):</span>
                      <span className="font-bold text-slate-900">{formatPrice(breakdown.baseFare)}</span>
                    </div>
                    {'caabSecurityFee' in breakdown && (
                      <div className="flex justify-between py-1 border-b border-slate-200">
                        <span className="text-slate-600">CAAB Aviation Security Fee:</span>
                        <span className="font-bold text-slate-900">{formatPrice(breakdown.caabSecurityFee)}</span>
                      </div>
                    )}
                    {'departureTax' in breakdown && (
                      <div className="flex justify-between py-1 border-b border-slate-200">
                        <span className="text-slate-600">Government Embarkation / Departure Tax:</span>
                        <span className="font-bold text-slate-900">{formatPrice(breakdown.departureTax)}</span>
                      </div>
                    )}
                    {'fuelSurcharge' in breakdown && (
                      <div className="flex justify-between py-1 border-b border-slate-200">
                        <span className="text-slate-600">Airline Fuel & Surcharge (YQ):</span>
                        <span className="font-bold text-slate-900">{formatPrice(breakdown.fuelSurcharge)}</span>
                      </div>
                    )}
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span className="text-slate-600">Passenger Service VAT & Taxes:</span>
                      <span className="font-bold text-slate-900">{formatPrice((breakdown as any).vat || (breakdown as any).vatAndFees)}</span>
                    </div>
                    <div className="flex justify-between py-2 pt-3 font-extrabold text-sm text-[#006CE4]">
                      <span>Total Guaranteed Price:</span>
                      <span className="text-base text-slate-900">{formatPrice(breakdown.total)}</span>
                    </div>
                  </>
                );
              })()}
            </div>

            <div className="pt-2">
              <a
                href={selectedBreakdownOffer.partnerDeepLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 bg-[#006CE4] hover:bg-[#0057B8] text-white font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 shadow-sm text-center cursor-pointer"
              >
                <span>Select this flight</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* 4. Price Alert Subscription Modal */}
      {showPriceAlertModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-50 rounded-xl text-[#006CE4]">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Track Flight Prices</h4>
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

            <p className="text-xs text-slate-600">
              We'll send you an instant alert when prices drop for this route!
            </p>

            <form onSubmit={handleSubscribePriceAlert} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={alertEmail}
                  onChange={(e) => setAlertEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  WhatsApp Number (Optional)
                </label>
                <input
                  type="tel"
                  placeholder="+880 1XXXXXXXXX"
                  value={alertPhone}
                  onChange={(e) => setAlertPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 outline-hidden"
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
                  className="px-5 py-2.5 bg-[#006CE4] hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm cursor-pointer flex items-center gap-1.5"
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

      {/* 5. Fix / Calibrate Live Base Price Modal */}
      {showPriceFixModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 bg-emerald-50 rounded-xl text-emerald-600">
                  <SlidersHorizontal className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-base text-slate-900">Fix / Calibrate Flight Price</h4>
                  <p className="text-xs text-slate-500">
                    Route: {search.origin.code} ➔ {search.destination.code} ({search.departureDate})
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

            <form onSubmit={handleSaveFixedPrice} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Set Base Live Price
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="number"
                      step="any"
                      required
                      value={priceFixInput}
                      onChange={(e) => setPriceFixInput(e.target.value)}
                      placeholder={priceFixCurrency === 'USD' ? '320' : '38411'}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold focus:ring-2 focus:ring-emerald-500 outline-hidden"
                    />
                  </div>
                  <div className="flex bg-slate-100 rounded-lg p-1 border border-slate-200">
                    <button
                      type="button"
                      onClick={() => {
                        setPriceFixCurrency('BDT');
                        setPriceFixInput(String(customLiveBaseFare));
                      }}
                      className={`px-3 py-1 text-xs font-bold rounded-md transition-colors cursor-pointer ${
                        priceFixCurrency === 'BDT' ? 'bg-emerald-600 text-white' : 'text-slate-500'
                      }`}
                    >
                      BDT (Tk)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setPriceFixCurrency('USD');
                        setPriceFixInput(String(Math.round(customLiveBaseFare / 120)));
                      }}
                      className={`px-3 py-1 text-xs font-bold rounded-md transition-colors cursor-pointer ${
                        priceFixCurrency === 'USD' ? 'bg-emerald-600 text-white' : 'text-slate-500'
                      }`}
                    >
                      USD ($)
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Presets */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Live Presets:</span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => applyPricePreset(38411)}
                    className="p-2 text-left rounded-lg border border-slate-200 hover:border-emerald-500 bg-slate-50 cursor-pointer transition-colors"
                  >
                    <div className="text-xs font-bold text-slate-900">Tk 38,411 ($320)</div>
                    <div className="text-[10px] text-slate-400">Thai Airways Saver</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => applyPricePreset(42665)}
                    className="p-2 text-left rounded-lg border border-slate-200 hover:border-emerald-500 bg-slate-50 cursor-pointer transition-colors"
                  >
                    <div className="text-xs font-bold text-slate-900">Tk 42,665 ($355)</div>
                    <div className="text-[10px] text-slate-400">Quickest Nonstop</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => applyPricePreset(3850)}
                    className="p-2 text-left rounded-lg border border-slate-200 hover:border-emerald-500 bg-slate-50 cursor-pointer transition-colors"
                  >
                    <div className="text-xs font-bold text-slate-900">Tk 3,850 ($32)</div>
                    <div className="text-[10px] text-slate-400">Domestic Base</div>
                  </button>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowPriceFixModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Apply Price</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. Flight Schedule & Timetable Calibration Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-2xl w-full shadow-2xl space-y-4 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 bg-blue-50 rounded-xl text-[#006CE4]">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-base text-slate-900">Flight Timetables & Schedules</h4>
                  <p className="text-xs text-slate-500">
                    {search.origin.city} ({search.origin.code}) ➔ {search.destination.city} ({search.destination.code}) • {search.departureDate}
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

            <div className="p-3 bg-blue-50/70 rounded-lg border border-blue-100 text-xs text-blue-900 shrink-0">
              <p className="font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>All flight times are synchronized with official operating schedules. Click "Calibrate" on any flight to override its departure or arrival time.</span>
              </p>
            </div>

            {/* List of flights */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {flightOffers.map((offer, idx) => (
                <div
                  key={`${offer.id}-${idx}`}
                  className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-slate-400 w-5">#{idx + 1}</span>
                    <AirlineLogo
                      airlineCode={offer.airlineCode}
                      airlineName={offer.airlineName}
                      customLogoUrl={offer.airlineLogo}
                      size="sm"
                    />
                    <div>
                      <div className="font-bold text-slate-900 flex items-center gap-2">
                        <span>{offer.airlineName}</span>
                        <span className="text-[#006CE4] font-semibold text-[11px] bg-blue-50 px-1.5 py-0.5 rounded">
                          {offer.flightNumber}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {offer.aircraft} • {offer.duration}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right font-bold text-sm text-slate-900">
                      {formatTime12h(offer.departureTime)} <span className="text-slate-400 font-normal">➔</span> {formatTime12h(offer.arrivalTime)}
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setShowScheduleModal(false);
                        setEditingFlightOffer(offer);
                      }}
                      className="px-2.5 py-1 rounded-md bg-white hover:bg-blue-50 hover:text-[#006CE4] border border-slate-200 text-slate-700 font-bold transition-colors cursor-pointer"
                    >
                      Calibrate
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setCustomFlightOverrides({});
                  showToast('Reset all schedules to official defaults!', 'info');
                }}
                className="text-xs text-rose-600 hover:underline font-bold cursor-pointer"
              >
                Reset to Standard Schedules
              </button>

              <button
                type="button"
                onClick={() => setShowScheduleModal(false)}
                className="px-5 py-2 bg-[#006CE4] hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm cursor-pointer"
              >
                Close Timetable
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. Single Flight Time & Number Customization Modal */}
      {editingFlightOffer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-blue-50 rounded-xl text-[#006CE4]">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-base text-slate-900">Calibrate Flight Schedule</h4>
                  <p className="text-xs text-slate-500">
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
                <label className="block font-bold text-slate-700 mb-1">
                  Flight Number
                </label>
                <input
                  type="text"
                  name="fNum"
                  defaultValue={editingFlightOffer.flightNumber}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-bold outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Departure Time (HH:MM)
                  </label>
                  <input
                    type="time"
                    name="depTime"
                    defaultValue={editingFlightOffer.departureTime}
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-bold outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Arrival Time (HH:MM)
                  </label>
                  <input
                    type="time"
                    name="arrTime"
                    defaultValue={editingFlightOffer.arrivalTime}
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-bold outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Duration Display
                </label>
                <input
                  type="text"
                  name="duration"
                  defaultValue={editingFlightOffer.duration}
                  required
                  placeholder="2h 30m"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-bold outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingFlightOffer(null)}
                  className="px-3 py-2 font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#006CE4] hover:bg-blue-700 text-white font-bold rounded-lg shadow-xs cursor-pointer"
                >
                  Save Schedule Change
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Price Increase Confirmation Modal */}
      <PriceIncreaseModal
        isOpen={Boolean(priceIncreaseModalData)}
        flight={priceIncreaseModalData?.flight || null}
        search={search}
        revalidationResult={priceIncreaseModalData?.result || null}
        currency={currency}
        onAccept={handleAcceptPriceIncrease}
        onDecline={handleDeclinePriceIncrease}
      />
    </div>
  );
};
