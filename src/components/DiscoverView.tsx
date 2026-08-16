import React, { useState, useMemo } from 'react';
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
  ChevronRight,
  Tag,
  Headphones,
  ExternalLink,
  MessageCircle,
  CheckCircle2,
} from 'lucide-react';
import { getOptimizedUnsplashUrl } from '../utils/imageOptimization';
import { AzraqTripFinder, FlightSearchParams } from './AzraqTripFinder';
import { AZRAQ_AGENCY_CONFIG } from '../data/agencyConfig';
import { POPULAR_AIRPORTS } from '../data/flightsData';

interface DiscoverViewProps {
  destinations: Destination[];
  onSelectDestination: (destination: Destination) => void;
  onPlanTripPrompt: (promptText: string) => void;
  onQuickGenerateItinerary: (destName: string) => void;
  onNavigateToView?: (view: string, extra?: any) => void;
  onSearchFlights?: (params: FlightSearchParams) => void;
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
  onSearchFlights,
  onOpenVisaModal,
  onOpenFlightModal,
  onOpenQuote,
}) => {
  const { requireAuth, showToast } = useAuth();
  const { packages, setActivePackageModal } = usePackages();

  // Curated 4 Popular Destinations for Bangladeshi travelers matching user's exact aesthetic
  const bangladeshiCuratedDestinations = useMemo(
    () => [
      {
        id: 'dest-bangkok',
        name: 'Bangkok',
        country: 'Thailand',
        code: 'BKK',
        rating: 4.8,
        reviews: '1,420 reviews',
        imageUrl:
          'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=800&q=80',
        routePrice: 'BDT 26,500',
        visaType: 'Sticker / eVisa',
      },
      {
        id: 'dest-dubai',
        name: 'Dubai',
        country: 'UAE',
        code: 'DXB',
        rating: 4.9,
        reviews: '2,180 reviews',
        imageUrl:
          'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
        routePrice: 'BDT 48,000',
        visaType: '30/60-Day Tourist',
      },
      {
        id: 'dest-kuala-lumpur',
        name: 'Kuala Lumpur',
        country: 'Malaysia',
        code: 'KUL',
        rating: 4.7,
        reviews: '1,890 reviews',
        imageUrl:
          'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=800&q=80',
        routePrice: 'BDT 32,000',
        visaType: 'eVisa Support',
      },
      {
        id: 'dest-maldives',
        name: 'Maldives',
        country: 'Maldives',
        code: 'MLE',
        rating: 4.9,
        reviews: '960 reviews',
        imageUrl:
          'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800&q=80',
        routePrice: 'BDT 43,000',
        visaType: 'Free 30-Day On Arrival',
      },
    ],
    []
  );

  // Featured Tour Packages
  const featuredPackages = useMemo(() => {
    return packages.slice(0, 4);
  }, [packages]);

  const sampleBuddies = [
    {
      id: 'b1',
      name: 'Tanvir Hossain',
      destination: 'Bangkok, Thailand',
      dates: 'Nov 12 – 18',
      style: 'Culinary & Shopping',
      avatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    },
    {
      id: 'b2',
      name: 'Nusrat Jahan',
      destination: 'Kuala Lumpur, Malaysia',
      dates: 'Dec 02 – 08',
      style: 'Family & City Walk',
      avatar:
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    },
    {
      id: 'b3',
      name: 'Rahat Chowdhury',
      destination: 'Dubai & Abu Dhabi',
      dates: 'Nov 20 – 27',
      style: 'Luxury & Adventure',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    },
    {
      id: 'b4',
      name: 'Samira Ahmed',
      destination: 'Malé, Maldives',
      dates: 'Dec 15 – 20',
      style: 'Resort & Relaxation',
      avatar:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    },
  ];

  const testimonials = [
    {
      name: 'Farhan Rahman',
      destination: 'Family Holiday in Bangkok & Pattaya',
      review:
        'Azraq handled our 6-member family visas and flights flawlessly. Everything from the private airport transfer to the halal dining recommendations was spot on.',
      rating: 5,
      photo:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    },
    {
      name: 'Sadia Karim',
      destination: 'Couple Honeymoon in Maldives',
      review:
        'The water villa package booked through Azraq was unbelievable value. They verified all speed boat transfers and flight layovers from Dhaka ahead of time.',
      rating: 5,
      photo:
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    },
    {
      name: 'Dr. Tariqul Islam',
      destination: 'Medical & Leisure in Singapore',
      review:
        'Fast e-visa processing and immediate flight rebooking support when our return schedule changed. True professional concierge service for Bangladeshi professionals.',
      rating: 5,
      photo:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
    },
  ];

  const handleCardClick = (destName: string) => {
    const found = destinations.find(
      (d) =>
        d.name.toLowerCase().includes(destName.toLowerCase()) ||
        d.country.toLowerCase().includes(destName.toLowerCase())
    );
    if (found) {
      onSelectDestination(found);
    } else {
      onQuickGenerateItinerary(destName);
    }
  };

  const handleFlightSearchTrigger = (params: FlightSearchParams) => {
    if (onSearchFlights) {
      onSearchFlights(params);
    } else if (onNavigateToView) {
      onNavigateToView('flights', { params });
    }
  };

  return (
    <div className="w-full bg-[#F4F8FA] text-slate-900 flex flex-col gap-12 sm:gap-16 pb-20">
      {/* 1. HERO SECTION: Full-Screen Natural Thai Limestone Karst & Turquoise Ocean Background */}
      <section className="relative w-full min-h-[620px] sm:min-h-[680px] lg:min-h-[760px] flex flex-col justify-between bg-[#071A33] text-white overflow-visible pb-16">
        {/* Full-Bleed High Resolution Natural Landscape Photograph */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=2400&q=85"
            alt="Lush tropical limestone karst cliffs with traditional longtail boat on turquoise ocean"
            className="w-full h-full object-cover object-center transform scale-100"
          />
          {/* Natural lighting overlays for perfect readability while maintaining vibrant photography */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#071A33]/95 via-[#071A33]/65 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#071A33]/85 via-transparent to-transparent" />
        </div>

        {/* Center-Left Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-8">
          <div className="max-w-2xl text-left space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-sky-400/30 text-sky-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse"></span>
              <span>Official Dhaka Travel Concierge & Booking Engine</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.1] font-sans">
              Your Gateway to<br />Curated Asian Escapes
            </h1>

            <p className="text-base sm:text-lg text-slate-200 leading-relaxed font-normal max-w-xl">
              Compare routes, discover better fares, and let Azraq arrange the rest of your journey — personalized visas, vetted hotels, and bespoke itineraries for Bangladeshi travelers.
            </p>

            {/* Exactly Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <button
                onClick={() => {
                  if (onNavigateToView) onNavigateToView('flights');
                }}
                className="px-7 py-3.5 rounded-xl bg-[#0D6EFD] hover:bg-blue-600 text-white font-bold text-base shadow-lg hover:shadow-blue-500/25 transition-all flex items-center justify-center gap-2.5 cursor-pointer active:scale-95"
              >
                <Plane className="w-4 h-4" />
                <span>Search Flights</span>
              </button>

              <button
                onClick={() => {
                  if (onNavigateToView) onNavigateToView('planner');
                  else onPlanTripPrompt('Custom Asian Itinerary');
                }}
                className="px-6 py-3.5 rounded-xl bg-white/15 hover:bg-white/25 text-white backdrop-blur-md border border-white/30 font-semibold text-base transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-purple-300" />
                <span>Plan a Custom Trip</span>
              </button>

              <button
                onClick={() => {
                  if (onOpenQuote) onOpenQuote();
                }}
                className="px-5 py-3.5 rounded-xl text-slate-300 hover:text-white font-semibold text-sm hover:underline cursor-pointer"
              >
                Request a Quote
              </button>
            </div>
          </div>
        </div>

        {/* AZRAQ TRIP FINDER (Interactive Booking Module Embedded in Hero) */}
        <div className="relative z-20 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-4">
          <AzraqTripFinder
            initialMode="flights"
            onSearchFlights={handleFlightSearchTrigger}
            onNavigateToView={(view, extra) => {
              if (extra?.prompt) onPlanTripPrompt(extra.prompt);
              else if (onNavigateToView) onNavigateToView(view);
            }}
            onOpenVisaModal={onOpenVisaModal}
            onOpenQuoteModal={onOpenQuote}
          />
        </div>
      </section>

      {/* 2. VALUE PROPOSITION / FEATURE HIGHLIGHTS BAR */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 py-2">
          {/* Personalized Pricing */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-[#0D6EFD] flex items-center justify-center shrink-0">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#071A33]">Personalized Pricing</h3>
              <p className="text-xs text-slate-500 font-medium">Quotes tailored to you</p>
            </div>
          </div>

          {/* Visa Assistance */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#071A33]">Visa Assistance</h3>
              <p className="text-xs text-slate-500 font-medium">End-to-end visa support</p>
            </div>
          </div>

          {/* Top Airline Options */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Plane className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#071A33]">Top Airline Options</h3>
              <p className="text-xs text-slate-500 font-medium">Best routes, best fares</p>
            </div>
          </div>

          {/* 24/7 Travel Support */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#071A33]">24/7 Travel Support</h3>
              <p className="text-xs text-slate-500 font-medium">We're here anytime</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. POPULAR DESTINATIONS FOR BANGLADESHI TRAVELERS */}
      <section id="popular-destinations" className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#071A33] tracking-tight font-sans">
              Popular destinations for Bangladeshi travelers
            </h2>
            <p className="text-sm text-slate-500">
              Handpicked places, direct flight connections, and verified visa documentation.
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

        {/* 4 Card Destination Grid with Flight shortcut & explore action */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bangladeshiCuratedDestinations.map((dest) => (
            <div
              key={dest.id}
              className="group bg-white rounded-2xl overflow-hidden shadow-xs hover:shadow-xl border border-slate-200/80 transition-all duration-300 flex flex-col justify-between"
            >
              {/* Destination Image with top-left badge */}
              <div
                className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-100 cursor-pointer"
                onClick={() => handleCardClick(dest.name)}
              >
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

                {/* Top-Right Fare estimate */}
                <div className="absolute top-3 right-3 bg-[#071A33]/85 backdrop-blur-md px-2.5 py-1 rounded-full text-sky-300 font-mono text-[11px] font-bold shadow-sm">
                  From {dest.routePrice}
                </div>
              </div>

              {/* Card Footer Details */}
              <div className="p-4 sm:p-5 flex flex-col justify-between gap-3 flex-1">
                <div>
                  <div className="flex items-center justify-between">
                    <h3
                      onClick={() => handleCardClick(dest.name)}
                      className="text-base font-bold text-[#071A33] tracking-tight group-hover:text-[#0D6EFD] transition-colors cursor-pointer"
                    >
                      {dest.name}, {dest.country}
                    </h3>
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="text-xs font-bold text-slate-800">{dest.rating}</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Visa: {dest.visaType}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const airport = POPULAR_AIRPORTS.find((a) => a.code === dest.code) || POPULAR_AIRPORTS[4];
                      handleFlightSearchTrigger({
                        tripType: 'round',
                        origin: POPULAR_AIRPORTS[0],
                        destination: airport,
                        departureDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                        returnDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                        adults: 1,
                        children: 0,
                        infants: 0,
                        cabinClass: 'Economy',
                        currency: 'BDT',
                      });
                    }}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#0D6EFD] hover:underline cursor-pointer"
                  >
                    <Plane className="w-3.5 h-3.5" />
                    <span>Find Flights</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleCardClick(dest.name)}
                    className="text-xs font-bold text-slate-700 hover:text-[#0D6EFD] flex items-center gap-0.5 cursor-pointer"
                  >
                    <span>Details</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. "COMPARE FLIGHTS, THEN TRAVEL WITH CONFIDENCE" (Concierge & Partner Workflow) */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-xs space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="max-w-2xl space-y-2">
              <span className="text-xs font-bold text-[#0D6EFD] uppercase tracking-wider">
                Intelligent Travel Booking
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#071A33] tracking-tight font-sans">
                Compare Flights, Then Travel with Confidence
              </h2>
              <p className="text-sm text-slate-600">
                Azraq combines global airfare search via Travelpayouts with personalized Dhaka concierge care.
              </p>
            </div>

            <button
              onClick={() => {
                if (onNavigateToView) onNavigateToView('flights');
              }}
              className="px-6 py-3 rounded-xl bg-[#0D6EFD] hover:bg-blue-600 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer self-start md:self-auto"
            >
              <span>Open Flight Comparison</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* 3 Step Workflow Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#0D6EFD] flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <h3 className="text-base font-bold text-[#071A33]">Search & Compare Routes</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Real-time ticket comparison across Biman, Thai Airways, Emirates, Malaysia Airlines, and 700+ partner carriers.
                </p>
              </div>
              <span className="text-[11px] font-semibold text-[#0D6EFD]">Best market fares from Dhaka</span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <h3 className="text-base font-bold text-[#071A33]">Choose Partner or Concierge Hold</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Book directly with certified global partners or request our Dhaka travel desk to hold tickets offline on your behalf.
                </p>
              </div>
              <span className="text-[11px] font-semibold text-emerald-700">Flexible ticketing support</span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <h3 className="text-base font-bold text-[#071A33]">Complete Visas & Hotel Care</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Once your flights are settled, our specialists arrange embassy paperwork, airport transfers, and luxury accommodation.
                </p>
              </div>
              <span className="text-[11px] font-semibold text-purple-700">All-in-one travel peace of mind</span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. COMPREHENSIVE TRAVEL SERVICES (4 Clean Service Cards) */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#071A33] tracking-tight font-sans">
            Comprehensive Travel Services
          </h2>
          <p className="text-sm text-slate-500">
            Dedicated solutions designed for hassle-free leisure, business trips, and family vacations.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Partner Airfare Search */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4 flex flex-col justify-between hover:border-blue-500/40 transition-colors">
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-xl bg-blue-50 text-[#0D6EFD] flex items-center justify-center">
                <Plane className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#071A33]">Partner Airfares</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Live flight search across international carriers with transparent pricing and flexible booking options.
              </p>
            </div>
            <button
              onClick={() => {
                if (onNavigateToView) onNavigateToView('flights');
              }}
              className="text-xs font-bold text-[#0D6EFD] hover:underline flex items-center gap-1 cursor-pointer pt-2"
            >
              <span>Search Flights</span>
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
                Visa requirements, documentation checklist and application submission guidance for Asian destinations.
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
                Curated travel packages for popular Asian destinations with verified accommodations and transfers.
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
                Personalized itineraries tailored to your schedule, family preferences, and budget with Dhaka support.
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

      {/* 6. CURATED TOUR PACKAGES */}
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
            const pkgDuration =
              pkg.duration ||
              ((pkg as any).durationDays
                ? `${(pkg as any).durationDays}D / ${(pkg as any).durationNights || 0}N`
                : 'Custom');
            const pkgImage =
              pkg.images && pkg.images.length > 0
                ? pkg.images[0]
                : 'https://images.unsplash.com/photo-1506665531195-3566af2b4dfa?auto=format&fit=crop&w=800&q=75';

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

      {/* 7. VISA ASSISTANCE MADE SIMPLE */}
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
              Guidance available for Thailand, Malaysia, Singapore, UAE, Maldives, and Nepal.
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

      {/* 8. TRAVEL BUDDIES */}
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
                <div className="text-[11px] text-[#0D6EFD] font-semibold">{buddy.style}</div>
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

      {/* 9. WHY CHOOSE AZRAQ */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#071A33] tracking-tight font-sans">
            Why Choose Azraq
          </h2>
          <p className="text-sm text-slate-500">
            Committed to clarity, honesty, and professional travel execution from Bangladesh.
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

      {/* 10. TESTIMONIALS */}
      <section className="w-full bg-slate-100/70 py-16">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#071A33] tracking-tight font-sans">
              What Our Travelers Say
            </h2>
            <p className="text-sm text-slate-500">
              Real feedback from Bangladeshi travelers who booked flights and packages with Azraq.
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

      {/* 11. FINAL CTA */}
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
                  if (onNavigateToView) onNavigateToView('flights');
                }}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-sm sm:text-base shadow-lg transition-all cursor-pointer active:scale-98"
              >
                Search Flights
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
