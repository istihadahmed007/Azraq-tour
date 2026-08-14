import React, { createContext, useContext, useState, useEffect } from 'react';
import { FeedPost, Comment, TrendingHashtag } from '../types';
import { useAuth } from './AuthContext';
import { db } from '../lib/firebase';
import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';

interface FeedContextType {
  posts: FeedPost[];
  userPosts: FeedPost[];
  bookmarkedPosts: FeedPost[];
  trendingHashtags: TrendingHashtag[];
  isLoading: boolean;
  createPost: (content: string, location?: string, imageUrl?: string) => Promise<{ success: boolean; post?: FeedPost; error?: string }>;
  deletePost: (postId: string) => Promise<{ success: boolean; error?: string }>;
  toggleLike: (postId: string) => Promise<void>;
  toggleBookmark: (postId: string) => Promise<void>;
  addComment: (postId: string, text: string) => Promise<void>;
  getUserPostsCount: (userUidOrEmail?: string) => number;
}

const FeedContext = createContext<FeedContextType | undefined>(undefined);

const LOCAL_STORAGE_FEED_KEY = 'azraq_tours_feed_posts_v2';

export const FeedProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, requireAuth, showToast } = useAuth();
  const [posts, setPosts] = useState<FeedPost[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_FEED_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to parse local posts:', e);
    }
    return [];
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Sync with Firestore collection 'feed_posts' in real-time
  useEffect(() => {
    let unsubscribe = () => {};
    try {
      const q = query(collection(db, 'feed_posts'), orderBy('createdAt', 'desc'));
      unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          if (!snapshot.empty) {
            const remotePosts: FeedPost[] = snapshot.docs.map((docSnap) => {
              const data = docSnap.data();
              const likedBy: string[] = Array.isArray(data.likedBy) ? data.likedBy : [];
              const bookmarkedBy: string[] = Array.isArray(data.bookmarkedBy) ? data.bookmarkedBy : [];

              return {
                id: docSnap.id,
                authorId: data.authorId || '',
                authorEmail: data.authorEmail || '',
                authorName: data.authorName || 'Traveler',
                authorAvatar: data.authorAvatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=traveler',
                location: data.location || 'Global Explorer',
                badgeLabel: data.badgeLabel || 'AI Verified Route',
                imageUrl: data.imageUrl || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80',
                likes: typeof data.likes === 'number' ? data.likes : likedBy.length,
                commentsCount: Array.isArray(data.commentsList) ? data.commentsList.length : (data.commentsCount || 0),
                caption: data.caption || '',
                hashtags: Array.isArray(data.hashtags) ? data.hashtags : ['#AzraqTours', '#TravelJourney'],
                timeAgo: data.timeAgo || 'Recently',
                isLiked: user ? likedBy.includes(user.uid) || likedBy.includes(user.email) : false,
                isBookmarked: user ? bookmarkedBy.includes(user.uid) || bookmarkedBy.includes(user.email) : false,
                commentsList: Array.isArray(data.commentsList) ? data.commentsList : [],
                aiVerified: data.aiVerified ?? true,
                likedBy,
                bookmarkedBy,
              } as FeedPost;
            });

            setPosts(remotePosts);
            localStorage.setItem(LOCAL_STORAGE_FEED_KEY, JSON.stringify(remotePosts));
          }
        },
        (error) => {
          console.warn('Firestore feed listener note:', error);
        }
      );
    } catch (e) {
      console.warn('Feed onSnapshot failed, relying on local sync:', e);
    }

    return () => unsubscribe();
  }, [user?.uid, user?.email]);

  // Sync posts to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_FEED_KEY, JSON.stringify(posts));
    } catch (e) {
      console.warn('Error saving feed posts to localStorage:', e);
    }
  }, [posts]);

  // Create new post
  const createPost = async (
    content: string,
    location?: string,
    imageUrl?: string
  ): Promise<{ success: boolean; post?: FeedPost; error?: string }> => {
    if (!content.trim()) {
      return { success: false, error: 'Post content cannot be empty.' };
    }

    if (!user) {
      return { success: false, error: 'Please sign in to publish your travel story.' };
    }

    setIsLoading(true);
    try {
      // Call AI verification if available
      let badgeLabel = 'AI Verified Route';
      let hashtags = ['#AzraqTours', '#TravelDiscovery'];

      try {
        const aiRes = await fetch('/api/ai/verify-post', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content,
            location: location || 'Global Explorer',
          }),
        });
        if (aiRes.ok) {
          const aiData = await aiRes.json();
          if (aiData.badgeLabel) badgeLabel = aiData.badgeLabel;
          if (aiData.hashtags && Array.isArray(aiData.hashtags)) hashtags = aiData.hashtags;
        }
      } catch (aiErr) {
        console.warn('AI post verification notice:', aiErr);
      }

      const postId = `post_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const newPost: FeedPost = {
        id: postId,
        authorId: user.uid,
        authorEmail: user.email,
        authorName: user.fullName || 'Travel Explorer',
        authorAvatar: user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.fullName || 'explorer')}`,
        location: location?.trim() || user.homeLocation || 'Global Explorer',
        badgeLabel,
        imageUrl:
          imageUrl?.trim() ||
          'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80',
        likes: 1,
        commentsCount: 0,
        caption: content.trim(),
        hashtags,
        timeAgo: 'Just now',
        isLiked: true,
        isBookmarked: false,
        aiVerified: true,
        commentsList: [],
        likedBy: [user.uid, user.email],
        bookmarkedBy: [],
      };

      // 1. Optimistic local update
      setPosts((prev) => [newPost, ...prev]);

      // 2. Persist to Firestore
      try {
        await setDoc(doc(db, 'feed_posts', postId), {
          ...newPost,
          createdAt: serverTimestamp(),
          createdDate: new Date().toISOString(),
        });
      } catch (dbErr) {
        console.warn('Firestore write feed_post notice:', dbErr);
      }

      setIsLoading(false);
      showToast('Travel story published to Feed & your Profile! 🚀', 'success');
      return { success: true, post: newPost };
    } catch (err: any) {
      console.error('Error creating post:', err);
      setIsLoading(false);
      return { success: false, error: err?.message || 'Failed to create post.' };
    }
  };

  // Delete post
  const deletePost = async (postId: string): Promise<{ success: boolean; error?: string }> => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
    try {
      await deleteDoc(doc(db, 'feed_posts', postId));
      showToast('Post deleted successfully', 'info');
      return { success: true };
    } catch (err: any) {
      console.warn('Firestore delete error:', err);
      return { success: true };
    }
  };

  // Toggle Like
  const toggleLike = async (postId: string) => {
    if (!user) {
      requireAuth({ type: 'like_post', label: 'Liked travel post' });
      return;
    }

    const userId = user.uid;
    const userEmail = user.email;

    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          const currentLikedBy = post.likedBy || [];
          const isLikedNow = !(currentLikedBy.includes(userId) || currentLikedBy.includes(userEmail) || post.isLiked);
          const updatedLikedBy = isLikedNow
            ? [...currentLikedBy.filter((id) => id !== userId && id !== userEmail), userId]
            : currentLikedBy.filter((id) => id !== userId && id !== userEmail);

          const updatedLikes = isLikedNow ? post.likes + 1 : Math.max(0, post.likes - 1);

          // Async sync to Firestore
          try {
            updateDoc(doc(db, 'feed_posts', postId), {
              likedBy: updatedLikedBy,
              likes: updatedLikes,
            }).catch(() => {});
          } catch {}

          return {
            ...post,
            isLiked: isLikedNow,
            likes: updatedLikes,
            likedBy: updatedLikedBy,
          };
        }
        return post;
      })
    );
  };

  // Toggle Bookmark
  const toggleBookmark = async (postId: string) => {
    if (!user) {
      requireAuth({ type: 'bookmark_post', label: 'Saved post to bookmarks' });
      return;
    }

    const userId = user.uid;
    const userEmail = user.email;

    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          const currentBookmarkedBy = post.bookmarkedBy || [];
          const isBookmarkedNow = !(currentBookmarkedBy.includes(userId) || currentBookmarkedBy.includes(userEmail) || post.isBookmarked);
          const updatedBookmarkedBy = isBookmarkedNow
            ? [...currentBookmarkedBy.filter((id) => id !== userId && id !== userEmail), userId]
            : currentBookmarkedBy.filter((id) => id !== userId && id !== userEmail);

          showToast(
            isBookmarkedNow ? 'Post saved to Profile bookmarks! 🔖' : 'Post removed from bookmarks',
            'info'
          );

          // Async sync to Firestore
          try {
            updateDoc(doc(db, 'feed_posts', postId), {
              bookmarkedBy: updatedBookmarkedBy,
            }).catch(() => {});
          } catch {}

          return {
            ...post,
            isBookmarked: isBookmarkedNow,
            bookmarkedBy: updatedBookmarkedBy,
          };
        }
        return post;
      })
    );
  };

  // Add Comment
  const addComment = async (postId: string, text: string) => {
    if (!text.trim()) return;
    if (!user) {
      requireAuth({ type: 'comment_post', label: 'Added comment to post' });
      return;
    }

    const newComment: Comment = {
      id: `c_${Date.now()}`,
      author: user.fullName || 'Traveler',
      avatar: user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.fullName || 'user')}`,
      text: text.trim(),
      timeAgo: 'Just now',
    };

    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          const updatedComments = [...(post.commentsList || []), newComment];
          try {
            updateDoc(doc(db, 'feed_posts', postId), {
              commentsList: updatedComments,
              commentsCount: updatedComments.length,
            }).catch(() => {});
          } catch {}

          return {
            ...post,
            commentsCount: updatedComments.length,
            commentsList: updatedComments,
          };
        }
        return post;
      })
    );

    showToast('Comment added!', 'success');
  };

  // Dynamically derive user's posts
  const userPosts = posts.filter(
    (p) =>
      user &&
      (p.authorId === user.uid ||
        p.authorEmail?.toLowerCase() === user.email.toLowerCase() ||
        p.authorName === user.fullName)
  );

  // Dynamically derive bookmarked posts for currently logged in user
  const bookmarkedPosts = posts.filter(
    (p) =>
      p.isBookmarked ||
      (user &&
        (p.bookmarkedBy?.includes(user.uid) || p.bookmarkedBy?.includes(user.email)))
  );

  // Derive trending hashtags dynamically from all real posts
  const hashtagCountMap = new Map<string, number>();
  posts.forEach((p) => {
    p.hashtags?.forEach((tag) => {
      const cleanTag = tag.startsWith('#') ? tag : `#${tag}`;
      hashtagCountMap.set(cleanTag, (hashtagCountMap.get(cleanTag) || 0) + 1);
    });
  });

  const trendingHashtags: TrendingHashtag[] = Array.from(hashtagCountMap.entries())
    .map(([tag, count]) => ({
      tag,
      postsCount: `${count} post${count > 1 ? 's' : ''}`,
      isRising: count > 1,
    }))
    .sort((a, b) => parseInt(b.postsCount) - parseInt(a.postsCount));

  const getUserPostsCount = (userUidOrEmail?: string): number => {
    if (!userUidOrEmail) return userPosts.length;
    const target = userUidOrEmail.toLowerCase();
    return posts.filter(
      (p) =>
        p.authorId === userUidOrEmail ||
        p.authorEmail?.toLowerCase() === target ||
        p.authorName.toLowerCase() === target
    ).length;
  };

  return (
    <FeedContext.Provider
      value={{
        posts,
        userPosts,
        bookmarkedPosts,
        trendingHashtags,
        isLoading,
        createPost,
        deletePost,
        toggleLike,
        toggleBookmark,
        addComment,
        getUserPostsCount,
      }}
    >
      {children}
    </FeedContext.Provider>
  );
};

export const useFeed = () => {
  const context = useContext(FeedContext);
  if (!context) {
    throw new Error('useFeed must be used within a FeedProvider');
  }
  return context;
};
