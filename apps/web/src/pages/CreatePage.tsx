import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Video, Music, Users, Mic, Sparkles, Upload, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CreateOption {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  isAI?: boolean;
}

const createOptions: CreateOption[] = [
  {
    id: 'video',
    title: 'Record Video',
    description: 'Create a new reel with your camera',
    icon: Video,
    color: 'from-blue-500 to-purple-500',
  },
  {
    id: 'photo',
    title: 'Take Photo',
    description: 'Capture a moment to share',
    icon: Camera,
    color: 'from-pink-500 to-red-500',
  },
  {
    id: 'live',
    title: 'Go Live',
    description: 'Start a live broadcast',
    icon: Users,
    color: 'from-red-500 to-orange-500',
  },
  {
    id: 'ai-video',
    title: 'AI Video',
    description: 'Generate video with Runway AI',
    icon: Sparkles,
    color: 'from-accent-500 to-glow-500',
    isAI: true,
  },
  {
    id: 'ai-music',
    title: 'AI Music',
    description: 'Create music with Udio AI',
    icon: Music,
    color: 'from-green-500 to-teal-500',
    isAI: true,
  },
  {
    id: 'ai-voice',
    title: 'AI Voice',
    description: 'Text-to-speech with OpenVoice',
    icon: Mic,
    color: 'from-purple-500 to-indigo-500',
    isAI: true,
  },
];

export default function CreatePage() {
  const navigate = useNavigate();
  const [showUpload, setShowUpload] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId);
    
    if (optionId.startsWith('ai-')) {
      // Handle AI generation
      handleAIGeneration(optionId);
    } else {
      // Handle regular creation
      handleRegularCreation(optionId);
    }
  };

  const handleAIGeneration = async (type: string) => {
    console.log('Starting AI generation:', type);
    
    // Map to Firebase function types
    const functionTypes = {
      'ai-video': 'video.runway',
      'ai-music': 'music.udio', 
      'ai-voice': 'tts.openvoice',
    };
    
    const functionType = functionTypes[type as keyof typeof functionTypes];
    
    if (functionType) {
      try {
        // Navigate to AI creation flow
        navigate('/create/ai', { state: { type: functionType } });
      } catch (error) {
        console.error('AI generation failed:', error);
      }
    }
  };

  const handleRegularCreation = (type: string) => {
    console.log('Starting creation:', type);

    switch (type) {
      case 'video':
      case 'photo':
        navigate('/create/camera');
        break;
      case 'live':
        navigate('/create/live');
        break;
    }
  };

  return (
    <div className="h-screen-safe bg-gem-dark overflow-y-auto">
      {/* Header */}
      <div className="safe-top p-4 border-b border-white/10">
        <div className="flex-between">
          <h1 className="text-2xl font-bold text-white">Create</h1>
          <button 
            onClick={() => setShowUpload(true)}
            className="btn-gem-ghost flex items-center space-x-2"
          >
            <Upload className="w-5 h-5" />
            <span>Upload</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">Quick Create</h2>
          <div className="grid grid-cols-2 gap-4">
            {createOptions.slice(0, 4).map((option) => {
              const IconComponent = option.icon;
              return (
                <button
                  key={option.id}
                  onClick={() => handleOptionSelect(option.id)}
                  className={cn(
                    "relative p-6 rounded-2xl overflow-hidden transition-all duration-300",
                    "hover:scale-105 active:scale-95",
                    selectedOption === option.id ? "ring-2 ring-accent-400" : ""
                  )}
                  style={{
                    background: `linear-gradient(135deg, ${option.color.split(' ')[1]}, ${option.color.split(' ')[3]})`
                  }}
                >
                  <div className="relative z-10">
                    <IconComponent className="w-8 h-8 text-white mb-3" />
                    <h3 className="text-white font-semibold text-left">{option.title}</h3>
                    <p className="text-white/80 text-sm text-left mt-1">{option.description}</p>
                  </div>
                  
                  {option.isAI && (
                    <div className="absolute top-2 right-2 bg-white/20 rounded-full px-2 py-1">
                      <span className="text-white text-xs font-medium">AI</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* AI Generation */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-accent-400" />
            <span>AI-Powered Creation</span>
          </h2>
          <div className="space-y-3">
            {createOptions.filter(option => option.isAI).map((option) => {
              const IconComponent = option.icon;
              return (
                <button
                  key={option.id}
                  onClick={() => handleOptionSelect(option.id)}
                  className="w-full card-gem p-4 hover:shadow-glow transition-all duration-300 text-left"
                >
                  <div className="flex items-center space-x-4">
                    <div className={cn(
                      "w-12 h-12 rounded-full flex-center",
                      `bg-gradient-to-r ${option.color}`
                    )}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-semibold">{option.title}</h3>
                      <p className="text-white/60 text-sm">{option.description}</p>
                    </div>
                    <div className="text-accent-400">
                      <Sparkles className="w-5 h-5" />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Templates */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">Templates</h2>
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3, 4, 5, 6].map((template) => (
              <div key={template} className="aspect-video rounded-lg bg-white/10 border border-white/20 flex-center">
                <span className="text-white/60 text-sm">Template {template}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-modal-backdrop"
            onClick={() => setShowUpload(false)}
          />
          <div className="fixed inset-x-4 top-1/2 transform -translate-y-1/2 z-modal">
            <div className="card-gem p-6 max-w-sm mx-auto">
              <div className="flex-between mb-4">
                <h3 className="text-white font-semibold text-lg">Upload Content</h3>
                <button 
                  onClick={() => setShowUpload(false)}
                  className="p-1 hover:bg-white/10 rounded"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
              
              <div className="space-y-3">
                <button className="w-full btn-gem-outline py-3 flex items-center justify-center space-x-2">
                  <Video className="w-5 h-5" />
                  <span>Upload Video</span>
                </button>
                <button className="w-full btn-gem-outline py-3 flex items-center justify-center space-x-2">
                  <Camera className="w-5 h-5" />
                  <span>Upload Photo</span>
                </button>
                <button className="w-full btn-gem-outline py-3 flex items-center justify-center space-x-2">
                  <Music className="w-5 h-5" />
                  <span>Upload Audio</span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
