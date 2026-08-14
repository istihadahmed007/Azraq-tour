import React, { createContext, useContext, useState, useEffect } from 'react';
import { BlogPost, BlogCategory } from '../types';
import { INITIAL_BLOG_POSTS } from '../data/blogPostsData';

interface BlogContextType {
  posts: BlogPost[];
  categories: (BlogCategory | 'All')[];
  selectedCategory: BlogCategory | 'All';
  setSelectedCategory: (category: BlogCategory | 'All') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activePost: BlogPost | null;
  setActivePost: (post: BlogPost | null) => void;
  isLoading: boolean;
  createBlogPost: (postData: Partial<BlogPost>) => Promise<{ success: boolean; message: string; post?: BlogPost }>;
  updateBlogPost: (id: string, postData: Partial<BlogPost>) => Promise<{ success: boolean; message: string; post?: BlogPost }>;
  deleteBlogPost: (id: string) => Promise<{ success: boolean; message: string }>;
  likeBlogPost: (id: string) => Promise<void>;
  fetchPosts: () => Promise<void>;
}

const BlogContext = createContext<BlogContextType | undefined>(undefined);

export const BlogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [posts, setPosts] = useState<BlogPost[]>(INITIAL_BLOG_POSTS);
  const [selectedCategory, setSelectedCategory] = useState<BlogCategory | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activePost, setActivePost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const categories: (BlogCategory | 'All')[] = [
    'All',
    'Destination Guide',
    'Visa Update',
    'Client Spotlight',
    'Travel Tips',
  ];

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (selectedCategory !== 'All') queryParams.append('category', selectedCategory);
      if (searchQuery.trim()) queryParams.append('search', searchQuery.trim());

      const res = await fetch(`/api/blog/posts?${queryParams.toString()}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.posts)) {
          setPosts(data.posts);
        }
      }
    } catch (err) {
      console.warn('Using local blog posts due to fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [selectedCategory, searchQuery]);

  const createBlogPost = async (postData: Partial<BlogPost>) => {
    try {
      const res = await fetch('/api/blog/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        await fetchPosts();
        return { success: true, message: data.message || 'Post published!', post: data.post };
      }
      return { success: false, message: data.error || 'Failed to publish post.' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Network error.' };
    }
  };

  const updateBlogPost = async (id: string, postData: Partial<BlogPost>) => {
    try {
      const res = await fetch(`/api/blog/posts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        await fetchPosts();
        if (activePost?.id === id) {
          setActivePost(data.post);
        }
        return { success: true, message: data.message || 'Post updated!', post: data.post };
      }
      return { success: false, message: data.error || 'Failed to update post.' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Network error.' };
    }
  };

  const deleteBlogPost = async (id: string) => {
    try {
      const res = await fetch(`/api/blog/posts/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok && data.success) {
        if (activePost?.id === id) setActivePost(null);
        await fetchPosts();
        return { success: true, message: 'Post deleted successfully.' };
      }
      return { success: false, message: data.error || 'Failed to delete.' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Network error.' };
    }
  };

  const likeBlogPost = async (id: string) => {
    try {
      setPosts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, likesCount: (p.likesCount || 0) + 1 } : p))
      );
      if (activePost?.id === id) {
        setActivePost((prev) => (prev ? { ...prev, likesCount: (prev.likesCount || 0) + 1 } : null));
      }
      await fetch(`/api/blog/posts/${id}/like`, { method: 'POST' });
    } catch (err) {
      console.error('Failed to like post:', err);
    }
  };

  return (
    <BlogContext.Provider
      value={{
        posts,
        categories,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        activePost,
        setActivePost,
        isLoading,
        createBlogPost,
        updateBlogPost,
        deleteBlogPost,
        likeBlogPost,
        fetchPosts,
      }}
    >
      {children}
    </BlogContext.Provider>
  );
};

export const useBlog = () => {
  const context = useContext(BlogContext);
  if (!context) {
    throw new Error('useBlog must be used within a BlogProvider');
  }
  return context;
};
