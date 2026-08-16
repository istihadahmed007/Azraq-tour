import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Destination } from '../types';

// Safely patch Leaflet DomUtil to avoid undefined _leaflet_pos crashes on rapid unmount / layer updates
if (typeof window !== 'undefined' && L && L.DomUtil) {
  const originalGetPosition = L.DomUtil.getPosition;
  L.DomUtil.getPosition = function (el: HTMLElement) {
    if (!el) return new L.Point(0, 0);
    try {
      return originalGetPosition.call(this, el) || new L.Point(0, 0);
    } catch {
      return new L.Point(0, 0);
    }
  };
}

interface InteractiveAsiaMapProps {
  destinations: Destination[];
  onSelectDestination: (dest: Destination) => void;
  onOpenQuotation?: (countryOrName: string) => void;
  onQuickGenerateItinerary?: (destName: string) => void;
  className?: string;
  initialRegion?: string;
  compact?: boolean;
}

// Azraq Dhaka HQ coordinates
const DHAKA_HQ = {
  lat: 23.7925,
  lng: 90.4078,
  name: 'Azraq Tours HQ (Dhaka)',
  city: 'Gulshan-2, Dhaka',
  country: 'Bangladesh',
  flag: '🇧🇩',
  address: 'Gulshan-2, Dhaka-1212, Bangladesh',
  phone: '+880 1851-172032',
};

