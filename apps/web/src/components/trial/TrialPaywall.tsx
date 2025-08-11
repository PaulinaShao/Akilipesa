import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap, Heart, MessageCircle, Phone, Clock } from 'lucide-react';
import { useTrialStore } from '../../state/trialStore';
import { useUIStore } from '../../state/uiStore';

interface TrialPaywallProps {
  isOpen: boolean;
  onClose: () => void;
  feature: 'chat' | 'call' | 'reaction';
  onSignUp: () => void;
}

export const TrialPaywall: React.FC<TrialPaywallProps> = ({
  isOpen,
  onClose,
  feature,
  onSignUp,
}) => {
  const { config, isInHappyHour } = useTrialStore();

  if (!config) return null;

  const featureInfo = {
    chat: {
      icon: MessageCircle,
      title: 'AI Chat Quota Reached',
      description: `You've used your ${config.chatMessagesPerDay} daily AI messages`,
      benefits: ['Unlimited AI conversations', 'Smart trading insights', 'Personal finance tips'],
    },
    call: {
      icon: Phone,
      title: 'Call Quota Reached',
      description: `You've used your ${config.callsPerDay} daily trial call`,
      benefits: ['Unlimited HD calls', 'Video calls up to 4 hours', 'Group calls with friends'],
    },
    reaction: {
      icon: Heart,
      title: 'Reaction Quota Reached',
      description: `You've used your ${config.reactionLimit} daily reactions`,
      benefits: ['Unlimited likes & saves', 'Follow unlimited creators', 'Build your profile'],
    },
  };

  const info = featureInfo[feature];
  const Icon = info.icon;

  // Happy hour paywall variant
  if (config.requireHappyHour && !isInHappyHour) {
    const nextHappyHour = config.happyHours?.[0];
    const hoursText = nextHappyHour 
      ? `${Math.floor(nextHappyHour.startMin / 60)}:${(nextHappyHour.startMin % 60).toString().padStart(2, '0')}`
      : 'during happy hours';

    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-2xl p-6 max-w-sm w-full border border-orange-500/20 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6 text-orange-500" />
                </div>
                <button onClick={onClose} className="text-zinc-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <h3 className="text-xl font-bold text-white mb-2">
                Outside Happy Hours
              </h3>
              
              <p className="text-zinc-400 text-sm mb-6">
                Trial {feature}s are only available {hoursText}. Sign up for 24/7 access!
              </p>

              <div className="space-y-3 mb-6">
                {info.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Zap className="w-4 h-4 text-orange-500 flex-shrink-0" />
                    <span className="text-sm text-zinc-300">{benefit}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={onSignUp}
                className="w-full bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 text-white font-medium py-3 rounded-xl transition-all duration-200 transform hover:scale-[1.02]"
              >
                Sign Up for Full Access
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-2xl p-6 max-w-sm w-full border border-violet-500/20 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-violet-500/20 rounded-full flex items-center justify-center">
                <Icon className="w-6 h-6 text-violet-500" />
              </div>
              <button onClick={onClose} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <h3 className="text-xl font-bold text-white mb-2">
              {info.title}
            </h3>
            
            <p className="text-zinc-400 text-sm mb-6">
              {info.description}. Upgrade now for unlimited access!
            </p>

            <div className="space-y-3 mb-6">
              {info.benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Zap className="w-4 h-4 text-violet-500 flex-shrink-0" />
                  <span className="text-sm text-zinc-300">{benefit}</span>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <button
                onClick={onSignUp}
                className="w-full bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 text-white font-medium py-3 rounded-xl transition-all duration-200 transform hover:scale-[1.02]"
              >
                Sign Up for Full Access
              </button>
              
              <button
                onClick={onClose}
                className="w-full text-zinc-400 hover:text-zinc-300 text-sm font-medium py-2 transition-colors"
              >
                Maybe later
              </button>
            </div>

            <div className="mt-4 pt-4 border-t border-zinc-700">
              <p className="text-xs text-zinc-500 text-center">
                Quota resets daily at midnight (EAT)
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
