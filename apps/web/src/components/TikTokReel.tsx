import { useState, useRef, useEffect } from 'react';
import { Heart, MessageCircle, Share2, Sparkles, Radio } from "lucide-react";
import VideoPlayer from "@/components/VideoPlayer";
import { cn } from '@/lib/utils';

interface TikTokReelProps {
  reel: {
    id: string;
    videoUrl: string;
    thumbnailUrl: string;
    user: {
      username: string;
      displayName: string;
      avatar: string;
      isLive?: boolean;
    };
    caption: string;
    hashtags: string[];
    stats: {
      likes: number;
      comments: number;
      shares: number;
      views: number;
    };
    interactions: {
      liked: boolean;
    };
  };
  isActive: boolean;
  onProfile: () => void;
  onLike: () => void;
  onComment: () => void;
  onShare: () => void;
  onFollow: () => void;
}

export default function TikTokReel({ 
  reel, 
  isActive, 
  onProfile, 
  onLike, 
  onComment, 
  onShare, 
  onFollow 
}: TikTokReelProps) {
  // Performance optimization: debounce analytics calls
  const debouncedAnalytics = useRef<NodeJS.Timeout>();
  const [captionExpanded, setCaptionExpanded] = useState(false);

  const handleVideoEnd = () => {
    // Debounced analytics for better performance
    if (debouncedAnalytics.current) {
      clearTimeout(debouncedAnalytics.current);
    }
    debouncedAnalytics.current = setTimeout(() => {
      console.log('Video completed:', reel.id);
    }, 100);
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="feed-item relative w-full overflow-hidden" style={{ minHeight: 'calc(var(--vh) - var(--header-h))' }}>
      {/* Performance-optimized video player */}
      <VideoPlayer
        src={reel.videoUrl}
        poster={reel.thumbnailUrl}
        isActive={isActive}
        onEnded={handleVideoEnd}
        className="absolute inset-0"
      />


      {/* Right action rail - TikTok style */}
      <aside className="absolute right-3 bottom-20 flex flex-col items-center gap-4 z-50">
        {/* Creator avatar with follow button */}
        <div className="flex flex-col items-center">
          <button onClick={onProfile} className="relative mb-2">
            <img
              src={reel.user.avatar}
              alt={reel.user.displayName}
              className="w-12 h-12 rounded-full border-2 border-white object-cover"
            />
            {reel.user.isLive && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              </div>
            )}
          </button>
          <button
            onClick={onFollow}
            className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center -mt-3 border-2 border-white"
          >
            <Plus className="h-4 w-4 text-white" />
          </button>
        </div>

        {/* Like button */}
        <div className="flex flex-col items-center">
          <button
            onClick={onLike}
            className="w-12 h-12 flex items-center justify-center"
          >
            <Heart className={cn(
              "h-8 w-8 transition-all duration-200",
              reel.interactions.liked ? "fill-red-500 text-red-500 scale-110" : "text-white"
            )} />
          </button>
          <span className="text-white text-xs font-semibold">
            {formatNumber(reel.stats.likes)}
          </span>
        </div>

        {/* Comment button */}
        <div className="flex flex-col items-center">
          <button onClick={onComment} className="w-12 h-12 flex items-center justify-center">
            <MessageCircle className="h-8 w-8 text-white" />
          </button>
          <span className="text-white text-xs font-semibold">
            {formatNumber(reel.stats.comments)}
          </span>
        </div>

        {/* Share button */}
        <div className="flex flex-col items-center">
          <button onClick={onShare} className="w-12 h-12 flex items-center justify-center">
            <Share2 className="h-8 w-8 text-white" />
          </button>
          <span className="text-white text-xs font-semibold">
            {formatNumber(reel.stats.shares)}
          </span>
        </div>

        {/* Animated disc/album art */}
        <div className="mt-2">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-white/20 flex items-center justify-center animate-spin-slow">
            <Music2 className="h-6 w-6 text-white" />
          </div>
        </div>
      </aside>

      {/* Bottom gradient for readability */}
      <div className="feed-bottom-gradient"></div>

      {/* Caption area positioned above nav */}
      <div className="feed-caption">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-semibold text-white drop-shadow-lg">@{reel.user.username}</span>
          {reel.user.isLive && (
            <span className="text-xs bg-red-500 text-white px-1.5 py-0.5 rounded-full font-medium">LIVE</span>
          )}
        </div>
        <div className="mb-1">
          <p className="text-sm text-white leading-relaxed drop-shadow-lg">
            {captionExpanded
              ? reel.caption
              : reel.caption.split(' ').slice(0, 3).join(' ')
            }
            {reel.caption.split(' ').length > 3 && !captionExpanded && '...'}
            {reel.caption.split(' ').length > 3 && (
              <button
                onClick={() => setCaptionExpanded(!captionExpanded)}
                className="text-xs text-white/80 ml-1 hover:text-white font-medium drop-shadow-lg"
              >
                {captionExpanded ? ' less' : ' more'}
              </button>
            )}
          </p>
        </div>
        <p className="text-xs text-white/80 drop-shadow-lg">
          {reel.hashtags.slice(0, 3).join(' ')}
        </p>
      </div>
    </div>
  );
}
