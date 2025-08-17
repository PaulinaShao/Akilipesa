import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, Video, Clock, Users, Star, Zap } from 'lucide-react';
import { useUIStore } from '@/state/uiStore';
import { useAuth } from '@/hooks/useAuth';

interface FreeTrialModalProps {
  isOpen: boolean;
  onClose: () => void;
  feature: 'call' | 'video_call';
}

const featureConfig = {
  call: {
    icon: Phone,
    title: 'Make unlimited calls',
    description: 'Connect with creators through high-quality audio calls',
    color: 'from-green-500 to-emerald-500'
  },
  video_call: {
    icon: Video,
    title: 'Start video calls',
    description: 'Have face-to-face conversations with creators',
    color: 'from-blue-500 to-purple-500'
  }
};

export default function FreeTrialModal({ 
  isOpen, 
  onClose, 
  feature 
}: FreeTrialModalProps) {
  const { openAuthSheet } = useUIStore();
  const { user } = useAuth();
  
  const config = featureConfig[feature];
  const IconComponent = config.icon;

  const handleUpgrade = () => {
    onClose();
    if (!user) {
      openAuthSheet(() => {
        // After auth, redirect to upgrade
        window.location.href = '/upgrade-plan';
      }, 'upgrade');
    } else {
      window.location.href = '/upgrade-plan';
    }
  };

  const handleSignIn = () => {
    onClose();
    openAuthSheet(undefined, 'call_access');
  };

  const handleTryFree = () => {
    onClose();
    // Continue with limited trial
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
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-sm bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 rounded-2xl border border-white/10 overflow-hidden"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-4 h-4 text-white/60" />
          </button>

          {/* Header */}
          <div className="p-6 text-center">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.1, type: 'spring', damping: 20 }}
              className="mb-4"
            >
              <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-br ${config.color} flex items-center justify-center`}>
                <IconComponent className="w-8 h-8 text-white" />
              </div>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl font-bold text-white mb-2"
            >
              {config.title}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-white/60 text-sm mb-6"
            >
              {config.description}
            </motion.p>
          </div>

          {/* Free plan limitations */}
          <div className="px-6 mb-6">
            <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4">
              <h3 className="text-orange-300 font-medium mb-3 text-sm flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Free Plan Limits
              </h3>
              <div className="space-y-2 text-xs text-orange-200/80">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-orange-400 rounded-full" />
                  <span>5 minutes per call</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-orange-400 rounded-full" />
                  <span>3 calls per day</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-orange-400 rounded-full" />
                  <span>Audio only (no video)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Upgrade benefits */}
          <div className="px-6 mb-6">
            <div className="bg-violet-500/10 border border-violet-500/20 rounded-xl p-4">
              <h3 className="text-violet-300 font-medium mb-3 text-sm flex items-center gap-2">
                <Star className="w-4 h-4" />
                Upgrade Benefits
              </h3>
              <div className="space-y-2 text-xs text-violet-200/80">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-violet-400 rounded-full" />
                  <span>Unlimited call duration</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-violet-400 rounded-full" />
                  <span>HD video calls</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-violet-400 rounded-full" />
                  <span>Group calls up to 50 people</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-violet-400 rounded-full" />
                  <span>Screen sharing & recording</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="px-6 pb-6 space-y-3">
            {!user ? (
              <>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSignIn}
                  className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-semibold py-3 px-4 rounded-xl transition-all"
                >
                  Sign in to continue
                </motion.button>
                
                <button
                  onClick={onClose}
                  className="w-full text-white/60 hover:text-white text-sm py-2 transition-colors"
                >
                  Maybe later
                </button>
              </>
            ) : (
              <>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleUpgrade}
                  className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-semibold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <Zap className="w-4 h-4" />
                  Upgrade now
                </motion.button>
                
                <button
                  onClick={handleTryFree}
                  className="w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium py-3 px-4 rounded-xl transition-all"
                >
                  Try with limits
                </button>
                
                <button
                  onClick={onClose}
                  className="w-full text-white/60 hover:text-white text-sm py-2 transition-colors"
                >
                  Not now
                </button>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
