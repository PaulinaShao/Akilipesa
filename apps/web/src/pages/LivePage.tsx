import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Heart, 
  MessageCircle, 
  Share, 
  MoreHorizontal,
  Users, 
  Star,
  Gift,
  Phone,
  Video,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Settings,
  UserPlus,
  Crown,
  Sparkles,
  DollarSign,
  Eye
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface LiveComment {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  message: string;
  timestamp: number;
  type: 'comment' | 'tip' | 'join' | 'gift';
  amount?: number;
}

interface LiveStreamer {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  verified: boolean;
  followerCount: number;
  isFollowing: boolean;
}

interface LiveStats {
  viewerCount: number;
  totalEarnings: number;
  totalLikes: number;
  duration: number;
}

// Mock live data
const mockStreamer: LiveStreamer = {
  id: '1',
  username: 'amina_tz',
  displayName: 'Amina Hassan',
  avatar: 'https://images.unsplash.com/photo-1494790108755-2616b9d38aad?w=150&h=150&fit=crop&crop=face',
  verified: true,
  followerCount: 45200,
  isFollowing: false
};

const mockComments: LiveComment[] = [
  {
    id: '1',
    userId: '2',
    username: 'james_tech',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    message: 'Amazing dance moves! 🔥',
    timestamp: Date.now() - 30000,
    type: 'comment'
  },
  {
    id: '2',
    userId: '3',
    username: 'sarah_ke',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    message: 'Tipped 5,000 TSH',
    timestamp: Date.now() - 15000,
    type: 'tip',
    amount: 5000
  }
];

