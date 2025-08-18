import { useState, useEffect } from 'react';
import { X, LogIn } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStatus } from '@/auth/useAuthStatus';
import { useUIStore } from '@/state/uiStore';

export default function SignInToast() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const { isAuthed, loading } = useAuthStatus();
  const { openAuthSheet } = useUIStore();

  useEffect(() => {
    // Don't show if already authenticated or has been shown before
    if (loading || isAuthed || hasShown) return;

    // Check localStorage to see if we've shown this before
    const hasShownBefore = localStorage.getItem('signInToastShown') === 'true';
    if (hasShownBefore) {
      setHasShown(true);
      return;
    }

    // Show after 3 seconds delay
    const timer = setTimeout(() => {
      setIsVisible(true);
      setHasShown(true);
      localStorage.setItem('signInToastShown', 'true');
    }, 3000);

    return () => clearTimeout(timer);
  }, [loading, isAuthed, hasShown]);

  const handleDismiss = () => {
    setIsVisible(false);
  };

  const handleSignIn = () => {
    setIsVisible(false);
    openAuthSheet(undefined, 'sign_in');
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-20 left-4 right-4 z-50 max-w-sm mx-auto"
        >
          <div className="bg-black/90 backdrop-blur-md rounded-lg p-4 border border-white/10 shadow-lg">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-white text-sm font-medium mb-2">
                  Sign in to save earnings & progress
                </p>
                <div className="flex space-x-2">
                  <button
                    onClick={handleSignIn}
                    className="flex items-center space-x-1 px-3 py-1.5 bg-primary rounded-full text-white text-xs font-medium transition-all hover:bg-primary/80"
                  >
                    <LogIn className="w-3 h-3" />
                    <span>Sign in</span>
                  </button>
                  <button
                    onClick={handleDismiss}
                    className="px-3 py-1.5 bg-white/10 rounded-full text-white text-xs font-medium transition-all hover:bg-white/20"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
              <button
                onClick={handleDismiss}
                className="ml-2 p-1 text-white/60 hover:text-white transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
