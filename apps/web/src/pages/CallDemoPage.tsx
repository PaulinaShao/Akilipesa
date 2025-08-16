import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, Video, ArrowLeft } from 'lucide-react';
import IncomingCallScreen from '@/components/call/IncomingCallScreen';
import OutgoingCallScreen from '@/components/call/OutgoingCallScreen';
import ActiveCallScreen from '@/components/call/ActiveCallScreen';

type CallScreenType = 'menu' | 'incoming' | 'outgoing' | 'active';
type CallType = 'audio' | 'video';

export default function CallDemoPage() {
  const navigate = useNavigate();
  const [currentScreen, setCurrentScreen] = useState<CallScreenType>('menu');
  const [callType, setCallType] = useState<CallType>('video');
  const [callDuration, setCallDuration] = useState(45);
  const [isMuted, setIsMuted] = useState(false);
  const [hasVideo, setHasVideo] = useState(true);

  const mockCaller = {
    id: 'sarah-id',
    name: 'Sarah Johnson',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b9d38aad?w=300&h=300&fit=crop&crop=face',
    username: 'sarah_creates'
  };

  const mockCurrentUser = {
    id: 'current-user',
    name: 'You',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    username: 'you',
    isMuted,
    hasVideo
  };

  const mockParticipants = [
    {
      id: 'participant-1',
      name: 'Alex Kim',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face',
      username: 'alexkim',
      isMuted: false,
      hasVideo: true
    }
  ];

  const handleBackToMenu = () => {
    setCurrentScreen('menu');
  };

  if (currentScreen === 'incoming') {
    return (
      <IncomingCallScreen
        caller={mockCaller}
        callType={callType}
        onAccept={() => setCurrentScreen('active')}
        onDecline={handleBackToMenu}
        onMessage={() => {
          console.log('Navigate to message');
          handleBackToMenu();
        }}
      />
    );
  }

  if (currentScreen === 'outgoing') {
    return (
      <OutgoingCallScreen
        callee={mockCaller}
        callType={callType}
        onEndCall={handleBackToMenu}
        onMessage={() => console.log('Navigate to message')}
        onToggleMute={() => setIsMuted(!isMuted)}
        isMuted={isMuted}
      />
    );
  }

  if (currentScreen === 'active') {
    return (
      <ActiveCallScreen
        participants={mockParticipants}
        currentUser={mockCurrentUser}
        callType={callType}
        callDuration={callDuration}
        onEndCall={handleBackToMenu}
        onToggleMute={() => setIsMuted(!isMuted)}
        onToggleVideo={callType === 'video' ? () => setHasVideo(!hasVideo) : undefined}
        onSwitchCamera={() => console.log('Switch camera')}
        onAddParticipant={() => console.log('Add participant')}
        onMessage={() => console.log('Navigate to message')}
        onMinimize={() => console.log('Minimize call')}
      />
    );
  }

  // Demo Menu
  return (
    <div className="h-screen-safe bg-gradient-to-b from-[#0a0e1a] via-[#1a1235] to-[#0b0c14] p-6">
      {/* Header */}
      <div className="safe-top mb-8">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/reels')}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <h1 className="text-2xl font-bold text-white">Call Demo</h1>
        </div>
        <p className="text-white/70 text-lg">
          WhatsApp-style calling experience with Tanzania theme
        </p>
      </div>

      {/* Call Type Selector */}
      <div className="mb-8">
        <h2 className="text-white font-semibold mb-4">Call Type:</h2>
        <div className="flex gap-4">
          <button
            onClick={() => setCallType('audio')}
            className={`flex items-center gap-3 px-6 py-4 rounded-2xl border-2 transition-all ${
              callType === 'audio'
                ? 'border-primary bg-primary/15'
                : 'border-white/20 bg-white/5 hover:bg-white/10'
            }`}
          >
            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
              <Phone className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <div className="text-white font-medium">Audio Call</div>
              <div className="text-white/60 text-sm">Voice only</div>
            </div>
          </button>

          <button
            onClick={() => setCallType('video')}
            className={`flex items-center gap-3 px-6 py-4 rounded-2xl border-2 transition-all ${
              callType === 'video'
                ? 'border-primary bg-primary/15'
                : 'border-white/20 bg-white/5 hover:bg-white/10'
            }`}
          >
            <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
              <Video className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <div className="text-white font-medium">Video Call</div>
              <div className="text-white/60 text-sm">Face-to-face</div>
            </div>
          </button>
        </div>
      </div>

      {/* Demo Screens */}
      <div className="space-y-4">
        <h2 className="text-white font-semibold mb-4">Try Different Call States:</h2>
        
        <button
          onClick={() => setCurrentScreen('incoming')}
          className="w-full p-6 bg-white/10 hover:bg-white/15 rounded-2xl border border-white/20 transition-all text-left"
        >
          <h3 className="text-white font-semibold text-lg mb-2">Incoming Call Screen</h3>
          <p className="text-white/70">
            Full-screen incoming call with accept/decline actions
          </p>
        </button>

        <button
          onClick={() => setCurrentScreen('outgoing')}
          className="w-full p-6 bg-white/10 hover:bg-white/15 rounded-2xl border border-white/20 transition-all text-left"
        >
          <h3 className="text-white font-semibold text-lg mb-2">Outgoing Call Screen</h3>
          <p className="text-white/70">
            Shows connecting/ringing state while calling someone
          </p>
        </button>

        <button
          onClick={() => setCurrentScreen('active')}
          className="w-full p-6 bg-white/10 hover:bg-white/15 rounded-2xl border border-white/20 transition-all text-left"
        >
          <h3 className="text-white font-semibold text-lg mb-2">Active Call Screen</h3>
          <p className="text-white/70">
            Full call interface with controls and participants
          </p>
        </button>
      </div>

      {/* Info */}
      <div className="mt-8 p-4 bg-primary/10 border border-primary/20 rounded-xl">
        <p className="text-primary text-sm">
          <strong>Features:</strong> WhatsApp-style UI, Tanzania theme colors, smooth animations, 
          minimizable calls, and proper call state management.
        </p>
      </div>
    </div>
  );
}
