import React, { useState } from 'react';
import { Destination, Spot } from '../types';

interface MapViewProps {
  destinations: Destination[];
  onSelectDestination: (destination: Destination) => void;
  selectedSpot?: Spot;
}

export const MapView: React.FC<MapViewProps> = ({
  destinations,
  onSelectDestination,
  selectedSpot,
}) => {
  const [activePinId, setActivePinId] = useState<string>(
    selectedSpot ? 'spot-selected' : destinations[0]?.id || 'kyoto-japan'
  );
  const [mapCategory, setMapCategory] = useState<string>('All');

  const filteredDestinations = destinations.filter(
    (d) => mapCategory === 'All' || d.category === mapCategory
  );

  const activeDest =
    destinations.find((d) => d.id === activePinId) || destinations[0];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 pt-20 md:pt-10 pb-24 flex flex-col gap-6 h-full min-h-screen">
      {/* Map Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-4">
        <div>
          <h2 className="font-serif-display text-2xl md:text-3xl text-on-surface font-semibold">
            Interactive Travel Map
          </h2>
          <p className="text-xs text-outline mt-0.5">
            Explore AI-verified destinations and saved itinerary spots globally
          </p>
        </div>

        {/* Categories */}
        <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar max-w-full">
          {['All', 'Beach', 'Culture', 'City', 'Mountain'].map((cat) => (
            <button
              key={cat}
              onClick={() => setMapCategory(cat)}
              className={`text-xs px-3.5 py-1.5 rounded-full font-semibold transition-all shrink-0 ${
                mapCategory === cat
                  ? 'bg-primary text-on-primary shadow-md'
                  : 'bg-white/5 text-on-surface-variant hover:bg-white/10 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Map Container */}
      <div className="relative w-full h-[580px] rounded-3xl overflow-hidden glass-card border border-white/15 shadow-2xl bg-[#0c0e11]">
        {/* World Map Graphic Background */}
        <div className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-luminosity pointer-events-none"
             style={{
               backgroundImage: `url('https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=2000&q=80')`
             }}
        ></div>

        <div className="absolute inset-0 bg-gradient-to-t from-[#111316] via-transparent to-black/60"></div>

        {/* Map Pins */}
        <div className="absolute inset-0 p-8 flex items-center justify-center overflow-hidden">
          {filteredDestinations.map((dest, idx) => {
            let topPos = '50%';
            let leftPos = '50%';

            if (dest.coordinates && typeof dest.coordinates.lat === 'number' && typeof dest.coordinates.lng === 'number') {
              // Asia/World bounds mapping
              const minLat = -15, maxLat = 55;
              const minLng = 20, maxLng = 150;
              
              const topVal = 100 - ((dest.coordinates.lat - minLat) / (maxLat - minLat)) * 100;
              const leftVal = ((dest.coordinates.lng - minLng) / (maxLng - minLng)) * 100;

              topPos = `${Math.max(12, Math.min(85, topVal))}%`;
              leftPos = `${Math.max(8, Math.min(92, leftVal))}%`;
            } else {
              const fallbackPositions = [
                { top: '38%', left: '48%' },
                { top: '42%', left: '82%' },
                { top: '35%', left: '78%' },
                { top: '60%', left: '70%' },
                { top: '48%', left: '58%' },
              ];
              const pos = fallbackPositions[idx % fallbackPositions.length];
              topPos = pos.top;
              leftPos = pos.left;
            }

            const isActive = activeDest?.id === dest.id;

            return (
              <div
                key={dest.id}
                onClick={() => setActivePinId(dest.id)}
                style={{ top: topPos, left: leftPos }}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 group"
              >
                {/* Ping animation if active */}
                {isActive && (
                  <span className="absolute -inset-2 rounded-full bg-sky-400/40 animate-ping"></span>
                )}

                <div
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full shadow-2xl transition-all duration-300 border ${
                    isActive
                      ? 'bg-sky-500 text-slate-950 border-white scale-110 font-bold z-30'
                      : 'bg-slate-950/80 backdrop-blur-md text-white border-white/20 group-hover:scale-105'
                  }`}
                >
                  <span className="text-xs">{dest.flag || '📍'}</span>
                  <span className="text-xs whitespace-nowrap font-medium">{dest.name}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Spot Details Preview Card Overlay */}
        {activeDest && (
          <div className="absolute bottom-6 left-6 right-6 md:right-auto md:w-96 glass-card rounded-2xl p-5 shadow-2xl border border-white/20 z-30 flex flex-col gap-3">
            <div className="relative h-36 rounded-xl overflow-hidden bg-surface-container-low">
              <img
                src={activeDest.imageUrl}
                alt={activeDest.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] text-tertiary font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">local_fire_department</span>
                <span>{activeDest.badge || `${activeDest.matchScore}% Match`}</span>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center">
                <h3 className="font-serif-display text-lg text-white font-semibold">
                  {activeDest.name}, {activeDest.country}
                </h3>
                <span className="text-xs text-tertiary flex items-center gap-0.5 font-semibold">
                  <span className="material-symbols-outlined text-xs">star</span>
                  {activeDest.rating}
                </span>
              </div>

              <p className="text-xs text-on-surface-variant line-clamp-2">
                {activeDest.description}
              </p>
            </div>

            <div className="flex gap-2 pt-2 border-t border-white/10">
              <button
                onClick={() => onSelectDestination(activeDest)}
                className="flex-1 bg-primary text-on-primary font-semibold text-xs py-2.5 rounded-xl hover:bg-primary-fixed transition-all flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm">auto_awesome</span>
                <span>Plan Trip Here</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
