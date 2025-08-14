import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Share, 
  DollarSign, 
  Instagram, 
  MessageCircle,
  Copy,
  Download,
  ExternalLink,
  Sparkles,
  Eye,
  EyeOff
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ShareSheetProps {
  isOpen: boolean;
  onClose: () => void;
  content: {
    id: string;
    type: 'reel' | 'product' | 'live';
    title: string;
    creator: string;
    url: string;
    thumbnailUrl?: string;
  };
}

interface ShareOption {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  color: string;
  action: (url: string) => void;
}

export default function ShareSheet({ isOpen, onClose, content }: ShareSheetProps) {
  const [activeTab, setActiveTab] = useState<'share' | 'earn'>('share');
  const [affiliateEnabled, setAffiliateEnabled] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const shareUrl = affiliateEnabled 
    ? `${content.url}?ref=${encodeURIComponent('user123')}&aff=1`
    : content.url;

  const estimatedEarning = {
    commission: 15, // 15% commission
    potential: 5000, // TSH
    views: 100
  };

  const shareOptions: ShareOption[] = [
    {
      id: 'instagram',
      label: 'Instagram',
      icon: Instagram,
      color: 'from-pink-500 to-purple-600',
      action: (url) => {
        // Instagram Stories sharing
        if (navigator.share) {
          navigator.share({ url, title: content.title });
        } else {
          window.open(`https://www.instagram.com/`, '_blank');
        }
      }
    },
    {
      id: 'whatsapp',
      label: 'WhatsApp',
      icon: MessageCircle,
      color: 'from-green-500 to-green-600',
      action: (url) => {
        const text = `Check out this amazing content on AkiliPesa: ${content.title}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
      }
    },
    {
      id: 'copy',
      label: 'Copy Link',
      icon: Copy,
      color: 'from-blue-500 to-blue-600',
      action: (url) => {
        navigator.clipboard.writeText(url);
        // Show toast notification
      }
    },
    {
      id: 'download',
      label: 'Download',
      icon: Download,
      color: 'from-gray-500 to-gray-600',
      action: (url) => {
        // Trigger download with watermark
        const link = document.createElement('a');
        link.href = url + '&download=1&watermark=1';
        link.download = `akilipesa-${content.id}.mp4`;
        link.click();
      }
    }
  ];

  const handleShare = async (option: ShareOption) => {
    setIsProcessing(true);
    
    try {
      // Add affiliate tag if enabled
      let finalUrl = shareUrl;
      if (affiliateEnabled) {
        // Call API to create affiliate link
        finalUrl = await attachAffiliateTag(content.url);
      }
      
      option.action(finalUrl);
      
      // Track share event
      console.log('Share tracked:', { 
        contentId: content.id, 
        platform: option.id, 
        affiliate: affiliateEnabled 
      });
      
    } catch (error) {
      console.error('Share failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Stub for affiliate tag API
  const attachAffiliateTag = async (url: string): Promise<string> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return `${url}?ref=user123&aff=1&t=${Date.now()}`;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end justify-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Sheet */}
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="relative w-full max-w-md bg-zinc-900 rounded-t-3xl border-t border-zinc-700 max-h-[85vh] overflow-hidden"
        >
          {/* Handle */}
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-10 h-1 bg-zinc-600 rounded-full" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-6 pb-4">
            <div className="flex items-center gap-3">
              {content.thumbnailUrl && (
                <img 
                  src={content.thumbnailUrl} 
                  alt="" 
                  className="w-12 h-12 rounded-lg object-cover"
                />
              )}
              <div>
                <h3 className="text-white font-semibold text-lg">Share & Earn</h3>
                <p className="text-white/60 text-sm">{content.creator}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-zinc-800 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-zinc-400" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex mx-6 mb-6 bg-zinc-800 rounded-xl p-1">
            <button
              onClick={() => setActiveTab('share')}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm font-medium transition-all",
                activeTab === 'share'
                  ? "bg-zinc-700 text-white"
                  : "text-zinc-400 hover:text-white"
              )}
            >
              <Share className="w-4 h-4" />
              Share
            </button>
            <button
              onClick={() => setActiveTab('earn')}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm font-medium transition-all",
                activeTab === 'earn'
                  ? "bg-zinc-700 text-white"
                  : "text-zinc-400 hover:text-white"
              )}
            >
              <DollarSign className="w-4 h-4" />
              Earn
            </button>
          </div>

          {/* Content */}
          <div className="px-6 pb-6 max-h-96 overflow-y-auto">
            {activeTab === 'share' && (
              <div className="space-y-4">
                {/* Affiliate Toggle */}
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span className="text-white font-medium text-sm">Earn from shares</span>
                    </div>
                    <button
                      onClick={() => setAffiliateEnabled(!affiliateEnabled)}
                      className={cn(
                        "w-12 h-6 rounded-full transition-colors relative",
                        affiliateEnabled ? "bg-amber-500" : "bg-zinc-600"
                      )}
                    >
                      <div
                        className={cn(
                          "w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform",
                          affiliateEnabled ? "translate-x-6" : "translate-x-0.5"
                        )}
                      />
                    </button>
                  </div>
                  <p className="text-amber-400/80 text-xs">
                    {affiliateEnabled 
                      ? `Earn ${estimatedEarning.commission}% commission on purchases from your shares`
                      : 'Enable to earn money when people buy through your links'
                    }
                  </p>
                </div>

                {/* Share Options */}
                <div className="space-y-3">
                  {shareOptions.map((option) => {
                    const IconComponent = option.icon;
                    return (
                      <motion.button
                        key={option.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleShare(option)}
                        disabled={isProcessing}
                        className="w-full flex items-center gap-4 p-4 bg-zinc-800 hover:bg-zinc-700 rounded-xl transition-colors disabled:opacity-50"
                      >
                        <div className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center",
                          `bg-gradient-to-br ${option.color}`
                        )}>
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 text-left">
                          <div className="text-white font-medium">{option.label}</div>
                          {option.id === 'download' && (
                            <div className="text-zinc-400 text-sm">With AkiliPesa watermark</div>
                          )}
                        </div>
                        <ExternalLink className="w-5 h-5 text-zinc-400" />
                      </motion.button>
                    );
                  })}
                </div>

                {/* URL Preview */}
                <div className="bg-zinc-800 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-zinc-400 text-sm">Share URL</span>
                    <div className="flex items-center gap-1">
                      {affiliateEnabled ? (
                        <>
                          <Eye className="w-3 h-3 text-amber-400" />
                          <span className="text-amber-400 text-xs">Earning enabled</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3 h-3 text-zinc-500" />
                          <span className="text-zinc-500 text-xs">No earning</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="text-white text-sm break-all bg-zinc-700 rounded-lg p-3">
                    {shareUrl}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'earn' && (
              <div className="space-y-4">
                {/* Earnings Overview */}
                <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-4">
                  <h4 className="text-green-400 font-medium mb-3">Potential Earnings</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-2xl font-bold text-white">
                        {estimatedEarning.commission}%
                      </div>
                      <div className="text-green-400/80 text-sm">Commission rate</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">
                        TSH {estimatedEarning.potential.toLocaleString()}
                      </div>
                      <div className="text-green-400/80 text-sm">Per 100 views</div>
                    </div>
                  </div>
                </div>

                {/* How it works */}
                <div className="space-y-3">
                  <h4 className="text-white font-medium">How sharing earns money:</h4>
                  <div className="space-y-2 text-sm text-white/80">
                    <div className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <span>Share content with your unique affiliate link</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <span>People who click your link and make purchases earn you commission</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <span>Track your earnings in real-time on your profile</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <span>Get paid weekly to your mobile money account</span>
                    </div>
                  </div>
                </div>

                {/* Tips */}
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                  <h4 className="text-blue-400 font-medium mb-2">💡 Earning Tips</h4>
                  <div className="space-y-1 text-sm text-white/70">
                    <div>• Share to your most engaged audiences</div>
                    <div>• Add personal recommendations</div>
                    <div>• Post during peak hours (6-9 PM)</div>
                    <div>• Use relevant hashtags and stories</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
