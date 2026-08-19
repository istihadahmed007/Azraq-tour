import React from 'react';
import { MapPin, Star, Plane, ChevronRight } from 'lucide-react';
import { Destination } from '../../types';
import { POPULAR_AIRPORTS, BANGLADESH_AIRPORTS } from '../../data/flightsData';
import { FlightSearchParams } from '../AzraqTripFinder';

interface DestinationSectionProps {
  destinations: Destination[];
  onSelectDestination: (dest: Destination) => void;
  onQuickGenerateItinerary: (destName: string) => void;
  onSearchFlights?: (params: FlightSearchParams) => void;
  onNavigateToDestinations?: () => void;
}

export const DestinationSection: React.FC<DestinationSectionProps> = ({
  destinations,
  onSelectDestination,
  onQuickGenerateItinerary,
  onSearchFlights,
  onNavigateToDestinations,
}) => {
  const curatedList = [
    {
      id: 'dest-bangkok',
      name: 'Bangkok',
      country: 'Thailand',
      code: 'BKK',
      rating: 4.8,
      imageUrl: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=800&q=80',
      routeTag: 'Direct Flight · 2h 30m',
      visaType: 'Sticker / eVisa Available',
    },
    {
      id: 'dest-dubai',
      name: 'Dubai',
      country: 'UAE',
      code: 'DXB',
      rating: 4.9,
      imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
      routeTag: 'Direct Hub · 5h 15m',
      visaType: '30/60-Day Tourist Visa',
    },
    {
      id: 'dest-kuala-lumpur',
      name: 'Kuala Lumpur',
      country: 'Malaysia',
      code: 'KUL',
      rating: 4.7,
      imageUrl: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=800&q=80',
      routeTag: 'Direct Route · 3h 45m',
      visaType: 'eVisa Support',
    },
    {
      id: 'dest-maldives',
      name: 'Maldives',
      country: 'Maldives',
      code: 'MLE',
      rating: 4.9,
      imageUrl: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800&q=80',
      routeTag: 'Direct / 1-Stop',
      visaType: 'Free 30-Day On Arrival',
    },
  ];

  const handleCardClick = (destName: string) => {
    const found = destinations.find(
      (d) =>
        d.name.toLowerCase().includes(destName.toLowerCase()) ||
        d.country.toLowerCase().includes(destName.toLowerCase())
    );
    if (found) {
      onSelectDestination(found);
    } else {
      onQuickGenerateItinerary(destName);
    }
  };

  const handleFlightClick = (destCode: string) => {
    if (!onSearchFlights) return;
    const destAirport = POPULAR_AIRPORTS.find((a) => a.code === destCode) || POPULAR_AIRPORTS[4];
    const depDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const retDate = new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    onSearchFlights({
      tripType: 'round',
      origin: BANGLADESH_AIRPORTS[0], // DAC
      destination: destAirport,
      departureDate: depDate,
      returnDate: retDate,
      adults: 1,
      children: 0,
      infants: 0,
      cabinClass: 'Economy',
      currency: 'BDT',
    });
  };

  return (
    <section id="popular-destinations" className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#0D6EFD]">
            <MapPin className="w-3.5 h-3.5" />
            <span>Curated Routes</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#071A33] tracking-tight font-poppins">
            Popular Destinations from Dhaka
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Direct airline connections, fast visa processing, and curated partner stays.
          </p>
        </div>

        {onNavigateToDestinations && (
          <button
            onClick={onNavigateToDestinations}
            type="button"
            className="inline-flex items-center gap-1 text-sm font-bold text-[#0D6EFD] hover:text-blue-700 transition-colors cursor-pointer self-start sm:self-auto min-h-[44px]"
          >
            <span>Explore all destinations</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
        {curatedList.map((dest) => (
          <div
            key={dest.id}
            className="group bg-white rounded-2xl overflow-hidden shadow-xs hover:shadow-lg border border-slate-200/80 transition-all duration-300 flex flex-col justify-between"
          >
            <div
              className="relative h-48 w-full overflow-hidden bg-slate-100 cursor-pointer"
              onClick={() => handleCardClick(dest.name)}
            >
              <img
                src={dest.imageUrl}
                alt={dest.name}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              />
              <div className="absolute top-3 left-3 bg-black/65 backdrop-blur-md px-2.5 py-1 rounded-full text-white text-xs font-semibold flex items-center gap-1 shadow-xs">
                <MapPin className="w-3 h-3 text-white" />
                <span>{dest.name}</span>
              </div>

              <div className="absolute top-3 right-3 bg-[#071A33]/85 backdrop-blur-md px-2.5 py-1 rounded-full text-sky-300 font-mono text-[11px] font-bold shadow-xs">
                {dest.routeTag}
              </div>
            </div>

            <div className="p-4 sm:p-5 flex flex-col justify-between gap-3 flex-1">
              <div>
                <div className="flex items-center justify-between">
                  <h3
                    onClick={() => handleCardClick(dest.name)}
                    className="text-base font-bold text-[#071A33] tracking-tight group-hover:text-[#0D6EFD] transition-colors cursor-pointer font-poppins"
                  >
                    {dest.name}, {dest.country}
                  </h3>
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="text-xs font-bold text-slate-800">{dest.rating}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-1">Visa: {dest.visaType}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => handleFlightClick(dest.code)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#0D6EFD] hover:underline cursor-pointer min-h-[40px]"
                >
                  <Plane className="w-3.5 h-3.5" />
                  <span>Find Flights</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleCardClick(dest.name)}
                  className="text-xs font-bold text-slate-700 hover:text-[#0D6EFD] flex items-center gap-0.5 cursor-pointer min-h-[40px]"
                >
                  <span>Details</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
