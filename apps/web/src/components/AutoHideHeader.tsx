import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TanzaniteLogo from './TanzaniteLogo';
import ProfileButton from './ProfileButton';
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
  const [lastScrollY, setLastScrollY] = useState(0);
  const { isAuthed } = useAuthStatus();

  useEffect(() => {
    // Auto-hide after sign-in + scroll
    if (isAuthed) {
      const handleScroll = () => {
        const el = document.querySelector<HTMLElement>('.scroll-screen');
        if (!el) return;

        const currentScrollY = el.scrollTop;
        
        // Hide header after scrolling down 100px when authenticated
        if (currentScrollY > 100) {
          setIsVisible(false);
        } else if (currentScrollY < lastScrollY && currentScrollY < 50) {
          // Show header when scrolling up near the top
          setIsVisible(true);
        }
        
        setLastScrollY(currentScrollY);
      };

      const el = document.querySelector<HTMLElement>('.scroll-screen');
      el?.addEventListener('scroll', handleScroll, { passive: true });
      return () => el?.removeEventListener('scroll', handleScroll);
    } else {
      // Always show for non-authenticated users
      setIsVisible(true);
    }
  }, [isAuthed, lastScrollY]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.header
          initial={{ opacity: 1, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -60 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="absolute inset-x-0 top-0 h-14 flex items-center justify-between px-3 z-30"
        >
          {/* Top veil for legibility */}
          <div className="absolute inset-0 tz-top-veil" />
          
          <div className="relative flex items-center gap-2">
            <TanzaniteLogo />
            {showLiveInfo && (
              <>
                <span className="ml-2 text-xs text-red-400 font-semibold animate-pulse">LIVE</span>
                <span className="ml-1 flex items-center gap-1 text-xs text-white/80">
                  👁 {viewerCount}
                </span>
              </>
            )}
          </div>
          
          <div className="relative">
            <ProfileButton onClick={onProfileClick} />
          </div>
        </motion.header>
      )}
    </AnimatePresence>
  );
}
