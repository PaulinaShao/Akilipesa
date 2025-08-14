import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, MessageCircle, Share, MoreHorizontal, Music2, ShoppingBag, Phone, Video, UserPlus } from 'lucide-react';
import { cn } from '@/lib/utils';
import WalletChip from '@/components/WalletChip';
import StoriesRow from '@/components/StoriesRow';
import { useAppStore } from '@/store';
import { isGuest } from '@/lib/guards';
import AuthUpsell from '@/components/Modals/AuthUpsell';
import ShareSheet from '@/components/Modals/ShareSheet';
import CommentDrawer from '@/components/Modals/CommentDrawer';
import CallOptions from '@/components/Modals/CallOptions';
import { toggleLike, toggleFollow, getContentForSharing, startCallFlow, canPerformAction } from '@/lib/api';

interface ReelData {
  id: string;
  videoUrl: string;
  thumbnailUrl: string;
  user: {
    id: string;
    username: string;
    displayName: string;
    avatar: string;
    verified: boolean;
    isLive?: boolean;
  };
  caption: string;
  hashtags: string[];
  music: {
    name: string;
    artist: string;
  };
  stats: {
    likes: number;
    comments: number;
    shares: number;
    views: number;
  };
  interactions: {
    liked: boolean;
    saved: boolean;
    followed: boolean;
  };
  products?: Array<{
    id: string;
    name: string;
    price: string;
  }>;
}

const mockReels: ReelData[] = [
  {
    id: '1',
    videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_360x240_1mb.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=400&h=700&fit=crop',
    user: {
      id: '1',
      username: 'amina_tz',
      displayName: 'Amina Hassan',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b9d38aad?w=150&h=150&fit=crop&crop=face',
      verified: true,
      isLive: true,
    },
    caption: 'Showcasing the beauty of Tanzanian culture! 🇹🇿✨ What do you think about this traditional dance?',
    hashtags: ['#Tanzania', '#Culture', '#Dance', '#Traditional', '#Beauty'],
    music: {
      name: 'Bongo Flava Beat',
      artist: 'Diamond Platnumz',
    },
    stats: {
      likes: 45231,
      comments: 2847,
      shares: 1205,
      views: 234567,
    },
    interactions: {
      liked: false,
      saved: false,
      followed: false,
    },
    products: [
      { id: '1', name: 'Traditional Kitenge', price: '85,000 TSH' }
    ],
  },
  {
    id: '2',
    videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_360x240_2mb.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=700&fit=crop',
    user: {
      id: '2',
      username: 'tech_james',
      displayName: 'James Mwangi',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      verified: false,
    },
    caption: 'Tech innovation meets African creativity! 🚀 Building the future from Tanzania 💙',
    hashtags: ['#TechTZ', '#Innovation', '#Startup', '#Africa', '#Technology'],
    music: {
      name: 'Afrobeat Vibes',
      artist: 'Burna Boy',
    },
    stats: {
      likes: 28934,
      comments: 1456,
      shares: 892,
      views: 145890,
    },
    interactions: {
      liked: true,
      saved: false,
      followed: true,
    },
  },
  {
    id: '3',
    videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_360x240_5mb.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=700&fit=crop',
    user: {
      id: '3',
      username: 'fatuma_style',
      displayName: 'Fatuma Bakari',
      avatar: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&crop=face',
      verified: true,
    },
    caption: 'Fashion meets tradition 💃 New Kitenge collection inspired by Tanzanite gems! Available now 👗✨',
    hashtags: ['#Fashion', '#Kitenge', '#Tanzania', '#Style', '#Handmade'],
    music: {
      name: 'Fashion Week',
      artist: 'Original Audio',
    },
    stats: {
      likes: 19876,
      comments: 987,
      shares: 543,
      views: 98765,
    },
    interactions: {
      liked: false,
      saved: true,
      followed: false,
    },
    products: [
      { id: '2', name: 'Kitenge Dress', price: '120,000 TSH' },
      { id: '3', name: 'Tanzanite Earrings', price: '250,000 TSH' }
    ],
  },
];

