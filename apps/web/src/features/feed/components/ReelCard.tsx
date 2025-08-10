import { useState, useRef, useEffect } from 'react';
import { 
  Heart, 
  MessageCircle, 
  Share, 
  ShoppingBag, 
  Phone, 
  Music2,
  MoreHorizontal,
  Play,
  Pause
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Reel } from '../types';
import { formatNumber } from '../mockData';

interface ReelCardProps {
  reel: Reel;
  isActive: boolean;
  onLike: (reelId: string) => void;
  onComment: (reelId: string) => void;
  onShare: (reelId: string) => void;
  onShop: (reelId: string) => void;
  onLiveCall: (reelId: string) => void;
  onFollow: (userId: string) => void;
}

export default function ReelCard({
  reel,
  isActive,
  onLike,
  onComment,
  onShare,
  onShop,
  onLiveCall,
  onFollow,
}: ReelCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPlayButton, setShowPlayButton] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isActive) {
      video.play().catch(() => {
        setShowPlayButton(true);
      });
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  }, [isActive]);

  const handleVideoClick = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
      setShowPlayButton(true);
    } else {
      video.play();
      setIsPlaying(true);
      setShowPlayButton(false);
    }
  };

  const handleLike = () => {
    onLike(reel.id);
  };

  const handleFollow = () => {
    onFollow(reel.user.id);
  };

  return (
    <div className="reel-card">
      {/* Video Background */}
      <video
        ref={videoRef}
        className="reel-video"
        poster={reel.video.thumbnail}
        loop
        muted
        playsInline
        onClick={handleVideoClick}
      >
        <source src={reel.video.url} type="video/mp4" />
      </video>

      {/* Play/Pause overlay */}
      {showPlayButton && (
        <div 
          className="absolute inset-0 flex-center bg-black/20 z-10"
          onClick={handleVideoClick}
        >
          <div className="w-20 h-20 rounded-full bg-black/50 flex-center backdrop-blur-sm">
            {isPlaying ? (
              <Pause className="w-10 h-10 text-white" />
            ) : (
              <Play className="w-10 h-10 text-white ml-1" />
            )}
          </div>
        </div>
      )}

      {/* Gradient overlay */}
      <div className="reel-overlay" />

      {/* Content */}
      <div className="reel-content">
        {/* User info */}
        <div className="flex items-center space-x-3 mb-3">
          <div className="relative">
            <img 
              src={reel.user.avatar} 
              alt={reel.user.displayName}
              className="w-12 h-12 avatar-glow"
            />
            {reel.user.isLive && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex-center">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-white">@{reel.user.username}</span>
              {reel.user.verified && (
                <div className="w-4 h-4 bg-accent-500 rounded-full flex-center">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
              )}
              {reel.user.isLive && (
                <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full font-medium">
                  LIVE
                </span>
              )}
            </div>
            <span className="text-sm text-white/80">{reel.user.displayName}</span>
          </div>

          {!reel.interactions.followed && (
            <button
              onClick={handleFollow}
              className="btn-gem-outline text-xs px-3 py-1"
            >
              Follow
            </button>
          )}
        </div>

        {/* Caption */}
        <div className="mb-2">
          <p className="text-white text-sm leading-relaxed">
            {reel.caption}
          </p>
        </div>

        {/* Location */}
        {reel.location && (
          <div className="flex items-center space-x-1 mb-3">
            <div className="w-3 h-3 bg-accent-400 rounded-full" />
            <span className="text-white/80 text-xs">{reel.location.name}</span>
          </div>
        )}

        {/* Audio info */}
        <div className="flex items-center space-x-2 mb-2">
          <Music2 className="w-4 h-4 text-white" />
          <span className="text-white/80 text-sm text-truncate">
            {reel.audio.name} • {reel.audio.artist}
          </span>
        </div>

        {/* Stats */}
        <div className="flex items-center space-x-4 text-white/60 text-xs">
          <span>{formatNumber(reel.stats.views)} views</span>
          <span>{formatNumber(reel.stats.likes)} likes</span>
          <span>{formatNumber(reel.stats.comments)} comments</span>
        </div>
      </div>

      {/* Right actions rail */}
      <div className="reel-actions">
        {/* Like */}
        <button 
          onClick={handleLike}
          className={cn(
            "btn-social group",
            reel.interactions.liked && "bg-social-like border-social-like"
          )}
        >
          <Heart 
            className={cn(
              "w-6 h-6 transition-all duration-200",
              reel.interactions.liked ? "fill-white text-white scale-110" : "group-hover:scale-110"
            )} 
          />
        </button>
        <span className="text-white text-xs font-medium">
          {formatNumber(reel.stats.likes)}
        </span>

        {/* Comment */}
        <button 
          onClick={() => onComment(reel.id)}
          className="btn-social group"
        >
          <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
        </button>
        <span className="text-white text-xs font-medium">
          {formatNumber(reel.stats.comments)}
        </span>

        {/* Share */}
        <button 
          onClick={() => onShare(reel.id)}
          className="btn-social group"
        >
          <Share className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
        </button>
        <span className="text-white text-xs font-medium">
          {formatNumber(reel.stats.shares)}
        </span>

        {/* Shop (if products available) */}
        {reel.products && reel.products.length > 0 && (
          <>
            <button 
              onClick={() => onShop(reel.id)}
              className="btn-social group bg-yellow-500/20 border-yellow-500/50"
            >
              <ShoppingBag className="w-6 h-6 text-yellow-400 group-hover:scale-110 transition-transform duration-200" />
            </button>
            <span className="text-yellow-400 text-xs font-medium">Shop</span>
          </>
        )}

        {/* Live Call (if user is live) */}
        {reel.user.isLive && (
          <>
            <button 
              onClick={() => onLiveCall(reel.id)}
              className="btn-social group bg-red-500/20 border-red-500/50 animate-glow-pulse"
            >
              <Phone className="w-6 h-6 text-red-400 group-hover:scale-110 transition-transform duration-200" />
            </button>
            <span className="text-red-400 text-xs font-medium">Join</span>
          </>
        )}

        {/* More options */}
        <button className="btn-social group">
          <MoreHorizontal className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
        </button>

        {/* Creator avatar (rotating) */}
        <div className="mt-4">
          <div className="w-12 h-12 rounded-full border-2 border-white/30 overflow-hidden animate-spin-slow">
            <img 
              src={reel.user.avatar} 
              alt={reel.user.displayName}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Ad indicator */}
      {reel.isAd && (
        <div className="absolute top-4 left-4 z-10">
          <span className="px-2 py-1 bg-black/50 text-white text-xs rounded backdrop-blur-sm">
            Sponsored
          </span>
        </div>
      )}
    </div>
  );
}