// Visa status classification helper
export const getVisaStatusType = (
  country: string
): { type: 'voa' | 'evisa' | 'embassy'; label: string; color: string; badgeBg: string } => {
  const c = country.toLowerCase();
  if (c.includes('maldives') || c.includes('nepal') || c.includes('bhutan') || c.includes('indonesia')) {
    return { type: 'voa', label: 'Visa on Arrival / Free', color: '#10b981', badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40' };
  }
  if (c.includes('malaysia') || c.includes('singapore') || c.includes('united arab emirates') || c.includes('dubai') || c.includes('sri lanka') || c.includes('vietnam') || c.includes('turkey') || c.includes('egypt') || c.includes('georgia')) {
    return { type: 'evisa', label: 'eVisa Available', color: '#38bdf8', badgeBg: 'bg-sky-500/20 text-sky-300 border-sky-400/40' };
  }
  return { type: 'embassy', label: 'Embassy / Sticker Required', color: '#f59e0b', badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-400/40' };
};

// Region classification helper
export const getRegionForCountry = (country: string): string => {
  const c = country.toLowerCase();
  if (c.includes('bangladesh') || c.includes('maldives') || c.includes('nepal') || c.includes('bhutan') || c.includes('sri lanka') || c.includes('india')) {
    return 'South Asia';
  }
  if (c.includes('thailand') || c.includes('malaysia') || c.includes('singapore') || c.includes('indonesia') || c.includes('vietnam') || c.includes('cambodia') || c.includes('philippines')) {
    return 'Southeast Asia';
  }
  if (c.includes('japan') || c.includes('south korea') || c.includes('china') || c.includes('taiwan')) {
    return 'East Asia';
  }
  if (c.includes('united arab emirates') || c.includes('dubai') || c.includes('saudi arabia') || c.includes('qatar') || c.includes('oman') || c.includes('turkey') || c.includes('egypt') || c.includes('jordan')) {
    return 'Middle East';
  }
  return 'Asia';
};

export const InteractiveAsiaMap: React.FC<InteractiveAsiaMapProps> = ({
  destinations,
  onSelectDestination,
  onOpenQuotation,
  onQuickGenerateItinerary,
  className = '',
  initialRegion = 'All',
  compact = false,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const flightPathsLayerRef = useRef<L.LayerGroup | null>(null);

  const [selectedRegion, setSelectedRegion] = useState<string>(initialRegion);
  const [selectedVisaFilter, setSelectedVisaFilter] = useState<string>('All');
  const [showFlightCorridors, setShowFlightCorridors] = useState<boolean>(true);
  const [activeDestination, setActiveDestination] = useState<Destination | null>(null);
  const [isMapReady, setIsMapReady] = useState<boolean>(false);

  // Filtered destinations list
  const filteredList = destinations.filter((dest) => {
    const region = getRegionForCountry(dest.country);
    const visaStatus = getVisaStatusType(dest.country);

    const matchesRegion = selectedRegion === 'All' || region === selectedRegion;
    const matchesVisa =
      selectedVisaFilter === 'All' ||
      (selectedVisaFilter === 'voa' && visaStatus.type === 'voa') ||
      (selectedVisaFilter === 'evisa' && visaStatus.type === 'evisa') ||
      (selectedVisaFilter === 'embassy' && visaStatus.type === 'embassy');

    return matchesRegion && matchesVisa;
  });

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    let resizeTimer: any = null;

    try {
      // Default view centered on South/Southeast Asia
      const map = L.map(mapContainerRef.current, {
        center: [18.5, 95.0],
        zoom: compact ? 3 : 4,
        minZoom: 2,
        maxZoom: 12,
        zoomControl: false,
        attributionControl: true,
      });

      // Add Zoom Control at bottom right
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Dark Matter Map Tiles for Azraq Luxury Brand Aesthetic
      L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png',
        {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
          subdomains: 'abcd',
          maxZoom: 19,
          className: 'filter invert hue-rotate-180 brightness-75 contrast-125 saturate-50',
        }
      ).addTo(map);

      const markersGroup = L.layerGroup().addTo(map);
      const flightGroup = L.layerGroup().addTo(map);

      markersLayerRef.current = markersGroup;
      flightPathsLayerRef.current = flightGroup;
      mapInstanceRef.current = map;
      setIsMapReady(true);

      // Fix size after render
      resizeTimer = setTimeout(() => {
        if (mapInstanceRef.current) {
          try {
            mapInstanceRef.current.invalidateSize();
          } catch {
            // ignore
          }
        }
      }, 250);
    } catch (err) {
      console.error('Error initializing Leaflet map:', err);
    }

    return () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.stop();
          mapInstanceRef.current.closePopup();
          mapInstanceRef.current.off();
          mapInstanceRef.current.remove();
        } catch (e) {
          console.warn('Error during map cleanup:', e);
        }
        mapInstanceRef.current = null;
        markersLayerRef.current = null;
        flightPathsLayerRef.current = null;
      }
    };
  }, [compact]);

  // Update Markers & Flight Corridors
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current || !flightPathsLayerRef.current) return;

    const map = mapInstanceRef.current;
    const markersGroup = markersLayerRef.current;
    const flightGroup = flightPathsLayerRef.current;

    try {
      map.stop();
      markersGroup.clearLayers();
      flightGroup.clearLayers();
    } catch {
      return;
    }

    // 1. Add Dhaka Headquarters Special Gold Marker
    const dhakaIcon = L.divIcon({
      className: 'custom-dhaka-marker',
      html: `
        <div class="relative flex items-center justify-center cursor-pointer group" style="width: 44px; height: 44px;">
          <span class="absolute -inset-1 rounded-full bg-amber-400/40 animate-ping"></span>
          <div class="relative w-10 h-10 rounded-full bg-slate-950 border-2 border-amber-400 flex items-center justify-center shadow-2xl text-amber-300 font-bold text-xs group-hover:scale-110 transition-transform">
            <span class="text-sm">👑</span>
          </div>
          <div class="absolute -bottom-5 bg-slate-950/95 border border-amber-400/50 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap shadow-lg">
            Dhaka HQ
          </div>
        </div>
      `,
      iconSize: [44, 44],
      iconAnchor: [22, 22],
      popupAnchor: [0, -22],
    });

    const dhakaMarker = L.marker([DHAKA_HQ.lat, DHAKA_HQ.lng], { icon: dhakaIcon });
    dhakaMarker.bindPopup(`
      <div class="p-3 bg-slate-950 text-white rounded-2xl max-w-xs space-y-2 border border-amber-400/40">
        <div class="flex items-center gap-2">
          <span class="text-lg">🇧🇩</span>
          <div>
            <h4 class="font-bold text-sm text-amber-300">Azraq Tours & Travels HQ</h4>
            <p class="text-[11px] text-slate-300">Gulshan-2, Dhaka-1212</p>
          </div>
        </div>
        <p class="text-[11px] text-slate-300 leading-relaxed">
          Headquarters for personalized visa processing, premium air ticketing, and Asian holiday packages.
        </p>
        <div class="pt-2 border-t border-white/10 flex items-center justify-between text-[11px]">
          <span class="text-emerald-400 font-semibold flex items-center gap-1">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Open 9 AM - 8 PM
          </span>
          <a href="tel:+8801851172032" class="text-sky-300 hover:underline font-bold">+880 1851-172032</a>
        </div>
      </div>
    `);
    markersGroup.addLayer(dhakaMarker);

    // 2. Add Destination Markers
    filteredList.forEach((dest) => {
      let lat = dest.lat || dest.coordinates?.lat;
      let lng = dest.lng || dest.coordinates?.lng;

      if (typeof lat !== 'number' || typeof lng !== 'number') {
        return;
      }

      const visaStatus = getVisaStatusType(dest.country);
      const isSelected = activeDestination?.id === dest.id;

      // Custom Azraq Luxury Pin with Stylized Ring
      const customIcon = L.divIcon({
        className: 'custom-destination-marker',
        html: `
          <div class="relative flex items-center justify-center cursor-pointer group" style="width: 46px; height: 46px;">
            ${isSelected ? '<span class="absolute -inset-2 rounded-full bg-sky-400/50 animate-ping"></span>' : ''}
            <div class="relative w-9 h-9 rounded-full bg-slate-950/95 border-2 ${
              isSelected ? 'border-sky-300 scale-110 shadow-sky-500/50' : 'border-sky-400/70 hover:border-amber-300 shadow-black'
            } flex items-center justify-center shadow-xl text-white font-bold text-xs group-hover:scale-110 transition-all duration-200" style="box-shadow: 0 0 14px ${visaStatus.color}66;">
              <span class="text-sm">${dest.flag || '📍'}</span>
            </div>
            <div class="absolute -bottom-5 bg-slate-900/90 backdrop-blur-md border border-white/20 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap shadow-md group-hover:bg-sky-500 group-hover:text-slate-950 transition-colors">
              ${dest.name}
            </div>
          </div>
        `,
        iconSize: [46, 46],
        iconAnchor: [23, 23],
        popupAnchor: [0, -24],
      });

      const marker = L.marker([lat, lng], { icon: customIcon });

      // Create Custom Rich Popup Content (10-word teaser, thumbnail, quote CTA)
      const popupHtml = `
        <div class="p-3.5 bg-slate-950 text-slate-100 rounded-2xl max-w-xs space-y-2.5 font-sans border border-sky-400/40 shadow-2xl">
          <!-- Thumbnail & Badges -->
          <div class="relative h-28 w-full rounded-xl overflow-hidden bg-slate-800">
            <img src="${dest.imageUrl || dest.thumbnailUrl}" alt="${dest.name}" class="w-full h-full object-cover" />
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent"></div>
            <span class="absolute top-2 left-2 bg-slate-950/80 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-white/20">
              ${dest.flag} ${dest.country}
            </span>
            <span class="absolute top-2 right-2 ${visaStatus.badgeBg} text-[9px] font-bold px-2 py-0.5 rounded-full border shadow-sm">
              ${visaStatus.label.split(' ')[0]}
            </span>
            <span class="absolute bottom-2 right-2 bg-black/75 backdrop-blur-md text-amber-300 font-bold text-[10px] px-2 py-0.5 rounded-full flex items-center gap-0.5">
              ★ ${dest.rating || 4.9}
            </span>
          </div>

          <!-- Name & 10-Word Teaser -->
          <div class="space-y-1">
            <h4 class="font-bold text-sm text-white">${dest.name}</h4>
            <p class="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">
              ${dest.description ? dest.description.substring(0, 75) + '...' : 'Explore magnificent sights, curated luxury stays, and seamless flight connections.'}
            </p>
          </div>

          <!-- Quick Specs Row -->
          <div class="grid grid-cols-2 gap-1 text-[10px] pt-1.5 border-t border-white/10 text-slate-300">
            <span class="text-emerald-300 truncate">🗓 ${dest.bestTimeToVisit || 'Nov - Mar'}</span>
            <span class="text-sky-300 font-bold text-right truncate">${dest.priceRange || 'BDT 45k+'}</span>
          </div>

          <!-- Direct Quotation & Details Action Buttons -->
          <div class="flex items-center gap-1.5 pt-1">
            <button id="map-quote-btn-${dest.id}" class="flex-1 py-2 px-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-[11px] transition-all shadow-md flex items-center justify-center gap-1 cursor-pointer">
              <span>Quote Trip</span>
              <span class="material-symbols-outlined text-[13px]">request_quote</span>
            </button>
            <button id="map-explore-btn-${dest.id}" class="py-2 px-2.5 rounded-xl bg-sky-500/20 hover:bg-sky-400 text-sky-200 hover:text-slate-950 font-bold text-[11px] border border-sky-400/30 transition-all flex items-center justify-center cursor-pointer">
              <span>Guide</span>
            </button>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml, { maxWidth: 300, className: 'azraq-leaflet-popup' });

      // Click handler to select and attach event listeners inside popup
      marker.on('click', () => {
        setActiveDestination(dest);
        setTimeout(() => {
          const quoteBtn = document.getElementById(`map-quote-btn-${dest.id}`);
          const exploreBtn = document.getElementById(`map-explore-btn-${dest.id}`);

          if (quoteBtn) {
            quoteBtn.onclick = (e) => {
              e.preventDefault();
              e.stopPropagation();
              if (onOpenQuotation) {
                onOpenQuotation(dest.country || dest.name);
              }
            };
          }

          if (exploreBtn) {
            exploreBtn.onclick = (e) => {
              e.preventDefault();
              e.stopPropagation();
              onSelectDestination(dest);
            };
          }
        }, 100);
      });

      markersGroup.addLayer(marker);

      // 3. Draw Curved Flight Path Corridor connecting Dhaka HQ to Destination
      if (showFlightCorridors) {
        const dhakaPoint = [DHAKA_HQ.lat, DHAKA_HQ.lng];
        const destPoint = [lat, lng];

        // Approximate arc midpoint for curved flight trajectory
        const midLat = (DHAKA_HQ.lat + lat) / 2 + Math.abs(DHAKA_HQ.lng - lng) * 0.08;
        const midLng = (DHAKA_HQ.lng + lng) / 2;

        const curveCoords: [number, number][] = [
          dhakaPoint as [number, number],
          [midLat, midLng],
          destPoint as [number, number],
        ];

        const flightLine = L.polyline(curveCoords, {
          color: isSelected ? '#38bdf8' : '#0284c7',
          weight: isSelected ? 2.5 : 1.2,
          opacity: isSelected ? 0.9 : 0.4,
          dashArray: '4, 8',
        });

        flightGroup.addLayer(flightLine);
      }
    });
  }, [filteredList, showFlightCorridors, activeDestination, onOpenQuotation, onSelectDestination]);

  // Center on Dhaka HQ action
  const handleCenterDhaka = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([DHAKA_HQ.lat, DHAKA_HQ.lng], 6, { duration: 1.5 });
    }
  };

  // Reset Asia Bounds
  const handleFitAsia = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([18.5, 95.0], compact ? 3 : 4, { duration: 1.5 });
    }
  };

  // Fly to specific destination
  const handleFlyToDestination = (dest: Destination) => {
    setActiveDestination(dest);
    const lat = dest.lat || dest.coordinates?.lat;
    const lng = dest.lng || dest.coordinates?.lng;
    if (lat && lng && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([lat, lng], 6, { duration: 1.2 });
    }
  };

  const regions = ['All', 'South Asia', 'Southeast Asia', 'East Asia', 'Middle East'];

  return (
    <div className={`relative flex flex-col rounded-3xl overflow-hidden border border-sky-400/25 bg-slate-950 shadow-2xl ${className}`}>
      {/* Top Filter Bar & Control Ribbon */}
      <div className="p-3.5 sm:p-4 bg-slate-900/90 border-b border-sky-400/20 backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-3 z-10">
        {/* Left: Region Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto hide-scrollbar pb-1 sm:pb-0">
          <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
            <span className="material-symbols-outlined text-sm text-sky-400">public</span>
            <span>Region:</span>
          </span>
          {regions.map((region) => (
            <button
              key={region}
              onClick={() => setSelectedRegion(region)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all cursor-pointer min-h-[34px] flex items-center ${
                selectedRegion === region
                  ? 'bg-sky-500 text-slate-950 font-bold shadow-md shadow-sky-500/25'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white border border-white/5'
              }`}
            >
              {region}
            </button>
          ))}
        </div>

        {/* Right: Visa Requirement Filter & Map Controls */}
        <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0">
          {/* Visa Type Selector */}
          <div className="flex items-center gap-1 bg-slate-800/80 rounded-xl px-2.5 py-1 border border-white/10">
            <span className="text-[10px] text-slate-400 font-semibold uppercase">Visa:</span>
            <select
              value={selectedVisaFilter}
              onChange={(e) => setSelectedVisaFilter(e.target.value)}
              className="bg-transparent text-white text-xs font-medium focus:outline-none cursor-pointer"
            >
              <option value="All" className="bg-slate-900">All Requirements</option>
              <option value="voa" className="bg-slate-900">🟢 Visa on Arrival</option>
              <option value="evisa" className="bg-slate-900">🔵 eVisa Available</option>
              <option value="embassy" className="bg-slate-900">🟠 Embassy Sticker</option>
            </select>
          </div>

          {/* Toggle Corridors */}
          <button
            onClick={() => setShowFlightCorridors(!showFlightCorridors)}
            title="Toggle Dhaka Flight Corridors"
            className={`p-2 rounded-xl border text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer min-h-[36px] ${
              showFlightCorridors
                ? 'bg-sky-500/20 border-sky-400/40 text-sky-300'
                : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-sm">flight</span>
            <span className="hidden sm:inline">Corridors</span>
          </button>

          {/* Center Dhaka HQ */}
          <button
            onClick={handleCenterDhaka}
            title="Center on Dhaka HQ"
            className="p-2 rounded-xl bg-amber-400/20 hover:bg-amber-400/30 border border-amber-400/40 text-amber-300 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer min-h-[36px]"
          >
            <span>🇧🇩</span>
            <span className="hidden sm:inline">Dhaka HQ</span>
          </button>

          {/* Reset View */}
          <button
            onClick={handleFitAsia}
            title="Reset Map View to Full Asia"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs transition-all flex items-center cursor-pointer min-h-[36px]"
          >
            <span className="material-symbols-outlined text-sm">restart_alt</span>
          </button>
        </div>
      </div>

      {/* Main Map Container */}
      <div className="relative w-full h-[440px] sm:h-[500px] md:h-[560px]">
        {/* Leaflet Map Div */}
        <div ref={mapContainerRef} className="w-full h-full" />

        {/* Visual Corridor Legend & Pitch Floating Badge */}
        <div className="absolute bottom-4 left-4 z-[400] max-w-[260px] sm:max-w-xs bg-slate-950/90 backdrop-blur-md p-3 rounded-2xl border border-sky-400/30 shadow-2xl text-[11px] text-slate-300 space-y-1.5 pointer-events-auto">
          <div className="flex items-center gap-1.5 text-amber-300 font-bold text-xs border-b border-white/10 pb-1">
            <span className="material-symbols-outlined text-sm">connecting_airports</span>
            <span>Dhaka Flight Corridors</span>
          </div>
          <p className="text-[10px] text-slate-300 leading-snug">
            Specializing in direct & one-stop routes: <strong className="text-white">Dhaka ↔ Maldives</strong>, <strong className="text-white">Bangkok</strong>, <strong className="text-white">Dubai</strong>, and <strong className="text-white">Tokyo</strong>.
          </p>
          <div className="flex flex-wrap gap-2 pt-1 text-[9px] font-semibold text-slate-400">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400"></span> VoA / Free</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-sky-400"></span> eVisa</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400"></span> Embassy</span>
          </div>
        </div>

        {/* Floating Quick Destination Rail */}
        <div className="absolute top-4 right-4 z-[400] hidden lg:flex flex-col gap-1.5 max-h-[460px] overflow-y-auto hide-scrollbar p-2 bg-slate-950/85 backdrop-blur-md rounded-2xl border border-white/15 shadow-2xl max-w-[190px]">
          <div className="text-[10px] font-bold text-sky-400 uppercase tracking-wider px-1 pb-1 border-b border-white/10">
            15 Asian Wonders ({filteredList.length})
          </div>
          {filteredList.map((dest) => (
            <button
              key={dest.id}
              onClick={() => handleFlyToDestination(dest)}
              className={`px-2.5 py-1.5 rounded-xl text-left text-xs transition-all flex items-center justify-between gap-1.5 cursor-pointer ${
                activeDestination?.id === dest.id
                  ? 'bg-sky-500 text-slate-950 font-bold'
                  : 'bg-white/5 hover:bg-white/10 text-slate-200'
              }`}
            >
              <span className="truncate">{dest.flag} {dest.name}</span>
              <span className="text-[10px] opacity-75 shrink-0">★ {dest.rating || 4.9}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
