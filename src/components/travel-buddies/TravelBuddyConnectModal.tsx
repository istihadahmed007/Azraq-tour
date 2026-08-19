import React, { useState } from 'react';
import {
  X,
  Send,
  ShieldCheck,
  Sparkles,
  MapPin,
  Calendar,
  Lock,
  CheckCircle2,
  AlertCircle,
  MessageCircle,
} from 'lucide-react';
import { MatchedTravelBuddy } from '../../types';

interface TravelBuddyConnectModalProps {
  isOpen: boolean;
  buddy: MatchedTravelBuddy | null;
  onClose: () => void;
  onSendRequest: (receiverId: string, message: string) => Promise<{ success: boolean; error?: string }>;
  onAcceptIncoming?: (requestId: string) => Promise<void>;
  onDeclineIncoming?: (requestId: string) => Promise<void>;
}

export const TravelBuddyConnectModal: React.FC<TravelBuddyConnectModalProps> = ({
  isOpen,
  buddy,
  onClose,
  onSendRequest,
  onAcceptIncoming,
  onDeclineIncoming,
}) => {
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen || !buddy) return null;

  const isIncomingPending =
    buddy.requestStatus === 'pending' && buddy.requestDirection === 'incoming';
  const isOutgoingPending =
    buddy.requestStatus === 'pending' && buddy.requestDirection === 'outgoing';
  const isConnected = buddy.requestStatus === 'connected';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await onSendRequest(buddy.id, message);
      if (res.success) {
        onClose();
      } else {
        setErrorMessage(res.error || 'Unable to send request. Please try again.');
      }
    } catch {
      setErrorMessage('A network error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      id="modal-travel-buddy-connect"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-200 animate-in fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl transition-all dark:bg-slate-900 dark:border dark:border-slate-800">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-sky-600 dark:text-sky-400" />
            <h2 className="font-bold text-slate-900 dark:text-white text-lg">
              {isConnected
                ? 'Travel Buddy Details'
                : isIncomingPending
                ? 'Connection Request'
                : `Connect with ${buddy.displayName}`}
            </h2>
          </div>
          <button
            id="btn-close-connect-modal"
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300 min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[75vh] overflow-y-auto p-6 space-y-5">
          {/* Candidate Profile Summary Card */}
          <div className="flex items-start gap-4 rounded-xl bg-slate-50 p-4 dark:bg-slate-800/60">
            <img
              src={
                buddy.avatarUrl ||
                'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
              }
              alt={buddy.displayName}
              className="h-16 w-16 shrink-0 rounded-full object-cover border-2 border-white shadow-sm dark:border-slate-700"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-bold text-slate-900 dark:text-white truncate">
                  {buddy.displayName}
                </h3>
                <span className="shrink-0 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                  {buddy.matchScore}% Match
                </span>
              </div>
              <p className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 mt-1">
                <MapPin className="h-3 w-3 shrink-0 text-slate-400" />
                {buddy.homeLocation || 'Bangladesh'}
              </p>

              {buddy.destinations && buddy.destinations.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {buddy.destinations.map((d, i) => (
                    <span
                      key={i}
                      className="rounded-md bg-white px-1.5 py-0.5 text-[11px] font-medium text-slate-700 shadow-xs dark:bg-slate-900 dark:text-slate-300"
                    >
                      {d}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Compatibility Breakdown */}
          {buddy.matchedOn && buddy.matchedOn.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">
                Why You're a Great Match
              </p>
              <div className="flex flex-wrap gap-2">
                {buddy.matchedOn.map((reason, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center rounded-lg bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700 dark:bg-sky-950/50 dark:text-sky-300 border border-sky-200/60 dark:border-sky-800/40"
                  >
                    ✓ {reason}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Bio if available */}
          {buddy.bio && (
            <div className="rounded-xl border border-slate-100 bg-white p-3 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
              <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">About {buddy.displayName}:</p>
              <p className="leading-relaxed">"{buddy.bio}"</p>
            </div>
          )}

          {/* Status Specific Content */}
          {isConnected ? (
            <div className="rounded-xl bg-emerald-50 p-4 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800">
              <div className="flex items-center gap-2 font-semibold">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                <span>You are connected!</span>
              </div>
              <p className="mt-1 text-xs text-emerald-800 dark:text-emerald-300">
                Preferred contact channel: <strong>{buddy.contactPreference || 'WhatsApp'}</strong>. Remember to meet in safe, public places and double-check shared travel arrangements.
              </p>
            </div>
          ) : isOutgoingPending ? (
            <div className="rounded-xl bg-amber-50 p-4 text-amber-900 dark:bg-amber-950/40 dark:text-amber-200 border border-amber-200 dark:border-amber-800">
              <p className="font-semibold text-xs">Request Already Sent</p>
              <p className="mt-1 text-xs text-amber-800 dark:text-amber-300">
                Your connection request is pending {buddy.displayName}’s review. You will be notified once accepted.
              </p>
            </div>
          ) : isIncomingPending ? (
            <div className="space-y-4">
              <div className="rounded-xl bg-sky-50 p-4 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800">
                <p className="font-semibold text-xs text-sky-900 dark:text-sky-200">
                  {buddy.displayName} wants to connect with you!
                </p>
                {buddy.existingRequest?.message && (
                  <p className="mt-2 text-xs italic text-slate-700 dark:text-slate-300 bg-white/70 dark:bg-slate-900/60 p-2.5 rounded-lg">
                    "{buddy.existingRequest.message}"
                  </p>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  id="btn-modal-accept-request"
                  type="button"
                  onClick={async () => {
                    if (onAcceptIncoming && buddy.activeRequestId) {
                      await onAcceptIncoming(buddy.activeRequestId);
                      onClose();
                    }
                  }}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-xs font-semibold text-white shadow-sm hover:bg-emerald-500 min-h-[44px]"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Accept Connection</span>
                </button>
                <button
                  id="btn-modal-decline-request"
                  type="button"
                  onClick={async () => {
                    if (onDeclineIncoming && buddy.activeRequestId) {
                      await onDeclineIncoming(buddy.activeRequestId);
                      onClose();
                    }
                  }}
                  className="rounded-xl border border-slate-300 px-4 py-3 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 min-h-[44px]"
                >
                  Decline
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Personal Intro Message (Optional)
                </label>
                <textarea
                  id="input-connect-message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  maxLength={300}
                  rows={3}
                  placeholder={`Hi ${buddy.displayName}, I noticed you're heading to ${
                    buddy.destinations[0] || 'Bangkok'
                  }. Let's travel together or share tips!`}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
                <div className="mt-1 flex justify-end">
                  <span className="text-[11px] text-slate-600 dark:text-slate-300">
                    {message.length} / 300 characters
                  </span>
                </div>
              </div>

              {errorMessage && (
                <div className="flex items-center gap-2 rounded-lg bg-rose-50 p-2.5 text-xs text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Privacy Notice Guarantee */}
              <div className="flex items-start gap-2.5 rounded-xl bg-slate-100 p-3.5 text-xs text-slate-600 dark:bg-slate-800/80 dark:text-slate-300">
                <Lock className="h-4 w-4 shrink-0 text-slate-500 mt-0.5" />
                <p className="leading-normal">
                  <strong>Privacy Guard:</strong> Your phone number, email, and travel vouchers remain private until you both approve this connection.
                </p>
              </div>

              {/* Submit CTA */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  id="btn-submit-connect-request"
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-sky-600 px-5 py-3 text-xs font-semibold text-white shadow-sm transition-all hover:bg-sky-500 active:scale-[0.99] disabled:opacity-50 min-h-[44px]"
                >
                  {isSubmitting ? (
                    <span>Sending Request...</span>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>Send Connection Request</span>
                    </>
                  )}
                </button>
                <button
                  id="btn-cancel-connect-modal"
                  type="button"
                  onClick={onClose}
                  className="rounded-xl border border-slate-200 px-4 py-3 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 min-h-[44px]"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
