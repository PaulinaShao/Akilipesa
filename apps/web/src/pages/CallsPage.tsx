import { useState, useEffect, useRef } from 'react';
import { Phone, PhoneOff, Mic, MicOff, Video, VideoOff, Settings, Users } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/Card';
import { formatDuration } from '@/lib/utils';
import { useToast } from '@/hooks/useToast';

interface CallState {
  isConnected: boolean;
  isAudioEnabled: boolean;
  isVideoEnabled: boolean;
  duration: number;
  participantCount: number;
}

export default function CallsPage() {
  const [callState, setCallState] = useState<CallState>({
    isConnected: false,
    isAudioEnabled: true,
    isVideoEnabled: false,
    duration: 0,
    participantCount: 0,
  });
  const [isJoining, setIsJoining] = useState(false);
  const [channelName, setChannelName] = useState('financial-consultation');
  const localVideoRef = useRef<HTMLDivElement>(null);
  const remoteVideoRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();
  const { addToast } = useToast();

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const startCall = async () => {
    setIsJoining(true);
    
    try {
      // Simulate joining call with Agora
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setCallState(prev => ({
        ...prev,
        isConnected: true,
        participantCount: 2, // User + AI Assistant
      }));

      // Start duration counter
      intervalRef.current = setInterval(() => {
        setCallState(prev => ({
          ...prev,
          duration: prev.duration + 1,
        }));
      }, 1000);

      addToast({
        type: 'success',
        title: 'Call Connected',
        description: 'You are now connected with the AI assistant',
      });

    } catch (error) {
      addToast({
        type: 'error',
        title: 'Connection Failed',
        description: 'Unable to start the call. Please try again.',
      });
    } finally {
      setIsJoining(false);
    }
  };

  const endCall = () => {
    setCallState({
      isConnected: false,
      isAudioEnabled: true,
      isVideoEnabled: false,
      duration: 0,
      participantCount: 0,
    });

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    addToast({
      type: 'info',
      title: 'Call Ended',
      description: `Call duration: ${formatDuration(callState.duration)}`,
    });
  };

  const toggleAudio = () => {
    setCallState(prev => ({
      ...prev,
      isAudioEnabled: !prev.isAudioEnabled,
    }));
  };

  const toggleVideo = () => {
    setCallState(prev => ({
      ...prev,
      isVideoEnabled: !prev.isVideoEnabled,
    }));
  };

  return (
    <div className="container-responsive section-padding">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="heading-2 mb-4">AI Financial Consultation</h1>
          <p className="text-slate-600">
            Connect with our AI assistant for personalized financial advice and planning
          </p>
        </div>

        {!callState.isConnected ? (
          /* Pre-call Interface */
          <div className="space-y-8">
            {/* Channel Setup */}
            <Card variant="glow" className="max-w-md mx-auto">
              <CardHeader>
                <h3 className="heading-3 text-center mb-4">Start New Call</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Session Type
                    </label>
                    <select
                      value={channelName}
                      onChange={(e) => setChannelName(e.target.value)}
                      className="input"
                    >
                      <option value="financial-consultation">Financial Consultation</option>
                      <option value="budget-planning">Budget Planning</option>
                      <option value="investment-advice">Investment Advice</option>
                      <option value="debt-management">Debt Management</option>
                    </select>
                  </div>

                  <div className="flex items-center space-x-4">
                    <button
                      onClick={toggleAudio}
                      className={`p-3 rounded-full transition-colors ${
                        callState.isAudioEnabled 
                          ? 'bg-slate-100 text-slate-600' 
                          : 'bg-danger text-white'
                      }`}
                    >
                      {callState.isAudioEnabled ? (
                        <Mic className="w-5 h-5" />
                      ) : (
                        <MicOff className="w-5 h-5" />
                      )}
                    </button>
                    
                    <button
                      onClick={toggleVideo}
                      className={`p-3 rounded-full transition-colors ${
                        callState.isVideoEnabled 
                          ? 'bg-slate-100 text-slate-600' 
                          : 'bg-danger text-white'
                      }`}
                    >
                      {callState.isVideoEnabled ? (
                        <Video className="w-5 h-5" />
                      ) : (
                        <VideoOff className="w-5 h-5" />
                      )}
                    </button>
                  </div>

                  <button
                    onClick={startCall}
                    disabled={isJoining}
                    className="w-full btn-primary py-4"
                  >
                    {isJoining ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                        <span>Connecting...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-2">
                        <Phone className="w-5 h-5" />
                        <span>Start AI Call</span>
                      </div>
                    )}
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Tips */}
            <Card>
              <CardContent>
                <h3 className="heading-3 mb-4">Tips for Your Call</h3>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0" />
                    <span>Speak clearly and wait for the AI to respond</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0" />
                    <span>Have your financial documents ready for reference</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0" />
                    <span>Use Swahili or English - the AI understands both</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0" />
                    <span>Each call uses 5 credits from your account</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        ) : (
          /* In-call Interface */
          <div className="space-y-6">
            {/* Call Status */}
            <div className="text-center">
              <div className="flex items-center justify-center space-x-4 mb-4">
                <div className="flex items-center space-x-2 text-success">
                  <div className="w-3 h-3 bg-success rounded-full animate-pulse" />
                  <span className="font-medium">Connected</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-600">
                  <Users className="w-4 h-4" />
                  <span>{callState.participantCount} participants</span>
                </div>
                <div className="text-slate-600 font-mono">
                  {formatDuration(callState.duration)}
                </div>
              </div>
            </div>

            {/* Video Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Local Video */}
              <Card>
                <CardContent className="p-0">
                  <div 
                    ref={localVideoRef}
                    className="aspect-video bg-slate-900 rounded-tanzanite flex items-center justify-center relative overflow-hidden"
                  >
                    {callState.isVideoEnabled ? (
                      <div className="text-white text-center">
                        <Video className="w-12 h-12 mx-auto mb-2" />
                        <p>Your Video</p>
                      </div>
                    ) : (
                      <div className="text-white text-center">
                        <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-2">
                          <span className="text-xl font-semibold">You</span>
                        </div>
                        <p>Video Off</p>
                      </div>
                    )}
                    <div className="absolute bottom-4 left-4 bg-black/50 text-white px-2 py-1 rounded text-sm">
                      You
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Remote Video (AI Assistant) */}
              <Card>
                <CardContent className="p-0">
                  <div 
                    ref={remoteVideoRef}
                    className="aspect-video bg-gradient-to-br from-primary-600 to-accent-500 rounded-tanzanite flex items-center justify-center relative overflow-hidden"
                  >
                    <div className="text-white text-center">
                      <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-xl font-semibold">AI</span>
                      </div>
                      <p>AkiliPesa Assistant</p>
                      <div className="flex items-center justify-center space-x-1 mt-2">
                        <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      </div>
                    </div>
                    <div className="absolute bottom-4 left-4 bg-black/50 text-white px-2 py-1 rounded text-sm">
                      AI Assistant
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Call Controls */}
            <div className="flex items-center justify-center space-x-6">
              <button
                onClick={toggleAudio}
                className={`p-4 rounded-full transition-colors ${
                  callState.isAudioEnabled 
                    ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' 
                    : 'bg-danger text-white hover:bg-red-600'
                }`}
                title={callState.isAudioEnabled ? 'Mute' : 'Unmute'}
              >
                {callState.isAudioEnabled ? (
                  <Mic className="w-6 h-6" />
                ) : (
                  <MicOff className="w-6 h-6" />
                )}
              </button>

              <button
                onClick={toggleVideo}
                className={`p-4 rounded-full transition-colors ${
                  callState.isVideoEnabled 
                    ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' 
                    : 'bg-danger text-white hover:bg-red-600'
                }`}
                title={callState.isVideoEnabled ? 'Turn off camera' : 'Turn on camera'}
              >
                {callState.isVideoEnabled ? (
                  <Video className="w-6 h-6" />
                ) : (
                  <VideoOff className="w-6 h-6" />
                )}
              </button>

              <button
                onClick={endCall}
                className="p-4 rounded-full bg-danger text-white hover:bg-red-600 transition-colors"
                title="End call"
              >
                <PhoneOff className="w-6 h-6" />
              </button>

              <button className="p-4 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors">
                <Settings className="w-6 h-6" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
