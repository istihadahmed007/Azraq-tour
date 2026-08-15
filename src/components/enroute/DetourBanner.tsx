import React from 'react';
import { useEnRoute } from '../../context/EnRouteContext';
import { AlertTriangle, Navigation, ShieldCheck, Check, X, ArrowRight } from 'lucide-react';

export const DetourBanner: React.FC = () => {
  const { activeDetourProposal, approveDetourProposal, rejectDetourProposal, currentUser } = useEnRoute();

  if (!activeDetourProposal) return null;

  const isAdmin = currentUser.role === 'admin';

  return (
    <div className="bg-red-950/95 border-b border-red-700/80 text-white px-4 py-3 shadow-2xl backdrop-blur-md animate-in slide-in-from-top-4 duration-300">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Warning & Trigger Detail */}
        <div className="flex items-start gap-2.5">
          <div className="w-8 h-8 rounded-full bg-red-600/30 border border-red-500 flex items-center justify-center flex-shrink-0 mt-0.5 animate-pulse">
            <AlertTriangle className="w-4 h-4 text-red-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider bg-red-600 text-white px-1.5 py-0.5 rounded">
                Rule A Trigger
              </span>
              <h4 className="text-xs font-bold text-red-100">
                Caution Pin Detected on Walking Path
              </h4>
            </div>
            <p className="text-[11px] text-red-200/90 mt-0.5">
              {activeDetourProposal.reason}{' '}
              <span className="font-semibold text-emerald-300">
                Proposed Detour: {activeDetourProposal.proposedRoute.detourName}
              </span>
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 self-end md:self-center">
          <button
            onClick={rejectDetourProposal}
            className="px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-[11px] font-semibold text-slate-300 border border-slate-700 flex items-center gap-1"
          >
            <X className="w-3.5 h-3.5" />
            <span>Ignore</span>
          </button>

          {isAdmin ? (
            <button
              onClick={approveDetourProposal}
              className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-[11px] font-bold text-white shadow-lg flex items-center gap-1.5 border border-emerald-400"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Approve Detour (Broadcast to All)</span>
            </button>
          ) : (
            <span className="text-[10px] bg-slate-900/90 text-amber-300 px-2 py-1 rounded-lg border border-amber-500/40">
              Awaiting Admin Approval
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
