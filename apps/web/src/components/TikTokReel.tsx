import { useState, useRef, useEffect } from 'react';
import { Heart, MessageCircle, Share2, Sparkles, Radio } from "lucide-react";
import AutoHideHeader from "@/components/AutoHideHeader";
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
    <div className="relative h-dvh w-full overflow-hidden tz-bg">
      {/* Performance-optimized video player */}
      <VideoPlayer
        src={reel.videoUrl}
        poster={reel.thumbnailUrl}
        isActive={isActive}
        onEnded={handleVideoEnd}
        className="absolute inset-0"
      />

      {/* Auto-hide header */}
      <AutoHideHeader
        onProfileClick={onProfile}
        showLiveInfo={reel.user.isLive}
        viewerCount="1.2k"
      />

      {/* Right action rail */}
      <aside className="absolute right-2 bottom-20 flex flex-col items-center gap-4 z-20">
        <div className="flex flex-col items-center">
          <button
            onClick={onLike}
            className={cn(
              "rail-btn",
              reel.interactions.liked && "bg-red-500/20"
            )}
          >
            <Heart className={cn(
              "h-6 w-6 transition-colors",
              reel.interactions.liked ? "fill-red-500 text-red-500" : "text-white"
            )} />
          </button>
          <span className="text-white text-xs mt-1 font-medium">
            {formatNumber(reel.stats.likes)}
          </span>
        </div>

        <div className="flex flex-col items-center">
          <button onClick={onComment} className="rail-btn">
            <MessageCircle className="h-6 w-6 text-white" />
          </button>
          <span className="text-white text-xs mt-1 font-medium">
            {formatNumber(reel.stats.comments)}
          </span>
        </div>

        <div className="flex flex-col items-center">
          <button onClick={onShare} className="rail-btn">
            <Share2 className="h-6 w-6 text-white" />
          </button>
          <span className="text-white text-xs mt-1 font-medium">
            {formatNumber(reel.stats.shares)}
          </span>
        </div>

        <button onClick={onFollow} className="rail-btn">
          <Sparkles className="h-6 w-6 text-white" />
        </button>

        {/* Creator avatar */}
        <div className="mt-2">
          <button onClick={onProfile} className="relative">
            <img
              src={reel.user.avatar}
              alt={reel.user.displayName}
              className="w-12 h-12 rounded-full border-2 border-white/30 object-cover"
            />
            {reel.user.isLive && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              </div>
            )}
          </button>
        </div>
      </aside>

      {/* Bottom caption area - clean overlay */}
      <div className="absolute left-3 bottom-20 right-16 z-20">
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
