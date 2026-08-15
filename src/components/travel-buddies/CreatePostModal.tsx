import React, { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { createPost } from '../../lib/queries';
import { uploadToCloudinary } from '../../lib/cloudinary';
import { Profile } from '../../lib/types';
import {
  X,
  UploadCloud,
  Image as ImageIcon,
  Video,
  MapPin,
  Sparkles,
  CheckCircle2,
  Trash2,
  AlertCircle,
  Clock,
} from 'lucide-react';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated: () => void;
}

const POPULAR_LOCATIONS = [
  "Cox's Bazar, Bangladesh",
  'Sajek Valley, Bangladesh',
  'Bandarban, Bangladesh',
  'Maafushi, Maldives',
  'Ubud, Bali, Indonesia',
  'Kuala Lumpur, Malaysia',
  'Bangkok, Thailand',
];

const SUGGESTED_HASHTAGS = [
  '#AzraqDiaries',
  '#BangladeshTravel',
  '#TravelBuddies',
  '#ExploreBangladesh',
  '#MaldivesLuxury',
  '#BaliVibes',
];

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onClose,
  onPostCreated,
}) => {
  const { user, isGuest, openAuthModal, showToast } = useAuth();
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [filePreviews, setFilePreviews] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [showModerationSuccess, setShowModerationSuccess] = useState<boolean>(false);
  const [dragActive, setDragActive] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;
    const validFiles: File[] = [];
    const previews: string[] = [];

    Array.from(files).forEach((file) => {
      if (file.size > 50 * 1024 * 1024) {
        showToast(`File ${file.name} exceeds the 50MB limit.`, 'error');
        return;
      }
      if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
        showToast(`File ${file.name} is not a supported image or video format.`, 'error');
        return;
      }
      validFiles.push(file);
      previews.push(URL.createObjectURL(file));
    });

    setSelectedFiles((prev) => [...prev, ...validFiles]);
    setFilePreviews((prev) => [...prev, ...previews]);
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setFilePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  const handleAddHashtag = (tag: string) => {
    if (caption.includes(tag)) return;
    if (caption.length + tag.length + 1 > 300) return;
    setCaption((prev) => (prev ? `${prev} ${tag}` : tag));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!caption.trim() && selectedFiles.length === 0) {
      showToast('Please add a caption or upload media.', 'error');
      return;
    }

    if (isGuest || !user) {
      openAuthModal('login');
      return;
    }

    setIsUploading(true);
    setUploadProgress(10);

    try {
      const mediaUrls: string[] = [];

      if (selectedFiles.length > 0) {
        for (let i = 0; i < selectedFiles.length; i++) {
          const file = selectedFiles[i];
          const uploadRes = await uploadToCloudinary(file, (p) => {
            const step = Math.round(((i + p / 100) / selectedFiles.length) * 80) + 10;
            setUploadProgress(step);
          });
          mediaUrls.push(uploadRes.secure_url);
        }
      }

      setUploadProgress(95);

      const userProfile: Profile = {
        id: user.uid,
        username: (user.fullName || user.email || 'traveler').replace(/\s+/g, '_').toLowerCase(),
        full_name: user.fullName || 'Traveler',
        avatar_url:
          user.photoURL ||
          `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.fullName || 'User')}`,
        created_at: new Date().toISOString(),
        is_verified: user.isAdmin || false,
        role: user.isAdmin ? 'admin' : 'user',
      };

      const res = await createPost({
        userId: user.uid,
        userProfile,
        location: location.trim() || 'Global Explorer',
        caption: caption.trim(),
        mediaUrls,
        isAdmin: user.isAdmin,
      });

      setUploadProgress(100);

      if (res.success) {
        setShowModerationSuccess(true);
        onPostCreated();
      }
    } catch (err: any) {
      showToast(err?.message || 'Failed to submit post. Please try again.', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleResetAndClose = () => {
    setCaption('');
    setLocation('');
    setSelectedFiles([]);
    setFilePreviews([]);
    setUploadProgress(0);
    setShowModerationSuccess(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={handleResetAndClose} />

      <div className="relative w-full max-w-xl bg-slate-900 border border-white/20 rounded-3xl shadow-2xl z-10 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Create Travel Post</h3>
              <p className="text-[11px] text-slate-400">Share your journey with Azraq Travel Buddies</p>
            </div>
          </div>
          <button
            onClick={handleResetAndClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        {showModerationSuccess ? (
          <div className="p-8 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-inner">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-white">Post Submitted!</h4>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 max-w-md">
              <p className="text-xs text-emerald-300 font-semibold mb-1 flex items-center justify-center gap-1.5">
                <Clock className="w-4 h-4" />
                Your post has been submitted for review.
              </p>
              <p className="text-[11px] text-slate-400">
                Our Azraq Tour community moderation team reviews all travel memories to ensure a safe, inspiring space for everyone.
              </p>
            </div>
            <button
              onClick={handleResetAndClose}
              className="px-6 py-2.5 rounded-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs shadow-lg transition-all cursor-pointer"
            >
              Back to Travel Feed
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-thin">
            {/* Upload Area */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all ${
                dragActive
                  ? 'border-sky-400 bg-sky-500/10'
                  : 'border-white/15 hover:border-sky-400/50 bg-white/5'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp,video/mp4"
                onChange={(e) => handleFileSelect(e.target.files)}
                className="hidden"
              />

              <div className="flex flex-col items-center justify-center gap-2 py-2">
                <div className="w-12 h-12 rounded-2xl bg-sky-500/20 text-sky-400 flex items-center justify-center shadow-inner">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">
                    Drag and drop photos or videos, or <span className="text-sky-400 underline">browse</span>
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Supports JPG, PNG, WEBP, MP4 (Max 50MB per file)
                  </p>
                </div>
              </div>
            </div>

            {/* Media Previews */}
            {filePreviews.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                {filePreviews.map((preview, idx) => {
                  const isVid = selectedFiles[idx]?.type?.startsWith('video/');
                  return (
                    <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-white/20 group">
                      {isVid ? (
                        <video src={preview} className="w-full h-full object-cover" />
                      ) : (
                        <img src={preview} alt="Upload preview" className="w-full h-full object-cover" />
                      )}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFile(idx);
                        }}
                        className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/70 hover:bg-rose-600 text-white flex items-center justify-center transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Location Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                Where are you?
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Cox's Bazar, Sajek Valley, Bali, Maldives..."
                className="w-full bg-white/10 text-white text-xs px-3.5 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-sky-400 transition-colors"
              />
              {/* Quick Destination Chips */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {POPULAR_LOCATIONS.map((loc) => (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => setLocation(loc)}
                    className="px-2 py-0.5 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-[10px] text-slate-300 transition-colors"
                  >
                    📍 {loc.split(',')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Caption Input */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300">
                  Share your travel story...
                </label>
                <span
                  className={`text-[10px] font-mono ${
                    caption.length >= 280 ? 'text-amber-400 font-bold' : 'text-slate-500'
                  }`}
                >
                  {caption.length}/300
                </span>
              </div>
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value.slice(0, 300))}
                rows={3}
                placeholder="Sunset at Cox’s Bazar was unforgettable 🌅 #AzraqDiaries #BangladeshTravel"
                className="w-full bg-white/10 text-white text-xs p-3 rounded-xl border border-white/10 focus:outline-none focus:border-sky-400 transition-colors resize-none leading-relaxed"
              />

              {/* Hashtag Suggestions */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {SUGGESTED_HASHTAGS.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleAddHashtag(tag)}
                    className="px-2 py-0.5 rounded-full bg-sky-500/10 hover:bg-sky-500/20 border border-sky-400/20 text-[10px] text-sky-300 font-medium transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Upload Progress Bar */}
            {isUploading && (
              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px] text-sky-300">
                  <span>Uploading media & optimizing...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-sky-400 to-indigo-500 transition-all duration-200"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isUploading || (!caption.trim() && selectedFiles.length === 0)}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-sky-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isUploading ? 'Publishing Journey...' : 'Submit Travel Post'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
