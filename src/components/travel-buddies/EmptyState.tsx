import React from 'react';
import { Compass, Plus, Sparkles } from 'lucide-react';

interface EmptyStateProps {
  onCreatePost: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onCreatePost }) => {
  return (
    <div className="w-full bg-slate-900/60 border border-white/10 rounded-3xl p-8 md:p-12 text-center flex flex-col items-center justify-center shadow-xl">
      <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-sky-500/20 to-indigo-500/20 border border-sky-400/30 flex items-center justify-center text-sky-400 mb-5 shadow-inner">
        <Compass className="w-10 h-10 animate-spin-slow" />
      </div>

      <h3 className="text-lg md:text-xl font-extrabold text-white mb-2">
        No travel buddies yet. Be the first to share your journey!
      </h3>
      <p className="text-xs md:text-sm text-slate-400 max-w-md mx-auto mb-6 leading-relaxed">
        Upload your scenic travel photos, drone shots from Sajek or Maldives, and connect with fellow explorers in the Azraq Tour community.
      </p>

      <button
        onClick={onCreatePost}
        className="px-6 py-3 rounded-full bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold text-xs md:text-sm shadow-lg shadow-sky-500/20 flex items-center gap-2 transition-all hover:scale-105 cursor-pointer"
      >
        <Plus className="w-4 h-4" />
        <span>Create First Travel Post</span>
      </button>
    </div>
  );
};
