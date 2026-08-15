import React from 'react';
import { Post } from '../../lib/types';
import { X, Copy, Share2, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface ShareMenuProps {
  post: Post;
  isOpen: boolean;
  onClose: () => void;
}

export const ShareMenu: React.FC<ShareMenuProps> = ({ post, isOpen, onClose }) => {
  const { showToast } = useAuth();
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const shareUrl = window.location.href;
  const whatsappText = `🌍 *Azraq Tour • Travel Buddies*\n\n"${post.caption}"\n\n📍 *Location:* ${post.location}\n👤 *Traveler:* @${post.profile?.username || 'traveler'}\n\n👉 *View full journey & book packages:* ${shareUrl}`;

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Azraq Tour Travel Buddies • ${post.location}`,
          text: post.caption,
          url: shareUrl,
        });
        onClose();
      } catch (err) {
        // User canceled share
      }
    } else {
      handleCopyLink();
    }
  };

  const handleWhatsAppShare = () => {
    const encoded = encodeURIComponent(whatsappText);
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encoded}`;
    window.open(whatsappUrl, '_blank');
    onClose();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    showToast('Link copied to clipboard!', 'success');
    setTimeout(() => {
      setCopied(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-sm bg-slate-900 border border-white/20 rounded-t-3xl md:rounded-3xl p-5 shadow-2xl z-10 space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Share2 className="w-4 h-4 text-emerald-400" />
            Share Travel Memory
          </h3>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-300 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-2.5">
          {/* WhatsApp Direct Share */}
          <button
            onClick={handleWhatsAppShare}
            className="w-full flex items-center gap-3 p-3 rounded-2xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 font-semibold text-xs transition-all cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center text-slate-950 font-bold shadow-md group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-lg">chat</span>
            </div>
            <div className="text-left">
              <p className="text-white font-bold text-xs">Share to WhatsApp</p>
              <p className="text-[10px] text-emerald-300/80">Send to family & travel groups</p>
            </div>
          </button>

          {/* Native Web Share */}
          {typeof navigator !== 'undefined' && 'share' in navigator && (
            <button
              onClick={handleNativeShare}
              className="w-full flex items-center gap-3 p-3 rounded-2xl bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/30 text-sky-300 font-semibold text-xs transition-all cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl bg-sky-500 flex items-center justify-center text-slate-950 font-bold shadow-md group-hover:scale-105 transition-transform">
                <Share2 className="w-4 h-4" />
              </div>
              <div className="text-left">
                <p className="text-white font-bold text-xs">Device Share</p>
                <p className="text-[10px] text-sky-300/80">AirDrop, Instagram, Messages</p>
              </div>
            </button>
          )}

          {/* Copy Link */}
          <button
            onClick={handleCopyLink}
            className="w-full flex items-center gap-3 p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 font-semibold text-xs transition-all cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-white font-bold shadow-md group-hover:scale-105 transition-transform">
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </div>
            <div className="text-left">
              <p className="text-white font-bold text-xs">
                {copied ? 'Copied to Clipboard!' : 'Copy Link'}
              </p>
              <p className="text-[10px] text-slate-400">Share anywhere with a direct URL</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
