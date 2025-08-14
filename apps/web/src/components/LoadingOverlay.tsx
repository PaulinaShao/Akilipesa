import { motion } from 'framer-motion';
import { Loader2, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
  type?: 'default' | 'processing' | 'ai' | 'upload';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function LoadingOverlay({
  isVisible,
  message = 'Loading...',
  type = 'default',
  size = 'md',
  className
}: LoadingOverlayProps) {
  if (!isVisible) return null;

  const getIcon = () => {
    switch (type) {
      case 'ai':
        return <Sparkles className="w-8 h-8 text-primary animate-pulse" />;
      case 'processing':
        return <Loader2 className="w-8 h-8 text-primary animate-spin" />;
      default:
        return <Loader2 className="w-8 h-8 text-primary animate-spin" />;
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'w-6 h-6';
      case 'lg':
        return 'w-12 h-12';
      default:
        return 'w-8 h-8';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={cn(
        'fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50',
        className
      )}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        className="bg-white rounded-3xl p-8 max-w-sm mx-4 text-center"
      >
        <div className="mb-4 flex justify-center">
          {getIcon()}
        </div>
        
        <h3 className="text-lg font-semibold mb-2">
          {type === 'ai' && 'AI is working...'}
          {type === 'processing' && 'Processing...'}
          {type === 'upload' && 'Uploading...'}
          {type === 'default' && 'Please wait'}
        </h3>
        
        <p className="text-gray-600 text-sm">{message}</p>
        
        {type === 'ai' && (
          <div className="mt-4 flex justify-center space-x-1">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-primary rounded-full"
                animate={{
                  y: [-4, 4, -4],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
              />
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
