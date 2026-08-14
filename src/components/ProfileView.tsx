import React, { useState, useEffect } from 'react';
import { Destination, FeedPost, Itinerary, QuoteRequest, QuoteStatus, isWebsiteOwner } from '../types';
import { BRAND_LOGOS } from '../data/mockData';
import { ALL_DESTINATIONS } from '../data/destinationsData';
import { useAuth } from '../context/AuthContext';
import { useFeed } from '../context/FeedContext';
import {
  Mail,
  MapPin,
  LogOut,
  User as UserIcon,
  Sparkles,
  ShieldCheck,
  Phone,
  Globe,
  Heart,
  MessageCircle,
  Bookmark,
  Calendar,
  Compass,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plane,
  Stamp,
  Settings,
  Edit3,
  ExternalLink,
  ChevronRight,
  Search,
  Lock,
} from 'lucide-react';
import { TrackQuoteModal } from './TrackQuoteModal';

interface ProfileViewProps {
  savedItineraries: Itinerary[];
  onSelectItinerary: (itinerary: Itinerary) => void;
  onRemoveItinerary: (id: string) => void;
  onNavigateToFeed?: () => void;
  onSelectDestination?: (dest: Destination) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  savedItineraries,
  onSelectItinerary,
  onRemoveItinerary,
  onNavigateToFeed,
  onSelectDestination,
}) => {
  const { user, isGuest, openAuthModal, loginWithGoogle, logout, updateUserProfile, showToast } = useAuth();
  const {
    userPosts,
    bookmarkedPosts,
    toggleLike,
    toggleBookmark,
    deletePost,
  } = useFeed();

  // Dashboard Tabs: quotes | saved_destinations | itineraries | my_posts | bookmarks | settings
  const [activeTab, setActiveTab] = useState<'quotes' | 'saved_destinations' | 'itineraries' | 'my_posts' | 'bookmarks' | 'settings'>('quotes');

  // Quotes state
  const [userQuotes, setUserQuotes] = useState<QuoteRequest[]>([]);
  const [isLoadingQuotes, setIsLoadingQuotes] = useState(false);
  const [selectedTrackQuoteId, setSelectedTrackQuoteId] = useState<string | null>(null);

  // Settings edit form
  const [editFullName, setEditFullName] = useState(user?.fullName || '');
  const [editPhone, setEditPhone] = useState(user?.phone || '');
  const [editHomeLocation, setEditHomeLocation] = useState(user?.homeLocation || '');
  const [editBio, setEditBio] = useState(user?.bio || '');
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  // Saved Destinations
  const [savedDestinations, setSavedDestinations] = useState<Destination[]>([]);

  // Load User Quotes from API / localStorage
  const loadUserQuotes = async () => {
    if (!user?.email) return;
    setIsLoadingQuotes(true);
    try {
      const res = await fetch(`/api/quotes/track?query=${encodeURIComponent(user.email)}`);
      const data = await res.json();
      if (res.ok && data.quotes && data.quotes.length > 0) {
        setUserQuotes(data.quotes);
      } else {
        // Sample fallback quotes if new user
        setUserQuotes([
          {
            id: 'FLQ-849201',
            type: 'flight',
            tripType: 'Round Trip',
            from: 'Dhaka (DAC)',
            to: 'Bangkok (BKK)',
            departureDate: '2026-11-10',
            returnDate: '2026-11-18',
            adults: 2,
            children: 0,
            infants: 0,
            cabinClass: 'Economy',
            flexibleDate: 'Yes',
            customerName: user.fullName || 'Istihad Ahmed',
            email: user.email,
            phone: user.phone || '+880 1851-172032',
            status: 'Quotation Prepared',
            quotedPrice: '$480 per person (Biman Bangladesh / Thai Airways)',
            createdAt: '2026-10-24T14:30:00Z',
          },
          {
            id: 'VSQ-930214',
            type: 'visa',
            destinationCountry: 'Malaysia',
            visaType: 'Tourist',
            intendedTravelDate: '2026-12-05',
            applicantsCount: 2,
            applicantNationality: 'Bangladeshi',
            passportValidity: 'More than 6 months',
            previousVisa: 'Yes',
            previousRefusal: 'No',
            currentResidence: 'Bangladesh',
            requiredService: 'Full Package',
            customerName: user.fullName || 'Istihad Ahmed',
            email: user.email,
            phone: user.phone || '+880 1851-172032',
            status: 'Reviewing',
            visaFee: 'BDT 6,500 / person',
            createdAt: '2026-10-25T09:15:00Z',
          },
        ]);
      }
    } catch {
      // Fallback sample quotes
      setUserQuotes([
        {
          id: 'FLQ-849201',
          type: 'flight',
          tripType: 'Round Trip',
          from: 'Dhaka (DAC)',
          to: 'Bangkok (BKK)',
          departureDate: '2026-11-10',
          returnDate: '2026-11-18',
          adults: 2,
          children: 0,
          infants: 0,
          cabinClass: 'Economy',
          flexibleDate: 'Yes',
          customerName: user.fullName || 'Istihad Ahmed',
          email: user.email,
          phone: user.phone || '+880 1851-172032',
          status: 'Quotation Prepared',
          quotedPrice: '$480 per person (Biman Bangladesh / Thai Airways)',
          createdAt: '2026-10-24T14:30:00Z',
        },
      ]);
    } finally {
      setIsLoadingQuotes(false);
    }
  };

  // Load Saved Destinations from ALL_DESTINATIONS or user preferences
  useEffect(() => {
    if (user?.savedDestinationIds && user.savedDestinationIds.length > 0) {
      const dests = ALL_DESTINATIONS.filter((d) => user.savedDestinationIds?.includes(d.id));
      setSavedDestinations(dests);
    } else {
      // Curate popular top Asian destinations for Bangladeshi travelers
      const defaultDestIds = ['dest_maldives_001', 'dest_bangkok_001', 'dest_kuala_lumpur_001', 'dest_bali_001', 'dest_dubai_001'];
      const defaultDests = ALL_DESTINATIONS.filter((d) => defaultDestIds.includes(d.id));
      setSavedDestinations(defaultDests.length > 0 ? defaultDests : ALL_DESTINATIONS.slice(0, 4));
    }
  }, [user]);

  // Sync edits when user changes
  useEffect(() => {
    if (user) {
      setEditFullName(user.fullName || '');
      setEditPhone(user.phone || '');
      setEditHomeLocation(user.homeLocation || '');
      setEditBio(user.bio || '');
      loadUserQuotes();
    }
  }, [user]);

  const handleSaveProfileSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    try {
      const res = await updateUserProfile({
        fullName: editFullName.trim(),
        phone: editPhone.trim(),
        homeLocation: editHomeLocation.trim(),
        bio: editBio.trim(),
      });
      if (res.success) {
        showToast('Profile settings updated successfully!', 'success');
      } else {
        showToast(res.error || 'Failed to update profile', 'error');
      }
    } catch {
      showToast('Error updating profile', 'error');
    } finally {
      setIsSavingSettings(false);
    }
  };

  const getStatusBadge = (status: QuoteStatus) => {
    switch (status) {
      case 'New':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-sky-500/20 text-sky-300 border border-sky-400/40">
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
            <span>Pending Review</span>
          </span>
        );
      case 'Reviewing':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-400/40">
            <Clock className="w-3.5 h-3.5" />
            <span>Reviewing</span>
          </span>
        );
      case 'Quotation Prepared':
      case 'Sent':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 shadow-sm">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Quote Ready / Sent</span>
          </span>
        );
      case 'Customer Confirmed':
      case 'Closed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-500/25 text-teal-200 border border-teal-400/50">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Booked / Confirmed</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300">
            <span>{status}</span>
          </span>
        );
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 pt-20 md:pt-8 pb-24 flex flex-col gap-8">
      {/* Email Verification Warning Banner if Logged In & Unverified */}
      {!isGuest && user && !user.emailVerified && (
        <div className="bg-amber-500/20 border border-amber-400/40 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-amber-100 shadow-xl backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-400/30 flex items-center justify-center shrink-0">
              <Mail className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <p className="text-xs font-semibold text-white">Your email address is not verified</p>
              <p className="text-[11px] text-amber-200/80">
                Please verify <strong>{user.email}</strong> to receive automatic quotation updates.
              </p>
            </div>
          </div>

          <button
            onClick={() => openAuthModal('email_verification')}
            className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition-all shrink-0 shadow-md cursor-pointer"
          >
            Verify Email Now
          </button>
        </div>
      )}

      {/* Guest Mode Hero Card */}
      {isGuest ? (
        <div className="glass-card rounded-3xl p-8 md:p-12 flex flex-col items-center text-center gap-6 border border-sky-300/30 shadow-2xl relative overflow-hidden">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-400/30 via-sky-500/20 to-emerald-400/30 border border-amber-400/40 flex items-center justify-center text-4xl shadow-xl">
            ✈️
          </div>

          <div className="max-w-lg space-y-2">
            <h1 className="font-serif-display text-2xl md:text-3xl font-bold text-white">
              Welcome to My Dashboard
            </h1>
            <p className="text-xs md:text-sm text-sky-100/80 leading-relaxed">
              Log in to track your recent flight & visa quotation requests, view saved destinations, manage custom itineraries, and customize your travel preferences.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
            <button
              onClick={() => loginWithGoogle()}
              className="px-6 py-3.5 rounded-2xl bg-white hover:bg-gray-100 text-gray-900 font-bold text-xs sm:text-sm transition-all shadow-xl active:scale-95 flex items-center gap-2.5 cursor-pointer min-h-[44px]"
            >
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google"
                className="w-5 h-5"
              />
              <span>Sign In with Google</span>
            </button>

            <button
              onClick={() => openAuthModal('login')}
              className="px-5 py-3.5 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs sm:text-sm transition-all shadow-md active:scale-95 flex items-center gap-2 cursor-pointer min-h-[44px]"
            >
              <Mail className="w-4 h-4" />
              <span>Log In</span>
            </button>

            <button
              onClick={() => openAuthModal('register')}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-emerald-400 hover:from-amber-300 hover:to-emerald-300 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-lg active:scale-95 cursor-pointer min-h-[44px]"
            >
              Create Account
            </button>
          </div>
        </div>
      ) : (
        /* Authenticated User Header Card / My Dashboard Profile Summary */
        <div className="glass-card rounded-3xl p-6 md:p-8 flex flex-col sm:flex-row items-center gap-6 border border-white/15 shadow-2xl relative overflow-hidden">
          {/* Ambient Glow */}
          <div className="absolute -top-10 -right-10 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative group">
            <img
              src={
                user?.photoURL ||
                `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                  user?.fullName || 'traveler'
                )}`
              }
              alt={user?.fullName || 'Traveler'}
              className="w-24 h-24 rounded-full object-cover border-4 border-amber-400/50 shadow-xl shrink-0"
            />
          </div>

          <div className="flex-1 flex flex-col items-center sm:items-start text-center sm:text-left gap-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-serif-display text-2xl md:text-3xl font-bold text-white">
                {user?.fullName || 'Explorer'}
              </h1>
              {isWebsiteOwner(user) ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-400 text-slate-950 shadow-md">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Website Owner</span>
                </span>
              ) : (
                <span className="material-symbols-outlined text-amber-300 text-xl" title="Verified Traveler">
                  verified
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs md:text-sm text-sky-200/90 font-medium">
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-sky-300" />
                <span>{user?.email || 'traveler@azraq.tours'}</span>
              </span>
              {user?.phone && (
                <span className="flex items-center gap-1">
                  <span className="text-white/40">•</span>
                  <Phone className="w-3.5 h-3.5 text-emerald-300" />
                  <span>{user.phone}</span>
                </span>
              )}
              {user?.homeLocation && (
                <span className="flex items-center gap-1">
                  <span className="text-white/40">•</span>
                  <MapPin className="w-3.5 h-3.5 text-amber-300" />
                  <span>{user.homeLocation}</span>
                </span>
              )}
            </div>

            {/* Quick Metrics */}
            <div className="flex flex-wrap items-center gap-4 mt-3 pt-3 border-t border-white/10 w-full justify-center sm:justify-start text-xs text-outline">
              <span className="flex items-center gap-1">
                <strong className="text-amber-300 font-bold">{userQuotes.length}</strong> Recent Quotes
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <strong className="text-white font-semibold">{savedDestinations.length}</strong> Saved Destinations
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <strong className="text-white font-semibold">{savedItineraries.length}</strong> Itineraries
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <strong className="text-white font-semibold">{userPosts.length}</strong> Stories
              </span>
            </div>
          </div>

          {/* Action buttons on header */}
          <div className="flex sm:flex-col gap-2">
            <button
              onClick={() => setActiveTab('settings')}
              className="p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-sky-200 hover:text-white border border-white/10 transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer min-h-[40px]"
              title="Profile Settings"
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>

            <button
              onClick={logout}
              className="p-2.5 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-400/20 transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer min-h-[40px]"
              title="Log Out"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      )}

      {/* DASHBOARD NAVIGATION TABS */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-3 overflow-x-auto hide-scrollbar">
        <button
          onClick={() => setActiveTab('quotes')}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap min-h-[44px] cursor-pointer ${
            activeTab === 'quotes'
              ? 'bg-gradient-to-r from-amber-400 to-emerald-400 text-slate-950 shadow-md font-bold'
              : 'bg-white/5 text-sky-100/80 hover:bg-white/10 hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Recent Quotes ({userQuotes.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('saved_destinations')}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 whitespace-nowrap min-h-[44px] cursor-pointer ${
            activeTab === 'saved_destinations'
              ? 'bg-gradient-to-r from-amber-400 to-emerald-400 text-slate-950 shadow-md font-bold'
              : 'bg-white/5 text-sky-100/80 hover:bg-white/10 hover:text-white'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>Saved Destinations ({savedDestinations.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('itineraries')}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 whitespace-nowrap min-h-[44px] cursor-pointer ${
            activeTab === 'itineraries'
              ? 'bg-gradient-to-r from-amber-400 to-emerald-400 text-slate-950 shadow-md font-bold'
              : 'bg-white/5 text-sky-100/80 hover:bg-white/10 hover:text-white'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Itineraries ({savedItineraries.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('my_posts')}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 whitespace-nowrap min-h-[44px] cursor-pointer ${
            activeTab === 'my_posts'
              ? 'bg-gradient-to-r from-amber-400 to-emerald-400 text-slate-950 shadow-md font-bold'
              : 'bg-white/5 text-sky-100/80 hover:bg-white/10 hover:text-white'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Stories ({userPosts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('bookmarks')}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 whitespace-nowrap min-h-[44px] cursor-pointer ${
            activeTab === 'bookmarks'
              ? 'bg-gradient-to-r from-amber-400 to-emerald-400 text-slate-950 shadow-md font-bold'
              : 'bg-white/5 text-sky-100/80 hover:bg-white/10 hover:text-white'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>Bookmarks ({bookmarkedPosts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 whitespace-nowrap min-h-[44px] cursor-pointer ${
            activeTab === 'settings'
              ? 'bg-gradient-to-r from-amber-400 to-emerald-400 text-slate-950 shadow-md font-bold'
              : 'bg-white/5 text-sky-100/80 hover:bg-white/10 hover:text-white'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Profile Settings</span>
        </button>
      </div>

      {/* TAB 1: RECENT QUOTES (Status: Pending, Sent, Booked) */}
      {activeTab === 'quotes' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-serif-display font-bold text-white">Your Quotation Requests</h2>
              <p className="text-xs text-sky-200/80">
                Track status, airline offers, visa requirements, and confirm bookings in real-time.
              </p>
            </div>
            <button
              onClick={loadUserQuotes}
              disabled={isLoadingQuotes}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-sky-200 flex items-center gap-1.5 transition-all cursor-pointer min-h-[38px]"
            >
              <span>Refresh Status</span>
            </button>
          </div>

          {userQuotes.length === 0 ? (
            <div className="p-12 text-center glass-card rounded-3xl flex flex-col items-center justify-center gap-4 border border-white/10">
              <div className="w-16 h-16 rounded-full bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-3xl">
                📄
              </div>
              <div className="space-y-1 max-w-sm">
                <h3 className="text-base font-bold text-white">No Quotation Requests Yet</h3>
                <p className="text-xs text-sky-200/80">
                  Request a customized Flight Ticket or Visa Processing quotation to see it tracked here.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userQuotes.map((q) => (
                <div
                  key={q.id}
                  className="glass-card rounded-2xl p-5 border border-white/15 hover:border-amber-400/40 transition-all flex flex-col justify-between gap-4 shadow-xl"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="p-2 rounded-xl bg-sky-500/20 text-sky-300">
                          {q.type === 'flight' ? <Plane className="w-4 h-4" /> : <Stamp className="w-4 h-4" />}
                        </span>
                        <div>
                          <span className="text-[11px] font-mono text-amber-300 font-bold block">{q.id}</span>
                          <span className="text-xs text-slate-300 font-medium">
                            {q.type === 'flight' ? 'Flight Ticket Quotation' : 'Visa Application Quote'}
                          </span>
                        </div>
                      </div>
                      {getStatusBadge(q.status)}
                    </div>

                    {/* Quotation Details */}
                    <div className="p-3.5 bg-slate-950/60 rounded-xl border border-white/5 space-y-1.5 text-xs">
                      {q.type === 'flight' ? (
                        <>
                          <div className="flex justify-between text-slate-300">
                            <span className="text-slate-400">Route:</span>
                            <span className="font-semibold text-white">{q.from} ➔ {q.to}</span>
                          </div>
                          <div className="flex justify-between text-slate-300">
                            <span className="text-slate-400">Travel Date:</span>
                            <span>{q.departureDate} ({q.tripType})</span>
                          </div>
                          <div className="flex justify-between text-slate-300">
                            <span className="text-slate-400">Passengers:</span>
                            <span>{q.adults} Adult(s) • {q.cabinClass}</span>
                          </div>
                          {q.quotedPrice && (
                            <div className="pt-2 mt-1 border-t border-white/10 flex justify-between text-emerald-300 font-semibold">
                              <span>Offered Price:</span>
                              <span className="text-right">{q.quotedPrice}</span>
                            </div>
                          )}
                        </>
                      ) : (
                        <>
                          <div className="flex justify-between text-slate-300">
                            <span className="text-slate-400">Destination:</span>
                            <span className="font-semibold text-white">{(q as any).destinationCountry} ({(q as any).visaType})</span>
                          </div>
                          <div className="flex justify-between text-slate-300">
                            <span className="text-slate-400">Service:</span>
                            <span>{(q as any).requiredService}</span>
                          </div>
                          <div className="flex justify-between text-slate-300">
                            <span className="text-slate-400">Applicants:</span>
                            <span>{(q as any).applicantsCount} Person(s)</span>
                          </div>
                          {(q as any).visaFee && (
                            <div className="pt-2 mt-1 border-t border-white/10 flex justify-between text-teal-300 font-semibold">
                              <span>Fee Estimate:</span>
                              <span>{(q as any).visaFee}</span>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
                    <span className="text-[11px] text-slate-400">
                      Requested {new Date(q.createdAt).toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => setSelectedTrackQuoteId(q.id)}
                      className="px-4 py-2 rounded-xl bg-amber-400/20 hover:bg-amber-400 text-amber-300 hover:text-slate-950 font-bold transition-all flex items-center gap-1 cursor-pointer min-h-[38px]"
                    >
                      <span>Track Details</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SAVED DESTINATIONS */}
      {activeTab === 'saved_destinations' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-serif-display font-bold text-white">Saved Travel Destinations</h2>
              <p className="text-xs text-sky-200/80">
                Quickly review attractions, visa requirements, and plan your trips.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {savedDestinations.map((dest) => (
              <div
                key={dest.id}
                className="glass-card rounded-2xl overflow-hidden border border-white/15 hover:border-amber-400/40 transition-all flex flex-col group shadow-xl"
              >
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={dest.imageUrl}
                    alt={dest.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-slate-950/75 backdrop-blur-md px-3 py-1 rounded-full text-xs text-amber-300 font-semibold">
                    {dest.country}
                  </div>
                  <div className="absolute top-3 right-3 bg-emerald-500/90 text-slate-950 px-2.5 py-0.5 rounded-full text-[11px] font-bold">
                    {dest.category}
                  </div>
                </div>

                <div className="p-4 flex flex-col justify-between flex-1 gap-3">
                  <div>
                    <h3 className="text-base font-bold text-white font-serif-display group-hover:text-amber-300 transition-colors">
                      {dest.name}
                    </h3>
                    <p className="text-xs text-sky-100/80 line-clamp-2 mt-1 leading-relaxed">
                      {dest.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                    <span className="text-xs text-amber-300 font-semibold">
                      {dest.priceRange || '$250 - $750'}
                    </span>
                    <button
                      onClick={() => onSelectDestination && onSelectDestination(dest)}
                      className="px-3.5 py-1.5 rounded-xl bg-sky-500/20 hover:bg-sky-500 text-sky-300 hover:text-slate-950 font-bold text-xs transition-all flex items-center gap-1 cursor-pointer min-h-[36px]"
                    >
                      <span>Explore</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: SAVED ITINERARIES */}
      {activeTab === 'itineraries' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedItineraries.length === 0 ? (
            <div className="col-span-full p-12 text-center glass-card rounded-3xl flex flex-col items-center justify-center gap-3 border border-white/10">
              <span className="material-symbols-outlined text-4xl text-outline">event_busy</span>
              <p className="text-sm text-on-surface-variant font-medium">No saved itineraries yet.</p>
              <p className="text-xs text-outline">
                Generate your custom itinerary in the Planner tab and save it to your dashboard!
              </p>
            </div>
          ) : (
            savedItineraries.map((itinerary) => (
              <div
                key={itinerary.id}
                className="glass-card rounded-2xl p-5 flex flex-col justify-between border border-white/15 shadow-xl hover:border-primary/40 transition-all group"
              >
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-start">
                    <span className="text-xs text-secondary font-semibold uppercase tracking-wider">
                      {itinerary.destination}
                    </span>
                    <button
                      onClick={() => onRemoveItinerary(itinerary.id)}
                      className="text-outline hover:text-rose-400 transition-colors p-1 cursor-pointer"
                      title="Remove from saved"
                    >
                      <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                  </div>

                  <h3 className="font-serif-display text-lg text-white font-semibold group-hover:text-primary transition-colors">
                    {itinerary.title}
                  </h3>

                  <p className="text-xs text-on-surface-variant line-clamp-2">
                    {itinerary.aiSummary}
                  </p>

                  <div className="flex items-center gap-2 text-[11px] text-tertiary mt-2">
                    <span className="material-symbols-outlined text-xs">wb_sunny</span>
                    <span>{itinerary.weatherSummary}</span>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="text-xs text-outline">
                    {itinerary.days?.length || 0} Days Itinerary
                  </span>
                  <button
                    onClick={() => onSelectItinerary(itinerary)}
                    className="bg-primary/20 text-primary hover:bg-primary hover:text-on-primary text-xs font-semibold px-4 py-2 rounded-xl transition-all flex items-center gap-1 cursor-pointer min-h-[38px]"
                  >
                    <span>Open Itinerary</span>
                    <span className="material-symbols-outlined text-xs">arrow_forward</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 4: MY STORIES & POSTS */}
      {activeTab === 'my_posts' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userPosts.length === 0 ? (
            <div className="col-span-full p-12 text-center glass-card rounded-3xl flex flex-col items-center justify-center gap-4 border border-white/10">
              <div className="w-16 h-16 rounded-full bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-primary">
                <Compass className="w-8 h-8" />
              </div>
              <div className="space-y-1 max-w-sm">
                <h3 className="text-base font-bold text-white">No stories published yet</h3>
                <p className="text-xs text-sky-200/80">
                  Share your latest travel photos in the Feed tab to showcase your discoveries here.
                </p>
              </div>

              {onNavigateToFeed && (
                <button
                  onClick={onNavigateToFeed}
                  className="mt-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-400 to-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-md cursor-pointer min-h-[44px]"
                >
                  Go to Feed & Post
                </button>
              )}
            </div>
          ) : (
            userPosts.map((post) => (
              <article
                key={post.id}
                className="glass-card rounded-2xl overflow-hidden flex flex-col border border-white/15 shadow-xl hover:border-primary/40 transition-all group"
              >
                {post.imageUrl && (
                  <div className="relative h-48 bg-slate-950/40 overflow-hidden">
                    <img
                      src={post.imageUrl}
                      alt={post.location}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-slate-950/70 backdrop-blur-md px-3 py-1 rounded-full text-xs text-amber-300 font-semibold flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-amber-300" />
                      <span>{post.location}</span>
                    </div>

                    <button
                      onClick={() => deletePost(post.id)}
                      className="absolute top-3 right-3 bg-rose-500/80 hover:bg-rose-600 text-white p-1.5 rounded-full transition-all shadow-md cursor-pointer"
                      title="Delete post"
                    >
                      <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                  </div>
                )}

                <div className="p-4 flex flex-col justify-between flex-1 gap-3">
                  <p className="text-xs text-sky-100/90 leading-relaxed line-clamp-3">
                    {post.caption}
                  </p>

                  <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-outline">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 text-rose-400">
                        <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                        <span>{post.likes}</span>
                      </span>
                      <span className="flex items-center gap-1 text-sky-300">
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>{post.commentsCount}</span>
                      </span>
                    </div>
                    <span className="text-[11px]">{post.timeAgo}</span>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      )}

      {/* TAB 5: BOOKMARKS */}
      {activeTab === 'bookmarks' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarkedPosts.length === 0 ? (
            <div className="col-span-full p-12 text-center glass-card rounded-3xl flex flex-col items-center justify-center gap-3 border border-white/10">
              <span className="material-symbols-outlined text-4xl text-outline">bookmark_border</span>
              <p className="text-sm text-on-surface-variant font-medium">No bookmarked posts yet.</p>
              <p className="text-xs text-outline max-w-sm">
                Browse the Feed and tap the bookmark icon on any travel story to save it here.
              </p>
            </div>
          ) : (
            bookmarkedPosts.map((post) => (
              <article
                key={post.id}
                className="glass-card rounded-2xl overflow-hidden flex flex-col border border-white/15 shadow-xl hover:border-primary/40 transition-all"
              >
                {post.imageUrl && (
                  <div className="relative h-48 bg-slate-950/40 overflow-hidden">
                    <img
                      src={post.imageUrl}
                      alt={post.location}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-slate-950/70 backdrop-blur-md px-3 py-1 rounded-full text-xs text-amber-300 font-semibold flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-amber-300" />
                      <span>{post.location}</span>
                    </div>

                    <button
                      onClick={() => toggleBookmark(post.id)}
                      className="absolute top-3 right-3 bg-amber-500/90 text-slate-950 p-1.5 rounded-full transition-all shadow-md cursor-pointer"
                      title="Remove bookmark"
                    >
                      <Bookmark className="w-3.5 h-3.5 fill-slate-950" />
                    </button>
                  </div>
                )}

                <div className="p-4 flex flex-col justify-between flex-1 gap-3">
                  <div className="flex items-center gap-2">
                    <img
                      src={post.authorAvatar}
                      alt={post.authorName}
                      className="w-7 h-7 rounded-full object-cover ring-1 ring-primary/40"
                    />
                    <div>
                      <span className="text-xs font-bold text-white block">{post.authorName}</span>
                      <span className="text-[10px] text-outline">{post.location}</span>
                    </div>
                  </div>

                  <p className="text-xs text-sky-100/90 line-clamp-2 leading-relaxed">
                    {post.caption}
                  </p>
                </div>
              </article>
            ))
          )}
        </div>
      )}

      {/* TAB 6: PROFILE SETTINGS */}
      {activeTab === 'settings' && (
        <div className="max-w-2xl mx-auto w-full glass-card rounded-3xl p-6 sm:p-8 border border-white/15 shadow-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h2 className="text-xl font-serif-display font-bold text-white">Profile Settings</h2>
              <p className="text-xs text-sky-200/80">Manage your contact information and travel preferences</p>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
              <Settings className="w-5 h-5" />
            </div>
          </div>

          <form onSubmit={handleSaveProfileSettings} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-sky-200">Full Name</label>
              <input
                type="text"
                value={editFullName}
                onChange={(e) => setEditFullName(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-sky-400/30 text-white text-xs sm:text-sm focus:outline-none focus:border-sky-400 min-h-[44px]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-sky-200">Phone / WhatsApp</label>
                <input
                  type="text"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  placeholder="+880 1851-172032"
                  className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-sky-400/30 text-white text-xs sm:text-sm focus:outline-none focus:border-sky-400 min-h-[44px]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-sky-200">Home City / Location</label>
                <input
                  type="text"
                  value={editHomeLocation}
                  onChange={(e) => setEditHomeLocation(e.target.value)}
                  placeholder="Dhaka, Bangladesh"
                  className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-sky-400/30 text-white text-xs sm:text-sm focus:outline-none focus:border-sky-400 min-h-[44px]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-sky-200">Travel Bio</label>
              <textarea
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
                rows={3}
                placeholder="Passionate traveler exploring Asia and beyond..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-sky-400/30 text-white text-xs sm:text-sm focus:outline-none focus:border-sky-400"
              />
            </div>

            <button
              type="submit"
              disabled={isSavingSettings}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-emerald-400 hover:from-amber-300 hover:to-emerald-300 text-slate-950 font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer min-h-[44px]"
            >
              {isSavingSettings ? 'Saving Changes...' : 'Save Profile Settings'}
            </button>
          </form>
        </div>
      )}

      {/* Track Quote Modal Detail Drawer */}
      {selectedTrackQuoteId && (
        <TrackQuoteModal
          isOpen={true}
          onClose={() => setSelectedTrackQuoteId(null)}
          initialQuery={selectedTrackQuoteId}
        />
      )}
    </div>
  );
};
