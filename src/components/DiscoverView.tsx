import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Destination } from '../types';
import { useAuth } from '../context/AuthContext';
import { usePackages } from '../context/PackageContext';
import {
  Search,
  ArrowRight,
  Plane,
  FileCheck2,
  Package,
  Sparkles,
  MapPin,
  Star,
  ShieldCheck,
  HeartHandshake,
  Award,
  Clock,
  Calendar,
  Users,
  ChevronDown,
  ChevronRight,
  Tag,
  Headphones,
  Check,
} from 'lucide-react';
import { getOptimizedUnsplashUrl, getUnsplashSrcSet } from '../utils/imageOptimization';

interface DiscoverViewProps {
  destinations: Destination[];
  onSelectDestination: (destination: Destination) => void;
  onPlanTripPrompt: (promptText: string) => void;
  onQuickGenerateItinerary: (destName: string) => void;
  onNavigateToView?: (view: string) => void;
  onOpenVisaModal?: (country?: string) => void;
  onOpenFlightModal?: (dest?: string) => void;
  onOpenQuote?: () => void;
}

export const DiscoverView: React.FC<DiscoverViewProps> = ({
  destinations,
  onSelectDestination,
  onPlanTripPrompt,
  onQuickGenerateItinerary,
  onNavigateToView,
  onOpenVisaModal,
  onOpenFlightModal,
  onOpenQuote,
}) => {
  const { requireAuth, showToast } = useAuth();
  const { packages, setActivePackageModal } = usePackages();

  // Search Bar interactive states
  const [selectedDest, setSelectedDest] = useState('');
  const [selectedDates, setSelectedDates] = useState('');
  const [travelerCount, setTravelerCount] = useState(1);
  const [travelClass, setTravelClass] = useState('Economy');

  // Dropdown open states
  const [openDestMenu, setOpenDestMenu] = useState(false);
  const [openDateMenu, setOpenDateMenu] = useState(false);
  const [openTravelerMenu, setOpenTravelerMenu] = useState(false);

  // Search filter query
  const [searchQuery, setSearchQuery] = useState('');

  const destMenuRef = useRef<HTMLDivElement>(null);
  const dateMenuRef = useRef<HTMLDivElement>(null);
  const travelerMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (destMenuRef.current && !destMenuRef.current.contains(event.target as Node)) {
        setOpenDestMenu(false);
      }
      if (dateMenuRef.current && !dateMenuRef.current.contains(event.target as Node)) {
        setOpenDateMenu(false);
      }
      if (travelerMenuRef.current && !travelerMenuRef.current.contains(event.target as Node)) {
        setOpenTravelerMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Popular destinations specifically matching the Bangladesh traveler curation in the screenshot
  const bangladeshiCuratedDestinations = [
    {
      id: 'dest-maldives',
      name: 'Maldives',
      country: 'Maldives',
      rating: '4.9',
      reviews: '1.2K+',
      imageUrl: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800&q=80',
      description: 'Luxury overwater villas, crystal lagoons, and coral reefs.',
    },
    {
      id: 'dest-dubai',
      name: 'Dubai',
      country: 'United Arab Emirates',
      rating: '4.8',
      reviews: '980+',
      imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
      description: 'Futuristic Burj Khalifa skyline, luxury shopping, and desert safaris.',
    },
    {
      id: 'dest-kl',
      name: 'Kuala Lumpur',
      country: 'Malaysia',
      rating: '4.7',
      reviews: '860+',
      imageUrl: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=800&q=80',
      description: 'Iconic Petronas Twin Towers, cultural markets, and shopping.',
    },
    {
      id: 'dest-bangkok',
      name: 'Bangkok',
      country: 'Thailand',
      rating: '4.6',
      reviews: '750+',
      imageUrl: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=800&q=80',
      description: 'Vibrant street food, magnificent temples like Wat Arun, and boat cruises.',
    },
  ];

  // Quick destinations for the search dropdown
  const quickDestinations = [
    { name: 'Maldives', country: 'Maldives' },
    { name: 'Dubai', country: 'United Arab Emirates' },
    { name: 'Kuala Lumpur', country: 'Malaysia' },
    { name: 'Bangkok', country: 'Thailand' },
    { name: 'Bali', country: 'Indonesia' },
    { name: 'Singapore', country: 'Singapore' },
  ];

  // Featured 4 Tour Packages for homepage
  const featuredPackages = useMemo(() => {
    return packages.slice(0, 4);
  }, [packages]);

  const handlePlanMyTripSubmit = () => {
    const dest = selectedDest || searchQuery || 'Maldives';
    const dates = selectedDates || 'Upcoming Vacation';
    const travelers = `${travelerCount} Traveler${travelerCount > 1 ? 's' : ''}, ${travelClass}`;
    
    if (onNavigateToView) {
      onNavigateToView('planner');
    }
    onPlanTripPrompt(`Trip to ${dest} for ${travelers} during ${dates}`);
  };

  const handleCardClick = (destName: string) => {
    const matched = destinations.find((d) => d.name.toLowerCase() === destName.toLowerCase());
    if (matched) {
      onSelectDestination(matched);
    } else {
      onQuickGenerateItinerary(destName);
    }
  };

  // Search Results preview
  const searchResults = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return [];
    return destinations
      .filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.country.toLowerCase().includes(q) ||
          d.description.toLowerCase().includes(q)
      )
      .slice(0, 5);
  }, [searchQuery, destinations]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    if (searchResults.length > 0) {
      onSelectDestination(searchResults[0]);
    } else {
      if (onNavigateToView) {
        onNavigateToView('destinations');
      }
    }
  };

  // 4 Travel Buddies Profiles
  const sampleBuddies = [
    {
      id: 'buddy-1',
      name: 'Nusrat Jahan',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      destination: 'Bali, Indonesia',
      dates: 'Oct 15 – Oct 22',
      style: 'Culture & Photography',
    },
    {
      id: 'buddy-2',
      name: 'Tanvir Hasan',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      destination: 'Bangkok, Thailand',
      dates: 'Nov 05 – Nov 12',
      style: 'Food & Sightseeing',
    },
    {
      id: 'buddy-3',
      name: 'Sadia Rahman',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
      destination: 'Kuala Lumpur, Malaysia',
      dates: 'Dec 01 – Dec 07',
      style: 'Shopping & Leisure',
    },
    {
      id: 'buddy-4',
      name: 'Farhan Ahmed',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      destination: 'Dubai, UAE',
      dates: 'Nov 20 – Nov 27',
      style: 'Adventure & Desert Safari',
    },
  ];

  // 3 Testimonials
  const testimonials = [
    {
      name: 'Raisa Chowdhury',
      destination: 'Trip to Maldives',
      rating: 5,
      photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
      review: 'Azraq Tours organized our Maldives resort stay and speed boat transfers smoothly. The price was transparent with zero hidden fees.',
    },
    {
      name: 'Shakil Mahmud',
      destination: 'Trip to Dubai',
      rating: 5,
      photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80',
      review: 'Secured our UAE tourist visa in 48 hours and provided the best group airfares from Dhaka. Extremely responsive and reliable.',
    },
    {
      name: 'Anika Tabassum',
      destination: 'Family Trip to Thailand',
      rating: 5,
      photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
      review: 'Our Bangkok and Pattaya holiday package was thoroughly arranged. Punctual private drivers, great hotels, and helpful travel tips.',
    },
  ];

  return (
    <div className="w-full bg-[#F4F8FA] text-slate-900 flex flex-col gap-12 sm:gap-16 pb-20">
      {/* 1. HERO SECTION: Full-Screen Natural Thai Limestone Karst & Turquoise Ocean Background */}
      <section className="relative w-full min-h-[580px] sm:min-h-[640px] lg:min-h-[700px] flex items-center bg-[#071A33] text-white overflow-visible">
        {/* Full-Bleed High Resolution Natural Landscape Photograph */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=2400&q=85"
            alt="Lush tropical limestone karst cliffs with traditional longtail boat on turquoise ocean"
            className="w-full h-full object-cover object-center transform scale-100"
          />
          {/* Subtle natural lighting overlays for perfect readability while maintaining vibrant photography */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#071A33]/90 via-[#071A33]/55 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#071A33]/70 via-transparent to-transparent" />
        </div>

        {/* Center-Left Hero Content with Generous Whitespace */}
        <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="max-w-2xl text-left space-y-6">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.1] font-sans">
              Your Gateway to<br />Curated Asian Escapes
            </h1>

            <p className="text-base sm:text-lg text-slate-200 leading-relaxed font-normal max-w-xl">
              Personalized flights, visas, and itineraries crafted<br className="hidden sm:inline" /> for Bangladeshi travelers.
            </p>

            {/* Exactly Two Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => {
                  if (onOpenQuote) onOpenQuote();
                  else if (onNavigateToView) onNavigateToView('flights');
                }}
                className="px-7 py-3.5 rounded-xl bg-[#0D6EFD] hover:bg-blue-600 text-white font-bold text-base shadow-lg hover:shadow-blue-500/25 transition-all flex items-center justify-center gap-2.5 cursor-pointer active:scale-95"
              >
                <span>Request a Quote</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  const el = document.getElementById('popular-destinations');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                  else if (onNavigateToView) onNavigateToView('destinations');
                }}
                className="px-6 py-3.5 rounded-full bg-[#071A33]/40 hover:bg-[#071A33]/60 text-white backdrop-blur-md border border-white/30 hover:border-white/60 font-semibold text-base transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <span>Explore Destinations</span>
                <MapPin className="w-4 h-4 text-sky-300" />
              </button>
            </div>
          </div>
        </div>

        {/* 2. FLOATING DARK BLUE BOOKING / SEARCH BAR (Overlapping bottom of Hero) */}
        <div className="absolute -bottom-12 left-0 right-0 z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#0B1E38]/95 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-slate-700/60 shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              {/* Section 1: Where do you want to go? */}
              <div ref={destMenuRef} className="relative md:col-span-4">
                <button
                  type="button"
                  onClick={() => {
                    setOpenDestMenu(!openDestMenu);
                    setOpenDateMenu(false);
                    setOpenTravelerMenu(false);
                  }}
                  className="w-full text-left p-3 rounded-xl bg-slate-900/60 hover:bg-slate-900/80 border border-slate-700/60 flex items-center justify-between gap-3 cursor-pointer transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <MapPin className="w-5 h-5 text-sky-400 shrink-0" />
                    <div className="truncate">
                      <p className="text-xs text-slate-300 font-medium">Where do you want to go?</p>
                      <p className="text-sm font-semibold text-white truncate">
                        {selectedDest || 'Search destinations'}
                      </p>
                    </div>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-white shrink-0" />
                </button>

                {/* Destination Dropdown */}
                {openDestMenu && (
                  <div className="absolute top-full mt-2 left-0 w-full sm:w-80 bg-[#0B1E38] border border-slate-700 rounded-xl shadow-2xl p-3 z-50 animate-fadeIn space-y-2">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-1">
                      Popular Asian Escapes
                    </p>
                    <div className="grid grid-cols-1 gap-1">
                      {quickDestinations.map((d) => (
                        <button
                          key={d.name}
                          onClick={() => {
                            setSelectedDest(d.name);
                            setOpenDestMenu(false);
                          }}
                          className="flex items-center justify-between px-3 py-2 rounded-lg text-sm text-slate-200 hover:text-white hover:bg-blue-600/30 transition-colors text-left cursor-pointer"
                        >
                          <span className="font-semibold">{d.name}</span>
                          <span className="text-xs text-slate-400">{d.country}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Section 2: Travel dates */}
              <div ref={dateMenuRef} className="relative md:col-span-3">
                <button
                  type="button"
                  onClick={() => {
                    setOpenDateMenu(!openDateMenu);
                    setOpenDestMenu(false);
                    setOpenTravelerMenu(false);
                  }}
                  className="w-full text-left p-3 rounded-xl bg-slate-900/60 hover:bg-slate-900/80 border border-slate-700/60 flex items-center justify-between gap-3 cursor-pointer transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Calendar className="w-5 h-5 text-sky-400 shrink-0" />
                    <div className="truncate">
                      <p className="text-xs text-slate-300 font-medium">Travel dates</p>
                      <p className="text-sm font-semibold text-white truncate">
                        {selectedDates || 'Select dates'}
                      </p>
                    </div>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-white shrink-0" />
                </button>

                {/* Date Presets Dropdown */}
                {openDateMenu && (
                  <div className="absolute top-full mt-2 left-0 w-full sm:w-72 bg-[#0B1E38] border border-slate-700 rounded-xl shadow-2xl p-3 z-50 animate-fadeIn space-y-1">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-1 mb-2">
                      Quick Seasons & Windows
                    </p>
                    {[
                      'Upcoming Weekend Getaway',
                      'Next Month (Flexible 5-7 Days)',
                      'Winter Vacation (Dec – Jan)',
                      'Upcoming Eid Holiday Break',
                    ].map((season) => (
                      <button
                        key={season}
                        onClick={() => {
                          setSelectedDates(season);
                          setOpenDateMenu(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-200 hover:text-white hover:bg-blue-600/30 transition-colors cursor-pointer"
                      >
                        {season}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Section 3: Travelers & Class */}
              <div ref={travelerMenuRef} className="relative md:col-span-3">
                <button
                  type="button"
                  onClick={() => {
                    setOpenTravelerMenu(!openTravelerMenu);
                    setOpenDestMenu(false);
                    setOpenDateMenu(false);
                  }}
                  className="w-full text-left p-3 rounded-xl bg-slate-900/60 hover:bg-slate-900/80 border border-slate-700/60 flex items-center justify-between gap-3 cursor-pointer transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Users className="w-5 h-5 text-sky-400 shrink-0" />
                    <div className="truncate">
                      <p className="text-xs text-slate-300 font-medium">Travelers</p>
                      <p className="text-sm font-semibold text-white truncate">
                        {travelerCount} Traveler{travelerCount > 1 ? 's' : ''}, {travelClass}
                      </p>
                    </div>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-white shrink-0" />
                </button>

                {/* Traveler selection Popover */}
                {openTravelerMenu && (
                  <div className="absolute top-full mt-2 left-0 w-full sm:w-72 bg-[#0B1E38] border border-slate-700 rounded-xl shadow-2xl p-4 z-50 animate-fadeIn space-y-3 text-white">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold">Number of Travelers</span>
                      <div className="flex items-center gap-2 bg-slate-800 rounded-lg p-1">
                        <button
                          onClick={() => setTravelerCount(Math.max(1, travelerCount - 1))}
                          className="w-7 h-7 rounded bg-slate-700 hover:bg-slate-600 text-white flex items-center justify-center font-bold"
                        >
                          -
                        </button>
                        <span className="w-6 text-center font-bold text-sm">{travelerCount}</span>
                        <button
                          onClick={() => setTravelerCount(travelerCount + 1)}
                          className="w-7 h-7 rounded bg-slate-700 hover:bg-slate-600 text-white flex items-center justify-center font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-700">
                      <p className="text-xs font-semibold text-slate-400 mb-1.5">Cabin Preference</p>
                      <div className="grid grid-cols-2 gap-1.5">
                        {['Economy', 'Business'].map((cls) => (
                          <button
                            key={cls}
                            onClick={() => {
                              setTravelClass(cls);
                              setOpenTravelerMenu(false);
                            }}
                            className={`py-1.5 px-3 rounded-lg text-xs font-semibold transition-colors ${
                              travelClass === cls
                                ? 'bg-[#0D6EFD] text-white'
                                : 'bg-slate-800 text-slate-300 hover:text-white'
                            }`}
                          >
                            {cls}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Section 4: Plan my trip Button */}
              <div className="md:col-span-2">
                <button
                  type="button"
                  onClick={handlePlanMyTripSubmit}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#0D6EFD] hover:bg-blue-600 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <span>Plan my trip</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. VALUE PROPOSITION / FEATURE HIGHLIGHTS BAR */}
      <section className="mt-14 sm:mt-16 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 py-4">
          {/* Personalized Pricing */}
          <div className="flex items-center gap-4 p-3 sm:p-4 rounded-2xl bg-white/70 border border-slate-200/60 shadow-xs hover:shadow-sm transition-shadow">
            <div className="w-12 h-12 rounded-full bg-teal-50/80 text-teal-600 flex items-center justify-center shrink-0">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#071A33]">Personalized Pricing</h3>
              <p className="text-xs text-slate-500 font-medium">Quotes tailored to you</p>
            </div>
          </div>

          {/* Visa Assistance */}
          <div className="flex items-center gap-4 p-3 sm:p-4 rounded-2xl bg-white/70 border border-slate-200/60 shadow-xs hover:shadow-sm transition-shadow">
            <div className="w-12 h-12 rounded-full bg-teal-50/80 text-teal-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#071A33]">Visa Assistance</h3>
              <p className="text-xs text-slate-500 font-medium">End-to-end visa support</p>
            </div>
          </div>

          {/* Top Airline Options */}
          <div className="flex items-center gap-4 p-3 sm:p-4 rounded-2xl bg-white/70 border border-slate-200/60 shadow-xs hover:shadow-sm transition-shadow">
            <div className="w-12 h-12 rounded-full bg-teal-50/80 text-teal-600 flex items-center justify-center shrink-0">
              <Plane className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#071A33]">Top Airline Options</h3>
              <p className="text-xs text-slate-500 font-medium">Best routes, best fares</p>
            </div>
          </div>

          {/* 24/7 Travel Support */}
          <div className="flex items-center gap-4 p-3 sm:p-4 rounded-2xl bg-white/70 border border-slate-200/60 shadow-xs hover:shadow-sm transition-shadow">
            <div className="w-12 h-12 rounded-full bg-teal-50/80 text-teal-600 flex items-center justify-center shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#071A33]">24/7 Travel Support</h3>
              <p className="text-xs text-slate-500 font-medium">We're here anytime</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. POPULAR DESTINATIONS FOR BANGLADESHI TRAVELERS (Exact 4 Card Layout) */}
      <section id="popular-destinations" className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#071A33] tracking-tight font-sans">
              Popular destinations for Bangladeshi travelers
            </h2>
            <p className="text-sm text-slate-500">
              Handpicked places, unforgettable experiences.
            </p>
          </div>

          <button
            onClick={() => {
              if (onNavigateToView) onNavigateToView('destinations');
            }}
            className="inline-flex items-center gap-1 text-sm font-bold text-[#0D6EFD] hover:text-blue-700 transition-colors cursor-pointer self-start sm:self-auto"
          >
            <span>View all destinations</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* 4 Card Destination Grid matching user image layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bangladeshiCuratedDestinations.map((dest) => (
            <div
              key={dest.id}
              onClick={() => handleCardClick(dest.name)}
              className="group bg-white rounded-2xl overflow-hidden shadow-xs hover:shadow-xl border border-slate-200/80 transition-all duration-300 cursor-pointer flex flex-col"
            >
              {/* Destination Image with top-left badge */}
              <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-100">
                <img
                  src={dest.imageUrl}
                  alt={dest.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                {/* Top-Left Location Pill */}
                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-white text-xs font-semibold flex items-center gap-1 shadow-sm">
                  <MapPin className="w-3 h-3 text-white" />
                  <span>{dest.name}</span>
                </div>
              </div>

              {/* Card Footer Details */}
              <div className="p-4 sm:p-5 flex items-center justify-between gap-2">
                <div>
                  <h3 className="text-base font-bold text-[#071A33] tracking-tight group-hover:text-[#0D6EFD] transition-colors">
                    {dest.name}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="text-xs font-bold text-slate-800">{dest.rating}</span>
                    <span className="text-xs text-slate-400">({dest.reviews})</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs font-bold text-[#0D6EFD] group-hover:text-blue-700 transition-colors">
                  <span>Explore</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. FULL-WIDTH VISUAL BREAK: "Discover the World" (Aerial Tropical Island Photograph) */}
      <section className="relative w-full h-[400px] sm:h-[480px] overflow-hidden my-4">
        <img
          src="https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=2400&q=85"
          alt="Aerial tropical island lagoon, pristine turquoise waters and white sand reef"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
            <div className="max-w-xl text-white space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-sky-300 block">
                Pristine Escapes
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
                Discover the World
              </h2>
              <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
                From untouched island beaches to lush tropical rainforests, explore breathtaking sanctuaries tailored for unforgettable journeys.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => {
                    if (onNavigateToView) onNavigateToView('destinations');
                  }}
                  className="px-6 py-3 rounded-xl bg-white text-[#071A33] hover:bg-slate-100 font-bold text-sm shadow-md transition-colors cursor-pointer"
                >
                  Explore All Destinations
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. TRAVEL SERVICES (4 Clean Service Cards) */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#071A33] tracking-tight font-sans">
            Comprehensive Travel Services
          </h2>
          <p className="text-sm text-slate-500">
            Dedicated solutions designed for hassle-free leisure and business trips.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Flight Assistance */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4 flex flex-col justify-between hover:border-[#0D6EFD]/40 transition-colors">
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-xl bg-blue-50 text-[#0D6EFD] flex items-center justify-center">
                <Plane className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#071A33]">Flight Assistance</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Flight search, quotation and booking support across top international airlines.
              </p>
            </div>
            <button
              onClick={() => {
                if (onNavigateToView) onNavigateToView('flights');
                else if (onOpenFlightModal) onOpenFlightModal();
              }}
              className="text-xs font-bold text-[#0D6EFD] hover:underline flex items-center gap-1 cursor-pointer pt-2"
            >
              <span>Get Flight Quote</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Visa Assistance */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4 flex flex-col justify-between hover:border-teal-500/40 transition-colors">
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#071A33]">Visa Assistance</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Visa requirements, documentation checklist and application submission guidance.
              </p>
            </div>
            <button
              onClick={() => {
                if (onNavigateToView) onNavigateToView('visa');
                else if (onOpenVisaModal) onOpenVisaModal();
              }}
              className="text-xs font-bold text-teal-700 hover:underline flex items-center gap-1 cursor-pointer pt-2"
            >
              <span>Check Visa Info</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Tour Packages */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4 flex flex-col justify-between hover:border-amber-500/40 transition-colors">
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Package className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#071A33]">Tour Packages</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Curated travel packages for popular Asian destinations with verified accommodations.
              </p>
            </div>
            <button
              onClick={() => {
                if (onNavigateToView) onNavigateToView('packages');
              }}
              className="text-xs font-bold text-amber-700 hover:underline flex items-center gap-1 cursor-pointer pt-2"
            >
              <span>Browse Packages</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Custom Trips */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4 flex flex-col justify-between hover:border-purple-500/40 transition-colors">
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#071A33]">Custom Trips</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Personalized itineraries tailored to your schedule, family preferences, and budget.
              </p>
            </div>
            <button
              onClick={() => {
                if (onNavigateToView) onNavigateToView('planner');
                else onPlanTripPrompt('Custom itinerary');
              }}
              className="text-xs font-bold text-purple-700 hover:underline flex items-center gap-1 cursor-pointer pt-2"
            >
              <span>Plan Custom Trip</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* 6. PACKAGES: Light Background + Beautiful Destination Images */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1.5">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#071A33] tracking-tight font-sans">
              Curated Tour Packages
            </h2>
            <p className="text-sm text-slate-500">
              All-inclusive holiday itineraries with verified hotels, guides, and transfers.
            </p>
          </div>

          <button
            onClick={() => {
              if (onNavigateToView) onNavigateToView('packages');
            }}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#0D6EFD] hover:text-blue-700 transition-colors cursor-pointer self-start sm:self-auto"
          >
            <span>View All Packages</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredPackages.map((pkg) => {
            const pkgTitle = pkg.package_name || (pkg as any).title || 'Curated Package';
            const pkgDest = pkg.destination_name || pkg.country || (pkg as any).destination || 'Asia';
            const pkgPrice = pkg.price || (pkg as any).priceStartingFrom || 0;
            const pkgDuration = pkg.duration || ((pkg as any).durationDays ? `${(pkg as any).durationDays}D / ${(pkg as any).durationNights || 0}N` : 'Custom');
            const pkgImage = (pkg.images && pkg.images.length > 0) ? pkg.images[0] : 'https://images.unsplash.com/photo-1506665531195-3566af2b4dfa?auto=format&fit=crop&w=800&q=75';

            return (
              <div
                key={pkg.id}
                className="group bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-md hover:border-[#0D6EFD]/50 transition-all duration-300 flex flex-col justify-between"
              >
                <div
                  className="relative h-48 overflow-hidden bg-slate-100 cursor-pointer"
                  onClick={() => setActivePackageModal(pkg)}
                >
                  <img
                    src={getOptimizedUnsplashUrl(pkgImage, 500, 75)}
                    alt={pkgTitle}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-[#071A33]/80 backdrop-blur-xs text-white text-[11px] font-semibold">
                    {pkgDuration}
                  </div>
                </div>

                <div className="p-4 flex flex-col flex-1 justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-[#0D6EFD] uppercase tracking-wider block">
                      {pkgDest}
                    </span>
                    <h3
                      onClick={() => setActivePackageModal(pkg)}
                      className="text-sm font-bold text-[#071A33] group-hover:text-[#0D6EFD] transition-colors cursor-pointer line-clamp-1"
                    >
                      {pkgTitle}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {pkg.description || (pkg as any).shortDescription}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block">From</span>
                      <span className="text-xs font-bold text-slate-900 font-mono">
                        BDT {Number(pkgPrice || 0).toLocaleString()}
                      </span>
                    </div>

                    <button
                      onClick={() => setActivePackageModal(pkg)}
                      className="px-3 py-1.5 rounded-lg bg-[#0D6EFD] text-white font-bold text-xs hover:bg-blue-700 transition-colors cursor-pointer"
                    >
                      View Package
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. VISA: Minimal Clean Section */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-12 shadow-xs space-y-8">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-bold text-[#0D6EFD] uppercase tracking-wider">
              Stress-Free Travel
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#071A33] tracking-tight font-sans">
              Visa Assistance Made Simple
            </h2>
            <p className="text-sm text-slate-600">
              Clear documentation requirements, expert embassy preparation, and smooth processing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <span className="text-xs font-extrabold text-[#0D6EFD] uppercase">Step 1</span>
              <h3 className="text-base font-bold text-[#071A33]">Choose Destination</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Select your intended travel destination to review applicable visa types and validity.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <span className="text-xs font-extrabold text-[#0D6EFD] uppercase">Step 2</span>
              <h3 className="text-base font-bold text-[#071A33]">Check Requirements</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Review passport validity, photo specifications, NOC, and bank statement checklists.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <span className="text-xs font-extrabold text-[#0D6EFD] uppercase">Step 3</span>
              <h3 className="text-base font-bold text-[#071A33]">Get Assistance</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Submit documents to our Dhaka desk for verified submission and tracking.
              </p>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100">
            <p className="text-xs text-slate-500">
              Guidance available for Thailand, Malaysia, Singapore, UAE, Maldives, and more.
            </p>
            <button
              onClick={() => {
                if (onNavigateToView) onNavigateToView('visa');
                else if (onOpenVisaModal) onOpenVisaModal();
              }}
              className="px-6 py-3 rounded-xl bg-[#0D6EFD] hover:bg-blue-700 text-white font-bold text-sm shadow-xs transition-colors cursor-pointer"
            >
              Check Visa Requirements
            </button>
          </div>
        </div>
      </section>

      {/* 8. FULL-WIDTH VISUAL BREAK: "Your Journey Starts Here" (Mountain Sunset Photograph) */}
      <section className="relative w-full h-[400px] sm:h-[480px] overflow-hidden my-4">
        <img
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2400&q=85"
          alt="Majestic mountain peaks bathed in golden sunset glow"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
            <div className="max-w-xl text-white space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-sky-300 block">
                Inspiring Horizons
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
                Your Journey Starts Here
              </h2>
              <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
                Every memorable adventure begins with a vision. Let our travel experts guide your route from itinerary planning to the final flight home.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => {
                    if (onNavigateToView) onNavigateToView('planner');
                    else onPlanTripPrompt('Plan my trip');
                  }}
                  className="px-6 py-3 rounded-xl bg-white text-[#071A33] hover:bg-slate-100 font-bold text-sm shadow-md transition-colors cursor-pointer"
                >
                  Start Custom Itinerary
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. TRAVEL BUDDIES: Clean Social-Style Cards */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1.5">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#071A33] tracking-tight font-sans">
              Travel Buddies
            </h2>
            <p className="text-sm text-slate-500">
              Connect with fellow Bangladeshi travelers visiting the same destinations.
            </p>
          </div>

          <button
            onClick={() => {
              if (onNavigateToView) onNavigateToView('feed');
            }}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#0D6EFD] hover:text-blue-700 transition-colors cursor-pointer self-start sm:self-auto"
          >
            <span>Find More Travel Buddies</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {sampleBuddies.map((buddy) => (
            <div
              key={buddy.id}
              className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between gap-4 hover:border-[#0D6EFD]/40 transition-colors"
            >
              <div className="flex items-center gap-3">
                <img
                  src={buddy.avatar}
                  alt={buddy.name}
                  className="w-12 h-12 rounded-full object-cover border border-slate-200 shadow-xs"
                />
                <div>
                  <h3 className="text-sm font-bold text-[#071A33]">{buddy.name}</h3>
                  <p className="text-xs text-slate-500 font-medium">{buddy.destination}</p>
                </div>
              </div>

              <div className="space-y-1 bg-slate-50 p-2.5 rounded-xl text-xs">
                <div className="flex items-center gap-1.5 text-slate-600">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{buddy.dates}</span>
                </div>
                <div className="text-[11px] text-[#0D6EFD] font-semibold">
                  {buddy.style}
                </div>
              </div>

              <button
                onClick={() => {
                  requireAuth({ type: 'social_action', label: 'Connect with Travel Buddy' }, () => {
                    showToast(`Connection request sent to ${buddy.name}!`, 'success');
                  });
                }}
                className="w-full py-2 rounded-xl border border-slate-200 hover:border-[#0D6EFD] hover:bg-blue-50 text-[#071A33] font-bold text-xs transition-colors cursor-pointer"
              >
                Connect
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 10. WHY CHOOSE AZRAQ (4-Item Credibility Section) */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#071A33] tracking-tight font-sans">
            Why Choose Azraq Tours & Travels
          </h2>
          <p className="text-sm text-slate-500">
            Committed to clarity, honesty, and professional travel execution.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2.5">
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-[#0D6EFD] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-[#071A33]">Trusted Travel Support</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Professional assistance throughout your journey from booking to return.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2.5">
            <div className="w-11 h-11 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-[#071A33]">Personalized Service</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Trips designed around your exact schedule, family needs, and budget.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2.5">
            <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-[#071A33]">Visa Guidance</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Clear documentation and application support for high approval success.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2.5">
            <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-[#071A33]">Local Travel Expertise</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Practical destination knowledge and vetted hotel partnerships.
            </p>
          </div>
        </div>
      </section>

      {/* 11. TESTIMONIALS: Soft Neutral Background */}
      <section className="w-full bg-slate-100/70 py-16">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#071A33] tracking-tight font-sans">
              What Our Travelers Say
            </h2>
            <p className="text-sm text-slate-500">
              Real feedback from Bangladeshi travelers who booked with Azraq Tours.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((item, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(item.rating)].map((_, s) => (
                      <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                    "{item.review}"
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                  <img
                    src={item.photo}
                    alt={item.name}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200"
                  />
                  <div>
                    <h3 className="text-xs font-bold text-[#071A33]">{item.name}</h3>
                    <p className="text-[11px] text-slate-500">{item.destination}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 12. FINAL CTA: Full-Width Sunset/Nature Background Image */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden text-white p-8 sm:p-14 text-center space-y-6 shadow-2xl">
          {/* Panoramic Sunset Photography */}
          <img
            src="https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=2400&q=85"
            alt="Golden sunset ocean horizon and peaceful evening shoreline"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/55 to-black/40" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
              Ready to Plan Your Next Journey?
            </h2>
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
              Let our travel specialists craft a personalized itinerary with best-value airfares and verified visa documentation.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  if (onNavigateToView) onNavigateToView('planner');
                  else onPlanTripPrompt('Plan my next trip');
                }}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#0D6EFD] hover:bg-blue-600 text-white font-bold text-sm sm:text-base shadow-lg transition-all cursor-pointer active:scale-98"
              >
                Plan My Trip
              </button>
              <button
                onClick={() => {
                  if (onNavigateToView) onNavigateToView('contact');
                }}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white/20 hover:bg-white/30 text-white backdrop-blur-md border border-white/30 font-bold text-sm sm:text-base transition-all cursor-pointer active:scale-98"
              >
                Contact Our Desk
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