export default function LivePage() {
  const { channelId } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const commentsRef = useRef<HTMLDivElement>(null);

  const [streamer] = useState<LiveStreamer>(mockStreamer);
  const [comments, setComments] = useState<LiveComment[]>(mockComments);
  const [newComment, setNewComment] = useState('');
  const [isFollowing, setIsFollowing] = useState(false);
  const [showTipModal, setShowTipModal] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(false);

  const [stats, setStats] = useState<LiveStats>({
    viewerCount: 247,
    totalEarnings: 15420,
    totalLikes: 1856,
    duration: 1800 // 30 minutes
  });

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Random viewer count fluctuation
      setStats(prev => ({
        ...prev,
        viewerCount: Math.max(200, prev.viewerCount + Math.floor(Math.random() * 10 - 5)),
        duration: prev.duration + 1
      }));

      // Add random comments occasionally
      if (Math.random() < 0.3) {
        const randomComments = [
          'Great content! 👏',
          'Love from Dar es Salaam! 🇹🇿',
          'Keep it up!',
          'Amazing! ✨',
          'Wow! 😍',
          'Inspiring! 💪'
        ];
        
        const newComment: LiveComment = {
          id: `comment_${Date.now()}`,
          userId: `user_${Math.floor(Math.random() * 1000)}`,
          username: `viewer_${Math.floor(Math.random() * 100)}`,
          avatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 100000000)}?w=50&h=50&fit=crop&crop=face`,
          message: randomComments[Math.floor(Math.random() * randomComments.length)],
          timestamp: Date.now(),
          type: 'comment'
        };
        
        setComments(prev => [...prev.slice(-20), newComment]);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Auto-scroll comments
  useEffect(() => {
    if (commentsRef.current) {
      commentsRef.current.scrollTop = commentsRef.current.scrollHeight;
    }
  }, [comments]);

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const handleSendComment = () => {
    if (!newComment.trim()) return;

    const comment: LiveComment = {
      id: `comment_${Date.now()}`,
      userId: 'current_user',
      username: 'you',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face',
      message: newComment,
      timestamp: Date.now(),
      type: 'comment'
    };

    setComments(prev => [...prev, comment]);
    setNewComment('');
  };

  const handleLike = () => {
    setStats(prev => ({ ...prev, totalLikes: prev.totalLikes + 1 }));
    
    // Show heart animation
    const heart = document.createElement('div');
    heart.innerHTML = '❤️';
    heart.style.position = 'absolute';
    heart.style.left = Math.random() * window.innerWidth + 'px';
    heart.style.top = window.innerHeight * 0.7 + 'px';
    heart.style.fontSize = '24px';
    heart.style.pointerEvents = 'none';
    heart.style.zIndex = '1000';
    heart.style.animation = 'float-up 2s ease-out forwards';
    
    document.body.appendChild(heart);
    setTimeout(() => document.body.removeChild(heart), 2000);
  };

  const handleTip = (amount: number) => {
    const tipComment: LiveComment = {
      id: `tip_${Date.now()}`,
      userId: 'current_user',
      username: 'you',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face',
      message: `Tipped ${amount.toLocaleString()} TSH`,
      timestamp: Date.now(),
      type: 'tip',
      amount
    };

    setComments(prev => [...prev, tipComment]);
    setStats(prev => ({ ...prev, totalEarnings: prev.totalEarnings + amount }));
    setShowTipModal(false);
  };

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleJoinCall = () => {
    navigate(`/call/join-live-${channelId}`);
  };

  return (
    <div className="h-screen-safe bg-black relative overflow-hidden">
      {/* Video Stream */}
      <div className="absolute inset-0">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          autoPlay
          muted={isMuted}
          playsInline
          poster="https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=400&h=700&fit=crop"
        >
          <source src="https://sample-videos.com/zip/10/mp4/SampleVideo_360x240_1mb.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 safe-top">
        <div className="flex items-center justify-between p-4 bg-gradient-to-b from-black/70 to-transparent">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate('/reels')}
              className="p-2 bg-black/50 rounded-full backdrop-blur-sm"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            
            <div className="flex items-center space-x-2">
              <img
                src={streamer.avatar}
                alt={streamer.displayName}
                className="w-10 h-10 rounded-full border-2 border-red-500"
              />
              <div>
                <div className="flex items-center space-x-1">
                  <span className="text-white font-semibold text-sm">@{streamer.username}</span>
                  {streamer.verified && <Crown className="w-4 h-4 text-yellow-400" />}
                  <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full font-medium animate-pulse">
                    LIVE
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-white/80">
                  <Eye className="w-3 h-3" />
                  <span>{formatNumber(stats.viewerCount)} viewers</span>
                  <span>•</span>
                  <span>{formatDuration(stats.duration)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="bg-black/50 backdrop-blur-sm rounded-full px-3 py-1">
              <div className="flex items-center space-x-1 text-yellow-400">
                <DollarSign className="w-4 h-4" />
                <span className="text-sm font-medium">{formatNumber(stats.totalEarnings)}</span>
              </div>
            </div>
            
            <button
              onClick={() => setShowMoreOptions(true)}
              className="p-2 bg-black/50 rounded-full backdrop-blur-sm"
            >
              <MoreHorizontal className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Live Comments Overlay */}
      <div className="absolute left-0 bottom-20 right-20 z-10 pointer-events-none">
        <div 
          ref={commentsRef}
          className="max-h-96 overflow-y-auto space-y-2 px-4"
        >
          <AnimatePresence>
            {comments.slice(-10).map((comment) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className={cn(
                  "flex items-start space-x-2 p-2 rounded-lg max-w-xs",
                  comment.type === 'tip' 
                    ? "bg-gradient-to-r from-yellow-500/90 to-orange-500/90" 
                    : "bg-black/70"
                )}
              >
                <img
                  src={comment.avatar}
                  alt={comment.username}
                  className="w-6 h-6 rounded-full flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-1">
                    <span className="text-xs font-semibold text-white">{comment.username}</span>
                    {comment.type === 'tip' && <Star className="w-3 h-3 text-yellow-300" />}
                  </div>
                  <p className="text-xs text-white/90 break-words">{comment.message}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Right Action Bar */}
      <div className="absolute right-0 bottom-20 top-20 z-10 flex flex-col justify-center space-y-4 p-4">
        <div className="flex flex-col items-center space-y-6">
          {/* Like */}
          <button
            onClick={handleLike}
            className="flex flex-col items-center space-y-1 group"
          >
            <div className="w-12 h-12 bg-black/50 rounded-full flex items-center justify-center backdrop-blur-sm group-active:scale-125 transition-transform">
              <Heart className="w-6 h-6 text-white group-active:fill-red-500 group-active:text-red-500" />
            </div>
            <span className="text-white text-xs font-medium">{formatNumber(stats.totalLikes)}</span>
          </button>

          {/* Comment */}
          <button className="flex flex-col items-center space-y-1">
            <div className="w-12 h-12 bg-black/50 rounded-full flex items-center justify-center backdrop-blur-sm">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <span className="text-white text-xs font-medium">{comments.length}</span>
          </button>

          {/* Share */}
          <button className="flex flex-col items-center space-y-1">
            <div className="w-12 h-12 bg-black/50 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Share className="w-6 h-6 text-white" />
            </div>
          </button>

          {/* Tip */}
          <button
            onClick={() => setShowTipModal(true)}
            className="flex flex-col items-center space-y-1"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
              <Gift className="w-6 h-6 text-white" />
            </div>
            <span className="text-yellow-400 text-xs font-medium">Tip</span>
          </button>

          {/* Join Call */}
          <button
            onClick={handleJoinCall}
            className="flex flex-col items-center space-y-1"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center animate-pulse">
              <Video className="w-6 h-6 text-white" />
            </div>
            <span className="text-green-400 text-xs font-medium">Join</span>
          </button>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="absolute bottom-0 left-0 right-0 z-20 safe-bottom">
        <div className="p-4 bg-gradient-to-t from-black/80 to-transparent">
          <div className="flex items-center space-x-3">
            <div className="flex-1 flex items-center space-x-2 bg-black/50 rounded-full px-4 py-2 backdrop-blur-sm">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendComment()}
                placeholder="Say something..."
                className="flex-1 bg-transparent text-white placeholder-white/60 text-sm focus:outline-none"
              />
              <button
                onClick={handleSendComment}
                disabled={!newComment.trim()}
                className="text-primary disabled:opacity-50"
              >
                <MessageCircle className="w-5 h-5" />
              </button>
            </div>

            {!isFollowing && (
              <button
                onClick={handleFollow}
                className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-full text-sm font-medium transition-colors"
              >
                Follow
              </button>
            )}

            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 bg-black/50 rounded-full backdrop-blur-sm"
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5 text-white" />
              ) : (
                <Volume2 className="w-5 h-5 text-white" />
              )}
            </button>

            <button
              onClick={toggleFullscreen}
              className="p-2 bg-black/50 rounded-full backdrop-blur-sm"
            >
              {isFullscreen ? (
                <Minimize className="w-5 h-5 text-white" />
              ) : (
                <Maximize className="w-5 h-5 text-white" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Tip Modal */}
      <AnimatePresence>
        {showTipModal && (
          <div className="fixed inset-0 z-50 flex items-end">
            <div 
              className="absolute inset-0 bg-black/60"
              onClick={() => setShowTipModal(false)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="relative w-full bg-white rounded-t-3xl p-6"
            >
              <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-6" />
              
              <h3 className="text-xl font-bold text-center mb-2">Send a Tip</h3>
              <p className="text-gray-600 text-center mb-6">
                Support @{streamer.username} with a tip
              </p>

              <div className="grid grid-cols-3 gap-3 mb-6">
                {[1000, 5000, 10000, 25000, 50000, 100000].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => handleTip(amount)}
                    className="p-4 border-2 border-gray-200 hover:border-primary rounded-xl text-center transition-colors"
                  >
                    <div className="text-lg font-bold">{amount.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">TSH</div>
                  </button>
                ))}
              </div>

              <button
                onClick={() => setShowTipModal(false)}
                className="w-full py-3 bg-gray-100 rounded-xl text-gray-600 font-medium"
              >
                Cancel
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CSS for floating hearts animation */}
      <style jsx global>{`
        @keyframes float-up {
          0% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateY(-200px) scale(1.5);
          }
        }
      `}</style>
    </div>
  );
}
