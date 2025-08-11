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
    <div className="h-screen-safe flex flex-col bg-gem-dark overflow-hidden">
      {/* Main content area */}
      <main className={`flex-1 overflow-hidden ${!shouldHideNav ? 'pb-16' : ''}`}>
        {children}
      </main>
      
      {/* Bottom navigation */}
      {!shouldHideNav && <BottomNav />}
    </div>
  );
}
