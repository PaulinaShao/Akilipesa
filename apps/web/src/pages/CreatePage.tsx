import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Video, 
  Camera, 
  Music, 
  Users, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft,
  Package,
  Briefcase,
  FileText,
  Image,
  Mic,
  Star,
  Shield,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useJob, JobTypes, type JobType } from '@/modules/jobs';
import { isGuest } from '@/lib/guards';
import { useAuth } from '@/hooks/useAuth';
import { useUIStore } from '@/state/uiStore';

interface WizardStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  options: WizardOption[];
}

interface WizardOption {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  isPro?: boolean;
  isAI?: boolean;
  route?: string;
  action?: () => void;
}

const wizardSteps: WizardStep[] = [
  {
    id: 'content',
    title: 'Content',
    description: 'Share your creativity with the world',
    icon: FileText,
    color: 'from-blue-500 to-purple-500',
    options: [
      {
        id: 'video',
        title: 'Record Video',
        description: 'Create a reel with your camera',
        icon: Video,
        route: '/create/camera'
      },
      {
        id: 'photo',
        title: 'Take Photo',
        description: 'Capture a moment to share',
        icon: Camera,
        route: '/create/camera'
      },
      {
        id: 'live',
        title: 'Go Live',
        description: 'Start a live broadcast',
        icon: Users,
        isPro: true,
        route: '/create/live'
      },
      {
        id: 'ai-video',
        title: 'AI Video',
        description: 'Generate video with AI',
        icon: Sparkles,
        isAI: true,
        isPro: true
      },
      {
        id: 'ai-image',
        title: 'AI Image',
        description: 'Create images with AI',
        icon: Image,
        isAI: true,
        isPro: true
      },
      {
        id: 'ai-music',
        title: 'AI Music',
        description: 'Compose music with AI',
        icon: Music,
        isAI: true,
        isPro: true
      }
    ]
  },
  {
    id: 'service',
    title: 'Service',
    description: 'Offer your skills and expertise',
    icon: Briefcase,
    color: 'from-green-500 to-teal-500',
    options: [
      {
        id: 'consultation',
        title: 'Consultation',
        description: 'Offer 1-on-1 advice sessions',
        icon: Users,
        isPro: true
      },
      {
        id: 'tutorial',
        title: 'Tutorial',
        description: 'Teach a skill or process',
        icon: Video,
        isPro: true
      },
      {
        id: 'coaching',
        title: 'Coaching',
        description: 'Ongoing mentorship programs',
        icon: Star,
        isPro: true
      },
      {
        id: 'ai-assistant',
        title: 'AI Assistant',
        description: 'Create AI-powered services',
        icon: Sparkles,
        isAI: true,
        isPro: true
      }
    ]
  },
  {
    id: 'product',
    title: 'Product',
    description: 'Sell physical or digital products',
    icon: Package,
    color: 'from-orange-500 to-red-500',
    options: [
      {
        id: 'physical',
        title: 'Physical Product',
        description: 'Sell tangible items with shipping',
        icon: Package,
        isPro: true
      },
      {
        id: 'digital',
        title: 'Digital Product',
        description: 'Sell downloads, courses, ebooks',
        icon: FileText,
        isPro: true
      },
      {
        id: 'subscription',
        title: 'Subscription',
        description: 'Recurring revenue products',
        icon: Shield,
        isPro: true
      },
      {
        id: 'ai-product',
        title: 'AI-Generated Product',
        description: 'Create products with AI',
        icon: Sparkles,
        isAI: true,
        isPro: true
      }
    ]
  }
];

