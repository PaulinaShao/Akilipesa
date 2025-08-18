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

  // Only hide on specific auth routes
  const shouldHideNav = hideBottomNav ||
    location.pathname === '/login' ||
    location.pathname === '/auth/login' ||
    location.pathname === '/auth/verify';

  console.log('MobileLayout render:', { shouldHideNav, pathname: location.pathname });

  return (
    <div className="h-screen flex flex-col tz-bg">
      {/* Main content area - takes remaining space */}
      <main className="flex-1 overflow-hidden relative">
        <div className="h-full w-full relative">
          {children}
        </div>
      </main>

      {/* Bottom navigation - ALWAYS render for main pages */}
      {!shouldHideNav && (
        <div className="flex-shrink-0">
          <BottomNav />
        </div>
      )}

      {/* AI Assistant floating button */}
      <AIAssistantButton />
    </div>
  );
}
