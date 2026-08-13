import React, { useState } from 'react';
import { TourPackage } from '../types';
import { Sparkles, CheckCircle2, Copy, FileText, Code2, Check, Edit3, Trash2, Globe, Calendar, DollarSign, Hotel, EyeOff } from 'lucide-react';

interface ExtractionPreviewProps {
  fileName: string;
  extractedPackages: TourPackage[];
  detectedDestinations: string[];
  onApprove: (approvedPackages: TourPackage[]) => Promise<void> | void;
  onCancel: () => void;
  isSaving?: boolean;
}

export const ExtractionPreview: React.FC<ExtractionPreviewProps> = ({
  fileName,
  extractedPackages,
  detectedDestinations,
  onApprove,
  onCancel,
  isSaving = false,
}) => {
  const [packages, setPackages] = useState<TourPackage[]>(extractedPackages);
  const [activeTab, setActiveTab] = useState<'visual' | 'json'>('visual');
  const [copied, setCopied] = useState(false);
  const [jsonText, setJsonText] = useState(JSON.stringify(extractedPackages, null, 2));
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [activePackageIndex, setActivePackageIndex] = useState(0);

  const activePackage = packages[activePackageIndex] || packages[0];

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(packages, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleJsonChange = (val: string) => {
    setJsonText(val);
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) {
        setPackages(parsed);
        setJsonError(null);
      } else if (typeof parsed === 'object') {
        setPackages([parsed]);
        setJsonError(null);
      }
    } catch (err: any) {
      setJsonError('Invalid JSON format: ' + err.message);
    }
  };

  const handleUpdatePackageField = (index: number, field: keyof TourPackage, value: any) => {
    setPackages((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      setJsonText(JSON.stringify(updated, null, 2));
      return updated;
    });
  };

  const handleApprove = () => {
    if (jsonError) {
      alert('Please fix JSON formatting errors before approving.');
      return;
    }
    onApprove(packages);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-sky-400/40 rounded-3xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[90vh]">
        {/* Header Bar */}
        <div className="p-5 sm:p-6 bg-slate-800/90 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-sky-400 uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-sky-400" />
              <span>Gemini AI PDF Extraction Preview</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1 flex items-center gap-2">
              <span>{fileName}</span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30">
                {packages.length} Package{packages.length > 1 ? 's' : ''} Detected
              </span>
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              Review and verify the structured JSON extracted from your PDF brochure before finalizing to the live database.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Switcher */}
            <div className="flex p-1 bg-slate-950/60 rounded-xl border border-white/10 text-xs">
              <button
                onClick={() => setActiveTab('visual')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === 'visual' ? 'bg-sky-500 text-slate-950 shadow-md' : 'text-slate-300 hover:text-white'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Card & Form View</span>
              </button>
              <button
                onClick={() => setActiveTab('json')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === 'json' ? 'bg-sky-500 text-slate-950 shadow-md' : 'text-slate-300 hover:text-white'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>Raw JSON View</span>
              </button>
            </div>

            <button
              onClick={onCancel}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all text-xs font-bold"
            >
              Cancel
            </button>
          </div>
        </div>

        {/* Quality Audit Checklist Banner */}
        <div className="px-6 py-3 bg-sky-950/40 border-b border-sky-500/20 flex flex-wrap items-center justify-between gap-4 text-xs font-medium text-sky-200 shrink-0">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>PDF Packages Detected: <strong className="text-white font-mono">{packages.length}</strong></span>
            </div>
            <div className="flex items-center gap-1.5 text-sky-300 font-bold">
              <span>Packages Successfully Imported: <strong className="text-white font-mono">{packages.length}</strong></span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-slate-300">Expected: <strong className="text-white">37</strong></span>
            <span className="text-slate-300">Detected: <strong className={packages.length === 37 ? 'text-emerald-400' : 'text-amber-400'}>{packages.length}</strong></span>
          </div>
        </div>

        {/* Warning if fewer than 37 packages detected */}
        {packages.length !== 37 && (
          <div className="px-6 py-2.5 bg-amber-500/15 border-b border-amber-500/30 text-amber-300 text-xs font-bold flex items-center justify-between">
            <span>⚠ Only {packages.length} of 37 packages were detected. Please review the PDF extraction before publishing.</span>
            <span className="text-[11px] font-mono opacity-80">Expected: 37 | Found: {packages.length}</span>
          </div>
        )}

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-200">
          {/* Numbered List of Extracted Packages with Preview, Edit, Publish/Unpublish, Delete */}
          <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold text-sky-300 uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4 text-sky-400" />
                <span>Import Verification Package List (1 to {packages.length})</span>
              </h3>
              <span className="text-[11px] text-slate-400">Click any package to edit its fields below</span>
            </div>

            <div className="max-h-48 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
              {packages.map((pkg, idx) => {
                const isSelected = activePackageIndex === idx;
                const isPublished = pkg.status === 'published';
                return (
                  <div
                    key={pkg.id || idx}
                    className={`p-2.5 rounded-xl border transition-all flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 text-xs ${
                      isSelected
                        ? 'bg-sky-950/80 border-sky-400/60 shadow-md'
                        : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <span className="w-6 h-6 rounded-lg bg-sky-500/20 text-sky-300 font-mono font-bold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <div className="min-w-0">
                        <p className="font-bold text-white truncate">{pkg.package_name}</p>
                        <p className="text-[11px] text-slate-400 truncate">
                          {pkg.destination_name || pkg.country} • {pkg.duration} • {pkg.currency} {pkg.price?.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {/* Preview Button */}
                      <button
                        onClick={() => {
                          setActivePackageIndex(idx);
                          setActiveTab('visual');
                        }}
                        className={`px-2.5 py-1 rounded-lg font-bold text-[11px] flex items-center gap-1 transition-all ${
                          isSelected
                            ? 'bg-sky-500 text-slate-950'
                            : 'bg-slate-800 text-sky-300 hover:bg-slate-700'
                        }`}
                        title="Preview details"
                      >
                        <Globe className="w-3 h-3" />
                        <span>Preview</span>
                      </button>

                      {/* Edit Button */}
                      <button
                        onClick={() => {
                          setActivePackageIndex(idx);
                          setActiveTab('visual');
                        }}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-[11px] flex items-center gap-1 transition-all"
                        title="Edit fields"
                      >
                        <Edit3 className="w-3 h-3 text-amber-400" />
                        <span>Edit</span>
                      </button>

                      {/* Publish/Unpublish Toggle */}
                      <button
                        onClick={() => {
                          handleUpdatePackageField(idx, 'status', isPublished ? 'draft' : 'published');
                        }}
                        className={`px-2.5 py-1 rounded-lg font-bold text-[11px] flex items-center gap-1 transition-all ${
                          isPublished
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}
                        title="Toggle Published state"
                      >
                        {isPublished ? <Check className="w-3 h-3 text-emerald-400" /> : <EyeOff className="w-3 h-3" />}
                        <span>{isPublished ? 'Published' : 'Draft'}</span>
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => {
                          if (confirm(`Remove package "${pkg.package_name}" from import list?`)) {
                            const updated = packages.filter((_, i) => i !== idx);
                            setPackages(updated);
                            setJsonText(JSON.stringify(updated, null, 2));
                            if (activePackageIndex >= updated.length) {
                              setActivePackageIndex(Math.max(0, updated.length - 1));
                            }
                          }
                        }}
                        className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-all"
                        title="Delete from list"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {activeTab === 'visual' ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: Form Fields */}
              <div className="lg:col-span-2 space-y-4">
                <div className="p-4 bg-slate-800/80 rounded-2xl border border-white/10 space-y-4">
                  <h3 className="text-sm font-extrabold text-sky-300 uppercase tracking-wider border-b border-slate-700 pb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Package Details & Editable Fields
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">Package Name</label>
                      <input
                        type="text"
                        value={activePackage?.package_name || ''}
                        onChange={(e) => handleUpdatePackageField(activePackageIndex, 'package_name', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-semibold focus:outline-none focus:border-sky-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">Destination Name</label>
                      <input
                        type="text"
                        value={activePackage?.destination_name || ''}
                        onChange={(e) => handleUpdatePackageField(activePackageIndex, 'destination_name', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-semibold focus:outline-none focus:border-sky-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">Country</label>
                      <input
                        type="text"
                        value={activePackage?.country || ''}
                        onChange={(e) => handleUpdatePackageField(activePackageIndex, 'country', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-semibold focus:outline-none focus:border-sky-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">Duration</label>
                      <input
                        type="text"
                        value={activePackage?.duration || ''}
                        onChange={(e) => handleUpdatePackageField(activePackageIndex, 'duration', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-semibold focus:outline-none focus:border-sky-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">Starting Price</label>
                      <input
                        type="number"
                        value={activePackage?.price || 0}
                        onChange={(e) => handleUpdatePackageField(activePackageIndex, 'price', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-emerald-400 text-xs font-mono font-bold focus:outline-none focus:border-sky-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">Currency</label>
                      <input
                        type="text"
                        value={activePackage?.currency || 'BDT'}
                        onChange={(e) => handleUpdatePackageField(activePackageIndex, 'currency', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-semibold focus:outline-none focus:border-sky-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Hotel Accommodations</label>
                    <input
                      type="text"
                      value={activePackage?.hotel || ''}
                      onChange={(e) => handleUpdatePackageField(activePackageIndex, 'hotel', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-semibold focus:outline-none focus:border-sky-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Description</label>
                    <textarea
                      rows={2}
                      value={activePackage?.description || ''}
                      onChange={(e) => handleUpdatePackageField(activePackageIndex, 'description', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-sky-400"
                    />
                  </div>
                </div>

                {/* Day-by-Day Itinerary Preview */}
                <div className="p-4 bg-slate-800/80 rounded-2xl border border-white/10 space-y-3">
                  <h4 className="text-xs font-extrabold text-sky-300 uppercase tracking-wider flex items-center justify-between">
                    <span>Parsed Day-by-Day Itinerary ({activePackage?.itinerary?.length || 0} Days)</span>
                  </h4>

                  <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                    {activePackage?.itinerary?.map((day, idx) => (
                      <div key={idx} className="p-3 bg-slate-900/90 rounded-xl border border-slate-700/60 text-xs space-y-1">
                        <div className="flex items-center justify-between font-bold text-sky-300">
                          <span>Day {day.day}: {day.title}</span>
                          <span className="text-[10px] text-slate-400 font-normal">Overnight: {day.overnight}</span>
                        </div>
                        <ul className="list-disc list-inside text-slate-300 space-y-0.5 text-[11px]">
                          {day.activities?.map((act, aIdx) => (
                            <li key={aIdx}>{act}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Inclusions, Exclusions, & Pricing Tiers */}
              <div className="space-y-4">
                {/* Pricing Tiers Table */}
                <div className="p-4 bg-slate-800/80 rounded-2xl border border-white/10 space-y-2">
                  <h4 className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5" />
                    Pax Pricing Tiers
                  </h4>
                  <div className="bg-slate-900 rounded-xl overflow-hidden border border-slate-700 text-xs">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-slate-800 text-slate-300 border-b border-slate-700 text-[10px] uppercase font-bold">
                          <th className="p-2">Travelers (Pax)</th>
                          <th className="p-2 text-right">Price / Person</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {activePackage?.pricing_tiers?.map((pt, pIdx) => (
                          <tr key={pIdx}>
                            <td className="p-2 font-semibold text-white">{pt.pax} Person(s)</td>
                            <td className="p-2 text-right font-mono font-bold text-emerald-300">
                              {activePackage.currency === 'BDT' ? '৳' : activePackage.currency} {pt.price?.toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Inclusions */}
                <div className="p-4 bg-slate-800/80 rounded-2xl border border-white/10 space-y-2">
                  <h4 className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Package Inclusions
                  </h4>
                  <ul className="space-y-1 text-xs text-slate-300 max-h-36 overflow-y-auto">
                    {activePackage?.inclusions?.map((inc, iIdx) => (
                      <li key={iIdx} className="flex items-start gap-1.5">
                        <span className="text-emerald-400 font-bold">•</span>
                        <span>{inc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Exclusions */}
                <div className="p-4 bg-slate-800/80 rounded-2xl border border-white/10 space-y-2">
                  <h4 className="text-xs font-extrabold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Trash2 className="w-3.5 h-3.5" />
                    Package Exclusions
                  </h4>
                  <ul className="space-y-1 text-xs text-slate-300 max-h-28 overflow-y-auto">
                    {activePackage?.exclusions?.map((exc, eIdx) => (
                      <li key={eIdx} className="flex items-start gap-1.5">
                        <span className="text-rose-400 font-bold">•</span>
                        <span>{exc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            /* Raw JSON View */
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-slate-400">JSON Schema Payload ({packages.length} Record(s))</span>
                <button
                  onClick={handleCopyJson}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-300 border border-slate-700 transition-all font-bold flex items-center gap-1.5"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied JSON!' : 'Copy Raw JSON'}</span>
                </button>
              </div>

              {jsonError && (
                <div className="p-3 bg-rose-950/60 border border-rose-500/40 rounded-xl text-xs text-rose-300 font-bold">
                  {jsonError}
                </div>
              )}

              <textarea
                rows={16}
                value={jsonText}
                onChange={(e) => handleJsonChange(e.target.value)}
                className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-sky-300 focus:outline-none focus:border-sky-400 leading-relaxed shadow-inner"
              />
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-5 sm:p-6 bg-slate-800/90 border-t border-white/10 flex items-center justify-between gap-4 shrink-0">
          <button
            onClick={onCancel}
            disabled={isSaving}
            className="px-5 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs border border-slate-700 transition-all cursor-pointer"
          >
            Discard & Cancel
          </button>

          <button
            onClick={handleApprove}
            disabled={isSaving || !!jsonError}
            className="px-8 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-extrabold text-xs shadow-xl transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                <span>Finalizing & Saving Packages...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 text-slate-950" />
                <span>Approve & Save {packages.length} Package(s) to Live Site</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
