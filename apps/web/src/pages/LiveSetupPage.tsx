import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Camera, 
  Mic, 
  MicOff, 
  VideoOff, 
  Settings, 
  Users, 
  Globe,
  Lock,
  Eye
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function LiveSetupPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [privacy, setPrivacy] = useState<'public' | 'followers' | 'private'>('public');
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [micEnabled, setMicEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const privacyOptions = [
    {
      value: 'public' as const,
      label: 'Public',
      description: 'Anyone can join your live',
      icon: Globe,
      color: 'text-green-400'
    },
    {
      value: 'followers' as const,
      label: 'Followers Only',
      description: 'Only your followers can join',
      icon: Users,
      color: 'text-blue-400'
    },
    {
      value: 'private' as const,
      label: 'Private',
      description: 'Invite only',
      icon: Lock,
      color: 'text-amber-400'
    }
  ];

  const handleStartLive = async () => {
    if (!title.trim()) {
      return;
    }

    setIsLoading(true);
    
    try {
      // Generate a unique channel ID
      const channelId = `live_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Navigate to live session
      navigate(`/live/${channelId}`, {
        state: {
          title,
          description,
          privacy,
          cameraEnabled,
          micEnabled
        }
      });
    } catch (error) {
      console.error('Failed to start live session:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen-safe bg-gradient-to-b from-[#0b0c14] to-[#1a1235] overflow-y-auto">
      {/* Header */}
      <div className="safe-top p-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/create')}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          
          <h1 className="text-xl font-semibold text-white">Go Live</h1>
          
          <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <Settings className="w-6 h-6 text-white/60" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Preview */}
        <div className="relative aspect-video bg-zinc-900 rounded-2xl overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              {cameraEnabled ? (
                <>
                  <Camera className="w-16 h-16 text-white/40 mx-auto mb-4" />
                  <p className="text-white/60">Camera preview will appear here</p>
                </>
              ) : (
                <>
                  <VideoOff className="w-16 h-16 text-white/40 mx-auto mb-4" />
                  <p className="text-white/60">Camera is disabled</p>
                </>
              )}
            </div>
          </div>
          
          {/* Live indicator */}
          <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium animate-pulse">
            LIVE
          </div>
          
          {/* Viewer count */}
          <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
            <Eye className="w-4 h-4 inline mr-1" />
            0
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-6">
          <button
            onClick={() => setCameraEnabled(!cameraEnabled)}
            className={cn(
              "w-16 h-16 rounded-full flex items-center justify-center transition-colors",
              cameraEnabled 
                ? "bg-white/20 hover:bg-white/30" 
                : "bg-red-500 hover:bg-red-600"
            )}
          >
            {cameraEnabled ? (
              <Camera className="w-8 h-8 text-white" />
            ) : (
              <VideoOff className="w-8 h-8 text-white" />
            )}
          </button>
          
          <button
            onClick={() => setMicEnabled(!micEnabled)}
            className={cn(
              "w-16 h-16 rounded-full flex items-center justify-center transition-colors",
              micEnabled 
                ? "bg-white/20 hover:bg-white/30" 
                : "bg-red-500 hover:bg-red-600"
            )}
          >
            {micEnabled ? (
              <Mic className="w-8 h-8 text-white" />
            ) : (
              <MicOff className="w-8 h-8 text-white" />
            )}
          </button>
        </div>

        {/* Live Details */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Live Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What's your live about?"
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              maxLength={100}
            />
            <div className="text-right text-xs text-white/40 mt-1">
              {title.length}/100
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell viewers what to expect..."
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              rows={3}
              maxLength={200}
            />
            <div className="text-right text-xs text-white/40 mt-1">
              {description.length}/200
            </div>
          </div>

          {/* Privacy Settings */}
          <div>
            <label className="block text-sm font-medium text-white mb-3">
              Who can join
            </label>
            <div className="space-y-2">
              {privacyOptions.map((option) => {
                const IconComponent = option.icon;
                return (
                  <button
                    key={option.value}
                    onClick={() => setPrivacy(option.value)}
                    className={cn(
                      "w-full flex items-center gap-3 p-4 rounded-xl border transition-all",
                      privacy === option.value
                        ? "bg-primary/20 border-primary/50"
                        : "bg-white/5 border-white/10 hover:bg-white/10"
                    )}
                  >
                    <div className={cn("w-10 h-10 rounded-full flex items-center justify-center bg-white/10", option.color)}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="text-white font-medium">{option.label}</div>
                      <div className="text-white/60 text-sm">{option.description}</div>
                    </div>
                    {privacy === option.value && (
                      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Start Live Button */}
        <div className="pt-4">
          <button
            onClick={handleStartLive}
            disabled={!title.trim() || isLoading}
            className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-xl transition-all"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Starting Live...
              </div>
            ) : (
              'Start Live Stream'
            )}
          </button>
        </div>

        {/* Tips */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
          <h3 className="text-blue-400 font-medium mb-2">Live Tips</h3>
          <ul className="text-sm text-white/70 space-y-1">
            <li>• Keep your content engaging and interactive</li>
            <li>• Respond to comments to build community</li>
            <li>• Have good lighting and clear audio</li>
            <li>• Promote your live in advance for more viewers</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
