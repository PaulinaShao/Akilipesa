import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Brand from '@/components/Brand';
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
    }, 1500); // 1.5s animation

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

        {/* Tanzanite Lottie logo */}
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
          {/* Enhanced glow effect for Lottie */}
          <motion.div
            className="absolute -inset-12 opacity-60"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1.2, opacity: 0.6 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            <div className="w-full h-full bg-gradient-to-r from-[var(--tz-gem-500)]/30 via-[var(--tz-royal-500)]/20 to-[var(--tz-ice-400)]/30 rounded-full blur-3xl" />
          </motion.div>

          {/* Tanzanite A Icon Only */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: 'spring',
              stiffness: 200,
              damping: 15,
              delay: 0.3
            }}
            className="relative z-10"
          >
            <div className="flex items-center justify-center">
              <motion.svg
                className="w-24 h-24"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 200,
                  damping: 20,
                  delay: 0.5
                }}
              >
                <defs>
                  <linearGradient id="tanzanite-splash-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="var(--tz-blue-deep)" />
                    <stop offset="55%" stopColor="var(--tz-indigo)" />
                    <stop offset="100%" stopColor="var(--tz-violet)" />
                  </linearGradient>
                  {/* Tanzania flag stripe for splash */}
                  <linearGradient id="tz-splash-stripe" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#1db954" />    {/* green */}
                    <stop offset="20%" stopColor="#c9a24a" />   {/* yellow */}
                    <stop offset="40%" stopColor="#000" />      {/* black */}
                    <stop offset="60%" stopColor="#c9a24a" />   {/* yellow */}
                    <stop offset="80%" stopColor="#0052cc" />   {/* blue */}
                  </linearGradient>
                </defs>
                {/* Main "A" shape */}
                <motion.path
                  d="M50 10L75 90H65L62 80H38L35 90H25L50 10Z M45 55H55L50 35L45 55Z"
                  fill="url(#tanzanite-splash-gradient)"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 0.8, duration: 1 }}
                />
                {/* Flag stripe on A leg with animation */}
                <motion.rect
                  x="32"
                  y="65"
                  width="4"
                  height="25"
                  fill="url(#tz-splash-stripe)"
                  opacity="0.9"
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ delay: 1.2, duration: 0.6 }}
                />
                {/* AI node cluster (animated) */}
                <motion.circle
                  cx="50"
                  cy="45"
                  r="3"
                  fill="white"
                  opacity="0.8"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.5, duration: 0.3 }}
                />
                <motion.circle
                  cx="45"
                  cy="50"
                  r="2"
                  fill="white"
                  opacity="0.6"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.7, duration: 0.3 }}
                />
                <motion.circle
                  cx="55"
                  cy="50"
                  r="2"
                  fill="white"
                  opacity="0.6"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.9, duration: 0.3 }}
                />
              </motion.svg>
            </div>
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
