import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, MessageCircle, Share, Music2, Phone, Video, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { initiateCall } from '@/lib/callUtils';
import WalletChip from '@/components/WalletChip';
import ProfileButton from '@/components/ProfileButton';
import TopGradient from '@/components/TopGradient';
import SignInToast from '@/components/SignInToast';
import TikTokReel from '@/components/TikTokReel';
import { useAppStore } from '@/store';
import { useUIStore } from '@/state/uiStore';
import { isGuest } from '@/lib/guards';
import { useAuth } from '@/hooks/useAuth';
import { isRealUser } from '@/auth/phoneAuth';
import AuthSheet from '@/components/auth/AuthSheet';
import AuthUpsell from '@/components/Modals/AuthUpsell';
import JoinConversationModal from '@/components/Modals/JoinConversationModal';
import FreeTrialModal from '@/components/Modals/FreeTrialModal';
import ShareSheet from '@/components/Modals/ShareSheet';
import CommentDrawer from '@/components/Modals/CommentDrawer';
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
  const [showPlayButton, setShowPlayButton] = useState(false);
  const [showFullCaption, setShowFullCaption] = useState(false);
  const navigate = useNavigate();

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
    } else {
      video.play().catch(() => {
        setShowPlayButton(true);
      });
      setIsPlaying(true);
    }
  };


  return (
    <div className="reel-card">
      {/* Top gradient for text readability */}
      <TopGradient />

      {/* WalletChip - only show on first reel */}
      {isFirst && (
        <WalletChip
          variant={isGuest() ? 'guest' : 'user'}
          labelUser="284,500 TSH"
          currentPlan={isGuest() ? 'free' : 'standard'}
          onClick={() => navigate('/create')}
          onBalanceClick={() => navigate('/wallet')}
          onPlanClick={() => navigate('/upgrade-plan')}
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
        autoPlay
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
          <div className="relative">
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

            {/* TikTok-style follow plus button */}
            {!reel.interactions.followed && (
              <button
                onClick={onFollow}
                className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center border-2 border-white transition-all hover:bg-red-600"
              >
                <Plus className="w-3 h-3 text-white" />
              </button>
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <button onClick={onProfileClick} className="font-semibold text-white">
                @{reel.user.username}
              </button>
              {reel.user.verified && (
                <div className="w-4 h-4 bg-primary rounded-full" />
              )}
              {reel.user.isLive && (
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full font-medium animate-pulse">
                    LIVE
                  </span>
                  <span className="text-white/80 text-xs font-medium">
                    1.2K watching
                  </span>
                </div>
              )}
            </div>
            <span className="text-sm text-white/80">{reel.user.displayName}</span>
          </div>
        </div>

        {/* Caption with truncation */}
        <div className="mb-3">
          <p className="text-white text-sm leading-relaxed">
            {showFullCaption ? reel.caption : (
              reel.caption.length > 100 ? (
                <>
                  {reel.caption.slice(0, 100)}...
                  <button
                    onClick={() => setShowFullCaption(true)}
                    className="text-white/60 ml-1 hover:text-white"
                  >
                    more
                  </button>
                </>
              ) : reel.caption
            )}
            {showFullCaption && reel.caption.length > 100 && (
              <button
                onClick={() => setShowFullCaption(false)}
                className="text-white/60 ml-1 hover:text-white"
              >
                {' '}less
              </button>
            )}
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

        {/* Bottom-left like/comment cluster */}
        <div className="flex items-center space-x-4 mb-2">
          <button
            onClick={onLike}
            className={cn(
              "flex items-center space-x-1 transition-all touch-target p-2 -m-2 rounded-lg",
              reel.interactions.liked && "text-red-500"
            )}
            style={{ minHeight: '44px', minWidth: '44px' }}
            aria-label={`${reel.interactions.liked ? 'Unlike' : 'Like'} this video`}
          >
            <Heart
              className={cn(
                "w-6 h-6 drop-shadow-md transition-all duration-200",
                reel.interactions.liked && "fill-red-500 text-red-500 scale-110"
              )}
            />
            <span className="text-white text-base font-medium drop-shadow-md">
              {formatNumber(reel.stats.likes)}
            </span>
          </button>

          <button
            onClick={onComment}
            className="flex items-center space-x-1 text-white transition-all hover:text-white/80 touch-target p-2 -m-2 rounded-lg"
            style={{ minHeight: '44px', minWidth: '44px' }}
            aria-label="View comments"
          >
            <MessageCircle className="w-6 h-6 drop-shadow-md" />
            <span className="text-base font-medium drop-shadow-md">
              {formatNumber(reel.stats.comments)}
            </span>
          </button>
        </div>

        {/* Stats */}
        <div className="flex items-center space-x-4 text-white/60 text-xs">
          <span>{formatNumber(reel.stats.views)} views</span>
          <span>{formatNumber(reel.stats.shares)} shares</span>
        </div>
      </div>

      {/* Right actions rail - TikTok style */}
      <div className="reel-actions space-y-4">
        {/* Share */}
        <div className="flex flex-col items-center space-y-1">
          <button
            onClick={onShare}
            className="w-12 h-12 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center transition-all hover:bg-black/50 touch-target"
            style={{ minHeight: '48px', minWidth: '48px' }}
            aria-label="Share this video"
          >
            <Share className="w-6 h-6" />
          </button>
          <span className="text-white text-sm font-medium">
            {formatNumber(reel.stats.shares)}
          </span>
        </div>

        {/* Audio Call */}
        <div className="flex flex-col items-center space-y-1">
          <button
            onClick={onAudioCall}
            className="w-12 h-12 rounded-full bg-green-500/30 backdrop-blur-sm flex items-center justify-center transition-all hover:bg-green-500/50 touch-target"
            style={{ minHeight: '48px', minWidth: '48px' }}
            aria-label="Start audio call"
          >
            <Phone className="w-6 h-6 text-green-400" />
          </button>
        </div>

        {/* Video Call */}
        <div className="flex flex-col items-center space-y-1">
          <button
            onClick={onVideoCall}
            className="w-12 h-12 rounded-full bg-blue-500/30 backdrop-blur-sm flex items-center justify-center transition-all hover:bg-blue-500/50 touch-target"
            style={{ minHeight: '48px', minWidth: '48px' }}
            aria-label="Start video call"
          >
            <Video className="w-6 h-6 text-blue-400" />
          </button>
        </div>

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
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Modal states
  const [showAuthUpsell, setShowAuthUpsell] = useState(false);
  const [authUpsellTrigger, setAuthUpsellTrigger] = useState<'like' | 'comment' | 'follow' | 'call' | 'shop' | 'create' | 'general'>('general');
  const [showJoinConversation, setShowJoinConversation] = useState(false);
  const [joinConversationTrigger, setJoinConversationTrigger] = useState<'like' | 'comment' | 'follow'>('comment');
  const [showFreeTrialModal, setShowFreeTrialModal] = useState(false);
  const [freeTrialFeature, setFreeTrialFeature] = useState<'call' | 'video_call'>('call');
  const [showShareSheet, setShowShareSheet] = useState(false);
  const [shareContent, setShareContent] = useState<any>(null);
  const [showCommentDrawer, setShowCommentDrawer] = useState(false);
  const [commentContentId, setCommentContentId] = useState('');

  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { setStoriesVisible, setBalanceBannerVisible } = useAppStore();
  const { openAuthSheet } = useUIStore();

  // Pull to refresh handler
  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate refresh delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    setCurrentIndex(0); // Reset to top
    setIsRefreshing(false);
  };

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

    let startY = 0;
    let isDragging = false;

    // Touch handlers for pull-to-refresh
    const handleTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
      isDragging = true;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging || currentIndex !== 0 || container.scrollTop > 0) return;

      const currentY = e.touches[0].clientY;
      const deltaY = currentY - startY;

      if (deltaY > 80 && !isRefreshing) {
        handleRefresh();
        isDragging = false;
      }
    };

    const handleTouchEnd = () => {
      isDragging = false;
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: true });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener('scroll', handleScroll);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleScroll, currentIndex, isRefreshing, handleRefresh]);

  const handleLike = async (reelId: string) => {
    if (!canPerformAction('like')) {
      setJoinConversationTrigger('like');
      setShowJoinConversation(true);
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
      setJoinConversationTrigger('comment');
      setShowJoinConversation(true);
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
    const reel = reels.find(r => r.user.id === userId);
    if (!reel) return;

    // Check authentication status
    if (!canPerformAction('call')) {
      setJoinConversationTrigger('comment');
      setShowJoinConversation(true);
      return;
    }

    // Check if user is on free plan and show appropriate modal
    if (user && user.plan === 'free') {
      setFreeTrialFeature('call');
      setShowFreeTrialModal(true);
      return;
    }

    try {
      // Generate a unique channel ID for this call
      const channelId = `audio-${reel.user.id}-${Date.now()}`;

      // Navigate directly to call page with private default - streamlined flow
      navigate(`/call/${channelId}?type=audio&target=${reel.user.id}&privacy=private`, {
        state: {
          targetUser: {
            id: reel.user.id,
            username: reel.user.username,
            displayName: reel.user.displayName,
            avatar: reel.user.avatar,
            isLive: reel.user.isLive
          },
          type: 'audio',
          privacy: 'private',
          autoConnect: true // Enable immediate connection
        }
      });
    } catch (error) {
      console.error('Failed to start audio call:', error);
    }
  };

  const handleVideoCall = async (userId: string) => {
    const reel = reels.find(r => r.user.id === userId);
    if (!reel) return;

    // Check authentication status
    if (!canPerformAction('call')) {
      setJoinConversationTrigger('comment');
      setShowJoinConversation(true);
      return;
    }

    // Check if user is on free plan and show appropriate modal
    if (user && user.plan === 'free') {
      setFreeTrialFeature('video_call');
      setShowFreeTrialModal(true);
      return;
    }

    try {
      // Generate a unique channel ID for this call
      const channelId = `video-${reel.user.id}-${Date.now()}`;

      // Navigate directly to call page with private default - streamlined flow
      navigate(`/call/${channelId}?type=video&target=${reel.user.id}&privacy=private`, {
        state: {
          targetUser: {
            id: reel.user.id,
            username: reel.user.username,
            displayName: reel.user.displayName,
            avatar: reel.user.avatar,
            isLive: reel.user.isLive
          },
          type: 'video',
          privacy: 'private',
          autoConnect: true // Enable immediate connection
        }
      });
    } catch (error) {
      console.error('Failed to start video call:', error);
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
    } catch (error: any) {
      console.error('Failed to join call:', error);
      if (error?.message?.includes('limit')) {
        setAuthUpsellTrigger('call');
        setShowAuthUpsell(true);
      }
    }
  };

  const handleFollow = async (userId: string) => {
    if (!canPerformAction('like')) { // Using like check as proxy for follow
      setJoinConversationTrigger('follow');
      setShowJoinConversation(true);
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
      {/* Top gradient for better text readability */}
      <TopGradient />

      {/* Profile button with sign-in badge - positioned top-right */}
      <div className="fixed top-4 right-4 z-50">
        <ProfileButton onClick={() => {
          if (!isRealUser()) {
            openAuthSheet(undefined, 'sign_in');
          } else {
            navigate('/profile');
          }
        }} />
      </div>

      {/* Pull to refresh indicator */}
      {isRefreshing && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-black/80 backdrop-blur-md rounded-full px-4 py-2">
          <div className="flex items-center space-x-2 text-white text-sm">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Refreshing...</span>
          </div>
        </div>
      )}

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
            <TikTokReel
              reel={reel}
              isActive={index === currentIndex && !isScrolling}
              onProfile={() => handleProfileClick(reel.user.id)}
              onLike={() => handleLike(reel.id)}
              onComment={() => handleComment(reel.id)}
              onShare={() => handleShare(reel.id)}
              onFollow={() => handleFollow(reel.user.id)}
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

      {/* Auth Sheet */}
      <AuthSheet />

      {/* Sign In Toast Notification */}
      <SignInToast />

      {/* Join Conversation Modal */}
      <JoinConversationModal
        isOpen={showJoinConversation}
        onClose={() => setShowJoinConversation(false)}
        trigger={joinConversationTrigger}
      />

      {/* Free Trial Modal */}
      <FreeTrialModal
        isOpen={showFreeTrialModal}
        onClose={() => setShowFreeTrialModal(false)}
        feature={freeTrialFeature}
      />

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
          setJoinConversationTrigger('comment');
          setShowJoinConversation(true);
        }}
      />


    </div>
  );
}
