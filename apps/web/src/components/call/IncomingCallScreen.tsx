import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, PhoneOff, Video, MessageCircle, Mic } from 'lucide-react';
// import { cn } from '@/lib/utils';

interface IncomingCallScreenProps {
  caller: {
    id: string;
    name: string;
    avatar: string;
    username: string;
  };
  callType: 'audio' | 'video';
  onAccept: () => void;
  onDecline: () => void;
  onMessage: () => void;
}

export default function IncomingCallScreen({
  caller,
  callType,
  onAccept,
  onDecline,
  onMessage
}: IncomingCallScreenProps) {
  const [isRinging, setIsRinging] = useState(true);

  useEffect(() => {
    // Start ringing animation
    const interval = setInterval(() => {
      setIsRinging(prev => !prev);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-screen-safe bg-gradient-to-b from-[#0a0e1a] via-[#1a1235] to-[#0b0c14] relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-40 right-16 w-40 h-40 bg-secondary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-primary/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Header */}
      <div className="safe-top p-6 text-center">
        <motion.p 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-white/80 text-lg font-medium"
        >
          Incoming {callType} call
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-center gap-2 mt-2"
        >
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-green-400 text-sm">AkiliPesa</span>
        </motion.div>
      </div>

      {/* Caller Info */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        {/* Avatar with ring animation */}
        <motion.div 
          className="relative mb-8"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, type: 'spring', damping: 20 }}
        >
          {/* Pulsing rings */}
          <AnimatePresence>
            {isRinging && (
              <>
                <motion.div
                  initial={{ scale: 1, opacity: 0.8 }}
                  animate={{ scale: 1.3, opacity: 0 }}
                  exit={{ scale: 1.5, opacity: 0 }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="absolute inset-0 border-4 border-primary rounded-full"
                />
                <motion.div
                  initial={{ scale: 1, opacity: 0.6 }}
                  animate={{ scale: 1.6, opacity: 0 }}
                  exit={{ scale: 1.8, opacity: 0 }}
                  transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
                  className="absolute inset-0 border-2 border-primary/60 rounded-full"
                />
              </>
            )}
          </AnimatePresence>
          
          {/* Avatar */}
          <div className="w-40 h-40 relative">
            <img
              src={caller.avatar}
              alt={caller.name}
              className="w-full h-full rounded-full object-cover border-4 border-white/20"
            />
            {/* Call type indicator */}
            <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center border-4 border-white/20">
              {callType === 'video' ? (
                <Video className="w-6 h-6 text-white" />
              ) : (
                <Phone className="w-6 h-6 text-white" />
              )}
            </div>
          </div>
        </motion.div>

        {/* Caller Name */}
        <motion.div 
          className="text-center mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-white mb-1">{caller.name}</h2>
          <p className="text-white/60 text-lg">@{caller.username}</p>
        </motion.div>

        {/* Call status */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-white/80 text-sm">
              {callType === 'video' ? 'Video calling...' : 'Calling...'}
            </span>
          </div>
        </motion.div>

        {/* Quick actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex items-center gap-6 mb-12"
        >
          {/* Message */}
          <button
            onClick={onMessage}
            className="w-14 h-14 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all"
          >
            <MessageCircle className="w-6 h-6 text-white" />
          </button>

          {/* Mute (for video calls) */}
          {callType === 'video' && (
            <button className="w-14 h-14 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all">
              <Mic className="w-6 h-6 text-white" />
            </button>
          )}
        </motion.div>
      </div>

      {/* Action Buttons */}
      <motion.div 
        className="safe-bottom p-8"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, type: 'spring', damping: 25 }}
      >
        <div className="flex items-center justify-center gap-16">
          {/* Decline Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onDecline}
            className="w-20 h-20 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center shadow-2xl"
            style={{
              boxShadow: '0 0 30px rgba(239, 68, 68, 0.4)'
            }}
          >
            <PhoneOff className="w-10 h-10 text-white" />
          </motion.button>

          {/* Accept Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onAccept}
            className="w-20 h-20 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-2xl"
            style={{
              boxShadow: '0 0 30px rgba(34, 197, 94, 0.4)'
            }}
          >
            {callType === 'video' ? (
              <Video className="w-10 h-10 text-white" />
            ) : (
              <Phone className="w-10 h-10 text-white" />
            )}
          </motion.button>
        </div>

        {/* Action Labels */}
        <div className="flex items-center justify-center gap-16 mt-4">
          <span className="text-white/60 text-sm">Decline</span>
          <span className="text-white/60 text-sm">Accept</span>
        </div>
      </motion.div>
    </div>
  );
}
