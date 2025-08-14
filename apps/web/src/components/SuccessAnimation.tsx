import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Heart, Star, Gift, ThumbsUp, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface SuccessAnimationProps {
  isVisible: boolean;
  onComplete?: () => void;
  type?: 'check' | 'heart' | 'star' | 'gift' | 'thumbs' | 'sparkles';
  message?: string;
  duration?: number;
}

export default function SuccessAnimation({
  isVisible,
  onComplete,
  type = 'check',
  message = 'Success!',
  duration = 2000
}: SuccessAnimationProps) {
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    if (isVisible) {
      const messageTimer = setTimeout(() => setShowMessage(true), 500);
      const completeTimer = setTimeout(() => {
        onComplete?.();
        setShowMessage(false);
      }, duration);

      return () => {
        clearTimeout(messageTimer);
        clearTimeout(completeTimer);
      };
    }
  }, [isVisible, duration, onComplete]);

  const getIcon = () => {
    switch (type) {
      case 'heart':
        return <Heart className="w-16 h-16 text-red-500 fill-current" />;
      case 'star':
        return <Star className="w-16 h-16 text-yellow-500 fill-current" />;
      case 'gift':
        return <Gift className="w-16 h-16 text-purple-500" />;
      case 'thumbs':
        return <ThumbsUp className="w-16 h-16 text-blue-500 fill-current" />;
      case 'sparkles':
        return <Sparkles className="w-16 h-16 text-primary" />;
      default:
        return <CheckCircle className="w-16 h-16 text-green-500 fill-current" />;
    }
  };

  const getColor = () => {
    switch (type) {
      case 'heart':
        return 'from-red-500 to-pink-500';
      case 'star':
        return 'from-yellow-500 to-orange-500';
      case 'gift':
        return 'from-purple-500 to-pink-500';
      case 'thumbs':
        return 'from-blue-500 to-cyan-500';
      case 'sparkles':
        return 'from-primary to-secondary';
      default:
        return 'from-green-500 to-emerald-500';
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
        >
          {/* Background particles */}
          <div className="absolute inset-0">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className={cn(
                  'absolute w-2 h-2 rounded-full',
                  type === 'heart' ? 'bg-red-300' :
                  type === 'star' ? 'bg-yellow-300' :
                  type === 'gift' ? 'bg-purple-300' :
                  type === 'thumbs' ? 'bg-blue-300' :
                  type === 'sparkles' ? 'bg-primary/50' :
                  'bg-green-300'
                )}
                style={{
                  left: `${50 + Math.cos(i * 45 * Math.PI / 180) * 20}%`,
                  top: `${50 + Math.sin(i * 45 * Math.PI / 180) * 20}%`,
                }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                  x: Math.cos(i * 45 * Math.PI / 180) * 100,
                  y: Math.sin(i * 45 * Math.PI / 180) * 100,
                }}
                transition={{
                  duration: 1.5,
                  delay: 0.3 + i * 0.1,
                  ease: "easeOut"
                }}
              />
            ))}
          </div>

          {/* Main icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: "spring",
              damping: 15,
              stiffness: 200,
              delay: 0.2
            }}
            className="relative"
          >
            {/* Glow effect */}
            <motion.div
              className={cn(
                'absolute inset-0 rounded-full blur-xl',
                `bg-gradient-to-br ${getColor()}`
              )}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            {/* Icon */}
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 0.6,
                delay: 0.5,
                ease: "easeInOut"
              }}
            >
              {getIcon()}
            </motion.div>
          </motion.div>

          {/* Message */}
          <AnimatePresence>
            {showMessage && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="absolute bottom-1/3 text-center"
              >
                <motion.h3
                  className="text-2xl font-bold text-white mb-2"
                  animate={{
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 0.3,
                    delay: 0.2
                  }}
                >
                  {message}
                </motion.h3>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Convenience components for specific success types
export const LikeSuccess = (props: Omit<SuccessAnimationProps, 'type'>) => (
  <SuccessAnimation {...props} type="heart" message="Liked!" />
);

export const SaveSuccess = (props: Omit<SuccessAnimationProps, 'type'>) => (
  <SuccessAnimation {...props} type="star" message="Saved!" />
);

export const ShareSuccess = (props: Omit<SuccessAnimationProps, 'type'>) => (
  <SuccessAnimation {...props} type="sparkles" message="Shared!" />
);

export const PurchaseSuccess = (props: Omit<SuccessAnimationProps, 'type'>) => (
  <SuccessAnimation {...props} type="gift" message="Purchase Complete!" />
);

export const FollowSuccess = (props: Omit<SuccessAnimationProps, 'type'>) => (
  <SuccessAnimation {...props} type="thumbs" message="Following!" />
);
