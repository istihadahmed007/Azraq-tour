import React from 'react';
import { useEnRoute } from '../../context/EnRouteContext';
import { AlertOctagon, PhoneCall, ShieldAlert, X, Radio, MapPin, Check } from 'lucide-react';

export const RipcordFAB: React.FC = () => {
  const {
    isRipcordModalOpen,
    setIsRipcordModalOpen,
    emergencyActive,
    declareEmergency,
    abortItinerary,
  } = useEnRoute();

  return (
    <>
      {/* Persistent Floating Action Button */}
      <div className="fixed bottom-20 right-4 z-40">
        <button
          onClick={() => setIsRipcordModalOpen(true)}
          className={`w-13 h-13 rounded-full flex items-center justify-center shadow-2xl transition-all border-2 active:scale-95 ${
            emergencyActive
              ? 'bg-red-600 border-white text-white animate-bounce'
              : 'bg-red-700/90 hover:bg-red-600 border-red-400 text-white'
          }`}
          title="Ripcord Emergency & Abort System"
        >
          <AlertOctagon className="w-6 h-6" />
        </button>
      </div>

      {/* Ripcord Expanded Modal */}
      {isRipcordModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-red-500/50 rounded-3xl p-6 max-w-sm w-full shadow-2xl text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center">
                  <AlertOctagon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-white">The Ripcord Protocol</h3>
                  <span className="text-[10px] text-red-400 font-semibold uppercase tracking-wider">
                    Emergency & Itinerary Abort
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsRipcordModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Emergency Numbers Card */}
            <div className="bg-red-950/40 border border-red-800/60 rounded-2xl p-3.5 mb-4 space-y-2">
              <div className="text-xs font-bold text-red-300 flex items-center gap-1.5">
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Spain Local Emergency Numbers</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <a
                  href="tel:112"
                  className="bg-slate-900/90 border border-red-700/50 py-2 rounded-xl text-red-400 font-mono font-bold hover:bg-red-900/40"
                >
                  112 <span className="block text-[9px] font-normal text-slate-400">General</span>
                </a>
                <a
                  href="tel:091"
                  className="bg-slate-900/90 border border-red-700/50 py-2 rounded-xl text-red-400 font-mono font-bold hover:bg-red-900/40"
                >
                  091 <span className="block text-[9px] font-normal text-slate-400">Police</span>
                </a>
                <a
                  href="tel:061"
                  className="bg-slate-900/90 border border-red-700/50 py-2 rounded-xl text-red-400 font-mono font-bold hover:bg-red-900/40"
                >
                  061 <span className="block text-[9px] font-normal text-slate-400">Medical</span>
                </a>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2.5">
              <button
                onClick={declareEmergency}
                className="w-full bg-red-600 hover:bg-red-500 active:scale-98 text-white font-extrabold py-3 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-xl border border-red-400"
              >
                <Radio className="w-4 h-4 animate-pulse" />
                <span>Declare Emergency (Broadcast SOS Beacon)</span>
              </button>

              <button
                onClick={abortItinerary}
                className="w-full bg-slate-800 hover:bg-slate-700 active:scale-98 text-slate-200 font-bold py-2.5 rounded-2xl text-xs flex items-center justify-center gap-2 border border-slate-700"
              >
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                <span>Abort Itinerary (2h Free Time + Rally Point)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
