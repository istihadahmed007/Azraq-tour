import React, { useState, useMemo } from 'react';
import {
  ShieldCheck,
  FileText,
  Briefcase,
  AlertCircle,
  Sparkles,
  Printer,
} from 'lucide-react';
import {
  OFFICIAL_VISA_REQUIREMENTS,
  getVisaRequirement,
  getVisaFeeForDestination,
} from '../data/visaRequirementsData';

export type ProfessionType =
  | 'Private Job Holder'
  | 'Govt Employee / GO Holder'
  | 'Business Owner / Entrepreneur'
  | 'Student'
  | 'Doctor / Medical Professional'
  | 'Housewife / Dependent'
  | 'Freelancer / IT Contractor'
  | 'Retired Person';

interface GuidedVisaAssistantProps {
  onOpenVisaQuoteModal?: (country: string, profession?: string) => void;
}

export const GuidedVisaAssistant: React.FC<GuidedVisaAssistantProps> = ({
  onOpenVisaQuoteModal,
}) => {
  const [selectedCountry, setSelectedCountry] = useState<string>('Malaysia');
  const [selectedProfession, setSelectedProfession] = useState<ProfessionType>('Private Job Holder');
  const [checkedDocs, setCheckedDocs] = useState<Record<string, boolean>>({});

  const countriesList = useMemo(() => {
    const uniqueCountries = Array.from(
      new Set(OFFICIAL_VISA_REQUIREMENTS.map((r) => r.country))
    );
    return uniqueCountries.sort();
  }, []);

  const activeVisaReq = useMemo(() => {
    return getVisaRequirement(selectedCountry, 'Tourist');
  }, [selectedCountry]);

  // Profession-specific documents logic for Bangladeshi travelers
  const professionSpecificDocs = useMemo(() => {
    switch (selectedProfession) {
      case 'Private Job Holder':
        return [
          { id: 'noc', title: 'No Objection Certificate (NOC) / Leave Letter', desc: 'On official company letterhead signed by HR/Director with contact phone & official seal', mandatory: true },
          { id: 'visiting_card', title: 'Official Visiting Card & Company ID Card copy', desc: 'Original physical card and photocopied office badge', mandatory: true },
          { id: 'salary_statement', title: 'Salary Bank Account Statement & Certificate', desc: 'Last 6 months salary bank statement and last 3 months pay slips (if applicable)', mandatory: true },
          { id: 'tin', title: 'Personal e-TIN Certificate & Tax Return Acknowledgement', desc: 'Copy of last financial year income tax return submission slip', mandatory: false },
        ];
      case 'Govt Employee / GO Holder':
        return [
          { id: 'go_letter', title: 'Official Government Order (GO) or Note Verbale', desc: 'Original printed copy of approved Government Order with English translation', mandatory: true },
          { id: 'noc_govt', title: 'Departmental Clearance NOC', desc: 'No Objection Certificate from the relevant Ministry or Directorate', mandatory: true },
          { id: 'official_id', title: 'Government Official ID Card Copy', desc: 'Service ID card photocopy attested by supervising authority', mandatory: true },
          { id: 'pension_pay', title: 'Pay Slip / Salary Statement', desc: 'Last 3-6 months official pay slips showing government treasury payroll', mandatory: true },
        ];
      case 'Business Owner / Entrepreneur':
        return [
          { id: 'trade_license', title: 'Updated Trade License (English Translated & Notarized)', desc: 'Valid trade license with municipality/city corporation renewal stamp', mandatory: true },
          { id: 'company_pad', title: 'Company Letterhead Pad & Business Visiting Card', desc: 'Two blank original letterhead pads and director visiting card for embassy application', mandatory: true },
          { id: 'tin_tax', title: 'Company TIN & VAT Certificate', desc: 'Income tax certificate and corporate VAT registration documents', mandatory: true },
          { id: 'company_bank', title: 'Company Bank Statement & Solvency Certificate', desc: 'Last 6 months company bank statement showing adequate cash flow with bank seal & signature', mandatory: true },
          { id: 'incorporation', title: 'Memorandum of Association & Form XII (for Ltd companies)', desc: 'Photocopy of RJSC incorporation certificate', mandatory: false },
        ];
      case 'Student':
        return [
          { id: 'student_id', title: 'Valid Student ID Card Copy', desc: 'Photocopy of current school, college, or university ID card', mandatory: true },
          { id: 'leave_letter_inst', title: 'Leave Clearance / Student Bonafide Certificate', desc: 'Signed letter from Headmaster/Principal/Registrar permitting absence', mandatory: true },
          { id: 'sponsor_fin', title: 'Sponsor (Parent) Financial Guarantee Affidavit', desc: 'Consent declaration letter stating financial coverage for the entire trip', mandatory: true },
          { id: 'parent_bank', title: 'Parent 6-Month Bank Statement & Solvency', desc: 'Sponsor bank balance and employment proof (NOC/Trade License)', mandatory: true },
        ];
      case 'Doctor / Medical Professional':
        return [
          { id: 'bmdc', title: 'BMDC Registration Certificate Copy', desc: 'Bangladesh Medical and Dental Council registration card/certificate copy', mandatory: true },
          { id: 'hospital_noc', title: 'Hospital / Clinic Employment NOC or Chamber Letterhead', desc: 'Clearance from medical superintendent or personal chamber visiting card', mandatory: true },
          { id: 'bank_doc', title: 'Personal Bank Statement (6 Months) & Solvency', desc: 'Original bank statement with minimum closing balance requirement', mandatory: true },
        ];
      case 'Housewife / Dependent':
        return [
          { id: 'marriage_cert', title: 'Marriage Certificate (Nikahnama) with English Translation', desc: 'Notarized marriage certificate copy (attested by Ministry if required)', mandatory: true },
          { id: 'husband_noc', title: 'Husband/Sponsor Financial Sponsorship Letter', desc: 'Signed declaration undertaking all travel & medical expenses', mandatory: true },
          { id: 'husband_docs', title: 'Sponsor Job/Business Proof + Bank Statement', desc: 'Husband NOC / Trade license and 6-month bank statement', mandatory: true },
        ];
      case 'Freelancer / IT Contractor':
        return [
          { id: 'marketplace_proof', title: 'Upwork / Fiverr / Remote Contract Agreement', desc: 'Digital profile screenshot, earnings certificate, or client retainer contract', mandatory: true },
          { id: 'freelance_bank', title: 'Foreign Inward Remittance Bank Certificate (FIRC)', desc: 'Bank statement highlighting regular inward remittances from international gateways (Payoneer, Wise, Wire)', mandatory: true },
          { id: 'itin_freelance', title: 'Personal e-TIN & Tax Return Acknowledgment', desc: 'Proof of tax file declaration in Bangladesh', mandatory: true },
        ];
      case 'Retired Person':
        return [
          { id: 'retirement_doc', title: 'Retirement Letter / Pension Book Copy', desc: 'Proof of retired service from government or corporate employer', mandatory: true },
          { id: 'pension_bank', title: 'Pension Account Bank Statement (6 Months)', desc: 'Official bank statement reflecting regular pension deposits or savings account balance', mandatory: true },
        ];
    }
  }, [selectedProfession]);

  // General Mandatory Documents across all profiles
  const generalMandatoryDocs = useMemo(() => [
    { id: 'passport', title: 'Original Machine Readable / E-Passport', desc: 'Must have at least 6 months validity from departure date & minimum 2 blank pages', mandatory: true },
    { id: 'photo', title: 'Recent Passport-size Color Photographs (2 Copies)', desc: activeVisaReq?.photoSpec || '35mm x 50mm, white matte background, 80% face view, no spectacles/white clothes', mandatory: true },
    { id: 'bank_solvency', title: 'Personal Bank Statement & Bank Solvency Certificate', desc: `Original 6-month statement with official bank stamp & seal. Minimum closing balance: ${activeVisaReq?.minBankBalance || '৳ 1,00,000 to ৳ 1,50,000 per person'}`, mandatory: true },
    { id: 'nid', title: 'National ID (NID) or Digital Birth Certificate Copy', desc: 'Photocopy of smart NID card', mandatory: true },
    { id: 'tickets_hotel', title: 'Round-trip Air Ticket Itinerary & Confirmed Hotel Voucher', desc: 'Flight booking reservation (Azraq Tours provides verified dummy bookings for visa)', mandatory: true },
  ], [activeVisaReq]);

  const totalRequiredCount = generalMandatoryDocs.length + professionSpecificDocs.length;
  const completedCount = Object.values(checkedDocs).filter(Boolean).length;
  const completionPercentage = Math.min(100, Math.round((completedCount / totalRequiredCount) * 100));

  const toggleDocCheck = (id: string) => {
    setCheckedDocs((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handlePrintChecklist = () => {
    window.print();
  };

  return (
    <div className="w-full flex flex-col gap-6" id="guided-visa-assistant">
      {/* Top Banner with Trust Metrics */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-sky-400/30 shadow-2xl bg-gradient-to-r from-slate-900 via-sky-950/80 to-slate-900 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/40 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-teal-400" />
            <span>Bangladeshi Passport Visa Intelligence</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif-display font-extrabold text-white tracking-tight">
            Guided Visa Checklist Assistant
          </h2>
          <p className="text-xs sm:text-sm text-sky-100/80 leading-relaxed">
            Generate customized, profession-specific Embassy & E-Visa document checklists tailored for Bangladeshi passport holders. Eliminate rejection risks with official pre-check vetting.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <button
            onClick={handlePrintChecklist}
            className="px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-sky-200 border border-sky-400/30 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            <Printer className="w-4 h-4" />
            <span>Print Checklist</span>
          </button>

          <button
            onClick={() => onOpenVisaQuoteModal?.(selectedCountry, selectedProfession)}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-300 hover:to-emerald-300 text-slate-950 font-extrabold text-xs sm:text-sm transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            <Sparkles className="w-4 h-4" />
            <span>Get Official Visa Quote</span>
          </button>
        </div>
      </div>

      {/* Selectors: Country & Profession Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Country Selector */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-sky-400/25 space-y-2.5 shadow-lg">
          <label className="text-xs font-bold uppercase tracking-wider text-sky-300 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-teal-400" />
            <span>1. Select Destination Country</span>
          </label>
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-slate-800 text-white font-bold text-sm border border-slate-700 focus:outline-none focus:border-sky-400 cursor-pointer"
          >
            {countriesList.map((country) => (
              <option key={country} value={country}>
                {country} ({getVisaFeeForDestination(country)})
              </option>
            ))}
          </select>

          <div className="pt-2 flex flex-wrap items-center justify-between text-xs text-slate-300">
            <span>Processing Time: <strong className="text-white">{activeVisaReq?.processingTime || '3-7 Working Days'}</strong></span>
            <span>Fee: <strong className="text-emerald-400 font-mono">{activeVisaReq?.totalEstimatedBDT || getVisaFeeForDestination(selectedCountry)}</strong></span>
          </div>
        </div>

        {/* Profession Selector */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-sky-400/25 space-y-2.5 shadow-lg">
          <label className="text-xs font-bold uppercase tracking-wider text-sky-300 flex items-center gap-1.5">
            <Briefcase className="w-4 h-4 text-amber-400" />
            <span>2. Select Your Profession / Profile</span>
          </label>
          <select
            value={selectedProfession}
            onChange={(e) => setSelectedProfession(e.target.value as ProfessionType)}
            className="w-full px-4 py-3 rounded-xl bg-slate-800 text-white font-bold text-sm border border-slate-700 focus:outline-none focus:border-sky-400 cursor-pointer"
          >
            <option value="Private Job Holder">Private Company Employee (NOC / Salary)</option>
            <option value="Govt Employee / GO Holder">Government Employee (GO / Ministry Clearance)</option>
            <option value="Business Owner / Entrepreneur">Business Owner / Proprietor (Trade License / Tax)</option>
            <option value="Student">Student (ID Card & Bonafide Letter)</option>
            <option value="Doctor / Medical Professional">Doctor / Healthcare Professional (BMDC)</option>
            <option value="Housewife / Dependent">Housewife / Dependent (Marriage Certificate)</option>
            <option value="Freelancer / IT Contractor">IT Freelancer (Remittance Proof & Invoices)</option>
            <option value="Retired Person">Retired Person (Pension Book)</option>
          </select>

          <div className="pt-2 flex items-center justify-between text-xs text-sky-200 font-medium">
            <span>Customized Checklist: <strong>{selectedProfession}</strong></span>
            <span className="text-emerald-400">✓ 100% Embassy Compliant</span>
          </div>
        </div>
      </div>

      {/* Progress & Checklist Completeness Tracker */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
            {completionPercentage}%
          </div>
          <div>
            <div className="text-xs font-bold text-white">Checklist Readiness Progress</div>
            <div className="text-[11px] text-slate-400">
              {completedCount} of {totalRequiredCount} documents marked as prepared
            </div>
          </div>
        </div>

        <div className="w-full sm:w-64 h-2.5 rounded-full bg-slate-800 overflow-hidden border border-slate-700">
          <div
            className="h-full bg-gradient-to-r from-sky-400 to-emerald-400 transition-all duration-500"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>

      {/* Document Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Mandatory Documents */}
        <div className="glass-card rounded-3xl p-6 border border-white/10 bg-slate-900/90 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-sky-400" />
              <span>General Embassy Requirements</span>
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/20 text-sky-300 border border-sky-400/30">
              Universal
            </span>
          </div>

          <div className="space-y-3">
            {generalMandatoryDocs.map((doc) => {
              const isChecked = !!checkedDocs[doc.id];
              return (
                <div
                  key={doc.id}
                  onClick={() => toggleDocCheck(doc.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                    isChecked
                      ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-100 shadow-md'
                      : 'bg-slate-950/70 border-slate-800 hover:border-sky-400/40 text-slate-200'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}}
                      className="w-4 h-4 accent-emerald-400 rounded cursor-pointer"
                    />
                  </div>
                  <div className="space-y-1 flex-1">
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span>{doc.title}</span>
                      <span className="text-[10px] text-rose-400 font-bold">*Required</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{doc.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Profession-Specific Requirements */}
        <div className="glass-card rounded-3xl p-6 border border-white/10 bg-slate-900/90 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-amber-400" />
              <span>Profession-Specific: {selectedProfession}</span>
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30">
              Vetting Key
            </span>
          </div>

          <div className="space-y-3">
            {professionSpecificDocs.map((doc) => {
              const isChecked = !!checkedDocs[doc.id];
              return (
                <div
                  key={doc.id}
                  onClick={() => toggleDocCheck(doc.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                    isChecked
                      ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-100 shadow-md'
                      : 'bg-slate-950/70 border-slate-800 hover:border-amber-400/40 text-slate-200'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}}
                      className="w-4 h-4 accent-emerald-400 rounded cursor-pointer"
                    />
                  </div>
                  <div className="space-y-1 flex-1">
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span>{doc.title}</span>
                      {doc.mandatory ? (
                        <span className="text-[10px] text-amber-400 font-bold">*Mandatory</span>
                      ) : (
                        <span className="text-[10px] text-sky-300 font-medium">Recommended</span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{doc.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Notice Banner */}
          <div className="p-3.5 rounded-2xl bg-sky-950/60 border border-sky-400/30 text-xs text-sky-200 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              Azraq Tours & Travels provides full document vetting, English translation notarization, confirmed flight dummy bookings, and Embassy appointment booking directly from our Dhaka Operations Desk.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
