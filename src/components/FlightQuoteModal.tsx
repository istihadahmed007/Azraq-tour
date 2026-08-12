import React, { useState, useEffect } from 'react';
import { FlightQuoteRequest } from '../types';
import { useAuth } from '../context/AuthContext';

interface FlightQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessSubmitted?: (quote: FlightQuoteRequest) => void;
  initialDestination?: string;
}

export const FlightQuoteModal: React.FC<FlightQuoteModalProps> = ({
  isOpen,
  onClose,
  onSuccessSubmitted,
  initialDestination,
}) => {
  const { user } = useAuth();

  // Multi-step form step state: 1 = Flight Info, 2 = Passengers & Preferences, 3 = Contact & Confirmation, 4 = Success Screen
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form Fields
  const [tripType, setTripType] = useState<'One Way' | 'Round Trip' | 'Multi-City'>('Round Trip');
  const [from, setFrom] = useState('Dhaka (DAC), Bangladesh');
  const [to, setTo] = useState(initialDestination || '');
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [adults, setAdults] = useState<number>(1);
  const [children, setChildren] = useState<number>(0);
  const [infants, setInfants] = useState<number>(0);
  const [cabinClass, setCabinClass] = useState<'Economy' | 'Premium Economy' | 'Business' | 'First'>('Economy');
  const [preferredAirline, setPreferredAirline] = useState('');
  const [flexibleDate, setFlexibleDate] = useState<'Yes' | 'No'>('Yes');
  const [additionalRequirements, setAdditionalRequirements] = useState('');

  // Contact Info
  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // Auto pre-fill if user logged in or initialDestination passed
  useEffect(() => {
    if (isOpen) {
      if (initialDestination) {
        setTo(initialDestination);
      }
      if (!from) {
        setFrom('Dhaka (DAC), Bangladesh');
      }
      if (user) {
        if (user.fullName) setCustomerName(user.fullName);
        if (user.email) setEmail(user.email);
      }
    }
  }, [user, isOpen, initialDestination]);

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [submittedQuote, setSubmittedQuote] = useState<FlightQuoteRequest | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const resetForm = () => {
    setStep(1);
    setFrom('');
    setTo('');
    setDepartureDate('');
    setReturnDate('');
    setAdults(1);
    setChildren(0);
    setInfants(0);
    setCabinClass('Economy');
    setPreferredAirline('');
    setFlexibleDate('Yes');
    setAdditionalRequirements('');
    setErrorMessage('');
    setSubmittedQuote(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const validateStep1 = () => {
    if (!from.trim()) {
      setErrorMessage('Please enter your departure city or airport (From).');
      return false;
    }
    if (!to.trim()) {
      setErrorMessage('Please enter your destination city or airport (To).');
      return false;
    }
    if (!departureDate) {
      setErrorMessage('Please select a departure date.');
      return false;
    }
    if (tripType === 'Round Trip' && !returnDate) {
      setErrorMessage('Please select a return date for your round trip.');
      return false;
    }
    setErrorMessage('');
    return true;
  };

  const validateStep2 = () => {
    if (adults < 1) {
      setErrorMessage('At least 1 adult passenger is required.');
      return false;
    }
    setErrorMessage('');
    return true;
  };

  const validateStep3 = () => {
    if (!customerName.trim()) {
      setErrorMessage('Please enter your full name.');
      return false;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return false;
    }
    if (!phone.trim() || phone.trim().length < 6) {
      setErrorMessage('Please enter a valid WhatsApp or Phone number.');
      return false;
    }
    setErrorMessage('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep3()) return;

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/quotes/flight', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tripType,
          from,
          to,
          departureDate,
          returnDate,
          adults,
          children,
          infants,
          cabinClass,
          preferredAirline,
          flexibleDate,
          additionalRequirements,
          customerName,
          email,
          phone,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit flight quotation request.');
      }

      setSubmittedQuote(data.quote);
      setStep(4);
      if (onSuccessSubmitted) onSuccessSubmitted(data.quote);
    } catch (err: any) {
      console.error('Flight quote submission error:', err);
      setErrorMessage(err.message || 'An unexpected error occurred while submitting.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyId = () => {
    if (submittedQuote?.id) {
      navigator.clipboard.writeText(submittedQuote.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-sky-400/30 rounded-3xl shadow-2xl overflow-hidden my-8 text-slate-100">
        
        {/* Header Header */}
        <div className="relative px-6 py-5 bg-gradient-to-r from-sky-900/80 via-slate-900 to-sky-950/90 border-b border-sky-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-xl shadow-inner">
              ✈️
            </div>
            <div>
              <h2 className="text-xl font-serif-display font-bold text-white tracking-tight">
                Flight Ticket Quotation
              </h2>
              <p className="text-xs text-sky-200/80">
                Customized airfare search & personalized flight offers
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Step Indicator Bar (Steps 1, 2, 3) */}
        {step < 4 && (
          <div className="px-6 pt-4 bg-slate-900/60 border-b border-white/5 flex items-center justify-between text-xs font-medium text-sky-200/70">
            <div className={`flex items-center gap-2 pb-2 border-b-2 transition-all ${step === 1 ? 'border-sky-400 text-sky-400 font-bold' : 'border-transparent'}`}>
              <span className="w-5 h-5 rounded-full bg-sky-500/20 flex items-center justify-center text-[10px]">1</span>
              <span>Flight Route</span>
            </div>
            <div className={`flex items-center gap-2 pb-2 border-b-2 transition-all ${step === 2 ? 'border-sky-400 text-sky-400 font-bold' : 'border-transparent'}`}>
              <span className="w-5 h-5 rounded-full bg-sky-500/20 flex items-center justify-center text-[10px]">2</span>
              <span>Preferences</span>
            </div>
            <div className={`flex items-center gap-2 pb-2 border-b-2 transition-all ${step === 3 ? 'border-sky-400 text-sky-400 font-bold' : 'border-transparent'}`}>
              <span className="w-5 h-5 rounded-full bg-sky-500/20 flex items-center justify-center text-[10px]">3</span>
              <span>Contact Details</span>
            </div>
          </div>
        )}

        {/* Error Banner */}
        {errorMessage && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
            <span className="material-symbols-outlined text-base text-red-400">error</span>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form Body */}
        <div className="p-6">
          {/* STEP 1: Route & Dates */}
          {step === 1 && (
            <div className="space-y-5 animate-fade-in">
              {/* Trip Type Selector */}
              <div>
                <label className="block text-xs font-semibold text-sky-200 mb-2 uppercase tracking-wider">
                  Trip Type *
                </label>
                <div className="grid grid-cols-3 gap-2 p-1 bg-slate-800/80 rounded-2xl border border-white/10">
                  {(['Round Trip', 'One Way', 'Multi-City'] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setTripType(type)}
                      className={`py-2 rounded-xl text-xs font-semibold transition-all ${
                        tripType === type
                          ? 'bg-sky-500 text-white shadow-md'
                          : 'text-slate-300 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Route: From & To */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-sky-200 mb-1">From (Origin City/Airport) *</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-sky-400/80 text-lg">flight_takeoff</span>
                    <input
                      type="text"
                      required
                      placeholder="e.g. San Francisco (SFO) or London"
                      value={from}
                      onChange={(e) => setFrom(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-800/80 border border-sky-300/20 text-white text-sm placeholder-slate-400 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400/30"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-sky-200 mb-1">To (Destination) *</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-sky-400/80 text-lg">flight_land</span>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Tokyo (HND) or Paris (CDG)"
                      value={to}
                      onChange={(e) => setTo(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-800/80 border border-sky-300/20 text-white text-sm placeholder-slate-400 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400/30"
                    />
                  </div>
                </div>
              </div>

              {/* Travel Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-sky-200 mb-1">Departure Date *</label>
                  <input
                    type="date"
                    required
                    value={departureDate}
                    onChange={(e) => setDepartureDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl bg-slate-800/80 border border-sky-300/20 text-white text-sm focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400/30"
                  />
                </div>

                {tripType === 'Round Trip' && (
                  <div>
                    <label className="block text-xs font-semibold text-sky-200 mb-1">Return Date *</label>
                    <input
                      type="date"
                      required
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-2xl bg-slate-800/80 border border-sky-300/20 text-white text-sm focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400/30"
                    />
                  </div>
                )}
              </div>

              {/* Flexible Date Option */}
              <div className="p-3 bg-slate-800/50 rounded-2xl border border-white/5 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-white">Flexible Dates (+/- 3 days)</div>
                  <div className="text-[11px] text-slate-400">Allows us to find significantly cheaper flight fares</div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setFlexibleDate('Yes')}
                    className={`px-3 py-1 rounded-xl text-xs font-semibold ${flexibleDate === 'Yes' ? 'bg-sky-500 text-white' : 'bg-slate-700 text-slate-300'}`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => setFlexibleDate('No')}
                    className={`px-3 py-1 rounded-xl text-xs font-semibold ${flexibleDate === 'No' ? 'bg-sky-500 text-white' : 'bg-slate-700 text-slate-300'}`}
                  >
                    No
                  </button>
                </div>
              </div>

              {/* Next Step Button */}
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    if (validateStep1()) setStep(2);
                  }}
                  className="px-6 py-3 rounded-2xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-sky-500/20 flex items-center gap-2"
                >
                  <span>Continue to Preferences</span>
                  <span className="material-symbols-outlined text-base">arrow_forward</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Passengers & Cabin Preferences */}
          {step === 2 && (
            <div className="space-y-5 animate-fade-in">
              {/* Passenger Counts */}
              <div>
                <label className="block text-xs font-semibold text-sky-200 mb-2 uppercase tracking-wider">
                  Passengers
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 bg-slate-800/80 rounded-2xl border border-white/10 flex flex-col items-center">
                    <span className="text-xs text-slate-300 font-medium mb-1">Adults (12+ yrs)</span>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setAdults(Math.max(1, adults - 1))}
                        className="w-7 h-7 rounded-full bg-slate-700 hover:bg-slate-600 flex items-center justify-center font-bold text-sm"
                      >
                        -
                      </button>
                      <span className="text-base font-bold text-white w-4 text-center">{adults}</span>
                      <button
                        type="button"
                        onClick={() => setAdults(adults + 1)}
                        className="w-7 h-7 rounded-full bg-slate-700 hover:bg-slate-600 flex items-center justify-center font-bold text-sm"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-800/80 rounded-2xl border border-white/10 flex flex-col items-center">
                    <span className="text-xs text-slate-300 font-medium mb-1">Children (2-11)</span>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setChildren(Math.max(0, children - 1))}
                        className="w-7 h-7 rounded-full bg-slate-700 hover:bg-slate-600 flex items-center justify-center font-bold text-sm"
                      >
                        -
                      </button>
                      <span className="text-base font-bold text-white w-4 text-center">{children}</span>
                      <button
                        type="button"
                        onClick={() => setChildren(children + 1)}
                        className="w-7 h-7 rounded-full bg-slate-700 hover:bg-slate-600 flex items-center justify-center font-bold text-sm"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-800/80 rounded-2xl border border-white/10 flex flex-col items-center">
                    <span className="text-xs text-slate-300 font-medium mb-1">Infants (&lt; 2)</span>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setInfants(Math.max(0, infants - 1))}
                        className="w-7 h-7 rounded-full bg-slate-700 hover:bg-slate-600 flex items-center justify-center font-bold text-sm"
                      >
                        -
                      </button>
                      <span className="text-base font-bold text-white w-4 text-center">{infants}</span>
                      <button
                        type="button"
                        onClick={() => setInfants(infants + 1)}
                        className="w-7 h-7 rounded-full bg-slate-700 hover:bg-slate-600 flex items-center justify-center font-bold text-sm"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cabin Class */}
              <div>
                <label className="block text-xs font-semibold text-sky-200 mb-2 uppercase tracking-wider">
                  Cabin Class *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['Economy', 'Premium Economy', 'Business', 'First'] as const).map((cls) => (
                    <button
                      key={cls}
                      type="button"
                      onClick={() => setCabinClass(cls)}
                      className={`py-2.5 px-3 rounded-2xl text-xs font-semibold border transition-all text-center ${
                        cabinClass === cls
                          ? 'bg-sky-500/20 border-sky-400 text-sky-300 shadow-md'
                          : 'bg-slate-800/50 border-white/10 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      {cls}
                    </button>
                  ))}
                </div>
              </div>

              {/* Preferred Airline */}
              <div>
                <label className="block text-xs font-semibold text-sky-200 mb-1">
                  Preferred Airline (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Emirates, Qatar Airways, Singapore Airlines, Delta"
                  value={preferredAirline}
                  onChange={(e) => setPreferredAirline(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-800/80 border border-sky-300/20 text-white text-sm placeholder-slate-400 focus:outline-none focus:border-sky-400"
                />
              </div>

              {/* Additional Requirements */}
              <div>
                <label className="block text-xs font-semibold text-sky-200 mb-1">
                  Additional Requirements / Specific Instructions (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Direct flights preferred, baggage allowance needs, wheelchair assistance..."
                  value={additionalRequirements}
                  onChange={(e) => setAdditionalRequirements(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-800/80 border border-sky-300/20 text-white text-sm placeholder-slate-400 focus:outline-none focus:border-sky-400"
                />
              </div>

              {/* Navigation Buttons */}
              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-5 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (validateStep2()) setStep(3);
                  }}
                  className="px-6 py-3 rounded-2xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-sky-500/20 flex items-center gap-2"
                >
                  <span>Continue to Contact</span>
                  <span className="material-symbols-outlined text-base">arrow_forward</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Contact & Submit */}
          {step === 3 && (
            <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
              <div className="p-3 bg-sky-950/40 border border-sky-400/20 rounded-2xl text-xs text-sky-200">
                <span className="font-semibold text-white">Summary: </span>
                {tripType} ({from} ✈️ {to}), {departureDate}{returnDate ? ` to ${returnDate}` : ''} • {adults} Adult(s) ({cabinClass})
              </div>

              <div>
                <label className="block text-xs font-semibold text-sky-200 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Mercer"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-800/80 border border-sky-300/20 text-white text-sm focus:outline-none focus:border-sky-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-sky-200 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. alex@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-800/80 border border-sky-300/20 text-white text-sm focus:outline-none focus:border-sky-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-sky-200 mb-1">WhatsApp / Phone Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. +1 (555) 019-2834"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-800/80 border border-sky-300/20 text-white text-sm focus:outline-none focus:border-sky-400"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Our travel experts will contact you directly on WhatsApp or Email with tailored flight options.
                </span>
              </div>

              {/* Navigation & Submit Buttons */}
              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-5 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all"
                >
                  Back
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-7 py-3 rounded-2xl bg-gradient-to-r from-sky-400 to-teal-400 hover:from-sky-300 hover:to-teal-300 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-sky-500/25 flex items-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Quote Request</span>
                      <span className="material-symbols-outlined text-base">send</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* STEP 4: Success & Unique Request ID Display */}
          {step === 4 && submittedQuote && (
            <div className="text-center py-6 space-y-5 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-teal-500/20 border border-teal-400/40 text-teal-300 flex items-center justify-center text-3xl mx-auto shadow-xl">
                ✓
              </div>

              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-bold uppercase tracking-wider mb-2">
                  Quote Request Received
                </span>
                <h3 className="text-2xl font-serif-display font-bold text-white">
                  Thank You, {submittedQuote.customerName}!
                </h3>
                <p className="text-sm text-slate-300 max-w-md mx-auto mt-1">
                  Your flight ticket quotation request has been recorded in our travel system. Our team is working on your itinerary.
                </p>
              </div>

              {/* Request ID Box */}
              <div className="p-4 bg-slate-800/90 border border-sky-400/30 rounded-2xl max-w-md mx-auto text-left flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Quotation Request ID</div>
                  <div className="text-lg font-mono font-bold text-sky-400">{submittedQuote.id}</div>
                </div>
                <button
                  type="button"
                  onClick={handleCopyId}
                  className="px-3 py-1.5 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 border border-sky-400/30 text-sky-300 text-xs font-semibold transition-all flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">{copied ? 'done' : 'content_copy'}</span>
                  <span>{copied ? 'Copied!' : 'Copy ID'}</span>
                </button>
              </div>

              {/* Requirements Summary */}
              <div className="p-4 bg-slate-800/40 rounded-2xl border border-white/5 text-xs text-left max-w-md mx-auto space-y-1.5 text-slate-300">
                <div><strong className="text-slate-100">Route:</strong> {submittedQuote.from} ✈️ {submittedQuote.to} ({submittedQuote.tripType})</div>
                <div><strong className="text-slate-100">Departure:</strong> {submittedQuote.departureDate}{submittedQuote.returnDate ? ` | Return: ${submittedQuote.returnDate}` : ''}</div>
                <div><strong className="text-slate-100">Passengers & Class:</strong> {submittedQuote.adults} Adult(s) • {submittedQuote.cabinClass}</div>
                <div><strong className="text-slate-100">Contact:</strong> {submittedQuote.email} ({submittedQuote.phone})</div>
              </div>

              {/* Done Button */}
              <div className="pt-2 flex justify-center gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-8 py-3 rounded-2xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm transition-all shadow-lg"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
