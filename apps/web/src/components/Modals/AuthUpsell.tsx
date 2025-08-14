import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Star, Heart, MessageCircle, Phone, Video } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Trial } from '@/state/guestTrialStore';

interface AuthUpsellProps {
  isOpen: boolean;
  onClose: () => void;
  trigger?: 'like' | 'comment' | 'follow' | 'call' | 'shop' | 'create' | 'general';
  title?: string;
  description?: string;
}

const triggerConfig = {
  like: {
    icon: Heart,
    title: 'Save your likes',
    description: 'Keep track of content you love and get personalized recommendations',
    color: 'from-red-500 to-pink-500'
  },
  comment: {
    icon: MessageCircle,
    title: 'Join the conversation',
    description: 'Comment on posts and connect with creators directly',
    color: 'from-blue-500 to-cyan-500'
  },
  follow: {
    icon: Star,
    title: 'Follow creators',
    description: 'Never miss content from your favorite creators',
    color: 'from-yellow-500 to-orange-500'
  },
  call: {
    icon: Phone,
    title: 'Connect with creators',
    description: 'Make unlimited audio and video calls to creators',
    color: 'from-green-500 to-emerald-500'
  },
  shop: {
    icon: Sparkles,
    title: 'Shop & earn',
    description: 'Buy products and earn commissions by sharing',
    color: 'from-purple-500 to-violet-500'
  },
  create: {
    icon: Video,
    title: 'Create unlimited content',
    description: 'Upload videos, go live, and use AI tools without limits',
    color: 'from-indigo-500 to-blue-500'
  },
  general: {
    icon: Sparkles,
    title: 'Unlock AkiliPesa',
    description: 'Get full access to all features and start earning',
    color: 'from-primary to-secondary'
  }
};

export default function AuthUpsell({ 
  isOpen, 
  onClose, 
  trigger = 'general',
  title,
  description 
}: AuthUpsellProps) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const config = triggerConfig[trigger];
  const IconComponent = config.icon;
  const trialStatus = Trial.getUsageStatus();

  const handleContinueWithPhone = () => {
    setIsLoading(true);
    navigate('/login?method=phone');
    onClose();
  };

  const handleContinueWithGoogle = () => {
    setIsLoading(true);
    navigate('/login?method=google');
    onClose();
  };

  const handleMaybeLater = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={handleMaybeLater}
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
            onClick={handleMaybeLater}
            className="absolute top-4 right-4 z-10 p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-white/60" />
          </button>

          {/* Header with animated icon */}
          <div className="relative p-6 pb-4 text-center">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10" />
            
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: 'spring', damping: 20 }}
              className="relative"
            >
              <div className={cn(
                "w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center",
                `bg-gradient-to-br ${config.color}`
              )}>
                <IconComponent className="w-10 h-10 text-white" />
              </div>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-bold text-white mb-2"
            >
              {title || config.title}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-white/80 text-sm leading-relaxed"
            >
              {description || config.description}
            </motion.p>
          </div>

          {/* Trial Status */}
          <div className="px-6 py-4">
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
                <span className="text-amber-400 text-sm font-medium">Guest Trial Status</span>
              </div>
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="text-center">
                  <div className="text-white/60 mb-1">Calls</div>
                  <div className="text-white font-medium">
                    {trialStatus.calls.used}/{trialStatus.calls.limit}
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-1 mt-1">
                    <div 
                      className="bg-amber-400 h-1 rounded-full transition-all"
                      style={{ width: `${(trialStatus.calls.used / trialStatus.calls.limit) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-white/60 mb-1">Chats</div>
                  <div className="text-white font-medium">
                    {trialStatus.chats.used}/{trialStatus.chats.limit}
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-1 mt-1">
                    <div 
                      className="bg-amber-400 h-1 rounded-full transition-all"
                      style={{ width: `${(trialStatus.chats.used / trialStatus.chats.limit) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-white/60 mb-1">AI Jobs</div>
                  <div className="text-white font-medium">
                    {trialStatus.jobs.used}/{trialStatus.jobs.limit}
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-1 mt-1">
                    <div 
                      className="bg-amber-400 h-1 rounded-full transition-all"
                      style={{ width: `${(trialStatus.jobs.used / trialStatus.jobs.limit) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Benefits preview */}
            <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 mb-6">
              <h3 className="text-primary font-medium mb-3 text-sm">With an account you get:</h3>
              <div className="space-y-2 text-xs text-white/80">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                  <span>Unlimited likes, comments, and follows</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                  <span>Video calls up to 60 minutes</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                  <span>AI content creation & tools</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                  <span>Earn money from referrals & sales</span>
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
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 disabled:opacity-50 text-white font-semibold py-3 px-4 rounded-xl transition-all"
            >
              {isLoading ? 'Redirecting...' : 'Continue with Phone'}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleContinueWithGoogle}
              disabled={isLoading}
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
