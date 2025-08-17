import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle, Heart, Star, Sparkles } from 'lucide-react';
import { useUIStore } from '@/state/uiStore';

interface JoinConversationModalProps {
  isOpen: boolean;
  onClose: () => void;
  trigger?: 'like' | 'comment' | 'follow';
}

const triggerConfig = {
  like: {
    icon: Heart,
    color: 'from-red-500 to-pink-500',
    primaryBenefit: 'Save your likes and get personalized recommendations'
  },
  comment: {
    icon: MessageCircle,
    color: 'from-blue-500 to-cyan-500',
    primaryBenefit: 'Join discussions and connect with creators'
  },
  follow: {
    icon: Star,
    color: 'from-yellow-500 to-orange-500',
    primaryBenefit: 'Never miss content from your favorite creators'
  }
};

export default function JoinConversationModal({ 
  isOpen, 
  onClose, 
  trigger = 'comment' 
}: JoinConversationModalProps) {
  const { openAuthSheet } = useUIStore();
  
  const config = triggerConfig[trigger];
  const IconComponent = config.icon;

  const handleSignUp = () => {
    onClose();
    openAuthSheet(undefined, 'join_conversation');
  };

  const handleNotNow = () => {
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
          onClick={handleNotNow}
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
            onClick={handleNotNow}
            className="absolute top-4 right-4 z-10 p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-4 h-4 text-white/60" />
          </button>

          {/* Header with icon */}
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
              className="text-xl font-bold text-white mb-3"
            >
              Join the conversation
            </motion.h2>

            {/* Benefits bullets */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-2 mb-6"
            >
              <div className="flex items-center gap-3 text-left">
                <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0" />
                <span className="text-white/80 text-sm">{config.primaryBenefit}</span>
              </div>
              <div className="flex items-center gap-3 text-left">
                <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0" />
                <span className="text-white/80 text-sm">Earn money from your content</span>
              </div>
              <div className="flex items-center gap-3 text-left">
                <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0" />
                <span className="text-white/80 text-sm">Access to exclusive features & AI tools</span>
              </div>
            </motion.div>
          </div>

          {/* Actions */}
          <div className="px-6 pb-6 space-y-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSignUp}
              className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-semibold py-3 px-4 rounded-xl transition-all"
            >
              Sign up / Continue
            </motion.button>

            <button
              onClick={handleNotNow}
              className="w-full text-white/60 hover:text-white text-sm py-2 transition-colors"
            >
              Not now
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
