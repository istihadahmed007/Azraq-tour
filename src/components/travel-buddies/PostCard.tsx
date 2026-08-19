import React, { useState } from 'react';
import { Post, ReactionType } from '../../lib/types';
import { useAuth } from '../../context/AuthContext';
import { togglePostReaction, toggleSavePost } from '../../lib/queries';
import { PostMedia } from './PostMedia';
import { ReactionBar } from './ReactionBar';
import { CommentsSheet } from './CommentsSheet';
import { ShareMenu } from './ShareMenu';
import {
  MoreVertical,
  MapPin,
  CheckCircle2,
  Trash2,
  Flag,
  EyeOff,
  Copy,
} from 'lucide-react';

interface PostCardProps {
  post: Post;
  onHashtagClick?: (tag: string) => void;
  onDeletePost?: (postId: string) => void;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  onHashtagClick,
  onDeletePost,
}) => {
  const { user, isGuest, openAuthModal, showToast } = useAuth();

  // Local state for optimistic reaction & save updates
  const [currentReaction, setCurrentReaction] = useState<ReactionType | null>(
    post.user_reaction || null
  );
  const [likesCount, setLikesCount] = useState<number>(post.likes_count || 0);
  const [commentsCount, setCommentsCount] = useState<number>(post.comments_count || 0);
  const [isSaved, setIsSaved] = useState<boolean>(post.is_saved || false);

  // Modals
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  const isAuthor = Boolean(user && user.uid === post.user_id);
  const isAzraqOfficial = post.user_id === 'azraq_official_id' || post.profile?.username === 'azraq_official';

  if (isHidden) return null;

  const handleReact = async (type: ReactionType) => {
    if (isGuest || !user) {
      openAuthModal('login');
      return;
    }

    const prevReaction = currentReaction;
    const prevCount = likesCount;

    // Optimistic calculation
    const isRemoving = currentReaction === type;
    const nextReaction = isRemoving ? null : type;
    const delta = isRemoving ? -1 : currentReaction ? 0 : 1;

    setCurrentReaction(nextReaction);
    setLikesCount((c) => Math.max(0, c + delta));

    try {
      await togglePostReaction({
        postId: post.id,
        userId: user.uid,
        reactionType: type,
        currentReaction: prevReaction,
      });
    } catch (err) {
      // Rollback on failure
      setCurrentReaction(prevReaction);
      setLikesCount(prevCount);
      showToast('Could not update reaction.', 'error');
    }
  };

  const handleToggleSave = async () => {
    if (isGuest || !user) {
      openAuthModal('login');
      return;
    }

    const prevSaved = isSaved;
    setIsSaved(!prevSaved);
    showToast(!prevSaved ? 'Post saved to your collection!' : 'Removed from saved collection.', 'info');

    try {
      await toggleSavePost({
        postId: post.id,
        userId: user.uid,
        isCurrentlySaved: prevSaved,
      });
    } catch (err) {
      setIsSaved(prevSaved);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setShowMenu(false);
    showToast('Post link copied to clipboard!', 'success');
  };

  // Render caption with clickable hashtags
  const renderCaptionWithHashtags = (text: string) => {
    const parts = text.split(/(#[a-zA-Z0-9_\u0980-\u09FF]+)/g);
    return parts.map((part, index) => {
      if (part.startsWith('#')) {
        return (
          <button
            key={index}
            onClick={() => onHashtagClick && onHashtagClick(part)}
            className="text-sky-400 hover:text-sky-300 font-semibold transition-colors cursor-pointer mr-1"
          >
            {part}
          </button>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  // Format relative timestamp
  const formatTimeAgo = (dateString: string) => {
    try {
      const diffMs = Date.now() - new Date(dateString).getTime();
      const diffMinutes = Math.floor(diffMs / 60000);
      if (diffMinutes < 1) return 'Just now';
      if (diffMinutes < 60) return `${diffMinutes}m ago`;
      const diffHours = Math.floor(diffMinutes / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays}d ago`;
    } catch {
      return 'Recently';
    }
  };

  const authorAvatar =
    post.profile?.photoURL ||
    post.profile?.avatar_url ||
    (post as any).authorAvatar ||
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
      post.profile?.username || post.profile?.full_name || 'traveler'
    )}`;

  const resolvedMediaUrls: string[] =
    Array.isArray(post.media_urls) && post.media_urls.length > 0
      ? post.media_urls
      : (post as any).imageUrl
      ? [(post as any).imageUrl]
      : (post as any).image_url
      ? [(post as any).image_url]
      : [];

  return (
    <article className="bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden shadow-xl transition-all hover:border-white/20">
      {/* Post Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={authorAvatar}
              alt={post.profile?.username || 'Traveler'}
              className="w-10 h-10 rounded-full object-cover border border-white/15 shadow-sm"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                  post.profile?.username || 'traveler'
                )}`;
              }}
            />
            {isAzraqOfficial && (
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-amber-400 rounded-full flex items-center justify-center text-[10px] text-slate-950 font-bold border border-slate-900">
                ★
              </span>
            )}
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs md:text-sm font-bold text-white">
                @{post.profile?.username || 'traveler'}
              </span>
              {(post.profile?.is_verified || isAzraqOfficial) && (
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              )}
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              {post.location && (
                <span className="flex items-center gap-0.5 text-slate-300">
                  <MapPin className="w-3 h-3 text-rose-400 shrink-0" />
                  {post.location}
                </span>
              )}
              <span>•</span>
              <span>{formatTimeAgo(post.created_at)}</span>
            </div>
          </div>
        </div>

        {/* Three Dot Options Menu */}
        <div className="relative">
          <button
            onClick={() => setShowMenu((v) => !v)}
            className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-9 w-40 bg-slate-900/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl py-1.5 z-30 animate-in fade-in duration-100 text-xs">
              <button
                onClick={handleCopyLink}
                className="w-full px-3 py-2 text-left text-slate-300 hover:text-white hover:bg-white/10 flex items-center gap-2"
              >
                <Copy className="w-3.5 h-3.5" />
                Copy Link
              </button>
              <button
                onClick={() => {
                  setIsHidden(true);
                  setShowMenu(false);
                  showToast('Post hidden from your feed.', 'info');
                }}
                className="w-full px-3 py-2 text-left text-slate-300 hover:text-white hover:bg-white/10 flex items-center gap-2"
              >
                <EyeOff className="w-3.5 h-3.5" />
                Hide Post
              </button>
              <button
                onClick={() => {
                  setShowMenu(false);
                  showToast('Thank you. Post flagged for moderation review.', 'success');
                }}
                className="w-full px-3 py-2 text-left text-slate-300 hover:text-white hover:bg-white/10 flex items-center gap-2"
              >
                <Flag className="w-3.5 h-3.5 text-amber-400" />
                Report Post
              </button>
              {isAuthor && onDeletePost && (
                <button
                  onClick={() => {
                    setShowMenu(false);
                    onDeletePost(post.id);
                  }}
                  className="w-full px-3 py-2 text-left text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 border-t border-white/10"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete Post
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Post Media Carousel / Video */}
      {resolvedMediaUrls.length > 0 && (
        <PostMedia mediaUrls={resolvedMediaUrls} />
      )}

      {/* Caption Body */}
      {post.caption && (
        <div className="px-4 pt-3 pb-1 text-xs md:text-sm text-slate-200 leading-relaxed break-words">
          {renderCaptionWithHashtags(post.caption)}
        </div>
      )}

      {/* Interactive Reaction & Engagement Bar */}
      <ReactionBar
        currentReaction={currentReaction}
        likesCount={likesCount}
        commentsCount={commentsCount}
        isSaved={isSaved}
        onReact={handleReact}
        onOpenComments={() => setIsCommentsOpen(true)}
        onToggleSave={handleToggleSave}
        onShare={() => setIsShareOpen(true)}
      />

      {/* Comments Bottom Sheet Drawer */}
      <CommentsSheet
        post={post}
        isOpen={isCommentsOpen}
        onClose={() => setIsCommentsOpen(false)}
        onCommentAdded={() => setCommentsCount((c) => c + 1)}
      />

      {/* Share Menu */}
      <ShareMenu
        post={post}
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
      />
    </article>
  );
};