export default function CreatePage() {
  const navigate = useNavigate();
  const { isGuest } = useAuth();
  const { openAuthSheet } = useUIStore();
  const { startJob } = useJob();
  
  const [currentStep, setCurrentStep] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showAIPrompt, setShowAIPrompt] = useState(false);
  const [aiPrompt, setAIPrompt] = useState('');
  const [selectedAIType, setSelectedAIType] = useState<JobType>('image');

  const currentStepData = wizardSteps.find(step => step.id === currentStep);

  const handleStepSelect = (stepId: string) => {
    setCurrentStep(stepId);
    setSelectedOption(null);
  };

  const handleOptionSelect = (option: WizardOption) => {
    setSelectedOption(option.id);

    // Check if user needs to be authenticated for pro features
    if (option.isPro && isGuest) {
      openAuthSheet(() => {
        handleOptionAfterAuth(option);
      }, 'create');
      return;
    }

    handleOptionAfterAuth(option);
  };

  const handleOptionAfterAuth = (option: WizardOption) => {
    if (option.isAI) {
      // Handle AI options
      const aiType = option.id.replace('ai-', '').replace('-product', '') as JobType;
      setSelectedAIType(aiType);
      setShowAIPrompt(true);
    } else if (option.route) {
      // Navigate to specific creation page
      navigate(option.route);
    } else {
      // Handle service/product creation (would open detailed forms)
      console.log('Creating:', option.id);
      navigate('/create/setup', { state: { type: option.id, category: currentStep } });
    }
  };

  const handleAISubmit = async () => {
    if (!aiPrompt.trim()) return;

    try {
      const jobId = await startJob({
        type: selectedAIType,
        prompt: aiPrompt.trim(),
        category: currentStep
      });
      
      setShowAIPrompt(false);
      setAIPrompt('');
      navigate('/jobs', { state: { jobId } });
    } catch (error) {
      console.error('Failed to start AI job:', error);
    }
  };

  const handleCreateWithAI = () => {
    if (isGuest) {
      openAuthSheet(() => {
        setShowAIPrompt(true);
        setSelectedAIType('image');
      }, 'ai_create');
      return;
    }
    
    setShowAIPrompt(true);
    setSelectedAIType('image');
  };

  const handleBack = () => {
    if (showAIPrompt) {
      setShowAIPrompt(false);
      setAIPrompt('');
    } else {
      setCurrentStep(null);
      setSelectedOption(null);
    }
  };

  return (
    <div className="page-root bg-gradient-to-br from-[#0b0c14] to-[#2b1769]">
      {/* Header */}
      <div className="safe-top p-4 border-b border-white/10 sticky top-0 bg-black/20 backdrop-blur-md z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {(currentStep || showAIPrompt) && (
              <button
                onClick={handleBack}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
            )}
            <h1 className="text-2xl font-bold text-white">
              {showAIPrompt ? 'Create with AI' : currentStepData ? currentStepData.title : 'Create'}
            </h1>
          </div>
          
          <button
            onClick={handleCreateWithAI}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 rounded-xl text-white font-medium transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Create with AI</span>
          </button>
        </div>
        
        {currentStepData && !showAIPrompt && (
          <p className="text-white/60 text-sm mt-2">{currentStepData.description}</p>
        )}
      </div>

      <div className="p-4">
        {!currentStep && !showAIPrompt && (
          // Step Selection
          <div className="space-y-4">
            <div className="text-center mb-8">
              <h2 className="text-xl font-semibold text-white mb-2">What would you like to create?</h2>
              <p className="text-white/60">Choose a category to get started</p>
            </div>

            <div className="space-y-4">
              {wizardSteps.map((step) => {
                const IconComponent = step.icon;
                return (
                  <button
                    key={step.id}
                    onClick={() => handleStepSelect(step.id)}
                    className="w-full p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-white/10 hover:border-violet-500/30 transition-all duration-300 text-left group"
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-16 h-16 rounded-2xl flex items-center justify-center",
                        `bg-gradient-to-r ${step.color}`
                      )}>
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-white group-hover:text-violet-300 transition-colors">
                          {step.title}
                        </h3>
                        <p className="text-white/60 mt-1">{step.description}</p>
                        <div className="flex items-center gap-1 mt-2 text-white/40 text-sm">
                          <span>{step.options.length} options</span>
                          {step.options.some(opt => opt.isAI) && (
                            <>
                              <span>•</span>
                              <Sparkles className="w-3 h-3" />
                              <span>AI-powered</span>
                            </>
                          )}
                        </div>
                      </div>
                      
                      <ArrowRight className="w-6 h-6 text-white/40 group-hover:text-violet-400 transition-colors" />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Guest CTA */}
            {isGuest && (
              <div className="mt-8 p-4 bg-gradient-to-r from-violet-500/20 to-purple-500/20 border border-violet-500/30 rounded-xl">
                <div className="text-center">
                  <h3 className="text-white font-semibold mb-2">Unlock Premium Features</h3>
                  <p className="text-white/60 text-sm mb-4">
                    Sign in to access AI creation, advanced tools, and monetization options
                  </p>
                  <button
                    onClick={() => openAuthSheet(undefined, 'create')}
                    className="px-6 py-2 bg-violet-600 hover:bg-violet-700 text-white font-medium rounded-lg transition-colors"
                  >
                    Get Started
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {currentStepData && !showAIPrompt && (
          // Option Selection
          <div className="space-y-4">
            <div className="grid gap-4">
              {currentStepData.options.map((option) => {
                const IconComponent = option.icon;
                const isSelected = selectedOption === option.id;
                const needsAuth = option.isPro && isGuest;
                
                return (
                  <button
                    key={option.id}
                    onClick={() => handleOptionSelect(option)}
                    className={cn(
                      "w-full p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl transition-all duration-300 text-left group",
                      isSelected ? "bg-violet-500/20 border-violet-500/40" : "hover:bg-white/10 hover:border-white/20",
                      needsAuth ? "opacity-80" : ""
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-white font-medium">{option.title}</h4>
                          <div className="flex gap-1">
                            {option.isAI && (
                              <span className="px-2 py-0.5 bg-violet-500/20 text-violet-300 text-xs rounded-full border border-violet-500/30">
                                AI
                              </span>
                            )}
                            {option.isPro && (
                              <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 text-xs rounded-full border border-amber-500/30">
                                PRO
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="text-white/60 text-sm">{option.description}</p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {needsAuth && (
                          <div className="flex items-center gap-1 text-white/40 text-xs">
                            <Shield className="w-3 h-3" />
                            <span>Sign in</span>
                          </div>
                        )}
                        <ArrowRight className="w-5 h-5 text-white/40 group-hover:text-white/60 transition-colors" />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {showAIPrompt && (
          // AI Prompt Interface
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-violet-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">Create with AkiliPesa AI</h2>
              <p className="text-white/60">Describe what you'd like to create and let our AI bring it to life</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  What would you like to create?
                </label>
                <textarea
                  value={aiPrompt}
                  onChange={(e) => setAIPrompt(e.target.value)}
                  placeholder="Describe your idea in detail... For example: 'A vibrant sunset over Mount Kilimanjaro with traditional Maasai silhouettes'"
                  className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none"
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                {['image', 'video', 'music'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedAIType(type as JobType)}
                    className={cn(
                      "p-3 rounded-lg border text-sm font-medium transition-all",
                      selectedAIType === type
                        ? "bg-violet-500/20 border-violet-500 text-violet-300"
                        : "bg-white/5 border-white/20 text-white/60 hover:bg-white/10"
                    )}
                  >
                    {type === 'image' && <Image className="w-4 h-4 mx-auto mb-1" />}
                    {type === 'video' && <Video className="w-4 h-4 mx-auto mb-1" />}
                    {type === 'music' && <Music className="w-4 h-4 mx-auto mb-1" />}
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>

              <div className="bg-violet-500/10 border border-violet-500/20 rounded-xl p-4">
                <h4 className="text-violet-300 font-medium mb-2 flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Pro Tips
                </h4>
                <div className="space-y-1 text-sm text-violet-200/80">
                  <p>• Be specific about colors, style, and mood</p>
                  <p>• Include Tanzanian cultural elements for local appeal</p>
                  <p>• Mention lighting, perspective, or composition preferences</p>
                </div>
              </div>

              <button
                onClick={handleAISubmit}
                disabled={!aiPrompt.trim()}
                className="w-full py-4 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center justify-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  <span>Create with AI</span>
                </div>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
