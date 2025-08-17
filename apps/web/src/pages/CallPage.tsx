import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation, useParams } from 'react-router-dom';
import {
  Mic, Video, AlertTriangle
} from 'lucide-react';
// import { cn } from '@/lib/utils';
import { useAppStore } from '@/store';
import { callService } from '@/lib/callService';
// import IncomingCallScreen from '@/components/call/IncomingCallScreen';
import OutgoingCallScreen from '@/components/call/OutgoingCallScreen';
import ActiveCallScreen from '@/components/call/ActiveCallScreen';

export default function CallPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  // const videoRef = useRef<HTMLVideoElement>(null);

  const { activeCall, endCall, user, startCall } = useAppStore();

  const callType = searchParams.get('type') as 'audio' | 'video' || 'audio';
  const targetId = searchParams.get('target');
  const channel = useParams().channel;

  // const [isPrivate, setIsPrivate] = useState(true);
  const [showLowCreditsWarning, setShowLowCreditsWarning] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);

  const [localAudioEnabled, setLocalAudioEnabled] = useState(true);
  const [localVideoEnabled, setLocalVideoEnabled] = useState(callType === 'video');
  const [cameraFacing, setCameraFacing] = useState<'user' | 'environment'>('user');
  const [isMinimized, setIsMinimized] = useState(false);
  // const [callScreenType] = useState<'outgoing' | 'incoming' | 'active'>('outgoing');

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
            await startCall({
              type: callData.type || callType,
              targetId: callData.targetUser.id
            });
            // setIsPrivate(callData.privacy === 'private');
          } else if (targetId) {
            // Fallback: create minimal call state from URL params
            await startCall({
              type: callType,
              targetId: targetId
            });
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

  // Show loading state while initializing
  if (isInitializing || (!activeCall && channel)) {
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
            Initializing Call...
          </h2>
          <p className="text-white/60 mb-8">
            Setting up your {callType} call
          </p>
        </div>
      </div>
    );
  }

  if (!activeCall) {
    return null; // Will redirect due to useEffect above
  }

  // const formatDuration = (seconds: number) => {
  //   const mins = Math.floor(seconds / 60);
  //   const secs = seconds % 60;
  //   return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  // };

  // const togglePrivacy = () => {
  //   setIsPrivate(!isPrivate);
  // };

  // const addAkiliAgent = () => {
  //   // TODO: Implement adding AI agent to call
  //   console.log('Add AkiliPesa Assistant to call');
  // };

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

  // Determine the target user for the call
  const targetUser = {
    id: targetId || 'unknown',
    name: targetId === 'akili' ? 'AkiliPesa AI' : 'Creator',
    avatar: targetId === 'akili'
      ? 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=300&h=300&fit=crop&crop=face'
      : 'https://images.unsplash.com/photo-1494790108755-2616b9d38aad?w=300&h=300&fit=crop&crop=face',
    username: targetId === 'akili' ? 'akilipesa' : 'creator'
  };

  const currentUserData = {
    id: user?.id || 'current',
    name: user?.name || 'You',
    avatar: user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    username: user?.username || 'you',
    isMuted: !localAudioEnabled,
    hasVideo: localVideoEnabled
  };

  const participants = activeCall?.participants?.map(p => ({
    id: String(p.uid),
    name: p.uid === targetId ? targetUser.name : 'Participant',
    avatar: p.uid === targetId ? targetUser.avatar : 'https://images.unsplash.com/photo-1494790108755-2616b9d38aad?w=300&h=300&fit=crop&crop=face',
    username: p.uid === targetId ? targetUser.username : 'participant',
    isMuted: false,
    hasVideo: true
  })) || [];

  // Handle different call states with WhatsApp-style screens
  if (activeCall?.status === 'connecting') {
    return (
      <OutgoingCallScreen
        callee={targetUser}
        callType={callType}
        onEndCall={handleEndCall}
        onMessage={() => navigate('/chat/ai')}
        onToggleMute={toggleMute}
        isMuted={!localAudioEnabled}
      />
    );
  }

  // if (activeCall?.status === 'ringing') {
  //   // For demo purposes, we'll show outgoing. In real app, you'd determine if incoming/outgoing
  //   return (
  //     <OutgoingCallScreen
  //       callee={targetUser}
  //       callType={callType}
  //       onEndCall={handleEndCall}
  //       onMessage={() => navigate('/chat/ai')}
  //       onToggleMute={toggleMute}
  //       isMuted={!localAudioEnabled}
  //     />
  //   );
  // }

  // Active call with WhatsApp-style interface
  return (
    <>
      {/* Low Credits Warning */}
      {showLowCreditsWarning && (
        <div className="fixed top-20 left-4 right-4 z-50 bg-gradient-to-r from-red-500/90 to-red-600/90 backdrop-blur-sm border border-red-400/50 rounded-lg p-3">
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

      <ActiveCallScreen
        participants={participants}
        currentUser={currentUserData}
        callType={activeCall.type as 'audio' | 'video'}
        callDuration={activeCall.metrics?.duration || 0}
        onEndCall={handleEndCall}
        onToggleMute={toggleMute}
        onToggleVideo={activeCall.type === 'video' ? toggleVideo : undefined}
        onSwitchCamera={activeCall.type === 'video' ? switchCamera : undefined}
        onAddParticipant={addGuest}
        onMessage={() => navigate('/chat/ai')}
        onMinimize={() => setIsMinimized(!isMinimized)}
        isMinimized={isMinimized}
      />
    </>
  );
}
