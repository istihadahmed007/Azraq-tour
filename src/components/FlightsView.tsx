import React, { useState } from 'react';
import { Plane, Calendar, Users, MapPin, ArrowRight, ShieldCheck, CheckCircle2, Phone } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface FlightsViewProps {
  onOpenFlightModal?: (dest?: string) => void;
}

export const FlightsView: React.FC<FlightsViewProps> = ({ onOpenFlightModal }) => {
  const { user, showToast } = useAuth();
  const [tripType, setTripType] = useState<'round' | 'oneway' | 'multi'>('round');
  const [origin, setOrigin] = useState('Dhaka (DAC)');
  const [destination, setDestination] = useState('');
  const [departDate, setDepartDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [passengers, setPassengers] = useState('1 Adult');
  const [cabinClass, setCabinClass] = useState('Economy');
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination || !departDate || !phone) {
      showToast('Please provide your destination, travel date, and contact number.', 'error');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      showToast('Flight quotation request submitted! Our agent will contact you within 2 hours.', 'success');
    }, 800);
  };

  const popularRoutes = [
    { from: 'Dhaka (DAC)', to: 'Bangkok (BKK)', airline: 'Biman / Thai Airways', time: '2h 30m', est: 'BDT 26,500+' },
    { from: 'Dhaka (DAC)', to: 'Kuala Lumpur (KUL)', airline: 'Malaysia Airlines / AirAsia', time: '3h 45m', est: 'BDT 32,000+' },
    { from: 'Dhaka (DAC)', to: 'Dubai (DXB)', airline: 'Emirates / FlyDubai', time: '4h 50m', est: 'BDT 48,000+' },
    { from: 'Dhaka (DAC)', to: 'Malé, Maldives (MLE)', airline: 'US-Bangla / Maldivian', time: '4h 15m', est: 'BDT 42,000+' },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-10 animate-fadeIn">
      {/* Page Header */}
      <div className="max-w-3xl space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-[#0D6EFD] text-xs font-bold uppercase tracking-wider">
          <Plane className="w-3.5 h-3.5" />
          <span>Official Flight Assistance</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#071A33] tracking-tight">
          Tailored Flight Quotations
        </h1>
        <p className="text-slate-600 text-base leading-relaxed">
          Direct bookings, GDS group fares, and multi-airline routing from Dhaka and international gateways.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Container */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-[#071A33]">Quotation Request Received!</h2>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                Thank you, {fullName || 'Traveler'}. Our ticketing team is reviewing live airline seat inventories for {destination} and will reach out to you via WhatsApp / Phone shortly.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-4 px-6 py-2.5 rounded-xl bg-[#0D6EFD] text-white font-bold text-sm hover:bg-blue-700 transition-colors"
              >
                Submit Another Request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Trip Type Selector */}
              <div className="flex gap-2 pb-2 border-b border-slate-100">
                {(['round', 'oneway', 'multi'] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setTripType(type)}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      tripType === type
                        ? 'bg-[#0D6EFD] text-white'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {type === 'round' ? 'Round Trip' : type === 'oneway' ? 'One Way' : 'Multi City'}
                  </button>
                ))}
              </div>

              {/* Origin & Destination */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">From</label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      value={origin}
                      onChange={(e) => setOrigin(e.target.value)}
                      placeholder="Origin city or airport"
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-[#071A33] focus:bg-white focus:outline-none focus:border-[#0D6EFD]"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">To</label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      placeholder="Destination (e.g. Bangkok, Dubai, Singapore)"
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-white border border-slate-200 text-sm font-medium text-[#071A33] focus:outline-none focus:border-[#0D6EFD]"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Departure Date</label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="date"
                      value={departDate}
                      onChange={(e) => setDepartDate(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-[#071A33] focus:outline-none focus:border-[#0D6EFD]"
                      required
                    />
                  </div>
                </div>

                {tripType === 'round' && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Return Date</label>
                    <div className="relative">
                      <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type="date"
                        value={returnDate}
                        onChange={(e) => setReturnDate(e.target.value)}
                        className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-[#071A33] focus:outline-none focus:border-[#0D6EFD]"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Passengers & Cabin */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Passengers</label>
                  <select
                    value={passengers}
                    onChange={(e) => setPassengers(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-[#071A33] focus:outline-none focus:border-[#0D6EFD]"
                  >
                    <option value="1 Adult">1 Adult</option>
                    <option value="2 Adults">2 Adults</option>
                    <option value="2 Adults + 1 Child">2 Adults + 1 Child</option>
                    <option value="Group (4+ Travelers)">Group (4+ Travelers)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Cabin Class</label>
                  <select
                    value={cabinClass}
                    onChange={(e) => setCabinClass(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-[#071A33] focus:outline-none focus:border-[#0D6EFD]"
                  >
                    <option value="Economy">Economy</option>
                    <option value="Premium Economy">Premium Economy</option>
                    <option value="Business">Business Class</option>
                  </select>
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your Name"
                    className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-[#071A33] focus:outline-none focus:border-[#0D6EFD]"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Phone / WhatsApp</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+880 18XX-XXXXXX"
                    className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-[#071A33] focus:outline-none focus:border-[#0D6EFD]"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 rounded-xl bg-[#0D6EFD] hover:bg-blue-700 text-white font-bold text-sm shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{isSubmitting ? 'Checking Inventories...' : 'Request Quotation'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>

        {/* Right Info Column: Popular Flight Corridors */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-50 rounded-2xl border border-slate-200/80 p-6 space-y-4">
            <h2 className="text-base font-bold text-[#071A33]">Popular Flight Corridors from Dhaka</h2>
            <p className="text-xs text-slate-500">Live average round-trip fares with full baggage allowance.</p>

            <div className="space-y-3 pt-2">
              {popularRoutes.map((route, i) => (
                <div
                  key={i}
                  onClick={() => setDestination(route.to.split(' ')[0])}
                  className="p-3 rounded-xl bg-white border border-slate-200/70 hover:border-[#0D6EFD] transition-all cursor-pointer flex items-center justify-between"
                >
                  <div>
                    <h4 className="text-xs font-bold text-[#071A33]">{route.from} → {route.to}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">{route.airline} • {route.time}</p>
                  </div>
                  <span className="text-xs font-bold text-[#0D6EFD] font-mono">{route.est}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-blue-50/70 border border-blue-100 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#0D6EFD]">
              <ShieldCheck className="w-4 h-4" />
              <span>Azraq Direct Booking Guarantee</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Transparent taxes, verified airline PNR numbers, 24/7 rescheduling assistance, and direct airport support.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
