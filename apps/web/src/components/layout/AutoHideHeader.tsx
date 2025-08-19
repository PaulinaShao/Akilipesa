import { useState, useEffect } from 'react';
import TanzaniteLogo from '../TanzaniteLogo';
import ProfileButton from '../ProfileButton';
import { useAuthStatus } from '@/auth/useAuthStatus';

interface AutoHideHeaderProps {
  onProfileClick: () => void;
  showLiveInfo?: boolean;
  viewerCount?: string;
}

export default function AutoHideHeader({
  onProfileClick,
  showLiveInfo = false,
  viewerCount = "1.2k"
}: AutoHideHeaderProps) {
  const [isVisible, setIsVisible] = useState(true);
  const { isAuthed } = useAuthStatus();

  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;

    const onScroll = () => {
      const y = window.scrollY;
      if (Math.abs(y - lastY) > 4) {
        if (y > lastY) {
          setIsVisible(false); // scrolling down
        } else {
          setIsVisible(true);  // scrolling up
        }
        lastY = y;
      }
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(onScroll);
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`header auto-hide-header fixed top-0 left-0 right-0 h-[var(--header-h)] tnz-glass ${!isVisible ? 'hidden' : ''}`}>
      {/* Top veil for legibility */}
      <div className="absolute inset-0 tz-top-veil" />
      <div className="flex items-center justify-between px-4 h-full">
        <div className="flex items-center gap-3">
          <TanzaniteLogo />
          {showLiveInfo && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-red-400 font-semibold animate-pulse">LIVE</span>
              <span className="flex items-center gap-1 text-xs text-white/80">
                👁 {viewerCount}
              </span>
            </div>
          )}
        </div>
        
        <div>
          <ProfileButton onClick={onProfileClick} />
        </div>
      </div>
    </header>
  );
}
