import React, { useState, useEffect } from 'react';
import { Clock, MessageCircle, Phone, Heart, ChevronDown, ChevronUp } from 'lucide-react';
import { useTrialStore } from '../../state/trialStore';
import { useAppStore } from '../../store';
import { cn } from '../../lib/utils';

export const TrialBadge: React.FC = () => {
  // All hooks must be called before any early returns
  const { user } = useAppStore();
  const {
    config,
    usage,
    canUseFeature,
    getRemainingQuota,
    isHappyHour,
    nextHappyHour,
    getTrialProgress
  } = useTrialStore();

  const [isExpanded, setIsExpanded] = useState(false);
  const [nextHappyTime, setNextHappyTime] = useState('');

  // Update happy hour countdown
  useEffect(() => {
    if (nextHappyHour > 0) {
      const interval = setInterval(() => {
        const remaining = nextHappyHour - Date.now();
        if (remaining > 0) {
          const hours = Math.floor(remaining / (60 * 60 * 1000));
          const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
          setNextHappyTime(hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`);
        } else {
          setNextHappyTime('');
        }
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [nextHappyHour]);

  const progress = getTrialProgress();
  const hasQuotaLeft = canUseFeature('chat') || canUseFeature('call') || canUseFeature('reaction');

  // Hide badge if user is authenticated
  if (user) return null;

  // Hide if no config or trial disabled
  if (!config || !config.enabled || !usage) return null;

  // Compact badge when collapsed
  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className={cn(
          "fixed top-16 right-4 z-40 px-3 py-2 rounded-full text-xs font-medium transition-all duration-200",
          "border backdrop-blur-sm flex items-center gap-2 hover:scale-105",
          hasQuotaLeft 
            ? "bg-violet-500/10 border-violet-400/30 text-violet-300"
            : "bg-amber-500/10 border-amber-400/30 text-amber-300"
        )}
      >
        <span className="text-xs">
          {hasQuotaLeft ? '🎁 Trial' : '⏰ Trial'}
        </span>
        <div className="flex items-center gap-1 text-[10px]">
          <MessageCircle className="w-3 h-3" />
          <span>{getRemainingQuota('chat')}</span>
          <Phone className="w-3 h-3 ml-1" />
          <span>{getRemainingQuota('call')}</span>
          <Heart className="w-3 h-3 ml-1" />
          <span>{getRemainingQuota('reaction')}</span>
        </div>
        <ChevronDown className="w-3 h-3" />
      </button>
    );
  }

  // Expanded badge with full details
  return (
    <div className="fixed top-16 right-4 z-40 bg-black/90 border border-violet-500/30 rounded-lg text-xs text-white max-w-xs backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-violet-500/20">
        <div className="flex items-center gap-2">
          <span className="text-violet-400">🎁</span>
          <span className="font-semibold text-violet-300">Guest Trial</span>
        </div>
        <button
          onClick={() => setIsExpanded(false)}
          className="text-zinc-400 hover:text-white transition-colors"
        >
          <ChevronUp className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      <div className="p-3 space-y-3">
        {/* Happy Hour Status */}
        {config.requireHappyHour && (
          <div className={cn(
            "p-2 rounded-lg border",
            isHappyHour 
              ? "bg-green-500/10 border-green-400/30"
              : "bg-amber-500/10 border-amber-400/30"
          )}>
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-3 h-3" />
              <span className="font-medium">
                {isHappyHour ? 'Happy Hour Active!' : 'Happy Hour'}
              </span>
            </div>
            <p className="text-[10px] text-zinc-400">
              {isHappyHour 
                ? 'Trial features are available now'
                : `Next window: ${nextHappyTime}`
              }
            </p>
          </div>
        )}

        {/* Quota Display */}
        <div className="space-y-2">
          <div className="text-zinc-400 mb-2">Remaining Today:</div>
          
          {/* Chat */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-3 h-3 text-blue-400" />
              <span>AI Chat</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-16 h-1 bg-zinc-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-400 transition-all"
                  style={{ width: `${(1 - progress.chat) * 100}%` }}
                />
              </div>
              <span className={cn(
                "text-xs",
                canUseFeature('chat') ? 'text-blue-400' : 'text-zinc-500'
              )}>
                {getRemainingQuota('chat')}
              </span>
            </div>
          </div>

          {/* Calls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Phone className="w-3 h-3 text-green-400" />
              <span>Video Calls</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-16 h-1 bg-zinc-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-400 transition-all"
                  style={{ width: `${(1 - progress.calls) * 100}%` }}
                />
              </div>
              <span className={cn(
                "text-xs",
                canUseFeature('call') ? 'text-green-400' : 'text-zinc-500'
              )}>
                {getRemainingQuota('call')}
              </span>
            </div>
          </div>

          {/* Reactions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="w-3 h-3 text-pink-400" />
              <span>Reactions</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-16 h-1 bg-zinc-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-pink-400 transition-all"
                  style={{ width: `${(1 - progress.reactions) * 100}%` }}
                />
              </div>
              <span className={cn(
                "text-xs",
                canUseFeature('reaction') ? 'text-pink-400' : 'text-zinc-500'
              )}>
                {getRemainingQuota('reaction')}
              </span>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        {!hasQuotaLeft && (
          <div className="pt-2 border-t border-zinc-700">
            <p className="text-zinc-400 text-[10px] mb-2">
              Trial quota used. Sign up for unlimited access!
            </p>
            <button 
              onClick={() => {
                // This will trigger the auth sheet
                const event = new CustomEvent('showAuthSheet', { 
                  detail: { reason: 'trial_exhausted' }
                });
                window.dispatchEvent(event);
              }}
              className="w-full bg-violet-600 hover:bg-violet-700 text-white text-xs py-2 px-3 rounded-lg transition-colors"
            >
              Sign Up for Free
            </button>
          </div>
        )}

        {/* Info */}
        <div className="text-[10px] text-zinc-500 text-center">
          Resets daily • No credit card required
        </div>
      </div>
    </div>
  );
};
