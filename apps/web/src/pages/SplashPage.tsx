import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import '@/styles/sparkle.css';

export default function SplashPage() {
  const navigate = useNavigate();
  const [showSparkles] = useState(true);

  useEffect(() => {
    // Check if user has seen splash before
    const hasSeenSplash = localStorage.getItem('ap.splashSeen');

    if (hasSeenSplash === '1') {
      // Skip animation and go directly to reels
      navigate('/reels', { replace: true });
      return;
    }

    // Show splash animation
    const timer = setTimeout(() => {
      localStorage.setItem('ap.splashSeen', '1');
      navigate('/reels', { replace: true });
    }, 1200); // 1.2s animation as specified

    return () => clearTimeout(timer);
  }, [navigate]);

  const sparklePositions = [
    { top: '20%', left: '25%', delay: 0 },
    { top: '30%', right: '20%', delay: 0.7 },
    { bottom: '35%', left: '15%', delay: 1.4 },
  ];

  return (
    <div className="h-screen bg-gradient-to-b from-[#0b0c14] via-[#1a1235] to-[#2d1b69] flex items-center justify-center relative overflow-hidden">
      {/* Background particles */}
      <div className="absolute inset-0 opacity-30">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-violet-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Main logo container */}
      <div className="sparkle-container relative">
        {/* Sparkles */}
        <AnimatePresence>
          {showSparkles && sparklePositions.map((pos, index) => (
            <motion.div
              key={index}
              className={`sparkle-particle sparkle sparkle-${index + 1}`}
              style={{
                position: 'absolute',
                ...pos,
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
            />
          ))}
        </AnimatePresence>

        {/* Star sparkles */}
        <AnimatePresence>
          {showSparkles && (
            <>
              <motion.div
                className="sparkle-star sparkle sparkle-1"
                style={{
                  position: 'absolute',
                  top: '15%',
                  right: '30%',
                }}
                initial={{ opacity: 0, rotate: 0 }}
                animate={{ opacity: 1, rotate: 360 }}
                exit={{ opacity: 0 }}
              />
              <motion.div
                className="sparkle-star sparkle sparkle-2"
                style={{
                  position: 'absolute',
                  bottom: '25%',
                  right: '15%',
                }}
                initial={{ opacity: 0, rotate: 0 }}
                animate={{ opacity: 1, rotate: -360 }}
                exit={{ opacity: 0 }}
              />
            </>
          )}
        </AnimatePresence>

        {/* Tanzanite gem logo */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            type: 'spring',
            stiffness: 200,
            damping: 20,
            delay: 0.2
          }}
          className="relative"
        >
          {/* Glow effect */}
          <motion.div
            className="absolute -inset-8 bg-violet-500/20 rounded-full blur-2xl gem-glow"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1.2, opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
          />
          
          {/* Main gem */}
          <motion.div
            className="relative w-24 h-24 bg-gradient-to-br from-violet-400 via-purple-500 to-indigo-600 rounded-lg transform rotate-45 shadow-2xl"
            initial={{ rotate: 45, scale: 0 }}
            animate={{ rotate: 45, scale: 1 }}
            transition={{ 
              type: 'spring',
              stiffness: 200,
              damping: 15,
              delay: 0.3
            }}
          >
            {/* Inner facets */}
            <div className="absolute inset-2 bg-gradient-to-br from-white/30 to-transparent rounded" />
            <div className="absolute top-2 left-2 w-4 h-4 bg-white/40 rounded-sm" />
            <div className="absolute bottom-2 right-2 w-6 h-6 bg-purple-600/50 rounded" />
          </motion.div>

          {/* Brand name */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 whitespace-nowrap"
          >
            <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-purple-300 bg-clip-text text-transparent tracking-wide">
              AkiliPesa
            </h1>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 1.2, duration: 0.4 }}
              className="h-0.5 bg-gradient-to-r from-violet-500 to-purple-400 mt-1 origin-left"
            />
          </motion.div>
        </motion.div>

        {/* Floating particles around logo */}
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-2 h-2 bg-violet-300/60 rounded-full"
            style={{
              left: `${50 + Math.cos((i * Math.PI * 2) / 8) * 100}%`,
              top: `${50 + Math.sin((i * Math.PI * 2) / 8) * 100}%`,
            }}
            animate={{
              y: [0, -10, 0],
              opacity: [0.3, 1, 0.3],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>

      {/* Loading indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-20 left-1/2 transform -translate-x-1/2"
      >
        <div className="flex space-x-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-violet-400 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
