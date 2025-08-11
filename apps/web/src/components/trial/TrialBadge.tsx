import React from 'react';
import { useTrialStore } from '../../state/trialStore';
import { useAppStore } from '../../store';

export const TrialBadge: React.FC = () => {
  const { user } = useAppStore();
  const { config, getRemainingQuota, isInHappyHour } = useTrialStore();

  // Don't show for authenticated users
  if (user || !config?.enabled) {
    return null;
  }

  const chatRemaining = getRemainingQuota('chat');
  const callsRemaining = getRemainingQuota('call');
  const reactionsRemaining = getRemainingQuota('reaction');

  // Don't show if no quotas left
  if (chatRemaining === 0 && callsRemaining === 0 && reactionsRemaining === 0) {
    return null;
  }

  // Show happy hour status if required but not in window
  if (config.requireHappyHour && !isInHappyHour) {
    return (
      <div className="fixed top-4 left-4 z-50 max-w-xs">
        <div className="bg-zinc-900/95 backdrop-blur-sm border border-orange-500/30 rounded-lg px-3 py-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-orange-400 font-medium">
              Trial calls during happy hours only
            </span>
          </div>
        </div>
      </div>
    );
  }

  const hasActiveQuotas = chatRemaining > 0 || callsRemaining > 0 || reactionsRemaining > 0;

  if (!hasActiveQuotas) {
    return null;
  }

  return (
    <div className="fixed top-4 left-4 z-50 max-w-xs">
      <div className="bg-zinc-900/95 backdrop-blur-sm border border-violet-500/30 rounded-lg px-3 py-2 shadow-lg">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 bg-violet-500 rounded-full"></div>
          <span className="text-xs text-violet-400 font-medium uppercase tracking-wide">
            Guest Trial
          </span>
        </div>
        
        <div className="space-y-1">
          {callsRemaining > 0 && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-400">Calls</span>
              <span className="text-white font-medium">{callsRemaining} left</span>
            </div>
          )}
          
          {chatRemaining > 0 && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-400">AI Chat</span>
              <span className="text-white font-medium">{chatRemaining} left</span>
            </div>
          )}
          
          {reactionsRemaining > 0 && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-400">Reactions</span>
              <span className="text-white font-medium">{reactionsRemaining} left</span>
            </div>
          )}
        </div>
        
        <div className="mt-2 pt-2 border-t border-zinc-700">
          <button
            onClick={() => {
              // This will be handled by the auth gating system
              document.dispatchEvent(new CustomEvent('openAuthSheet'));
            }}
            className="text-xs text-violet-400 hover:text-violet-300 transition-colors"
          >
            Sign up for unlimited access →
          </button>
        </div>
      </div>
    </div>
  );
};
