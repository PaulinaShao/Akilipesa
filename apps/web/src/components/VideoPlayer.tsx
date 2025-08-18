import { useRef, useEffect, useState, useCallback } from 'react';
import { Play, Pause } from 'lucide-react';

interface VideoPlayerProps {
  src: string;
  poster: string;
  isActive: boolean;
  onEnded?: () => void;
  className?: string;
}

export default function VideoPlayer({ 
  src, 
  poster, 
  isActive, 
  onEnded, 
  className = "" 
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPlayButton, setShowPlayButton] = useState(false);

  // Performance optimization: Use requestIdleCallback for non-critical updates
  const updatePlayState = useCallback((playing: boolean) => {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => setIsPlaying(playing));
    } else {
      setIsPlaying(playing);
    }
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isActive) {
      video.play().catch(() => {
        setShowPlayButton(true);
      });
      updatePlayState(true);
    } else {
      video.pause();
      updatePlayState(false);
    }
  }, [isActive, updatePlayState]);

  const handleVideoClick = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      updatePlayState(false);
    } else {
      video.play().catch(() => {
        setShowPlayButton(true);
      });
      updatePlayState(true);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        poster={poster}
        loop
        muted
        playsInline
        preload="metadata" // Performance: only load metadata initially
        loading="lazy" // Lazy load for better performance
        onClick={handleVideoClick}
        onEnded={onEnded}
        style={{ willChange: 'transform' }} // Performance hint for animations
      >
        <source src={src} type="video/mp4" />
      </video>

      {/* Play/Pause overlay */}
      {showPlayButton && (
        <div 
          className="absolute inset-0 flex items-center justify-center bg-black/20 z-10"
          onClick={handleVideoClick}
        >
          <div className="tz-glass rounded-full p-4">
            {isPlaying ? (
              <Pause className="w-12 h-12 text-white" />
            ) : (
              <Play className="w-12 h-12 text-white" />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
