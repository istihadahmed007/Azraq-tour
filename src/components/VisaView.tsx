import React, { useState } from 'react';
import { OFFICIAL_VISA_REQUIREMENTS, VisaRequirementItem } from '../data/visaRequirementsData';
import { FileCheck2, Search, CheckCircle2, Clock, DollarSign, ShieldCheck, ArrowRight, Building, Briefcase, GraduationCap } from 'lucide-react';

interface VisaViewProps {
  onOpenVisaQuote: (country?: string) => void;
}

export const VisaView: React.FC<VisaViewProps> = ({ onOpenVisaQuote }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<VisaRequirementItem>(OFFICIAL_VISA_REQUIREMENTS[0]);
  const [activeTab, setActiveTab] = useState<'general' | 'job' | 'business' | 'student'>('general');

  const filteredList = OFFICIAL_VISA_REQUIREMENTS.filter(
    (item) =>
      item.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.entryType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-10 animate-fadeIn">
      {/* Page Header */}
      <div className="max-w-3xl space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-[#0D6EFD] text-xs font-bold uppercase tracking-wider">
          <FileCheck2 className="w-3.5 h-3.5" />
          <span>Official Visa Guidance</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#071A33] tracking-tight">
          Visa Assistance Made Simple
        </h1>
        <p className="text-slate-600 text-base leading-relaxed">
          Accurate documentation checklists, embassy fee breakdown, and end-to-end submission support for Bangladeshi passport holders.
        </p>
      </div>

      {/* 3 Step Process Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
        <div className="flex items-start gap-4">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0D6EFD] font-extrabold flex items-center justify-center shrink-0 text-sm">
            1
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#071A33]">Choose Destination</h3>
            <p className="text-xs text-slate-500 mt-0.5">Select your travel destination to view specific visa criteria.</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0D6EFD] font-extrabold flex items-center justify-center shrink-0 text-sm">
            2
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#071A33]">Check Requirements</h3>
            <p className="text-xs text-slate-500 mt-0.5">Review required financial documents, photos, and job papers.</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0D6EFD] font-extrabold flex items-center justify-center shrink-0 text-sm">
            3
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#071A33]">Get Assistance</h3>
            <p className="text-xs text-slate-500 mt-0.5">Our visa specialists verify and process your application smoothly.</p>
          </div>
        </div>
      </div>

      {/* Search and Country Selector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Country List */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search country (e.g. Malaysia, Thailand)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0D6EFD] shadow-xs"
            />
          </div>

          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {filteredList.map((item) => {
              const isSelected = selectedItem.id === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-blue-50/80 border-[#0D6EFD] shadow-xs'
                      : 'bg-white border-slate-200/80 hover:border-slate-300 hover:bg-slate-50/60'
                  }`}
                >
                  <div>
                    <h4 className="font-bold text-sm text-[#071A33]">{item.country}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{item.entryType}</p>
                  </div>
                  <span className="text-xs font-bold text-[#0D6EFD] font-mono">
                    {item.totalEstimatedBDT || item.embassyFeeBDT}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Country Details */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold text-[#0D6EFD] uppercase tracking-wider">
                {selectedItem.entryType}
              </span>
              <h2 className="text-2xl font-extrabold text-[#071A33] mt-1">
                {selectedItem.country} Visa Guidelines
              </h2>
            </div>

            <button
              onClick={() => onOpenVisaQuote(selectedItem.country)}
              className="px-5 py-2.5 rounded-xl bg-[#0D6EFD] hover:bg-blue-700 text-white font-bold text-sm shadow-xs transition-all flex items-center gap-2 cursor-pointer shrink-0 self-start sm:self-auto"
            >
              <span>Request Assistance</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Key Facts Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Processing Time</span>
              </div>
              <p className="text-sm font-bold text-[#071A33] mt-1">
                {selectedItem.processingTime || '3–5 Working Days'}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                <span>Estimated Cost</span>
              </div>
              <p className="text-sm font-bold text-[#0D6EFD] mt-1 font-mono">
                {selectedItem.totalEstimatedBDT || selectedItem.embassyFeeBDT || 'Contact'}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 col-span-2 sm:col-span-1">
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                <span>Min. Bank Balance</span>
              </div>
              <p className="text-sm font-bold text-[#071A33] mt-1 truncate">
                {selectedItem.minBankBalance || 'BDT 100,000+'}
              </p>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 border-b border-slate-200/80 pb-3">
            <button
              onClick={() => setActiveTab('general')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'general'
                  ? 'bg-blue-50 text-[#0D6EFD]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              General Requirements
            </button>
            <button
              onClick={() => setActiveTab('job')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'job'
                  ? 'bg-blue-50 text-[#0D6EFD]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              For Job Holders
            </button>
            <button
              onClick={() => setActiveTab('business')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'business'
                  ? 'bg-blue-50 text-[#0D6EFD]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              For Business Persons
            </button>
            <button
              onClick={() => setActiveTab('student')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'student'
                  ? 'bg-blue-50 text-[#0D6EFD]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              For Students
            </button>
          </div>

          {/* Checklist Area */}
          <div className="space-y-3 min-h-[160px]">
            {activeTab === 'general' && (
              <ul className="space-y-2.5">
                {selectedItem.generalRequirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            )}

            {activeTab === 'job' && (
              <ul className="space-y-2.5">
                {(selectedItem.occupationRequirements?.jobHolder || [
                  'No Objection Certificate (NOC) on company letterhead',
                  'Official Visiting Card & Employee ID copy',
                  'Salary bank statement for last 6 months',
                  'Pay slips / salary certificate for last 3 months',
                ]).map((req, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            )}

            {activeTab === 'business' && (
              <ul className="space-y-2.5">
                {(selectedItem.occupationRequirements?.businessPerson || [
                  'Valid Trade License translated into English with Notary',
                  'Memorandum of Articles for Limited Companies',
                  'Company blank letterhead & visiting card',
                  'Company bank statement and solvency certificate',
                ]).map((req, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            )}

            {activeTab === 'student' && (
              <ul className="space-y-2.5">
                {(selectedItem.occupationRequirements?.student || [
                  'Valid Student ID card photocopy',
                  'Leave letter / permission letter from educational institution',
                  'Parent/Sponsor financial documents & affidavit',
                ]).map((req, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Quick CTA Footer */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <span>Need personalized documentation review? Our Dhaka desk is ready.</span>
            <button
              onClick={() => onOpenVisaQuote(selectedItem.country)}
              className="text-[#0D6EFD] font-bold hover:underline cursor-pointer"
            >
              Start Free Visa Check →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
