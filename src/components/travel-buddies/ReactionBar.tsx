import React, { useState } from 'react';
import { ReactionType } from '../../lib/types';
import { Heart, Flame, Sparkles, ThumbsUp } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ReactionBarProps {
  currentReaction?: ReactionType | null;
  likesCount: number;
  commentsCount: number;
  isSaved?: boolean;
  onReact: (type: ReactionType) => void;
  onOpenComments: () => void;
  onToggleSave: () => void;
  onShare: () => void;
}

export const ReactionBar: React.FC<ReactionBarProps> = ({
  currentReaction,
  likesCount,
  commentsCount,
  isSaved,
  onReact,
  onOpenComments,
  onToggleSave,
  onShare,
}) => {
  const [showPicker, setShowPicker] = useState(false);

  const getReactionIcon = (type: ReactionType | null | undefined) => {
    switch (type) {
      case 'love':
        return <Heart className="w-5 h-5 fill-rose-500 text-rose-500 animate-bounce-subtle" />;
      case 'fire':
        return <Flame className="w-5 h-5 fill-amber-500 text-amber-500 animate-bounce-subtle" />;
      case 'wow':
        return <Sparkles className="w-5 h-5 text-purple-400 animate-bounce-subtle" />;
      case 'like':
        return <ThumbsUp className="w-5 h-5 fill-sky-500 text-sky-500 animate-bounce-subtle" />;
      default:
        return <Heart className="w-5 h-5 text-slate-300 group-hover:text-rose-400 transition-colors" />;
    }
  };

  const handleQuickReact = () => {
    // If already has a reaction, toggle off by sending current, else default to 'love'
    const targetType = currentReaction ? currentReaction : 'love';
    if (!currentReaction) {
      confetti({
        particleCount: 20,
        spread: 40,
        origin: { y: 0.8 },
      });
    }
    onReact(targetType);
  };

  const handleSelectReaction = (type: ReactionType) => {
    setShowPicker(false);
    confetti({
      particleCount: 25,
      spread: 45,
      origin: { y: 0.8 },
    });
    onReact(type);
  };

  return (
    <div className="relative w-full px-4 py-3 flex items-center justify-between border-t border-white/5 select-none">
      {/* Left Action Buttons */}
      <div className="flex items-center gap-5">
        {/* Reaction Trigger with Long-Press / Hover Picker */}
        <div
          className="relative flex items-center gap-1.5"
          onMouseEnter={() => setShowPicker(true)}
          onMouseLeave={() => setShowPicker(false)}
        >
          {/* Reaction Picker Popover */}
          {showPicker && (
            <div className="absolute -top-12 left-0 bg-slate-900/95 backdrop-blur-xl border border-white/20 px-3 py-1.5 rounded-full shadow-2xl flex items-center gap-3 z-30 animate-in fade-in zoom-in-90 duration-150">
              <button
                onClick={() => handleSelectReaction('love')}
                className="hover:scale-125 transition-transform text-lg"
                title="Love"
              >
                ❤️
              </button>
              <button
                onClick={() => handleSelectReaction('fire')}
                className="hover:scale-125 transition-transform text-lg"
                title="Fire"
              >
                🔥
              </button>
              <button
                onClick={() => handleSelectReaction('wow')}
                className="hover:scale-125 transition-transform text-lg"
                title="Wow"
              >
                😮
              </button>
              <button
                onClick={() => handleSelectReaction('like')}
                className="hover:scale-125 transition-transform text-lg"
                title="Like"
              >
                👍
              </button>
            </div>
          )}

          <button
            onClick={handleQuickReact}
            className="flex items-center gap-1.5 text-slate-300 group cursor-pointer"
          >
            {getReactionIcon(currentReaction)}
            <span
              className={`text-xs font-bold ${
                currentReaction ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
              }`}
            >
              {likesCount}
            </span>
          </button>
        </div>

        {/* Comments Button */}
        <button
          onClick={onOpenComments}
          className="flex items-center gap-1.5 text-slate-400 hover:text-sky-300 transition-colors group cursor-pointer"
        >
          <span className="material-symbols-outlined text-[22px] group-hover:scale-110 transition-transform">
            chat_bubble
          </span>
          <span className="text-xs font-bold text-slate-400 group-hover:text-slate-200">
            {commentsCount}
          </span>
        </button>

        {/* Share Button */}
        <button
          onClick={onShare}
          className="flex items-center gap-1.5 text-slate-400 hover:text-emerald-400 transition-colors group cursor-pointer"
          title="Share on WhatsApp or copy link"
        >
          <span className="material-symbols-outlined text-[22px] group-hover:scale-110 transition-transform">
            share
          </span>
        </button>
      </div>

      {/* Right Bookmark / Save Button */}
      <button
        onClick={onToggleSave}
        className="text-slate-400 hover:text-amber-400 transition-colors cursor-pointer"
        title={isSaved ? 'Remove from saved' : 'Save post to collection'}
      >
        <span
          className={`material-symbols-outlined text-[22px] ${
            isSaved ? 'text-amber-400 fill-current' : ''
          }`}
        >
          {isSaved ? 'bookmark_added' : 'bookmark'}
        </span>
      </button>
    </div>
  );
};
