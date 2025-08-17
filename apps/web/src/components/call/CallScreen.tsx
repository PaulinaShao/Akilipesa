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
  VolumeX
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getRtc, endCall } from '@/lib/api';
import { useAgoraCall } from '@/hooks/useAgoraCall';

interface CallScreenProps {
  className?: string;
}

export default function CallScreen({ className }: CallScreenProps) {
  const navigate = useNavigate();
  const { channel } = useParams();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  
  const callType = searchParams.get('type') as 'audio' | 'video' || 'audio';
  const targetId = searchParams.get('target');
  const initialPrivacy = searchParams.get('privacy') || 'private';
  
  const [isPrivate, setIsPrivate] = useState(initialPrivacy === 'private');
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [showAddParticipants, setShowAddParticipants] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  
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
  } = useAgoraCall();

  // Initialize call
  useEffect(() => {
    const initCall = async () => {
      if (!channel) return;
      
      try {
        setIsConnecting(true);
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
      } catch (error) {
        console.error('Failed to join call:', error);
        navigate('/reels');
      }
    };

    initCall();
  }, [channel, join, navigate]);

  // Track call duration
  useEffect(() => {
    if (!isJoined) return;
    
    const interval = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [isJoined]);

  const handleEndCall = async () => {
    try {
      await leave();
      if (channel && callDuration > 0) {
        await endCall({
          channel,
          minutes: Math.ceil(callDuration / 60),
          tier: 'free'
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
    setIsMuted(!isMuted);
  };

  const handleToggleVideo = async () => {
    if (callType === 'video') {
      await toggleVideo();
      setIsVideoOff(!isVideoOff);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleMakePublic = () => {
    setIsPrivate(false);
    // TODO: Implement making call public
    console.log('Making call public');
  };

  const handleAddParticipants = () => {
    setShowAddParticipants(true);
    // TODO: Implement add participants modal
    console.log('Add participants');
  };

  if (isConnecting) {
    return (
      <div className={cn("h-screen bg-black flex flex-col items-center justify-center", className)}>
        <div className="text-center">
          <div className="w-32 h-32 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            {callType === 'video' ? (
              <Video className="w-16 h-16 text-white" />
            ) : (
              <Mic className="w-16 h-16 text-white" />
            )}
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Connecting...
          </h2>
          <p className="text-white/60">
            Starting your {callType} call
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("h-screen bg-black flex flex-col relative", className)}>
      {/* Top bar */}
      <div className="flex items-center justify-between p-4 bg-black/50 backdrop-blur-sm z-10">
        <button 
          onClick={() => navigate('/reels')}
          className="p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        
        <div className="flex items-center space-x-3">
          {/* Call type pill */}
          <div className="px-3 py-1 bg-white/20 rounded-full">
            <span className="text-white text-sm font-medium capitalize">{callType} Call</span>
          </div>
          
          {/* Privacy indicator */}
          <div className={cn(
            "flex items-center space-x-1 px-3 py-1 rounded-full",
            isPrivate ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
          )}>
            {isPrivate ? <Lock className="w-4 h-4" /> : <Globe className="w-4 h-4" />}
            <span className="text-sm font-medium">
              {isPrivate ? 'Private' : 'Public'}
            </span>
          </div>
        </div>
        
        {/* Duration */}
        <div className="text-white text-sm font-mono">
          {formatDuration(callDuration)}
        </div>
      </div>

      {/* Video area or avatar */}
      <div className="flex-1 relative">
        {callType === 'video' && !isVideoOff ? (
          <div className="w-full h-full bg-gray-900 flex items-center justify-center">
            {/* Local video would go here */}
            <div className="text-white text-center">
              <Video className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="opacity-50">Video preview</p>
            </div>
          </div>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-indigo-900 to-purple-900 flex items-center justify-center">
            {targetUser ? (
              <div className="text-center">
                <img
                  src={targetUser.avatar}
                  alt={targetUser.displayName}
                  className="w-40 h-40 rounded-full mx-auto mb-6 border-4 border-white/20"
                />
                <h2 className="text-2xl font-bold text-white mb-2">
                  {targetUser.displayName}
                </h2>
                <p className="text-white/60">@{targetUser.username}</p>
              </div>
            ) : (
              <div className="text-center">
                <div className="w-40 h-40 bg-white/20 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <Mic className="w-20 h-20 text-white/50" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Audio Call</h2>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom controls */}
      <div className="p-6 bg-black/50 backdrop-blur-sm">
        <div className="flex items-center justify-center space-x-6">
          {/* Mute */}
          <button
            onClick={handleToggleMute}
            className={cn(
              "w-16 h-16 rounded-full flex items-center justify-center transition-all",
              isMuted ? "bg-red-500 hover:bg-red-600" : "bg-white/20 hover:bg-white/30"
            )}
          >
            {isMuted ? <MicOff className="w-7 h-7 text-white" /> : <Mic className="w-7 h-7 text-white" />}
          </button>

          {/* Video toggle (only for video calls) */}
          {callType === 'video' && (
            <button
              onClick={handleToggleVideo}
              className={cn(
                "w-16 h-16 rounded-full flex items-center justify-center transition-all",
                isVideoOff ? "bg-red-500 hover:bg-red-600" : "bg-white/20 hover:bg-white/30"
              )}
            >
              {isVideoOff ? <VideoOff className="w-7 h-7 text-white" /> : <Video className="w-7 h-7 text-white" />}
            </button>
          )}

          {/* Speaker */}
          <button
            onClick={() => setIsSpeakerOn(!isSpeakerOn)}
            className={cn(
              "w-16 h-16 rounded-full flex items-center justify-center transition-all",
              isSpeakerOn ? "bg-blue-500 hover:bg-blue-600" : "bg-white/20 hover:bg-white/30"
            )}
          >
            {isSpeakerOn ? <Volume2 className="w-7 h-7 text-white" /> : <VolumeX className="w-7 h-7 text-white" />}
          </button>

          {/* End call */}
          <button
            onClick={handleEndCall}
            className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center transition-all"
          >
            <PhoneOff className="w-7 h-7 text-white" />
          </button>

          {/* Add participants */}
          <button
            onClick={handleAddParticipants}
            className="w-16 h-16 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all"
          >
            <UserPlus className="w-7 h-7 text-white" />
          </button>

          {/* Make public (only if private) */}
          {isPrivate && (
            <button
              onClick={handleMakePublic}
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 rounded-full flex items-center space-x-2 transition-all"
            >
              <Globe className="w-5 h-5 text-white" />
              <span className="text-white text-sm font-medium">Make Public</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
