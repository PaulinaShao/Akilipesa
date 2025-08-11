import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Video, Music, Users, Mic, Sparkles, Upload, X, MessageCircle, Image, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useJob, JobTypes, type JobType } from '@/modules/jobs';
import { useAppStore } from '@/store';

interface CreateOption {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  isAI?: boolean;
  route?: string;
}

const createOptions: CreateOption[] = [
  {
    id: 'video',
    title: 'Record Video',
    description: 'Create a new reel with your camera',
    icon: Video,
    color: 'from-blue-500 to-purple-500',
    route: '/create/camera',
  },
  {
    id: 'photo',
    title: 'Take Photo',
    description: 'Capture a moment to share',
    icon: Camera,
    color: 'from-pink-500 to-red-500',
    route: '/create/camera',
  },
  {
    id: 'live',
    title: 'Go Live',
    description: 'Start a live broadcast',
    icon: Users,
    color: 'from-red-500 to-orange-500',
    route: '/create/live',
  },
  {
    id: 'ai-image',
    title: 'AI Image',
    description: 'Generate images with AI',
    icon: Image,
    color: 'from-violet-500 to-purple-500',
    isAI: true,
  },
  {
    id: 'ai-video',
    title: 'AI Video (Runway)',
    description: 'Generate video with Runway AI',
    icon: Sparkles,
    color: 'from-accent-500 to-glow-500',
    isAI: true,
  },
  {
    id: 'ai-music',
    title: 'AI Music (Udio)',
    description: 'Create music with Udio AI',
    icon: Music,
    color: 'from-green-500 to-teal-500',
    isAI: true,
  },
  {
    id: 'ai-voice',
    title: 'AI Voice (OpenVoice)',
    description: 'Text-to-speech with OpenVoice',
    icon: Mic,
    color: 'from-purple-500 to-indigo-500',
    isAI: true,
  },
];

interface AIJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobType: JobType;
  onStartJob: (inputs: any) => void;
}

