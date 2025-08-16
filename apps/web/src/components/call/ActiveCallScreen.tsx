import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PhoneOff,
  Video,
  VideoOff,
  Mic,
  MicOff,
  MessageCircle,
  MoreVertical,
  RotateCcw,
  UserPlus,
  Minimize2,
  Maximize2
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Participant {
  id: string;
  name: string;
  avatar: string;
  username: string;
  isMuted: boolean;
  hasVideo: boolean;
}

interface ActiveCallScreenProps {
  participants: Participant[];
  currentUser: Participant;
  callType: 'audio' | 'video';
  callDuration: number;
  onEndCall: () => void;
  onToggleMute: () => void;
  onToggleVideo?: () => void;
  onSwitchCamera?: () => void;
  onAddParticipant?: () => void;
  onMessage: () => void;
  onMinimize: () => void;
  isMinimized?: boolean;
}

export default function ActiveCallScreen({
  participants,
  currentUser,
  callType,
  callDuration,
  onEndCall,
  onToggleMute,
  onToggleVideo,
  onSwitchCamera,
  onAddParticipant,
  onMessage,
  onMinimize,
  isMinimized = false
}: ActiveCallScreenProps) {
  const [showControls, setShowControls] = useState(true);
  // const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    // Auto-hide controls after 5 seconds in video calls
    if (callType === 'video' && !isMinimized) {
      const timer = setTimeout(() => {
        setShowControls(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [callType, isMinimized, showControls]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const mainParticipant = participants[0] || currentUser;
  const otherParticipants = participants.slice(1);

  if (isMinimized) {
    return (
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="fixed top-20 right-4 z-50 w-32 h-48 bg-black rounded-2xl border-2 border-white/20 overflow-hidden"
      >
        {/* Minimized Video View */}
        {callType === 'video' && mainParticipant.hasVideo ? (
          <div className="w-full h-full relative">
            <img
              src={mainParticipant.avatar}
              alt={mainParticipant.name}
              className="w-full h-full object-cover"
            />
            {/* Minimize controls */}
            <div className="absolute bottom-2 left-2 right-2 flex justify-between">
              <button
                onClick={onMinimize}
                className="w-6 h-6 bg-black/50 rounded-full flex items-center justify-center"
              >
                <Maximize2 className="w-3 h-3 text-white" />
              </button>
              <button
                onClick={onEndCall}
                className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center"
              >
                <PhoneOff className="w-3 h-3 text-white" />
              </button>
            </div>
          </div>
        ) : (
          /* Minimized Audio View */
          <div className="w-full h-full bg-gradient-to-b from-primary to-secondary flex flex-col items-center justify-center">
            <img
              src={mainParticipant.avatar}
              alt={mainParticipant.name}
              className="w-16 h-16 rounded-full object-cover mb-2"
            />
            <p className="text-white text-xs font-medium text-center">{formatDuration(callDuration)}</p>
            <div className="flex gap-1 mt-2">
              <button
                onClick={onMinimize}
                className="w-6 h-6 bg-black/30 rounded-full flex items-center justify-center"
              >
                <Maximize2 className="w-3 h-3 text-white" />
              </button>
              <button
                onClick={onEndCall}
                className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center"
              >
                <PhoneOff className="w-3 h-3 text-white" />
              </button>
            </div>
          </div>
        )}
      </motion.div>
    );
  }

  return (
    <div 
      className="h-screen-safe bg-black relative overflow-hidden"
      onClick={() => callType === 'video' && setShowControls(true)}
    >
      {/* Video Call Layout */}
      {callType === 'video' && (
        <div className="absolute inset-0">
          {/* Main participant video */}
          <div className="w-full h-full bg-black flex items-center justify-center">
            {mainParticipant.hasVideo ? (
              <div className="w-full h-full relative">
                {/* Simulated video - replace with actual video element */}
                <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                  <img
                    src={mainParticipant.avatar}
                    alt={mainParticipant.name}
                    className="w-32 h-32 rounded-full object-cover opacity-50"
                  />
                </div>
              </div>
            ) : (
              /* Video off - show avatar */
              <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                <div className="text-center">
                  <img
                    src={mainParticipant.avatar}
                    alt={mainParticipant.name}
                    className="w-40 h-40 rounded-full object-cover mx-auto mb-4"
                  />
                  <p className="text-white text-lg">{mainParticipant.name}</p>
                  <p className="text-white/60 text-sm">Camera is off</p>
                </div>
              </div>
            )}
          </div>

          {/* Self video preview */}
          <motion.div 
            className="absolute top-4 right-4 w-32 h-48 bg-gray-800 rounded-xl overflow-hidden border-2 border-white/20"
            drag
            dragMomentum={false}
            dragElastic={0.2}
            dragConstraints={{
              top: 0,
              left: -300,
              right: 0,
              bottom: 200
            }}
          >
            {currentUser.hasVideo ? (
              <div className="w-full h-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <div className="text-white text-xs">You</div>
              </div>
            ) : (
              <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                <img
                  src={currentUser.avatar}
                  alt="You"
                  className="w-16 h-16 rounded-full object-cover"
                />
              </div>
            )}
          </motion.div>

          {/* Other participants (if any) */}
          {otherParticipants.length > 0 && (
            <div className="absolute bottom-24 left-4 flex gap-2">
              {otherParticipants.map((participant, index) => (
                <div
                  key={participant.id}
                  className="w-20 h-28 bg-gray-800 rounded-lg overflow-hidden border border-white/20"
                >
                  <img
                    src={participant.avatar}
                    alt={participant.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Audio Call Layout */}
      {callType === 'audio' && (
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0e1a] via-[#1a1235] to-[#0b0c14]">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-40 right-16 w-40 h-40 bg-secondary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          </div>

          {/* Main participant */}
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="text-center mb-8">
              <img
                src={mainParticipant.avatar}
                alt={mainParticipant.name}
                className="w-48 h-48 rounded-full object-cover border-4 border-white/20 mx-auto mb-6"
              />
              <h2 className="text-3xl font-bold text-white mb-2">{mainParticipant.name}</h2>
              <p className="text-white/60 text-lg">@{mainParticipant.username}</p>
            </div>

            {/* Other participants avatars */}
            {otherParticipants.length > 0 && (
              <div className="flex gap-4 mb-8">
                {otherParticipants.map((participant) => (
                  <div key={participant.id} className="text-center">
                    <img
                      src={participant.avatar}
                      alt={participant.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-white/20 mb-2"
                    />
                    <p className="text-white text-xs">{participant.name}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Call Header */}
      <AnimatePresence>
        {(showControls || callType === 'audio') && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="absolute top-0 left-0 right-0 safe-top p-4 bg-gradient-to-b from-black/70 to-transparent backdrop-blur-sm"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-400 rounded-full" />
                <span className="text-white font-medium">{formatDuration(callDuration)}</span>
              </div>

              <div className="text-center flex-1">
                <p className="text-white/80 text-sm">
                  {participants.length + 1} participant{participants.length > 0 ? 's' : ''}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={onMinimize}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <Minimize2 className="w-5 h-5 text-white" />
                </button>
                <button className="p-2 hover:bg-white/20 rounded-full transition-colors">
                  <MoreVertical className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Control Panel */}
      <AnimatePresence>
        {(showControls || callType === 'audio') && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="absolute bottom-0 left-0 right-0 safe-bottom p-6 bg-gradient-to-t from-black/70 to-transparent backdrop-blur-sm"
          >
            <div className="flex items-center justify-center gap-4 mb-4">
              {/* Mute Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onToggleMute}
                className={cn(
                  'w-16 h-16 rounded-full flex items-center justify-center transition-all',
                  currentUser.isMuted 
                    ? 'bg-red-500 hover:bg-red-600' 
                    : 'bg-white/20 hover:bg-white/30'
                )}
              >
                {currentUser.isMuted ? (
                  <MicOff className="w-8 h-8 text-white" />
                ) : (
                  <Mic className="w-8 h-8 text-white" />
                )}
              </motion.button>

              {/* Video Toggle (video calls only) */}
              {callType === 'video' && onToggleVideo && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onToggleVideo}
                  className={cn(
                    'w-16 h-16 rounded-full flex items-center justify-center transition-all',
                    !currentUser.hasVideo
                      ? 'bg-red-500 hover:bg-red-600'
                      : 'bg-white/20 hover:bg-white/30'
                  )}
                >
                  {currentUser.hasVideo ? (
                    <Video className="w-8 h-8 text-white" />
                  ) : (
                    <VideoOff className="w-8 h-8 text-white" />
                  )}
                </motion.button>
              )}

              {/* Switch Camera (video calls only) */}
              {callType === 'video' && onSwitchCamera && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onSwitchCamera}
                  className="w-16 h-16 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all"
                >
                  <RotateCcw className="w-8 h-8 text-white" />
                </motion.button>
              )}

              {/* Add Participant */}
              {onAddParticipant && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onAddParticipant}
                  className="w-16 h-16 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all"
                >
                  <UserPlus className="w-8 h-8 text-white" />
                </motion.button>
              )}

              {/* Message */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onMessage}
                className="w-16 h-16 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all"
              >
                <MessageCircle className="w-8 h-8 text-white" />
              </motion.button>

              {/* End Call */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onEndCall}
                className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center transition-all"
                style={{
                  boxShadow: '0 0 20px rgba(239, 68, 68, 0.4)'
                }}
              >
                <PhoneOff className="w-8 h-8 text-white" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tap to show controls hint (video only) */}
      {callType === 'video' && !showControls && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        >
          <div className="bg-black/50 backdrop-blur-sm rounded-full px-4 py-2">
            <p className="text-white/80 text-sm">Tap to show controls</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
