import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { getVisaFeeForDestination, getVisaRequirement } from '../data/visaRequirementsData';

export type QuoteServiceType = 'flight' | 'visa' | 'package' | 'custom';

export interface UnifiedQuotationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialServiceType?: QuoteServiceType;
  initialDestination?: string;
  initialCountry?: string;
  initialProfession?: string;
  onSuccessSubmitted?: (quoteData: any) => void;
  onOpenTrackModal?: (quoteId: string) => void;
}

export const UnifiedQuotationModal: React.FC<UnifiedQuotationModalProps> = ({
  isOpen,
  onClose,
  initialServiceType = 'flight',
  initialDestination = '',
  initialCountry = '',
  initialProfession = '',
  onSuccessSubmitted,
  onOpenTrackModal,
}) => {
  const { user, showToast } = useAuth();

  // Active Service Type Tab
  const [serviceType, setServiceType] = useState<QuoteServiceType>(initialServiceType);
  const [applicantProfession, setApplicantProfession] = useState(initialProfession || 'Private Job Holder');

  // Multi-step State: 1 = Requirements, 2 = Preferences & Details, 3 = Contact, 4 = Confirmation State
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Common Fields
  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [preferredContact, setPreferredContact] = useState<'whatsapp' | 'phone' | 'email'>('whatsapp');
  const [additionalNotes, setAdditionalNotes] = useState('');

  // Flight Specific Fields
  const [flightTripType, setFlightTripType] = useState<'Round Trip' | 'One Way' | 'Multi-City'>('Round Trip');
  const [flightFrom, setFlightFrom] = useState('Dhaka (DAC), Bangladesh');
  const [flightTo, setFlightTo] = useState(initialDestination || '');
  const [flightDepartureDate, setFlightDepartureDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().split('T')[0];
  });
  const [flightReturnDate, setFlightReturnDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 21);
    return d.toISOString().split('T')[0];
  });
  const [flightAdults, setFlightAdults] = useState<number>(1);
  const [flightChildren, setFlightChildren] = useState<number>(0);
  const [flightInfants, setFlightInfants] = useState<number>(0);
  const [flightCabinClass, setFlightCabinClass] = useState<'Economy' | 'Premium Economy' | 'Business'>('Economy');
  const [preferredAirline, setPreferredAirline] = useState('');
  const [flexibleDates, setFlexibleDates] = useState<'Yes' | 'No'>('Yes');

  // Visa Specific Fields
  const [visaCountry, setVisaCountry] = useState(initialCountry || initialDestination || 'Malaysia');
  const [visaType, setVisaType] = useState<'Tourist' | 'Business' | 'Student' | 'Transit' | 'Medical'>('Tourist');
  const [visaTravelDate, setVisaTravelDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split('T')[0];
  });
  const [visaApplicantsCount, setVisaApplicantsCount] = useState<number>(1);
  const [passportValidity, setPassportValidity] = useState('More than 6 months');
  const [previousVisa, setPreviousVisa] = useState<'Yes' | 'No'>('No');
  const [visaServiceType, setVisaServiceType] = useState<'Full Processing' | 'Consultation' | 'Document Assistance'>('Full Processing');

  // Package / Custom Specific Fields
  const [packageDestination, setPackageDestination] = useState(initialDestination || initialCountry || 'Thailand');
  const [budgetPerPerson, setBudgetPerPerson] = useState('BDT 65,000 - 95,000');
  const [hotelStandard, setHotelStandard] = useState<'3 Star' | '4 Star' | '5 Star Luxury' | 'Overwater Resort'>('4 Star');
  const [travelersCount, setTravelersCount] = useState<number>(2);
  const [tripDurationDays, setTripDurationDays] = useState<number>(5);

  // Status & Confirmation
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [submittedQuoteId, setSubmittedQuoteId] = useState<string | null>(null);
  const [copiedQuoteId, setCopiedQuoteId] = useState(false);

  // Sync initial props whenever modal opens
  useEffect(() => {
    if (isOpen) {
      setServiceType(initialServiceType);
      if (initialDestination) {
        setFlightTo(initialDestination);
        setPackageDestination(initialDestination);
      }
      if (initialCountry) {
        setVisaCountry(initialCountry);
        setPackageDestination(initialCountry);
      }
      if (user) {
        if (user.fullName) setCustomerName(user.fullName);
        if (user.email) setEmail(user.email);
        if (user.phone) setPhone(user.phone);
      }
    }
  }, [isOpen, initialServiceType, initialDestination, initialCountry, user]);

  const activeVisaReq = useMemo(() => {
    return getVisaRequirement(visaCountry, visaType);
  }, [visaCountry, visaType]);

  if (!isOpen) return null;

  const handleClose = () => {
    setStep(1);
    setErrorMessage('');
    setSubmittedQuoteId(null);
    setCopiedQuoteId(false);
    onClose();
  };

  const validateStep1 = () => {
    setErrorMessage('');
    if (serviceType === 'flight') {
      if (!flightFrom.trim()) {
        setErrorMessage('Please specify your departure airport / city.');
        return false;
      }
      if (!flightTo.trim()) {
        setErrorMessage('Please specify your destination airport / city.');
        return false;
      }
      if (!flightDepartureDate) {
        setErrorMessage('Please select your departure date.');
        return false;
      }
      if (flightTripType === 'Round Trip' && !flightReturnDate) {
        setErrorMessage('Please select your return date for a round trip.');
        return false;
      }
    } else if (serviceType === 'visa') {
      if (!visaCountry.trim()) {
        setErrorMessage('Please select the destination country for visa processing.');
        return false;
      }
      if (!visaTravelDate) {
        setErrorMessage('Please select your intended travel date.');
        return false;
      }
    } else {
      if (!packageDestination.trim()) {
        setErrorMessage('Please specify the destination or package you are interested in.');
        return false;
      }
    }
    return true;
  };

  const validateStep2 = () => {
    setErrorMessage('');
    // Step 2 preferences are validated or have reasonable defaults
    return true;
  };

  const validateStep3 = () => {
    setErrorMessage('');
    if (!customerName.trim()) {
      setErrorMessage('Please provide your full name.');
      return false;
    }
    if (!phone.trim() && !email.trim()) {
      setErrorMessage('Please provide at least a WhatsApp/Phone number or Email address.');
      return false;
    }
    if (phone.trim() && phone.replace(/\D/g, '').length < 8) {
      setErrorMessage('Please enter a valid phone or WhatsApp number with country code (e.g. +880 1851-172032).');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep3()) return;

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      let endpoint = '/api/quotes/flight';
      let payload: any = {};

      if (serviceType === 'flight') {
        endpoint = '/api/quotes/flight';
        payload = {
          tripType: flightTripType,
          from: flightFrom,
          to: flightTo,
          departureDate: flightDepartureDate,
          returnDate: flightTripType === 'Round Trip' ? flightReturnDate : undefined,
          adults: flightAdults,
          children: flightChildren,
          infants: flightInfants,
          cabinClass: flightCabinClass,
          preferredAirline: preferredAirline.trim() || undefined,
          flexibleDate: flexibleDates,
          additionalRequirements: additionalNotes.trim() || undefined,
          customerName: customerName.trim(),
          email: email.trim() || undefined,
          phone: phone.trim() || undefined,
          preferredContact,
          userId: user?.uid,
        };
      } else if (serviceType === 'visa') {
        endpoint = '/api/quotes/visa';
        payload = {
          destinationCountry: visaCountry,
          visaType,
          intendedTravelDate: visaTravelDate,
          applicantsCount: visaApplicantsCount,
          applicantNationality: 'Bangladeshi',
          passportValidity,
          previousVisa,
          previousRefusal: 'No',
          currentResidence: 'Bangladesh',
          requiredService: visaServiceType,
          additionalInfo: additionalNotes.trim() || undefined,
          customerName: customerName.trim(),
          email: email.trim() || undefined,
          phone: phone.trim() || undefined,
          preferredContact,
          userId: user?.uid,
        };
      } else {
        endpoint = '/api/quotes/package';
        payload = {
          destination: packageDestination,
          travelers: travelersCount,
          durationDays: tripDurationDays,
          budgetPerPerson,
          hotelStandard,
          notes: additionalNotes.trim() || undefined,
          customerName: customerName.trim(),
          email: email.trim() || undefined,
          phone: phone.trim() || undefined,
          preferredContact,
          userId: user?.uid,
        };
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit quotation request. Please try again.');
      }

      const generatedId = data.quote?.id || `AZQ-${Date.now().toString().slice(-6)}`;
      setSubmittedQuoteId(generatedId);
      setStep(4);
      onSuccessSubmitted?.(data.quote || payload);
      showToast?.('Quotation request submitted successfully! Our Dhaka desk is on it.', 'success');
    } catch (err: any) {
      console.error('Quote submission error:', err);
      setErrorMessage(err.message || 'An unexpected error occurred. Please contact our WhatsApp desk.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyQuoteId = () => {
    if (submittedQuoteId) {
      navigator.clipboard.writeText(submittedQuoteId);
      setCopiedQuoteId(true);
      setTimeout(() => setCopiedQuoteId(false), 2500);
    }
  };

  const getWhatsAppChatUrl = () => {
    const text = encodeURIComponent(
      `Hello Azraq Tours & Travels! I just submitted a ${serviceType.toUpperCase()} quotation request with Reference ID: ${submittedQuoteId || 'N/A'} for ${customerName} (${serviceType === 'flight' ? flightTo : serviceType === 'visa' ? visaCountry : packageDestination}). Please provide an update!`
    );
    return `https://wa.me/8801851172032?text=${text}`;
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="quotation-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-fade-in"
    >
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-sky-400/30 rounded-3xl shadow-2xl overflow-hidden my-auto text-slate-100 flex flex-col max-h-[92vh]">
        
        {/* Top Header with Brand Badge */}
        <div className="relative px-6 py-4 bg-gradient-to-r from-sky-950 via-slate-900 to-sky-950 border-b border-sky-500/20 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500 to-cyan-400 flex items-center justify-center text-slate-950 shadow-md">
              <span className="material-symbols-outlined text-2xl font-bold">
                {serviceType === 'flight' ? 'flight_takeoff' : serviceType === 'visa' ? 'verified_user' : 'luggage'}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="quotation-modal-title" className="text-lg sm:text-xl font-serif-display font-bold text-white tracking-tight">
                  {step === 4 ? 'Quotation Request Received' : 'Request Official Travel Quotation'}
                </h2>
                <span className="hidden sm:inline-flex px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold border border-emerald-400/30">
                  Dhaka Desk
                </span>
              </div>
              <p className="text-xs text-sky-200/80">
                {step === 4 ? 'Reference ID generated • 2-Hour response guarantee' : 'Personalized BDT pricing from certified travel specialists'}
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            aria-label="Close quotation modal"
            className="p-2 rounded-full bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Service Type Switcher (Steps 1 to 3 only) */}
        {step !== 4 && (
          <div className="px-6 pt-4 pb-2 border-b border-white/5 bg-slate-950/50 shrink-0">
            <div className="flex items-center justify-between gap-1 p-1 bg-slate-800/80 rounded-2xl border border-sky-400/20">
              {[
                { type: 'flight' as QuoteServiceType, label: 'Flight Ticket', icon: 'flight' },
                { type: 'visa' as QuoteServiceType, label: 'Visa Guidance', icon: 'assignment' },
                { type: 'package' as QuoteServiceType, label: 'Holiday Package', icon: 'holiday_village' },
                { type: 'custom' as QuoteServiceType, label: 'Custom Concierge', icon: 'tune' },
              ].map((tab) => (
                <button
                  key={tab.type}
                  type="button"
                  onClick={() => {
                    setServiceType(tab.type);
                    setErrorMessage('');
                  }}
                  className={`flex-1 py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    serviceType === tab.type
                      ? 'bg-gradient-to-r from-sky-500 to-cyan-400 text-slate-950 shadow-md'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">{tab.icon}</span>
                  <span className="truncate">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Step Progress Indicators */}
            <div className="flex items-center justify-between gap-2 mt-3 px-1 text-[11px] font-semibold text-slate-400">
              <div className={`flex items-center gap-1.5 ${step >= 1 ? 'text-sky-300 font-bold' : ''}`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 1 ? 'bg-sky-500 text-slate-950 font-black' : 'bg-slate-800'}`}>1</span>
                <span>Trip Details</span>
              </div>
              <div className="h-[1px] flex-1 bg-white/10"></div>
              <div className={`flex items-center gap-1.5 ${step >= 2 ? 'text-sky-300 font-bold' : ''}`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 2 ? 'bg-sky-500 text-slate-950 font-black' : 'bg-slate-800'}`}>2</span>
                <span>Preferences</span>
              </div>
              <div className="h-[1px] flex-1 bg-white/10"></div>
              <div className={`flex items-center gap-1.5 ${step >= 3 ? 'text-sky-300 font-bold' : ''}`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 3 ? 'bg-sky-500 text-slate-950 font-black' : 'bg-slate-800'}`}>3</span>
                <span>Contact & Submit</span>
              </div>
            </div>
          </div>
        )}

        {/* Scrollable Form Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {errorMessage && (
            <div role="alert" className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-400/40 text-rose-200 text-xs font-semibold flex items-center gap-2">
              <span className="material-symbols-outlined text-base text-rose-400">error</span>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* STEP 1: Core Trip / Service Info */}
          {step === 1 && (
            <div className="space-y-4">
              {serviceType === 'flight' && (
                <>
                  <div className="flex gap-2">
                    {(['Round Trip', 'One Way', 'Multi-City'] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setFlightTripType(t)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer border ${
                          flightTripType === t
                            ? 'bg-sky-500/20 text-sky-300 border-sky-400/50'
                            : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="flight-from" className="block text-xs font-bold text-slate-300 mb-1.5">
                        Departure City / Airport (From) *
                      </label>
                      <input
                        id="flight-from"
                        type="text"
                        value={flightFrom}
                        onChange={(e) => setFlightFrom(e.target.value)}
                        placeholder="e.g. Dhaka (DAC)"
                        className="w-full bg-slate-800/90 text-white rounded-xl px-3.5 py-2.5 border border-white/20 focus:border-sky-400 text-xs outline-none"
                      />
                    </div>

                    <div>
                      <label htmlFor="flight-to" className="block text-xs font-bold text-slate-300 mb-1.5">
                        Destination Airport / City (To) *
                      </label>
                      <input
                        id="flight-to"
                        type="text"
                        value={flightTo}
                        onChange={(e) => setFlightTo(e.target.value)}
                        placeholder="e.g. Bangkok (BKK), Maldives (MLE), Dubai (DXB)"
                        className="w-full bg-slate-800/90 text-white rounded-xl px-3.5 py-2.5 border border-white/20 focus:border-sky-400 text-xs outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="flight-departure-date" className="block text-xs font-bold text-slate-300 mb-1.5">
                        Departure Date *
                      </label>
                      <input
                        id="flight-departure-date"
                        type="date"
                        value={flightDepartureDate}
                        onChange={(e) => setFlightDepartureDate(e.target.value)}
                        className="w-full bg-slate-800/90 text-white rounded-xl px-3.5 py-2.5 border border-white/20 focus:border-sky-400 text-xs outline-none"
                      />
                    </div>

                    {flightTripType === 'Round Trip' && (
                      <div>
                        <label htmlFor="flight-return-date" className="block text-xs font-bold text-slate-300 mb-1.5">
                          Return Date *
                        </label>
                        <input
                          id="flight-return-date"
                          type="date"
                          value={flightReturnDate}
                          onChange={(e) => setFlightReturnDate(e.target.value)}
                          className="w-full bg-slate-800/90 text-white rounded-xl px-3.5 py-2.5 border border-white/20 focus:border-sky-400 text-xs outline-none"
                        />
                      </div>
                    )}
                  </div>

                  {/* Passengers Counter */}
                  <div className="bg-slate-800/60 p-4 rounded-2xl border border-white/10 space-y-3">
                    <span className="block text-xs font-bold text-slate-200">Passengers (Adults, Children, Infants)</span>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label htmlFor="adults-count" className="text-[11px] text-slate-400 block mb-1">Adults (12y+)</label>
                        <select
                          id="adults-count"
                          value={flightAdults}
                          onChange={(e) => setFlightAdults(Number(e.target.value))}
                          className="w-full bg-slate-900 text-white rounded-xl px-2 py-2 text-xs border border-white/15 focus:border-sky-400"
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                            <option key={num} value={num}>{num} Adult{num > 1 ? 's' : ''}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label htmlFor="children-count" className="text-[11px] text-slate-400 block mb-1">Child (2-11y)</label>
                        <select
                          id="children-count"
                          value={flightChildren}
                          onChange={(e) => setFlightChildren(Number(e.target.value))}
                          className="w-full bg-slate-900 text-white rounded-xl px-2 py-2 text-xs border border-white/15 focus:border-sky-400"
                        >
                          {[0, 1, 2, 3, 4, 5].map((num) => (
                            <option key={num} value={num}>{num} Child{num > 1 ? 'ren' : ''}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label htmlFor="infants-count" className="text-[11px] text-slate-400 block mb-1">Infants (&lt;2y)</label>
                        <select
                          id="infants-count"
                          value={flightInfants}
                          onChange={(e) => setFlightInfants(Number(e.target.value))}
                          className="w-full bg-slate-900 text-white rounded-xl px-2 py-2 text-xs border border-white/15 focus:border-sky-400"
                        >
                          {[0, 1, 2, 3].map((num) => (
                            <option key={num} value={num}>{num} Infant{num > 1 ? 's' : ''}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {serviceType === 'visa' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="visa-country" className="block text-xs font-bold text-slate-300 mb-1.5">
                        Destination Country *
                      </label>
                      <select
                        id="visa-country"
                        value={visaCountry}
                        onChange={(e) => setVisaCountry(e.target.value)}
                        className="w-full bg-slate-800/90 text-white rounded-xl px-3.5 py-2.5 border border-white/20 focus:border-sky-400 text-xs outline-none"
                      >
                        {['Malaysia', 'Thailand', 'Singapore', 'Maldives', 'United Arab Emirates', 'Saudi Arabia (Umrah/Tourist)', 'Indonesia (Bali)', 'Vietnam', 'Turkey', 'Sri Lanka', 'Qatar', 'Egypt', 'United Kingdom', 'Schengen / Europe', 'United States', 'Canada', 'Japan'].map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="visa-category" className="block text-xs font-bold text-slate-300 mb-1.5">
                        Visa Category *
                      </label>
                      <select
                        id="visa-category"
                        value={visaType}
                        onChange={(e) => setVisaType(e.target.value as any)}
                        className="w-full bg-slate-800/90 text-white rounded-xl px-3.5 py-2.5 border border-white/20 focus:border-sky-400 text-xs outline-none"
                      >
                        <option value="Tourist">Tourist / Visit Visa</option>
                        <option value="Business">Business Visa</option>
                        <option value="Student">Student Visa</option>
                        <option value="Medical">Medical Visa</option>
                        <option value="Transit">Transit Visa</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="visa-travel-date" className="block text-xs font-bold text-slate-300 mb-1.5">
                        Intended Travel Date *
                      </label>
                      <input
                        id="visa-travel-date"
                        type="date"
                        value={visaTravelDate}
                        onChange={(e) => setVisaTravelDate(e.target.value)}
                        className="w-full bg-slate-800/90 text-white rounded-xl px-3.5 py-2.5 border border-white/20 focus:border-sky-400 text-xs outline-none"
                      />
                    </div>

                    <div>
                      <label htmlFor="visa-applicants-count" className="block text-xs font-bold text-slate-300 mb-1.5">
                        Number of Applicants *
                      </label>
                      <select
                        id="visa-applicants-count"
                        value={visaApplicantsCount}
                        onChange={(e) => setVisaApplicantsCount(Number(e.target.value))}
                        className="w-full bg-slate-800/90 text-white rounded-xl px-3.5 py-2.5 border border-white/20 focus:border-sky-400 text-xs outline-none"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                          <option key={num} value={num}>{num} Applicant{num > 1 ? 's' : ''}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Visa Fee Context Badge */}
                  <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-400/30 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-emerald-300">
                      <span className="material-symbols-outlined text-base text-emerald-400">verified</span>
                      <span>Estimated Official Embassy Fee:</span>
                    </div>
                    <span className="font-bold text-white">
                      {getVisaFeeForDestination(visaCountry)}
                    </span>
                  </div>
                </>
              )}

              {(serviceType === 'package' || serviceType === 'custom') && (
                <>
                  <div>
                    <label htmlFor="package-dest" className="block text-xs font-bold text-slate-300 mb-1.5">
                      Destination or Tour Focus *
                    </label>
                    <input
                      id="package-dest"
                      type="text"
                      value={packageDestination}
                      onChange={(e) => setPackageDestination(e.target.value)}
                      placeholder="e.g. Thailand (Bangkok & Phuket), Maldives Overwater, Cox's Bazar Weekend"
                      className="w-full bg-slate-800/90 text-white rounded-xl px-3.5 py-2.5 border border-white/20 focus:border-sky-400 text-xs outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="package-duration" className="block text-xs font-bold text-slate-300 mb-1.5">
                        Trip Duration (Days)
                      </label>
                      <select
                        id="package-duration"
                        value={tripDurationDays}
                        onChange={(e) => setTripDurationDays(Number(e.target.value))}
                        className="w-full bg-slate-800/90 text-white rounded-xl px-3.5 py-2.5 border border-white/20 focus:border-sky-400 text-xs outline-none"
                      >
                        {[3, 4, 5, 6, 7, 8, 10, 14].map((d) => (
                          <option key={d} value={d}>{d} Days / {d - 1} Nights</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="package-travelers" className="block text-xs font-bold text-slate-300 mb-1.5">
                        Number of Travelers
                      </label>
                      <select
                        id="package-travelers"
                        value={travelersCount}
                        onChange={(e) => setTravelersCount(Number(e.target.value))}
                        className="w-full bg-slate-800/90 text-white rounded-xl px-3.5 py-2.5 border border-white/20 focus:border-sky-400 text-xs outline-none"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 10, 15, 20].map((t) => (
                          <option key={t} value={t}>{t} Traveler{t > 1 ? 's' : ''}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* STEP 2: Preferences & Service Depth */}
          {step === 2 && (
            <div className="space-y-4">
              {serviceType === 'flight' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="cabin-class" className="block text-xs font-bold text-slate-300 mb-1.5">
                        Preferred Cabin Class
                      </label>
                      <select
                        id="cabin-class"
                        value={flightCabinClass}
                        onChange={(e) => setFlightCabinClass(e.target.value as any)}
                        className="w-full bg-slate-800/90 text-white rounded-xl px-3.5 py-2.5 border border-white/20 focus:border-sky-400 text-xs outline-none"
                      >
                        <option value="Economy">Economy Class (Best Fare)</option>
                        <option value="Premium Economy">Premium Economy</option>
                        <option value="Business">Business Class</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="flexible-dates" className="block text-xs font-bold text-slate-300 mb-1.5">
                        Date Flexibility (±2-3 Days)
                      </label>
                      <select
                        id="flexible-dates"
                        value={flexibleDates}
                        onChange={(e) => setFlexibleDates(e.target.value as any)}
                        className="w-full bg-slate-800/90 text-white rounded-xl px-3.5 py-2.5 border border-white/20 focus:border-sky-400 text-xs outline-none"
                      >
                        <option value="Yes">Yes, flexible for better fares</option>
                        <option value="No">No, exact dates required</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="preferred-airline" className="block text-xs font-bold text-slate-300 mb-1.5">
                      Preferred Airline (Optional)
                    </label>
                    <input
                      id="preferred-airline"
                      type="text"
                      value={preferredAirline}
                      onChange={(e) => setPreferredAirline(e.target.value)}
                      placeholder="e.g. Biman Bangladesh, Emirates, Singapore Airlines, US-Bangla, Thai Airways"
                      className="w-full bg-slate-800/90 text-white rounded-xl px-3.5 py-2.5 border border-white/20 focus:border-sky-400 text-xs outline-none"
                    />
                  </div>
                </>
              )}

              {serviceType === 'visa' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="passport-validity" className="block text-xs font-bold text-slate-300 mb-1.5">
                        Passport Validity Status
                      </label>
                      <select
                        id="passport-validity"
                        value={passportValidity}
                        onChange={(e) => setPassportValidity(e.target.value)}
                        className="w-full bg-slate-800/90 text-white rounded-xl px-3.5 py-2.5 border border-white/20 focus:border-sky-400 text-xs outline-none"
                      >
                        <option value="More than 6 months">More than 6 months (Compliant)</option>
                        <option value="Less than 6 months">Less than 6 months (Needs renewal)</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="previous-visa" className="block text-xs font-bold text-slate-300 mb-1.5">
                        Visited this country before?
                      </label>
                      <select
                        id="previous-visa"
                        value={previousVisa}
                        onChange={(e) => setPreviousVisa(e.target.value as any)}
                        className="w-full bg-slate-800/90 text-white rounded-xl px-3.5 py-2.5 border border-white/20 focus:border-sky-400 text-xs outline-none"
                      >
                        <option value="No">No, First time applying</option>
                        <option value="Yes">Yes, previously held visa</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="visa-service-tier" className="block text-xs font-bold text-slate-300 mb-1.5">
                      Service Requirement
                    </label>
                    <select
                      id="visa-service-tier"
                      value={visaServiceType}
                      onChange={(e) => setVisaServiceType(e.target.value as any)}
                      className="w-full bg-slate-800/90 text-white rounded-xl px-3.5 py-2.5 border border-white/20 focus:border-sky-400 text-xs outline-none"
                    >
                      <option value="Full Processing">Full End-to-End Processing (Submission & Verification)</option>
                      <option value="Document Assistance">Document Audit & Cover Letter Support</option>
                      <option value="Consultation">One-on-One Visa Consultation</option>
                    </select>
                  </div>
                </>
              )}

              {(serviceType === 'package' || serviceType === 'custom') && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="budget-bracket" className="block text-xs font-bold text-slate-300 mb-1.5">
                        Budget Range per Person (BDT)
                      </label>
                      <select
                        id="budget-bracket"
                        value={budgetPerPerson}
                        onChange={(e) => setBudgetPerPerson(e.target.value)}
                        className="w-full bg-slate-800/90 text-white rounded-xl px-3.5 py-2.5 border border-white/20 focus:border-sky-400 text-xs outline-none"
                      >
                        <option value="Under BDT 45,000">Under BDT 45,000 (Budget Friendly)</option>
                        <option value="BDT 45,000 - 75,000">BDT 45,000 - 75,000 (Standard)</option>
                        <option value="BDT 75,000 - 120,000">BDT 75,000 - 120,000 (Premium Comfort)</option>
                        <option value="BDT 120,000+ Luxury">BDT 120,000+ (5-Star Luxury / Honeymoon)</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="hotel-pref" className="block text-xs font-bold text-slate-300 mb-1.5">
                        Hotel Accommodation Standard
                      </label>
                      <select
                        id="hotel-pref"
                        value={hotelStandard}
                        onChange={(e) => setHotelStandard(e.target.value as any)}
                        className="w-full bg-slate-800/90 text-white rounded-xl px-3.5 py-2.5 border border-white/20 focus:border-sky-400 text-xs outline-none"
                      >
                        <option value="3 Star">3-Star Clean City Hotel</option>
                        <option value="4 Star">4-Star Premium Hotel with Breakfast</option>
                        <option value="5 Star Luxury">5-Star Luxury Resort / International Brand</option>
                        <option value="Overwater Resort">Private Pool Villa / Overwater Resort</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              <div>
                <label htmlFor="additional-requirements" className="block text-xs font-bold text-slate-300 mb-1.5">
                  Special Notes or Specific Requests (Optional)
                </label>
                <textarea
                  id="additional-requirements"
                  rows={3}
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  placeholder="e.g. Halal food preferred, honeymoon cake & bed decoration, extra baggage allowance, specific hotel name..."
                  className="w-full bg-slate-800/90 text-white rounded-xl p-3 border border-white/20 focus:border-sky-400 text-xs outline-none resize-none"
                ></textarea>
              </div>
            </div>
          )}

          {/* STEP 3: Contact Details & Submit */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-sky-500/10 border border-sky-400/30 space-y-1">
                <div className="text-xs font-bold text-sky-300 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-base text-sky-400">headset_mic</span>
                  <span>Where should our Dhaka Travel Desk send your quotation?</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  We guarantee zero spam and transparent quotations within 2 business hours.
                </p>
              </div>

              <div>
                <label htmlFor="customer-fullname" className="block text-xs font-bold text-slate-300 mb-1.5">
                  Your Full Name *
                </label>
                <input
                  id="customer-fullname"
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Istihad Ahmed"
                  className="w-full bg-slate-800/90 text-white rounded-xl px-3.5 py-2.5 border border-white/20 focus:border-sky-400 text-xs outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="customer-phone" className="block text-xs font-bold text-slate-300 mb-1.5">
                    WhatsApp / Mobile Number *
                  </label>
                  <input
                    id="customer-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +880 1851-172032"
                    className="w-full bg-slate-800/90 text-white rounded-xl px-3.5 py-2.5 border border-white/20 focus:border-sky-400 text-xs outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="customer-email" className="block text-xs font-bold text-slate-300 mb-1.5">
                    Email Address (Optional)
                  </label>
                  <input
                    id="customer-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. traveler@example.com"
                    className="w-full bg-slate-800/90 text-white rounded-xl px-3.5 py-2.5 border border-white/20 focus:border-sky-400 text-xs outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Preferred Contact Channel
                </label>
                <div className="flex gap-2">
                  {[
                    { id: 'whatsapp', label: 'WhatsApp (Instant)', icon: 'chat' },
                    { id: 'phone', label: 'Phone Call', icon: 'call' },
                    { id: 'email', label: 'Email', icon: 'mail' },
                  ].map((chan) => (
                    <button
                      key={chan.id}
                      type="button"
                      onClick={() => setPreferredContact(chan.id as any)}
                      className={`flex-1 py-2 px-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        preferredContact === chan.id
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/60 shadow-sm'
                          : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <span className="material-symbols-outlined text-sm">{chan.icon}</span>
                      <span>{chan.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Trust Evidence Reminder */}
              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 pt-1">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm text-emerald-400">check_circle</span>
                  <span>Direct Dhaka Desk Hotline</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm text-sky-400">check_circle</span>
                  <span>bKash / Nagad / Card Ready</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Success & Confirmation State */}
          {step === 4 && (
            <div className="py-4 space-y-6 text-center animate-fade-in">
              <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto text-emerald-400 shadow-xl shadow-emerald-500/20">
                <span className="material-symbols-outlined text-3xl font-bold">check_circle</span>
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-serif-display font-bold text-white">
                  Quotation Request Submitted!
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                  Our certified travel team at the Dhaka Travel Desk has received your requirements and is preparing your personalized quotation.
                </p>
              </div>

              {/* Reference ID Banner */}
              <div className="p-4 rounded-2xl bg-slate-800/80 border border-sky-400/40 max-w-md mx-auto space-y-2">
                <span className="text-[11px] font-bold text-sky-300 uppercase tracking-wider block">
                  Your Official Reference ID
                </span>
                <div className="flex items-center justify-center gap-3">
                  <span className="font-mono text-lg font-black text-white tracking-widest bg-slate-900 px-3 py-1 rounded-xl border border-sky-400/30">
                    {submittedQuoteId}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyQuoteId}
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-sky-300 transition-colors cursor-pointer"
                    title="Copy Reference ID"
                  >
                    <span className="material-symbols-outlined text-base">
                      {copiedQuoteId ? 'check' : 'content_copy'}
                    </span>
                  </button>
                </div>
                <p className="text-[10px] text-slate-400">
                  Save this ID to track your status or fast-track on WhatsApp.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto pt-2">
                <a
                  href={getWhatsAppChatUrl()}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-3 px-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-lg">chat</span>
                  <span>Fast-Track on WhatsApp ↗</span>
                </a>

                {onOpenTrackModal && submittedQuoteId && (
                  <button
                    type="button"
                    onClick={() => {
                      const qId = submittedQuoteId;
                      handleClose();
                      onOpenTrackModal(qId);
                    }}
                    className="py-3 px-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base">find_in_page</span>
                    <span>Track Status</span>
                  </button>
                )}
              </div>

              <div className="text-[11px] text-slate-400">
                <span>Expected response time: </span>
                <strong className="text-emerald-300">Within 2 Business Hours</strong> (Dhaka Time, 09:00 AM - 10:00 PM)
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions (Steps 1 to 3) */}
        {step !== 4 && (
          <div className="px-6 py-4 bg-slate-950/80 border-t border-white/10 flex items-center justify-between shrink-0">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((s) => (s - 1) as any)}
                className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-base">arrow_back</span>
                <span>Back</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2.5 rounded-xl text-slate-400 hover:text-white text-xs font-bold transition-all cursor-pointer"
              >
                Cancel
              </button>
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-400 to-cyan-400 hover:from-sky-300 hover:to-cyan-300 text-slate-950 font-extrabold text-xs transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-1"
              >
                <span>Continue</span>
                <span className="material-symbols-outlined text-base">arrow_forward</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-7 py-3 rounded-xl bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 text-slate-950 font-black text-xs sm:text-sm transition-all shadow-lg active:scale-95 cursor-pointer flex items-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 rounded-full border-2 border-slate-950 border-t-transparent animate-spin"></span>
                    <span>Submitting to Dhaka Desk...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-base">send</span>
                    <span>Submit & Get Free Quote</span>
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
