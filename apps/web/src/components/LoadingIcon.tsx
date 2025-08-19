import { motion } from 'framer-motion';

interface LoadingIconProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function LoadingIcon({ size = 'md', className = '' }: LoadingIconProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12', 
    lg: 'w-16 h-16'
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <motion.svg
        className={sizeClasses[size]}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        animate={{ 
          rotate: [0, 360],
          scale: [1, 1.1, 1]
        }}
        transition={{
          rotate: {
            duration: 2,
            repeat: Infinity,
            ease: "linear"
          },
          scale: {
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }}
      >
        <defs>
          <linearGradient id="tanzanite-loading-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--tz-blue-deep)" />
            <stop offset="55%" stopColor="var(--tz-indigo)" />
            <stop offset="100%" stopColor="var(--tz-violet)" />
          </linearGradient>
          {/* Tanzania flag stripe for loading */}
          <linearGradient id="tz-loading-stripe" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1db954" />    {/* green */}
            <stop offset="20%" stopColor="#c9a24a" />   {/* yellow */}
            <stop offset="40%" stopColor="#000" />      {/* black */}
            <stop offset="60%" stopColor="#c9a24a" />   {/* yellow */}
            <stop offset="80%" stopColor="#0052cc" />   {/* blue */}
          </linearGradient>
        </defs>
        
        {/* Main "A" shape */}
        <motion.path
          d="M32 8L48 56H42L40 48H24L22 56H16L32 8Z M28 36H36L32 22L28 36Z"
          fill="url(#tanzanite-loading-gradient)"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        />
        
        {/* Flag stripe on A leg */}
        <motion.rect 
          x="20" 
          y="42" 
          width="3" 
          height="14" 
          fill="url(#tz-loading-stripe)" 
          opacity="0.9"
          animate={{
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* AI node cluster (pulsing) */}
        <motion.circle 
          cx="32" 
          cy="28" 
          r="2" 
          fill="white" 
          opacity="0.8"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.8, 0.4, 0.8]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.circle 
          cx="28" 
          cy="32" 
          r="1.5" 
          fill="white" 
          opacity="0.6"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.6, 0.3, 0.6]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.2
          }}
        />
        <motion.circle 
          cx="36" 
          cy="32" 
          r="1.5" 
          fill="white" 
          opacity="0.6"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.6, 0.3, 0.6]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.4
          }}
        />
      </motion.svg>
    </div>
  );
}
