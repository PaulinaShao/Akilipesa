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
    <div className="h-screen tz-bg">
      {/* Main content area - full viewport */}
      <main className="h-full w-full relative">
        {children}
      </main>

      {/* AI Assistant floating button */}
      <AIAssistantButton />

      {/* Bottom navigation - ALWAYS render as direct fixed child */}
      <BottomNav />
    </div>
  );
}
