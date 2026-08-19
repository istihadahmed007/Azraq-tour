import React, { useState, useEffect, useRef } from 'react';
import { Comment, Post, Profile } from '../../lib/types';
import { getComments, createComment } from '../../lib/queries';
import { useAuth } from '../../context/AuthContext';
import { X, Send, CheckCircle2, MessageSquare, Sparkles } from 'lucide-react';

interface CommentsSheetProps {
  post: Post;
  isOpen: boolean;
  onClose: () => void;
  onCommentAdded?: () => void;
}

export const CommentsSheet: React.FC<CommentsSheetProps> = ({
  post,
  isOpen,
  onClose,
  onCommentAdded,
}) => {
  const { user, isGuest, openAuthModal, showToast } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCommentText, setNewCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    let mounted = true;
    setLoading(true);
    getComments(post.id)
      .then((data) => {
        if (mounted) {
          setComments(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [isOpen, post.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim() || isSubmitting) return;

    if (isGuest || !user) {
      openAuthModal('login');
      return;
    }

    const userProfile: Profile = {
      id: user.uid,
      username: (user.fullName || user.email || 'traveler').replace(/\s+/g, '_').toLowerCase(),
      full_name: user.fullName || 'Traveler',
      avatar_url:
        user.photoURL ||
        `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.fullName || 'User')}`,
      created_at: new Date().toISOString(),
      is_verified: user.isAdmin || false,
    };

    setIsSubmitting(true);
    try {
      const addedComment = await createComment({
        postId: post.id,
        userId: user.uid,
        userProfile,
        content: newCommentText.trim(),
      });

      setComments((prev) => [...prev, addedComment]);
      setNewCommentText('');
      if (onCommentAdded) onCommentAdded();
      showToast('Comment posted successfully!', 'success');

      // Scroll to bottom
      setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
      }, 100);
    } catch (err) {
      showToast('Failed to post comment. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Sheet Modal Container */}
      <div className="relative w-full max-w-lg bg-slate-900 border border-white/20 rounded-t-3xl md:rounded-3xl shadow-2xl flex flex-col max-h-[85vh] h-[650px] z-10 overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-sky-400" />
            <h3 className="text-sm font-bold text-white">
              Comments ({comments.length})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Comment List */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-700"
        >
          {loading ? (
            // Skeleton loaders
            <div className="space-y-4">
              {[1, 2, 3].map((n) => (
                <div key={n} className="flex gap-3 items-start animate-pulse">
                  <div className="w-8 h-8 rounded-full bg-white/10 shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3.5 bg-white/10 rounded w-24" />
                    <div className="h-3 bg-white/10 rounded w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : comments.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <Sparkles className="w-10 h-10 text-sky-400/40 mb-2 animate-bounce-subtle" />
              <p className="text-sm font-semibold text-slate-300">No comments yet</p>
              <p className="text-xs text-slate-500 mt-1">
                Be the first to share your thoughts on this trip!
              </p>
            </div>
          ) : (
            comments.map((c) => (
              <div key={c.id} className="flex gap-3 items-start group">
                <img
                  src={
                    c.profile?.avatar_url ||
                    `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                      c.profile?.username || 'user'
                    )}`
                  }
                  alt={c.profile?.username}
                  className="w-8 h-8 rounded-full object-cover border border-white/10 shrink-0"
                />
                <div className="flex-1 bg-white/5 rounded-2xl p-3 border border-white/5">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-bold text-sky-300">
                        {c.profile?.username || 'traveler'}
                      </span>
                      {c.profile?.is_verified && (
                        <CheckCircle2 className="w-3 h-3 text-sky-400 shrink-0" />
                      )}
                    </div>
                    <span className="text-[10px] text-slate-500">
                      {new Date(c.created_at).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed break-words">
                    {c.content}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Fixed Comment Input Form at Bottom */}
        <form
          onSubmit={handleSubmit}
          className="p-3 bg-slate-950 border-t border-white/10 flex items-center gap-2"
        >
          {!isGuest && user && (
            <img
              src={
                user.photoURL ||
                `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                  user.fullName || user.email || 'traveler'
                )}`
              }
              alt={user.fullName || 'User'}
              className="w-7 h-7 rounded-full object-cover border border-white/20 shrink-0"
            />
          )}
          <input
            type="text"
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            placeholder={
              isGuest ? 'Log in to join the conversation...' : 'Add a friendly comment...'
            }
            className="flex-1 bg-white/10 text-white placeholder-slate-400 text-xs px-4 py-2.5 rounded-full border border-white/10 focus:outline-none focus:border-sky-400 transition-colors"
            maxLength={250}
          />
          <button
            type="submit"
            disabled={!newCommentText.trim() || isSubmitting}
            className="w-9 h-9 rounded-full bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md shrink-0 cursor-pointer"
          >
            <Send className="w-4 h-4 ml-0.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
