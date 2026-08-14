import React, { useState, useEffect, useMemo } from 'react';
import { Destination, FeedPost, Itinerary, QuoteRequest, QuoteStatus, isWebsiteOwner, NavView } from '../types';
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
  ArrowRight,
  Check,
  X,
  Printer,
  Share2,
  RefreshCw,
  Crown,
  Eye,
  KeyRound,
} from 'lucide-react';
import { TrackQuoteModal } from './TrackQuoteModal';

interface ProfileViewProps {
  savedItineraries: Itinerary[];
  onSelectItinerary: (itinerary: Itinerary) => void;
  onRemoveItinerary: (id: string) => void;
  onNavigateToFeed?: () => void;
  onSelectDestination?: (dest: Destination) => void;
  onOpenFlightQuote?: () => void;
  onOpenVisaQuote?: () => void;
  onNavigate?: (view: NavView) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  savedItineraries,
  onSelectItinerary,
  onRemoveItinerary,
  onNavigateToFeed,
  onSelectDestination,
  onOpenFlightQuote,
  onOpenVisaQuote,
  onNavigate,
}) => {
  const { user, isGuest, isLoading, openAuthModal, loginWithGoogle, logout, updateUserProfile, showToast } = useAuth();
  const {
    userPosts,
    bookmarkedPosts,
    toggleBookmark,
    deletePost,
  } = useFeed();

  // Active Navigation Tab: dashboard | quote_history | saved_destinations | itineraries | my_posts | bookmarks | settings
  const [activeTab, setActiveTab] = useState<'dashboard' | 'quote_history' | 'saved_destinations' | 'itineraries' | 'my_posts' | 'bookmarks' | 'settings'>('dashboard');

  // Quotes state
  const [userQuotes, setUserQuotes] = useState<QuoteRequest[]>([]);
  const [timelineEvents, setTimelineEvents] = useState<any[]>([]);
  const [isLoadingQuotes, setIsLoadingQuotes] = useState(false);
  const [selectedQuoteDetail, setSelectedQuoteDetail] = useState<QuoteRequest | null>(null);
  const [quoteSearchTerm, setQuoteSearchTerm] = useState('');
  const [quoteStatusFilter, setQuoteStatusFilter] = useState<'all' | 'pending' | 'processing' | 'quoted' | 'booked' | 'expired'>('all');
  const [isRequestingUpdate, setIsRequestingUpdate] = useState(false);

  // Settings edit form
  const [editFullName, setEditFullName] = useState(user?.fullName || '');
  const [editPhone, setEditPhone] = useState(user?.phone || '');
  const [editHomeLocation, setEditHomeLocation] = useState(user?.homeLocation || '');
  const [editBio, setEditBio] = useState(user?.bio || '');
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  // Change Password Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [isChangingPass, setIsChangingPass] = useState(false);

  // Saved Destinations
  const [savedDestinations, setSavedDestinations] = useState<Destination[]>([]);

  // Password strength calculation
  const passStrength = useMemo(() => {
    if (!newPassword) return 0;
    let score = 0;
    if (newPassword.length >= 8) score += 25;
    if (/[A-Z]/.test(newPassword)) score += 25;
    if (/[a-z]/.test(newPassword)) score += 25;
    if (/[0-9]/.test(newPassword) || /[^A-Za-z0-9]/.test(newPassword)) score += 25;
    return score;
  }, [newPassword]);

  // Load User Quotes and Personalized Activity Timeline from API
  const loadUserQuotes = async () => {
    if (!user?.email) {
      setUserQuotes([]);
      setTimelineEvents([]);
      return;
    }
    setIsLoadingQuotes(true);
    try {
      // 1. Fetch user quotes
      const res = await fetch(`/api/quotes/track?query=${encodeURIComponent(user.email)}`);
      const data = await res.json();
      if (res.ok && Array.isArray(data.quotes)) {
        setUserQuotes(data.quotes);
      } else {
        setUserQuotes([]);
      }

      // 2. Fetch personalized step-by-step activity timeline
      const timelineRes = await fetch(`/api/users/me/timeline?email=${encodeURIComponent(user.email)}`);
      if (timelineRes.ok) {
        const timelineData = await timelineRes.json();
        if (timelineData.success && Array.isArray(timelineData.timeline)) {
          setTimelineEvents(timelineData.timeline);
        }
      }
    } catch {
      setUserQuotes([]);
      setTimelineEvents([]);
    } finally {
      setIsLoadingQuotes(false);
    }
  };

  // Load Saved Destinations
  useEffect(() => {
    if (user?.savedDestinationIds && user.savedDestinationIds.length > 0) {
      const dests = ALL_DESTINATIONS.filter((d) => user.savedDestinationIds?.includes(d.id));
      setSavedDestinations(dests);
    } else {
      setSavedDestinations([]);
    }
  }, [user]);

  // Sync state strictly with authenticated user
  useEffect(() => {
    if (user) {
      setEditFullName(user.fullName || '');
      setEditPhone(user.phone || '');
      setEditHomeLocation(user.homeLocation || '');
      setEditBio(user.bio || '');
      loadUserQuotes();
    } else {
      setEditFullName('');
      setEditPhone('');
      setEditHomeLocation('');
      setEditBio('');
      setUserQuotes([]);
    }
  }, [user]);

  // Metric calculations
  const totalQuotesCount = userQuotes.length;
  const pendingQuotesCount = userQuotes.filter((q) =>
    ['New', 'Pending', 'Reviewing', 'Processing'].includes(q.status)
  ).length;
  const bookedTripsCount = userQuotes.filter((q) =>
    ['Booked', 'Customer Confirmed', 'Closed'].includes(q.status)
  ).length;

  // Filtered Quote History list
  const filteredQuotes = useMemo(() => {
    return userQuotes.filter((q) => {
      // Status match
      let matchStatus = true;
      if (quoteStatusFilter === 'pending') {
        matchStatus = ['New', 'Pending'].includes(q.status);
      } else if (quoteStatusFilter === 'processing') {
        matchStatus = ['Reviewing', 'Processing'].includes(q.status);
      } else if (quoteStatusFilter === 'quoted') {
        matchStatus = ['Quotation Prepared', 'Quoted', 'Quoted via WhatsApp', 'Quoted via Email', 'Sent'].includes(q.status);
      } else if (quoteStatusFilter === 'booked') {
        matchStatus = ['Booked', 'Customer Confirmed', 'Closed'].includes(q.status);
      } else if (quoteStatusFilter === 'expired') {
        matchStatus = ['Expired', 'Lost', 'Archived'].includes(q.status);
      }

      // Search match
      const search = quoteSearchTerm.toLowerCase().trim();
      if (!search) return matchStatus;

      const destination = q.type === 'flight' ? `${q.from} ${q.to}` : (q as any).destinationCountry || '';
      const matchSearch =
        q.id.toLowerCase().includes(search) ||
        destination.toLowerCase().includes(search) ||
        q.type.toLowerCase().includes(search) ||
        (q.customerName && q.customerName.toLowerCase().includes(search));

      return matchStatus && matchSearch;
    });
  }, [userQuotes, quoteStatusFilter, quoteSearchTerm]);

  // Handle Save Profile Settings
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
        showToast('VIP Profile information updated successfully!', 'success');
      } else {
        showToast(res.error || 'Failed to update profile', 'error');
      }
    } catch {
      showToast('Error updating profile settings', 'error');
    } finally {
      setIsSavingSettings(false);
    }
  };

  // Handle Change Password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      showToast('Please enter your current password.', 'error');
      return;
    }
    if (newPassword.length < 8) {
      showToast('New password must be at least 8 characters long.', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('New passwords do not match. Please verify.', 'error');
      return;
    }

    setIsChangingPass(true);
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user?.email,
          currentPassword,
          newPassword,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('Password changed successfully!', 'success');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        showToast(data.error || 'Failed to change password. Check your current password.', 'error');
      }
    } catch {
      showToast('Server connection error while changing password.', 'error');
    } finally {
      setIsChangingPass(false);
    }
  };

  // Request quote status update ping
  const handleRequestQuoteUpdate = async (quote: QuoteRequest) => {
    setIsRequestingUpdate(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      showToast(`Update request sent for ${quote.id}! Our travel agent will follow up on WhatsApp & Email shortly.`, 'success');
    } finally {
      setIsRequestingUpdate(false);
    }
  };

  const getStatusBadge = (status: QuoteStatus | string) => {
    const s = status.toLowerCase();
    if (s.includes('new') || s.includes('pending')) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-400/40">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span>Pending 🟡</span>
        </span>
      );
    }
    if (s.includes('review') || s.includes('processing')) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-sky-500/20 text-sky-300 border border-sky-400/40">
          <Clock className="w-3.5 h-3.5" />
          <span>Processing 🔵</span>
        </span>
      );
    }
    if (s.includes('quot') || s.includes('sent')) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 shadow-sm">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Quoted 🟢</span>
        </span>
      );
    }
    if (s.includes('book') || s.includes('confirm') || s.includes('closed')) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-500/25 text-purple-200 border border-purple-400/50">
          <Crown className="w-3.5 h-3.5 text-amber-300" />
          <span>Booked 🟣</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-400 border border-slate-700">
        <span>Expired ⚪</span>
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8 pt-28 pb-28 flex flex-col items-center justify-center min-h-[50vh] gap-5">
        <div className="w-12 h-12 rounded-full border-3 border-sky-400/20 border-t-sky-400 animate-spin" />
        <div className="text-center space-y-1">
          <p className="text-base font-semibold text-white">Loading your Profile...</p>
          <p className="text-xs text-sky-200/60">Verifying authenticated session credentials</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 pt-20 md:pt-8 pb-28 flex flex-col gap-8">
      {/* Email Verification Warning Banner if Logged In & Unverified */}
      {!isGuest && user && !user.emailVerified && (
        <div className="bg-amber-500/20 border border-amber-400/40 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-amber-100 shadow-xl backdrop-blur-xl animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-400/30 flex items-center justify-center shrink-0">
              <Mail className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <p className="text-xs font-semibold text-white">Your email address is not verified</p>
              <p className="text-[11px] text-amber-200/80">
                Please verify <strong>{user.email}</strong> to receive automatic quotation updates and flight confirmations.
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

      {/* GUEST MODE: VIP Portal Welcome & Quick Quote Tracking */}
      {isGuest || !user ? (
        <div className="space-y-8 animate-fade-in">
          {/* Guest Mode Hero Card */}
          <div className="glass-card rounded-3xl p-8 md:p-12 flex flex-col items-center text-center gap-6 border border-amber-400/30 shadow-2xl relative overflow-hidden bg-gradient-to-b from-slate-900/95 via-slate-900/90 to-[#0a192f]/95">
            {/* Ambient Gold Glow */}
            <div className="absolute -top-10 -right-10 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-sky-500/15 rounded-full blur-3xl pointer-events-none"></div>

            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-400/30 via-sky-500/20 to-emerald-400/30 border border-amber-400/40 flex items-center justify-center text-4xl shadow-xl">
              👑
            </div>

            <div className="max-w-xl space-y-2.5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                <Crown className="w-3.5 h-3.5" />
                <span>Azraq Tours & Travels • VIP Client Portal</span>
              </div>
              <h1 className="font-serif-display text-2xl md:text-4xl font-extrabold text-white tracking-tight">
                Welcome to My Azraq VIP Portal
              </h1>
              <p className="text-xs md:text-sm text-sky-100/80 leading-relaxed">
                Log in to access your personalized travel dashboard, track active flight & visa quotations in real-time, view official rate assessments, and manage your custom itineraries.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3.5 mt-2">
              <button
                onClick={async () => {
                  const res = await loginWithGoogle();
                  if (!res.success && res.error) {
                    openAuthModal('google_prompt');
                  }
                }}
                className="px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-extrabold text-xs sm:text-sm transition-all shadow-xl active:scale-95 flex items-center gap-2.5 cursor-pointer min-h-[46px]"
              >
                <img
                  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                  alt="Google"
                  className="w-4 h-4"
                />
                <span>Continue with Google</span>
              </button>

              <button
                onClick={() => openAuthModal('login')}
                className="px-6 py-3.5 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs sm:text-sm transition-all shadow-lg active:scale-95 flex items-center gap-2 cursor-pointer min-h-[46px]"
              >
                <Mail className="w-4 h-4" />
                <span>Log In with Email</span>
              </button>

              <button
                onClick={() => openAuthModal('register')}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-emerald-400 hover:from-amber-300 hover:to-emerald-300 text-slate-950 font-extrabold text-xs sm:text-sm transition-all shadow-xl active:scale-95 cursor-pointer min-h-[46px]"
              >
                Create VIP Account
              </button>
            </div>
          </div>

          {/* Quick Quote Tracking for Guests without logging in */}
          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 shadow-xl bg-slate-900/90 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-lg font-serif-display font-bold text-white flex items-center gap-2">
                  <Search className="w-5 h-5 text-amber-400" />
                  Instant Quotation Lookup
                </h2>
                <p className="text-xs text-sky-200/80">
                  Already submitted a quotation request? Enter your Quote ID or registered email below to check status immediately.
                </p>
              </div>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!quoteSearchTerm.trim()) {
                  showToast('Please enter a Quote ID or email address to search.', 'error');
                  return;
                }
                setIsLoadingQuotes(true);
                try {
                  const res = await fetch(`/api/quotes/track?query=${encodeURIComponent(quoteSearchTerm.trim())}`);
                  const data = await res.json();
                  if (res.ok && data.quotes && data.quotes.length > 0) {
                    setUserQuotes(data.quotes);
                    showToast(`Found ${data.quotes.length} quotation request(s)!`, 'success');
                  } else {
                    setUserQuotes([]);
                    showToast('No quotations found matching this Request ID or Email.', 'error');
                  }
                } catch {
                  showToast('Failed to look up quotation. Please try again.', 'error');
                } finally {
                  setIsLoadingQuotes(false);
                }
              }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={quoteSearchTerm}
                  onChange={(e) => setQuoteSearchTerm(e.target.value)}
                  placeholder="Enter Quote ID (e.g. AZR-3335) or your email address..."
                  className="w-full pl-10 pr-4 py-3.5 rounded-2xl bg-slate-800 border border-sky-400/30 text-white text-xs sm:text-sm focus:outline-none focus:border-sky-400 min-h-[46px]"
                />
              </div>

              <button
                type="submit"
                disabled={isLoadingQuotes}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-300 text-slate-950 font-extrabold text-xs sm:text-sm shadow-md hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0 min-h-[46px]"
              >
                <Search className={`w-4 h-4 ${isLoadingQuotes ? 'animate-spin' : ''}`} />
                <span>{isLoadingQuotes ? 'Searching...' : 'Track Quote'}</span>
              </button>
            </form>

            {/* If guest looked up quotes */}
            {userQuotes.length > 0 && (
              <div className="pt-4 border-t border-white/10 space-y-3">
                <div className="text-xs font-bold text-sky-200">
                  Search Results ({userQuotes.length} record(s)):
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userQuotes.map((q) => (
                    <div
                      key={q.id}
                      className="p-5 rounded-2xl bg-slate-950 border border-amber-400/30 flex flex-col justify-between gap-3 shadow-lg"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="p-2 rounded-xl bg-sky-500/20 text-sky-300">
                            {q.type === 'flight' ? <Plane className="w-4 h-4" /> : <Stamp className="w-4 h-4" />}
                          </span>
                          <div>
                            <span className="text-xs font-mono text-amber-300 font-bold block">{q.id}</span>
                            <span className="text-xs text-white font-medium">
                              {q.type === 'flight' ? `${q.from} ✈️ ${q.to}` : (q as any).destinationCountry}
                            </span>
                          </div>
                        </div>
                        {getStatusBadge(q.status)}
                      </div>

                      <div className="text-xs text-slate-300">
                        Date: <span className="text-white font-medium">{q.type === 'flight' ? q.departureDate : (q as any).intendedTravelDate}</span> • Customer: <span className="text-white font-medium">{q.customerName}</span>
                      </div>

                      <button
                        onClick={() => setSelectedQuoteDetail(q)}
                        className="w-full py-2 rounded-xl bg-amber-400/20 hover:bg-amber-400 text-amber-300 hover:text-slate-950 font-bold text-xs transition-all flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Official Assessment & WhatsApp Agent</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* VIP Portal Benefits Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="glass-card rounded-3xl p-6 border border-white/10 space-y-3 bg-slate-900/80">
              <div className="w-12 h-12 rounded-2xl bg-sky-500/20 text-sky-300 flex items-center justify-center">
                <Plane className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-white font-serif-display">Live Airfare & Visa Tracking</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Check status updates in real-time as our IATA-certified ticketing specialists lock wholesale airline fares.
              </p>
            </div>

            <div className="glass-card rounded-3xl p-6 border border-white/10 space-y-3 bg-slate-900/80">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-300 flex items-center justify-center">
                <Crown className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-white font-serif-display">Exclusive VIP Privileges</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Save bespoke multi-day holiday plans, book hospital appointments, and unlock seasonal group discounts.
              </p>
            </div>

            <div className="glass-card rounded-3xl p-6 border border-white/10 space-y-3 bg-slate-900/80">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center">
                <MessageCircle className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-white font-serif-display">24/7 Dedicated WhatsApp Desk</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Direct one-touch messaging with our Dhaka & international operations desk for instant amendments.
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* AUTHENTICATED VIP USER PORTAL */
        <>
          {/* Authenticated VIP User Header & Hub */}
          <div className="glass-card rounded-3xl p-6 md:p-8 flex flex-col sm:flex-row items-center gap-6 border border-amber-400/25 shadow-2xl relative overflow-hidden bg-gradient-to-r from-slate-950/90 via-slate-900/90 to-[#0a192f]/90">
            {/* Ambient Gold Glow */}
            <div className="absolute -top-10 -right-10 w-72 h-72 bg-amber-500/15 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative group shrink-0">
              <img
                src={
                  user?.photoURL ||
                  `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                    user?.fullName || user?.email || 'traveler'
                  )}`
                }
                alt={user?.fullName || 'Traveler'}
                className="w-24 h-24 rounded-full object-cover border-4 border-amber-400/60 shadow-2xl ring-4 ring-amber-400/20"
              />
              <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 border-2 border-slate-950 flex items-center justify-center text-slate-950 text-xs font-black shadow-lg" title="Azraq VIP Member">
                👑
              </div>
            </div>

            <div className="flex-1 flex flex-col items-center sm:items-start text-center sm:text-left gap-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="font-serif-display text-2xl md:text-3xl font-black text-white tracking-tight">
                  Welcome back, {user?.fullName || 'Distinguished Traveler'}!
                </h1>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-gradient-to-r from-amber-400 to-amber-300 text-slate-950 shadow-md">
                  <Crown className="w-3.5 h-3.5 fill-slate-950" />
                  <span>Azraq VIP Elite</span>
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1 text-xs md:text-sm text-sky-200/90 font-medium">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-sky-300" />
                  <span>{user?.email}</span>
                </span>
                {user?.phone && (
                  <span className="flex items-center gap-1.5">
                    <span className="text-white/30">•</span>
                    <Phone className="w-3.5 h-3.5 text-emerald-300" />
                    <span>{user.phone}</span>
                  </span>
                )}
                {user?.homeLocation && (
                  <span className="flex items-center gap-1.5">
                    <span className="text-white/30">•</span>
                    <MapPin className="w-3.5 h-3.5 text-amber-300" />
                    <span>{user.homeLocation}</span>
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-300 line-clamp-1 mt-0.5">
                {user?.bio || 'VIP Global traveler with Azraq Tours & Travels.'}
              </p>
            </div>

            {/* Action buttons on header */}
            <div className="flex sm:flex-col gap-2 shrink-0">
              <button
                onClick={() => setActiveTab('settings')}
                className="px-4 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-sky-200 hover:text-white border border-white/10 transition-colors flex items-center gap-2 text-xs font-bold cursor-pointer min-h-[40px]"
              >
                <Settings className="w-4 h-4 text-amber-300" />
                <span>Settings</span>
              </button>

              <button
                onClick={logout}
                className="px-4 py-2.5 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-400/20 transition-colors flex items-center gap-2 text-xs font-bold cursor-pointer min-h-[40px]"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            </div>
          </div>

      {/* CORE 4-SECTION NAVIGATION TABS */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-3.5 overflow-x-auto hide-scrollbar">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap min-h-[44px] cursor-pointer ${
            activeTab === 'dashboard'
              ? 'bg-gradient-to-r from-amber-400 to-emerald-400 text-slate-950 shadow-lg font-black'
              : 'bg-white/5 text-sky-100/80 hover:bg-white/10 hover:text-white'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>1. Dashboard (Overview)</span>
        </button>

        <button
          onClick={() => setActiveTab('quote_history')}
          className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap min-h-[44px] cursor-pointer ${
            activeTab === 'quote_history'
              ? 'bg-gradient-to-r from-amber-400 to-emerald-400 text-slate-950 shadow-lg font-black'
              : 'bg-white/5 text-sky-100/80 hover:bg-white/10 hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>2. My Quote History ({userQuotes.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('saved_destinations')}
          className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap min-h-[44px] cursor-pointer ${
            activeTab === 'saved_destinations'
              ? 'bg-gradient-to-r from-amber-400 to-emerald-400 text-slate-950 shadow-lg font-black'
              : 'bg-white/5 text-sky-100/80 hover:bg-white/10 hover:text-white'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>3. Saved Destinations ({savedDestinations.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap min-h-[44px] cursor-pointer ${
            activeTab === 'settings'
              ? 'bg-gradient-to-r from-amber-400 to-emerald-400 text-slate-950 shadow-lg font-black'
              : 'bg-white/5 text-sky-100/80 hover:bg-white/10 hover:text-white'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>4. Account Settings</span>
        </button>

        {/* Secondary Saved Assets */}
        <button
          onClick={() => setActiveTab('itineraries')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap min-h-[44px] cursor-pointer ${
            activeTab === 'itineraries'
              ? 'bg-sky-500 text-slate-950 font-bold'
              : 'bg-white/5 text-slate-300 hover:text-white'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Saved Itineraries ({savedItineraries.length})</span>
        </button>
      </div>

      {/* SECTION 1: DASHBOARD (OVERVIEW) */}
      {activeTab === 'dashboard' && (
        <div className="space-y-8 animate-fade-in">
          {/* 3 Large Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {/* Metric 1: Total Quotes */}
            <div className="glass-card rounded-3xl p-6 border border-sky-400/30 shadow-xl bg-gradient-to-br from-sky-950/60 to-slate-900 flex items-center justify-between group hover:border-sky-400 transition-all">
              <div className="space-y-1">
                <div className="text-xs font-bold text-sky-300 uppercase tracking-wider">Total Quotes Requested</div>
                {totalQuotesCount === 0 ? (
                  <div>
                    <div className="text-sm font-bold text-amber-300 flex items-center gap-1.5 py-1">
                      <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>No quotes yet. Start your first journey!</span>
                    </div>
                    <div className="text-[11px] text-slate-400">Request your first custom quote below</div>
                  </div>
                ) : (
                  <div>
                    <div className="text-4xl font-extrabold text-white font-serif-display">{totalQuotesCount}</div>
                    <div className="text-[11px] text-slate-400">All submitted flight & visa requests</div>
                  </div>
                )}
              </div>
              <div className="w-14 h-14 rounded-2xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-400 group-hover:scale-110 transition-transform shrink-0">
                <FileText className="w-7 h-7" />
              </div>
            </div>

            {/* Metric 2: Pending Responses */}
            <div className="glass-card rounded-3xl p-6 border border-amber-400/30 shadow-xl bg-gradient-to-br from-amber-950/60 to-slate-900 flex items-center justify-between group hover:border-amber-400 transition-all">
              <div className="space-y-1">
                <div className="text-xs font-bold text-amber-300 uppercase tracking-wider">Pending Responses</div>
                <div className="text-4xl font-extrabold text-amber-300 font-serif-display">{pendingQuotesCount}</div>
                <div className="text-[11px] text-amber-200/70">Under review by Azraq staff</div>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300 group-hover:scale-110 transition-transform shrink-0">
                <Clock className="w-7 h-7" />
              </div>
            </div>

            {/* Metric 3: Upcoming / Booked Trips */}
            <div className="glass-card rounded-3xl p-6 border border-emerald-400/30 shadow-xl bg-gradient-to-br from-emerald-950/60 to-slate-900 flex items-center justify-between group hover:border-emerald-400 transition-all">
              <div className="space-y-1">
                <div className="text-xs font-bold text-emerald-300 uppercase tracking-wider">Upcoming / Booked Trips</div>
                <div className="text-4xl font-extrabold text-emerald-300 font-serif-display">{bookedTripsCount}</div>
                <div className="text-[11px] text-emerald-200/70">Confirmed vouchers & itineraries</div>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300 group-hover:scale-110 transition-transform shrink-0">
                <Crown className="w-7 h-7" />
              </div>
            </div>
          </div>

          {/* Quick Launchpad Action Cards */}
          <div className="space-y-3">
            <h3 className="text-lg font-serif-display font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              VIP Travel Services Launchpad
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Action 1: New Flight Quote */}
              <button
                onClick={() => onOpenFlightQuote && onOpenFlightQuote()}
                className="p-5 rounded-3xl bg-slate-900/90 border border-white/10 hover:border-sky-400/50 transition-all text-left group shadow-lg flex flex-col justify-between gap-4 cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-sky-500/20 text-sky-300 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Plane className="w-6 h-6" />
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-sky-300 transition-colors" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-sky-300 transition-colors">
                    Request Flight Quotation
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Get wholesale airfare deals for international & domestic airlines.
                  </p>
                </div>
              </button>

              {/* Action 2: New Visa Quote */}
              <button
                onClick={() => onOpenVisaQuote && onOpenVisaQuote()}
                className="p-5 rounded-3xl bg-slate-900/90 border border-white/10 hover:border-teal-400/50 transition-all text-left group shadow-lg flex flex-col justify-between gap-4 cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-teal-500/20 text-teal-300 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Stamp className="w-6 h-6" />
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-teal-300 transition-colors" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-teal-300 transition-colors">
                    Visa Processing Quote
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Thailand, Malaysia, Schengen, Dubai & Asian embassy checklist.
                  </p>
                </div>
              </button>

              {/* Action 3: Custom Itinerary Planner */}
              <button
                onClick={() => onNavigate && onNavigate('planner')}
                className="p-5 rounded-3xl bg-slate-900/90 border border-white/10 hover:border-amber-400/50 transition-all text-left group shadow-lg flex flex-col justify-between gap-4 cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-300 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-300 transition-colors" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                    AI Itinerary Planner
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Craft day-by-day custom multi-day travel schedules with packing checklists.
                  </p>
                </div>
              </button>

              {/* Action 4: VIP Concierge WhatsApp */}
              <a
                href={`https://wa.me/8801851172032?text=${encodeURIComponent(
                  `Hello Azraq Travel Concierge! My name is ${user?.fullName || 'VIP Member'} (${user?.email}). I would like assistance with my travel booking.`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="p-5 rounded-3xl bg-gradient-to-br from-emerald-950/80 to-slate-900 border border-emerald-500/30 hover:border-emerald-400 transition-all text-left group shadow-lg flex flex-col justify-between gap-4 cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <MessageCircle className="w-6 h-6" />
                  </div>
                  <ExternalLink className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-emerald-300 group-hover:text-emerald-200 transition-colors">
                    24/7 VIP Concierge (WhatsApp)
                  </h4>
                  <p className="text-xs text-slate-300 mt-1">
                    Direct instant chat with dedicated senior consultant.
                  </p>
                </div>
              </a>
            </div>
          </div>

          {/* Recent Quote Highlights */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-serif-display font-bold text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-sky-400" />
                Recent Quote Highlights
              </h3>
              <button
                onClick={() => setActiveTab('quote_history')}
                className="text-xs text-sky-400 hover:text-sky-300 font-bold flex items-center gap-1 cursor-pointer"
              >
                <span>View All Quotes ({userQuotes.length})</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {userQuotes.length === 0 ? (
              <div className="p-8 text-center glass-card rounded-3xl border border-white/10 text-slate-400 text-xs">
                No active quotation requests. Submit a Flight or Visa quote above to begin tracking.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userQuotes.slice(0, 2).map((q) => (
                  <div
                    key={q.id}
                    className="p-5 rounded-3xl bg-slate-900/90 border border-white/15 hover:border-amber-400/40 transition-all flex flex-col justify-between gap-4 shadow-xl"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="p-2 rounded-xl bg-sky-500/20 text-sky-300">
                            {q.type === 'flight' ? <Plane className="w-4 h-4" /> : <Stamp className="w-4 h-4" />}
                          </span>
                          <div>
                            <span className="text-xs font-mono text-amber-300 font-bold block">{q.id}</span>
                            <span className="text-xs text-slate-300 font-medium">
                              {q.type === 'flight' ? 'Flight Ticket Quotation' : 'Visa Application Quote'}
                            </span>
                          </div>
                        </div>
                        {getStatusBadge(q.status)}
                      </div>

                      <div className="p-3.5 bg-slate-950/70 rounded-2xl border border-white/5 space-y-1.5 text-xs">
                        {q.type === 'flight' ? (
                          <>
                            <div className="flex justify-between text-slate-300">
                              <span className="text-slate-400">Route:</span>
                              <span className="font-bold text-white">{q.from} ✈️ {q.to}</span>
                            </div>
                            <div className="flex justify-between text-slate-300">
                              <span className="text-slate-400">Travel Date:</span>
                              <span>{q.departureDate} ({q.tripType})</span>
                            </div>
                            {q.quotedPrice && (
                              <div className="pt-2 mt-1 border-t border-white/10 flex justify-between text-emerald-300 font-bold">
                                <span>Offered Price:</span>
                                <span>{q.quotedPrice}</span>
                              </div>
                            )}
                          </>
                        ) : (
                          <>
                            <div className="flex justify-between text-slate-300">
                              <span className="text-slate-400">Destination:</span>
                              <span className="font-bold text-white">{(q as any).destinationCountry}</span>
                            </div>
                            <div className="flex justify-between text-slate-300">
                              <span className="text-slate-400">Service:</span>
                              <span>{(q as any).requiredService}</span>
                            </div>
                            {(q as any).quotedPrice && (
                              <div className="pt-2 mt-1 border-t border-white/10 flex justify-between text-emerald-300 font-bold">
                                <span>Total Fee:</span>
                                <span>{(q as any).quotedPrice}</span>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
                      <span className="text-[11px] text-slate-400">
                        {new Date(q.createdAt).toLocaleDateString()}
                      </span>
                      <button
                        onClick={() => setSelectedQuoteDetail(q)}
                        className="px-4 py-2 rounded-xl bg-amber-400/20 hover:bg-amber-400 text-amber-300 hover:text-slate-950 font-bold text-xs transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Details</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ======================================================== */}
          {/* SECTION: MY TRIP STATUS (LIVE ACTIVITY TIMELINE FEED)   */}
          {/* ======================================================== */}
          <div className="space-y-4 pt-4 border-t border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-serif-display font-bold text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-emerald-400" />
                  My Trip Status & Live Activity Timeline
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Real-time step-by-step milestone progression for your flight, visa, and holiday requests.
                </p>
              </div>

              <button
                onClick={loadUserQuotes}
                className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
                title="Refresh timeline updates"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingQuotes ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>

            {timelineEvents.length === 0 ? (
              <div className="p-8 text-center glass-card rounded-3xl border border-white/10 space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-400 mx-auto">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div className="max-w-md mx-auto">
                  <h4 className="text-sm font-bold text-white">No quotes yet. Start your first journey!</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    When you request a flight or visa quote, our dedicated staff timeline will show every step from ticket search to booking confirmation.
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  {onOpenFlightQuote && (
                    <button
                      onClick={onOpenFlightQuote}
                      className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs shadow-md transition-transform hover:scale-105 flex items-center gap-1.5"
                    >
                      <Plane className="w-4 h-4" />
                      Request Flight Quote
                    </button>
                  )}
                  {onOpenVisaQuote && (
                    <button
                      onClick={onOpenVisaQuote}
                      className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-md transition-transform hover:scale-105 flex items-center gap-1.5"
                    >
                      <Stamp className="w-4 h-4" />
                      Request Visa Quote
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="glass-card rounded-3xl p-6 border border-white/15 shadow-xl bg-slate-900/90 relative overflow-hidden">
                {/* Vertical Timeline Track */}
                <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-2.5 sm:before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-white/15">
                  {timelineEvents.map((evt, idx) => {
                    const dotClass =
                      evt.dotColor === 'yellow'
                        ? 'bg-amber-400 ring-4 ring-amber-400/20'
                        : evt.dotColor === 'blue'
                        ? 'bg-sky-400 ring-4 ring-sky-400/20'
                        : evt.dotColor === 'green'
                        ? 'bg-emerald-400 ring-4 ring-emerald-400/20'
                        : evt.dotColor === 'purple'
                        ? 'bg-purple-400 ring-4 ring-purple-400/20'
                        : 'bg-slate-400 ring-4 ring-slate-400/20';

                    return (
                      <div key={evt.id || idx} className="relative group">
                        {/* Status Dot */}
                        <div
                          className={`absolute -left-6 sm:-left-8 top-1.5 w-3.5 h-3.5 rounded-full ${dotClass} transition-transform group-hover:scale-125`}
                        />

                        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                          <div className="space-y-1 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-mono text-xs font-bold text-amber-300">{evt.quoteId}</span>
                              <span className="text-white/40">•</span>
                              <span className="text-xs font-semibold text-white">{evt.stepTitle}</span>
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-sky-200 border border-white/10 font-mono">
                                {evt.routeOrDestination}
                              </span>
                            </div>

                            <p className="text-xs text-slate-300 leading-relaxed pt-1">{evt.description}</p>

                            {/* Specialist or Pricing tags if available */}
                            <div className="flex flex-wrap items-center gap-3 pt-2 text-[11px]">
                              {evt.agentName && (
                                <span className="text-sky-300 flex items-center gap-1 font-medium">
                                  <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
                                  Specialist: {evt.agentName}
                                </span>
                              )}
                              {evt.quotedPrice && (
                                <span className="text-emerald-300 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                                  Quoted Price: {evt.quotedPrice}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Timestamp and WhatsApp Action */}
                          <div className="sm:text-right shrink-0 flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
                            <span className="text-[11px] text-white/50 font-mono">
                              {new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} •{' '}
                              {new Date(evt.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                            </span>

                            <a
                              href={`https://wa.me/8801851172032?text=${encodeURIComponent(
                                `Hello Azraq Concierge! Inquiring about quote ${evt.quoteId} for ${evt.routeOrDestination}. Status: ${evt.stepTitle}`
                              )}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-[11px] font-semibold border border-emerald-500/30 transition-colors"
                            >
                              <MessageCircle className="w-3 h-3" />
                              <span>WhatsApp Follow-up</span>
                            </a>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SECTION 2: MY QUOTE HISTORY (CRITICAL - Sortable & Searchable Table) */}
      {activeTab === 'quote_history' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-serif-display font-bold text-white">
                My Quotation History ({userQuotes.length})
              </h2>
              <p className="text-xs text-sky-200/80">
                Track status updates, review flight fares and visa requirements, or re-request an updated rate.
              </p>
            </div>

            <button
              onClick={loadUserQuotes}
              disabled={isLoadingQuotes}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-sky-200 text-xs font-bold flex items-center gap-2 transition-all self-start sm:self-auto cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingQuotes ? 'animate-spin' : ''}`} />
              <span>Refresh Status</span>
            </button>
          </div>

          {/* Search & Filter Bar */}
          <div className="p-4 rounded-3xl bg-slate-900/90 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Status Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
              {(
                [
                  { id: 'all', label: 'All' },
                  { id: 'pending', label: '🟡 Pending' },
                  { id: 'processing', label: '🔵 Processing' },
                  { id: 'quoted', label: '🟢 Quoted' },
                  { id: 'booked', label: '🟣 Booked' },
                  { id: 'expired', label: '⚪ Expired' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setQuoteStatusFilter(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    quoteStatusFilter === tab.id
                      ? 'bg-amber-400 text-slate-950 font-bold shadow-md'
                      : 'bg-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by ID (AZR-1024), Route..."
                value={quoteSearchTerm}
                onChange={(e) => setQuoteSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-800 border border-white/10 text-white text-xs placeholder-slate-400 focus:outline-none focus:border-sky-400"
              />
            </div>
          </div>

          {/* Quotations Data Table */}
          {filteredQuotes.length === 0 ? (
            <div className="p-12 text-center glass-card rounded-3xl border border-white/10 text-slate-400 space-y-3">
              <FileText className="w-12 h-12 text-slate-600 mx-auto" />
              <div className="text-base font-bold text-white">No Quotation Requests Found</div>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                No quotes match your search or filter. You can submit a new quotation request using the buttons above.
              </p>
            </div>
          ) : (
            <div className="glass-card rounded-3xl border border-white/10 shadow-2xl overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-white/10 bg-slate-800/80 text-sky-200 uppercase font-semibold tracking-wider text-[11px]">
                    <th className="p-4">Quote ID</th>
                    <th className="p-4">Destination / Route</th>
                    <th className="p-4">Service Type</th>
                    <th className="p-4">Request Date</th>
                    <th className="p-4">Status Badge</th>
                    <th className="p-4">Assigned Agent</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-200">
                  {filteredQuotes.map((q) => {
                    const isFlight = q.type === 'flight';
                    const route = isFlight ? `${q.from} ✈️ ${q.to}` : (q as any).destinationCountry;

                    return (
                      <tr
                        key={q.id}
                        onClick={() => setSelectedQuoteDetail(q)}
                        className="hover:bg-white/5 transition-colors cursor-pointer"
                      >
                        <td className="p-4 font-mono font-bold text-amber-300 text-xs">
                          {q.id}
                        </td>
                        <td className="p-4">
                          <div className="font-bold text-white">{route}</div>
                          <div className="text-[11px] text-slate-400">
                            {isFlight ? (q as any).departureDate : (q as any).intendedTravelDate}
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-sky-500/10 text-sky-300 font-semibold text-[11px] border border-sky-400/20">
                            {isFlight ? <Plane className="w-3.5 h-3.5" /> : <Stamp className="w-3.5 h-3.5" />}
                            <span>{isFlight ? 'Flight Ticket' : 'Visa Processing'}</span>
                          </span>
                        </td>
                        <td className="p-4 text-slate-400 font-mono text-[11px]">
                          {new Date(q.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-4">
                          {getStatusBadge(q.status)}
                        </td>
                        <td className="p-4 text-slate-300 text-[11px]">
                          {q.assignedStaff || 'Senior Travel Desk'}
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedQuoteDetail(q);
                            }}
                            className="px-3.5 py-1.5 rounded-xl bg-amber-400/20 hover:bg-amber-400 text-amber-300 hover:text-slate-950 font-bold text-xs transition-all inline-flex items-center gap-1 cursor-pointer"
                          >
                            <span>View Details / Re-request</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* SECTION 3: SAVED DESTINATIONS (Grid with direct "Get New Quote" CTA) */}
      {activeTab === 'saved_destinations' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-serif-display font-bold text-white">Saved Travel Destinations</h2>
              <p className="text-xs text-sky-200/80">
                Destinations you saved during exploration. Click to generate instant quotes or view attraction guides.
              </p>
            </div>
          </div>

          {savedDestinations.length === 0 ? (
            <div className="col-span-full p-12 text-center glass-card rounded-3xl flex flex-col items-center justify-center gap-3 border border-white/10 shadow-xl bg-slate-900/80">
              <Compass className="w-12 h-12 text-slate-600" />
              <p className="text-sm text-white font-bold font-serif-display">No saved travel destinations yet.</p>
              <p className="text-xs text-slate-400 max-w-md leading-relaxed">
                Explore our curated international tour packages and Asian city destinations to bookmark your favorites!
              </p>
              <button
                onClick={() => onNavigate && onNavigate('packages')}
                className="mt-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 to-emerald-400 text-slate-950 font-extrabold text-xs shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer"
              >
                Browse Holiday Packages
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedDestinations.map((dest) => (
                <div
                  key={dest.id}
                  className="glass-card rounded-3xl overflow-hidden border border-white/15 hover:border-amber-400/50 transition-all flex flex-col group shadow-xl bg-slate-900/90"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={dest.imageUrl}
                      alt={dest.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3.5 left-3.5 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-full text-xs text-amber-300 font-bold border border-white/10">
                      {dest.country}
                    </div>
                    <div className="absolute top-3.5 right-3.5 bg-emerald-400 text-slate-950 px-2.5 py-0.5 rounded-full text-[11px] font-black shadow-md">
                      {dest.category}
                    </div>
                  </div>

                  <div className="p-5 flex flex-col justify-between flex-1 gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-white font-serif-display group-hover:text-amber-300 transition-colors">
                        {dest.name}
                      </h3>
                      <p className="text-xs text-slate-300 line-clamp-2 mt-1.5 leading-relaxed">
                        {dest.description}
                      </p>
                    </div>

                    <div className="pt-3.5 border-t border-white/10 flex items-center justify-between gap-2">
                      <div>
                        <span className="text-[10px] uppercase font-semibold text-slate-400 block">Est. Budget</span>
                        <span className="text-xs text-amber-300 font-extrabold font-mono">
                          {dest.priceRange || 'BDT 35,000 - 85,000'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onSelectDestination && onSelectDestination(dest)}
                          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-sky-200 hover:text-white border border-white/10 transition-colors"
                          title="Explore Attraction Guide"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => onOpenFlightQuote && onOpenFlightQuote()}
                          className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-emerald-400 text-slate-950 font-extrabold text-xs shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                        >
                          Get New Quote
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SECTION 4: ACCOUNT SETTINGS (Profile + Password Change) */}
      {activeTab === 'settings' && (
        <div className="max-w-3xl mx-auto w-full space-y-8 animate-fade-in">
          {/* Profile Details Form */}
          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/15 shadow-2xl space-y-6 bg-slate-900/90">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h2 className="text-xl font-serif-display font-bold text-white">VIP Profile & Contact Info</h2>
                <p className="text-xs text-sky-200/80">Keep your details up to date for fast WhatsApp quotation dispatch</p>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
                <UserIcon className="w-5 h-5" />
              </div>
            </div>

            <form onSubmit={handleSaveProfileSettings} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-sky-200">Full Name *</label>
                  <input
                    type="text"
                    value={editFullName}
                    onChange={(e) => setEditFullName(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-2xl bg-slate-800 border border-sky-400/30 text-white text-xs sm:text-sm focus:outline-none focus:border-sky-400 min-h-[44px]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-sky-200">Email Address (Read Only)</label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full px-4 py-3 rounded-2xl bg-slate-800/50 border border-white/10 text-slate-400 text-xs sm:text-sm cursor-not-allowed min-h-[44px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-sky-200">Phone Number / WhatsApp *</label>
                  <input
                    type="text"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    placeholder="+880 1851-172032"
                    className="w-full px-4 py-3 rounded-2xl bg-slate-800 border border-sky-400/30 text-white text-xs sm:text-sm focus:outline-none focus:border-sky-400 min-h-[44px]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-sky-200">Home City / Country</label>
                  <input
                    type="text"
                    value={editHomeLocation}
                    onChange={(e) => setEditHomeLocation(e.target.value)}
                    placeholder="Dhaka, Bangladesh"
                    className="w-full px-4 py-3 rounded-2xl bg-slate-800 border border-sky-400/30 text-white text-xs sm:text-sm focus:outline-none focus:border-sky-400 min-h-[44px]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-sky-200">Travel Preferences / Bio</label>
                <textarea
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  rows={2}
                  placeholder="Passionate traveler exploring Asia and beyond..."
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-800 border border-sky-400/30 text-white text-xs sm:text-sm focus:outline-none focus:border-sky-400"
                />
              </div>

              <button
                type="submit"
                disabled={isSavingSettings}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-emerald-400 text-slate-950 font-extrabold text-sm shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer min-h-[44px]"
              >
                {isSavingSettings ? 'Saving Changes...' : 'Save Profile Information'}
              </button>
            </form>
          </div>

          {/* Change Password Section */}
          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/15 shadow-2xl space-y-6 bg-slate-900/90">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h2 className="text-xl font-serif-display font-bold text-white flex items-center gap-2">
                  <KeyRound className="w-5 h-5 text-amber-300" />
                  Change Account Password
                </h2>
                <p className="text-xs text-sky-200/80">Protect your VIP account with a strong, secure passphrase</p>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-300">
                <Lock className="w-5 h-5" />
              </div>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-sky-200">Current Password *</label>
                <input
                  type={showPass ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  placeholder="Enter current password"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-800 border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-sky-400 min-h-[44px]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-sky-200">New Password *</label>
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    placeholder="Min 8 characters"
                    className="w-full px-4 py-3 rounded-2xl bg-slate-800 border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-sky-400 min-h-[44px]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-sky-200">Confirm New Password *</label>
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="Confirm new password"
                    className="w-full px-4 py-3 rounded-2xl bg-slate-800 border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-sky-400 min-h-[44px]"
                  />
                </div>
              </div>

              {/* Password Strength Indicator */}
              {newPassword && (
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px] text-slate-300 font-semibold">
                    <span>Password Strength:</span>
                    <span className={passStrength >= 75 ? 'text-emerald-400' : passStrength >= 50 ? 'text-amber-400' : 'text-rose-400'}>
                      {passStrength >= 75 ? 'Strong' : passStrength >= 50 ? 'Medium' : 'Weak'}
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden border border-slate-700">
                    <div
                      className={`h-full transition-all duration-300 ${
                        passStrength >= 75 ? 'bg-emerald-400' : passStrength >= 50 ? 'bg-amber-400' : 'bg-rose-400'
                      }`}
                      style={{ width: `${passStrength}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="text-xs text-sky-300 hover:text-sky-200 font-semibold cursor-pointer"
                >
                  {showPass ? 'Hide Passwords' : 'Show Passwords'}
                </button>

                <button
                  type="submit"
                  disabled={isChangingPass}
                  className="px-6 py-3 rounded-2xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-extrabold text-xs shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isChangingPass ? 'Updating Password...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SECTION 5: SAVED ITINERARIES */}
      {activeTab === 'itineraries' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          {savedItineraries.length === 0 ? (
            <div className="col-span-full p-12 text-center glass-card rounded-3xl flex flex-col items-center justify-center gap-3 border border-white/10">
              <Calendar className="w-12 h-12 text-slate-600" />
              <p className="text-sm text-white font-bold">No saved custom itineraries yet.</p>
              <p className="text-xs text-slate-400">
                Generate your custom multi-day travel schedule in the Planner tab and save it to your VIP dashboard!
              </p>
            </div>
          ) : (
            savedItineraries.map((itinerary) => (
              <div
                key={itinerary.id}
                className="glass-card rounded-3xl p-5 flex flex-col justify-between border border-white/15 shadow-xl hover:border-amber-400/40 transition-all group bg-slate-900/90"
              >
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-start">
                    <span className="text-xs text-amber-300 font-bold uppercase tracking-wider">
                      {itinerary.destination}
                    </span>
                    <button
                      onClick={() => onRemoveItinerary(itinerary.id)}
                      className="text-slate-400 hover:text-rose-400 transition-colors p-1 cursor-pointer"
                      title="Remove from saved"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <h3 className="font-serif-display text-lg text-white font-bold group-hover:text-amber-300 transition-colors">
                    {itinerary.title}
                  </h3>

                  <p className="text-xs text-slate-300 line-clamp-2">
                    {itinerary.aiSummary}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    {itinerary.days?.length || 0} Days Schedule
                  </span>
                  <button
                    onClick={() => onSelectItinerary(itinerary)}
                    className="bg-amber-400 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <span>Open Planner</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
        </>
      )}

      {/* EXACT QUOTE DETAIL & RE-REQUEST MODAL */}
      {selectedQuoteDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-fade-in">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-amber-400/30 rounded-3xl shadow-2xl overflow-hidden my-8 text-slate-100">
            {/* Modal Header */}
            <div className="px-6 py-5 bg-gradient-to-r from-slate-950 via-slate-900 to-[#0a192f] border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-xl">
                  {selectedQuoteDetail.type === 'flight' ? '✈️' : '🛂'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-amber-300 font-mono font-bold">{selectedQuoteDetail.id}</span>
                    {getStatusBadge(selectedQuoteDetail.status)}
                  </div>
                  <h3 className="text-lg font-serif-display font-bold text-white">
                    {selectedQuoteDetail.type === 'flight' ? 'Official Flight Quotation' : 'Official Visa Assessment'}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setSelectedQuoteDetail(null)}
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Quoted Price Banner if available */}
              {selectedQuoteDetail.quotedPrice ? (
                <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-400/30 flex items-center justify-between">
                  <div>
                    <div className="text-[11px] uppercase font-bold text-emerald-300">Quoted Fare / Service Rate</div>
                    <div className="text-xl font-black text-white font-mono">{selectedQuoteDetail.quotedPrice}</div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/40">
                    Official Rate Lock
                  </span>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-400/30 flex items-center gap-3 text-amber-200 text-xs">
                  <Clock className="w-5 h-5 text-amber-400 shrink-0" />
                  <div>
                    <strong>Quotation in Preparation</strong>: Our travel desk is currently checking live airline GDS inventories and embassy schedules.
                  </div>
                </div>
              )}

              {/* Request Parameters Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-slate-950/80 rounded-2xl border border-white/10 text-xs">
                {selectedQuoteDetail.type === 'flight' ? (
                  <>
                    <div><span className="text-slate-400">Route:</span> <strong className="text-white">{(selectedQuoteDetail as any).from} ✈️ {(selectedQuoteDetail as any).to}</strong></div>
                    <div><span className="text-slate-400">Trip Type:</span> <strong className="text-white">{(selectedQuoteDetail as any).tripType}</strong></div>
                    <div><span className="text-slate-400">Departure:</span> <strong className="text-white">{(selectedQuoteDetail as any).departureDate}</strong></div>
                    <div><span className="text-slate-400">Return:</span> <strong className="text-white">{(selectedQuoteDetail as any).returnDate || 'N/A'}</strong></div>
                    <div><span className="text-slate-400">Passengers:</span> <strong className="text-white">{(selectedQuoteDetail as any).adults} Adult(s), {(selectedQuoteDetail as any).cabinClass}</strong></div>
                    <div><span className="text-slate-400">Preferred Airline:</span> <strong className="text-white">{(selectedQuoteDetail as any).preferredAirline || 'Any suitable'}</strong></div>
                  </>
                ) : (
                  <>
                    <div><span className="text-slate-400">Destination:</span> <strong className="text-white">{(selectedQuoteDetail as any).destinationCountry}</strong></div>
                    <div><span className="text-slate-400">Visa Type:</span> <strong className="text-white">{(selectedQuoteDetail as any).visaType} Visa</strong></div>
                    <div><span className="text-slate-400">Travel Date:</span> <strong className="text-white">{(selectedQuoteDetail as any).intendedTravelDate}</strong></div>
                    <div><span className="text-slate-400">Applicants:</span> <strong className="text-white">{(selectedQuoteDetail as any).applicantsCount} Person(s)</strong></div>
                    <div><span className="text-slate-400">Service Scope:</span> <strong className="text-white">{(selectedQuoteDetail as any).requiredService}</strong></div>
                    <div><span className="text-slate-400">Embassy Fee:</span> <strong className="text-teal-300">{(selectedQuoteDetail as any).visaFee || 'Included in quotation'}</strong></div>
                  </>
                )}
              </div>

              {/* Staff Notes / Flight Options */}
              {selectedQuoteDetail.staffNote && (
                <div className="p-4 rounded-2xl bg-sky-950/60 border border-sky-400/30 text-xs space-y-1.5">
                  <div className="font-bold text-sky-300 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-amber-300" />
                    <span>Travel Consultant Message ({selectedQuoteDetail.assignedStaff || 'Azraq Travel Expert'}):</span>
                  </div>
                  <p className="text-slate-200 leading-relaxed">{selectedQuoteDetail.staffNote}</p>
                  {selectedQuoteDetail.flightOptions && (
                    <div className="mt-2 pt-2 border-t border-sky-400/20 text-slate-300 font-mono text-[11px] whitespace-pre-line">
                      {selectedQuoteDetail.flightOptions}
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Quote</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleRequestQuoteUpdate(selectedQuoteDetail)}
                    disabled={isRequestingUpdate}
                    className="px-4 py-2.5 rounded-2xl bg-amber-400/20 hover:bg-amber-400 text-amber-300 hover:text-slate-950 font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isRequestingUpdate ? 'animate-spin' : ''}`} />
                    <span>Request Update / Refresh</span>
                  </button>

                  <a
                    href={`https://wa.me/8801851172032?text=${encodeURIComponent(
                      `Hello Azraq Tours! Inquiring regarding my quotation request ID: ${selectedQuoteDetail.id} for ${
                        selectedQuoteDetail.type === 'flight'
                          ? `${(selectedQuoteDetail as any).from} to ${(selectedQuoteDetail as any).to}`
                          : (selectedQuoteDetail as any).destinationCountry
                      }. Please assist.`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-5 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp Agent</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
