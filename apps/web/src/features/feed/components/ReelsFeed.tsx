import { useState, useEffect, useRef, useCallback } from 'react';
import { mockReels } from '../mockData';
import { Reel } from '../types';
import ReelCard from './ReelCard';

export default function ReelsFeed() {
  const [reels] = useState<Reel[]>(mockReels);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  // Handle scroll events with debouncing
  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const scrollTop = container.scrollTop;
    const itemHeight = container.clientHeight;
    const newIndex = Math.round(scrollTop / itemHeight);
    
    if (newIndex !== currentIndex && newIndex >= 0 && newIndex < reels.length) {
      setCurrentIndex(newIndex);
    }

    setIsScrolling(true);
    
    // Clear existing timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    
    // Set scrolling to false after scroll ends
    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, 150);
  }, [currentIndex, reels.length]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      container.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [handleScroll]);

  // Preload adjacent videos
  useEffect(() => {
    const preloadIndexes = [
      Math.max(0, currentIndex - 1),
      currentIndex,
      Math.min(reels.length - 1, currentIndex + 1),
    ];

    preloadIndexes.forEach(index => {
      if (reels[index]) {
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.src = reels[index].video.url;
      }
    });
  }, [currentIndex, reels]);

  // Social actions
  const handleLike = useCallback((reelId: string) => {
    console.log('Like reel:', reelId);
    // TODO: Implement like functionality
  }, []);

  const handleComment = useCallback((reelId: string) => {
    console.log('Comment on reel:', reelId);
    // TODO: Open comments bottom sheet
  }, []);

  const handleShare = useCallback((reelId: string) => {
    console.log('Share reel:', reelId);
    // TODO: Implement share functionality
  }, []);

  const handleShop = useCallback((reelId: string) => {
    console.log('Shop reel:', reelId);
    // TODO: Open product drawer
  }, []);

  const handleLiveCall = useCallback(async (reelId: string) => {
    console.log('Join live call:', reelId);

    // Find the reel to get user info
    const reel = reels.find(r => r.id === reelId);
    if (!reel) return;

    try {
      await initiateCall({
        targetId: reel.user.id,
        callType: 'video', // Live calls are typically video
        targetName: reel.user.displayName,
        targetAvatar: reel.user.avatar
      });
    } catch (error) {
      console.error('Failed to initiate live call:', error);
    }
  }, [reels]);

  const handleFollow = useCallback((userId: string) => {
    console.log('Follow user:', userId);
    // TODO: Implement follow functionality
  }, []);

  return (
    <div className="h-screen-safe bg-black overflow-hidden">
      {/* Reels container with snap scrolling */}
      <div 
        ref={containerRef}
        className="h-full overflow-y-auto snap-y snap-mandatory hide-scrollbar"
        style={{ scrollBehavior: isScrolling ? 'auto' : 'smooth' }}
      >
        {reels.map((reel, index) => (
          <div key={reel.id} className="h-screen-safe snap-start">
            <ReelCard
              reel={reel}
              isActive={index === currentIndex && !isScrolling}
              onLike={handleLike}
              onComment={handleComment}
              onShare={handleShare}
              onShop={handleShop}
              onLiveCall={handleLiveCall}
              onFollow={handleFollow}
            />
          </div>
        ))}
      </div>

      {/* Loading indicator for infinite scroll */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 opacity-30">
        <div className="flex space-x-1">
          {reels.map((_, index) => (
            <div 
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex ? 'bg-accent-400 scale-125' : 'bg-white/30'
              }`} 
            />
          ))}
        </div>
      </div>
    </div>
  );
}
