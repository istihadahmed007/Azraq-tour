import React, { useState, useEffect, useMemo } from 'react';
import { UserFeedItem, TimelineDotColor, Destination, NavView } from '../types';
import { useAuth } from '../context/AuthContext';
import {
  Bell,
  CheckCircle2,
  Clock,
  AlertCircle,
  Info,
  Plane,
  Stamp,
  MessageCircle,
  Phone,
  Mail,
  Compass,
  CheckCheck,
  Sparkles,
  ExternalLink,
  ChevronRight,
  RefreshCw,
  ShieldCheck,
  Calendar,
  Eye,
} from 'lucide-react';

interface UpdatesFeedTabProps {
  onExploreDestinations?: () => void;
  onOpenFlightQuote?: () => void;
  onOpenVisaQuote?: () => void;
  onViewQuoteDetail?: (quoteId: string) => void;
}

export const UpdatesFeedTab: React.FC<UpdatesFeedTabProps> = ({
  onExploreDestinations,
  onOpenFlightQuote,
  onOpenVisaQuote,
  onViewQuoteDetail,
}) => {
  const { user, showToast } = useAuth();
  const [feedItems, setFeedItems] = useState<UserFeedItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isMarkingRead, setIsMarkingRead] = useState<boolean>(false);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [hasPersonalActivity, setHasPersonalActivity] = useState<boolean>(false);
  const [socialProof, setSocialProof] = useState<{ id: string; text: string }[]>([]);
  const [activeFilter, setActiveFilter] = useState<'all' | 'personal' | 'announcements' | 'unread'>('all');

  // Fetch feed items from GET /api/feed
  const fetchFeed = async () => {
    if (!user?.email) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/feed?email=${encodeURIComponent(user.email)}`);
      const data = await res.json();
      if (res.ok && data.success && Array.isArray(data.feed)) {
        setFeedItems(data.feed);
        setUnreadCount(data.unreadCount || 0);
        setHasPersonalActivity(data.hasPersonalActivity || false);
        if (Array.isArray(data.socialProof)) {
          setSocialProof(data.socialProof);
        }
      } else {
        setFeedItems([]);
      }
    } catch (err) {
      console.error('Failed to load feed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, [user?.email]);

  // Mark all as read
  const handleMarkAllAsRead = async () => {
    if (!user?.email || unreadCount === 0 || isMarkingRead) return;
    setIsMarkingRead(true);
    try {
      const res = await fetch('/api/feed/read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, markAll: true }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setFeedItems((prev) => prev.map((item) => ({ ...item, isRead: true })));
        setUnreadCount(0);
        showToast('All updates marked as read', 'success');
      }
    } catch (err) {
      console.error('Error marking read:', err);
    } finally {
      setIsMarkingRead(false);
    }
  };

  // Mark single item as read
  const handleMarkItemAsRead = async (itemId: string) => {
    if (!user?.email) return;
    const target = feedItems.find((i) => i.id === itemId);
    if (!target || target.isRead) return;

    // Optimistic update
    setFeedItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, isRead: true } : item))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));

    try {
      await fetch('/api/feed/read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, itemId }),
      });
    } catch (err) {
      console.error('Error marking item read:', err);
    }
  };

  // Helper to format timestamps and group by relative date buckets
  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  const getRelativeDateGroup = (isoString: string): 'Today' | 'Yesterday' | 'This Week' | 'Earlier' => {
    try {
      const itemDate = new Date(isoString);
      const now = new Date();
      const diffMs = now.getTime() - itemDate.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffDays === 0 && itemDate.getDate() === now.getDate()) {
        return 'Today';
      }
      if (diffDays <= 1) {
        return 'Yesterday';
      }
      if (diffDays < 7) {
        return 'This Week';
      }
      return 'Earlier';
    } catch {
      return 'Earlier';
    }
  };

  // Filtered feed
  const filteredFeed = useMemo(() => {
    return feedItems.filter((item) => {
      if (activeFilter === 'personal') return item.feedType === 'personal';
      if (activeFilter === 'announcements') return item.feedType === 'announcement';
      if (activeFilter === 'unread') return !item.isRead;
      return true;
    });
  }, [feedItems, activeFilter]);

  // Group items by date bucket
  const groupedFeed = useMemo(() => {
    const groups: { [key: string]: UserFeedItem[] } = {
      Today: [],
      Yesterday: [],
      'This Week': [],
      Earlier: [],
    };

    filteredFeed.forEach((item) => {
      const groupKey = getRelativeDateGroup(item.timestamp);
      groups[groupKey].push(item);
    });

    return Object.entries(groups).filter(([_, items]) => items.length > 0);
  }, [filteredFeed]);

  // Render Status Dot / Color
  const renderStatusDot = (color: TimelineDotColor) => {
    switch (color) {
      case 'yellow':
        return (
          <span
            className="w-3.5 h-3.5 rounded-full bg-amber-400 border-2 border-slate-950 shadow-[0_0_10px_rgba(251,191,36,0.6)] shrink-0 animate-pulse"
            title="Pending / In Progress"
          />
        );
      case 'green':
        return (
          <span
            className="w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-slate-950 shadow-[0_0_10px_rgba(52,211,153,0.6)] shrink-0"
            title="Completed / Confirmed"
          />
        );
      case 'red':
        return (
          <span
            className="w-3.5 h-3.5 rounded-full bg-rose-500 border-2 border-slate-950 shadow-[0_0_10px_rgba(244,63,94,0.7)] shrink-0 animate-ping"
            title="Urgent / Action Required"
          />
        );
      case 'blue':
      default:
        return (
          <span
            className="w-3.5 h-3.5 rounded-full bg-sky-400 border-2 border-slate-950 shadow-[0_0_10px_rgba(56,189,248,0.6)] shrink-0"
            title="Informational / Announcement"
          />
        );
    }
  };

  // Render Icon according to iconType
  const renderItemIcon = (item: UserFeedItem) => {
    const iconType = item.iconType;
    let IconComponent = Info;
    let iconColorClass = 'text-sky-300 bg-sky-500/20 border-sky-400/30';

    if (item.dotColor === 'yellow') {
      iconColorClass = 'text-amber-300 bg-amber-500/20 border-amber-400/30';
    } else if (item.dotColor === 'green') {
      iconColorClass = 'text-emerald-300 bg-emerald-500/20 border-emerald-400/30';
    } else if (item.dotColor === 'red') {
      iconColorClass = 'text-rose-300 bg-rose-500/20 border-rose-400/30';
    }

    if (iconType === 'mail') IconComponent = Mail;
    else if (iconType === 'phone') IconComponent = Phone;
    else if (iconType === 'message') IconComponent = MessageCircle;
    else if (iconType === 'check') IconComponent = CheckCircle2;
    else if (iconType === 'plane') IconComponent = Plane;
    else if (iconType === 'alert') IconComponent = AlertCircle;

    return (
      <div
        className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 shadow-md ${iconColorClass}`}
      >
        <IconComponent className="w-4 h-4" />
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header & Action Controls */}
      <div className="glass-card rounded-3xl p-6 border border-white/10 shadow-2xl bg-gradient-to-r from-slate-950/95 via-slate-900/90 to-[#0a192f]/95 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-sky-500/20 text-sky-300 border border-sky-400/30">
            <Bell className="w-3.5 h-3.5" />
            <span>Real-time Journey Feed</span>
          </div>
          <h2 className="text-xl md:text-2xl font-serif-display font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>📋 Updates & Journey Activity</span>
            {unreadCount > 0 && (
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black">
                {unreadCount} Unread
              </span>
            )}
          </h2>
          <p className="text-xs text-sky-200/80 max-w-2xl leading-relaxed">
            Your centralized, chronological stream of personal quotation milestones, ticketing updates, and official consular visa alerts.
          </p>
        </div>

        {/* Action Buttons & Filter Pills */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={fetchFeed}
            disabled={isLoading}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-sky-200 hover:text-white border border-white/10 transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
            title="Refresh feed"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              disabled={isMarkingRead}
              className="px-3.5 py-2.5 rounded-xl bg-amber-400/20 hover:bg-amber-400 text-amber-300 hover:text-slate-950 border border-amber-400/40 transition-all flex items-center gap-1.5 text-xs font-bold cursor-pointer shadow-md"
            >
              <CheckCheck className="w-4 h-4" />
              <span>Mark all as read</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs & Color Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex items-center gap-1.5 overflow-x-auto hide-scrollbar">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeFilter === 'all'
                ? 'bg-sky-500 text-slate-950 font-black shadow-md'
                : 'bg-white/5 text-sky-200/80 hover:bg-white/10 hover:text-white'
            }`}
          >
            All Updates ({feedItems.length})
          </button>
          <button
            onClick={() => setActiveFilter('personal')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeFilter === 'personal'
                ? 'bg-sky-500 text-slate-950 font-black shadow-md'
                : 'bg-white/5 text-sky-200/80 hover:bg-white/10 hover:text-white'
            }`}
          >
            Personal Quotes
          </button>
          <button
            onClick={() => setActiveFilter('announcements')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeFilter === 'announcements'
                ? 'bg-sky-500 text-slate-950 font-black shadow-md'
                : 'bg-white/5 text-sky-200/80 hover:bg-white/10 hover:text-white'
            }`}
          >
            System & Visa Alerts
          </button>
          {unreadCount > 0 && (
            <button
              onClick={() => setActiveFilter('unread')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeFilter === 'unread'
                  ? 'bg-amber-400 text-slate-950 font-black shadow-md'
                  : 'bg-amber-400/10 text-amber-300 hover:bg-amber-400/20'
              }`}
            >
              Unread ({unreadCount})
            </button>
          )}
        </div>

        {/* Status Dot Legend */}
        <div className="flex items-center gap-3 text-[11px] text-slate-300 font-medium shrink-0">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
            <span>In Progress</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            <span>Confirmed</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
            <span>Urgent</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400"></span>
            <span>System Notice</span>
          </span>
        </div>
      </div>

      {/* FEED CONTENT */}
      {isLoading ? (
        <div className="py-16 text-center space-y-3">
          <div className="w-10 h-10 border-3 border-sky-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-sky-200/70 font-medium">Fetching real-time updates and quote statuses...</p>
        </div>
      ) : feedItems.length === 0 || (!hasPersonalActivity && activeFilter === 'personal') ? (
        /* RULE #4 & #6: Friendly Empty State */
        <div className="glass-card rounded-3xl p-8 md:p-12 text-center border border-white/15 bg-slate-900/90 shadow-2xl space-y-6 max-w-2xl mx-auto">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-sky-500/20 to-amber-400/20 border border-sky-400/40 flex items-center justify-center text-4xl mx-auto shadow-xl">
            🌍
          </div>

          <div className="space-y-2">
            <h3 className="text-xl md:text-2xl font-serif-display font-bold text-white">
              Your adventure hasn't started yet!
            </h3>
            <p className="text-xs md:text-sm text-sky-200/80 max-w-md mx-auto leading-relaxed">
              Browse our 15 handpicked Asian destinations and request a flight or visa quote to get your first update here.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            {onExploreDestinations && (
              <button
                onClick={onExploreDestinations}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-emerald-400 hover:from-amber-300 hover:to-emerald-300 text-slate-950 font-extrabold text-xs sm:text-sm transition-all shadow-xl active:scale-95 flex items-center gap-2 cursor-pointer"
              >
                <Compass className="w-4 h-4" />
                <span>Explore Destinations</span>
              </button>
            )}

            {onOpenFlightQuote && (
              <button
                onClick={onOpenFlightQuote}
                className="px-5 py-3 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs sm:text-sm transition-all shadow-lg active:scale-95 flex items-center gap-2 cursor-pointer"
              >
                <Plane className="w-4 h-4" />
                <span>Request Flight Quote</span>
              </button>
            )}

            {onOpenVisaQuote && (
              <button
                onClick={onOpenVisaQuote}
                className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs sm:text-sm transition-all border border-white/20 active:scale-95 flex items-center gap-2 cursor-pointer"
              >
                <Stamp className="w-4 h-4" />
                <span>Visa Assessment</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        /* RULE #3: Vertical Timeline Format grouped by date */
        <div className="space-y-8">
          {groupedFeed.map(([groupTitle, items]) => (
            <div key={groupTitle} className="space-y-3">
              {/* Date Header */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-extrabold uppercase tracking-wider text-amber-300/90 font-serif-display px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20">
                  {groupTitle}
                </span>
                <div className="flex-1 h-px bg-gradient-to-r from-amber-400/20 to-transparent"></div>
              </div>

              {/* Items in date group */}
              <div className="relative pl-6 sm:pl-8 space-y-3 before:absolute before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-sky-400/40 via-amber-400/30 before:to-transparent">
                {items.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleMarkItemAsRead(item.id)}
                    className={`relative rounded-2xl p-4 sm:p-5 border transition-all duration-200 cursor-pointer ${
                      !item.isRead
                        ? 'bg-slate-900/95 border-sky-400/40 shadow-lg ring-1 ring-sky-400/20'
                        : 'bg-slate-950/70 border-white/10 hover:border-white/20 opacity-90'
                    }`}
                  >
                    {/* Timeline Node Dot Positioned on the vertical line */}
                    <div className="absolute -left-6 sm:-left-8 top-5 -translate-x-1/2">
                      {renderStatusDot(item.dotColor)}
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      {/* Left: Icon & Content */}
                      <div className="flex items-start gap-3.5 flex-1">
                        {renderItemIcon(item)}

                        <div className="space-y-1.5 flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs sm:text-sm font-bold text-white tracking-tight">
                              {item.title}
                            </span>

                            {/* Unread Grey Dot indicator */}
                            {!item.isRead && (
                              <span
                                className="w-2 h-2 rounded-full bg-sky-400 ring-2 ring-sky-400/30"
                                title="Unread update"
                              />
                            )}

                            {/* Category Badge */}
                            {item.category && (
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-white/10 text-sky-200 border border-white/10">
                                {item.category}
                              </span>
                            )}

                            {/* Quote ID Badge */}
                            {item.quoteId && (
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                                {item.quoteId}
                              </span>
                            )}
                          </div>

                          <p className="text-xs text-sky-100/80 leading-relaxed font-normal">
                            {item.message}
                          </p>

                          {/* Secondary Meta Tags */}
                          {(item.agentName || item.quotedPrice || item.routeOrDestination) && (
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-1 text-[11px] text-slate-300">
                              {item.routeOrDestination && (
                                <span className="text-amber-200/90 font-medium">
                                  📍 {item.routeOrDestination}
                                </span>
                              )}
                              {item.agentName && (
                                <span>
                                  👨‍💼 Agent: <strong className="text-white">{item.agentName}</strong>
                                </span>
                              )}
                              {item.quotedPrice && (
                                <span className="text-emerald-300 font-bold">
                                  💵 {item.quotedPrice}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right: Timestamp & Action */}
                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
                        <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-500" />
                          <span>{formatTime(item.timestamp)}</span>
                        </span>

                        {item.quoteId && onViewQuoteDetail && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onViewQuoteDetail(item.quoteId!);
                            }}
                            className="px-3 py-1 rounded-xl bg-sky-500/20 hover:bg-sky-500 text-sky-300 hover:text-slate-950 font-bold text-[11px] transition-all flex items-center gap-1 cursor-pointer"
                          >
                            <span>View Quote</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* RULE #7: BONUS SOCIAL PROOF LITE (Anonymous, aggregated activity) */}
      {socialProof.length > 0 && (
        <div className="pt-6 border-t border-white/10">
          <div className="glass-card rounded-2xl p-4 sm:p-5 bg-gradient-to-r from-slate-950/80 via-slate-900/80 to-slate-950/80 border border-amber-400/20 shadow-lg">
            <div className="flex items-center gap-2 mb-2 text-xs font-bold text-amber-300 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Community Pulse • Anonymous Weekly Activity</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {socialProof.map((sp) => (
                <div
                  key={sp.id}
                  className="px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-sky-100/90 font-medium flex items-center gap-2"
                >
                  <span>{sp.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
