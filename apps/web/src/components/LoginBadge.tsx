import { useState } from 'react';
import { LogIn } from 'lucide-react';
import { cn } from '@/lib/utils';
import AuthSheet from '@/components/auth/AuthSheet';

interface LoginBadgeProps {
  className?: string;
}

export default function LoginBadge({ className }: LoginBadgeProps) {
  const [showAuthSheet, setShowAuthSheet] = useState(false);

  const handleClick = () => {
    setShowAuthSheet(true);
  };

  const handleAuthSuccess = () => {
    setShowAuthSheet(false);
    // Stay on same scroll position - page will re-render with user state
  };

  return (
    <>
      <button
        onClick={handleClick}
        className={cn(
          "fixed top-12 right-4 z-40",
          "bg-black/60 backdrop-blur-md rounded-full",
          "px-3 py-2 flex items-center space-x-2",
          "text-white text-sm font-medium",
          "border border-white/20",
          "transition-all duration-200",
          "hover:bg-black/70 hover:scale-[1.02]",
          "active:scale-95",
          "shadow-lg",
          className
        )}
      >
        <LogIn className="w-4 h-4" />
        <span>Sign in for full experience</span>
      </button>

      <AuthSheet
        isOpen={showAuthSheet}
        onClose={() => setShowAuthSheet(false)}
        onSuccess={handleAuthSuccess}
      />
    </>
  );
}
