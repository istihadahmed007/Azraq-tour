import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEnRoute } from '../../context/EnRouteContext';
import { SafetyPinCategory } from '../../types';
import { Shield, AlertTriangle, Flame, Sparkles, Plus, Navigation, Clock, Users } from 'lucide-react';

interface SentinelMapProps {
  onPinDropRequest?: (latLng: { lat: number; lng: number }) => void;
}

export const SentinelMap: React.FC<SentinelMapProps> = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersGroupRef = useRef<L.LayerGroup | null>(null);
  const routePolylineRef = useRef<L.Polyline | null>(null);
  const heatmapLayerRef = useRef<L.LayerGroup | null>(null);

  const {
    trip,
    members,
    safetyPins,
    dropSafetyPin,
    activeDetourProposal,
    approveDetourProposal,
  } = useEnRoute();

  const [selectedPinCategory, setSelectedPinCategory] = useState<SafetyPinCategory>('Pickpockets');
  const [pinDescription, setPinDescription] = useState('');
  const [pendingDropLatLng, setPendingDropLatLng] = useState<{ lat: number; lng: number } | null>(null);
  const [isDropPinModalOpen, setIsDropPinModalOpen] = useState(false);
  const [mapStyle, setMapStyle] = useState<'streets' | 'dark' | 'satellite'>('dark');

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [trip.centroidLatLng.lat, trip.centroidLatLng.lng],
        zoom: 15,
        zoomControl: false,
      });

      // Add Tile Layer
      const tileUrl =
        mapStyle === 'dark'
          ? 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
          : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

      L.tileLayer(tileUrl, {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        maxZoom: 19,
      }).addTo(map);

      L.control.zoom({ position: 'topright' }).addTo(map);

      markersGroupRef.current = L.layerGroup().addTo(map);
      heatmapLayerRef.current = L.layerGroup().addTo(map);

      // Long press / click to drop pin
      map.on('click', (e: L.LeafletMouseEvent) => {
        setPendingDropLatLng({ lat: e.latlng.lat, lng: e.latlng.lng });
        setIsDropPinModalOpen(true);
      });

      mapInstanceRef.current = map;

      // Invalidate map size so tiles render immediately without edge glitches
      setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      }, 100);
    }

    const handleResize = () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      // Clean up when unmounting
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [trip.centroidLatLng]);

  // Update Markers, Heatmap & Routes whenever state changes
  useEffect(() => {
    if (!mapInstanceRef.current || !markersGroupRef.current) return;

    markersGroupRef.current.clearLayers();
    if (heatmapLayerRef.current) heatmapLayerRef.current.clearLayers();

    // 1. Render Group Avatars
    members.forEach((member) => {
      const avatarHtml = `
        <div class="relative group cursor-pointer animate-pulse">
          <div class="w-10 h-10 rounded-full border-2 border-white shadow-lg overflow-hidden ring-2" style="ring-color: ${member.color || '#38bdf8'};">
            <img src="${member.avatar}" class="w-full h-full object-cover" alt="${member.displayName}" />
          </div>
          <div class="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white"></div>
          <div class="absolute top-11 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-slate-900/90 backdrop-blur-md text-[10px] font-medium text-white rounded-md whitespace-nowrap shadow-md pointer-events-none">
            ${member.displayName.split(' ')[0]} ${member.role === 'admin' ? '👑' : ''}
          </div>
        </div>
      `;

      const avatarIcon = L.divIcon({
        className: 'custom-avatar-marker',
        html: avatarHtml,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      });

      L.marker([member.currentLatLng.lat, member.currentLatLng.lng], { icon: avatarIcon })
        .addTo(markersGroupRef.current!)
        .bindPopup(`
          <div class="p-2 text-slate-900">
            <div class="font-bold text-sm">${member.displayName}</div>
            <div class="text-xs text-slate-500">Role: ${member.role.toUpperCase()}</div>
            <div class="text-xs text-slate-500">Battery: ${member.batteryLevel}% 🔋</div>
            <div class="text-xs text-emerald-600 font-semibold mt-1">Live Centroid Tracking</div>
          </div>
        `);
    });

    // 2. Render Safety Pins (Sentinel Map with TTL)
    safetyPins.forEach((pin) => {
      const isRedRisk = ['Caution', 'Pickpockets', 'Suspicious Activity'].includes(pin.category);
      const isYellowRisk = ['Heavy Crowds', 'Scam Alert'].includes(pin.category);
      const pinColor = isRedRisk ? '#ef4444' : isYellowRisk ? '#f59e0b' : '#10b981';

      // Risk Heatmap Circle around Pin (200m Sentinel radius)
      if (heatmapLayerRef.current) {
        L.circle([pin.latLng.lat, pin.latLng.lng], {
          radius: 120,
          color: pinColor,
          fillColor: pinColor,
          fillOpacity: isRedRisk ? 0.25 : 0.15,
          weight: 1,
          dashArray: '4, 6',
        }).addTo(heatmapLayerRef.current);
      }

      const pinHtml = `
        <div class="relative group cursor-pointer transform -translate-x-1/2 -translate-y-full hover:scale-110 transition-transform">
          <div class="flex items-center justify-center w-8 h-8 rounded-full shadow-lg text-white font-bold text-xs" style="background-color: ${pinColor}; border: 2px solid white;">
            ${isRedRisk ? '⚠️' : isYellowRisk ? '👥' : '✨'}
          </div>
          <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[6px]" style="border-t-color: ${pinColor}"></div>
        </div>
      `;

      const pinIcon = L.divIcon({
        className: 'custom-pin-marker',
        html: pinHtml,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
      });

      const remainingMins = Math.max(
        0,
        Math.round((new Date(pin.expiresAt).getTime() - Date.now()) / 60000)
      );

      L.marker([pin.latLng.lat, pin.latLng.lng], { icon: pinIcon })
        .addTo(markersGroupRef.current!)
        .bindPopup(`
          <div class="p-2 text-slate-900 min-w-[200px]">
            <div class="flex items-center gap-1.5 font-bold text-xs ${isRedRisk ? 'text-red-600' : 'text-amber-600'}">
              <span>⚠️</span> ${pin.category}
            </div>
            <p class="text-xs text-slate-700 mt-1">${pin.description}</p>
            <div class="flex items-center justify-between text-[10px] text-slate-500 mt-2 pt-1 border-t border-slate-200">
              <span>By ${pin.userName}</span>
              <span class="font-medium text-red-500">⏱️ ${remainingMins}m TTL</span>
            </div>
          </div>
        `);
    });

    // 3. Render Active Walking Route & Proposed Detour Route
    if (routePolylineRef.current) {
      routePolylineRef.current.remove();
      routePolylineRef.current = null;
    }

    if (trip.activeRoute && trip.activeRoute.coordinates.length > 0) {
      // Primary Active Route (Cyan/Sky)
      routePolylineRef.current = L.polyline(trip.activeRoute.coordinates, {
        color: '#0284c7',
        weight: 5,
        opacity: 0.85,
        dashArray: undefined,
      }).addTo(markersGroupRef.current!);
    }

    // If there is an active Proposed Detour (Rule A), display dashed detour in Emerald
    if (activeDetourProposal) {
      L.polyline(activeDetourProposal.proposedRoute.polyline, {
        color: '#10b981',
        weight: 5,
        opacity: 0.9,
        dashArray: '8, 8',
      })
        .addTo(markersGroupRef.current!)
        .bindTooltip('Proposed Safe Detour (+6m)', { permanent: true, direction: 'top' });
    }
  }, [members, safetyPins, trip.activeRoute, activeDetourProposal]);

  const handleCreatePin = () => {
    if (!pendingDropLatLng) return;
    dropSafetyPin(selectedPinCategory, pinDescription || `Reported ${selectedPinCategory}`, pendingDropLatLng);
    setIsDropPinModalOpen(false);
    setPinDescription('');
    setPendingDropLatLng(null);
  };

  return (
    <div className="relative w-full h-full min-h-0 bg-slate-900 overflow-hidden isolate">
      {/* Map Element */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Floating Map Legend & Risk Status */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/60 rounded-xl px-3 py-2 text-white shadow-xl flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-xs font-semibold tracking-wide uppercase text-slate-300">The Sentinel</span>
          </div>
          <span className="text-xs text-slate-400">|</span>
          <div className="flex items-center gap-1.5 text-xs text-slate-200">
            <Users className="w-3.5 h-3.5 text-sky-400" />
            <span>{members.length} Live Avatars</span>
          </div>
        </div>

        {/* Heatmap summary pill */}
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-lg px-2.5 py-1 text-[11px] text-slate-300 flex items-center gap-2">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <span>Caution (200m radius)</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Vibe</span>
          </div>
        </div>
      </div>

      {/* Quick Drop Pin CTA Button (Floating Action) */}
      <div className="absolute bottom-4 right-4 z-10">
        <button
          onClick={() => {
            // Default drop at current centroid or user location
            setPendingDropLatLng({
              lat: trip.centroidLatLng.lat + 0.001,
              lng: trip.centroidLatLng.lng + 0.001,
            });
            setIsDropPinModalOpen(true);
          }}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-500 active:scale-95 text-white text-xs font-bold px-3.5 py-2.5 rounded-full shadow-2xl transition-all border border-red-400/40"
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Drop Pin (Rule A)</span>
        </button>
      </div>

      {/* Modal: Drop Safety Pin */}
      {isDropPinModalOpen && pendingDropLatLng && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 max-w-sm w-full shadow-2xl text-white">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 font-bold text-sm text-slate-100">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                <span>Drop Temporal Safety Pin</span>
              </div>
              <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded font-mono">2h TTL</span>
            </div>

            <p className="text-xs text-slate-400 mb-3">
              Drop street intelligence. If Caution is within 200m of the walking route, Rule A auto-generates a Gothic Quarter detour!
            </p>

            {/* Category Selectors */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              {(
                [
                  'Pickpockets',
                  'Caution',
                  'Heavy Crowds',
                  'Suspicious Activity',
                  'Peaceful Demo',
                  'Beautiful Vibe',
                ] as SafetyPinCategory[]
              ).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedPinCategory(cat)}
                  className={`px-2.5 py-2 rounded-xl text-xs font-medium text-left border transition-all ${
                    selectedPinCategory === cat
                      ? 'bg-red-600/20 border-red-500 text-red-300 font-bold'
                      : 'bg-slate-800/60 border-slate-700/50 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {cat === 'Pickpockets' && '🚨 '}
                  {cat === 'Caution' && '⚠️ '}
                  {cat === 'Heavy Crowds' && '👥 '}
                  {cat === 'Suspicious Activity' && '👁️ '}
                  {cat === 'Beautiful Vibe' && '✨ '}
                  {cat === 'Peaceful Demo' && '📢 '}
                  {cat}
                </button>
              ))}
            </div>

            {/* Description input */}
            <input
              type="text"
              placeholder="e.g. Distraction scam spotted near Liceu metro"
              value={pinDescription}
              onChange={(e) => setPinDescription(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500 mb-4"
            />

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsDropPinModalOpen(false)}
                className="flex-1 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreatePin}
                className="flex-1 px-3 py-2 rounded-xl bg-red-600 hover:bg-red-500 active:scale-95 text-xs font-bold text-white shadow-lg"
              >
                Broadcast Pin
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
