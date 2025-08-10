import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Mic, MicOff, Video, VideoOff, PhoneOff, RotateCcw, 
  UserPlus, Globe, Lock, Sparkles, Volume2, VolumeX 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface CallParticipant {
  id: string;
  name: string;
  avatar: string;
  isHost: boolean;
  audioEnabled: boolean;
  videoEnabled: boolean;
  isCurrentUser?: boolean;
}

interface CallState {
  isConnected: boolean;
  isPrivate: boolean;
  mode: 'audio' | 'video';
  duration: number;
  participants: CallParticipant[];
}

const mockParticipants: CallParticipant[] = [
  {
    id: 'current',
    name: 'You',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    isHost: true,
    audioEnabled: true,
    videoEnabled: true,
    isCurrentUser: true
  }
];

export default function CallPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const mode = searchParams.get('mode') as 'audio' | 'video' || 'audio';
  const target = searchParams.get('target');
  
  const [callState, setCallState] = useState<CallState>({
    isConnected: false,
    isPrivate: true,
    mode,
    duration: 0,
    participants: mockParticipants
  });
  
  const [localAudioEnabled, setLocalAudioEnabled] = useState(true);
  const [localVideoEnabled, setLocalVideoEnabled] = useState(mode === 'video');
  const [speakerEnabled, setSpeakerEnabled] = useState(false);
  const [cameraFacing, setCameraFacing] = useState<'user' | 'environment'>('user');

  useEffect(() => {
    // Simulate connection
    const timeout = setTimeout(() => {
      setCallState(prev => ({ ...prev, isConnected: true }));
    }, 2000);

    // Start call timer
    const interval = setInterval(() => {
      setCallState(prev => ({ 
        ...prev, 
        duration: prev.isConnected ? prev.duration + 1 : prev.duration 
      }));
    }, 1000);

    // Simulate video stream (in real app, this would be WebRTC)
    if (mode === 'video' && videoRef.current) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch(console.error);
    }

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [mode]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const togglePrivacy = () => {
    setCallState(prev => ({ ...prev, isPrivate: !prev.isPrivate }));
  };

  const addAkiliAgent = () => {
    const akiliAgent: CallParticipant = {
      id: 'akili',
      name: 'AkiliPesa Assistant',
      avatar: '',
      isHost: false,
      audioEnabled: true,
      videoEnabled: false
    };
    
    setCallState(prev => ({
      ...prev,
      participants: [...prev.participants, akiliAgent]
    }));
  };

  const endCall = () => {
    navigate('/reels');
  };

  const toggleMute = () => {
    setLocalAudioEnabled(!localAudioEnabled);
    setCallState(prev => ({
      ...prev,
      participants: prev.participants.map(p => 
        p.isCurrentUser ? { ...p, audioEnabled: !localAudioEnabled } : p
      )
    }));
  };

  const toggleVideo = () => {
    setLocalVideoEnabled(!localVideoEnabled);
    setCallState(prev => ({
      ...prev,
      participants: prev.participants.map(p => 
        p.isCurrentUser ? { ...p, videoEnabled: !localVideoEnabled } : p
      )
    }));
  };

  const switchCamera = () => {
    setCameraFacing(cameraFacing === 'user' ? 'environment' : 'user');
  };

  const addGuest = () => {
    // In real app, this would open a contact selector
    console.log('Add guest to call');
  };

  if (!callState.isConnected) {
    return (
      <div className="h-screen-safe bg-gradient-to-b from-bg-primary to-bg-secondary flex items-center justify-center">
        <div className="text-center">
          <div className="w-32 h-32 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            {mode === 'video' ? (
              <Video className="w-16 h-16 text-white" />
            ) : (
              <Mic className="w-16 h-16 text-white" />
            )}
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            {target === 'akili' ? 'Connecting to AkiliPesa...' : 'Connecting...'}
          </h2>
          <p className="text-white/60 mb-8">
            {mode === 'video' ? 'Starting video call' : 'Starting audio call'}
          </p>
          
          <button 
            onClick={endCall}
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
      {/* Video View (if video call) */}
      {callState.mode === 'video' && (
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

      {/* Audio View (if audio call) */}
      {callState.mode === 'audio' && (
        <div className="absolute inset-0 bg-gradient-to-b from-bg-primary to-bg-secondary flex items-center justify-center">
          <div className="text-center">
            <div className="w-40 h-40 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-6">
              {target === 'akili' ? (
                <Sparkles className="w-20 h-20 text-white" />
              ) : (
                <img 
                  src="https://images.unsplash.com/photo-1494790108755-2616b9d38aad?w=150&h=150&fit=crop&crop=face"
                  alt="Contact"
                  className="w-full h-full rounded-full object-cover"
                />
              )}
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {target === 'akili' ? 'AkiliPesa Assistant' : 'Amina Hassan'}
            </h2>
            <p className="text-white/60 text-lg">
              {formatDuration(callState.duration)}
            </p>
          </div>
        </div>
      )}

      {/* Call Header */}
      <div className="absolute top-0 left-0 right-0 safe-top p-4 bg-gradient-to-b from-black/50 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              {callState.isPrivate ? (
                <Lock className="w-5 h-5 text-white" />
              ) : (
                <Globe className="w-5 h-5 text-white" />
              )}
              <span className="text-white text-sm font-medium">
                {callState.isPrivate ? 'Private' : 'Public'}
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
              {formatDuration(callState.duration)}
            </p>
            <p className="text-white/60 text-xs">
              {callState.participants.length} participant{callState.participants.length !== 1 ? 's' : ''}
            </p>
          </div>
          
          <div className="w-20" /> {/* Spacer for balance */}
        </div>
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

          {/* Speaker Button (audio mode) */}
          {callState.mode === 'audio' && (
            <button
              onClick={() => setSpeakerEnabled(!speakerEnabled)}
              className={cn(
                'w-16 h-16 rounded-full flex items-center justify-center transition-all',
                speakerEnabled 
                  ? 'bg-primary hover:bg-primary/80' 
                  : 'bg-white/20 hover:bg-white/30'
              )}
            >
              {speakerEnabled ? (
                <Volume2 className="w-8 h-8 text-white" />
              ) : (
                <VolumeX className="w-8 h-8 text-white" />
              )}
            </button>
          )}

          {/* Video Toggle (video mode) */}
          {callState.mode === 'video' && (
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

          {/* Switch Camera (video mode) */}
          {callState.mode === 'video' && (
            <button
              onClick={switchCamera}
              className="w-16 h-16 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all"
            >
              <RotateCcw className="w-8 h-8 text-white" />
            </button>
          )}

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
            disabled={callState.participants.some(p => p.id === 'akili')}
          >
            <Sparkles className="w-8 h-8 text-white" />
          </button>

          {/* End Call */}
          <button
            onClick={endCall}
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
              callState.isPrivate
                ? 'bg-white/20 text-white hover:bg-white/30'
                : 'bg-primary text-white hover:bg-primary/80'
            )}
          >
            {callState.isPrivate ? 'Make Public' : 'Make Private'}
          </button>
          
          {!callState.participants.some(p => p.id === 'akili') && (
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
