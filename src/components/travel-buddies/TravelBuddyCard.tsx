import React from 'react';
import {
  MapPin,
  Calendar,
  Sparkles,
  Users,
  MessageSquare,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Send,
  Languages,
} from 'lucide-react';
import { MatchedTravelBuddy } from '../../types';

interface TravelBuddyCardProps {
  buddy: MatchedTravelBuddy;
  isCurrentUser: boolean;
  onConnectClick: (buddy: MatchedTravelBuddy) => void;
  onEditProfileClick?: () => void;
}

export const TravelBuddyCard: React.FC<TravelBuddyCardProps> = ({
  buddy,
  isCurrentUser,
  onConnectClick,
  onEditProfileClick,
}) => {
  const getMatchScoreBadge = (score: number) => {
    if (score >= 85) {
      return {
        bg: 'bg-emerald-500/10 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-700/50',
        label: `${score}% Match`,
      };
    }
    if (score >= 70) {
      return {
        bg: 'bg-teal-500/10 text-teal-700 border-teal-300 dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-700/50',
        label: `${score}% Match`,
      };
    }
    return {
      bg: 'bg-blue-500/10 text-blue-700 border-blue-300 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-700/50',
      label: `${score}% Compatible`,
    };
  };

  const badgeStyle = getMatchScoreBadge(buddy.matchScore);

  const formatDates = () => {
    if (buddy.travelStart && buddy.travelEnd) {
      const start = new Date(buddy.travelStart).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
      const end = new Date(buddy.travelEnd).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
      return `${start} – ${end}`;
    }
    if (buddy.travelStart) {
      return `From ${new Date(buddy.travelStart).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })}`;
    }
    return 'Flexible travel dates';
  };

  return (
    <div
      id={`buddy-card-${buddy.id}`}
      className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
    >
      <div>
        {/* Header: Avatar, Name, Home City, and Match Score */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border-2 border-white shadow-sm ring-2 ring-slate-100 dark:border-slate-800 dark:ring-slate-800">
              <img
                src={buddy.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                alt={buddy.displayName}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="font-semibold text-slate-900 dark:text-white text-base">
                  {buddy.displayName}
                </h3>
                {buddy.isDemo ? (
                  <span className="inline-flex items-center rounded-md bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-medium text-amber-700 dark:text-amber-400 border border-amber-300/60 dark:border-amber-700/50">
                    Sample Profile
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-md bg-sky-500/10 px-1.5 py-0.5 text-[10px] font-medium text-sky-700 dark:text-sky-400 border border-sky-300/60 dark:border-sky-700/50">
                    <ShieldCheck className="mr-0.5 h-2.5 w-2.5" /> Verified
                  </span>
                )}
              </div>
              <p className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                <MapPin className="h-3 w-3 shrink-0 text-slate-400" />
                {buddy.homeLocation || 'Bangladesh'}
              </p>
            </div>
          </div>

          {/* Match Score Badge */}
          <div
            className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold shadow-xs ${badgeStyle.bg}`}
          >
            <Sparkles className="h-3 w-3" />
            {badgeStyle.label}
          </div>
        </div>

        {/* Match Reasons Tags */}
        {buddy.matchedOn && buddy.matchedOn.length > 0 && (
          <div className="mt-3.5 flex flex-wrap gap-1.5">
            {buddy.matchedOn.map((reason, idx) => (
              <span
                key={idx}
                className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300"
              >
                ✓ {reason}
              </span>
            ))}
          </div>
        )}

        {/* Travel Dates & Logistics Bar */}
        <div className="mt-3 flex flex-wrap items-center gap-y-1 gap-x-3 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600 dark:bg-slate-800/60 dark:text-slate-300">
          <div className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-200">
            <Calendar className="h-3.5 w-3.5 text-sky-500" />
            <span>{formatDates()}</span>
          </div>
          {buddy.groupSize > 1 && (
            <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
              <Users className="h-3.5 w-3.5" />
              <span>Party of {buddy.groupSize}</span>
            </div>
          )}
          {buddy.languages && buddy.languages.length > 0 && (
            <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
              <Languages className="h-3.5 w-3.5 text-slate-400" />
              <span>{buddy.languages.slice(0, 2).join(', ')}</span>
            </div>
          )}
        </div>

        {/* Bio */}
        {buddy.bio && (
          <p className="mt-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300 line-clamp-2">
            "{buddy.bio}"
          </p>
        )}

        {/* Planned Destinations Badges */}
        <div className="mt-3.5">
          <p className="text-[11px] font-medium uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
            Planned Destinations
          </p>
          <div className="flex flex-wrap gap-1.5">
            {buddy.destinations.map((dest, idx) => (
              <span
                key={idx}
                className="inline-flex items-center rounded-md bg-sky-50 px-2 py-0.5 text-xs font-medium text-sky-700 dark:bg-sky-950/50 dark:text-sky-300 border border-sky-200/60 dark:border-sky-800/40"
              >
                {dest}
              </span>
            ))}
          </div>
        </div>

        {/* Travel Styles Chips */}
        {buddy.travelStyles && buddy.travelStyles.length > 0 && (
          <div className="mt-2.5">
            <div className="flex flex-wrap gap-1.5">
              {buddy.travelStyles.map((style, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                >
                  {style}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Card Action Button */}
      <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800">
        {isCurrentUser ? (
          <button
            id={`btn-edit-self-${buddy.id}`}
            type="button"
            onClick={onEditProfileClick}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-100 px-4 py-2.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 min-h-[44px]"
          >
            Edit Your Travel Buddy Profile
          </button>
        ) : buddy.requestStatus === 'connected' ? (
          <div className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500/10 px-4 py-2.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 min-h-[44px]">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span>Connected Travel Buddy</span>
          </div>
        ) : buddy.requestStatus === 'pending' && buddy.requestDirection === 'outgoing' ? (
          <div className="flex items-center justify-center gap-2 rounded-xl bg-amber-500/10 px-4 py-2.5 text-xs font-semibold text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-300 dark:border-amber-800 min-h-[44px]">
            <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <span>Connection Request Pending</span>
          </div>
        ) : buddy.requestStatus === 'pending' && buddy.requestDirection === 'incoming' ? (
          <button
            id={`btn-respond-${buddy.id}`}
            type="button"
            onClick={() => onConnectClick(buddy)}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition-all hover:from-sky-500 hover:to-blue-500 active:scale-[0.99] min-h-[44px]"
          >
            <MessageSquare className="h-4 w-4" />
            <span>Respond to Connection Request</span>
          </button>
        ) : (
          <button
            id={`btn-connect-${buddy.id}`}
            type="button"
            onClick={() => onConnectClick(buddy)}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-sky-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-sky-500 active:scale-[0.99] dark:bg-sky-500 dark:hover:bg-sky-400 min-h-[44px]"
          >
            <Send className="h-3.5 w-3.5" />
            <span>View Profile & Connect</span>
          </button>
        )}
      </div>
    </div>
  );
};
