import React, { useState } from 'react';
import { QuoteRequest, QuoteStatus } from '../types';
import { getVisaFeeForDestination } from '../data/visaRequirementsData';

interface TrackQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
}

const STATUS_STEPS: { status: QuoteStatus; label: string; icon: string }[] = [
  { status: 'New', label: 'Quote Request Received', icon: 'mark_email_read' },
  { status: 'Reviewing', label: 'Reviewing Requirements', icon: 'search' },
  { status: 'Quotation Prepared', label: 'Quotation Prepared', icon: 'receipt_long' },
  { status: 'Sent', label: 'Offer Sent', icon: 'forward_to_inbox' },
  { status: 'Customer Confirmed', label: 'Customer Confirmed', icon: 'check_circle' },
  { status: 'Closed', label: 'Completed / Closed', icon: 'task_alt' },
];

export const TrackQuoteModal: React.FC<TrackQuoteModalProps> = ({
  isOpen,
  onClose,
  initialQuery = '',
}) => {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [isLoading, setIsLoading] = useState(false);
  const [quotes, setQuotes] = useState<QuoteRequest[] | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) {
      setErrorMessage('Please enter a Request ID or Email address.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    setQuotes(null);

    try {
      const response = await fetch(`/api/quotes/track?query=${encodeURIComponent(searchQuery.trim())}`);
      const data = await response.json();

      if (!response.ok || !data.quotes || data.quotes.length === 0) {
        throw new Error(data.error || 'No quotation request found with that ID or Email.');
      }

      setQuotes(data.quotes);
    } catch (err: any) {
      console.error('Track Quote error:', err);
      setErrorMessage(err.message || 'Failed to locate quotation request.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStepIndex = (status: QuoteStatus): number => {
    switch (status) {
      case 'New': return 0;
      case 'Reviewing': return 1;
      case 'Quotation Prepared': return 2;
      case 'Sent': return 3;
      case 'Customer Confirmed': return 4;
      case 'Closed': return 5;
      default: return 0;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-sky-400/30 rounded-3xl shadow-2xl overflow-hidden my-8 text-slate-100">
        
        {/* Header */}
        <div className="relative px-6 py-5 bg-gradient-to-r from-sky-950/90 via-slate-900 to-slate-900 border-b border-sky-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-xl shadow-inner">
              🔎
            </div>
            <div>
              <h2 className="text-xl font-serif-display font-bold text-white tracking-tight">
                Track Quotation Request
              </h2>
              <p className="text-xs text-sky-200/80">
                Check real-time processing status of your flight or visa quote
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-sky-400/80 text-lg">
                tag
              </span>
              <input
                type="text"
                placeholder="Enter Request ID (e.g. FLQ-849201 or VSQ-930214) or Email"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-800/90 border border-sky-300/30 text-white text-sm placeholder-slate-400 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400/30"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 rounded-2xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-sky-500/20 flex items-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <>
                  <span>Track Status</span>
                  <span className="material-symbols-outlined text-base">search</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Example Fillers */}
          {!quotes && (
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>Try example:</span>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('FLQ-849201');
                  setTimeout(() => {
                    fetch('/api/quotes/track?query=FLQ-849201')
                      .then((res) => res.json())
                      .then((d) => { if (d.quotes) setQuotes(d.quotes); });
                  }, 50);
                }}
                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-sky-300 border border-white/10 font-mono"
              >
                FLQ-849201
              </button>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('VSQ-930214');
                  setTimeout(() => {
                    fetch('/api/quotes/track?query=VSQ-930214')
                      .then((res) => res.json())
                      .then((d) => { if (d.quotes) setQuotes(d.quotes); });
                  }, 50);
                }}
                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-teal-300 border border-white/10 font-mono"
              >
                VSQ-930214
              </button>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
              <span className="material-symbols-outlined text-lg text-red-400">error</span>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Quote Details Cards */}
          {quotes && quotes.length > 0 && (
            <div className="space-y-6">
              {quotes.map((q) => {
                const isFlight = q.type === 'flight';
                const currentIdx = getStepIndex(q.status);

                return (
                  <div
                    key={q.id}
                    className="p-5 bg-slate-800/80 rounded-2xl border border-sky-400/20 shadow-xl space-y-5"
                  >
                    {/* Header Info */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{isFlight ? '✈️' : '🛂'}</span>
                          <span className="font-mono font-bold text-sky-400 text-lg">{q.id}</span>
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            q.status === 'New' ? 'bg-amber-500/20 text-amber-300 border border-amber-400/30' :
                            q.status === 'Reviewing' ? 'bg-sky-500/20 text-sky-300 border border-sky-400/30' :
                            q.status === 'Quotation Prepared' || q.status === 'Sent' ? 'bg-teal-500/20 text-teal-300 border border-teal-400/30' :
                            'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                          }`}>
                            {q.status === 'New' ? 'Quote Request Received' : q.status}
                          </span>
                        </div>
                        <div className="text-xs text-slate-300 mt-1">
                          Submitted on {new Date(q.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                        </div>
                      </div>

                      {q.quotedPrice && (
                        <div className="sm:text-right p-2.5 bg-teal-500/10 border border-teal-400/30 rounded-xl">
                          <div className="text-[10px] uppercase font-medium text-teal-300">Official Quoted Price</div>
                          <div className="text-lg font-bold text-white">{q.quotedPrice}</div>
                        </div>
                      )}
                    </div>

                    {/* Visual Status Timeline Progress Bar */}
                    <div className="space-y-2">
                      <div className="text-xs font-semibold text-sky-200 uppercase tracking-wider">
                        Request Status Timeline
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
                        {STATUS_STEPS.map((step, idx) => {
                          const isDone = idx <= currentIdx;
                          const isCurrent = idx === currentIdx;

                          return (
                            <div
                              key={step.status}
                              className={`p-2 rounded-xl text-center border transition-all ${
                                isCurrent
                                  ? 'bg-sky-500/20 border-sky-400 text-sky-300 font-bold shadow-md'
                                  : isDone
                                  ? 'bg-slate-700/60 border-teal-500/40 text-teal-300'
                                  : 'bg-slate-900/40 border-white/5 text-slate-500'
                              }`}
                            >
                              <span className="material-symbols-outlined text-sm block mb-1">
                                {step.icon}
                              </span>
                              <div className="text-[10px] leading-tight">{step.label}</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Details Summary */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-slate-900/60 rounded-xl border border-white/5 text-xs">
                      {isFlight ? (
                        <>
                          <div><span className="text-slate-400">Route:</span> <strong className="text-white">{(q as any).from} ✈️ {(q as any).to}</strong></div>
                          <div><span className="text-slate-400">Trip Type:</span> <strong className="text-white">{(q as any).tripType}</strong></div>
                          <div><span className="text-slate-400">Departure:</span> <strong className="text-white">{(q as any).departureDate}</strong></div>
                          <div><span className="text-slate-400">Return:</span> <strong className="text-white">{(q as any).returnDate || 'N/A'}</strong></div>
                          <div><span className="text-slate-400">Passengers:</span> <strong className="text-white">{(q as any).adults} Adult(s), {(q as any).cabinClass}</strong></div>
                          <div><span className="text-slate-400">Airline:</span> <strong className="text-white">{(q as any).preferredAirline || 'Any suitable'}</strong></div>
                        </>
                      ) : (
                        <>
                          <div><span className="text-slate-400">Destination Country:</span> <strong className="text-white">{(q as any).destinationCountry}</strong></div>
                          <div><span className="text-slate-400">Visa Type:</span> <strong className="text-white">{(q as any).visaType}</strong></div>
                          <div><span className="text-slate-400">Destination Visa Fee:</span> <strong className="text-teal-300">{(q as any).visaFee || getVisaFeeForDestination((q as any).destinationCountry)}</strong></div>
                          <div><span className="text-slate-400">Travel Date:</span> <strong className="text-white">{(q as any).intendedTravelDate}</strong></div>
                          <div><span className="text-slate-400">Applicants:</span> <strong className="text-white">{(q as any).applicantsCount} person(s)</strong></div>
                          <div><span className="text-slate-400">Nationality:</span> <strong className="text-white">{(q as any).applicantNationality}</strong></div>
                          <div><span className="text-slate-400">Service:</span> <strong className="text-white">{(q as any).requiredService}</strong></div>
                        </>
                      )}
                    </div>

                    {/* Staff Response / Flight Options if available */}
                    {q.staffNote && (
                      <div className="p-3.5 bg-sky-950/60 border border-sky-400/30 rounded-xl text-xs space-y-1">
                        <div className="font-semibold text-sky-300 flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">support_agent</span>
                          <span>Message from Travel Expert:</span>
                        </div>
                        <p className="text-slate-200 leading-relaxed">{q.staffNote}</p>
                        {q.flightOptions && (
                          <div className="mt-2 pt-2 border-t border-sky-400/20 text-slate-300 font-mono text-[11px]">
                            {q.flightOptions}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
