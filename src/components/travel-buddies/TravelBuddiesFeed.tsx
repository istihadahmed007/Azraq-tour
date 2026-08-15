import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Post } from '../../lib/types';
import { getPostsPage } from '../../lib/queries';
import { useAuth } from '../../context/AuthContext';
import { useNavbar } from '../../context/NavbarContext';
import { PostCard } from './PostCard';
import { CreatePostModal } from './CreatePostModal';
import { FeedSkeleton } from './FeedSkeleton';
import { EmptyState } from './EmptyState';
import {
  Compass,
  Plus,
  Flame,
  Clock,
  Bookmark,
  TrendingUp,
  MapPin,
  Sparkles,
  ShieldCheck,
  RefreshCw,
  Share2,
} from 'lucide-react';

const TRENDING_DESTINATIONS = [
  { name: "Cox's Bazar", count: '1.4k posts', country: 'Bangladesh', image: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=300&q=80' },
  { name: 'Sajek Valley', count: '920 posts', country: 'Bangladesh', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=300&q=80' },
  { name: 'Maldives Atolls', count: '2.1k posts', country: 'Maldives', image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=300&q=80' },
  { name: 'Bali & Ubud', count: '1.8k posts', country: 'Indonesia', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=300&q=80' },
];

const POPULAR_HASHTAGS = [
  '#AzraqDiaries',
  '#BangladeshTravel',
  '#TravelBuddies',
  '#ExploreBangladesh',
  '#MaldivesLuxury',
  '#BaliVibes',
  '#SoloFemaleTraveler',
];

interface TravelBuddiesFeedProps {
  onSelectDestinationByName?: (name: string) => void;
  onNavigateToProfile?: () => void;
}

export const TravelBuddiesFeed: React.FC<TravelBuddiesFeedProps> = ({
  onSelectDestinationByName,
  onNavigateToProfile,
}) => {
  const { user, isGuest, openAuthModal, showToast } = useAuth();
  const { navbarHeight } = useNavbar();

  // Feed State
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [nextCursor, setNextCursor] = useState<string | undefined>(undefined);
  const [activeFilter, setActiveFilter] = useState<'latest' | 'popular' | 'saved'>('latest');
  const [activeHashtag, setActiveHashtag] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const observerTarget = useRef<HTMLDivElement | null>(null);

  // Fetch initial posts
  const loadInitialPosts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getPostsPage({
        limitCount: 10,
        filterHashtag: activeHashtag || undefined,
      });

      let loadedPosts = res.posts;
      if (activeFilter === 'popular') {
        loadedPosts = [...loadedPosts].sort((a, b) => b.likes_count - a.likes_count);
      } else if (activeFilter === 'saved') {
        loadedPosts = loadedPosts.filter((p) => p.is_saved);
      }

      setPosts(loadedPosts);
      setNextCursor(res.nextCursor);
    } catch (err: any) {
      setError(err?.message || 'Failed to load travel feed.');
    } finally {
      setIsLoading(false);
    }
  }, [activeFilter, activeHashtag]);

  useEffect(() => {
    loadInitialPosts();
  }, [loadInitialPosts]);

  // Infinite Scroll Observer
  const loadMorePosts = useCallback(async () => {
    if (!nextCursor || isLoadingMore || isLoading) return;

    setIsLoadingMore(true);
    try {
      const res = await getPostsPage({
        limitCount: 10,
        cursorCreatedAt: nextCursor,
        filterHashtag: activeHashtag || undefined,
      });

      setPosts((prev) => [...prev, ...res.posts]);
      setNextCursor(res.nextCursor);
    } catch (err) {
      console.warn('Infinite scroll error:', err);
    } finally {
      setIsLoadingMore(false);
    }
  }, [nextCursor, isLoadingMore, isLoading, activeHashtag]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && nextCursor && !isLoadingMore) {
          loadMorePosts();
        }
      },
      { threshold: 0.5 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) observer.observe(currentTarget);

    return () => {
      if (currentTarget) observer.unobserve(currentTarget);
    };
  }, [loadMorePosts, nextCursor, isLoadingMore]);

  const handleOpenCreatePost = () => {
    if (isGuest || !user) {
      openAuthModal('login');
      return;
    }
    setIsCreateModalOpen(true);
  };

  const handleDeletePost = (postId: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
    showToast('Post removed.', 'info');
  };

  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 pb-24">
      {/* Top Banner Header */}
      <div className="border-b border-white/10 bg-slate-900/60 backdrop-blur-md pt-4 md:pt-6 pb-6 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-sky-500/20">
                <Compass className="w-5 h-5 animate-spin-slow" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
                  Travel Buddies
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30">
                    Community
                  </span>
                </h1>
                <p className="text-xs text-slate-400">
                  Share your journey. Meet fellow travelers across Bangladesh & the globe.
                </p>
              </div>
            </div>
          </div>

          {/* Desktop Create Post Button */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={handleOpenCreatePost}
              className="px-5 py-2.5 rounded-full bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-sky-500/20 flex items-center gap-2 transition-all hover:scale-105 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Share Travel Story</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Layout Container */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-6 flex flex-col lg:flex-row gap-8">
        {/* Left / Center: Main Feed */}
        <main className="flex-1 max-w-2xl mx-auto lg:mx-0 w-full space-y-6">
          {/* Feed Filter Bar */}
          <div
            style={{ top: `${navbarHeight + 8}px` }}
            className="sticky z-30 flex items-center justify-between gap-2 p-1.5 rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-white/10 shadow-lg"
          >
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  setActiveFilter('latest');
                  setActiveHashtag(null);
                }}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeFilter === 'latest' && !activeHashtag
                    ? 'bg-sky-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Latest</span>
              </button>

              <button
                onClick={() => {
                  setActiveFilter('popular');
                  setActiveHashtag(null);
                }}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeFilter === 'popular' && !activeHashtag
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Flame className="w-3.5 h-3.5" />
                <span>Popular</span>
              </button>

              <button
                onClick={() => {
                  if (isGuest) {
                    openAuthModal('login');
                    return;
                  }
                  setActiveFilter('saved');
                  setActiveHashtag(null);
                }}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeFilter === 'saved' && !activeHashtag
                    ? 'bg-purple-500 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>Saved</span>
              </button>
            </div>

            {activeHashtag && (
              <div className="flex items-center gap-1.5 bg-sky-500/20 text-sky-300 px-2.5 py-1 rounded-full text-xs font-semibold">
                <span>{activeHashtag}</span>
                <button
                  onClick={() => setActiveHashtag(null)}
                  className="text-sky-300 hover:text-white ml-1 font-bold"
                >
                  ×
                </button>
              </div>
            )}
          </div>

          {/* Feed Content */}
          {isLoading ? (
            <FeedSkeleton />
          ) : error ? (
            <div className="p-8 text-center bg-slate-900/60 border border-rose-500/30 rounded-3xl space-y-3">
              <p className="text-xs text-rose-300">{error}</p>
              <button
                onClick={loadInitialPosts}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-2 mx-auto cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Retry
              </button>
            </div>
          ) : posts.length === 0 ? (
            <EmptyState onCreatePost={handleOpenCreatePost} />
          ) : (
            <div className="space-y-6">
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onHashtagClick={(tag) => setActiveHashtag(tag)}
                  onDeletePost={handleDeletePost}
                />
              ))}

              {/* Infinite Scroll Trigger */}
              <div ref={observerTarget} className="py-4 text-center">
                {isLoadingMore && (
                  <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
                    <RefreshCw className="w-4 h-4 animate-spin text-sky-400" />
                    <span>Loading more travel memories...</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>

        {/* Right Sidebar: Trending & Suggested */}
        <aside
          style={{ top: `${navbarHeight + 16}px` }}
          className="hidden lg:block w-80 space-y-6 sticky self-start"
        >
          {/* Trending Destinations */}
          <div className="bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-3xl p-5 shadow-xl space-y-4">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <TrendingUp className="w-4 h-4 text-sky-400" />
              Trending Destinations
            </div>
            <div className="space-y-2.5">
              {TRENDING_DESTINATIONS.map((dest) => (
                <div
                  key={dest.name}
                  onClick={() => onSelectDestinationByName && onSelectDestinationByName(dest.name)}
                  className="flex items-center gap-3 p-2 rounded-2xl hover:bg-white/5 transition-colors cursor-pointer group"
                >
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="w-10 h-10 rounded-xl object-cover border border-white/10 group-hover:scale-105 transition-transform"
                  />
                  <div className="flex-1">
                    <h4 className="text-xs font-bold text-white group-hover:text-sky-300 transition-colors">
                      {dest.name}
                    </h4>
                    <p className="text-[10px] text-slate-400">{dest.country} • {dest.count}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Popular Community Hashtags */}
          <div className="bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-3xl p-5 shadow-xl space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Popular Hashtags
            </div>
            <div className="flex flex-wrap gap-1.5">
              {POPULAR_HASHTAGS.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setActiveHashtag(tag)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
                    activeHashtag === tag
                      ? 'bg-sky-500 text-slate-950 border-sky-400 font-bold'
                      : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10 hover:border-sky-400/40'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Azraq Tour Verified Guarantee */}
          <div className="bg-gradient-to-br from-indigo-950/60 to-slate-900/60 border border-indigo-500/20 rounded-3xl p-5 shadow-xl space-y-2">
            <div className="flex items-center gap-2 text-sky-300 font-bold text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Azraq Tour Community
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Connect with fellow travelers, get genuine visa tips, and book verified curated packages with official 24/7 support in Bangladesh.
            </p>
          </div>
        </aside>
      </div>

      {/* Floating Create Post Button for Mobile / Quick Access */}
      <button
        onClick={handleOpenCreatePost}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white flex items-center justify-center shadow-2xl shadow-sky-500/50 hover:scale-110 active:scale-95 transition-all cursor-pointer border border-white/20"
        title="Create Travel Post"
      >
        <Plus className="w-6 h-6 stroke-[2.5]" />
      </button>

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onPostCreated={() => {
          loadInitialPosts();
        }}
      />
    </div>
  );
};
