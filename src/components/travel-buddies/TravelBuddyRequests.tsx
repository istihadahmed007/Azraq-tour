import React, { useState } from 'react';
import {
  Inbox,
  Send,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  Calendar,
  ShieldCheck,
  MessageSquare,
  AlertCircle,
  UserCheck,
} from 'lucide-react';
import { TravelBuddyRequest } from '../../types';

interface TravelBuddyRequestsProps {
  requests: TravelBuddyRequest[];
  currentUserId: string;
  onAccept: (requestId: string) => Promise<void>;
  onDecline: (requestId: string) => Promise<void>;
  onCancel: (requestId: string) => Promise<void>;
  onNavigateToFindBuddies: () => void;
}

export const TravelBuddyRequests: React.FC<TravelBuddyRequestsProps> = ({
  requests,
  currentUserId,
  onAccept,
  onDecline,
  onCancel,
  onNavigateToFindBuddies,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'incoming' | 'sent'>('incoming');
  const [actionInProgressId, setActionInProgressId] = useState<string | null>(null);

  const incomingRequests = requests.filter(
    (r) => r.receiverId === currentUserId && r.status !== 'cancelled'
  );
  const sentRequests = requests.filter(
    (r) => r.senderId === currentUserId
  );

  const handleAction = async (
    requestId: string,
    action: () => Promise<void>
  ) => {
    setActionInProgressId(requestId);
    try {
      await action();
    } finally {
      setActionInProgressId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'accepted':
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 className="h-3 w-3" /> Connected
          </span>
        );
      case 'declined':
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-rose-50 px-2 py-0.5 text-xs font-semibold text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
            <XCircle className="h-3 w-3" /> Declined
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400">
            Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
            <Clock className="h-3 w-3" /> Pending Review
          </span>
        );
    }
  };

  return (
    <div id="travel-buddy-requests-panel" className="max-w-4xl mx-auto space-y-6">
      {/* Sub Tab Navigation */}
      <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800">
        <button
          id="btn-subtab-incoming"
          type="button"
          onClick={() => setActiveSubTab('incoming')}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-bold transition-colors min-h-[44px] ${
            activeSubTab === 'incoming'
              ? 'border-sky-600 text-sky-600 dark:border-sky-400 dark:text-sky-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          <Inbox className="h-4 w-4" />
          <span>Incoming Connections</span>
          {incomingRequests.filter((r) => r.status === 'pending').length > 0 && (
            <span className="rounded-full bg-sky-600 px-2 py-0.5 text-[10px] font-bold text-white">
              {incomingRequests.filter((r) => r.status === 'pending').length}
            </span>
          )}
        </button>

        <button
          id="btn-subtab-sent"
          type="button"
          onClick={() => setActiveSubTab('sent')}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-bold transition-colors min-h-[44px] ${
            activeSubTab === 'sent'
              ? 'border-sky-600 text-sky-600 dark:border-sky-400 dark:text-sky-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          <Send className="h-4 w-4" />
          <span>Sent Requests</span>
          <span className="text-slate-400 font-normal">
            ({sentRequests.length})
          </span>
        </button>
      </div>

      {/* Incoming Requests Tab */}
      {activeSubTab === 'incoming' && (
        <div className="space-y-4">
          {incomingRequests.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400 mb-3">
                <Inbox className="h-7 w-7" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                No Incoming Connection Requests
              </h3>
              <p className="mt-1 max-w-sm text-xs text-slate-500 dark:text-slate-400">
                When other travelers discover your travel plans and request to connect, they'll show up here.
              </p>
              <button
                id="btn-empty-find-buddies"
                type="button"
                onClick={onNavigateToFindBuddies}
                className="mt-5 rounded-xl bg-sky-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-sky-500 min-h-[44px]"
              >
                Browse Fellow Travelers
              </button>
            </div>
          ) : (
            incomingRequests.map((req) => {
              const isPending = req.status === 'pending';
              const isAccepted = req.status === 'accepted';
              const isLoadingThis = actionInProgressId === req.id;

              return (
                <div
                  key={req.id}
                  id={`request-incoming-${req.id}`}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      <img
                        src={
                          req.senderProfile?.avatarUrl ||
                          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
                        }
                        alt={req.senderProfile?.displayName || 'Traveler'}
                        className="h-12 w-12 shrink-0 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                            {req.senderProfile?.displayName || 'Fellow Explorer'}
                          </h4>
                          {getStatusBadge(req.status)}
                        </div>
                        <p className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          <MapPin className="h-3 w-3 shrink-0" />
                          {req.senderProfile?.homeLocation || 'Bangladesh'}
                        </p>

                        {req.senderProfile?.destinations &&
                          req.senderProfile.destinations.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {req.senderProfile.destinations.map((d, idx) => (
                                <span
                                  key={idx}
                                  className="rounded-md bg-sky-50 px-2 py-0.5 text-[11px] font-medium text-sky-700 dark:bg-sky-950/40 dark:text-sky-300"
                                >
                                  {d}
                                </span>
                              ))}
                            </div>
                          )}
                      </div>
                    </div>

                    {/* Actions */}
                    {isPending && (
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          id={`btn-accept-${req.id}`}
                          type="button"
                          disabled={isLoadingThis}
                          onClick={() =>
                            handleAction(req.id, () => onAccept(req.id))
                          }
                          className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-emerald-500 disabled:opacity-50 min-h-[44px]"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          <span>Accept</span>
                        </button>
                        <button
                          id={`btn-decline-${req.id}`}
                          type="button"
                          disabled={isLoadingThis}
                          onClick={() =>
                            handleAction(req.id, () => onDecline(req.id))
                          }
                          className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 disabled:opacity-50 min-h-[44px]"
                        >
                          Decline
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Message Bubble */}
                  {req.message && (
                    <div className="mt-3.5 rounded-xl bg-slate-50 p-3 text-xs text-slate-700 dark:bg-slate-800/60 dark:text-slate-300">
                      <p className="font-semibold text-slate-900 dark:text-white mb-0.5">
                        Message:
                      </p>
                      <p className="leading-relaxed italic">"{req.message}"</p>
                    </div>
                  )}

                  {/* Connected Advice Banner */}
                  {isAccepted && (
                    <div className="mt-3 flex items-center gap-2 rounded-xl bg-emerald-50/80 p-3 text-xs text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/40">
                      <UserCheck className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                      <span>
                        You are connected! Exchange travel tips safely and always meet in well-lit public spots.
                      </span>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Sent Requests Tab */}
      {activeSubTab === 'sent' && (
        <div className="space-y-4">
          {sentRequests.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400 mb-3">
                <Send className="h-7 w-7" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                No Outgoing Requests Sent
              </h3>
              <p className="mt-1 max-w-sm text-xs text-slate-500 dark:text-slate-400">
                You haven't sent any connection requests yet. Find a traveler heading your way and say hello!
              </p>
              <button
                id="btn-sent-empty-find-buddies"
                type="button"
                onClick={onNavigateToFindBuddies}
                className="mt-5 rounded-xl bg-sky-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-sky-500 min-h-[44px]"
              >
                Find Travel Buddies
              </button>
            </div>
          ) : (
            sentRequests.map((req) => {
              const isPending = req.status === 'pending';
              const isLoadingThis = actionInProgressId === req.id;

              return (
                <div
                  key={req.id}
                  id={`request-sent-${req.id}`}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      <img
                        src={
                          req.receiverProfile?.avatarUrl ||
                          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
                        }
                        alt={req.receiverProfile?.displayName || 'Traveler'}
                        className="h-12 w-12 shrink-0 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                            {req.receiverProfile?.displayName || 'Travel Buddy'}
                          </h4>
                          {getStatusBadge(req.status)}
                        </div>
                        <p className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          <MapPin className="h-3 w-3 shrink-0" />
                          {req.receiverProfile?.homeLocation || 'Bangladesh'}
                        </p>
                        {req.receiverProfile?.destinations &&
                          req.receiverProfile.destinations.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {req.receiverProfile.destinations.map((d, idx) => (
                                <span
                                  key={idx}
                                  className="rounded-md bg-sky-50 px-2 py-0.5 text-[11px] font-medium text-sky-700 dark:bg-sky-950/40 dark:text-sky-300"
                                >
                                  {d}
                                </span>
                              ))}
                            </div>
                          )}
                      </div>
                    </div>

                    {/* Cancel action while pending */}
                    {isPending && (
                      <button
                        id={`btn-cancel-${req.id}`}
                        type="button"
                        disabled={isLoadingThis}
                        onClick={() =>
                          handleAction(req.id, () => onCancel(req.id))
                        }
                        className="self-start rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-rose-600 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 disabled:opacity-50 min-h-[44px]"
                      >
                        Cancel Request
                      </button>
                    )}
                  </div>

                  {req.message && (
                    <div className="mt-3.5 rounded-xl bg-slate-50 p-3 text-xs text-slate-700 dark:bg-slate-800/60 dark:text-slate-300">
                      <p className="font-semibold text-slate-900 dark:text-white mb-0.5">
                        Your Message:
                      </p>
                      <p className="leading-relaxed italic">"{req.message}"</p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};
