import React, { useState } from 'react';
import { TourPackage } from '../types';
import { usePackages } from '../context/PackageContext';
import { X, Send, MapPin, Calendar, Users, FileText, CheckCircle2 } from 'lucide-react';

interface PackageQuotationModalProps {
  pkg: TourPackage | null;
  onClose: () => void;
}

export const PackageQuotationModal: React.FC<PackageQuotationModalProps> = ({ pkg, onClose }) => {
  const { submitPackageQuote } = usePackages();

  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [travelDate, setTravelDate] = useState('');
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [specialRequirements, setSpecialRequirements] = useState('');
  const [message, setMessage] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!pkg) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!customerName || !email || !phone) {
      setErrorMessage('Please fill in all required fields (Name, Email, WhatsApp / Phone).');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await submitPackageQuote({
        customerName,
        email,
        phone,
        destination: pkg.destination_name || pkg.country,
        package_id: pkg.id,
        package_name: pkg.package_name,
        travelDate,
        adults,
        children,
        specialRequirements,
        message,
      });

      if (res.success) {
        setSuccessMessage(res.message);
        setTimeout(() => {
          onClose();
        }, 2500);
      } else {
        setErrorMessage(res.message);
      }
    } catch (err: any) {
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-sky-500/30 rounded-3xl shadow-2xl overflow-hidden my-8 flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-sky-950 via-slate-900 to-slate-950 p-6 border-b border-sky-500/20 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-xs font-bold text-sky-400 uppercase tracking-wider mb-1">
            <FileText className="w-4 h-4" />
            Official Package Quotation Request
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold text-white">{pkg.package_name}</h2>

          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs font-medium text-sky-200/90">
            <span className="flex items-center gap-1 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
              <MapPin className="w-3.5 h-3.5 text-sky-400" />
              {pkg.destination_name} ({pkg.country})
            </span>
            <span className="flex items-center gap-1 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
              <Calendar className="w-3.5 h-3.5 text-sky-400" />
              {pkg.duration}
            </span>
            <span className="flex items-center gap-1 bg-emerald-950/60 text-emerald-400 font-extrabold px-2.5 py-1 rounded-lg border border-emerald-500/30">
              Starting from {pkg.currency === 'BDT' ? '৳' : pkg.currency} {pkg.price.toLocaleString()} / pax
            </span>
          </div>
        </div>

        {/* Body Form */}
        <div className="p-6 sm:p-8 space-y-6">
          {successMessage ? (
            <div className="p-6 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
              <h3 className="text-lg font-bold text-white">Quotation Submitted!</h3>
              <p className="text-xs text-emerald-200 leading-relaxed">{successMessage}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-200 text-xs font-semibold">
                  {errorMessage}
                </div>
              )}

              {/* Personal Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-sky-200 mb-1">
                    Full Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-sky-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-sky-200 mb-1">
                    Email Address <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-sky-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-sky-200 mb-1">
                    WhatsApp / Phone Number <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+880 1700 000000"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-sky-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-sky-200 mb-1">Expected Travel Date</label>
                  <input
                    type="date"
                    value={travelDate}
                    onChange={(e) => setTravelDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-sky-400"
                  />
                </div>
              </div>

              {/* Travelers count */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-sky-200 mb-1">Adults (12+ yrs)</label>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={adults}
                    onChange={(e) => setAdults(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-xs focus:outline-none focus:border-sky-400 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-sky-200 mb-1">Children (2-11 yrs)</label>
                  <input
                    type="number"
                    min={0}
                    max={20}
                    value={children}
                    onChange={(e) => setChildren(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-xs focus:outline-none focus:border-sky-400 font-bold"
                  />
                </div>
              </div>

              {/* Special Requirements */}
              <div>
                <label className="block text-xs font-bold text-sky-200 mb-1">
                  Special Requirements (Hotel tier, Food preference, Airfare needed)
                </label>
                <input
                  type="text"
                  value={specialRequirements}
                  onChange={(e) => setSpecialRequirements(e.target.value)}
                  placeholder="e.g. 4-Star Hotel upgrade, Halal Food, Airport Pick-up"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-sky-400"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-bold text-sky-200 mb-1">Additional Message / Note</label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Any extra details regarding flight preferences or visa assistance..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-sky-400 resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-400 hover:to-emerald-400 text-slate-950 font-extrabold text-xs shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Submitting Request...' : 'Submit Quotation Request'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
