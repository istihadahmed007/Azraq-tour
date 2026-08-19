import React, { useState, useEffect } from 'react';
import { SocialProofActivity } from '../types';
import { INITIAL_SOCIAL_PROOF_ACTIVITIES } from '../data/socialProofData';
import { Plane, CheckCircle2, Building2, Stamp, Sparkles, Activity, X } from 'lucide-react';

interface SocialProofTickerProps {
  variant?: 'ticker' | 'toast' | 'embedded';
  className?: string;
  onSelectActivity?: (activity: SocialProofActivity) => void;
}

export const SocialProofTicker: React.FC<SocialProofTickerProps> = ({
  variant = 'ticker',
  className = '',
  onSelectActivity,
}) => {
  const [activities, setActivities] = useState<SocialProofActivity[]>([]);
  const [currentToastIndex, setCurrentToastIndex] = useState(0);
  const [isToastDismissed, setIsToastDismissed] = useState(false);

  useEffect(() => {
    const fetchLiveSocialProof = async () => {
      try {
        const res = await fetch('/api/social-proof/live');
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.activities)) {
            setActivities(data.activities);
          }
        }
      } catch (e) {
        // empty or authentic fallback
      }
    };

    fetchLiveSocialProof();
    const interval = setInterval(fetchLiveSocialProof, 60000);
    return () => clearInterval(interval);
  }, []);

  // Cycle floating toast every 8 seconds if real activities exist
  useEffect(() => {
    if (variant !== 'toast' || activities.length === 0) return;

    const timer = setInterval(() => {
      setCurrentToastIndex((prev) => (prev + 1) % activities.length);
    }, 8000);

    return () => clearInterval(timer);
  }, [variant, activities.length]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'plane':
      case 'flight_quote':
        return <Plane className="w-3.5 h-3.5 text-sky-400" />;
      case 'visa':
      case 'visa_quote':
        return <Stamp className="w-3.5 h-3.5 text-amber-400" />;
      case 'hotel':
      case 'package_booking':
        return <Building2 className="w-3.5 h-3.5 text-emerald-400" />;
      case 'check':
      case 'visa_approval':
        return <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-primary" />;
    }
  };

  // --- Variant 1: Continuous Horizontal Ticker ---
  if (variant === 'ticker') {
    return (
      <div
        className={`w-full overflow-hidden bg-slate-950/70 border-y border-white/10 backdrop-blur-md py-2.5 px-4 flex items-center gap-4 select-none ${className}`}
      >
        {/* Live Indicator Pill */}
        <div className="shrink-0 flex items-center gap-2 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-1 rounded-full text-[11px] font-semibold text-emerald-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>AZRAQ VERIFIED</span>
          <span className="text-white/40">•</span>
          <span className="text-white/80 font-normal">Direct Booking & Visa Desk</span>
        </div>

        {/* Scrolling Items */}
        <div className="flex-1 overflow-hidden relative">
          <div className="flex items-center gap-6 whitespace-nowrap animate-marquee">
            {activities.concat(activities).map((act, idx) => (
              <div
                key={`${act.id}-${idx}`}
                onClick={() => onSelectActivity && onSelectActivity(act)}
                className="inline-flex items-center gap-2 text-xs text-white/90 bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1 rounded-full transition-all cursor-pointer"
              >
                <span className="p-1 rounded-full bg-white/10">{getIcon(act.iconType || act.type)}</span>
                <span className="font-semibold text-sky-200">{act.actorAnonymized}</span>
                <span className="text-slate-300">{act.actionText}</span>
                <span className="text-[10px] text-white/40 font-mono ml-1">({act.timeAgo})</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // --- Variant 2: Embedded Modal / Form Social Proof Card ---
  if (variant === 'embedded') {
    return (
      <div className={`p-3.5 rounded-2xl bg-sky-950/40 border border-sky-400/20 backdrop-blur-md ${className}`}>
        <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-semibold text-white">Live Requests in Queue</span>
          </div>
          <span className="text-[10px] text-sky-200/70 font-mono">Real-Time Azraq GDS</span>
        </div>

        <div className="flex flex-col gap-2">
          {activities.slice(0, 3).map((act) => (
            <div
              key={act.id}
              className="flex items-center justify-between text-xs py-1 px-2 rounded-lg bg-white/5 border border-white/5"
            >
              <div className="flex items-center gap-2 truncate">
                {getIcon(act.iconType || act.type)}
                <span className="font-medium text-sky-200">{act.actorAnonymized}</span>
                <span className="text-slate-300 truncate">{act.destination || act.actionText}</span>
              </div>
              <span className="text-[10px] text-white/50 shrink-0 ml-2 font-mono">{act.timeAgo}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // --- Variant 3: Floating Bottom-Right Toast ---
  if (variant === 'toast') {
    if (isToastDismissed || activities.length === 0) return null;
    const current = activities[currentToastIndex] || activities[0];

    return (
      <aside
        aria-label="Recent client activity notice"
        className={`fixed bottom-6 right-6 z-40 max-w-sm w-full transition-all duration-500 ease-out transform translate-y-0 opacity-100 ${className}`}
      >
        <div className="glass-card p-3.5 rounded-2xl border border-sky-400/30 shadow-2xl backdrop-blur-xl bg-slate-900/90 flex items-start gap-3 relative group">
          <button
            onClick={() => setIsToastDismissed(true)}
            className="absolute top-2 right-2 text-white/40 hover:text-white p-1 rounded-full transition-colors"
            title="Dismiss"
          >
            <X className="w-3.5 h-3.5" />
          </button>

          <div className="p-2.5 rounded-xl bg-sky-500/20 border border-sky-400/30 shrink-0 mt-0.5">
            {getIcon(current.iconType || current.type)}
          </div>

          <div className="flex-1 pr-4">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="font-bold text-xs text-white">{current.actorAnonymized}</span>
              <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                Verified Request
              </span>
            </div>
            <p className="text-xs text-slate-200 leading-snug">{current.actionText}</p>
            <div className="flex items-center gap-2 mt-1.5 text-[10px] text-sky-300/70 font-mono">
              <span>{current.timeAgo}</span>
              <span>•</span>
              <span>Azraq 24/7 Desk</span>
            </div>
          </div>
        </div>
      </aside>
    );
  }

  return null;
};
