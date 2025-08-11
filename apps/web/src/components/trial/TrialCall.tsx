import React, { useState, useEffect } from 'react';
import { Phone, PhoneOff, Video, VideoOff, Clock, AlertCircle } from 'lucide-react';
import { useTrialStore } from '../../state/trialStore';
import { useAppStore } from '../../store';
import { requestTrialCall, requestAuthenticatedCall, rtcEngine, formatDuration, RTCToken } from '../../lib/rtc';
import { useGatedCall } from '../../hooks/useAuthGate';

interface TrialCallProps {
  targetId: string;
  targetName: string;
  targetAvatar?: string;
  onCallEnd?: () => void;
  defaultVideo?: boolean;
}

export const TrialCall: React.FC<TrialCallProps> = ({
  targetId,
  targetName,
  targetAvatar,
  onCallEnd,
  defaultVideo = false,
}) => {
  const { user } = useAppStore();
  const { canUseFeature, getRemainingQuota } = useTrialStore();
  const [isConnecting, setIsConnecting] = useState(false);
  const [isInCall, setIsInCall] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [remainingTime, setRemainingTime] = useState<number>(Infinity);
  const [error, setError] = useState<string | null>(null);
  const [videoEnabled, setVideoEnabled] = useState(defaultVideo);
  const [audioEnabled, setAudioEnabled] = useState(true);

  const gatedCall = useGatedCall();

  // Update call duration and remaining time
  useEffect(() => {
    let interval: number;
    
    if (isInCall && rtcEngine.isActive()) {
      interval = setInterval(() => {
        setCallDuration(rtcEngine.getCallDuration());
        setRemainingTime(rtcEngine.getRemainingTime());
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isInCall]);

  const startCall = async () => {
    setError(null);
    setIsConnecting(true);

    try {
      let rtcToken: RTCToken;
      
      if (user) {
        // Authenticated user - unlimited calls
        rtcToken = await requestAuthenticatedCall(targetId, {
          video: videoEnabled,
          audio: audioEnabled,
        });
      } else {
        // Guest user - trial call
        rtcToken = await requestTrialCall(targetId, {
          video: videoEnabled,
          audio: audioEnabled,
          isTrialCall: true,
        });
      }

      await rtcEngine.join(rtcToken, () => {
        setIsInCall(false);
        onCallEnd?.();
      });

      setIsInCall(true);
      setRemainingTime(rtcToken.maxDuration);
    } catch (error: any) {
      console.error('Failed to start call:', error);
      setError(error.message || 'Failed to start call');
    } finally {
      setIsConnecting(false);
    }
  };

  const endCall = async () => {
    try {
      await rtcEngine.leave();
      setIsInCall(false);
      setCallDuration(0);
      setRemainingTime(Infinity);
      onCallEnd?.();
    } catch (error) {
      console.error('Failed to end call:', error);
    }
  };

  const handleCallAction = () => {
    if (isInCall) {
      endCall();
    } else {
      gatedCall(startCall);
    }
  };

  const toggleVideo = () => {
    setVideoEnabled(!videoEnabled);
    // In a real implementation, you'd update the RTC engine here
  };

  const toggleAudio = () => {
    setAudioEnabled(!audioEnabled);
    // In a real implementation, you'd update the RTC engine here
  };

  // Show quota info for guests
  const remainingCalls = user ? Infinity : getRemainingQuota('call');
  const canCall = user || canUseFeature('call');

  return (
    <div className="bg-zinc-900/90 backdrop-blur-sm border border-zinc-700 rounded-xl p-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-blue-500 rounded-full flex items-center justify-center overflow-hidden">
          {targetAvatar ? (
            <img src={targetAvatar} alt={targetName} className="w-full h-full object-cover" />
          ) : (
            <span className="text-white font-semibold text-lg">
              {targetName.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        <div className="flex-1">
          <h3 className="text-white font-medium">{targetName}</h3>
          {!user && (
            <p className="text-xs text-zinc-400">
              {remainingCalls > 0 ? `${remainingCalls} trial calls left` : 'Trial quota exhausted'}
            </p>
          )}
        </div>
      </div>

      {/* Call Status */}
      {isInCall && (
        <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-green-400">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">In Call</span>
            </div>
            <div className="text-right">
              <div className="text-sm text-white font-mono">
                {formatDuration(callDuration)}
              </div>
              {remainingTime !== Infinity && (
                <div className="text-xs text-orange-400">
                  {formatDuration(remainingTime)} left
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <span className="text-sm text-red-400">{error}</span>
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center gap-3">
        {/* Video Toggle */}
        <button
          onClick={toggleVideo}
          disabled={isConnecting}
          className={`p-3 rounded-full transition-colors ${
            videoEnabled
              ? 'bg-violet-500 text-white'
              : 'bg-zinc-700 text-zinc-400 hover:bg-zinc-600'
          }`}
        >
          {videoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
        </button>

        {/* Audio Toggle */}
        <button
          onClick={toggleAudio}
          disabled={isConnecting}
          className={`p-3 rounded-full transition-colors ${
            audioEnabled
              ? 'bg-blue-500 text-white'
              : 'bg-zinc-700 text-zinc-400 hover:bg-zinc-600'
          }`}
        >
          {audioEnabled ? <Phone className="w-5 h-5" /> : <PhoneOff className="w-5 h-5" />}
        </button>

        {/* Call/End Button */}
        <button
          onClick={handleCallAction}
          disabled={isConnecting || (!user && !canCall)}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-full font-medium transition-all ${
            isInCall
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : isConnecting
              ? 'bg-zinc-600 text-zinc-400 cursor-not-allowed'
              : canCall
              ? 'bg-green-500 hover:bg-green-600 text-white'
              : 'bg-zinc-700 text-zinc-500 cursor-not-allowed'
          }`}
        >
          {isConnecting ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Connecting...
            </>
          ) : isInCall ? (
            <>
              <PhoneOff className="w-5 h-5" />
              End Call
            </>
          ) : (
            <>
              <Phone className="w-5 h-5" />
              {user ? 'Start Call' : 'Try Call'}
            </>
          )}
        </button>
      </div>

      {/* Trial Warning */}
      {!user && remainingTime !== Infinity && remainingTime < 30 && isInCall && (
        <div className="mt-3 p-2 bg-orange-500/10 border border-orange-500/20 rounded-lg">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-orange-400" />
            <span className="text-xs text-orange-400">
              Trial call ending in {remainingTime}s. Sign up for unlimited calls!
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
