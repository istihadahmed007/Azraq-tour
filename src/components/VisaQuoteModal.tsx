import React, { useState, useEffect } from 'react';
import { VisaQuoteRequest } from '../types';
import { useAuth } from '../context/AuthContext';

interface VisaQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessSubmitted?: (quote: VisaQuoteRequest) => void;
  initialCountry?: string;
}

export const VisaQuoteModal: React.FC<VisaQuoteModalProps> = ({
  isOpen,
  onClose,
  onSuccessSubmitted,
  initialCountry,
}) => {
  const { user } = useAuth();

  // Form Steps: 1 = Destination & Travel, 2 = Background & Service, 3 = Contact, 4 = Success
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form Fields
  const [destinationCountry, setDestinationCountry] = useState(initialCountry || '');
  const [visaType, setVisaType] = useState<'Tourist' | 'Business' | 'Student' | 'Transit' | 'Medical' | 'Other'>('Tourist');
  const [intendedTravelDate, setIntendedTravelDate] = useState('');
  const [applicantsCount, setApplicantsCount] = useState<number>(1);
  const [applicantNationality, setApplicantNationality] = useState('');
  const [passportValidity, setPassportValidity] = useState('More than 6 months');
  const [previousVisa, setPreviousVisa] = useState<'Yes' | 'No'>('No');
  const [previousRefusal, setPreviousRefusal] = useState<'Yes' | 'No'>('No');
  const [currentResidence, setCurrentResidence] = useState('');
  const [requiredService, setRequiredService] = useState<'Visa Processing' | 'Consultation' | 'Document Assistance' | 'Full Package'>('Visa Processing');
  const [additionalInfo, setAdditionalInfo] = useState('');

  // Contact Info
  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // Auto pre-fill if logged in or initial country passed
  useEffect(() => {
    if (isOpen) {
      if (initialCountry) {
        setDestinationCountry(initialCountry);
      }
      if (user) {
        if (user.fullName) setCustomerName(user.fullName);
        if (user.email) setEmail(user.email);
      }
    }
  }, [user, isOpen, initialCountry]);

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [submittedQuote, setSubmittedQuote] = useState<VisaQuoteRequest | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const resetForm = () => {
    setStep(1);
    setDestinationCountry('');
    setVisaType('Tourist');
    setIntendedTravelDate('');
    setApplicantsCount(1);
    setApplicantNationality('');
    setPassportValidity('More than 6 months');
    setPreviousVisa('No');
    setPreviousRefusal('No');
    setCurrentResidence('');
    setRequiredService('Visa Processing');
    setAdditionalInfo('');
    setErrorMessage('');
    setSubmittedQuote(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const validateStep1 = () => {
    if (!destinationCountry.trim()) {
      setErrorMessage('Please enter your destination country.');
      return false;
    }
    if (!intendedTravelDate) {
      setErrorMessage('Please select your intended travel date.');
      return false;
    }
    setErrorMessage('');
    return true;
  };

  const validateStep2 = () => {
    if (!applicantNationality.trim()) {
      setErrorMessage('Please enter your nationality.');
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
      const response = await fetch('/api/quotes/visa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destinationCountry,
          visaType,
          intendedTravelDate,
          applicantsCount,
          applicantNationality,
          passportValidity,
          previousVisa,
          previousRefusal,
          currentResidence: currentResidence || applicantNationality,
          requiredService,
          additionalInfo,
          customerName,
          email,
          phone,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit visa quotation request.');
      }

      setSubmittedQuote(data.quote);
      setStep(4);
      if (onSuccessSubmitted) onSuccessSubmitted(data.quote);
    } catch (err: any) {
      console.error('Visa quote submission error:', err);
      setErrorMessage(err.message || 'An error occurred while submitting.');
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
      <div className="relative w-full max-w-2xl bg-slate-900 border border-teal-400/30 rounded-3xl shadow-2xl overflow-hidden my-8 text-slate-100">
        
        {/* Header */}
        <div className="relative px-6 py-5 bg-gradient-to-r from-teal-950/90 via-slate-900 to-sky-950/90 border-b border-teal-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-xl shadow-inner">
              🛂
            </div>
            <div>
              <h2 className="text-xl font-serif-display font-bold text-white tracking-tight">
                Visa Quotation & Guidance
              </h2>
              <p className="text-xs text-teal-200/80">
                Customized visa assistance, document checklists & processing fee quotes
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

        {/* Step Indicator */}
        {step < 4 && (
          <div className="px-6 pt-4 bg-slate-900/60 border-b border-white/5 flex items-center justify-between text-xs font-medium text-teal-200/70">
            <div className={`flex items-center gap-2 pb-2 border-b-2 transition-all ${step === 1 ? 'border-teal-400 text-teal-400 font-bold' : 'border-transparent'}`}>
              <span className="w-5 h-5 rounded-full bg-teal-500/20 flex items-center justify-center text-[10px]">1</span>
              <span>Destination & Visa</span>
            </div>
            <div className={`flex items-center gap-2 pb-2 border-b-2 transition-all ${step === 2 ? 'border-teal-400 text-teal-400 font-bold' : 'border-transparent'}`}>
              <span className="w-5 h-5 rounded-full bg-teal-500/20 flex items-center justify-center text-[10px]">2</span>
              <span>Applicant Profile</span>
            </div>
            <div className={`flex items-center gap-2 pb-2 border-b-2 transition-all ${step === 3 ? 'border-teal-400 text-teal-400 font-bold' : 'border-transparent'}`}>
              <span className="w-5 h-5 rounded-full bg-teal-500/20 flex items-center justify-center text-[10px]">3</span>
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

        <div className="p-6">
          {/* STEP 1: Destination & Visa Requirements */}
          {step === 1 && (
            <div className="space-y-5 animate-fade-in">
              {/* Destination Country */}
              <div>
                <label className="block text-xs font-semibold text-teal-200 mb-1">Destination Country *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Japan, Schengen Area (France), United Kingdom, UAE"
                  value={destinationCountry}
                  onChange={(e) => setDestinationCountry(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-800/80 border border-teal-300/20 text-white text-sm focus:outline-none focus:border-teal-400"
                />
              </div>

              {/* Visa Type */}
              <div>
                <label className="block text-xs font-semibold text-teal-200 mb-2 uppercase tracking-wider">
                  Visa Type *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(['Tourist', 'Business', 'Student', 'Transit', 'Medical', 'Other'] as const).map((vt) => (
                    <button
                      key={vt}
                      type="button"
                      onClick={() => setVisaType(vt)}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                        visaType === vt
                          ? 'bg-teal-500/20 border-teal-400 text-teal-300 shadow-md'
                          : 'bg-slate-800/50 border-white/10 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      {vt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Travel Date & Number of Applicants */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-teal-200 mb-1">Intended Travel Date *</label>
                  <input
                    type="date"
                    required
                    value={intendedTravelDate}
                    onChange={(e) => setIntendedTravelDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl bg-slate-800/80 border border-teal-300/20 text-white text-sm focus:outline-none focus:border-teal-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-teal-200 mb-1">Number of Applicants *</label>
                  <div className="flex items-center gap-3 p-1.5 bg-slate-800/80 rounded-2xl border border-teal-300/20">
                    <button
                      type="button"
                      onClick={() => setApplicantsCount(Math.max(1, applicantsCount - 1))}
                      className="w-8 h-8 rounded-xl bg-slate-700 hover:bg-slate-600 font-bold text-sm"
                    >
                      -
                    </button>
                    <span className="flex-1 text-center font-bold text-white text-sm">{applicantsCount} applicant(s)</span>
                    <button
                      type="button"
                      onClick={() => setApplicantsCount(applicantsCount + 1)}
                      className="w-8 h-8 rounded-xl bg-slate-700 hover:bg-slate-600 font-bold text-sm"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Required Service */}
              <div>
                <label className="block text-xs font-semibold text-teal-200 mb-2 uppercase tracking-wider">
                  Required Assistance Level *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(['Visa Processing', 'Consultation', 'Document Assistance', 'Full Package'] as const).map((srv) => (
                    <button
                      key={srv}
                      type="button"
                      onClick={() => setRequiredService(srv)}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        requiredService === srv
                          ? 'bg-teal-500/20 border-teal-400 text-teal-300 shadow-md'
                          : 'bg-slate-800/40 border-white/10 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div className="font-semibold text-xs">{srv}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {srv === 'Full Package' && 'End-to-end filing, appointments & documents'}
                        {srv === 'Visa Processing' && 'Form submission & Embassy application tracking'}
                        {srv === 'Consultation' && 'Expert eligibility assessment & strategy'}
                        {srv === 'Document Assistance' && 'Schengen/UK document preparation & translation'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Next Button */}
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    if (validateStep1()) setStep(2);
                  }}
                  className="px-6 py-3 rounded-2xl bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-teal-500/20 flex items-center gap-2"
                >
                  <span>Continue to Applicant Info</span>
                  <span className="material-symbols-outlined text-base">arrow_forward</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Background & Passport */}
          {step === 2 && (
            <div className="space-y-5 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-teal-200 mb-1">Applicant Nationality *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. United States, India, Philippines"
                    value={applicantNationality}
                    onChange={(e) => setApplicantNationality(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl bg-slate-800/80 border border-teal-300/20 text-white text-sm focus:outline-none focus:border-teal-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-teal-200 mb-1">Current Country of Residence</label>
                  <input
                    type="text"
                    placeholder="e.g. United States (same if left empty)"
                    value={currentResidence}
                    onChange={(e) => setCurrentResidence(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl bg-slate-800/80 border border-teal-300/20 text-white text-sm focus:outline-none focus:border-teal-400"
                  />
                </div>
              </div>

              {/* Passport Validity */}
              <div>
                <label className="block text-xs font-semibold text-teal-200 mb-1">Passport Validity *</label>
                <select
                  value={passportValidity}
                  onChange={(e) => setPassportValidity(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-800/80 border border-teal-300/20 text-white text-sm focus:outline-none focus:border-teal-400"
                >
                  <option value="More than 6 months">More than 6 months remaining</option>
                  <option value="3 to 6 months">3 to 6 months remaining</option>
                  <option value="Less than 3 months">Less than 3 months (Needs Renewal)</option>
                </select>
              </div>

              {/* Questions: Previous Visa & Refusals */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3 bg-slate-800/50 rounded-2xl border border-white/5 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-white">Previous Visa Held?</div>
                    <div className="text-[11px] text-slate-400">For this country or Schengen/US/UK</div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setPreviousVisa('Yes')}
                      className={`px-3 py-1 rounded-xl text-xs font-semibold ${previousVisa === 'Yes' ? 'bg-teal-500 text-white' : 'bg-slate-700 text-slate-300'}`}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviousVisa('No')}
                      className={`px-3 py-1 rounded-xl text-xs font-semibold ${previousVisa === 'No' ? 'bg-teal-500 text-white' : 'bg-slate-700 text-slate-300'}`}
                    >
                      No
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-slate-800/50 rounded-2xl border border-white/5 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-white">Previous Visa Refusal?</div>
                    <div className="text-[11px] text-slate-400">Any prior visa rejections</div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setPreviousRefusal('Yes')}
                      className={`px-3 py-1 rounded-xl text-xs font-semibold ${previousRefusal === 'Yes' ? 'bg-teal-500 text-white' : 'bg-slate-700 text-slate-300'}`}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviousRefusal('No')}
                      className={`px-3 py-1 rounded-xl text-xs font-semibold ${previousRefusal === 'No' ? 'bg-teal-500 text-white' : 'bg-slate-700 text-slate-300'}`}
                    >
                      No
                    </button>
                  </div>
                </div>
              </div>

              {/* Additional Notes */}
              <div>
                <label className="block text-xs font-semibold text-teal-200 mb-1">Additional Information (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Travel purpose details, invitation letter status, family members..."
                  value={additionalInfo}
                  onChange={(e) => setAdditionalInfo(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-800/80 border border-teal-300/20 text-white text-sm placeholder-slate-400 focus:outline-none focus:border-teal-400"
                />
              </div>

              {/* Navigation */}
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
                  className="px-6 py-3 rounded-2xl bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-teal-500/20 flex items-center gap-2"
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
              <div className="p-3 bg-teal-950/40 border border-teal-400/20 rounded-2xl text-xs text-teal-200">
                <span className="font-semibold text-white">Summary: </span>
                {destinationCountry} ({visaType} Visa) • {applicantsCount} Applicant(s) ({applicantNationality}) • Service: {requiredService}
              </div>

              <div>
                <label className="block text-xs font-semibold text-teal-200 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sarah Jenkins"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-800/80 border border-teal-300/20 text-white text-sm focus:outline-none focus:border-teal-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-teal-200 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. sarah@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-800/80 border border-teal-300/20 text-white text-sm focus:outline-none focus:border-teal-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-teal-200 mb-1">WhatsApp / Phone Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. +1 (555) 987-6543"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-800/80 border border-teal-300/20 text-white text-sm focus:outline-none focus:border-teal-400"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Our visa specialists will review your requirements and provide document guidance via WhatsApp or Email.
                </span>
              </div>

              {/* Submit Buttons */}
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
                  className="px-7 py-3 rounded-2xl bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-300 hover:to-emerald-300 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-teal-500/25 flex items-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Visa Quote Request</span>
                      <span className="material-symbols-outlined text-base">send</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* STEP 4: Success Display */}
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
                  Visa Request Submitted, {submittedQuote.customerName}!
                </h3>
                <p className="text-sm text-slate-300 max-w-md mx-auto mt-1">
                  Our visa consultants have received your application details for {submittedQuote.destinationCountry}.
                </p>
              </div>

              {/* Request ID Box */}
              <div className="p-4 bg-slate-800/90 border border-teal-400/30 rounded-2xl max-w-md mx-auto text-left flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Visa Request ID</div>
                  <div className="text-lg font-mono font-bold text-teal-300">{submittedQuote.id}</div>
                </div>
                <button
                  type="button"
                  onClick={handleCopyId}
                  className="px-3 py-1.5 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 border border-teal-400/30 text-teal-300 text-xs font-semibold transition-all flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">{copied ? 'done' : 'content_copy'}</span>
                  <span>{copied ? 'Copied!' : 'Copy ID'}</span>
                </button>
              </div>

              {/* Summary */}
              <div className="p-4 bg-slate-800/40 rounded-2xl border border-white/5 text-xs text-left max-w-md mx-auto space-y-1.5 text-slate-300">
                <div><strong className="text-slate-100">Destination & Visa:</strong> {submittedQuote.destinationCountry} ({submittedQuote.visaType})</div>
                <div><strong className="text-slate-100">Travel Date:</strong> {submittedQuote.intendedTravelDate} • {submittedQuote.applicantsCount} Applicant(s)</div>
                <div><strong className="text-slate-100">Service:</strong> {submittedQuote.requiredService}</div>
                <div><strong className="text-slate-100">Contact:</strong> {submittedQuote.email} ({submittedQuote.phone})</div>
              </div>

              <div className="pt-2 flex justify-center">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-8 py-3 rounded-2xl bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold text-sm transition-all shadow-lg"
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
