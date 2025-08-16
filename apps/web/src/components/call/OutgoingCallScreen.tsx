import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, PhoneOff, Video, Mic, MicOff, MessageCircle, MoreVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OutgoingCallScreenProps {
  callee: {
    id: string;
    name: string;
    avatar: string;
    username: string;
  };
  callType: 'audio' | 'video';
  onEndCall: () => void;
  onMessage: () => void;
  onToggleMute: () => void;
  isMuted: boolean;
}

export default function OutgoingCallScreen({
  callee,
  callType,
  onEndCall,
  onMessage,
  onToggleMute,
  isMuted
}: OutgoingCallScreenProps) {
  const [callDuration, setCallDuration] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'ringing' | 'connected'>('connecting');

  useEffect(() => {
    // Simulate connection process
    const timer1 = setTimeout(() => setConnectionStatus('ringing'), 1000);
    const timer2 = setTimeout(() => setConnectionStatus('connected'), 3000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (connectionStatus === 'connected') {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [connectionStatus]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connecting':
        return 'Connecting...';
      case 'ringing':
        return 'Ringing...';
      case 'connected':
        return formatDuration(callDuration);
      default:
        return 'Connecting...';
    }
  };

  return (
    <div className="h-screen-safe bg-gradient-to-b from-[#0a0e1a] via-[#1a1235] to-[#0b0c14] relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-40 right-16 w-40 h-40 bg-secondary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-primary/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Header */}
      <div className="safe-top p-6 flex items-center justify-between">
        <div className="text-center flex-1">
          <motion.p 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-white/80 text-lg font-medium"
          >
            {callType === 'video' ? 'Video Call' : 'Audio Call'}
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center gap-2 mt-1"
          >
            <div className={cn(
              "w-2 h-2 rounded-full",
              connectionStatus === 'connected' ? 'bg-green-400' : 'bg-yellow-400'
            )} />
            <span className={cn(
              "text-sm",
              connectionStatus === 'connected' ? 'text-green-400' : 'text-yellow-400'
            )}>
              {getStatusText()}
            </span>
          </motion.div>
        </div>

        <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <MoreVertical className="w-6 h-6 text-white/60" />
        </button>
      </div>

      {/* Callee Info */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        {/* Avatar */}
        <motion.div 
          className="relative mb-8"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, type: 'spring', damping: 20 }}
        >
          {/* Pulsing rings for connecting/ringing */}
          <AnimatePresence>
            {connectionStatus !== 'connected' && (
              <>
                <motion.div
                  initial={{ scale: 1, opacity: 0.6 }}
                  animate={{ scale: 1.2, opacity: 0 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
                  className="absolute inset-0 border-3 border-primary/60 rounded-full"
                />
                <motion.div
                  initial={{ scale: 1, opacity: 0.4 }}
                  animate={{ scale: 1.4, opacity: 0 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut', delay: 0.3 }}
                  className="absolute inset-0 border-2 border-primary/40 rounded-full"
                />
              </>
            )}
          </AnimatePresence>
          
          {/* Avatar */}
          <div className="w-40 h-40 relative">
            <img
              src={callee.avatar}
              alt={callee.name}
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

        {/* Callee Name */}
        <motion.div 
          className="text-center mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-white mb-1">{callee.name}</h2>
          <p className="text-white/60 text-lg">@{callee.username}</p>
        </motion.div>

        {/* Connection Status */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20">
            <div className={cn(
              "w-3 h-3 rounded-full",
              connectionStatus === 'connected' ? 'bg-green-400' : 'bg-yellow-400 animate-pulse'
            )} />
            <span className="text-white/90 text-base font-medium">
              {getStatusText()}
            </span>
          </div>
        </motion.div>

        {/* Quick Actions (only show when connected) */}
        <AnimatePresence>
          {connectionStatus === 'connected' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
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

              {/* Mute */}
              <button
                onClick={onToggleMute}
                className={cn(
                  "w-14 h-14 rounded-full flex items-center justify-center transition-all",
                  isMuted 
                    ? "bg-red-500 hover:bg-red-600" 
                    : "bg-white/20 hover:bg-white/30"
                )}
              >
                {isMuted ? (
                  <MicOff className="w-6 h-6 text-white" />
                ) : (
                  <Mic className="w-6 h-6 text-white" />
                )}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Action Buttons */}
      <motion.div 
        className="safe-bottom p-8"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, type: 'spring', damping: 25 }}
      >
        <div className="flex items-center justify-center">
          {/* End Call Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onEndCall}
            className="w-20 h-20 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center shadow-2xl"
            style={{
              boxShadow: '0 0 30px rgba(239, 68, 68, 0.4)'
            }}
          >
            <PhoneOff className="w-10 h-10 text-white" />
          </motion.button>
        </div>

        {/* Action Label */}
        <div className="text-center mt-4">
          <span className="text-white/60 text-sm">End call</span>
        </div>
      </motion.div>
    </div>
  );
}
