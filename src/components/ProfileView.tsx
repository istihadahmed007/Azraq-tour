import React, { useState } from 'react';
import { FeedPost, Itinerary, isWebsiteOwner } from '../types';
import { BRAND_LOGOS } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { useFeed } from '../context/FeedContext';
import {
  Check,
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
  Share2,
  Trash2,
  Calendar,
  Compass,
} from 'lucide-react';

interface ProfileViewProps {
  savedItineraries: Itinerary[];
  onSelectItinerary: (itinerary: Itinerary) => void;
  onRemoveItinerary: (id: string) => void;
  onNavigateToFeed?: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  savedItineraries,
  onSelectItinerary,
  onRemoveItinerary,
  onNavigateToFeed,
}) => {
  const { user, isGuest, openAuthModal, loginWithGoogle, logout } = useAuth();
  const {
    userPosts,
    bookmarkedPosts,
    toggleLike,
    toggleBookmark,
    deletePost,
  } = useFeed();

  const [activeTab, setActiveTab] = useState<'my_posts' | 'bookmarks' | 'itineraries'>('my_posts');

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 pt-20 md:pt-10 pb-24 flex flex-col gap-8">
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
                Please verify <strong>{user.email}</strong> to ensure full account recovery and access.
              </p>
            </div>
          </div>

          <button
            onClick={() => openAuthModal('email_verification')}
            className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-semibold text-xs transition-all shrink-0 shadow-md"
          >
            Verify Email Now
          </button>
        </div>
      )}

      {/* Guest Mode Hero Card */}
      {isGuest ? (
        <div className="glass-card rounded-3xl p-8 md:p-10 flex flex-col items-center text-center gap-6 border border-sky-300/30 shadow-2xl relative overflow-hidden">
          <div className="w-20 h-20 rounded-full bg-sky-500/20 border border-sky-300/40 flex items-center justify-center text-4xl shadow-xl">
            🌍
          </div>

          <div className="max-w-md space-y-2">
            <h1 className="font-serif-display text-2xl md:text-3xl font-bold text-white">
              Welcome to Azraq Tours & Travels ✈️
            </h1>
            <p className="text-xs md:text-sm text-sky-100/80 leading-relaxed">
              Sign in with Google or create an account to share stories in the Feed, bookmark spots, access your personalized travel profile, and manage itineraries.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
            <button
              onClick={() => loginWithGoogle()}
              className="px-6 py-3.5 rounded-2xl bg-white hover:bg-gray-100 text-gray-900 font-bold text-xs sm:text-sm transition-all shadow-xl active:scale-95 flex items-center gap-2.5"
            >
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google"
                className="w-5 h-5"
              />
              <span>Sign in with Google</span>
            </button>

            <button
              onClick={() => openAuthModal('login')}
              className="px-5 py-3.5 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs sm:text-sm transition-all shadow-md active:scale-95 flex items-center gap-2"
            >
              <Mail className="w-4 h-4" />
              <span>Email Sign In</span>
            </button>

            <button
              onClick={() => openAuthModal('register')}
              className="px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm transition-all border border-white/20"
            >
              Create Account
            </button>
          </div>
        </div>
      ) : (
        /* Authenticated User Header Card */
        <div className="glass-card rounded-3xl p-6 md:p-8 flex flex-col sm:flex-row items-center gap-6 border border-white/15 shadow-2xl relative overflow-hidden">
          {/* Glow ambient background */}
          <div className="absolute -top-10 -right-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative group">
            <img
              src={
                user?.photoURL ||
                `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                  user?.fullName || 'traveler'
                )}`
              }
              alt={user?.fullName || 'Traveler'}
              className="w-24 h-24 rounded-full object-cover border-4 border-primary/40 shadow-xl shrink-0"
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
                <span className="material-symbols-outlined text-primary text-xl" title="Verified Traveler">
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
              {user?.country && (
                <span className="flex items-center gap-1">
                  <span className="text-white/40">•</span>
                  <Globe className="w-3.5 h-3.5 text-sky-400" />
                  <span>{user.country}</span>
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

            {/* Travel Preferences Chips */}
            {user?.travelPreferences && user.travelPreferences.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {user.travelPreferences.map((pref) => (
                  <span
                    key={pref}
                    className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-sky-500/20 text-sky-200 border border-sky-400/30"
                  >
                    {pref}
                  </span>
                ))}
              </div>
            )}

            {/* Bio */}
            {user?.bio && (
              <p className="text-xs text-sky-100/90 mt-1 max-w-xl italic">
                "{user.bio}"
              </p>
            )}

            <div className="flex flex-wrap items-center gap-4 mt-3 pt-3 border-t border-white/10 w-full justify-center sm:justify-start text-xs text-outline">
              <span className="flex items-center gap-1">
                <strong className="text-white font-semibold">{userPosts.length}</strong> Your Stories
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <strong className="text-white font-semibold">{bookmarkedPosts.length}</strong> Bookmarks
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <strong className="text-white font-semibold">{savedItineraries.length}</strong> Saved Itineraries
              </span>
              <span>•</span>
              <button
                onClick={() => openAuthModal('onboarding')}
                className="text-sky-300 hover:text-white font-medium underline underline-offset-2 ml-auto sm:ml-0"
              >
                Edit Preferences
              </button>
            </div>
          </div>

          <button
            onClick={logout}
            className="sm:self-start p-2.5 rounded-2xl bg-white/5 hover:bg-rose-500/20 text-sky-200 hover:text-rose-300 border border-white/10 transition-colors flex items-center gap-1.5 text-xs font-medium"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Log Out</span>
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-white/10 pb-3 overflow-x-auto hide-scrollbar">
        <button
          onClick={() => setActiveTab('my_posts')}
          className={`px-5 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'my_posts'
              ? 'bg-primary text-on-primary shadow-md'
              : 'bg-white/5 text-on-surface-variant hover:bg-white/10 hover:text-white'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>My Stories & Posts ({userPosts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('bookmarks')}
          className={`px-5 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'bookmarks'
              ? 'bg-primary text-on-primary shadow-md'
              : 'bg-white/5 text-on-surface-variant hover:bg-white/10 hover:text-white'
          }`}
        >
          <Bookmark className="w-3.5 h-3.5" />
          <span>Bookmarked Posts ({bookmarkedPosts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('itineraries')}
          className={`px-5 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'itineraries'
              ? 'bg-primary text-on-primary shadow-md'
              : 'bg-white/5 text-on-surface-variant hover:bg-white/10 hover:text-white'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Saved Itineraries ({savedItineraries.length})</span>
        </button>
      </div>

      {/* Tab Contents: My Posts */}
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
                  {isGuest
                    ? 'Log in to post photos and travel discoveries.'
                    : 'Share your latest trip or photo in the Feed tab to see it here on your profile.'}
                </p>
              </div>

              {onNavigateToFeed && (
                <button
                  onClick={onNavigateToFeed}
                  className="mt-2 px-5 py-2.5 rounded-full bg-primary hover:bg-primary-fixed text-on-primary text-xs font-bold transition-all shadow-md"
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
                    <div className="absolute top-3 left-3 bg-slate-950/70 backdrop-blur-md px-3 py-1 rounded-full text-xs text-tertiary font-semibold flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-amber-300" />
                      <span>{post.location}</span>
                    </div>

                    <button
                      onClick={() => deletePost(post.id)}
                      className="absolute top-3 right-3 bg-rose-500/80 hover:bg-rose-600 text-white p-1.5 rounded-full transition-all shadow-md"
                      title="Delete post"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                <div className="p-4 flex flex-col justify-between flex-1 gap-3">
                  <div className="space-y-1.5">
                    <p className="text-xs text-sky-100/90 leading-relaxed line-clamp-3">
                      {post.caption}
                    </p>

                    {post.hashtags && post.hashtags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {post.hashtags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] text-primary font-medium bg-primary/10 px-2 py-0.5 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

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

      {/* Tab Contents: Bookmarks */}
      {activeTab === 'bookmarks' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarkedPosts.length === 0 ? (
            <div className="col-span-full p-12 text-center glass-card rounded-3xl flex flex-col items-center justify-center gap-3 border border-white/10">
              <span className="material-symbols-outlined text-4xl text-outline">bookmark_border</span>
              <p className="text-sm text-on-surface-variant font-medium">No bookmarked posts yet.</p>
              <p className="text-xs text-outline max-w-sm">
                Browse the Feed and tap the bookmark icon on any travel story to save it here for quick inspiration.
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
                    <div className="absolute top-3 left-3 bg-slate-950/70 backdrop-blur-md px-3 py-1 rounded-full text-xs text-tertiary font-semibold flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-amber-300" />
                      <span>{post.location}</span>
                    </div>

                    <button
                      onClick={() => toggleBookmark(post.id)}
                      className="absolute top-3 right-3 bg-amber-500/90 text-slate-950 p-1.5 rounded-full transition-all shadow-md"
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

                  <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-outline">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggleLike(post.id)}
                        className={`flex items-center gap-1 ${
                          post.isLiked ? 'text-rose-400 font-bold' : 'hover:text-rose-400'
                        }`}
                      >
                        <Heart
                          className={`w-3.5 h-3.5 ${
                            post.isLiked ? 'fill-rose-500 text-rose-500' : ''
                          }`}
                        />
                        <span>{post.likes}</span>
                      </button>
                      <span className="flex items-center gap-1">
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

      {/* Tab Contents: Saved Itineraries */}
      {activeTab === 'itineraries' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedItineraries.length === 0 ? (
            <div className="col-span-full p-12 text-center glass-card rounded-3xl flex flex-col items-center justify-center gap-3 border border-white/10">
              <span className="material-symbols-outlined text-4xl text-outline">event_busy</span>
              <p className="text-sm text-on-surface-variant font-medium">No saved itineraries yet.</p>
              <p className="text-xs text-outline">
                Generate your custom itinerary in the Planner tab and save it to your profile!
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
                      className="text-outline hover:text-rose-400 transition-colors p-1"
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
                    className="bg-primary/20 text-primary hover:bg-primary hover:text-on-primary text-xs font-semibold px-4 py-2 rounded-xl transition-all flex items-center gap-1"
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
    </div>
  );
};
