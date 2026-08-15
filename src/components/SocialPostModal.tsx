import React, { useState } from 'react';
import { BlogPost, PostComment } from '../types';
import {
  X,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Send,
  MapPin,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  ExternalLink,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Award,
  Vote,
  HelpCircle,
} from 'lucide-react';

interface SocialPostModalProps {
  post: BlogPost | null;
  isOpen: boolean;
  onClose: () => void;
  onLike: (id: string) => void;
  onOpenFlightQuote?: (dest?: string) => void;
  onOpenVisaQuote?: (country?: string) => void;
}

export const SocialPostModal: React.FC<SocialPostModalProps> = ({
  post,
  isOpen,
  onClose,
  onLike,
  onOpenFlightQuote,
  onOpenVisaQuote,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post?.likesCount || 0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [comments, setComments] = useState<PostComment[]>(post?.commentsList || []);
  const [newCommentText, setNewCommentText] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [selectedPollOption, setSelectedPollOption] = useState<string | null>(null);
  const [pollVotes, setPollVotes] = useState<Record<string, number>>({});
  const [isPlayingReel, setIsPlayingReel] = useState(true);

  // Sync state with post when opened
  React.useEffect(() => {
    if (post) {
      setCurrentImageIndex(0);
      setIsLiked(post.isLiked || false);
      setLikesCount(post.likesCount || 0);
      setIsBookmarked(post.isBookmarked || false);
      setComments(post.commentsList || []);
      setNewCommentText('');
      setIsPlayingReel(true);

      if (post.pollData) {
        const initialVotes: Record<string, number> = {};
        post.pollData.options.forEach((opt) => {
          initialVotes[opt.id] = opt.votes;
        });
        setPollVotes(initialVotes);
      }
    }
  }, [post]);

  if (!isOpen || !post) return null;

  const imagesList = post.images && post.images.length > 0 ? post.images : [post.coverImage];

  const handleLikeToggle = () => {
    if (isLiked) {
      setIsLiked(false);
      setLikesCount((prev) => Math.max(0, prev - 1));
    } else {
      setIsLiked(true);
      setLikesCount((prev) => prev + 1);
      onLike(post.id);
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const newComment: PostComment = {
      id: `c_${Date.now()}`,
      author: 'You (Traveler)',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TravelerGuest',
      text: newCommentText.trim(),
      timeAgo: 'Just now',
      likes: 1,
    };

    setComments((prev) => [...prev, newComment]);
    setNewCommentText('');
  };

  const handleVotePoll = (optionId: string) => {
    if (selectedPollOption) return; // already voted
    setSelectedPollOption(optionId);
    setPollVotes((prev) => ({
      ...prev,
      [optionId]: (prev[optionId] || 0) + 1,
    }));
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCtaClick = () => {
    if (post.ctaType === 'quote_flight' && onOpenFlightQuote) {
      onClose();
      onOpenFlightQuote(post.location || post.title);
    } else if (post.ctaType === 'quote_visa' && onOpenVisaQuote) {
      onClose();
      onOpenVisaQuote(post.location || post.title);
    } else {
      const msg = `Hello Azraq Tours! I saw your post "${post.title}". I want to book/inquire about packages!`;
      window.open(`https://wa.me/8801851172032?text=${encodeURIComponent(msg)}`, '_blank');
    }
  };

  const totalPollVotes: number = Object.values(pollVotes).reduce<number>((a, b) => a + Number(b || 0), 0);

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 animate-fade-in">
      {/* Backdrop click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Close button top right */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 sm:top-6 sm:right-6 z-50 p-2.5 rounded-full bg-black/70 hover:bg-white/20 text-white transition-all cursor-pointer shadow-lg"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Main Instagram Style Post Container */}
      <div
        className="relative z-10 w-full max-w-5xl max-h-[90vh] bg-slate-900 border border-white/15 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* LEFT COLUMN: Media Viewer (80%+ focus) */}
        <div className="relative md:w-3/5 bg-black flex items-center justify-center min-h-[320px] md:min-h-[580px] overflow-hidden group">
          {/* Main Image or Reel simulation */}
          <img
            src={imagesList[currentImageIndex]}
            alt={post.title}
            className="w-full h-full object-cover max-h-[55vh] md:max-h-[85vh]"
          />

          {/* Reel Play/Pause Overlay */}
          {post.mediaType === 'reel' && (
            <div className="absolute inset-0 bg-black/30 flex flex-col justify-between p-4 pointer-events-none">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-black/60 text-white text-xs font-bold flex items-center gap-1.5 backdrop-blur-md">
                  <Play className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <span>Reel • 0:15</span>
                </span>
              </div>

              {/* Reel Text Overlay Banner */}
              <div className="p-3 rounded-2xl bg-black/60 backdrop-blur-md border border-white/20">
                <p className="text-amber-300 font-extrabold text-sm sm:text-base font-serif-display drop-shadow-md">
                  {post.headlineOverlay || 'POV: You just landed in Dubai 🛬✨'}
                </p>
                <p className="text-xs text-white/80 mt-0.5">Sound: Azraq Travel Lounge Beats 🎵</p>
              </div>
            </div>
          )}

          {/* Carousel Next / Prev Controls */}
          {imagesList.length > 1 && (
            <>
              {currentImageIndex > 0 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex((prev) => prev - 1);
                  }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white transition-all cursor-pointer shadow-md"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}

              {currentImageIndex < imagesList.length - 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex((prev) => prev + 1);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white transition-all cursor-pointer shadow-md"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}

              {/* Photo Indicator Dots */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/50 px-2.5 py-1 rounded-full backdrop-blur-md">
                {imagesList.map((_, idx) => (
                  <span
                    key={idx}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${
                      idx === currentImageIndex ? 'bg-amber-400 w-4' : 'bg-white/40'
                    }`}
                  />
                ))}
              </div>

              {/* Counter Badge */}
              <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/60 text-white text-xs font-bold backdrop-blur-md">
                {currentImageIndex + 1}/{imagesList.length}
              </div>
            </>
          )}
        </div>

        {/* RIGHT COLUMN: Author, Caption, Comments, Actions & CTA */}
        <div className="md:w-2/5 flex flex-col justify-between bg-slate-900 border-t md:border-t-0 md:border-l border-white/10 overflow-y-auto max-h-[50vh] md:max-h-[85vh]">
          {/* Header: Author & Location */}
          <div className="p-4 border-b border-white/10 flex items-center justify-between sticky top-0 bg-slate-900/95 backdrop-blur-md z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full p-0.5 bg-gradient-to-tr from-amber-400 via-rose-500 to-sky-400">
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="w-full h-full rounded-full object-cover border border-slate-900"
                />
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-white tracking-tight">
                    {post.author.handle || post.author.name}
                  </span>
                  {post.author.verified && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 fill-sky-400" />
                  )}
                </div>
                {post.location && (
                  <div className="flex items-center gap-1 text-[11px] text-sky-300">
                    <MapPin className="w-3 h-3" />
                    <span>{post.location}</span>
                  </div>
                )}
              </div>
            </div>

            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
              {post.category}
            </span>
          </div>

          {/* Middle Body: Caption, Polls, Testimonials & Comments */}
          <div className="p-4 space-y-4 flex-1 overflow-y-auto">
            {/* Post Title & Headline */}
            <div>
              <h2 className="text-lg font-bold text-white font-serif-display leading-snug">
                {post.title}
              </h2>
            </div>

            {/* Caption Text (Micro-content <150 words) */}
            <div className="text-xs sm:text-sm text-slate-200 whitespace-pre-line leading-relaxed">
              {post.content}
            </div>

            {/* INTERACTIVE POLL (If Poll Post) */}
            {post.pollData && (
              <div className="p-4 rounded-2xl bg-white/5 border border-sky-400/30 space-y-3">
                <div className="flex items-center gap-2 text-sky-300 font-bold text-xs">
                  <Vote className="w-4 h-4" />
                  <span>{post.pollData.question}</span>
                </div>

                <div className="space-y-2">
                  {post.pollData.options.map((opt) => {
                    const votes = pollVotes[opt.id] || opt.votes;
                    const percent = totalPollVotes > 0 ? Math.round((votes / totalPollVotes) * 100) : 0;
                    const isSelected = selectedPollOption === opt.id;

                    return (
                      <button
                        key={opt.id}
                        onClick={() => handleVotePoll(opt.id)}
                        className={`w-full p-3 rounded-xl border text-left transition-all relative overflow-hidden flex items-center justify-between text-xs font-semibold cursor-pointer ${
                          isSelected
                            ? 'border-amber-400 bg-amber-400/20 text-white'
                            : 'border-white/15 bg-white/5 text-slate-200 hover:bg-white/10 hover:border-white/30'
                        }`}
                      >
                        {/* Vote progress fill bar */}
                        <div
                          className="absolute left-0 top-0 bottom-0 bg-sky-500/25 transition-all duration-500 pointer-events-none"
                          style={{ width: `${percent}%` }}
                        />

                        <span className="relative z-10 flex items-center gap-2">
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                          <span>{opt.text}</span>
                        </span>

                        <span className="relative z-10 font-bold text-amber-300 shrink-0">
                          {percent}%
                        </span>
                      </button>
                    );
                  })}
                </div>

                <p className="text-[10px] text-slate-400 text-center font-medium">
                  {totalPollVotes.toLocaleString()} total votes • Tap option to cast your vote
                </p>
              </div>
            )}

            {/* TESTIMONIAL CLIENT META (If Testimonial Post) */}
            {post.testimonialMeta && (
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-400/30 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-emerald-300">
                    Verified Client: {post.testimonialMeta.clientName}
                  </p>
                  <p className="text-[11px] text-slate-300">{post.testimonialMeta.trip}</p>
                </div>
                <div className="flex text-amber-400 text-xs">
                  {'★'.repeat(post.testimonialMeta.rating)}
                </div>
              </div>
            )}

            {/* Hashtags Line */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {post.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="text-xs text-sky-400 hover:text-sky-300 font-medium cursor-pointer"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Comments Stream */}
            <div className="pt-3 border-t border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Comments ({comments.length})
                </span>
                <span className="text-[11px] text-slate-400">{post.publishedAt}</span>
              </div>

              <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex items-start gap-2.5 text-xs">
                    <img
                      src={comment.avatar}
                      alt={comment.author}
                      className="w-7 h-7 rounded-full object-cover border border-white/10 shrink-0 mt-0.5"
                    />
                    <div className="flex-1 bg-white/5 p-2.5 rounded-2xl border border-white/5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white">{comment.author}</span>
                        <span className="text-[10px] text-slate-400">{comment.timeAgo}</span>
                      </div>
                      <p className="text-slate-200 mt-1 leading-relaxed">{comment.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Actions, Add Comment & Conversion CTA */}
          <div className="p-4 border-t border-white/10 space-y-3 bg-slate-950/80">
            {/* Social Action Bar (Like, Comment, Share, Bookmark) */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Like Button */}
                <button
                  onClick={handleLikeToggle}
                  className={`flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer ${
                    isLiked ? 'text-rose-500 scale-110' : 'text-slate-300 hover:text-rose-400'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isLiked ? 'fill-rose-500' : ''}`} />
                  <span>{likesCount}</span>
                </button>

                {/* Comment count */}
                <div className="flex items-center gap-1.5 text-xs text-slate-300">
                  <MessageCircle className="w-5 h-5" />
                  <span>{comments.length}</span>
                </div>

                {/* Share */}
                <button
                  onClick={handleShare}
                  className="text-slate-300 hover:text-white transition-colors cursor-pointer"
                  title="Copy link to post"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>

              {/* Bookmark */}
              <button
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={`transition-colors cursor-pointer ${
                  isBookmarked ? 'text-amber-400' : 'text-slate-300 hover:text-amber-400'
                }`}
                title="Save Post"
              >
                <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-amber-400' : ''}`} />
              </button>
            </div>

            {copiedLink && (
              <p className="text-[11px] text-center text-emerald-400 font-bold">
                ✓ Link copied to clipboard!
              </p>
            )}

            {/* Add Comment Input Form */}
            <form onSubmit={handleAddComment} className="relative flex items-center">
              <input
                type="text"
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                placeholder="Add a comment or inquiry..."
                className="w-full bg-white/10 border border-white/15 rounded-full py-2 pl-4 pr-12 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-amber-400"
              />
              <button
                type="submit"
                className="absolute right-1.5 p-1.5 rounded-full bg-sky-500 text-slate-950 font-bold hover:bg-sky-400 transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>

            {/* DIRECT BOOKING / INQUIRY CTA BUTTON */}
            <button
              onClick={handleCtaClick}
              className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-400 to-emerald-400 hover:from-amber-300 hover:to-emerald-300 text-slate-950 font-black text-xs sm:text-sm transition-all transform active:scale-95 shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{post.ctaText || '📲 Inquire on WhatsApp'}</span>
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