function AIJobModal({ isOpen, onClose, jobType, onStartJob }: AIJobModalProps) {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const jobConfig = JobTypes[jobType];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    try {
      await onStartJob({ type: jobType, prompt: prompt.trim() });
      onClose();
    } catch (error) {
      console.error('Failed to start job:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/70 z-50" onClick={onClose} />
      <div className="fixed inset-x-4 top-1/2 transform -translate-y-1/2 z-50 max-w-md mx-auto">
        <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 border border-violet-500/20 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{jobConfig.icon}</span>
              <h3 className="text-xl font-bold text-white">{jobConfig.name}</h3>
            </div>
            <button onClick={onClose} className="text-zinc-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-zinc-400 text-sm mb-4">{jobConfig.description}</p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Prompt
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={`Describe what you want to create...`}
                className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-3 py-2 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none"
                rows={3}
                required
              />
            </div>

            <div className="bg-violet-500/10 border border-violet-500/20 rounded-lg p-3">
              <p className="text-xs text-violet-300 mb-2">💡 Try these examples:</p>
              <div className="space-y-1">
                {jobConfig.examples.slice(0, 2).map((example, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setPrompt(example)}
                    className="block text-xs text-violet-400 hover:text-violet-300 text-left"
                  >
                    "{example}"
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2 px-4 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!prompt.trim() || isLoading}
                className="flex-1 py-2 px-4 bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 disabled:from-zinc-600 disabled:to-zinc-600 text-white rounded-lg transition-all"
              >
                {isLoading ? 'Starting...' : `Create ${jobConfig.name}`}
              </button>
            </div>

            <p className="text-xs text-zinc-500 text-center">
              Estimated time: {jobConfig.estimatedTime}
            </p>
          </form>
        </div>
      </div>
    </>
  );
}

interface PricingPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (pricing: any) => void;
}

function PricingPanel({ isOpen, onClose, onSubmit }: PricingPanelProps) {
  const [price, setPrice] = useState('');
  const [discount, setDiscount] = useState('');
  const [commission, setCommission] = useState('15'); // Default 15%

  const calculateFinalPrice = () => {
    const basePrice = parseFloat(price) || 0;
    const discountPercent = parseFloat(discount) || 0;
    return basePrice * (1 - discountPercent / 100);
  };

  const calculateCommission = () => {
    const finalPrice = calculateFinalPrice();
    const commissionPercent = parseFloat(commission) || 0;
    return finalPrice * (commissionPercent / 100);
  };

  const calculateEarnings = () => {
    return calculateFinalPrice() - calculateCommission();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      price: parseFloat(price) || 0,
      discount: parseFloat(discount) || 0,
      commission: parseFloat(commission) || 15,
      finalPrice: calculateFinalPrice(),
      commissionAmount: calculateCommission(),
      earnings: calculateEarnings(),
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/70 z-50" onClick={onClose} />
      <div className="fixed inset-x-4 top-1/2 transform -translate-y-1/2 z-50 max-w-md mx-auto">
        <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 border border-green-500/20 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <DollarSign className="w-6 h-6 text-green-400" />
              <h3 className="text-xl font-bold text-white">Sell as Product/Service</h3>
            </div>
            <button onClick={onClose} className="text-zinc-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Price (TSH)
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="10000"
                className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-3 py-2 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                min="0"
                step="100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Discount (%)
              </label>
              <input
                type="number"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                placeholder="0"
                className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-3 py-2 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                min="0"
                max="100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Platform Commission (%)
              </label>
              <select
                value={commission}
                onChange={(e) => setCommission(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="10">10% (Basic)</option>
                <option value="15">15% (Standard)</option>
                <option value="20">20% (Premium Support)</option>
              </select>
            </div>

            {price && (
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 space-y-2">
                <h4 className="text-sm font-medium text-green-400">Pricing Breakdown</h4>
                <div className="text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Original Price:</span>
                    <span className="text-white">TSH {parseFloat(price || '0').toLocaleString()}</span>
                  </div>
                  {discount && (
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Discount ({discount}%):</span>
                      <span className="text-red-400">-TSH {(parseFloat(price || '0') * parseFloat(discount || '0') / 100).toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-medium">
                    <span className="text-zinc-300">Final Price:</span>
                    <span className="text-white">TSH {calculateFinalPrice().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Platform Fee ({commission}%):</span>
                    <span className="text-orange-400">-TSH {calculateCommission().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-bold text-green-400 pt-1 border-t border-green-500/20">
                    <span>Your Earnings:</span>
                    <span>TSH {calculateEarnings().toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2 px-4 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2 px-4 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white rounded-lg transition-all"
              >
                Add Pricing
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default function CreatePage() {
  const navigate = useNavigate();
  const { startJob } = useJob();

  const [showUpload, setShowUpload] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showAIModal, setShowAIModal] = useState(false);
  const [selectedAIType, setSelectedAIType] = useState<JobType>('image');
  const [showPricing, setShowPricing] = useState(false);

  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId);
    
    if (optionId.startsWith('ai-')) {
      // Handle AI generation
      const aiType = optionId.replace('ai-', '') as JobType;
      setSelectedAIType(aiType);
      setShowAIModal(true);
    } else {
      // Handle regular creation
      const option = createOptions.find(opt => opt.id === optionId);
      if (option?.route) {
        navigate(option.route);
      }
    }
  };

  const handleStartAIJob = async (inputs: any) => {
    try {
      const jobId = await startJob(inputs);
      console.log('Started AI job:', jobId);
      // Navigate to job status page or show success
      navigate('/jobs', { state: { jobId } });
    } catch (error) {
      console.error('Failed to start AI job:', error);
    }
  };

  const handleChatWithAI = (type: 'text' | 'image' | 'voice' | 'live') => {
    switch (type) {
      case 'text':
        navigate('/chat/ai');
        break;
      case 'image':
        navigate('/chat/ai?mode=image');
        break;
      case 'voice':
        navigate('/chat/ai?mode=voice');
        break;
      case 'live':
        navigate('/create/live');
        break;
    }
  };

  return (
    <div className="h-screen-safe bg-gradient-to-br from-[#0b0c14] to-[#2b1769] overflow-y-auto">
      {/* Header */}
      <div className="safe-top p-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Create</h1>
          <div className="flex gap-2">
            <button 
              onClick={() => setShowPricing(true)}
              className="flex items-center gap-2 px-3 py-1.5 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded-lg text-green-400 text-sm transition-colors"
            >
              <DollarSign className="w-4 h-4" />
              <span>Sell</span>
            </button>
            <button 
              onClick={() => setShowUpload(true)}
              className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white text-sm transition-colors"
            >
              <Upload className="w-4 h-4" />
              <span>Upload</span>
            </button>
          </div>
        </div>
      </div>

      {/* Message Top Bar */}
      <div className="p-4 border-b border-white/10">
        <div className="bg-gradient-to-r from-violet-500/20 to-blue-500/20 border border-violet-500/30 rounded-xl p-4">
          <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-violet-400" />
            Chat with AkiliPesa AI
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={() => handleChatWithAI('text')}
              className="flex items-center gap-2 p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              Text
            </button>
            <button 
              onClick={() => handleChatWithAI('image')}
              className="flex items-center gap-2 p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm transition-colors"
            >
              <Image className="w-4 h-4" />
              Image
            </button>
            <button 
              onClick={() => handleChatWithAI('voice')}
              className="flex items-center gap-2 p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm transition-colors"
            >
              <Mic className="w-4 h-4" />
              Voice
            </button>
            <button 
              onClick={() => handleChatWithAI('live')}
              className="flex items-center gap-2 p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm transition-colors"
            >
              <Users className="w-4 h-4" />
              Go Live
            </button>
          </div>
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
                    selectedOption === option.id ? "ring-2 ring-violet-400" : ""
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
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-violet-400" />
            <span>AI-Powered Creation</span>
          </h2>
          <div className="space-y-3">
            {createOptions.filter(option => option.isAI).map((option) => {
              const IconComponent = option.icon;
              return (
                <button
                  key={option.id}
                  onClick={() => handleOptionSelect(option.id)}
                  className="w-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:bg-white/10 hover:border-violet-500/30 transition-all duration-300 text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center",
                      `bg-gradient-to-r ${option.color}`
                    )}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-semibold">{option.title}</h3>
                      <p className="text-white/60 text-sm">{option.description}</p>
                    </div>
                    <div className="text-violet-400">
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
              <div key={template} className="aspect-video rounded-lg bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors">
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
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setShowUpload(false)}
          />
          <div className="fixed inset-x-4 top-1/2 transform -translate-y-1/2 z-50">
            <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 border border-white/20 rounded-2xl p-6 max-w-sm mx-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold text-lg">Upload Content</h3>
                <button 
                  onClick={() => setShowUpload(false)}
                  className="p-1 hover:bg-white/10 rounded"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
              
              <div className="space-y-3">
                <button className="w-full py-3 px-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white flex items-center justify-center gap-2 transition-colors">
                  <Video className="w-5 h-5" />
                  <span>Upload Video</span>
                </button>
                <button className="w-full py-3 px-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white flex items-center justify-center gap-2 transition-colors">
                  <Camera className="w-5 h-5" />
                  <span>Upload Photo</span>
                </button>
                <button className="w-full py-3 px-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white flex items-center justify-center gap-2 transition-colors">
                  <Music className="w-5 h-5" />
                  <span>Upload Audio</span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* AI Job Modal */}
      <AIJobModal
        isOpen={showAIModal}
        onClose={() => setShowAIModal(false)}
        jobType={selectedAIType}
        onStartJob={handleStartAIJob}
      />

      {/* Pricing Panel */}
      <PricingPanel
        isOpen={showPricing}
        onClose={() => setShowPricing(false)}
        onSubmit={(pricing) => console.log('Pricing set:', pricing)}
      />
    </div>
  );
}
