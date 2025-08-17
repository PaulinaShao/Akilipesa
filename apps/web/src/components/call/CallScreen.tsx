import { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams, useLocation } from 'react-router-dom';
import { 
  ArrowLeft, 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  PhoneOff, 
  UserPlus, 
  Users, 
  Lock, 
  Globe,
  Volume2,
  VolumeX,
  MoreVertical,
  UserX,
  Settings,
  MessageCircle,
  Camera,
  RotateCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { getRtc, endCall } from '@/lib/api';
import { useAgoraCall } from '@/hooks/useAgoraCall';
import { useAuth } from '@/hooks/useAuth';

interface CallScreenProps {
  className?: string;
}

interface Participant {
  id: string;
  name: string;
  avatar: string;
  username: string;
  isMuted?: boolean;
  isVideoOff?: boolean;
}

export default function CallScreen({ className }: CallScreenProps) {
  const navigate = useNavigate();
  const { channel } = useParams();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const { user } = useAuth();
  
  const callType = searchParams.get('type') as 'audio' | 'video' || 'audio';
  const targetId = searchParams.get('target');
  const initialPrivacy = searchParams.get('privacy') || 'private';
  const autoConnect = location.state?.autoConnect || false;
  
  // Call states
  const [isPrivate, setIsPrivate] = useState(initialPrivacy === 'private');
  const [isVideoOff, setIsVideoOff] = useState(callType === 'audio');
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [isConnecting, setIsConnecting] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  
  // UI states
  const [showAddParticipants, setShowAddParticipants] = useState(false);
  const [showPrivacyOptions, setShowPrivacyOptions] = useState(false);
  const [participants, setParticipants] = useState<Participant[]>([]);
  
  // Get target user info from location state
  const targetUser = location.state?.targetUser;
  
  const {
    join,
    leave,
    toggleMute,
    toggleVideo,
    isJoined,
    localAudioTrack,
    localVideoTrack,
    isMuted,
    isVideoEnabled
  } = useAgoraCall(true); // Enable client when call screen is active

  // Initialize call with improved connection handling
  useEffect(() => {
    const initCall = async () => {
      if (!channel) return;
      
      try {
        setIsConnecting(true);
        
        // Show connecting UI immediately for better perceived performance
        if (autoConnect) {
          setIsConnected(true);
        }
        
        // Get RTC token
        const rtcData = await getRtc();
        
        // Join the call
        await join({
          appId: rtcData.appId,
          channel: channel,
          token: rtcData.token,
          uid: parseInt(rtcData.uid)
        });
        
        setIsConnecting(false);
        setIsConnected(true);
        
        // Auto-hide controls after 3 seconds for video calls
        if (callType === 'video') {
          setTimeout(() => setShowControls(false), 3000);
        }
      } catch (error) {
        console.error('Failed to join call:', error);
        navigate('/reels');
      }
    };

    initCall();
  }, [channel, join, navigate, autoConnect, callType]);

  // Track call duration
  useEffect(() => {
    if (!isConnected) return;
    
    const interval = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [isConnected]);

  // Auto-hide controls for video calls
  useEffect(() => {
    if (callType !== 'video') return;
    
    let timeout: NodeJS.Timeout;
    
    const resetTimeout = () => {
      clearTimeout(timeout);
      setShowControls(true);
      timeout = setTimeout(() => setShowControls(false), 3000);
    };
    
    const handleInteraction = () => resetTimeout();
    
    // Add event listeners
    window.addEventListener('click', handleInteraction);
    window.addEventListener('touch', handleInteraction);
    
    return () => {
      clearTimeout(timeout);
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('touch', handleInteraction);
    };
  }, [callType]);

  const handleEndCall = async () => {
    try {
      await leave();
      if (channel && callDuration > 0) {
        await endCall({
          channel,
          minutes: Math.ceil(callDuration / 60),
          tier: user?.plan === 'free' ? 'free' : 'premium'
        });
      }
      navigate('/reels');
    } catch (error) {
      console.error('Failed to end call:', error);
      navigate('/reels');
    }
  };

  const handleToggleMute = async () => {
    await toggleMute();
  };

  const handleToggleVideo = async () => {
    if (callType === 'video') {
      await toggleVideo();
      setIsVideoOff(!isVideoEnabled);
    }
  };

  const handleToggleSpeaker = () => {
    setIsSpeakerOn(!isSpeakerOn);
    // TODO: Implement actual speaker toggle logic
  };

  const handleTogglePrivacy = () => {
    setIsPrivate(!isPrivate);
    setShowPrivacyOptions(false);
    // TODO: Implement actual privacy toggle logic
  };

  const handleAddParticipants = () => {
    setShowAddParticipants(true);
  };

  const handleRemoveParticipant = (participantId: string) => {
    setParticipants(prev => prev.filter(p => p.id !== participantId));
    // TODO: Implement actual participant removal logic
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Connecting screen with WhatsApp-style animation
  if (isConnecting && !isConnected) {
    return (
      <div className={cn("h-screen bg-gradient-to-br from-gray-900 to-black flex flex-col items-center justify-center", className)}>
        <div className="text-center">
          {/* User avatar with pulsing animation */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative mb-8"
          >
            <div className="w-32 h-32 rounded-full overflow-hidden mx-auto border-4 border-white/20">
              <img
                src={targetUser?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'}
                alt={targetUser?.displayName || 'User'}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Pulsing rings */}
            <div className="absolute inset-0 rounded-full border-2 border-green-400 animate-ping" />
            <div className="absolute inset-2 rounded-full border-2 border-green-400 animate-ping" style={{ animationDelay: '0.5s' }} />
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-medium text-white mb-2"
          >
            Calling {targetUser?.displayName || 'User'}...
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-white/60 text-lg"
          >
            {callType === 'video' ? 'Video' : 'Audio'} call
          </motion.p>
        </div>
        
        {/* End call button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7 }}
          onClick={handleEndCall}
          className="absolute bottom-20 bg-red-500 hover:bg-red-600 w-16 h-16 rounded-full flex items-center justify-center transition-colors"
        >
          <PhoneOff className="w-8 h-8 text-white" />
        </motion.button>
      </div>
    );
  }

  return (
    <div className={cn("h-screen bg-black flex flex-col relative overflow-hidden", className)}>
      {/* Video area or audio background */}
      <div className="flex-1 relative">
        {callType === 'video' ? (
          // Video call UI
          <div className="w-full h-full relative">
            {/* Remote video container */}
            <div className="w-full h-full bg-gray-900 flex items-center justify-center">
              {targetUser ? (
                <div className="text-center">
                  <img
                    src={targetUser.avatar}
                    alt={targetUser.displayName}
                    className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-white/20"
                  />
                  <h3 className="text-white text-xl font-medium">{targetUser.displayName}</h3>
                  <p className="text-white/60">Connected</p>
                </div>
              ) : (
                <div className="text-white">No video</div>
              )}
            </div>
            
            {/* Local video preview (Picture-in-Picture) */}
            <div className="absolute top-4 right-4 w-24 h-32 bg-gray-800 rounded-lg overflow-hidden border-2 border-white/20">
              <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                {user && (
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'}
                    alt="You"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            </div>
          </div>
        ) : (
          // Audio call UI
          <div className="w-full h-full bg-gradient-to-br from-green-600 via-green-700 to-green-800 flex flex-col items-center justify-center">
            <div className="text-center">
              <div className="w-40 h-40 rounded-full overflow-hidden mx-auto mb-6 border-4 border-white/30 shadow-2xl">
                <img
                  src={targetUser?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'}
                  alt={targetUser?.displayName || 'User'}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <h2 className="text-3xl font-light text-white mb-2">
                {targetUser?.displayName || 'User'}
              </h2>
              
              <p className="text-white/80 text-lg mb-4">
                @{targetUser?.username || 'username'}
              </p>
              
              {/* Call status indicators */}
              <div className="flex items-center justify-center space-x-4 text-white/60">
                {isMuted && (
                  <div className="flex items-center space-x-1">
                    <MicOff className="w-4 h-4" />
                    <span className="text-sm">Muted</span>
                  </div>
                )}
                {!isSpeakerOn && (
                  <div className="flex items-center space-x-1">
                    <VolumeX className="w-4 h-4" />
                    <span className="text-sm">Speaker Off</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Controls overlay */}
      <AnimatePresence>
        {(showControls || callType === 'audio') && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-0 left-0 right-0"
          >
            {/* Top status bar */}
            <div className="flex items-center justify-between p-4 bg-black/70 backdrop-blur-md">
              <button 
                onClick={() => navigate('/reels')}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-white" />
              </button>
              
              <div className="flex items-center space-x-3">
                {/* Call duration */}
                <div className="text-white font-mono text-lg">
                  {formatDuration(callDuration)}
                </div>
                
                {/* Privacy toggle */}
                <button
                  onClick={() => setShowPrivacyOptions(!showPrivacyOptions)}
                  className={cn(
                    "flex items-center space-x-2 px-3 py-1.5 rounded-full transition-colors",
                    isPrivate ? "bg-green-500/20 text-green-400" : "bg-orange-500/20 text-orange-400"
                  )}
                >
                  {isPrivate ? <Lock className="w-4 h-4" /> : <Globe className="w-4 h-4" />}
                  <span className="text-sm font-medium">
                    {isPrivate ? 'Private' : 'Public'}
                  </span>
                </button>
                
                {/* Participants count */}
                {participants.length > 0 && (
                  <div className="flex items-center space-x-1 px-3 py-1.5 bg-blue-500/20 text-blue-400 rounded-full">
                    <Users className="w-4 h-4" />
                    <span className="text-sm font-medium">{participants.length + 2}</span>
                  </div>
                )}
              </div>
              
              <button
                onClick={() => setShowAddParticipants(true)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <MoreVertical className="w-6 h-6 text-white" />
              </button>
            </div>

            {/* Main controls */}
            <div className="bg-black/80 backdrop-blur-md p-6">
              <div className="flex items-center justify-center space-x-6">
                {/* Mute toggle */}
                <button
                  onClick={handleToggleMute}
                  className={cn(
                    "w-14 h-14 rounded-full flex items-center justify-center transition-all",
                    isMuted ? "bg-red-500 hover:bg-red-600" : "bg-white/20 hover:bg-white/30"
                  )}
                >
                  {isMuted ? (
                    <MicOff className="w-6 h-6 text-white" />
                  ) : (
                    <Mic className="w-6 h-6 text-white" />
                  )}
                </button>

                {/* Video toggle (for video calls) */}
                {callType === 'video' && (
                  <button
                    onClick={handleToggleVideo}
                    className={cn(
                      "w-14 h-14 rounded-full flex items-center justify-center transition-all",
                      isVideoOff ? "bg-red-500 hover:bg-red-600" : "bg-white/20 hover:bg-white/30"
                    )}
                  >
                    {isVideoOff ? (
                      <VideoOff className="w-6 h-6 text-white" />
                    ) : (
                      <Video className="w-6 h-6 text-white" />
                    )}
                  </button>
                )}

                {/* Speaker toggle (for audio calls) */}
                {callType === 'audio' && (
                  <button
                    onClick={handleToggleSpeaker}
                    className={cn(
                      "w-14 h-14 rounded-full flex items-center justify-center transition-all",
                      !isSpeakerOn ? "bg-gray-500 hover:bg-gray-600" : "bg-white/20 hover:bg-white/30"
                    )}
                  >
                    {isSpeakerOn ? (
                      <Volume2 className="w-6 h-6 text-white" />
                    ) : (
                      <VolumeX className="w-6 h-6 text-white" />
                    )}
                  </button>
                )}

                {/* Add participants */}
                <button
                  onClick={handleAddParticipants}
                  className="w-14 h-14 rounded-full bg-blue-500/20 hover:bg-blue-500/30 flex items-center justify-center transition-all"
                >
                  <UserPlus className="w-6 h-6 text-blue-400" />
                </button>

                {/* End call */}
                <button
                  onClick={handleEndCall}
                  className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center transition-all"
                >
                  <PhoneOff className="w-8 h-8 text-white" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Privacy options modal */}
      <AnimatePresence>
        {showPrivacyOptions && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowPrivacyOptions(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900 rounded-2xl p-6 m-4 max-w-sm w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-white text-lg font-semibold mb-4">Call Privacy</h3>
              
              <div className="space-y-3">
                <button
                  onClick={() => {
                    setIsPrivate(true);
                    setShowPrivacyOptions(false);
                  }}
                  className={cn(
                    "w-full p-4 rounded-xl flex items-center space-x-3 transition-colors",
                    isPrivate ? "bg-green-500/20 border border-green-500/30" : "bg-white/10"
                  )}
                >
                  <Lock className="w-5 h-5 text-green-400" />
                  <div className="text-left">
                    <div className="text-white font-medium">Private</div>
                    <div className="text-white/60 text-sm">Only you and invited participants</div>
                  </div>
                </button>
                
                <button
                  onClick={() => {
                    setIsPrivate(false);
                    setShowPrivacyOptions(false);
                  }}
                  className={cn(
                    "w-full p-4 rounded-xl flex items-center space-x-3 transition-colors",
                    !isPrivate ? "bg-orange-500/20 border border-orange-500/30" : "bg-white/10"
                  )}
                >
                  <Globe className="w-5 h-5 text-orange-400" />
                  <div className="text-left">
                    <div className="text-white font-medium">Public</div>
                    <div className="text-white/60 text-sm">Anyone can join and watch</div>
                  </div>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add participants modal */}
      <AnimatePresence>
        {showAddParticipants && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowAddParticipants(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-gray-900 rounded-2xl p-6 m-4 max-w-md w-full max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-white text-lg font-semibold">Add to Call</h3>
                <button
                  onClick={() => setShowAddParticipants(false)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-white" />
                </button>
              </div>
              
              {/* Search input */}
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search contacts..."
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              {/* Participants list */}
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {/* Mock participants */}
                {[
                  { id: '1', name: 'John Doe', username: 'johndoe', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face' },
                  { id: '2', name: 'Jane Smith', username: 'janesmith', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b9d38aad?w=150&h=150&fit=crop&crop=face' },
                  { id: '3', name: 'Mike Johnson', username: 'mikej', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face' },
                ].map((contact) => (
                  <button
                    key={contact.id}
                    onClick={() => {
                      setParticipants(prev => [...prev, contact]);
                      setShowAddParticipants(false);
                    }}
                    className="w-full p-3 hover:bg-white/10 rounded-xl flex items-center space-x-3 transition-colors"
                  >
                    <img
                      src={contact.avatar}
                      alt={contact.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="text-left">
                      <div className="text-white font-medium">{contact.name}</div>
                      <div className="text-white/60 text-sm">@{contact.username}</div>
                    </div>
                  </button>
                ))}
              </div>
              
              {/* Current participants */}
              {participants.length > 0 && (
                <div className="mt-6 pt-4 border-t border-white/10">
                  <h4 className="text-white/80 text-sm font-medium mb-3">In Call ({participants.length + 2})</h4>
                  <div className="space-y-2">
                    {participants.map((participant) => (
                      <div key={participant.id} className="flex items-center justify-between p-2">
                        <div className="flex items-center space-x-3">
                          <img
                            src={participant.avatar}
                            alt={participant.name}
                            className="w-8 h-8 rounded-full"
                          />
                          <span className="text-white text-sm">{participant.name}</span>
                        </div>
                        <button
                          onClick={() => handleRemoveParticipant(participant.id)}
                          className="p-1 hover:bg-red-500/20 rounded-full transition-colors"
                        >
                          <UserX className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
