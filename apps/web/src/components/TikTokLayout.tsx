import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Heart, MessageCircle, Share, Phone, Video, Home, Search, Plus, MessageSquare, User } from 'lucide-react';
import { useAppStore } from '@/store';

// Perfect TikTok Layout Component - Exact Structure
export default function TikTokLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="tiktok-app">
      <TikTokHeader />
      <div className="tiktok-feed">
        {children}
      </div>
      <TikTokBottomNav />
    </div>
  );
}

// TikTok Header with Navigation Tabs
function TikTokHeader() {
  const { user } = useAppStore();
  const userPlan = user?.plan || 'free';
  const userBalance = user?.balance || 0;
  
  const planDisplay = userPlan === 'free' ? 'FREE' :
                     userPlan === 'starter' ? 'STARTER' :
                     userPlan === 'pro' ? 'PRO' : 'FREE';

  const formatBalance = (amount: number) => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M TZS`;
    } else if (amount >= 1000) {
      return `${(amount / 1000).toFixed(1)}K TZS`;
    }
    return `${amount.toLocaleString()} TZS`;
  };

  return (
    <header className="tiktok-header">
      {/* Top Row - Logo & Actions */}
      <div className="tiktok-header-top">
        <div className="tiktok-logo">AkiliPesa</div>
        <div className="tiktok-header-right">
          <div className="tiktok-free-badge">{planDisplay}</div>
          <div className="tiktok-balance">{formatBalance(userBalance)}</div>
          {!user && (
            <a href="/auth" className="tiktok-balance">Sign In</a>
          )}
        </div>
      </div>
      
      {/* Navigation Tabs */}
      <nav className="tiktok-nav-tabs">
        <a href="#" className="tiktok-nav-tab">Following</a>
        <a href="#" className="tiktok-nav-tab">Friends</a>
        <a href="#" className="tiktok-nav-tab active">For You</a>
      </nav>
    </header>
  );
}

// Perfect TikTok Video Item
export function TikTokVideo({
  media,
  user,
  live,
  caption,
  counts,
  liked,
  onLike,
  onComment,
  onShare,
  onAudioCall,
  onVideoCall,
  onProfile
}: {
  media: { type: "video"|"image"; src: string; poster?: string };
  user: string;
  live?: boolean;
  caption: string;
  counts: { likes: number; comments: number; shares: number };
  liked?: boolean;
  onLike?: () => void;
  onComment?: () => void;
  onShare?: () => void;
  onAudioCall?: () => void;
  onVideoCall?: () => void;
  onProfile?: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Auto-play when in view
  useEffect(() => {
    if (media.type !== "video" || !videoRef.current) return;
    
    const video = videoRef.current;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    }, { threshold: 0.7 });

    observer.observe(video);
    return () => observer.disconnect();
  }, [media.type]);

  // Clean caption (first 3 words, no hashtags)
  const cleanCaption = (str: string) => {
    if (!str) return "";
    return str.replace(/#[^\s#]+/g, "").trim().split(/\s+/).filter(Boolean).slice(0, 3).join(" ");
  };

  const formatCount = (n: number) => {
    if (n >= 1_000_000) return (n/1_000_000).toFixed(1).replace(/\.0$/,'')+'M';
    if (n >= 1_000) return (n/1_000).toFixed(1).replace(/\.0$/,'')+'K';
    return String(n);
  };

  return (
    <div className="tiktok-video">
      {/* Media */}
      {media.type === "video" ? (
        <video
          ref={videoRef}
          className="tiktok-video-media"
          src={media.src}
          poster={media.poster}
          muted
          playsInline
          loop
        />
      ) : (
        <img className="tiktok-video-media" src={media.src} alt="" />
      )}

      {/* UI Overlay */}
      <div className="tiktok-ui-overlay">
        {/* Left Content - User & Caption */}
        <div className="tiktok-content-left">
          <div className="tiktok-user-row">
            <button className="tiktok-avatar" onClick={onProfile}>
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(45deg, #6da8ff, #7d6bff)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '16px'
                }}
              >
                @
              </div>
            </button>
            <div className="tiktok-user-info">
              <div className="tiktok-username">
                @{user}
                {live && <span className="tiktok-live-badge">LIVE</span>}
              </div>
            </div>
          </div>
          <div className="tiktok-caption">
            {cleanCaption(caption)}
          </div>
        </div>

        {/* Right Rail - Actions */}
        <div className="tiktok-right-rail">
          <div className="tiktok-action">
            <button
              className={`tiktok-action-btn ${liked ? 'liked' : ''}`}
              onClick={onLike}
            >
              <Heart size={24} fill={liked ? 'currentColor' : 'none'} />
            </button>
            <div className="tiktok-action-count">{formatCount(counts.likes)}</div>
          </div>

          <div className="tiktok-action">
            <button className="tiktok-action-btn" onClick={onComment}>
              <MessageCircle size={24} />
            </button>
            <div className="tiktok-action-count">{formatCount(counts.comments)}</div>
          </div>

          <div className="tiktok-action">
            <button className="tiktok-action-btn" onClick={onShare}>
              <Share size={24} />
            </button>
            <div className="tiktok-action-count">{formatCount(counts.shares)}</div>
          </div>

          <div className="tiktok-action">
            <button className="tiktok-action-btn" onClick={onAudioCall}>
              <Phone size={20} />
            </button>
          </div>

          <div className="tiktok-action">
            <button className="tiktok-action-btn" onClick={onVideoCall}>
              <Video size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Perfect TikTok Bottom Navigation
function TikTokBottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/reels' || path === '/') {
      return location.pathname === '/' || location.pathname === '/reels';
    }
    return location.pathname.startsWith(path);
  };

  const handleNavigation = (path: string) => {
    if (isActive(path)) {
      const feedElement = document.querySelector('.tiktok-feed');
      if (feedElement) {
        feedElement.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      navigate(path);
    }
  };

  return (
    <nav className="tiktok-bottom-nav">
      <button
        className={`tiktok-nav-item ${isActive('/reels') ? 'active' : ''}`}
        onClick={() => handleNavigation('/reels')}
      >
        <div className="tiktok-nav-icon">
          <Home size={24} />
        </div>
        <div className="tiktok-nav-label">Home</div>
      </button>

      <button
        className={`tiktok-nav-item ${isActive('/search') ? 'active' : ''}`}
        onClick={() => handleNavigation('/search')}
      >
        <div className="tiktok-nav-icon">
          <Search size={24} />
        </div>
        <div className="tiktok-nav-label">Explore</div>
      </button>

      <button
        className="tiktok-create"
        onClick={() => handleNavigation('/create')}
      >
        +
      </button>

      <button
        className={`tiktok-nav-item ${isActive('/inbox') ? 'active' : ''}`}
        onClick={() => handleNavigation('/inbox')}
      >
        <div className="tiktok-nav-icon" style={{ position: 'relative' }}>
          <MessageSquare size={24} />
          <span className="tiktok-nav-badge">3</span>
        </div>
        <div className="tiktok-nav-label">Inbox</div>
      </button>

      <button
        className={`tiktok-nav-item ${isActive('/profile') ? 'active' : ''}`}
        onClick={() => handleNavigation('/profile')}
      >
        <div className="tiktok-nav-icon">
          <User size={24} />
        </div>
        <div className="tiktok-nav-label">Me</div>
      </button>
    </nav>
  );
}
