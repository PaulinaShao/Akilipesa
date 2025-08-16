import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, PhoneOff, Video, MessageCircle } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';

interface CallNotificationProps {
  isVisible: boolean;
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

export default function CallNotification({
  isVisible,
  caller,
  callType,
  onAccept,
  onDecline,
  onMessage
}: CallNotificationProps) {
  const [isRinging, setIsRinging] = useState(false);

  useEffect(() => {
    if (isVisible) {
      const interval = setInterval(() => {
        setIsRinging(prev => !prev);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        className="fixed top-4 left-4 right-4 z-50 bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 border border-white/20 rounded-2xl p-4 backdrop-blur-xl shadow-2xl"
      >
        <div className="flex items-center gap-4">
          {/* Caller Avatar with Ring Animation */}
          <div className="relative">
            <AnimatePresence>
              {isRinging && (
                <motion.div
                  initial={{ scale: 1, opacity: 0.8 }}
                  animate={{ scale: 1.3, opacity: 0 }}
                  exit={{ scale: 1.5, opacity: 0 }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="absolute inset-0 border-2 border-primary rounded-full"
                />
              )}
            </AnimatePresence>
            
            <img
              src={caller.avatar}
              alt={caller.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-white/20"
            />
            
            {/* Call type indicator */}
            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center border-2 border-white/20">
              {callType === 'video' ? (
                <Video className="w-4 h-4 text-white" />
              ) : (
                <Phone className="w-4 h-4 text-white" />
              )}
            </div>
          </div>

          {/* Caller Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-white font-semibold text-lg truncate">{caller.name}</h3>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            </div>
            <p className="text-white/60 text-sm mb-1">@{caller.username}</p>
            <p className="text-primary text-sm font-medium">
              Incoming {callType} call...
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            {/* Message */}
            <button
              onClick={onMessage}
              className="w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all"
            >
              <MessageCircle className="w-5 h-5 text-white" />
            </button>

            {/* Decline */}
            <button
              onClick={onDecline}
              className="w-12 h-12 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-all"
            >
              <PhoneOff className="w-5 h-5 text-white" />
            </button>

            {/* Accept */}
            <button
              onClick={onAccept}
              className="w-12 h-12 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center transition-all"
            >
              {callType === 'video' ? (
                <Video className="w-5 h-5 text-white" />
              ) : (
                <Phone className="w-5 h-5 text-white" />
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
