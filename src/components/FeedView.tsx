import React, { useState } from 'react';
import { FeedPost } from '../types';
import { useAuth } from '../context/AuthContext';
import { useFeed } from '../context/FeedContext';
import {
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  Send,
  Trash2,
  Sparkles,
  MapPin,
  Image as ImageIcon,
  CheckCircle2,
  TrendingUp,
  User as UserIcon,
  Compass,
} from 'lucide-react';

interface FeedViewProps {
  onSelectDestinationByName: (name: string) => void;
  onNavigateToProfile?: () => void;
}

export const FeedView: React.FC<FeedViewProps> = ({
  onSelectDestinationByName,
  onNavigateToProfile,
}) => {
  const { user, isGuest, openAuthModal } = useAuth();
  const {
    posts,
    userPosts,
    trendingHashtags,
    isLoading,
    createPost,
    deletePost,
    toggleLike,
    toggleBookmark,
    addComment,
  } = useFeed();

  const [postText, setPostText] = useState('');
  const [postLocation, setPostLocation] = useState('');
  const [postImageUrl, setPostImageUrl] = useState('');
  const [showLocationInput, setShowLocationInput] = useState(false);
  const [showImageInput, setShowImageInput] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Active comment drawer state
  const [activeCommentDrawerPostId, setActiveCommentDrawerPostId] = useState<string | null>(null);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postText.trim() || isSubmitting) return;

    if (isGuest) {
      openAuthModal('login');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await createPost(postText, postLocation, postImageUrl);
      if (res.success) {
        setPostText('');
        setPostLocation('');
        setPostImageUrl('');
        setShowLocationInput(false);
        setShowImageInput(false);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCommentSubmit = async (postId: string) => {
    const text = commentInputs[postId]?.trim();
    if (!text) return;

    await addComment(postId, text);
    setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 pt-20 md:pt-10 pb-24 flex flex-col lg:flex-row gap-8">
      {/* Main Feed Column */}
      <main className="flex-1 flex flex-col gap-6 max-w-2xl mx-auto lg:mx-0 w-full">
        {/* Create Post Prompt Card */}
        <div className="glass-card rounded-3xl p-5 md:p-6 flex flex-col sm:flex-row gap-4 items-start shadow-xl border border-white/15 relative overflow-hidden">
          <div className="flex items-center gap-3 sm:block shrink-0">
            <img
              src={
                user?.photoURL ||
                `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                  user?.fullName || 'Traveler'
                )}`
              }
              alt={user?.fullName || 'Traveler'}
              className="w-12 h-12 rounded-full object-cover border-2 border-primary/40 shadow-md"
            />
            <div className="sm:hidden">
              <p className="text-xs font-bold text-white">{user?.fullName || 'Travel Explorer'}</p>
              <p className="text-[10px] text-sky-200/80">Share with community</p>
            </div>
          </div>

          <form onSubmit={handleCreatePost} className="flex-1 w-full flex flex-col gap-3">
            <textarea
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              placeholder={
                user
                  ? `What did you discover today, ${user.fullName.split(' ')[0]}? Share your journey...`
                  : 'Share your latest adventure with fellow travelers...'
              }
              className="glass-input w-full rounded-2xl p-3.5 resize-none text-xs sm:text-sm text-on-surface placeholder:text-outline/70 h-24 focus:h-32 transition-all"
            />

            {showLocationInput && (
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2">
                <MapPin className="w-4 h-4 text-amber-300 shrink-0" />
                <input
                  type="text"
                  value={postLocation}
                  onChange={(e) => setPostLocation(e.target.value)}
                  placeholder="Add location (e.g. Cox's Bazar, Kyoto, Dolomites)"
                  className="bg-transparent text-xs text-white placeholder:text-outline w-full focus:outline-none"
                />
              </div>
            )}

            {showImageInput && (
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2">
                <ImageIcon className="w-4 h-4 text-sky-300 shrink-0" />
                <input
                  type="url"
                  value={postImageUrl}
                  onChange={(e) => setPostImageUrl(e.target.value)}
                  placeholder="Paste photo link (Unsplash or direct image URL)"
                  className="bg-transparent text-xs text-white placeholder:text-outline w-full focus:outline-none"
                />
              </div>
            )}

            <div className="flex justify-between items-center pt-2 border-t border-white/10">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowImageInput(!showImageInput)}
                  className={`p-2 rounded-xl transition-all flex items-center gap-1.5 text-xs font-semibold ${
                    showImageInput
                      ? 'bg-sky-500/20 text-sky-300 border border-sky-400/40'
                      : 'text-sky-200 hover:bg-white/10'
                  }`}
                  title="Add Image"
                >
                  <ImageIcon className="w-4 h-4" />
                  <span className="hidden sm:inline">Photo</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowLocationInput(!showLocationInput)}
                  className={`p-2 rounded-xl transition-all flex items-center gap-1.5 text-xs font-semibold ${
                    showLocationInput
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40'
                      : 'text-sky-200 hover:bg-white/10'
                  }`}
                  title="Add Location"
                >
                  <MapPin className="w-4 h-4" />
                  <span className="hidden sm:inline">Location</span>
                </button>
              </div>

              <button
                type="submit"
                disabled={!postText.trim() || isSubmitting}
                className="bg-primary hover:bg-primary-fixed text-on-primary font-bold text-xs sm:text-sm px-6 py-2.5 rounded-full transition-all active:scale-95 disabled:opacity-40 flex items-center gap-1.5 shadow-lg shadow-primary/20"
              >
                {isSubmitting ? (
                  <span className="material-symbols-outlined text-sm animate-spin">sync</span>
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                <span>{isGuest ? 'Sign in to Post' : 'Post to Feed'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Real Dynamic Feed List */}
        {posts.length === 0 ? (
          <div className="glass-card rounded-3xl p-12 text-center flex flex-col items-center justify-center gap-4 border border-white/15">
            <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
              <Compass className="w-8 h-8 animate-spin" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">No travel stories yet</h3>
              <p className="text-xs text-sky-200/80 max-w-sm">
                Be the first to share your recent travel experience, favorite spot, or itinerary recommendations with the community!
              </p>
            </div>
          </div>
        ) : (
          posts.map((post) => {
            const isCommentsOpen = activeCommentDrawerPostId === post.id;
            const isPostAuthor =
              user &&
              (post.authorId === user.uid ||
                post.authorEmail?.toLowerCase() === user.email.toLowerCase());

            return (
              <article
                key={post.id}
                className="glass-card rounded-3xl overflow-hidden shadow-2xl flex flex-col border border-white/15 hover:border-white/25 transition-all"
              >
                {/* Author Header */}
                <div className="p-4 sm:p-5 flex items-center justify-between">
                  <div
                    onClick={() => {
                      if (onNavigateToProfile && isPostAuthor) {
                        onNavigateToProfile();
                      }
                    }}
                    className="flex items-center gap-3 group cursor-pointer"
                  >
                    <img
                      src={post.authorAvatar}
                      alt={post.authorName}
                      className="w-11 h-11 rounded-full object-cover ring-2 ring-primary/30 group-hover:ring-primary transition-all shadow-md"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-sm font-bold text-white group-hover:text-primary transition-colors">
                          {post.authorName}
                        </h3>
                        {isPostAuthor && (
                          <span className="px-2 py-0.2 rounded-full text-[10px] font-semibold bg-primary/20 text-primary border border-primary/30">
                            You
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-sky-200/80 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-amber-300" />
                        <span>{post.location}</span>
                        <span>•</span>
                        <span className="text-outline text-[11px]">{post.timeAgo}</span>
                      </p>
                    </div>
                  </div>

                  {isPostAuthor && (
                    <button
                      onClick={() => deletePost(post.id)}
                      className="text-outline hover:text-rose-400 p-2 rounded-full hover:bg-rose-500/10 transition-colors"
                      title="Delete your post"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Main Post Image */}
                {post.imageUrl && (
                  <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] bg-slate-950/40 overflow-hidden">
                    <img
                      src={post.imageUrl}
                      alt={post.location}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    />

                    {post.badgeLabel && (
                      <div className="absolute top-3 left-3 bg-slate-950/70 backdrop-blur-md border border-white/20 rounded-full px-3.5 py-1 flex items-center gap-1.5 text-tertiary text-xs font-semibold shadow-lg">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{post.badgeLabel}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Interaction & Caption Bar */}
                <div className="p-4 sm:p-5 flex flex-col gap-3">
                  {/* Floating Action Pill Bar */}
                  <div className="flex justify-between items-center bg-slate-900/80 backdrop-blur-md rounded-full px-6 py-2.5 border border-white/15 -mt-8 sm:-mt-9 relative z-10 mx-auto w-[92%] shadow-2xl">
                    {/* Like Button */}
                    <button
                      onClick={() => toggleLike(post.id)}
                      className={`flex items-center gap-1.5 text-xs font-bold transition-all active:scale-95 ${
                        post.isLiked ? 'text-rose-400' : 'text-sky-100 hover:text-rose-400'
                      }`}
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          post.isLiked ? 'fill-rose-500 text-rose-500' : ''
                        }`}
                      />
                      <span>{post.likes}</span>
                    </button>

                    {/* Comment Drawer Toggle */}
                    <button
                      onClick={() =>
                        setActiveCommentDrawerPostId(isCommentsOpen ? null : post.id)
                      }
                      className="flex items-center gap-1.5 text-xs font-bold text-sky-100 hover:text-primary transition-all"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>{post.commentsCount}</span>
                    </button>

                    {/* Share Button */}
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        alert('Story link copied to clipboard!');
                      }}
                      className="flex items-center gap-1 text-xs text-sky-100 hover:text-sky-300 transition-all"
                      title="Share post"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>

                    {/* Bookmark Button */}
                    <button
                      onClick={() => toggleBookmark(post.id)}
                      className={`flex items-center gap-1 text-xs transition-all active:scale-95 ${
                        post.isBookmarked
                          ? 'text-amber-300 font-bold'
                          : 'text-sky-100 hover:text-amber-300'
                      }`}
                      title={post.isBookmarked ? 'Saved to bookmarks' : 'Save bookmark'}
                    >
                      <Bookmark
                        className={`w-4 h-4 ${
                          post.isBookmarked ? 'fill-amber-400 text-amber-400' : ''
                        }`}
                      />
                    </button>
                  </div>

                  {/* Post Caption */}
                  <div className="text-xs sm:text-sm text-sky-100/90 mt-2 leading-relaxed">
                    <span className="font-bold text-white mr-2">{post.authorName}</span>
                    <span>{post.caption}</span>

                    {/* Hashtags */}
                    {post.hashtags && post.hashtags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2.5">
                        {post.hashtags.map((tag, idx) => (
                          <span
                            key={idx}
                            onClick={() => onSelectDestinationByName(tag.replace('#', ''))}
                            className="text-primary hover:underline cursor-pointer font-medium text-xs bg-primary/10 px-2.5 py-0.5 rounded-full border border-primary/20"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Comment Drawer Toggle Link */}
                  <button
                    onClick={() =>
                      setActiveCommentDrawerPostId(isCommentsOpen ? null : post.id)
                    }
                    className="text-xs text-outline hover:text-white transition-colors text-left font-medium mt-1"
                  >
                    {isCommentsOpen
                      ? 'Hide comments'
                      : post.commentsCount > 0
                      ? `View all ${post.commentsCount} comment${post.commentsCount > 1 ? 's' : ''}`
                      : 'Leave a comment...'}
                  </button>

                  {/* Comment Drawer Section */}
                  {isCommentsOpen && (
                    <div className="flex flex-col gap-3 pt-3 border-t border-white/10 mt-1">
                      {post.commentsList && post.commentsList.length > 0 && (
                        <div className="flex flex-col gap-2 max-h-52 overflow-y-auto hide-scrollbar pr-1">
                          {post.commentsList.map((c) => (
                            <div
                              key={c.id}
                              className="flex gap-2.5 items-start text-xs bg-white/5 p-2.5 rounded-2xl border border-white/5"
                            >
                              <img
                                src={c.avatar}
                                alt={c.author}
                                className="w-7 h-7 rounded-full object-cover shrink-0"
                              />
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <span className="font-bold text-white">{c.author}</span>
                                  <span className="text-[10px] text-outline">{c.timeAgo}</span>
                                </div>
                                <p className="text-sky-100/90 mt-0.5 leading-snug">{c.text}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Comment Input */}
                      <div className="flex gap-2 mt-1">
                        <input
                          type="text"
                          value={commentInputs[post.id] || ''}
                          onChange={(e) =>
                            setCommentInputs((prev) => ({
                              ...prev,
                              [post.id]: e.target.value,
                            }))
                          }
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleCommentSubmit(post.id);
                          }}
                          placeholder="Write a supportive comment..."
                          className="glass-input text-xs p-2.5 rounded-xl flex-1 text-on-surface"
                        />
                        <button
                          onClick={() => handleCommentSubmit(post.id)}
                          className="bg-primary hover:bg-primary-fixed text-on-primary text-xs font-bold px-4 py-2 rounded-xl transition-all flex items-center gap-1"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Send</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </article>
            );
          })
        )}
      </main>

      {/* Right Sidebar: User Profile Summary & Discovery */}
      <aside className="w-full lg:w-80 flex flex-col gap-6 shrink-0">
        {/* User Mini Profile Card */}
        {user && (
          <div className="glass-card rounded-3xl p-5 shadow-xl border border-white/15 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <img
                src={
                  user.photoURL ||
                  `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                    user.fullName
                  )}`
                }
                alt={user.fullName}
                className="w-14 h-14 rounded-full object-cover border-2 border-primary/50 shadow-md"
              />
              <div className="flex-1 overflow-hidden">
                <h3 className="font-bold text-sm text-white truncate">{user.fullName}</h3>
                <p className="text-xs text-sky-200/80 truncate">{user.email}</p>
                {user.homeLocation && (
                  <p className="text-[11px] text-amber-300 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3" />
                    <span>{user.homeLocation}</span>
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-center pt-3 border-t border-white/10">
              <div className="p-2 rounded-xl bg-white/5 border border-white/5">
                <p className="text-base font-bold text-white">{userPosts.length}</p>
                <p className="text-[11px] text-sky-200/80">Your Posts</p>
              </div>
              <div className="p-2 rounded-xl bg-white/5 border border-white/5">
                <p className="text-base font-bold text-white">
                  {posts.filter((p) => p.isBookmarked).length}
                </p>
                <p className="text-[11px] text-sky-200/80">Bookmarks</p>
              </div>
            </div>

            {onNavigateToProfile && (
              <button
                onClick={onNavigateToProfile}
                className="w-full py-2.5 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 text-sky-200 hover:text-white border border-sky-400/30 font-semibold text-xs transition-all flex items-center justify-center gap-1.5"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>View Full Profile</span>
              </button>
            )}
          </div>
        )}

        {/* Trending Hashtags */}
        <div className="glass-card rounded-3xl p-5 shadow-xl border border-white/15">
          <h2 className="font-serif-display text-base text-on-surface font-bold mb-4 flex items-center justify-between">
            <span>Trending Hashtags</span>
            <TrendingUp className="w-4 h-4 text-primary" />
          </h2>

          <div className="flex flex-col gap-2">
            {trendingHashtags.length === 0 ? (
              <p className="text-xs text-outline italic">Hashtags will emerge as stories are published.</p>
            ) : (
              trendingHashtags.map((h, idx) => (
                <div
                  key={idx}
                  onClick={() => onSelectDestinationByName(h.tag.replace('#', ''))}
                  className="flex justify-between items-center p-2.5 rounded-xl hover:bg-white/5 transition-all cursor-pointer group border border-transparent hover:border-white/10"
                >
                  <div>
                    <p className="text-xs font-bold text-white group-hover:text-primary transition-colors">
                      {h.tag}
                    </p>
                    <p className="text-[11px] text-sky-200/70 mt-0.5">{h.postsCount}</p>
                  </div>
                  <span className="material-symbols-outlined text-xs text-outline group-hover:text-primary">
                    arrow_outward
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </aside>
    </div>
  );
};
