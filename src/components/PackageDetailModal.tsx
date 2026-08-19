import React, { useState } from 'react';
import { TourPackage } from '../types';
import { getVisaFeeForDestination } from '../data/visaRequirementsData';
import {
  X,
  MapPin,
  Calendar,
  DollarSign,
  CheckCircle2,
  XCircle,
  Building2,
  Bus,
  Utensils,
  FileCheck,
  ShieldAlert,
  Send,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  Sparkles,
  Star,
  ShieldCheck,
  HeartHandshake,
  Headphones,
  Camera,
  Heart
} from 'lucide-react';
import { getOptimizedUnsplashUrl } from '../utils/imageOptimization';
import { usePackages } from '../context/PackageContext';

interface PackageDetailModalProps {
  pkg: TourPackage | null;
  onClose: () => void;
  onRequestQuote: (pkg: TourPackage) => void;
}

type TabType = 'overview' | 'itinerary' | 'inclusions' | 'reviews' | 'policies';

export const PackageDetailModal: React.FC<PackageDetailModalProps> = ({
  pkg,
  onClose,
  onRequestQuote,
}) => {
  if (!pkg) return null;

  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [expandedDay, setExpandedDay] = useState<number | string | null>(1);
  const { isPackageSaved, toggleSavePackage } = usePackages();
  const isSaved = isPackageSaved(pkg.id);

  const toggleDay = (dayNum: number | string) => {
    setExpandedDay(expandedDay === dayNum ? null : dayNum);
  };

  const heroImage =
    pkg.images && pkg.images.length > 0
      ? pkg.images[0]
      : 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80';

  const galleryImages = [
    heroImage,
    'https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=600&q=80',
  ];

  const handleWhatsApp = () => {
    const text = encodeURIComponent(
      `Hello Azraq Tours & Travels! I would like more information and booking details for: ${pkg.package_name} (${pkg.country}) - Duration: ${pkg.duration}`
    );
    window.open(`https://wa.me/8801851172032?text=${text}`, '_blank');
  };

  const tabs: { id: TabType; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'itinerary', label: 'Itinerary' },
    { id: 'inclusions', label: 'Inclusions' },
    { id: 'reviews', label: 'Reviews & Photos' },
    { id: 'policies', label: 'Visa & Policies' },
  ];

  const guestReviews = [
    {
      name: 'Rahim Chowdhury',
      city: 'Dhaka',
      rating: 5,
      date: 'Visited last month',
      comment: 'Flawless arrangements by Azraq! Visa processing was prompt and hotels were exactly as documented.',
    },
    {
      name: 'Nusrat Jahan',
      city: 'Chittagong',
      rating: 5,
      date: '2 months ago',
      comment: 'Super convenient package for our family. Transparent pricing with zero hidden fees.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden my-2 sm:my-6 max-h-[94vh] flex flex-col">
        {/* Top Control Bar */}
        <div className="absolute top-3 right-3 z-30 flex items-center gap-2">
          <button
            onClick={() => toggleSavePackage(pkg.id)}
            aria-label={isSaved ? 'Remove from saved' : 'Save to wishlist'}
            className="w-11 h-11 rounded-full bg-slate-950/80 hover:bg-slate-900 text-white border border-slate-700/70 transition-all flex items-center justify-center shadow-lg cursor-pointer active:scale-95"
          >
            <Heart className={`w-5 h-5 ${isSaved ? 'fill-rose-500 text-rose-500' : 'text-white'}`} />
          </button>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="w-11 h-11 rounded-full bg-slate-950/80 hover:bg-slate-900 text-white border border-slate-700/70 transition-all flex items-center justify-center shadow-lg cursor-pointer active:scale-95"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Container */}
        <div className="overflow-y-auto flex-1 custom-scrollbar pb-24 sm:pb-8">
          {/* Hero Banner */}
          <div className="relative h-56 sm:h-72 w-full overflow-hidden bg-slate-950">
            <img
              src={getOptimizedUnsplashUrl(heroImage, 1000, 80)}
              alt={pkg.package_name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />

            <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-sky-600 text-white shadow-md flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {pkg.destination_name}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-950/80 text-sky-300 border border-slate-700/60">
                  {pkg.country}
                </span>
                <div className="flex items-center gap-1 bg-amber-500/20 text-amber-300 border border-amber-400/40 px-2.5 py-1 rounded-full text-xs font-semibold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>4.9 / 5 (Verified)</span>
                </div>
              </div>

              <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white leading-tight">
                {pkg.package_name}
              </h1>

              <div className="flex flex-wrap items-center gap-2.5 text-xs font-semibold text-sky-200">
                <span className="flex items-center gap-1.5 bg-slate-900/90 px-3 py-1.5 rounded-lg border border-slate-700">
                  <Clock className="w-3.5 h-3.5 text-sky-400" />
                  {pkg.duration}
                </span>
                <span className="flex items-center gap-1.5 bg-slate-900/90 px-3 py-1.5 rounded-lg border border-slate-700 text-emerald-400 font-extrabold font-mono text-sm">
                  From {pkg.currency === 'BDT' ? '৳' : pkg.currency} {pkg.price.toLocaleString()} / person
                </span>
                <span className="flex items-center gap-1.5 bg-teal-950/90 px-3 py-1.5 rounded-lg border border-teal-500/40 text-teal-300 font-bold">
                  <FileCheck className="w-3.5 h-3.5 text-teal-400" />
                  Visa Fee: {pkg.visa_fee || getVisaFeeForDestination(pkg.country || pkg.destination_name)}
                </span>
              </div>
            </div>
          </div>

          {/* Sticky Tab Navigation Bar (min 48px tap targets, horizontally scrollable) */}
          <div className="sticky top-0 z-20 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-2 min-w-max py-2">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    type="button"
                    className={`min-h-[48px] px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap flex items-center justify-center ${
                      isActive
                        ? 'bg-sky-600 text-white shadow-md'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab Content Body */}
          <div className="p-4 sm:p-6 md:p-8 space-y-6">
            {/* TAB 1: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-6 animate-fadeIn">
                {/* Description */}
                <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-700/50 space-y-3">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-sky-400 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-sky-400" />
                    Trip Highlights & Summary
                  </h3>
                  <p className="text-sm sm:text-base text-slate-200 leading-relaxed">{pkg.description}</p>
                </div>

                {/* Pricing Tiers Table */}
                {pkg.pricing_tiers && pkg.pricing_tiers.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-emerald-400" />
                      Transparent Group Pricing (Per Person)
                    </h3>
                    <div className="overflow-x-auto rounded-2xl border border-slate-700/80 bg-slate-800/30">
                      <table className="w-full text-left text-xs sm:text-sm">
                        <thead className="bg-slate-800/80 text-sky-300 font-bold border-b border-slate-700/80">
                          <tr>
                            <th className="py-3.5 px-4">Group Size</th>
                            <th className="py-3.5 px-4">Price Per Person</th>
                            <th className="py-3.5 px-4">Inclusions Included</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 text-slate-200">
                          {pkg.pricing_tiers.map((tier, idx) => (
                            <tr key={idx} className="hover:bg-slate-800/50 transition-colors">
                              <td className="py-3.5 px-4 font-semibold">{tier.pax} Traveler(s)</td>
                              <td className="py-3.5 px-4 font-mono font-extrabold text-emerald-400 text-sm sm:text-base">
                                {pkg.currency === 'BDT' ? '৳' : pkg.currency} {tier.price.toLocaleString()}
                              </td>
                              <td className="py-3.5 px-4 font-medium text-slate-300">Hotels, Transfers & Tours</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Hotel, Meals, Transportation Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-700/50 space-y-1.5">
                    <div className="flex items-center gap-2 text-sky-400 font-bold text-xs uppercase tracking-wider">
                      <Building2 className="w-4 h-4" />
                      Hotel Stay
                    </div>
                    <p className="text-xs sm:text-sm text-slate-200 font-medium">{pkg.hotel || '3-4 Star Handpicked City Hotels'}</p>
                  </div>

                  <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-700/50 space-y-1.5">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                      <Utensils className="w-4 h-4" />
                      Meal Inclusions
                    </div>
                    <p className="text-xs sm:text-sm text-slate-200 font-medium">{pkg.meals || 'Daily Breakfast & Curated Lunches'}</p>
                  </div>

                  <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-700/50 space-y-1.5">
                    <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                      <Bus className="w-4 h-4" />
                      Airport & Sightseeing
                    </div>
                    <p className="text-xs sm:text-sm text-slate-200 font-medium">{pkg.transportation || 'Private AC Vehicles & Transfers'}</p>
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-800/30 border border-slate-700/40 text-xs">
                    <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                    <div>
                      <p className="font-bold text-white">100% Genuine Rates</p>
                      <p className="text-slate-400 text-[11px]">No hidden booking markups</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-800/30 border border-slate-700/40 text-xs">
                    <HeartHandshake className="w-5 h-5 text-sky-400 shrink-0" />
                    <div>
                      <p className="font-bold text-white">Free Consultation</p>
                      <p className="text-slate-400 text-[11px]">Direct itinerary customizing</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-800/30 border border-slate-700/40 text-xs">
                    <Headphones className="w-5 h-5 text-amber-400 shrink-0" />
                    <div>
                      <p className="font-bold text-white">24/7 Dhaka Support</p>
                      <p className="text-slate-400 text-[11px]">Assistance while traveling</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: ITINERARY */}
            {activeTab === 'itinerary' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-sky-400 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-sky-400" />
                    Day-by-Day Detailed Schedule
                  </h3>
                  <span className="text-xs text-slate-400 font-semibold">{pkg.duration}</span>
                </div>

                <div className="space-y-3">
                  {pkg.itinerary && pkg.itinerary.length > 0 ? (
                    pkg.itinerary.map((dayItem) => {
                      const isExpanded = expandedDay === dayItem.day;
                      return (
                        <div
                          key={dayItem.day}
                          className="bg-slate-800/40 rounded-2xl border border-slate-700/60 overflow-hidden transition-all"
                        >
                          <button
                            onClick={() => toggleDay(dayItem.day)}
                            type="button"
                            className="w-full min-h-[48px] p-4 text-left flex items-center justify-between bg-slate-800/60 hover:bg-slate-800 transition-colors cursor-pointer"
                          >
                            <div className="flex items-center gap-3">
                              <span className="px-3 py-1 rounded-xl bg-sky-600/90 text-white font-extrabold text-xs shadow-sm shrink-0">
                                Day {dayItem.day}
                              </span>
                              <span className="font-bold text-sm sm:text-base text-white">{dayItem.title}</span>
                            </div>
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4 text-sky-400 shrink-0" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                            )}
                          </button>

                          {isExpanded && (
                            <div className="p-4 sm:p-5 space-y-3 bg-slate-900/40 border-t border-slate-800">
                              <ul className="space-y-2 text-xs sm:text-sm text-slate-200">
                                {dayItem.activities &&
                                  dayItem.activities.map((act, actIdx) => (
                                    <li key={actIdx} className="flex items-start gap-2.5">
                                      <span className="w-2 h-2 rounded-full bg-sky-400 mt-1.5 shrink-0" />
                                      <span className="leading-relaxed">{act}</span>
                                    </li>
                                  ))}
                              </ul>
                              {(dayItem.meals || dayItem.overnight) && (
                                <div className="pt-3 border-t border-slate-800 flex flex-wrap gap-4 text-xs font-semibold text-sky-200">
                                  {dayItem.meals && <span>🍽️ Meals: {dayItem.meals}</span>}
                                  {dayItem.overnight && <span>🏨 Overnight: {dayItem.overnight}</span>}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-xs text-slate-400 p-4">Detailed day schedule provided upon inquiry.</p>
                  )}
                </div>
              </div>
            )}

            {/* TAB 3: INCLUSIONS & EXCLUSIONS */}
            {activeTab === 'inclusions' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
                {/* Inclusions */}
                <div className="bg-emerald-950/20 border border-emerald-500/30 p-5 rounded-2xl space-y-4">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Package Inclusions
                  </h4>
                  <ul className="space-y-3 text-xs sm:text-sm text-slate-200">
                    {pkg.inclusions && pkg.inclusions.length > 0 ? (
                      pkg.inclusions.map((inc, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{inc}</span>
                        </li>
                      ))
                    ) : (
                      <p className="text-xs text-slate-400">Information provided on booking confirmation.</p>
                    )}
                  </ul>
                </div>

                {/* Exclusions */}
                <div className="bg-rose-950/20 border border-rose-500/30 p-5 rounded-2xl space-y-4">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-rose-400 flex items-center gap-2">
                    <XCircle className="w-4 h-4" />
                    Package Exclusions
                  </h4>
                  <ul className="space-y-3 text-xs sm:text-sm text-slate-200">
                    {pkg.exclusions && pkg.exclusions.length > 0 ? (
                      pkg.exclusions.map((exc, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{exc}</span>
                        </li>
                      ))
                    ) : (
                      <p className="text-xs text-slate-400">Personal expenses, optional entrance tickets.</p>
                    )}
                  </ul>
                </div>
              </div>
            )}

            {/* TAB 4: REVIEWS & PHOTOS */}
            {activeTab === 'reviews' && (
              <div className="space-y-6 animate-fadeIn">
                {/* Rating Summary */}
                <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-700/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex flex-col items-center justify-center text-amber-300">
                      <span className="text-2xl font-black">4.9</span>
                      <span className="text-[10px] uppercase font-bold text-amber-400">Rating</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-1 text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-amber-400" />
                        ))}
                      </div>
                      <p className="text-xs text-slate-300 font-medium mt-1">Based on 140+ verified Bangladeshi travelers</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                    100% Verified Guest Reviews
                  </span>
                </div>

                {/* Traveler Photos Gallery */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
                    <Camera className="w-4 h-4" />
                    Trip Photo Gallery
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {galleryImages.map((imgUrl, i) => (
                      <div key={i} className="h-28 sm:h-32 rounded-xl overflow-hidden border border-slate-700/60 bg-slate-950">
                        <img
                          src={getOptimizedUnsplashUrl(imgUrl, 400, 75)}
                          alt={`Trip photo ${i + 1}`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Review Cards */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-sky-400">Recent Guest Feedback</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {guestReviews.map((rev, idx) => (
                      <div key={idx} className="bg-slate-800/30 p-4 rounded-xl border border-slate-700/40 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white text-xs sm:text-sm">{rev.name} ({rev.city})</span>
                          <div className="flex items-center gap-0.5 text-amber-400">
                            {[...Array(rev.rating)].map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-amber-400" />
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed italic">"{rev.comment}"</p>
                        <p className="text-[11px] text-slate-500">{rev.date}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: VISA & POLICIES */}
            {activeTab === 'policies' && (
              <div className="space-y-6 animate-fadeIn">
                {/* Visa Details */}
                <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-700/50 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-700/60 pb-3">
                    <h4 className="text-sm font-bold uppercase tracking-wider text-sky-400 flex items-center gap-2">
                      <FileCheck className="w-4 h-4" />
                      Visa Requirements ({pkg.country})
                    </h4>
                    <div className="px-3 py-1 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-bold flex items-center gap-1.5">
                      <span>Visa Fee:</span>
                      <span className="text-white font-extrabold">{pkg.visa_fee || getVisaFeeForDestination(pkg.country || pkg.destination_name)}</span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                    {pkg.visa_information || 'Azraq provides complete document verification and embassy submission support.'}
                  </p>

                  {pkg.required_documents && pkg.required_documents.length > 0 && (
                    <div className="pt-2">
                      <p className="font-bold text-slate-300 text-xs uppercase tracking-wider mb-2">Required Documents Checklist:</p>
                      <ul className="space-y-1.5 pl-4 list-disc text-xs sm:text-sm text-slate-300">
                        {pkg.required_documents.map((doc, i) => (
                          <li key={i}>{doc}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Important Notes & Policies */}
                <div className="bg-amber-950/20 p-5 rounded-2xl border border-amber-500/30 space-y-3 text-xs sm:text-sm">
                  <h4 className="font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4" />
                    Booking & Cancellation Policies
                  </h4>
                  <p className="text-amber-200/90 leading-relaxed">
                    • Free date adjustment consultation prior to flight ticket issuance and hotel vouchers.
                  </p>
                  <p className="text-amber-200/90 leading-relaxed">
                    • 100% transparent fee disclosure with direct payment receipt documentation.
                  </p>
                  {pkg.important_notes?.map((note, i) => (
                    <p key={i} className="text-amber-200/90 leading-relaxed">• {note}</p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sticky Mobile & Desktop Booking CTA Bar (Always visible at bottom, min 48px tap targets) */}
        <div className="p-3 sm:p-5 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 flex items-center justify-between gap-3 shadow-2xl shrink-0">
          <div className="hidden sm:block">
            <p className="text-[11px] uppercase font-bold text-emerald-400">Total Starting Price</p>
            <p className="text-lg font-mono font-extrabold text-white">
              {pkg.currency === 'BDT' ? '৳' : pkg.currency} {pkg.price.toLocaleString()}
              <span className="text-xs font-normal text-slate-400"> / pax</span>
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <button
              onClick={handleWhatsApp}
              type="button"
              className="flex-1 sm:flex-none min-h-[48px] px-4 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-98"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onRequestQuote(pkg);
              }}
              type="button"
              className="flex-1 sm:flex-none min-h-[48px] px-6 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-400 hover:to-emerald-400 text-slate-950 font-extrabold text-xs sm:text-sm shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <Send className="w-4 h-4" />
              <span>Book / Request Quote</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
