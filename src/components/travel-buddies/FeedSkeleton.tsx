import React from 'react';

export const FeedSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 w-full">
      {[1, 2].map((i) => (
        <div
          key={i}
          className="bg-slate-900/70 border border-white/10 rounded-3xl overflow-hidden shadow-xl animate-pulse"
        >
          {/* Header */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/10" />
              <div className="space-y-2">
                <div className="w-24 h-3 bg-white/10 rounded" />
                <div className="w-16 h-2.5 bg-white/10 rounded" />
              </div>
            </div>
            <div className="w-6 h-6 rounded-full bg-white/10" />
          </div>

          {/* Media Skeleton */}
          <div className="w-full aspect-[16/10] bg-white/5" />

          {/* Action Bar */}
          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex gap-4">
                <div className="w-12 h-6 bg-white/10 rounded-full" />
                <div className="w-12 h-6 bg-white/10 rounded-full" />
                <div className="w-8 h-6 bg-white/10 rounded-full" />
              </div>
              <div className="w-6 h-6 bg-white/10 rounded-full" />
            </div>
            <div className="h-3 bg-white/10 rounded w-4/5" />
            <div className="h-3 bg-white/10 rounded w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
};
