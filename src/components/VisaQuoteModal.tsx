import React, { useState, useEffect, useMemo } from 'react';
import { VisaQuoteRequest } from '../types';
import { useAuth } from '../context/AuthContext';
import { getVisaRequirement, OFFICIAL_VISA_REQUIREMENTS } from '../data/visaRequirementsData';

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
  const { user, openAuthModal, showToast } = useAuth();

  // Form Steps: 1 = Destination & Travel, 2 = Background & Service, 3 = Contact, 4 = Success
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form Fields
  const [destinationCountry, setDestinationCountry] = useState(initialCountry || 'Malaysia');
  const [visaType, setVisaType] = useState<'Tourist' | 'Business' | 'Student' | 'Transit' | 'Medical' | 'Other'>('Tourist');
  const [intendedTravelDate, setIntendedTravelDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split('T')[0];
  });
  const [applicantsCount, setApplicantsCount] = useState<number>(1);
  const [applicantNationality, setApplicantNationality] = useState('Bangladeshi');
  const [passportValidity, setPassportValidity] = useState('More than 6 months');
  const [previousVisa, setPreviousVisa] = useState<'Yes' | 'No'>('No');
  const [previousRefusal, setPreviousRefusal] = useState<'Yes' | 'No'>('No');
  const [currentResidence, setCurrentResidence] = useState('Bangladesh');
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
  const [activeOccupationTab, setActiveOccupationTab] = useState<'all' | 'business' | 'job' | 'student'>('all');
  const [showAllPricesTable, setShowAllPricesTable] = useState(false);
  const [priceSearchQuery, setPriceSearchQuery] = useState('');

  // Match official requirement data for selected country & visa type
  const activeVisaReq = useMemo(() => {
    return getVisaRequirement(destinationCountry, visaType);
  }, [destinationCountry, visaType]);

  if (!isOpen) return null;

  const resetForm = () => {
    setStep(1);
    setDestinationCountry(initialCountry || 'Malaysia');
    setVisaType('Tourist');
    const d = new Date();
    d.setDate(d.getDate() + 30);
    setIntendedTravelDate(d.toISOString().split('T')[0]);
    setApplicantsCount(1);
    setApplicantNationality('Bangladeshi');
    setPassportValidity('More than 6 months');
    setPreviousVisa('No');
    setPreviousRefusal('No');
    setCurrentResidence('Bangladesh');
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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/85 backdrop-blur-md animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div className="relative w-full max-w-2xl max-h-[92vh] sm:max-h-[88vh] bg-slate-900 border border-teal-400/30 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        
        {/* Fixed Header */}
        <div className="shrink-0 relative px-5 sm:px-6 py-4 bg-gradient-to-r from-teal-950/90 via-slate-900 to-sky-950/90 border-b border-teal-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-xl shadow-inner shrink-0">
              🛂
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-serif-display font-bold text-white tracking-tight">
                Visa Quotation & Guidance
              </h2>
              <p className="text-[11px] sm:text-xs text-teal-200/80">
                Customized visa assistance, document checklists & fee quotes
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="p-2 sm:px-3 sm:py-1.5 rounded-2xl bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition-all border border-white/10 flex items-center gap-1.5 text-xs font-bold cursor-pointer shrink-0"
            title="Close Modal & Return to Website"
          >
            <span className="hidden sm:inline">Close</span>
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Fixed Step Indicator */}
        {step < 4 && (
          <div className="shrink-0 px-5 sm:px-6 py-3 bg-slate-900/95 border-b border-white/5 flex items-center justify-between text-xs font-medium text-teal-200/70 overflow-x-auto">
            <button
              type="button"
              onClick={() => setStep(1)}
              className={`flex items-center gap-2 pb-1 border-b-2 transition-all cursor-pointer shrink-0 ${step === 1 ? 'border-teal-400 text-teal-400 font-bold' : 'border-transparent hover:text-white'}`}
            >
              <span className="w-5 h-5 rounded-full bg-teal-500/20 flex items-center justify-center text-[10px]">1</span>
              <span>Destination & Visa</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (validateStep1()) setStep(2);
              }}
              className={`flex items-center gap-2 pb-1 border-b-2 transition-all cursor-pointer shrink-0 ${step === 2 ? 'border-teal-400 text-teal-400 font-bold' : 'border-transparent hover:text-white'}`}
            >
              <span className="w-5 h-5 rounded-full bg-teal-500/20 flex items-center justify-center text-[10px]">2</span>
              <span>Applicant Profile</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (validateStep1() && validateStep2()) setStep(3);
              }}
              className={`flex items-center gap-2 pb-1 border-b-2 transition-all cursor-pointer shrink-0 ${step === 3 ? 'border-teal-400 text-teal-400 font-bold' : 'border-transparent hover:text-white'}`}
            >
              <span className="w-5 h-5 rounded-full bg-teal-500/20 flex items-center justify-center text-[10px]">3</span>
              <span>Contact Details</span>
            </button>
          </div>
        )}

        {/* Error Banner */}
        {errorMessage && (
          <div className="shrink-0 mx-5 sm:mx-6 mt-3 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
            <span className="material-symbols-outlined text-base text-red-400">error</span>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Scrollable Form Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6">
          {/* STEP 1: Destination & Visa Requirements */}
          {step === 1 && (
            <div className="space-y-5 animate-fade-in">
              {/* Destination Country */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-semibold text-teal-200">Destination Country *</label>
                  <button
                    type="button"
                    onClick={() => setShowAllPricesTable(true)}
                    className="text-[11px] text-amber-300 hover:text-amber-200 bg-amber-500/10 hover:bg-amber-500/20 px-2.5 py-1 rounded-full border border-amber-500/30 font-bold flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <span>💵</span>
                    <span>View All Visa Prices Directory</span>
                  </button>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
                  <select
                    value={destinationCountry}
                    onChange={(e) => {
                      setDestinationCountry(e.target.value);
                      setErrorMessage('');
                    }}
                    className="w-full px-4 py-2.5 rounded-2xl bg-slate-800/80 border border-teal-300/20 text-white text-sm focus:outline-none focus:border-teal-400 cursor-pointer"
                  >
                    <option value="">Select Popular Country...</option>
                    <option value="Malaysia">Malaysia (E-Visa - BDT 6,000)</option>
                    <option value="Thailand">Thailand (E-Visa / Sticker - BDT 7,000)</option>
                    <option value="China">China (Sticker Visa - BDT 10,000)</option>
                    <option value="Singapore">Singapore (E-Visa - BDT 6,000)</option>
                    <option value="India">India (Medical / Tourist - BDT 2,000)</option>
                    <option value="Sri Lanka">Sri Lanka (ETA / E-Visa - BDT 7,500)</option>
                    <option value="Indonesia">Indonesia (Sticker / E-Visa - BDT 23,000)</option>
                    <option value="United Arab Emirates (Dubai)">Dubai / UAE (30-Day E-Visa - BDT 11,500)</option>
                    <option value="Vietnam">Vietnam (E-Visa - BDT 5,500)</option>
                    <option value="Japan">Japan (Sticker Visa - BDT 4,500)</option>
                    <option value="Maldives">Maldives (Visa on Arrival - Free)</option>
                    <option value="Nepal">Nepal (Visa on Arrival - Free)</option>
                    <option value="Saudi Arabia">Saudi Arabia (Umrah / Tourist)</option>
                    <option value="Turkey">Turkey (E-Visa / Sticker)</option>
                  </select>

                  <input
                    type="text"
                    required
                    placeholder="Or type custom country..."
                    value={destinationCountry}
                    onChange={(e) => {
                      setDestinationCountry(e.target.value);
                      setErrorMessage('');
                    }}
                    className="w-full px-4 py-2.5 rounded-2xl bg-slate-800/80 border border-teal-300/20 text-white text-sm focus:outline-none focus:border-teal-400"
                  />
                </div>

                {/* Quick Country Selector Chips */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {['Malaysia', 'Thailand', 'China', 'Singapore', 'India', 'Sri Lanka', 'Indonesia', 'Dubai', 'Vietnam', 'Japan'].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => {
                        setDestinationCountry(c);
                        setErrorMessage('');
                      }}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                        destinationCountry.toLowerCase().includes(c.toLowerCase()) || c.toLowerCase().includes(destinationCountry.toLowerCase()) && destinationCountry.length > 2
                          ? 'bg-teal-400 text-slate-950 font-bold shadow-md'
                          : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-white/10'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Official Visa Requirement Card Preview */}
              {activeVisaReq && (
                <div className="p-4 rounded-2xl bg-gradient-to-br from-teal-950/60 via-slate-900 to-slate-950 border border-teal-400/30 shadow-xl space-y-3 animate-fade-in">
                  <div className="flex items-center justify-between border-b border-teal-500/20 pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">📋</span>
                      <div>
                        <h4 className="text-sm font-serif-display font-bold text-white flex items-center gap-1.5">
                          <span>{activeVisaReq.country}</span>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/30">
                            {activeVisaReq.entryType}
                          </span>
                        </h4>
                        <div className="text-[11px] text-teal-200/80">
                          Official Embassy Visa Checklist & Solvency Rules
                        </div>
                      </div>
                    </div>

                    {activeVisaReq.validity && (
                      <span className="text-[11px] font-semibold text-emerald-300 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                        {activeVisaReq.validity}
                      </span>
                    )}
                  </div>

                  {/* Visa Fee & Price Breakdown Box */}
                  {(activeVisaReq.embassyFeeBDT || activeVisaReq.totalEstimatedBDT) && (
                    <div className="p-3 rounded-xl bg-slate-950/80 border border-teal-500/30 space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-bold text-teal-300">
                        <span className="flex items-center gap-1">
                          <span>🏷️</span>
                          <span>Estimated Visa Pricing Breakdown</span>
                        </span>
                        <span className="text-emerald-400 text-sm font-extrabold">{activeVisaReq.totalEstimatedBDT}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-[11px] pt-1 border-t border-white/10">
                        <div>
                          <span className="text-slate-400 block">Embassy Fee:</span>
                          <span className="font-semibold text-slate-200">{activeVisaReq.embassyFeeBDT || 'Included'}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block">Agency Processing:</span>
                          <span className="font-semibold text-slate-200">{activeVisaReq.serviceChargeBDT || 'BDT 1,500'}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block">Total Est. Price:</span>
                          <span className="font-bold text-teal-300">{activeVisaReq.totalEstimatedBDT}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Highlights Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
                    {activeVisaReq.processingTime && (
                      <div className="p-2 rounded-xl bg-slate-800/70 border border-white/5 space-y-0.5">
                        <div className="text-slate-400">Processing Time</div>
                        <div className="font-semibold text-amber-300">{activeVisaReq.processingTime}</div>
                      </div>
                    )}
                    {activeVisaReq.minBankBalance && (
                      <div className="p-2 rounded-xl bg-slate-800/70 border border-white/5 space-y-0.5">
                        <div className="text-slate-400">Min Bank Balance</div>
                        <div className="font-semibold text-emerald-300">{activeVisaReq.minBankBalance}</div>
                      </div>
                    )}
                    {activeVisaReq.photoSpec && (
                      <div className="p-2 rounded-xl bg-slate-800/70 border border-white/5 space-y-0.5 col-span-2 sm:col-span-1">
                        <div className="text-slate-400">Photo Format</div>
                        <div className="font-semibold text-sky-300 truncate" title={activeVisaReq.photoSpec}>
                          {activeVisaReq.photoSpec}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Occupation Tabs for Checklist */}
                  {activeVisaReq.occupationRequirements && (
                    <div className="pt-1">
                      <div className="text-[11px] font-semibold text-teal-200 mb-1.5">Filter Requirements by Occupation:</div>
                      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                        <button
                          type="button"
                          onClick={() => setActiveOccupationTab('all')}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                            activeOccupationTab === 'all'
                              ? 'bg-teal-400 text-slate-950'
                              : 'bg-slate-800 text-slate-300 hover:text-white'
                          }`}
                        >
                          All General Docs
                        </button>
                        {activeVisaReq.occupationRequirements.businessPerson && (
                          <button
                            type="button"
                            onClick={() => setActiveOccupationTab('business')}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                              activeOccupationTab === 'business'
                                ? 'bg-teal-400 text-slate-950'
                                : 'bg-slate-800 text-slate-300 hover:text-white'
                            }`}
                          >
                            Business Person
                          </button>
                        )}
                        {activeVisaReq.occupationRequirements.jobHolder && (
                          <button
                            type="button"
                            onClick={() => setActiveOccupationTab('job')}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                              activeOccupationTab === 'job'
                                ? 'bg-teal-400 text-slate-950'
                                : 'bg-slate-800 text-slate-300 hover:text-white'
                            }`}
                          >
                            Job Holder
                          </button>
                        )}
                        {activeVisaReq.occupationRequirements.student && (
                          <button
                            type="button"
                            onClick={() => setActiveOccupationTab('student')}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                              activeOccupationTab === 'student'
                                ? 'bg-teal-400 text-slate-950'
                                : 'bg-slate-800 text-slate-300 hover:text-white'
                            }`}
                          >
                            Student / Minor
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Checklist List */}
                  <div className="space-y-1 pt-1 max-h-52 overflow-y-auto pr-1 text-xs">
                    {/* General Requirements always shown */}
                    {activeVisaReq.generalRequirements.map((req, i) => (
                      <div key={`gen-${i}`} className="flex items-start gap-2 p-1.5 rounded-lg bg-slate-800/40 text-slate-200">
                        <span className="text-teal-400 mt-0.5">•</span>
                        <span>{req}</span>
                      </div>
                    ))}

                    {/* Business Person Specific */}
                    {(activeOccupationTab === 'business' || activeOccupationTab === 'all') && activeVisaReq.occupationRequirements?.businessPerson?.map((req, i) => (
                      <div key={`biz-${i}`} className="flex items-start gap-2 p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-200">
                        <span className="text-amber-400 font-bold mt-0.5">[Business]</span>
                        <span>{req}</span>
                      </div>
                    ))}

                    {/* Job Holder Specific */}
                    {(activeOccupationTab === 'job' || activeOccupationTab === 'all') && activeVisaReq.occupationRequirements?.jobHolder?.map((req, i) => (
                      <div key={`job-${i}`} className="flex items-start gap-2 p-1.5 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-200">
                        <span className="text-sky-400 font-bold mt-0.5">[Job Holder]</span>
                        <span>{req}</span>
                      </div>
                    ))}

                    {/* Student Specific */}
                    {(activeOccupationTab === 'student' || activeOccupationTab === 'all') && activeVisaReq.occupationRequirements?.student?.map((req, i) => (
                      <div key={`stud-${i}`} className="flex items-start gap-2 p-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-200">
                        <span className="text-purple-400 font-bold mt-0.5">[Student]</span>
                        <span>{req}</span>
                      </div>
                    ))}
                  </div>

                  {/* Important Notes */}
                  {activeVisaReq.notes && activeVisaReq.notes.length > 0 && (
                    <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-200 space-y-1">
                      <div className="font-bold flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs text-amber-400">info</span>
                        <span>Important Embassy Note:</span>
                      </div>
                      {activeVisaReq.notes.map((n, idx) => (
                        <p key={idx}>• {n}</p>
                      ))}
                    </div>
                  )}
                </div>
              )}

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

              {/* Step 1 Actions */}
              <div className="pt-3 flex items-center justify-between gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-5 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">arrow_back</span>
                  <span>Back / Exit</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (validateStep1()) setStep(2);
                  }}
                  className="px-6 py-3 rounded-2xl bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-teal-500/20 flex items-center gap-2 cursor-pointer"
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
                    placeholder="e.g. Bangladeshi, Indian, American"
                    value={applicantNationality}
                    onChange={(e) => {
                      setApplicantNationality(e.target.value);
                      setErrorMessage('');
                    }}
                    className="w-full px-4 py-2.5 rounded-2xl bg-slate-800/80 border border-teal-300/20 text-white text-sm focus:outline-none focus:border-teal-400 mb-2"
                  />
                  <div className="flex flex-wrap gap-1">
                    {['Bangladeshi', 'Indian', 'American', 'British', 'Canadian', 'Malaysian'].map((nat) => (
                      <button
                        key={nat}
                        type="button"
                        onClick={() => {
                          setApplicantNationality(nat);
                          setErrorMessage('');
                        }}
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium transition-all cursor-pointer ${
                          applicantNationality.toLowerCase() === nat.toLowerCase()
                            ? 'bg-teal-400 text-slate-950 font-bold'
                            : 'bg-slate-800 text-slate-300 hover:text-white border border-white/10'
                        }`}
                      >
                        {nat}
                      </button>
                    ))}
                  </div>
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
                  className="w-full px-4 py-3 rounded-2xl bg-slate-800/80 border border-teal-300/20 text-white text-sm focus:outline-none focus:border-teal-400 min-h-[44px]"
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
                  className="w-full px-4 py-3 rounded-2xl bg-slate-800/80 border border-teal-300/20 text-white text-sm focus:outline-none focus:border-teal-400 min-h-[44px]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-teal-200 mb-1">WhatsApp / Phone Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. +880 1851-172032"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-800/80 border border-teal-300/20 text-white text-sm focus:outline-none focus:border-teal-400 min-h-[44px]"
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
                  className="px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all min-h-[44px]"
                >
                  Back
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-300 hover:to-emerald-300 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-teal-500/25 flex items-center gap-2 disabled:opacity-50 min-h-[44px] cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                      <span>Sending Request...</span>
                    </>
                  ) : (
                    <>
                      <span>Send My Quote</span>
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

              {/* Post-Quote Prompt: Want to track this quote? Create an account */}
              {!user && (
                <div className="p-4 bg-gradient-to-r from-teal-500/15 via-slate-800/80 to-emerald-500/15 border border-teal-400/40 rounded-2xl max-w-md mx-auto text-left flex flex-col gap-3 shadow-lg">
                  <div className="flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-teal-400/20 border border-teal-400/40 flex items-center justify-center text-teal-300 shrink-0 text-base">
                      🔔
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-teal-300">Want to track this visa quote?</h4>
                      <p className="text-[11px] text-slate-200 mt-0.5 leading-snug">
                        Create an account to save your visa application request and receive real-time document verification updates.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      handleClose();
                      openAuthModal('register');
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-300 hover:to-emerald-300 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">person_add</span>
                    <span>Sign Up to Track Status</span>
                  </button>
                </div>
              )}

              <div className="pt-2 flex justify-center">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-8 py-3 rounded-2xl bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold text-sm transition-all shadow-lg min-h-[44px] cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ALL DESTINATIONS VISA PRICES DIRECTORY OVERLAY MODAL */}
      {showAllPricesTable && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-lg animate-fade-in">
          <div className="relative w-full max-w-4xl max-h-[85vh] bg-slate-900 border border-teal-400/40 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
            {/* Header */}
            <div className="p-5 bg-gradient-to-r from-teal-950 via-slate-900 to-sky-950 border-b border-teal-500/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-xl">
                  💵
                </div>
                <div>
                  <h3 className="text-lg font-serif-display font-bold text-white flex items-center gap-2">
                    <span>Official Visa Fee & Price Directory</span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/30">
                      2026 Embassy Rates
                    </span>
                  </h3>
                  <p className="text-xs text-teal-200/80">
                    Standard Embassy Fees, Agency Processing Charges & Total Estimated Prices for Bangladeshi Applicants
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowAllPricesTable(false)}
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            {/* Search Filter Bar */}
            <div className="p-4 bg-slate-950/60 border-b border-white/5 flex items-center justify-between gap-4">
              <div className="relative flex-1">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
                <input
                  type="text"
                  placeholder="Search destination country or visa type..."
                  value={priceSearchQuery}
                  onChange={(e) => setPriceSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-800/80 border border-teal-300/20 text-white text-xs focus:outline-none focus:border-teal-400"
                />
              </div>
              <span className="text-xs text-slate-400 font-medium whitespace-nowrap">
                Showing {OFFICIAL_VISA_REQUIREMENTS.filter(v => !priceSearchQuery || v.country.toLowerCase().includes(priceSearchQuery.toLowerCase()) || v.visaType.toLowerCase().includes(priceSearchQuery.toLowerCase())).length} Visas
              </span>
            </div>

            {/* Table Content */}
            <div className="p-4 overflow-y-auto flex-1 space-y-3">
              <div className="overflow-x-auto rounded-2xl border border-white/10 bg-slate-950/40">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-800/80 text-teal-200 text-[11px] font-bold uppercase tracking-wider border-b border-white/10">
                    <tr>
                      <th className="p-3.5">Country & Visa Type</th>
                      <th className="p-3.5">Processing Time</th>
                      <th className="p-3.5">Min Bank Balance</th>
                      <th className="p-3.5">Embassy Fee</th>
                      <th className="p-3.5">Agency Fee</th>
                      <th className="p-3.5 text-right">Est. Total Price</th>
                      <th className="p-3.5 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-sans">
                    {OFFICIAL_VISA_REQUIREMENTS.filter((v) => {
                      const q = priceSearchQuery.toLowerCase().trim();
                      return !q || v.country.toLowerCase().includes(q) || v.visaType.toLowerCase().includes(q) || v.entryType.toLowerCase().includes(q);
                    }).map((req) => (
                      <tr key={req.id} className="hover:bg-slate-800/50 transition-colors">
                        <td className="p-3.5">
                          <div className="font-bold text-white text-sm">{req.country}</div>
                          <div className="text-[11px] text-teal-300 font-medium">{req.entryType}</div>
                        </td>
                        <td className="p-3.5 text-amber-300 font-medium">
                          {req.processingTime || '3–5 Working Days'}
                        </td>
                        <td className="p-3.5 text-emerald-300 font-medium">
                          {req.minBankBalance || 'Standard'}
                        </td>
                        <td className="p-3.5 text-slate-300">
                          {req.embassyFeeBDT || 'Included'}
                        </td>
                        <td className="p-3.5 text-slate-300">
                          {req.serviceChargeBDT || 'BDT 1,500'}
                        </td>
                        <td className="p-3.5 text-right">
                          <span className="font-extrabold text-teal-300 text-sm px-2.5 py-1 rounded-xl bg-teal-500/10 border border-teal-400/20 inline-block">
                            {req.totalEstimatedBDT || 'Quote Required'}
                          </span>
                        </td>
                        <td className="p-3.5 text-center">
                          <button
                            type="button"
                            onClick={() => {
                              setDestinationCountry(req.country);
                              setVisaType(req.visaType);
                              setShowAllPricesTable(false);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold text-xs transition-all shadow-md cursor-pointer"
                          >
                            Select
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Note banner */}
              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-400 text-base">info</span>
                <span>
                  All visa fees are estimated in Bangladeshi Taka (BDT) based on standard Embassy & Government exchange rates. Final price quotes are verified upon submitting document details.
                </span>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-950 border-t border-white/10 flex justify-end">
              <button
                onClick={() => setShowAllPricesTable(false)}
                className="px-6 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-all"
              >
                Close Directory
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
