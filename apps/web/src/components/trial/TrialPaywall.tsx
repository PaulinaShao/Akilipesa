import React, { useState } from 'react';
import { X, Sparkles, MessageCircle, Phone, Heart, Clock, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTrialStore } from '../../state/trialStore';
import { useAppStore } from '../../store';
import { useUIStore } from '../../state/uiStore';

interface TrialPaywallProps {
  trigger?: 'chat' | 'call' | 'reaction' | 'manual';
  onClose?: () => void;
}

export const TrialPaywall: React.FC<TrialPaywallProps> = ({ 
  trigger = 'manual', 
  onClose 
}) => {
  const { user } = useAppStore();
  const { isTrialPaywallOpen, closeTrialPaywall } = useUIStore();
  const { config, usage, getTrialProgress } = useTrialStore();
  const [showSuccess, setShowSuccess] = useState(false);

  // Don't show if user is authenticated
  if (user) return null;

  // Don't show if paywall is not open
  if (!isTrialPaywallOpen) return null;

  
  // Get appropriate messaging based on trigger
  const getContent = () => {
    switch (trigger) {
      case 'chat':
        return {
          icon: <MessageCircle className="w-8 h-8 text-blue-400" />,
          title: "Unlock Unlimited AI Chat",
          subtitle: "Continue your conversation with AkiliPesa AI",
          benefits: [
            "Unlimited AI conversations",
            "Advanced financial insights",
            "Personalized recommendations",
            "Priority AI response times"
          ]
        };
      case 'call':
        return {
          icon: <Phone className="w-8 h-8 text-green-400" />,
          title: "Upgrade for HD Video Calls",
          subtitle: "Unlock longer, higher quality calls",
          benefits: [
            "HD video & crystal clear audio",
            "Unlimited call duration",
            "Priority connection",
            "Screen sharing & recording"
          ]
        };
      case 'reaction':
        return {
          icon: <Heart className="w-8 h-8 text-pink-400" />,
          title: "Save & React Unlimited",
          subtitle: "Keep track of all your favorite content",
          benefits: [
            "Unlimited hearts & saves",
            "Personal collection library",
            "Advanced bookmarking",
            "Sync across devices"
          ]
        };
      default:
        return {
          icon: <Sparkles className="w-8 h-8 text-violet-400" />,
          title: "Unlock Full AkiliPesa Experience",
          subtitle: "Your trial has ended - continue with unlimited access",
          benefits: [
            "Unlimited AI chat & calls",
            "HD video quality",
            "Advanced financial tools",
            "Priority customer support"
          ]
        };
    }
  };

  const content = getContent();

  const handleSignUp = () => {
    setShowSuccess(true);
    
    // Show auth sheet after brief success animation
    setTimeout(() => {
      closeTrialPaywall();
      const event = new CustomEvent('showAuthSheet', { 
        detail: { reason: `trial_${trigger}`, source: 'paywall' }
      });
      window.dispatchEvent(event);
    }, 1500);
  };

  const handleClose = () => {
    closeTrialPaywall();
    onClose?.();
  };

  if (showSuccess) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-black/90 border border-violet-500/30 rounded-2xl p-8 max-w-md w-full text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <Zap className="w-8 h-8 text-white" />
          </motion.div>
          <h3 className="text-xl font-bold text-white mb-2">Welcome to AkiliPesa!</h3>
          <p className="text-zinc-400">Redirecting to sign up...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-gradient-to-b from-[#0b0c14] via-[#1a1235] to-[#2d1b69] border border-violet-500/30 rounded-2xl max-w-md w-full overflow-hidden"
        >
          {/* Header */}
          <div className="relative p-6 text-center">
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-zinc-400" />
            </button>
            
            <div className="mb-4">
              {content.icon}
            </div>
            
            <h2 className="text-xl font-bold text-white mb-2">
              {content.title}
            </h2>
            <p className="text-zinc-400 text-sm">
              {content.subtitle}
            </p>
          </div>

          {/* Trial Progress */}
          {config && usage && (
            <div className="px-6 pb-4">
              <div className="bg-black/20 rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400">Your trial usage:</span>
                  <span className="text-violet-400">Today</span>
                </div>
                
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center">
                    <div className="w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-1">
                      <MessageCircle className="w-4 h-4 text-blue-400" />
                    </div>
                    <div className="text-xs text-zinc-300">{usage.chatUsed}/{config.chatMessagesPerDay}</div>
                  </div>
                  <div className="text-center">
                    <div className="w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-1">
                      <Phone className="w-4 h-4 text-green-400" />
                    </div>
                    <div className="text-xs text-zinc-300">{usage.callsUsed}/{config.callsPerDay}</div>
                  </div>
                  <div className="text-center">
                    <div className="w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-1">
                      <Heart className="w-4 h-4 text-pink-400" />
                    </div>
                    <div className="text-xs text-zinc-300">{usage.reactionsUsed}/{config.reactionLimit}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Benefits */}
          <div className="px-6 pb-6">
            <h3 className="text-white font-semibold mb-3">What you get:</h3>
            <div className="space-y-2">
              {content.benefits.map((benefit, index) => (
                <motion.div
                  key={benefit}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-5 h-5 bg-violet-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-3 h-3 text-violet-400" />
                  </div>
                  <span className="text-zinc-300 text-sm">{benefit}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="p-6 border-t border-white/10">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSignUp}
              className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-semibold py-3 px-4 rounded-xl transition-all mb-3"
            >
              Sign Up Free - No Credit Card
            </motion.button>
            
            <button
              onClick={handleClose}
              className="w-full text-zinc-400 hover:text-white text-sm transition-colors"
            >
              Maybe later
            </button>
          </div>

          {/* Footer */}
          <div className="px-6 pb-4">
            <div className="flex items-center justify-center gap-2 text-xs text-zinc-500">
              <Clock className="w-3 h-3" />
              <span>Quotas reset daily at midnight</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

// Container component to handle global paywall state
export const TrialPaywallContainer: React.FC = () => {
  const { isTrialPaywallOpen } = useUIStore();
  
  if (!isTrialPaywallOpen) return null;
  
  return <TrialPaywall />;
};
