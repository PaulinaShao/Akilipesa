import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Mic, MicOff, Video, VideoOff, PhoneOff, RotateCcw,
  UserPlus, Globe, Lock, Sparkles, Coins, AlertTriangle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store';
import { callService } from '@/lib/callService';

export default function CallPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const videoRef = useRef<HTMLVideoElement>(null);

  const { activeCall, endCall, user, startCall } = useAppStore();

  const callType = searchParams.get('type') as 'audio' | 'video' || 'audio';
  const targetId = searchParams.get('target');
  const channel = useParams().channel;

  const [isPrivate, setIsPrivate] = useState(true);
  const [showLowCreditsWarning, setShowLowCreditsWarning] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);

  const [localAudioEnabled, setLocalAudioEnabled] = useState(true);
  const [localVideoEnabled, setLocalVideoEnabled] = useState(callType === 'video');
  const [cameraFacing, setCameraFacing] = useState<'user' | 'environment'>('user');

  // Initialize call if no active call but we have channel info
  useEffect(() => {
    const initializeCall = async () => {
      if (!activeCall && channel) {
        setIsInitializing(true);

        try {
          // Get call data from location state (passed from CallOptions)
          const callData = location.state as any;

          if (callData?.targetUser) {
            // Initialize call state using the store
            await startCall(callData.targetUser.id, callData.type || callType, callData.privacy || 'private');
            setIsPrivate(callData.privacy === 'private');
          } else if (targetId) {
            // Fallback: create minimal call state from URL params
            await startCall(targetId, callType, 'private');
          } else {
            // No call data available, redirect
            console.warn('No call data available, redirecting to reels');
            navigate('/reels');
            return;
          }
        } catch (error) {
          console.error('Failed to initialize call:', error);
          navigate('/reels');
          return;
        } finally {
          setIsInitializing(false);
        }
      } else if (!activeCall && !channel) {
        // No active call and no channel, redirect
        navigate('/reels');
      }
    };

    initializeCall();
  }, [activeCall, channel, targetId, callType, location.state, navigate, startCall]);

  // Monitor credits and show warning
  useEffect(() => {
    if (activeCall?.metrics) {
      const { remainingCredits, creditsPerSecond } = activeCall.metrics;
      const warningThreshold = creditsPerSecond * 30; // 30 seconds warning

      if (remainingCredits <= warningThreshold && remainingCredits > 0) {
        setShowLowCreditsWarning(true);
      } else {
        setShowLowCreditsWarning(false);
      }
    }
  }, [activeCall?.metrics]);

  // Clean up when component unmounts
  useEffect(() => {
    return () => {
      if (activeCall) {
        endCall();
      }
    };
  }, []);

  if (!activeCall) {
    return null; // Will redirect due to useEffect above
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const togglePrivacy = () => {
    setIsPrivate(!isPrivate);
  };

  const addAkiliAgent = () => {
    // TODO: Implement adding AI agent to call
    console.log('Add AkiliPesa Assistant to call');
  };

  const handleEndCall = async () => {
    try {
      await endCall();
      navigate('/reels');
    } catch (error) {
      console.error('Failed to end call:', error);
      navigate('/reels');
    }
  };

  const toggleMute = async () => {
    try {
      const isMuted = await callService.toggleMute();
      setLocalAudioEnabled(!isMuted);
    } catch (error) {
      console.error('Failed to toggle mute:', error);
    }
  };

  const toggleVideo = async () => {
    try {
      const isVideoOff = await callService.toggleVideo();
      setLocalVideoEnabled(!isVideoOff);
    } catch (error) {
      console.error('Failed to toggle video:', error);
    }
  };

  const switchCamera = () => {
    setCameraFacing(cameraFacing === 'user' ? 'environment' : 'user');
    // TODO: Implement camera switching with Agora
  };

  const addGuest = () => {
    // TODO: Implement adding guest to call
    console.log('Add guest to call');
  };

  // Show connecting state
  if (activeCall.status === 'connecting') {
    return (
      <div className="h-screen-safe bg-gradient-to-b from-bg-primary to-bg-secondary flex items-center justify-center">
        <div className="text-center">
          <div className="w-32 h-32 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            {callType === 'video' ? (
              <Video className="w-16 h-16 text-white" />
            ) : (
              <Mic className="w-16 h-16 text-white" />
            )}
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            {targetId === 'akili' ? 'Connecting to AkiliPesa...' : 'Connecting...'}
          </h2>
          <p className="text-white/60 mb-8">
            {callType === 'video' ? 'Starting video call' : 'Starting audio call'}
          </p>

          <button
            onClick={handleEndCall}
            className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
          >
            <PhoneOff className="w-8 h-8 text-white" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen-safe bg-black relative overflow-hidden">
      {/* Low Credits Warning */}
      {showLowCreditsWarning && (
        <div className="absolute top-20 left-4 right-4 z-50 bg-gradient-to-r from-red-500/90 to-red-600/90 backdrop-blur-sm border border-red-400/50 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-white flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium text-sm">Low Credits Warning</p>
              <p className="text-white/90 text-xs">
                {activeCall.metrics && `${activeCall.metrics.remainingCredits} credits remaining (${Math.floor(activeCall.metrics.remainingCredits / activeCall.metrics.creditsPerSecond)}s)`}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Video View (if video call) */}
      {activeCall.type === 'video' && (
        <div className="absolute inset-0">
          <video
            ref={videoRef}
            autoPlay
            muted
            className="w-full h-full object-cover"
          />

          {/* Self video preview */}
          <div className="absolute top-4 right-4 w-32 h-48 bg-gray-800 rounded-xl overflow-hidden border-2 border-white/20">
            <video
              autoPlay
              muted
              className="w-full h-full object-cover transform scale-x-[-1]"
            />
          </div>
        </div>
      )}

      {/* Audio View (if audio call) - Show profile pictures */}
      {activeCall.type === 'audio' && (
        <div className="absolute inset-0">
          {/* Remote participant profile picture (main area) */}
          <div className="w-full h-full bg-black flex items-center justify-center">
            {targetId === 'akili' ? (
              <div className="w-48 h-48 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                <Sparkles className="w-24 h-24 text-white" />
              </div>
            ) : (
              <img
                src="https://images.unsplash.com/photo-1494790108755-2616b9d38aad?w=300&h=300&fit=crop&crop=face"
                alt="Contact"
                className="w-48 h-48 rounded-full object-cover border-4 border-white/20"
              />
            )}
          </div>

          {/* Self profile picture (corner preview) */}
          <div className="absolute top-4 right-4 w-32 h-40 bg-gray-800 rounded-xl overflow-hidden border-2 border-white/20 flex items-center justify-center">
            <img
              src={user?.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"}
              alt="You"
              className="w-20 h-20 rounded-full object-cover"
            />
          </div>
        </div>
      )}

      {/* Call Header */}
      <div className="absolute top-0 left-0 right-0 safe-top p-4 bg-gradient-to-b from-black/50 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              {isPrivate ? (
                <Lock className="w-5 h-5 text-white" />
              ) : (
                <Globe className="w-5 h-5 text-white" />
              )}
              <span className="text-white text-sm font-medium">
                {isPrivate ? 'Private' : 'Public'}
              </span>
            </div>
            <button
              onClick={togglePrivacy}
              className="px-3 py-1 bg-white/20 rounded-full text-white text-xs hover:bg-white/30 transition-colors"
            >
              Switch
            </button>
          </div>

          <div className="text-center">
            <p className="text-white font-medium">
              {activeCall.metrics ? formatDuration(activeCall.metrics.duration) : '00:00'}
            </p>
            <p className="text-white/60 text-xs">
              {activeCall.participants.length} participant{activeCall.participants.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Credits Meter */}
          <div className="flex items-center space-x-2">
            <div className="bg-black/40 backdrop-blur-sm border border-white/20 rounded-lg px-3 py-1.5">
              <div className="flex items-center space-x-2">
                <Coins className="w-4 h-4 text-yellow-400" />
                <div className="text-right">
                  <p className="text-white text-xs font-medium">
                    {activeCall.metrics ? activeCall.metrics.remainingCredits.toLocaleString() : user?.balance?.toLocaleString() || '0'}
                  </p>
                  <p className="text-white/60 text-xs">
                    credits
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Credits Usage Bar */}
        {activeCall.metrics && (
          <div className="mt-3 bg-black/40 backdrop-blur-sm border border-white/20 rounded-lg p-2">
            <div className="flex items-center justify-between text-xs text-white/80 mb-1">
              <span>Credits Used: {activeCall.metrics.creditsUsed}</span>
              <span>{activeCall.metrics.creditsPerSecond}/sec</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-1.5">
              <div
                className="bg-gradient-to-r from-green-400 to-yellow-400 h-1.5 rounded-full transition-all duration-1000"
                style={{
                  width: `${Math.min(100, (activeCall.metrics.creditsUsed / (activeCall.metrics.creditsUsed + activeCall.metrics.remainingCredits)) * 100)}%`
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Control Panel */}
      <div className="absolute bottom-0 left-0 right-0 safe-bottom p-6 bg-gradient-to-t from-black/80 to-transparent">
        <div className="flex items-center justify-center space-x-4">
          {/* Mute Button */}
          <button
            onClick={toggleMute}
            className={cn(
              'w-16 h-16 rounded-full flex items-center justify-center transition-all',
              localAudioEnabled 
                ? 'bg-white/20 hover:bg-white/30' 
                : 'bg-red-500 hover:bg-red-600'
            )}
          >
            {localAudioEnabled ? (
              <Mic className="w-8 h-8 text-white" />
            ) : (
              <MicOff className="w-8 h-8 text-white" />
            )}
          </button>

          {/* Video Button (disabled in audio mode) */}
          <button
            className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center transition-all opacity-50 cursor-not-allowed"
            disabled
          >
            <VideoOff className="w-8 h-8 text-white" />
          </button>

          {/* Video Toggle (video mode only) */}
          {activeCall.type === 'video' && (
            <button
              onClick={toggleVideo}
              className={cn(
                'w-16 h-16 rounded-full flex items-center justify-center transition-all',
                localVideoEnabled
                  ? 'bg-white/20 hover:bg-white/30'
                  : 'bg-red-500 hover:bg-red-600'
              )}
            >
              {localVideoEnabled ? (
                <Video className="w-8 h-8 text-white" />
              ) : (
                <VideoOff className="w-8 h-8 text-white" />
              )}
            </button>
          )}

          {/* Switch Camera (for both audio and video calls) */}
          <button
            onClick={switchCamera}
            className="w-16 h-16 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all"
          >
            <RotateCcw className="w-8 h-8 text-white" />
          </button>

          {/* Add Guest */}
          <button
            onClick={addGuest}
            className="w-16 h-16 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all"
          >
            <UserPlus className="w-8 h-8 text-white" />
          </button>

          {/* Add Akili Agent */}
          <button
            onClick={addAkiliAgent}
            className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary hover:from-primary/80 hover:to-secondary/80 flex items-center justify-center transition-all"
            disabled={activeCall.participants.some(p => p.uid === 'akili')}
          >
            <Sparkles className="w-8 h-8 text-white" />
          </button>

          {/* End Call */}
          <button
            onClick={handleEndCall}
            className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center transition-all"
          >
            <PhoneOff className="w-8 h-8 text-white" />
          </button>
        </div>

        {/* Additional Controls */}
        <div className="flex justify-center mt-4 space-x-2">
          <button
            onClick={togglePrivacy}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-medium transition-all',
              isPrivate
                ? 'bg-white/20 text-white hover:bg-white/30'
                : 'bg-primary text-white hover:bg-primary/80'
            )}
          >
            {isPrivate ? 'Make Public' : 'Make Private'}
          </button>

          {!activeCall.participants.some(p => p.uid === 'akili') && (
            <button
              onClick={addAkiliAgent}
              className="px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-primary to-secondary text-white hover:from-primary/80 hover:to-secondary/80 transition-all"
            >
              Add Akili Agent
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
