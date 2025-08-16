import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, Video, Lock, Globe, UserCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { startCallFlow, canPerformAction } from '@/lib/api';

interface CallOptionsProps {
  isOpen: boolean;
  onClose: () => void;
  targetUser: {
    id: string;
    username: string;
    displayName: string;
    avatar: string;
    isLive?: boolean;
  };
  onAuthRequired: () => void;
}

type CallType = 'audio' | 'video';
type CallPrivacy = 'private' | 'public' | 'followers';

export default function CallOptions({ 
  isOpen, 
  onClose, 
  targetUser,
  onAuthRequired 
}: CallOptionsProps) {
  const navigate = useNavigate();
  const [callType, setCallType] = useState<CallType>('video');
  const [privacy, setPrivacy] = useState<CallPrivacy>('private');
  const [isStarting, setIsStarting] = useState(false);

  const callTypes = [
    {
      type: 'audio' as CallType,
      icon: Phone,
      title: 'Audio Call',
      description: 'Voice only conversation',
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-500/20',
      iconColor: 'text-green-400'
    },
    {
      type: 'video' as CallType,
      icon: Video,
      title: 'Video Call',
      description: 'Face-to-face conversation',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-500/20',
      iconColor: 'text-blue-400'
    }
  ];

  const privacyOptions = [
    {
      type: 'private' as CallPrivacy,
      icon: Lock,
      title: 'Private',
      description: 'Just you and the creator',
      color: 'text-green-400'
    },
    {
      type: 'public' as CallPrivacy,
      icon: Globe,
      title: 'Public Live',
      description: 'Anyone can join and watch',
      color: 'text-red-400'
    },
    {
      type: 'followers' as CallPrivacy,
      icon: UserCheck,
      title: 'Followers Only',
      description: 'Only followers can join',
      color: 'text-blue-400'
    }
  ];

  const handleStartCall = async () => {
    if (!canPerformAction('call')) {
      onAuthRequired();
      return;
    }

    setIsStarting(true);

    try {
      const { channel } = await startCallFlow(
        targetUser.id,
        callType
      );

      // Navigate to call room
      navigate(`/call/${channel}`, {
        state: {
          type: callType,
          privacy,
          targetUser,
          channel
        }
      });

      onClose();
    } catch (error: any) {
      console.error('Failed to start call:', error);
      
      if (error.message.includes('limit')) {
        onAuthRequired();
      } else {
        // Show error feedback
        // For now, just log - could show toast
        console.error('Call setup failed');
      }
    } finally {
      setIsStarting(false);
    }
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
          className="relative w-full max-w-md bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 rounded-3xl border border-white/10 overflow-hidden"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-white/60" />
          </button>

          {/* Header */}
          <div className="p-6 pb-4 text-center border-b border-white/10">
            <div className="flex items-center justify-center gap-3 mb-4">
              <img 
                src={targetUser.avatar}
                alt={targetUser.displayName}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <h2 className="text-xl font-bold text-white">{targetUser.displayName}</h2>
                <p className="text-white/60 text-sm">@{targetUser.username}</p>
              </div>
            </div>
            {targetUser.isLive && (
              <div className="inline-flex items-center gap-1 bg-red-500 text-white px-2 py-1 rounded-full text-xs">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                LIVE
              </div>
            )}
          </div>

          {/* Call Type Selection */}
          <div className="p-6 pb-4">
            <h3 className="text-white font-semibold mb-6 text-center">Choose call type:</h3>
            <div className="grid grid-cols-2 gap-4 mb-8">
              {callTypes.map((type) => {
                const IconComponent = type.icon;
                return (
                  <button
                    key={type.type}
                    onClick={() => setCallType(type.type)}
                    className={cn(
                      "flex flex-col items-center gap-4 p-6 rounded-3xl border-2 transition-all relative overflow-hidden",
                      callType === type.type
                        ? "border-primary bg-primary/15 shadow-xl"
                        : "border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/30"
                    )}
                  >
                    {/* Background gradient effect */}
                    <div className={cn(
                      "absolute inset-0 opacity-10",
                      `bg-gradient-to-br ${type.color}`
                    )} />

                    <div className={cn(
                      "w-16 h-16 rounded-full flex items-center justify-center relative z-10",
                      type.bgColor
                    )}>
                      <IconComponent className={cn("w-8 h-8", type.iconColor)} />
                    </div>
                    <div className="text-center relative z-10">
                      <div className="text-white font-semibold text-base mb-1">{type.title}</div>
                      <div className="text-white/70 text-sm">{type.description}</div>
                    </div>

                    {/* Selection indicator */}
                    {callType === type.type && (
                      <div className="absolute top-3 right-3 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                        <div className="w-3 h-3 bg-white rounded-full" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Privacy Selection */}
            <h3 className="text-white font-semibold mb-6 text-center">Privacy setting:</h3>
            <div className="space-y-4 mb-8">
              {privacyOptions.map((option) => {
                const IconComponent = option.icon;
                return (
                  <button
                    key={option.type}
                    onClick={() => setPrivacy(option.type)}
                    className={cn(
                      "w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all relative overflow-hidden",
                      privacy === option.type
                        ? "border-primary bg-primary/15 shadow-lg"
                        : "border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/30"
                    )}
                  >
                    <div className={cn("w-12 h-12 rounded-full bg-white/10 flex items-center justify-center", option.color)}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="text-white font-semibold text-base">{option.title}</div>
                      <div className="text-white/70 text-sm">{option.description}</div>
                    </div>
                    {privacy === option.type && (
                      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                        <div className="w-3 h-3 bg-white rounded-full" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Call Duration Estimate for Guests */}
            {privacy === 'private' && (
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 mb-6">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 bg-amber-400 rounded-full" />
                  <span className="text-amber-400 text-sm font-medium">
                    {canPerformAction('call') ? 'Premium Call' : 'Guest Trial'}
                  </span>
                </div>
                <p className="text-amber-400/80 text-xs">
                  {canPerformAction('call') 
                    ? 'Unlimited duration for registered users'
                    : 'Free trial: up to 2 minutes. Sign up for unlimited calls!'
                  }
                </p>
              </div>
            )}

            {/* Start Call Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleStartCall}
              disabled={isStarting}
              className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 disabled:opacity-50 text-white font-semibold py-4 px-6 rounded-xl transition-all"
            >
              {isStarting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Starting {callType} call...
                </div>
              ) : (
                `Start ${callType} call`
              )}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