function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

interface ReelCardProps {
  reel: ReelData;
  isActive: boolean;
  isFirst?: boolean;
  onLike: () => void;
  onComment: () => void;
  onShare: () => void;
  onShop: () => void;
  onAudioCall: () => void;
  onVideoCall: () => void;
  onLiveCall: () => void;
  onJoin: () => void;
  onFollow: () => void;
  onProfileClick: () => void;
}

function ReelCard({
  reel,
  isActive,
  isFirst = false,
  onLike,
  onComment,
  onShare,
  onShop,
  onAudioCall,
  onVideoCall,
  onLiveCall,
  onJoin,
  onFollow,
  onProfileClick
}: ReelCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isActive) {
      video.play().catch(() => {
        console.log('Autoplay failed');
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
    } else {
      video.play();
      setIsPlaying(true);
    }
  };

  const handleWalletClick = () => {
    if (isGuest()) {
      navigate('/wallet?upsell=1');
    } else {
      navigate('/wallet');
    }
  };

  return (
    <div className="reel-card">
      {/* WalletChip - only show on first reel */}
      {isFirst && (
        <WalletChip
          variant={isGuest() ? 'guest' : 'user'}
          labelUser="284,500 TSH"
          onClick={handleWalletClick}
        />
      )}
      {/* Video */}
      <video
        ref={videoRef}
        className="reel-video"
        poster={reel.thumbnailUrl}
        loop
        muted
        playsInline
        onClick={handleVideoClick}
      >
        <source src={reel.videoUrl} type="video/mp4" />
      </video>

      {/* Gradient overlay */}
      <div className="reel-overlay" />

      {/* Content */}
      <div className="reel-content">
        {/* User info */}
        <div className="flex items-center space-x-3 mb-3">
          <button onClick={onProfileClick} className="relative">
            <img 
              src={reel.user.avatar} 
              alt={reel.user.displayName}
              className="w-12 h-12 rounded-full border-2 border-white/30"
            />
            {reel.user.isLive && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex-center">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              </div>
            )}
          </button>
          
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <button onClick={onProfileClick} className="font-semibold text-white">
                @{reel.user.username}
              </button>
              {reel.user.verified && (
                <div className="w-4 h-4 bg-primary rounded-full" />
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
              onClick={onFollow}
              className="btn-outline text-xs px-3 py-1 font-semibold"
            >
              Follow
            </button>
          )}
        </div>

        {/* Caption */}
        <div className="mb-3">
          <p className="text-white text-sm leading-relaxed">
            {reel.caption}
          </p>
          <div className="flex flex-wrap gap-1 mt-2">
            {reel.hashtags.map((tag, index) => (
              <span key={index} className="text-primary text-sm">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Music info */}
        <button className="flex items-center space-x-2 mb-2 group">
          <Music2 className="w-4 h-4 text-white" />
          <div className="flex-1 overflow-hidden">
            <div className="text-white text-sm whitespace-nowrap animate-marquee">
              {reel.music.name} • {reel.music.artist}
            </div>
          </div>
        </button>

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
          onClick={onLike}
          className={cn(
            "reel-action-btn",
            reel.interactions.liked && "liked"
          )}
        >
          <Heart 
            className={cn(
              "w-6 h-6 transition-all duration-200",
              reel.interactions.liked && "fill-white scale-110"
            )} 
          />
        </button>
        <span className="text-white text-xs font-medium">
          {formatNumber(reel.stats.likes)}
        </span>

        {/* Comment */}
        <button onClick={onComment} className="reel-action-btn">
          <MessageCircle className="w-6 h-6" />
        </button>
        <span className="text-white text-xs font-medium">
          {formatNumber(reel.stats.comments)}
        </span>

        {/* Share */}
        <button onClick={onShare} className="reel-action-btn">
          <Share className="w-6 h-6" />
        </button>
        <span className="text-white text-xs font-medium">
          {formatNumber(reel.stats.shares)}
        </span>

        {/* Audio Call */}
        <button
          onClick={onAudioCall}
          className="reel-action-btn bg-green-500/20 border-green-500/50"
        >
          <Phone className="w-6 h-6 text-green-400" />
        </button>
        <span className="text-green-400 text-xs font-medium">Call</span>

        {/* Video Call */}
        <button
          onClick={onVideoCall}
          className="reel-action-btn bg-blue-500/20 border-blue-500/50"
        >
          <Video className="w-6 h-6 text-blue-400" />
        </button>
        <span className="text-blue-400 text-xs font-medium">Video</span>

        {/* Shop */}
        {reel.products && reel.products.length > 0 && (
          <>
            <button
              onClick={onShop}
              className="reel-action-btn bg-yellow-500/20 border-yellow-500/50"
            >
              <ShoppingBag className="w-6 h-6 text-yellow-400" />
            </button>
            <span className="text-yellow-400 text-xs font-medium">Shop</span>
          </>
        )}

        {/* Live Call - only show for live users */}
        {reel.user.isLive && (
          <>
            <button
              onClick={onLiveCall}
              className="reel-action-btn bg-red-500/20 border-red-500/50 animate-pulse"
            >
              <Phone className="w-6 h-6 text-red-400" />
            </button>
            <span className="text-red-400 text-xs font-medium">Live</span>
          </>
        )}

        {/* Join Button */}
        <button
          onClick={onJoin}
          className="reel-action-btn bg-purple-500/20 border-purple-500/50"
        >
          <UserPlus className="w-6 h-6 text-purple-400" />
        </button>
        <span className="text-purple-400 text-xs font-medium">Join</span>

        {/* More */}
        <button className="reel-action-btn">
          <MoreHorizontal className="w-6 h-6" />
        </button>

        {/* Creator avatar (spinning) */}
        <div className="mt-4">
          <button onClick={onProfileClick}>
            <div className="w-12 h-12 rounded-full border-2 border-white/30 overflow-hidden animate-spin-slow">
              <img 
                src={reel.user.avatar} 
                alt={reel.user.displayName}
                className="w-full h-full object-cover"
              />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ReelsPage() {
  const [reels, setReels] = useState<ReelData[]>(mockReels);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);

  // Modal states
  const [showAuthUpsell, setShowAuthUpsell] = useState(false);
  const [authUpsellTrigger, setAuthUpsellTrigger] = useState<'like' | 'comment' | 'follow' | 'call' | 'shop' | 'create' | 'general'>('general');
  const [showShareSheet, setShowShareSheet] = useState(false);
  const [shareContent, setShareContent] = useState<any>(null);
  const [showCommentDrawer, setShowCommentDrawer] = useState(false);
  const [commentContentId, setCommentContentId] = useState('');
  const [showCallOptions, setShowCallOptions] = useState(false);
  const [callTargetUser, setCallTargetUser] = useState<any>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { setStoriesVisible, setBalanceBannerVisible } = useAppStore();

  // Auth gate hooks removed - using requireAuthOrGate pattern

  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const scrollTop = container.scrollTop;
    const itemHeight = container.clientHeight;
    const newIndex = Math.round(scrollTop / itemHeight);

    // Update current reel index
    if (newIndex !== currentIndex && newIndex >= 0 && newIndex < reels.length) {
      setCurrentIndex(newIndex);

      // Show auth upsell after viewing multiple reels (TikTok-style)
      if (isGuest() && newIndex >= 3 && !showAuthUpsell) {
        setTimeout(() => {
          setAuthUpsellTrigger('general');
          setShowAuthUpsell(true);
        }, 1000); // Delay for smooth UX
      }
    }

    // Hide stories after scrolling down 120px, show when back at top
    setStoriesVisible(scrollTop < 120);

    // Hide balance banner after scrolling (only shown on first reel)
    setBalanceBannerVisible(scrollTop < 50 && newIndex === 0);

    setIsScrolling(true);
    const timer = setTimeout(() => setIsScrolling(false), 150);
    return () => clearTimeout(timer);
  }, [currentIndex, reels.length, setStoriesVisible, setBalanceBannerVisible]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const handleLike = async (reelId: string) => {
    if (!canPerformAction('like')) {
      setAuthUpsellTrigger('like');
      setShowAuthUpsell(true);
      return;
    }

    // Optimistic UI update
    setReels(prev => prev.map(reel => {
      if (reel.id === reelId) {
        const newLiked = !reel.interactions.liked;
        return {
          ...reel,
          interactions: { ...reel.interactions, liked: newLiked },
          stats: {
            ...reel.stats,
            likes: newLiked ? reel.stats.likes + 1 : reel.stats.likes - 1
          }
        };
      }
      return reel;
    }));

    try {
      await toggleLike(reelId);
    } catch (error) {
      // Rollback optimistic update
      setReels(prev => prev.map(reel => {
        if (reel.id === reelId) {
          const newLiked = !reel.interactions.liked;
          return {
            ...reel,
            interactions: { ...reel.interactions, liked: newLiked },
            stats: {
              ...reel.stats,
              likes: newLiked ? reel.stats.likes + 1 : reel.stats.likes - 1
            }
          };
        }
        return reel;
      }));
      console.error('Failed to like reel:', error);
    }
  };

  const handleComment = async (reelId: string) => {
    if (!canPerformAction('comment')) {
      setAuthUpsellTrigger('comment');
      setShowAuthUpsell(true);
      return;
    }

    setCommentContentId(reelId);
    setShowCommentDrawer(true);
  };

  const handleShare = async (reelId: string) => {
    try {
      const content = await getContentForSharing(reelId);
      setShareContent(content);
      setShowShareSheet(true);
    } catch (error) {
      console.error('Failed to get content for sharing:', error);
      // Fallback to browser share
      if (navigator.share) {
        navigator.share({
          title: 'Check out this reel on AkiliPesa',
          url: `${window.location.origin}/reel/${reelId}`,
        });
      }
    }
  };

  const handleShop = (reelId: string) => {
    const reel = reels.find(r => r.id === reelId);
    if (reel?.products?.[0]) {
      navigate(`/product/${reel.products[0].id}`);
    }
  };

  const handleAudioCall = async (userId: string) => {
    if (!canPerformAction('call')) {
      setAuthUpsellTrigger('call');
      setShowAuthUpsell(true);
      return;
    }

    try {
      const { channel } = await startCallFlow(userId, 'audio');
      navigate(`/call/${channel}?mode=audio&target=${userId}`);
    } catch (error) {
      console.error('Failed to start audio call:', error);
      // Show error or upsell based on error type
      if (error.message.includes('limit')) {
        setAuthUpsellTrigger('call');
        setShowAuthUpsell(true);
      }
    }
  };

  const handleVideoCall = async (userId: string) => {
    if (!canPerformAction('call')) {
      setAuthUpsellTrigger('call');
      setShowAuthUpsell(true);
      return;
    }

    try {
      const { channel } = await startCallFlow(userId, 'video');
      navigate(`/call/${channel}?mode=video&target=${userId}`);
    } catch (error) {
      console.error('Failed to start video call:', error);
      // Show error or upsell based on error type
      if (error.message.includes('limit')) {
        setAuthUpsellTrigger('call');
        setShowAuthUpsell(true);
      }
    }
  };

  const handleLiveCall = (reelId: string) => {
    const reel = reels.find(r => r.id === reelId);
    if (reel?.user.isLive) {
      navigate(`/live/${reel.user.id}`);
    }
  };

  const handleJoin = async (reelId: string) => {
    const reel = reels.find(r => r.id === reelId);
    if (!reel) return;

    if (!canPerformAction('call')) {
      setAuthUpsellTrigger('call');
      setShowAuthUpsell(true);
      return;
    }

    try {
      const { channel } = await startCallFlow(reel.user.id, 'video');
      navigate(`/call/${channel}?type=video&target=${reel.user.id}`);
    } catch (error) {
      console.error('Failed to join call:', error);
      if (error.message.includes('limit')) {
        setAuthUpsellTrigger('call');
        setShowAuthUpsell(true);
      }
    }
  };

  const handleFollow = async (userId: string) => {
    if (!canPerformAction('like')) { // Using like check as proxy for follow
      setAuthUpsellTrigger('follow');
      setShowAuthUpsell(true);
      return;
    }

    // Optimistic UI update
    setReels(prev => prev.map(reel => {
      if (reel.user.id === userId) {
        return {
          ...reel,
          interactions: {
            ...reel.interactions,
            followed: !reel.interactions.followed
          }
        };
      }
      return reel;
    }));

    try {
      await toggleFollow(userId);
    } catch (error) {
      // Rollback optimistic update
      setReels(prev => prev.map(reel => {
        if (reel.user.id === userId) {
          return {
            ...reel,
            interactions: {
              ...reel.interactions,
              followed: !reel.interactions.followed
            }
          };
        }
        return reel;
      }));
      console.error('Failed to toggle follow:', error);
    }
  };

  const handleProfileClick = (userId: string) => {
    navigate(`/profile/${userId}`);
  };

  return (
    <div className="reel-container">
      {/* Stories Row */}
      <StoriesRow />

      <div
        ref={containerRef}
        className="h-full overflow-y-auto snap-y snap-mandatory hide-scrollbar"
      >
        {reels.map((reel, index) => (
          <div
            key={reel.id}
            className="h-screen-safe snap-start"
            {...(index === 1 ? { 'data-second-reel': 'true' } : {})}
          >
            <ReelCard
              reel={reel}
              isActive={index === currentIndex && !isScrolling}
              isFirst={index === 0}
              onLike={() => handleLike(reel.id)}
              onComment={() => handleComment(reel.id)}
              onShare={() => handleShare(reel.id)}
              onShop={() => handleShop(reel.id)}
              onAudioCall={() => handleAudioCall(reel.user.id)}
              onVideoCall={() => handleVideoCall(reel.user.id)}
              onLiveCall={() => handleLiveCall(reel.id)}
              onJoin={() => handleJoin(reel.id)}
              onFollow={() => handleFollow(reel.user.id)}
              onProfileClick={() => handleProfileClick(reel.user.id)}
            />
          </div>
        ))}
      </div>

      {/* Progress indicator */}
      <div className="absolute top-4 right-4 z-10">
        <div className="flex flex-col space-y-1">
          {reels.map((_, index) => (
            <div
              key={index}
              className={cn(
                "w-1 h-8 rounded-full transition-all duration-300",
                index === currentIndex ? 'bg-primary' : 'bg-white/20'
              )}
            />
          ))}
        </div>
      </div>

      {/* Auth Upsell Modal */}
      <AuthUpsell
        isOpen={showAuthUpsell}
        onClose={() => setShowAuthUpsell(false)}
        trigger={authUpsellTrigger}
      />

      {/* Share Sheet */}
      {shareContent && (
        <ShareSheet
          isOpen={showShareSheet}
          onClose={() => setShowShareSheet(false)}
          content={shareContent}
        />
      )}

      {/* Comment Drawer */}
      <CommentDrawer
        isOpen={showCommentDrawer}
        onClose={() => setShowCommentDrawer(false)}
        contentId={commentContentId}
        contentCreator={reels.find(r => r.id === commentContentId)?.user.displayName || ''}
        onAuthRequired={() => {
          setShowCommentDrawer(false);
          setAuthUpsellTrigger('comment');
          setShowAuthUpsell(true);
        }}
      />
    </div>
  );
}
