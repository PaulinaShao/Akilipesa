import { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import BottomNav from './BottomNav';
import AIAssistantButton from '../AIAssistantButton';

interface MobileLayoutProps {
  children: ReactNode;
  hideBottomNav?: boolean;
}

export default function MobileLayout({ children, hideBottomNav = false }: MobileLayoutProps) {
  const location = useLocation();
  
  // Hide bottom nav on login and auth pages
  const shouldHideNav = hideBottomNav || 
    location.pathname.includes('/login') || 
    location.pathname.includes('/auth');

  return (
    <div className="min-h-dvh flex flex-col tz-bg relative">
      {/* Main content area */}
      <main className="flex-1 relative">
        {children}
      </main>

      {/* AI Assistant floating button */}
      <AIAssistantButton />

      {/* Bottom navigation - always render when not hidden */}
      {!shouldHideNav && <BottomNav />}
    </div>
  );
}
