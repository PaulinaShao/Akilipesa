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
  const { isAuthed } = useAuthStatus();

  return (
    <header className="header auto-hide-header tnz-glass">
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
