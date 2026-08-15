import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, Volume2, VolumeX, Play, Pause } from 'lucide-react';
import { getOptimizedMediaUrl } from '../../lib/cloudinary';

interface PostMediaProps {
  mediaUrls: string[];
}

export const PostMedia: React.FC<PostMediaProps> = ({ mediaUrls }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  if (!mediaUrls || mediaUrls.length === 0) return null;

  const currentUrl = mediaUrls[currentIndex];
  const isVideo = currentUrl.endsWith('.mp4') || currentUrl.includes('/video/');

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentIndex < mediaUrls.length - 1) setCurrentIndex((i) => i + 1);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;

    if (diff > 50 && currentIndex < mediaUrls.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else if (diff < -50 && currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
    }
    setTouchStart(null);
  };

  const toggleVideoPlayback = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div
      className="relative w-full aspect-[4/3] sm:aspect-[16/10] bg-slate-950 overflow-hidden select-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {isVideo ? (
        <div className="w-full h-full relative" onClick={toggleVideoPlayback}>
          <video
            ref={videoRef}
            src={getOptimizedMediaUrl(currentUrl, { format: 'mp4', quality: 80 })}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            className="w-full h-full object-cover"
          />

          {/* Video Controls overlay */}
          <div className="absolute bottom-3 right-3 flex items-center gap-2 z-20">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsMuted((m) => !m);
              }}
              className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/80 transition-colors"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <button
              onClick={toggleVideoPlayback}
              className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/80 transition-colors"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
          </div>
        </div>
      ) : (
        <img
          src={getOptimizedMediaUrl(currentUrl, { width: 1080, quality: 'auto' })}
          alt="Post media"
          loading="lazy"
          className="w-full h-full object-cover transition-opacity duration-300"
        />
      )}

      {/* Multiple Media Carousel Navigation Controls */}
      {mediaUrls.length > 1 && (
        <>
          {currentIndex > 0 && (
            <button
              onClick={handlePrev}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/75 backdrop-blur-sm text-white flex items-center justify-center transition-all z-20 cursor-pointer shadow-md"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          {currentIndex < mediaUrls.length - 1 && (
            <button
              onClick={handleNext}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/75 backdrop-blur-sm text-white flex items-center justify-center transition-all z-20 cursor-pointer shadow-md"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}

          {/* Pagination Indicators */}
          <div className="absolute bottom-3 inset-x-0 flex items-center justify-center gap-1.5 z-20 pointer-events-none">
            {mediaUrls.map((_, idx) => (
              <span
                key={idx}
                className={`h-1.5 rounded-full transition-all ${
                  idx === currentIndex
                    ? 'w-5 bg-white shadow-md'
                    : 'w-1.5 bg-white/50'
                }`}
              />
            ))}
          </div>

          {/* Media Count Badge */}
          <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[11px] font-bold text-white z-20 pointer-events-none">
            {currentIndex + 1}/{mediaUrls.length}
          </div>
        </>
      )}
    </div>
  );
};
