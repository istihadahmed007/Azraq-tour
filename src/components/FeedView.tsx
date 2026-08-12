import React, { useState } from 'react';
import { FeedPost, TrendingHashtag } from '../types';
import { BRAND_LOGOS } from '../data/mockData';
import { useAuth } from '../context/AuthContext';

interface FeedViewProps {
  posts: FeedPost[];
  trendingHashtags: TrendingHashtag[];
  onAddPost: (newPost: FeedPost) => void;
  onSelectDestinationByName: (name: string) => void;
}

export const FeedView: React.FC<FeedViewProps> = ({
  posts,
  trendingHashtags,
  onAddPost,
  onSelectDestinationByName,
}) => {
  const { requireAuth, user } = useAuth();
  const [postText, setPostText] = useState('');
  const [postLocation, setPostLocation] = useState('');
  const [postImageUrl, setPostImageUrl] = useState('');
  const [showLocationInput, setShowLocationInput] = useState(false);
  const [showImageInput, setShowImageInput] = useState(false);
  const [isPosting, setIsPosting] = useState(false);

  // Interaction states
  const [feedPosts, setFeedPosts] = useState<FeedPost[]>(posts);
  const [activeCommentDrawerPostId, setActiveCommentDrawerPostId] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState('');

  const toggleLike = (postId: string) => {
    requireAuth({ type: 'like_post', label: 'Liked travel post' }, () => {
      setFeedPosts((prev) =>
        prev.map((post) => {
          if (post.id === postId) {
            const isLikedNow = !post.isLiked;
            return {
              ...post,
              isLiked: isLikedNow,
              likes: isLikedNow ? post.likes + 1 : post.likes - 1,
            };
          }
          return post;
        })
      );
    });
  };

  const toggleBookmark = (postId: string) => {
    requireAuth({ type: 'bookmark_post', label: 'Saved post to bookmarks' }, () => {
      setFeedPosts((prev) =>
        prev.map((post) => {
          if (post.id === postId) {
            return {
              ...post,
              isBookmarked: !post.isBookmarked,
            };
          }
          return post;
        })
      );
    });
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postText.trim() || isPosting) return;

    requireAuth({ type: 'create_post', label: 'Published new travel story' }, async () => {
      setIsPosting(true);

      try {
        // Call AI Verification server endpoint
        const response = await fetch('/api/ai/verify-post', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content: postText,
            location: postLocation || 'Global Explorer',
          }),
        });

        const aiData = await response.json();

        const newPostObj: FeedPost = {
          id: `post-${Date.now()}`,
          authorName: user?.fullName || 'Alex Mercer',
          authorAvatar: user?.photoURL || BRAND_LOGOS.userAvatar,
          location: postLocation.trim() || 'Global Explorer',
          badgeLabel: aiData.badgeLabel || 'AI Verified Route',
          imageUrl:
            postImageUrl.trim() ||
            'https://lh3.googleusercontent.com/aida-public/AB6AXuCHzDtzxEsbeDsDrCdoNLEjTI_xuY-7wlUYq5ucT5Sl5URGnyJ1FWvjE5BPxE5SQUaGNKlsYlPalBk5SIZlZDwQ5ALiHCKPRK_tWth1bQbUu_B-eYcYoayo5QBhhDzreiCStQq35vn2gqDvsLLV1-S8cyJLXiVq6OsKfUZwdu0lKKD5eRgT9r44zdDLwiRIWHmiog-8gmKoxaIqvCCf5F0pBXgDAy9FuocuDV0oxqQYkhnA-d2NMqFU',
          likes: 1,
          commentsCount: 0,
          caption: postText,
          hashtags: aiData.hashtags || ['#GlobeTrotter', '#AIVerified'],
          timeAgo: 'Just now',
          isLiked: true,
          isBookmarked: false,
          aiVerified: true,
          commentsList: [],
        };

        setFeedPosts([newPostObj, ...feedPosts]);
        onAddPost(newPostObj);

        // Reset form
        setPostText('');
        setPostLocation('');
        setPostImageUrl('');
        setShowLocationInput(false);
        setShowImageInput(false);
      } catch (err) {
        console.error('Post verification failed:', err);
      } finally {
        setIsPosting(false);
      }
    });
  };

  const handleAddComment = (postId: string) => {
    if (!commentInput.trim()) return;

    requireAuth({ type: 'comment_post', label: 'Added comment' }, () => {
      setFeedPosts((prev) =>
        prev.map((post) => {
          if (post.id === postId) {
            const newComment = {
              id: `c-${Date.now()}`,
              author: user?.fullName || 'Alex Mercer',
              avatar: user?.photoURL || BRAND_LOGOS.userAvatar,
              text: commentInput,
              timeAgo: 'Just now',
            };
            return {
              ...post,
              commentsCount: post.commentsCount + 1,
              commentsList: [...post.commentsList, newComment],
            };
          }
          return post;
        })
      );
      setCommentInput('');
    });
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 pt-20 md:pt-10 pb-24 flex flex-col lg:flex-row gap-8">
      {/* Main Feed Column */}
      <main className="flex-1 flex flex-col gap-6 max-w-2xl mx-auto lg:mx-0 w-full">
        {/* Share Your Journey Prompt Card */}
        <div className="glass-card rounded-2xl p-5 flex gap-4 items-start shadow-xl border border-white/15">
          <img
            src={BRAND_LOGOS.userAvatar}
            alt="Current user avatar"
            className="w-11 h-11 rounded-full object-cover border-2 border-primary/40 shrink-0"
          />

          <form onSubmit={handleCreatePost} className="flex-1 flex flex-col gap-3">
            <textarea
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              placeholder="Share your latest adventure..."
              className="glass-input w-full rounded-xl p-3 resize-none text-xs md:text-sm text-on-surface placeholder:text-outline h-20 focus:h-28 transition-all"
            />

            {showLocationInput && (
              <input
                type="text"
                value={postLocation}
                onChange={(e) => setPostLocation(e.target.value)}
                placeholder="Add location (e.g., Dolomites, Italy)"
                className="glass-input text-xs p-2 rounded-xl text-on-surface"
              />
            )}

            {showImageInput && (
              <input
                type="url"
                value={postImageUrl}
                onChange={(e) => setPostImageUrl(e.target.value)}
                placeholder="Image URL (or hotlink photo)"
                className="glass-input text-xs p-2 rounded-xl text-on-surface"
              />
            )}

            <div className="flex justify-between items-center pt-1">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowImageInput(!showImageInput)}
                  className={`text-primary hover:bg-white/5 p-2 rounded-full transition-colors flex items-center gap-1 text-xs font-medium ${
                    showImageInput ? 'bg-white/10' : ''
                  }`}
                >
                  <span className="material-symbols-outlined text-lg">image</span>
                  <span className="hidden sm:inline">Photo URL</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowLocationInput(!showLocationInput)}
                  className={`text-primary hover:bg-white/5 p-2 rounded-full transition-colors flex items-center gap-1 text-xs font-medium ${
                    showLocationInput ? 'bg-white/10' : ''
                  }`}
                >
                  <span className="material-symbols-outlined text-lg">location_on</span>
                  <span className="hidden sm:inline">Location</span>
                </button>
              </div>

              <button
                type="submit"
                disabled={!postText.trim() || isPosting}
                className="bg-primary text-on-primary font-semibold text-xs md:text-sm px-6 py-2 rounded-full hover:bg-primary-fixed transition-all active:scale-95 disabled:opacity-50 flex items-center gap-1"
              >
                {isPosting && <span className="material-symbols-outlined text-sm animate-spin">sync</span>}
                <span>Post</span>
              </button>
            </div>
          </form>
        </div>

        {/* Feed Cards */}
        {feedPosts.map((post) => {
          const isCommentsOpen = activeCommentDrawerPostId === post.id;

          return (
            <article
              key={post.id}
              className="glass-card rounded-2xl overflow-hidden shadow-xl flex flex-col border border-white/15"
            >
              {/* Header */}
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3 cursor-pointer group">
                  <img
                    src={post.authorAvatar}
                    alt={post.authorName}
                    className="w-10 h-10 rounded-full object-cover group-hover:ring-2 ring-primary/50 transition-all"
                  />
                  <div>
                    <h3 className="text-sm font-semibold text-on-surface group-hover:text-primary transition-colors">
                      {post.authorName}
                    </h3>
                    <p className="text-xs text-outline flex items-center gap-1 mt-0.5">
                      <span className="material-symbols-outlined text-xs">location_on</span>
                      <span>{post.location}</span>
                      <span>•</span>
                      <span>{post.timeAgo}</span>
                    </p>
                  </div>
                </div>

                <button className="text-outline hover:text-on-surface p-1 rounded-full hover:bg-white/5">
                  <span className="material-symbols-outlined text-lg">more_horiz</span>
                </button>
              </div>

              {/* Main Image */}
              <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] bg-surface-container-low overflow-hidden">
                <img
                  src={post.imageUrl}
                  alt={post.location}
                  className="w-full h-full object-cover"
                />

                {/* AI Verified Chip */}
                {post.badgeLabel && (
                  <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-md border border-white/20 rounded-full px-3 py-1 flex items-center gap-1 text-tertiary text-xs font-semibold shadow-lg">
                    <span className="material-symbols-outlined text-sm">verified</span>
                    <span>{post.badgeLabel}</span>
                  </div>
                )}
              </div>

              {/* Interaction & Caption Bar */}
              <div className="p-4 flex flex-col gap-3">
                {/* Floating Action Bar */}
                <div className="flex justify-between items-center bg-surface/60 backdrop-blur-md rounded-full px-5 py-2 border border-white/10 -mt-8 relative z-10 mx-auto w-[92%] shadow-xl">
                  <button
                    onClick={() => toggleLike(post.id)}
                    className={`flex items-center gap-1.5 text-xs font-semibold transition-all ${
                      post.isLiked ? 'text-error' : 'text-on-surface hover:text-error'
                    }`}
                  >
                    <span className={`material-symbols-outlined text-lg ${post.isLiked ? 'filled' : ''}`}>
                      favorite
                    </span>
                    <span>{post.likes}</span>
                  </button>

                  <button
                    onClick={() =>
                      setActiveCommentDrawerPostId(isCommentsOpen ? null : post.id)
                    }
                    className="flex items-center gap-1.5 text-xs font-semibold text-on-surface hover:text-primary transition-all"
                  >
                    <span className="material-symbols-outlined text-lg">chat_bubble</span>
                    <span>{post.commentsCount}</span>
                  </button>

                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      alert('Post link copied!');
                    }}
                    className="flex items-center gap-1 text-xs text-on-surface hover:text-secondary transition-all"
                  >
                    <span className="material-symbols-outlined text-lg">share</span>
                  </button>

                  <button
                    onClick={() => toggleBookmark(post.id)}
                    className={`flex items-center gap-1 text-xs transition-all ${
                      post.isBookmarked ? 'text-tertiary' : 'text-on-surface hover:text-tertiary'
                    }`}
                  >
                    <span className={`material-symbols-outlined text-lg ${post.isBookmarked ? 'filled' : ''}`}>
                      bookmark
                    </span>
                  </button>
                </div>

                {/* Caption & Hashtags */}
                <div className="text-xs md:text-sm text-on-surface-variant mt-2 leading-relaxed">
                  <span className="font-semibold text-on-surface mr-2">{post.authorName}</span>
                  <span>{post.caption}</span>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {post.hashtags?.map((tag, idx) => (
                      <span
                        key={idx}
                        onClick={() => onSelectDestinationByName(tag.replace('#', ''))}
                        className="text-primary hover:underline cursor-pointer font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Comments Section Drawer */}
                <button
                  onClick={() =>
                    setActiveCommentDrawerPostId(isCommentsOpen ? null : post.id)
                  }
                  className="text-xs text-outline text-left hover:text-on-surface transition-colors mt-1"
                >
                  {isCommentsOpen
                    ? 'Hide comments'
                    : `View all ${post.commentsCount} comments`}
                </button>

                {isCommentsOpen && (
                  <div className="flex flex-col gap-3 pt-3 border-t border-white/10 mt-1">
                    <div className="flex flex-col gap-2 max-h-48 overflow-y-auto hide-scrollbar">
                      {post.commentsList?.map((c) => (
                        <div key={c.id} className="flex gap-2 items-start text-xs">
                          <img
                            src={c.avatar}
                            alt={c.author}
                            className="w-6 h-6 rounded-full object-cover shrink-0"
                          />
                          <div className="bg-white/5 p-2 rounded-xl flex-1 border border-white/5">
                            <span className="font-semibold text-on-surface mr-1">{c.author}</span>
                            <span className="text-on-surface-variant">{c.text}</span>
                            <span className="text-[10px] text-outline block mt-0.5">{c.timeAgo}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2 mt-1">
                      <input
                        type="text"
                        value={commentInput}
                        onChange={(e) => setCommentInput(e.target.value)}
                        placeholder="Add a comment..."
                        className="glass-input text-xs p-2 rounded-xl flex-1 text-on-surface"
                      />
                      <button
                        onClick={() => handleAddComment(post.id)}
                        className="bg-primary text-on-primary text-xs font-semibold px-4 py-2 rounded-xl hover:bg-primary-fixed"
                      >
                        Send
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </main>

      {/* Right Sidebar: Discovery & Trending Tools */}
      <aside className="w-full lg:w-80 flex flex-col gap-6 shrink-0">
        {/* Trending Hashtags */}
        <div className="glass-card rounded-2xl p-5 shadow-xl border border-white/15">
          <h2 className="font-serif-display text-lg text-on-surface font-semibold mb-4 flex items-center justify-between">
            <span>Trending Hashtags</span>
            <span className="material-symbols-outlined text-primary text-lg">trending_up</span>
          </h2>

          <div className="flex flex-col gap-2">
            {trendingHashtags.map((h, idx) => (
              <div
                key={idx}
                onClick={() => onSelectDestinationByName(h.tag.replace('#', ''))}
                className="flex justify-between items-center p-2.5 rounded-xl hover:bg-white/5 transition-all cursor-pointer group"
              >
                <div>
                  <p className="text-xs font-semibold text-on-surface group-hover:text-primary transition-colors">
                    {h.tag}
                  </p>
                  <p className="text-[11px] text-outline mt-0.5">{h.postsCount}</p>
                </div>
                <span className="material-symbols-outlined text-xs text-outline group-hover:text-primary">
                  arrow_outward
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Destinations Widget */}
        <div className="glass-card rounded-2xl p-5 shadow-xl border border-white/15">
          <h2 className="font-serif-display text-lg text-on-surface font-semibold mb-4">
            Top Destinations
          </h2>

          <div className="flex flex-col gap-3">
            <div
              onClick={() => onSelectDestinationByName('Maldives')}
              className="relative h-24 rounded-xl overflow-hidden group cursor-pointer border border-white/10"
            >
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDKu3uglEAhQOLGKoYoE-4HZE1DNw-JV8iIrAqQnUNhqc0DAyCz0_MDv1STN4obKX8ZcUz_zFr2QuNfRiKDBCcOJbDdv_H7-b5_oH6Y8ALK5VdeUpVvUDoX0l8BJzbe_y-5F9YEz8556qnVOBK8Mhgg6QJ1Zp6x61JgbI5Tobv428v4RkYS8PBHyPgpxxvdrjCIZ4IReJoDhFM3O3X9bwmePhZh7sB7oloNqoTC4UhKIukmO6c2SSFg"
                alt="Maldives"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute bottom-2 left-3 right-3 flex justify-between items-end">
                <span className="text-xs font-semibold text-white">Maldives</span>
                <span className="text-[11px] font-semibold text-tertiary flex items-center">
                  <span className="material-symbols-outlined text-xs mr-0.5">star</span> 4.9
                </span>
              </div>
            </div>

            <div
              onClick={() => onSelectDestinationByName('Petra')}
              className="relative h-24 rounded-xl overflow-hidden group cursor-pointer border border-white/10"
            >
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAzzg2h783i9uoIrljvxSi9NHd1BdwbgGIOJD0sq9KfU7GO7pZQrnd9_Os1uu3t9AFssPePN9xIvIAZbVQ7frSPeC96y-mOmhwxOj88aaxLFTxMm2Cm8F9S-JjOqWR8SZv1PY_7j_fs5v76svD_jE0RX_rlOkvpn4u6rHLEFzgKCxdGJWKgT2OQwt5CIExVh7xWz3zKc9_9mBFvbRyJsXe3h49a6CRMgIlg8wGA79HWuXIWW6ehorvV"
                alt="Petra, Jordan"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute bottom-2 left-3 right-3 flex justify-between items-end">
                <span className="text-xs font-semibold text-white">Petra, Jordan</span>
                <span className="text-[11px] font-semibold text-tertiary flex items-center">
                  <span className="material-symbols-outlined text-xs mr-0.5">star</span> 4.8
                </span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};
