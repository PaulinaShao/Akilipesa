import { LogIn } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUIStore } from '@/state/uiStore';
import { isRealUser } from '@/auth/phoneAuth';

interface LoginBadgeProps {
  className?: string;
}

export default function LoginBadge({ className }: LoginBadgeProps) {
  const { openAuthSheet } = useUIStore();

  const handleClick = () => {
    openAuthSheet(undefined, 'sign_in');
  };

  // Hide the badge if user is already a real user (not anonymous)
  if (isRealUser()) {
    return null;
  }

  return (
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
  );
}
