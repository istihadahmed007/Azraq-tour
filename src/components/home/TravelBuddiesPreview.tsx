import React from 'react';
import { Users, Calendar, MapPin, ArrowRight, ShieldCheck, Heart } from 'lucide-react';

interface TravelBuddiesPreviewProps {
  onNavigateToBuddies?: () => void;
}

export const TravelBuddiesPreview: React.FC<TravelBuddiesPreviewProps> = ({
  onNavigateToBuddies,
}) => {
  const sampleBuddies = [
    {
      id: 'sb1',
      name: 'Tanvir Hossain',
      destination: 'Bangkok & Pattaya, Thailand',
      dates: 'Nov 12 – 18',
      style: 'Culinary & Street Photography',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    },
    {
      id: 'sb2',
      name: 'Nusrat Jahan',
      destination: 'Kuala Lumpur, Malaysia',
      dates: 'Dec 02 – 08',
      style: 'Family & Heritage Walking',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    },
    {
      id: 'sb3',
      name: 'Rahat Chowdhury',
      destination: 'Dubai & Abu Dhabi, UAE',
      dates: 'Nov 20 – 27',
      style: 'Desert Safari & Architecture',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    },
    {
      id: 'sb4',
      name: 'Samira Ahmed',
      destination: 'Malé, Maldives',
      dates: 'Dec 15 – 20',
      style: 'Resort Relaxation & Snorkeling',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    },
  ];

  return (
    <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-purple-600">
            <Users className="w-3.5 h-3.5" />
            <span>Community Travel Network</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#071A33] tracking-tight font-poppins">
            Find Compatible Travel Buddies
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Connect with verified Bangladeshi travelers heading to the same destinations on overlapping dates.
          </p>
        </div>

        {onNavigateToBuddies && (
          <button
            onClick={onNavigateToBuddies}
            type="button"
            className="min-h-[44px] px-4 py-2 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 font-bold text-xs sm:text-sm transition-colors cursor-pointer flex items-center gap-2 self-start sm:self-auto"
          >
            <span>Explore Travel Buddies Hub</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {sampleBuddies.map((buddy) => (
          <div
            key={buddy.id}
            className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between gap-4 relative"
          >
            <div className="flex items-center gap-3">
              <img
                src={buddy.avatar}
                alt={buddy.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-purple-200"
              />
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-[#071A33] truncate font-poppins">{buddy.name}</h3>
                <span className="text-[10px] text-purple-600 font-semibold bg-purple-50 px-2 py-0.5 rounded-full inline-block mt-0.5">
                  Verified Traveler
                </span>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-3">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                <span className="truncate font-medium">{buddy.destination}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                <span className="font-medium text-slate-700">{buddy.dates}</span>
              </div>
              <p className="text-[11px] text-slate-500 italic mt-1">"{buddy.style}"</p>
            </div>

            <button
              type="button"
              onClick={onNavigateToBuddies}
              className="w-full py-2 rounded-xl bg-slate-900 hover:bg-[#003580] text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>View Profile & Match</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>

      <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-purple-900">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-purple-600 shrink-0" />
          <span>Strict privacy controls: Your exact contact number is never shared without your mutual acceptance.</span>
        </div>
        {onNavigateToBuddies && (
          <button
            type="button"
            onClick={onNavigateToBuddies}
            className="text-purple-700 font-bold hover:underline shrink-0 cursor-pointer"
          >
            Post Your Travel Plan →
          </button>
        )}
      </div>
    </section>
  );
};
