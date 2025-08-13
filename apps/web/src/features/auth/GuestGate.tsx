import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Heart, MessageCircle, Phone, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUIStore } from '@/state/uiStore';
import { Trial } from '@/state/guestTrialStore';
import { cn } from '@/lib/utils';

interface GuestGateProps {
  trigger?: 'like' | 'comment' | 'follow' | 'call' | 'job' | 'chat' | 'time' | 'interaction';
  onClose?: () => void;
  onAuth?: () => void;
  autoShow?: boolean;
  showAfterSeconds?: number;
}

const TRIGGER_MESSAGES = {
  like: 'Save your likes and see who liked your content',
  comment: 'Join conversations and build your community',
  follow: 'Follow creators and get notified of new content',
  call: 'Make unlimited calls to creators and earn rewards',
  job: 'Create unlimited AI content and showcase your work',
  chat: 'Chat with creators and get personalized responses',
  time: 'Unlock more with AkiliPesa and join the creator economy',
  interaction: 'Continue your journey with AkiliPesa',
};

const BENEFITS = [
  {
    icon: Heart,
    title: 'Save & Organize',
    description: 'Save likes, follows, and purchases across devices',
  },
  {
    icon: MessageCircle,
    title: 'Connect & Chat',
    description: 'Message creators directly and join communities',
  },
  {
    icon: Phone,
    title: 'Video Calls',
    description: 'Talk face-to-face with your favorite creators',
  },
  {
    icon: Sparkles,
    title: 'AI Creation',
    description: 'Generate unlimited content with AI tools',
  },
  {
    icon: Star,
    title: 'Earn Rewards',
    description: 'Get paid for content, referrals, and engagement',
  },
];

export default function GuestGate({ 
  trigger = 'interaction', 
  onClose, 
  onAuth,
  autoShow = false,
  showAfterSeconds = 3 
}: GuestGateProps) {
  const [isVisible, setIsVisible] = useState(!autoShow);
  const [currentBenefit, setCurrentBenefit] = useState(0);
  const navigate = useNavigate();
  const { openAuthSheet, setAuthIntent } = useUIStore();

  // Auto-show after delay
  useEffect(() => {
    if (autoShow) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, showAfterSeconds * 1000);

      return () => clearTimeout(timer);
    }
  }, [autoShow, showAfterSeconds]);

  // Rotate benefits every 3 seconds
  useEffect(() => {
    if (isVisible) {
      const interval = setInterval(() => {
        setCurrentBenefit((prev) => (prev + 1) % BENEFITS.length);
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [isVisible]);

  const handleContinueWithPhone = () => {
    setAuthIntent(trigger);
    openAuthSheet();
    handleClose();
    onAuth?.();
  };

  const handleContinueWithGoogle = () => {
    setAuthIntent(trigger);
    openAuthSheet();
    handleClose();
    onAuth?.();
  };

  const handleMaybeLater = () => {
    handleClose();
  };

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  const trialStatus = Trial.getUsageStatus();
  const message = TRIGGER_MESSAGES[trigger] || TRIGGER_MESSAGES.interaction;

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={handleClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-md bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 rounded-3xl border border-primary/20 overflow-hidden"
        >
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-10 p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-white/60" />
          </button>

          {/* Header with sparkle effect */}
          <div className="relative p-6 pb-4 text-center">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10" />
            
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', damping: 20 }}
              className="relative"
            >
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-bold text-white mb-2"
            >
              Unlock more with AkiliPesa
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-white/80 text-sm leading-relaxed"
            >
              {message}
            </motion.p>
          </div>

          {/* Benefits carousel */}
          <div className="px-6 py-4">
            <div className="bg-white/5 rounded-2xl p-4 mb-6 h-20 flex items-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentBenefit}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center">
                    <BENEFITS[currentBenefit].icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium text-sm">
                      {BENEFITS[currentBenefit].title}
                    </h3>
                    <p className="text-white/60 text-xs">
                      {BENEFITS[currentBenefit].description}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Progress dots */}
            <div className="flex justify-center gap-2 mb-6">
              {BENEFITS.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentBenefit(index)}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all duration-300",
                    index === currentBenefit 
                      ? "bg-primary w-8" 
                      : "bg-white/20 hover:bg-white/40"
                  )}
                />
              ))}
            </div>
          </div>

          {/* Trial status */}
          <div className="px-6 mb-6">
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                <span className="text-yellow-400 text-sm font-medium">Guest Trial Status</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="text-center">
                  <div className="text-white/60">Calls</div>
                  <div className="text-white">
                    {trialStatus.calls.used}/{trialStatus.calls.limit}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-white/60">Chats</div>
                  <div className="text-white">
                    {trialStatus.chats.used}/{trialStatus.chats.limit}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-white/60">AI Jobs</div>
                  <div className="text-white">
                    {trialStatus.jobs.used}/{trialStatus.jobs.limit}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="px-6 pb-6 space-y-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleContinueWithPhone}
              className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-semibold py-3 px-4 rounded-xl transition-all"
            >
              Continue with Phone
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleContinueWithGoogle}
              className="w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold py-3 px-4 rounded-xl transition-all"
            >
              Continue with Google
            </motion.button>

            <button
              onClick={handleMaybeLater}
              className="w-full text-white/60 hover:text-white text-sm py-2 transition-colors"
            >
              Maybe later
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

// Hook for showing guest gate with various triggers
export function useGuestGate() {
  const [showGate, setShowGate] = useState(false);
  const [trigger, setTrigger] = useState<GuestGateProps['trigger']>('interaction');

  const showGuestGate = (triggerType: GuestGateProps['trigger'] = 'interaction') => {
    setTrigger(triggerType);
    setShowGate(true);
  };

  const hideGuestGate = () => {
    setShowGate(false);
  };

  return {
    showGate,
    trigger,
    showGuestGate,
    hideGuestGate,
    GuestGateComponent: showGate ? (
      <GuestGate 
        trigger={trigger} 
        onClose={hideGuestGate}
      />
    ) : null
  };
}